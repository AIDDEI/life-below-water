import * as PIXI from "pixi.js";
import { FederatedPointerEvent } from "pixi.js";
import { DrawModel } from "./DrawModel";
import { Game } from "../game";

export class DrawableCanvas extends PIXI.Container {
	private graphics: PIXI.Graphics;
	private _isDrawing: boolean;
	private _lastPosition: PIXI.Point;
	private game: any;
	private w: number;
	private h: number;
	private model: DrawModel;
	private cb: any;

	constructor(
		game: Game,
		cb: any,
		model: DrawModel,
		width: number = 2400,
		height: number = 600
	) {
		super();
		this.game = game;
		this.model = model;
		this.cb = cb;
		this.graphics = new PIXI.Graphics();
		this.addChild(this.graphics);
		this.w = width;
		this.h = height;
		this.graphics.hitArea = new PIXI.Rectangle(0, 0, this.w, this.h);
		this._isDrawing = false;
		this._lastPosition = new PIXI.Point();
		this.eventMode = "static";
		this.on("pointerdown", this.onPointerDown, this);
		this.on("pointermove", this.onPointerMove, this);
		this.on("pointerup", this.onPointerUp, this);
		this.on("pointerupoutside", this.onPointerUp, this);
	}

	private onPointerDown(event: FederatedPointerEvent): void {
		this._isDrawing = true;
		this._lastPosition.copyFrom(event.global);
	}

	private onPointerMove(event: FederatedPointerEvent): void {
		if (this._isDrawing) {
			// new smooth rounded line will be drawn
			const newPosition = event.global;
			this.graphics.lineTextureStyle({
				width: 10,
				color: 0x000000,
				alpha: 1,
				alignment: 0.5,
				cap: PIXI.LINE_CAP.ROUND,
				join: PIXI.LINE_JOIN.ROUND,
			});

			// draw line, take position into account
			this.graphics.moveTo(
				this._lastPosition.x - this.x,
				this._lastPosition.y - this.y
			);
			this.graphics.lineTo(newPosition.x - this.x, newPosition.y - this.y);

			this.graphics.endFill();

			this._lastPosition.copyFrom(newPosition);
		}
	}

	public onPointerUp(): void {
		this._isDrawing = false;

		this.cb();
		this.graphics.clear();
	}

	public async predictDrawing(): Promise<string> {
		if (!this.model) {
			console.error("No model to predict from!");
			return "";
		}

		const canvas = await this.getDrawing();
		if (!canvas) {
			console.error("No canvas found, please alert the developers!");
			return "";
		}

		const result = await this.model.predict(canvas);
		return result;
	}

	public async getDrawing(): Promise<HTMLCanvasElement | undefined> {
		// for await (const object of this.minigame.players) {
		let image = await this.game.pixi.renderer.extract.image(this.graphics);

		// create canvas to make it compatible for the model
		let canvas = document.createElement("canvas");
		canvas.width = 60;
		canvas.height = 60;
		let ctx = canvas.getContext("2d");

		if (!ctx) return;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, 0, 0, 60, 60);

		canvas.remove();

		return canvas;
	}

	public objectInsideDrawing(objectPos: PIXI.Rectangle): boolean {
		if (!objectPos) return false;

		return (
			this._lastPosition.x > objectPos.x &&
			this._lastPosition.x < objectPos.x + objectPos.width &&
			this._lastPosition.y > objectPos.y &&
			this._lastPosition.y < objectPos.y + objectPos.height
		);
	}
}

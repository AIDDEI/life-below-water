import * as PIXI from "pixi.js";
import { FederatedPointerEvent } from "pixi.js";
import { AlgaeGame } from "./AlgaeGame";
import { DrawModel } from "./DrawModel";
import { Game } from "./game";

export class DrawableCanvas extends PIXI.Container {
	private graphics: PIXI.Graphics;
	private _isDrawing: boolean;
	private _lastPosition: PIXI.Point;
	private game: any;
	private _model: DrawModel;
	private w: number;
	private h: number;
	minigame: AlgaeGame;
	cb: any;
	constructor(game: Game, minigame: any, cb: any, width: number = 2400, height: number = 600) {
		super();
		this.game = game;
		this.minigame = minigame;
		this.cb = cb;
		this._model = new DrawModel();
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
			this.graphics.lineTextureStyle({ width: 10, color: 0x000000, alpha: 1, alignment: 0.5, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND });
			this.graphics.moveTo(this._lastPosition.x, this._lastPosition.y);
			this.graphics.lineTo(newPosition.x, newPosition.y);

			this.graphics.endFill();

			this._lastPosition.copyFrom(newPosition);
		}
	}

	public async onPointerUp(): Promise<Object | undefined> {
		this._isDrawing = false;
		const result = await this._checkDrawing();

		if (!result) return;

		this.cb(result);
	}

	private async _checkDrawing(): Promise<Object | undefined> {
		for await (const object of this.minigame.players) {
			const objectPos = object.getBounds();
			if (!object.missed && this._objectInside(objectPos)) {
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

				const result = await this._model.predict(canvas);

				// Remove canvas, move player and break loop (we only care about the first)
				canvas.remove();
				this.graphics.clear();

				return { result, object };
			}
		}

		// clear the drawing
		this.graphics.clear();
	}

	private _objectInside(objectPos: PIXI.Rectangle): boolean {
		return this._lastPosition.x > objectPos.x && this._lastPosition.x < objectPos.x + objectPos.width && this._lastPosition.y > objectPos.y && this._lastPosition.y < objectPos.y + objectPos.height;
	}
}

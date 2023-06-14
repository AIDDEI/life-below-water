import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Button } from "./Button";
import { DrawableCanvas } from "./DrawableCanvas";
import { DrawModel } from "./DrawModel";
import { Game } from "./game";

export class AlgaeGameTutorial extends Container {
	private cb: () => void;
	private game: Game;
	private bg: Graphics;
	private button: Button;
	private instructions: string;

	constructor(game: Game, cb: () => void, assets: any, model: DrawModel, instructions: string) {
		super();
		this.x = 0;
		this.y = 0;
		this.cb = cb;
		this.assets = assets;
		this.instructions = instructions;
		this.model = model;
		this.bg = new Graphics();
		this.game = game;
		this.zIndex = 3;
		this.eventMode = "static";
		this._setupUI();
		this.steps = ["Triangle", "Circle", "Square"];
	}

	private _setupUI() {
		// black bg
		this.bg.beginFill(0x000000);
		this.bg.drawRect(0, 0, this.game.pixi.screen.width, this.game.pixi.screen.height);
		this.bg.endFill();
		this.bg.alpha = 0.6;
		this.addChild(this.bg);

		// white container
		this.content = new Graphics();
		this.content.beginFill(0xffffff);
		this.content.drawRect(0, 0, this.game.pixi.screen.width - 100, this.game.pixi.screen.height - 100);
		this.content.endFill();
		this.content.position.set(50, 50);
		this.addChild(this.content);

		// text
		const text = new Text(this.instructions, {
			fontSize: 20,
			fill: "black",
			wordWrap: true,
			wordWrapWidth: this.game.pixi.screen.width - 200,
		});
		text.position.set(30, 30);
		this.content.addChild(text);

		const uitleg = new Sprite(this.assets.algaes);
		uitleg.scale.set(0.25);
		uitleg.position.set(this.content.width - uitleg.width, this.content.height - uitleg.height - 50);
		this.content.addChild(uitleg);

		// button
		this.button = new Button(50, "Start oefening", 0xffbd01, 0x336699, () => {
			this.content.removeChildren();
			this.nextStep();
		});

		this.button.position.set(this.x + 30, this.content.height - this.button.height - 25);
		this.content.addChild(this.button);
	}

	private nextStep() {
		// button
		this.button = new Button(50, "Begin minigame", 0xffbd01, 0x336699, () => {
			this.cb();
			this.visible = false;
		});

		this.button.position.set(this.x + 30, this.content.height - this.button.height - 25);
		this.content.addChild(this.button);

		this.drawableCanvas = new DrawableCanvas(
			this.game,
			() => {
				this.test();
			},
			250,
			250
		);

		this.drawableCanvas.position.set(75, 75);
		const drawableCanvasBg = new Graphics();
		drawableCanvasBg.beginFill(0xc9c9c9);

		// dynamic doesnt work so hardcoded to match the canvas size and position
		drawableCanvasBg.drawRect(75, 75, 250, 250);
		drawableCanvasBg.endFill();

		this.addChild(drawableCanvasBg, this.drawableCanvas);

		const uitleg = new Sprite(this.assets.algenExplenation);
		uitleg.scale.set(0.25);
		uitleg.position.set(this.content.width - uitleg.width - 20, 10);
		this.content.addChild(uitleg);
	}

	private async test() {
		console.log("test");

		const canvas = await this.drawableCanvas.getDrawing();
		const result = await this.model.predict(canvas);
		console.log(result);
	}
	/**
	 * Show the rules
	 *
	 * @param cb - callback function to run when player clicks the button (used to continue the game)
	 */
	public show(cb: () => void) {
		this.button.label = "Verder gaan";
		this.button.clickHandler = () => {
			this.visible = false;
			cb();
		};

		this.button.position.set(this.x + this.button.width / 2, this.height - this.button.height - 75);

		this.visible = true;
	}
}

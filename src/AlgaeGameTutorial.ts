import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Button } from "./Button";
import { DrawableCanvas } from "./DrawableCanvas";
import { DrawModel } from "./DrawModel";
import { Game } from "./game";

// import sounds
import wrongShapeSound from "url:./music/wrongShape.mp3";
import collectSound from "url:./music/collect.mp3";
import { Sfx } from "./Sfx";

export class AlgaeGameTutorial extends Container {
	private cb: () => void;
	private game: Game;
	private bg: Graphics;
	private button: Button;
	private instructions: string;
	private content: any;
	private model: DrawModel;
	private assets: any;
	private drawableCanvas: DrawableCanvas;
	private canvasContainer: any;
	private _objectives: { label: string; value: string }[];
	private _currentStep: number;
	private _objectiveText: Text;
	private predictionText: Text;
	private correctShapeSound: Sfx;
	private wrongShapeSound: Sfx;

	constructor(game: Game, cb: () => void, assets: any, model: DrawModel, instructions: string) {
		super();
		this.x = 0;
		this.y = 0;
		this.cb = cb;
		this.instructions = instructions;
		this.model = model;
		this.game = game;
		this.zIndex = 3;
		this.eventMode = "static";

		// init sounds and assets
		this.assets = assets;
		this.wrongShapeSound = new Sfx(wrongShapeSound, 0.75);
		this.correctShapeSound = new Sfx(collectSound, 0.75);

		this._currentStep = 0;
		this._objectives = [
			{ label: "Cirkel", value: "circle" },
			{ label: "Vierkant", value: "square" },
			{ label: "Driehoek", value: "triangle" },
		];

		this._setupUI();
	}

	private _setupUI() {
		// black bg

		this.bg = new Graphics();
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

		this._firstStep();
	}

	private _firstStep() {
		// text
		const text = new Text(this.instructions, {
			fontSize: 18,
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
			this._secondStep();
		});

		this.button.position.set(this.x + 30, this.content.height - this.button.height - 25);
		this.content.addChild(this.button);
	}

	private _previousStep() {
		this.content.removeChildren();
		this.canvasContainer.removeChildren();

		this._firstStep();
	}

	private _secondStep() {
		const prevButton = new Button(50, "Vorige stap", 0xffbd01, 0x336699, () => {
			this._previousStep();
		});
		prevButton.position.set(this.x + 30, this.content.height - prevButton.height - 25);

		this.content.addChild(prevButton);

		const uitleg = new Sprite(this.assets.algenExplenation);
		uitleg.scale.set(0.2);
		uitleg.position.set(this.content.width - uitleg.width - 20, 10);

		const tips = ["TIP 1: Zorg dat je het figuur binnen de alg tekent, en niet eromheen.", "TIP 2: Zorg dat je scherpe hoeken tekent, zodat de vorm goed herkend wordt door het algoritme."];

		for (const tip of tips) {
			const text = new Text(tip, {
				fontSize: 15,
				wordWrap: true,
				wordWrapWidth: 350,
				fill: "black",
			});

			// y is 50 apart
			text.position.set(15, tips.indexOf(tip) * 75 + 30);
			this.content.addChild(text);
		}

		this.content.addChild(uitleg);

		// init drawable canvas
		this.canvasContainer = new Container();
		this.drawableCanvas = new DrawableCanvas(
			this.game,
			() => {
				this._predict();
			},
			this.model,
			400,
			250
		);

		this.drawableCanvas.position.set(this.x + this.content.width - 375, this.content.height - 225);

		// set background so it's clear where the player can draw
		const drawableCanvasBg = new Graphics();
		drawableCanvasBg.beginFill(0xc9c9c9);

		// dynamic doesnt work so hardcoded to match the canvas size and position
		drawableCanvasBg.drawRect(this.x + this.content.width - 375, this.content.height - 225, 400, 250);
		drawableCanvasBg.endFill();

		this.canvasContainer.addChild(drawableCanvasBg, this.drawableCanvas);

		this.predictionText = new Text("De eerste voorspelling duurt een paar secondes!", {
			fontSize: 20,
			fill: "black",
		});

		// set in the middle of drawableCanvasBg
		this.predictionText.position.set(this.x + this.content.width - 375 + 200 - this.predictionText.width / 2, this.content.height - 255);

		this.canvasContainer.addChild(this.predictionText);

		this.addChild(this.canvasContainer);

		// init objective text
		const objectiveDescription = new Text("Teken nu een:", {
			fontSize: 36,
			fill: "black",
		});

		objectiveDescription.position.set(30, this.drawableCanvas.y + this.drawableCanvas.height / 2 - objectiveDescription.height / 2);

		this._objectiveText = new Text(this._objectives[this._currentStep].label, {
			fontSize: 48,
			fill: "black",
			fontWeight: "bold",
		});

		this._objectiveText.position.set(30, objectiveDescription.y + objectiveDescription.height + 10);

		this.content.addChild(objectiveDescription, this._objectiveText);
	}

	private async _predict() {
		const result = await this.drawableCanvas.predictDrawing();

		if (result.toLowerCase() === this._objectives[this._currentStep].value) {
			this.correctShapeSound.playSFX();

			// if last step, destroy and start game
			if (this._currentStep === this._objectives.length - 1) {
				this.destroy();
				this.cb();
				return;
			}

			this._currentStep++;
			this._objectiveText.text = this._objectives[this._currentStep].label;
		} else {
			this.wrongShapeSound.playSFX();
		}

		// translate result to dutch
		let label;
		switch (result.toLowerCase()) {
			case "circle":
				label = "Cirkel";
				break;
			case "square":
				label = "Vierkant";
				break;
			case "triangle":
				label = "Driehoek";
				break;
			default:
				label = "Onbekend";
				break;
		}

		this.predictionText.text = `Voorspelling: ${label}`;

		// set in the middle of drawableCanvasBg
		this.predictionText.position.set(this.x + this.content.width - 375 + 200 - this.predictionText.width / 2, this.content.height - 245);
	}
}

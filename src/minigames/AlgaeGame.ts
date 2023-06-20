import {
	Container,
	Graphics,
	Rectangle,
	Resource,
	Sprite,
	Texture,
} from "pixi.js";
import { DrawableCanvas } from "./DrawableCanvas";
import { Game } from "../game";
import { Minigame } from "./Minigame";
import { Algae } from "./Algae";
import { Sfx } from "../Sfx";

import wrongShapeSound from "url:../music/wrongShape.mp3";

import { DrawModel } from "./DrawModel";
import { AlgaeGameTutorial } from "./AlgaeGameTutorial";

export class AlgaeGame extends Minigame {
	private playField: Container;
	public algaes: Algae[];
	private leftArrow: Graphics;
	private rightArrow: Graphics;
	private matrix: any;
	private xcoords: number[];
	private ycoords: number[];
	private cols: number;
	private rows: number;
	private playFieldWidth: number;
	private bg: Sprite;
	private visibleWidth: number;
	private wrongShapeSound: Sfx;
	public model: DrawModel;
	private drawableCanvas: DrawableCanvas;

	constructor(textures: Texture[], game: Game) {
		super(game, textures);
		this.game = game;
		this.textures = textures;
		this.model = new DrawModel();
		this.algaes = [];
		this.wrongShapeSound = new Sfx(wrongShapeSound, 0.75);
		// game options
		this.playFieldWidth = 1600;
		this.visibleWidth = this.game.pixi.screen.width;
		this.cols = 6;
		this.rows = 3;

		// init playfield
		this.xcoords = [];
		this.ycoords = [];
		this.matrix = new Array(this.rows)
			.fill(0)
			.map(() => new Array(this.cols).fill(0));
		this._setUpField();
		this._setUpCoords();
		this._setupEvents();
		super.addScore();
		super.addLives();
		super.createRulesButton();

		// init instructions, don't show
		super.initInstructions(
			() => {},
			"Teken het figuur dat op de alg staat op het canvas. \n\nTekenen doe je met de muis in te drukken. \n\nAls je te laat bent, zal de alg rood worden en verlies je een leven. \n\nKlik op de pijltjes links en rechts, of gebruik de toetsen, om van meer te veranderen. \n\n\nTIP! Zorg dat je duidelijke figuren tekent met scherpe hoeken, zodat het systeem het beste jouw figuur kan herkennen.",
			false
		);
		//start interactive tutorial
		const tutorial = new AlgaeGameTutorial(
			this.game,
			this._startGame.bind(this),
			this.textures,
			this.model,
			"Doel: Teken het juiste figuur dat bij het type alg hoort door met je muis ingedrukt een figuur in het water te tekenen. Machine learning zal een voorspelling doen van het figuur. Je hoeft niet precies te zijn. \n\nAls je te laat bent, zal de alg rood worden en verlies je een leven. \n\nJe kan van wateren veranderen door op de pijltjes <-  -> links en rechts te klikken, of de toetsen te gebruiken. \n\nLaten we oefenen!"
		);
		this.addChild(tutorial);
	}

	private _startGame = () => {
		super.active = true;
		this._startGeneratingAlgaes();
		this._setupCanvas();
		this._setupArrowKeys();
	};

	private _setUpField() {
		// set up playfield bg
		this.playField = new Container();
		this.addChild(this.playField);
		this.bg = new Sprite(this.textures.lakebg);
		this.playField.addChild(this.bg);
		this.bg.width = this.playFieldWidth;
		this.bg.height = 600;
		this.playField.pivot.x = 0;
	}

	private _setupEvents() {
		window.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft" || e.key === "a") {
				this._moveCanvasLeft();
			} else if (e.key === "ArrowRight" || e.key === "d") {
				this._moveCanvasRight();
			}
		});
	}

	private _setUpCoords() {
		// generate x coords for each column, 200 - 2200 evenly spaced
		for (let j = 0; j < this.cols; j++) {
			const x = 150 + (j * (this.playField.width - 300)) / (this.cols - 1);
			this.xcoords.push(x);
		}

		// generate y coords for each row, 200 - 600 evenly spaced
		for (let i = 0; i < this.rows; i++) {
			const y = 100 + (i * (500 - 100)) / (this.rows - 1);
			//
			this.ycoords.push(y);
		}
	}

	private _setupCanvas() {
		// init canvas, pass on model
		this.drawableCanvas = new DrawableCanvas(
			this.game,
			this.onDrawingMade.bind(this),
			this.model
		);
		this.addChild(this.drawableCanvas);
	}

	private _setupArrowKeys() {
		// draw left and right arrow at the edges of the screen
		this.leftArrow = new Graphics();
		this.leftArrow.beginFill(0x000000);
		this.leftArrow.drawPolygon([40, 0, 0, 20, 40, 40]);
		this.leftArrow.endFill();
		this.leftArrow.x = 0;
		this.leftArrow.y = 300;

		this.leftArrow.eventMode = "static";
		this.leftArrow.cursor = "pointer";
		this.leftArrow.hitArea = new Rectangle(0, 0, 40, 40);

		// hide left arrow if we're at the leftmost edge
		if (this.bg.pivot.x == 0) {
			this.leftArrow.visible = false;
		}

		this.leftArrow.onclick = () => {
			this._moveCanvasLeft();
		};

		this.rightArrow = new Graphics();
		this.rightArrow.beginFill(0x000000);
		this.rightArrow.drawPolygon([0, 0, 40, 20, 0, 40]);
		this.rightArrow.endFill();
		this.rightArrow.x = this.game.pixi.screen.width - this.rightArrow.width;
		this.rightArrow.y = 300;

		this.rightArrow.eventMode = "static";
		this.rightArrow.cursor = "pointer";
		this.rightArrow.hitArea = new Rectangle(0, 0, 40, 40);

		// hide right arrow if we're at the rightmost edge
		if (this.playField.pivot.x == this.playFieldWidth - this.visibleWidth) {
			this.rightArrow.visible = false;
		}

		this.rightArrow.onclick = () => {
			this._moveCanvasRight();
		};

		this.addChild(this.leftArrow, this.rightArrow);
	}

	private _startGeneratingAlgaes() {
		for (let i = 0; i < 4; i++) {
			this._addAlgae();
		}
	}

	private _moveCanvasLeft() {
		if (this.playField.pivot.x > 0) {
			// move the playfield to the left and show all arrows
			this.playField.pivot.x -= this.visibleWidth;
			this.rightArrow.visible = true;

			// if we're at the left edge, hide the left arrow and show the right arrow
			if (this.playField.pivot.x === 0) {
				this.leftArrow.visible = false;
			}
		}
	}

	private _moveCanvasRight() {
		if (this.playField.pivot.x < this.playFieldWidth - this.visibleWidth) {
			// move the playfield to the right and show all arrows
			this.playField.pivot.x += this.visibleWidth;
			this.leftArrow.visible = true;

			// if we're at the right edge, hide the right arrow and show the left arrow
			if (this.playField.pivot.x === this.playFieldWidth - this.visibleWidth) {
				this.rightArrow.visible = false;
			}
		}
	}

	private _addAlgae() {
		// pick a spot on the matrix thats not taken
		const pos = this._getRandomPosition();

		const algae = new Algae(
			this.textures.algaeSpritesheet,
			this.textures.spritesheet.animations["swoosh"],
			this,
			pos.x,
			pos.y
		);
		this.matrix[pos.row][pos.col] = algae;
		this.algaes.push(algae);
		this.playField.addChild(algae);
	}

	private async onDrawingMade() {
		// loop through all the algaes and check if the drawing is inside an algae
		for (const obj of this.algaes) {
			// get the bounds of the algae
			const objPos = obj.getBounds();

			// check if the drawing is inside the algae
			if (!obj.missed && this.drawableCanvas.objectInsideDrawing(objPos)) {
				const result = await this.drawableCanvas.predictDrawing();

				if (obj.shape.toLowerCase() === result.toLowerCase()) {
					this.algaes = this.algaes.filter((algae: Algae) => algae !== obj);
					this.matrix = this.matrix.map((row: number[]) =>
						row.map((col: Algae | number) => (col === obj ? 0 : col))
					);
					super.score++;
					obj.onCorrectShape();

					// wait 1-3 seconds before generating a new algae
					setTimeout(() => {
						this._addAlgae();
					}, Math.random() * 2000 + 1000);
				} else {
					this.wrongShapeSound.playSFX();
					const prevTint = obj.tint;
					obj.tint = 0xff0000;

					setTimeout(() => {
						obj.tint = prevTint;
					}, 1000);
				}
			}
		}
	}

	private _getRandomPosition() {
		let row = Math.floor(Math.random() * 3);
		let col = Math.floor(Math.random() * 9);

		while (this.matrix[row][col] !== 0) {
			row = Math.floor(Math.random() * 3);
			col = Math.floor(Math.random() * 9);
		}

		return { row, col, x: this.xcoords[col], y: this.ycoords[row] };
	}

	public update(delta: number) {
		this.algaes.forEach((algae: Algae) => {
			algae.update(delta);
		});

		if (this.lives < 1 || this.score >= this.scoreGoal) {
			const reason = this.lives < 1 ? 0 : 1;
			super.endGame(reason, () => this.game.endAlgaeGame(reason));
		}
	}
}

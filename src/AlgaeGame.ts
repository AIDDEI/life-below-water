import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { DrawableCanvas } from "./DrawableCanvas";
import { Game } from "./game";
import { Minigame } from "./Minigame";
import { Algae } from "./Algae";
import { Sfx } from "./Sfx";

import wrongShapeSound from "url:./music/wrongShape.mp3";

import { DrawModel } from "./DrawModel";
import { AlgaeGameTutorial } from "./AlgaeGameTutorial";

export class AlgaeGame extends Minigame {
	private playField: any;
	public algaes: any;
	private leftArrow: Graphics;
	private rightArrow: Graphics;
	private matrix: any;
	private xcoords: number[];
	private ycoords: number[];
	private cols: number;
	private rows: number;
	private playFieldWidth: number;
	private bg: Sprite;
	private visibleWidth: any;

	private wrongShapeSound: any;
	private _model: DrawModel;
	private drawableCanvas: DrawableCanvas;

	constructor(textures: Texture[], game: Game) {
		super(game, textures);
		this.game = game;
		this.textures = textures;
		this._model = new DrawModel();
		this.algaes = [];
		this.playFieldWidth = 1600;
		this.visibleWidth = this.game.pixi.screen.width;
		this.cols = 6;
		this.rows = 3;
		this.wrongShapeSound = new Sfx(wrongShapeSound, 0.75);
		this.xcoords = [];
		this.ycoords = [];
		this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
		// set up coords, rows 200 to 600, cols 200 to 2400 evenly spaced
		this.playField = new Container();
		this.addChild(this.playField);
		this.bg = new Sprite(this.textures.lakebg);
		this.playField.addChild(this.bg);
		this.bg.width = this.playFieldWidth;
		this.bg.height = 600;
		this.playField.pivot.x = 0;
		this._setUpCoords();
		this._setupEvents();
		super.addScore();
		super.addLives();
		super.createRulesButton();

		super.initInstructions(
			() => {},
			"Teken het figuur dat op de alg staat op het canvas. \n\nTekenen doe je met de muis. \n\nAls je te laat bent, zal de alg rood worden en verlies je een leven. \n\n\nTIP! Zorg dat je duidelijke figuren tekent met scherpe hoeken, zodat het systeem het beste jouw figuur kan herkennen.",
			false
		);

		const tutorial = new AlgaeGameTutorial(
			this.game,
			this._startGame.bind(this),
			this.textures,
			this._model,
			"Algen groeien door warmte. Waar algen niet van houden, is doorstromend water. Het is aan jouw de taak het water te laten stromen voordat de alg te groot wordt. \n\nDit doe je door het juiste figuur te tekenen die bij het type alg hoort. \n\nTekenen doe je met de muis in één beweging. Geen zorgen! Dit hoeft niet perfect. \n\nAls je te laat bent, zal de alg rood worden en verlies je een leven. Laten we oefenen!"
		);
		this.addChild(tutorial);
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

	private _startGame = () => {
		this.active = true;
		this._startGeneratingAlgaes();
		this._setupCanvas();
		this._setupArrowKeys();
	};

	private _setupCanvas() {
		this.drawableCanvas = new DrawableCanvas(this.game, this.onDrawingMade.bind(this));
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

		if (this.playField.pivot.x == this.playFieldWidth - this.visibleWidth) {
			this.rightArrow.visible = false;
		}

		this.rightArrow.onclick = () => {
			this._moveCanvasRight();
		};

		this.addChild(this.leftArrow, this.rightArrow);
	}

	private _startGeneratingAlgaes() {
		for (let i = 0; i < 5; i++) {
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

		const player = new Algae(this.textures.algaeSpritesheet, this.textures.spritesheet.animations["swoosh"], this, pos.x, pos.y);
		this.matrix[pos.row][pos.col] = player;
		this.algaes.push(player);
		this.playField.addChild(player);
	}

	private async onDrawingMade() {
		for (const obj of this.algaes) {
			const objPos = obj.getBounds();
			if (this.drawableCanvas.objectInsideDrawing(objPos)) {
				const canvas = await this.drawableCanvas.getDrawing();
				const result = await this._model.predict(canvas);

				if (obj.shape.toLowerCase() === result.toLowerCase()) {
					this.algaes = this.algaes.filter((player: Algae) => player !== obj);
					this.matrix = this.matrix.map((row: number[]) => row.map((col: number) => (col === obj ? 0 : col)));
					super.score++;
					obj.move();

					// wait 1-3 seconds before generating a new player
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

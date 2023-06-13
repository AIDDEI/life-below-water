import { AnimatedSprite, Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { DrawableCanvas } from "./DrawableCanvas";
import { Game } from "./game";
import { Minigame } from "./Minigame";
import { Player } from "./Player";
import { Sfx } from "./Sfx";

import wrongShapeSound from "url:./music/wrongShape.mp3";
export class AlgaeGame extends Minigame {
	playField: any;
	players: any;
	game: Game;
	textures: Texture[];
	waterTexture: AnimatedSprite;
	leftArrow: Graphics;
	rightArrow: Graphics;
	matrix: any;
	xcoords: number[];
	ycoords: number[];
	cols: number;
	rows: number;
	playFieldWidth: number;
	bg: Sprite;
	visibleWidth: any;

	SCOREGOAL: number = 10;
	livesContainer: any;
	lives: number;
	wrongShapeSound: any;

	constructor(game: Game, textures: Texture[]) {
		super(game, textures);
		this.game = game;
		this.textures = textures;
		this.players = [];
		this.playFieldWidth = 1600;
		this.visibleWidth = this.game.pixi.screen.width;
		this.cols = 6;
		this.rows = 3;

		this.wrongShapeSound = new Sfx(wrongShapeSound, 0.75);
		this.xcoords = [];
		this.ycoords = [];
		this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
		// set up coords, rows 200 to 600, cols 200 to 2400 evenly spaced
		this.init();
		this._setUpCoords();
		this._setupEvents();
		super.addScore();
		super.addLives();
		super.createRulesButton();
		this._startGame();
		super.initInstructions(() => {}, " ", false);
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

	init() {
		this.playField = new Container();
		this.addChild(this.playField);
		this.bg = new Sprite(this.textures.lakebg);

		this.playField.addChild(this.bg);
		this.bg.width = this.playFieldWidth;
		this.bg.height = 600;

		this.playField.pivot.x = 0;
	}

	private _startGame = () => {
		this.active = true;
		this._startGeneratingPlayers();
		this._setupCanvas();

		this._setupArrowKeys();
	};

	private _setupCanvas() {
		const draw = new DrawableCanvas(this.game, this, this.onDrawingMade);

		this.addChild(draw);
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

	private _startGeneratingPlayers() {
		for (let i = 0; i < 5; i++) {
			this._addPlayer();
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

	private _addPlayer() {
		// pick a spot on the matrix thats not taken
		const pos = this._getRandomPosition();

		const player = new Player(this.textures.algaeSpritesheet, this.textures.spritesheet.animations["swoosh"], this, pos.x, pos.y);
		this.matrix[pos.row][pos.col] = player;
		this.players.push(player);
		this.playField.addChild(player);
	}

	private onDrawingMade = ({ result, object }: { result: string; object: Player }) => {
		const obj = this.players.find((player: Player) => player === object);
		if (obj) {
			console.log(obj.shape.toLowerCase(), result.toLowerCase());
			if (obj.shape.toLowerCase() === result.toLowerCase()) {
				this.players = this.players.filter((player: Player) => player !== obj);
				this.matrix = this.matrix.map((row: number[]) => row.map((col: number) => (col === obj ? 0 : col)));
				super.score++;
				obj.move();

				// wait 1-3 seconds before generating a new player
				setTimeout(() => {
					this._addPlayer();
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
	};

	private _getRandomPosition() {
		let row = Math.floor(Math.random() * 3);
		let col = Math.floor(Math.random() * 9);

		while (this.matrix[row][col] !== 0) {
			row = Math.floor(Math.random() * 3);
			col = Math.floor(Math.random() * 9);
		}

		return { row, col, x: this.xcoords[col], y: this.ycoords[row] };
	}

	update(delta: number) {
		this.players.forEach((player) => {
			player.update(delta);
		});
	}
}

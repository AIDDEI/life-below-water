import { AnimatedSprite, Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { DrawableCanvas } from "./DrawableCanvas";
import { Game } from "./Game";
import { Minigame } from "./Minigame";
import { Player } from "./Player";

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

	constructor(game: Game, textures: Texture[]) {
		super(game);
		this.game = game;
		this.textures = textures;
		this.players = [];
		this.playFieldWidth = 2400;
		this.cols = 9;
		this.rows = 3;

		this.xcoords = [];
		this.ycoords = [];
		this.matrix = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));

		// set up coords, rows 200 to 600, cols 200 to 2400 evenly spaced
		this.init();
		this._setUpCoords();

		this.initInstructions(() => {
			this.startGame();
		}, " ");
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
		// this.playField = new Container();
		// // draw 3 rectangles different colors width 800 height 600
		// for (let i = 0; i < 3; i++) {
		// 	const graphics = new Graphics();
		// 	const color = i === 0 ? 0xff0000 : i === 1 ? 0xc9c9c9 : 0x00ff00;
		// 	graphics.beginFill(color);

		// 	graphics.drawRect(800 * i, 0, 800, 600);
		// 	graphics.endFill();

		// 	this.playField.addChild(graphics);
		// }
		this.playField = new Container();
		this.addChild(this.playField);
		this.bg = new Sprite(this.textures.lakebg);

		this.playField.addChild(this.bg);
		this.bg.width = 2400;
		this.bg.height = 600;

		this.playField.pivot.x = 0;
	}

	private startGame = () => {
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
			if (this.playField.pivot.x > 0) {
				this.playField.pivot.x -= 800;

				if (this.playField.pivot.x == 0) {
					this.leftArrow.visible = false;
				} else {
					this.rightArrow.visible = true;
				}
			}
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

		if (this.playField.pivot.x == 1600) {
			this.rightArrow.visible = false;
		}

		this.rightArrow.onclick = () => {
			if (this.playField.pivot.x < 1600) {
				this.playField.pivot.x += 800;

				if (this.playField.pivot.x == 1600) {
					this.rightArrow.visible = false;
				} else {
					this.leftArrow.visible = true;
				}
			}
		};

		this.addChild(this.leftArrow, this.rightArrow);
	}

	private _startGeneratingPlayers() {
		for (let i = 0; i < 7; i++) {
			// pick a spot on the matrix thats not taken
			const pos = this._getRandomPosition();

			const player = new Player(this.textures.player, this.textures.spritesheet.animations["swoosh"], pos.x, pos.y);
			this.matrix[pos.row][pos.col] = player;
			this.players.push(player);
			this.playField.addChild(player);
		}
	}

	private onDrawingMade = ({ result, object }: { result: string; object: Player }) => {
		const obj = this.players.find((player: Player) => player === object);
		if (obj) {
			console.log(obj.shape.toLowerCase(), result.toLowerCase());
			if (obj.shape.toLowerCase() === result.toLowerCase()) {
				this.players = this.players.filter((player) => player !== obj);
				this.matrix = this.matrix.map((row: number[]) => row.map((col: number) => (col === obj ? 0 : col)));
				obj.move();

				// wait 1-3 seconds before generating a new player
				setTimeout(() => {
					// pick a spot on the matrix thats not taken
					const pos = this._getRandomPosition();
					const player = new Player(this.textures.player, this.textures.spritesheet.animations["swoosh"], pos.x, pos.y);
					this.matrix[pos.row][pos.col] = player;
					this.players.push(player);
					this.playField.addChild(player);
				}, Math.random() * 2000 + 1000);
			} else {
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

	update() {
		this.players.forEach((player) => {
			player.update();

			if (player.alpha >= 0.99) {
				player.tint = 0x000000;
			}
		});
	}
}

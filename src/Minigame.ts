import * as PIXI from "pixi.js";
import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Button } from "./Button";
import { Game } from "./game";
import { GameRules } from "./GameRules";
import { Sfx } from "./Sfx";

import lossSound from "url:./music/gameloss.mp3";
import winSound from "url:./music/gamewin.mp3";

/**
 * Parent class for all minigames that contains the basic functionality for all minigames
 * such as the pause function and the initInstructions function
 *
 * @param game Game object to add the minigame to
 *
 */
export class Minigame extends PIXI.Container {
	public active: boolean;
	public game: Game;
	private gameRules: GameRules;
	private rules: Button;
	private scoreText: any;
	private livesContainer: PIXI.Container<PIXI.DisplayObject>;
	private _lives: number = 3;
	private _score: number;
	protected scoreGoal: number = 10;
	private textures: PIXI.Texture<PIXI.Resource>[];
	private lossSound: Sfx;
	private winSound: Sfx;

	constructor(game: Game, textures: Texture[], scoreGoal: number = 10, lives: number = 3) {
		super();
		this.sortableChildren = true;
		this.textures = textures;
		this.active = false;
		this.game = game;
		this._score = 0;
		this.lossSound = new Sfx(lossSound);
		this.winSound = new Sfx(winSound);
		this.scoreGoal = scoreGoal;
		this._lives = lives;
	}

	/**
	 * Function to create a button to show the rules
	 * @param x number x position of the button
	 * @param y number y position of the button
	 * @example this.createRulesButton(100, 100);
	 * @example this.createRulesButton();
	 * @example this.createRulesButton(100);
	 */
	protected createRulesButton(x: number = this.game.pixi.screen.width - 100, y: number = 10): Button {
		this.rules = new Button(30, "Uitleg", undefined, undefined, () => {
			this.showRules();
		});
		this.rules.x = x;
		this.rules.y = y;

		this.rules.zIndex = 1;
		this.addChild(this.rules);

		return this.rules;
	}

	protected addScore(): void {
		this.scoreText = new Text(`Score: 0 / ${this.scoreGoal}`, {
			fontFamily: "Arial",
			fontSize: 24,
			fill: "white",
			align: "center",
		});
		this.scoreText.anchor.set(0.5);
		this.scoreText.x = this.game.pixi.screen.width / 2;
		this.scoreText.y = 20;
		this.addChild(this.scoreText);
	}

	protected addLives() {
		this.livesContainer = new Container();
		this.addChild(this.livesContainer);

		for (let i = 0; i < this.lives; i++) {
			const heart = new Sprite(this.textures.heart);
			heart.scale.set(0.25);

			heart.position.set(heart.width * i, this.scoreText.height);
			this.livesContainer.addChild(heart);
		}

		this.livesContainer.position.set(this.game.pixi.screen.width / 2 - this.livesContainer.width / 2, this.scoreText.height - 20);
	}

	/**
	 * Function to set the lives
	 * @param lives number lives to set
	 */
	public set lives(lives: number) {
		this._lives = lives;
		this._updateLivesContainer();
	}

	/**
	 * Function to get the lives
	 * @returns number lives
	 */
	public get lives() {
		return this._lives;
	}

	private _updateLivesContainer() {
		if (this.livesContainer.children.length === 0) return;

		this.livesContainer.removeChildAt(this.livesContainer.children.length - 1);
		this.livesContainer.position.set(this.game.pixi.screen.width / 2 - this.livesContainer.width / 2, this.scoreText.height - 20);
	}

	/**
	 * Function to update the scoreContainer
	 */
	private _updateScoreContainer(): void {
		const score = this.scoreText;
		score.text = `Score: ${this._score} / ${this.scoreGoal}`;
	}

	/**
	 * Function to set the score
	 * @param score number score to set
	 * @example this.score = 10;
	 */
	public set score(score: number) {
		this._score = score;
		this._updateScoreContainer();
	}

	/**
	 * Function to get the score
	 * @returns number score
	 */
	public get score(): number {
		return this._score;
	}

	/**
	 * Function to initialize gamerules
	 *
	 * @param cb () => void callback function to run when the rules are done
	 * @param instructions string instructions to show
	 */
	protected initInstructions(cb: () => void, instructions: string, open: boolean = true): void {
		this.gameRules = new GameRules(
			this.game,
			() => {
				this.active = true;
				cb();
			},
			instructions,
			open
		);

		this.gameRules.position.set(0, 0);
		this.gameRules.zIndex = 2;
		this.addChild(this.gameRules);
	}

	/**
	 * Function to end the game and run endGame function as a callback
	 * @param reason number reason to end the game (0 = loss, 1 = win)
	 * @param cb () => void callback function to run when the game is done
	 *
	 * @example this.endGame(0, () => { console.log("Game over!") });
	 */
	protected endGame(reason: number, cb: () => void): void {
		if (reason != 0 && reason != 1) return console.error("Invalid reason to end the game, must be 0 or 1");

		if (reason == 0) {
			this.lossSound.playSFX();
		} else {
			this.winSound.playSFX();
		}

		this.active = false;

		const gameOverContainer = new Graphics();
		// blue rectangle with yellow outline
		gameOverContainer.beginFill(0xffffff);
		gameOverContainer.lineStyle(4, `0x${reason == 0 ? "ff0000" : "20A34F"}`);
		gameOverContainer.drawRect(0, 0, 400, 200);
		gameOverContainer.endFill();

		gameOverContainer.x = this.game.pixi.screen.width / 2 - gameOverContainer.width / 2;
		// put container a bit higher than the middle
		gameOverContainer.y = this.game.pixi.screen.height / 2 - gameOverContainer.height;
		this.addChild(gameOverContainer);

		const gameOverText = new PIXI.Text(reason == 0 ? "Game over" : "Gewonnen!", {
			fontFamily: "Arial",
			fontSize: 48,
			fill: `0x${reason == 0 ? "ff0000" : "20A34F"}`,
			align: "center",
		});

		gameOverText.anchor.set(0.5);
		gameOverText.x = gameOverContainer.width / 2;
		gameOverText.y = gameOverContainer.height / 2;

		gameOverContainer.addChild(gameOverText);
		this.addChild(gameOverContainer);

		// wait 1.5 seconds before ending the game
		setTimeout(() => {
			cb();
		}, 1500);
	}

	/**
	 * function to pause minigame and show the settings menu
	 */
	protected pauseGame() {
		// TODO show pause menu instead
		this.game.pixi.ticker.stop();
		this.active = false;
	}

	/**
	 * function to show the rules of the minigame
	 */
	protected showRules(): void {
		this.active = false;
		this.gameRules.show(() => {
			this.active = true;
		});
	}
}

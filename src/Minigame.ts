import * as PIXI from "pixi.js";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { Button } from "./Button";
import { Game } from "./game";
import { GameRules } from "./GameRules";
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
	private SCOREGOAL: number = 10;
	private textures: PIXI.Texture<PIXI.Resource>[];

	constructor(game: Game, textures: Texture[], scoreGoal: number = 10, lives: number = 3) {
		super();
		this.sortableChildren = true;
		this.textures = textures;
		this.active = false;
		this.game = game;
		this._score = 0;
		this.SCOREGOAL = scoreGoal;
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
	protected createRulesButton(x: number = this.game.pixi.screen.width - 100, y: number = 10): void {
		this.rules = new Button(30, "Uitleg", undefined, undefined, () => {
			this.showRules();
		});
		this.rules.x = x;
		this.rules.y = y;

		this.rules.zIndex = 1;
		this.addChild(this.rules);
	}

	protected addScore(): void {
		this.scoreText = new Text(`Score: 0 / ${this.SCOREGOAL}`, {
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

	public set lives(lives: number) {
		this._lives = lives;
		this._updateLivesContainer();
	}

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
		score.text = `Score: ${this._score} / ${this.SCOREGOAL}`;
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

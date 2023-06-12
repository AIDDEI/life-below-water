import * as PIXI from "pixi.js";
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
	rules: any;

	constructor(game: Game) {
		super();
		this.sortableChildren = true;
		this.active = false;
		this.game = game;

		this.rules = new Button(30, "Uitleg", undefined, undefined, () => {
			this.showRules();
		});
		this.rules.x = this.game.pixi.screen.width - this.rules.width - 10;
		this.rules.y = 10;

		this.rules.zIndex = 1;
		this.addChild(this.rules);
	}

	/**
	 * Function to initialize gamerules
	 *
	 * @param cb () => void callback function to run when the rules are done
	 * @param instructions string instructions to show
	 */
	protected initInstructions(cb: () => void, instructions: string): void {
		this.gameRules = new GameRules(
			this.game,
			() => {
				this.active = true;
				cb();
			},
			instructions
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
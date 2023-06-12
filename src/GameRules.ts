import { Game } from "./game";
import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { fadeIn, fadeOut } from "./utils";
/**
 * Class for the container that holds the game rules
 *
 * @param game Game object to add the rules to
 * @param cb () => void callback function to run when the rules are done
 * @param instructions string instructions to show
 *
 * @extends PIXI.Container
 * @example new GameRules(game, () => { console.log('you won!') }, 'Click the button to win!');
 *
 */
export class GameRules extends PIXI.Container {
	private cb: () => void;
	private game: Game;
	private bg: PIXI.Graphics;
	private button: Button;
	private instructions: string;

	constructor(game: Game, cb: () => void, instructions: string) {
		super();
		this.x = 0;
		this.y = 0;
		this.cb = cb;
		this.bg = new PIXI.Graphics();
		this.game = game;
		this.instructions = instructions;
		this.eventMode = "static";
		this._setupUI();
	}

	private _setupUI() {
		// black bg
		this.bg.beginFill(0x000000);
		this.bg.drawRect(0, 0, this.game.pixi.screen.width, this.game.pixi.screen.height);
		this.bg.endFill();
		this.bg.alpha = 0.6;
		this.addChild(this.bg);

		// white container
		const container = new PIXI.Graphics();
		container.beginFill(0xffffff);
		container.drawRect(0, 0, this.game.pixi.screen.width - 100, this.game.pixi.screen.height - 100);
		container.endFill();
		container.position.set(50, 50);
		this.addChild(container);

		// text
		const text = new PIXI.Text(this.instructions, {
			fontSize: 20,
			fill: "black",
			wordWrap: true,
			wordWrapWidth: this.game.pixi.screen.width - 200,
		});
		text.position.set(100, 100);
		this.addChild(text);

		// button
		this.button = new Button(50, "Begin minigame", 0xffbd01, 0x336699, () => {
			this.cb();
			fadeOut(this);
		});

		this.button.position.set(this.x + this.button.width / 2, this.height - this.button.height - 75);
		this.addChild(this.button);
	}

	/**
	 * Show the rules
	 *
	 * @param cb - callback function to run when player clicks the button (used to continue the game)
	 */
	public show(cb: () => void) {
		this.button.label = "Verder gaan";
		this.button.clickHandler = () => {
			fadeOut(this);
			cb();
		};

		this.button.position.set(this.x + this.button.width / 2, this.height - this.button.height - 75);

		fadeIn(this, 150);
	}
}

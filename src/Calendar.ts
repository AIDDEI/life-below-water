import { Container, Texture, Sprite, Resource, BlurFilter, Text } from "pixi.js";
import { Button } from "./Button";
import { Game } from "./game";
import { fadeIn, fadeOut } from "./utils";

export class Calendar extends Container {
	private _day: number;
	private _assets: Texture<Resource>[];
	private _dayText: Text;
	private _goalText: Text;
	private _game: Game;

	constructor(assets: Texture<Resource>[], game: Game, day: number = 1) {
		super();
		this._day = day;
		this.eventMode = "static";
		this._game = game;
		this._assets = assets;
		this.visible = true;
		this._dayText = new Text(`Dag #${this._day}`, {
			fontFamily: "Arial",
			fontSize: 48,
			fill: 0x4287f5, // Light blue color
			dropShadow: true,
			dropShadowColor: "#0a1340", // Dark blue dropshadow
			dropShadowDistance: 3,
			fontWeight: "bold",
		});
		this._goalText = new Text(
			`Welkom bij Waterschappen! Wat leuk dat je bij ons team zit. Ik ben Neeldert, jouw begeleider voor vandaag! Ons voornaamste doel vandaag is het op peil houden van de waterkwaliteit. Dat klinkt simpel, maar dat is het niet! Je zult ontdekken dat we veel ingewikkelde beslissingen over water moeten nemen, die gevolgen kunnen hebben voor verschillende groepen in de samenleving. Als ik een opdracht voor je heb, stuur ik dit via de mail. Succes! `,
			{ fill: "blue", fontSize: 15 }
		);
		this._goalText.style.wordWrap = true;
		this._goalText.style.wordWrapWidth = 400;
		this._renderDayScreen();
	}

	public get day(): number {
		return this._day;
	}

	/**
	 *
	 * Add a day and show the screen
	 *
	 */
	public nextDay(): void {
		this._day++;
		this._updateDayScreen();
	}

	private _renderDayScreen(): void {
		const bg = new Sprite(this._assets.daybg);
		// apply blur filter
		bg.filters = [new BlurFilter(5, 5, 1)];
		bg.width = 1100;
		bg.height = 700;

		const border = new Sprite(this._assets.border);
		border.position.set(this._game.pixi.screen.width / 2 - border.width / 2, this._game.pixi.screen.height / 2 - border.height / 2);

		// give border white background
		const borderBg = new Sprite(Texture.WHITE);
		borderBg.width = border.width - 40;
		borderBg.height = border.height - 60;

		borderBg.position.set(border.x + 20, border.y + 20);

		// place day text in the middle of the border
		this._dayText.position.set(this._game.pixi.screen.width / 2 - this._dayText.width / 2, border.y + 70);
		// place goal text in the middle of the border
		this._goalText.position.set(this._game.pixi.screen.width / 2 - this._goalText.width / 2, this._dayText.y + 70);

		const button = new Button(35, "Start dag", 0x2c5eab, 0x4287f5, () => {
			fadeOut(this);
		});

		// place button in the middle of the border
		button.position.set(border.x + border.width / 2 - button.width / 2, border.height - button.height);

		this.addChild(bg, borderBg, border, this._dayText, this._goalText, button);
		this.visible = true;
	}

	private _updateDayScreen(): void {
		this._dayText.text = `Dag #${this._day}`;
		this._goalText.text = `Doel: Hou de waterkwaliteit op peil`;
		this._goalText.style.fontSize = 18;
		this._goalText.style.fontWeight = "bold";
		this._goalText.position.set(this._game.pixi.screen.width / 2 - this._goalText.width / 2, this._game.pixi.screen.height / 2 - this._goalText.height / 2);
		this.visible = true;
	}
}

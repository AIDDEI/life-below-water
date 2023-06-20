import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { AssetType, Game } from "../game";

export class QualityScreen extends PIXI.Container {
	private game: Game;
	private assets: AssetType;
	private bg: PIXI.Sprite;
	private textStyle: PIXI.TextStyle;

	// containers
	private bgContainer: PIXI.Container;
	private contentContainer: PIXI.Container;
	private waterParamContainer: PIXI.Container;
	private qualityIndicatorContainer: PIXI.Container;

	//Rects to make container width/height static.
	private contentBG: PIXI.Graphics;
	private waterParamBG: PIXI.Graphics;
	private qualityIndicatorBG: PIXI.Graphics;

	constructor(assets: AssetType, game: Game) {
		super();
		this.game = game;
		this.visible = false;
		this.assets = assets;
		this.textStyle = new PIXI.TextStyle({
			fill: "#ffffff",
			fontFamily: "Arial Black",
			fontSize: 20,
			fontVariant: "small-caps",
			fontWeight: "bold",
			lineJoin: "bevel",
		});

		// set up the background page
		this.bg = new PIXI.Sprite(Texture.EMPTY);
		this.bg.width = this.game.pixi.screen.width;
		this.bg.height = this.game.pixi.screen.height;
		this.addChild(this.bg);
		this.bg.eventMode = "none";

		// container to place content in
		this.contentContainer = new PIXI.Container();
		this.contentContainer.width = this.bg.width;
		this.contentContainer.height = this.bg.height * 0.83;

		//temporary background fill to check positioning
		this.contentBG = new PIXI.Graphics();
		this.contentBG.beginFill("rgba(255,255,255,0)");
		this.contentBG.drawRect(
			0,
			this.bg.height * 0.17,
			this.bg.width,
			this.bg.height - this.bg.height * 0.17
		);
		this.contentBG.endFill();

		// set waterparam's container.
		this.waterParamContainer = new PIXI.Container();
		this.waterParamContainer.y = this.bg.height * 0.17;

		// set up temp bg for visible positionion
		this.waterParamBG = new PIXI.Graphics();
		this.waterParamBG.beginFill("rgba(255,255,255)");
		this.waterParamBG.drawRect(0, 0, this.bg.width, this.bg.height * 0.4);
		this.waterParamBG.endFill();
		this.waterParamBG.alpha = 0;
		this.waterParamContainer.addChild(this.waterParamBG);

		this.qualityIndicatorContainer = new PIXI.Container();
		this.qualityIndicatorBG = new PIXI.Graphics();
		this.qualityIndicatorBG.beginFill("rgba(2, 100, 200, 0)");
		this.qualityIndicatorBG.drawRect(
			0,
			this.waterParamContainer.getBounds().y + this.waterParamContainer.height,
			this.bg.width,
			this.bg.height * 0.45
		);
		this.qualityIndicatorBG.endFill();
		this.qualityIndicatorContainer.addChild(this.qualityIndicatorBG);

		// add all content to the right containers
		this.contentContainer.addChild(
			this.contentBG,
			this.waterParamContainer,
			this.qualityIndicatorContainer
		);
		this.addChild(this.contentContainer);

		for (let i = 0; i < this.game.waterParameters.length; i++) {
			const x = 0;
			const width = this.bg.width - 10;
			const height =
				this.waterParamBG.height / (this.game.waterParameters.length + 2);
			const y = 20 + height * i + 30 * i;
			const paramBar = this.game.waterParameters[i];
			this.waterParamContainer.addChild(paramBar);
			paramBar.draw(x, y, width, height, this.textStyle);
		}
	}

	public close() {
		this.visible = false;
	}

	public open() {
		this.visible = true;
		this.game.pixi.renderer.background.color = 0x0000ff;
	}
}

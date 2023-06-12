import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { AssetType, Game } from "./game";

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
			fontSize: 28,
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
		this.contentBG.beginFill("rgba(10,200,20,0)");
		this.contentBG.drawRect(0, this.bg.height * 0.17, this.bg.width, this.bg.height - this.bg.height * 0.17);
		this.contentBG.endFill();

		// set waterparam's container.
		this.waterParamContainer = new PIXI.Container();
		this.waterParamContainer.y = this.bg.height * 0.17;

		// set up temp bg for visible positionion
		this.waterParamBG = new PIXI.Graphics();
		this.waterParamBG.beginFill("rgba(200, 1, 200)");
		this.waterParamBG.drawRect(0, 0, this.bg.width, this.bg.height * 0.4);
		this.waterParamBG.endFill();
		this.waterParamBG.alpha = 0;
		this.waterParamContainer.addChild(this.waterParamBG);

		this.qualityIndicatorContainer = new PIXI.Container();
		this.qualityIndicatorBG = new PIXI.Graphics();
		this.qualityIndicatorBG.beginFill("rgba(2, 100, 200, 0.4)");
		this.qualityIndicatorBG.drawRect(0, this.waterParamContainer.getBounds().y + this.waterParamContainer.height, this.bg.width, this.bg.height * 0.45);
		this.qualityIndicatorBG.endFill();
		this.qualityIndicatorContainer.addChild(this.qualityIndicatorBG);

		// add all content to the right containers
		this.contentContainer.addChild(this.contentBG, this.waterParamContainer, this.qualityIndicatorContainer);
		this.addChild(this.contentContainer);

		for (let i = 0; i < this.game.waterParams.length; i++) {
			const x = 0;
			const width = this.bg.width - 10;
			const height = this.waterParamBG.height / (this.game.waterParams.length + 1);
			const y = 20 + height * i + 10 * i;
			const paramBar = this.game.waterParams[i];
			this.waterParamContainer.addChild(paramBar);
			paramBar.draw(x, y, width, height, this.textStyle);
		}
	}

	public close() {
		this.visible = false;
		this.game.pixi.stage.removeChild(this);
	}

	public open() {
		this.visible = true;
		this.game.pixi.stage.addChild(this);
		this.game.pixi.renderer.background.color = 0x0000ff;
	}
}

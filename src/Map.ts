import * as PIXI from "pixi.js";
import { AssetType, Game } from "./game";

export class Map extends PIXI.Container {
  private game: Game;
  private assets: AssetType;
  private map: PIXI.Sprite;
  private farmer: PIXI.Sprite;
  private lob: PIXI.Sprite;

  constructor(assets: AssetType, game: Game) {
    super();
    this.assets = assets;
    this.game = game;

    this.map = new PIXI.Sprite(this.assets.map);
    this.map.width = 500;
    this.map.height = this.game.pixi.screen.height;
    this.map.x = this.game.pixi.screen.width / 2 - this.map.width / 2;

    this.farmer = new PIXI.Sprite(this.assets.farmerIcon);
    this.farmer.scale.set(0.5);
    this.farmer.x = 500;
    this.farmer.y = 250;

    this.farmer.interactive = true;
    this.farmer.cursor = "pointer";
    this.farmer.on("click", this.onFarmerClick.bind(this));
    this.farmer.on("mouseover", this.onFarmerMouseOver.bind(this));
    this.farmer.on("mouseout", this.onFarmerMouseOut.bind(this));

    this.lob = new PIXI.Sprite(this.assets.lobIcon);
    this.lob.scale.set(0.3);
    this.lob.x = 300;
    this.lob.y = 350;

    this.lob.interactive = true;
    this.lob.cursor = "pointer";
    this.lob.on("click", this.onlobClick.bind(this));
    this.lob.on("mouseover", this.onlobMouseOver.bind(this));
    this.lob.on("mouseout", this.onlobMouseOut.bind(this));

    this.addChild(this.map, this.farmer, this.lob);
    this.close();
  }

  // events for farmer icon
  private onFarmerClick() {
    console.log("Open farmer scenario");
  }

  private onFarmerMouseOver() {
    this.farmer.scale.set(0.6);
  }

  private onFarmerMouseOut() {
    this.farmer.scale.set(0.5);
  }

  // events for lobster icon
  private onlobClick() {
    console.log("Open lob minigame");
  }

  private onlobMouseOver() {
    this.lob.scale.set(0.4);
  }

  private onlobMouseOut() {
    this.lob.scale.set(0.3);
  }

  public close() {
    this.visible = false;
  }

  public open() {
    this.visible = true;
    this.game.pixi.renderer.background.color = 0x0000ff;
  }
}

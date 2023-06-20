import * as PIXI from "pixi.js";
import { AssetType, Game } from "./game";

export class Map extends PIXI.Container {
  private game: Game;
  private assets: AssetType;
  private mapContainer: PIXI.Container;
  private map: PIXI.Sprite;
  private farmer: PIXI.Sprite;
  private lob: PIXI.Sprite;

  constructor(assets: AssetType, game: Game) {
    super();
    this.assets = assets;
    this.game = game;

    this.mapContainer = new PIXI.Container();
    this.addChild(this.mapContainer);

    this.map = new PIXI.Sprite(this.assets.map);
    this.map.width = 800;
    this.map.height = 600;

    const mapWidth = this.game.pixi.screen.width;
    const mapHeight = this.game.pixi.screen.height;

    this.mapContainer.width = this.game.pixi.screen.width;
    this.mapContainer.height = this.game.pixi.screen.height;

    const maskGraphics = new PIXI.Graphics();
    maskGraphics.beginFill(0x000000);
    maskGraphics.drawRect(0, 0, mapWidth, mapHeight);
    maskGraphics.endFill();

    this.mapContainer.mask = maskGraphics;

    this.mapContainer.addChild(this.map);

    this.mapContainer.x = (this.game.pixi.screen.width - mapWidth) / 2;
    this.mapContainer.y = (this.game.pixi.screen.height - mapHeight + 200) / 2;

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
    this.lob.y = 450;

    this.lob.interactive = true;
    this.lob.cursor = "pointer";
    this.lob.on("click", this.onlobClick.bind(this));
    this.lob.on("mouseover", this.onlobMouseOver.bind(this));
    this.lob.on("mouseout", this.onlobMouseOut.bind(this));

    this.addChild(this.farmer, this.lob);
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

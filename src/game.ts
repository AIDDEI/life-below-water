// Import PIXI
import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { WaterParam } from "./WaterParam";
import { WaterModel } from "./WaterModel";

const weights = "./model/model.weights.bin";
const modelJSON = "./model/model.json";
const metadata = "./model/model_meta.json";

export class Game {
  public pixi: PIXI.Application;
  private loader: AssetLoader;
  public player: Player;
  private gameTexture: PIXI.Texture;
  private officeAssets: PIXI.Texture;

  private waterParamA: WaterParam;
  public waterModel: WaterModel;
  waterParamB: WaterParam;
  waterParamC: WaterParam;

  constructor() {
    this.pixi = new PIXI.Application();
    document.body.appendChild(this.pixi.view);
    // Load images
    this.loader = new AssetLoader(this);
  }

  loadCompleted() {
    console.log("Load completed");
    console.log(this.loader.textures);

    this.gameTexture = this.loader.textures.Player["flowerTop"];
    this.officeAssets = this.loader.textures.Office;
    console.log(this.officeAssets);

    this.player = new Player(this.gameTexture);
    this.pixi.stage.addChild(this.player);

    // PARAM TESTING DEBUG ONLY
    this.waterParamA = new WaterParam("Parameter A", "parameter_a", -1, 1);
    this.waterParamA.update(-6);
    console.log(this.waterParamA.getKeyValue());

    this.waterParamB = new WaterParam("Parameter B", "parameter_b", 100, 11);
    this.waterParamA.update(1);
    console.log(this.waterParamB.getKeyValue());

    this.waterParamC = new WaterParam("Parameter C", "parameter_c", 234, 6);
    this.waterParamA.update(3);
    console.log(this.waterParamC.getKeyValue());

    this.waterModel = new WaterModel(modelJSON, metadata, weights);
    this.waterModel.predict(
      this.waterParamA.getKeyValue,
      this.waterParamB.getKeyValue,
      this.waterParamC.getKeyValue
    );
  }
}

new Game();

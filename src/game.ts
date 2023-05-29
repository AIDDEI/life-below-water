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

  public waterParameters: WaterParam[];
  private waterParamA: WaterParam;
  public waterModel: WaterModel;
  private waterParamB: WaterParam;
  private waterParamC: WaterParam;

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

    // PARAM TESTING
    this.waterParameters = [];

    this.waterParamA = new WaterParam("Parameter A", "parameter_a", -1, 1);
    this.waterParamA.updateValue(-6);
    console.log(`${this.waterParamA.keyName}: ${this.waterParamA.value}`);
    this.waterParameters.push(this.waterParamA);

    this.waterParamB = new WaterParam("Parameter B", "parameter_b", 100, 11);
    this.waterParamA.updateValue(1);
    console.log(`${this.waterParamB.keyName}: ${this.waterParamB.value}`);
    this.waterParameters.push(this.waterParamB);

    this.waterParamC = new WaterParam("Parameter C", "parameter_c", 234, 6);
    this.waterParamA.updateValue(3);
    console.log(`${this.waterParamC.keyName}: ${this.waterParamC.value}`);
    this.waterParameters.push(this.waterParamC);

    // MODEL TESTING
    this.waterModel = new WaterModel(modelJSON, metadata, weights);
    let data: number[] = [];
    for (let param of this.waterParameters) {
      data.push(param.value);
    }
    console.log(data);

    this.waterModel.predict(data);
    // - DONE - //
  }
}

new Game();

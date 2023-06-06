// Import PIXI
import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { MailScreen } from "./MailScreen";
import { WaterParam } from "./WaterParam";
import { Calendar } from "./Calendar";

export class Game {
  public pixi: PIXI.Application;
  private loader: AssetLoader;
  public player: Player;
  private gameTexture: PIXI.Texture;
  public mail: MailScreen;
  private officeAssets: PIXI.Texture;
  private mailAssets: PIXI.Texture[];
  private dayAssets: any;
  public calendar: Calendar;
  //water parameters related
  public waterParameters: WaterParam[];
  private waterParamA: WaterParam;
  private waterParamB: WaterParam;
  private waterParamC: WaterParam;

  // public waterModel: WaterModel;

  constructor() {
    PIXI.settings.ROUND_PIXELS = true;

    // init game
    this.pixi = new PIXI.Application({
      autoDensity: true,
      resolution: window.devicePixelRatio,
    });

    document.body.appendChild(this.pixi.view as HTMLCanvasElement);
    // Load images
    this.loader = new AssetLoader(this);

    this.waterParamA = new WaterParam("Parameter A", "parameter_a", -1, 1);
    this.waterParamB = new WaterParam("Parameter B", "parameter_b", 100, 11);
    this.waterParamC = new WaterParam(
      "Parameter C",
      "parameter_c",
      624,
      20,
      500,
      700
    );
  }

  loadCompleted() {

    console.log("Load completed");
    console.log(this.loader.textures);

    this.gameTexture = this.loader.textures.Player["flowerTop"];
    this.officeAssets = this.loader.textures.Office;
    this.mailAssets = this.loader.textures.MailScreen;
    this.dayAssets = this.loader.textures.DayScreen;


    this.calendar = new Calendar(this.dayAssets, this)
    // this.player = new Player(this.gameTexture)
    // this.pixi.stage.addChild(this.player)

    this.mail = new MailScreen(this.mailAssets, this);
    this.pixi.stage.addChild(this.mail);


    this.mail.add(
      "Lob lob lob",
      "De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.",
      0,
      true,
      "lob"
    );
    this.mail.add(
      "Mail 1",
      "This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.",
      0,
      false,
      "lob"
    );
    this.mail.add("Mail 3", "This is the third mail.", 0, false, "lob");
    this.mail.add("Mail 4", "This is the third mail.", 0);

    // Parameter testing
    this.waterParamA.updateValue(-6); // should display error outside of step range
    console.log(`${this.waterParamA.keyName}: ${this.waterParamA.value}`); // => parameter_a : 0

    this.waterParamB.updateValue(1);
    console.log(`${this.waterParamB.keyName}: ${this.waterParamB.value}`);

    this.waterParamC.updateValue(-1);
    console.log(`${this.waterParamC.keyName}: ${this.waterParamC.value}`);

    // ! Keep this last 
    this.pixi.stage.addChild(this.calendar)
  }
}

new Game();

import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { MailScreen } from "./MailScreen";
import { WaterParam } from "./WaterParam";
import { QualityScreen } from "./QualityScreen";
import { Calendar } from "./Calendar";
import { LobGame } from "./LobGame";
import { Browser } from "./Browser";
import { QualityScreen } from "./QualityScreen";

export type AssetType = { [key: string]: PIXI.Texture<PIXI.Resource> };

export class Game {
	public pixi: PIXI.Application;
	private loader: AssetLoader;
	public player: Player;
	private gameTexture: PIXI.Texture;
	private mailAssets: PIXI.Texture<PIXI.Resource>;
	public lobGame: LobGame | undefined;
	private lobAssets: PIXI.Texture<PIXI.Resource>;
	private officeAssets: PIXI.Texture;
	private mailAssets: PIXI.Texture[];
	private dayAssets: any;
	public calendar: Calendar;
	//water parameters related
	public waterParameters: WaterParam[];
	private waterParamA: WaterParam;
	private waterParamB: WaterParam;
	private waterParamC: WaterParam;
	public browser: Browser;
  private qualityAssets: PIXI.Texture[];
  public qualityScreen: QualityScreen;

	constructor() {
		PIXI.settings.ROUND_PIXELS = true;

		// init game
		this.pixi = new PIXI.Application({
			autoDensity: true,
			resolution: window.devicePixelRatio,
			backgroundColor: 0xffffff,
		});

		document.body.appendChild(this.pixi.view as HTMLCanvasElement);
		// Load images
		this.loader = new AssetLoader(this);

    // init parameters

    this.waterParamA = new WaterParam("Zuurtegraad", "ph", -1, 1);
    this.waterParamB = new WaterParam(
      "Sulfaten", // name
      "sulfates", //keyName
      100, // value
      11, // increment
      100, // min
      1000, // max
      300, // optimal min
      700 // optimal max
    );

    this.waterParamC = new WaterParam(
      "Vaste Stoffen", //Name
      "solids", //keyname
      624, //value
      20, // increment
      500, // min
      700 // max
    );
    this.waterParams = [this.waterParamA, this.waterParamB, this.waterParamC];

	}

	loadCompleted() {
		console.log("Load completed");
		console.log(this.loader.textures);

		this.officeAssets = this.loader.textures.Office;
		this.mailAssets = this.loader.textures.MailScreen;
		this.dayAssets = this.loader.textures.DayScreen;
		this.lobAssets = this.loader.textures.Lobgame;
    this.qualityAssets = this.loader.textures.QualityScreen;

		this.calendar = new Calendar(this.dayAssets, this);
		// this.player = new Player(this.gameTexture)
		// this.pixi.stage.addChild(this.player)

    this.mail = new MailScreen(this.mailAssets, this);
    this.qualityScreen = new QualityScreen(this.qualityAssets, this);
    this.pixi.stage.addChild(this.mail, this.qualityScreen);
    this.qualityScreen.turnOn();


		this.browser = new Browser(this.loader.textures.browser);

		this.browser.addTabs([
			{ tabName: "Kwaliteit", screen: this.qualityscreen },
			{ tabName: "E-mail", screen: this.mail },
			{ tabName: "Kaart", screen: undefined },
			{ tabName: "Over ons", screen: undefined },
		]);

		this.browser.openTab = 1;
		this.pixi.stage.addChild(this.browser);

		this.mail.add(
			"Lob lob lob",
			"De zomer is in aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.",
			0,
			true,
			"lob"
		);
		this.mail.add("Mail 1", "This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.", 0, false, "lob");
		this.mail.add("Mail 3", "This is the third mail.", 0, false, "lob");
		this.mail.add("Mail 4", "This is the third mail.", 0);

		this.pixi.ticker.add((delta) => this.update(delta));

		// ! Keep this last
		this.pixi.stage.addChild(this.calendar);
	}

	private update(delta: number) {
		// this.player.update(delta)
		// this.mail.update(delta)

		if (this.lobGame?.active) this.lobGame.update(delta);
	}

	public startLobGame() {
		this.mail.visible = false;
		this.lobGame = new LobGame(this.lobAssets, this);
		this.pixi.stage.addChild(this.lobGame);
	}

	public endLobGame(score: number, reason: number, description: string): void {
		if (this.lobGame) this.pixi.stage.removeChild(this.lobGame);
		this.lobGame = undefined;
		this.mail.visible = true;
		this.mail.addResultsMail(
			"Salaris Kreeftopdracht",
			`Door het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeterd`,
			1,
			true,
			undefined,
			score,
			reason
		);
	}
}

new Game();

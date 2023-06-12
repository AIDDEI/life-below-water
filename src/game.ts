// Import PIXI
import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { MailScreen } from "./MailScreen";
import { WaterParam } from "./WaterParam";
import { DrawableCanvas } from "./DrawableCanvas";
import { Water } from "./Water";
import { AnimatedSprite, Graphics } from "pixi.js";
import { AlgaeGame } from "./AlgaeGame";
// import { WaterModel } from "./WaterModel";

export class Game {
	public pixi: PIXI.Application;
	private loader: AssetLoader;
	public player: Player;
	private gameTexture: PIXI.Texture;
	public mail: MailScreen;
	private officeAssets: PIXI.Texture;
	private mailAssets: PIXI.Texture[];

	//water parameters related
	public waterParameters: WaterParam[];
	private waterParamA: WaterParam;
	private waterParamB: WaterParam;
	private waterParamC: WaterParam;
	private algaeGame: AlgaeGame;
	waterTexture: AnimatedSprite;
	// public waterModel: WaterModel;

	constructor() {
		PIXI.settings.ROUND_PIXELS = true;

		// init game
		this.pixi = new PIXI.Application({
			autoDensity: true,
			resolution: window.devicePixelRatio,
			width: 800,
			height: 600,
			backgroundColor: 0xffffff,
		});
		this.players = [];
		document.body.appendChild(this.pixi.view as HTMLCanvasElement);
		// Load images
		this.loader = new AssetLoader(this);

		this.waterParamA = new WaterParam("Parameter A", "parameter_a", -1, 1);
		this.waterParamB = new WaterParam("Parameter B", "parameter_b", 100, 11);
		this.waterParamC = new WaterParam("Parameter C", "parameter_c", 624, 20, 500, 700);
	}

	loadCompleted() {
		console.log("Load completed");
		console.log(this.loader.textures);

		this.gameTexture = this.loader.textures.Player["flowerTop"];
		this.officeAssets = this.loader.textures.Office;
		this.mailAssets = this.loader.textures.MailScreen;
		// this.waterTexture = this.loader.textures.spritesheet.animations["swoosh"];
		this.algaeGameTextures = this.loader.textures.AlgaeGame;

		// this.player = new Player(this.gameTexture)
		// this.pixi.stage.addChild(this.player)

		this.mail = new MailScreen(this.mailAssets, this);
		this.pixi.stage.addChild(this.mail);
		this.mail.visible = false;
		this.mail.add(
			"Lob lob lob",
			"De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.",
			0,
			true,
			"lob"
		);
		this.mail.add("Mail 1", "This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.", 0, false, "lob");
		this.mail.add("Mail 3", "This is the third mail.", 0, false, "lob");
		this.mail.add("Mail 4", "This is the third mail.", 0);

		this.algaeGame = new AlgaeGame(this, this.loader.textures.AlgaeGame);
		this.pixi.stage.addChild(this.algaeGame);

		this.pixi.ticker.add(this.update);
	}

	public update = (delta: number) => {
		if (this.algaeGame?.active) this.algaeGame.update(delta);
	};
}

new Game();

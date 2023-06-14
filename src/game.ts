import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { WaterParam } from "./WaterParam";
import { LobGame } from "./LobGame";
import { PopUp } from "./tip-popUp";
import { Clock } from "./Clock";
import { fadeIn } from "./Utils";
// Screens
import { Browser } from "./Browser";
import { QualityScreen } from "./QualityScreen";
import { Calendar } from "./Calendar";
import { HomeScreen } from "./HomeScreen";
import { Settings } from "./Settings";
import { StartScreen } from "./StartScreen";
import { CreditsScreen } from "./CreditsScreen";
import { NewGameWarning } from "./NewGameWarning";
import { MailScreen } from "./MailScreen";

// Other
import { Player } from "./Player";
import { Music } from "./Music";
import { Sfx } from "./Sfx";

// Import Audio
import music from "url:./music/chill.mp3";
import buttonClick from "url:./music/button_click.mp3";
import { AlgaeGame } from "./AlgaeGame";

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
	public waterParamA: WaterParam;
	public waterParamB: WaterParam;
	public waterParamC: WaterParam;
	public browser: Browser;
	private qualityAssets: PIXI.Texture[];
	public qualityScreen: QualityScreen;
	public mail: MailScreen;
	private popUp: PopUp;
	private clock: Clock;
	public homeScreen: HomeScreen;
	public settings: Settings;
	public startScreen: StartScreen;
	public creditsScreen: CreditsScreen;
	public newGameWarning: NewGameWarning;
	private background: PIXI.Sprite;
	public algaeGame: AlgaeGame | undefined;
	private theme: Music;
	private buttonClick: Sfx;
	constructor() {
		PIXI.settings.ROUND_PIXELS = true;

		// init game
		this.pixi = new PIXI.Application({
			autoDensity: true,
			resolution: window.devicePixelRatio,
			backgroundColor: 0xffffff,
		});
		this.pixi.stage.eventMode = "static";
		document.body.appendChild(this.pixi.view as HTMLCanvasElement);
		// Load images
		this.loader = new AssetLoader(this);

		// init parameters

		this.waterParamA = new WaterParam("Zuurtegraad", "ph", 10, 10);
		this.waterParamB = new WaterParam(
			"Sulfaten", // name
			"sulfates", //keyName
			500, // value
			10, // increment
			100, // min
			1000, // max
			300, // optimal min
			700 // optimal max
		);

		this.waterParamC = new WaterParam(
			"Vaste Stoffen", //Name
			"solids", //keyname
			620, //value
			20, // increment
			500, // min
			700, // max
			575, // optimal min
			650 // optiman max
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

		this.browser = new Browser(this.loader.textures.browser);

		this.browser.addTabs([
			{ tabName: "Kwaliteit", screen: this.qualityScreen },
			{ tabName: "E-mail", screen: this.mail },
			{ tabName: "Kaart", screen: undefined },
		]);

		this.browser.openTab = 1;
		this.pixi.stage.addChild(this.browser);

		this.mail.add(
			"Lob lob lob",
			"De zomer is in aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren",
			0,
			false,
			"lob"
		);
		this.mail.add("Mail 4", "This is the third mail.", 0, true, "alg");

		// Create function to go to the Homescreen when the button is clicked
		const goToHomeScreen = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the start screen
			this.pixi.stage.removeChild(this.startScreen);

			// Adding background to the stage
			this.background = new PIXI.Sprite(this.loader.textures.StartMenu["backgroundBlur"]);
			this.pixi.stage.addChild(this.background);

			// Add the home screen
			this.homeScreen = new HomeScreen(startGame, goToNewGameWarning, goToSettings);
			this.pixi.stage.addChild(this.homeScreen);

			// Play Music
			this.theme = new Music(music);
			this.theme.playAudio();
		};

		// Create function to go to the new game warning when the button is clicked
		const goToNewGameWarning = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);

			// Add the new game warning screen
			this.newGameWarning = new NewGameWarning(goBackToTheHomeScreen, startNewGame);
			this.pixi.stage.addChild(this.newGameWarning);
		};

		// Create function to go back to the home screen from the new game warning screen
		const goBackToTheHomeScreen = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove new game warning screen
			this.pixi.stage.removeChild(this.newGameWarning);

			// Add the home screen
			this.homeScreen = new HomeScreen(startGame, goToNewGameWarning, goToSettings);
			this.pixi.stage.addChild(this.homeScreen);
		};

		// Create funtion to start new game
		const startNewGame = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Start new game
			this.pixi.stage.removeChild(this.newGameWarning);
			this.pixi.stage.removeChild(this.background);
		};

		// Create the function to go to the Settings when the button is clicked
		const goToSettings = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);
			// Stop the audio
			this.theme.stopAudio();

			// Border image
			let borderImage = this.loader.textures.StartMenu["settingsBorder"];

			// Add the settings screen
			this.settings = new Settings(borderImage, this.pixi, goBackToHomeScreen, goToCredits);
			this.pixi.stage.addChild(this.settings);
		};

		// Create the function to go to the Credits when the button is clicked
		const goToCredits = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the Settings
			this.pixi.stage.removeChild(this.settings);

			// Border image
			let borderImage = this.loader.textures.StartMenu["settingsBorder"];

			// Add the credits screen
			this.creditsScreen = new CreditsScreen(borderImage, goBackToSettings);
			this.pixi.stage.addChild(this.creditsScreen);
		};

		// Create the function to go back to the settings from the credits
		const goBackToSettings = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the Credits
			this.pixi.stage.removeChild(this.creditsScreen);

			// Border image
			let borderImage = this.loader.textures.StartMenu["settingsBorder"];

			// Add the settings
			this.settings = new Settings(borderImage, this.pixi, goBackToHomeScreen, goToCredits);
			this.pixi.stage.addChild(this.settings);
		};

		// Create the function to go back to the Homescreen from the settings
		const goBackToHomeScreen = () => {
			// Play sound
			this.buttonClick = new Sfx(buttonClick);
			this.buttonClick.playSFX();

			// Remove the Settings
			this.pixi.stage.removeChild(this.settings);

			// Add the home screen
			this.homeScreen = new HomeScreen(startGame, goToNewGameWarning, goToSettings);
			this.pixi.stage.addChild(this.homeScreen);

			// Play Music
			this.theme = new Music(music);
			this.theme.playAudio();
		};

		const startGame = () => {
			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);

			// Remove background to the stage
			this.pixi.stage.removeChild(this.background);
		};

		// Add the Startscreen
		this.startScreen = new StartScreen(goToHomeScreen);

		this.popUp = new PopUp(this.pixi);
		this.clock = new Clock(this);
		this.pixi.stage.addChild(this.clock);

		// ! Keep this last
		this.pixi.stage.addChild(this.calendar);
		this.pixi.stage.addChild(this.startScreen);

		this.pixi.ticker.add((delta) => this.update(delta));
	}

	private update(delta: number) {
		// this.player.update(delta)
		// this.mail.update(delta)
		if (this.algaeGame?.active) this.algaeGame.update(delta);
		if (this.lobGame?.active) this.lobGame.update(delta);
	}

	public startLobGame() {
		this.browser.visible = false;
		this.lobGame = new LobGame(this.lobAssets, this);
		this.pixi.stage.addChild(this.lobGame);
		this.lobGame.visible = true;
	}

	public endLobGame(reason: number): void {
		this.browser.visible = true;
		if (this.lobGame) this.pixi.stage.removeChild(this.lobGame);
		this.lobGame = undefined;
		this.mail.addResultsMail(
			"Salaris Kreeftopdracht",
			`Door het vangen van alle kleine kor het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeor het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbereeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeterd`,
			1,
			true,
			undefined,
			reason
		);

		this.clock.shiftClock(1);
	}

	public startAlgaeGame() {
		this.browser.visible = false;
		this.algaeGame = new AlgaeGame(this.loader.textures.AlgaeGame, this);
		this.pixi.stage.addChild(this.algaeGame);
		this.algaeGame.visible = true;
	}

	public endAlgaeGame(reason: number): void {
		this.browser.visible = true;
		if (this.algaeGame) this.pixi.stage.removeChild(this.algaeGame);
		this.algaeGame = undefined;
		this.mail.addResultsMail(
			"Salaris Kreeftopdracht",
			`Door het vangen van alle kleine kor het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeor het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbereeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeterd`,
			1,
			true,
			undefined,
			reason
		);

		this.clock.shiftClock(1);
	}
}

new Game();

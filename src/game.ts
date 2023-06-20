// Import PIXI
import * as PIXI from "pixi.js";

// Import Sprites via Assetloader
import { AssetLoader } from "./AssetLoader";

// Minigames
import { LobGame } from "./minigames/LobGame";

// Screens
import { Browser } from "./screens/Browser";
import { QualityScreen } from "./screens/QualityScreen";
import { Calendar } from "./screens/Calendar";
import { HomeScreen } from "./screens/HomeScreen";
import { Settings } from "./screens/Settings";
import { StartScreen } from "./screens/StartScreen";
import { CreditsScreen } from "./screens/CreditsScreen";
import { NewGameWarning } from "./screens/NewGameWarning";
import { MailScreen } from "./screens/MailScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

// Import Music, Audio and SFX
import { Map } from "./screens/Map";

// Other
import { Music } from "./Music";
import music from "url:./music/chill.mp3";

// Import Other Classes
import { PopUp } from "./ui/tip-popUp";
import { Clock } from "./ui/Clock";
import { WaterParam } from "./WaterParam";

// Export Asset Type

import { Money } from "./Money";
import { AlgaeGame } from "./minigames/AlgaeGame";

export type AssetType = { [key: string]: PIXI.Texture<PIXI.Resource> };

// Export the Game Class
export class Game {
	// Globals
	public pixi: PIXI.Application;
	private loader: AssetLoader;

	// Minigames
	public lobGame: LobGame | undefined;
	private lobAssets: PIXI.Texture<PIXI.Resource>;
	public algaeGame: AlgaeGame | undefined;

	// Assets
	private mailAssets: PIXI.Texture<PIXI.Resource>;
	private mapAssets: PIXI.Texture<PIXI.Resource>;
	private dayAssets: any;
	private qualityAssets: PIXI.Texture<PIXI.Resource>;

	// Water Parameters
	public waterParameters: WaterParam[];
	private waterParamA: WaterParam;
	private waterParamB: WaterParam;
	private waterParamC: WaterParam;

	// Screens
	public browser: Browser;
	public homeScreen: HomeScreen;
	public settings: Settings;
	public startScreen: StartScreen;
	public creditsScreen: CreditsScreen;
	public newGameWarning: NewGameWarning;
	private background: PIXI.Sprite;
	public settingsScreen: SettingsScreen;
	public map: Map;
	public calendar: Calendar;
	public qualityScreen: QualityScreen;
	public mail: MailScreen;

	// misc
	public money: Money;
	private moneyIcon: PIXI.Texture;
	private clock: Clock;

	// Music and Audio
	private theme: Music;

	// Icon
	private settingsIcon: PIXI.Texture;

	// Constructor

	constructor() {
		// PIXI Settings
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
		this.waterParamA = new WaterParam(
			"Zuurtegraad", // name
			"ph", // keyName
			50, //value
			10, // increment
			0, // min
			100, // max
			40, // optimal min
			60 // optimal max
		);
		this.waterParamB = new WaterParam(
			"Sulfaten", // name
			"sulfates", //keyName
			950, // value
			10, // increment
			900, // min
			1000, // max
			940, // optimal min
			960 // optimal max
		);
		this.waterParamC = new WaterParam(
			"Vaste Stoffen", //Name
			"solids", //keyname
			400, //value
			20, // increment
			100, // min
			700, // max
			575, // optimal min
			650 // optiman max
		);
		this.waterParameters = [
			this.waterParamA,
			this.waterParamB,
			this.waterParamC,
		];
	}

	// Do this when the load is completed
	loadCompleted() {
		// Load Textures
		this.mailAssets = this.loader.textures.MailScreen;
		this.dayAssets = this.loader.textures.DayScreen;
		this.lobAssets = this.loader.textures.Lobgame;
		this.qualityAssets = this.loader.textures.QualityScreen;
		this.mapAssets = this.loader.textures.Map;
		this.moneyIcon = this.loader.textures.moneyIcon;

		this.money = new Money(
			this.moneyIcon,
			new PIXI.TextStyle({
				dropShadow: true,
				dropShadowAlpha: 0.9,
				dropShadowBlur: 4,
				fill: "#ffffff",
				fontFamily: '"Arial Black", Gadget, sans-serif',
				fontVariant: "small-caps",
				fontWeight: "bolder",
			}),
			100
		);

		// Background music
		this.theme = new Music(music);

		// Create calendar
		this.calendar = new Calendar(this.dayAssets, this);

		// Create MailScreen and QualityScreen

		this.mail = new MailScreen(this.mailAssets, this);
		this.qualityScreen = new QualityScreen(this.qualityAssets, this);
		this.map = new Map(this.mapAssets, this);

		// Add the screens to the stage
		this.pixi.stage.addChild(this.mail, this.qualityScreen, this.map);

		// Retrieve the settingsIcon
		this.settingsIcon = new PIXI.Texture(
			this.loader.textures.StartMenu["settingsIcon"]
		);

		// Create the Browser screen
		this.browser = new Browser(
			this.loader.textures.browser,
			this.settingsIcon,
			this.theme,
			this
		);

		// Add the browser tabs
		this.browser.addTabs([
			{ tabName: "Kwaliteit", screen: this.qualityScreen },
			{ tabName: "E-mail", screen: this.mail },
			{ tabName: "Kaart", screen: this.map },
		]);

		// Select open tab
		this.browser.openTab = 1;
		this.pixi.stage.addChild(this.browser);

		// Add mails to the tab
		this.mail.add(
			"Lob lob lob",
			"De zomer is in aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren",
			0,
			false,
			"lob"
		);
		this.mail.add(
			"Algenoverlast",
			"Vandaag nemen we een kijkje bij verschillende meren om te kijken of er algen zijn. Algen groeien door warmte. Waar algen niet van houden, is doorstromend water. Het is aan jouw de taak het water te laten stromen voordat de alg te groot wordt.",
			0,
			true,
			"alg"
		);

		this.pixi.stage.addChild(this.money);

		// Create function to go to the Homescreen when the button is clicked
		const goToHomeScreen = () => {
			// Remove the start screen
			this.pixi.stage.removeChild(this.startScreen);

			// Adding background to the stage
			this.background = new PIXI.Sprite(
				this.loader.textures.StartMenu["backgroundBlur"]
			);
			this.pixi.stage.addChild(this.background);

			// Add the home screen
			this.homeScreen = new HomeScreen(
				startGame,
				goToNewGameWarning,
				goToSettings
			);
			this.pixi.stage.addChild(this.homeScreen);

			// Play Music
			this.theme.playAudio();
		};

		// Create function to go to the new game warning when the button is clicked
		const goToNewGameWarning = () => {
			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);

			// Add the new game warning screen
			this.newGameWarning = new NewGameWarning(
				goBackToTheHomeScreen,
				startNewGame
			);
			this.pixi.stage.addChild(this.newGameWarning);
		};

		// Create function to go back to the home screen from the new game warning screen
		const goBackToTheHomeScreen = () => {
			// Remove new game warning screen
			this.pixi.stage.removeChild(this.newGameWarning);

			// Add the home screen
			this.homeScreen = new HomeScreen(
				startGame,
				goToNewGameWarning,
				goToSettings
			);
			this.pixi.stage.addChild(this.homeScreen);
		};

		// Create funtion to start new game
		const startNewGame = () => {
			// Start new game
			this.pixi.stage.removeChild(this.newGameWarning);
			this.pixi.stage.removeChild(this.background);
		};

		// Create the function to go to the Settings when the button is clicked
		const goToSettings = () => {
			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);
			// Stop the audio
			this.theme.stopAudio();

			// Border image
			let borderImage = this.loader.textures.StartMenu["settingsBorder"];

			// Add the settings screen
			this.settings = new Settings(
				borderImage,
				this.pixi,
				goBackToHomeScreen,
				goToCredits
			);
			this.pixi.stage.addChild(this.settings);
		};

		// Create the function to go to the Credits when the button is clicked
		const goToCredits = () => {
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
			// Remove the Credits
			this.pixi.stage.removeChild(this.creditsScreen);

			// Border image
			let borderImage = this.loader.textures.StartMenu["settingsBorder"];

			// Add the settings
			this.settings = new Settings(
				borderImage,
				this.pixi,
				goBackToHomeScreen,
				goToCredits
			);
			this.pixi.stage.addChild(this.settings);
		};

		// Create the function to go back to the Homescreen from the settings
		const goBackToHomeScreen = () => {
			// Remove the Settings
			this.pixi.stage.removeChild(this.settings);

			// Add the home screen
			this.homeScreen = new HomeScreen(
				startGame,
				goToNewGameWarning,
				goToSettings
			);
			this.pixi.stage.addChild(this.homeScreen);

			// Play Music
			this.theme.playAudio();
		};

		const startGame = () => {
			// Remove the Homescreen
			this.pixi.stage.removeChild(this.homeScreen);

			// Remove background to the stage
			this.pixi.stage.removeChild(this.background);

			this.settingsScreen = new SettingsScreen(this.pixi, this);
			this.pixi.stage.addChild(this.settingsScreen);
			this.browser.addTabs([
				{ tabName: "Instellingen", screen: this.settingsScreen },
			]);
		};

		// Create the Start Screen
		this.startScreen = new StartScreen(goToHomeScreen);

		// Create the pop-up and the clock
		this.popUp = new PopUp(this.pixi);
		this.clock = new Clock(this);

		// Add the clock at the stage
		this.pixi.stage.addChild(this.clock);

		// ! Keep this last
		// Add the calendar and the start screen to the stage
		this.pixi.stage.addChild(this.calendar);
		this.pixi.stage.addChild(this.startScreen);

		// Add a ticker
		this.pixi.ticker.add((delta) => this.update(delta));
	}

	// Update
	private update(delta: number) {
		if (this.lobGame?.active) this.lobGame.update(delta);
		if (this.algaeGame?.active) this.algaeGame.update(delta);
	}

	// Start Lob Game
	public startLobGame() {
		// Disable the mail screen
		this.browser.visible = false;

		this.lobGame = new LobGame(this.lobAssets, this);

		// Add Lob game to the stage
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
			"Salaris Algenoverlast",
			`Door de waterdoorstroming te verbeteren is de overlast van algen verminderd en hebben we ervoor gezorgd dat mensen veilig kunnen zwemmen. Ook is de waterkwaliteit verbeterd en is de kans op vissterfte verminderd. \n\n\nSoms zijn algen moeilijk te bestrijden en te zien. Wil je zeker weten dat je veilig kunt zwemmen? Kijk dan op zwemwater.nl of het water schoon is.`,
			1,
			true,
			undefined,
			reason
		);

		// Clock goes forward
		this.clock.shiftClock(1);
	}
}

// Execute the game
new Game();

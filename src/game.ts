// Import PIXI
import * as PIXI from 'pixi.js';

// Import Classes
// Images
import { AssetLoader } from './AssetLoader';

// Screens
import { HomeScreen } from './HomeScreen';
import { Settings } from './Settings';
import { StartScreen } from './StartScreen';
import { CreditsScreen } from './CreditsScreen';
import { NewGameWarning } from './NewGameWarning';

// Other
import { Player } from './Player';
import { Music } from './Music';
import { Sfx } from './Sfx';

// Import Audio
import music from 'url:./music/chill.mp3';
import buttonClick from 'url:./music/button_click.mp3';

export class Game {
    // Globals
    public pixi: PIXI.Application;
    private loader: AssetLoader;

    public homeScreen : HomeScreen;
    public settings : Settings;
    public startScreen : StartScreen;
    public creditsScreen : CreditsScreen;
    public newGameWarning : NewGameWarning;

    public player: Player;
    private theme : Music;
    private buttonClick : Sfx;

    constructor() {
        // Create new Pixi Application and add it to the body
        this.pixi = new PIXI.Application();
        this.pixi.stage.eventMode = 'static';
        document.body.appendChild(this.pixi.view as HTMLElement);

        // Load images through the loader
        this.loader = new AssetLoader(this);
    }

    loadCompleted() {
        // Console logs
        console.log("Load completed");
        console.log(this.loader.textures);

        // Create function to go to the Homescreen when the button is clicked
        const goToHomeScreen = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Remove the start screen
            this.pixi.stage.removeChild(this.startScreen);

            // Adding background to the stage
            let background = new PIXI.Sprite(this.loader.textures.StartMenu['backgroundBlur']);
            this.pixi.stage.addChild(background);

            // Add the home screen
            this.homeScreen = new HomeScreen(goToNewGameWarning, goToSettings); 
            this.pixi.stage.addChild(this.homeScreen);

            // Play Music
            this.theme = new Music(music);
            this.theme.playAudio();
        }

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
        }

        // Create function to go back to the home screen from the new game warning screen
        const goBackToTheHomeScreen = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Remove new game warning screen
            this.pixi.stage.removeChild(this.newGameWarning);

            // Add the home screen
            this.homeScreen = new HomeScreen(goToNewGameWarning, goToSettings); 
            this.pixi.stage.addChild(this.homeScreen);
        }

        // Create funtion to start new game
        const startNewGame = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Stop the audio
            this.theme.stopAudio();

            // Start new game
            console.log("nieuw spel gestart")
        }

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
            let borderImage = this.loader.textures.StartMenu['settingsBorder'];

            // Add the settings screen
            this.settings = new Settings(borderImage, this.pixi, goBackToHomeScreen, goToCredits);
            this.pixi.stage.addChild(this.settings);
        }

        // Create the function to go to the Credits when the button is clicked
        const goToCredits = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Remove the Settings
            this.pixi.stage.removeChild(this.settings);

            // Border image
            let borderImage = this.loader.textures.StartMenu['settingsBorder'];

            // Add the credits screen
            this.creditsScreen = new CreditsScreen(borderImage, goBackToSettings);
            this.pixi.stage.addChild(this.creditsScreen);
        }

        // Create the function to go back to the settings from the credits
        const goBackToSettings = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Remove the Credits
            this.pixi.stage.removeChild(this.creditsScreen);

            // Border image
            let borderImage = this.loader.textures.StartMenu['settingsBorder'];

            // Add the settings
            this.settings = new Settings(borderImage, this.pixi, goBackToHomeScreen, goToCredits);
            this.pixi.stage.addChild(this.settings);
        }

        // Create the function to go back to the Homescreen from the settings
        const goBackToHomeScreen = () => {
            // Play sound
            this.buttonClick = new Sfx(buttonClick);
            this.buttonClick.playSFX();

            // Remove the Settings
            this.pixi.stage.removeChild(this.settings);

            // Add the home screen
            this.homeScreen = new HomeScreen(goToNewGameWarning, goToSettings); 
            this.pixi.stage.addChild(this.homeScreen);

            // Play Music
            this.theme = new Music(music);
            this.theme.playAudio();
        }

        // Add the Startscreen
        this.startScreen = new StartScreen(goToHomeScreen);
        this.pixi.stage.addChild(this.startScreen);
    }
}

new Game();
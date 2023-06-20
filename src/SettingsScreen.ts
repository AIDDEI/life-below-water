// Import PIXI
import * as PIXI from 'pixi.js';

// Import Classes
import { Button } from './Button';
import { CustomSlider } from './CustomSlider';
import { FullScreenCheckbox } from './FullScreenCheckbox';
import { Game } from './game';

// Export class
export class SettingsScreen extends PIXI.Container {
    // Globals
    private settingsContainer: PIXI.Container;
    private creditsContainer: PIXI.Container;
    private game: Game;
    private textStyle: PIXI.TextStyle;

    constructor(pixiStage : PIXI.Application, game: Game) {
        super();

        // Set the game to the given game
        this.game = game;

        // Set the main container to invisible
        this.visible = false;

        // Create the settings and credits containers
        this.settingsContainer = new PIXI.Container();
        this.creditsContainer = new PIXI.Container();

        // Set the width and height of the containers
        this.settingsContainer.width = this.game.pixi.screen.width;
        this.settingsContainer.height = this.game.pixi.screen.height;

        this.creditsContainer.width = this.game.pixi.screen.width;
        this.creditsContainer.height = this.game.pixi.screen.height;

        // Get the Font size factor
        let savedFontSize = this.getSavedFontSize() ?? 10;
        // Divide by 10 to get the correct value
        const fontSizeFactor = savedFontSize / 10;

        // Create Common Text style
        this.textStyle = new PIXI.TextStyle({
            fontSize: 20 * fontSizeFactor,
            fill: 'black',
        });

        // Bind the event handler methods to the current instance of SettingsScreen
        this.openCredits = this.openCredits.bind(this);
        this.openSettings = this.openSettings.bind(this);

        // Settings
        // Create Music Slider Text
        const musicText = new PIXI.Text('Muziek', this.textStyle);
        musicText.position.set(120, 170);
        this.settingsContainer.addChild(musicText);

        // Create Music Slider and add it to the Settings container
        const musicSlider = new CustomSlider(0, 100, 400, 'MusicValue', 250);
        musicSlider.position.set(200, 135);
        this.settingsContainer.addChild(musicSlider);

        // Create SFX Slider Text
        const sfxText = new PIXI.Text('Geluid', this.textStyle);
        sfxText.position.set(120, 270);
        this.settingsContainer.addChild(sfxText);

        // Create SFX Slider and add it to the Settings container
        const sfxSlider = new CustomSlider(0, 100, 400, 'SFXValue', 250);
        sfxSlider.position.set(200, 235);
        this.settingsContainer.addChild(sfxSlider);

        // Create Font size slider Text
        const fontSizeText = new PIXI.Text('Lettertype', this.textStyle);
        fontSizeText.position.set(120, 370);
        this.settingsContainer.addChild(fontSizeText);

        // Create font size slider and add it to the settings container
        const fontSizeSlider = new CustomSlider(10, 13, 400, 'FontSize', 250);
        fontSizeSlider.position.set(200, 335);
        this.settingsContainer.addChild(fontSizeSlider);

        // Create Fullscreen Text
        const fullscreenText = new PIXI.Text('Fullscreen', this.textStyle);
        fullscreenText.position.set(120, 475);
        this.settingsContainer.addChild(fullscreenText);

        // Create the fullscreen checkbox
        const fullscreenCheckbox = new FullScreenCheckbox('Fullscreen', pixiStage);
        fullscreenCheckbox.position.set(245, 460);
        this.settingsContainer.addChild(fullscreenCheckbox);

        // Create credits button
        const creditsButton = new Button(50, 'Credits & Verantwoording', undefined, undefined, this.openCredits);
        // Set position
        creditsButton.position.set(350, 460);
        // Add the button to the setting container
        this.settingsContainer.addChild(creditsButton);

        // Make the settingscontainer visible
        this.settingsContainer.visible = true;

        // Credits
        // Create Makers Text
        const makersText = new PIXI.Text('Makers van deze game:', this.textStyle);
        makersText.position.set(
            (800 - makersText.width) / 2,
            (350 - makersText.height) / 2
        );
        this.creditsContainer.addChild(makersText);

        // Create Aiden Text
        const aiden = new PIXI.Text('Aiden Deighton', this.textStyle);
        aiden.position.set(
            (800 - aiden.width) / 2,
            (500 - aiden.height) / 2
        );
        this.creditsContainer.addChild(aiden);

        // Create Isis Text
        const isis = new PIXI.Text('Isis Ton', this.textStyle);
        isis.position.set(
            (800 - isis.width) / 2,
            (600 - isis.height) / 2
        );
        this.creditsContainer.addChild(isis);

        // Create Pim Text
        const pim = new PIXI.Text('Pim van Milt', this.textStyle);
        pim.position.set(
            (800 - pim.width) / 2,
            (700 - pim.height) / 2
        );
        this.creditsContainer.addChild(pim);

        // Create Quinten Text
        const quinten = new PIXI.Text('Quinten van Driel', this.textStyle);
        quinten.position.set(
            (800 - quinten.width) / 2,
            (800 - quinten.height) / 2
        );
        this.creditsContainer.addChild(quinten);

        // Create Wessel Text
        const wessel = new PIXI.Text('Wessel van Beek', this.textStyle);
        wessel.position.set(
            (800 - wessel.width) / 2,
            (900 - wessel.height) / 2
        );
        this.creditsContainer.addChild(wessel);

        // Create 'Back to settings' button
        const backToSettingsButton = new Button(50, 'Terug' , undefined, undefined, this.openSettings);
        // Set position
        backToSettingsButton.position.set(
            (800 - backToSettingsButton.width) / 2,
            (1100 - backToSettingsButton.height) / 2
        );
        this.creditsContainer.addChild(backToSettingsButton);

        // Make the creditsContainer invisible
        this.creditsContainer.visible = false;

        // Add the settingsContainer to the Main Container
        this.addChild(this.settingsContainer);

        // Add the creditsContainer to the Main Container
        this.addChild(this.creditsContainer);
    }

    public openCredits() {
        // Get the Font size factor
        let savedFontSize = this.getSavedFontSize() ?? 10;
        // Divide by 10 to get the correct value
        const fontSizeFactor = savedFontSize / 10;

        // Update Text style
        this.textStyle.fontSize = 20 * fontSizeFactor;

        // Close the settings
        this.settingsContainer.visible = false;

        // Open the credits
        this.creditsContainer.visible = true;
    }

    public openSettings() {
        // Get the Font size factor
        let savedFontSize = this.getSavedFontSize() ?? 10;
        // Divide by 10 to get the correct value
        const fontSizeFactor = savedFontSize / 10;

        // Update Text style
        this.textStyle.fontSize = 20 * fontSizeFactor;

        // Close the credits
        this.creditsContainer.visible = false;

        // Open the settings
        this.settingsContainer.visible = true;
    }

    private getSavedFontSize() : number | null {
        // Get the saved fontsize value and return it
        let savedFontSize = localStorage.getItem('FontSize');
        return savedFontSize ? parseInt(savedFontSize, 10) : null;
    }

    public open() {
		this.visible = true;
		this.game.pixi.renderer.background.color = 0xffffff;
	}

	public close() {
		this.visible = false;
	}
}
// Import PIXI
import * as PIXI from "pixi.js";

// Import Classses
import { Button } from "./Button";
import { CustomSlider } from "./CustomSlider";
import { FullScreenCheckbox } from "./FullScreenCheckbox";

// Export class
export class Settings extends PIXI.Container {
	constructor(borderImage: PIXI.Texture, pixiStage: PIXI.Application, homeScreen: () => void, credits: () => void) {
		super();

		// Create the border
		let border = new PIXI.Sprite(borderImage);
		// Set position
		border.position.set(0, 0);
		// Add border to the settings container
		this.addChild(border);

		// Get the Font size factor
		let savedFontSize = this.getSavedFontSize() ?? 10;
		// Divide by 10 to get the correct value
		const fontSizeFactor = savedFontSize / 10;

		// Create Header Text Style
		const headerTextStyle = new PIXI.TextStyle({
			fontSize: 40,
			fill: "white",
			stroke: "black",
			strokeThickness: 4,
		});

		// Create Header Text
		const headerText = new PIXI.Text("Instellingen", headerTextStyle);
		headerText.position.set((800 - headerText.width) / 2, (135 - headerText.height) / 2);
		this.addChild(headerText);

		// Create Common Text style
		const textStyle = new PIXI.TextStyle({
			fontSize: 20 * fontSizeFactor,
			fill: "white",
			dropShadow: true,
			dropShadowAlpha: 1,
			dropShadowAngle: Math.PI / 6,
			dropShadowBlur: 5,
			dropShadowDistance: 2,
		});

		// Create Music Slider Text
		const musicText = new PIXI.Text("Muziek", textStyle);
		musicText.position.set(120, 120);
		this.addChild(musicText);

		// Create Music Slider and add it to the Settings container
		const musicSlider = new CustomSlider(0, 100, 400, "MusicValue", 250);
		musicSlider.position.set(200, 85);
		this.addChild(musicSlider);

		// Create SFX Slider Text
		const sfxText = new PIXI.Text("Geluid", textStyle);
		sfxText.position.set(120, 220);
		this.addChild(sfxText);

		// Create SFX Slider and add it to the Settings container
		const sfxSlider = new CustomSlider(0, 100, 400, "SFXValue", 250);
		sfxSlider.position.set(200, 185);
		this.addChild(sfxSlider);

		// Create Font size slider Text
		const fontSizeText = new PIXI.Text("Lettertype", textStyle);
		fontSizeText.position.set(120, 320);
		this.addChild(fontSizeText);

		// Create font size slider and add it to the settings container
		const fontSizeSlider = new CustomSlider(10, 13, 400, "FontSize", 250);
		fontSizeSlider.position.set(200, 285);
		this.addChild(fontSizeSlider);

		// Create Fullscreen Text
		const fullscreenText = new PIXI.Text("Fullscreen", textStyle);
		fullscreenText.position.set(120, 425);
		this.addChild(fullscreenText);

		// Create the fullscreen checkbox
		const fullscreenCheckbox = new FullScreenCheckbox("Fullscreen", pixiStage);
		fullscreenCheckbox.position.set(245, 410);
		this.addChild(fullscreenCheckbox);

		// Create credits button
		const creditsButton = new Button(50, "Credits & Verantwoording", undefined, undefined, credits);
		// Set position
		creditsButton.position.set(350, 410);
		// Add the button to the setting container
		this.addChild(creditsButton);

		// Create 'Back to home' button
		const backToHomeButton = new Button(25, "X", undefined, undefined, homeScreen);
		// Set position
		backToHomeButton.position.set(675, (135 - backToHomeButton.height) / 2);
		// Add the button to the settings container
		this.addChild(backToHomeButton);
	}

	private getSavedFontSize(): number | null {
		// Get the saved fontsize value and return it
		let savedFontSize = localStorage.getItem("FontSize");
		return savedFontSize ? parseInt(savedFontSize, 10) : null;
	}
}

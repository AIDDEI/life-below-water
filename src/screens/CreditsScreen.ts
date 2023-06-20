// Import PIXI
import * as PIXI from "pixi.js";

// Import Classes
import { Button } from "../ui/Button";

// Export class
export class CreditsScreen extends PIXI.Container {
	// Constructor
	constructor(borderImage: PIXI.Texture, settings: () => void) {
		super();

		// Create the border
		let border = new PIXI.Sprite(borderImage);
		// Set position
		border.position.set(0, 0);
		// Add border to the settings containers
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
		const headerText = new PIXI.Text("Credits", headerTextStyle);
		headerText.position.set(
			(800 - headerText.width) / 2,
			(135 - headerText.height) / 2
		);
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

		// Create Makers Text
		const musicText = new PIXI.Text("Makers van deze game:", textStyle);
		musicText.position.set(
			(800 - musicText.width) / 2,
			(300 - musicText.height) / 2
		);
		this.addChild(musicText);

		// Create Aiden Text
		const aiden = new PIXI.Text("Aiden Deighton", textStyle);
		aiden.position.set((800 - aiden.width) / 2, (400 - aiden.height) / 2);
		this.addChild(aiden);

		// Create Isis Text
		const isis = new PIXI.Text("Isis Ton", textStyle);
		isis.position.set((800 - isis.width) / 2, (500 - isis.height) / 2);
		this.addChild(isis);

		// Create Pim Text
		const pim = new PIXI.Text("Pim van Milt", textStyle);
		pim.position.set((800 - pim.width) / 2, (600 - pim.height) / 2);
		this.addChild(pim);

		// Create Quinten Text
		const quinten = new PIXI.Text("Quinten van Driel", textStyle);
		quinten.position.set((800 - quinten.width) / 2, (700 - quinten.height) / 2);
		this.addChild(quinten);

		// Create Wessel Text
		const wessel = new PIXI.Text("Wessel van Beek", textStyle);
		wessel.position.set((800 - wessel.width) / 2, (800 - wessel.height) / 2);
		this.addChild(wessel);

		// Create 'Back to settings' button
		const backToSettingsButton = new Button(
			25,
			"X",
			undefined,
			undefined,
			settings
		);
		// Set position
		backToSettingsButton.position.set(
			675,
			(135 - backToSettingsButton.height) / 2
		);
		// Add the button to the settings container
		this.addChild(backToSettingsButton);
	}

	private getSavedFontSize(): number | null {
		// Get the saved fontsize value and return it
		let savedFontSize = localStorage.getItem("FontSize");
		return savedFontSize ? parseInt(savedFontSize, 10) : null;
	}
}

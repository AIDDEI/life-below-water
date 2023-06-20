// Screen to make sure the player interacts with the document so that audio works

// Import PIXI
import * as PIXI from "pixi.js";
import { Sprite, Texture } from "pixi.js";

// Import Classses
import { Button } from "../ui/Button";

// Export Class
export class StartScreen extends PIXI.Container {
	private _bg: PIXI.Sprite;

	constructor(homeScreen: () => void) {
		super();
		this._bg = new Sprite(Texture.WHITE);
		this._bg.width = 800;
		this._bg.height = 600;
		this.addChild(this._bg);

		// Create 'Start Canvas' button
		const startCanvasButton = new Button(
			50,
			"Start",
			undefined,
			undefined,
			homeScreen
		);
		// Position the button
		startCanvasButton.position.set(
			(800 - startCanvasButton.width) / 2,
			(600 - startCanvasButton.height) / 2
		);
		// Add the button to the canvas
		this.addChild(startCanvasButton);
	}
}

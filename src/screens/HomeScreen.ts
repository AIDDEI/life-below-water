// Import PIXI
import * as PIXI from "pixi.js";

// Import Classses
import { Button } from "../ui/Button";

// Export Class
export class HomeScreen extends PIXI.Container {
	constructor(
		startGame: () => void,
		newGame: () => void,
		settings: () => void
	) {
		super();

		// Create Start Button
		const startButton = new Button(
			50,
			"Start spel",
			undefined,
			undefined,
			startGame,
			350
		);
		// Position Start Button
		startButton.position.set(
			(1200 - startButton.width) / 2,
			(600 - startButton.height) / 2
		);
		// Add Start Button to the Homescreen
		this.addChild(startButton);

		// Create 'New Game' Button
		const newGameButton = new Button(
			50,
			"Nieuw Spel",
			undefined,
			undefined,
			newGame,
			350
		);
		// Position 'New Game' Button
		newGameButton.position.set(
			(1200 - newGameButton.width) / 2,
			(800 - newGameButton.height) / 2
		);
		// Add 'New Game' Button to the Homescreen
		this.addChild(newGameButton);

		// Create Settings Button
		const settingsButton = new Button(
			50,
			"Instellingen",
			undefined,
			undefined,
			settings,
			350
		);
		// Position Settings Button
		settingsButton.position.set(
			(1200 - settingsButton.width) / 2,
			(1000 - settingsButton.height) / 2
		);
		// Add Settings Button to the Homescreen
		this.addChild(settingsButton);
	}
}

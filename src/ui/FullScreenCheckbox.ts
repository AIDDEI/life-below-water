// Import PIXI
import * as PIXI from "pixi.js";

// Import class
import { Sfx } from "../Sfx";

// Import Audio
import buttonClick from "url:../music/button_click.mp3";

// Export class
export class FullScreenCheckbox extends PIXI.Container {
	// Globals
	private checkBox: PIXI.Graphics;
	private isChecked: boolean;
	private localStorageKey: string;
	private originalWidth: number;
	private originalHeight: number;
	private pixi: PIXI.Application;
	private fullscreenChangeListener: () => void;
	private buttonClick: Sfx;

	// constructor
	constructor(localStorageKey: string, pixi: PIXI.Application) {
		super();

		// Set the localstorage key
		this.localStorageKey = localStorageKey;

		// Set the Pixi stage
		this.pixi = pixi;

		// Create checkbox and add it to the container
		this.checkBox = new PIXI.Graphics();
		this.addChild(this.checkBox);

		// Retrieve the checkbox state from localstorage
		const storedState = localStorage.getItem(this.localStorageKey);
		this.isChecked = storedState ? JSON.parse(storedState) : false;

		// Make the checkbox interactive
		this.checkBox.eventMode = "static";
		this.checkBox.cursor = "pointer";
		this.checkBox.on("pointerdown", this.onCheckboxClick, this);

		// Store the original size of the stage
		this.originalWidth = 800;
		this.originalHeight = 600;

		// Event listener for fullscreen
		this.fullscreenChangeListener = this.onFullscreenChange.bind(this);
		document.addEventListener(
			"fullscreenchange",
			this.fullscreenChangeListener
		);

		// Update the checkbox state
		this.updateCheckboxState();
	}

	// Checkbox click event handler
	private onCheckboxClick() {
		// Toggle the checkbox state
		this.isChecked = !this.isChecked;
		this.updateCheckboxState();

		// Play sound
		this.buttonClick = new Sfx(buttonClick);
		this.buttonClick.playSFX();

		// Save the checkbox state to localstorage
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.isChecked));
	}

	// Update the checkbox appearance based on its state
	private updateCheckboxState() {
		// Clear the graphics
		this.checkBox.clear();

		// Check if the checkbox is checked or not and select the right texture
		if (this.isChecked) {
			// If the checkbox is checked, make a green square
			this.checkBox.beginFill(0x00ff00);
			this.resizeToFullscreen();
		} else {
			// If the checkbox isn't checked, make the square red
			this.checkBox.beginFill(0xff0000);
			this.resizeToOriginalSize();
		}

		this.checkBox.drawRect(0, 0, 50, 50);
		this.checkBox.endFill();
	}

	// Resize the stage to fullscreen
	private resizeToFullscreen() {
		const renderer = this.pixi.renderer.view;

		if (renderer instanceof HTMLCanvasElement) {
			if (renderer.requestFullscreen) {
				renderer.requestFullscreen();
			}
		}

		this.pixi.stage.position.set(0, 0);
		this.scaleStageToFullscreen();
	}

	// Resize the stage to original size
	private resizeToOriginalSize() {
		document.exitFullscreen();
		this.pixi.stage.position.set(0, 0);
		this.pixi.stage.scale.set(1);
	}

	// Scale the stage to original scale
	private scaleStageToOriginalSize() {
		this.pixi.stage.scale.set(1);
	}

	// Fullscreen change event handler
	private onFullscreenChange() {
		if (document.fullscreenElement === null) {
			// If exiting fullscreen, scale stage to original size and update checkbox state
			this.scaleStageToOriginalSize();
			this.isChecked = false;
			this.updateCheckboxState();

			// Save the checkbox state to localstorage
			localStorage.setItem(
				this.localStorageKey,
				JSON.stringify(this.isChecked)
			);
		} else {
			// If entering fullscreen, scale stage to fullscreen
			this.scaleStageToFullscreen();
		}
	}

	// Scale the stage to fullscreen
	private scaleStageToFullscreen() {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const stageAspectRatio = this.originalWidth / this.originalHeight;
		const screenAspectRatio = screenWidth / screenHeight;

		let scaleWidth = 1;
		let scaleHeight = 1;
		let offsetX = 0;
		let offsetY = 0;

		if (screenAspectRatio > stageAspectRatio) {
			// Fit to width
			scaleWidth = screenWidth / this.originalWidth;
			scaleHeight = scaleWidth;
			offsetY = (screenHeight - scaleHeight * this.originalHeight) / 400;
		} else {
			// Fit to height
			scaleHeight = screenHeight / this.originalHeight;
			scaleWidth = scaleHeight;
			offsetX = (screenWidth - scaleWidth * this.originalWidth) / 2;
		}

		// Limit the maximum scale factor to 1
		const maxScale = Math.min(scaleWidth, scaleHeight, 1);
		scaleWidth = maxScale;
		scaleHeight = maxScale;

		// Set the position and scale
		this.pixi.stage.position.set(offsetX, offsetY);
		this.pixi.stage.scale.set(scaleWidth, scaleHeight);
	}

	// Destroy method to clean up event listeners
	destroy(options?: PIXI.IDestroyOptions | boolean) {
		document.removeEventListener(
			"fullscreenchange",
			this.fullscreenChangeListener
		);
		super.destroy(options);
	}
}

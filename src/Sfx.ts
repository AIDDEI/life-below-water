// Import PIXI
import * as PIXI from "pixi.js";

// Export Class
export class Sfx extends PIXI.Container {
	// Globals
	private audio: HTMLAudioElement;
	volume: number;

	// Constructor
	constructor(url: string, volume?: number) {
		super();
		// Give the audio the correct source
		this.audio = new Audio(url);
		this.volume = volume ? volume : 100;
	}

	public playSFX() {
		// Play audio
		this.audio.play();
		// Get the saved volume value
		const savedVolumeValue = this.getSavedVolumeValue() ?? 100;
		// Divide volume by 100 to get the right value
		const sfxVolume = (savedVolumeValue / 100) * this.volume;

		// Set the volume
		this.setVolume(sfxVolume);
		console.log(`Het SFX volume is ${sfxVolume}`);
	}

	private setVolume(volume: number) {
		// Check if the volume value is between 0 and 1
		if (volume >= 0 && volume <= 1) {
			// Set the volume
			this.audio.volume = volume;
		} else {
			// Get error
			console.error("Het volume value moet tussen de 0 en 1 zijn...");
		}
	}

	private getSavedVolumeValue(): number | null {
		// Get the saved sfx volume value and return it
		const savedValue = localStorage.getItem("SFXValue");
		return savedValue ? parseInt(savedValue, 10) : null;
	}
}

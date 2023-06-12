// Import PIXI
import * as PIXI from 'pixi.js';

// Export Class
export class Sfx extends PIXI.Container {
    // Globals
    private audio : HTMLAudioElement;

    // Constructor
    constructor(url : string) {
        super();
        // Give the audio the correct source
        this.audio = new Audio(url);
    }

    public playSFX() {
        // Play audio
        this.audio.play();
        // Get the saved volume value
        let volume = this.getSavedVolumeValue() ?? 100;
        // Divide volume by 100 to get the right value
        const sfxVolume = volume / 100;
        // Set the volume
        this.setVolume(sfxVolume);
        console.log(`Het SFX volume is ${sfxVolume}`);
    }

    private setVolume(volume: number) {
        // Check if the volume value is between 0 and 1
        if(volume >= 0 && volume <= 1){
            // Set the volume
            this.audio.volume = volume;
        } else {
            // Get error
            console.error('Het volume value moet tussen de 0 en 1 zijn...');
        }
    }

    private getSavedVolumeValue() : number | null {
        // Get the saved sfx volume value and return it
        const savedValue = localStorage.getItem('SFXValue');
        return savedValue ? parseInt(savedValue, 10) : null;
    }
 }
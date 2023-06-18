// Import PIXI
import * as PIXI from 'pixi.js';

// Export Class
export class Music extends PIXI.Container {
    // Globals
    private audio : HTMLAudioElement;
    private isAudioPlaying: boolean;
    
    // Constructor
    constructor(url: string) {
        super();
        // Give audio the right source
        this.audio = new Audio(url);

        // The audio is not playing
        this.isAudioPlaying = false;
    }

    public playAudio() {
        // Play audio
        this.audio.play();
        this.isAudioPlaying = true;

        // Get the volume value
        let volume = this.getSavedVolumeValue() ?? 100;
        // Divide by 100 to get the right value
        const musicVolume = volume / 100;
        // Set the volume
        this.setVolume(musicVolume);
        console.log(`Het muziek volume is ${musicVolume}`);
        // Loop the music
        this.audio.addEventListener('ended', function(){
            this.currentTime = 0;
            this.play();
        }, false);
    }

    private setVolume(volume : number) {
        // Check if the volume is between 0 and 1
        if(volume >= 0 && volume <= 1) {
            // Set the music volume
            this.audio.volume = volume;
        } else {
            // Show error
            console.error('Het volume value moet tussen de 0 en 1 zitten');
        }
    }

    private getSavedVolumeValue() : number | null {
        // Get the saved music volume value and return it
        const savedValue = localStorage.getItem('MusicValue');
        return savedValue ? parseInt(savedValue, 10) : null;
    }

    public stopAudio() {
        // Stop the audio
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isAudioPlaying = false;
    }

    public isPlaying() : boolean {
        return this.isAudioPlaying;
    }
}
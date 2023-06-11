// Import PIXI
import * as PIXI from 'pixi.js';
import { Slider } from '@pixi/ui';

// Custom Progress Bar
export class ProgressBar extends Slider {
    private fillSprite: PIXI.Sprite;

    constructor(options: any) {
        super(options);
        this.createFillSprite(options);
    }

    private createFillSprite(options: any) {
        // Create Fill Sprite
        this.fillSprite = new PIXI.Sprite(options.fill);
        this.fillSprite.anchor.set(0, 0.5);
        this.fillSprite.width = this.width * (this.value / 100);
        this.addChild(this.fillSprite);
    }

    public updateFillValue() {
        this.fillSprite.width = this.width * (this.value / 100);
    }
}
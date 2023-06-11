// Screen to make sure the player interacts with the document so that audio works

// Import PIXI
import * as PIXI from 'pixi.js';

// Import Classses
import { Button } from './Button';

// Export Class
export class StartScreen extends PIXI.Container {
    constructor(homeScreen : () => void) {
        super();

        // Create 'Start Canvas' button
        const startCanvasButton = new Button(50, 'Start', undefined, undefined, homeScreen);
        // Position the button
        startCanvasButton.position.set(
            (800 - startCanvasButton.width) / 2,
            (600 - startCanvasButton.height) / 2
        );
        // Add the button to the canvas
        this.addChild(startCanvasButton);
    }
}
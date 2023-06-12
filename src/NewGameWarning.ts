// Import PIXI
import * as PIXI from 'pixi.js';

// Import class
import { Button } from './Button';

// Export class
export class NewGameWarning extends PIXI.Container {
    constructor(homeScreen: () => void, newGame: () => void){
        super();

        // Get the Font size factor
        let savedFontSize = this.getSavedFontSize() ?? 10;
        // Divide by 10 to get the correct value
        const fontSizeFactor = savedFontSize / 10;

        // Create Header Text Style
        const headerTextStyle = new PIXI.TextStyle({
            fontSize: 20 * fontSizeFactor,
            fill: 'white',
            dropShadow: true,
            dropShadowAlpha: 1,
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 5,
            dropShadowDistance: 2,
        });

        // Create warning text
        const newGameWarningText = new PIXI.Text("Weet je zeker dat je een nieuw spel wilt beginnen?", headerTextStyle);
        // Position text
        newGameWarningText.position.set(
            (800 - newGameWarningText.width) / 2,
            (600 - newGameWarningText.height) / 2
        );
        // Add text to the canvas
        this.addChild(newGameWarningText);

        // Create warning text line 2
        const newGameWarningTextLineTwo = new PIXI.Text("Het opgeslagen bestand wordt overschreven...", headerTextStyle);
        // Position text
        newGameWarningTextLineTwo.position.set(
            (800 - newGameWarningTextLineTwo.width) / 2,
            (700 - newGameWarningTextLineTwo.height) / 2
        );
        // Add text to the canvas
        this.addChild(newGameWarningTextLineTwo);

        // Create cancel button
        const cancelButton = new Button(50, 'Annuleren', undefined, undefined, homeScreen);
        // Position the button
        cancelButton.position.set(
            (600 - cancelButton.width) / 2,
            (900 - cancelButton.height) / 2
        );
        // Add the button to the canvas
        this.addChild(cancelButton);

        // Create proceed button
        const proceedButton = new Button(50, 'Doorgaan', undefined, undefined, newGame);
        // Position the button
        proceedButton.position.set(
            (1000 - proceedButton.width) / 2,
            (900 - proceedButton.height) / 2
        );
        // Add the button to the canvas
        this.addChild(proceedButton);
    }

    private getSavedFontSize() : number | null {
        // Get the saved fontsize value and return it
        let savedFontSize = localStorage.getItem('FontSize');
        return savedFontSize ? parseInt(savedFontSize, 10) : null;
    }
}
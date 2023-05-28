import * as PIXI from 'pixi.js';
/**
 * Class for dynamic buttons
 *
 * @param h - height of the button (width is calculated automatically)
 * @param text - text to be displayed on the button
 * @param lineColor - color of the border of the button
 * @param buttonColor - color of the button
 * @param clickHandler - function to be called when the button is clicked
 * @example
 * const button = new Button(50, 'Click me!', 0xFFBD01, 0x336699, () => { console.log('clicked!') }); 
 * const button = new Button(undefined, 'Click me!', undefined, undefined, () => { console.log('clicked!') }); 
 *
 */
export class Button extends PIXI.Container {
    private button: PIXI.Graphics
    private label: PIXI.Text
    public w: number
    public h: number
    public text: string
    public textStyle: PIXI.TextStyle
    private lineColor: number
    private buttonColor: number
    private clickHandler?: () => void


    constructor(h: number, text: string, lineColor: number = 0xFFBD01, buttonColor: number = 0x336699, clickHandler?: () => void) {
        super();
        this.textStyle = new PIXI.TextStyle({
            fontSize: 20,
            fill: 'white',
        })
        this.button = new PIXI.Graphics();
        this.label = new PIXI.Text(text, this.textStyle);
        this.lineColor = lineColor;
        this.buttonColor = buttonColor;
        this.h = h;
        this.clickHandler = clickHandler;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.initButton();
        this.initLabel();
        this.setupEvents();
    }

    private initButton(): void {
        this.button = new PIXI.Graphics();
        this.button.lineStyle(4, this.lineColor);
        this.button.beginFill(this.buttonColor);
        this.button.drawRoundedRect(0, 0, this.label.width + 30, this.h, 3);
        this.button.endFill();
        // add button to container
        this.addChild(this.button);
    }

    private initLabel(): void {
        this.label.anchor.set(0.5);
        this.label.position.set((this.label.width + 30) / 2, this.h / 2);
        this.label.resolution = 2;
        // add label to button
        this.addChild(this.label);
    }

    private setupEvents(): void {
        this.onmouseover = () => {
            this.button.tint = 0xC9C9C9;
        }

        this.onmouseleave = () => {
            this.button.tint = 0xFFFFFF;
        }

        if (this.clickHandler) {
            this.onclick = () => {
                // @ts-expect-error Check if clickHandler is defined
                this.clickHandler();
            }
        }
    }
}
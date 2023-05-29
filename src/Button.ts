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
    private _label: PIXI.Text
    public w: number
    public h: number
    public text: string
    public textStyle: PIXI.TextStyle
    private lineColor: number
    private buttonColor: number
    private _clickHandler: (() => void) | undefined;

    constructor(h: number, text: string, lineColor: number = 0xFFBD01, buttonColor: number = 0x336699, clickHandler?: () => void) {
        super();
        this.textStyle = new PIXI.TextStyle({
            fontSize: 20,
            fill: 'white',
        })
        this.button = new PIXI.Graphics();
        this._label = new PIXI.Text(text, this.textStyle);
        this.lineColor = lineColor;
        this.buttonColor = buttonColor;
        this.h = h;
        this._clickHandler = clickHandler;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.initButton();
        this.initLabel();
        this.setupEvents();
    }

    public set label(text: string) {
        this._label.text = text;
    }

    public set clickHandler(clickHandler: () => void) {
        this._clickHandler = clickHandler;
    }

    private initButton(): void {
        this.button = new PIXI.Graphics();
        this.button.lineStyle(4, this.lineColor);
        this.button.beginFill(this.buttonColor);
        this.button.drawRoundedRect(0, 0, this._label.width + 30, this.h, 3);
        this.button.endFill();
        // add button to container
        this.addChild(this.button);
    }

    private initLabel(): void {
        this._label.anchor.set(0.5);
        this._label.position.set((this._label.width + 30) / 2, this.h / 2);
        this._label.resolution = 2;
        // add label to button
        this.addChild(this._label);
    }

    private setupEvents(): void {
        this.onmouseover = () => {
            this.button.tint = 0xC9C9C9;
        }

        this.onmouseleave = () => {
            this.button.tint = 0xFFFFFF;
        }

        if (this._clickHandler) {
            this.onclick = () => {
                // @ts-expect-error Check if clickHandler is defined is above
                this._clickHandler();
            }
        }
    }
}

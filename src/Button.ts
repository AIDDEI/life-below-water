import * as PIXI from 'pixi.js';

export class Button extends PIXI.Container {
    private button: PIXI.Graphics;
    private label: PIXI.Text;


    constructor(
        public w: number,
        public h: number,
        public text: string,
        private lineColor: number = 0xFFBD01,
        private textStyle: PIXI.TextStyle = new PIXI.TextStyle({
            fontSize: 20,
            fill: 'white',
        }),
        private buttonColor: number = 0x336699,
        private clickHandler?: () => void,
    ) {
        super();
        this.button = new PIXI.Graphics();
        this.label = new PIXI.Text(text, textStyle);
        this.lineColor = lineColor;
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

        this.addChild(this.button);
    }

    private initLabel(): void {
        this.label.anchor.set(0.5);
        this.label.position.set((this.label.width + 30) / 2, this.h / 2);
        this.label.resolution = 2;
        this.addChild(this.label);
    }


    private setupEvents(): void {
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.onmouseover = () => {
            this.button.tint = 0xC9C9C9;
        }

        this.onmouseleave = () => {
            this.button.tint = 0xFFFFFF;
        }

        if (this.clickHandler) {
            this.onclick = function () {
                this.clickHandler();
            }
        }
    }
}

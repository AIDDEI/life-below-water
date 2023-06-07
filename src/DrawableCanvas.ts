import * as PIXI from 'pixi.js';
import { DrawModel } from './DrawModel';
import { Game } from './game';


export class DrawableCanvas extends PIXI.Container {
    private graphics: PIXI.Graphics;
    private _isDrawing: boolean;
    private _lastPosition: PIXI.Point;
    private game: any;
    private _model: DrawModel
    private w: number;
    private h: number;

    constructor(game: Game, width: number = 2400, height: number = 600) {
        super();
        this.game = game;
        this._model = new DrawModel();
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.w = width;
        this.h = height;
        this.graphics.hitArea = new PIXI.Rectangle(0, 0, this.w, this.h);

        this._isDrawing = false;
        this._lastPosition = new PIXI.Point();
        this.eventMode = 'static';

        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointermove', this.onPointerMove, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);

        const clearButton = new PIXI.Graphics();
        clearButton.beginFill(0xFFFFFF);
        clearButton.drawRect(0, 0, 100, 50);
        clearButton.endFill();

        clearButton.position.set(0, 0);

        clearButton.eventMode = 'static';
        clearButton.on('pointerdown', () => {
            this.clearCanvas();
            console.log('clear');
        });

        this.addChild(clearButton);
    }

    private onPointerDown(event: PIXI.InteractionEvent): void {
        this._isDrawing = true;
        this._lastPosition.copyFrom(event.data.global);
        console.log('down');

    }

    private onPointerMove(event: PIXI.InteractionEvent): void {
        if (this._isDrawing) {
            // new smooth rounded line will be drawn
            const newPosition = event.data.global;
            this.graphics.lineTextureStyle({ width: 10, color: 0x000000, alpha: 1, alignment: 0.5, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND });
            this.graphics.moveTo(this._lastPosition.x, this._lastPosition.y);
            this.graphics.lineTo(newPosition.x, newPosition.y);

            this.graphics.endFill();

            this._lastPosition.copyFrom(newPosition);
        }
    }

    private onPointerUp(): void {
        this._isDrawing = false;
        this._saveCanvas();
    }

    private async _saveCanvas(): Promise<void> {

        for await (const player of this.game.players) {
            const playerPosition = player.getBounds();
            if (this._objectInside(playerPosition)) {
                let image = await this.game.pixi.renderer.extract.image(this.graphics);

                // create canvas to make it compatible for the model
                let canvas = document.createElement('canvas');
                canvas.width = 60;
                canvas.height = 60;
                let ctx = canvas.getContext('2d');

                if (!ctx) return
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, 60, 60);

                const result = await this._model.predict(canvas);

                // log for debug
                console.log(`I think you drew a ${result}`);

                // TODO, check if drawn shape is the same as the expected one then do something

                // Remove canvas, move player and break loop (we only care about the first)
                canvas.remove();
                player.move()

                break;
            } else {
                console.log('There is no player in your drawing')
            }
        }

        // clear the drawing
        this.graphics.clear();
    }

    private _objectInside(playerPosition: PIXI.Rectangle): boolean {
        return (this._lastPosition.x > playerPosition.x && this._lastPosition.x < playerPosition.x + playerPosition.width && this._lastPosition.y > playerPosition.y && this._lastPosition.y < playerPosition.y + playerPosition.height)
    }

    public clearCanvas(): void {
        this.graphics.clear();
    }

    public setXPivot(x: number): void {
        this.offset = x;
    }

}



import * as PIXI from 'pixi.js';
import { DrawModel } from './DrawModel';
import { Game } from './game';


export class DrawableCanvas extends PIXI.Container {
    private graphics: PIXI.Graphics;
    private isDrawing: boolean;
    private lastPosition: PIXI.Point;
    private game: any;
    private model: DrawModel

    constructor(game: Game) {
        super();
        this.game = game;
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
        this.model = new DrawModel(this, game);
        this.isDrawing = false;
        this.lastPosition = new PIXI.Point();

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
        this.isDrawing = true;
        this.lastPosition.copyFrom(event.data.global);
        console.log('down');
    }

    private onPointerMove(event: PIXI.InteractionEvent): void {
        if (this.isDrawing) {
            // new smooth rounded line will be drawn

            const newPosition = event.data.global;
            this.graphics.lineTextureStyle({ width: 10, color: 0x000000, alpha: 1, alignment: 0.5, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND });
            this.graphics.moveTo(this.lastPosition.x, this.lastPosition.y);
            this.graphics.lineTo(newPosition.x, newPosition.y);

            this.graphics.endFill();



            this.lastPosition.copyFrom(newPosition);
        }
    }

    private onPointerUp(): void {
        this.isDrawing = false;
        this.saveCanvas();
    }

    public async saveCanvas(): Promise<void> {
        // check if the thing drawn has the player in it 
        // if not, return
        // if so, send to model

        // global position 
        const playerPosition = this.game.player.getBounds();

        const playerInCanvas = this.lastPosition.x > playerPosition.x && this.lastPosition.x < playerPosition.x + playerPosition.width && this.lastPosition.y > playerPosition.y && this.lastPosition.y < playerPosition.y + playerPosition.height;


        if (!playerInCanvas) {
            console.log('player not in canvas');

        } else {
            let image = await this.game.pixi.renderer.extract.image(this.graphics);

            let canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, 60, 60);

            image = canvas;


            this.model.predict(image)
        }




    }


    public clearCanvas(): void {
        this.graphics.clear();
    }

    public resizeCanvas(width: number, height: number): void {
        this.graphics.clear();
        this.graphics.width = width;
        this.graphics.height = height;
        this.graphics.hitArea = new PIXI.Rectangle(0, 0, width, height);
    }


}



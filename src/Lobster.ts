import * as PIXI from 'pixi.js'

/**
 * Class for lobster object of the lob game
 *
 * @param minX (number) - minimum x position of the possible x positions within the water
 * @param maxX (number) - maximum x position of the possible x positions within the water
 * @param texture (PIXI.Texture) - texture of the lobster
 * @param isLob (boolean) - whether the lobster is catchable or not
 * @param  addPassedLob (function) - function to call when a lobster passes the screen without being caught
 * @param screenH (number) - height of the screen
 * @param i (number) - index of the lobster
 * 
 * @example
 * const lobster =  new Lobster(0, 100, texture, true, () => { console.log('passed!') }, this.game.pixi.screen.height)
 *
 */
export class Lobster extends PIXI.Sprite {
    public isLob: boolean
    private maxX: number
    private minX: number
    private addPassedLob: () => void
    private screenH: number
    private i: number
    private part: number

    constructor(minX: number, maxX: number, texture: PIXI.Texture, isLob: boolean, addPassedLob: () => void, screenH: number, i: number) {
        super(texture)
        this.minX = minX;
        this.i = i;
        this.maxX = maxX;
        this.anchor.set(0.5);
        this.rotation = Math.PI;
        this.scale.set(isLob ? 0.10 : 0.15);
        this.isLob = isLob;
        this.addPassedLob = addPassedLob;
        this.screenH = screenH;
        this.part = this.maxX / 5;
        this.x = this._initgetX();
        this.y = -100 - (this.i * 75);
    }


    private _initgetX() {
        // devide the screen in 5 parts 
        switch (this.i % 5) {
            case 0:
                return this.minX + this.part * 0;
            case 1:
                return this.minX + this.part * 3.5;
            case 2:
                return this.minX + this.part * 2;
            case 3:
                return this.minX + this.part * 1.5;
            case 4:
                return this.minX + this.part * 1;
            default:
                return this.minX + this.part * 3;
        }
    }

    private _getX() {
        // random x position within the screen
        return Math.random() * (this.maxX - this.minX) + this.minX;
    }

    /**
     * Updates the position of the lobster
     * @param delta (number) - time since last update
     * @example
     * lobster.update(0.1)
    */
    public update(delta: number): void {
        this.y += 1.5 * delta;

        if (this.y > this.screenH) {
            this.setPos();

            if (this.isLob) this.addPassedLob();
        }
    }

    private setPos(): void {
        this.y = -100 - (this.i * 75);
        this.x = this._getX();
    }

    public onHit(): void {
        this.setPos();
    }
}
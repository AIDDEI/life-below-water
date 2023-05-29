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
 * 
 * @example
 * const lobster =  new Lobster(0, 100, texture, true, () => { console.log('passed!') }, this.game.pixi.screen.height)
 *
 */
export class Lobster extends PIXI.Sprite {
    isLob: boolean
    maxX: number
    minX: number
    addPassedLob: () => void
    screenH: number

    constructor(minX: number, maxX: number, texture: PIXI.Texture, isLob: boolean, addPassedLob: () => void, screenH: number, i: number) {
        super(texture)
        this.minX = minX
        this.maxX = maxX
        this.anchor.set(0.5)
        this.rotation = Math.PI
        this.scale.set(isLob ? 0.15 : 0.10)
        this.isLob = isLob
        this.addPassedLob = addPassedLob
        this.setPos()
        this.screenH = screenH
        this.y = -50 - (i * 25)

    }

    private _getX() {
        return Math.random() * (this.maxX - this.minX) + this.minX;
    }


    /**
     * Updates the position of the lobster
     * @param delta (number) - time since last update
     * @example
     * lobster.update(0.1)
    */
    public update(delta: number): void {
        this.y += 1.5 * delta

        if (this.y > this.screenH) {
            this.setPos()

            if (this.isLob) this.addPassedLob()
        }
    }

    private setPos(): void {
        this.y = -50
        this.x = this._getX()
    }

    public onHit(): void {
        this.setPos()
    }
}
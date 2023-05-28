import * as PIXI from 'pixi.js'

export class Lobster extends PIXI.Sprite {
    isLob: boolean
    maxX: number
    minX: number
    addPassedLob: () => void
    screenH: number

    constructor(minX: number, maxX: number, texture: PIXI.Texture, isLob: boolean, addPassedLob: () => void, screenH: number) {
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

    }

    private getX() {
        return Math.random() * (this.maxX - this.minX) + this.minX;
    }

    public update(delta: number) {
        this.y += 1.5 * delta

        if (this.y > this.screenH) {
            this.setPos()

            if (this.isLob) this.addPassedLob()
        }
    }

    private setPos(): void {
        this.y = -100
        this.x = this.getX()
    }

    public onHit(): void {
        this.setPos()
    }
}
import * as PIXI from 'pixi.js'
import { Filter, Graphics } from 'pixi.js'

export class Player extends PIXI.Sprite {

    constructor(texture: PIXI.Texture) {
        super(texture)
        // random position from 200 to 800
        this.x = Math.floor(Math.random() * 600) + 200
        this.y = 200
        this.anchor.set(0.5)
        this.scale.set(0.5)
    }

    public move(x: number, y: number) {

        this.x = Math.floor(Math.random() * 600) + 200
        this.y = Math.floor(Math.random() * 400) + 200
    }

}


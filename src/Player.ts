import * as PIXI from 'pixi.js'
import { Filter, Graphics } from 'pixi.js'

export class Player extends PIXI.Sprite {

    constructor(texture: PIXI.Texture) {
        super(texture)
        this.x = 200
        this.y = 200
        this.anchor.set(0.5)
        this.scale.set(0.5)
    }
}


import { AnimatedSprite, FrameObject, Resource, Texture } from 'pixi.js'

export class Water extends AnimatedSprite {

    constructor(texture: Texture<Resource>[] | FrameObject[]) {
        super(texture)
        this.x = 200
        this.animationSpeed = 0.075 
        this.y = 200
        this.anchor.set(0.5)
        this.scale.set(0.5)
        this.play()
    }



}


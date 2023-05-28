import * as PIXI from 'pixi.js'

// I expect this to be needed elsewhere
export function collision(object1: PIXI.Sprite | PIXI.Graphics, object2: PIXI.Sprite | PIXI.Graphics) {
    const bounds1 = object1.getBounds()
    const bounds2 = object2.getBounds()

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}
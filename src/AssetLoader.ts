import * as PIXI from "pixi.js"
import { Game } from "./Game"

import sharkImage from "./images/dino.png"
import { Player } from "./Player"


export class AssetLoader {

    graphics: PIXI.Graphics
    game: Game
    // ??
    textures: any

    constructor(game: Game) {
        this.loadAssets()
        this.game = game

        PIXI.Assets.addBundle('Player', {
            'flowerTop': sharkImage,
            'eggHead': sharkImage,
        });

        PIXI.Assets.addBundle('Office', {
            'flowerTop2': sharkImage,
            'eggHead2': sharkImage,
        });

        PIXI.Assets.add('Crab', sharkImage)
        PIXI.Assets.add('Crab2', sharkImage)
    }

    public async loadAssets() {
        const bundlePromise = await PIXI.Assets.loadBundle(['Player', 'Office'])
        const texturePromise = await PIXI.Assets.load(['Crab', 'Crab2']);

        // give textures the right index using reduce 
        const textures = [bundlePromise, texturePromise]

        this.textures = textures.reduce((acc, val) => {
            return { ...acc, ...val }
        }, {})

        this.game.loadCompleted()

    }
}
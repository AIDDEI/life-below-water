import * as PIXI from "pixi.js"
import { Game } from "./Game"

import sharkImage from "./images/dino.png"
import mailbg from "./images/screenbg.png"
import mailIcon from "./images/mail.png"
import mailIconUnread from "./images/mailUnread.png"
import mailHeaderIcon from "./images/mailheaderIcon.png"
import rod from "./images/rod.png"
import lobBg from "./images/water.png"
import { Player } from "./Player"


export class AssetLoader {

    graphics: PIXI.Graphics
    game: Game
    textures: PIXI.Texture[]

    constructor(game: Game) {
        this.loadAssets()
        this.graphics = new PIXI.Graphics()
        game.pixi.stage.addChild(this.graphics)

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

        PIXI.Assets.addBundle('MailScreen', {
            'mailbg': mailbg,
            'mailIcon': mailIcon,
            'mailIconUnread': mailIconUnread,
            'mailHeaderIcon': mailHeaderIcon
        });

        PIXI.Assets.addBundle('Lobgame', {
            'catcher': rod,
            'lobbg': lobBg,
        });
    }

    public async loadAssets() {

        const bundlePromise = await PIXI.Assets.loadBundle(['Player', 'Office', 'MailScreen', 'Lobgame'], (progress) => { this.showProgress(progress) })
        const texturePromise = await PIXI.Assets.load(['Crab', 'Crab2'])

        // give textures the right index using reduce 
        const textures = [bundlePromise, texturePromise]

        this.textures = textures.reduce((acc, val) => {
            return { ...acc, ...val }
        }, {})
        this.graphics.destroy()
        this.game.loadCompleted()
    }

    private showProgress(progress: number) {
        console.log(`Loading ${progress * 100}%`)
        let offset = 50
        let barWidth = (this.game.pixi.screen.width - (offset * 2)) * (progress)

        this.graphics.clear()
        this.graphics.beginFill(0x32DE49)
        this.graphics.drawRect(offset, this.game.pixi.screen.height / 2 - 20, barWidth, 40)
        this.graphics.endFill()
    }
}
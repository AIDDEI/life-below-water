// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { MailList } from './MailList';


export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    private gameTexture: PIXI.Texture
    public mail: MailList
    private officeAssets: PIXI.Texture

    constructor() {
        // full screen application
        this.pixi = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 50 })

        document.body.appendChild(this.pixi.view)
        // Load images
        this.loader = new AssetLoader(this)
    }

    async loadCompleted() {
        console.log("Load completed")
        console.log(this.loader.textures)

        this.gameTexture = this.loader.textures.Player['flowerTop']
        this.officeAssets = this.loader.textures.Office
        console.log(this.officeAssets)

        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailList()
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.');
        this.mail.add('Mail 2', 'This is the second mail.');
        this.mail.add('Mail 3', 'This is the third mail.', true);
        this.mail.add('Mail 4', 'This is the third mail.');

    }
}

new Game();
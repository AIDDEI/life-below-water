// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { MailScreen } from './MailScreen';


export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    private gameTexture: PIXI.Texture
    public mail: MailScreen
    private officeAssets: PIXI.Texture

    constructor() {
        // full screen application
        this.pixi = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 50 })
        this.pixi.renderer.resolution = 1
        document.body.appendChild(this.pixi.view)
        // Load images
        this.loader = new AssetLoader(this)
    }

    async loadCompleted() {
        console.log("Load completed")
        console.log(this.loader.textures)

        this.gameTexture = this.loader.textures.Player['flowerTop']
        this.officeAssets = this.loader.textures.Office
 
        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailScreen()
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.', 0);
        this.mail.add('Mail 2', 'This is the second mail.', 0);
        this.mail.add('Mail 3', 'This is the third mail.', 1, true);
        this.mail.add('Mail 4', 'This is the third mail.', 0 );

    }
}

new Game();
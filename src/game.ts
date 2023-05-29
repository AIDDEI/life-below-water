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
    private mailAssets: PIXI.Texture[];

    constructor() {
        PIXI.settings.ROUND_PIXELS = true

        // init game
        this.pixi = new PIXI.Application({ autoDensity: true, resolution: window.devicePixelRatio })

        document.body.appendChild(this.pixi.view as HTMLCanvasElement)
        // Load images
        this.loader = new AssetLoader(this)
    }

    async loadCompleted() {
        console.log("Load completed")
        console.log(this.loader.textures)

        this.gameTexture = this.loader.textures.Player['flowerTop']
        this.officeAssets = this.loader.textures.Office
        this.mailAssets = this.loader.textures.MailScreen

        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailScreen(this.mailAssets, this)
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Lob lob lob', 'De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.', 0, true, 'lob');
        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.', 0, false, 'lob');
        this.mail.add('Mail 3', 'This is the third mail.', 0, false, 'lob');
        this.mail.add('Mail 4', 'This is the third mail.', 0);


    }
}

new Game();

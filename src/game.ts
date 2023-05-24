// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { MailScreen } from './MailScreen';
import { LobGame } from './LobGame';

export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    private gameTexture: PIXI.Texture
    public mail: MailScreen
    private officeAssets: PIXI.Texture
    private mailAssets: PIXI.Texture[];
    public lobGame: LobGame;
    private lobAssets: PIXI.Texture[];

    constructor() {
        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        // full screen application
        this.pixi = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 50, antialias: false })
        window.addEventListener('resize', () => { this.pixi.renderer.resize(window.innerWidth, window.innerHeight - 50) })
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
        this.lobAssets = this.loader.textures.Lobgame

        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailScreen(this.mailAssets, this)
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Doelstelling', 'De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.', 0, true);
        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.', 0);
        this.mail.add('Mail 3', 'This is the third mail.', 0);
        this.mail.add('Mail 4', 'This is the third mail.', 0);

        this.pixi.ticker.add((delta) => this.update(delta))
    }


    update(delta: number) {
        // this.player.update(delta)
        // this.mail.update(delta)
        if (this.lobGame) this.lobGame.update(delta)
    }

    public startGame() {
        this.lobGame = new LobGame(this.lobAssets, this);
        this.pixi.stage.addChild(this.lobGame);
    }
}

new Game();
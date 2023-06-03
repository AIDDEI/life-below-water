// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { MailScreen } from './MailScreen';
import { LobGame } from './LobGame';
import { DrawableCanvas } from './DrawableCanvas';
import DrawMode from './DrawModel';


export type AssetType = { [key: string]: PIXI.Texture<PIXI.Resource> }



export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    public mail: MailScreen
    private mailAssets: PIXI.Texture<PIXI.Resource>
    public lobGame: LobGame | undefined;
    private lobAssets: PIXI.Texture<PIXI.Resource>
    gameTexture: Texture<Resource>;
    players = [];
    constructor() {
        PIXI.settings.ROUND_PIXELS = true

        // init game
        this.pixi = new PIXI.Application({ autoDensity: true, resolution: window.devicePixelRatio, backgroundColor: 0x1099bb })

        document.body.appendChild(this.pixi.view as HTMLCanvasElement)
        // Load images
        this.loader = new AssetLoader(this)
    }

    async loadCompleted() {

        this.mailAssets = this.loader.textures.MailScreen
        this.lobAssets = this.loader.textures.Lobgame
        console.log(this.loader.textures)
        this.gameTexture = this.loader.textures.Crab



        this.mail = new MailScreen(this.mailAssets, this)
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Lob lob lob', 'De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.', 0, true, 'lob');
        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.', 0, false, 'lob');
        this.mail.add('Mail 3', 'This is the third mail.', 0, false, 'lob');
        this.mail.add('Mail 4', 'This is the third mail.', 0);

        this.pixi.ticker.add((delta) => this.update(delta))
        this.player = new Player(this.gameTexture)
        this.player2 = new Player(this.gameTexture)

        this.pixi.stage.addChild(this.player, this.player2)

        this.players.push(this.player, this.player2)
        this.mail.visible = false;
        const canvas = new DrawableCanvas(this)

        this.pixi.stage.addChild(canvas)


    }


    update(delta: number) {
        // this.player.update(delta)
        // this.mail.update(delta)

        if (this.lobGame?.active) this.lobGame.update(delta)


    }

    public startLobGame() {
        this.mail.visible = false;
        this.lobGame = new LobGame(this.lobAssets, this);
        this.pixi.stage.addChild(this.lobGame);

    }

    public endLobGame(score: number, reason: number): void {
        if (this.lobGame) this.pixi.stage.removeChild(this.lobGame);
        this.lobGame = undefined;
        this.mail.visible = true;
        this.mail.add('Lob lob lob', `End of lob. ${score}`, 0, true);
    }
}

new Game();


// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { MailScreen } from './MailScreen';

export type AssetType = { [key: string]: PIXI.Texture<PIXI.Resource> }


export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    public mail: MailScreen
    private mailAssets: PIXI.Texture<PIXI.Resource>
    public lobGame: LobGame | undefined;
    private lobAssets: PIXI.Texture<PIXI.Resource>

    constructor() {
        PIXI.settings.ROUND_PIXELS = true

        // init game
        this.pixi = new PIXI.Application({ autoDensity: true, resolution: window.devicePixelRatio })

        document.body.appendChild(this.pixi.view as HTMLCanvasElement)
        // Load images
        this.loader = new AssetLoader(this)
    }

    async loadCompleted() {
        this.mailAssets = this.loader.textures.MailScreen
        this.lobAssets = this.loader.textures.Lobgame

        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailScreen(this.mailAssets, this)
        this.pixi.stage.addChild(this.mail)

        this.mail.add('Lob lob lob', 'De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.', 0, true, 'lob');
        this.mail.add('Mail 1', 'This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.', 0, false, 'lob');
        this.mail.add('Mail 3', 'This is the third mail.', 0, false, 'lob');
        this.mail.add('Mail 4', 'This is the third mail.', 0);
        this.mail.add('Lob lob lob', `Minigame Salaris`, 1, true);

        this.pixi.ticker.add((delta) => this.update(delta))
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

    public endLobGame(score: number, reason: number, description: string): void {
        if (this.lobGame) this.pixi.stage.removeChild(this.lobGame);
        this.lobGame = undefined;
        this.mail.visible = true;
        this.mail.addResultsMail('Salaris Kreeftopdracht', `Door het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeterd`, 1, true, undefined, score, reason)
    }
}

new Game();
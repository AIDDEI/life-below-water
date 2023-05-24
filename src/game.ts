// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { NewGame } from './NewGame';

export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    public player: Player
    private gameTexture: PIXI.Texture
    private officeAssets: PIXI.Texture
    public newgame : NewGame

    constructor() {
        this.pixi = new PIXI.Application()
        document.body.appendChild(this.pixi.view)
        // Load images
        this.loader = new AssetLoader(this)
    }

    loadCompleted() {
        console.log("Load completed")
        console.log(this.loader.textures)

        this.gameTexture = this.loader.textures.Player['flowerTop']
        this.officeAssets = this.loader.textures.Office
        console.log(this.officeAssets)

        this.player = new Player(this.gameTexture)
        this.pixi.stage.addChild(this.player)

        this.newgame = new NewGame();
        this.pixi.stage.addChild(this.newgame);

    }
}

new Game();
// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { Clock } from './clock';
import { list } from './ToDoMenu'



export class Game {
    public pixi: PIXI.Application
    private loader: AssetLoader
    private clock: Clock
    private ToDoMenu: list
    public player: Player
    private gameTexture: PIXI.Texture
    private officeAssets: PIXI.Texture
    

    constructor() {
        this.pixi = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb
    })

        document.body.appendChild(this.pixi.view);

        this.stage = this.pixi.stage;
        // Load images
        this.loader = new AssetLoader(this);
        this.clock = new Clock(this);
    }

    loadCompleted() {
        console.log("Load completed")
        console.log(this.loader.textures)

        this.gameTexture = this.loader.textures.Player['flowerTop']
        this.gameTexture = this.loader.textures.UI['ToDoButton']
        this.officeAssets = this.loader.textures.Office
        console.log(this.officeAssets)

        this.player = new Player(this.gameTexture)
        this.pixi.stage.addChild(this.player)
    }
}

new Game();
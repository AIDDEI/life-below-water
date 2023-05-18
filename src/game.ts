// Import PIXI
import * as PIXI from 'pixi.js';

// Import Images
import background from "./images/background.png";
import start from "./images/menu_start.png";
import newGame from "./images/menu_nieuw.png";
import settings from "./images/menu_instellingen.png";

export class Game {
    // Globals
    private pixiWidth = 800;
    private pixiHeight = 400;
    private pixi : PIXI.Application;
    private loader : PIXI.Loader;

    constructor() {
        // Create PIXI stage
        this.pixi = new PIXI.Application({ width : this.pixiWidth, height : this.pixiHeight });
        this.pixi.stage.interactive = true;
        this.pixi.stage.hitArea = this.pixi.renderer.screen;
        document.body.appendChild(this.pixi.view);

        // Create loader

        this.loader = new PIXI.Loader();
        this.loader
            .add('backgroundTexture', background)
            .add('startTexture', start)
            .add('newGameTexture', newGame)
            .add('settingsTexture', settings);
        this.loader.load(()=> this.loadCompleted());
    }

    private loadCompleted() {
        // Add background
        let background = new PIXI.Sprite(this.loader.resources['backgroundTexture'].texture!);
        this.pixi.stage.addChild(background);
        background.width = 800;
        background.height = 450;

        // Add start button
        let start = new PIXI.Sprite(this.loader.resources['startTexture'].texture!);
        this.pixi.stage.addChild(start);
        start.interactive = true;
        start.buttonMode = true;
        start.anchor.set(0.5);
        start.y = 32.5;
        start.x = 400;

        // Add new game button
        let newGame = new PIXI.Sprite(this.loader.resources['newGameTexture'].texture!);
        this.pixi.stage.addChild(newGame);
        newGame.interactive = true;
        newGame.buttonMode = true;
        newGame.anchor.set(0.5);
        newGame.y = 110;
        newGame.x = 400;

        // Add settings button
        let settings = new PIXI.Sprite(this.loader.resources['settingsTexture'].texture!);
        this.pixi.stage.addChild(settings);
        settings.interactive = true;
        settings.buttonMode = true;
        settings.anchor.set(0.5);
        settings.y = 187.5;
        settings.x = 400;
    }
}

new Game();
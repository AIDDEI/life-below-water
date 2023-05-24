// Import PIXI
import * as PIXI from 'pixi.js';

// Import Classes
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';

export class Game {
    // Globals
    public pixi: PIXI.Application;
    private loader: AssetLoader;
    public player: Player;

    constructor() {
        // Create new Pixi Application and add it to the body
        this.pixi = new PIXI.Application();
        this.pixi.stage.eventMode = 'static';
        document.body.appendChild(this.pixi.view as unknown as HTMLElement);

        // Load images through the loader
        this.loader = new AssetLoader(this);
    }

    loadCompleted() {
        // Console logs
        console.log("Load completed");
        console.log(this.loader.textures);


        // Adding background to the application stage
        let background = new PIXI.Sprite(this.loader.textures.StartMenu['background']);
        this.pixi.stage.addChild(background);


        // Adding the start button
        let startButton = new PIXI.Sprite(this.loader.textures.StartMenu['startButton']);
        // Making the button interactive
        startButton.eventMode = 'static';
        // Add a click event and make the cursor go in pointer mode
        startButton.cursor = 'pointer';
        startButton.on('pointerdown', this.startGame);
        // Positioning the button
        startButton.anchor.set(0.5);
        startButton.x = 400;
        startButton.y = 238.37;
        // Add the button to the stage
        this.pixi.stage.addChild(startButton);

        
        // Adding the new game button
        let newButton = new PIXI.Sprite(this.loader.textures.StartMenu['newButton']);
        // Making the button interactive
        newButton.eventMode = 'static';
        // Add a click event and make the cursor go in pointer mode
        newButton.cursor = 'pointer';
        newButton.on('pointerdown', this.newGame);
        // Positioning the button
        newButton.anchor.set(0.5);
        newButton.x = 400;
        newButton.y = 356.37;
        // Add the button to the stage
        this.pixi.stage.addChild(newButton);


        // Adding the settings button
        let settingsButton = new PIXI.Sprite(this.loader.textures.StartMenu['settingsButton']);
        // Making the button interactive
        settingsButton.eventMode = 'static';
        // Add a click event and make the cursor go in pointer mode
        settingsButton.cursor = 'pointer';
        settingsButton.on('pointerdown', this.settings);
        // Positioning the button
        settingsButton.anchor.set(0.5);
        settingsButton.x = 400;
        settingsButton.y = 485.37;
        // Add the button to the stage
        this.pixi.stage.addChild(settingsButton);
    }

    startGame() {
        console.log("Start Game!");
    }

    newGame() {
        console.log("Start New Game!");
    }

    settings() {
        console.log("Go to settings!");
    }
}

new Game();
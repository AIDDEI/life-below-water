// Import PIXI
import * as PIXI from "pixi.js";

// Import Game
import { Game } from "./game";

// Import Images
import startBackground from "./images/startBackground.png";
import startBackgroundBlur from "./images/startBackgroundBlur.png";
import settingsBorder from "./images/settings_border.png";

// Export class
export class AssetLoader {
    // Globals
    graphics: PIXI.Graphics;
    game: Game;
    textures: any;

    // Constructor
    constructor(game: Game) {
        this.loadAssets();
        this.game = game;

        PIXI.Assets.addBundle('StartMenu', {
            'background': startBackground,
            'backgroundBlur': startBackgroundBlur,
            'settingsBorder': settingsBorder,
        });
    }

    public async loadAssets() {
        const bundlePromise = await PIXI.Assets.loadBundle(['StartMenu']);

        // give textures the right index using reduce 
        const textures = [bundlePromise];

        this.textures = textures.reduce((acc, val) => {
            return { ...acc, ...val }
        }, {});

        this.game.loadCompleted();
    }
}
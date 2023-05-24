import * as PIXI from "pixi.js";
import { Game } from "./game";

import startBackground from "./images/startBackground.png";
import startStart from "./images/startknop.png";
import startNew from "./images/nieuwspelknop.png";
import startSettings from "./images/instellingenknop.png";

export class AssetLoader {

    graphics: PIXI.Graphics;
    game: Game;
    textures: any;

    constructor(game: Game) {
        this.loadAssets();
        this.game = game;

        PIXI.Assets.addBundle('StartMenu', {
            'background': startBackground,
            'startButton': startStart,
            'newButton': startNew,
            'settingsButton': startSettings,
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
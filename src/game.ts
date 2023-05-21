// Import PIXI
import * as PIXI from 'pixi.js';

export class Game {
    // private pixi : PIXI.Application;
    // private loader : PIXI.Loader;

    constructor() {
        const pixi = new PIXI.Application<HTMLCanvasElement>({width : 800, height : 450});
        document.body.appendChild(pixi.view);
    }
}

new Game();
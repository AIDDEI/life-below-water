// Import PIXI
import * as PIXI from 'pixi.js';

// Import Images
import background from "./images/background.png";
import startGame from "./images/menu_start.png";
import newGame from "./images/menu_nieuw.png";
import settings from "./images/menu_instellingen.png";

export class Game {
    constructor() {
        const pixi = new PIXI.Application<HTMLCanvasElement>({width : 800, height: 450});
        document.body.appendChild(pixi.view);
    }
}

new Game();
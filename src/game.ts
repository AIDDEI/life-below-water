// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { PopUp } from './tip-popUp';

export class Game {
  public pixi: PIXI.Application
  private loader: AssetLoader
  public player: Player
  private gameTexture: PIXI.Texture
  private officeAssets: PIXI.Texture
  private popUp: PopUp

  constructor() {
    this.pixi = new PIXI.Application()
    document.body.appendChild(this.pixi.view)
    // Load images
    this.loader = new AssetLoader(this)
    this.popUp = new PopUp(this.pixi);
    
  }

  loadCompleted() {
    console.log("Load completed")
    console.log(this.loader.textures)

    // this.gameTexture = this.loader.textures.Player['flowerTop']
    this.officeAssets = this.loader.textures.Office
    console.log(this.officeAssets)

    this.player = new Player(this.gameTexture)
    this.pixi.stage.addChild(this.player)
    this.pixi.stage.addChild(this.popUp.container)

    const openButton = new PIXI.Graphics();
    openButton.beginFill(0xffffff);
    openButton.drawRect(-70, -70, 100, 50);
    openButton.endFill();
    openButton.interactive = true;
    openButton.buttonMode = true;
    openButton.x = 100;
    openButton.y = 100;
    this.pixi.stage.addChild(openButton);

    openButton.on("click", () => {
      this.popUp.open();
    });

    this.popUp.addTip("De waterkwaliteit is omhoog gegaan");
    this.popUp.addTip("De dijken zijn nu zwakker");
    this.popUp.addTip("Placeholder tekst");
  }
}

new Game();

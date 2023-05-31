// Import PIXI
import * as PIXI from 'pixi.js';
import { AssetLoader } from './AssetLoader';
import { Player } from './Player';
import { Clock } from './clock';
import { ToDoMenu } from './ToDoMenu';

export class Game {
  public pixi: PIXI.Application;
  private loader: AssetLoader;
  private clock: Clock;
  public toDoMenu: ToDoMenu;
  public player: Player;
  private gameTexture: PIXI.Texture;
  private officeAssets: PIXI.Texture;
//   private toDoButton: PIXI.Sprite;

  constructor() {
    this.pixi = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    document.body.appendChild(this.pixi.view);

    // Laad afbeeldingen
    this.loader = new AssetLoader(this);
    this.clock = new Clock(this);
    this.toDoMenu = new ToDoMenu();
  }

  loadCompleted() {
    console.log("Load completed");
    console.log(this.loader.textures);

    // this.gameTexture = this.loader.textures.Player['flowerTop'];
    this.officeAssets = this.loader.textures.Office;
    console.log(this.officeAssets);

    this.player = new Player(this.gameTexture);
    this.pixi.stage.addChild(this.player);

    // this.toDoButton = new PIXI.Sprite(this.loader.textures.UI['ToDoButton']);
    this.toDoButton.position.set(100, 100);
    this.toDoButton.interactive = true;
    this.toDoButton.buttonMode = true;
    this.toDoButton.scale.set(0.5);

    this.toDoButton.on('click', () => {
      console.log('ToDoButton is geklikt!');
      this.toDoMenu.show();
    });

    this.pixi.stage.addChild(this.toDoButton);
  }
}

new Game();


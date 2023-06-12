import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { AssetType, Game } from "./game";

import mailIcon from "./images/mail.png";
import mailIconUnread from "./images/mailUnread.png";
import mailHeaderIcon from "./images/mailheaderIcon.png";
import desk from "./images/desk.jpg";
import border from "./images/border.png";
import rod from "./images/rod.png";
import lobBg from "./images/grass.png";
import water from "./images/water.jpg";
import displacement from "./images/displacement.jpg";
import lobster from "./images/lobster.png";
import heart from "./images/heart.png";
import instructions from "./images/instructions.png";
import browser from "./images/browser.png";
import browserWindowBG from "./images/browserWindow.png";


export class AssetLoader {
	graphics: PIXI.Graphics;
	game: Game;
	textures: AssetType;

  constructor(game: Game) {
    this.loadAssets();
    this.graphics = new PIXI.Graphics();
    game.pixi.stage.addChild(this.graphics);

    this.game = game;


		PIXI.Assets.addBundle("Player", {
			flowerTop: sharkImage,
			eggHead: sharkImage,
		});

		PIXI.Assets.addBundle("Office", {
			flowerTop2: sharkImage,
			eggHead2: sharkImage,
		});

		PIXI.Assets.add("Crab", sharkImage);
		PIXI.Assets.add("Crab2", sharkImage);
		PIXI.Assets.add("browser", browser);

		PIXI.Assets.addBundle("MailScreen", {
			mailIcon: mailIcon,
			mailIconUnread: mailIconUnread,
			mailHeaderIcon: mailHeaderIcon,
		});

		PIXI.Assets.addBundle("DayScreen", {
			daybg: desk,
			border: border,
		});

		PIXI.Assets.addBundle("Lobgame", {
			catcher: rod,
			lobbg: lobBg,
			water: water,
			displacement: displacement,
			lobster: lobster,
			heart: heart,
			instructions: instructions,
		});
	}

    PIXI.Assets.addBundle("QualityScreen", {
      browserWindowBG: browserWindowBG,
    });
  }

  public async loadAssets() {
    const bundlePromise = await PIXI.Assets.loadBundle(
      ["Player", "Office", "MailScreen", "Lobgame", "DayScreen", "QualityScreen"],
      (progress) => {
        this.showProgress(progress);
      }
    );
    const texturePromise = await PIXI.Assets.load(["Crab", "Crab2", "browser"]);

    // give textures the right index using reduce
    const textures = [bundlePromise, texturePromise];

    this.textures = textures.reduce((acc, val) => {
      return { ...acc, ...val };
    }, {});
    this.graphics.destroy();
    this.game.loadCompleted();
  }


  private showProgress(progress: number) {
    console.log(`Loading ${progress * 100}%`);
    let offset = 50;
    let barWidth = (this.game.pixi.screen.width - offset * 2) * progress;

    this.graphics.clear();
    this.graphics.beginFill(0x32de49);
    this.graphics.drawRect(
      offset,
      this.game.pixi.screen.height / 2 - 20,
      barWidth,
      40
    );
    this.graphics.endFill();
  }
}
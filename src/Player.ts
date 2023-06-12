import * as PIXI from "pixi.js";
import { AnimatedSprite, Texture } from "pixi.js";

export class Player extends PIXI.Sprite {
	public shape: any;
	private seconds: number;
	waterTexture: PIXI.AnimatedSprite;

	constructor(texture: PIXI.Texture, waterTexture: PIXI.AnimatedSprite, posx = 0, posy = 0) {
		super(texture);
		this.waterTexture = waterTexture;

		this.anchor.set(0.5);
		this.scale.set(0.5);
		// random position from 200 to 2400 - this.width / 2

		this.x = posx;
		// y value between 200 and 600
		this.y = posy;
		console.log(this.x, this.y);
		this.shape = this._getRandomShape();

		this.seconds = Math.floor(Math.random() * 8) + 12;
		this.alpha = 0;
	}

	public move(x: number, y: number) {
		this.alpha = 1;
		this.texture = Texture.EMPTY;
		this.test = new AnimatedSprite(this.waterTexture);
		this.test.anchor.set(0.5);
		this.test.scale.set(0.5);
		this.test.animationSpeed = 0.15;
		this.test.play();
		this.test.loop = false;
		this.addChild(this.test);

		this.test.onComplete = () => {
			this.destroy();
		};
	}

	private _getRandomShape() {
		const shapes = ["circle", "square", "triangle"];

		const shape = shapes[Math.floor(Math.random() * shapes.length)];

		// set tint  to random color based on shape
		switch (shape) {
			case "circle":
				this.tint = 0xff0000;
				break;
			case "square":
				this.tint = 0x00ff00;
				break;
			case "triangle":
				this.tint = 0x0000ff;
				break;
		}

		return shape;
	}

	public update() {
		// change opacity from 0 to 1 in  8 - 15 seconds

		if (this.alpha < 1) {
			this.alpha += 1 / (60 * this.seconds);
		} else {
			this.alpha = 1;
		}
	}
}

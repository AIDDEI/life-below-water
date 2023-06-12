import { AnimatedSprite, Sprite, Texture } from "pixi.js";

export class Player extends Sprite {
	public shape: string;
	private seconds: number;
	private waterAnimation: AnimatedSprite;
	private waterTexture: AnimatedSprite;

	constructor(texture: Texture, waterTexture: AnimatedSprite, posx = 0, posy = 0) {
		super(texture);
		this.waterTexture = waterTexture;
		this.anchor.set(0.5);
		this.scale.set(0.5);
		this.x = posx;
		this.y = posy;
		console.log(this.x, this.y);
		this.shape = this._getRandomShape();
		// seconds to change opacity from 0 to 1, between 8 and 15 seconds
		this.seconds = Math.floor(Math.random() * 8) + 15;
		this.alpha = 0;
	}

	public move(x: number, y: number) {
		this.alpha = 1;
		this.texture = Texture.EMPTY;
		this.waterAnimation = new AnimatedSprite(this.waterTexture);
		this.waterAnimation.anchor.set(0.5);
		this.waterAnimation.scale.set(0.5);
		this.waterAnimation.animationSpeed = 0.15;
		this.waterAnimation.play();
		this.waterAnimation.loop = false;
		this.addChild(this.waterAnimation);

		this.waterAnimation.onComplete = () => {
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

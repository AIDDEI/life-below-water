import { AnimatedSprite, Sprite, Texture } from "pixi.js";

// import sound
import waterSound from "url:./music/water.mp3";
import missedShapeSound from "url:./music/badCatch.mp3";
import { AlgaeGame } from "./AlgaeGame";
import { Sfx } from "./Sfx";

export class Player extends Sprite {
	public shape: string;
	private seconds: number;
	private waterAnimation: AnimatedSprite;
	private waterTexture: AnimatedSprite;
	public missed: boolean;
	private waterSound: Sfx;
	private minigame: AlgaeGame;
	private missedShapeSound: Sfx;

	constructor(textures: Texture, waterTexture: AnimatedSprite, minigame: AlgaeGame, posx = 0, posy = 0) {
		super();
		this.waterTexture = waterTexture;
		this.anchor.set(0.5);
		this.missedShapeSound = new Sfx(missedShapeSound, 0.75);
		this.waterSound = new Sfx(waterSound, 0.75);
		this.minigame = minigame;
		this.missed = false;
		this.x = posx;
		this.y = posy;
		this.textures = textures;
		this.shape = this._getRandomShape();
		// seconds to change opacity from 0 to 1, between 8 and 15 seconds
		this.seconds = Math.floor(Math.random() * 8) + 8;
		this.alpha = 0;
	}

	public move() {
		this.alpha = 1;
		this.texture = Texture.EMPTY;
		this.waterAnimation = new AnimatedSprite(this.waterTexture);
		this.waterAnimation.anchor.set(0.5);
		this.waterAnimation.scale.set(0.25);
		this.waterAnimation.animationSpeed = 0.15;
		this.waterAnimation.play();
		this.waterAnimation.loop = false;
		this.waterSound.playSFX();
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
				this.texture = this.textures.textures["Alg-Circle"];
				break;
			case "square":
				this.texture = this.textures.textures["Alg-Square"];
				break;
			case "triangle":
				this.texture = this.textures.textures["Alg-Triangle"];
				break;
		}

		return shape;
	}

	public update(delta: number) {
		if (this.missed) return;
		// change opacity from 0 to 1 in  8 - 15 seconds

		if (this.alpha < 1) {
			this.alpha += (1 / (60 * this.seconds)) * delta;
		} else {
			this.alpha = 1;
		}

		if (this.alpha >= 1) {
			this.texture = this.textures.textures["Alg-Missed"];
			this.alpha = 0.5;
			this.missed = true;
			this.minigame.lives--;
			this.missedShapeSound.playSFX();
		}
	}
}

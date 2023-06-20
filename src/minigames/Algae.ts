import {
	AnimatedSprite,
	Circle,
	Container,
	Graphics,
	Resource,
	Sprite,
	Text,
	Texture,
} from "pixi.js";

// import sound
import waterSound from "url:../music/water.mp3";
import missedShapeSound from "url:../music/badCatch.mp3";
import { AlgaeGame } from "./AlgaeGame";
import { Sfx } from "../Sfx";

export class Algae extends Sprite {
	public shape: string;
	private seconds: number;
	private waterAnimation: AnimatedSprite;
	private waterTexture: any;
	public missed: boolean;
	private waterSound: Sfx;
	private minigame: AlgaeGame;
	private textures: any;
	private missedShapeSound: Sfx;
	private timer: any;
	private secondsPassed: number;
	private counter: number;

	constructor(
		textures: any,
		waterTexture: any,
		minigame: AlgaeGame,
		posx = 0,
		posy = 0
	) {
		super();
		this.waterTexture = waterTexture;
		this.anchor.set(0.5);
		this.counter = 0;
		this.missedShapeSound = new Sfx(missedShapeSound, 0.75);
		this.waterSound = new Sfx(waterSound, 0.75);
		this.minigame = minigame;
		this.missed = false;
		this.x = posx;
		this.y = posy;
		this.secondsPassed = 0;
		this.textures = textures;
		this.shape = this._getRandomShape();
		// seconds to change opacity from 0 to 1, between 10 and 22 seconds
		this.seconds = Math.floor(Math.random() * 12) + 10;
		this.alpha = 0;
		this.timer = new Container();
		this.timer.x = -75;
		this.timer.y = -50;
		this.addChild(this.timer);
	}

	public onCorrectShape() {
		if (this.timer) this.timer.destroy();

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
		// timer that logs every second
		this.counter += delta;
		if (this.counter >= 60) {
			this.counter = 0;
			this.secondsPassed++;
		}

		// if this.seconds - this.secondsPassed <= 3, count down
		if (this.seconds - this.secondsPassed <= 3 && this.counter == 0) {
			if (this.timer) this.timer.removeChildren();

			const circle = new Graphics();
			circle.beginFill(0x000000);
			circle.drawCircle(0, 0, 25);
			circle.endFill();

			// fill 3 = yellow, 2 = orange, 1 = red
			const timerText = new Text(`${this.seconds - this.secondsPassed}`, {
				fontFamily: "Arial",
				fontSize: 36,
				fill:
					this.seconds - this.secondsPassed == 3
						? 0xffff00
						: this.seconds - this.secondsPassed == 2
						? 0xffa500
						: 0xff0000,
				fontWeight: "bold",
			});
			timerText.x = circle.x - timerText.width / 2;
			timerText.y = circle.y - timerText.height / 2;

			this.timer.addChild(circle, timerText);
		}

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

			this.timer.destroy();
		}
	}
}

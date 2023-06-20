import * as PIXI from "pixi.js";
import { Game } from "../game";
import { Lobster } from "./Lobster";
import { Minigame } from "./Minigame";
import { collision } from "../Utils";

// import sounds
import { Sfx } from "../Sfx";
import collectSound from "url:../music/collect.mp3";
import badCollectSound from "url:../music/badCatch.mp3";
import { Graphics, Texture } from "pixi.js";

/**
 * Class for Lob game. Expects a game object and assets object. After game is finished, it will call the callback function in the game class.
 *
 * @param game - height of the button (width is calculated automatically)
 * @param assets - text to be displayed on the button
 */
export class LobGame extends Minigame {
	public catcher: PIXI.Sprite;
	public hitArea: PIXI.Rectangle;
	private accelleration: number = 0;
	public lobsters: Lobster[] = [];
	private netbox: PIXI.Graphics;
	private displacement: PIXI.Sprite;
	private displacementFilter: PIXI.DisplacementFilter;
	private water: PIXI.Sprite;
	private toggle: any;
	private waterContainer: any;
	private assets: Texture[];
	private bg: PIXI.Sprite;
	private instructions: PIXI.Sprite;
	private collectSound: Sfx;
	private badCollectSound: Sfx;

	constructor(assets: Texture[], game: Game) {
		super(game, assets, 15);
		this.assets = assets;
		this.game = game;
		this.y = 0;
		this.visible = false;
		this.hitArea = new PIXI.Rectangle(
			0,
			0,
			window.innerWidth,
			window.innerHeight
		);
		this.eventMode = "auto";

		// Set up UI
		this._setupBackground();
		this._initSounds();
		this._setupWater();
		this._setupItems();
		this._setupSideButtons();
		this._setupEvents();
		this._setupFilter();
		super.addScore();
		this._setupInstructions();
		super.addLives();
		// init instructions
		this.initInstructions(() => {
			this.startGame();
		}, "Vang de KLEINE kreeftjes door de muis te bewegen of door de \n<- pijltjestoetsen -> te gebruiken. \n\nJe hebt 3 levens. Je verliest een leven als je een verkeerde kreeft raakt of er een mist. \n\nSucces!");
	}

	private _initSounds(): void {
		this.collectSound = new Sfx(collectSound);
		this.badCollectSound = new Sfx(badCollectSound);
	}

	private startGame(): void {
		this._setupLobsters();
	}

	private _setupWater(): void {
		this.water = new PIXI.Sprite(this.assets.water);
		this.water.width = 500;
		this.water.height = this.game.pixi.screen.height;
		this.water.x = this.game.pixi.screen.width / 2 - this.water.width / 2;
		this.waterContainer = new PIXI.Container();
		this.waterContainer.eventMode = "static";
		this.waterContainer.cursor = "pointer";
		this.waterContainer.hitArea = new PIXI.Rectangle(
			this.water.position.x,
			this.water.height - 140,
			this.water.width,
			140
		);
		this.addChild(this.waterContainer);
		this.waterContainer.addChild(this.water);
	}

	private _setupBackground(): void {
		this.bg = new PIXI.Sprite(this.assets.lobbg);
		this.bg.width = this.game.pixi.screen.width;
		this.bg.height = this.game.pixi.screen.height;
		this.addChild(this.bg);
	}

	private _setupInstructions(): void {
		this.instructions = new PIXI.Sprite(this.assets.instructions);
		this.instructions.x = 10;
		this.instructions.rotation = -0.1;
		this.instructions.y = 100;
		this.instructions.scale.set(0.95);
		this.addChild(this.instructions);
	}

	private _setupSideButtons(): void {
		const ruleButton = super.createRulesButton();

		this.toggle = new PIXI.Graphics();
		this.addChild(this.toggle);
		this.toggle.eventMode = "static";
		this.toggle.cursor = "pointer";
		this.toggle.beginFill(0xffffff);
		this.toggle.drawRect(0, 0, 25, 25);
		this.toggle.endFill();

		// text with "Stop filters"
		const text = new PIXI.Text("Zet filters uit", {
			fontFamily: "Arial",
			fontSize: 12,
			fill: "white",
			align: "center",
		});

		text.anchor.set(0.5);
		text.position.set(this.toggle.x - this.toggle.width - 15, 10);

		const cross = new PIXI.Graphics();
		cross.lineStyle(2, 0xff0000);
		cross.moveTo(0, 0);
		cross.lineTo(25, 25);
		cross.moveTo(25, 0);
		cross.lineTo(0, 25);

		this.toggle.x = this.game.pixi.screen.width - 30;
		this.toggle.y = 10;

		this.toggle.addChild(text, cross);
		this.toggle.position.set(
			this.game.pixi.screen.width - this.toggle.width / 2,
			ruleButton.y + ruleButton.height + 10
		);
	}

	private onKeyDown(e: KeyboardEvent): void {
		if (e.key === "ArrowLeft") {
			this.accelleration = -5;
		}
		if (e.key === "ArrowRight") {
			this.accelleration = 5;
		}
	}

	private onKeyUp(e: KeyboardEvent): void {
		this.accelleration = 0;
	}

	public takeLive(): void {
		this.lives--;
		this.badCollectSound.playSFX();
		this.catcher.tint = "rgba(255, 0, 0, 0.5)";

		setTimeout(() => {
			if (this.catcher.tint == "rgba(0, 255, 0, 0.5)") return;
			this.catcher.tint = 0xffffff;
		}, 1000);
	}

	private _onMissedLob(): void {
		this.takeLive();

		// white pill red text "gemist"
		const missedLobContainer = new Graphics();
		missedLobContainer.beginFill(0xffffff);
		missedLobContainer.lineStyle(2, 0xff0000);
		missedLobContainer.drawRect(0, 0, 100, 35);
		missedLobContainer.endFill();
		missedLobContainer.position.set(
			this.game.pixi.screen.width / 2 - missedLobContainer.width / 2,
			this.waterContainer.hitArea.y - 50
		);

		const missedLobText = new PIXI.Text("Gemist!", {
			fontFamily: "Arial",
			fontSize: 24,
			fill: "red",
			align: "center",
		});

		missedLobText.anchor.set(0.5);
		missedLobText.position.set(
			missedLobContainer.width / 2,
			missedLobContainer.height / 2
		);

		missedLobContainer.addChild(missedLobText);
		this.addChild(missedLobContainer);

		setTimeout(() => {
			this.removeChild(missedLobContainer);
		}, 1500);
	}

	public update(delta: number) {
		if (!this.active) return;

		this.displacement.y -= 1 * delta;

		if (this.lives < 1 || this.score >= this.scoreGoal) {
			const reason = this.lives < 1 ? 0 : 1;
			super.endGame(reason, () => this.game.endLobGame(reason));
		}

		for (let lobster of this.lobsters) {
			lobster.update(delta);

			if (collision(this.netbox, lobster)) {
				if (lobster.isLob) {
					this.score++;
					this.collectSound.playSFX();
					this.catcher.tint = "rgba(0, 255, 0, 0.5)";

					setTimeout(() => {
						if (this.catcher.tint == "rgba(255, 0, 0, 0.5)") return;
						this.catcher.tint = 0xffffff;
					}, 1000);
				} else {
					this.takeLive();
				}
				lobster.onHit();
			}
		}

		if (this.displacement.x > this.displacement.width) this.displacement.x = 0;

		// left side boundery of the field
		if (
			this.catcher.x + this.accelleration >
			this.waterContainer.getBounds().left
		) {
			this.catcher.x = this.catcher.x + this.accelleration * delta;
			this.netbox.x = this.catcher.x;
		}

		// if catcher is at the right side of the field (right side of hitbox hits the edge of the field)
		if (
			this.catcher.x + this.accelleration >
			this.waterContainer.getBounds().right - this.netbox.width
		) {
			this.catcher.x =
				this.waterContainer.getBounds().right - this.netbox.width;
			this.netbox.x = this.waterContainer.getBounds().right - this.netbox.width;
		}
	}

	private _setupFilter(): void {
		this.displacement = new PIXI.Sprite(this.assets.displacement);
		this.displacementFilter = new PIXI.DisplacementFilter(this.displacement);
		this.displacement.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		this.waterContainer.filters = [this.displacementFilter];
		this.displacement.scale.set(0.5);
		this.addChild(this.displacement);
	}

	private _setupItems(): void {
		this.catcher = new PIXI.Sprite(this.assets.catcher);
		this.catcher.anchor.x = 0.6;

		//draw the netbox, it'll be invis
		this.netbox = new PIXI.Graphics()
			.beginFill(0x000000)
			.drawRect(
				0,
				this.waterContainer.hitArea.y - this.catcher.height / 2 + 50 + 38,
				this.catcher.width / 2 - 30,
				30
			)
			.endFill();
		this.netbox.alpha = 0;

		// draw hitarea
		const hitArea = new PIXI.Graphics()
			.beginFill(0xffffff)
			.drawRect(
				this.waterContainer.hitArea.x,
				this.waterContainer.hitArea.y,
				this.waterContainer.hitArea.width,
				this.waterContainer.hitArea.height
			)
			.endFill();
		hitArea.alpha = 0.5;

		this.catcher.y =
			this.waterContainer.hitArea.y - this.catcher.height / 2 + 50;
		this.catcher.x =
			this.waterContainer.hitArea.x +
			this.waterContainer.hitArea.width / 2 -
			this.catcher.width / 2;

		this.addChild(hitArea, this.catcher, this.netbox);
	}

	private _setupEvents(): void {
		// Follow the pointer
		this.waterContainer.on(
			"pointermove",
			(event: PIXI.FederatedPointerEvent) => {
				if (
					event.global.x >
					this.waterContainer.getBounds().right - this.netbox.width
				) {
					this.catcher.x =
						this.waterContainer.getBounds().right - this.netbox.width;
					this.netbox.x =
						this.waterContainer.getBounds().right - this.netbox.width;
				} else {
					this.catcher.x = event.global.x;
					this.netbox.x = event.global.x;
				}
			}
		);

		this.toggle.onclick = () => {
			this.toggleFilter();
		};

		window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
		window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e));
	}

	private _setupLobsters(): void {
		for (let i = 0; i < 6; i++) {
			// 2 seconds between each lobster, 7 to 3 catchable ones

			console.log("spawn lobster");
			this.spawnLobster(i % 3 === 0, i);
		}
	}

	private toggleFilter(): void {
		const text = this.toggle.getChildAt(0) as PIXI.Text;

		this.waterContainer.filters =
			this.waterContainer.filters.length > 0 ? [] : [this.displacementFilter];

		if (this.waterContainer.filters.length > 0) {
			const cross = new PIXI.Graphics();
			// draw red cross of the checkbox
			cross.lineStyle(2, 0xff0000);
			cross.moveTo(0, 0);
			cross.lineTo(25, 25);
			cross.moveTo(25, 0);
			cross.lineTo(0, 25);
			this.toggle.addChild(cross);
			text.text = "Zet filters uit";
		} else {
			// remove cross
			this.toggle.removeChildAt(1);
			text.text = "Zet filters aan";
		}
	}

	private spawnLobster(isLob: boolean, i: number): void {
		const lobster = new Lobster(
			this.water.position.x + 25,
			this.water.position.x + this.water.width - 25,
			this.assets.lobster,
			isLob,
			this._onMissedLob.bind(this),
			this.game.pixi.screen.height,
			i
		);
		this.lobsters.push(lobster);
		this.waterContainer.addChild(lobster);
	}
}

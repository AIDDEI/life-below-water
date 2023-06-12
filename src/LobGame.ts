import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { AssetType, Game } from "./game";
import { Lobster } from "./Lobster";
import { Minigame } from "./Minigame";
import { collision } from "./Utils";

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
    private score: number = 0;
    public lobsters: Lobster[] = [];
    private netbox: PIXI.Graphics;
    private displacement: PIXI.Sprite;
    private displacementFilter: PIXI.DisplacementFilter;
    private water: PIXI.Sprite;
    private toggle: any;
    private waterContainer: any;
    private lives: number = 3;
    private assets: AssetType;
    private scoreText: PIXI.Text;
    private SCOREGOAL: number = 15;
    private livesContainer: PIXI.Container;
    private bg: PIXI.Sprite;
    private instructions: PIXI.Sprite;
    private rules: Button;


    constructor(assets: AssetType, game: Game) {
        super(game);
        this.assets = assets;
        this.game = game;
        this.y = 0;
        this.active = false;
        this.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
        this.eventMode = "auto";

        // Set up UI 
        this._setupBackground();
        this._setupWater();
        this._setupItems();
        this._setupSideButtons();
        this._setupEvents();
        this._setupFilter();
        this._setupScore();
        this._setupInstructions();
        this._setupLiveContainer();
        // init instructions
        this.initInstructions(() => { this.startGame() }, "Vang de KLEINE kreeftjes door de muis te bewegen of door de \n<- pijltjestoetsen -> te gebruiken. \n\nJe hebt 3 levens. Je verliest een leven als je een verkeerde kreeft raakt of er een mist. \n\nSucces!");
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
        this.waterContainer.hitArea = new PIXI.Rectangle(this.water.position.x, this.water.height - 140, this.water.width, 140);
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

    private _setupScore(): void {
        this.scoreText = new PIXI.Text(`Score: 0 / ${this.SCOREGOAL}`, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white",
            align: "center",
        });
        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.game.pixi.screen.width / 2;
        this.scoreText.y = 20;
        this.addChild(this.scoreText);
    }

    private _setupLiveContainer() {
        this.livesContainer = new PIXI.Container();
        this.addChild(this.livesContainer);

        for (let i = 0; i < this.lives; i++) {
            const heart = new PIXI.Sprite(this.assets.heart)
            heart.scale.set(0.25);
            heart.x = this.water.x + heart.width * i;
            heart.y = 0;
            heart.position.set(heart.width * i, this.scoreText.height);
            this.livesContainer.addChild(heart);
        }

        this.livesContainer.position.set(this.game.pixi.screen.width / 2 - this.livesContainer.width / 2, this.scoreText.height - 20);
    }

    private _setupSideButtons(): void {
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

        text.x = this.toggle.x - this.toggle.width - 15;
        text.y = 10;
        this.toggle.addChild(text);

        this.toggle.hitArea = this.toggle.getBounds();

        const cross = new PIXI.Graphics();
        cross.lineStyle(2, 0xff0000);
        cross.moveTo(0, 0);
        cross.lineTo(25, 25);
        cross.moveTo(25, 0);
        cross.lineTo(0, 25);

        this.toggle.addChild(cross);
        this.toggle.x = this.game.pixi.screen.width - 30;
        this.toggle.y = 10;

        this.rules = new Button(30, "Uitleg", undefined, undefined, () => { this.showRules() });
        this.rules.x = this.toggle.x - this.rules.width + 25;
        this.rules.y = this.toggle.y + this.toggle.height + 10;
        this.addChild(this.rules);
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
        this.updateLivesContainer()
    }

    public update(delta: number) {
        if (!this.active) return;

        this.displacement.y -= 1 * delta;

        if (this.lives < 1 || this.score >= this.SCOREGOAL) {
            const reason = this.lives < 1 ? 0 : 1
            this.game.endLobGame(this.score, reason);
        }

        for (let lobster of this.lobsters) {
            lobster.update(delta);

            if (collision(this.netbox, lobster)) {
                if (lobster.isLob) {
                    this.score++;
                } else {
                    this.takeLive();
                }
                lobster.onHit()
                this.updateScore();
            }
        }

        if (this.displacement.x > this.displacement.width) this.displacement.x = 0;

        // left side boundery of the field
        if (this.catcher.x + this.accelleration > this.waterContainer.getBounds().left) {
            this.catcher.x = this.catcher.x + this.accelleration * delta;
            this.netbox.x = this.catcher.x
        }

        // if catcher is at the right side of the field (right side of hitbox hits the edge of the field)
        if (this.catcher.x + this.accelleration > this.waterContainer.getBounds().right - this.netbox.width) {
            this.catcher.x = this.waterContainer.getBounds().right - this.netbox.width
            this.netbox.x = this.waterContainer.getBounds().right - this.netbox.width
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

        this.catcher.y = this.waterContainer.hitArea.y - this.catcher.height / 2 + 50;
        this.catcher.x = this.waterContainer.hitArea.x + this.waterContainer.hitArea.width / 2 - this.catcher.width / 2;

        this.addChild(hitArea, this.catcher, this.netbox);
    }

    private _setupEvents(): void {
        // Follow the pointer
        this.waterContainer.on("pointermove", (event: PIXI.FederatedPointerEvent) => {
            if (event.global.x > this.waterContainer.getBounds().right - this.netbox.width) {
                this.catcher.x = this.waterContainer.getBounds().right - this.netbox.width
                this.netbox.x = this.waterContainer.getBounds().right - this.netbox.width
            } else {
                this.catcher.x = event.global.x;
                this.netbox.x = event.global.x;
            }
        });

        this.toggle.onclick = () => {
            this.toggleFilter();
        };

        this.rules.onclick = () => {
            this.showRules();
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

    private updateScore(): void {
        const score = this.scoreText
        score.text = `Score: ${this.score} / ${this.SCOREGOAL}`;
    }

    private toggleFilter(): void {
        const text = this.toggle.getChildAt(0) as PIXI.Text;

        this.waterContainer.filters = this.waterContainer.filters.length > 0 ? [] : [this.displacementFilter];

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
            this.takeLive.bind(this),
            this.game.pixi.screen.height,
            i
        );
        this.lobsters.push(lobster);
        this.waterContainer.addChild(lobster);
    }

    private updateLivesContainer() {
        this.livesContainer.removeChildAt(this.livesContainer.children.length - 1)
        this.livesContainer.position.set(this.game.pixi.screen.width / 2 - this.livesContainer.width / 2, this.scoreText.height - 20)
    }
}
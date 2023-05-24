import * as PIXI from 'pixi.js'
import { Filter, Graphics } from 'pixi.js'
import { Game } from './Game'

export class LobGame extends PIXI.Container {
    private container: PIXI.Container
    public catcher: PIXI.Sprite
    private eventMode: string
    public hitArea: PIXI.Rectangle
    private cursor: string
    private direction: number = 0
    private game: Game
    private bg: PIXI.Sprite
    private netbox: PIXI.Graphics

    constructor(assets: { [key: string]: PIXI.Texture }, game: Game) {
        super()
        this.x = 0
        this.y = 0
        this.bg = new PIXI.Sprite(assets.lobbg)
        this.bg.scale.set(0.5)
        this.bg.height = window.innerHeight
        this.bg.position.set(window.innerWidth / 2 - this.bg.width / 2, 0)
        this.hitArea = new PIXI.Rectangle(this.bg.x, this.bg.height - 250, this.bg.width, 250);
        this.catcher = new PIXI.Sprite(assets.catcher)
        this.catcher.anchor.set(0.5)
        this.catcher.scale.set(0.25)
        this.catcher.rotation = 1.5
        this.game = game
        this.eventMode = 'static';
        this.cursor = 'pointer';

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
        this.setupItems()
        this.setupEvents()
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.key === "ArrowLeft") {
            this.direction = -5
        }
        if (e.key === "ArrowRight") {
            this.direction = 5
        }
    }

    private onKeyUp(e: KeyboardEvent): void {
        this.direction = 0
    }

    public update(delta: number) {
        if (this.catcher.x + this.direction < this.hitArea.x + this.hitArea.width && this.netbox.getBounds().left + this.direction > this.hitArea.x) {
            this.catcher.x = this.catcher.x + this.direction;
            this.netbox.x = this.catcher.x + this.direction;
        }
    }

    private setupItems(): void {
        //color the netbox
        this.netbox = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRect(this.catcher.x + 12, this.catcher.y - 55, this.catcher.width * 0.5, 30)
            .endFill()
        this.netbox.alpha = 0.5

        // draw hitarea 
        const hitArea = new PIXI.Graphics()
            .beginFill(0xFFFFFF)
            .drawRect(this.hitArea.x, this.hitArea.y, this.hitArea.width, this.hitArea.height)
            .endFill()
        hitArea.alpha = 0.5

        this.catcher.position.set(window.innerWidth / 2, this.hitArea.y + this.hitArea.height / 2)
        this.netbox.position.set(1500, this.catcher.y)

        this.addChild(this.bg, hitArea, this.catcher, this.netbox)
    }

    private setupEvents(): void {
        // Follow the pointer
        this.on('pointermove', (event) => {
            this.catcher.x = event.data.global.x
            this.netbox.x = event.data.global.x
        })
    }
}
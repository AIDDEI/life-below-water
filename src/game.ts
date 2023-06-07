// Import PIXI
import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { Player } from "./Player";
import { MailScreen } from "./MailScreen";
import { WaterParam } from "./WaterParam";
import { DrawableCanvas } from "./DrawableCanvas";
import { Water } from "./Water";
import { Graphics } from "pixi.js";
// import { WaterModel } from "./WaterModel";

export class Game {
    public pixi: PIXI.Application;
    private loader: AssetLoader;
    public player: Player;
    private gameTexture: PIXI.Texture;
    public mail: MailScreen;
    private officeAssets: PIXI.Texture;
    private mailAssets: PIXI.Texture[];

    //water parameters related
    public waterParameters: WaterParam[];
    private waterParamA: WaterParam;
    private waterParamB: WaterParam;
    private waterParamC: WaterParam;
    player2: Player;
    players: any;
    // public waterModel: WaterModel;

    constructor() {
        PIXI.settings.ROUND_PIXELS = true;

        // init game
        this.pixi = new PIXI.Application({
            autoDensity: true,
            resolution: window.devicePixelRatio,
            width: 800,
            height: 600,
            backgroundColor: 0xFFFFFF
        });
        this.players = []
        document.body.appendChild(this.pixi.view as HTMLCanvasElement);
        // Load images
        this.loader = new AssetLoader(this);

        this.waterParamA = new WaterParam("Parameter A", "parameter_a", -1, 1);
        this.waterParamB = new WaterParam("Parameter B", "parameter_b", 100, 11);
        this.waterParamC = new WaterParam(
            "Parameter C",
            "parameter_c",
            624,
            20,
            500,
            700
        );
    }

    loadCompleted() {
        console.log("Load completed");
        console.log(this.loader.textures);

        this.gameTexture = this.loader.textures.Player["flowerTop"];
        this.officeAssets = this.loader.textures.Office;
        this.mailAssets = this.loader.textures.MailScreen;
        this.waterTexture = this.loader.textures.spritesheet.animations["swoosh"]


        // this.player = new Player(this.gameTexture)
        // this.pixi.stage.addChild(this.player)

        this.mail = new MailScreen(this.mailAssets, this);
        this.pixi.stage.addChild(this.mail);
        this.mail.visible = false;
        this.mail.add(
            "Lob lob lob",
            "De zomer is aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren.",
            0,
            true,
            "lob"
        );
        this.mail.add(
            "Mail 1",
            "This is the first maiwadawdawdwad wdmwaidmwa idmawid dadwad wl.",
            0,
            false,
            "lob"
        );
        this.mail.add("Mail 3", "This is the third mail.", 0, false, "lob");
        this.mail.add("Mail 4", "This is the third mail.", 0);

        this.player = new Player(this.gameTexture)
        this.player2 = new Player(this.gameTexture)


        this.players.push(this.player, this.player2)





        const canvas = new DrawableCanvas(this)

        this.pixi.stage.addChild(canvas)
        // ticker

        this.graphicsContainer = new PIXI.Container();
        // draw 3 rectangles different colors width 800 height 600
        for (let i = 0; i < 3; i++) {
            const graphics = new PIXI.Graphics();
            const color = i === 0 ? 0xff0000 : i === 1 ? 0xC9C9C9 : 0x00ff00;
            graphics.beginFill(color);

            graphics.drawRect(800 * i, 0, 800, 600);
            graphics.endFill();

            this.graphicsContainer.addChild(graphics);

        }
        this.pixi.stage.addChild(this.graphicsContainer);
        this.graphicsContainer.pivot.x = 1600;
        // draw 2 circles at x = 400, y = 300


        // circle 
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawCircle(400, 300, 50);
        graphics.endFill();

        this.pixi.stage.addChild(graphics);


        const draw = new DrawableCanvas(this);


        this.pixi.stage.addChild(draw);

        this.pixi.ticker.add(this.update);

        // draw left and right arrow at the edges of the screen
        const leftArrow = new PIXI.Graphics();
        leftArrow.beginFill(0x000000);
        leftArrow.drawPolygon([0, 0, 20, 10, 0, 20]);
        leftArrow.endFill();
        leftArrow.x = 0;
        leftArrow.y = 300;
        this.pixi.stage.addChild(leftArrow);

        leftArrow.eventMode = 'static'
        leftArrow.cursor = 'pointer'
        leftArrow.hitArea = new PIXI.Rectangle(0, 0, 20, 20)
        leftArrow.onclick = () => {
            console.log(this.graphicsContainer.pivot.x)
            if (this.graphicsContainer.pivot.x > 0) {
                this.graphicsContainer.pivot.x -= 800
            }
        }


        const rightArrow = new PIXI.Graphics();
        rightArrow.beginFill(0x000000);
        rightArrow.drawPolygon([0, 0, 20, 10, 0, 20]);
        rightArrow.endFill();
        rightArrow.x = 780;
        rightArrow.y = 300;

        rightArrow.eventMode = 'static'
        rightArrow.cursor = 'pointer'
        rightArrow.hitArea = new PIXI.Rectangle(0, 0, 20, 20)
        rightArrow.onclick = () => {
            console.log(this.graphicsContainer.pivot.x)
            if (this.graphicsContainer.pivot.x < this.graphicsContainer.width - 800) {
                this.graphicsContainer.pivot.x += 800
            }
        }
        this.pixi.stage.addChild(rightArrow);

        this.graphicsContainer.addChild(this.player, this.player2)
    }

    public update = (delta: number) => {


    }

}

new Game();

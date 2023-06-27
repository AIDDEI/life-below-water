import * as PIXI from "pixi.js";
import { AssetType, Game } from "../game";

export class Map extends PIXI.Container {
	private game: Game;
	private assets: AssetType;
	private mapContainer: PIXI.Container;
	private map: PIXI.Sprite;
	private farmer: PIXI.Sprite;
	private lob: PIXI.Sprite;

	constructor(assets: AssetType, game: Game) {
		super();
		this.assets = assets;
		this.game = game;

		this.mapContainer = new PIXI.Container();
		this.addChild(this.mapContainer);

		this.map = new PIXI.Sprite(this.assets.map);
		this.map.width = 800;
		this.map.height = 600;

		const mapWidth = this.game.pixi.screen.width;
		const mapHeight = this.game.pixi.screen.height;

		this.mapContainer.width = this.game.pixi.screen.width;
		this.mapContainer.height = this.game.pixi.screen.height;

		const maskGraphics = new PIXI.Graphics();
		maskGraphics.beginFill(0x000000);
		maskGraphics.drawRect(0, 0, mapWidth, mapHeight);
		maskGraphics.endFill();

		this.mapContainer.mask = maskGraphics;

		this.mapContainer.addChild(this.map);

		this.mapContainer.x = (this.game.pixi.screen.width - mapWidth) / 2;
		this.mapContainer.y = (this.game.pixi.screen.height - mapHeight + 200) / 2;

		this.farmer = new PIXI.Sprite(this.assets.farmerIcon);
		this.farmer.scale.set(0.5);
		this.farmer.x = 500;
		this.farmer.y = 250;

		this.farmer.interactive = true;
		this.farmer.cursor = "pointer";
		this.farmer.on("click", this.onFarmerClick.bind(this));
		this.farmer.on("mouseover", this.onFarmerMouseOver.bind(this));
		this.farmer.on("mouseout", this.onFarmerMouseOut.bind(this));

		this.lob = new PIXI.Sprite(this.assets.lobIcon);
		this.lob.scale.set(0.3);
		this.lob.x = 300;
		this.lob.y = 450;

		this.lob.interactive = true;
		this.lob.cursor = "pointer";
		this.lob.on("click", this.onlobClick.bind(this));
		this.lob.on("mouseover", this.onlobMouseOver.bind(this));
		this.lob.on("mouseout", this.onlobMouseOut.bind(this));

		this.addChild(this.farmer, this.lob);
		this.close();
	}

	// events for farmer icon
	private onFarmerClick() {
		this.game.mail.add(
			"Overleg boeren",
			"Uit watermonsters is gebleken dat er te veel stikstof en forfor in het oppervlaktewater zit. Dit komt doordat er te veel meststoffen in het water zitten. \n\nUit onderzoek is gebleken uit welk gebied de meeste vervuiling komt. Ga met de boeren in gesprek en denk na over de beste oplossing. \n\nEr kan onder andere een mestvrije zone langs de rivier worden aangelegd. De boeren moeten hier wel mee akkoord gaan. Als we niks doen, verslechterd het water alleen maar meer maar wordt er meer door de boeren verdiend. ",
			0,
			true,
			"boer"
		);

		this.game.browser.openTab = 1;
		this.farmer.destroy();
	}

	private onFarmerMouseOver() {
		this.farmer.scale.set(0.6);
	}

	private onFarmerMouseOut() {
		this.farmer.scale.set(0.5);
	}

	// events for lobster icon
	private onlobClick() {
		// Add mails to the tab
		this.game.mail.add(
			"Lob lob lob",
			"De zomer is in aantocht het beloofd een warme en droge zomer te worden. Ons doel is om onze inwoners schoon en veilig zwemwater te kunnen bieden. Zodat zij het hoofd koel kunnen houden! \n\nJouw doel voor de komende week is; de waterkwaliteit verbeteren",
			0,
			true,
			"lob"
		);

		this.game.browser.openTab = 1;
		this.lob.destroy();
	}

	private onlobMouseOver() {
		this.lob.scale.set(0.4);
	}

	private onlobMouseOut() {
		this.lob.scale.set(0.3);
	}

	public close() {
		this.visible = false;
	}

	public open() {
		this.visible = true;
		this.game.pixi.renderer.background.color = 0x0000ff;
	}
}

import * as PIXI from "pixi.js";
import { AssetType, Game } from "../game";

export class Map extends PIXI.Container {
	private game: Game;
	private assets: AssetType;
	private mapContainer: PIXI.Container;
	private map: PIXI.Sprite;
	private farmer: PIXI.Sprite;
	private lob: PIXI.Sprite;
	alg: PIXI.Sprite;

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
		this.farmer.scale.set(0.7);
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
		this.lob.eventMode = 'static'
		this.lob.on("click", this.onlobClick.bind(this));
		this.lob.on("mouseover", this.onlobMouseOver.bind(this));
		this.lob.on("mouseout", this.onlobMouseOut.bind(this));


		this.alg = new PIXI.Sprite(this.assets.algIcon);
		this.alg.scale.set(0.7);
		this.alg.x = 600;
		this.alg.y = 420;
		this.alg.eventMode = 'static'
		this.alg.on("click", this.onAlgClick.bind(this));
		this.alg.on("mouseover", this.onAlgIn.bind(this));
		this.alg.on("mouseout", this.onAlgOut.bind(this));

		this.addChild(this.farmer, this.lob, this.alg);
		this.close();
	}

	private onAlgClick() {
		this.game.mail.add(
			"Algenoverlast",
			"Na het afnemen van monsters blijkt dat er veel blauwalg in het water zit. Blauwalg komt voor wanneer er veel voedingsstoffen in het water zitten, het langdurig warm is ( 20-30 graden) en wanneer het water niet goed doorstroomt. \n\nBlauwalg kan, wanneer je er in aanraking mee komt, zorgen voor huidirritatie en wanneer je het binnenkrijgt, zorgen voor darm- en maagklachten. Een manier om blauwalg te voorkomen is de doorstroming van het water in gang te houden. Hierdoor wordt de drijflaag verspreid en verdwijnt doorgaans de overlast. \n\nAan jou de taak om de doorstroming in gang te zetten.",
			0,
			true,
			"alg"
		);

		this.game.browser.openTab = 1;
	}

	private onAlgIn() {
		this.alg.scale.set(0.8);
	}

	private onAlgOut() {
		this.alg.scale.set(0.7);
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

	}

	private onFarmerMouseOver() {
		this.farmer.scale.set(0.8);
	}

	private onFarmerMouseOut() {
		this.farmer.scale.set(0.7);
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

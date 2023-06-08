import { Container, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { MailScreen } from "./MailScreen";

/**
 * Class for the browser container and tabs
 *
 * @param texture - texture for the background of the browser
 *
 * @example
 *  const browser = new Browser(PIXI.Texture.from('browser.png'))
 *
 */
export class Browser extends Container {
	private tabContainer: Container;
	private _openTab: number;
	private _lastOpenTab: number;
	private bgContainer: any;
	private _tabs: any;
	private _searchBarText: Text;

	constructor(texture: Texture) {
		super();
		this.x = 0;
		this.y = 0;
		this.tabContainer = new Container();
		this.tabContainer.x = 0;
		this.tabContainer.y = 10;
		// nothing open by default
		this._openTab = -1;
		this._lastOpenTab = -1;
		this._searchBarText = new Text("", {
			fontFamily: "Arial",
			fontSize: 18,
			fill: 0x000000,
			align: "center",
		});
		this._searchBarText.x = 185;
		this._searchBarText.y = 66;
		this._tabs = [];
		this._setUpBackground(texture);
		this.addChild(this._searchBarText, this.tabContainer);
	}

	private _setUpBackground(texture: Texture) {
		const bgTexture = new Sprite(texture);
		this.bgContainer = new Container();

		bgTexture.x = 0;
		bgTexture.y = 0;
		bgTexture.width = 800;
		bgTexture.height = 600;

		this.bgContainer.addChild(bgTexture);
		this.addChild(this.bgContainer);
	}

	/**
	 * function to add a browser tab
	 * @param tabName (string) - name of the tab
	 * @param screen (opional | component) - screen to be rendered when the tab is clicked. MUST have public open and public close methods
	 *
	 *  Renders the tab and adds the screen to the browser
	 *
	 * @example
	 *  this.browser.addTab('Mail', this.mail)
	 *  this.browser.addTab('Placeholder', undefined)
	 */
	// TODO: add types of the screens that are expected to be added
	public addTab(tabName: string, screen: MailScreen | any) {
		if ((screen && screen.open == undefined) || (screen && screen.close == undefined)) return console.error("Invalid screen! Must have public open and public close methods");
		if (this._tabs.length >= 5) return console.error("Too many tabs! 5 is the maximum");

		this._tabs.push({ tabName: tabName, screen: screen });

		if (screen) this.addChild(screen);

		this._renderTabs();
	}

	private _renderTabs() {
		this._tabs.forEach((tab: any, i: number) => {
			const tabContainer = new Container();

			tabContainer.x = 15 + 75 * i;
			tabContainer.hitArea = new Rectangle(tabContainer.x, this.tabContainer.y, 140, 30);
			tabContainer.eventMode = "static";

			const tabBackground = new Graphics();
			// if the tab is open, fill it with white, otherwise fill it with grey
			const fill = i === this._openTab ? 0xffffff : 0x929292;
			tabBackground.beginFill(fill);
			tabBackground.drawRoundedRect(tabContainer.x, 10, 140, 30, 3);
			tabBackground.endFill();
			tabContainer.addChild(tabBackground);

			const tabText = new Text(tab.tabName, {
				fontFamily: "Arial",
				fontSize: 18,
				fill: 0x000000,
				align: "center",
			});

			tabText.x = tabContainer.x + 10;
			tabText.y = 10 + 30 / 2 - tabText.height / 2;

			// x to the right of the tab
			const x = new Text("x", {
				fontFamily: "Arial",
				fontSize: 15,
				fill: 0x000000,
				align: "center",
			});

			x.x = tabContainer.x + tabContainer.width - 20;
			x.y = 10 + 30 / 2 - x.height / 2;

			tabBackground.addChild(tabText, x);
			this.tabContainer.addChild(tabContainer);

			// if placehlder, don't add event listeners
			if (!tab.screen) return;

			tabContainer.cursor = "pointer";

			// add event listeners
			tabContainer.onclick = () => {
				if (i === this._openTab) return;
				this.openTab = i;
			};

			if (i !== this._openTab) {
				tabContainer.onmouseover = () => {
					// tint over tab
					tabBackground.tint = 0xc9c9c9;
				};

				tabContainer.onmouseout = () => {
					// remove tint over tab
					tabBackground.tint = 0xffffff;
				};
			}
		});
	}

	public set openTab(tab: number) {
		if (this._tabs[tab]?.screen === undefined) {
			console.error("Invalid tab! Either has no screen or does not exist.");
		} else {
			this._openTab = tab;
			this._renderTabs();
			this._renderSearchBar();
			this._renderWindow();
		}
	}
	private _renderSearchBar() {
		this._searchBarText.text = this._tabs[this._openTab].tabName.toUpperCase();
	}

	private _renderWindow() {
		if (this._lastOpenTab !== -1) {
			this._tabs[this._lastOpenTab].screen.close();
		}

		this._tabs[this._openTab].screen.open();
		this._lastOpenTab = this._openTab;
	}
}

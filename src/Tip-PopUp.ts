import * as PIXI from "pixi.js";

export class PopUp {
	constructor(pixi) {
		this.container = new PIXI.Container();
		this.container.visible = false;

		// Achtergrondoverlay
		const overlay = new PIXI.Graphics();
		overlay.beginFill(0x000000, 0.5);
		overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
		overlay.endFill();
		this.container.addChild(overlay);

		// Pop-up content
		const content = new PIXI.Container();
		const canvasWidth = pixi.renderer.width;
		const canvasHeight = pixi.renderer.height;
		content.position.set((canvasWidth - content.width) / 2, (canvasHeight - content.height) / 2);
		this.container.addChild(content);

		// Sluitknop
		const closeButton = new PIXI.Text("X", { fill: "#ffffff" });
		closeButton.anchor.set(1, 0);
		closeButton.position.set(150, -150);
		closeButton.interactive = true;
		closeButton.buttonMode = true;
		closeButton.on("click", this.close.bind(this));
		content.addChild(closeButton);

		// Tipslijst
		this.tipsList = new PIXI.Container();
		this.tipsList.position.set(-150, -100);
		content.addChild(this.tipsList);
	}

	open() {
		this.container.visible = true;
	}

	close() {
		this.container.visible = false;
	}

	addTip(tipText) {
		const tipItem = new TipItem(tipText);
		tipItem.container.position.y = this.tipsList.children.length * 40;
		this.tipsList.addChild(tipItem.container);
	}
}

class TipItem {
	constructor(text) {
		this.container = new PIXI.Text(text, { fill: "#ffffff" });
	}
}

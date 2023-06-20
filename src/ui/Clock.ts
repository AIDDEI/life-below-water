import * as PIXI from "pixi.js";
import { Game } from "../Game";

export class Clock extends PIXI.Container {
	public halfHourOffset: number;
	public smallHandOffset: number;
	public clockContainer: PIXI.Container;
	public clockGraphics: PIXI.Graphics;

	constructor(game: Game) {
		super();
		this.halfHourOffset = 0;
		this.smallHandOffset = 0;

		this.clockContainer = new PIXI.Container();
		this.clockGraphics = new PIXI.Graphics();

		this.drawClock(); // Tekenen van de klok bij initialisatie
		this.clockContainer.addChild(this.clockGraphics);
		this.addChild(this.clockContainer);
		this.clockContainer.position.set(660, 10); // Positie van de klok
		this.clockContainer.scale.set(0.25); // Formaat van de klok
		this.initInteraction(); // Initialiseren van interactie
	}

	public drawClock() {
		this.clockGraphics.clear();

		// Klok wijzerplaat
		this.clockGraphics.beginFill(0xffffff);
		this.clockGraphics.lineStyle(8, 0x000000);
		this.clockGraphics.drawCircle(200, 200, 180);

		// Getallen op de wijzerplaat
		const numberStyle = new PIXI.TextStyle({
			fontSize: 50,
			fill: "black",
		});

		for (let hour = 1; hour <= 12; hour++) {
			const angle = (hour / 12) * Math.PI * 2; // Hoek voor elk uur
			const radius = 150;
			const x = 200 + radius * Math.sin(angle);
			const y = 200 - radius * Math.cos(angle);

			const numberText = new PIXI.Text(hour.toString(), numberStyle);
			numberText.anchor.set(0.5);
			numberText.position.set(x, y);
			this.clockGraphics.addChild(numberText);
		}

		// Lange wijzer (minuten wijzer)
		const longHandRotation = (this.halfHourOffset / 180) * Math.PI;
		this.clockGraphics.lineStyle(12, 0xff0000);
		this.clockGraphics.moveTo(200, 200);
		this.clockGraphics.lineTo(
			200 + 150 * Math.sin(longHandRotation),
			200 - 150 * Math.cos(longHandRotation)
		);

		// Kleine wijzer (urenwijzer)
		const smallHandRotation = (this.smallHandOffset / 180) * Math.PI;
		this.clockGraphics.lineStyle(9, 0x0000ff); // Blauwe kleur
		this.clockGraphics.moveTo(200, 200);
		this.clockGraphics.lineTo(
			200 + 80 * Math.sin(smallHandRotation),
			200 - 80 * Math.cos(smallHandRotation)
		);

		this.clockContainer.removeChildren();
		this.clockContainer.addChild(this.clockGraphics);
	}

	public shiftClock(hours = number) {
		const degrees = hours * 45;
		this.smallHandOffset += degrees;
		this.smallHandOffset += 360;

		this.drawClock();
	}

	public getContainer(): PIXI.Container {
		return this.clockContainer;
	}

	private initInteraction() {
		this.eventMode = "static";
	}
}

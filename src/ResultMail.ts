import * as PIXI from "pixi.js";
import { ActiveMail } from "./ActiveMail";
import { Button } from "./Button";

export class ResultMail extends ActiveMail {
	constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
		super(mail, mailHeaderIcon, game);
		this.createContent();

		// after creating the content, check if the content is too big for the mail
		this.checkScroll();
	}

	private createContent() {
		let salary = 0;

		salary = this.mail.reason == 0 ? 150 : 75;

		const salaryText = new PIXI.Text(`Je ontvangt: €${salary}`, { fill: "blue", fontSize: 15 });
		salaryText.position.set(this.x + 20, 150);

		const reasonText = new PIXI.Text(`Bedankt voor het voltooien van deze opdracht! \n${this.mail.description}.`, { fill: "black", fontSize: 15 });
		reasonText.position.set(this.x + 20, salaryText.y + salaryText.height + 20);
		reasonText.style.wordWrap = true;
		reasonText.style.wordWrapWidth = this.width - 25;

		// Add the content to the content container
		this.contentContainer.addChild(salaryText, reasonText);
	}
}

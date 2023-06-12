import * as PIXI from "pixi.js";
import { ActiveMail } from "./ActiveMail";
import { Button } from "./Button";

export class ResultMail extends ActiveMail {
	constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
		super(mail, mailHeaderIcon, game);
		this.createContent();
	}

	private createContent() {
		let salary = 0;
		console.log(this.mail.reason);
		salary = this.mail.reason == 1 ? 150 : 75;

		const salaryText = new PIXI.Text(`Je ontvangt: €${salary}`, { fill: "blue", fontSize: 15 });
		salaryText.position.set(this.x + 20, 180);

		const reasonText = new PIXI.Text(`Bedankt voor het voltooien van deze opdracht! \n${this.mail.description}.`, { fill: "black", fontSize: 15 });
		reasonText.position.set(this.x + 20, 210);
		reasonText.style.wordWrap = true;
		reasonText.style.wordWrapWidth = this.width - 25;

		const button = new Button(50, "Doorgaan", 0xffbd01, 0x336699, () => {
			console.log("clicked!");
		});
		button.position.set(this.x + 20, this.height - button.height / 2 - 5);

		// Add the content to the content container
		this.addChild(salaryText, reasonText, button);
	}
}

import * as PIXI from "pixi.js";
import { ActiveMail } from "./ActiveMail";
import { Button } from "../ui/Button";

export class ResultMail extends ActiveMail {
	constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
		super(mail, mailHeaderIcon, game);
		this.createContent();
		// after creating the content, check if the content is too big for the mail
		this.checkScroll();
	}

	private createContent() {
		const salary = this.mail.reason == 1 ? 150 : 75;

		const salaryText = new PIXI.Text(`Je ontvangt: €${salary}`, {
			fill: "blue",
			fontSize: 15,
		});
		salaryText.position.set(this.x + 20, 150);

		const reasonText = new PIXI.Text(
			`Bedankt voor het voltooien van deze opdracht! \n${this.mail.description}.`,
			{ fill: "black", fontSize: 15 }
		);
		reasonText.position.set(this.x + 20, salaryText.y + salaryText.height + 20);
		reasonText.style.wordWrap = true;
		reasonText.style.wordWrapWidth = this.width - 25;

		// Add the content to the content container
		this.contentContainer.addChild(salaryText, reasonText);

		const button = new Button(50, "Doorgaan", 0xffbd01, 0x336699, () => {
			this.game.browser.openTab = 0;

		});

		const y =
			this.contentContainer.height + button.height > this.maxHeight
				? this.contentContainer.height + button.height + 20
				: this.height - button.height / 2 - 5;
		button.position.set(this.x + 20, y);
		this.contentContainer.addChild(button);

		// Add the content to the content container
		this.contentContainer.addChild(salaryText, reasonText, button);

		// check if salary has already been paid for this result
		if (!this.mail.salaryPaid) {
			this.game.money.updateValue(salary);
			this.mail.salaryPaid = true;
		}
	}
}

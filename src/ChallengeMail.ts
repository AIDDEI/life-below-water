import * as PIXI from "pixi.js";
import { ActiveMail } from "./ActiveMail";
import { Button } from "./Button";
import { ParamButton } from "./ParamButton";
import { Game } from "./game";

export class ChallengeMail extends ActiveMail {
	constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: Game) {
		super(mail, mailHeaderIcon, game);
		this.createContent();

		// after creating the content, check if the content is too big for the mail
		this.checkScroll();
	}

	private createContent() {
		const contentText = new PIXI.Text(this.mail.description, {
			fill: "blue",
			fontSize: 15,
		});
		contentText.style.wordWrap = true;
		contentText.style.wordWrapWidth = this.width - 25;

		contentText.position.set(this.x + 20, 150);

		// Add the content to the content container
		this.contentContainer.addChild(contentText);

		let button: Button;

		switch (this.mail.identifier) {
			case "lob":
				if (this.mail.played) return;
				button = new ParamButton(
					[
						{ param: this.game.waterParamA, change: 3 },
						{ param: this.game.waterParamB, change: -2 },
						{ param: this.game.waterParamC, change: 1 },
					],
					50,
					"Accepteer missie",
					undefined,
					undefined,
					() => {
						this.game.startLobGame();
						this.mail.played = true;
					}
				);
				break;
			case "alg":
				if (this.mail.played) return;
				button = new ParamButton(
					[
						{ param: this.game.waterParamA, change: 3 },
						{ param: this.game.waterParamB, change: -2 },
						{ param: this.game.waterParamC, change: 1 },
					],
					50,
					"Accepteer missie",
					undefined,
					undefined,
					() => {
						this.game.startAlgaeGame();
						this.mail.played = true;
					}
				);
				break;
			default:
				button = new Button(
					50,
					"Dit hoort niet..",
					undefined,
					undefined,
					() => {
						console.log("This should not happen");
					}
				);
		}

		const y =
			this.contentContainer.height + button.height > this.maxHeight
				? this.contentContainer.height + button.height + 20
				: this.height - button.height / 2 - 5;
		button.position.set(this.x + 20, y);
		this.contentContainer.addChild(button);
	}
}

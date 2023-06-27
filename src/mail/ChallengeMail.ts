import * as PIXI from "pixi.js";
import { ActiveMail } from "./ActiveMail";
import { Button } from "../ui/Button";
import { ParamButton } from "../ui/ParamButton";
import { Game } from "../game";

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
		let button2: Button;

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
			case "boer":
				if (this.mail.played) return;
				button = new ParamButton(
					[
						{ param: this.game.waterParamA, change: -1 },
						{ param: this.game.waterParamB, change: -1 },
						{ param: this.game.waterParamC, change: 2 },
					],
					50,
					"Leg mestvrije zone aan",
					undefined,
					undefined,
					() => {
						this.mail.played = true;
						this.game.browser.openTab = 0
					}

				);
				break;
			case "intro":
				if (this.mail.played) return;
				button = new Button(50, "Ga naar kwaliteit", undefined, undefined, () => { this.game.browser.openTab = 0; });
				button2 = new Button(50, "Ga naar kaart", undefined, undefined, () => { this.game.browser.openTab = 2; });

				button2.position.set(this.x + 250, 420);
				this.contentContainer.addChild(button2);

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
		button.position.set(this.x + 20, 420);


		this.contentContainer.addChild(button);
	}
}

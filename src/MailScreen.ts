import * as PIXI from "pixi.js";
import { AssetType, Game } from "./game";
import { MailItem } from "./MailItem";
import { ChallengeMail } from "./ChallengeMail";
import { ResultMail } from "./ResultMail";
import { BaseMail, ResultsMail } from "../globals";

type MailType = BaseMail | ResultsMail<BaseMail>;

export class MailScreen extends PIXI.Container {
	private _mails: MailType[];
	private activeMailIndex: number;
	private mailIconUnread: PIXI.Texture;
	public bg: PIXI.Sprite;
	public mailIcon: PIXI.Texture;
	private contentContainer: PIXI.Container;
	private mailContainer: PIXI.Container;
	public mailHeaderIcon: PIXI.Sprite;
	private game: Game;
	constructor(assets: AssetType, game: Game) {
		super();
		this.game = game;
		this.mailHeaderIcon = new PIXI.Sprite(assets.mailHeaderIcon);
		this.mailIcon = assets.mailIcon;
		this.mailIconUnread = assets.mailIconUnread;
		this.visible = false;
		this._mails = [];
		this.activeMailIndex = -1;
		this.mailContainer = new PIXI.Container();
		this.mailContainer.position.set(35, 125);
		this.contentContainer = new PIXI.Container();
		this.contentContainer.position.set(165, 65);
		this.addChild(this.mailContainer, this.contentContainer);
	}

	/**
	 * function to add a base e-mail
	 * @param title - title of the mail
	 * @param description - description of the mail
	 * @param type - type of the mail (0 = challenge, 1 = after game, 2 = choice picking, can expand)
	 * @param forceOpen - if true, the mail will be opened immediately, otherwise it will be marked as unread
	 * @param identifier - identifier of the mail, used for checks for button and content
	 *
	 * Renders the mail screen after adding a new mail
	 *
	 */
	public add(title: string, description: string, type: number, forceOpen: boolean = false, identifier: string = "", played: boolean = false) {
		const mail = { title, description, type, forceOpen, identifier, played };
		this.mails.push(mail);
		this._renderMails();
	}

	/**
	 * function to add a result e-mail
	 * @param title - title of the mail
	 * @param description - description of the mail
	 * @param type - type of the mail (0 = challenge, 1 = after game, 2 = choice picking, can expand)
	 * @param forceOpen - if true, the mail will be opened immediately, otherwise it will be marked as unread
	 * @param identifier - identifier of the mail, used for checks for button and content
	 * @param score - score of the mail, used for the result mail
	 * @param reason - reason of the mail, used for the result mail (1 win 0 loss)
	 *
	 * Renders the mail screen after adding a new mail
	 *
	 */
	public addResultsMail(title: string, description: string, type: number, forceOpen: boolean = false, identifier: string = "", score: number = 0, reason: number = 0) {
		const mail: ResultsMail<BaseMail> = { title, description, type, forceOpen, identifier, score, reason };
		this.mails.push(mail);
		this._renderMails();
	}

	public open() {
		this.visible = true;
		this.game.pixi.renderer.background.color = 0xffffff;
	}

	public close() {
		this.visible = false;
	}

	public get mailCount(): number {
		return this._mails.length;
	}

	public get mails(): MailType[] {
		return this._mails;
	}

	private setActiveMail(index: number) {
		if (index >= 0 && index < this.mails.length && index !== this.activeMailIndex) {
			this.mails[index].read = true;
			this.mails[index].forceOpen = false;
			this.activeMailIndex = index;

			this._renderMails();
		}
	}

	private _renderMails() {
		// clear the mail container
		this.mailContainer.removeChildren();

		// Render all mails, re-render when active mail changes otherwise you will have the active mail still there
		this.mails.forEach((mail, index) => {
			mail.index = index;

			if (mail.forceOpen) {
				this.setActiveMail(index);
			}
			const mailItem = new MailItem(
				mail.title,
				mail.description,
				mail.read,
				index === this.activeMailIndex,
				() => {
					this.setActiveMail(index);
				},
				this.mailIcon,
				this.mailIconUnread
			);

			// add the mail item to the mail container in reverse order and set the position
			mailItem.position.set(0, (this.mails.length - 1 - index) * 70);
			this.mailContainer.addChildAt(mailItem, 0);
		});

		// Render active mail
		// clear the text inside of the content container
		this.contentContainer.removeChildren();

		const activeMail = this.mails[this.activeMailIndex];

		if (activeMail) {
			let activeMailContainer: any;

			switch (activeMail.type) {
				case 0:
					activeMailContainer = new ChallengeMail(activeMail, this.mailHeaderIcon, this.game);
					break;

				case 1:
					activeMailContainer = new ResultMail(activeMail, this.mailHeaderIcon, this.game);
			}

			activeMailContainer.position.set(80, 35);
			this.contentContainer.addChild(activeMailContainer);
		}
	}
}

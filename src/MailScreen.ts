import * as PIXI from 'pixi.js';
import { AssetType, Game } from './game';
import { MailItem } from './MailItem';

import { ChallengeMail } from './ChallengeMail';

type MailType = {
    index?: number;
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read?: boolean,
    identifier: string,
    played: boolean;
}

export class MailScreen extends PIXI.Container {
    private _mails: MailType[]
    private activeMailIndex: number
    private mailIconUnread: PIXI.Texture;
    public bg: PIXI.Sprite;
    public mailIcon: PIXI.Texture;
    private contentContainer: PIXI.Container;
    private mailContainer: PIXI.Container;
    public mailHeaderIcon: PIXI.Sprite;
    private game: Game
    private bgContainer: any;


    constructor(assets: AssetType, game: Game) {
        super();
        this.game = game;
        this.bg = new PIXI.Sprite(assets.mailbg);
        // scale background to fit the pixi app and resolution
        this.bg.width = this.game.pixi.screen.width;
        this.bg.height = this.game.pixi.screen.height;
        this.mailHeaderIcon = new PIXI.Sprite(assets.mailHeaderIcon);
        this.mailIcon = assets.mailIcon
        this.mailIconUnread = assets.mailIconUnread
        this.visible = true;
        this._mails = [];
        this.activeMailIndex = -1;
        this.bgContainer = new PIXI.Container();
        this.bgContainer.addChild(this.bg);
        this.mailContainer = new PIXI.Container();
        this.mailContainer.position.set(35, 125);
        this.contentContainer = new PIXI.Container();
        this.contentContainer.position.set(165, 65);
        this.bgContainer.addChild(this.bgContainer);
        this.bgContainer.addChild(this.mailContainer);
        this.bgContainer.addChild(this.contentContainer);
        this.addChild(this.bgContainer);

    }

    /**
* function to add an e-mail
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
        const mail = { title, description, type, forceOpen, identifier, played }

        this.mails.push(mail);
        this._renderMails();
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
            const mailItem = new MailItem(mail.title, mail.description, mail.read, (index === this.activeMailIndex), () => { this.setActiveMail(index) }, this.mailIcon, this.mailIconUnread);

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
            }

            activeMailContainer.position.set(80, 35);
            this.contentContainer.addChild(activeMailContainer);
        }
    }
}

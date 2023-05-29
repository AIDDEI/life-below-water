import * as PIXI from 'pixi.js';
import { AssetType, Game } from './game';
import { MailItem } from './MailItem';
import { ActiveMail } from './ActiveMail';

type MailType = {
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read?: boolean,
}

export class MailScreen extends PIXI.Container {
    private _mails: MailType[]
    private activeEmail: number
    private mailIconUnread: PIXI.Texture;
    public bg: PIXI.Sprite;
    public mailIcon: PIXI.Texture;
    private contentContainer: PIXI.Container;
    private mailContainer: PIXI.Container;
    public mailHeaderIcon: PIXI.Sprite;
    private game: Game
    bgContainer: any;

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
        this.activeEmail = -1;
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
* @param type - type of the mail (0 = quest, 1 = after game, can expand)
* @param forceOpen - if true, the mail will be opened immediately, otherwise it will be marked as unread
* 
* Renders the mail screen after adding a new mail
*
*/
    public add(title: string, description: string, type: number, forceOpen: boolean = false) {
        const mail = { title, description, type, forceOpen }
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
        if (index >= 0 && index < this.mails.length && index !== this.activeEmail && !this.mails[index].read) {
            this.mails[index].read = true;
            this.activeEmail = index;

            this._renderMails();
        }
    }


    private _renderMails() {
        // clear the mail container
        this.mailContainer.removeChildren();

        // Render all mails
        this.mails.forEach((mail, index) => {
            if (mail.forceOpen) {
                this.setActiveMail(index);
                mail.read = true;
                mail.forceOpen = false;
            }
            const mailItem = new MailItem(mail.title, mail.description, mail.read, (index === this.activeEmail), () => { this.setActiveMail(index) }, this.mailIcon, this.mailIconUnread);

            // add the mail item to the mail container in reverse order and set the position
            mailItem.position.set(0, (this.mails.length - 1 - index) * 70);
            this.mailContainer.addChildAt(mailItem, 0);

        });

        // Render active mail
        // clear the text inside of the content container 
        this.contentContainer.removeChildren();

        const activeMail = this.mails[this.activeEmail];

        if (activeMail) {
            const activeMailContainer = new ActiveMail(activeMail, this.mailHeaderIcon, this.game, this);

            this.contentContainer.addChild(activeMailContainer);
        }
    }
}
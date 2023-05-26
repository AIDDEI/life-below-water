import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { Game } from './Game';
import { LobGame } from './LobGame';
import { MailItem } from './MailItem';

type MailType = {
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read?: boolean,
}

type mailAssets = {
    mailbg: PIXI.Texture,
    mailIcon: PIXI.Texture,
    mailIconUnread: PIXI.Texture,
    mailHeaderIcon: PIXI.Texture,
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

    constructor(assets: mailAssets, game: Game) {
        super();
        this.game = game;
        this.bg = new PIXI.Sprite(assets.mailbg);
        // You have toFix() this otherwise you can get blurry text on some resolutions
        this.mailHeaderIcon = new PIXI.Sprite(assets.mailHeaderIcon);
        this.mailIcon = assets.mailIcon
        this.mailIconUnread = assets.mailIconUnread
        this.visible = true;
        this._mails = [];
        console.log(this.scale.x, this.scale.y)
        console.log(this.game.pixi.renderer.width * (1 - this.scale.x))

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.activeEmail = -1;
        this.bgContainer = new PIXI.Container();
        this.bgContainer.addChild(this.bg);
        this.mailContainer = new PIXI.Container();
        this.mailContainer.position.set(50, 150);
        this.bgContainer.scale.set(Math.min(window.innerWidth / this.game.pixi.view.width, window.innerHeight / this.game.pixi.view.height))
        this.x = window.innerWidth / 2

        this.contentContainer = new PIXI.Container();
        this.contentContainer.position.set(175, 75);
        this.bgContainer.addChild(this.bgContainer);
        this.bgContainer.addChild(this.mailContainer);
        this.bgContainer.addChild(this.contentContainer);
        this.addChild(this.bgContainer);

        this.bgContainer.x = -this.bgContainer.width / 2

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

    private setActiveMail(index) {
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
                this.activeEmail = index;
                mail.read = true;
                mail.forceOpen = false;
            }
            const mailItem = new MailItem(mail.title, mail.description, mail.read, (index === this.activeEmail), () => { this.setActiveMail(index) }, this.mailIcon, this.mailIconUnread);

            mailItem.position.set(0, index * 70);
            this.mailContainer.addChild(mailItem);
        });

        // Render active mail
        // clear the text inside of the content container 
        this.contentContainer.removeChildren();

        const activeMail = this.mails[this.activeEmail];

        if (activeMail) {
            // The gray box
            const background = new PIXI.Graphics();
            background.beginFill(0xf0f0f0);
            background.drawRect(this.contentContainer.x, this.contentContainer.y, 600, 500);
            background.endFill();
            this.contentContainer.addChild(background);

            // The content of the e-mail
            const contentIcon = this.mailHeaderIcon;
            contentIcon.scale.set(0.65);
            const contentTitle = new PIXI.Text(activeMail.title, { fill: 'black', fontSize: 40 });
            const emailText = new PIXI.Text("Van: neeldert@waterschappen.nl \nNaar: jou", { fill: 'black', fontSize: 15 });
            const contentText = new PIXI.Text(activeMail.description, { fill: 'blue', fontSize: 18 });
            contentText.style.wordWrap = true;
            contentText.style.wordWrapWidth = background.width - 25;

            // Set the position of the content relative to the content container and items inside of it
            contentIcon.position.set(this.contentContainer.x + 15, this.contentContainer.y + 10);
            contentTitle.position.set(this.contentContainer.x + 15 + contentIcon.width + 5, contentIcon.y + 20);
            emailText.position.set(this.contentContainer.x + 20, contentTitle.y + contentTitle.height + 20);
            contentText.position.set(this.contentContainer.x + 20, emailText.y + emailText.height + 30);

            // Add the content to the content container
            this.contentContainer.addChild(contentIcon, contentTitle, emailText, contentText);

            // Make a switch depending on mail type, in the future maybe move this
            const button = new Button(50, 'Accepteer missie', undefined, undefined, () => {
                console.log('Button clicked!');
                alert(`Button clicked: ${activeMail.title}`);
                this.visible = false;

                this.game.startGame();
            });

            button.position.set(this.contentContainer.x + 20, this.contentContainer.height);

            this.contentContainer.addChild(button);
            console.log(this.getBounds())
        }
    }
}
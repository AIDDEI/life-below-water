import * as PIXI from 'pixi.js';
import { Game } from './game';

type MailType = {
    played: any;
    index: number,
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read: boolean,
    identifier: string
}

export class ActiveMail extends PIXI.Container {
    mail: MailType;
    mailHeaderIcon: PIXI.Sprite;
    game: Game;

    constructor(mail: MailType, mailHeaderIcon: PIXI.Sprite, game: Game) {
        super();
        this.x = 80
        this.y = 35
        this.game = game;
        this.mailHeaderIcon = mailHeaderIcon
        this.mail = mail;
        this.createTitle();
    }

    private createTitle() {
        const background = new PIXI.Graphics();
        background.beginFill(0xf0f0f0);
        background.drawRect(this.x, this.y, 435, 450);
        background.endFill();
        this.addChild(background);

        // The content of the e-mail
        const contentIcon = this.mailHeaderIcon;
        contentIcon.scale.set(0.5);
        const contentTitle = new PIXI.Text(this.mail.title, { fill: 'black', fontSize: 30 });
        const emailText = new PIXI.Text("Van: neeldert@waterschappen.nl \nNaar: jou", { fill: 'black', fontSize: 14 });

        // Set the position of the content relative to the content container and items inside of it
        contentIcon.position.set(this.x + 15, this.y + 10);
        contentTitle.position.set(this.x + 15 + contentIcon.width + 10, contentIcon.y + 15);
        emailText.position.set(this.x + 20, contentTitle.y + contentTitle.height + 15);

        // Add the content to the content container
        this.addChild(contentIcon, contentTitle, emailText);
    }
}

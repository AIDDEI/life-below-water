import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { Game } from './game';

type MailType = {
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read?: boolean,
}

export class ActiveMail extends PIXI.Container {
    activeMail: MailType;
    mailHeaderIcon: PIXI.Sprite;
    game: Game;
    mailScreen: PIXI.Container<PIXI.DisplayObject>;

    constructor(activeMail: MailType, mailHeaderIcon: PIXI.Sprite, game: Game, mailScreen: PIXI.Container) {
        super();
        this.x = 80
        this.y = 35
        this.game = game;
        this.mailScreen = mailScreen;
        this.mailHeaderIcon = mailHeaderIcon
        this.activeMail = activeMail;
        this.createContent();
    }

    private createContent() {
        const background = new PIXI.Graphics();
        background.beginFill(0xf0f0f0);
        background.drawRect(this.x, this.y, 435, 450);
        background.endFill();
        this.addChild(background);

        // The content of the e-mail
        const contentIcon = this.mailHeaderIcon;
        contentIcon.scale.set(0.5);
        const contentTitle = new PIXI.Text(this.activeMail.title, { fill: 'black', fontSize: 30 });
        const emailText = new PIXI.Text("Van: neeldert@waterschappen.nl \nNaar: jou", { fill: 'black', fontSize: 14 });
        const contentText = new PIXI.Text(this.activeMail.description, { fill: 'blue', fontSize: 15 });
        contentText.style.wordWrap = true;
        contentText.style.wordWrapWidth = background.width - 25;

        // Set the position of the content relative to the content container and items inside of it
        contentIcon.position.set(this.x + 15, this.y + 10);
        contentTitle.position.set(this.x + 15 + contentIcon.width + 10, contentIcon.y + 15);
        emailText.position.set(this.x + 20, contentTitle.y + contentTitle.height + 15);
        contentText.position.set(this.x + 20, emailText.y + emailText.height + 30);

        // Add the content to the content container
        this.addChild(contentIcon, contentTitle, emailText, contentText);

        // Make a switch depending on mail type, in the future maybe move this
        const button = new Button(50, 'Accepteer missie', undefined, undefined, () => {
            console.log('Button clicked!');
            alert(`Button clicked: ${this.activeMail.title}`);
            this.mailScreen.visible = false;

            this.game.startLobGame();
        });

        button.position.set(this.x + 15, this.height - 30);

        this.addChild(button);
    }
}

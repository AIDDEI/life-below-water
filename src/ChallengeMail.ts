import * as PIXI from 'pixi.js';
import { ActiveMail } from './ActiveMail';
import { Button } from './Button';

export class ChallengeMail extends ActiveMail {
    private minigame: string;

    constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any, minigame: string) {
        super(mail, mailHeaderIcon, game);
        this.minigame = minigame;
        this.createContent();
    }

    private createContent() {
        const contentText = new PIXI.Text(this.mail.description, { fill: 'blue', fontSize: 15 });
        contentText.style.wordWrap = true;
        contentText.style.wordWrapWidth = this.width - 25;

        contentText.position.set(this.x + 20, 150);

        // Add the content to the content container
        this.addChild(contentText);

        let button
        switch (this.minigame) {
            case 'lob':
                button = new Button(50, 'Accepteer missie', undefined, undefined, () => {
                    this.game.startLobGame();
                });
                break;
            default:
                button = new Button(50, 'Dit hoort niet..', undefined, undefined, () => {
                    console.log('This should not happen');
                });
        }

        button.position.set(this.x + 20, this.height - button.height / 2 - 5);
        this.addChild(button);
    }
}
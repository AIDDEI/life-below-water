import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { MailItem } from './MailItem';

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
    private contentContainer: PIXI.Container;

    constructor() {
        super();
        this.x = 300;
        this.y = 100;
        this._mails = [];
        this.activeEmail = -1;
        this.contentContainer = new PIXI.Container();
        this.contentContainer.position.set(125, 0);
        this.addChild(this.contentContainer); // Add contentContainer to the Mail instance

    }

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
        // Render all mails
        this.mails.forEach((mail, index) => {
            if (mail.forceOpen) {
                this.activeEmail = index;
                mail.read = true;
                mail.forceOpen = false;
            }
            const mailItem = new MailItem(mail.title, mail.description, mail.read, (index === this.activeEmail), () => { this.setActiveMail(index) });


            mailItem.position.set(0, index * 70);
            this.addChild(mailItem);
        });


        // Render active mail
        // clear the text inside of the content container 
        this.contentContainer.removeChildren();

        const activeMail = this.mails[this.activeEmail];

        if (activeMail) {
            const background = new PIXI.Graphics();
            background.beginFill(0xffff00);
            background.drawRect(this.contentContainer.x, this.contentContainer.y, 500, 400);
            background.endFill();
            this.contentContainer.addChild(background);

            const contentTitle = new PIXI.Text(activeMail.title, { fill: 'blue', fontSize: 40 });
            const emailText = new PIXI.Text("Van: neeldert@waterschappen.nl \nNaar: Jou!", { fill: 'blue', fontSize: 15 });
            const contentText = new PIXI.Text(activeMail.description, { fill: 'blue', fontSize: 24 });
            contentText.style.wordWrap = true;
            contentText.style.wordWrapWidth = background.width - 15;

            contentTitle.position.set(this.contentContainer.x + 20, this.contentContainer.y + 20);
            emailText.position.set(this.contentContainer.x + 20, contentTitle.y + contentTitle.height + 5);
            contentText.position.set(this.contentContainer.x + 20, emailText.y + emailText.height + 20);
            this.contentContainer.addChild(contentTitle);
            this.contentContainer.addChild(contentText);
            this.contentContainer.addChild(emailText);

            // Make a switch depending on mail type, in the future maybe move this
            const button = new Button(50, 'Accepteer missie', undefined, undefined, () => {
                console.log('Button clicked!');
                alert(`Button clicked: ${activeMail.title}`)
            });
 
            button.position.set(this.width * 0.2, this.height * 0.8)
          
            this.contentContainer.addChild(button);
           
        }
    }
}
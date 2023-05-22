import * as PIXI from 'pixi.js';
import { MailItem } from './MailItem';

type MailType = {
    forceOpen: any;
    title: string,
    description: string,
    read?: boolean
}

export class MailList extends PIXI.Container {
    private mails: MailType[]
    private activeEmail: number
    contentContainer: any;

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.mails = [];
        this.activeEmail = -1;
        this.contentContainer = new PIXI.Container();
        this.contentContainer.position.set(125, 0);
        this.addChild(this.contentContainer); // Add contentContainer to the Mail instance

    }

    private add(title: string, description: string, forceOpen: boolean = false) {
        const mail = {
            title: title,
            description: description,
            forceOpen: forceOpen
        };
        this.mails.push(mail);

        this._renderMails();
    }

    public get mailCount(): number {
        return this.mails.length;
    }

    public get mailList(): MailType[] {
        return this.mails;
    }

    private setActiveMail(index) {
        if (index >= 0 && index < this.mails.length && index !== this.activeEmail && !this.mails[index].read) {
            this.mails[index].read = true;
            this.activeEmail = index;

            this._renderMails();
            console.log(this.mails);
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
            const mailItem = new MailItem(mail.title, mail.description, mail.read, (index === this.activeEmail), () => { this.setActiveMail(index) }, index);


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

            const contentTitle = new PIXI.Text(activeMail.title, { fill: 'blue', fontSize: 20 });
            const contentText = new PIXI.Text(activeMail.description, { fill: 'blue', fontSize: 16 });
            contentText.style.wordWrap = true;
            contentText.style.wordWrapWidth = background.width - 15;

            contentTitle.position.set(this.contentContainer.x + 10, this.contentContainer.y + 10);
            contentText.position.set(this.contentContainer.x + 10, this.contentContainer.y + 40);
            this.contentContainer.addChild(contentTitle);
            this.contentContainer.addChild(contentText);
        }
    }
}

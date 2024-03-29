import * as PIXI from 'pixi.js';


/**
 * Class for the small mail icon on the left side of the mail screen
 *
 * @param title (string) - title of the mail
 * @param description (string) - description of the mail
 * @param read (boolean) - whether the mail has been read or not
 * @param active (boolean) - whether the mail is currently active or not
 * @param setActiveMail (function) - function to call when the mail is clicked
 * @param mailIcon (PIXI.Texture) - texture of the mail icon
 * @param mailIconUnread (PIXI.Texture) - texture of the unread mail icon
 * 
 * @example
 * const mailItem = new MailItem('title', 'description', false, false, () => { console.log('clicked!') }, mailIcon, mailIconUnread)
 *
 */
export class MailItem extends PIXI.Container {
    title: string
    description: string
    read?: boolean
    active?: boolean
    setActiveMail: () => void
    mailIcon: PIXI.Sprite;
    mailIconUnread: PIXI.Sprite;

    constructor(title: string, description: string, read = false, active = false, setActiveMail: () => void, mailIcon: PIXI.Texture, mailIconUnread: PIXI.Texture) {
        super();
        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        this.title = title;
        this.description = description;
        this.read = read;
        this.mailIcon = this.read ? new PIXI.Sprite(mailIcon) : new PIXI.Sprite(mailIconUnread);
        this.active = active;
        this.setActiveMail = setActiveMail;
        this._initButton()

    }

    private _initButton(): void {
        this.cursor = 'pointer'
        this.eventMode = 'static'

        this.onclick = () => {
            this.setActiveMail()
        }

        const background = new PIXI.Graphics();
        background.beginFill(0xffffff);
        background.drawRect(0, 0, 225, 60);
        background.endFill();
        this.addChild(background);

        const titleStyle = new PIXI.TextStyle({
            fill: 'black',
            fontSize: 16,
            fontWeight: this.active ? 'bold' : 'normal',
        });

        const titleText = new PIXI.Text(this.title, titleStyle);
        titleText.position.set(10, 10);
        this.addChild(titleText);

        const descText = new PIXI.Text(this.description, { fill: 'black', fontSize: 14 });
        descText.position.set(10, titleText.height + 15);
        if (descText.width > 27) {
            descText.text = descText.text.substring(0, 27) + '...';
        }

        this.addChild(descText);    

        const indicatorText = this.mailIcon

        indicatorText.scale.set(0.6);
        indicatorText.position.set(this.width - 10, 6);
        this.addChild(indicatorText);

        // put a gray line between each mail item
        const line = new PIXI.Graphics();
        line.beginFill(0xaaaaaa);
        line.drawRect(0, 59, this.width, 1);
        line.endFill();
        this.addChild(line);
    }
}

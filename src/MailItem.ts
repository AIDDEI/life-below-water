import * as PIXI from 'pixi.js';



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
        this.title = title;
        this.description = description;
        this.read = read;
        this.mailIcon = this.read ? new PIXI.Sprite(mailIcon) : new PIXI.Sprite(mailIconUnread);
        this.active = active;
        this.setActiveMail = setActiveMail;
        this.initButton()

    }

    private initButton(): void {
        this.cursor = this.read ? 'regular' : 'pointer'
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

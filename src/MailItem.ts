import * as PIXI from 'pixi.js';

export class MailItem extends PIXI.Container {
    constructor(title: string, description: string, read: boolean = false, active: boolean = false, setActiveMail: () => void) {
        super();

        this.eventMode = 'static'
        this.onclick = () => {
            setActiveMail()
        }

        const background = new PIXI.Graphics();
        background.beginFill(0xffffff);
        background.drawRect(0, 0, 225, 60);
        background.endFill();
        this.addChild(background);

        const titleStyle = new PIXI.TextStyle({
            fill: 'blue',
            fontSize: 16,
            fontWeight: active ? 'bold' : 'normal',
        });

        const titleText = new PIXI.Text(title, titleStyle);
        titleText.position.set(10, 10);
        this.addChild(titleText);

        const descText = new PIXI.Text(description, { fill: 'blue', fontSize: 14 });
        descText.position.set(10, 30);
        if (descText.width > 30) {
            descText.text = descText.text.substring(0, 30) + '...';
        }
        this.addChild(descText);

        if (!read) {
            const indicatorText = new PIXI.Text('Nieuw!', { fill: 'red', fontSize: 14 });
            indicatorText.position.set(175, 10);
            this.addChild(indicatorText);
        }
    }
}
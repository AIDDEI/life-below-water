import * as PIXI from 'pixi.js';
import { ActiveMail } from './ActiveMail';
import { Button } from './Button';

export class ResultMail extends ActiveMail {

  constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
    super(mail, mailHeaderIcon, game);
    this.createContent();

  }

  private createContent() {

    const contentText = new PIXI.Text("Minigame Salaris", { fill: 'black', fontSize: 20, fontWeight: '600' });
    contentText.style.wordWrap = true;
    contentText.style.wordWrapWidth = this.width - 25;

    contentText.position.set(this.x + 20, 150);

    let salary = 0;

    salary = this.mail.reason == 0 ? 150 : 75;

    const salaryText = new PIXI.Text(`Je ontvangt: €${salary}`, { fill: 'blue', fontSize: 15 });
    salaryText.position.set(this.x + 20, 180);

    const reasonText = new PIXI.Text(`Bedankt voor het voltooien van deze opdracht! \n${this.mail.description}.`, { fill: 'black', fontSize: 15 });
    reasonText.position.set(this.x + 20, 210);
    reasonText.style.wordWrap = true;
    reasonText.style.wordWrapWidth = this.width - 25;

    // Rectangle for Param A
    const paramARectangle = new PIXI.Graphics();
    paramARectangle.beginFill(0xffffff);
    paramARectangle.drawRoundedRect(0, 0, 200, 10, 10);
    paramARectangle.endFill();

    const paramARectangleWidth = paramARectangle.width / 3;
    paramARectangle.beginFill(0x00c70d);
    paramARectangle.drawRoundedRect(0, 0, paramARectangleWidth, paramARectangle.height, 10);
    paramARectangle.endFill();

    paramARectangle.position.set(this.x + 20, 310);

    const paramAText = new PIXI.Text("Parameter A", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic" });
    paramAText.anchor.set(1.4, 1);
    paramAText.position.set(paramARectangle.x + paramARectangle.width / 2, paramARectangle.y - 10);

    // Rectangle for param B
    const paramBRectangle = new PIXI.Graphics();
    paramBRectangle.beginFill(0xffffff);
    paramBRectangle.drawRoundedRect(0, 0, 200, 10, 10);
    paramBRectangle.endFill();

    const paramBRectangleWidth = paramBRectangle.width / 2;
    paramBRectangle.beginFill(0x00c70d);
    paramBRectangle.drawRoundedRect(0, 0, paramBRectangleWidth, paramBRectangle.height, 10);
    paramBRectangle.endFill();

    paramBRectangle.position.set(this.x + 20, 350);

    const paramBText = new PIXI.Text("Parameter B", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic" });
    paramBText.anchor.set(1.4, 1);
    paramBText.position.set(paramBRectangle.x + paramBRectangle.width / 2, paramBRectangle.y - 10);

    // Rectangle for param C
    const paramCRectangle = new PIXI.Graphics();
    paramCRectangle.beginFill(0xffffff);
    paramCRectangle.drawRoundedRect(0, 0, 200, 10, 10);
    paramCRectangle.endFill();

    const paramCRectangleWidth = (400 / 640 * paramARectangle.width);

    console.log(paramCRectangleWidth);
    paramCRectangle.beginFill(0x00c70d);
    paramCRectangle.drawRoundedRect(0, 0, paramCRectangleWidth, paramCRectangle.height, 10);
    paramCRectangle.endFill();

    paramCRectangle.position.set(this.x + 20, 390);

    const paramCText = new PIXI.Text("Parameter C", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic" });
    paramCText.anchor.set(1.4, 1);
    paramCText.position.set(paramCRectangle.x + paramCRectangle.width / 2, paramCRectangle.y - 10);


    // Add the content to the content container
    this.addChild(contentText, salaryText, reasonText, paramARectangle, paramBRectangle, paramCRectangle, paramAText, paramBText, paramCText)

  }
}

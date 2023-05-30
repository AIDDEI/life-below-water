import * as PIXI from 'pixi.js';
import { ActiveMail } from './ActiveMail';
import { Button } from './Button';

export class ResultMail extends ActiveMail {
  private score: number;
  private reason: number;
  text: PIXI.Text;

  constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
    super(mail, mailHeaderIcon, game);
    this.createContent();
  }

  private createContent() {
    
    const contentText = new PIXI.Text(this.mail.description, { fill: 'black', fontSize: 20 , fontWeight: '600' });
        contentText.style.wordWrap = true;
        contentText.style.wordWrapWidth = this.width - 25;

        contentText.position.set(this.x + 20, 150);

        let salary = 0;
        let score = 15;
        const reason = "Door het vangen van alle kleine kreeften heb je ervoor gezorgd dat de schade aan de oevers verminderd en de waterkwaliteit verbeterd"

        if(score === 15 ){
          salary = 150
        } 

      const salaryText = new PIXI.Text(`Je ontvangt: €${salary}`, {fill: 'blue', fontSize: 15});
      salaryText.position.set(this.x + 20, 180);

      const reasonText = new PIXI.Text(`Bedankt voor het voltooien van deze opdracht! \n${reason}.`, {fill: 'black', fontSize: 15});
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
      paramARectangle.drawRoundedRect(0,0, paramARectangleWidth, paramARectangle.height, 10);
      paramARectangle.endFill();

      paramARectangle.position.set(this.x + 20, 310);

      const paramAText = new PIXI.Text("Parameter A", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic"});
      paramAText.anchor.set(1.4, 1);
      paramAText.position.set(paramARectangle.x + paramARectangle.width / 2, paramARectangle.y - 10);

      // Rectangle for param B
      const paramBRectangle = new PIXI.Graphics();
      paramBRectangle.beginFill(0xffffff);
      paramBRectangle.drawRoundedRect(0, 0, 200, 10, 10);
      paramBRectangle.endFill();

      const paramBRectangleWidth = paramBRectangle.width / 2;
      paramBRectangle.beginFill(0x00c70d);
      paramBRectangle.drawRoundedRect(0,0, paramBRectangleWidth, paramBRectangle.height, 10);
      paramBRectangle.endFill();

      paramBRectangle.position.set(this.x + 20, 350);

      const paramBText = new PIXI.Text("Parameter B", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic"});
      paramBText.anchor.set(1.4, 1);
      paramBText.position.set(paramBRectangle.x + paramBRectangle.width / 2, paramBRectangle.y - 10);

      // Rectangle for param C
      const paramCRectangle = new PIXI.Graphics();
      paramCRectangle.beginFill(0xffffff);
      paramCRectangle.drawRoundedRect(0, 0, 200, 10, 10);
      paramCRectangle.endFill();

      const paramCRectangleWidth = paramCRectangle.width / 4;
      paramCRectangle.beginFill(0x00c70d);
      paramCRectangle.drawRoundedRect(0,0, paramCRectangleWidth, paramCRectangle.height, 10);
      paramCRectangle.endFill();

      paramCRectangle.position.set(this.x + 20, 390);

      const paramCText = new PIXI.Text("Parameter C", { fill: "black", fontSize: 12, fontWeight: "bold", fontStyle: "italic"});
      paramCText.anchor.set(1.4, 1);
      paramCText.position.set(paramCRectangle.x + paramCRectangle.width / 2, paramCRectangle.y - 10);

      

      let button = new Button(50, 'Doorgaan', undefined, undefined, () => {
        console.log('doorgaan');
      });

      button.position.set(this.x + 20, this.height - button.height / 2 - 5);

        // Add the content to the content container
        this.addChild(contentText, salaryText, reasonText, paramARectangle, paramBRectangle, paramCRectangle, paramAText, paramBText, paramCText, button)
        
  }
}

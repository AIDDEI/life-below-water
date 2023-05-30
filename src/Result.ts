import * as PIXI from 'pixi.js';
import { ActiveMail } from './ActiveMail';
import { Button } from './Button';

export class Result extends ActiveMail {
  private score: number;
  private reason: number;


  constructor(mail: any, mailHeaderIcon: PIXI.Sprite, game: any) {
    super(mail, mailHeaderIcon, game);
    this.createContent();
  }

  private createContent() {

  }
}

import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import * as PIXI from "pixi.js";
import positiveTune from "url:./music/MoneyPositive.wav";
import negativeTune from "url:./music/MoneyNegative.wav";
import { Sfx } from "./Sfx";

export class Money extends PIXI.Container {
  private _value: number;
  private _minChange: number;
  private _maxChange: number;
  private iconTexture: PIXI.Texture;
  private icon: PIXI.Sprite;
  private displayValue: PIXI.Text;
  private textStyle: PIXI.TextStyle;
  private displayBG: PIXI.Graphics;
  private negativeSound: Sfx;
  private positiveSound: Sfx;

  constructor(
    iconTexture: PIXI.Texture,
    textStyle: PIXI.TextStyle,
    start: number,
    minChange: number = 1,
    maxChange: number = 250
  ) {
    super();

    this.positiveSound = new Sfx(positiveTune);
    this.negativeSound = new Sfx(negativeTune);
    this.value = start;
    this._minChange = minChange;
    this._maxChange = maxChange;
    this.textStyle = textStyle;
    this.iconTexture = iconTexture;
    this.draw();
  }

  // *100 change to not deal with floats for cents.
  set value(change: number) {
    this._value = change * 100;
  }

  // divide value by 100, to get back to decimal cents
  get value() {
    return this._value / 100;
  }

  get minChange() {
    return this._minChange;
  }

  get maxChange() {
    return this._maxChange;
  }

  /**
   * Function updates the value of Money, and automatically runs an animation on the money display.
   *
   * @param change - amount with which the value needs to change. Checked against min and max change values.
   *
   * @example updating money value
   * ```ts
   * game.Money.updateValue(100);
   * game.Money.updateValue(-100);
   *```
   */
  public updateValue(change: number) {
    let polarity = change < 0 ? true : false;
    const absoluteChange = Math.abs(change);
    if (
      absoluteChange >= this.minChange &&
      absoluteChange <= this.maxChange &&
      this.value + change >= 0
    ) {
      this.updateDisplay(
        this.value,
        this.value + change,
        absoluteChange,
        polarity
      );
      this.value += change;
    }
  }

  private draw() {
    this.icon = new PIXI.Sprite(this.iconTexture);
    this.icon.filters = [
      new DropShadowFilter({
        alpha: 0.9,
        distance: 4,
        blur: 4,
        rotation: 52.35987755982988,
      }),
    ];

    this.displayValue = new PIXI.Text(this.value, this.textStyle);
    this.icon.height = this.displayValue.height - 5;
    this.icon.width = this.icon.height;
    this.icon.anchor.set(0.5);
    this.icon.x = 25;
    this.drawBG();
    this.displayValue.anchor.set(0, 0.5);
    this.displayValue.position.set(
      this.icon.x + this.icon.width / 2,
      this.displayBG.height / 2
    );

    this.icon.y = this.displayBG.height / 2;

    this.addChild(this.displayBG, this.icon, this.displayValue);
  }

  private drawBG() {
    if (this.displayBG) {
      this.displayBG.destroy();
    }
    this.displayBG = new PIXI.Graphics();
    this.displayBG.beginFill(0xffbd01);
    this.displayBG.lineStyle({
      color: "rgba(255,255,255,1)",
      width: 4,
      alignment: 1,
    });
    this.displayBG.drawRoundedRect(
      this.displayBG.line.width,
      this.displayBG.line.width,
      this.displayValue.width + this.icon.width + 25,
      this.displayValue.height + 10,
      20
    );
    this.displayBG.endFill();
    this.displayBG.zIndex = -1;
    this.addChild(this.displayBG);
    this.sortChildren();
  }

  private updateDisplay(
    oldValue: number,
    newValue: number,
    absoluteChange: number,
    negative: boolean = false
  ) {
    const Ticker = PIXI.Ticker.shared;
    const change = negative ? -1 : 1;
    const sign = negative ? "-" : "+";
    const notification = negative ? this.negativeSound : this.positiveSound;
    const onTick = () => {
      if (oldValue + change != newValue) {
        oldValue += change;
        this.displayValue.text = `${oldValue} ${sign}`;
        this.displayValue.style.fill = negative ? "ff0000" : "#00ff00";
        this.drawBG();
      } else {
        this.displayValue.text = newValue;
        this.displayValue.style.fill = "#ffffff";
        this.drawBG();
        Ticker.remove(onTick);
      }
    };

    Ticker.add(onTick);
    notification.playSFX();
  }
}

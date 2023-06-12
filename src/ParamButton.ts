import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { ParamChangeInterface } from "./interfaces/ParamChangeInterface";
import { fadeIn, fadeOut } from "./Utils";

export class ParamButton extends Button {
  private changes: ParamChangeInterface[];
  private hoverContainer: PIXI.Container;
  private hoverBG: PIXI.Graphics;

  constructor(
    ParamChanges: ParamChangeInterface[],
    h: number,
    text: string,
    lineColor: number = 0xffbd01,
    buttonColor: number = 0x336699,
    clickHandler?: () => void,
    w?: number
  ) {
    super(h, text, lineColor, buttonColor, clickHandler, w);
    this.changes = ParamChanges;
    this.hoverContainer = new PIXI.Container();
    this.hoverContainer.y = -65;
    this.hoverContainer.visible = false;
    this.hoverBG = new PIXI.Graphics();

    this.hoverContainer.addChild(this.hoverBG);
    this.button.addChild(this.hoverContainer);
    this.setupEventCalls();

    let i = 0;

    for (let change of this.changes.sort((a, b) => a.change + b.change)) {
      const text = new PIXI.Text();

      text.style = this.textStyle;

      text.height = 20;
      text.y = 8 * i + 12 * i;
      text.text = "";
      if (change.change < 0) {
        for (let i = change.change; i < 0; i++) {
          text.text += "-";
          text.style = {
            fill: "#ff0000",
            stroke: "#570000",
            strokeThickness: 2,
          };
        }
      } else if (change.change > 0) {
        for (let i = 0; i < change.change; i++) {
          text.text += "+";
          text.style = {
            fill: "#00ff00",
            stroke: "#005700",
            strokeThickness: 2,
          };
        }
      } else {
        break;
      }
      text.text += ` ${change.param.name}`;
      this.hoverContainer.addChild(text);
      text.x = 5;
      i++;
    }
    this.hoverBG.beginFill("rgba(0,0,0, 0.4)");
    this.hoverBG.lineStyle({
      width: 2,
      color: "rgba(100,100,100,1)",
      miterLimit: 1,
    });
    this.hoverBG.drawRect(0, 0, this.hoverContainer.width + 10, 62);
    this.hoverBG.endFill();
    this.hoverContainer.x =
      (this.hoverContainer.width - this.button.width) / -2;
  }
  private setupEventCalls() {
    // can't seem to use super, or supercharge methods?
    this.onmouseover = () => {
      fadeIn(this.hoverContainer);

      // recreate Button's onmouseover
      this.button.tint = 0xc9c9c9;
      super.onmouseover;
    };
    this.onmouseleave = () => {
      fadeOut(this.hoverContainer);

      // recreate Button's onmouseleave
      super.onmouseleave;
      this.button.tint = 0xffffff;
    };
    this.onclick = () => {
      if (this._clickHandler) {
        for (let change of this.changes) {
          change.param.updateValue(change.change);
        }

        // recreate Button's onclick
        this._clickHandler();
      }
    };
  }
}

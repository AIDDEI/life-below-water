import * as PIXI from "pixi.js";
import { Button } from "./Button";
import { WaterParam } from "./WaterParam";
import { ParamChangeInterface } from "./interfaces/ParamChangeInterface";

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
    this.hoverContainer.y = -60;
    this.hoverContainer.visible = false;
    this.hoverBG = new PIXI.Graphics();

    this.hoverContainer.addChild(this.hoverBG);
    this.button.addChild(this.hoverContainer);
    this.setupEventCalls();

    let i = 0;
    for (let change of this.changes) {
      const text = new PIXI.Text();

      text.style = this.textStyle;
      text.style = {
        fontSize: 5,
      };
      text.height = 15;
      text.y = 2 * i + 12 * i;
      text.text = "";
      if (change.change < 0) {
        for (let i = change.change; i < 0; i++) {
          text.text += "-";
          text.style = {
            fill: "#ff0000",
          };
        }
      } else if (change.change > 0) {
        for (let i = 0; i < change.change; i++) {
          text.text += "+";
          text.style = {
            fill: "#00ff00",
          };
        }
      } else {
        break;
      }
      text.text += ` ${change.param.name}`;
      this.hoverContainer.addChild(text);
      i++;
    }
    this.hoverBG.beginFill("rgba(0,0,255, 0.4)");
    this.hoverBG.drawRect(0, 0, this.hoverContainer.width + 10, 60);
    this.hoverBG.endFill();
  }
  private setupEventCalls() {
    // can't seem to use super, or supercharge methods?
    this.onmouseover = () => {
      this.hoverContainer.visible = true;
      console.log("MOUSEY THERE YOU ARE (o)_(o)");

      // recreate Button's onmouseover
      this.button.tint = 0xc9c9c9;
      super.onmouseover;
    };
    this.onmouseleave = () => {
      this.hoverContainer.visible = false;
      //recreate Button's onmouseleave
      console.log("MOUSEY WHERE DID YA GO");

      super.onmouseleave;
      this.button.tint = 0xffffff;
    };
    this.onclick = () => {
      if (this._clickHandler) {
        // do the parent's onclick
        this._clickHandler();
      }
    };
  }
}

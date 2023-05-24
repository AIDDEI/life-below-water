import * as PIXI from "pixi.js";

export class NewGame extends PIXI.Container {
  text: PIXI.Text;

  constructor() {
    super();
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xffffff);
    rectangle.drawRoundedRect(50, 0, 200, 80, 10);
    rectangle.endFill();

    const text = new PIXI.Text("Nieuw spel", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x000000,
    });

    // Center text in rectangle
    const textWidth = text.width;
    const rectangleWidth = 200;
    const centerX = 50 + (rectangleWidth - textWidth) / 2;
    const centerY = 30;

    text.position.set(centerX, centerY);

    const container = new PIXI.Container();
    container.position.set(300, 200);
    container.addChild(rectangle, text);

    this.addChild(container);

    rectangle.eventMode = "static";
    rectangle.cursor = "pointer";

    rectangle.on("pointerup", () => {
      this.removeChild(container);

      // Confirmation items
      const newContainer = new PIXI.Container();

      const newRectangle = new PIXI.Graphics();
      newRectangle.beginFill(0xffffff);
      newRectangle.drawRoundedRect(0, 0, 450, 150,10);
      newRectangle.endFill();

      const newText = new PIXI.Text(
        "Weet je zeker dat je een nieuw spel wilt beginnen?",
        {
          fontFamily: "Arial",
          fontSize: 18,
          fill: 0x000000,
        }
      );

      newText.anchor.set(0.5);
      newText.position.set(
        newRectangle.width / 2,
        newRectangle.height / 2 - newText.height / 2
      );

      // Confirm button
      const confirmButton = new PIXI.Text("Ja", {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0x00ff00,
      });

      confirmButton.anchor.set(0.5);
      confirmButton.position.set(
        newRectangle.width / 2 - confirmButton.width - 10,
        newText.y + newText.height + 20
      );

      confirmButton.eventMode = "static";
      confirmButton.cursor = "pointer";
      confirmButton.on("pointerup", () => {
        console.log("Confirmed");

        this.removeChild(newContainer);
      });

      // Cancel button
      const cancelButton = new PIXI.Text("Nee", {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xff0000,
      });

      cancelButton.anchor.set(0.5);
      cancelButton.position.set(
        newRectangle.width / 2 + 10,
        newText.y + newText.height + 20
      );

      cancelButton.eventMode = "static";
      cancelButton.cursor = "pointer";
      cancelButton.on("pointerup", () => {
        console.log("Canceled");

        this.removeChild(newContainer);
      });

      newContainer.addChild(newRectangle, newText, confirmButton, cancelButton);
      newContainer.position.set(300, 250);

      this.addChild(newContainer);
    });
  }
}

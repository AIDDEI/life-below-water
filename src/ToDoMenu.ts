import * as PIXI from 'pixi.js'
import { Game } from './game';

export class list {

    private pixiWidth = 800;
    private pixiHeight = 450;
    private pixi : PIXI.Application;
    private loader:PIXI.Loader;

}
// De grootte van het menuscherm
const MENU_WIDTH = 800;
const MENU_HEIGHT = 600;

// De kleur van de achtergrond
const BACKGROUND_COLOR = 0x1099bb;

// Maak een PIXI Application
const app = new PIXI.Application({
  width: MENU_WIDTH,
  height: MENU_HEIGHT,
  backgroundColor: BACKGROUND_COLOR,
});

// Voeg de PIXI-canvas toe aan de HTML-pagina
document.body.appendChild(app.view);

// Maak een container voor het menuscherm
const menuContainer = new PIXI.Container();
app.stage.addChild(menuContainer);

// Maak de elementen van het menuscherm
const titleStyle = new PIXI.TextStyle({
  fill: "white",
  fontSize: 48,
  fontWeight: "bold",
});
const titleText = new PIXI.Text("Menu", titleStyle);
titleText.anchor.set(0.5);
titleText.position.set(MENU_WIDTH / 2, MENU_HEIGHT / 2 - 100);

const startButton = new PIXI.Graphics();
startButton.beginFill(0xffffff);
startButton.drawRect(0, 0, 200, 60);
startButton.position.set(MENU_WIDTH / 2 - 100, MENU_HEIGHT / 2);

const buttonText = new PIXI.Text("Start", {
  fill: "black",
  fontSize: 24,
});
buttonText.anchor.set(0.5);
buttonText.position.set(
  startButton.x + startButton.width / 2,
  startButton.y + startButton.height / 2
);

// Voeg de elementen toe aan het menuscherm
menuContainer.addChild(titleText, startButton, buttonText);

// Voeg een klikbare functionaliteit toe aan de startknop
startButton.interactive = true;
startButton.buttonMode = true;
startButton.on("pointertap", () => {
  console.log("Start button clicked!");
});

// Functie om het menuscherm te verbergen
function hideMenu() {
  menuContainer.visible = false;
}

// Functie om het menuscherm te tonen
function showMenu() {
  menuContainer.visible = true;
}

// Verberg het menuscherm bij het starten
hideMenu();
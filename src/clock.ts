import * as PIXI from 'pixi.js';
import { Text, TextStyle } from "pixi.js";
import { Game } from "./Game"


// Basisvariabelen
let halfHourOffset = 0; // Half uur verschuiving in graden
let smallHandOffset = 0; // Initialiseren van de offset van de kleine wijzer

// Pixi.js-app aanmaken
const app = new PIXI.Application({
    width: 400, // Breedte van het canvas
    height: 400, // Hoogte van het canvas
    antialias: true, // Anti-aliasing inschakelen voor een betere weergave
    transparent: true
});

// Canvas-element toevoegen aan de HTML-body
document.body.appendChild(app.view);

// Klokgraphics aanmaken
const clockContainer = new PIXI.Container();
const clockGraphics = new PIXI.Graphics();

function drawClock() {
  clockGraphics.clear();


  // Klok wijzerplaat
  clockGraphics.beginFill(0xffffff);
  clockGraphics.lineStyle(8, 0x000000);
  clockGraphics.drawCircle(200, 200, 180);

  // Lange wijzer (minuten wijzer)
  const longHandRotation = (halfHourOffset / 180) * Math.PI;
  clockGraphics.lineStyle(6, 0xff0000);
  clockGraphics.moveTo(200, 200);
  clockGraphics.lineTo(200 + 150 * Math.sin(longHandRotation), 200 - 150 * Math.cos(longHandRotation));

  // Kleine wijzer (urenwijzer)
  const smallHandRotation = (smallHandOffset / 180) * Math.PI;
  clockGraphics.lineStyle(4, 0x000000);
  clockGraphics.moveTo(200, 200);
  clockGraphics.lineTo(200 + 80 * Math.sin(smallHandRotation), 200 - 80 * Math.cos(smallHandRotation));

  clockContainer.addChild(clockGraphics);
}

drawClock();

// Klokcontainer toevoegen aan de app
app.stage.addChild(clockContainer);

/// Klikgebeurtenis hanteren
app.view.addEventListener('click', function() {
  halfHourOffset += 90; // Verschuiving van 90 graden
 
  if (halfHourOffset % 360 === 0) {
     
      smallHandOffset += 30;

      smallHandOffset %= 360;
  }

  drawClock();
});
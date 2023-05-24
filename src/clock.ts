import * as PIXI from 'pixi.js';
import { Text, TextStyle } from "pixi.js";
import { Game } from "./Game"

// export class Clock {
//   clockText: Text;
//   game: Game;

//   createClock() {
//     const clockStyle = new TextStyle({
//       fill: "white",
//       fontSize: 24,
//     });

//     this.clockText = new Text("00:00:00", clockStyle);
//     this.clockText.position.set(10, 10);
//     this.game.stage.addChild(this.clockText);
//   }

//   updateClock() {
//     const date = new Date();
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const seconds = String(date.getSeconds()).padStart(2, "0");
//     this.clockText.text = `${hours}:${minutes}:${seconds}`;
//   }

//   constructor(game: Game) {
//     this.game = game;
//     this.createClock();

//     const app = new PIXI.Application({
//       width: 800,
//       height: 600,
//       backgroundColor: 0x1099bb
//     });

//     document.body.appendChild(app.view);

//     app.ticker.add(() => this.updateClock());
//   }
// }



export class Clock {
  clockText: Text;
  game: Game;
  startTime: number;
  timerInterval: any;

  createClock() {
    const clockStyle = new TextStyle({
      fill: "white",
      fontSize: 24,
    });

    this.clockText = new Text("00:00:00", clockStyle);
    this.clockText.position.set(10, 10);
    this.game.stage.addChild(this.clockText);
  }

  updateClock() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.startTime;
    const seconds = Math.floor((elapsedTime / 400) % 60);
    const minutes = Math.floor((elapsedTime / 400 / 60) % 60);
    const hours = Math.floor((elapsedTime / 400 / 3600) % 24);

    const formattedTime = `${hours.toString().padStart(2, "10")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    this.clockText.text = formattedTime;
  }

  startTimer() {
    this.startTime = new Date().getTime();
    this.timerInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  constructor(game: Game) {
    this.game = game;
    this.createClock();

    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    document.body.appendChild(app.view);

    app.ticker.add(() => this.updateClock());

    this.startTimer();
  }
}
import * as PIXI from 'pixi.js';

export class ToDoMenu {
  private container: PIXI.Container;
  private taskList: PIXI.Text[];
  private popupContainer: PIXI.Container;
  private closeButton: PIXI.Text;

  constructor() {
    this.container = new PIXI.Container();
    this.taskList = []; // Lijst om de taken op te slaan
    this.popupContainer = new PIXI.Container(); // Container voor het pop-up menu
    this.closeButton = new PIXI.Text('X', { fill: 'white' }); // Sluitknop

    // Tekst style
    const textStyle = new PIXI.TextStyle({
      fill: 'white', // Tekstkleur
      fontSize: 20, // Tekstgrootte
    });

    // tasklist container
    const listContainer = new PIXI.Container();
    listContainer.position.set(50, 50);

    // Add tasks
    this.taskList.forEach((task, index) => {
      const taskText = new PIXI.Text(task, textStyle);
      taskText.y = index * 30;
      listContainer.addChild(taskText);
    });

    this.container.addChild(listContainer);
  }

  public show() {
    console.log('ToDoMenu wordt getoond!');

    // Wis de vorige inhoud van het menu
    this.popupContainer.removeChildren();

    // Voeg nieuwe elementen toe aan het pop-up menu
    const popupBackground = new PIXI.Graphics();
    popupBackground.beginFill(0x000000, 0.8);
    popupBackground.drawRect(0, 0, 300, 200);
    popupBackground.endFill();
    this.popupContainer.addChild(popupBackground);

    // Voeg inhoud toe aan het pop-up menu
    const titleText = new PIXI.Text('ToDo Menu', { fill: 'white', fontSize: 24 });
    titleText.position.set(20, 20);
    this.popupContainer.addChild(titleText);

    const taskList = ['Taak 1', 'Taak 2', 'Taak 3'];
    let yOffset = 60;
    for (const task of taskList) {
      const taskText = new PIXI.Text(task, { fill: 'white' });
      taskText.position.set(40, yOffset);
      this.popupContainer.addChild(taskText);
      yOffset += 30;
    }

    // Positioneer het pop-up menu
    this.popupContainer.position.set(250, 150);

    // Voeg de sluitknop toe
    this.closeButton.position.set(280, 20);
    this.closeButton.interactive = true;
    this.closeButton.buttonMode = true;
    this.closeButton.on('pointerdown', this.hidePopup.bind(this));
    this.popupContainer.addChild(this.closeButton);

    // Voeg het pop-up menu toe aan de stage
    app.stage.addChild(this.popupContainer);
  }

  private hidePopup() {
    // Verwijder het pop-up menu van de stage
    app.stage.removeChild(this.popupContainer);
  }
}

const app = new PIXI.Application();
document.body.appendChild(app.view);

const todoMenu = new ToDoMenu();

// Voeg knop toe om het pop-up menu weer te geven
const openButton = new PIXI.Text('Open Menu', { fill: 'white' });
openButton.position.set(10, 10);

openButton.interactive = true;
openButton.buttonMode = true;
openButton.on('pointerdown', () => {
  console.log('ToDoButton is geklikt!');
  todoMenu.show();
});
app.stage.addChild(openButton);



app.ticker.add(() => {
  // Render de stage
  app.render();
});

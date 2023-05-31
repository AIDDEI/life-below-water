import * as PIXI from 'pixi.js';

export class ToDoMenu {
  private container: PIXI.Container;
  private taskList: PIXI.Text[];

  constructor() {
    this.container = new PIXI.Container();
    this.taskList = []; // Lijst om de taken op te slaan

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
    console.log('ToDoMenu wordt getoond!');
    
    // Wis de vorige inhoud van het menu
    this.container.removeChildren();

    // Voeg nieuwe elementen toe aan het menu
    const titleText = new PIXI.Text('ToDo Menu', { fill: 'white' });
    titleText.position.set(10, 10);
    this.container.addChild(titleText);

    const taskList = ['Task 1', 'Task 2', 'Task 3'];
    let yOffset = 40;
    for (const task of taskList) {
      const taskText = new PIXI.Text(task, { fill: 'white' });
      taskText.position.set(10, yOffset);
      this.container.addChild(taskText);
      yOffset += 20;
    
  }
app.stage.addChild(this.container);
  
}

export class WaterModel {
  public nn: ml5.neuralNetwork;

  constructor() {
    function modelLoaded() {
      console.log("model Loaded");
    }
    const options = {
      task: "classification",
    };
    this.nn = ml5.neuralNetwork(options);

    const modelDetails = {
      model: "src/model/model.json",
      metadata: "src/model/model_meta.json",
      weights: "src/model/model.weights.bin",
    };
    this.nn.load(modelDetails, modelLoaded);
  }
}

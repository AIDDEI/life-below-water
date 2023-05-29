import { WaterParam } from "./WaterParam";

export class WaterModel {
  public nn: ml5.neuralNetwork;

  constructor(modelJSON: string, metadata: string, weights: string) {
    const options = {
      task: "classification",
    };
    this.nn = ml5.neuralNetwork(options);

    const modelDetails = {
      model: modelJSON,
      metadata: metadata,
      weights: weights,
    };
    this.nn.load(modelDetails, this.modelLoaded);
  }

  predict(parameters: number[]) {
    console.log(parameters);
    this.nn.classify(parameters, (error: Error, result: any[]) => {
      console.log(result);
      console.log(
        `Potable: ${result[0].label} - Confidence ${(
          result[0].confidence * 100
        ).toFixed(2)}%`
      );
    });
  }

  modelLoaded() {
    console.log("model Loaded");
  }
}

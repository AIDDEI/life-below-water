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

  predict(param_a: Object, param_b: Object, param_c: Object) {
    const params = [param_a, param_b, param_c];
    let input = {};
    for (const param in params) {
      const key: string = param.key;
      const value: number = param.value;
      input[key] = value;
    }
    console.log(input);

    this.nn.classify(input, (error: Error, result: any[]) => {
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

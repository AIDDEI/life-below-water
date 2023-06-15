export class DrawModel {
	nn: any;

	constructor() {
		// @ts-expect-error
		this.nn = ml5.imageClassifier("/model/model.json", this.modelLoaded);
	}

	modelLoaded() {
		console.log("Model Loaded!");
	}

	async predict(image: any) {
		const results = await this.nn.classify(image, (err: string, results: Object) => {
			if (err) {
				console.log(err);
				return "";
			}
		});
		return results[0].label;
	}
}

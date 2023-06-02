

const options = {
    task: 'classification' // or 'regression'
}
const modelDetails = {
    model: 'http://localhost:5500/test/model.json',
    metadata: 'http://localhost:5500/test/model_meta.json',
    weights: 'http://localhost:5500/test/model.weights.bin'
}
export class DrawModel {
    nn: any;

    constructor(canvas, game) {
        this.nn = ml5.imageClassifier(modelDetails.model, this.modelLoaded);

    }

    modelLoaded() {
        console.log('Model Loaded!');
    }

    async predict(image: any) {

        const results = await this.nn.classify(image, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }

        });
        return results[0].label
    }

    gotResults(error, results): string {
        if (error) {
            console.log(error);
            return 'error'
        }
        console.log(results);

    }


}


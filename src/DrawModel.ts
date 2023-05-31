

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

    predict(image: any) {

        this.nn.classify(image, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(results);
        });
    }

    gotResults(error, results) {
        if (error) {
            console.log(error);
            return;
        }
        console.log(results);
        // console.log(results[0].label);
        // console.log(results[0].confidence);
    }


}


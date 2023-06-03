
export class DrawModel {
    nn: any;

    constructor() {
        this.nn = ml5.imageClassifier('http://localhost:5500/test/model.json', this.modelLoaded);
    }

    modelLoaded() {
        console.log('Model Loaded!');
    }

    async predict(image: any) {
        const results = await this.nn.classify(image, (err: string, results: Object) => {
            if (err) {
                console.log(err);
                return;
            }
        });
        return results[0].label
    }
}


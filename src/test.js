

import test from 'url:../model/model.json';


export function setUp() {
    const options = {
        task: 'classification' // or 'regression'
    }
    const nn = ml5.neuralNetwork(options);

    const modelDetails = {
        model: test,
        metadata: './model_meta.json',
        weights: './model.weights.bin'

    }
    console.log(modelDetails)
    nn.load(modelDetails, modelLoaded)



}

function modelLoaded() {
    // continue on your neural network journey
    // use nn.classify() for classifications or nn.predict() for regressions
}
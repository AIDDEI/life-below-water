let nn, trainData, testData;

function loadData() {
  Papa.parse("./data/water_potability.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => cleanData(results.data),
  });
}

function cleanData(data) {
  // haal de data uit de CSV die je nodig hebt, inclusief het label waarop je wil trainen
  // met de filter functie checken we dat de traindata uit nummers bestaat
  const cleanData = data
    .map((water) => ({
      organicCarbons: water.Organic_carbon,
      trihalomethanes: water.Trihalomethanes,
      sulfate: water.Sulfate,
      potability: water.Potability === 1 ? "potable" : "non-potable",
    }))
    .filter(
      (water) =>
        water.organicCarbons !== null &&
        water.trihalomethanes !== null &&
        water.sulfate !== null &&
        water.potability !== null &&
        typeof water.organicCarbons === "number" &&
        typeof water.trihalomethanes === "number" &&
        typeof water.sulfate === "number"
    );
  cleanData.sort(() => Math.random() - 0.5);
  console.table(cleanData);
  trainData = cleanData.slice(0, Math.floor(data.length * 0.8));
  testData = cleanData.slice(Math.floor(data.length * 0.8) + 1);

  createNeuralNetwork(trainData);
}

function createNeuralNetwork(data) {
  nn = ml5.neuralNetwork({
    task: "classification",
    debug: true,
    layers: [
      {
        type: "dense",
        units: 32,
        activation: "relu",
      },
      {
        type: "dense",
        units: 32,
        activation: "relu",
      },
      {
        type: "dense",
        activation: "softmax",
      },
    ],
  });

  for (let water of data) {
    const inputs = {
      organicCarbons: water.organicCarbons,
      trihalomethanes: water.trihalomethanes,
      sulfate: water.sulfate,
    };
    const output = {
      potability: water.potability,
    };
    nn.addData(inputs, output);
  }

  nn.normalizeData();
  nn.train({ epochs: 100 }, () => classify());
}

// make a classification
function classify() {
  const input = { organicCarbons: 15, trihalomethanes: 105, Sulfate: 300 };

  nn.classify(input, (error, result) => {
    console.log(result);
    console.log(
      `Potable: ${result[0].label} - Confidence ${(
        result[0].confidence * 100
      ).toFixed(2)}%`
    );
  });
}

async function classify() {
  console.log("done training!");

  const inputs = { organicCarbons: 4, trihalomethanes: 2000, Sulfate: 300 };
  const result = await nn.classify(inputs);
  console.log(
    `Potable: ${result[0].label} - Confidence ${(
      result[0].confidence * 100
    ).toFixed(2)}%`
  );

  getAccuracy();
}

async function getAccuracy() {
  let correctPredictions = 0;

  for (let water of testData) {
    const inputs = {
      organicCarbons: water.organicCarbons,
      trihalomethanes: water.trihalomethanes,
      sulfate: water.sulfate,
    };
    const result = await nn.classify(inputs);
    console.log(
      `Predicted: ${result[0].label}, Actual data: ${water.potability}`
    );
    if (result[0].label === water.potability) {
      correctPredictions++;
    }
  }

  console.log(
    `Correcte voorspellingen ${correctPredictions} van de ${
      testData.length
    }, dit is ${((correctPredictions / testData.length) * 100).toFixed(2)} %`
  );
}

function save() {
  nn.save();
}

loadData();

import modelJSON from './model/model.json';
import metadata from "./model/model_meta.json";
import weights from "./model/model.weights.bin";

const test = fetch(weights).then((response) => response.json);
export class DrawModel {

}
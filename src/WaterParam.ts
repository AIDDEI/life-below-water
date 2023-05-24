import * as PIXI from "pixi.js";

/**
 * Class to model a water quality parameter.
 *
 * @param name - Display name of the parameter.
 * @param key - given key of the parameter in the NN-model.
 * @param value - value of the parameter'.
 * @param increment - the increment with which the value changes.
 *
 */
export class WaterParam {
  public name: string; // displayname of parameter
  private key: string; // name of parameter in model
  private value: number; // initial value of parameter
  private increment: number; // value with which to change the param's value per step (*1)

  constructor(name: string, key: string, value: number, increment: number) {
    this.name = name;
    this.key = key;
    this.value = value >= 0 ? value : 0;
    this.increment = increment;

    // sanity check DEBUG ONLY
    console.log(
      `WaterParam created: ${this.name} (${this.key}), value: ${this.value} (${this.increment})`
    );
  }

  /**
   * function to return a NN-friendly object with keyname and value
   *
   * @returns object with a 'key' and a 'value' field.
   *
   */
  getKeyValue() {
    return { key: this.key, value: this.value };
  }

  /**
   * function to update the parameter's value.
   * step is multiplied with parameter's increment value then applied to value.
   *
   * @param step number in range -5 to 5 inclusive.
   *
   */
  update(step: number) {
    if (step != null && step >= -5 && step <= 5) {
      this.value += this.increment * step;
      if (this.value < 0) {
        this.value = 0;
      }
      console.log(this.value);
    } else {
      console.log(
        `Could not update WaterParam.value. Invalid step value. (range: -5 - 5, given: ${step})`
      );
    }
  }
}

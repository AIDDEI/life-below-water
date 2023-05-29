import * as PIXI from "pixi.js";

/**
 * Class to model a water quality parameter.
 *
 * @param name - Display name of the parameter.
 * @param key - Given key of the parameter in the NN-model.
 * @param value - Initial value of the parameter.
 * @param increment - The increment with which the value changes.
 * @param minValue - Minimum value the parameter can be (default 0)
 * @param maxValue - Maximum value the parameter can be (default 100)
 * @param optimalMinValue - Minimum value that is considered 'optimal' (default 40)
 * @param optimalMaxValue - Maximum value that is considered 'optimal' (default 60)
 *
 * @example Initializing new Parameter
 * ```ts
 *new WaterParam("Parameter A", "parameter_a", 10, 1, 0, 100, 40, 60);
 *new WaterParam("Parameter B", "parameter_b", 10, 1);
 *```
 */
export class WaterParam {
  public name: string; // displayname of parameter
  private _keyName: string; // name of parameter in model
  private _value: number; // initial value of parameter
  private _increment: number; // value with which to change the param's value per step (*1)
  private _minValue: number; // minimum value this parameter can be.
  private _maxValue: number; // maximum value (inclusive) this parameter can be.
  private _optimalMinValue: number; //
  private _optimalMaxValue: number; //

  constructor(
    name: string,
    keyName: string,
    value: number,
    increment: number,
    minValue: number = 0,
    maxValue: number = 100,
    optimalMinValue: number = 40,
    optimalMaxValue: number = 60
  ) {
    this.name = name;
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._optimalMinValue = optimalMinValue;
    this._optimalMaxValue = optimalMaxValue;
    this._keyName = keyName;
    this._value =
      value <= this._minValue
        ? this._minValue
        : value <= this._maxValue
        ? value
        : this._maxValue;
    this._increment = increment;

    // sanity check DEBUG ONLY
    console.log(
      `WaterParam created: ${this.name} (${this.keyName}), value: ${this.value} (${this.increment})`
    );
  }

  get keyName() {
    return this._keyName;
  }

  get value() {
    return this._value;
  }

  get increment() {
    return this._increment;
  }

  get range() {
    return {
      min: this._minValue,
      max: this._maxValue,
    };
  }

  get optimalRange() {
    return {
      min: this._optimalMinValue,
      max: this._optimalMaxValue,
    };
  }

  /**
   * function to update the parameter's value.
   * step is multiplied with parameter's increment value then applied to value.
   *
   * @param step number in range -5 to 5 inclusive.
   *
   */
  updateValue(step: number) {
    if (step != null && step >= -5 && step <= 5) {
      let tempValue = this._value + this.increment * step;
      if (tempValue < this._minValue) {
        this._value = this._minValue;
      } else if (tempValue > this._maxValue) {
        this._value = this._maxValue;
      } else {
        this._value = tempValue;
      }
      console.log(this._value);
    } else {
      console.log(
        `Could not update WaterParam.value. Invalid step value. (range: -5 - 5, given: ${step})`
      );
    }
  }
}

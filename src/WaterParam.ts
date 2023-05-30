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
  private _optimalMinValue: number; // minimum value for the optimal values range.
  private _optimalMaxValue: number; // maximum value for the optimal values range.

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
    this._increment = increment;
    this.value = value;

    console.log(
      `WaterParam created: ${this.name} (${this.keyName}), value: ${this.value}, increment: ${this.increment}`
    );
  }

  public get keyName() {
    return this._keyName;
  }

  public get value() {
    return this._value;
  }

  /**
   * Setter for the parameter's value.
   * Enforces parameter's set range. Where value gets set to the minimum/maximum value when out of range.
   *
   * @param newValue - new value to set the parameter's value to.
   *
   * @example
   * ```ts
   * this.value = newValue;
   * this.value = 20;
   * ```
   */
  private set value(newValue: number) {
    const range = this.range;
    if (newValue < range.min || newValue > range.max) {
      console.log(
        `${newValue} is outside of allowed range. ${range.min}-${range.max}`
      );
      if (newValue < range.min) {
        this._value = range.min;
        console.log(`set to minimum instead : ${range.min} | ${this.value}`);
      } else {
        this._value = range.max;
        console.log(`set to maximum instead : ${range.max} | ${this.value}`);
      }
    } else {
      this._value = newValue;
      console.log(`changed ${this.name}'s value. ${newValue} | ${this.value}`);
    }
  }

  public get increment() {
    return this._increment;
  }

  public get range() {
    return {
      min: this._minValue,
      max: this._maxValue,
    };
  }

  public get optimalRange() {
    return {
      min: this._optimalMinValue,
      max: this._optimalMaxValue,
    };
  }

  /**
   * function to update the parameter's value.
   * step is multiplied with parameter's increment value and then added to value.
   *
   * @param step number in range -5 to 5 inclusive.
   *
   */
  public updateValue(step: number) {
    if (step != null && step >= -5 && step <= 5) {
      console.log(`old: ${this.value} | step: ${step}`);
      const tempValue = this.value + this.increment * step;
      this.value = tempValue;
    } else {
      console.log(
        `Could not update value of ${this.name}. Invalid step value. (range: -5 - 5, given: ${step})`
      );
    }
  }
}

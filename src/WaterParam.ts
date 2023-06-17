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
export class WaterParam extends PIXI.Container {
	// logic fields
	private _name: string; // displayname of parameter
	private _keyName: string; // name of parameter in model
	private _value: number; // initial value of parameter
	private _increment: number; // value with which to change the param's value per step (*1)
	private _minValue: number; // minimum value this parameter can be.
	private _maxValue: number; // maximum value (inclusive) this parameter can be.
	private _optimalMinValue: number; // minimum value for the optimal values range.
	private _optimalMaxValue: number; // maximum value for the optimal values range.
	// drawing fields
	private bgRect: PIXI.Graphics;
	private optimalRect: PIXI.Graphics;
	private valueIndicator: PIXI.Graphics;
	private nameText: PIXI.Text;
	private rectRadius: number;
	widthText: number;
	widthBar: number;
	widthIndicatorText: number;
	changeIndicator: PIXI.Text;
	textStyle: PIXI.TextStyle;

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
		super();

		this._name = name;
		this._keyName = keyName;
		this._increment = increment;

		// fields set via setters
		this.value = value;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.optimalMinValue = optimalMinValue;
		this.optimalMaxValue = optimalMaxValue;

		// drawing related
		this.rectRadius = 20;
		this.visible = false;
		this.bgRect = new PIXI.Graphics();
		this.optimalRect = new PIXI.Graphics();
		this.nameText = new PIXI.Text();
		this.addChild(this.bgRect, this.optimalRect, this.nameText);

		console.log(
			`WaterParam created: ${this.name} (${this.keyName}), value: ${this.value}, increment: ${this.increment}`
		);
	}

	// getters and setters
	public get name() {
		return this._name;
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
			// console.log(`changed ${this.name}'s value. ${newValue} | ${this.value}`); // spams console
		}
	}

	public get increment() {
		return this._increment;
	}

	public get range() {
		return {
			min: this.minValue,
			max: this.maxValue,
			range: this.maxValue - this.minValue,
		};
	}

	private get minValue() {
		return this._minValue;
	}

	/**
	 * Setter for the parameter's minValue.
	 * Enforces a minimum value of 0.
	 *
	 * @param value - value to set minValue to.
	 *
	 * @example
	 * ```ts
	 * this.minValue = 0;
	 * ```
	 */
	private set minValue(value: number) {
		if (value < 0) {
			console.log(`ERROR: minValue cant be below 0. value:${value}`);
		} else {
			this._minValue = value;
		}
	}

	private get maxValue() {
		return this._maxValue;
	}

	/**
	 * Setter for the parameter's maxValue.
	 * Enforces a minimum value above the parameter's minValue.
	 *
	 * @param value - value to set maxValue to.
	 *
	 * @example
	 * ```ts
	 * this.maxValue = 5;
	 * ```
	 */
	private set maxValue(value: number) {
		if (value < this.minValue) {
			console.log(
				`ERROR: maxValue cant be below minValue(${this.minValue}). value: ${value}`
			);
		} else {
			this._maxValue = value;
		}
	}

	public get optimalRange() {
		return {
			min: this.optimalMinValue,
			max: this.optimalMaxValue,
			range: this.optimalMaxValue - this.optimalMinValue,
		};
	}

	private get optimalMinValue() {
		return this._optimalMinValue;
	}

	/**
	 * Setter for the parameter's optimal Minimum Value.
	 * Enforces a minimum value above the parameter's minValue, and below the parameter's maxValue.
	 *
	 * @param value - value to set optimalMinValue to.
	 *
	 * @example
	 * ```ts
	 * this.maxValue = 2;
	 * ```
	 */
	private set optimalMinValue(value: number) {
		if (value > this.minValue && value < this.maxValue) {
			this._optimalMinValue = value;
		} else {
			console.log(
				`ERROR: optimalMinValue must be between ${this.range.min} - ${this.range.max}. value: ${value}`
			);
		}
	}

	private get optimalMaxValue() {
		return this._optimalMaxValue;
	}

	/**
	 * Setter for the parameter's optimal Maximum Value.
	 * Enforces a minimum value above the parameter's optimalMinValue, and below the parameter's maxValue.
	 *
	 * @param value - value to set optimalMaxValue to.
	 *
	 * @example
	 * ```ts
	 * this.maxValue = 4;
	 * ```
	 */
	private set optimalMaxValue(value: number) {
		if (value > this.optimalMinValue && value < this.maxValue) {
			this._optimalMaxValue = value;
		} else {
			console.log(
				`ERROR: optimalMaxValue must be between ${this.optimalMinValue} - ${this.maxValue}. value: ${value}`
			);
		}
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
			//console.log(`old: ${this.value} | step: ${step}`); // spams console
			const tempValue = this.value + this.increment * step;
			this.value = tempValue;
			this.updateDraw(step);
		} else {
			console.log(
				`Could not update value of ${this.name}. Invalid step value. (range: -5 - 5, given: ${step})`
			);
		}
	}

	//drawing functions

	/**
	 * function draw the parameter's value onto the screen, in bar form.
	 * Comes with a background, optimal value range, and value indicator.
	 *
	 * @param x - X-coordinate of the top-left corner of the bar.
	 * @param y - Y-coordinate of the top-left corner of the bar.
	 * @param height - Height of the bar
	 * @param width - width of the bar
	 *
	 */
	public draw(
		x: number,
		y: number,
		width: number,
		height: number,
		textStyle: PIXI.TextStyle
	) {
		this.visible = true;
		this.textStyle = textStyle;
		// draw text and place it on the screen
		this.widthText = width * 0.3;
		this.widthBar = width * 0.6;
		this.widthIndicatorText = width - (this.widthText + this.widthBar);

		// draw name
		this.nameText.text = this.name;
		this.nameText.style = this.textStyle;
		this.nameText.anchor.set(1, 0.5);
		this.nameText.x = this.widthText * 0.95;
		this.nameText.y = y + height / 2;

		//TODO: better styling to fit figma mockup
		this.bgRect.beginFill("#154175");
		this.bgRect.fill.alpha = 0;
		this.bgRect.lineStyle({
			alignment: 1,
			width: 8,
			color: "#154175",
			alpha: 1,
		});
		this.bgRect.drawRoundedRect(
			this.widthText,
			y,
			this.widthBar,
			height,
			this.rectRadius
		);
		// this.bgRect.tint = "rgba(200,200,200)";
		this.bgRect.endFill();

		//draw optimal range indicators
		this.optimalRect.beginFill("#B6C649");
		this.optimalRect.fill.alpha = 1;
		this.optimalRect.lineStyle({
			alignment: 1,
			width: 2,
			color: "#ffffff",
			alpha: 1,
		});

		// optimalX is the x-coordinate for the optimal range indicator.
		const optimalX: number =
			this.widthText +
			this.widthBar *
				((this.optimalRange.min - this.range.min) / this.range.range);
		// optimalWidth is the width of the optimal range indicator
		const optimalWidth: number =
			this.widthBar *
			((this.optimalRange.max - this.optimalRange.min) / this.range.range);

		// decide if optimal value range can be shown based on values
		if (Number.isNaN(optimalX) && Number.isNaN(optimalWidth)) {
			console.log(`ERROR: optimalRect can't be drawn due to NaN errors.`);
			this.optimalRect.visible = false;
		} else {
			this.optimalRect.drawRect(optimalX, y, optimalWidth, height);
			this.optimalRect.visible = true;
		}

		this.drawValueIndicator();
	}

	// draw / update value indicator
	private drawValueIndicator() {
		if (this.valueIndicator) {
			this.valueIndicator.destroy();
		}
		this.valueIndicator = new PIXI.Graphics();
		this.valueIndicator.beginFill("#FFFFFF");
		this.valueIndicator.fill.alpha = 0.95;
		this.valueIndicator.lineStyle({
			width: 4,
			color: "#26F0F1",
			alignment: 1,
		});
		this.valueIndicator.drawRect(
			this.bgRect.x + this.widthText,
			this.nameText.y - this.nameText.height - 1,
			this.calculateValueWidth(),
			this.bgRect.height
		);
		this.valueIndicator.endFill();
		this.valueIndicator.width = this.calculateValueWidth();
		console.log(this.valueIndicator.width);
		const maskObj = this.bgRect.clone();
		maskObj.position.set(this.bgRect.x, this.bgRect.y);
		maskObj.alpha = 1;
		this.valueIndicator.mask = maskObj;
		this.addChild(this.valueIndicator, maskObj, this.bgRect);
	}

	private drawChangeIndicator(step: number) {
		if (this.changeIndicator) {
			this.changeIndicator.destroy();
		}
		this.changeIndicator = new PIXI.Text(
			step > 0 ? `+` : `-`,
			this.textStyle.clone()
		);
		this.changeIndicator.style.fill = step > 0 ? "#00ff00" : "#ff0000";
		this.changeIndicator.style.fontSize = 36;
		this.changeIndicator.style.dropShadow = true;
		this.changeIndicator.style.dropShadowAlpha = 0.9;
		this.changeIndicator.style.dropShadowBlur = 4;
		this.changeIndicator.anchor.set(1, 0.5);
		this.changeIndicator.width = 30;
		const newX =
			this.widthText +
			this.valueIndicator.width -
			this.changeIndicator.width / 2;
		this.changeIndicator.x =
			newX > this.widthText + 30 ? newX : this.widthText + 30;
		this.changeIndicator.y = this.nameText.y;
		console.log(`Indicator width: ${this.changeIndicator.width}`);
		this.addChild(this.changeIndicator);
	}

	/**
	 * function to update the valueIndicator's position on the bar.
	 * Gets already called inside the updateValue function upon updating value.
	 *
	 * @param change - number - Amount with which the value was changed. (increment * step)
	 *
	 */
	private updateDraw(step: number) {
		this.drawValueIndicator();
		this.drawChangeIndicator(step);
	}

	private calculateValueWidth() {
		return (
			this.bgRect.width * ((this.value - this.range.min) / this.range.range)
		);
	}
}

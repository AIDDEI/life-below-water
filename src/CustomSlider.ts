// Import PIXI
import * as PIXI from 'pixi.js';

// Export Class
export class CustomSlider extends PIXI.Container {
    // Globals
    private sliderContainer : PIXI.Container;
    private sliderTrack : PIXI.Graphics;
    private sliderFill : PIXI.Graphics;
    private sliderHandle : PIXI.Graphics;
    private currentValue : number;
    private localStorageKey : string;
    private sliderWidth : number;
    private maxValue : number;
    private minValue : number;
    private isDragging: boolean = false;
    private offsetX: number = 0;
    private offsetNumber : number;

    // Constructor with customizable values
    constructor(minValue : number, maxValue : number, sliderWidth : number, localStorageKey : string, offsetNumber : number) {
        super();

        // Create the slider container and add to the CustomSlider
        this.sliderContainer = new PIXI.Container();
        this.addChild(this.sliderContainer);

        this.localStorageKey = localStorageKey;
        this.sliderWidth = sliderWidth;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.offsetNumber = offsetNumber;

        this.initSlider();

        this.currentValue = this.getSavedValue(localStorageKey) || maxValue;
        this.updateSliderFill();
        this.updateSliderHandlePosition();

        this.addEventListeners();
    }

    private initSlider() {
        this.sliderTrack = new PIXI.Graphics();
        this.sliderTrack.lineStyle(2, 0x000000);
        this.sliderTrack.moveTo(0, 0);
        this.sliderTrack.lineTo(this.sliderWidth, 0);
        this.sliderContainer.addChild(this.sliderTrack);
      
        this.sliderFill = new PIXI.Graphics();
        this.sliderFill.beginFill(0x3366FF);
        this.sliderFill.drawRect(0, 0, 0, 8);
        this.sliderContainer.addChild(this.sliderFill);
      
        this.sliderHandle = new PIXI.Graphics();
        this.sliderHandle.beginFill(0xFFFFFF);
        this.sliderHandle.drawRect(-6, -12, 12, 24);
        this.sliderHandle.x = 0
        this.sliderHandle.y = -6;
        this.sliderContainer.addChild(this.sliderHandle);
      
        this.sliderContainer.position.set(50, 50);
        this.sliderContainer.interactive = true;
        this.sliderContainer.cursor = 'pointer';
        this.sliderContainer.hitArea = new PIXI.Rectangle(0, -12, this.sliderWidth, 24);
    }      

    private addEventListeners() {
        this.sliderContainer.addEventListener('pointerdown', this.onSliderDown);
        window.addEventListener('pointermove', this.onSliderMove);
        window.addEventListener('pointerup', this.onSliderUp);
    }

    private onSliderDown = (event: PointerEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const newPosition = this.sliderContainer.toLocal(new PIXI.Point(event.clientX, event.clientY));
        this.offsetX = newPosition.x - this.sliderHandle.x + this.offsetNumber;
      
        this.isDragging = true;
    };

    private onSliderMove = (event: PointerEvent) => {
        if(this.isDragging) {
            const newPosition = this.sliderContainer.toGlobal(new PIXI.Point(event.clientX, event.clientY));
            const containerPosition = this.sliderContainer.getGlobalPosition();
            const offsetX = newPosition.x - containerPosition.x - this.offsetX;

            const clampedX = Math.max(0, Math.min(offsetX, this.sliderWidth));
            
            this.sliderHandle.x = clampedX;
            this.updateSliderFill();
            
            this.currentValue = this.calculateValueFromPosition(clampedX);
            this.saveValue(this.currentValue, this.localStorageKey);
        }
    };

    private onSliderUp = () => {
        this.isDragging = false;
    };

    private calculateValueFromPosition(position : number) : number {
        const range = this.maxValue - this.minValue;
        const ratio = position / this.sliderWidth;
        return this.minValue + Math.round(range * ratio);
    }

    private updateSliderFill() {
        const fillWidth = ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * this.sliderWidth;
        this.sliderFill.width = fillWidth;
    }

    private updateSliderHandlePosition() {
        const handleX = ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * this.sliderWidth;
        this.sliderHandle.x = handleX;
    }

    private saveValue(value : number, localStorageKey : string) {
        localStorage.setItem(localStorageKey, String(value));
    }

    private getSavedValue(localStorageKey : string) : number | null {
        const savedValue = localStorage.getItem(localStorageKey);
        return savedValue ? parseInt(savedValue, 10) : null;
    }
}
import { InputController } from "../controllers/input-controller.js";
import { ReadonlyVector2, Vector2 } from "../helpers/vectors-helper.js";
import { BaseInputControl, BooleanControl, NumberControl } from "./input-controls.js";
import { PropertyNumberControl } from "./property-based-controls.js";
export class UpdatableButtonControl extends BaseInputControl<boolean> implements BooleanControl {
    private _value = false;

    public isActivated(): boolean {
        return this._value;
    }

    public readValue(): boolean {
        return this._value;
    }

    public updateValue(value: boolean): void {
        this._value = value;
    }
}

export class DeltaPixelEventControl extends BaseInputControl<ReadonlyVector2> {
    protected _rawAxes = new Vector2();
    protected _axes = new Vector2();
    public readonly x: NumberControl;
    public readonly y: NumberControl;

    public constructor(controller: InputController, name: string) {
        super(controller, name);
        this.x = new PropertyNumberControl(controller, name + '/x', this._axes, 'x');
        this.y = new PropertyNumberControl(controller, name + '/y', this._axes, 'y');
    }

    public isActivated(): boolean {
        return this._axes.x !== 0 || this._axes.y !== 0;
    }

    public readValue(): ReadonlyVector2 {
        return this._axes;
    }

    public updateRawValue(x: number, y: number): void {
        this._rawAxes.x += x;
        this._rawAxes.y += y;
    }

    public update(): void {
        this._axes.x = this._rawAxes.x * devicePixelRatio;
        this._axes.y = this._rawAxes.y * devicePixelRatio;
        this._rawAxes.x = 0;
        this._rawAxes.y = 0;
    }
}
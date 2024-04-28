import { OrientationSensorController } from "../controllers/sensors/orientation-sensor-controller.js";
import { OrientationEventWrapper } from "../controllers/sensors/sensor-data.js";
import { ReadonlyVector4, Vector4 } from "../helpers/vectors-helper.js";
import { BaseInputControl, NumberControl } from "./input-controls.js";
import { PropertyStateControl } from "./property-based-controls.js";

export const degToRad = Math.PI / 180;

export class DeviceRotationControl extends BaseInputControl<Vector4> {
    protected override _isState = true;
    private _orientationData: OrientationEventWrapper;
    private _value = new Vector4();
    private _read = false;
    public readonly x: NumberControl;
    public readonly y: NumberControl;
    public readonly z: NumberControl;
    public readonly w: NumberControl;

    public constructor(controller: OrientationSensorController, name: string, data: OrientationEventWrapper) {
        super(controller, name);
        this._orientationData = data;
        this.x = new PropertyStateControl(controller, name + '/x', this._value, 'x');
        this.y = new PropertyStateControl(controller, name + '/y', this._value, 'y');
        this.z = new PropertyStateControl(controller, name + '/z', this._value, 'z');
        this.w = new PropertyStateControl(controller, name + '/w', this._value, 'w');
    }

    public update(): void {
        this._read = false;
    }
    public readValue(): ReadonlyVector4 {
        if (this._read === false) {
            const x = this._orientationData.x * degToRad;
            const y = this._orientationData.y * degToRad;
            const z = this._orientationData.z * degToRad;

            const cosX = Math.cos(x * 0.5);
            const cosY = Math.cos(y * 0.5);
            const cosZ = Math.cos(z * 0.5);
            const sinX = Math.sin(x * 0.5);
            const sinY = Math.sin(y * 0.5);
            const sinZ = Math.sin(z * 0.5);

            this._value.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
            this._value.y = cosX * sinY * cosZ - sinX * cosY * sinZ;
            this._value.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
            this._value.w = cosX * cosY * cosZ - sinX * sinY * sinZ;

            this._read = true;
        }
        return this._value;
    }
    public isActivated(): boolean {
        return true;
    }
}
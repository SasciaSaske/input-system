import { Vector3Control } from "../../controls/input-controls.js";
import { PropertyVector3StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { AccelerometerController } from "./accelerometer-controller.js";
import { motionControllerMixin } from "./motion-controller-mixin.js";

export class NativeAccelerometerController extends motionControllerMixin(AccelerometerController) {
    public override readonly acceleration: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this.acceleration = new PropertyVector3StateControl(this, 'acceleration', this._motionData, 'accelerometerX', 'accelerometerY', 'accelerometerZ');
    }
}
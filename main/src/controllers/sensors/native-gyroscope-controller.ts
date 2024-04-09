import { Vector3Control } from "../../controls/input-controls.js";
import { PropertyVector3StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { GyroscopeController } from "./gyroscope-controller.js";
import { motionControllerMixin } from "./motion-controller-mixin.js";

export class NativeGyroscopeController extends motionControllerMixin(GyroscopeController) {
    public override readonly angularVelocity: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this.angularVelocity = new PropertyVector3StateControl(this, 'angularVelocity', this._motionData, 'gyroscopeX', 'gyroscopeY', 'gyroscopeZ');
    }
}
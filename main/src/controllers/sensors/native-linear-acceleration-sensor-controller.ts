import { Vector3Control } from "../../controls/input-controls.js";
import { PropertyVector3StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { LinearAccelerationSensorController } from "./linear-acceleration-sensor-controller.js";
import { motionControllerMixin } from "./motion-controller-mixin.js";

export class NativeLinearAccelerationSensorController extends motionControllerMixin(LinearAccelerationSensorController) {
    public override readonly acceleration: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this.acceleration = new PropertyVector3StateControl(this, 'acceleration', this._motionData, 'linearAccelerationX', 'linearAccelerationY', 'linearAccelerationZ');
    }
}
import { Vector3Control } from "../../controls/input-controls.js";
import { PropertyVector3StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { GravitySensorController } from "./gravity-sensor-controller.js";
import { motionControllerMixin } from "./motion-controller-mixin.js";

export class NativeGravityController extends motionControllerMixin(GravitySensorController) {
    public override readonly gravity: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this.gravity = new PropertyVector3StateControl(this, 'gravity', this._motionData, 'gravityX', 'gravityY', 'gravityZ');
    }
}
import { GamepadAPIDpadControl, GamepadAPIAxesControl } from "../../controls/gamepad-controls.js";
import { InputManager } from "../../input-manager.js";
import { GamepadControlMap } from "./gamepad-controller.js";
import { NativeGamepadController } from "./native-gamepad-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad/standard': GamepadControlMap;
    }
}

export class StandardGamepadController extends NativeGamepadController {
    constructor(inputManager: InputManager) {
        super(inputManager);
        this._dpad = new GamepadAPIDpadControl(this, 'dpad');
        this._leftStick = new GamepadAPIAxesControl(this, 'leftStick', 0, 1);
        this._rightStick = new GamepadAPIAxesControl(this, 'rightStick', 2, 3);
    }
}
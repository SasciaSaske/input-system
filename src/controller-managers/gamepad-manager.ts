import { GamepadController } from "../controllers/gamepads/gamepad-controller.js";
import { MultipleNativeControllerManager } from "./native/native-controller-enabler.js";
import { NativeGamepadEnabler } from "./native/native-gamepad-enabler.js";

export class GamepadManager extends MultipleNativeControllerManager<GamepadController, NativeGamepadEnabler> {
    public getCurrentAs<T extends GamepadController>(): T | null {
        return this.current as T;
    }
}
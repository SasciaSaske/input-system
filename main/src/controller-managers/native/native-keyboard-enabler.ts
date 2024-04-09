import { NativeKeyboardController } from "../../controllers/native-keyboard-controller.js";
import { EVENT_ONCE_OPTION } from "../../helpers/event-helper.js";
import { NativeControllerEnabler } from "./native-controller-enabler.js";

export class NativeKeyboardEnabler extends NativeControllerEnabler {
    private _onKeyDown = (event: KeyboardEvent): void => {
        this._inputManager.addController(NativeKeyboardController, event);
    };

    protected _onEnable(): void {
        addEventListener('keydown', this._onKeyDown, EVENT_ONCE_OPTION);
    }

    protected _onDisable(): void {
        removeEventListener('keydown', this._onKeyDown);
        this._inputManager.removeControllers((controller): boolean => controller.constructor === NativeKeyboardController);
    }
}
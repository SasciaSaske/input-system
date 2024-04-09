import { NativeGamepadController } from "../../controllers/gamepads/native-gamepad-controller.js";
import { NonstandardAxisDpadGamepadController } from "../../controllers/gamepads/nonstandard-axis-dpad-gamepad-controller.js";
import { StandardGamepadController } from "../../controllers/gamepads/standard-gamepad-controller.js";
import { NativeControllerEnabler } from "./native-controller-enabler.js";

export class NativeGamepadEnabler extends NativeControllerEnabler {
    private _onGamepadAPIConnected = (event: GamepadEvent): void => {
        this._addGamepad(event.gamepad);
    };

    private _onGamepadAPIDisconnected = (event: GamepadEvent): void => {
        this._inputManager.removeController((controller): boolean => (controller as NativeGamepadController).gamepad?.index === event.gamepad.index);
    };

    protected _onEnable(): void {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad) {
                this._addGamepad(gamepad);
            }
        }
        window.addEventListener('gamepadconnected', this._onGamepadAPIConnected);
        window.addEventListener('gamepaddisconnected', this._onGamepadAPIDisconnected);
    }

    protected _onDisable(): void {
        window.removeEventListener('gamepadconnected', this._onGamepadAPIConnected);
        window.removeEventListener('gamepaddisconnected', this._onGamepadAPIDisconnected);
        this._inputManager.removeControllers((controller): boolean => controller instanceof NativeGamepadController);
    }

    private _addGamepad(gamepad: Gamepad): void {
        if (gamepad.mapping === 'standard') {
            this._inputManager.addController(StandardGamepadController, gamepad);
        } else {
            this._inputManager.addController(NonstandardAxisDpadGamepadController, gamepad);
        }
    }
}
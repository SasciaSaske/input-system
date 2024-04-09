import { GamepadButtonControl } from "../../controls/gamepad-controls.js";
import { GamepadController, GamepadControlMap } from "./gamepad-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad/standard/sony-dualshock-3': DualShock3ControllerMap;
        'gamepad/standard/sony-dualshock-4': DualShock4ControllerMap;
        'gamepad/*/sony-dualsense': DualShock4ControllerMap;
        'gamepad/*/{/sony/}': DualShock4ControllerMap;
    }
}

export interface SonyGamepadControllerMap extends GamepadControlMap {
    'crossButton': boolean,
    'crossButton/value': number,
    'circleButton': boolean,
    'circleButton/value': number,
    'squareButton': boolean,
    'squareButton/value': number,
    'triangleButton': boolean,
    'triangleButton/value': number,
    'l1Button': boolean,
    'l1Button/value': number,
    'r1Button': boolean,
    'r1Button/value': number,
    'l2Button': boolean,
    'l2Button/value': number,
    'r2Button': boolean,
    'r2Button/value': number,

    'l3Button': boolean,
    'l3Button/value': number,
    'r3Button': boolean,
    'r3Button/value': number,
    'psButton': boolean,
    'psButton/value': number,
}

export interface DualShock3ControllerMap extends SonyGamepadControllerMap {
    'selectButton': boolean,
    'selectButton/value': number,
    'startButton': boolean,
    'startButton/value': number,
}

export interface DualShock4ControllerMap extends SonyGamepadControllerMap {
    'shareButton': boolean,
    'shareButton/value': number,
    'optionsButton': boolean,
    'optionsButton/value': number,
    'touchpadButton': boolean,
    'touchpadButton/value': number,
}

interface DualShockController extends GamepadController {
    get crossButton(): GamepadButtonControl;
    get circleButton(): GamepadButtonControl;
    get squareButton(): GamepadButtonControl;
    get triangleButton(): GamepadButtonControl;
    get l1Button(): GamepadButtonControl;
    get r1Button(): GamepadButtonControl;
    get l2Button(): GamepadButtonControl;
    get r2Button(): GamepadButtonControl;
    get l3Button(): GamepadButtonControl;
    get r3Button(): GamepadButtonControl;
    get psButton(): GamepadButtonControl;
}

export interface DualShock3Controller extends DualShockController {
    get selectButton(): GamepadButtonControl;
    get startButton(): GamepadButtonControl;
}
export interface DualShock4Controller extends DualShockController {
    get shareButton(): GamepadButtonControl;
    get optionsButton(): GamepadButtonControl;
    get touchpadButton(): GamepadButtonControl;
}
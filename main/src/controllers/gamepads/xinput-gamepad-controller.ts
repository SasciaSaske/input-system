import { GamepadButtonControl } from "../../controls/gamepad-controls.js";
import { GamepadControlMap, GamepadController } from "./gamepad-controller.js";

import "../input-maps.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad/standard/microsoft-xinput': XInputControlMap;
    }
}

export interface XInputControlMap extends GamepadControlMap {
    'aButton': boolean,
    'aButton/value': number,
    'bButton': boolean,
    'bButton/value': number,
    'xButton': boolean,
    'xButton/value': number,
    'yButton': boolean,
    'yButton/value': number,
    'lbButton': boolean,
    'lbButton/value': number,
    'rbButton': boolean,
    'rbButton/value': number,
    'ltButton': boolean,
    'ltButton/value': number,
    'rtButton': boolean,
    'rtButton/value': number,
    'backButton': boolean,
    'backButton/value': number,
    'startButton': boolean,
    'startButton/value': number,
    'lsbButton': boolean,
    'lsbButton/value': number,
    'rsbButton': boolean,
    'rsbButton/value': number,
    'guideButton': boolean,
    'guideButton/value': number,
}

export interface XInputController extends GamepadController {
    get aButton(): GamepadButtonControl;
    get bButton(): GamepadButtonControl;
    get xButton(): GamepadButtonControl;
    get yButton(): GamepadButtonControl;
    get lbButton(): GamepadButtonControl;
    get rbButton(): GamepadButtonControl;
    get ltButton(): GamepadButtonControl;
    get rtButton(): GamepadButtonControl;
    get backButton(): GamepadButtonControl;
    get startButton(): GamepadButtonControl;

    get lsbButton(): GamepadButtonControl;
    get rsbButton(): GamepadButtonControl;
    get guideButton(): GamepadButtonControl;
}
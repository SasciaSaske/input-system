import { GamepadButtonControl } from "../../controls/gamepad-controls.js";
import { GamepadControlMap, GamepadController } from "./gamepad-controller.js";

import "../input-maps.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad/standard/nintendo-pro-controller': NintendoGamepadControllerMap;
        'gamepad/*/{/nintendo/}': NintendoGamepadControllerMap;
    }
}

export interface NintendoGamepadControllerMap extends GamepadControlMap {
    'bNintendoButton': boolean,
    'bNintendoButton/value': number,
    'aNintendoButton': boolean,
    'aNintendoButton/value': number,
    'yNintendoButton': boolean,
    'yNintendoButton/value': number,
    'xNintendoButton': boolean,
    'xNintendoButton/value': number,
    'lButton': boolean,
    'lButton/value': number,
    'rButton': boolean,
    'rButton/value': number,
    'zlButton': boolean,
    'zlButton/value': number,
    'zrButton': boolean,
    'zrButton/value': number,
    'minusButton': boolean,
    'minusButton/value': number,
    'plusButton': boolean,
    'plusButton/value': number,

    'homeButton': boolean,
    'homeButton/value': number,
    'captureButton': boolean,
    'captureButton/value': number,
}

export interface NintendoProController extends GamepadController {
    get bNintendoButton(): GamepadButtonControl;
    get aNintendoButton(): GamepadButtonControl;
    get yNintendoButton(): GamepadButtonControl;
    get xNintendoButton(): GamepadButtonControl;
    get lButton(): GamepadButtonControl;
    get rButton(): GamepadButtonControl;
    get zlButton(): GamepadButtonControl;
    get zrButton(): GamepadButtonControl;
    get minusButton(): GamepadButtonControl;
    get plusButton(): GamepadButtonControl;
    get homeButton(): GamepadButtonControl;
    get captureButton(): GamepadButtonControl;
}
import { GamepadControlMap } from "./gamepad-controller.js";


declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad/nonstandard': NonStandardGamepadControlMap;
    }
}

export interface NonStandardGamepadControlMap extends GamepadControlMap {
    'button0': boolean;
    'button0/value': number;
    'button1': boolean;
    'button1/value': number;
    'button2': boolean;
    'button2/value': number;
    'button3': boolean;
    'button3/value': number;
    'button4': boolean;
    'button4/value': number;
    'button5': boolean;
    'button5/value': number;
    'button6': boolean;
    'button6/value': number;
    'button7': boolean;
    'button7/value': number;
    'button8': boolean;
    'button8/value': number;
    'button9': boolean;
    'button9/value': number;
    'button10': boolean;
    'button10/value': number;
    'button11': boolean;
    'button11/value': number;
    'button12': boolean;
    'button12/value': number;
    'button13': boolean;
    'button13/value': number;
    'button14': boolean;
    'button14/value': number;
    'button15': boolean;
    'button15/value': number;
    'button16': boolean;
    'button16/value': number;
    'button17': boolean;
    'button17/value': number;
    'button18': boolean;
    'button18/value': number;
    'button19': boolean;
    'button19/value': number;
    'button20': boolean;
    'button20/value': number;
    'button21': boolean;
    'button21/value': number;
    'button22': boolean;
    'button22/value': number;
    'button23': boolean;
    'button23/value': number;
    'button24': boolean;
    'button24/value': number;
    'button25': boolean;
    'button25/value': number;
    'button26': boolean;
    'button26/value': number;
    'button27': boolean;
    'button27/value': number;
    'button28': boolean;
    'button28/value': number;
    'button29': boolean;
    'button29/value': number;

    'axis0': number;
    'axis1': number;
    'axis2': number;
    'axis3': number;
    'axis4': number;
    'axis5': number;
    'axis6': number;
    'axis7': number;
    'axis8': number;
    'axis9': number;
    'axis10': number;
    'axis11': number;
    'axis12': number;
    'axis13': number;
    'axis14': number;
    'axis15': number;
    'axis16': number;
    'axis17': number;
    'axis18': number;
    'axis19': number;
}
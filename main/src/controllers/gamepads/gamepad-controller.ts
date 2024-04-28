import { NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { GamepadButtonControl, GamepadDpadControl } from "../../controls/gamepad-controls.js";
import { Vector2 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";
import { GamepadHaptic, HapticController } from "../haptic-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gamepad': GamepadControlMap;
    }

    export interface InputControlMap extends GamepadControlMap {
    }
}

export interface GamepadControlMap {
    'bottomFace': boolean,
    'bottomFace/value': number,
    'rightFace': boolean,
    'rightFace/value': number,
    'leftFace': boolean,
    'leftFace/value': number,
    'topFace': boolean,
    'topFace/value': number,
    'leftShoulder': boolean,
    'leftShoulder/value': number,
    'rightShoulder': boolean,
    'rightShoulder/value': number,
    'leftTrigger': boolean,
    'leftTrigger/value': number,
    'rightTrigger': boolean,
    'rightTrigger/value': number,
    'leftSpecial': boolean,
    'leftSpecial/value': number,
    'rightSpecial': boolean,
    'rightSpecial/value': number,
    'leftStickButton': boolean,
    'leftStickButton/value': number,
    'rightStickButton': boolean,
    'rightStickButton/value': number,
    'centerSpecial': boolean,
    'centerSpecial/value': number,

    'dpad': Vector2,
    'dpad/up': boolean,
    'dpad/up/value': number,
    'dpad/down': boolean,
    'dpad/down/value': number,
    'dpad/left': boolean,
    'dpad/left/value': number,
    'dpad/right': boolean,
    'dpad/right/value': number,

    'leftStick': Vector2,
    'leftStick/x': number,
    'leftStick/y': number,
    'rightStick': Vector2,
    'rightStick/x': number,
    'rightStick/y': number
}

export abstract class GamepadController extends InputController implements HapticController {
    declare protected _path: ['gamepad', string, string, ...string[]];
    public get mapping(): string {
        return this._path[1];
    }
    public get model(): string {
        return this._path[2];
    }

    public abstract get bottomFace(): GamepadButtonControl;
    public abstract get rightFace(): GamepadButtonControl;
    public abstract get leftFace(): GamepadButtonControl;
    public abstract get topFace(): GamepadButtonControl;
    public abstract get leftShoulder(): GamepadButtonControl;
    public abstract get rightShoulder(): GamepadButtonControl;
    public abstract get leftTrigger(): GamepadButtonControl;
    public abstract get rightTrigger(): GamepadButtonControl;
    public abstract get leftSpecial(): GamepadButtonControl;
    public abstract get rightSpecial(): GamepadButtonControl;
    public abstract get leftStickButton(): GamepadButtonControl;
    public abstract get rightStickButton(): GamepadButtonControl;
    public abstract get centerSpecial(): GamepadButtonControl;

    public abstract get dpad(): GamepadDpadControl;

    public abstract get leftStick(): Vector2Control;
    public abstract get rightStick(): Vector2Control;

    public abstract get buttonCount(): number;
    public abstract get axesCount(): number;
    public abstract getButton(index: number): GamepadButtonControl;
    public abstract getAxis(index: number): NumberControl;

    public abstract getActivatedButtons(out?: GamepadButtonControl[]): GamepadButtonControl[];
    public abstract getActivatedAxes(out?: NumberControl[]): NumberControl[];

    public abstract get haptic(): GamepadHaptic;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'gamepad';
        this._addManager(inputManager.gamepad);
    }
}
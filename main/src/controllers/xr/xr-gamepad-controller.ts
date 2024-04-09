import { XRHandedManagerWrapper } from "../../controller-managers/xr/xr-handed-manager-wrapper.js";
import { NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { GamepadTouchButtonControl } from "../../controls/gamepad-controls.js";
import { PoseControl } from "../../controls/xr-controls.js";
import { AddPrefix } from "../../helpers/type-helpers.js";
import { ReadonlyVector2 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputPath } from "../../input-path.js";
import "../input-maps.js";
import { InputController } from "../input-controller.js";
import { XRGamepadHaptic } from "../haptic-controller.js";
import { XRControlMap, XRHandedController } from "./xr-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap extends XRControllerMap, AddPrefix<XRControllerMap, 'left/'>, AddPrefix<XRControllerMap, 'right/'> {
    }
    export interface InputControlMap extends XRGamepadControlMap {
    }
}

interface XRControllerMap {
    // Generic
    'xr-gamepad': XRGamepadControlMap;
    'xr-gamepad/generic-button': XRGamepadControlMap;
    'xr-gamepad/generic-touchpad': XRGamepadControlMap;
    'xr-gamepad/generic-touchscreen': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-squeeze-thumbstick': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-squeeze-touchpad-thumbstick': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-squeeze-touchpad': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-squeeze': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-thumbstick': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-touchpad-thumbstick': XRGamepadControlMap;
    'xr-gamepad/generic-trigger-touchpad': XRGamepadControlMap;
    'xr-gamepad/generic-trigger': XRGamepadControlMap;

    'xr-gamepad/{/button/}': XRGamepadControlMap;
    'xr-gamepad/{/touchpad/}': XRGamepadControlMap;
    'xr-gamepad/{/touchscreen/}': XRGamepadControlMap;
    'xr-gamepad/{/trigger/}': XRGamepadControlMap;
    'xr-gamepad/{/squeeze/}': XRGamepadControlMap;
    'xr-gamepad/{/thumbstick/}': XRGamepadControlMap;

    // Google
    'xr-gamepad/*/google-daydream': XRGamepadControlMap;

    // HP
    'xr-gamepad/*/hp-mixed-reality': XRGamepadControlMap;

    // HTC
    'xr-gamepad/*/htc-vive-cosmos': XRGamepadControlMap;
    'xr-gamepad/*/htc-vive-focus-3': XRGamepadControlMap;
    'xr-gamepad/*/htc-vive-focus-plus': XRGamepadControlMap;
    'xr-gamepad/*/htc-vive-focus': XRGamepadControlMap;
    'xr-gamepad/*/htc-vive': XRGamepadControlMap;

    // Magic Leap
    'xr-gamepad/*/magicleap-one': XRGamepadControlMap;

    // Meta
    'xr-gamepad/*/meta-quest-touch-plus': XRGamepadControlMap;
    'xr-gamepad/*/meta-quest-touch-pro': XRGamepadControlMap;

    // Microscoft
    'xr-gamepad/*/microsoft-mixed-reality': XRGamepadControlMap;

    // Oculus
    'xr-gamepad/*/oculus-go': XRGamepadControlMap;
    'xr-gamepad/*/oculus-touch-v2': XRGamepadControlMap;
    'xr-gamepad/*/oculus-touch-v3': XRGamepadControlMap;
    'xr-gamepad/*/oculus-touch': XRGamepadControlMap;

    // Pico
    'xr-gamepad/*/pico-4': XRGamepadControlMap;
    'xr-gamepad/*/pico-g2': XRGamepadControlMap;
    'xr-gamepad/*/pico-neo2': XRGamepadControlMap;
    'xr-gamepad/*/pico-neo3': XRGamepadControlMap;

    // Samsung
    'xr-gamepad/*/samsung-gearvr': XRGamepadControlMap;
    'xr-gamepad/*/samsung-odyssey': XRGamepadControlMap;

    // Valve
    'xr-gamepad/*/valve-index': XRGamepadControlMap;

    // YVR
    'xr-gamepad/*/yvr-touch': XRGamepadControlMap;

    // // Google
    // 'xr-gamepad/generic-touchpad/google-daydream': XRGamepadControlMap;

    // // HP
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/hp-mixed-reality': XRGamepadControlMap;

    // // HTC
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/htc-vive-cosmos': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/htc-vive-focus-3': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-touchpad/htc-vive-focus-plus': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-touchpad/htc-vive-focus': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-touchpad/htc-vive': XRGamepadControlMap;

    // // Magic Leap
    // 'xr-gamepad/generic-trigger-squeeze-touchpad/magicleap-one': XRGamepadControlMap;

    // // Meta
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/meta-quest-touch-plus': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/meta-quest-touch-pro': XRGamepadControlMap;

    // // Microscoft
    // 'xr-gamepad/generic-trigger-squeeze-touchpad-thumbstick/microsoft-mixed-reality': XRGamepadControlMap;

    // // Oculus
    // 'xr-gamepad/generic-trigger-touchpad/oculus-go': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/oculus-touch-v2': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/oculus-touch-v3': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/oculus-touch': XRGamepadControlMap;

    // // Pico
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/pico-4': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-touchpad/pico-g2': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/pico-neo2': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/pico-neo3': XRGamepadControlMap;

    // // Samsung
    // 'xr-gamepad/generic-trigger-touchpad/samsung-gearvr': XRGamepadControlMap;
    // 'xr-gamepad/generic-trigger-squeeze-touchpad-thumbstick/samsung-odyssey': XRGamepadControlMap;

    // // Valve
    // 'xr-gamepad/generic-trigger-squeeze-touchpad-thumbstick/valve-index': XRGamepadControlMap;

    // // YVR
    // 'xr-gamepad/generic-trigger-squeeze-thumbstick/yvr-touch': XRGamepadControlMap;
}

export interface XRGamepadControlMap extends XRControlMap {
    'trigger': boolean,
    'trigger/value': number,
    'trigger/touched': number,
    'grip': boolean,
    'grip/value': number,
    'grip/touched': number,
    'touchpadButton': boolean,
    'touchpadButton/value': number,
    'touchpadButton/touched': number,
    'thumbstickButton': boolean,
    'thumbstickButton/value': number,
    'thumbstickButton/touched': number,
    'primaryButton': boolean,
    'primaryButton/value': number,
    'primaryButton/touched': number,
    'secondaryButton': boolean,
    'secondaryButton/value': number,
    'secondaryButton/touched': number,

    'touchpad': ReadonlyVector2,
    'touchpad/x': number,
    'touchpad/y': number,
    'thumbstick': ReadonlyVector2,
    'thumbstick/x': number,
    'thumbstick/y': number
}

export abstract class XRGamepadController extends InputController implements XRHandedController {
    protected _handeldManager: XRHandedManagerWrapper<XRGamepadController>;

    declare protected _path: ['xr-gamepad', string, string, ...string[]];
    public get mapping(): string {
        return this._path[1];
    }
    public get model(): string {
        return this._path[2];
    }

    public abstract get pose(): PoseControl;
    public abstract get handedness(): XRHandedness;

    public abstract get trigger(): GamepadTouchButtonControl;
    public abstract get grip(): GamepadTouchButtonControl;
    public abstract get touchpadButton(): GamepadTouchButtonControl;
    public abstract get thumbstickButton(): GamepadTouchButtonControl;
    public abstract get primaryButton(): GamepadTouchButtonControl;
    public abstract get secondaryButton(): GamepadTouchButtonControl;

    public abstract get touchpad(): Vector2Control;
    public abstract get thumbstick(): Vector2Control;

    abstract get buttonCount(): number;
    abstract get axesCount(): number;
    abstract getButton(index: number): GamepadTouchButtonControl;
    abstract getAxis(index: number): NumberControl;

    public abstract getActivatedButtons(out?: GamepadTouchButtonControl[]): GamepadTouchButtonControl[];
    public abstract getActivatedAxes(out?: NumberControl[]): NumberControl[];

    public abstract get haptic(): XRGamepadHaptic;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'xr-gamepad';
        this._handeldManager = new XRHandedManagerWrapper(inputManager.xr.gamepad.left, inputManager.xr.gamepad.right);
        this._addManager(this._handeldManager);
    }

    /* @internal */
    public override _checkPath(path: InputPath): boolean {
        return (path.handedness === this.handedness || path.handedness === 'all') && super._checkPath(path);
    }
}

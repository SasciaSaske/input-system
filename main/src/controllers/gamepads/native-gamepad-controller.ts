import { NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { DUMMY_NUMBER_CONTROL } from "../../controls/dummy-controls.js";
import { DUMMY_GAMEPAD_BUTTON_CONTROL, GamepadAPIAxisControl, GamepadAPIButtonControl, GamepadButtonControl, GamepadDpadControl } from "../../controls/gamepad-controls.js";
import { InputManager } from "../../input-manager.js";
import { GamepadAPIController } from "../gamepad-api-controller.js";
import { GamepadHaptic, UpdatableGamepadHaptic } from "../haptic-controller.js";
import { GamepadController } from "./gamepad-controller.js";
import { NintendoProController } from "./nintendo-gamepad-controller.js";
import { DualShock3Controller, DualShock4Controller } from "./sony-gamepad-controller.js";
import { XInputController } from "./xinput-gamepad-controller.js";

const GAMEPAD_MODEL_MAP: Record<string, string> = {
    'xinput': 'microsoft-xinput',
    'Xbox 360 Controller (XInput STANDARD GAMEPAD)': 'microsoft-xinput',

    '054c-0268': 'sony-dualshock-3',

    'DUALSHOCK 4 Wireless Controller Extended Gamepad': 'sony-dualshock-4',
    '054c-05c4': 'sony-dualshock-4',
    '054c-09cc': 'sony-dualshock-4',
    '054c-0ba0': 'sony-dualshock-4',

    '054c-0ce6': 'sony-dualsense',

    '057e-0306': 'nintendo-wii-remote',
    '057e-0330': 'nintendo-wii-u-pro-controller',
    '057e-0337': 'nintendo-gamecube-adapter',
    '057e-2006': 'nintendo-switch-joycon-left',
    '057e-2007': 'nintendo-switch-joycon-right',
    '057e-2009': 'nintendo-switch-pro-controller',
    '057e-200e': 'nintendo-switch-joycon-grip',
};

let navigatorGamepads: (Gamepad | null)[] | null = null;
const resetNavigatorGamepads = (): void => {
    navigatorGamepads = null;
};

export abstract class NativeGamepadController extends GamepadController
    implements GamepadAPIController, XInputController, DualShock3Controller, DualShock4Controller, NintendoProController {
    protected _gamepad!: Gamepad;

    protected _buttons: GamepadButtonControl[] = new Array(18).fill(DUMMY_GAMEPAD_BUTTON_CONTROL);
    protected _axes: NumberControl[] = [];

    protected _buttonControlCount = 0;
    protected _axisControlCount = 0;

    protected _buttonCount!: number;
    protected _axesCount!: number;

    protected _dpad!: GamepadDpadControl;
    protected _leftStick!: Vector2Control;
    protected _rightStick!: Vector2Control;

    public readonly haptic: GamepadHaptic = new UpdatableGamepadHaptic();

    public constructor(inputManager: InputManager) {
        super(inputManager);
        inputManager.addEventListener('preUpdate', resetNavigatorGamepads);
    }

    public get gamepad(): Gamepad {
        return this._gamepad;
    }

    public get description(): string {
        return this._path[3];
    }

    //#region Control Properties
    // Standard 
    public get bottomFace(): GamepadButtonControl { return this._buttons[0]; }
    public get rightFace(): GamepadButtonControl { return this._buttons[1]; }
    public get leftFace(): GamepadButtonControl { return this._buttons[2]; }
    public get topFace(): GamepadButtonControl { return this._buttons[3]; }
    public get leftShoulder(): GamepadButtonControl { return this._buttons[4]; }
    public get rightShoulder(): GamepadButtonControl { return this._buttons[5]; }
    public get leftTrigger(): GamepadButtonControl { return this._buttons[6]; }
    public get rightTrigger(): GamepadButtonControl { return this._buttons[7]; }
    public get leftSpecial(): GamepadButtonControl { return this._buttons[8]; }
    public get rightSpecial(): GamepadButtonControl { return this._buttons[9]; }
    public get leftStickButton(): GamepadButtonControl { return this._buttons[10]; }
    public get rightStickButton(): GamepadButtonControl { return this._buttons[11]; }
    public get centerSpecial(): GamepadButtonControl { return this._buttons[16]; }

    public get dpad(): GamepadDpadControl { return this._dpad; }

    public get leftStick(): Vector2Control { return this._leftStick; }
    public get rightStick(): Vector2Control { return this._rightStick; }

    // XInput
    public get aButton(): GamepadButtonControl { return this._buttons[0]; }
    public get bButton(): GamepadButtonControl { return this._buttons[1]; }
    public get xButton(): GamepadButtonControl { return this._buttons[2]; }
    public get yButton(): GamepadButtonControl { return this._buttons[3]; }
    public get lbButton(): GamepadButtonControl { return this._buttons[4]; }
    public get rbButton(): GamepadButtonControl { return this._buttons[5]; }
    public get ltButton(): GamepadButtonControl { return this._buttons[6]; }
    public get rtButton(): GamepadButtonControl { return this._buttons[7]; }
    public get backButton(): GamepadButtonControl { return this._buttons[8]; }
    public get lsbButton(): GamepadButtonControl { return this._buttons[10]; }
    public get rsbButton(): GamepadButtonControl { return this._buttons[11]; }
    public get guideButton(): GamepadButtonControl { return this._buttons[16]; }

    // PlayStation
    public get crossButton(): GamepadButtonControl { return this._buttons[0]; }
    public get circleButton(): GamepadButtonControl { return this._buttons[1]; }
    public get squareButton(): GamepadButtonControl { return this._buttons[2]; }
    public get triangleButton(): GamepadButtonControl { return this._buttons[3]; }
    public get l1Button(): GamepadButtonControl { return this._buttons[4]; }
    public get r1Button(): GamepadButtonControl { return this._buttons[5]; }
    public get l2Button(): GamepadButtonControl { return this._buttons[6]; }
    public get r2Button(): GamepadButtonControl { return this._buttons[7]; }
    public get selectButton(): GamepadButtonControl { return this._buttons[8]; }
    public get shareButton(): GamepadButtonControl { return this._buttons[8]; }
    public get optionsButton(): GamepadButtonControl { return this._buttons[9]; }
    public get l3Button(): GamepadButtonControl { return this._buttons[10]; }
    public get r3Button(): GamepadButtonControl { return this._buttons[11]; }
    public get psButton(): GamepadButtonControl { return this._buttons[16]; }
    public get touchpadButton(): GamepadButtonControl { return this._buttons[17]; }

    // Nintendo
    public get bNintendoButton(): GamepadButtonControl { return this._buttons[0]; }
    public get aNintendoButton(): GamepadButtonControl { return this._buttons[1]; }
    public get yNintendoButton(): GamepadButtonControl { return this._buttons[2]; }
    public get xNintendoButton(): GamepadButtonControl { return this._buttons[3]; }
    public get lButton(): GamepadButtonControl { return this._buttons[4]; }
    public get rButton(): GamepadButtonControl { return this._buttons[5]; }
    public get zlButton(): GamepadButtonControl { return this._buttons[6]; }
    public get zrButton(): GamepadButtonControl { return this._buttons[7]; }
    public get minusButton(): GamepadButtonControl { return this._buttons[8]; }
    public get plusButton(): GamepadButtonControl { return this._buttons[9]; }
    public get homeButton(): GamepadButtonControl { return this._buttons[16]; }
    public get captureButton(): GamepadButtonControl { return this._buttons[17]; }

    // Universal
    public get startButton(): GamepadButtonControl { return this._buttons[9]; }

    //#endregion

    public get buttonCount(): number {
        return this._buttonCount;
    }

    public get axesCount(): number {
        return this._axesCount;
    }

    public get vibrationType(): string {
        return this.vibrationType;
    }

    public getButton(index: number): GamepadButtonControl {
        return this._buttons[index] ?? DUMMY_GAMEPAD_BUTTON_CONTROL;
    }

    public getAxis(index: number): NumberControl {
        return this._axes[index] ?? DUMMY_NUMBER_CONTROL;
    }

    public init(gamepad: Gamepad): void {
        this._setPath(this._path, gamepad);
        this._gamepad = gamepad;

        this._buttonCount = gamepad.buttons.length;
        this._axesCount = gamepad.axes.length;

        if (this._buttonCount > this._buttonControlCount) {
            let i = this._buttonControlCount;
            this._buttonControlCount = this._buttonCount;
            for (; i < this._buttonControlCount; i++) {
                const name = 'button' + i;
                const control = new GamepadAPIButtonControl(this, name, i);
                this._buttons[i] = control;
                Object.defineProperty(this, name, { get: (): GamepadButtonControl => { return control; } });
            }
        }
        if (this._axesCount > this._axisControlCount) {
            let i = this._axisControlCount;
            this._axisControlCount = this._axesCount;
            for (; i < this._axisControlCount; i++) {
                const name = 'axis' + i;
                const control = new GamepadAPIAxisControl(this, name, i);
                this._axes[i] = control;
                Object.defineProperty(this, name, { get: (): GamepadAPIAxisControl => { return control; } });
            }
        }

        (this.haptic as UpdatableGamepadHaptic).setActuator(gamepad.vibrationActuator);
    }

    private _setPath(path: ['gamepad', ...string[]], gamepad: Gamepad,): void {
        path[1] = gamepad.mapping || 'nonstandard';

        const id = gamepad.id;
        if (GAMEPAD_MODEL_MAP[id]) {
            path[2] = GAMEPAD_MODEL_MAP[id];
            path[3] = id;
            return;
        }
        let match = id.match(/^(.*)\s\(.*Vendor:\s([0-9a-f]{1,4})\sProduct:\s([0-9a-f]{1,4})\)$/);
        if (match) {
            const data = match[2].padStart(4, '0') + '-' + match[3].padStart(4, '0');
            path[2] = GAMEPAD_MODEL_MAP[data] ?? data;
            path[3] = match[1];
            return;
        }
        match = id.match(/^([0-9a-f]{1,4})-([0-9a-f]{1,4})-(.*)$/);
        if (match) {
            const data = match[1].padStart(4, '0') + '-' + match[2].padStart(4, '0');
            path[2] = GAMEPAD_MODEL_MAP[data] ?? data;
            path[3] = match[3];
            return;
        }
        path[2] = 'unknown';
        path[3] = id;
    }

    protected override _activationCheck(): boolean {
        for (let i = 0; i < this._axesCount; i++) {
            if (this._axes[i].isActivated() && i) {
                return true;
            }
        }
        for (let i = 0; i < this._buttonCount; i++) {
            if (this._buttons[i].isActivated()) {
                return true;
            }
        }
        return false;
    }

    protected override _update(): void {
        navigatorGamepads ??= navigator.getGamepads();
        this._gamepad = navigatorGamepads[this._gamepad.index] ?? this._gamepad;
    }

    public getActivatedButtons(out?: GamepadButtonControl[]): GamepadButtonControl[] {
        if (out === undefined) {
            out = [];
        } else {
            out.length = 0;
        }
        if (this.isActivated()) {
            for (let i = 0; i < this._buttonCount; i++) {
                if (this._buttons[i].isActivated()) {
                    out.push(this._buttons[i]);
                }
            }
        }
        return out;
    }

    public getActivatedAxes(out?: NumberControl[]): NumberControl[] {
        if (out === undefined) {
            out = [];
        } else {
            out.length = 0;
        }
        if (this.isActivated()) {
            for (let i = 0; i < this._axesCount; i++) {
                if (this._axes[i].isActivated()) {
                    out.push(this._axes[i]);
                }
            }
        }
        return out;
    }
}
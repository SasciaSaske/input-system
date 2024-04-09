import { NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { DUMMY_NUMBER_CONTROL } from "../../controls/dummy-controls.js";
import { DUMMY_GAMEPAD_TOUCH_BUTTON_CONTROL, GamepadAPIAxisControl, GamepadAPITouchButtonControl, GamepadTouchButtonControl, GamepadAPIAxesControl } from "../../controls/gamepad-controls.js";
import { PoseControl, XRPoseControl } from "../../controls/xr-controls.js";
import { lastElement } from "../../helpers/array-helper.js";
import { InputManager } from "../../input-manager.js";
import { GamepadAPIController } from "../gamepad-api-controller.js";
import { HapticController, UpdatableXRGamepadHaptic, XRGamepadHaptic } from "../haptic-controller.js";
import { XRSpacePoseData } from "./pose-data.js";
import { XRInputSourceController } from "./xr-controller.js";
import { XRGamepadController } from "./xr-gamepad-controller.js";

interface GamepadWithHapticActuators extends Gamepad {
    readonly hapticActuators: readonly GamepadHapticActuator[];
}

export class NativeXRGamepadController extends XRGamepadController implements GamepadAPIController, XRInputSourceController, HapticController {
    private _inputSource!: XRInputSource;
    private _gamepad!: Gamepad;

    private readonly _poseData: XRSpacePoseData;

    protected _buttons: GamepadTouchButtonControl[] = new Array(6).fill(DUMMY_GAMEPAD_TOUCH_BUTTON_CONTROL);
    protected _axes: NumberControl[] = [];

    protected _buttonControlCount = 0;
    protected _axisControlCount = 0;

    protected _buttonCount!: number;
    protected _axesCount!: number;

    public readonly touchpad: Vector2Control;
    public readonly thumbstick: Vector2Control;

    public readonly pose: PoseControl;

    public readonly haptic: XRGamepadHaptic = new UpdatableXRGamepadHaptic();

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._poseData = new XRSpacePoseData(inputManager.xr.native.context);

        this.touchpad = new GamepadAPIAxesControl(this, 'touchpad', 0, 1);
        this.thumbstick = new GamepadAPIAxesControl(this, 'thumbstick', 2, 3);

        this.pose = new XRPoseControl(this, 'pose', this._poseData);
    }

    public get inputSource(): XRInputSource {
        return this._inputSource;
    }

    public get handedness(): XRHandedness {
        return this._inputSource.handedness;
    }

    public get gamepad(): Gamepad {
        return this._gamepad;
    }

    public get trigger(): GamepadTouchButtonControl { return this._buttons[0]; }
    public get grip(): GamepadTouchButtonControl { return this._buttons[1]; }
    public get touchpadButton(): GamepadTouchButtonControl { return this._buttons[2]; }
    public get thumbstickButton(): GamepadTouchButtonControl { return this._buttons[3]; }
    public get primaryButton(): GamepadTouchButtonControl { return this._buttons[4]; }
    public get secondaryButton(): GamepadTouchButtonControl { return this._buttons[5]; }

    public get buttonCount(): number {
        return this._buttonCount;
    }

    public get axesCount(): number {
        return this._axesCount;
    }

    public getButton(index: number): GamepadTouchButtonControl {
        return this._buttons[index] ?? DUMMY_GAMEPAD_TOUCH_BUTTON_CONTROL;
    }

    public getAxis(index: number): NumberControl {
        return this._axes[index] ?? DUMMY_NUMBER_CONTROL;
    }

    public init(inputSource: XRInputSource): void {
        this._path[1] = lastElement(inputSource.profiles);
        this._path[2] = inputSource.profiles[0];
        this._inputSource = inputSource;
        this._gamepad = inputSource.gamepad!;
        this._poseData.setSpace(inputSource.gripSpace!);
        this._handeldManager.setHandedness(inputSource.handedness);

        this._buttonCount = this._gamepad.buttons.length;
        this._axesCount = this._gamepad.axes.length;

        if (this._buttonCount > this._buttonControlCount) {
            let i = this._buttonControlCount;
            this._buttonControlCount = this._buttonCount;
            for (; i < this._buttonControlCount; i++) {
                const name = 'button' + i;
                const control = new GamepadAPITouchButtonControl(this, name, i);
                this._buttons[i] = control;
                Object.defineProperty(this, name, { get: (): GamepadTouchButtonControl => { return control; } });
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

        (this.haptic as UpdatableXRGamepadHaptic).setActuators((this._gamepad as GamepadWithHapticActuators).hapticActuators);
    }

    protected override _update(): void {
        this._poseData.update();
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

    public getActivatedButtons(out?: GamepadTouchButtonControl[]): GamepadTouchButtonControl[] {
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
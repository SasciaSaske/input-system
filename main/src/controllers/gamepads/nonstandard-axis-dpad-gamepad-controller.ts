import { CustomGamepadDpadControl, GamepadAPINonstandardDpadButtonControl, GamepadAPINonstandardTriggerButtonControl, GamepadButtonControl, GamepadAPIAxesControl } from "../../controls/gamepad-controls.js";
import { NativeGamepadController } from "./native-gamepad-controller.js";
import { InputManager } from "../../input-manager.js";

export class NonstandardAxisDpadGamepadController extends NativeGamepadController {
    private _leftTrigger: GamepadButtonControl;
    private _rightTrigger: GamepadButtonControl;

    public override get leftTrigger(): GamepadButtonControl { return this._leftTrigger; }
    public override get rightTrigger(): GamepadButtonControl { return this._rightTrigger; }

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._leftTrigger = new GamepadAPINonstandardTriggerButtonControl(this, 'leftTriggerNonstandard', 6, 3);
        this._rightTrigger = new GamepadAPINonstandardTriggerButtonControl(this, 'leftTriggerNonstandard', 7, 4);

        this._dpad = new CustomGamepadDpadControl(this, 'dpad',
            new GamepadAPINonstandardDpadButtonControl(this, 'up', 9, -1, -0.4999),
            new GamepadAPINonstandardDpadButtonControl(this, 'down', 9, 0.001, 0.4999),
            new GamepadAPINonstandardDpadButtonControl(this, 'left', 9, 0.4999, 1),
            new GamepadAPINonstandardDpadButtonControl(this, 'right', 9, -0.4999, 0.001));

        this._leftStick = new GamepadAPIAxesControl(this, 'leftStick', 0, 1);
        this._rightStick = new GamepadAPIAxesControl(this, 'rightStick', 2, 5);
    }

    protected override _activationCheck(): boolean {
        for (let i = 0; i < this._axesCount; i++) {
            if (this._axes[i].isActivated() && i != 9) {
                return true;
            }
        }
        for (let i = 0; i < this._buttonCount; i++) {
            if (this._buttons[i].isActivated()) {
                return true;
            }
        }
        return this._dpad.isActivated();
    }

    public override getActivatedButtons(out?: GamepadButtonControl[]): GamepadButtonControl[] {
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
            if (this._leftTrigger.isActivated()) {
                out.push(this._leftTrigger);
            }
            if (this._rightTrigger.isActivated()) {
                out.push(this._rightTrigger);
            }
            if (this._dpad.up.isActivated()) {
                out.push(this.dpad.up);
            }
            if (this._dpad.down.isActivated()) {
                out.push(this.dpad.down);
            }
            if (this._dpad.left.isActivated()) {
                out.push(this.dpad.left);
            }
            if (this._dpad.right.isActivated()) {
                out.push(this.dpad.right);
            }
        }
        return out;
    }
}
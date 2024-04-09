import { NativeGamepadController } from '../controllers/gamepads/native-gamepad-controller.js';
import { InputController } from '../controllers/input-controller.js';
import { GamepadAPIController } from '../controllers/gamepad-api-controller.js';
import { ReadonlyVector2, Vector2 } from "../helpers/vectors-helper.js";
import { BaseInputControl, BooleanControl, IndexInputControl, InputControl, NumberControl } from './input-controls.js';
import { DUMMY_BOOLEAN_CONTROL, DUMMY_NUMBER_CONTROL } from './dummy-controls.js';

//#region Interfaces
export interface GamepadButtonControl extends BooleanControl {
    get value(): NumberControl;
}

export interface GamepadTouchButtonControl extends GamepadButtonControl {
    get touched(): BooleanControl;
}

export interface GamepadDpadControl extends InputControl<ReadonlyVector2> {
    get up(): GamepadButtonControl
    get down(): GamepadButtonControl
    get left(): GamepadButtonControl
    get right(): GamepadButtonControl
}
//#endregion

class BaseGamepadButtonControl extends BaseInputControl<boolean> {
    public readonly value: NumberControl;
    public constructor(controller: InputController, name: string, valueControl: NumberControl) {
        super(controller, name);
        this.value = valueControl;
    }

    public isActivated(): boolean {
        return this.value.isActivated();
    }

    public readValue(): boolean {
        return this.value.isActivated();
    }
}

export class GamepadAPIButtonControl extends BaseGamepadButtonControl {
    public constructor(controller: GamepadAPIController, name: string, index: number) {
        super(controller, name, new GamepadAPIButtonValueControl(controller, name + '/value', index));
    }
}

export class GamepadAPINonstandardDpadButtonControl extends BaseGamepadButtonControl {
    public constructor(controller: GamepadAPIController, name: string, axisIndex: number, minAxisValue: number, maxAxisValue: number) {
        super(controller, name, new GamepadAPINonstandardAxisRangeValueControl(controller, name + '/value', axisIndex, minAxisValue, maxAxisValue));
    }
}
export class GamepadAPINonstandardTriggerButtonControl extends BaseGamepadButtonControl {
    public constructor(controller: GamepadAPIController, name: string, buttonIndex: number, axisIndex: number) {
        super(controller, name, new GamepadAPINonstandardAxisButtonValueControl(controller, name + '/value', buttonIndex, axisIndex));
    }
}

export class GamepadAPINonstandardAxisRangeValueControl extends IndexInputControl<number> {
    private _minValue: number;
    private _maxValue: number;
    public constructor(controller: GamepadAPIController, name: string, axisIndex: number, minAxisValue: number, maxAxisValue: number) {
        super(controller, name, axisIndex);
        this._minValue = minAxisValue;
        this._maxValue = maxAxisValue;
    }

    public isActivated(): boolean {
        const axis = (this._controller as GamepadAPIController).gamepad.axes[this._index];
        return axis ? axis >= this._minValue && axis <= this._maxValue : false;
    }

    public readValue(): number {
        return this.isActivated() ? 1 : 0;
    }
}

export class GamepadAPINonstandardAxisButtonValueControl extends BaseInputControl<number> {
    private _buttonIndex: number;
    private _axisIndex: number;

    public constructor(controller: GamepadAPIController, name: string, buttonIndex: number, axisIndex: number) {
        super(controller, name);
        this._buttonIndex = buttonIndex;
        this._axisIndex = axisIndex;
    }

    public isActivated(): boolean {
        return this.readValue() > 0;
    }

    public readValue(): number {
        return (this._controller as GamepadAPIController).gamepad.axes[this._axisIndex] !== 0
            ? (this._controller as GamepadAPIController).gamepad.axes[this._axisIndex] * 0.5 + 0.5 ||
            ((this._controller as GamepadAPIController).gamepad.buttons?.[this._buttonIndex].value ?? 0)
            : 0;
    }
}

export class GamepadAPIButtonValueControl extends IndexInputControl<number> implements NumberControl {
    public isActivated(): boolean {
        return this.readValue() > 0;
    }

    public readValue(): number {
        return (this._controller as GamepadAPIController).gamepad.buttons[this._index]?.value ?? 0;
    }
}
export class GamepadAPIButtonTouchedControl extends IndexInputControl<boolean> implements BooleanControl {
    public isActivated(): boolean {
        return this.readValue();
    }

    public readValue(): boolean {
        return (this._controller as GamepadAPIController).gamepad.buttons[this._index]?.touched ?? false;
    }
}

export class GamepadAPITouchButtonControl extends GamepadAPIButtonControl implements GamepadTouchButtonControl {
    public readonly touched: GamepadAPIButtonTouchedControl;
    public constructor(controller: GamepadAPIController, name: string, index: number) {
        super(controller, name, index);
        this.touched = new GamepadAPIButtonTouchedControl(controller, name + '/touched', index);
    }
}

export class GamepadAPIAxisControl extends IndexInputControl<number> {
    public isActivated(): boolean {
        const value = this.readValue();
        return value > 0.075 || value < -0.075; // hardware drifting prevention value
    }

    public readValue(): number {
        return (this._controller as GamepadAPIController).gamepad.axes[this._index] ?? 0;
    }
}

export abstract class BaseGamepadDpadControl extends BaseInputControl<ReadonlyVector2> implements GamepadDpadControl {
    private _value = new Vector2();
    public abstract get up(): GamepadButtonControl;
    public abstract get down(): GamepadButtonControl;
    public abstract get left(): GamepadButtonControl;
    public abstract get right(): GamepadButtonControl;

    public isActivated(): boolean {
        return this.up.isActivated() || this.down.isActivated() || this.left.isActivated() || this.right.isActivated();
    }

    public readValue(): ReadonlyVector2 {
        this._value.x = this.right.value.readValue() - this.left.value.readValue();
        this._value.y = this.down.value.readValue() - this.up.value.readValue();
        return this._value;
    }
}

export class GamepadAPIDpadControl extends BaseGamepadDpadControl {
    public get up(): GamepadButtonControl {
        return (this._controller as NativeGamepadController).getButton(12);
    }
    public get down(): GamepadButtonControl {
        return (this._controller as NativeGamepadController).getButton(13);
    }
    public get left(): GamepadButtonControl {
        return (this._controller as NativeGamepadController).getButton(14);
    }
    public get right(): GamepadButtonControl {
        return (this._controller as NativeGamepadController).getButton(15);
    }
}

export class CustomGamepadDpadControl extends BaseGamepadDpadControl {
    public readonly up: GamepadButtonControl;
    public readonly down: GamepadButtonControl;
    public readonly left: GamepadButtonControl;
    public readonly right: GamepadButtonControl;

    constructor(controller: GamepadAPIController,
        name: string,
        up: GamepadButtonControl,
        down: GamepadButtonControl,
        left: GamepadButtonControl,
        right: GamepadButtonControl) {
        super(controller, name);
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
    }
}

export class GamepadAPIAxesControl extends BaseInputControl<ReadonlyVector2> {
    private _IndexX: number;
    private _IndexY: number;
    private _value = new Vector2();

    constructor(controller: GamepadAPIController, name: string, indexX: number, indexY: number) {
        super(controller, name);
        this._IndexX = indexX;
        this._IndexY = indexY;
    }

    public get x(): NumberControl {
        return (this._controller as NativeGamepadController).getAxis(this._IndexX);
    }
    public get y(): NumberControl {
        return (this._controller as NativeGamepadController).getAxis(this._IndexY);
    }
    public isActivated(): boolean {
        return this.x.isActivated() || this.y.isActivated();
    }
    public readValue(): ReadonlyVector2 {
        this._value.x = this.x.readValue();
        this._value.y = this.y.readValue();
        return this._value;
    }
}

//#region Dummy Controls
export const DUMMY_GAMEPAD_BUTTON_CONTROL: GamepadButtonControl = {
    ...DUMMY_BOOLEAN_CONTROL,
    value: DUMMY_NUMBER_CONTROL
};

export const DUMMY_GAMEPAD_TOUCH_BUTTON_CONTROL: GamepadTouchButtonControl = {
    ...DUMMY_GAMEPAD_BUTTON_CONTROL,
    touched: DUMMY_BOOLEAN_CONTROL
};
//#endregion
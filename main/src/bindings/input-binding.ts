import { InputAction } from "../action-modules/input-action.js";
import { InputControlActivator } from "../input-control-activator.js";
import { InputController } from "../controllers/input-controller.js";
import { InputControl } from "../controls/input-controls.js";
import { moveFromIndexToFront, removeAtIndex } from "../helpers/array-helper.js";
import { KeyOfExtendsType } from "../helpers/type-helpers.js";
import { Converter, InputConverter } from "../input-converters.js";
import { InputManager } from "../input-manager.js";
import { InputModifier, Modifier } from "../input-modifiers.js";
import { InputPath } from "../input-path.js";
import { InputTrigger, Trigger } from "../input-trigger.js";

export abstract class InputBinding<TValue> {
    protected _action: InputAction<TValue> | null = null;
    protected _inputManager: InputManager | null = null;
    protected _active = false;
    protected _maxPriority = -1;
    protected _isState = false;

    protected _converter: InputConverter<unknown, TValue> | null = null;
    private _modifiers: InputModifier<TValue>[] | null = null;
    private _trigger: InputTrigger<TValue> | null = null;

    protected _name: string | null = null;

    public constructor(name?: string) {
        this._name = name ?? null;
    }

    public get name(): string | null {
        return this.name;
    }

    public get action(): InputAction<TValue> | null {
        return this._action;
    }

    public get inputManager(): InputManager | null {
        return this._inputManager;
    }

    public get active(): boolean {
        return this._active;
    }

    public abstract get path(): InputPath | null;

    public isState(): boolean {
        return this._isState;
    }

    /* @internal */
    public _setAction(action: InputAction<TValue>): void {
        this._action = action;
        this._inputManager = action.inputManager;
    }

    /* @internal */
    public abstract _setActive(): boolean;

    /* @internal */
    public abstract _reset(): void;

    /* @internal */
    public _getMaxPriority(): number {
        return this._maxPriority;
    }

    /* @internal */
    public abstract _getControllerMaxPriority(controller: InputController): number;

    /* @internal */
    public abstract _addBoundControls(controller: InputController): void;

    /* @internal */
    public abstract _removeBoundControls(controller: InputController): boolean;

    /* @internal */
    public abstract _checkConstrolsActivation(): boolean;

    protected _checkControlActivation<ControlType>(controls: InputControl<ControlType>[], activationModifier: InputControlActivator<ControlType> | null | undefined): boolean {
        if (activationModifier) {
            for (let i = 0; i < controls.length; i++) {
                if (activationModifier.check(controls[i])) {
                    moveFromIndexToFront(controls, i);
                    return true;
                }
            }
        } else {
            for (let i = 0; i < controls.length; i++) {
                if (controls[i].isActivated()) {
                    moveFromIndexToFront(controls, i);
                    return true;
                }
            }
        }
        return false;
    }

    protected abstract _readRawValue(): TValue;

    private _applyModifiers(value: TValue): TValue {
        if (this._modifiers) {
            for (let i = 0; i < this._modifiers.length; i++) {
                value = this._modifiers[i].execute(value);
            }
        }
        return value;
    }

    /* @internal */
    public _readValue(): TValue {
        return this._applyModifiers(this._readRawValue());
    }

    /* @internal */
    public setConverter(converter: unknown, ...args: unknown[]): InputBinding<TValue>;
    public setConverter(converter: unknown, arg0: unknown, arg1: unknown, arg2: unknown): InputBinding<TValue> { //! temp
        if (typeof converter === 'string') {
            converter = Converter[converter as keyof typeof Converter](arg0 as number, arg1 as number | undefined, arg2 as number | undefined);
        } else if (typeof converter === 'function') {
            converter = { execute: converter };
        }
        this._converter = converter as InputConverter<unknown, TValue>;
        return this;
    }

    /* @internal */
    public abstract setConverterAsControlActivator(converter: unknown, ...args: unknown[]): InputBinding<boolean>;

    public addModifier<T extends TValue>(modifier: InputModifier<T> | ((value: T) => T)): InputBinding<T>;
    public addModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        modifier: InputModifier<TValue> | ((value: TValue) => TValue) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): InputBinding<TValue> {
        this._modifiers ??= [];
        if (typeof modifier === 'string') {
            modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TValue>;
        } else if (typeof modifier === 'function') {
            modifier = { execute: modifier };
        }
        this._modifiers.push(modifier);
        return this;
    }

    public removeModifier(index: number): boolean {
        if (this._modifiers?.[index]) {
            removeAtIndex(this._modifiers, index);
            return true;
        }
        return false;
    }

    public getModifier<T extends InputModifier<TValue>>(index: number): T | null {
        return this._modifiers?.[index] as T ?? null;
    }

    public replaceModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        index: number, modifier: InputModifier<TValue> | ((value: TValue) => TValue) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): boolean {
        if (this._modifiers?.[index]) {
            if (typeof modifier === 'string') {
                modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TValue>;
            } else if (typeof modifier === 'function') {
                modifier = { execute: modifier };
            }
            this._modifiers[index] = modifier;
            return true;
        }
        return false;
    }

    public setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TValue>>>(
        trigger: InputTrigger<TValue> | ((value: TValue, deltaTime?: number) => boolean) | T,
        arg0?: Parameters<typeof Trigger[T]>[0], arg1?: Parameters<typeof Trigger[T]>[1], arg2?: Parameters<typeof Trigger[T]>[2]): InputBinding<TValue> {
        if (typeof trigger === 'string') {
            trigger = Trigger[trigger](arg0 as number, arg1 as number | undefined, arg2 as number | undefined) as InputTrigger<TValue>;
            trigger.reset?.();
        } else if (typeof trigger === 'function') {
            trigger = { execute: trigger } as InputTrigger<TValue>;
        } else {
            trigger.reset?.();
        }
        this._trigger = trigger;
        return this;
    }

    public getTrigger<T extends InputTrigger<TValue>>(): T | null {
        return this._trigger as T | null;
    }

    public abstract getActiveControl(): InputControl<unknown> | null;
}
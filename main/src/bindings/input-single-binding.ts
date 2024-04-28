import { InputControlMap, InputControllerMap } from "../controllers/input-maps.js";
import { InputController } from "../controllers/input-controller.js";
import { InputControl } from "../controls/input-controls.js";
import { removeAtIndex } from "../helpers/array-helper.js";
import { KeyOfExtendsType, WidenAsTuple } from "../helpers/type-helpers.js";
import { ControlActivator, ConverterToControlActivator, InputControlActivator } from "../input-control-activator.js";
import { Converter, InputConverter } from "../input-converters.js";
import { InputModifier, Modifier } from "../input-modifiers.js";
import { InputPath } from "../input-path.js";
import { InputTrigger, Trigger } from "../input-trigger.js";
import { InputBinding } from "./input-binding.js";

class BaseInputSingleBinding<TControl, TValue = TControl> extends InputBinding<TValue> {
    private _inputPath!: InputPath;
    private _boundControls: InputControl<TControl>[] | null = null;

    private _activator: InputControlActivator<TControl> | null = null;

    public get path(): InputPath | null {
        return this._inputPath ?? null;
    }

    /* @internal */
    public override _setActive(): boolean {
        if (this._active === false &&
            this._boundControls?.length) {
            this._active = true;
            return true;
        }
        return false;
    }

    /* @internal */
    public _reset(): void {
        if (this._active) {
            this._active = false;
            this._isState = false;
            this._boundControls!.length = 0;
        }
    }

    /* @internal */
    public _getControllerMaxPriority(controller: InputController): number {
        if (controller._checkPath(this._inputPath)) {
            return this._maxPriority;
        }
        return -1;
    }

    /* @internal */
    public _addBoundControls(controller: InputController): void {
        const control = controller._getControlfromPath<TControl>(this._inputPath.controlPath);
        if (!control) return;
        this._boundControls ??= new Array<InputControl<TControl>>();
        this._boundControls.push(control);
        this._isState = (this._isState || control.isState()) && !this._activator;
    }

    /* @internal */
    public _removeBoundControls(controller: InputController): boolean {
        if (this._boundControls) {
            for (let i = this._boundControls.length - 1; i >= 0; i--) {
                if (this._boundControls[i].getController() === controller) {
                    removeAtIndex(this._boundControls, i);
                    if (this._boundControls.length === 0) {
                        this._active = false;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /* @internal */
    public _checkConstrolsActivation(): boolean {
        return this._checkControlActivation(this._boundControls!, this._activator);
    }

    protected _readRawValue(): TValue {
        return this._converter ? this._converter.execute(this._boundControls![0].readValue()) : this._boundControls![0].readValue() as unknown as TValue;
    }

    public setPath<
        ControllerPath extends keyof InputControllerMap,
        ControlPath extends KeyOfExtendsType<InputControllerMap[ControllerPath], TControl>>
        (arg0: ControllerPath | string, arg1?: ControlPath | string): BaseInputSingleBinding<TControl, TControl extends TValue ? TControl : TValue> {
        this._pathSetup(arg0, arg1 as string);
        return this as BaseInputSingleBinding<TControl, TControl extends TValue ? TControl : TValue>;
    }

    private _pathSetup(a: string, b?: string): void {
        this._inputPath ??= new InputPath();
        this._inputPath._init(a, b!);
        this._maxPriority = this._inputPath._priority;
        if (this._action) {
            this._boundControls = null;
            this._active = false;
            this._action._resetBinding(this);
        }
    }


    public setControlActivator<T extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl>>>(
        activator: InputControlActivator<TControl> | ((control: InputControl<TControl>) => boolean) | T, arg0?: Parameters<typeof ControlActivator[T]>[0]): BaseInputSingleBinding<TControl, TValue> {
        if (typeof activator === 'string') {
            activator = ControlActivator[activator](arg0 as InputController & number);
        } else if (typeof activator === 'function') {
            activator = {
                check: activator
            };
        }
        this._activator = activator;
        if (this._isState) {
            this._isState = false;
            this._action?._updateBindingState(this);
        }
        return this;
    }

    public removeControlActivator(): void {
        this._activator = null;
        if (this._boundControls?.[0].isState()) {
            this._isState = true;
            this._action?._updateBindingState(this);
        }
    }

    public getControlActivator(): InputControlActivator<TControl> | null {
        return this._activator;
    }

    public getActiveControl<T extends TControl>(): InputControl<T> | null {
        return this._boundControls?.[0] as InputControl<T> ?? null;
    }

    public setConverterAsControlActivator(converter: unknown, ...args: unknown[]): BaseInputSingleBinding<TControl, boolean> {
        this.setConverter(converter, args);
        const converterActivator = new ConverterToControlActivator(this._converter as InputConverter<TControl, boolean>);
        this._activator = converterActivator;
        this._converter = converterActivator as unknown as InputConverter<TControl, TValue>;
        return this as unknown as BaseInputSingleBinding<TControl, boolean>;
    }
}

export interface InputSingleBinding<TControl, TValue = TControl> extends BaseInputSingleBinding<TControl, TValue> {
    setPath<
        TControllerPath extends keyof InputControllerMap,
        TControlPath extends KeyOfExtendsType<InputControllerMap[TControllerPath], TControl> & keyof InputControlMap,
        T extends InputControlMap[TControlPath]>
        (controller: TControllerPath, control: TControlPath):
        InputSingleBinding<T, T extends TValue ? T : TValue>;
    setPath<TControllerPath extends string,
        TControlPath extends TControllerPath extends keyof InputControllerMap ?
        KeyOfExtendsType<InputControllerMap[TControllerPath], TControl> & keyof InputControlMap
        : keyof InputControlMap | string,
        T extends TControlPath extends keyof InputControlMap ? InputControlMap[TControlPath] : TControl>
        (controller: TControllerPath, control: TControlPath):
        InputSingleBinding<T, T extends TValue ? T : TValue>;
    setPath(path: string):
        InputSingleBinding<TControl, TControl extends TValue ? TControl : TValue>;

    setConverter<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, TValue>>>(
        ...args:
            unknown extends TControl
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : unknown extends TValue
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : TValue extends TControl
            ? [converter: never]
            : [converter: T, ...args: Parameters<typeof Converter[T]>]):
        ReturnType<typeof Converter[T]> extends InputConverter<infer C, infer V>
        ? InputSingleBinding<C extends TControl ? C : TControl, V extends TValue ? V : TValue>
        : never;
    setConverter<C extends TControl, V extends TValue>(
        ...args:
            unknown extends TControl
            ? [converter: InputConverter<C, V> | ((value: C) => V)]
            : unknown extends TValue
            ? [converter: InputConverter<C, V> | ((value: C) => V)]
            : TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<C, boolean> | ((value: C) => boolean)]
            : [converter: InputConverter<C, V> | ((value: C) => V)]):
        InputSingleBinding<C, V>;

    setConverterAsControlActivator<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, boolean>>>(
        ...args:
            unknown extends TValue
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: never]):
        ReturnType<typeof Converter[T]> extends InputConverter<infer C, boolean>
        ? InputSingleBinding<C extends TControl ? C : TControl, boolean>
        : never;
    setConverterAsControlActivator<T extends TControl>(
        ...args:
            unknown extends TValue
            ? [converter: InputConverter<T, boolean> | ((value: T) => boolean)]
            : TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<T, boolean> | ((value: T) => boolean)]
            : [converter: never]):
        InputSingleBinding<T, boolean>;

    setConverterAsControlActivator<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, boolean>>>(
        ...args: TValue extends TControl
            ? unknown extends TControl
            ? [converter: InputConverter<TControl, boolean> | ((value: TControl) => boolean)] | [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<TControl, boolean> | ((value: TControl) => boolean)] | [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: never]): InputSingleBinding<TControl, boolean>;

    addModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        modifier: T, ...args: Parameters<typeof Modifier[T]>):
        InputSingleBinding<TControl, ReturnType<typeof Modifier[T]> extends InputModifier<infer Type> ? Type : TValue>;
    addModifier<T extends TValue>(modifier: InputModifier<T> | ((value: T) => T)):
        InputSingleBinding<TControl, T extends TValue ? T : TValue>;

    removeModifier(index: number): boolean;
    getModifier<T extends InputModifier<TValue>>(index: number): T | null;
    replaceModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        index: number, modifier: T, ...args: Parameters<typeof Modifier[T]>): boolean;
    replaceModifier(index: number, modifier: InputModifier<TValue> | ((value: TValue) => TValue)): boolean;

    setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TValue>>>(
        trigger: T, ...args: Parameters<typeof Trigger[T]>):
        InputSingleBinding<TControl, ReturnType<typeof Trigger[T]> extends InputModifier<infer Type extends TValue> ? Type : TValue>;
    setTrigger<T extends TValue>(trigger: InputTrigger<T> | ((value: T, deltaTime?: number) => boolean)):
        InputSingleBinding<TControl, T extends TValue ? T : TValue>;

    getTrigger<T extends InputTrigger<TValue>>(): T | null;

    setControlActivator<T extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl>>>(
        activator: T,
        ...args: Parameters<typeof ControlActivator[T]>):
        InputSingleBinding<ReturnType<typeof ControlActivator[T]> extends InputControlActivator<infer Type> ? Type : TControl, TValue>;
    setControlActivator<T extends TControl>(activator: InputControlActivator<T> | ((control: InputControl<T>) => boolean)):
        InputSingleBinding<T, TValue>;

    removeControlActivator(): void;
    getControlActivator(): InputControlActivator<TControl> | null;

    getActiveControl<T extends TControl>(): InputControl<T> | null;
}

interface UnconvertedInputSingleBinding<TControl, TValue = TControl> extends
    Pick<InputSingleBinding<TControl, TValue>, 'setConverter' | 'setConverterAsControlActivator'> { }

export const InputSingleBinding = BaseInputSingleBinding as
    {
        new <TControl = any, TValue = TControl>(): TValue extends TControl
            ? InputSingleBinding<TControl, WidenAsTuple<TValue>>
            : UnconvertedInputSingleBinding<TControl, WidenAsTuple<TValue>>;
    };




import { InputControllerMap } from "../controllers/input-maps.js";
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
        return this._converter ? this._converter.apply(this._boundControls![0].readValue()) : this._boundControls![0].readValue() as unknown as TValue;
    }

    public setPath<
        ControllerPath extends keyof InputControllerMap,
        ControlPath extends KeyOfExtendsType<InputControllerMap[ControllerPath], TControl>>
        (arg0: ControllerPath | string, arg1?: ControlPath | string): this {
        this._pathSetup(arg0, arg1 as string);
        return this;
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
        activator: InputControlActivator<TControl> | ((control: InputControl<TControl>) => boolean) | T, arg0?: Parameters<typeof ControlActivator[T]>[0]): this {
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

    public setConverterAsControlActivator(converter: unknown, ...args: unknown[]): this {
        this.setConverter(converter, args);
        const converterActivator = new ConverterToControlActivator(this._converter as InputConverter<TControl, boolean>);
        this._activator = converterActivator;
        this._converter = converterActivator as unknown as InputConverter<TControl, TValue>;
        return this;
    }
}

export interface InputSingleBinding<TControl, TValue = TControl> extends BaseInputSingleBinding<TControl, TValue> {
    setPath<
        ControllerPath extends keyof InputControllerMap,
        ControlPath extends KeyOfExtendsType<InputControllerMap[ControllerPath], TControl>>
        (controller: ControllerPath, control: ControlPath): this;
    setPath(path: string): this;
    setPath(controller: string, control: string): this;

    setConverter<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, TValue>>>(
        ...args: TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<TControl, boolean> | ((value: TControl) => boolean)] | [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: InputConverter<TControl, TValue> | ((value: TControl) => TValue)] | [converter: T, ...args: Parameters<typeof Converter[T]>]): this;
    setConverterAsControlActivator<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, boolean>>>(
        ...args: TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<TControl, boolean> | ((value: TControl) => boolean)] | [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: never]): this;

    addModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        modifier: T, ...args: Parameters<typeof Modifier[T]>): this;
    addModifier(modifier: InputModifier<TValue> | ((value: TValue) => TValue)): this;
    removeModifier(index: number): boolean;
    getModifier<T extends InputModifier<TValue>>(index: number): T | null;
    replaceModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        index: number, modifier: T, ...args: Parameters<typeof Modifier[T]>): boolean;
    replaceModifier(index: number, modifier: InputModifier<TValue> | ((value: TValue) => TValue)): boolean;

    setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TValue>>>(
        trigger: T, ...args: Parameters<typeof Trigger[T]>): this
    setTrigger(trigger: InputTrigger<TValue> | ((value: TValue, deltaTime?: number) => boolean)): this;
    getTrigger<T extends InputTrigger<TValue>>(): T | null;


    setControlActivator<T extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl>>>(
        activator: T,
        ...args: Parameters<typeof ControlActivator[T]>): this;
    setControlActivator(activator: InputControlActivator<TControl> | ((control: InputControl<TControl>) => boolean)): this;
    removeControlActivator(): void;
    getControlActivator(): InputControlActivator<TControl> | null;

    getActiveControl<T extends TControl>(): InputControl<T> | null;
}

interface UnconvertedInputSingleBinding<TControl, TValue = TControl> extends
    Pick<InputSingleBinding<TControl, TValue>, 'setConverter' | 'setConverterAsControlActivator'> { }

export const InputSingleBinding = BaseInputSingleBinding as
    {
        new <TControl, TValue = TControl>(): TValue extends TControl
            ? InputSingleBinding<TControl, WidenAsTuple<TValue>>
            : UnconvertedInputSingleBinding<TControl, WidenAsTuple<TValue>>;
    };




import { InputControlMap, InputControllerMap } from "../controllers/input-maps.js";
import { InputController } from "../controllers/input-controller.js";
import { InputControl } from "../controls/input-controls.js";
import { removeAtIndex } from "../helpers/array-helper.js";
import { FirstOf, IndexOfType, KeyOfExtendsType, NullableKeys, Tuple, TupleWithTypeAtIndex, WidenAsTuple } from "../helpers/type-helpers.js";
import { CompositeControlActivator, ControlActivator, ConverterToCompositeControlActivator, InputCompositeControlActivator, InputControlActivator } from "../input-control-activator.js";
import { Converter, InputConverter } from "../input-converters.js";
import { InputModifier, Modifier } from "../input-modifiers.js";
import { InputPath } from "../input-path.js";
import { InputTrigger, Trigger } from "../input-trigger.js";
import { InputBinding } from "./input-binding.js";

class BaseInputCompositeBinding<TControl extends Tuple, TValue = TControl> extends InputBinding<TValue> {
    private _inputPaths: InputPath[] = [];
    private _boundControlsArray: { [K in keyof TControl]: InputControl<TControl[K]>[] | null } | null = null;
    private _activeControls: Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> | null }> | null = null;

    private _cachedValue: NullableKeys<TControl> | null = null;

    private _activators: { [K in keyof TControl]: InputControlActivator<TControl[K]> | null } | null = null;
    private _compositeActivator: InputCompositeControlActivator<TControl> | null = null;

    public get path(): InputPath | null {
        return this._inputPaths[0] ?? null;
    }

    public get paths(): readonly InputPath[] {
        return this._inputPaths;
    }

    /* @internal */
    public _setActive(): boolean {
        if (this._active || this._boundControlsArray === null) {
            return false;
        }
        for (let i = 0; i < this._boundControlsArray.length; i++) {
            if (!this._boundControlsArray[i]?.length) {
                return false;
            }
        }
        this._active = true;
        this._cachedValue ??= new Array(this._inputPaths.length).fill(null) as NullableKeys<TControl>;
        return true;
    }

    /* @internal */
    public _reset(): void {
        if (this._active) {
            this._active = false;
            this._isState = false;
            this._boundControlsArray!.fill(null);
            this._cachedValue!.fill(null);
        }
    }

    /* @internal */
    public _getControllerMaxPriority(controller: InputController): number {
        let maxPriority = -1;
        for (let i = 0; i < this._inputPaths.length; i++) {
            const path = this._inputPaths[i];
            if (controller._checkPath(path)) {
                if (path._priority === this._maxPriority) {
                    return path._priority;
                } else {
                    maxPriority = Math.max(maxPriority, path._priority);
                }
            }
        }
        return maxPriority;
    }

    /* @internal */
    public _addBoundControls(controller: InputController): void {
        for (let i = 0; i < this._inputPaths.length; i++) {
            const path = this._inputPaths[i];
            if (controller._checkPath(path)) {
                const control = controller._getControlfromPath<TControl>(path.controlPath);
                if (!control) break;
                if (this._boundControlsArray === null) {
                    const length = this._inputPaths.length;
                    const boundControlsArray = new Array(length).fill(null) as { [K in keyof TControl]: InputControl<TControl[K]>[] | null };
                    this._boundControlsArray = boundControlsArray;
                    this._activeControls = [] as Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> | null }>;
                    for (let i = 0; i < length; i++) {
                        Object.defineProperty(this._activeControls, i, { get: (): TControl[typeof i] | null => { return boundControlsArray[i]?.[0] ?? null; } });
                    }
                }
                this._boundControlsArray[i] ??= [];
                this._boundControlsArray[i]!.push(control);
                this._isState = (this._isState || control.isState()) && !this._activators?.[i] && !this._compositeActivator;
            }
        }
    }

    /* @internal */
    public _removeBoundControls(controller: InputController): boolean {
        if (this._boundControlsArray) {
            let hasUnboundControl = false;
            for (let i = 0; i < this._boundControlsArray.length; i++) {
                const controls = this._boundControlsArray[i];
                if (controls?.length) {
                    for (let j = 0; j < controls.length;) {
                        if (controls[j].getController() === controller) {
                            removeAtIndex(controls, j);
                        } else {
                            j++;
                        }
                    }
                    if (controls.length === 0) {
                        hasUnboundControl = true;
                    }
                }
            }
            if (hasUnboundControl) {
                this._active = false;
                return true;
            }
        }
        return false;
    }

    /* @internal */
    public _checkConstrolsActivation(): boolean {
        if (this._compositeActivator) {
            for (let i = 0; i < this._boundControlsArray!.length; i++) {
                this._checkControlActivation(this._boundControlsArray![i]!, this._activators?.[i]);
            }
            return this._compositeActivator.check(this._activeControls as Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> }>);
        }
        let activated = false;
        for (let i = 0; i < this._boundControlsArray!.length; i++) {
            activated = this._checkControlActivation(this._boundControlsArray![i]!, this._activators?.[i]) || activated;
        }
        return activated;
    }

    protected _readRawValue(): TValue {
        for (let i = 0; i < this._cachedValue!.length; i++) {
            this._cachedValue![i] = this._boundControlsArray![i]![0].readValue();
        }
        return this._converter ? this._converter.execute(this._cachedValue as TControl) : this._cachedValue as TValue;
    }

    public setPath<
        TIndex extends IndexOfType<TControl>,
        TControllerPath extends keyof InputControllerMap,
        TControlPath extends KeyOfExtendsType<InputControllerMap[TControllerPath], TControl[TIndex]> & keyof InputControlMap,
        T extends TupleWithTypeAtIndex<TControl, TIndex, InputControlMap[TControlPath]>>
        (index: TIndex, controller: TControllerPath, control: TControlPath):
        BaseInputCompositeBinding<T, T extends TValue ? T : TValue>;
    public setPath(index: number, arg0: string, arg1?: string): BaseInputCompositeBinding<TControl, TControl extends TValue ? TControl : TValue> {
        this._pathSetup(index, arg0, arg1 as string);
        return this as BaseInputCompositeBinding<TControl, TControl extends TValue ? TControl : TValue>;
    }

    private _pathSetup(index: number, a: string, b?: string): this {
        const path = this._inputPaths[index] ??= new InputPath();
        path._init(a, b!);

        for (let i = 0; i < this._inputPaths.length; i++) {
            this._maxPriority = Math.max(this._maxPriority, this._inputPaths[i]._priority);
        }

        if (this._action) {
            if (this._boundControlsArray) {
                for (let i = 0; i < this._boundControlsArray.length; i++) {
                    const boundControls = this._boundControlsArray[i];
                    if (boundControls) {
                        boundControls.length = 0;
                    }
                }
                this._active = false;
            }
            this._action._resetBinding(this);
        }
        return this;
    }

    setControlActivator<
        TIndex extends IndexOfType<TControl>,
        TKey extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl[TIndex]>>>(
            index: TIndex,
            modifier: TKey,
            ...args: Parameters<typeof ControlActivator[TKey]>):
        BaseInputCompositeBinding<TupleWithTypeAtIndex<TControl, TIndex,
            ReturnType<typeof ControlActivator[TKey]> extends InputControlActivator<infer Type extends TControl[TIndex]> ? Type : never>,
            TValue>;
    setControlActivator<TIndex extends IndexOfType<TControl>, TType extends TControl[TIndex]>(
        index: TIndex,
        modifier: InputControlActivator<TType> | ((control: InputControl<TType>) => boolean)):
        BaseInputCompositeBinding<TupleWithTypeAtIndex<TControl, TIndex, TType>, TValue>;
    public setControlActivator<
        TIndex extends IndexOfType<TControl>,
        TKey extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl[TIndex]>>>(
            index: TIndex,
            activator: InputControlActivator<TControl[TIndex]> | ((control: InputControl<TControl[TIndex]>) => boolean) | TKey,
            arg0?: Parameters<typeof ControlActivator[TKey]>[0]): BaseInputCompositeBinding<TControl, TValue> {
        this._activators ??= new Array(this._inputPaths.length).fill(null) as { [K in keyof TControl]: InputControlActivator<TControl[K]> | null };
        if (typeof activator === 'string') {
            activator = ControlActivator[activator](arg0 as InputController & number);
        } else if (typeof activator === 'function') {
            activator = {
                check: activator
            };
        }
        this._activators[index] = activator;

        if (this._isState && !this._checkStateControls()) {
            this._isState = false;
            this._action?._updateBindingState(this);
        }
        return this;
    }

    public removeControlActivator<PathIndex extends IndexOfType<TControl>>(index: PathIndex): void {
        if (this._activators) {
            this._activators[index] = null;

            if (!this._compositeActivator && this._checkStateControls()) {
                this._isState = true;
                this._action?._updateBindingState(this);

            }

            if (this._boundControlsArray) {
                for (let i = 0; i < this._boundControlsArray.length; i++) {
                    if (this._boundControlsArray[i]?.[0].isState() &&
                        !this._activators?.[i]) {
                        this._isState = true;
                        this._action?._updateBindingState(this);
                        break;
                    }
                }
            }
        }
    }

    public getControlActivator<
        PathIndex extends IndexOfType<TControl>>(index: PathIndex): InputControlActivator<TControl[PathIndex]> | null {
        return this._activators?.[index] ?? null;
    }

    public setCompositeControlActivator<T extends KeyOfExtendsType<typeof CompositeControlActivator, (...args: unknown[]) => InputCompositeControlActivator<TControl>>>(
        activator: InputCompositeControlActivator<TControl> | ((controls: { [K in keyof TControl]: InputControl<TControl[K]> }) => boolean) | T,
        arg0: Parameters<typeof CompositeControlActivator[T]>[0],
        arg1: Parameters<typeof CompositeControlActivator[T]>[1],
        arg2: Parameters<typeof CompositeControlActivator[T]>[2]): BaseInputCompositeBinding<TControl, TValue> {
        if (typeof activator === 'string') {
            activator = CompositeControlActivator[activator](arg0!, arg1, arg2) as InputCompositeControlActivator<TControl>;
        } else if (typeof activator === 'function') {
            activator = {
                check: activator
            };
        }
        this._compositeActivator = activator;

        if (this._isState) {
            this._isState = false;
            this._action?._updateBindingState(this);
        }
        this._action?._updateBindingState(this);
        return this;
    }

    public removeCompositeControlActivator(): void {
        this._compositeActivator = null;

        if (this._checkStateControls()) {
            this._isState = true;
            this._action?._updateBindingState(this);
        }
    }

    private _checkStateControls(): boolean {
        if (this._boundControlsArray) {
            for (let i = 0; i < this._boundControlsArray.length; i++) {
                if (this._boundControlsArray[i]?.[0].isState() &&
                    !this._activators?.[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    public getCompositeControlActivator(): InputCompositeControlActivator<TControl> | null {
        return this._compositeActivator;
    }

    public getActiveControl<T extends InputControl<unknown> = InputControl<unknown>>(index?: number): T | null {
        return this._boundControlsArray?.[index ?? 0]?.[0] as T ?? null;
    }

    public getActiveControls(): Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> | null; }> | null {
        return this._activeControls;
    }

    public setConverterAsControlActivator<T extends TControl>(converter: unknown, ...args: unknown[]): BaseInputCompositeBinding<T, boolean>;
    public setConverterAsControlActivator(converter: unknown, arg0: unknown, arg1: unknown, arg2: unknown): BaseInputCompositeBinding<TControl, boolean> {
        this.setConverter(converter, arg0, arg1, arg2);
        const converterActivator = new ConverterToCompositeControlActivator(this._converter as InputConverter<TControl, boolean>);
        this._compositeActivator = converterActivator;
        this._converter = converterActivator as unknown as InputConverter<TControl, TValue>;
        return this as unknown as BaseInputCompositeBinding<TControl, boolean>;
    }
}

export interface InputCompositeBinding<TControl extends Tuple, TValue = TControl>
    extends BaseInputCompositeBinding<TControl, TValue> {
    readonly paths: readonly InputPath[];

    setPath<
        TIndex extends IndexOfType<TControl>,
        TControllerPath extends keyof InputControllerMap,
        TControlPath extends KeyOfExtendsType<InputControllerMap[TControllerPath], TControl[TIndex]> & keyof InputControlMap,
        T extends TupleWithTypeAtIndex<TControl, TIndex, InputControlMap[TControlPath]>>
        (index: TIndex, controller: TControllerPath, control: TControlPath):
        InputCompositeBinding<T, T extends TValue ? T : TValue>;
    setPath<TIndex extends IndexOfType<TControl>,
        TControllerPath extends string,
        TControlPath extends TControllerPath extends keyof InputControllerMap
        ? KeyOfExtendsType<InputControllerMap[TControllerPath], TControl[TIndex]> & keyof InputControlMap
        : keyof InputControlMap | string,
        T extends TControlPath extends keyof InputControlMap
        ? TupleWithTypeAtIndex<TControl, TIndex, InputControlMap[TControlPath]>
        : TupleWithTypeAtIndex<TControl, TIndex, any>>
        (index: TIndex, controller: TControllerPath, control: TControlPath):
        InputCompositeBinding<T, T extends TValue ? T : TValue>;
    setPath<TIndex extends IndexOfType<TControl>, T extends TupleWithTypeAtIndex<TControl, TIndex, any>>(index: TIndex, path: string):
        InputCompositeBinding<T, T extends TValue ? T : TValue>;

    setConverter<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, TValue>>>(
        ...args:
            Tuple extends TControl
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : unknown extends TValue
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : TValue extends TControl
            ? [converter: never]
            : [converter: T, ...args: Parameters<typeof Converter[T]>]):
        ReturnType<typeof Converter[T]> extends InputConverter<infer C, infer V>
        ? InputCompositeBinding<C extends TControl ? C : TControl, V extends TValue ? V : TValue>
        : never
    setConverter<C extends TControl, V extends TValue>(
        ...args:
            Tuple extends TControl
            ? [converter: InputConverter<C, V> | ((value: C) => V)]
            : unknown extends TValue
            ? [converter: InputConverter<C, V> | ((value: C) => V)]
            : TValue extends TControl
            ? [converter: never]
            : TValue extends boolean
            ? [converter: InputConverter<C, boolean> | ((value: C) => boolean)]
            : [converter: InputConverter<C, V> | ((value: C) => V)]):
        InputCompositeBinding<C, V>;

    setConverterAsControlActivator<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TControl, boolean>>>(
        ...args:
            unknown extends TValue
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : TValue extends boolean
            ? [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: never]):
        ReturnType<typeof Converter[T]> extends InputConverter<infer C, boolean>
        ? InputCompositeBinding<C extends TControl ? C : TControl, boolean>
        : never
    setConverterAsControlActivator<T extends TControl>(
        ...args:
            unknown extends TValue
            ? [converter: InputConverter<T, boolean> | ((value: T) => boolean)]
            : TValue extends boolean
            ? [converter: InputConverter<T, boolean> | ((value: T) => boolean)]
            : [converter: never]):
        InputCompositeBinding<T, boolean>;

    addModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        modifier: T, ...args: Parameters<typeof Modifier[T]>):
        InputCompositeBinding<TControl, ReturnType<typeof Modifier[T]> extends InputModifier<infer Type extends TValue> ? Type : TValue>;
    addModifier<T extends TValue>(modifier: InputModifier<T> | ((value: T) => T)):
        InputCompositeBinding<TControl, T extends TValue ? T : TValue>;

    removeModifier(index: number): boolean;
    getModifier<T extends InputModifier<TValue>>(index: number): T | null;
    replaceModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        index: number, modifier: T, ...args: Parameters<typeof Modifier[T]>): boolean;
    replaceModifier(index: number, modifier: InputModifier<TValue> | ((value: TValue) => TValue)): boolean;

    setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TValue>>>(
        trigger: T, ...args: Parameters<typeof Trigger[T]>):
        InputCompositeBinding<TControl, ReturnType<typeof Trigger[T]> extends InputModifier<infer Type extends TValue> ? Type : TValue>;
    setTrigger<T extends TValue>(trigger: InputTrigger<T> | ((value: T, deltaTime?: number) => boolean)):
        InputCompositeBinding<TControl, T extends TValue ? T : TValue>;

    getTrigger<T extends InputTrigger<TValue>>(): T | null;

    setControlActivator<
        TIndex extends IndexOfType<TControl>,
        TKey extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl[TIndex]>>>(
            index: TIndex,
            modifier: TKey,
            ...args: Parameters<typeof ControlActivator[TKey]>):
        InputCompositeBinding<TupleWithTypeAtIndex<TControl, TIndex,
            ReturnType<typeof ControlActivator[TKey]> extends InputControlActivator<infer Type extends TControl[TIndex]> ? Type : TControl[TIndex]>,
            TValue>;
    setControlActivator<TIndex extends IndexOfType<TControl>, TType extends TControl[TIndex]>(
        index: TIndex,
        modifier: InputControlActivator<TType> | ((control: InputControl<TType>) => boolean)):
        InputCompositeBinding<TupleWithTypeAtIndex<TControl, TIndex, TType>, TValue>;

    removeControlActivator<PathIndex extends IndexOfType<TControl>>(index: PathIndex): void;
    getControlActivator<PathIndex extends IndexOfType<TControl>>(index: PathIndex): InputControlActivator<TControl[PathIndex]> | null;

    setCompositeControlActivator<T extends KeyOfExtendsType<typeof CompositeControlActivator, (...args: unknown[]) => InputCompositeControlActivator<TControl>>>(
        modifier: T, ...args: Parameters<typeof CompositeControlActivator[T]>):
        InputCompositeBinding<ReturnType<typeof CompositeControlActivator[T]> extends InputCompositeControlActivator<infer Type extends TControl> ? Type : TControl, TValue>;
    setCompositeControlActivator<T extends TControl>(modifier: InputCompositeControlActivator<T> | ((controls: { [K in keyof T]: InputControl<T[K]> }) => boolean))
        : InputCompositeBinding<T, TValue>;

    removeCompositeControlActivator(): void;
    getCompositeControlActivator(): InputCompositeControlActivator<TControl> | null;

    getActiveControl<T extends FirstOf<TControl>>(): InputControl<T> | null;
    getActiveControl<T extends IndexOfType<TControl>>(index?: T): InputControl<TControl[T]> | null;
    getActiveControls(): Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> | null }> | null;
}

interface UnconvertedInputCompositeBinding<TControl extends Tuple, TValue> extends
    Pick<InputCompositeBinding<TControl, TValue>, 'setConverter' | 'setConverterAsControlActivator'> { }

export const InputCompositeBinding = BaseInputCompositeBinding as
    {
        new <TControl extends Tuple = Tuple, TValue = Tuple extends TControl ? any : TControl>():
            Tuple extends TControl
            ? InputCompositeBinding<TControl, WidenAsTuple<TValue>>
            : unknown extends TValue
            ? InputCompositeBinding<TControl, WidenAsTuple<TValue>>

            : TValue extends TControl
            ? InputCompositeBinding<TControl, WidenAsTuple<TValue>>
            : UnconvertedInputCompositeBinding<TControl, WidenAsTuple<TValue>>;
    };
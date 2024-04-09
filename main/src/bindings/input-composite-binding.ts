import { InputControllerMap } from "../controllers/input-maps.js";
import { InputController } from "../controllers/input-controller.js";
import { InputControl } from "../controls/input-controls.js";
import { removeAtIndex } from "../helpers/array-helper.js";
import { FirstOf, IndexOfType, KeyOfExtendsType, NullableKeys, Tuple, WidenAsTuple } from "../helpers/type-helpers.js";
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
        return this._converter ? this._converter.apply(this._cachedValue as TControl) : this._cachedValue as TValue;
    }

    public setPath<
        PathIndex extends IndexOfType<TControl>,
        ControllerPath extends keyof InputControllerMap,
        ControlPath extends KeyOfExtendsType<InputControllerMap[ControllerPath], TControl[PathIndex]>>
        (index: PathIndex, arg0: ControllerPath | string, arg1?: ControlPath | string): this {
        this._pathSetup(index, arg0, arg1 as string);
        return this;
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

    public setControlActivator<
        TIndex extends IndexOfType<TControl>,
        TKey extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl[TIndex]>>>(
            index: TIndex,
            activator: InputControlActivator<TControl[TIndex]> | ((control: InputControl<TControl[TIndex]>) => boolean) | TKey,
            arg0?: Parameters<typeof ControlActivator[TKey]>[0]): this {
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
        arg2: Parameters<typeof CompositeControlActivator[T]>[2]): this {
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

    public setConverterAsControlActivator(converter: unknown, ...args: unknown[]): this;
    public setConverterAsControlActivator(converter: unknown, arg0: unknown, arg1: unknown, arg2: unknown): this {
        this.setConverter(converter, arg0, arg1, arg2);
        const converterActivator = new ConverterToCompositeControlActivator(this._converter as InputConverter<TControl, boolean>);
        this._compositeActivator = converterActivator;
        this._converter = converterActivator as unknown as InputConverter<TControl, TValue>;
        return this;
    }
}

export interface InputCompositeBinding<TControl extends Tuple, TValue = TControl>
    extends BaseInputCompositeBinding<TControl, TValue> {
    readonly paths: readonly InputPath[];
    setPath<
        TIndex extends IndexOfType<TControl>,
        TControllerPath extends keyof InputControllerMap,
        TControlPath extends KeyOfExtendsType<InputControllerMap[TControllerPath], TControl[TIndex]>>
        (index: TIndex, controller: TControllerPath, control: TControlPath): this;
    setPath<T extends IndexOfType<TControl>>(index: T, path: string): this;
    setPath<T extends IndexOfType<TControl>>(index: T, controller: string, control: string): this;

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

    setControlActivator<
        TIndex extends IndexOfType<TControl>,
        TKey extends KeyOfExtendsType<typeof ControlActivator, (...args: unknown[]) => InputControlActivator<TControl[TIndex]>>>(
            index: TIndex,
            modifier: TKey,
            ...args: Parameters<typeof ControlActivator[TKey]>): this;
    setControlActivator<TIndex extends IndexOfType<TControl>>(
        index: TIndex,
        modifier: InputControlActivator<TControl[TIndex]> | ((control: InputControl<TControl[TIndex]>) => boolean)): this;
    removeControlActivator<PathIndex extends IndexOfType<TControl>>(index: PathIndex): void;
    getControlActivator<PathIndex extends IndexOfType<TControl>>(index: PathIndex): InputControlActivator<TControl[PathIndex]> | null;

    setCompositeControlActivator<T extends KeyOfExtendsType<typeof CompositeControlActivator, (...args: unknown[]) => InputCompositeControlActivator<TControl>>>(
        modifier: T, ...args: Parameters<typeof CompositeControlActivator[T]>): this;
    setCompositeControlActivator(modifier: InputCompositeControlActivator<TControl> | ((controls: { [K in keyof TControl]: InputControl<TControl[K]> }) => boolean)): this;
    removeCompositeControlActivator(): void;
    getCompositeControlActivator(): InputCompositeControlActivator<TControl> | null;

    getActiveControl<T extends FirstOf<TControl>>(): InputControl<T> | null;
    getActiveControl<T extends IndexOfType<TControl>>(index?: T): InputControl<TControl[T]> | null;
    getActiveControls(): Readonly<{ [K in keyof TControl]: InputControl<TControl[K]> | null }> | null;
}

interface UnconvertedInputCompositeBinding<TControl extends Tuple, TValue = TControl> extends
    Pick<InputCompositeBinding<TControl, TValue>, 'setConverter' | 'setConverterAsControlActivator'> { }

export const InputCompositeBinding = BaseInputCompositeBinding as
    {
        new <TControl extends Tuple, TValue = TControl>(): TValue extends TControl
            ? InputCompositeBinding<TControl, WidenAsTuple<TValue>>
            : UnconvertedInputCompositeBinding<TControl, WidenAsTuple<TValue>>;
    };
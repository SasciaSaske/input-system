import { InputBinding } from "../bindings/input-binding.js";
import { InputController } from "../controllers/input-controller.js";
import { InputControl } from "../controls/input-controls.js";
import { insertAtIndex, lastElement, moveElementToIndex, moveFromIndexToIndex, removeAtIndex, removeElement } from "../helpers/array-helper.js";
import { EventHandlerTwoParameters } from "../helpers/event-handler.js";
import { KeyOfExtendsType, Primitive, RecursiveArrayLike, RemoveReadonly, Tuple, WidenAsTuple } from "../helpers/type-helpers.js";
import { InputManager } from "../input-manager.js";
import { InputModifier, Modifier } from "../input-modifiers.js";
import { DefaultPrimitiveTriggerInputConverter, DefaultTriggerInputConverter, InputTrigger, Trigger } from "../input-trigger.js";
import { InputActionModule } from "./input-action-module.js";

export type InputActionState = 'waiting' | 'started' | 'performing' | 'ended' | 'inactive';
export type InputActionEventType = 'waiting' | 'started' | 'performing' | 'ended';

class BaseInputAction<TValue> extends InputActionModule {
    private _defaultValue: TValue;
    private _value: TValue;

    private _bindings: InputBinding<TValue>[] = [];
    private _activeBindings: InputBinding<TValue>[] | null = null;
    private _stateBindingIndex = 0;
    private _currentBinding: InputBinding<TValue> | null = null;

    private _trigger!: InputTrigger<TValue>;
    private _currentTrigger!: InputTrigger<TValue>;
    private _state: InputActionState = 'inactive';

    private _onWaiting = new EventHandlerTwoParameters<BaseInputAction<TValue>, number>();
    private _onStarted = new EventHandlerTwoParameters<BaseInputAction<TValue>, number>();
    private _onPerforming = new EventHandlerTwoParameters<BaseInputAction<TValue>, number>();
    private _onEnded = new EventHandlerTwoParameters<BaseInputAction<TValue>, number>();

    private _modifiers: InputModifier<TValue>[] | null = null;

    public constructor(name: string, defaultValue: TValue) {
        super(name);
        this._defaultValue = defaultValue;
        this._value = defaultValue;
    }

    public get state(): InputActionState {
        return this._state;
    }

    /*@internal*/
    public _setInputManager(inputManager: InputManager): void {
        this._inputManager = inputManager;
        if (this.enabled && this._group!._isEnabledInHierarchy()) {
            this._enabledInHierarchy = true;
            if (this._updated && this._group!.active) {
                this._active = true;
                this._state = 'waiting';
            }
            this._setBoundControls();
        }
        if (!this._trigger) {
            this._trigger = typeof this._defaultValue === 'object'
                ? new DefaultTriggerInputConverter(this._defaultValue as TValue & RecursiveArrayLike<Primitive>)
                : new DefaultPrimitiveTriggerInputConverter(this._defaultValue as TValue & Primitive);
        } else {
            this._trigger.reset?.();
        }
        this._currentTrigger = this._trigger;
    }

    private _setBoundControls(): void {
        for (let i = 0; i < this.inputManager!.controllers.length; i++) {
            this._onControllerConnected(this.inputManager!.controllers[i]);
        }
    }

    public readDefaultValue(): Readonly<any> extends TValue ? TValue : Readonly<TValue> {
        return this._defaultValue;
    }

    public readValue(): Readonly<any> extends TValue ? TValue : Readonly<TValue> {
        return this._value;
    }

    /* @internal */
    public _update(): void {
        if (!this._active) return;

        if (this._activeBindings?.length) {
            let nextActiveIndex = 0;
            for (let i = 0; i < this._stateBindingIndex; i++) {
                if (this._activeBindings[i]._checkConstrolsActivation()) {
                    if (i > nextActiveIndex) {
                        moveFromIndexToIndex(this._activeBindings, i, nextActiveIndex);
                    }
                    nextActiveIndex++;
                }
            }

            //change trigger -> only when active?

            const binding = nextActiveIndex > 0
                ? this._activeBindings[0]
                : this._activeBindings[this._stateBindingIndex];

            if (binding) {
                if (this._currentBinding !== binding) {
                    this._currentBinding = binding;
                    this._currentTrigger = binding.getTrigger() ?? this._trigger;
                    this._currentTrigger.reset?.();
                }

                this._value = binding._readValue();
                if (this._modifiers) {
                    for (let i = 0; i < this._modifiers.length; i++) {
                        this._value = this._modifiers[i].execute(this._value);
                    }
                }
            } else {
                this._value = this._defaultValue;
            }
        }

        const triggered = this._currentTrigger.execute(this._value, this._inputManager!.deltaTime);
        switch (this._state) {
            case ('waiting'):
                if (triggered === true) {
                    this._state = 'started';
                }
                break;
            case ('started'):
                if (triggered === true) {
                    this._state = 'performing';
                } else {
                    this._state = 'ended';
                }
                break;
            case ('performing'):
                if (triggered === false) {
                    this._state = 'ended';
                }
                break;
            case ('ended'):
                if (triggered === true) {
                    this._state = 'started';
                } else {
                    this._state = 'waiting';
                }
        }
    }

    /* @internal */
    public _handleEvents(): void {
        if (!this._active) return;

        switch (this._state) {
            case 'waiting':
                this._onWaiting.raise(this, this._inputManager!.deltaTime);
                break;
            case 'started':
                this._onStarted.raise(this, this._inputManager!.deltaTime);
                this._onPerforming.raise(this, this._inputManager!.deltaTime);
                break;
            case 'performing':
                this._onPerforming.raise(this, this._inputManager!.deltaTime);
                break;
            case 'ended':
                this._onEnded.raise(this, this._inputManager!.deltaTime);
                this._onWaiting.raise(this, this._inputManager!.deltaTime);
                break;
        }
    }

    public addBinding(binding: InputBinding<TValue>): this {
        if (binding.action) {
            console.warn(`The binding added at index ${this._bindings.length} to the '${this.name}' Action is already associated with the '${binding.action.name}' Action.`);
        }
        binding._setAction(this);
        if (this._enabledInHierarchy && this._inputManager!.controllers.length) {
            this._checkBindingActivation(binding);
        }
        const priority = binding._getMaxPriority();
        if (priority === 0) {
            this._bindings.push(binding);
        } else {
            const index = this._bindings.findIndex((e): boolean => priority >= e._getMaxPriority());
            if (index === -1) {
                this._bindings.push(binding);
            } else {
                insertAtIndex(this._bindings, index, binding);
            }
        }
        return this;
    }

    public removeBinding(predicate: (binding: InputBinding<TValue>) => boolean): boolean {
        const index = this._bindings.findIndex(predicate);
        if (index !== -1) {
            const binding = this._bindings[index];
            removeAtIndex(this._bindings, index);
            if (binding.active) {
                this._removeActiveBinding(binding);
            }
            return true;
        }
        return false;
    }

    public getBinding<T extends InputBinding<TValue>>(predicate: ((binding: InputBinding<TValue>) => boolean) | string): T | null {
        if (typeof predicate === 'string') {
            const name = predicate;
            predicate = (binding): boolean => binding.name === name;
        }
        return this._bindings.find(predicate) as T ?? null;
    }

    public getActiveBinding<T extends InputBinding<TValue>>(): T | null {
        return this._currentBinding as T;
    }

    public getActiveControl<T extends InputControl<T>>(): T | null {
        return this._currentBinding?.getActiveControl() as T ?? null;
    }

    public getActiveController<T extends InputController>(): T | null {
        return this._currentBinding?.getActiveControl()?.getController() as T ?? null;
    }

    private _checkBindingActivation(binding: InputBinding<TValue>): void {
        for (let i = 0; i < this._inputManager!.controllers.length; i++) {
            const controller = this._inputManager!.controllers[i];
            if (this._checkBindingActivationForController(binding, controller)) {
                binding._addBoundControls(controller);
            }
        }
        if (binding._setActive()) {
            this._addActiveBinding(binding);
        }
    }

    private _addActiveBinding(binding: InputBinding<TValue>): void {
        this._activeBindings ??= [];
        if (this._activeBindings.length === 0) {
            this._currentBinding = binding;
            this._currentTrigger = binding.getTrigger() ?? this._trigger;
            this._currentTrigger.reset?.();
        }
        if (binding.isState()) {
            this._activeBindings.push(binding);
        } else {
            insertAtIndex(this._activeBindings, this._stateBindingIndex++, binding);
        }
    }

    private _removeActiveBinding(binding: InputBinding<TValue>): void {
        removeElement(this._activeBindings!, binding);
        if (!binding.isState()) {
            this._stateBindingIndex--;
        }
        if (this._activeBindings!.length === 0) {
            this._value = this._defaultValue;
            this._currentBinding = null;
            this._currentTrigger = this._trigger;
        }
    }

    private _checkBindingActivationForController(binding: InputBinding<TValue>, controller: InputController): boolean {
        const priority = binding._getControllerMaxPriority(controller);
        if (priority === -1) {
            return false;
        }
        if (this._bindings.length === 0) {
            return true;
        }
        const maxPriority = this._bindings[0]._getMaxPriority();
        let minPriority = lastElement(this._bindings)._getMaxPriority();
        let j = 0;
        for (let i = maxPriority; i >= minPriority; i--) {
            for (; j < this._bindings.length; j++) {
                const binding = this._bindings[j];
                if (binding._getMaxPriority() < i) {
                    break;
                }
                if (binding._getControllerMaxPriority(controller) === i) {
                    if (priority > i) {
                        minPriority = i;
                        if (binding._removeBoundControls(controller)) {
                            this._removeActiveBinding(binding);
                        }
                        break;
                    }
                    if (priority === i) {
                        return true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /* @internal */
    public _updateBindingState(binding: InputBinding<TValue>): void {
        const activeIndex = this._activeBindings?.indexOf(binding) ?? -1;
        if (activeIndex !== -1) {
            if (binding.isState()) {
                removeAtIndex(this._activeBindings!, activeIndex,);
                this._activeBindings?.push(binding);
                this._stateBindingIndex--;
            } else {
                moveFromIndexToIndex(this._activeBindings!, activeIndex, this._stateBindingIndex++);
            }
        }
    }

    /* @internal */
    public _resetBinding(binding: InputBinding<TValue>): void {
        if (this._enabledInHierarchy && this._inputManager!.controllers.length) {
            removeElement(this._bindings, binding);
            const activeIndex = this._activeBindings?.indexOf(binding) ?? -1;
            if (activeIndex !== -1) {
                this._removeActiveBinding(binding);
            }
            this._checkBindingActivation(binding);
            const index = this._bindings.findIndex((e): boolean => binding._getMaxPriority() >= e._getMaxPriority());
            if (index === 0) {
                this._bindings.push(binding);
            } else {
                insertAtIndex(this._bindings, index, binding);
            }
        } else {
            let index: number;
            const priority = binding._getMaxPriority();
            if (priority === 0) {
                index = this._bindings.length - 1;
            } else {
                index = this._bindings.findIndex((e): boolean => priority >= e._getMaxPriority());
                if (index === -1) {
                    index = this._bindings.length - 1;
                }
            }
            moveElementToIndex(this._bindings, binding, index);
        }
    }

    public addModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        modifier: InputModifier<TValue> | ((value: TValue) => TValue) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): this {
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
        arg0?: Parameters<typeof Trigger[T]>[0], arg1?: Parameters<typeof Trigger[T]>[1], arg2?: Parameters<typeof Trigger[T]>[2]): this {
        if (typeof trigger === 'string') {
            trigger = Trigger[trigger](arg0 as number, arg1 as number | undefined, arg2 as number | undefined) as InputTrigger<TValue>;
            trigger.reset?.();
        } else if (typeof trigger === 'function') {
            trigger = { execute: trigger } as InputTrigger<TValue>;
        } else {
            trigger.reset?.();
        }
        if (this._currentTrigger === this._trigger) {
            this._currentTrigger = trigger;
        }
        this._trigger = trigger;
        return this;
    }

    public getTrigger<T extends InputTrigger<TValue>>(): T {
        return this._trigger as T;
    }

    public addEventListener(type: InputActionEventType, listener: (action: BaseInputAction<TValue>, deltaTime: number) => void): this {
        switch (type) {
            case 'waiting':
                this._onWaiting.add(listener);
                return this;
            case 'started':
                this._onStarted.add(listener);
                return this;
            case 'performing':
                this._onPerforming.add(listener);
                return this;
            case 'ended':
                this._onEnded.add(listener);
                return this;
        }
    }

    public removeEventListener(type: InputActionEventType, listener: (action: BaseInputAction<TValue>, deltaTime: number) => void): this {
        switch (type) {
            case 'waiting':
                this._onWaiting.remove(listener);
                return this;
            case 'started':
                this._onStarted.remove(listener);
                return this;
            case 'performing':
                this._onPerforming.remove(listener);
                return this;
            case 'ended':
                this._onEnded.remove(listener);
                return this;
        }
    }

    /* @internal */
    public _onControllerConnected = (controller: InputController): void => {
        if (!this._enabled || this._bindings.length === 0) {
            return;
        }

        const maxPriority = this._bindings[0]._getMaxPriority();
        let minPriority = lastElement(this._bindings)._getMaxPriority();
        let j = 0;
        for (let i = maxPriority; i >= minPriority; i--) {
            for (; j < this._bindings.length; j++) {
                const binding = this._bindings[j];
                if (binding._getMaxPriority() < i) {
                    break;
                }
                if (binding._getControllerMaxPriority(controller) === i) {
                    minPriority = i;
                    binding._addBoundControls(controller);
                    if (binding._setActive()) {
                        this._addActiveBinding(binding);
                    }
                }
            }
        }
    };

    /* @internal */
    public _onControllerDisconnected = (controller: InputController): void => {
        if (!this._enabled) return;

        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            if (binding._removeBoundControls(controller)) {
                this._removeActiveBinding(binding);
            }
        }
    };

    /* @internal */
    public _onDelete(): void {
        this._inputManager = null;
        this._enabledInHierarchy = true;
        this._active = false;
        this._state = 'inactive';
        this._disableBindings();
    }

    public enable(): this {
        if (this._enabled) return this;

        this._enabled = true;

        if (this._group?._isEnabledInHierarchy()) {
            this._enabledInHierarchy = true;
            if (this._updated && this._group.active) {
                this._active = true;
                this._state = 'waiting';
            }
            this._setBoundControls();
        }
        return this;
    }

    public disable(): this {
        if (!this._enabled) return this;

        this._enabled = false;

        this._enabledInHierarchy = false;
        this._active = false;
        this._state = 'inactive';
        this._disableBindings();
        return this;
    }

    public pause(): this {
        if (!this._updated) return this;

        this._updated = false;

        this._active = false;
        this._state = 'inactive';
        return this;
    }

    public resume(): this {
        if (this._updated) return this;

        this._updated = true;

        if (this._enabled && this._group?.active) {
            this._active = true;
            this._state = 'waiting';
        }
        return this;
    }

    /* @internal */
    public _onParentActive(): void {
        if (this._enabled && this._updated) {
            this._active = true;
            this._state = 'waiting';
        }
    }
    /* @internal */
    public _onParentInactive(): void {
        if (this._enabled && this._updated) {
            this._active = false;
            this._state = 'inactive';
        }
    }

    /* @internal */
    public _onParentEnable(): void {
        if (this._enabled) {
            this._enabledInHierarchy = true;
            if (this._updated && this._group!.active) {
                this._active = true;
                this._state = 'waiting';
            }
            this._setBoundControls();
        }
    }
    /* @internal */
    public _onParentDisable(): void {
        this._enabledInHierarchy = false;
        this._active = false;
        this._state = 'inactive';
        this._disableBindings();
    }

    private _disableBindings(): void {
        if (!this._activeBindings) return;

        for (let i = 0; i < this._activeBindings.length; i++) {
            this._activeBindings[i]._reset();
        }
        this._activeBindings.length = 0;
    }
}

export interface InputAction<TValue> extends BaseInputAction<TValue>, InputActionModule {
    readonly state: InputActionState;
    readDefaultValue(): Readonly<any> extends TValue ? TValue : Readonly<TValue>;
    readValue(): Readonly<any> extends TValue ? TValue : Readonly<TValue>;
    addBinding(binding: InputBinding<TValue>): this;
    removeBinding(predicate: (binding: InputBinding<TValue>) => boolean): boolean;
    getBinding<T extends InputBinding<TValue>>(name: string): T | null;
    getBinding<T extends InputBinding<TValue>>(predicate: (binding: T) => boolean): T | null;
    getActiveBinding<T extends InputBinding<TValue>>(): T | null;
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
    getTrigger<T extends InputTrigger<TValue>>(): T;

    addEventListener(type: InputActionEventType, listener: (action: InputAction<TValue>, deltaTime: number) => void): this;
    removeEventListener(type: InputActionEventType, listener: (action: InputAction<TValue>, deltaTime: number) => void): this;
    enable(): this;
    disable(): this;
    pause(): this;
    resume(): this;
}

interface UntriggerableInputAction<T> extends
    Pick<InputAction<T>, 'setTrigger'> { }

export const InputAction = BaseInputAction as
    {
        new <T extends Tuple>( //needed for tuple narrowing
            name: string, defaultValue: T
        ): T extends Primitive | RecursiveArrayLike<Primitive>
            ? InputAction<WidenAsTuple<RemoveReadonly<T>>>
            : UntriggerableInputAction<WidenAsTuple<RemoveReadonly<T>>>
        new <T>(
            name: string, defaultValue: T
        ): T extends Primitive | RecursiveArrayLike<Primitive>
            ? InputAction<WidenAsTuple<RemoveReadonly<T>>>
            : UntriggerableInputAction<WidenAsTuple<RemoveReadonly<T>>>
    };
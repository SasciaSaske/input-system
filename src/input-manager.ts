import { SingleNativeControllerManager } from './controller-managers/native/native-controller-enabler.js';
import { NativeGamepadEnabler } from './controller-managers/native/native-gamepad-enabler.js';
import { NativeKeyboardEnabler } from './controller-managers/native/native-keyboard-enabler.js';
import { XRControllerManager } from './controller-managers/xr/xr-controller-manager.js';
import { GamepadManager } from './controller-managers/gamepad-manager.js';
import { PointerManager } from './controller-managers/pointer-manager.js';
import { SensorManager } from './controller-managers/sensor-manager.js';
import { InputController } from './controllers/input-controller.js';
import { KeyboardController } from './controllers/keyboard-controller.js';
import { moveFromIndexToIndex, moveToFront, removeAtIndex, removeAtIndexUnsorted, removeElements } from './helpers/array-helper.js';
import { EventHandlerOneParameter } from './helpers/event-handler.js';
import { InputActionGroup } from './action-modules/input-action-group.js';
import { InputActionModuleMap } from './action-modules/input-action-module-map.js';

export interface KeyboardManager extends SingleNativeControllerManager<KeyboardController, NativeKeyboardEnabler> { }

export class InputManager {
    private _deltaTime = 0;

    public readonly sensor: SensorManager;
    public readonly pointer: PointerManager;
    public readonly keyboard: KeyboardManager;
    public readonly gamepad: GamepadManager;
    public readonly xr: XRControllerManager;

    private _nextID = 0;
    private readonly _connectedControllers: InputController[] = [];
    private readonly _disconnectedControllers: InputController[] = [];
    private _currentController: InputController | null = null;

    private readonly _onControllerConnected = new EventHandlerOneParameter<InputController>();
    private readonly _onControllerDisconnected = new EventHandlerOneParameter<InputController>();
    private readonly _onCurrentControllerChanged = new EventHandlerOneParameter<InputController | null>();

    private readonly _onPreUpdate = new EventHandlerOneParameter<number>();
    private readonly _onPostUpdate = new EventHandlerOneParameter<number>();

    public constructor() {
        this.sensor = new SensorManager(this);
        this.pointer = new PointerManager(this);
        this.keyboard = new SingleNativeControllerManager<KeyboardController, NativeKeyboardEnabler>(new NativeKeyboardEnabler(this));
        this.gamepad = new GamepadManager(new NativeGamepadEnabler(this));
        this.xr = new XRControllerManager(this);
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get controllers(): readonly InputController[] {
        return this._connectedControllers;
    }

    public get currentController(): InputController | null {
        return this._connectedControllers[0] ?? null;
    }

    public addEventListener(type: 'preUpdate' | 'postUpdate', listener: () => void): void;
    public addEventListener(type: 'controllerConnected' | 'controllerDisconnected', listener: (controller: InputController) => void): void;
    public addEventListener(type: 'currentControllerChanged', listener: (controller: InputController | null) => void): void;
    public addEventListener(...[type, listener]:
        [type: 'preUpdate' | 'postUpdate', listener: () => void] |
        [type: 'controllerConnected' | 'controllerDisconnected', listener: (controller: InputController) => void] |
        [type: 'currentControllerChanged', listener: (controller: InputController | null) => void]): void {
        switch (type) {
            case 'preUpdate':
                this._onPreUpdate.add(listener);
                return;
            case 'postUpdate':
                this._onPostUpdate.add(listener);
                return;
            case 'controllerConnected':
                this._onControllerConnected.add(listener);
                return;
            case 'controllerDisconnected':
                this._onControllerDisconnected.add(listener);
                return;
            case 'currentControllerChanged':
                this._onCurrentControllerChanged.add(listener);
                return;
        }
    }

    public removeEventListener(type: 'preUpdate' | 'postUpdate', listener: () => void): void;
    public removeEventListener(type: 'controllerConnected' | 'controllerDisconnected', listener: (controller: InputController) => void): void;
    public removeEventListener(type: 'currentControllerChanged', listener: (controller: InputController | null) => void): void;
    public removeEventListener(...[type, listener]:
        [type: 'preUpdate' | 'postUpdate', listener: () => void] |
        [type: 'controllerConnected' | 'controllerDisconnected', listener: (controller: InputController) => void] |
        [type: 'currentControllerChanged', listener: (controller: InputController | null) => void]): void {
        switch (type) {
            case 'preUpdate':
                this._onPreUpdate.remove(listener);
                return;
            case 'postUpdate':
                this._onPostUpdate.remove(listener);
                return;
            case 'controllerConnected':
                this._onControllerConnected.remove(listener);
                return;
            case 'controllerDisconnected':
                this._onControllerDisconnected.remove(listener);
                return;
            case 'currentControllerChanged':
                this._onCurrentControllerChanged.remove(listener);
                return;
        }
    }

    /* @internal */
    public _setCurrentController(controller: InputController): void {
        moveToFront(this._connectedControllers, controller);
        if (controller !== this.currentController) {
            this._onCurrentControllerChanged.raise(controller);
        }
    }

    public preloadController<T extends new (inputManager: InputManager) => InputController>(controllerType: T): void {
        const controller = new controllerType(this);
        this._disconnectedControllers.push(controller);
    }

    public unloadController(predicate: (controller: InputController) => boolean): boolean {
        const index = this._disconnectedControllers.findIndex(predicate);
        if (index === -1) {
            return false;
        }
        removeAtIndex(this._disconnectedControllers, index);
        return true;
    }

    public unloadControllers(predicate: (controller: InputController) => boolean): boolean {
        let found = false;
        for (let i = this._disconnectedControllers.length - 1; i >= 0; i--) {
            const controller = this._disconnectedControllers[i];
            if (predicate(controller)) {
                found = true;
                removeAtIndexUnsorted(this._disconnectedControllers, i);
            }
        }
        return found;
    }

    public addController<T extends new (inputManager: InputManager) => InputController>(controllerType: T, ...args: Parameters<InstanceType<T>['init']>): void {
        const index = this._disconnectedControllers.findIndex((controller): boolean => controller.constructor === controllerType);
        let controller: InputController;
        if (index !== -1) {
            controller = this._disconnectedControllers[index];
            removeAtIndexUnsorted(this._disconnectedControllers, index);
        } else {
            controller = new controllerType(this);
        }
        controller.init(...args);
        this._connectedControllers.push(controller);
        controller._connect(this._nextID++);
        this._groups.onControllerConnected(controller);
        this._onControllerConnected.raise(controller);
    }

    public removeController(predicate: (controller: InputController) => boolean): boolean {
        const index = this._connectedControllers.findIndex(predicate);
        if (index === -1) {
            return false;
        }
        const controller = this._connectedControllers[index];
        removeAtIndex(this._connectedControllers, index);
        controller._disconnect();
        this._groups.onControllerDisconnected(controller);
        this._onControllerDisconnected.raise(controller);
        if (index === 0) {
            this._onCurrentControllerChanged.raise(null);
        }
        this._disconnectedControllers.push(controller);
        return true;
    }

    public removeControllers(predicate: (controller: InputController) => boolean): boolean {
        const length = this._disconnectedControllers.length;
        removeElements(this._connectedControllers, predicate, this._disconnectedControllers);
        if (length === this._disconnectedControllers.length) return false;
        for (let i = this._disconnectedControllers.length - 1; i >= length; i--) {
            const controller = this._disconnectedControllers[i];
            controller._disconnect();
            this._groups.onControllerDisconnected(controller);
            this._onControllerDisconnected.raise(controller);
        }
        if (this._currentController !== this._connectedControllers[0]) {
            this._onCurrentControllerChanged.raise(null);
        }
        return true;
    }

    public update(deltaTime: number): void {
        this._deltaTime = deltaTime;

        this._onPreUpdate.raise(deltaTime);

        let nextActiveIndex = 0;
        for (let i = 0; i < this._connectedControllers.length; i++) {
            const controller = this._connectedControllers[i];
            controller._internalUpdate();
            if (controller._internalActivationCheck()) {
                if (i > nextActiveIndex) {
                    moveFromIndexToIndex(this._connectedControllers, i, nextActiveIndex);
                }
                nextActiveIndex++;
            }
        }
        if (this._currentController !== this._connectedControllers[0]) {
            this._currentController = this._connectedControllers[0];
            this._onCurrentControllerChanged.raise(this._currentController);
        }

        this._groups.update();
        this._groups.handleEvents();

        this._onPostUpdate.raise(deltaTime);
    }

    //#endregion
    //#region Group management
    private _groups = new InputActionModuleMap<InputActionGroup>();

    public getActionGroup(name: string): InputActionGroup {
        return this._groups.get(name) ?? this._createActionGroup(name);
    }
    private _createActionGroup(name: string): InputActionGroup {
        const group = new InputActionGroup(name);
        this._groups.set(group);
        group._setInputManager(this);
        return group;
    }
    public addActionGroup(group: InputActionGroup): InputManager {
        this._groups.set(group);
        group._setInputManager(this);
        return this;
    }
    public removeActionGroup(name: string): boolean {
        return this._groups.delete(name);
    }
    //#endregion 
}
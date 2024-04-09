import { InputControl } from '../controls/input-controls.js';
import { KeyOfType } from '../helpers/type-helpers.js';
import { InputManager } from '../input-manager.js';
import { InputPath } from '../input-path.js';

interface ControllerManager<T extends InputController> {
    _add(controller: T): void;
    _remove(controller: T): void;
    _setCurrent(controller: T): void;
    _setActivated(controller: T): void;
}

export abstract class InputController {
    protected _inputManager: InputManager;

    private _id = -1;
    private _connected = false;
    private _activated = false;

    protected _path: string[] = [];
    private _managers: ControllerManager<this>[] | null = null;

    public constructor(inputManager: InputManager) {
        this._inputManager = inputManager;
    }

    public get inputManager(): InputManager {
        return this._inputManager;
    }
    public get id(): number {
        return this._id;
    }
    public get connected(): boolean {
        return this._connected;
    }
    public get path(): readonly string[] {
        return this._path;
    }
    public get class(): string {
        return this._path[0];
    }

    public isActivated(): boolean {
        return this._activated;
    }

    public abstract init(...args: unknown[]): void;

    public getControl<T extends InputControl<unknown> = InputControl<unknown>>(control: KeyOfType<this, T>): T {
        return this[control] as T;
    }

    /* @internal */
    public _checkPath(path: InputPath): boolean {
        const controllerPath = path.controllerPath;
        for (let i = controllerPath.length - 1; i >= 0; i--) {
            const data = controllerPath[i];
            if (typeof data === 'string') {
                if (data !== this._path[i]) {
                    return false;
                }
            } else {
                if (!data.test(this._path[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    /* @internal */
    public _getControlfromPath<T>(path: string[]): InputControl<T> | undefined {
        let control = this[path[0] as keyof this] as (InputControl<T> & Record<string, InputControl<T>>) | undefined;
        for (let i = 1; control && i < path.length; i++) {
            control = control[path[i] as keyof typeof control] as (InputControl<T> & Record<string, InputControl<T>>) | undefined;
        }
        return control;
    }

    /* @internal */
    public _internalUpdate(): void {
        this._update();
    }

    protected _update(): void { }

    /* @internal */
    public _internalActivationCheck(): boolean {
        this._activated = this._activationCheck();
        if (this._activated && this._managers) {
            for (let i = 0; i < this._managers.length; i++) {
                this._managers[i]._setActivated(this);
            }
        }
        return this._activated;
    }

    protected _activationCheck(): boolean { return false; }

    /* @internal */
    public _connect(id: number): void {
        this._id = id;
        this._connected = true;
        if (this._managers) {
            for (let i = 0; i < this._managers.length; i++) {
                this._managers[i]._add(this);
            }
        }
    }

    /* @internal */
    public _disconnect(): void {
        this._connected = false;
        this._onDisconnect();
        if (this._managers) {
            for (let i = 0; i < this._managers.length; i++) {
                this._managers[i]._remove(this);
            }
        }
    }
    protected _onDisconnect(): void { }

    public setAsCurrent(): void {
        this._inputManager._setCurrentController(this);
        if (this._managers) {
            for (let i = 0; i < this._managers.length; i++) {
                this._managers[i]._setCurrent(this);
            }
        }
    }

    protected _addManager(manager: ControllerManager<this>): void {
        if (this._managers) {
            if (this._managers.indexOf(manager) !== -1) {
                return;
            }
        } else {
            this._managers = [];
        }
        this._managers.push(manager);
    }
}
import { InputController } from "../controllers/input-controller.js";
import { InputManager } from "../input-manager.js";
import { InputActionGroup } from "./input-action-group.js";

export abstract class InputActionModule {
    protected _inputManager: InputManager | null = null;
    protected _group: InputActionGroup | null = null;

    public readonly name: string;

    protected _enabled = true;
    protected _updated = true;

    protected _enabledInHierarchy = false;
    protected _active = false;

    constructor(name: string) {
        this.name = name;
    }

    public get inputManager(): InputManager | null {
        return this._inputManager;
    }
    public get group(): InputActionGroup | null {
        return this._group;
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public get paused(): boolean {
        return !this._updated;
    }
    public get active(): boolean {
        return this._active;
    }

    /* @internal */
    public abstract _setInputManager(inputManager: InputManager): void;
    /* @internal */
    public _setParent(group: InputActionGroup | null): void {
        this._group = group;
    }

    public abstract enable(): this;
    public abstract disable(): this;

    public abstract pause(): this;
    public abstract resume(): this;

    /* @internal */
    public abstract _onParentActive(): void;
    /* @internal */
    public abstract _onParentInactive(): void;
    /* @internal */
    public abstract _onParentEnable(): void;
    /* @internal */
    public abstract _onParentDisable(): void;

    /* @internal */
    public abstract _update(): void;
    /* @internal */
    public abstract _handleEvents(): void;
    /* @internal */
    public abstract _onControllerConnected(controller: InputController): void;
    /* @internal */
    public abstract _onControllerDisconnected(controller: InputController): void;
    /* @internal */
    public abstract _onDelete(): void;
}
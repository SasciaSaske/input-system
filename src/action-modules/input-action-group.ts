import { InputController } from "../controllers/input-controller.js";
import { InputManager } from "../input-manager.js";
import { InputActionModuleMap } from "./input-action-module-map.js";
import { InputActionModule } from "./input-action-module.js";
import { InputAction } from "./input-action.js";

export class InputActionGroup extends InputActionModule {
    private _actions = new InputActionModuleMap<InputAction<unknown>>();
    private _groups: InputActionModuleMap<InputActionGroup> | null = null;

    /* @internal */
    public _setInputManager(inputManager: InputManager): void {
        this._inputManager = inputManager;
        if (this._enabled) {
            if (this._group) {
                if (this._group._enabledInHierarchy) {
                    this._enabledInHierarchy = true;
                    this._active = this._updated && this._group._active;
                }
            } else {
                this._enabledInHierarchy = true;
                this._active = this._updated;
            }
        }
        this._actions.setInputManager(inputManager);
        this._groups?.setInputManager(inputManager);
    }

    /* @internal */
    public _update(): void {
        if (!this._active) return;

        this._actions.update();
        this._groups?.update();
    }

    /* @internal */
    public _handleEvents(): void {
        if (!this._active) return;

        this._actions.handleEvents();
        this._groups?.handleEvents();
    }

    /* @internal */
    public _onControllerConnected(controller: InputController): void {
        if (!this._enabled) return;

        this._actions.onControllerConnected(controller);
        this._groups?.onControllerConnected(controller);

    }

    /* @internal */
    public _onControllerDisconnected(controller: InputController): void {
        if (!this._enabled) return;

        this._actions.onControllerDisconnected(controller);
        this._groups?.onControllerDisconnected(controller);
    }

    public getActionGroup(name: string): InputActionGroup {
        if (this._groups) {
            return this._groups.get(name) ?? this._createActionGroup(name);
        }
        this._groups = new InputActionModuleMap(this._inputManager);
        return this._createActionGroup(name);
    }
    private _createActionGroup(name: string): InputActionGroup {
        const group = new InputActionGroup(name);
        this._groups!.set(group);
        group._setParent(this);
        if (this._inputManager) {
            group._setInputManager(this._inputManager);
        }
        return group;
    }
    public addActionGroup(group: InputActionGroup): this {
        this._groups ??= new InputActionModuleMap(this._inputManager);
        this._groups.set(group);
        group._setParent(this);
        if (this._inputManager) {
            group._setInputManager(this._inputManager);
        }
        return this;
    }
    public removeActionGroup(name: string): boolean {
        return this._groups?.delete(name) ?? false;
    }

    public getAction<T>(name: string): InputAction<T> | null {
        return this._actions.get(name) as InputAction<T>;
    }

    public addAction<T>(action: InputAction<T>): this {
        this._actions.set(action as InputAction<unknown>);
        action._setParent(this);
        if (this._inputManager) {
            action._setInputManager(this._inputManager);
        }
        return this;
    }

    public removeAction(name: string): boolean {
        return this._actions.delete(name);
    }

    /* @internal */
    public _isEnabledInHierarchy(): boolean {
        return this._enabledInHierarchy;
    }

    /* @internal */
    public _onDelete(): void {
        this._inputManager = null;
        this._enabledInHierarchy = false;
        this._active = false;

        this._actions.onDelete();
        this._groups?.onDelete();
    }

    public enable(): this {
        if (this._enabled) return this;

        this._enabled = true;

        if (this._group) {
            if (this._group._enabledInHierarchy) {
                this._enabledInHierarchy = true;
                this._active = this._updated && this._group._active;
            }
        } else if (this._inputManager) {
            this._enabledInHierarchy = true;
            this._active = this._updated;
        } else {
            return this;
        }
        this._actions.onParentEnable();
        this._groups?.onParentEnable();
        return this;
    }

    public disable(): this {
        if (!this._enabled) return this;

        this._enabled = false;

        this._enabledInHierarchy = false;
        this._active = false;
        this._actions.onParentDisable();
        this._groups?.onParentDisable();
        return this;
    }

    public pause(): this {
        if (!this._updated) return this;

        this._updated = false;

        if (this._active) {
            this._active = false;
            this._actions.onParentInactive();
            this._groups?.onParentInactive();
        }
        return this;
    }

    public resume(): this {
        if (this._updated) return this;

        this._updated = true;

        if (this._enabled && this._group?._active !== false) {
            this._active = true;
            this._actions.onParentActive();
            this._groups?.onParentActive();
        }
        return this;
    }

    /* @internal */
    public _onParentActive(): void {
        if (this._enabled && this._updated) {
            this._active = true;
            this._actions.onParentActive();
            this._groups?.onParentActive();
        }
    }
    /* @internal */
    public _onParentInactive(): void {
        if (this._enabled && this._updated) {
            this._active = false;
            this._actions.onParentInactive();
            this._groups?.onParentInactive();
        }
    }

    /* @internal */
    public _onParentEnable(): void {
        if (this._enabled) {
            this._enabledInHierarchy = true;
            this._active = this._updated && this._group!._active;
            this._actions.onParentEnable();
            this._groups?.onParentEnable();
        }
    }

    /* @internal */
    public _onParentDisable(): void {
        if (this._enabled) {
            this._enabledInHierarchy = false;
            this._active = false;
            this._actions.onParentDisable();
            this._groups?.onParentDisable();
        }
    }
}
import { InputController } from "../controllers/input-controller.js";
import { removeElement } from "../helpers/array-helper.js";
import { InputManager } from "../input-manager.js";
import { InputActionModule } from "./input-action-module.js";

export class InputActionModuleMap<T extends InputActionModule> {
    private _map = new Map<string, T>();
    private _values: T[] = [];

    public constructor(inputManager?: InputManager | null) {
        if (inputManager) {
            this.setInputManager(inputManager);
        }
    }

    public clear(): void {
        for (let i = 0; i < this._values.length; i++) {
            const module = this._values[i];
            module._setParent(null);
            module._onDelete();
        }
        this._map.clear();
        this._values.length = 0;
    }

    public delete(name: string): boolean {
        const module = this._map.get(name)!;
        if (this._map.delete(name)) {
            module._setParent(null);
            module._onDelete();
            removeElement(this._values, module);
            return true;
        }
        return false;
    }

    public get(name: string): T | null {
        return this._map.get(name) ?? null;
    }

    public set(value: T): InputActionModuleMap<T> {
        const name = value.name;
        const oldModule = this._map.get(name);
        if (oldModule) {
            oldModule._onDelete();
            for (let i = 0; i < this._values.length; i++) {
                if (this._values[i] === oldModule) {
                    this._values[i] = value;
                    break;
                }
            }
        } else {
            this._values.push(value);
        }
        this._map.set(name, value);
        return this;
    }

    public update(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._update();
        }
    }

    public handleEvents(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._handleEvents();
        }
    }

    public setInputManager(inputManager: InputManager): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._setInputManager(inputManager);
        }
    }

    public onControllerConnected(controller: InputController): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onControllerConnected(controller);
        }
    }
    public onControllerDisconnected(controller: InputController): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onControllerDisconnected(controller);
        }
    }
    public onDelete(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onDelete();
        }
    }
    public onParentActive(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onParentActive();
        }
    }
    public onParentInactive(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onParentActive();
        }
    }
    public onParentEnable(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onParentEnable();
        }
    }
    public onParentDisable(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i]._onParentDisable();
        }
    }
}
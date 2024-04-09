import { InputController } from "../../controllers/input-controller.js";
import { InputManager } from "../../input-manager.js";
import { SingleControllerManager, MultipleControllerManager } from "../controller-manager.js";

export abstract class NativeControllerEnabler {
    protected _inputManager: InputManager;
    protected _enabled = false;

    constructor(inputManager: InputManager) {
        this._inputManager = inputManager;
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public enable(): void {
        if (!this._enabled) {
            this._onEnable();
            this._enabled = true;
        }
    }

    public disable(): void {
        if (this._enabled) {
            this._onDisable();
            this._enabled = false;
        }
    }

    protected abstract _onEnable(): void;
    protected abstract _onDisable(): void;
}

export class SingleNativeControllerManager<TController extends InputController, TEnabler extends NativeControllerEnabler = NativeControllerEnabler>
    extends SingleControllerManager<TController> {
    public readonly native: TEnabler;
    public constructor(native: TEnabler) {
        super();
        this.native = native;
    }
}
export class MultipleNativeControllerManager<TController extends InputController, TEnabler extends NativeControllerEnabler = NativeControllerEnabler>
    extends MultipleControllerManager<TController> {
    public readonly native: TEnabler;
    public constructor(native: TEnabler) {
        super();
        this.native = native;
    }
}
import { NativeMouseController } from "../../controllers/pointers/native-mouse-controller.js";
import { NativePenController } from "../../controllers/pointers/native-pen-controller.js";
import { NativeTouchController } from "../../controllers/pointers/native-touch-controller.js";
import { PointerController } from "../../controllers/pointers/pointer-controller.js";
import { Constructor } from "../../helpers/type-helpers.js";
import { NativeControllerEnabler } from "./native-controller-enabler.js";

interface NativePointerController extends PointerController {
    init(eventTarget: GlobalEventHandlers, event?: PointerEvent): void;
}

export abstract class NativePointerEnabler extends NativeControllerEnabler {
    protected abstract readonly _controllerType: Constructor<NativePointerController>;
    protected abstract readonly _pointerType: string;
    private _target!: GlobalEventHandlers;

    public override enable(target: GlobalEventHandlers = document): void {
        this._target = target;
        super.enable();
    }

    private _onPointer = (event: PointerEvent): void => {
        if (event.pointerType === this._pointerType) {
            this._inputManager.addController(this._controllerType, this._target, event);
            this._target.removeEventListener('pointerdown', this._onPointer);
            this._target.removeEventListener('pointermove', this._onPointer);
        }
    };

    protected _onEnable(): void {
        this._target.addEventListener('pointerdown', this._onPointer);
        this._target.addEventListener('pointermove', this._onPointer);
    }

    protected _onDisable(): void {
        this._target.removeEventListener('pointerdown', this._onPointer);
        this._target.removeEventListener('pointermove', this._onPointer);
        this._inputManager.removeControllers((controller): boolean => controller.constructor === this._controllerType);
    }
}

export class NativeMouseEnabler extends NativePointerEnabler {
    protected readonly _controllerType = NativeMouseController;
    protected readonly _pointerType = 'mouse';
}
export class NativePenEnabler extends NativePointerEnabler {
    protected readonly _controllerType = NativePenController;
    protected readonly _pointerType = 'pen';
}
export class NativeTouchEnabler extends NativePointerEnabler {
    protected readonly _controllerType = NativeTouchController;
    protected readonly _pointerType = 'touch';
}
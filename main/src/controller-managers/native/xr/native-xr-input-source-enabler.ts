import { NativeXRGamepadController } from "../../../controllers/xr/native-xr-gamepad-controller.js";
import { XRInputSourceController } from "../../../controllers/xr/xr-controller.js";
import { InputController } from "../../../controllers/input-controller.js";
import { NativeXRControllerEnabler } from "./native-xr-controller-enabler.js";
import { NativeXRHandController } from "../../../controllers/xr/native-xr-hand-controller.js";
import { Constructor } from "../../../helpers/type-helpers.js";

interface NativeXRInputSourceController extends XRInputSourceController {
    init(inputSource: XRInputSource): void;
}

export abstract class NativeXRInputSourceEnabler extends NativeXRControllerEnabler {
    protected readonly abstract _controllerType: Constructor<NativeXRInputSourceController>;

    protected _onEnable(): void {
        const inputSources = this._context.session?.inputSources;
        if (!inputSources) return;
        for (let i = 0; i < inputSources.length; i++) {
            const inputSource = inputSources[i];
            if (this.checkInputSource(inputSource)) {
                this._inputManager.addController(this._controllerType, inputSource);
            }
        }
    }

    protected _onDisable(): void {
        this._inputManager.removeControllers((controller): boolean => controller.constructor === this._controllerType);
    }

    protected abstract checkInputSource(inputSource: XRInputSource): boolean;

    /* @internal */
    public _onAddInputSource(inputSource: XRInputSource): boolean {
        if (this._enabled && this.checkInputSource(inputSource)) {
            this._inputManager.addController(this._controllerType, inputSource);
            return true;
        }
        return false;
    }

    /* @internal */
    public _onRemoveInputSource(inputSource: XRInputSource): boolean {
        if (this._enabled) {
            this._inputManager.removeController((controller): boolean => (controller as XRInputSourceController).inputSource === inputSource);
            return true;
        }
        return false;
    }

    /* @internal */
    public _checkController(controller: InputController): boolean {
        return this._enabled && controller.constructor === this._controllerType;
    }
}

export class NativeXRGamepadEnabler extends NativeXRInputSourceEnabler {
    protected readonly _controllerType = NativeXRGamepadController;
    protected checkInputSource(inputSource: XRInputSource): boolean {
        return inputSource.targetRayMode === 'tracked-pointer' &&
            inputSource.hand == null &&
            inputSource.gamepad != null;
    }
}

export class NativeXRHandEnabler extends NativeXRInputSourceEnabler {
    protected readonly _controllerType = NativeXRHandController;
    protected checkInputSource(inputSource: XRInputSource): boolean {
        return inputSource.targetRayMode === 'tracked-pointer' &&
            inputSource.hand != null &&
            inputSource.gamepad != null;
    }
}
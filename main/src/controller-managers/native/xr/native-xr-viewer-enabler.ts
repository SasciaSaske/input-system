import { NativeXRHeadController } from "../../../controllers/xr/native-xr-head-controller.js";
import { NativeXRScreenController } from "../../../controllers/xr/native-xr-screen-controller.js";
import { XRViewerController } from "../../../controllers/xr/xr-viewer-controller.js";
import { InputController } from "../../../controllers/input-controller.js";
import { Constructor } from "../../../helpers/type-helpers.js";
import { NativeXRControllerEnabler } from "./native-xr-controller-enabler.js";

interface NativeXRViewerController extends XRViewerController {
    init(viewer: XRViewerPose): void;
}

abstract class NativeXRViewerEnabler extends NativeXRControllerEnabler {
    protected readonly abstract _controllerType: Constructor<NativeXRViewerController>;
    protected readonly abstract _viewsCount: number;

    protected _onEnable(): void {
        const pose = this._context.frame?.getViewerPose(this._context.referenceSpace!);
        if (pose?.views.length === this._viewsCount) {
            this._inputManager.addController(this._controllerType, pose);
        }
    }

    protected _onDisable(): void {
        this._inputManager.removeControllers((controller): boolean => controller.constructor === this._controllerType);
    }

    /* @internal */
    public _onAddViewer(pose: XRViewerPose): boolean {
        if (this._enabled) {
            this._inputManager.addController(this._controllerType, pose);
            return true;
        }
        return false;
    }

    /* @internal */
    public _checkController(controller: InputController): boolean {
        return this._enabled && controller.constructor === this._controllerType;
    }
}

export class NativeXRHeadEnabler extends NativeXRViewerEnabler {
    protected readonly _controllerType = NativeXRHeadController;
    public override readonly _viewsCount = 2;
}
export class NativeXRScreenEnabler extends NativeXRViewerEnabler {
    protected readonly _controllerType = NativeXRScreenController;
    public override readonly _viewsCount = 1;
}
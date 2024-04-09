import { XRController } from "../../../controllers/xr/xr-controller.js";
import { NativeControllerEnabler } from "../native-controller-enabler.js";
import { XRContext } from "./xr-context.js";

export abstract class NativeXRControllerEnabler extends NativeControllerEnabler {
    protected get _context(): XRContext {
        return this._inputManager.xr.native.context;
    }

    public override enable(): void {
        if (!this._enabled) {
            if (!this._context) {
                throw console.error(`Before using native XR-based controllers, you must provide an XRContext object to the system and keep it updated.`);
            }
            this._onEnable();
            this._enabled = true;
        }
    }

    public override disable(): void {
        if (this._enabled) {
            this._onDisable();
            this._enabled = false;
        }
    }

    /* @internal */
    public abstract _checkController(controller: XRController): boolean;
}
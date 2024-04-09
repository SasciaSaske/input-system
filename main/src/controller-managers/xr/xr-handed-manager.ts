import { XRHandedController } from "../../controllers/xr/xr-controller.js";
import { NativeXRControllerEnabler } from "../native/xr/native-xr-controller-enabler.js";
import { SingleControllerManager } from "../controller-manager.js";

export class XRHandedManager<TController extends XRHandedController, TEnabler extends NativeXRControllerEnabler> {
    public readonly native: TEnabler;

    public readonly left: SingleControllerManager<TController>;
    public readonly right: SingleControllerManager<TController>;

    public constructor(native: TEnabler) {
        this.native = native;

        this.left = new SingleControllerManager();
        this.right = new SingleControllerManager();
    }
}
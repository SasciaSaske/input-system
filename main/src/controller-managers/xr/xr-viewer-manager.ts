import { XRHeadController } from "../../controllers/xr/xr-head-controller.js";
import { XRScreenController } from "../../controllers/xr/xr-screen-controller.js";
import { XRViewerController } from "../../controllers/xr/xr-viewer-controller.js";
import { InputManager } from "../../input-manager.js";
import { SingleControllerManager } from "../controller-manager.js";
import { SingleNativeControllerManager } from "../native/native-controller-enabler.js";
import { NativeXRHeadEnabler, NativeXRScreenEnabler } from "../native/xr/native-xr-viewer-enabler.js";

export interface XRHeadManager extends SingleNativeControllerManager<XRHeadController, NativeXRHeadEnabler> { }
export interface XRScreenManager extends SingleNativeControllerManager<XRScreenController, NativeXRScreenEnabler> { }

export class XRViewerManager extends SingleControllerManager<XRViewerController> {
    public readonly head: XRHeadManager;
    public readonly screen: XRScreenManager;

    public constructor(inputManager: InputManager) {
        super();
        this.head = new SingleNativeControllerManager<XRHeadController, NativeXRHeadEnabler>(new NativeXRHeadEnabler(inputManager));
        this.screen = new SingleNativeControllerManager<XRScreenController, NativeXRScreenEnabler>(new NativeXRScreenEnabler(inputManager));
    }
}
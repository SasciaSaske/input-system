import { XRGamepadController } from "../../controllers/xr/xr-gamepad-controller.js";
import { XRHandController } from "../../controllers/xr/xr-hand-controller.js";
import { InputManager } from "../../input-manager.js";
import { NativeXRControllerManager } from "../native/xr/native-xr-controller-manager.js";
import { NativeXRGamepadEnabler, NativeXRHandEnabler } from "../native/xr/native-xr-input-source-enabler.js";
import { SingleControllerManager } from "../controller-manager.js";
import { XRHandedManager } from "./xr-handed-manager.js";
import { XRViewerManager } from "./xr-viewer-manager.js";

export interface XRHandedGamepadManager extends SingleControllerManager<XRGamepadController> { }
export interface XRGamepadManager extends XRHandedManager<XRGamepadController, NativeXRGamepadEnabler> {
    left: XRHandedGamepadManager;
    right: XRHandedGamepadManager;
}
export interface XRHandedHandManager extends SingleControllerManager<XRHandController> { }
export interface XRHandManager extends XRHandedManager<XRHandController, NativeXRHandEnabler> {
    left: XRHandedHandManager;
    right: XRHandedHandManager;
}


export class XRControllerManager {
    public readonly native: NativeXRControllerManager;

    public readonly viewer: XRViewerManager;

    public readonly gamepad: XRGamepadManager;
    public readonly hand: XRHandManager;

    public constructor(inputManager: InputManager) {
        this.native = new NativeXRControllerManager(inputManager);

        this.viewer = new XRViewerManager(inputManager);

        this.gamepad = new XRHandedManager<XRGamepadController, NativeXRGamepadEnabler>(new NativeXRGamepadEnabler(inputManager));
        this.hand = new XRHandedManager<XRHandController, NativeXRHandEnabler>(new NativeXRHandEnabler(inputManager));

    }
}
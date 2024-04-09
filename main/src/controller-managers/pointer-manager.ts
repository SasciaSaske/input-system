import { MouseController } from "../controllers/pointers/mouse-controller.js";
import { PenController } from "../controllers/pointers/pen-controller.js";
import { PointerController } from "../controllers/pointers/pointer-controller.js";
import { TouchController } from "../controllers/pointers/touch-controller.js";
import { InputManager } from "../input-manager.js";
import { SingleNativeControllerManager } from "./native/native-controller-enabler.js";
import { NativeMouseEnabler, NativePenEnabler, NativeTouchEnabler } from "./native/native-pointer-enanbler.js";
import { SingleControllerManager } from "./controller-manager.js";

export interface MouseManager extends SingleNativeControllerManager<MouseController, NativeMouseEnabler> { }
export interface TouchManager extends SingleNativeControllerManager<TouchController, NativeTouchEnabler> { }
export interface PenManager extends SingleNativeControllerManager<PenController, NativePenEnabler> { }

export class PointerManager extends SingleControllerManager<PointerController> {
    public readonly mouse: MouseManager;
    public readonly touch: TouchManager;
    public readonly pen: PenManager;

    constructor(inputManager: InputManager) {
        super();
        this.mouse = new SingleNativeControllerManager<MouseController, NativeMouseEnabler>(new NativeMouseEnabler(inputManager));
        this.touch = new SingleNativeControllerManager<TouchController, NativeTouchEnabler>(new NativeTouchEnabler(inputManager));
        this.pen = new SingleNativeControllerManager<PenController, NativePenEnabler>(new NativePenEnabler(inputManager));
    }
}
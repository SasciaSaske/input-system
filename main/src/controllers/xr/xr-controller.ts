import { PoseControl } from "../../controls/xr-controls.js";
import { Vector3, Vector4 } from "../../helpers/vectors-helper.js";
import { InputController } from "../input-controller.js";
declare module "../input-maps.js" {
    export interface InputControlMap extends XRControlMap {
    }
}

export interface XRControlMap {
    'pose': XRPose,
    'pose/position': Vector3,
    'pose/position/x': number,
    'pose/position/y': number,
    'pose/position/z': number,
    'pose/rotation': Vector4,
    'pose/rotation/x': number,
    'pose/rotation/y': number,
    'pose/rotation/z': number,
    'pose/rotation/w': number,
    'pose/linearVelocity': Vector3,
    'pose/linearVelocity/x': number,
    'pose/linearVelocity/y': number,
    'pose/linearVelocity/z': number,
    'pose/angularVelocity': Vector3,
    'pose/angularVelocity/x': number,
    'pose/angularVelocity/y': number,
    'pose/angularVelocity/z': number,
}

export interface XRController extends InputController {
    get pose(): PoseControl;
}

export interface XRHandedController extends XRController {
    get handedness(): XRHandedness;
}

export interface XRInputSourceController extends XRHandedController {
    get inputSource(): XRInputSource;
}
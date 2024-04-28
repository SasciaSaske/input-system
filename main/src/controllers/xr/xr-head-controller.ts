import { ViewControl } from "../../controls/xr-controls.js";
import { Vector3, Vector4 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { XRViewerControlMap, XRViewerController } from "./xr-viewer-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'xr-viewer/head': XRHeadControlMap;
    }

    export interface InputControlMap extends XRHeadControlMap {
    }
}

export interface XRHeadControlMap extends XRViewerControlMap {
    'leftEye': XRPose,
    'leftEye/position': Vector3,
    'leftEye/position/x': number,
    'leftEye/position/y': number,
    'leftEye/position/z': number,
    'leftEye/rotation': Vector4,
    'leftEye/rotation/x': number,
    'leftEye/rotation/y': number,
    'leftEye/rotation/z': number,
    'leftEye/rotation/w': number,

    'rightEye': XRPose,
    'rightEye/position': Vector3,
    'rightEye/position/x': number,
    'rightEye/position/y': number,
    'rightEye/position/z': number,
    'rightEye/rotation': Vector4,
    'rightEye/rotation/x': number,
    'rightEye/rotation/y': number,
    'rightEye/rotation/z': number,
    'rightEye/rotation/w': number,
}

export abstract class XRHeadController extends XRViewerController {
    declare protected _path: ['xr-viewer', 'head', ...string[]];

    public abstract get leftEye(): ViewControl;
    public abstract get rightEye(): ViewControl;

    constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[1] = 'head';
        this._addManager(inputManager.xr.viewer.head);
    }
}
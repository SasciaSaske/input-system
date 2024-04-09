import { ViewControl } from "../../controls/xr-controls.js";
import { ReadonlyVector3, ReadonlyVector4 } from "../../helpers/vectors-helper.js";
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
    'leftEye/position': ReadonlyVector3,
    'leftEye/position/x': number,
    'leftEye/position/y': number,
    'leftEye/position/z': number,
    'leftEye/rotation': ReadonlyVector4,
    'leftEye/rotation/x': number,
    'leftEye/rotation/y': number,
    'leftEye/rotation/z': number,
    'leftEye/rotation/w': number,

    'rightEye': XRPose,
    'rightEye/position': ReadonlyVector3,
    'rightEye/position/x': number,
    'rightEye/position/y': number,
    'rightEye/position/z': number,
    'rightEye/rotation': ReadonlyVector4,
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
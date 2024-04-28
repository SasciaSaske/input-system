import { XRPointerControl } from "../../controls/xr-controls.js";
import {
    Vector3, Vector4
} from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { XRViewerControlMap, XRViewerController } from "./xr-viewer-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'xr-viewer/screen': XRScreenControlMap;
    }

    export interface InputControlMap extends XRScreenControlMap {
    }
}

export interface XRScreenControlMap extends XRViewerControlMap {
    'primaryPointer': XRPose,
    'primaryPointer/origin':
    Vector3,
    'primaryPointer/origin/x': number,
    'primaryPointer/origin/y': number,
    'primaryPointer/origin/z': number,
    'primaryPointer/direction': Vector4,
    'primaryPointer/direction/x': number,
    'primaryPointer/direction/y': number,
    'primaryPointer/direction/z': number,
    'primaryPointer/direction/w': number,

    'pointer0': XRPose,
    'pointer0/origin':
    Vector3,
    'pointer0/origin/x': number,
    'pointer0/origin/y': number,
    'pointer0/origin/z': number,
    'pointer0/direction': Vector4,
    'pointer0/direction/x': number,
    'pointer0/direction/y': number,
    'pointer0/direction/z': number,
    'pointer0/direction/w': number,

    'pointer1': XRPose,
    'pointer1/origin':
    Vector3,
    'pointer1/origin/x': number,
    'pointer1/origin/y': number,
    'pointer1/origin/z': number,
    'pointer1/direction': Vector4,
    'pointer1/direction/x': number,
    'pointer1/direction/y': number,
    'pointer1/direction/z': number,
    'pointer1/direction/w': number,

    'pointer2': XRPose,
    'pointer2/origin':
    Vector3,
    'pointer2/origin/x': number,
    'pointer2/origin/y': number,
    'pointer2/origin/z': number,
    'pointer2/direction': Vector4,
    'pointer2/direction/x': number,
    'pointer2/direction/y': number,
    'pointer2/direction/z': number,
    'pointer2/direction/w': number,

    'pointer3': XRPose,
    'pointer3/origin':
    Vector3,
    'pointer3/origin/x': number,
    'pointer3/origin/y': number,
    'pointer3/origin/z': number,
    'pointer3/direction': Vector4,
    'pointer3/direction/x': number,
    'pointer3/direction/y': number,
    'pointer3/direction/z': number,
    'pointer3/direction/w': number,

    'pointer4': XRPose,
    'pointer4/origin':
    Vector3,
    'pointer4/origin/x': number,
    'pointer4/origin/y': number,
    'pointer4/origin/z': number,
    'pointer4/direction': Vector4,
    'pointer4/direction/x': number,
    'pointer4/direction/y': number,
    'pointer4/direction/z': number,
    'pointer4/direction/w': number,
}

export abstract class XRScreenController extends XRViewerController {
    declare protected _path: ['xr-viewer', 'screen', ...string[]];

    public abstract getPointer(index: number): XRPointerControl | null;
    public abstract get primaryPointer(): XRPointerControl;
    public abstract maxPointers: number;

    constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[1] = 'screen';
        this._addManager(inputManager.xr.viewer.screen);
    }
}
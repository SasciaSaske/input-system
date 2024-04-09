import { BooleanControl } from "../../controls/input-controls.js";
import { PoseControl } from "../../controls/xr-controls.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";
import { XRControlMap, XRController } from "./xr-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'xr-viewer': XRViewerControlMap;
    }

    export interface InputControlMap extends XRViewerControlMap {
    }
}

export interface XRViewerControlMap extends XRControlMap {
    'select': boolean,
}

export abstract class XRViewerController extends InputController implements XRController {
    declare protected _path: ['xr-viewer', string, ...string[]];
    public get type(): string {
        return this._path[1];
    }

    public abstract get pose(): PoseControl;
    public abstract get select(): BooleanControl;

    protected constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'xr-viewer';
        this._addManager(inputManager.xr.viewer);
    }
}
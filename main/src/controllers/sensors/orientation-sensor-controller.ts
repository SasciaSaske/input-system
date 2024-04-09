import { Vector3Control, Vector4Control } from "../../controls/input-controls.js";
import { ReadonlyVector3 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'orientation-sensor': OrientationSensorControlMap;
    }

    export interface InputControlMap extends OrientationSensorControlMap {
    }
}

export interface OrientationSensorControlMap {
    'rotation': ReadonlyVector3,
    'rotation/x': number,
    'rotation/y': number,
    'rotation/z': number,
    'rotation/w': number,
    'degRotation': ReadonlyVector3,
    'degRotation/x': number,
    'degRotation/y': number,
    'degRotation/z': number,
}

export abstract class OrientationSensorController extends InputController {
    declare protected _path: ['orientation-sensor', ...string[]];

    public abstract get absolute(): boolean;

    public abstract get rotation(): Vector4Control;
    public abstract get degRotation(): Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'orientation-sensor';
        this._addManager(inputManager.sensor.orientation);
    }

    protected override _activationCheck(): boolean {
        return false;
    }
}
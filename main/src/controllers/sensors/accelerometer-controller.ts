import { Vector3Control } from "../../controls/input-controls.js";
import { ReadonlyVector3 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'accelerometer': AccelerometerControlMap;
    }

    export interface InputControlMap extends AccelerometerControlMap {
    }
}

export interface AccelerometerControlMap {
    'acceleration': ReadonlyVector3,
    'acceleration/x': number,
    'acceleration/y': number,
    'acceleration/z': number,
}

export abstract class AccelerometerController extends InputController {
    declare protected _path: ['accelerometer', ...string[]];

    public readonly acceleration!: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'accelerometer';
        this._addManager(inputManager.sensor.accelerometer);
    }
}
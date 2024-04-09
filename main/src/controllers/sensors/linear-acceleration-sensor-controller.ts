import { Vector3Control } from "../../controls/input-controls.js";
import { ReadonlyVector3 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'linear-acceleration-sensor': LinearAccelerationSensorControlMap;
    }

    export interface InputControlMap extends LinearAccelerationSensorControlMap {
    }
}

export interface LinearAccelerationSensorControlMap {
    'acceleration': ReadonlyVector3,
    'acceleration/x': number,
    'acceleration/y': number,
    'acceleration/z': number,
}

export abstract class LinearAccelerationSensorController extends InputController {
    declare protected _path: ['linear-acceleration-sensor', ...string[]];

    public readonly acceleration!: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'linear-acceleration-sensor';
        this._addManager(inputManager.sensor.linearAcceleration);
    }
}
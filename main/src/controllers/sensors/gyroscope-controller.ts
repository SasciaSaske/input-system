import { Vector3Control } from "../../controls/input-controls.js";
import { Vector3 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gyroscope': GyroscopeControlMap;
    }

    export interface InputControlMap extends GyroscopeControlMap {
    }
}

export interface GyroscopeControlMap {
    'angularVelocity': Vector3,
    'angularVelocity/x': number,
    'angularVelocity/y': number,
    'angularVelocity/z': number,
}

export abstract class GyroscopeController extends InputController {
    declare protected _path: ['gyroscope', ...string[]];

    public readonly angularVelocity!: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'gyroscope';
        this._addManager(inputManager.sensor.gyroscope);
    }
}
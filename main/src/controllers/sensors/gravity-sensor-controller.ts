import { Vector3Control } from "../../controls/input-controls.js";
import { ReadonlyVector3 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputController } from "../input-controller.js";

declare module "../input-maps.js" {
    export interface InputControllerMap {
        'gravity-sensor': GravitySensorControlMap;
    }

    export interface InputControlMap extends GravitySensorControlMap {
    }
}

export interface GravitySensorControlMap {
    'gravity': ReadonlyVector3,
    'gravity/x': number,
    'gravity/y': number,
    'gravity/z': number,
}

export abstract class GravitySensorController extends InputController {
    declare protected _path: ['gravity-sensor', ...string[]];

    public readonly gravity!: Vector3Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'gravity-sensor';
        this._addManager(inputManager.sensor.gravity);
    }
}
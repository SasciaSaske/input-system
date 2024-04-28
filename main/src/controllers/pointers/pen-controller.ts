import { BooleanControl, NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { Vector2 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { PointerControlMap, PointerController } from "./pointer-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'pointer/pen': PenControlMap;
    }

    export interface InputControlMap extends PenControlMap {
    }
}

export interface PenControlMap extends PointerControlMap {
    'tip': boolean,
    'pressure': number,
    'tilt': Vector2,
    'tilt/x': number,
    'tilt/y': number,
    'twist': number,

    'barrelButton': boolean,
    'eraser': boolean
}

export abstract class PenController extends PointerController {
    declare protected _path: ['pointer', 'pen', ...string[]];

    public abstract get tip(): BooleanControl;
    public abstract get pressure(): NumberControl;
    public abstract get tilt(): Vector2Control;
    public abstract get twist(): NumberControl;

    public abstract get barrelButton(): BooleanControl;
    public abstract get eraser(): BooleanControl;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[1] = 'pen';
        this._addManager(inputManager.pointer.pen);
    }
}
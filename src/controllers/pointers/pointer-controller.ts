import { BooleanControl, Vector2Control } from "../../controls/input-controls.js";
import { InputManager } from "../../input-manager.js";
import { ReadonlyVector2 } from "../../helpers/vectors-helper.js";
import { InputController } from "../input-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'pointer': PointerControlMap;
    }

    export interface InputControlMap extends PointerControlMap {
    }
}

export interface PointerControlMap {
    'selectButton': boolean,
    'position': ReadonlyVector2,
    'position/x': number,
    'position/y': number,
    'deltaPosition': ReadonlyVector2,
    'deltaPosition/x': number,
    'deltaPosition/y': number,
}

export abstract class PointerController extends InputController {
    declare protected _path: ['pointer', string, ...string[]];
    public get type(): string {
        return this._path[1];
    }

    public abstract get selectButton(): BooleanControl;
    public abstract get position(): Vector2Control;
    public abstract get deltaPosition(): Vector2Control;

    public abstract get isInsideTarget(): boolean;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'pointer';
        this._addManager(inputManager.pointer);
    }
}
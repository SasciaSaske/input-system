import { TouchControl } from "../../controls/touch-controls.js";
import { ReadonlyVector2 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { PointerControlMap, PointerController } from "./pointer-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'pointer/touch': TouchControlMap;
    }

    export interface InputControlMap extends TouchControlMap {
    }
}

export interface TouchControlMap extends PointerControlMap {
    'primaryTouch': boolean,
    'primaryTouch/position': ReadonlyVector2,
    'primaryTouch/position/x': number,
    'primaryTouch/position/y': number,
    'primaryTouch/deltaPosition': ReadonlyVector2,
    'primaryTouch/deltaPosition/x': number,
    'primaryTouch/deltaPosition/y': number,
    'primaryTouch/radius': ReadonlyVector2,
    'primaryTouch/radius/x': number,
    'primaryTouch/radius/y': number,
    'primaryTouch/pressure': number,

    'touch0': boolean,
    'touch0/position': ReadonlyVector2,
    'touch0/position/x': number,
    'touch0/position/y': number,
    'touch0/deltaPosition': ReadonlyVector2,
    'touch0/deltaPosition/x': number,
    'touch0/deltaPosition/y': number,
    'touch0/radius': ReadonlyVector2,
    'touch0/radius/x': number,
    'touch0/radius/y': number,
    'touch0/pressure': number,

    'touch1': boolean,
    'touch1/position': ReadonlyVector2,
    'touch1/position/x': number,
    'touch1/position/y': number,
    'touch1/deltaPosition': ReadonlyVector2,
    'touch1/deltaPosition/x': number,
    'touch1/deltaPosition/y': number,
    'touch1/radius': ReadonlyVector2,
    'touch1/radius/x': number,
    'touch1/radius/y': number,
    'touch1/pressure': number,

    'touch2': boolean,
    'touch2/position': ReadonlyVector2,
    'touch2/position/x': number,
    'touch2/position/y': number,
    'touch2/deltaPosition': ReadonlyVector2,
    'touch2/deltaPosition/x': number,
    'touch2/deltaPosition/y': number,
    'touch2/radius': ReadonlyVector2,
    'touch2/radius/x': number,
    'touch2/radius/y': number,
    'touch2/pressure': number,

    'touch3': boolean,
    'touch3/position': ReadonlyVector2,
    'touch3/position/x': number,
    'touch3/position/y': number,
    'touch3/deltaPosition': ReadonlyVector2,
    'touch3/deltaPosition/x': number,
    'touch3/deltaPosition/y': number,
    'touch3/radius': ReadonlyVector2,
    'touch3/radius/x': number,
    'touch3/radius/y': number,
    'touch3/pressure': number,

    'touch4': boolean,
    'touch4/position': ReadonlyVector2,
    'touch4/position/x': number,
    'touch4/position/y': number,
    'touch4/deltaPosition': ReadonlyVector2,
    'touch4/deltaPosition/x': number,
    'touch4/deltaPosition/y': number,
    'touch4/radius': ReadonlyVector2,
    'touch4/radius/x': number,
    'touch4/radius/y': number,
    'touch4/pressure': number,

    'touch5': boolean,
    'touch5/position': ReadonlyVector2,
    'touch5/position/x': number,
    'touch5/position/y': number,
    'touch5/deltaPosition': ReadonlyVector2,
    'touch5/deltaPosition/x': number,
    'touch5/deltaPosition/y': number,
    'touch5/radius': ReadonlyVector2,
    'touch5/radius/x': number,
    'touch5/radius/y': number,
    'touch5/pressure': number,

    'touch6': boolean,
    'touch6/position': ReadonlyVector2,
    'touch6/position/x': number,
    'touch6/position/y': number,
    'touch6/deltaPosition': ReadonlyVector2,
    'touch6/deltaPosition/x': number,
    'touch6/deltaPosition/y': number,
    'touch6/radius': ReadonlyVector2,
    'touch6/radius/x': number,
    'touch6/radius/y': number,
    'touch6/pressure': number,

    'touch7': boolean,
    'touch7/position': ReadonlyVector2,
    'touch7/position/x': number,
    'touch7/position/y': number,
    'touch7/deltaPosition': ReadonlyVector2,
    'touch7/deltaPosition/x': number,
    'touch7/deltaPosition/y': number,
    'touch7/radius': ReadonlyVector2,
    'touch7/radius/x': number,
    'touch7/radius/y': number,
    'touch7/pressure': number,

    'touch8': boolean,
    'touch8/position': ReadonlyVector2,
    'touch8/position/x': number,
    'touch8/position/y': number,
    'touch8/deltaPosition': ReadonlyVector2,
    'touch8/deltaPosition/x': number,
    'touch8/deltaPosition/y': number,
    'touch8/radius': ReadonlyVector2,
    'touch8/radius/x': number,
    'touch8/radius/y': number,
    'touch8/pressure': number,

    'touch9': boolean,
    'touch9/position': ReadonlyVector2,
    'touch9/position/x': number,
    'touch9/position/y': number,
    'touch9/deltaPosition': ReadonlyVector2,
    'touch9/deltaPosition/x': number,
    'touch9/deltaPosition/y': number,
    'touch9/radius': ReadonlyVector2,
    'touch9/radius/x': number,
    'touch9/radius/y': number,
    'touch9/pressure': number,

    'touch10': boolean,
    'touch10/position': ReadonlyVector2,
    'touch10/position/x': number,
    'touch10/position/y': number,
    'touch10/deltaPosition': ReadonlyVector2,
    'touch10/deltaPosition/x': number,
    'touch10/deltaPosition/y': number,
    'touch10/radius': ReadonlyVector2,
    'touch10/radius/x': number,
    'touch10/radius/y': number,
    'touch10/pressure': number,

    'touch11': boolean,
    'touch11/position': ReadonlyVector2,
    'touch11/position/x': number,
    'touch11/position/y': number,
    'touch11/deltaPosition': ReadonlyVector2,
    'touch11/deltaPosition/x': number,
    'touch11/deltaPosition/y': number,
    'touch11/radius': ReadonlyVector2,
    'touch11/radius/x': number,
    'touch11/radius/y': number,
    'touch11/pressure': number,

    'touch12': boolean,
    'touch12/position': ReadonlyVector2,
    'touch12/position/x': number,
    'touch12/position/y': number,
    'touch12/deltaPosition': ReadonlyVector2,
    'touch12/deltaPosition/x': number,
    'touch12/deltaPosition/y': number,
    'touch12/radius': ReadonlyVector2,
    'touch12/radius/x': number,
    'touch12/radius/y': number,
    'touch12/pressure': number,

    'touch13': boolean,
    'touch13/position': ReadonlyVector2,
    'touch13/position/x': number,
    'touch13/position/y': number,
    'touch13/deltaPosition': ReadonlyVector2,
    'touch13/deltaPosition/x': number,
    'touch13/deltaPosition/y': number,
    'touch13/radius': ReadonlyVector2,
    'touch13/radius/x': number,
    'touch13/radius/y': number,
    'touch13/pressure': number,

    'touch14': boolean,
    'touch14/position': ReadonlyVector2,
    'touch14/position/x': number,
    'touch14/position/y': number,
    'touch14/deltaPosition': ReadonlyVector2,
    'touch14/deltaPosition/x': number,
    'touch14/deltaPosition/y': number,
    'touch14/radius': ReadonlyVector2,
    'touch14/radius/x': number,
    'touch14/radius/y': number,
    'touch14/pressure': number,

    'touch15': boolean,
    'touch15/position': ReadonlyVector2,
    'touch15/position/x': number,
    'touch15/position/y': number,
    'touch15/deltaPosition': ReadonlyVector2,
    'touch15/deltaPosition/x': number,
    'touch15/deltaPosition/y': number,
    'touch15/radius': ReadonlyVector2,
    'touch15/radius/x': number,
    'touch15/radius/y': number,
    'touch15/pressure': number,

    'touch16': boolean,
    'touch16/position': ReadonlyVector2,
    'touch16/position/x': number,
    'touch16/position/y': number,
    'touch16/deltaPosition': ReadonlyVector2,
    'touch16/deltaPosition/x': number,
    'touch16/deltaPosition/y': number,
    'touch16/radius': ReadonlyVector2,
    'touch16/radius/x': number,
    'touch16/radius/y': number,
    'touch16/pressure': number,

    'touch17': boolean,
    'touch17/position': ReadonlyVector2,
    'touch17/position/x': number,
    'touch17/position/y': number,
    'touch17/deltaPosition': ReadonlyVector2,
    'touch17/deltaPosition/x': number,
    'touch17/deltaPosition/y': number,
    'touch17/radius': ReadonlyVector2,
    'touch17/radius/x': number,
    'touch17/radius/y': number,
    'touch17/pressure': number,

    'touch18': boolean,
    'touch18/position': ReadonlyVector2,
    'touch18/position/x': number,
    'touch18/position/y': number,
    'touch18/deltaPosition': ReadonlyVector2,
    'touch18/deltaPosition/x': number,
    'touch18/deltaPosition/y': number,
    'touch18/radius': ReadonlyVector2,
    'touch18/radius/x': number,
    'touch18/radius/y': number,
    'touch18/pressure': number,

    'touch19': boolean,
    'touch19/position': ReadonlyVector2,
    'touch19/position/x': number,
    'touch19/position/y': number,
    'touch19/deltaPosition': ReadonlyVector2,
    'touch19/deltaPosition/x': number,
    'touch19/deltaPosition/y': number,
    'touch19/radius': ReadonlyVector2,
    'touch19/radius/x': number,
    'touch19/radius/y': number,
    'touch19/pressure': number
}

export abstract class TouchController extends PointerController {
    declare protected _path: ['pointer', 'touch', ...string[]];

    public abstract get primaryTouch(): TouchControl

    public abstract getTouch(index: number): TouchControl | null;

    public abstract get maxTouchPoints(): number;
    public abstract get activeTouches(): readonly TouchControl[];

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[1] = 'touch';
        this._addManager(inputManager.pointer.touch);
    }
}
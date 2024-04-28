import { BooleanControl, Vector2Control } from "../../controls/input-controls.js";
import { Vector2 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { PointerControlMap, PointerController } from "./pointer-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'pointer/mouse': MouseControlMap;
    }

    export interface InputControlMap extends MouseControlMap {
    }
}

export interface MouseControlMap extends PointerControlMap {
    'leftbutton': boolean,
    'middleButton': boolean,
    'rightButton': boolean,
    'backButton': boolean,
    'forwardButton': boolean,

    'wheel': Vector2,
    'wheel/x': number,
    'wheel/y': number,
}

export abstract class MouseController extends PointerController {
    declare protected _path: ['pointer', 'mouse', ...string[]];

    public abstract get leftButton(): BooleanControl;
    public abstract get middleButton(): BooleanControl;
    public abstract get rightButton(): BooleanControl;
    public abstract get backButton(): BooleanControl;
    public abstract get forwardButton(): BooleanControl;

    public abstract get wheel(): Vector2Control;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[1] = 'mouse';
        this._addManager(inputManager.pointer.mouse);
    }
}
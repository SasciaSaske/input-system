import { XRHandedController } from "../../controllers/xr/xr-controller.js";
import { SingleControllerManager } from "../controller-manager.js";

export class XRHandedManagerWrapper<T extends XRHandedController> {
    private readonly _left: SingleControllerManager<T>;
    private readonly _right: SingleControllerManager<T>;

    private _current!: SingleControllerManager<T>;

    constructor(left: SingleControllerManager<T>, right: SingleControllerManager<T>) {
        this._left = left;
        this._right = right;
    }

    public setHandedness(handedness: XRHandedness): void {
        if (handedness === 'left') {
            this._current = this._left;
        } else if (handedness === 'right') {
            this._current = this._right;
        }
    }

    /* @internal */
    public _add(controller: T): void {
        this._current._add(controller);
    }
    /* @internal */
    public _remove(controller: T): void {
        this._current._remove(controller);
    }
    /* @internal */
    public _setCurrent(controller: T): void {
        this._current._setCurrent(controller);
    }
    /* @internal */
    public _setActivated(controller: T): void {
        this._current._setActivated(controller);
    }

}
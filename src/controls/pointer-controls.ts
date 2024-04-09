import { BaseInputControl, NumberControl, Vector2GenericControl } from "./input-controls.js";
import { PointerController } from "../controllers/pointers/pointer-controller.js";
import { PointerData } from "../controllers/pointers/pointer-data.js";
import { BasePropertyControl } from "./property-based-controls.js";

export class PointerButtonControl extends BaseInputControl<boolean> {
    protected _pointerData: PointerData;
    protected _index: number;
    public constructor(controller: PointerController, name: string, pointerData: PointerData, index: number) {
        super(controller, name);
        this._pointerData = pointerData;
        this._index = index;
    }
    public isActivated(): boolean {
        return (this._pointerData.buttons & this._index) === this._index;
    }
    public readValue(): boolean {
        return (this._pointerData.buttons & this._index) === this._index;
    }
}

// fix for inconsistent changes in onpointerleave
export class PointerContactValueControl extends BasePropertyControl<PointerData, number> implements NumberControl {
    public isActivated(): boolean {
        return (this._object.buttons & 1) !== 1 && this._object[this._key] > 0;
    }
}

export class PointerRadiusControl extends Vector2GenericControl {
    public constructor(controller: PointerController, name: string, pointerData: PointerData) {
        super(controller, name,
            new PointerContactValueControl(controller, name + '/x', pointerData, 'radiusX'),
            new PointerContactValueControl(controller, name + '/y', pointerData, 'radiusY'));
    }
}
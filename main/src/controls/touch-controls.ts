import { PointerData } from "../controllers/pointers/pointer-data.js";
import { TouchController } from "../controllers/pointers/touch-controller.js";
import { IndexInputControl, InputControl, NumberControl, Vector2Control } from "./input-controls.js";
import { BASE_DUMMY_CONTROL, DUMMY_NUMBER_CONTROL, DUMMY_VECTOR_2_CONTROL } from './dummy-controls.js';
import { PointerContactValueControl, PointerRadiusControl } from "./pointer-controls.js";
import { PropertyVector2Control, PropertyVector2StateControl } from "./property-based-controls.js";

export interface TouchControl extends InputControl<boolean> {
    get position(): Vector2Control;
    get deltaPosition(): Vector2Control;
    get radius(): Vector2Control;
    get pressure(): NumberControl;
    get index(): number;
    readValue(): boolean;
}

export class EventTouchControl extends IndexInputControl<boolean> implements TouchControl {
    public readonly position: Vector2Control;
    public readonly deltaPosition: Vector2Control;
    public readonly radius: Vector2Control;
    public readonly pressure: NumberControl;
    private _pointerData = new PointerData();

    get id(): number {
        return this._pointerData.pointerId;
    }

    get index(): number {
        return this._index;
    }

    public constructor(controller: TouchController, name: string, index: number) {
        super(controller, name, index);
        this.position = new PropertyVector2StateControl(controller, name + '/position', this._pointerData, 'positionX', 'positionY');
        this.deltaPosition = new PropertyVector2Control(controller, name + '/deltaPosition', this._pointerData, 'deltaPositionX', 'deltaPositionY');
        this.radius = new PointerRadiusControl(controller, name + '/radius', this._pointerData);
        this.pressure = new PointerContactValueControl(controller, name + '/pressure', this._pointerData, 'pressure');
    }

    public updateEvent(event: PointerEvent): void {
        this._pointerData.updateData(event);
    }

    public init(event: PointerEvent): void {
        this._pointerData.init(event);
    }

    public reset(): void {
        this._pointerData.reset();
    }

    public update(): void {
        this._pointerData.update();
    }

    public isActivated(): boolean {
        return this._pointerData.buttons > 0;
    }
    public readValue(): boolean {
        return this._pointerData.buttons > 0;
    }
}

export const DUMMY_TOUCH_CONTROL: TouchControl = {
    ...BASE_DUMMY_CONTROL,
    position: DUMMY_VECTOR_2_CONTROL,
    deltaPosition: DUMMY_VECTOR_2_CONTROL,
    radius: DUMMY_VECTOR_2_CONTROL,
    pressure: DUMMY_NUMBER_CONTROL,
    index: -1,
    readValue: function (): boolean { return false; }
};
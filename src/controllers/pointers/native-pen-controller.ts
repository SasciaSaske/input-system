import { BooleanControl, NumberControl, Vector2Control } from "../../controls/input-controls.js";
import { PointerButtonControl, PointerContactValueControl } from "../../controls/pointer-controls.js";
import { PropertyStateControl, PropertyVector2Control, PropertyVector2StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { PenController } from "./pen-controller.js";
import { PointerData } from "./pointer-data.js";

export class NativePenController extends PenController {
    private readonly _pointerData: PointerData;

    public readonly selectButton: BooleanControl;

    public readonly tip: BooleanControl;
    public readonly position: Vector2Control;
    public readonly deltaPosition: Vector2Control;
    public readonly pressure: NumberControl;
    public readonly tilt: Vector2Control;
    public readonly twist: NumberControl;

    public readonly barrelButton: BooleanControl;
    public readonly eraser: BooleanControl;

    private _eventTarget!: GlobalEventHandlers;
    private _timestamp = 0;
    private _cachedTimestamp = 0;

    private readonly _onPen = (event: PointerEvent): void => {
        if (event.pointerType === 'pen') {
            this._pointerData.updateData(event);
        }
    };
    private readonly _onPenMove = (event: PointerEvent): void => {
        if (event.pointerType === 'pen') {
            this._pointerData.updateData(event);
            if (event.button === -1) {
                this._timestamp = event.timeStamp;
            }
        }
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);

        this._pointerData = new PointerData();

        this.tip = this.selectButton = new PointerButtonControl(this, 'contact', this._pointerData, 1);
        this.barrelButton = new PointerButtonControl(this, 'barrelButton', this._pointerData, 2);
        this.eraser = new PointerButtonControl(this, 'eraser', this._pointerData, 32);

        this.position = new PropertyVector2StateControl(this, 'position', this._pointerData, 'positionX', 'positionY');
        this.deltaPosition = new PropertyVector2Control(this, 'deltaPosition', this._pointerData, 'deltaPositionX', 'deltaPositionY');
        this.pressure = new PointerContactValueControl(this, 'pressure', this._pointerData, 'pressure');
        this.tilt = new PropertyVector2StateControl(this, 'tilt', this._pointerData, 'tiltX', 'tiltY');
        this.twist = new PropertyStateControl(this, 'twist', this._pointerData, 'twist');
    }

    public get isInsideTarget(): boolean {
        return this._pointerData.active;
    }

    public override init(eventTarget: GlobalEventHandlers, event: PointerEvent): void {
        this._pointerData.init(event);

        this._eventTarget = eventTarget;
        eventTarget.addEventListener('pointerdown', this._onPen);
        eventTarget.addEventListener('pointerup', this._onPen);
        eventTarget.addEventListener('pointerenter', this._onPen);
        eventTarget.addEventListener('pointerleave', this._onPen);
        eventTarget.addEventListener('pointercancel', this._onPen);
        eventTarget.addEventListener('pointermove', this._onPenMove);
    }

    protected override _update(): void {
        this._pointerData.update();
    }

    protected override _activationCheck(): boolean {
        if (this._timestamp > this._cachedTimestamp) {
            this._cachedTimestamp = this._timestamp;
            return true;
        } else if (this._pointerData.buttons > 0) {
            return true;
        }
        return false;
    }

    protected override _onDisconnect(): void {
        this._eventTarget.removeEventListener('pointerdown', this._onPen);
        this._eventTarget.removeEventListener('pointerup', this._onPen);
        this._eventTarget.removeEventListener('pointerenter', this._onPen);
        this._eventTarget.removeEventListener('pointerleave', this._onPen);
        this._eventTarget.removeEventListener('pointercancel', this._onPen);
        this._eventTarget.removeEventListener('pointermove', this._onPenMove);
    }
}
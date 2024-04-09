import { BooleanControl, Vector2Control } from "../../controls/input-controls.js";
import { DeltaPixelEventControl } from "../../controls/mouse-keyboard-controls.js";
import { PointerButtonControl } from "../../controls/pointer-controls.js";
import { PropertyVector2Control, PropertyVector2StateControl } from "../../controls/property-based-controls.js";
import { InputManager } from "../../input-manager.js";
import { MouseController } from "./mouse-controller.js";
import { PointerData } from "./pointer-data.js";

export class NativeMouseController extends MouseController {
    private readonly _pointerData: PointerData;

    public readonly selectButton: BooleanControl;

    public readonly leftButton: BooleanControl;
    public readonly middleButton: BooleanControl;
    public readonly rightButton: BooleanControl;
    public readonly backButton: BooleanControl;
    public readonly forwardButton: BooleanControl;

    public readonly position: Vector2Control;
    public readonly deltaPosition: Vector2Control;
    public readonly wheel: Vector2Control;

    private _eventTarget!: GlobalEventHandlers;
    private _MovementTimestamp: number = 0;
    private _cachedMovementTimestamp: number = 0;

    private readonly _onMouse = (event: PointerEvent): void => {
        if (event.pointerType === 'mouse') {
            this._pointerData.updateData(event);
        }
    };

    private readonly _onMouseMove = (event: PointerEvent): void => {
        if (event.pointerType === 'mouse') {
            this._pointerData.updateData(event);
            if (event.button === -1) {
                this._MovementTimestamp = event.timeStamp;
            }
        }
    };

    private readonly _onWheel = (event: WheelEvent): void => {
        this._MovementTimestamp = event.timeStamp;
        (this.wheel as DeltaPixelEventControl).updateRawValue(event.deltaX, event.deltaY);
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);

        this._pointerData = new PointerData();

        this.leftButton = this.selectButton = new PointerButtonControl(this, 'leftButton', this._pointerData, 1);
        this.middleButton = new PointerButtonControl(this, 'middleButton', this._pointerData, 4);
        this.rightButton = new PointerButtonControl(this, 'rightButton', this._pointerData, 2);
        this.backButton = new PointerButtonControl(this, 'backButton', this._pointerData, 8);
        this.forwardButton = new PointerButtonControl(this, 'forwardButton', this._pointerData, 16);

        this.position = new PropertyVector2StateControl(this, 'position', this._pointerData, 'positionX', 'positionY');
        this.deltaPosition = new PropertyVector2Control(this, 'deltaPosition', this._pointerData, 'deltaPositionX', 'deltaPositionY');
        this.wheel = new DeltaPixelEventControl(this, 'wheel');
    }

    public get isInsideTarget(): boolean {
        return this._pointerData.active;
    }

    public override init(eventTarget: GlobalEventHandlers, event: PointerEvent): void {
        this._pointerData.init(event);

        this._eventTarget = eventTarget;
        eventTarget.addEventListener('pointerdown', this._onMouse);
        eventTarget.addEventListener('pointerup', this._onMouse);
        eventTarget.addEventListener('pointerenter', this._onMouse);
        eventTarget.addEventListener('pointerleave', this._onMouse);
        eventTarget.addEventListener('pointercancel', this._onMouse);
        eventTarget.addEventListener('pointermove', this._onMouseMove);
        eventTarget.addEventListener('wheel', this._onWheel);
    }

    protected override _update(): void {
        (this.wheel as DeltaPixelEventControl).update();
        this._pointerData.update();
    }

    protected override _activationCheck(): boolean {
        if (this._MovementTimestamp > this._cachedMovementTimestamp) {
            this._cachedMovementTimestamp = this._MovementTimestamp;
            return true;
        } else if (this._pointerData.buttons > 0) {
            return true;
        }
        return false;
    }

    protected override _onDisconnect(): void {
        this._eventTarget.removeEventListener('pointerdown', this._onMouse);
        this._eventTarget.removeEventListener('pointerup', this._onMouse);
        this._eventTarget.removeEventListener('pointerenter', this._onMouse);
        this._eventTarget.removeEventListener('pointerleave', this._onMouse);
        this._eventTarget.removeEventListener('pointercancel', this._onMouse);
        this._eventTarget.removeEventListener('pointermove', this._onMouseMove);
        this._eventTarget.removeEventListener('wheel', this._onWheel);
    }
}
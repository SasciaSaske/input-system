import { BooleanControl, Vector2Control } from "../../controls/input-controls.js";
import { EventTouchControl, TouchControl } from "../../controls/touch-controls.js";
import { removeAtIndex } from "../../helpers/array-helper.js";
import { InputManager } from "../../input-manager.js";
import { TouchController } from "./touch-controller.js";

let _maxTouchPoints: number;
function _getMaxTouchPoints(): number {
    _maxTouchPoints ??= navigator.maxTouchPoints === 0
        ? 20
        : navigator.platform === 'MacIntel' || navigator.platform === 'iPad'
            ? 17
            : navigator.maxTouchPoints & 0xFF;

    return _maxTouchPoints;
}

export class NativeTouchController extends TouchController {
    public readonly selectButton: BooleanControl;
    public readonly position: Vector2Control;
    public readonly deltaPosition: Vector2Control;

    public readonly primaryTouch: TouchControl;

    public readonly maxTouchPoints = _getMaxTouchPoints();

    private _touches = new Array<TouchControl>(this.maxTouchPoints);
    private _activeTouches: EventTouchControl[] = [];
    private _nextTouch = 0;

    private _eventTarget!: GlobalEventHandlers;

    private readonly _onTouchEnter = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            if (this._nextTouch === this.maxTouchPoints) {
                return;
            }
            const touch = this._getLazyTouch(this._nextTouch);

            do { this._nextTouch++; }
            while (this._nextTouch < this.maxTouchPoints && this._touches[this._nextTouch]?.isActivated());
            this._activeTouches.push(touch);
            touch.updateEvent(event);
            if (event.isPrimary) {
                (this.primaryTouch as EventTouchControl).updateEvent(event);
            }
        }
    };
    private readonly _onTouchLeave = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            const index = this._activeTouches.findIndex((touch): boolean => touch.id === event.pointerId);
            if (index !== -1) {
                const touch = this._activeTouches[index];
                removeAtIndex(this._activeTouches, index);
                touch.updateEvent(event);
                if (event.isPrimary) {
                    (this.primaryTouch as EventTouchControl).updateEvent(event);
                }
                if (touch.index < this._nextTouch) {
                    this._nextTouch = touch.index;
                }
            }
        }
    };
    private readonly _onTouchMove = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            const touch = this._activeTouches.find((touch): boolean => touch.id === event.pointerId);
            if (touch) {
                touch.updateEvent(event);
                if (event.isPrimary) {
                    (this.primaryTouch as EventTouchControl).updateEvent(event);
                }
            }
        }
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);

        for (let i = 0; i < this.maxTouchPoints; i++) {
            const index = i;
            Object.defineProperty(this, 'touch' + i, { get: (): TouchControl => { return this._getLazyTouch(index); } });
        }

        this.primaryTouch = this.selectButton = new EventTouchControl(this, 'primaryTouch', 0);
        this.position = this.primaryTouch.position;
        this.deltaPosition = this.primaryTouch.deltaPosition;
    }

    public get isInsideTarget(): boolean {
        return this._activeTouches.length > 0;
    }

    public get activeTouches(): readonly TouchControl[] {
        return this._activeTouches;
    }

    public override init(eventTarget: GlobalEventHandlers, event: PointerEvent): void {
        const touch = this._getLazyTouch(0);
        touch.init(event);
        (this.primaryTouch as EventTouchControl).init(event);
        for (let i = 1; i < this.maxTouchPoints; i++) {
            (this._touches[i] as EventTouchControl)?.reset();
        }
        this._nextTouch = 1;
        this._activeTouches.length = 0;
        this._activeTouches.push(touch);

        this._eventTarget = eventTarget;
        eventTarget.addEventListener('pointerenter', this._onTouchEnter);
        eventTarget.addEventListener('pointerleave', this._onTouchLeave);
        eventTarget.addEventListener('pointercancel', this._onTouchLeave);
        eventTarget.addEventListener('pointermove', this._onTouchMove);
    }

    public getTouch(index: number): TouchControl | null {
        return index < this.maxTouchPoints ? this._getLazyTouch(index) : null;
    }

    private _getLazyTouch(index: number): EventTouchControl {
        this._touches[index] ??= new EventTouchControl(this, 'touch' + index, index);
        return this._touches[index] as EventTouchControl;
    }

    protected override _update(): void {
        for (let i = 0; i < this.maxTouchPoints; i++) {
            (this._touches[i] as EventTouchControl)?.update();
        }
        (this.primaryTouch as EventTouchControl).update();
    }

    protected override _activationCheck(): boolean {
        return this._activeTouches.length > 0;
    }

    protected override _onDisconnect(): void {
        this._eventTarget.removeEventListener('pointerenter', this._onTouchEnter);
        this._eventTarget.removeEventListener('pointerleave', this._onTouchLeave);
        this._eventTarget.removeEventListener('pointercancel', this._onTouchLeave);
        this._eventTarget.removeEventListener('pointermove', this._onTouchMove);
    }
}
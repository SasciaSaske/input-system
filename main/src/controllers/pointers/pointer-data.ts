import { DataWrapper } from "../../helpers/data-wrapper.js";

interface PointerEvent {
    type: string,
    buttons: number,
    clientX: number,
    clientY: number,
    pressure: number,
    width: number,
    height: number,
    tiltX: number,
    tiltY: number,
    twist: number,
    pointerId: number
}

export class PointerData extends DataWrapper<PointerEvent> {
    protected override _data = DUMMY_POINTER_EVENT;
    private _lastClientX = 0;
    private _lastClientY = 0;
    private _deltaClientX = 0;
    private _deltaClientY = 0;

    public get active(): boolean {
        return this._data.type !== 'pointerleave';
    }
    public get buttons(): number {
        return this._data.buttons;
    }
    public get positionX(): number {
        return (this._data.clientX * devicePixelRatio + 0.5) << 0;
    }
    public get positionY(): number {
        return (this._data.clientY * devicePixelRatio + 0.5) << 0;
    }
    public get deltaPositionX(): number {
        return (this._deltaClientX * devicePixelRatio + 0.5) << 0;
    }
    public get deltaPositionY(): number {
        return (this._deltaClientY * devicePixelRatio + 0.5) << 0;
    }
    public get pressure(): number {
        return this._data.pressure;
    }
    public get radiusX(): number {
        return (this._data.width * devicePixelRatio + 0.5) << 0 * 0.5;
    }
    public get radiusY(): number {
        return (this._data.height * devicePixelRatio + 0.5) << 0 * 0.5;
    }
    public get tiltX(): number {
        return this._data.tiltX;
    }
    public get tiltY(): number {
        return this._data.tiltY;
    }
    public get twist(): number {
        return this._data.twist;
    }
    public get pointerId(): number {
        return this._data.pointerId;
    }

    public init(event: PointerEvent): void {
        this._data = event;
        this._lastClientX = this._data.clientX;
        this._lastClientY = this._data.clientY;
    }

    public reset(): void {
        this._data = DUMMY_POINTER_EVENT;
        this._lastClientX = 0;
        this._lastClientY = 0;
        this._deltaClientX = 0;
        this._deltaClientY = 0;
    }

    public override updateData(event: PointerEvent): void {
        this._data = event;
        if (this._data.type === 'pointerenter') {
            this._lastClientX = event.clientX;
            this._lastClientY = event.clientY;
        }
    }

    public update(): void {
        this._deltaClientX = this._data.clientX - this._lastClientX;
        this._lastClientX = this._data.clientX;
        this._deltaClientY = this._data.clientY - this._lastClientY;
        this._lastClientY = this._data.clientY;
    }
}

const DUMMY_POINTER_EVENT: PointerEvent = {
    type: 'pointerleave',
    buttons: 0,
    clientX: 0,
    clientY: 0,
    pressure: 0,
    width: 0,
    height: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerId: 0
};
import { DataWrapper } from "../../helpers/data-wrapper.js";

interface DeviceOrientationEvent {
    absolute: boolean;
    alpha: number | null,
    beta: number | null,
    gamma: number | null,
}

interface DeviceMotionEvent {
    accelerationIncludingGravity: DeviceMotionEventAcceleration | null,
    acceleration: DeviceMotionEventAcceleration | null,
    rotationRate: DeviceMotionEventRotationRate | null,
}

export interface OrientationData {
    get absolute(): boolean;
    get x(): number;
    get y(): number;
    get z(): number;
}

export class OrientationEventWrapper extends DataWrapper<DeviceOrientationEvent> implements OrientationData {
    public get absolute(): boolean {
        return this._data.absolute;
    }

    public get x(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.beta!;
            case 90:
                return -this._data.gamma!;
            case 180:
                return -this._data.beta!;
            default:
                return this._data.gamma!;
        }
    }
    public get y(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.gamma!;
            case 90:
                return this._data.beta!;
            case 180:
                return -this._data.gamma!;
            default:
                return -this._data.beta!;
        }
    }
    public get z(): number {
        return this._data.alpha!;
    }

    public init(event: DeviceOrientationEvent): void {
        this._data = event;
    }
}

export interface AccelerometerData {
    get x(): number;
    get y(): number;
    get z(): number;
}
export interface linearAccelerationData {
    get x(): number;
    get y(): number;
    get z(): number;
}
export interface GyroscopeData {
    get x(): number;
    get y(): number;
    get z(): number;
}
export interface GravityData {
    get x(): number;
    get y(): number;
    get z(): number;
}

export class MotionEventWrapper extends DataWrapper<DeviceMotionEvent> {
    public get accelerometerX(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.accelerationIncludingGravity!.x!;
            case 90:
                return -this._data.accelerationIncludingGravity!.y!;
            case 180:
                return -this._data.accelerationIncludingGravity!.x!;
            default:
                return this._data.accelerationIncludingGravity!.y!;
        }
    }
    public get accelerometerY(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.accelerationIncludingGravity!.y!;
            case 90:
                return this._data.accelerationIncludingGravity!.x!;
            case 180:
                return -this._data.accelerationIncludingGravity!.y!;
            default:
                return -this._data.accelerationIncludingGravity!.x!;
        }
    }
    public get accelerometerZ(): number {
        return this._data.accelerationIncludingGravity!.z!;
    }

    public get linearAccelerationX(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.acceleration!.x!;
            case 90:
                return -this._data.acceleration!.y!;
            case 180:
                return -this._data.acceleration!.x!;
            default:
                return this._data.acceleration!.y!;
        }
    }
    public get linearAccelerationY(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.acceleration!.y!;
            case 90:
                return this._data.acceleration!.x!;
            case 180:
                return -this._data.acceleration!.y!;
            default:
                return -this._data.acceleration!.x!;
        }
    }
    public get linearAccelerationZ(): number {
        return this._data.acceleration!.z!;
    }

    public get gyroscopeX(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.rotationRate!.beta!;
            case 90:
                return -this._data.rotationRate!.gamma!;
            case 180:
                return -this._data.rotationRate!.beta!;
            default:
                return this._data.rotationRate!.gamma!;
        }
    }
    public get gyroscopeY(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.rotationRate!.gamma!;
            case 90:
                return this._data.rotationRate!.beta!;
            case 180:
                return -this._data.rotationRate!.gamma!;
            default:
                return -this._data.rotationRate!.beta!;
        }
    }
    public get gyroscopeZ(): number {
        return this._data.rotationRate!.alpha!;
    }

    public get gravityX(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.accelerationIncludingGravity!.x! - this._data.acceleration!.x!;
            case 90:
                return this._data.acceleration!.y! - this._data.accelerationIncludingGravity!.y!;
            case 180:
                return this._data.acceleration!.x! - this._data.accelerationIncludingGravity!.x!;
            default:
                return this._data.accelerationIncludingGravity!.y! - this._data.acceleration!.y!;
        }
    }
    public get gravityY(): number {
        switch (window.orientation ?? screen.orientation?.angle) {
            case 0:
                return this._data.accelerationIncludingGravity!.y! - this._data.acceleration!.y!;
            case 90:
                return this._data.accelerationIncludingGravity!.x! - this._data.acceleration!.x!;
            case 180:
                return this._data.acceleration!.y! - this._data.accelerationIncludingGravity!.y!;
            default:
                return this._data.acceleration!.x! - this._data.accelerationIncludingGravity!.x!;
        }
    }
    public get gravityZ(): number {
        return this._data.accelerationIncludingGravity!.z! - this._data.acceleration!.z!;
    }

    public init(event: DeviceMotionEvent): void {
        this._data = event;
    }
}
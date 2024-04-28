import { Vector2, Vector3 } from "./helpers/vectors-helper.js";

export interface InputModifier<T> {
    execute(value: T): T;
}

export const TOGGLE_MODIFIER: InputModifier<boolean> = {
    execute(value: boolean): boolean {
        return !value;
    }
};

export const SIGN_MODIFIER: InputModifier<number> = {
    execute(value: number): number {
        return Math.sign(value);
    }
};

export const ABSOLUTE_MODIFIER: InputModifier<number> = {
    execute(value: number): number {
        return Math.abs(value);
    }
};

export class ClampModifier implements InputModifier<number> {
    private _min: number;
    private _max: number;
    public constructor(min: number, max: number) {
        this._min = min;
        this._max = max;
    }
    public execute(value: number): number {
        return value < this._min ? this._min : value > this._max ? this._max : value;
    }
}

export const INVERT_MODIFIER: InputModifier<number> = {
    execute(value: number): number {
        return -value;
    }
};
export class InvertVector2Modifier implements InputModifier<Vector2> {
    private _cachedValue!: Vector2;

    public execute(value: Vector2): Vector2 {
        this._cachedValue ??= new Vector2;
        this._cachedValue.x = -value.x;
        this._cachedValue.y = -value.y;
        return this._cachedValue;
    }
}
export class InvertVector3Modifier implements InputModifier<Vector3> {
    private _cachedValue!: Vector3;

    public execute(value: Vector3): Vector3 {
        this._cachedValue ??= new Vector3;
        this._cachedValue.x = -value.x;
        this._cachedValue.y = -value.y;
        this._cachedValue.z = -value.z;
        return this._cachedValue;
    }
}

export class ScaleModifier implements InputModifier<number> {
    public multiplier: number;
    public constructor(multiplier: number) {
        this.multiplier = multiplier;
    }
    public execute(value: number): number {
        return value * this.multiplier;
    }
}
export class ScaleVector2Modifier implements InputModifier<Vector2> {
    public multiplier: number;
    private _cachedValue!: Vector2;

    public constructor(multiplier: number) {
        this.multiplier = multiplier;
    }
    public execute(value: Vector2): Vector2 {
        this._cachedValue ??= new Vector2;
        this._cachedValue.x = value.x * this.multiplier;
        this._cachedValue.y = value.y * this.multiplier;
        return this._cachedValue;
    }
}
export class ScaleVector3Modifier implements InputModifier<Vector3> {
    public multiplier: number;
    private _cachedValue!: Vector3;

    public constructor(multiplier: number) {
        this.multiplier = multiplier;
    }
    public execute(value: Vector3): Vector3 {
        this._cachedValue ??= new Vector3;
        this._cachedValue.x = value.x * this.multiplier;
        this._cachedValue.y = value.y * this.multiplier;
        this._cachedValue.z = value.z * this.multiplier;
        return this._cachedValue;
    }
}

export class NormalizeModifier implements InputModifier<number> {
    private _min: number;
    private _max: number;
    public constructor(min: number, max: number) {
        this._min = min;
        this._max = max;
    }
    public execute(value: number): number {
        return value < this._min ? 0 : value > this._max ? 1 : (value - this._min) / (this._max - this._min);
    }
}

export class NormalizeVector2Modifier implements InputModifier<Vector2> {
    private _cachedAxes!: Vector2;

    public execute(value: Vector2): Vector2 {
        const squaredMagnitude = value.x * value.x + value.y * value.y;
        if (squaredMagnitude === 0) {
            return Vector2.zero;
        }
        const magnitude = Math.sqrt(squaredMagnitude);
        this._cachedAxes.x = value.x / magnitude;
        this._cachedAxes.y = value.y / magnitude;
        return this._cachedAxes;
    }
}
export class NormalizeVector3Modifier implements InputModifier<Vector3> {
    private _cachedAxes!: Vector3;

    public execute(value: Vector3): Vector3 {
        const squaredMagnitude = value.x * value.x + value.y * value.y + value.z * value.z;
        if (squaredMagnitude === 0) {
            return Vector3.zero;
        }
        const magnitude = Math.sqrt(squaredMagnitude);
        this._cachedAxes.x = value.x / magnitude;
        this._cachedAxes.y = value.y / magnitude;
        this._cachedAxes.z = value.z / magnitude;
        return this._cachedAxes;
    }
}

export class AxisDeadZoneModifier implements InputModifier<number> {
    public min: number;
    public max: number;

    public constructor(min = 0.125, max = 0.925) {
        this.min = min;
        this.max = max;
    }

    public execute(value: number): number {
        const abs = Math.abs(value);
        if (abs < this.min) {
            return 0;
        }
        const sign = Math.sign(value);
        if (abs > this.max) {
            return sign;
        }
        return (abs - this.min) / (this.max - this.min) * sign;
    }
}
export class StickDeadZoneModifier implements InputModifier<Vector2> {
    public min: number;
    public max: number;
    private _cachedAxes!: Vector2;

    constructor(min = 0.125, max = 0.925) {
        this.min = min;
        this.max = max;
    }
    public execute(axes: Vector2): Vector2 {
        const squaredMagnitude = axes.x * axes.x + axes.y * axes.y;
        if (squaredMagnitude < this.min * this.min) {
            return Vector2.zero;
        }
        const magnitude = Math.sqrt(squaredMagnitude);
        this._cachedAxes ??= new Vector2();
        this._cachedAxes.x = axes.x / magnitude;
        this._cachedAxes.y = axes.y / magnitude;
        if (magnitude > this.max) {
            return this._cachedAxes;
        }
        const scale = (magnitude - this.min) / (this.max - this.min);
        this._cachedAxes.x *= scale;
        this._cachedAxes.y *= scale;
        return this._cachedAxes;
    }
}

export const Modifier = {
    toggle: (): InputModifier<boolean> => TOGGLE_MODIFIER,

    sign: (): InputModifier<number> => SIGN_MODIFIER,
    absolute: (): InputModifier<number> => ABSOLUTE_MODIFIER,
    clamp: (min: number, max: number): InputModifier<number> => new ClampModifier(min, max),

    invert: (): InputModifier<number> => INVERT_MODIFIER,
    invertVector2: (): InputModifier<Vector2> => new InvertVector2Modifier(),
    invertVector3: (): InputModifier<Vector3> => new InvertVector3Modifier(),

    scale: (multiplier: number): InputModifier<number> => new ScaleModifier(multiplier),
    scaleVector2: (multiplier: number): InputModifier<Vector2> => new ScaleVector2Modifier(multiplier),
    scaleVector3: (multiplier: number): InputModifier<Vector3> => new ScaleVector3Modifier(multiplier),

    normalize: (min: number, max: number): InputModifier<number> => new NormalizeModifier(min, max),
    normalizeVector2: (): InputModifier<Vector2> => new NormalizeVector2Modifier(),
    normalizeVector3: (): InputModifier<Vector3> => new NormalizeVector3Modifier(),

    axisDeadZone: (min?: number, max?: number): InputModifier<number> => new AxisDeadZoneModifier(min, max),
    stickDeadZone: (min?: number, max?: number): InputModifier<Vector2> => new StickDeadZoneModifier(min, max),
} as const;
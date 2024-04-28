import { removeAtIndex } from "./helpers/array-helper.js";
import { KeyOfExtendsType } from "./helpers/type-helpers.js";
import { Vector2, Vector3 } from "./helpers/vectors-helper.js";
import { ALL_TRUE_CONVERTER } from "./input-interactions.js";
import { InputModifier, Modifier } from "./input-modifiers.js";

export interface InputConverter<TInput, TOutput> {
    execute(value: TInput): TOutput;
}

export class AdvancedInputConverter<TInput, TOutput> implements InputConverter<TInput, TOutput> {
    private _converter: InputConverter<TInput, TOutput>;
    private _modifiers: InputModifier<TInput>[] = [];

    constructor(converter: InputConverter<TInput, TOutput> | ((value: TInput) => TOutput)) {
        if (typeof converter === 'function') {
            converter = { execute: converter };
        }
        this._converter = converter;
    }

    public execute(value: TInput): TOutput {
        for (let i = 0; i < this._modifiers.length; i++) {
            value = this._modifiers[i].execute(value);
        }
        return this._converter.execute(value);
    }

    public addPreConverterModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TInput>>>(modifier: T, ...args: Parameters<typeof Modifier[T]>): this;
    public addPreConverterModifier(modifier: InputModifier<TInput> | ((value: TInput) => TInput)): this;
    public addPreConverterModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TInput>>>(
        modifier: InputModifier<TInput> | ((value: TInput) => TInput) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): this {
        this._modifiers ??= [];
        if (typeof modifier === 'string') {
            modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TInput>;
        } else if (typeof modifier === 'function') {
            modifier = { execute: modifier };
        }
        this._modifiers.push(modifier);
        return this;
    }

    public removePreConverterModifier(index: number): boolean {
        if (this._modifiers?.[index]) {
            removeAtIndex(this._modifiers, index);
            return true;
        }
        return false;
    }

    public getPreConverterModifier<T extends InputModifier<TInput>>(index: number): T | null {
        return this._modifiers?.[index] as T ?? null;
    }

    replacePreConverterModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TInput>>>(
        index: number, modifier: T, ...args: Parameters<typeof Modifier[T]>): boolean;
    replacePreConverterModifier(index: number, modifier: InputModifier<TInput> | ((value: TInput) => TInput)): boolean;
    public replacePreConverterModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TInput>>>(
        index: number, modifier: InputModifier<TInput> | ((value: TInput) => TInput) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): boolean {
        if (this._modifiers?.[index]) {
            if (typeof modifier === 'string') {
                modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TInput>;
            } else if (typeof modifier === 'function') {
                modifier = { execute: modifier };
            }
            this._modifiers[index] = modifier;
            return true;
        }
        return false;
    }
}

export const TO_TRUE: InputConverter<unknown, boolean> = {
    execute: function (): boolean { return true; }
};
export const TO_FALSE: InputConverter<unknown, boolean> = {
    execute: function (): boolean { return false; }
};

// Comparison
export abstract class ComparisonConverter<T> implements InputConverter<T, boolean> {
    public value: T;
    public constructor(value: T) {
        this.value = value;
    }
    public abstract execute(value: T): boolean;
}

export class EqualConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value === this.value;
    }
}

export class NotEqualConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value !== this.value;
    }
}

export class GreaterThanConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value > this.value;
    }
}

export class LessThanConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value < this.value;
    }
}

export class GreaterThanOrEqualConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value >= this.value;
    }
}

export class LessThanOrEqualConverter extends ComparisonConverter<number> {
    public execute(value: number): boolean {
        return value <= this.value;
    }
}

export const NUMBERS_TO_AXIS_CONVERTER: InputConverter<[number | boolean, number | boolean], number> = {
    execute(values: [number | boolean, number | boolean]): number {
        return (values[1] as number) - (values[0] as number);
    }
};

export class Vector2CompositeConverter implements InputConverter<[number | boolean, number | boolean, number | boolean, number | boolean], Vector2> {
    private _cachedValues!: Vector2;

    public execute(values: [number | boolean, number | boolean, number | boolean, number | boolean]): Vector2 {
        this._cachedValues ??= new Vector2;
        this._cachedValues.x = (values[1] as number) - (values[0] as number);
        this._cachedValues.y = (values[3] as number) - (values[2] as number);
        return this._cachedValues;
    }
}

export const VECTOR_TO_MAGNITUDE_CONVERTER: InputConverter<ArrayLike<number>, number> = {
    execute(value: ArrayLike<number>): number {
        let squaredMagnitude = 0;
        for (let i = 0; i < value.length; i++) {
            squaredMagnitude += value[i] * value[i];
        }
        return squaredMagnitude === 0
            ? squaredMagnitude
            : Math.sqrt(squaredMagnitude);
    }
};

export class ArrayToVector2 implements InputConverter<[number | boolean, number | boolean], Vector2> {
    private _cachedValues!: Vector2;

    public execute(values: [number | boolean, number | boolean]): Vector2 {
        this._cachedValues ??= new Vector2;
        this._cachedValues.x = values[0] as number;
        this._cachedValues.y = values[1] as number;
        return this._cachedValues;
    }
}
export class ArrayToVector3 implements InputConverter<[number | boolean, number | boolean, number | boolean], Vector3> {
    private _cachedValues!: Vector3;

    public execute(values: [number | boolean, number | boolean, number | boolean]): Vector3 {
        this._cachedValues ??= new Vector3;
        this._cachedValues.x = values[0] as number;
        this._cachedValues.y = values[1] as number;
        this._cachedValues.z = values[2] as number;
        return this._cachedValues;
    }
}

export class DistanceLessThanOrEqualConverter<T extends [Vector3, Vector3]> implements InputConverter<T, boolean> {
    public minDistance: number;
    public firstIndex: number;
    public secondIndex: number;
    private _cachedVector!: Float32Array;

    constructor(minDistance: number, firstIndex = 0, secondIndex = 1) {
        this.minDistance = minDistance;
        this.firstIndex = firstIndex;
        this.secondIndex = secondIndex;
    }

    public execute(values: T): boolean {
        this._cachedVector ??= new Float32Array(3);
        this._cachedVector[0] = values[this.firstIndex].x - values[this.secondIndex].x;
        this._cachedVector[1] = values[this.firstIndex].y - values[this.secondIndex].y;
        this._cachedVector[2] = values[this.firstIndex].z - values[this.secondIndex].z;
        return this._cachedVector[0] * this._cachedVector[0] +
            this._cachedVector[1] * this._cachedVector[1] +
            this._cachedVector[2] * this._cachedVector[2] <= this.minDistance * this.minDistance;
    }
}
export class DistanceGreaterThanOrEqualConverter<T extends [Vector3, Vector3]> implements InputConverter<T, boolean> {
    public maxDistance: number;
    public firstIndex: number;
    public secondIndex: number;
    private _cachedVector!: Float32Array;

    constructor(maxDistance: number, firstIndex = 0, secondIndex = 1) {
        this.maxDistance = maxDistance;
        this.firstIndex = firstIndex;
        this.secondIndex = secondIndex;
    }

    public execute(values: T): boolean {
        this._cachedVector ??= new Float32Array(3);
        this._cachedVector[0] = values[this.firstIndex].x - values[this.secondIndex].x;
        this._cachedVector[1] = values[this.firstIndex].y - values[this.secondIndex].y;
        this._cachedVector[2] = values[this.firstIndex].z - values[this.secondIndex].z;
        return this._cachedVector[0] * this._cachedVector[0] +
            this._cachedVector[1] * this._cachedVector[1] +
            this._cachedVector[2] * this._cachedVector[2] >= this.maxDistance * this.maxDistance;
    }
}

export const Converter = {
    true: (): InputConverter<unknown, boolean> => TO_TRUE,
    false: (): InputConverter<unknown, boolean> => TO_FALSE,

    concurrent: (): InputConverter<ArrayLike<boolean>, boolean> => ALL_TRUE_CONVERTER,

    equal: (value: number): InputConverter<number, boolean> => new EqualConverter(value),
    notEqual: (value: number): InputConverter<number, boolean> => new NotEqualConverter(value),

    greather: (value: number): InputConverter<number, boolean> => new GreaterThanConverter(value),
    greatherOrEqual: (value: number): InputConverter<number, boolean> => new GreaterThanOrEqualConverter(value),
    less: (value: number): InputConverter<number, boolean> => new LessThanConverter(value),
    lessOrEqual: (value: number): InputConverter<number, boolean> => new LessThanOrEqualConverter(value),

    compositeAxis: (): InputConverter<[number | boolean, number | boolean], number> => NUMBERS_TO_AXIS_CONVERTER,
    compositeVector2: (): InputConverter<[number | boolean, number | boolean, number | boolean, number | boolean], Vector2> => new Vector2CompositeConverter(),

    magnitude: (): InputConverter<ArrayLike<number>, number> => VECTOR_TO_MAGNITUDE_CONVERTER,

    Vector2: (): InputConverter<[number | boolean, number | boolean], Vector2> => new ArrayToVector2(),
    Vector3: (): InputConverter<[number | boolean, number | boolean, number | boolean], Vector3> => new ArrayToVector3(),

    greatherOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputConverter<[Vector3, Vector3], boolean> => new DistanceGreaterThanOrEqualConverter(minDistance, firstIndex, secondIndex),
    lessOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputConverter<[Vector3, Vector3], boolean> => new DistanceLessThanOrEqualConverter(minDistance, firstIndex, secondIndex),
} as const;
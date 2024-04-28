import { removeAtIndex } from "./helpers/array-helper.js";
import { KeyOfExtendsType, Primitive, RecursiveArrayLike, Widen, assertObjectOfType } from "./helpers/type-helpers.js";
import { Vector3 } from "./helpers/vectors-helper.js";
import { Converter, DistanceGreaterThanOrEqualConverter, DistanceLessThanOrEqualConverter, EqualConverter, InputConverter, NotEqualConverter, GreaterThanConverter, GreaterThanOrEqualConverter, LessThanConverter, LessThanOrEqualConverter, TO_FALSE, TO_TRUE } from "./input-converters.js";
import { ALL_TRUE_CONVERTER, HoldTrigger, MultiTapTrigger, SequenceCompositeInteraction, TapTrigger } from "./input-interactions.js";
import { InputModifier, Modifier, TOGGLE_MODIFIER } from "./input-modifiers.js";

export interface InputTrigger<T> {
    reset?(): void;
    execute(value: T, deltaTime?: number): boolean;
}

export class DefaultPrimitiveTriggerInputConverter<T extends Primitive> implements InputTrigger<T> {
    private readonly _defaultValue: T;

    public constructor(defaultValue: T) {
        this._defaultValue = defaultValue;
    }

    public execute(value: T): boolean {
        return value !== this._defaultValue;
    }
}

export class DefaultTriggerInputConverter<T extends RecursiveArrayLike<Primitive>> implements InputTrigger<T> {
    private readonly _defaultValue: T;

    public constructor(defaultValue: T) {
        this._defaultValue = defaultValue;
    }

    public execute(value: T): boolean {
        return !this._equals(value, this._defaultValue);
    }

    private _equals<T extends Primitive | RecursiveArrayLike<Primitive>>(value: T, defaultValue: T): boolean {
        if (assertObjectOfType<RecursiveArrayLike<Primitive>>(value)) {
            for (let i = 0; i < value.length; i++) {
                if (!this._equals(value[i], (defaultValue as RecursiveArrayLike<Primitive>)[i])) {
                    return false;
                }
            }
            return true;
        }
        return value === defaultValue;
    }
}

class BaseAdvancedInputTrigger<TValue, TTrigger> implements InputTrigger<TValue> {
    private _converter: InputConverter<TValue, TTrigger> | null = null;
    private _modifiers: InputModifier<TTrigger>[] | null = null;
    private _trigger!: InputTrigger<TTrigger>;
    public reset?: () => void;

    public constructor(arg0: InputTrigger<TTrigger> | InputConverter<TValue, TTrigger>, arg1?: InputTrigger<TTrigger>) {
        if (arg1) {
            this._converter = arg0 as InputConverter<TValue, TTrigger>;
            this._trigger = arg1;
        } else {
            this._trigger = arg0 as InputTrigger<TTrigger>;
        }
        this.reset = this._trigger.reset;
    }

    public execute(value: TValue, deltaTime: number): boolean {
        let triggerValue = this._converter?.execute(value) ?? value as unknown as TTrigger;
        if (this._modifiers) {
            for (let i = 0; i < this._modifiers.length; i++) {
                triggerValue = this._modifiers[i].execute(triggerValue);
            }
        }
        return this._trigger.execute(triggerValue, deltaTime);
    }

    /* @internal */
    public setConverter(converter: unknown, ...args: unknown[]): this;
    public setConverter(converter: unknown, arg0?: unknown, arg1?: unknown, arg2?: unknown): this {
        if (typeof converter === 'string') {
            converter = Converter[converter as keyof typeof Converter](arg0 as number, arg1 as number | undefined, arg2 as number | undefined);
        } else if (typeof converter === 'function') {
            converter = { apply: converter };
        }
        this._converter = converter as InputConverter<TValue, TTrigger>;
        return this;
    }

    public addPreTriggerModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TTrigger>>>(
        modifier: InputModifier<TTrigger> | ((value: TTrigger) => TTrigger) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): this {
        this._modifiers ??= [];
        if (typeof modifier === 'string') {
            modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TTrigger>;
        } else if (typeof modifier === 'function') {
            modifier = { execute: modifier };
        }
        this._modifiers.push(modifier);
        return this;
    }

    public removePreTriggerModifier(index: number): boolean {
        if (this._modifiers?.[index]) {
            removeAtIndex(this._modifiers, index);
            return true;
        }
        return false;
    }

    public getPreTriggerModifier<T extends InputModifier<TTrigger>>(index: number): T | null {
        return this._modifiers?.[index] as T ?? null;
    }

    public replacePreTriggerModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TTrigger>>>(
        index: number, modifier: InputModifier<TTrigger> | ((value: TTrigger) => TTrigger) | T, arg0?: Parameters<typeof Modifier[T]>[0], arg1?: Parameters<typeof Modifier[T]>[1]): boolean {
        if (this._modifiers?.[index]) {
            if (typeof modifier === 'string') {
                modifier = Modifier[modifier](arg0!, arg1!) as InputModifier<TTrigger>;
            } else if (typeof modifier === 'function') {
                modifier = { execute: modifier };
            }
            this._modifiers[index] = modifier;
            return true;
        }
        return false;
    }

    public setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TTrigger>>>(
        trigger: InputTrigger<TTrigger> | ((value: TTrigger, deltaTime?: number) => boolean) | T,
        arg0?: Parameters<typeof Trigger[T]>[0], arg1?: Parameters<typeof Trigger[T]>[1], arg2?: Parameters<typeof Trigger[T]>[2]): this {
        if (typeof trigger === 'string') {
            trigger = Trigger[trigger](arg0 as number, arg1 as number | undefined, arg2 as number | undefined) as InputTrigger<TTrigger>;
            trigger.reset?.();
        } else if (typeof trigger === 'function') {
            trigger = { execute: trigger } as InputTrigger<TTrigger>;
        } else {
            trigger.reset?.();
        }
        this._trigger = trigger;
        return this;
    }

    public getTrigger<T extends InputTrigger<TTrigger>>(): T | null {
        return this._trigger as T | null;
    }
}

export interface AdvancedInputTrigger<TValue, TTrigger> extends BaseAdvancedInputTrigger<TValue, TTrigger> {
    setConverter<T extends KeyOfExtendsType<typeof Converter, (...args: unknown[]) => InputConverter<TValue, TTrigger>>>(
        ...args: TTrigger extends TValue
            ? [converter: never]
            : TTrigger extends boolean
            ? [converter: InputConverter<TValue, boolean> | ((value: TValue) => boolean)] | [converter: T, ...args: Parameters<typeof Converter[T]>]
            : [converter: InputConverter<TValue, TTrigger> | ((value: TValue) => TTrigger)] | [converter: T, ...args: Parameters<typeof Converter[T]>]): this;
    addPreTriggerModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TTrigger>>>(
        modifier: T, ...args: Parameters<typeof Modifier[T]>): this;
    addPreTriggerModifier(modifier: InputModifier<TTrigger> | ((value: TTrigger) => TTrigger)): this;
    removePreTriggerModifier(index: number): boolean;
    getPreTriggerModifier<T extends InputModifier<TTrigger>>(index: number): T | null;
    replacePreTriggerModifier<T extends KeyOfExtendsType<typeof Modifier, (...args: unknown[]) => InputModifier<TValue>>>(
        index: number, modifier: T, ...args: Parameters<typeof Modifier[T]>): boolean;
    replacePreTriggerModifier(index: number, modifier: InputModifier<TValue> | ((value: TValue) => TValue)): boolean;

    setTrigger<T extends KeyOfExtendsType<typeof Trigger, (...args: unknown[]) => InputTrigger<TValue>>>(
        trigger: T, ...args: Parameters<typeof Trigger[T]>): this
    setTrigger(trigger: InputTrigger<TValue> | ((value: TValue, deltaTime?: number) => boolean)): this;
    getTrigger<T extends InputTrigger<TTrigger>>(): T | null;
}

export const AdvancedInputTrigger = BaseAdvancedInputTrigger as
    {
        new <TValue, TTrigger = TValue>(
            ...args: TTrigger extends TValue
                ? [trigger: InputTrigger<TValue>]
                : TTrigger extends boolean
                ? [converter: InputConverter<TValue, boolean> | ((value: TValue) => boolean), trigger: InputTrigger<boolean>]
                : [converter: InputConverter<TValue, Widen<TTrigger>> | ((value: TValue) => Widen<TTrigger>), trigger: InputTrigger<Widen<TTrigger>>]
        ): AdvancedInputTrigger<TValue, Widen<TTrigger>>
    };

export const Trigger = {
    always: (): InputTrigger<unknown> => TO_TRUE,
    never: (): InputTrigger<unknown> => TO_FALSE,

    toggle: (): InputTrigger<boolean> => TOGGLE_MODIFIER,

    equal: (value: number): InputTrigger<number> => new EqualConverter(value),
    notEqual: (value: number): InputTrigger<number> => new NotEqualConverter(value),

    greather: (value: number): InputTrigger<number> => new GreaterThanConverter(value),
    greatherOrEqual: (value: number): InputTrigger<number> => new GreaterThanOrEqualConverter(value),
    less: (value: number): InputTrigger<number> => new LessThanConverter(value),
    lessOrEqual: (value: number): InputTrigger<number> => new LessThanOrEqualConverter(value),

    greatherOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputTrigger<[Vector3, Vector3]> =>
        new DistanceGreaterThanOrEqualConverter(minDistance, firstIndex, secondIndex),
    lessOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputTrigger<[Vector3, Vector3]> =>
        new DistanceLessThanOrEqualConverter(minDistance, firstIndex, secondIndex),

    hold: (holdTime?: number): InputTrigger<boolean> => new HoldTrigger(holdTime),
    tap: (tapTime?: number): InputTrigger<boolean> => new TapTrigger(tapTime),
    multiTap: (tapTime?: number, delayTime?: number, tapCount?: number): InputTrigger<boolean> =>
        new MultiTapTrigger(tapTime, delayTime, tapCount),
    concurrent: (): InputTrigger<ArrayLike<boolean>> => ALL_TRUE_CONVERTER,
    sequence: (tapTime?: number, delayTime?: number): InputTrigger<ArrayLike<boolean>> =>
        new SequenceCompositeInteraction(tapTime, delayTime),
} as const;
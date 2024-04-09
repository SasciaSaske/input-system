import { InputController } from "./controllers/input-controller.js";
import { InputControl } from "./controls/input-controls.js";
import { Tuple } from "./helpers/type-helpers.js";
import { Vector3 } from "./helpers/vectors-helper.js";
import { DistanceGreaterThanOrEqualConverter, DistanceLessThanOrEqualConverter, EqualConverter, InputConverter, NotEqualConverter, GreaterThanConverter, GreaterThanOrEqualConverter, LessThanConverter, LessThanOrEqualConverter } from "./input-converters.js";
import { InputModifier } from "./input-modifiers.js";

export interface InputControlActivator<T> {
    check(control: InputControl<T>): boolean;
}

export interface InputCompositeControlActivator<T extends Tuple> {
    check(controls: Readonly<{ [K in keyof T]: InputControl<T[K]> }>): boolean;
}

export const TOGGLE_ACTIVATION_ACTIVATOR: InputControlActivator<unknown> = {
    check(control: InputControl<unknown>): boolean {
        return !control.isActivated();
    }
};

export const ALL_ACTIVE_COMPOSITE_ACTIVATOR: InputCompositeControlActivator<Tuple> = {
    check(controls: Readonly<Tuple<InputControl<unknown>>>): boolean {
        for (let i = 0; i < controls.length; i++) {
            if (!controls[i].isActivated()) {
                return false;
            }
        }
        return true;
    }
};

export class ControllerControlActivator implements InputControlActivator<unknown> {
    private _controller: InputController;
    public constructor(controller: InputController) {
        this._controller = controller;
    }
    public check(control: InputControl<unknown>): boolean {
        return control.isActivated() && control.getController() === this._controller;
    }
}

export class ConverterToControlActivator<T> implements InputConverter<T, boolean>, InputControlActivator<T> {
    private readonly _converter: InputConverter<T, boolean>;
    private _value!: boolean;

    public constructor(converter: InputConverter<T, boolean>) {
        this._converter = converter;
    }

    apply(): boolean {
        return this._value;
    }

    public check(control: InputControl<T>): boolean {
        this._value = this._converter.apply(control.readValue());
        return this._value;
    }
}

export class ConverterToCompositeControlActivator<T extends Tuple> implements InputConverter<T, boolean>, InputCompositeControlActivator<T> {
    private readonly _converter: InputConverter<T, boolean>;
    private _cachedValued!: T;
    private _value!: boolean;

    public constructor(converter: InputConverter<T, boolean>) {
        this._converter = converter;
    }

    apply(): boolean {
        return this._value;
    }

    public check(controls: Readonly<{ [K in keyof T]: InputControl<T[K]> }>): boolean {
        this._cachedValued ??= new Array(controls.length) as T;
        for (let i = 0; i < controls.length; i++) {
            this._cachedValued[i] = controls[i].readValue();
        }
        this._value = this._converter.apply(this._cachedValued);
        return this._value;
    }
}

export class ModifierToControlActivator implements InputModifier<boolean>, InputControlActivator<boolean> {
    private readonly _modifier: InputModifier<boolean>;
    private _value!: boolean;

    public constructor(modifier: InputModifier<boolean>) {
        this._modifier = modifier;
    }

    apply(): boolean {
        return this._value;
    }

    public check(control: InputControl<boolean>): boolean {
        this._value = this._modifier.apply(control.readValue());
        return this._value;
    }
}

export const ControlActivator = {
    controller: (controller: InputController): InputControlActivator<unknown> => new ControllerControlActivator(controller),

    toggle: (): InputControlActivator<unknown> => TOGGLE_ACTIVATION_ACTIVATOR,

    equal: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new EqualConverter(value)),
    notEqual: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new NotEqualConverter(value)),

    greather: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new GreaterThanConverter(value)),
    greatherOrEqual: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new GreaterThanOrEqualConverter(value)),
    less: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new LessThanConverter(value)),
    lessOrEqual: (value: number): InputControlActivator<number> => new ConverterToControlActivator(new LessThanOrEqualConverter(value)),
} as const;

export const CompositeControlActivator = {
    concurrent: (): InputCompositeControlActivator<Tuple<boolean>> => ALL_ACTIVE_COMPOSITE_ACTIVATOR,
    greatherOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputCompositeControlActivator<[Vector3, Vector3]> =>
        new ConverterToCompositeControlActivator(new DistanceGreaterThanOrEqualConverter(minDistance, firstIndex, secondIndex)),
    lessOrEqualDistance: (minDistance: number, firstIndex?: number, secondIndex?: number): InputCompositeControlActivator<[Vector3, Vector3]> =>
        new ConverterToCompositeControlActivator(new DistanceLessThanOrEqualConverter(minDistance, firstIndex, secondIndex)),
} as const;
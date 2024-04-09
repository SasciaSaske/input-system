import { InputController } from '../controllers/input-controller.js';
import { ReadonlyVector2, ReadonlyVector3, ReadonlyVector4, Vector2, Vector3, Vector4 } from "../helpers/vectors-helper.js";
import { BooleanControl, NumberControl, Vector2Control, Vector3Control, Vector4Control } from './input-controls.js';

export const BASE_DUMMY_CONTROL = {
    getController: function <ControllerT extends InputController>(): ControllerT | null {
        return null;
    },
    getPath: function (): string {
        return '';
    },
    isState: function (): boolean {
        return false;
    },
    isActivated: function (): boolean {
        return false;
    }
};

export const DUMMY_BOOLEAN_CONTROL: BooleanControl = {
    ...BASE_DUMMY_CONTROL,
    readValue(): boolean { return false; }
};

export const DUMMY_NUMBER_CONTROL: NumberControl = {
    ...BASE_DUMMY_CONTROL,
    readValue(): number { return 0; }
};

const vec2Zero = new Vector2();
export const DUMMY_VECTOR_2_CONTROL: Vector2Control = {
    ...BASE_DUMMY_CONTROL,
    x: DUMMY_NUMBER_CONTROL,
    y: DUMMY_NUMBER_CONTROL,
    readValue(): ReadonlyVector2 { return vec2Zero; }
};
const vec3Zero = new Vector3();
export const DUMMY_VECTOR_3_CONTROL: Vector3Control = {
    ...BASE_DUMMY_CONTROL,
    x: DUMMY_NUMBER_CONTROL,
    y: DUMMY_NUMBER_CONTROL,
    z: DUMMY_NUMBER_CONTROL,
    readValue(): ReadonlyVector3 { return vec3Zero; }
};
const vec4Zero = new Vector4();
export const DUMMY_VECTOR_4_CONTROL: Vector4Control = {
    ...BASE_DUMMY_CONTROL,
    x: DUMMY_NUMBER_CONTROL,
    y: DUMMY_NUMBER_CONTROL,
    z: DUMMY_NUMBER_CONTROL,
    w: DUMMY_NUMBER_CONTROL,
    readValue(): ReadonlyVector4 { return vec4Zero; }
};

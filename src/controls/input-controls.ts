import { InputController } from '../controllers/input-controller.js';
import { ReadonlyVector2, ReadonlyVector3, ReadonlyVector4, Vector2, Vector3, Vector4 } from "../helpers/vectors-helper.js";

//#region Interfaces
export interface InputControl<T> {
    getController<ControllerT extends InputController>(): ControllerT | null;
    getPath(): string;
    isState(): boolean;
    isActivated(): boolean;
    readValue(): T;
}

export interface BooleanControl extends InputControl<boolean> {
    readValue(): boolean;
}

export interface NumberControl extends InputControl<number> {
    readValue(): number;
}

export interface Vector2Control extends InputControl<ReadonlyVector2> {
    get x(): NumberControl;
    get y(): NumberControl;
    readValue(): ReadonlyVector2;
}
export interface Vector3Control extends InputControl<ReadonlyVector3> {
    get x(): NumberControl;
    get y(): NumberControl;
    get z(): NumberControl;
}
export interface Vector4Control extends InputControl<ReadonlyVector4> {
    get x(): NumberControl;
    get y(): NumberControl;
    get z(): NumberControl;
    get w(): NumberControl;
}
//#endregion

export abstract class BaseInputControl<T> implements InputControl<T> {
    protected _controller: InputController;
    protected _path: string;
    protected _isState = false;

    public constructor(controller: InputController, name: string) {
        this._controller = controller;
        this._path = name;
    }

    public getController<ControllerT extends InputController>(): ControllerT | null {
        return this._controller as ControllerT;
    }

    public getPath(): string {
        return this._path;
    }

    public isState(): boolean {
        return this._isState;
    }

    public abstract isActivated(): boolean;

    public abstract readValue(): T;
}

export abstract class IndexInputControl<T> extends BaseInputControl<T> {
    protected _index: number;
    public constructor(controller: InputController, name: string, index: number) {
        super(controller, name);
        this._index = index;
    }
}

export abstract class BaseVector2Control extends BaseInputControl<ReadonlyVector2> {
    protected _value = new Vector2();
    public readonly x: NumberControl;
    public readonly y: NumberControl;

    public constructor(controller: InputController, name: string, x: NumberControl, y: NumberControl) {
        super(controller, name);
        this.x = x;
        this.y = y;
    }

    public readValue(): ReadonlyVector2 {
        this._value.x = this.x.readValue();
        this._value.y = this.y.readValue();
        return this._value;
    }
}

export class Vector2StateControl extends BaseVector2Control {
    protected override _isState = true;
    public isActivated(): boolean {
        return true;
    }
}

export class Vector2GenericControl extends BaseVector2Control {
    public isActivated(): boolean {
        return this.x.isActivated() || this.y.isActivated();
    }
}

export abstract class BaseVector3Control extends BaseInputControl<ReadonlyVector3> {
    protected _value = new Vector3();
    public readonly x: NumberControl;
    public readonly y: NumberControl;
    public readonly z: NumberControl;

    public constructor(controller: InputController, name: string, x: NumberControl, y: NumberControl, z: NumberControl) {
        super(controller, name);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public readValue(): ReadonlyVector3 {
        this._value.x = this.x.readValue();
        this._value.y = this.y.readValue();
        this._value.z = this.z.readValue();
        return this._value;
    }
}

export class Vector3StateControl extends BaseVector3Control {
    protected override _isState = true;
    public isActivated(): boolean {
        return true;
    }
}

export class Vector3GenericControl extends BaseVector3Control {
    public isActivated(): boolean {
        return this.x.isActivated() || this.y.isActivated() || this.z.isActivated();
    }
}

export abstract class BaseVector4Control extends BaseInputControl<ReadonlyVector4> {
    protected _value = new Vector4();
    public readonly x: NumberControl;
    public readonly y: NumberControl;
    public readonly z: NumberControl;
    public readonly w: NumberControl;

    public constructor(controller: InputController, name: string, x: NumberControl, y: NumberControl, z: NumberControl, w: NumberControl) {
        super(controller, name);
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public readValue(): ReadonlyVector4 {
        this._value.x = this.x.readValue();
        this._value.y = this.y.readValue();
        this._value.z = this.z.readValue();
        this._value.w = this.w.readValue();
        return this._value;
    }
}

export class Vector4StateControl extends BaseVector4Control {
    protected override _isState = true;
    public isActivated(): boolean {
        return true;
    }
}

export class Vector4GenericControl extends BaseVector4Control {
    public isActivated(): boolean {
        return this.x.isActivated() || this.y.isActivated() || this.z.isActivated() || this.w.isActivated();
    }
}
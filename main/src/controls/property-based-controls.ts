import { InputController } from "../controllers/input-controller.js";
import { KeyOfType } from "../helpers/type-helpers.js";
import { BaseInputControl, Vector2GenericControl, Vector2StateControl, Vector3GenericControl, Vector3StateControl, Vector4GenericControl, Vector4StateControl } from "./input-controls.js";

export abstract class BasePropertyControl<TObject, TKeyType> extends BaseInputControl<TKeyType> {
    protected _object: TObject;
    protected _key: KeyOfType<TObject, TKeyType>;
    public constructor(controller: InputController, name: string, object: TObject, key: KeyOfType<TObject, TKeyType>) {
        super(controller, name);
        this._object = object;
        this._key = key;
    }
    public readValue(): TKeyType {
        return this._object[this._key] as TKeyType;
    }
}

export class PropertyStateControl<TObject, TKey> extends BasePropertyControl<TObject, TKey> {
    protected override _isState = true;
    public isActivated(): boolean {
        return true;
    }
}

export class PropertyNumberControl<T> extends BasePropertyControl<T, number> {
    public isActivated(): boolean {
        return this.readValue() !== 0;
    }
}
export class PropertyDeadZoneNumberControl<T> extends BasePropertyControl<T, number> {
    private _deadZone: number;
    public constructor(controller: InputController, name: string, object: T, key: KeyOfType<T, number>, deadZone: number) {
        super(controller, name, object, key);
        this._deadZone = Math.abs(deadZone);
    }
    public isActivated(): boolean {
        const value = this.readValue();
        return value > this._deadZone || value < -this._deadZone;
    }
}

export class PropertyVector2StateControl<T> extends Vector2StateControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyStateControl<T, number>(controller, name + '/x', data, keyX),
            new PropertyStateControl<T, number>(controller, name + '/y', data, keyY));
    }
}
export class PropertyVector3StateControl<T> extends Vector3StateControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>, keyZ: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyStateControl<T, number>(controller, name + '/x', data, keyX),
            new PropertyStateControl<T, number>(controller, name + '/y', data, keyY),
            new PropertyStateControl<T, number>(controller, name + '/z', data, keyZ));
    }
}
export class PropertyVector4StateControl<T> extends Vector4StateControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>, keyZ: KeyOfType<T, number>, keyW: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyStateControl<T, number>(controller, name + '/x', data, keyX),
            new PropertyStateControl<T, number>(controller, name + '/y', data, keyY),
            new PropertyStateControl<T, number>(controller, name + '/z', data, keyZ),
            new PropertyStateControl<T, number>(controller, name + '/w', data, keyW));
    }
}

export class PropertyVector2Control<T> extends Vector2GenericControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyNumberControl<T>(controller, name + '/x', data, keyX),
            new PropertyNumberControl<T>(controller, name + '/y', data, keyY));
    }
}
export class PropertyVector3Control<T> extends Vector3GenericControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>, keyZ: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyNumberControl<T>(controller, name + '/x', data, keyX),
            new PropertyNumberControl<T>(controller, name + '/y', data, keyY),
            new PropertyNumberControl<T>(controller, name + '/z', data, keyZ));
    }
}
export class PropertyVector4Control<T> extends Vector4GenericControl {
    public constructor(controller: InputController, name: string, data: T, keyX: KeyOfType<T, number>, keyY: KeyOfType<T, number>, keyZ: KeyOfType<T, number>, keyW: KeyOfType<T, number>) {
        super(controller, name,
            new PropertyNumberControl<T>(controller, name + '/x', data, keyX),
            new PropertyNumberControl<T>(controller, name + '/y', data, keyY),
            new PropertyNumberControl<T>(controller, name + '/z', data, keyZ),
            new PropertyNumberControl<T>(controller, name + '/w', data, keyW));
    }
}
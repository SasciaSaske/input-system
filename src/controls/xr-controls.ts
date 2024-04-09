import { XRScreenController } from "../controllers/xr/xr-screen-controller.js";
import { XRPoseData, XRPointerPoseData, XRSpacePoseData, XRViewerPoseData } from "../controllers/xr/pose-data.js";
import { XRController } from "../controllers/xr/xr-controller.js";
import { NativeXRHandController } from "../controllers/xr/native-xr-hand-controller.js";
import { BaseInputControl, IndexInputControl, InputControl, Vector3Control, Vector3GenericControl, Vector3StateControl, Vector4Control, Vector4StateControl } from "./input-controls.js";
import { BASE_DUMMY_CONTROL, DUMMY_VECTOR_3_CONTROL, DUMMY_VECTOR_4_CONTROL } from './dummy-controls.js';
import { PropertyStateControl, PropertyDeadZoneNumberControl } from "./property-based-controls.js";

export interface JointControl extends InputControl<XRPose> {
    readonly position: Vector3Control;
    readonly rotation: Vector4Control;
}

export interface PoseControl extends InputControl<XRPose> {
    readonly position: Vector3Control;
    readonly rotation: Vector4Control;
    readonly linearVelocity: Vector3Control;
    readonly angularVelocity: Vector3Control;
}

export interface ViewControl extends InputControl<XRView> {
    readonly eye: 'left' | 'right';
    readonly position: Vector3Control;
    readonly rotation: Vector4Control;
}
export interface XRPointerControl extends InputControl<boolean> {
    readonly origin: Vector3Control;
    readonly direction: Vector4Control;
}
export interface ARPointerControl extends XRPointerControl {
    readonly index: number;
}

export class BaseXRPoseControl<T extends XRPose = XRPose> extends BaseInputControl<T> {
    protected override _isState = true;
    protected _data: XRPoseData<T>;
    public readonly position: Vector3Control;
    public readonly rotation: Vector4Control;
    constructor(controller: XRController, name: string, data: XRPoseData<T>) {
        super(controller, name);
        this._data = data;
        this.position = new Vector3StateControl(controller, '/position',
            new PropertyStateControl(controller, '/x', data, 'positionX'),
            new PropertyStateControl(controller, '/y', data, 'positionY'),
            new PropertyStateControl(controller, '/z', data, 'positionZ'));
        this.rotation = new Vector4StateControl(controller, '/rotation',
            new PropertyStateControl(controller, '/x', data, 'rotationX'),
            new PropertyStateControl(controller, '/y', data, 'positionY'),
            new PropertyStateControl(controller, '/z', data, 'positionZ'),
            new PropertyStateControl(controller, '/w', data, 'rotationW'));
    }

    public isActivated(): boolean {
        return true;
    }

    public readValue(): T {
        return this._data.xrPose;
    }
}
export class XRPoseControl<T extends XRPose = XRPose> extends BaseXRPoseControl<T> {
    public readonly linearVelocity: Vector3Control;
    public readonly angularVelocity: Vector3Control;
    constructor(controller: XRController, name: string, data: XRPoseData<T>) {
        super(controller, name, data);
        this._data = data;
        this.linearVelocity = new Vector3GenericControl(controller, '/linearVelocity',
            new PropertyDeadZoneNumberControl(controller, '/x', data, 'linearVelocityX', 0.005),
            new PropertyDeadZoneNumberControl(controller, '/y', data, 'linearVelocityY', 0.005),
            new PropertyDeadZoneNumberControl(controller, '/z', data, 'linearVelocityZ', 0.005));
        this.angularVelocity = new Vector3GenericControl(controller, '/angularVelocity',
            new PropertyDeadZoneNumberControl(controller, '/x', data, 'angularVelocityX', 0.05),
            new PropertyDeadZoneNumberControl(controller, '/y', data, 'angularVelocityY', 0.05),
            new PropertyDeadZoneNumberControl(controller, '/z', data, 'angularVelocityZ', 0.05));
    }
}

export class XRJointControl extends BaseXRPoseControl {
    public constructor(controller: NativeXRHandController, name: string) {
        super(controller, name, new XRSpacePoseData(controller.inputManager.xr.native.context));
    }

    public updateSpace(jointSpace: XRJointSpace): void {
        (this._data as XRSpacePoseData).setSpace(jointSpace);
    }

    public update(): void {
        this._data.update();
    }
}

export class XRViewControl extends BaseInputControl<XRView> implements ViewControl {
    protected override _isState = true;
    protected _data: XRViewerPoseData;
    public readonly eye: 'left' | 'right';
    public readonly position: Vector3Control;
    public readonly rotation: Vector4Control;
    constructor(controller: XRController, name: string, data: XRViewerPoseData, eye: 'left' | 'right') {
        super(controller, name);
        this._data = data;
        this.eye = eye;
        if (eye === 'left') {
            this.position = new Vector3StateControl(controller, '/position',
                new PropertyStateControl(controller, '/x', data, 'leftViewPositionX'),
                new PropertyStateControl(controller, '/y', data, 'leftViewPositionY'),
                new PropertyStateControl(controller, '/z', data, 'leftViewPositionZ'));
            this.rotation = new Vector4StateControl(controller, '/rotation',
                new PropertyStateControl(controller, '/x', data, 'leftViewRotationX'),
                new PropertyStateControl(controller, '/y', data, 'leftViewRotationY'),
                new PropertyStateControl(controller, '/z', data, 'leftViewRotationZ'),
                new PropertyStateControl(controller, '/w', data, 'leftViewRotationW'));
        } else {
            this.position = new Vector3StateControl(controller, '/position',
                new PropertyStateControl(controller, '/x', data, 'rightViewPositionX'),
                new PropertyStateControl(controller, '/y', data, 'rightViewPositionY'),
                new PropertyStateControl(controller, '/z', data, 'rightViewPositionZ'));
            this.rotation = new Vector4StateControl(controller, '/rotation',
                new PropertyStateControl(controller, '/x', data, 'rightViewRotationX'),
                new PropertyStateControl(controller, '/y', data, 'rightViewRotationY'),
                new PropertyStateControl(controller, '/z', data, 'rightViewRotationZ'),
                new PropertyStateControl(controller, '/w', data, 'rightViewRotationW'));
        }
    }

    public isActivated(): boolean {
        return true;
    }

    public readValue(): XRView {
        return this.eye === 'left' ? this._data.leftView : this._data.rightView;
    }
}

export class UpdatableXRPointerControl extends IndexInputControl<boolean> implements ARPointerControl {
    private _data: XRPointerPoseData;
    public readonly origin: Vector3Control;
    public readonly direction: Vector4Control;

    public get inputSource(): XRInputSource | null {
        return this._data.inputSource;
    }

    public set inputSource(value: XRInputSource | null) {
        this._data.inputSource = value;
    }

    get index(): number {
        return this._index;
    }

    public constructor(controller: XRScreenController, name: string, index: number) {
        super(controller, name, index);
        this._data = new XRPointerPoseData(controller.inputManager.xr.native.context);
        this.origin = new Vector3StateControl(controller, '/origin',
            new PropertyStateControl(controller, '/x', this._data, 'positionX'),
            new PropertyStateControl(controller, '/y', this._data, 'positionY'),
            new PropertyStateControl(controller, '/z', this._data, 'positionZ'));

        this.direction = new Vector4StateControl(controller, '/origin',
            new PropertyStateControl(controller, '/x', this._data, 'rotationX'),
            new PropertyStateControl(controller, '/y', this._data, 'rotationY'),
            new PropertyStateControl(controller, '/z', this._data, 'rotationZ'),
            new PropertyStateControl(controller, '/w', this._data, 'rotationW'));
    }

    public isActivated(): boolean {
        return this._data.inputSource !== null;
    }

    public readValue(): boolean {
        return this._data.inputSource !== null;
    }

    public update(): void {
        this._data.update();
    }
}

export const DUMMY_XR_POINTER_CONTROL: XRPointerControl = {
    ...BASE_DUMMY_CONTROL,
    origin: DUMMY_VECTOR_3_CONTROL,
    direction: DUMMY_VECTOR_4_CONTROL,
    readValue: function (): boolean { return false; }
};

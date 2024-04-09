import { XRContext } from "../../controller-managers/native/xr/xr-context.js";

interface XRPoseWithVelocity extends XRPose {
    readonly linearVelocity: DOMPointReadOnly;
    readonly angularVelocity: DOMPointReadOnly;
}

export abstract class XRPoseData<T extends XRPose = XRPose> {
    protected _context: XRContext;
    protected _pose!: T | null;

    public abstract get xrPose(): T;

    public constructor(xrContext: XRContext) {
        this._context = xrContext;
    }

    public get positionX(): number {
        return this.xrPose.transform.position.x;
    }
    public get positionY(): number {
        return this.xrPose.transform.position.y;
    }
    public get positionZ(): number {
        return this.xrPose.transform.position.z;
    }

    public get rotationX(): number {
        return this.xrPose.transform.orientation.x;
    }
    public get rotationY(): number {
        return this.xrPose.transform.orientation.y;
    }
    public get rotationZ(): number {
        return this.xrPose.transform.orientation.z;
    }
    public get rotationW(): number {
        return this.xrPose.transform.orientation.w;
    }

    public get linearVelocityX(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).linearVelocity?.x ?? 0;
    }
    public get linearVelocityY(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).linearVelocity?.y ?? 0;
    }
    public get linearVelocityZ(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).linearVelocity?.z ?? 0;
    }

    public get angularVelocityX(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).angularVelocity?.x ?? 0;
    }
    public get angularVelocityY(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).angularVelocity?.y ?? 0;
    }
    public get angularVelocityZ(): number {
        return (this.xrPose as unknown as XRPoseWithVelocity).angularVelocity?.z ?? 0;
    }

    public update(): void {
        this._pose = null;
    }
}

export class XRSpacePoseData extends XRPoseData {
    private _space!: XRSpace;

    public setSpace(space: XRSpace): void {
        this._space = space;
    }

    public get xrPose(): XRPose {
        this._pose ??= this._context.frame!.getPose(this._space, this._context.referenceSpace!)!;
        return this._pose;
    }
}

export class XRPointerPoseData extends XRPoseData {
    public inputSource: XRInputSource | null = null;

    public get xrPose(): XRPose {
        this._pose ??= this.inputSource
            ? this._context.frame!.getPose(this.inputSource.targetRaySpace, this._context.referenceSpace!)!
            : this._context.frame!.getViewerPose(this._context.referenceSpace!)!;
        return this._pose;
    }
}

export class XRViewerPoseData extends XRPoseData<XRViewerPose> {
    public get xrPose(): XRViewerPose {
        this._pose ??= this._context.frame!.getViewerPose(this._context.referenceSpace!)!;
        return this._pose;
    }

    public setPose(pose: XRViewerPose): void {
        this._pose = pose;
    }

    public get leftView(): XRView {
        return this.xrPose.views[0];
    }

    public get leftViewPositionX(): number {
        return this.leftView.transform.position.x;
    }
    public get leftViewPositionY(): number {
        return this.leftView.transform.position.y;
    }
    public get leftViewPositionZ(): number {
        return this.leftView.transform.position.z;
    }

    public get leftViewRotationX(): number {
        return this.leftView.transform.orientation.x;
    }
    public get leftViewRotationY(): number {
        return this.leftView.transform.orientation.y;
    }
    public get leftViewRotationZ(): number {
        return this.leftView.transform.orientation.z;
    }
    public get leftViewRotationW(): number {
        return this.leftView.transform.orientation.w;
    }

    public get rightView(): XRView {
        return this.xrPose.views[1];
    }

    public get rightViewPositionX(): number {
        return this.rightView.transform.position.x;
    }
    public get rightViewPositionY(): number {
        return this.rightView.transform.position.y;
    }
    public get rightViewPositionZ(): number {
        return this.rightView.transform.position.z;
    }

    public get rightViewRotationX(): number {
        return this.rightView.transform.orientation.x;
    }
    public get rightViewRotationY(): number {
        return this.rightView.transform.orientation.y;
    }
    public get rightViewRotationZ(): number {
        return this.rightView.transform.orientation.z;
    }
    public get rightViewRotationW(): number {
        return this.rightView.transform.orientation.w;
    }
}
import { BooleanControl } from "../../controls/input-controls.js";
import { UpdatableButtonControl } from "../../controls/mouse-keyboard-controls.js";
import { PoseControl, ViewControl, XRPoseControl, XRViewControl } from "../../controls/xr-controls.js";
import { InputManager } from "../../input-manager.js";
import { XRViewerPoseData } from "./pose-data.js";
import { XRHeadController } from "./xr-head-controller.js";

export class NativeXRHeadController extends XRHeadController {
    private readonly _viewerPoseData: XRViewerPoseData;

    public readonly pose: PoseControl;
    public readonly leftEye: ViewControl;
    public readonly rightEye: ViewControl;

    public readonly select: BooleanControl;

    private readonly _onSelectDown = (event: XRInputSourceEvent): void => {
        if (event.inputSource.targetRayMode === 'gaze') {
            (this.select as UpdatableButtonControl).updateValue(true);
        }
    };
    private readonly _onSelectUp = (event: XRInputSourceEvent): void => {
        if (event.inputSource.targetRayMode === 'gaze') {
            (this.select as UpdatableButtonControl).updateValue(false);
        }
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._viewerPoseData = new XRViewerPoseData(inputManager.xr.native.context);

        this.pose = new XRPoseControl(this, 'pose', this._viewerPoseData);
        this.leftEye = new XRViewControl(this, 'leftEye', this._viewerPoseData, 'left');
        this.rightEye = new XRViewControl(this, 'leftEye', this._viewerPoseData, 'right');

        this.select = new UpdatableButtonControl(this, 'button');
    }

    public init(pose: XRViewerPose): void {
        this._viewerPoseData.setPose(pose);
        (this.select as UpdatableButtonControl).updateValue(false);

        this._inputManager.xr.native.context.session!.addEventListener('selectstart', this._onSelectDown);
        this._inputManager.xr.native.context.session!.addEventListener('selectend', this._onSelectUp);
    }

    protected override _update(): void {
        this._viewerPoseData.update();
    }

    protected override _activationCheck(): boolean {
        return this.select.isActivated();
    }

    protected override _onDisconnect(): void {
        this._inputManager.xr.native.context.session?.removeEventListener('selectstart', this._onSelectDown);
        this._inputManager.xr.native.context.session?.removeEventListener('selectend', this._onSelectUp);
    }
}
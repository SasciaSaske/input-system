import { JointControl, PoseControl, XRJointControl, XRPoseControl } from "../../controls/xr-controls.js";
import { KeyOfType } from "../../helpers/type-helpers.js";
import { InputManager } from "../../input-manager.js";
import { XRSpacePoseData } from "./pose-data.js";
import { XRInputSourceController } from "./xr-controller.js";
import { XRHandController } from "./xr-hand-controller.js";

const XR_HAND_API_JOINTS: Array<XRHandJoint> = [
    "wrist",
    "thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip",
    "index-finger-metacarpal", "index-finger-phalanx-proximal", "index-finger-phalanx-intermediate", "index-finger-phalanx-distal", "index-finger-tip",
    "middle-finger-metacarpal", "middle-finger-phalanx-proximal", "middle-finger-phalanx-intermediate", "middle-finger-phalanx-distal", "middle-finger-tip",
    "ring-finger-metacarpal", "ring-finger-phalanx-proximal", "ring-finger-phalanx-intermediate", "ring-finger-phalanx-distal", "ring-finger-tip",
    "pinky-finger-metacarpal", "pinky-finger-phalanx-proximal", "pinky-finger-phalanx-intermediate", "pinky-finger-phalanx-distal", "pinky-finger-tip"
];


export const XR_HAND_JOINTS: Array<KeyOfType<Omit<NativeXRHandController, 'pose'>, JointControl>> = [
    "wrist",
    "thumbMetacarpal", "thumbProximal", "thumbDistal", "thumbTip",
    "indexMetacarpal", "indexProximal", "indexMiddle", "indexDistal", "indexTip",
    "middleMetacarpal", "middleProximal", "middleMiddle", "middleDistal", "middleTip",
    "ringMetacarpal", "ringProximal", "ringMiddle", "ringDistal", "ringTip",
    "pinkyMetacarpal", "pinkyProximal", "pinkyMiddle", "pinkyDistal", "pinkyTip"
];

export class NativeXRHandController extends XRHandController implements XRInputSourceController {
    private _inputSource!: XRInputSource;
    private _poseData: XRSpacePoseData;

    public readonly wrist!: JointControl;

    public readonly thumbMetacarpal!: JointControl;
    public readonly thumbProximal!: JointControl;
    public readonly thumbDistal!: JointControl;
    public readonly thumbTip!: JointControl;

    public readonly indexMetacarpal!: JointControl;
    public readonly indexProximal!: JointControl;
    public readonly indexMiddle!: JointControl;
    public readonly indexTip!: JointControl;
    public readonly indexDistal!: JointControl;

    public readonly middleMetacarpal!: JointControl;
    public readonly middleProximal!: JointControl;
    public readonly middleMiddle!: JointControl;
    public readonly middleDistal!: JointControl;
    public readonly middleTip!: JointControl;

    public readonly ringMetacarpal!: JointControl;
    public readonly ringProximal!: JointControl;
    public readonly ringMiddle!: JointControl;
    public readonly ringDistal!: JointControl;
    public readonly ringTip!: JointControl;

    public readonly pinkyMetacarpal!: JointControl;
    public readonly pinkyProximal!: JointControl;
    public readonly pinkyMiddle!: JointControl;
    public readonly pinkyDistal!: JointControl;
    public readonly pinkyTip!: JointControl;

    public readonly pose: PoseControl;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._poseData = new XRSpacePoseData(inputManager.xr.native.context);

        for (let i = 0; i < 25; i++) {
            const name = XR_HAND_JOINTS[i];
            this[name] = new XRJointControl(this, name);
        }
        this.pose = new XRPoseControl(this, 'pose', this._poseData);
    }

    public get inputSource(): XRInputSource {
        return this._inputSource;
    }

    public get handedness(): XRHandedness {
        return this._inputSource.handedness;
    }

    public getJoint(index: number): JointControl {
        return this[XR_HAND_JOINTS[index]];
    }


    public init(inputSource: XRInputSource): void {
        this._inputSource = inputSource;
        this._poseData.setSpace(inputSource.gripSpace!);
        this._handeldManager.setHandedness(inputSource.handedness);

        for (let i = 0; i < 25; i++) {
            (this[XR_HAND_JOINTS[i]] as XRJointControl).updateSpace(this._inputSource.hand!.get(XR_HAND_API_JOINTS[i])!);
        }
    }

    protected override _update(): void {
        this._poseData.update();
        for (let i = 0; i < XR_HAND_JOINTS.length; i++) {
            (this[XR_HAND_JOINTS[i]] as XRJointControl).update();
        }
    }

    protected override _activationCheck(): boolean {
        return false;
    }
}
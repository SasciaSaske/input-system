import { XRHandedManagerWrapper } from "../../controller-managers/xr/xr-handed-manager-wrapper.js";
import { JointControl, PoseControl } from "../../controls/xr-controls.js";
import { ReadonlyVector3, ReadonlyVector4 } from "../../helpers/vectors-helper.js";
import { InputManager } from "../../input-manager.js";
import { InputPath } from "../../input-path.js";
import { InputController } from "../input-controller.js";
import { XRControlMap, XRHandedController } from "./xr-controller.js";
declare module "../input-maps.js" {
    export interface InputControllerMap {
        'xr-hand': XRHandControlMap;
        'left/xr-hand': XRHandControlMap;
        'right/xr-hand': XRHandControlMap;
    }

    export interface InputControlMap extends XRHandControlMap {
    }
}

export interface XRHandControlMap extends XRControlMap {
    'wrist': XRPose,
    'wrist/position': ReadonlyVector3,
    'wrist/position/x': number,
    'wrist/position/y': number,
    'wrist/position/z': number,
    'wrist/rotation': ReadonlyVector4,
    'wrist/rotation/x': number,
    'wrist/rotation/y': number,
    'wrist/rotation/z': number,
    'wrist/rotation/w': number,

    'thumbMetacarpal': XRPose,
    'thumbMetacarpal/position': ReadonlyVector3,
    'thumbMetacarpal/position/x': number,
    'thumbMetacarpal/position/y': number,
    'thumbMetacarpal/position/z': number,
    'thumbMetacarpal/rotation': ReadonlyVector4,
    'thumbMetacarpal/rotation/x': number,
    'thumbMetacarpal/rotation/y': number,
    'thumbMetacarpal/rotation/z': number,
    'thumbMetacarpal/rotation/w': number,

    'thumbProximal': XRPose,
    'thumbProximal/position': ReadonlyVector3,
    'thumbProximal/position/x': number,
    'thumbProximal/position/y': number,
    'thumbProximal/position/z': number,
    'thumbProximal/rotation': ReadonlyVector4,
    'thumbProximal/rotation/x': number,
    'thumbProximal/rotation/y': number,
    'thumbProximal/rotation/z': number,
    'thumbProximal/rotation/w': number,

    'thumbDistal': XRPose,
    'thumbDistal/position': ReadonlyVector3,
    'thumbDistal/position/x': number,
    'thumbDistal/position/y': number,
    'thumbDistal/position/z': number,
    'thumbDistal/rotation': ReadonlyVector4,
    'thumbDistal/rotation/x': number,
    'thumbDistal/rotation/y': number,
    'thumbDistal/rotation/z': number,
    'thumbDistal/rotation/w': number,

    'thumbTip': XRPose,
    'thumbTip/position': ReadonlyVector3,
    'thumbTip/position/x': number,
    'thumbTip/position/y': number,
    'thumbTip/position/z': number,
    'thumbTip/rotation': ReadonlyVector4,
    'thumbTip/rotation/x': number,
    'thumbTip/rotation/y': number,
    'thumbTip/rotation/z': number,
    'thumbTip/rotation/w': number,

    'indexMetacarpal': XRPose,
    'indexMetacarpal/position': ReadonlyVector3,
    'indexMetacarpal/position/x': number,
    'indexMetacarpal/position/y': number,
    'indexMetacarpal/position/z': number,
    'indexMetacarpal/rotation': ReadonlyVector4,
    'indexMetacarpal/rotation/x': number,
    'indexMetacarpal/rotation/y': number,
    'indexMetacarpal/rotation/z': number,
    'indexMetacarpal/rotation/w': number,

    'indexProximal': XRPose,
    'indexProximal/position': ReadonlyVector3,
    'indexProximal/position/x': number,
    'indexProximal/position/y': number,
    'indexProximal/position/z': number,
    'indexProximal/rotation': ReadonlyVector4,
    'indexProximal/rotation/x': number,
    'indexProximal/rotation/y': number,
    'indexProximal/rotation/z': number,
    'indexProximal/rotation/w': number,

    'indexMiddle': XRPose,
    'indexMiddle/position': ReadonlyVector3,
    'indexMiddle/position/x': number,
    'indexMiddle/position/y': number,
    'indexMiddle/position/z': number,
    'indexMiddle/rotation': ReadonlyVector4,
    'indexMiddle/rotation/x': number,
    'indexMiddle/rotation/y': number,
    'indexMiddle/rotation/z': number,
    'indexMiddle/rotation/w': number,

    'indexTip': XRPose,
    'indexTip/position': ReadonlyVector3,
    'indexTip/position/x': number,
    'indexTip/position/y': number,
    'indexTip/position/z': number,
    'indexTip/rotation': ReadonlyVector4,
    'indexTip/rotation/x': number,
    'indexTip/rotation/y': number,
    'indexTip/rotation/z': number,
    'indexTip/rotation/w': number,

    'indexDistal': XRPose,
    'indexDistal/position': ReadonlyVector3,
    'indexDistal/position/x': number,
    'indexDistal/position/y': number,
    'indexDistal/position/z': number,
    'indexDistal/rotation': ReadonlyVector4,
    'indexDistal/rotation/x': number,
    'indexDistal/rotation/y': number,
    'indexDistal/rotation/z': number,
    'indexDistal/rotation/w': number,

    'middleMetacarpal': XRPose,
    'middleMetacarpal/position': ReadonlyVector3,
    'middleMetacarpal/position/x': number,
    'middleMetacarpal/position/y': number,
    'middleMetacarpal/position/z': number,
    'middleMetacarpal/rotation': ReadonlyVector4,
    'middleMetacarpal/rotation/x': number,
    'middleMetacarpal/rotation/y': number,
    'middleMetacarpal/rotation/z': number,
    'middleMetacarpal/rotation/w': number,

    'middleProximal': XRPose,
    'middleProximal/position': ReadonlyVector3,
    'middleProximal/position/x': number,
    'middleProximal/position/y': number,
    'middleProximal/position/z': number,
    'middleProximal/rotation': ReadonlyVector4,
    'middleProximal/rotation/x': number,
    'middleProximal/rotation/y': number,
    'middleProximal/rotation/z': number,
    'middleProximal/rotation/w': number,

    'middleMiddle': XRPose,
    'middleMiddle/position': ReadonlyVector3,
    'middleMiddle/position/x': number,
    'middleMiddle/position/y': number,
    'middleMiddle/position/z': number,
    'middleMiddle/rotation': ReadonlyVector4,
    'middleMiddle/rotation/x': number,
    'middleMiddle/rotation/y': number,
    'middleMiddle/rotation/z': number,
    'middleMiddle/rotation/w': number,

    'middleDistal': XRPose,
    'middleDistal/position': ReadonlyVector3,
    'middleDistal/position/x': number,
    'middleDistal/position/y': number,
    'middleDistal/position/z': number,
    'middleDistal/rotation': ReadonlyVector4,
    'middleDistal/rotation/x': number,
    'middleDistal/rotation/y': number,
    'middleDistal/rotation/z': number,
    'middleDistal/rotation/w': number,

    'middleTip': XRPose,
    'middleTip/position': ReadonlyVector3,
    'middleTip/position/x': number,
    'middleTip/position/y': number,
    'middleTip/position/z': number,
    'middleTip/rotation': ReadonlyVector4,
    'middleTip/rotation/x': number,
    'middleTip/rotation/y': number,
    'middleTip/rotation/z': number,
    'middleTip/rotation/w': number,

    'ringMetacarpal': XRPose,
    'ringMetacarpal/position': ReadonlyVector3,
    'ringMetacarpal/position/x': number,
    'ringMetacarpal/position/y': number,
    'ringMetacarpal/position/z': number,
    'ringMetacarpal/rotation': ReadonlyVector4,
    'ringMetacarpal/rotation/x': number,
    'ringMetacarpal/rotation/y': number,
    'ringMetacarpal/rotation/z': number,
    'ringMetacarpal/rotation/w': number,

    'ringProximal': XRPose,
    'ringProximal/position': ReadonlyVector3,
    'ringProximal/position/x': number,
    'ringProximal/position/y': number,
    'ringProximal/position/z': number,
    'ringProximal/rotation': ReadonlyVector4,
    'ringProximal/rotation/x': number,
    'ringProximal/rotation/y': number,
    'ringProximal/rotation/z': number,
    'ringProximal/rotation/w': number,

    'ringMiddle': XRPose,
    'ringMiddle/position': ReadonlyVector3,
    'ringMiddle/position/x': number,
    'ringMiddle/position/y': number,
    'ringMiddle/position/z': number,
    'ringMiddle/rotation': ReadonlyVector4,
    'ringMiddle/rotation/x': number,
    'ringMiddle/rotation/y': number,
    'ringMiddle/rotation/z': number,
    'ringMiddle/rotation/w': number,

    'ringDistal': XRPose,
    'ringDistal/position': ReadonlyVector3,
    'ringDistal/position/x': number,
    'ringDistal/position/y': number,
    'ringDistal/position/z': number,
    'ringDistal/rotation': ReadonlyVector4,
    'ringDistal/rotation/x': number,
    'ringDistal/rotation/y': number,
    'ringDistal/rotation/z': number,
    'ringDistal/rotation/w': number,

    'ringTip': XRPose,
    'ringTip/position': ReadonlyVector3,
    'ringTip/position/x': number,
    'ringTip/position/y': number,
    'ringTip/position/z': number,
    'ringTip/rotation': ReadonlyVector4,
    'ringTip/rotation/x': number,
    'ringTip/rotation/y': number,
    'ringTip/rotation/z': number,
    'ringTip/rotation/w': number,

    'pinkyMetacarpal': XRPose,
    'pinkyMetacarpal/position': ReadonlyVector3,
    'pinkyMetacarpal/position/x': number,
    'pinkyMetacarpal/position/y': number,
    'pinkyMetacarpal/position/z': number,
    'pinkyMetacarpal/rotation': ReadonlyVector4,
    'pinkyMetacarpal/rotation/x': number,
    'pinkyMetacarpal/rotation/y': number,
    'pinkyMetacarpal/rotation/z': number,
    'pinkyMetacarpal/rotation/w': number,

    'pinkyProximal': XRPose,
    'pinkyProximal/position': ReadonlyVector3,
    'pinkyProximal/position/x': number,
    'pinkyProximal/position/y': number,
    'pinkyProximal/position/z': number,
    'pinkyProximal/rotation': ReadonlyVector4,
    'pinkyProximal/rotation/x': number,
    'pinkyProximal/rotation/y': number,
    'pinkyProximal/rotation/z': number,
    'pinkyProximal/rotation/w': number,

    'pinkyMiddle': XRPose,
    'pinkyMiddle/position': ReadonlyVector3,
    'pinkyMiddle/position/x': number,
    'pinkyMiddle/position/y': number,
    'pinkyMiddle/position/z': number,
    'pinkyMiddle/rotation': ReadonlyVector4,
    'pinkyMiddle/rotation/x': number,
    'pinkyMiddle/rotation/y': number,
    'pinkyMiddle/rotation/z': number,
    'pinkyMiddle/rotation/w': number,

    'pinkyDistal': XRPose,
    'pinkyDistal/position': ReadonlyVector3,
    'pinkyDistal/position/x': number,
    'pinkyDistal/position/y': number,
    'pinkyDistal/position/z': number,
    'pinkyDistal/rotation': ReadonlyVector4,
    'pinkyDistal/rotation/x': number,
    'pinkyDistal/rotation/y': number,
    'pinkyDistal/rotation/z': number,
    'pinkyDistal/rotation/w': number,

    'pinkyTip': XRPose,
    'pinkyTip/position': ReadonlyVector3,
    'pinkyTip/position/x': number,
    'pinkyTip/position/y': number,
    'pinkyTip/position/z': number,
    'pinkyTip/rotation': ReadonlyVector4,
    'pinkyTip/rotation/x': number,
    'pinkyTip/rotation/y': number,
    'pinkyTip/rotation/z': number,
    'pinkyTip/rotation/w': number,
}

export abstract class XRHandController extends InputController implements XRHandedController {
    protected _handeldManager: XRHandedManagerWrapper<XRHandController>;

    declare protected _path: ['xr-hand', ...string[]];

    public abstract get pose(): PoseControl;
    public abstract get handedness(): XRHandedness;

    public abstract get wrist(): JointControl;

    public abstract get thumbMetacarpal(): JointControl;
    public abstract get thumbProximal(): JointControl;
    public abstract get thumbDistal(): JointControl;
    public abstract get thumbTip(): JointControl;

    public abstract get indexMetacarpal(): JointControl;
    public abstract get indexProximal(): JointControl;
    public abstract get indexMiddle(): JointControl;
    public abstract get indexTip(): JointControl;
    public abstract get indexDistal(): JointControl;

    public abstract get middleMetacarpal(): JointControl;
    public abstract get middleProximal(): JointControl;
    public abstract get middleMiddle(): JointControl;
    public abstract get middleDistal(): JointControl;
    public abstract get middleTip(): JointControl;

    public abstract get ringMetacarpal(): JointControl;
    public abstract get ringProximal(): JointControl;
    public abstract get ringMiddle(): JointControl;
    public abstract get ringDistal(): JointControl;
    public abstract get ringTip(): JointControl;

    public abstract get pinkyMetacarpal(): JointControl;
    public abstract get pinkyProximal(): JointControl;
    public abstract get pinkyMiddle(): JointControl;
    public abstract get pinkyDistal(): JointControl;
    public abstract get pinkyTip(): JointControl;

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._path[0] = 'xr-hand';
        this._handeldManager = new XRHandedManagerWrapper(inputManager.xr.hand.left, inputManager.xr.hand.right);
        this._addManager(this._handeldManager);
    }

    public abstract getJoint(index: number): JointControl;

    /* @internal */
    public override _checkPath(path: InputPath): boolean {
        return (path.handedness === this.handedness || path.handedness === 'all') && super._checkPath(path);
    }
}

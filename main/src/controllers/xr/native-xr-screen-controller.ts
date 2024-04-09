import { BooleanControl } from "../../controls/input-controls.js";
import { PoseControl, UpdatableXRPointerControl, XRPointerControl, XRPoseControl } from "../../controls/xr-controls.js";
import { removeAtIndex } from "../../helpers/array-helper.js";
import { InputManager } from "../../input-manager.js";
import { XRViewerPoseData } from "./pose-data.js";
import { XRScreenController } from "./xr-screen-controller.js";

let _maxTouchPoints: number;
function _getMaxTouchPoints(): number {
    _maxTouchPoints ??= navigator.maxTouchPoints === 0
        ? 5
        : Math.min(navigator.maxTouchPoints, 5);

    return _maxTouchPoints;
}

export class NativeXRScreenController extends XRScreenController {
    private readonly _viewerPoseData: XRViewerPoseData;

    public readonly select: BooleanControl;
    public readonly primaryPointer: XRPointerControl;
    public readonly maxPointers = _getMaxTouchPoints();

    private _pointers = new Array<XRPointerControl>(this.maxPointers);
    private _activePointers: UpdatableXRPointerControl[] = [];
    private _nextPointer = 0;

    public readonly pose: PoseControl;

    private readonly _onScreenInputSource = (event: XRInputSourceChangeEvent): void => {
        for (let i = 0; i < event.removed.length; i++) {
            const inputSource = event.removed[i];
            if (inputSource.targetRayMode === 'screen') {
                const index = this._activePointers.findIndex((pointer: UpdatableXRPointerControl): boolean => pointer.inputSource === inputSource);
                if (index !== -1) {
                    const pointer = this._activePointers[index] as UpdatableXRPointerControl;
                    removeAtIndex(this._activePointers, index);
                    pointer.inputSource = null;
                    if ((this.primaryPointer as UpdatableXRPointerControl).inputSource === inputSource) {
                        (this.primaryPointer as UpdatableXRPointerControl).inputSource === null;
                    }
                    if (pointer.index < this._nextPointer) {
                        this._nextPointer = pointer.index;
                    }
                }
            }
        }
        for (let i = 0; i < event.added.length; i++) {
            const inputSource = event.added[i];
            if (inputSource.targetRayMode === 'screen') {
                if (this._nextPointer === this.maxPointers) {
                    return;
                }
                const pointer = this._getLazyPointer(this._nextPointer);
                do { this._nextPointer++; }
                while (this._nextPointer < this.maxPointers && this._pointers[this._nextPointer]?.isActivated());
                this._activePointers.push(pointer);
                pointer.inputSource = inputSource;
                if (this._activePointers.length === 1) {
                    (this.primaryPointer as UpdatableXRPointerControl).inputSource = inputSource;
                }
            }
        }
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._viewerPoseData = new XRViewerPoseData(inputManager.xr.native.context);
        this.pose = new XRPoseControl(this, 'pose', this._viewerPoseData);

        for (let i = 0; i < this.maxPointers; i++) {
            const index = i;
            Object.defineProperty(this, 'pointer' + i, { get: (): XRPointerControl => { return this._getLazyPointer(index); } });
        }
        this.primaryPointer = this.select = new UpdatableXRPointerControl(this, 'primaryPointer', 0);
    }

    public get activePointers(): readonly XRPointerControl[] {
        return this._activePointers;
    }

    public init(pose: XRViewerPose): void {
        this._viewerPoseData.setPose(pose);
        for (let i = 0; i < this._activePointers.length; i++) {
            (this._activePointers[i] as UpdatableXRPointerControl).inputSource = null;
        }
        this._activePointers.length = 0;
        (this.primaryPointer as UpdatableXRPointerControl).inputSource = null;
        this._nextPointer = 0;

        const session = this._inputManager.xr.native.context.session!;
        session.addEventListener('inputsourceschange', this._onScreenInputSource);
        for (let i = 0; i < session.inputSources.length; i++) {
            const inputSource = session.inputSources[i];
            if (inputSource.targetRayMode === 'screen') {
                if (this._nextPointer === this.maxPointers) {
                    return;
                }
                const pointer = this._getLazyPointer(this._nextPointer);
                do { this._nextPointer++; }
                while (this._nextPointer < this.maxPointers && this._pointers[this._nextPointer]?.isActivated());
                this._activePointers.push(pointer);
                pointer.inputSource = inputSource;
                if (this._activePointers.length === 1) {
                    (this.primaryPointer as UpdatableXRPointerControl).inputSource = inputSource;
                }
            }
        }
    }

    public getPointer(index: number): XRPointerControl | null {
        return index < this.maxPointers ? this._getLazyPointer(index) : null;
    }

    private _getLazyPointer(index: number): UpdatableXRPointerControl {
        this._pointers[index] ??= new UpdatableXRPointerControl(this, 'pointer' + index, index);
        return this._pointers[index] as UpdatableXRPointerControl;
    }

    protected override _update(): void {
        this._viewerPoseData.update();
        for (let i = 0; i < this._activePointers.length; i++) {
            (this._activePointers[i] as UpdatableXRPointerControl)?.update();
        }
        (this.primaryPointer as UpdatableXRPointerControl).update();
    }

    protected override _activationCheck(): boolean {
        return this._activePointers.length > 0;
    }

    protected override _onDisconnect(): void {
        this._inputManager.xr.native.context.session?.removeEventListener('inputsourceschange', this._onScreenInputSource);
    }
}
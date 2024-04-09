import { InputManager } from "../../../input-manager.js";
import { XRContext } from "./xr-context.js";

export class NativeXRControllerManager {
    public context!: XRContext;
    private _inputManager: InputManager;

    constructor(inputManager: InputManager) {
        this._inputManager = inputManager;
    }

    public readonly onSessionStart = (): void => {
        if (!this.context?.session) {
            throw console.error(`Before using native XR-based controllers, you must provide an XRContext object to the system and keep it updated.`);
        }
        this._inputManager.addEventListener('preUpdate', this._addXRControllers);
    };

    private readonly _addXRControllers = (): void => {
        if (!this.context.frame) return;

        const pose = this.context.frame.getViewerPose(this.context.referenceSpace!)!;
        if (pose.views.length === 2) {
            this._inputManager.xr.viewer.head.native._onAddViewer(pose);
            this._checkAdded(this.context.session!.inputSources);
            this.context.session!.addEventListener('inputsourceschange', this._handleXRInputSourceChanges);
        } else {
            this._inputManager.xr.viewer.screen.native._onAddViewer(pose);
        }
        this._inputManager.removeEventListener('preUpdate', this._addXRControllers);
    };

    public readonly onSessionEnd = (): void => {
        this._inputManager.removeControllers((controller): boolean => {
            return this._inputManager.xr.gamepad.native._checkController(controller) ||
                this._inputManager.xr.hand.native._checkController(controller) ||
                this._inputManager.xr.viewer.head.native._checkController(controller) ||
                this._inputManager.xr.viewer.screen.native._checkController(controller);
        });
    };

    private readonly _handleXRInputSourceChanges = (event: XRInputSourceChangeEvent): void => {
        for (let i = 0; i < event.removed.length; i++) {
            const inputSource = event.removed[i];
            this._inputManager.xr.gamepad.native._onRemoveInputSource(inputSource) ||
                this._inputManager.xr.hand.native._onRemoveInputSource(inputSource);
        }
        this._checkAdded(event.added);
    };

    private readonly _checkAdded = (inputSources: readonly XRInputSource[] | XRInputSourceArray): void => {
        for (let i = 0; i < inputSources.length; i++) {
            const inputSource = inputSources[i];
            this._inputManager.xr.gamepad.native._onAddInputSource(inputSource) ||
                this._inputManager.xr.hand.native._onAddInputSource(inputSource);
        }
    };

}
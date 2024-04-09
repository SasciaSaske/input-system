import { Vector3Control, Vector4Control } from "../../controls/input-controls.js";
import { PropertyVector3StateControl } from "../../controls/property-based-controls.js";
import { DeviceRotationControl } from "../../controls/sensor-controls.js";
import { InputManager } from "../../input-manager.js";
import { OrientationSensorController } from "./orientation-sensor-controller.js";
import { OrientationEventWrapper } from "./sensor-data.js";

export class NativeOrientationSensorController extends OrientationSensorController {
    public readonly rotation: Vector4Control;
    public readonly degRotation: Vector3Control;

    private _orientationData = new OrientationEventWrapper();

    private _onOrientation = (event: DeviceOrientationEvent): void => {
        this._orientationData.updateData(event);
    };

    public constructor(inputManager: InputManager) {
        super(inputManager);

        this.rotation = new DeviceRotationControl(this, 'rotation', this._orientationData);
        this.degRotation = new PropertyVector3StateControl(this, 'degRotation', this._orientationData, 'x', 'y', 'z');
    }

    public get absolute(): boolean {
        return this._orientationData.absolute;
    }

    public init(event: DeviceOrientationEvent): void {
        this._orientationData.init(event);
        window.addEventListener('deviceorientation', this._onOrientation);
    }

    protected override _update(): void {
        (this.rotation as DeviceRotationControl).update();
    }

    protected override _onDisconnect(): void {
        removeEventListener('deviceorientation', this._onOrientation);
    }
}
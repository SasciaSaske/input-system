import { AccelerometerController } from "../controllers/sensors/accelerometer-controller.js";
import { GravitySensorController } from "../controllers/sensors/gravity-sensor-controller.js";
import { GyroscopeController } from "../controllers/sensors/gyroscope-controller.js";
import { LinearAccelerationSensorController } from "../controllers/sensors/linear-acceleration-sensor-controller.js";
import { OrientationSensorController } from "../controllers/sensors/orientation-sensor-controller.js";
import { InputManager } from "../input-manager.js";
import { SingleNativeControllerManager } from "./native/native-controller-enabler.js";
import { NativeAccelerometerEnabler, NativeGravitySensorEnabler, NativeGyroscopeEnabler, NativeLinearAccelerationSensorEnabler, NativeOrientationSensorEnabler } from "./native/native-motion-sensor-enabler.js";

export interface OrientationSensorManager extends SingleNativeControllerManager<OrientationSensorController, NativeOrientationSensorEnabler> { }
export interface AccelerometerManager extends SingleNativeControllerManager<AccelerometerController, NativeAccelerometerEnabler> { }
export interface GyroscopeManager extends SingleNativeControllerManager<GyroscopeController, NativeGyroscopeEnabler> { }
export interface GravitySensorManager extends SingleNativeControllerManager<GravitySensorController, NativeGravitySensorEnabler> { }
export interface LinearAccelerationSensorManager extends SingleNativeControllerManager<LinearAccelerationSensorController, NativeLinearAccelerationSensorEnabler> { }

export class SensorManager {
    public readonly orientation: OrientationSensorManager;
    public readonly accelerometer: AccelerometerManager;
    public readonly gyroscope: GyroscopeManager;
    public readonly gravity: GravitySensorManager;
    public readonly linearAcceleration: LinearAccelerationSensorManager;

    public constructor(inputManager: InputManager) {
        this.orientation = new SingleNativeControllerManager<OrientationSensorController, NativeOrientationSensorEnabler>(new NativeOrientationSensorEnabler(inputManager));
        this.accelerometer = new SingleNativeControllerManager<AccelerometerController, NativeAccelerometerEnabler>(new NativeAccelerometerEnabler(inputManager));
        this.gyroscope = new SingleNativeControllerManager<GyroscopeController, NativeGyroscopeEnabler>(new NativeGyroscopeEnabler(inputManager));
        this.gravity = new SingleNativeControllerManager<GravitySensorController, NativeGravitySensorEnabler>(new NativeGravitySensorEnabler(inputManager));
        this.linearAcceleration = new SingleNativeControllerManager<LinearAccelerationSensorController, NativeLinearAccelerationSensorEnabler>(new NativeLinearAccelerationSensorEnabler(inputManager));
    }
}
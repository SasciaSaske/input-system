import { NativeAccelerometerController } from "../../controllers/sensors/native-accelerometer-controller.js";
import { NativeGravityController } from "../../controllers/sensors/native-gravity-sensor-controller.js";
import { NativeGyroscopeController } from "../../controllers/sensors/native-gyroscope-controller.js";
import { NativeLinearAccelerationSensorController } from "../../controllers/sensors/native-linear-acceleration-sensor-controller.js";
import { NativeOrientationSensorController } from "../../controllers/sensors/native-orientation-sensor-controller.js";
import { NativeControllerEnabler } from "./native-controller-enabler.js";
import { InputController } from "../../controllers/input-controller.js";
import { DeviceMotionEventMap, addEventListenerOnPermission, permission, removeEventListenerOnPermission, requestPermission, supported } from "../../helpers/device-motion-event-helper.js";
import { EVENT_ONCE_OPTION } from "../../helpers/event-helper.js";
import { Constructor } from "../../helpers/type-helpers.js";

interface NativeMotionSensorController<T extends keyof DeviceMotionEventMap> extends InputController {
    init(event: DeviceMotionEventMap[T]): void;
}

abstract class NativeMotionSensorEnabler<T extends keyof DeviceMotionEventMap> extends NativeControllerEnabler {
    protected readonly abstract _controllerType: Constructor<NativeMotionSensorController<T>>;
    protected readonly abstract _eventType: T;

    private _onMotion = (event: DeviceMotionEventMap[T]): void => {
        if (this.checkEvent(event)) {
            this._inputManager.addController(this._controllerType, event);
        }
    };

    protected _onEnable(): void {
        addEventListenerOnPermission(this._eventType, this._onMotion);
    }

    protected _onDisable(): void {
        removeEventListenerOnPermission(this._eventType, this._onMotion);
        this._inputManager.removeControllers((controller): boolean => controller.constructor === this._controllerType);
    }

    protected abstract checkEvent(event: DeviceMotionEventMap[T]): boolean;

    public get supported(): boolean {
        return supported;
    }

    public get permission(): boolean {
        return permission;
    }

    public requestPermissionOnElementClick(element: HTMLElement): void {
        element.addEventListener('click', requestPermission, EVENT_ONCE_OPTION);
    }
}

export class NativeOrientationSensorEnabler extends NativeMotionSensorEnabler<'deviceorientation'> {
    protected readonly _controllerType = NativeOrientationSensorController;
    protected readonly _eventType = 'deviceorientation';
    protected checkEvent(event: DeviceOrientationEvent): boolean {
        return event.alpha !== null;
    }
}
export class NativeAccelerometerEnabler extends NativeMotionSensorEnabler<'devicemotion'> {
    protected readonly _controllerType = NativeAccelerometerController;
    protected readonly _eventType = 'devicemotion';
    protected checkEvent(event: DeviceMotionEvent): boolean {
        return event.accelerationIncludingGravity !== null;
    }
}
export class NativeGyroscopeEnabler extends NativeMotionSensorEnabler<'devicemotion'> {
    protected readonly _controllerType = NativeGyroscopeController;
    protected readonly _eventType = 'devicemotion';
    protected checkEvent(event: DeviceMotionEvent): boolean {
        return event.rotationRate !== null;
    }
}
export class NativeGravitySensorEnabler extends NativeMotionSensorEnabler<'devicemotion'> {
    protected readonly _controllerType = NativeGravityController;
    protected readonly _eventType = 'devicemotion';
    protected checkEvent(event: DeviceMotionEvent): boolean {
        return event.acceleration !== null &&
            event.accelerationIncludingGravity !== null;
    }
}
export class NativeLinearAccelerationSensorEnabler extends NativeMotionSensorEnabler<'devicemotion'> {
    protected readonly _controllerType = NativeLinearAccelerationSensorController;
    protected readonly _eventType = 'devicemotion';
    protected checkEvent(event: DeviceMotionEvent): boolean {
        return event.acceleration !== null;
    }
}
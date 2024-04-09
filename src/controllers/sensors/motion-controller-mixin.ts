import { AbstractConstructor } from "../../helpers/type-helpers.js";
import { InputController } from "../input-controller.js";
import { MotionEventWrapper } from "./sensor-data.js";

const _motionData = new MotionEventWrapper();
let _count = 0;
const _onMotion = (event: DeviceMotionEvent): void => {
    _motionData.updateData(event);
};

export declare abstract class MotionControllerInstance extends InputController {
    protected readonly _motionData: MotionEventWrapper;
    public init(event: DeviceMotionEvent): void;
}

export function motionControllerMixin<T extends AbstractConstructor<InputController>>(base: T): T & AbstractConstructor<MotionControllerInstance> {
    abstract class MotionControllerMixin extends base {
        protected readonly _motionData = _motionData;
        public init(event: DeviceMotionEvent): void {
            if (_count++ === 0) {
                window.addEventListener('devicemotion', _onMotion);
                this._motionData.init(event);
            }
        }

        protected override _onDisconnect(): void {
            if (--_count === 0) {
                removeEventListener('devicemotion', _onMotion);
            }
        }
    }
    return MotionControllerMixin as unknown as T & AbstractConstructor<MotionControllerInstance>;
}
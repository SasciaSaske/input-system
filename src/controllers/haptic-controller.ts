import { InputController } from "./input-controller.js";

export interface HapticController extends InputController {
    get haptic(): Haptic;
}

export interface Haptic {
    get supported(): boolean;
    start(duration?: number, intesity?: number): void;
    stop(): void;
}

export interface GamepadHaptic extends Haptic {
    start(duration?: number, intesity?: number): void;
    start(duration: number, strongIntensity: number, weakIntensity: number): void;
}
export interface XRGamepadHaptic extends Haptic {
    start(duration?: number, intesity?: number, index?: number): void;
}

interface VibrationEffect {
    duration: number,
    strongMagnitude: number,
    weakMagnitude: number
}

export class UpdatableGamepadHaptic implements GamepadHaptic {
    private _vibrationActuator: GamepadHapticActuator | null = null;
    private _effectData: VibrationEffect = {
        duration: 0,
        strongMagnitude: 0,
        weakMagnitude: 0,
    };

    public setActuator(vibrationActuator: GamepadHapticActuator | null): void {
        this._vibrationActuator = vibrationActuator;
    }

    public get supported(): boolean {
        return this._vibrationActuator !== null;
    }

    public start(duration?: number, intesity?: number): void;
    public start(duration: number, strongIntensity: number, weakIntensity: number): void;
    public start(duration: number = Infinity, strongIntensity: number = 1, weakIntensity: number = strongIntensity): void {
        if (this._vibrationActuator) {
            this._effectData.duration = duration;
            this._effectData.strongMagnitude = strongIntensity;
            this._effectData.weakMagnitude = weakIntensity;

            this._rumbleVibration();
        }
    }

    private _rumbleVibration = (): void => {
        if (this._effectData.duration <= 5000) {
            this._vibrationActuator!.playEffect('dual-rumble', this._effectData);
        } else {
            const duration = this._effectData.duration - 5000;
            this._effectData.duration = 5000;
            this._vibrationActuator!.playEffect('dual-rumble', this._effectData).then(this._extendVibration);
            this._effectData.duration = duration;
        }
    };

    private _extendVibration = (result: GamepadHapticsResult): void => {
        if (result === 'complete') {
            this._rumbleVibration();
        }
    };

    public stop(): void {
        this._vibrationActuator?.reset();
    }
}

interface XRGamepadHapticActuator extends GamepadHapticActuator {
    pulse(value: number, duration: number): Promise<boolean>;
}

export class UpdatableXRGamepadHaptic implements XRGamepadHaptic {
    private _vibrationActuators: readonly XRGamepadHapticActuator[] | null = null;
    private _vibrationTimeouts!: (number | null)[];

    public get supported(): boolean {
        return this._vibrationActuators !== null;
    }

    public get actuatorCount(): number {
        return this._vibrationActuators?.length ?? 0;
    }

    public setActuators(vibrationActuators: readonly GamepadHapticActuator[] | null): void {
        this._vibrationActuators = vibrationActuators as XRGamepadHapticActuator[];
        if (vibrationActuators) {
            this._vibrationTimeouts ??= [];
            this._vibrationTimeouts.length = vibrationActuators.length;
            this._vibrationTimeouts.fill(null);
        }
    }

    // Use timeout since promise is not working on quest browser
    public start(duration = Infinity, intensity = 1, index: number = 0): void {
        if (this._vibrationActuators && this._vibrationActuators[index]) {
            this._playVibrationAt(duration, intensity, index);

        }
    }

    private _playVibrationAt(duration: number, intensity: number, index: number): void {
        const timeout = this._vibrationTimeouts[index];
        if (timeout) {
            clearTimeout(timeout);
        }
        this._hapticVibration(duration, intensity, index);
    }

    private readonly _hapticVibration = (duration: number, intensity: number, index: number): void => {
        if (duration <= 5000) {
            this._vibrationTimeouts[index] = null;
            this._vibrationActuators![index].pulse(intensity, duration);
        } else {
            this._vibrationActuators![index].pulse(intensity, 5000);
            this._vibrationTimeouts[index] = window.setTimeout(this._hapticVibration, 4900, duration - 4900, intensity, index);
        }
    };

    public stop(actuatorIndex?: number | 'all'): void;
    public stop(index: number | 'all' = 0): void {
        if (this._vibrationActuators) {
            if (index === 'all') {
                for (let i = 0; i < this._vibrationActuators.length; i++) {
                    this._stopVibrationAt(i);
                }
            } else {
                this._stopVibrationAt(index);
            }
        }
    }

    private _stopVibrationAt(index: number): void {
        const timeout = this._vibrationTimeouts[index];
        if (timeout) {
            clearTimeout(timeout);
            this._vibrationTimeouts[index] = null;
        }
        this._vibrationActuators![index].pulse(0, 1);
    }
}
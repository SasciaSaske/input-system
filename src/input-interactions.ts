import { InputConverter } from "./input-converters.js";
import { InputTrigger } from "./input-trigger.js";

export class HoldTrigger implements InputTrigger<boolean> {
    public holdTime: number;

    private _timer!: number;

    public constructor(holdTime = 0.5) {
        this.holdTime = holdTime;
    }

    reset(): void {
        this._timer = 0;
    }

    public apply(value: boolean, deltaTime: number): boolean {
        if (value === true) {
            if (this._timer >= this.holdTime) {
                return true;
            }
            this._timer += deltaTime;
            return false;
        }
        this._timer = 0;
        return false;
    }
}

export class TapTrigger implements InputTrigger<boolean> {
    public tapTime: number;

    private _timer!: number;

    public constructor(tapTime = 0.1) {
        this.tapTime = tapTime;
    }

    reset(): void {
        this._timer = 0;
    }

    public apply(value: boolean, deltaTime: number): boolean {
        if (value === true) {
            this._timer += deltaTime;
            return false;
        }
        if (this._timer === 0) {
            return false;
        }
        if (this._timer <= this.tapTime) {
            this._timer = 0;
            return true;
        }
        this._timer = 0;
        return false;
    }
}

export class MultiTapTrigger implements InputTrigger<boolean> {
    public tapTime: number;
    public delayTime: number;
    public tapCount: number;

    private _count!: number;
    private _lastValue!: boolean;
    private _timer!: number;

    public constructor(tapTime = 0.2, delayTime = 0.2, tapCount = 2) {
        this.tapTime = tapTime;
        this.delayTime = delayTime;
        this.tapCount = tapCount;
    }

    reset(): void {
        this._count = 0;
        this._lastValue = false;
        this._timer = 0;
    }

    public apply(value: boolean, deltaTime: number): boolean {
        if (this._count === 0) {
            if (value === true) {
                this._lastValue = true;
                this._count++;
            }
            return false;
        }
        if (this._count < this.tapCount) {
            this._timer += deltaTime;
            if (this._lastValue === true) {
                if (value === false) {
                    this._lastValue = false;
                    if (this._timer > this.tapTime) {
                        this._count = 0;
                    }
                    this._timer = 0;
                }
            } else {
                if (this._timer <= this.delayTime) {
                    if (value === true) {
                        this._lastValue = true;
                        this._count++;
                        this._timer = 0;
                    }
                } else {
                    this._count = 0;
                    this._timer = 0;
                }
            }
            return false;
        }
        if (value) {
            return true;
        }
        this._count = 0;
        return false;
    }
}

export const ALL_TRUE_CONVERTER: InputConverter<ArrayLike<boolean>, boolean> = {
    apply(values: ArrayLike<boolean>): boolean {
        for (let i = 0; i < values.length; i++) {
            if (values[i] === false) {
                return false;
            }
        }
        return true;
    }
};

export class SequenceCompositeInteraction<T extends ArrayLike<boolean>> implements InputTrigger<T> {
    private _tapTime: number;
    private _delayTime: number;

    private _count!: number;
    private _lastValue!: boolean;
    private _timer!: number;

    public constructor(tapTime = 0.2, delayTime = 0.2) {
        this._tapTime = tapTime;
        this._delayTime = delayTime;
    }

    reset(): void {
        this._count = 0;
        this._lastValue = false;
        this._timer = 0;
    }

    public apply(values: T, deltaTime: number): boolean {
        if (this._count === 0) {
            if (values[0] === true) {
                this._lastValue = true;
                this._count++;
            }
            return false;
        }
        if (this._count < values.length) {
            this._timer += deltaTime;
            if (this._lastValue === true) {
                if (values[this._count - 1] === false) {
                    this._lastValue = false;
                    if (this._timer > this._tapTime) {
                        this._count = 0;
                    }
                    this._timer = 0;
                }
            } else {
                if (this._timer <= this._delayTime) {
                    if (values[this._count] == true) {
                        this._lastValue = true;
                        this._count++;
                        this._timer = 0;
                    }
                } else {
                    this._count = 0;
                    this._timer = 0;
                }
            }
            return false;
        }
        if (values[this._count - 1] == true) {
            return true;
        }
        this._count = 0;
        return false;
    }
}
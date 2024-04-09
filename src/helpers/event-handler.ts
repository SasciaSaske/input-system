import { removeAtIndex } from "./array-helper.js";

export abstract class BaseEventHandler<T extends unknown[]> {
    protected _listeners: ((...args: T) => void)[] = [];

    public add(callback: (...args: T) => void): void {
        if (this._listeners.indexOf(callback) === -1) {
            this._listeners.push(callback);
        }
    }

    public remove(callback: (...args: T) => void): void {
        const index = this._listeners.indexOf(callback);
        if (index !== -1) {
            removeAtIndex(this._listeners, index);
        }
    }

    public has(callback: (...args: T) => void): boolean {
        return this._listeners.indexOf(callback) !== -1;
    }

    public abstract raise(...args: T): void;
}

export class EventHandlerNoParameter extends BaseEventHandler<[]>{
    public raise(): void {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i]();
        }
    }
}
export class EventHandlerOneParameter<T> extends BaseEventHandler<[arg: T]>{
    public raise(arg: T): void {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i](arg);
        }
    }
}
export class EventHandlerTwoParameters<T1, T2> extends BaseEventHandler<[arg0: T1, arg1: T2]>{
    public raise(arg0: T1, arg1: T2): void {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i](arg0, arg1);
        }
    }
}
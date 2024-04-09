import { InputController } from "../controllers/input-controller.js";
import { removeAtIndex } from "../helpers/array-helper.js";
import { EventHandlerOneParameter } from "../helpers/event-handler.js";

export class SingleControllerManager<T extends InputController> {
    protected _current: T | null = null;

    private _onConnected!: EventHandlerOneParameter<T>;
    private _onDisconnected!: EventHandlerOneParameter<T>;
    private _onCurrentChanged!: EventHandlerOneParameter<T | null>;

    public get current(): T | null {
        return this._current;
    }

    /* @internal */
    public _add(controller: T): void {
        this._onConnected?.raise(controller);
        if (!this._current) {
            this._current = controller;
            this._onCurrentChanged?.raise(controller);
        }
    }

    /* @internal */
    public _remove(controller: T): void {
        if (this._current === controller) {
            this._current = null;
            this._onCurrentChanged?.raise(null);
        }
        this._onDisconnected?.raise(controller);
    }

    /* @internal */
    public _setCurrent(controller: T): void {
        this._current = controller;
        this._onCurrentChanged?.raise(controller);
    }

    /* @internal */
    public _setActivated(controller: T): void {
        if (!this._current?.isActivated()) {
            this._current = controller;
            this._onCurrentChanged?.raise(controller);
        }
    }

    public addEventListener(type: 'connected' | 'disconnected', listener: (controller: T) => void): void;
    public addEventListener(type: 'currentChanged', listener: (controller: T | null) => void): void;
    public addEventListener(...[type, listener]:
        [type: 'connected' | 'disconnected', listener: (controller: T) => void] |
        [type: 'currentChanged', listener: (controller: T | null) => void]): void {
        switch (type) {
            case 'connected':
                this._onConnected ??= new EventHandlerOneParameter<T>();
                this._onConnected.add(listener);
                return;
            case 'disconnected':
                this._onDisconnected ??= new EventHandlerOneParameter<T>();
                this._onDisconnected.add(listener);
                return;
            case 'currentChanged':
                this._onCurrentChanged ??= new EventHandlerOneParameter<T | null>();
                this._onCurrentChanged.add(listener);
                return;
        }
    }

    public removeEventListener(type: 'connected' | 'disconnected', listener: (controller: T) => void): void;
    public removeEventListener(type: 'currentChanged', listener: (controller: T | null) => void): void;
    public removeEventListener(...[type, listener]:
        [type: 'connected' | 'disconnected', listener: (controller: T) => void] |
        [type: 'currentChanged', listener: (controller: T | null) => void]): void {
        switch (type) {
            case 'connected':
                this._onConnected ??= new EventHandlerOneParameter<T>();
                this._onConnected.add(listener);
                return;
            case 'disconnected':
                this._onDisconnected ??= new EventHandlerOneParameter<T>();
                this._onDisconnected.add(listener);
                return;
            case 'currentChanged':
                this._onCurrentChanged ??= new EventHandlerOneParameter<T | null>();
                this._onCurrentChanged.add(listener);
                return;
        }
    }
}

export class MultipleControllerManager<T extends InputController> extends SingleControllerManager<T> {
    protected _all: T[] = [];

    public get all(): readonly T[] {
        return this._all;
    }

    /* @internal */
    public override _add(controller: T): void {
        this._all.push(controller);
        super._add(controller);
    }

    /* @internal */
    public override _remove(controller: T): void {
        const index = this._all.indexOf(controller);
        if (index === -1) {
            return;
        }
        removeAtIndex(this._all, index);
        super._remove(controller);
    }
}
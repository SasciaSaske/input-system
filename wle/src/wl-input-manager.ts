import { WonderlandEngine } from '@wonderlandengine/api';
import { InputManager } from 'input-system';
import { XRContext } from 'input-system';

export class WLInputManager extends InputManager {
    //#region Static 
    private static _inputManagers: Map<WonderlandEngine, WLInputManager> = new Map();
    private static _current: WLInputManager | null = null;

    private _setEngine(engine: WonderlandEngine): void {
        this.xr.native.context = new WLXRContext(engine);
        engine.onXRSessionStart.add(this.xr.native.onSessionStart);
        engine.onXRSessionEnd.add(this.xr.native.onSessionEnd);
    }

    public static get current(): WLInputManager {
        WLInputManager._current ??= new WLInputManager();
        return WLInputManager._current;
    }

    public static get(engine: WonderlandEngine): WLInputManager {
        let inputManager = this._inputManagers.get(engine);
        if (!inputManager) {
            if (this._current && this._inputManagers.size === 0) {
                inputManager = this._current;
            } else {
                inputManager = new WLInputManager();
                this._current ??= inputManager;
            }
            inputManager._setEngine(engine);
            inputManager._time = Date.now();
            this._inputManagers.set(engine, inputManager);
            const id = { id: engine };
            const update = (): void => {
                const time = Date.now();
                inputManager!.update((time - inputManager!._time) * 0.001);
                inputManager!._time = time;
            };
            const addUpdate = (): void => { engine.scene.onPreRender.add(update, id); };
            addUpdate();
            engine.onSceneLoaded.add(addUpdate, id);
        }
        return inputManager;
    }

    public static delete(engine: WonderlandEngine): boolean {
        const inputManager = this._inputManagers.get(engine);
        if (inputManager) {
            if (this._current === inputManager) {
                this._current = null;
            }
            engine.scene.onPreRender.remove(engine);
            engine.onSceneLoaded.remove(engine);
            return true;
        }
        return false;
    }

    public static setCurrent(engine: WonderlandEngine): boolean {
        this._current = this._inputManagers.get(engine) ?? null;
        return this._current !== null;
    }
    //#endregion

    //#region Main
    private _time!: number;

    public setAsCurrent(): void {
        WLInputManager._current = this;
    }
}

class WLXRContext implements XRContext {
    private _engine: WonderlandEngine;
    constructor(engine: WonderlandEngine) {
        this._engine = engine;
    }
    get frame(): XRFrame | null {
        return this._engine.xr?.frame ?? null;
    }
    get referenceSpace(): XRReferenceSpace | null {
        return this._engine.xr?.currentReferenceSpace ?? null;
    }
    get session(): XRSession | null {
        return this._engine.xr?.session ?? null;
    }

}
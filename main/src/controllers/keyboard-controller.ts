import { InputManager } from "../input-manager.js";
import { BooleanControl } from "../controls/input-controls.js";
import { InputController } from "./input-controller.js";
declare module "./input-maps.js" {
    export interface InputControllerMap {
        'keyboard': KeyboardControlMap;
    }

    export interface InputControlMap extends KeyboardControlMap {
    }
}

export interface KeyboardControlMap {
    'backspace': boolean,
    'tab': boolean,
    'enter': boolean,
    'shiftLeft': boolean,
    'shiftRight': boolean,
    'controlLeft': boolean,
    'controlRight': boolean,
    'altLeft': boolean,
    'altRight': boolean,
    'pause': boolean,
    'capsLock': boolean,
    'escape': boolean,
    'space': boolean,
    'pageUp': boolean,
    'pageDown': boolean,
    'end': boolean,
    'home': boolean,
    'arrowLeft': boolean,
    'arrowUp': boolean,
    'arrowRight': boolean,
    'arrowDown': boolean,
    'printScreen': boolean,
    'insert': boolean,
    'delete': boolean,
    'key0': boolean,
    'key1': boolean,
    'key2': boolean,
    'key3': boolean,
    'key4': boolean,
    'key5': boolean,
    'key6': boolean,
    'key7': boolean,
    'key8': boolean,
    'key9': boolean,
    'keyA': boolean,
    'keyB': boolean,
    'keyC': boolean,
    'keyD': boolean,
    'keyE': boolean,
    'keyF': boolean,
    'keyG': boolean,
    'keyH': boolean,
    'keyI': boolean,
    'keyJ': boolean,
    'keyK': boolean,
    'keyL': boolean,
    'keyM': boolean,
    'keyN': boolean,
    'keyO': boolean,
    'keyP': boolean,
    'keyQ': boolean,
    'keyR': boolean,
    'keyS': boolean,
    'keyT': boolean,
    'keyU': boolean,
    'keyV': boolean,
    'keyW': boolean,
    'keyX': boolean,
    'keyY': boolean,
    'keyZ': boolean,
    'metaLeft': boolean,
    'contextMenu': boolean,
    'numpad0': boolean,
    'numpad1': boolean,
    'numpad2': boolean,
    'numpad3': boolean,
    'numpad4': boolean,
    'numpad5': boolean,
    'numpad6': boolean,
    'numpad7': boolean,
    'numpad8': boolean,
    'numpad9': boolean,
    'numpadMultiply': boolean,
    'numpadAdd': boolean,
    'numpadSubtract': boolean,
    'numpadDecimal': boolean,
    'numpadDivide': boolean,
    'f1': boolean,
    'f2': boolean,
    'f3': boolean,
    'f4': boolean,
    'f5': boolean,
    'f6': boolean,
    'f7': boolean,
    'f8': boolean,
    'f9': boolean,
    'f10': boolean,
    'f11': boolean,
    'f12': boolean,
    'numLock': boolean,
    'scrollLock': boolean,
    'semicolon': boolean,
    'equal': boolean,
    'comma': boolean,
    'minus': boolean,
    'period': boolean,
    'slash': boolean,
    'backquote': boolean,
    'bracketLeft': boolean,
    'backslash': boolean,
    'braketRight': boolean,
    'quote': boolean
}

export abstract class KeyboardController extends InputController {
    declare protected _path: ['keyboard', ...string[]];

    public abstract get backspace(): BooleanControl;
    public abstract get tab(): BooleanControl;
    public abstract get enter(): BooleanControl;
    public abstract get shiftLeft(): BooleanControl;
    public abstract get shiftRight(): BooleanControl;
    public abstract get controlLeft(): BooleanControl;
    public abstract get controlRight(): BooleanControl;
    public abstract get altLeft(): BooleanControl;
    public abstract get altRight(): BooleanControl;
    public abstract get pause(): BooleanControl;
    public abstract get capsLock(): BooleanControl;
    public abstract get escape(): BooleanControl;
    public abstract get space(): BooleanControl;
    public abstract get pageUp(): BooleanControl;
    public abstract get pageDown(): BooleanControl;
    public abstract get end(): BooleanControl;
    public abstract get home(): BooleanControl;
    public abstract get arrowLeft(): BooleanControl;
    public abstract get arrowUp(): BooleanControl;
    public abstract get arrowRight(): BooleanControl;
    public abstract get arrowDown(): BooleanControl;
    public abstract get printScreen(): BooleanControl;
    public abstract get insert(): BooleanControl;
    public abstract get delete(): BooleanControl;
    public abstract get key0(): BooleanControl;
    public abstract get key1(): BooleanControl;
    public abstract get key2(): BooleanControl;
    public abstract get key3(): BooleanControl;
    public abstract get key4(): BooleanControl;
    public abstract get key5(): BooleanControl;
    public abstract get key6(): BooleanControl;
    public abstract get key7(): BooleanControl;
    public abstract get key8(): BooleanControl;
    public abstract get key9(): BooleanControl;
    public abstract get keyA(): BooleanControl;
    public abstract get keyB(): BooleanControl;
    public abstract get keyC(): BooleanControl;
    public abstract get keyD(): BooleanControl;
    public abstract get keyE(): BooleanControl;
    public abstract get keyF(): BooleanControl;
    public abstract get keyG(): BooleanControl;
    public abstract get keyH(): BooleanControl;
    public abstract get keyI(): BooleanControl;
    public abstract get keyJ(): BooleanControl;
    public abstract get keyK(): BooleanControl;
    public abstract get keyL(): BooleanControl;
    public abstract get keyM(): BooleanControl;
    public abstract get keyN(): BooleanControl;
    public abstract get keyO(): BooleanControl;
    public abstract get keyP(): BooleanControl;
    public abstract get keyQ(): BooleanControl;
    public abstract get keyR(): BooleanControl;
    public abstract get keyS(): BooleanControl;
    public abstract get keyT(): BooleanControl;
    public abstract get keyU(): BooleanControl;
    public abstract get keyV(): BooleanControl;
    public abstract get keyW(): BooleanControl;
    public abstract get keyX(): BooleanControl;
    public abstract get keyY(): BooleanControl;
    public abstract get keyZ(): BooleanControl;
    public abstract get metaLeft(): BooleanControl;
    public abstract get contextMenu(): BooleanControl;
    public abstract get numpad0(): BooleanControl;
    public abstract get numpad1(): BooleanControl;
    public abstract get numpad2(): BooleanControl;
    public abstract get numpad3(): BooleanControl;
    public abstract get numpad4(): BooleanControl;
    public abstract get numpad5(): BooleanControl;
    public abstract get numpad6(): BooleanControl;
    public abstract get numpad7(): BooleanControl;
    public abstract get numpad8(): BooleanControl;
    public abstract get numpad9(): BooleanControl;
    public abstract get numpadMultiply(): BooleanControl;
    public abstract get numpadAdd(): BooleanControl;
    public abstract get numpadSubtract(): BooleanControl;
    public abstract get numpadDecimal(): BooleanControl;
    public abstract get numpadDivide(): BooleanControl;
    public abstract get f1(): BooleanControl;
    public abstract get f2(): BooleanControl;
    public abstract get f3(): BooleanControl;
    public abstract get f4(): BooleanControl;
    public abstract get f5(): BooleanControl;
    public abstract get f6(): BooleanControl;
    public abstract get f7(): BooleanControl;
    public abstract get f8(): BooleanControl;
    public abstract get f9(): BooleanControl;
    public abstract get f10(): BooleanControl;
    public abstract get f11(): BooleanControl;
    public abstract get f12(): BooleanControl;
    public abstract get numLock(): BooleanControl;
    public abstract get scrollLock(): BooleanControl;
    public abstract get semicolon(): BooleanControl;
    public abstract get equal(): BooleanControl;
    public abstract get comma(): BooleanControl;
    public abstract get minus(): BooleanControl;
    public abstract get period(): BooleanControl;
    public abstract get slash(): BooleanControl;
    public abstract get backquote(): BooleanControl;
    public abstract get bracketLeft(): BooleanControl;
    public abstract get backslash(): BooleanControl;
    public abstract get braketRight(): BooleanControl;
    public abstract get quote(): BooleanControl;

    public abstract get activatedKeys(): readonly BooleanControl[];

    public constructor(inputManager: InputManager) {
        super(inputManager);
        this._addManager(inputManager.keyboard);
        this._path[0] = 'keyboard';
    }
}
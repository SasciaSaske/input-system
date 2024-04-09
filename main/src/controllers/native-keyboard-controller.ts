import { KeyboardController } from "./keyboard-controller.js";

import { BooleanControl } from "../controls/input-controls.js";
import { UpdatableButtonControl } from "../controls/mouse-keyboard-controls.js";
import { removeAtIndex } from "../helpers/array-helper.js";

const KEYBOARD_KEYCODES_MAP: Record<string, keyof KeyboardController> = {
    Backspace: 'backspace',
    Tab: 'tab',
    Enter: 'enter',
    ShiftLeft: 'shiftLeft',
    ShiftRight: 'shiftRight',
    ControlLeft: 'controlLeft',
    ControlRight: 'controlRight',
    AltLeft: 'altLeft',
    AltRight: 'altRight',
    Pause: 'pause',
    CapsLock: 'capsLock',
    Escape: 'escape',
    Space: 'space',
    PageUp: 'pageUp',
    PageDown: 'pageDown',
    End: 'end',
    Home: 'home',
    ArrowLeft: 'arrowLeft',
    ArrowUp: 'arrowUp',
    ArrowRight: 'arrowRight',
    ArrowDown: 'arrowDown',
    PrintScreen: 'printScreen',
    Insert: 'insert',
    Delete: 'delete',
    Digit0: 'key0',
    Digit1: 'key1',
    Digit2: 'key2',
    Digit3: 'key3',
    Digit4: 'key4',
    Digit5: 'key5',
    Digit6: 'key6',
    Digit7: 'key7',
    Digit8: 'key8',
    Digit9: 'key9',
    KeyA: 'keyA',
    KeyB: 'keyB',
    KeyC: 'keyC',
    KeyD: 'keyD',
    KeyE: 'keyE',
    KeyF: 'keyF',
    KeyG: 'keyG',
    KeyH: 'keyH',
    KeyI: 'keyI',
    KeyJ: 'keyJ',
    KeyK: 'keyK',
    KeyL: 'keyL',
    KeyM: 'keyM',
    KeyN: 'keyN',
    KeyO: 'keyO',
    KeyP: 'keyP',
    KeyQ: 'keyQ',
    KeyR: 'keyR',
    KeyS: 'keyS',
    KeyT: 'keyT',
    KeyU: 'keyU',
    KeyV: 'keyV',
    KeyW: 'keyW',
    KeyX: 'keyX',
    KeyY: 'keyY',
    KeyZ: 'keyZ',
    MetaLeft: 'metaLeft',
    ContextMenu: 'contextMenu',
    Numpad0: 'numpad0',
    Numpad1: 'numpad1',
    Numpad2: 'numpad2',
    Numpad3: 'numpad3',
    Numpad4: 'numpad4',
    Numpad5: 'numpad5',
    Numpad6: 'numpad6',
    Numpad7: 'numpad7',
    Numpad8: 'numpad8',
    Numpad9: 'numpad9',
    NumpadMultiply: 'numpadMultiply',
    NumpadAdd: 'numpadAdd',
    NumpadSubtract: 'numpadSubtract',
    NumpadDecimal: 'numpadDecimal',
    NumpadDivide: 'numpadDivide',
    F1: 'f1',
    F2: 'f2',
    F3: 'f3',
    F4: 'f4',
    F5: 'f5',
    F6: 'f6',
    F7: 'f7',
    F8: 'f8',
    F9: 'f9',
    F10: 'f10',
    F11: 'f11',
    F12: 'f12',
    NumLock: 'numLock',
    ScrollLock: 'scrollLock',
    Semicolon: 'semicolon',
    Equal: 'equal',
    Comma: 'comma',
    Minus: 'minus',
    Period: 'period',
    Slash: 'slash',
    Backquote: 'backquote',
    BracketLeft: 'bracketLeft',
    Backslash: 'backslash',
    BracketRight: 'braketRight',
    Quote: 'quote',
};

export class NativeKeyboardController extends KeyboardController {
    private _backspace!: BooleanControl;
    private _tab!: BooleanControl;
    private _enter!: BooleanControl;
    private _shiftLeft!: BooleanControl;
    private _shiftRight!: BooleanControl;
    private _controlLeft!: BooleanControl;
    private _controlRight!: BooleanControl;
    private _altLeft!: BooleanControl;
    private _altRight!: BooleanControl;
    private _pause!: BooleanControl;
    private _capsLock!: BooleanControl;
    private _escape!: BooleanControl;
    private _space!: BooleanControl;
    private _pageUp!: BooleanControl;
    private _pageDown!: BooleanControl;
    private _end!: BooleanControl;
    private _home!: BooleanControl;
    private _arrowLeft!: BooleanControl;
    private _arrowUp!: BooleanControl;
    private _arrowRight!: BooleanControl;
    private _arrowDown!: BooleanControl;
    private _printScreen!: BooleanControl;
    private _insert!: BooleanControl;
    private _delete!: BooleanControl;
    private _key0!: BooleanControl;
    private _key1!: BooleanControl;
    private _key2!: BooleanControl;
    private _key3!: BooleanControl;
    private _key4!: BooleanControl;
    private _key5!: BooleanControl;
    private _key6!: BooleanControl;
    private _key7!: BooleanControl;
    private _key8!: BooleanControl;
    private _key9!: BooleanControl;
    private _keyA!: BooleanControl;
    private _keyB!: BooleanControl;
    private _keyC!: BooleanControl;
    private _keyD!: BooleanControl;
    private _keyE!: BooleanControl;
    private _keyF!: BooleanControl;
    private _keyG!: BooleanControl;
    private _keyH!: BooleanControl;
    private _keyI!: BooleanControl;
    private _keyJ!: BooleanControl;
    private _keyK!: BooleanControl;
    private _keyL!: BooleanControl;
    private _keyM!: BooleanControl;
    private _keyN!: BooleanControl;
    private _keyO!: BooleanControl;
    private _keyP!: BooleanControl;
    private _keyQ!: BooleanControl;
    private _keyR!: BooleanControl;
    private _keyS!: BooleanControl;
    private _keyT!: BooleanControl;
    private _keyU!: BooleanControl;
    private _keyV!: BooleanControl;
    private _keyW!: BooleanControl;
    private _keyX!: BooleanControl;
    private _keyY!: BooleanControl;
    private _keyZ!: BooleanControl;
    private _metaLeft!: BooleanControl;
    private _contextMenu!: BooleanControl;
    private _numpad0!: BooleanControl;
    private _numpad1!: BooleanControl;
    private _numpad2!: BooleanControl;
    private _numpad3!: BooleanControl;
    private _numpad4!: BooleanControl;
    private _numpad5!: BooleanControl;
    private _numpad6!: BooleanControl;
    private _numpad7!: BooleanControl;
    private _numpad8!: BooleanControl;
    private _numpad9!: BooleanControl;
    private _numpadMultiply!: BooleanControl;
    private _numpadAdd!: BooleanControl;
    private _numpadSubtract!: BooleanControl;
    private _numpadDecimal!: BooleanControl;
    private _numpadDivide!: BooleanControl;
    private _f1!: BooleanControl;
    private _f2!: BooleanControl;
    private _f3!: BooleanControl;
    private _f4!: BooleanControl;
    private _f5!: BooleanControl;
    private _f6!: BooleanControl;
    private _f7!: BooleanControl;
    private _f8!: BooleanControl;
    private _f9!: BooleanControl;
    private _f10!: BooleanControl;
    private _f11!: BooleanControl;
    private _f12!: BooleanControl;
    private _numLock!: BooleanControl;
    private _scrollLock!: BooleanControl;
    private _semicolon!: BooleanControl;
    private _equal!: BooleanControl;
    private _comma!: BooleanControl;
    private _minus!: BooleanControl;
    private _period!: BooleanControl;
    private _slash!: BooleanControl;
    private _backquote!: BooleanControl;
    private _bracketLeft!: BooleanControl;
    private _backslash!: BooleanControl;
    private _braketRight!: BooleanControl;
    private _quote!: BooleanControl;

    public get backspace(): BooleanControl { this._backspace ??= new UpdatableButtonControl(this, 'backspace'); return this._backspace; }
    public get tab(): BooleanControl { this._tab ??= new UpdatableButtonControl(this, 'tab'); return this._tab; }
    public get enter(): BooleanControl { this._enter ??= new UpdatableButtonControl(this, 'enter'); return this._enter; }
    public get shiftLeft(): BooleanControl { this._shiftLeft ??= new UpdatableButtonControl(this, 'shiftLeft'); return this._shiftLeft; }
    public get shiftRight(): BooleanControl { this._shiftRight ??= new UpdatableButtonControl(this, 'shiftRight'); return this._shiftRight; }
    public get controlLeft(): BooleanControl { this._controlLeft ??= new UpdatableButtonControl(this, 'controlLeft'); return this._controlLeft; }
    public get controlRight(): BooleanControl { this._controlRight ??= new UpdatableButtonControl(this, 'controlRight'); return this._controlRight; }
    public get altLeft(): BooleanControl { this._altLeft ??= new UpdatableButtonControl(this, 'altLeft'); return this._altLeft; }
    public get altRight(): BooleanControl { this._altRight ??= new UpdatableButtonControl(this, 'altRight'); return this._altRight; }
    public get pause(): BooleanControl { this._pause ??= new UpdatableButtonControl(this, 'pause'); return this._pause; }
    public get capsLock(): BooleanControl { this._capsLock ??= new UpdatableButtonControl(this, 'capsLock'); return this._capsLock; }
    public get escape(): BooleanControl { this._escape ??= new UpdatableButtonControl(this, 'escape'); return this._escape; }
    public get space(): BooleanControl { this._space ??= new UpdatableButtonControl(this, 'space'); return this._space; }
    public get pageUp(): BooleanControl { this._pageUp ??= new UpdatableButtonControl(this, 'pageUp'); return this._pageUp; }
    public get pageDown(): BooleanControl { this._pageDown ??= new UpdatableButtonControl(this, 'pageDown'); return this._pageDown; }
    public get end(): BooleanControl { this._end ??= new UpdatableButtonControl(this, 'end'); return this._end; }
    public get home(): BooleanControl { this._home ??= new UpdatableButtonControl(this, 'home'); return this._home; }
    public get arrowLeft(): BooleanControl { this._arrowLeft ??= new UpdatableButtonControl(this, 'arrowLeft'); return this._arrowLeft; }
    public get arrowUp(): BooleanControl { this._arrowUp ??= new UpdatableButtonControl(this, 'arrowUp'); return this._arrowUp; }
    public get arrowRight(): BooleanControl { this._arrowRight ??= new UpdatableButtonControl(this, 'arrowRight'); return this._arrowRight; }
    public get arrowDown(): BooleanControl { this._arrowDown ??= new UpdatableButtonControl(this, 'arrowDown'); return this._arrowDown; }
    public get printScreen(): BooleanControl { this._printScreen ??= new UpdatableButtonControl(this, 'printScreen'); return this._printScreen; }
    public get insert(): BooleanControl { this._insert ??= new UpdatableButtonControl(this, 'insert'); return this._insert; }
    public get delete(): BooleanControl { this._delete ??= new UpdatableButtonControl(this, 'delete'); return this._delete; }
    public get key0(): BooleanControl { this._key0 ??= new UpdatableButtonControl(this, 'key0'); return this._key0; }
    public get key1(): BooleanControl { this._key1 ??= new UpdatableButtonControl(this, 'key1'); return this._key1; }
    public get key2(): BooleanControl { this._key2 ??= new UpdatableButtonControl(this, 'key2'); return this._key2; }
    public get key3(): BooleanControl { this._key3 ??= new UpdatableButtonControl(this, 'key3'); return this._key3; }
    public get key4(): BooleanControl { this._key4 ??= new UpdatableButtonControl(this, 'key4'); return this._key4; }
    public get key5(): BooleanControl { this._key5 ??= new UpdatableButtonControl(this, 'key5'); return this._key5; }
    public get key6(): BooleanControl { this._key6 ??= new UpdatableButtonControl(this, 'key6'); return this._key6; }
    public get key7(): BooleanControl { this._key7 ??= new UpdatableButtonControl(this, 'key7'); return this._key7; }
    public get key8(): BooleanControl { this._key8 ??= new UpdatableButtonControl(this, 'key8'); return this._key8; }
    public get key9(): BooleanControl { this._key9 ??= new UpdatableButtonControl(this, 'key9'); return this._key9; }
    public get keyA(): BooleanControl { this._keyA ??= new UpdatableButtonControl(this, 'keyA'); return this._keyA; }
    public get keyB(): BooleanControl { this._keyB ??= new UpdatableButtonControl(this, 'keyB'); return this._keyB; }
    public get keyC(): BooleanControl { this._keyC ??= new UpdatableButtonControl(this, 'keyC'); return this._keyC; }
    public get keyD(): BooleanControl { this._keyD ??= new UpdatableButtonControl(this, 'keyD'); return this._keyD; }
    public get keyE(): BooleanControl { this._keyE ??= new UpdatableButtonControl(this, 'keyE'); return this._keyE; }
    public get keyF(): BooleanControl { this._keyF ??= new UpdatableButtonControl(this, 'keyF'); return this._keyF; }
    public get keyG(): BooleanControl { this._keyG ??= new UpdatableButtonControl(this, 'keyG'); return this._keyG; }
    public get keyH(): BooleanControl { this._keyH ??= new UpdatableButtonControl(this, 'keyH'); return this._keyH; }
    public get keyI(): BooleanControl { this._keyI ??= new UpdatableButtonControl(this, 'keyI'); return this._keyI; }
    public get keyJ(): BooleanControl { this._keyJ ??= new UpdatableButtonControl(this, 'keyJ'); return this._keyJ; }
    public get keyK(): BooleanControl { this._keyK ??= new UpdatableButtonControl(this, 'keyK'); return this._keyK; }
    public get keyL(): BooleanControl { this._keyL ??= new UpdatableButtonControl(this, 'keyL'); return this._keyL; }
    public get keyM(): BooleanControl { this._keyM ??= new UpdatableButtonControl(this, 'keyM'); return this._keyM; }
    public get keyN(): BooleanControl { this._keyN ??= new UpdatableButtonControl(this, 'keyN'); return this._keyN; }
    public get keyO(): BooleanControl { this._keyO ??= new UpdatableButtonControl(this, 'keyO'); return this._keyO; }
    public get keyP(): BooleanControl { this._keyP ??= new UpdatableButtonControl(this, 'keyP'); return this._keyP; }
    public get keyQ(): BooleanControl { this._keyQ ??= new UpdatableButtonControl(this, 'keyQ'); return this._keyQ; }
    public get keyR(): BooleanControl { this._keyR ??= new UpdatableButtonControl(this, 'keyR'); return this._keyR; }
    public get keyS(): BooleanControl { this._keyS ??= new UpdatableButtonControl(this, 'keyS'); return this._keyS; }
    public get keyT(): BooleanControl { this._keyT ??= new UpdatableButtonControl(this, 'keyT'); return this._keyT; }
    public get keyU(): BooleanControl { this._keyU ??= new UpdatableButtonControl(this, 'keyU'); return this._keyU; }
    public get keyV(): BooleanControl { this._keyV ??= new UpdatableButtonControl(this, 'keyV'); return this._keyV; }
    public get keyW(): BooleanControl { this._keyW ??= new UpdatableButtonControl(this, 'keyW'); return this._keyW; }
    public get keyX(): BooleanControl { this._keyX ??= new UpdatableButtonControl(this, 'keyX'); return this._keyX; }
    public get keyY(): BooleanControl { this._keyY ??= new UpdatableButtonControl(this, 'keyY'); return this._keyY; }
    public get keyZ(): BooleanControl { this._keyZ ??= new UpdatableButtonControl(this, 'keyZ'); return this._keyZ; }
    public get metaLeft(): BooleanControl { this._metaLeft ??= new UpdatableButtonControl(this, 'metaLeft'); return this._metaLeft; }
    public get contextMenu(): BooleanControl { this._contextMenu ??= new UpdatableButtonControl(this, 'contextMenu'); return this._contextMenu; }
    public get numpad0(): BooleanControl { this._numpad0 ??= new UpdatableButtonControl(this, 'numpad0'); return this._numpad0; }
    public get numpad1(): BooleanControl { this._numpad1 ??= new UpdatableButtonControl(this, 'numpad1'); return this._numpad1; }
    public get numpad2(): BooleanControl { this._numpad2 ??= new UpdatableButtonControl(this, 'numpad2'); return this._numpad2; }
    public get numpad3(): BooleanControl { this._numpad3 ??= new UpdatableButtonControl(this, 'numpad3'); return this._numpad3; }
    public get numpad4(): BooleanControl { this._numpad4 ??= new UpdatableButtonControl(this, 'numpad4'); return this._numpad4; }
    public get numpad5(): BooleanControl { this._numpad5 ??= new UpdatableButtonControl(this, 'numpad5'); return this._numpad5; }
    public get numpad6(): BooleanControl { this._numpad6 ??= new UpdatableButtonControl(this, 'numpad6'); return this._numpad6; }
    public get numpad7(): BooleanControl { this._numpad7 ??= new UpdatableButtonControl(this, 'numpad7'); return this._numpad7; }
    public get numpad8(): BooleanControl { this._numpad8 ??= new UpdatableButtonControl(this, 'numpad8'); return this._numpad8; }
    public get numpad9(): BooleanControl { this._numpad9 ??= new UpdatableButtonControl(this, 'numpad9'); return this._numpad9; }
    public get numpadMultiply(): BooleanControl { this._numpadMultiply ??= new UpdatableButtonControl(this, 'numpadMultiply'); return this._numpadMultiply; }
    public get numpadAdd(): BooleanControl { this._numpadAdd ??= new UpdatableButtonControl(this, 'numpadAdd'); return this._numpadAdd; }
    public get numpadSubtract(): BooleanControl { this._numpadSubtract ??= new UpdatableButtonControl(this, 'numpadSubtract'); return this._numpadSubtract; }
    public get numpadDecimal(): BooleanControl { this._numpadDecimal ??= new UpdatableButtonControl(this, 'numpadDecimal'); return this._numpadDecimal; }
    public get numpadDivide(): BooleanControl { this._numpadDivide ??= new UpdatableButtonControl(this, 'numpadDivide'); return this._numpadDivide; }
    public get f1(): BooleanControl { this._f1 ??= new UpdatableButtonControl(this, 'f1'); return this._f1; }
    public get f2(): BooleanControl { this._f2 ??= new UpdatableButtonControl(this, 'f2'); return this._f2; }
    public get f3(): BooleanControl { this._f3 ??= new UpdatableButtonControl(this, 'f3'); return this._f3; }
    public get f4(): BooleanControl { this._f4 ??= new UpdatableButtonControl(this, 'f4'); return this._f4; }
    public get f5(): BooleanControl { this._f5 ??= new UpdatableButtonControl(this, 'f5'); return this._f5; }
    public get f6(): BooleanControl { this._f6 ??= new UpdatableButtonControl(this, 'f6'); return this._f6; }
    public get f7(): BooleanControl { this._f7 ??= new UpdatableButtonControl(this, 'f7'); return this._f7; }
    public get f8(): BooleanControl { this._f8 ??= new UpdatableButtonControl(this, 'f8'); return this._f8; }
    public get f9(): BooleanControl { this._f9 ??= new UpdatableButtonControl(this, 'f9'); return this._f9; }
    public get f10(): BooleanControl { this._f10 ??= new UpdatableButtonControl(this, 'f10'); return this._f10; }
    public get f11(): BooleanControl { this._f11 ??= new UpdatableButtonControl(this, 'f11'); return this._f11; }
    public get f12(): BooleanControl { this._f12 ??= new UpdatableButtonControl(this, 'f12'); return this._f12; }
    public get numLock(): BooleanControl { this._numLock ??= new UpdatableButtonControl(this, 'numLock'); return this._numLock; }
    public get scrollLock(): BooleanControl { this._scrollLock ??= new UpdatableButtonControl(this, 'scrollLock'); return this._scrollLock; }
    public get semicolon(): BooleanControl { this._semicolon ??= new UpdatableButtonControl(this, 'semicolon'); return this._semicolon; }
    public get equal(): BooleanControl { this._equal ??= new UpdatableButtonControl(this, 'equal'); return this._equal; }
    public get comma(): BooleanControl { this._comma ??= new UpdatableButtonControl(this, 'comma'); return this._comma; }
    public get minus(): BooleanControl { this._minus ??= new UpdatableButtonControl(this, 'minus'); return this._minus; }
    public get period(): BooleanControl { this._period ??= new UpdatableButtonControl(this, 'period'); return this._period; }
    public get slash(): BooleanControl { this._slash ??= new UpdatableButtonControl(this, 'slash'); return this._slash; }
    public get backquote(): BooleanControl { this._backquote ??= new UpdatableButtonControl(this, 'backquote'); return this._backquote; }
    public get bracketLeft(): BooleanControl { this._bracketLeft ??= new UpdatableButtonControl(this, 'bracketLeft'); return this._bracketLeft; }
    public get backslash(): BooleanControl { this._backslash ??= new UpdatableButtonControl(this, 'backslash'); return this._backslash; }
    public get braketRight(): BooleanControl { this._braketRight ??= new UpdatableButtonControl(this, 'braketRight'); return this._braketRight; }
    public get quote(): BooleanControl { this._quote ??= new UpdatableButtonControl(this, 'quote'); return this._quote; }

    private _activatedKeys: UpdatableButtonControl[] = [];

    public get activatedKeys(): readonly BooleanControl[] {
        return this._activatedKeys;
    }

    private readonly _onKeyDown = (event: KeyboardEvent): void => {
        const name = KEYBOARD_KEYCODES_MAP[event.code];
        if (name) {
            const control = this[name] as UpdatableButtonControl;
            if (!this._activatedKeys.includes(control)) {
                control.updateValue(true);
                this._activatedKeys.push(control);
            }
        }
    };
    private readonly _onKeyUp = (event: KeyboardEvent): void => {
        const name = KEYBOARD_KEYCODES_MAP[event.code];
        if (name) {
            const control = this[name] as UpdatableButtonControl;
            const index = this._activatedKeys.indexOf(control);
            if (index !== -1) {
                control.updateValue(false);
                removeAtIndex(this._activatedKeys, index);
            }
        }
    };
    private readonly _onBlur = (): void => {
        for (let i = 0; i < this._activatedKeys.length; i++) {
            this._activatedKeys[i].updateValue(false);
        }
        this._activatedKeys.length = 0;
    };

    public init(keyDownEvent?: KeyboardEvent): void {
        if (keyDownEvent) {
            this._onKeyDown(keyDownEvent);
        }
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('blur', this._onBlur);
    }

    protected override _activationCheck(): boolean {
        return this._activatedKeys.length > 0;
    }

    protected override _onDisconnect(): void {
        this._onBlur();
        removeEventListener('keydown', this._onKeyDown);
        removeEventListener('keyup', this._onKeyUp);
        removeEventListener('blur', this._onBlur);
    }
}
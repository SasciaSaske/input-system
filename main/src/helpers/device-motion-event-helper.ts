import { removeElementUnsorted } from "./array-helper.js";
import { EVENT_ONCE_OPTION } from "./event-helper.js";

export interface DeviceMotionEventMap {
    "devicemotion": DeviceMotionEvent;
    "deviceorientation": DeviceOrientationEvent;
}

interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
    requestPermission(absolute?: boolean): Promise<PermissionState>;
}

export const supported = typeof DeviceMotionEvent !== 'undefined';
export let permission = supported && typeof (DeviceMotionEvent as unknown as DeviceMotionEventWithPermission).requestPermission === 'undefined';

let _motionListeners: ((event: DeviceMotionEvent) => void)[] | null = null;
let _orientationListeners: ((event: DeviceOrientationEvent) => void)[] | null = null;

export function addEventListenerOnPermission<K extends keyof DeviceMotionEventMap>(type: K, listener: (event: DeviceMotionEventMap[K]) => void): void;
export function addEventListenerOnPermission(type: string, listener: EventListener): void;
export function addEventListenerOnPermission(type: string, listener: EventListener): void {
    if (!supported) return;
    if (permission) {
        window.addEventListener(type, listener, EVENT_ONCE_OPTION);
    } else if (type === 'deviceorientation') {
        _orientationListeners ??= [];
        _orientationListeners.push(listener);
    } else if (type === 'devicemotion') {
        _motionListeners ??= [];
        _motionListeners.push(listener);
    }
}

export function removeEventListenerOnPermission<K extends keyof DeviceMotionEventMap>(type: K, listener: (event: DeviceMotionEventMap[K]) => void): void;
export function removeEventListenerOnPermission(type: string, listener: EventListener): void;
export function removeEventListenerOnPermission(type: string, listener: EventListener): void {
    if (!supported) return;
    if (permission) {
        window.removeEventListener(type, listener);
    } else if (type === 'deviceorientation' && _orientationListeners) {
        removeElementUnsorted(_orientationListeners, listener);
    } else if (type === 'devicemotion' && _motionListeners) {
        removeElementUnsorted(_motionListeners, listener);
    }
}

export const requestPermission = (): void => {
    if (!supported || permission) return;
    (DeviceMotionEvent as unknown as DeviceMotionEventWithPermission).requestPermission()
        .then((response: PermissionState): void => {
            if (response === 'granted') {
                permission = true;
                let i: number;
                if (_orientationListeners) {
                    for (i = 0; i < _orientationListeners.length; i++) {
                        window.addEventListener('deviceorientation', _orientationListeners[i], EVENT_ONCE_OPTION);
                    }
                    _orientationListeners = null;
                }
                if (_motionListeners) {
                    for (i = 0; i < _motionListeners.length; i++) {
                        window.addEventListener('devicemotion', _motionListeners[i], EVENT_ONCE_OPTION);
                    }
                    _motionListeners = null;
                }
            }
        });
};
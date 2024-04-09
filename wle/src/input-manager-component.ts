import { Component } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { WLInputManager } from './wl-input-manager.js';

export class InputManagerComponent extends Component {
    static override TypeName = 'input-manager-component';

    // Pointers
    @property.enum(['canvas', 'document'])
    pointerTargetType!: number;

    @property.bool(false)
    mouseSupport!: boolean;
    @property.bool(false)
    touchSupport!: boolean;
    @property.bool(false)
    penSupport!: boolean;

    // Keyboard
    @property.bool(false)
    keyboardSupport!: boolean;

    // Gamepads
    @property.bool(false)
    gamepadSupport!: boolean;

    //XR
    @property.bool(false)
    xrGamepadSupport!: boolean;
    @property.bool(false)
    xrHandSupport!: boolean;
    @property.bool(false)
    xrHeadSupport!: boolean;
    @property.bool(false)
    xrScreenSupport!: boolean;

    // Sensors
    @property.enum(['canvas', 'custom'])
    motionPermissionButtonType!: number;
    @property.string()
    motionPermissionButtonID!: string;

    @property.bool(false)
    orientationSupport!: boolean;
    @property.bool(false)
    accelerometerSupport!: boolean;
    @property.bool(false)
    linearAccelerationSupport!: boolean;
    @property.bool(false)
    gravitySupport!: boolean;
    @property.bool(false)
    gyroscopeSupport!: boolean;

    public override init(): void {
        const inputManager = WLInputManager.get(this.engine);

        const pointerTarget = this.pointerTargetType === 0
            ? this.engine.canvas
            : document;

        if (this.mouseSupport) inputManager.pointer.mouse.native.enable(pointerTarget);
        if (this.touchSupport) inputManager.pointer.touch.native.enable(pointerTarget);
        if (this.penSupport) inputManager.pointer.pen.native.enable(pointerTarget);

        if (this.keyboardSupport) inputManager.keyboard.native.enable();

        if (this.gamepadSupport) inputManager.gamepad.native.enable();

        if (this.xrGamepadSupport) inputManager.xr.gamepad.native.enable();
        if (this.xrHandSupport) inputManager.xr.hand.native.enable();
        if (this.xrHeadSupport) inputManager.xr.viewer.head.native.enable();
        if (this.xrScreenSupport) inputManager.xr.viewer.screen.native.enable();

        let motionPermissionButton: HTMLElement;
        if (this.motionPermissionButtonType === 0) {
            motionPermissionButton = this.engine.canvas;
        } else {
            let button = document.getElementById(this.motionPermissionButtonID);
            if (!button) {
                console.warn(`The provided ID for the button that requests permission to access the  movement sensors on iOS devices did not return any element.`);
                button = this.engine.canvas;
            }
            motionPermissionButton = button;
        }

        inputManager.sensor.orientation.native.requestPermissionOnElementClick(motionPermissionButton);
        if (this.orientationSupport) inputManager.sensor.orientation.native.enable();
        if (this.accelerometerSupport) inputManager.sensor.accelerometer.native.enable();
        if (this.linearAccelerationSupport) inputManager.sensor.linearAcceleration.native.enable();
        if (this.gravitySupport) inputManager.sensor.gravity.native.enable();
        if (this.gyroscopeSupport) inputManager.sensor.gyroscope.native.enable();
    }
}
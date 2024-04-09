import { InputController } from "./input-controller.js";

export interface GamepadAPIController extends InputController {
    get gamepad(): Gamepad;
}
# Input System

This is an easy-to-use and easily extendable [Input System](#input-system) capable of managing various types of input devices through a dedicated event-based system complemented by polling capabilites.

## Customization
You can extend the system by writing your own [Controllers](#controller), [Controls](#control), [Control Activators](#control-activator), [Modifiers](#modifier) and [Triggers](#trigger) using the provided classes and interfaces.

## Performance
Dynamically allocated objects are cached, and instantiated only when needed.
Most calculations are performed only in specific circumstances and have been deferred to the initial setup or when a [Controller](#controller) is connected or disconnected, allowing for a lighter update cycle.

## Ease of Use and Type Safety
The system prioritizes ease of use and safety with a strongly typed implementation. This approach ensures that all available options are suggested during setup and helps prevent common errors.

# Overview
Here's a brief overview of the base components and concepts of the Input System.

## Input Manager
Manages all the [Controllers](#controller), provides information on all the connected and disconnected ones, and notifies you when one of them is connected, disconnected or set as currently in use, both globally and for each category of [Controller](#controller).
Organizes [Actions](#action) through [Action Groups](#action-group) , allowing for easy access and management.

## Action Group
A folder-like system to store and organize the [Actions](#action), they can be enabled/disabled or paused/resumed to affect specific groups of them as needed. 

## Action
Provides a value by retrieving raw inputs from the [Bindings](#binding), returning the most probable user interaction match to prevent unexpected behaviors in case of multiple simultaneous interactions.
If no [Control](#control) within a [Binding](#binding) is activated in the frame (by a physical input that can be also altered with a [Control Activator](#control-activator)), the [Action](#action) returns either its *default value* or the first [State Control](#control)'s [Binding](#binding), if available.
Event listeners can register to it and be notified when the [Action](#action) has a specific state.
The state is managed by the [Trigger](#trigger) and defines if the [Action](#action) is `waiting` for an input, is `started`, is `performing` or is `ended` in the current frame, allowing more flexibility when polling and raising events accordingly.

## Binding
Contains the [Controls](#control) from which the [Action](#action) retrieves the raw values from the input devices, enabling modifications via [Converters](#converter) and [Modifiers](#modifier).
These [Controls](#control) are aquired through paths that can specify the precise type of the [Controller](#controller), allowing the [Action](#action) to choose the most suitable [Binding](#binding) to retrieve the value from when more of them match the hardware (like get the `primaryButton` for every `xr-gamepad`, but get the `touchpadButton` when the `xr-gamepad` has a profile with no face buttons or thumbstick).
When the [Binding](#binding) is Composite, it contains more paths (even from different [Controllers](#controller)) allowing every possible input combination and interaction through [Converters](#converter), [Modifiers](#modifier) and [Triggers](#trigger).

## Converter
Converts a [Control](#control) retrieved by the [Binding](#binding) to match the type of the needed [Action](#action).
For example, it converts the WASD keys [Controls](#control) to a `Vector2` to be compatible with an [Action](#action) that moves the player, or converts the position of the index and thumb finger tips to a `boolean` when closer than a certain distance for a pinch gesture.
When the [Converter](#converter) returns a `boolean`, it can also be set as [Control Activator](#control-activator).

## Control Activator
Modifies the activation requirement (by default any physical interation) of the specified [Binding](#binding)'s bound [Controls](#control).
Useful in specific cases such as checking the [Control](#control)'s [Controller](#controller) in local multiplayer scenarios or managing the behaviour of [State Controls](#control) that are always set as activated (like pointer position, device orientation, xr-controller poses, etc.).

## Modifier
Modifies the returned values of both [Actions](#action) and [Bindings](#binding), maintaining their current type through adjustments such as inversion, clamping, scaling, normalization, or deadzone control.
For further customization, they can be chained together and applied individually to each [Binding](#binding) and [Action](#action): those applied to the [Binding](#binding) are exclusive to that [Binding](#binding), while those applied to the [Action](#action) are applied to every [Binding](#binding) contained within it (after its own, if any).

## Trigger
Updates the State of the [Action](#action) according to the [Action](#action)'s provided value.
By default, it triggers a state change when the retrieved value differs from the [Action](#action)'s default one, but other common [Triggers](#trigger) are interactions like hold, tap, multi-tap, sequence of buttons or any [Converter](#converter) that returns a boolean.
Remember that if a [Binding](#binding) has its own [Trigger](#trigger), that [Trigger](#trigger) will overwrite the [Action](#action)'s [Trigger](#trigger) when that [Binding](#binding) is the active one of the [Action](#action).

## Controller
Code representation of a physical input device that contains a [Control](#control) for every readable input.
The main classes of native [Controllers](#controller) are managed by the respective [Controller Managers](#controller-manager) and include:
- sensor
    - `orientaion-sensor`
    - `accelerometer`
    - `gyroscope`
    - `gravity-sensor`
    - `linear-acceleration-sensor`
- pointer
    - `mouse`
    - `pen`
    - `touchscreen`
- `keyboard`
- `gamepad` (supports accurate mapping for the majority of the non-standard gamepads)
- xr
    - xr-viewer
        - `xr-head`
        - `xr-screen`
    - `xr-gamepad`
        - left
        - right
    - `xr-hand`
        - left
        - right

## Control
Code representation of a readable input, provides the raw value read from the hardware and defines if there have been physical interactions with it.
Can contain more specific [Controls](#control) for organization e readability purpose (for example, Thumbstick contains X Axis and Y Axis).
Certain [Controls](#control), such as position and rotations, are identified as [State Controls](#control). Their state is always set as activated and they are therefore managed differently by the [Actions](#action) and the [Bindings](#binding).

Common [Control](#control) return types are:
- `boolean` for buttons pressed or touched state
- `number` for buttons values and axis
- `Vector2` for 2D positions and axes
- `Vector3` for 3D positions and linear/angular accellerations
- `Vector4` for 3D rotations

The `Vector` types, besides having elements indexed by letters, can also be accessed by numbers, making them `ArrayLike<number>` as well.

## Controller Manager
A manager for a specific category of [Controller](#controller): provides the current [Controller](#controller) of that category, all the connected ones for categories that support multiple simultaneous [Controllers](#controller) of the same class (like Gamepads), and notifies you when one of them is connected, disconnected, or set as currently in use for that category.
It may also include other [Controller Managers](#controller-manager) for [Controllers](#controller) of a subcategory (for example *Mouse*, *Pen*, and *Touch Managers* fall under the *Pointer Manager* and are therefore contained within it.)

# Usage

## Installation
You can import the [Input System](#input-system) to your project through npm using the following command:
```
npm install input-system
```

## Setup
You can create the [Input Manager](#input-manager) by:
```typescript
const inputManager = new InputManager();
```
and update it with:
```typescript
inputManager.update(deltaTime);
```

You can enable/disable each category of native [Controller](#controller) from its manager, which is accessible directly from the [Input Manager](#input-manager):
```typescript
// Sensors
// For performance and battery reasons, it's better to enable them only when needed
inputManager.sensor.orientation.native.enable()
inputManager.sensor.accelerometer.native.enable()
inputManager.sensor.linearAcceleration.native.enable()
inputManager.sensor.gravity.native.enable()
inputManager.sensor.gyroscope.native.enable()

// Pointers
// For the pointers you can specify the event target of the PointerEvent
// (i.e. the canvas of your game, by default set to "document")
inputManager.pointer.mouse.native.enable(target);
inputManager.pointer.pen.native.enable(target);
inputManager.pointer.touch.native.enable(target);

// Keyboard
inputManager.keyboard.native.enable()

// Gamepads
inputManager.gamepad.native.enable()

//XR
inputManager.xr.gamepad.native.enable();
inputManager.xr.hand.native.enable();
inputManager.xr.viewer.head.native.enable();
inputManager.xr.viewer.screen.native.enable();
```

For iOS Devices, you must request browser permission through a user gesture to access motion sensor data. This can be done easily by providing an `HTMLElement` (like a button or the game's canvas) to this function:
```typescript
inputManager.sensor.orientation.native.requestPermissionOnElementClick(element);
```

Regarding WebXR, you need to call certain functions when starting or ending an `XRSession`:
```typescript
navigator.xr.requestSession('immersive-vr').then((session) => {
    // Call this when XRSession starts
    inputManager.xr.native.onSessionStart()
    ...
    session.addEventListener('end', ()=> {
        // Call this when XRSession ends
        inputManager.xr.native.onSessionEnd();
        ...
    });
    ...
});
```
And create and provide to the system an `XRContext` object that must be kept updated:
```typescript
// Assign your XRContext object to the input manager
inputManager.xr.native.context = myXRContext;

xrSession.requestAnimationFrame((time, xrFrame) => {
    // Update it as you please
    myXRContext.update(xrFrame);
    ...
});
```

## Wonderland Engine Users
If you're a Wonderland Engine user, you don't have to worry about setting up the [Input Manager](#input-manager). The `WLInputManager` class handles everything for you: it updates itself through the `onPreRender` event and manages all the XR functionality, supporting multi-engine and multi-scene setups.

You can access the [Input Manager](#input-manager) from anywhere using:
```typescript
WLInputManager.get(engine);
```
or
```typescript
WLInputManager.current;
```
if you don't need multi-engine support.

Keep in mind that if you're not using the default `input-manager-component`, which serves just as a visual [Input Manager](#input-manager) initializer for the editor, you should access the [Input Manager](#input-manager) by providing the current engine at least once to make it work.

## Read a value from a controller
In case you want to get the left XR [Controller](#controller) you're currently using, you can use:
```typescript
const controller = inputManager.xr.gamepad.left.current;
```
And, if you want to retrieve the value of the grip button of that [Controller](#controller) in a 0-1 range, you can:
```typescript
controller.grip.value.readValue();
```
or, if you prefer, by:
```typescript
controller.getControl('grip').value.readValue();
```

You can also retrieve the last globally used [Control](#control) with:
```typescript
const currentController = inputManager.currentController;
```
and check every [Controller](#controller) category, mapping, vendor or model based on the class:
```typescript
if(currentController.class === 'xr-gamepad'){
    console.log(`this is a ${currentController.model} gamepad!`);
}
```
In combination with the `currentControllerChanged` event, you can, for example, adjust the UI of your game based on the current [Controller](#controller) being used.

## Make the controller vibrate

If the [Controller](#controller) implements the `HapticController` interface (like the `GamepadController` and the `VRGamepadController`), you can make it vibrate by:
```typescript
controller.haptic.start(duration, intensity);
```

If the hardware is based on two big rumble motors (`gamepads`), you can also set the strong and weak intesity parameters to rapresent the intensity of the actual big and small motors (default set as the same value of `strongIntensity`).
```typescript
gamepad.haptic.start(duration, strongIntensity, weakIntensity);
```

If the hardware is based on other kind of motors (`xr-gamepads`), you can also set the index of the motor you wish to activate (default set to `0`).
```typescript
gamepad.haptic.start(duration, intensity, index);
```

If no intensity is passed, the default value would be set to `1` (the maximum).
Unlike the Gamepad API functions on which this system is based, there is no 5-second limit for the duration of the vibration. Thanks to this, you can set is as `Infinity`, which is also the default value if no duration is passed.

Take into account that not all the browsers support all type of vibration and that the function may behaves differently depending on the hardware.
You can check if the vibration is currently supported with:
```typescript
controller.haptic.supported;
```

To make the [Controller](#controller) stop vibrating, you just need to call:
```typescript
controller.haptic.stop();
```

## Setup an Action
To be able to use an [Action](#action), you must first get an [Action Group](#action-group) (if not existing, it will be automatically created) to which you can add it:
```typescript
const baseActions = inputManager.getActionGroup('baseActions');
```
You can also add to the [Input Manager](#input-manager) a previously created layer:
```typescript
const baseActions = new InputActionGroup('baseActions');
inputManager.addActionGroup(baseActions);
```

Keep in mind that you can add in the same way an [Action Group](#action-group) inside another [Action Group](#action-group):
```typescript
const subActions = baseActions.getActionGroup('subActons');
// or
const subActions = baseActions.addActionGroup(new InputActionGroup('subActons'));
```

Than, you can finally do the same thing for the [Action](#action):
```typescript
const moveAction = new InputAction('move', Vector2.zero);
baseActions.addAction(moveAction);
```
You have to provide a default value for the [Action](#action) from which it will define its type.

You can also add a [Trigger](#trigger) using:
```typescript
// The action will be triggered when the returned value is true for 0.5 seconds
moveAction.setTrigger('hold', 0.5);
// or
moveAction.setTrigger(new HoldTrigger(0.5));
```
Note that if the Action type does not extend a primitive type or an ArrayLike of a primitive, the [Trigger](#trigger) is mandatory.

Now we need to create a [Binding](#binding), so that the [Action](#action) knows from which [Control](#control) should retrieve the input value from.
Let's say that we need to get a direction vector from the WASD keys of the keyboard, we can check for the key values with a [Composite Binding](#binding) and transform them in a two dimensional vector through a [Converter](#converter):
```typescript
const moveKeyboardBinding = new InputCompositeBinding<[boolean, boolean, boolean, boolean], Vector2>()
    .setConverter('compositeVector2')
    .setPath(0, 'keyboard', 'keyA')
    .setPath(1, 'keyboard', 'keyD')
    .setPath(2, 'keyboard', 'keyW')
    .setPath(3, 'keyboard', 'keyS');
```
Or maybe a simple direction from a gamepad with a deadzone applied:
```typescript
// You can also assign a name to the Binding to retrieve it easily.
const moveGamepadBinding = new InputSingleBinding<Vector2>('gamepad-stick')
    .setPath('gamepad', 'leftStick')
    .addModifier('stickDeadZone', 0.2, 0.9);
```
Thanks to the typed nature of the system, all the possible combination are suggested to you in the setup phase.

We can now add the [Binding](#binding) to the action:
```typescript
moveAction.addBinding(moveKeyboardBinding);
```
and some [Modifiers](#modifier) that will additionaly apply to every [Binding](#binding)'s provided value of the [Action](#action):
```typescript
moveAction.addModifier(someModifier);
```
Do not forget that every [Modifier](#modifier) can be chained with others for more complex tasks.
```typescript
moveAction.addModifier(myFirstModifier)
    .addModifier(mySecondModifier)
    .addModifier(myThirdModifier);
```

Now, if we want to use an event base approach, we can finally add a callback to the [Action](#action) based on the current state of it.
```typescript
moveAction.addEventListener('performing', moveCallback);
```

For simplicity and readability purpose, all the methods can be chainded together in the way you prefer:
```typescript
inputManager.getActionGroup('player')
    .addAction(new InputAction('move', Vector2.zero)
        .addBinding(new InputSingleBinding<Vector2>()
            .setPath('gamepad', 'leftStick')
            .addModifier('stickDeadZone'))
        .addBinding(new InputSingleBinding<Vector2>()
            .setPath('gamepad', 'dpad'))
        .addBinding(new InputSingleBinding<Vector2>()
            .setPath('left/xr-gamepad', 'thumbstick')
            .addModifier('stickDeadZone'))
        .addBinding(new InputCompositeBinding<[boolean, boolean, boolean, boolean], Vector2>()
            .setConverter('compositeVector2')
            .setPath(0, 'keyboard', 'keyA')
            .setPath(1, 'keyboard', 'keyD')
            .setPath(2, 'keyboard', 'keyW')
            .setPath(3, 'keyboard', 'keyS'))
        .addEventListener('performing', (action, deltaTime) => {
            player.move(
                action.readValue().x * deltaTime,
                action.readValue().y * deltaTime);
        }));
```

Take note that you can activate, deactivate, create, remove, assign and modify everything in the order you want and even in the middle of the gameplay with multiple connected [Controllers](#controller).

## Write Control Paths
When you create or add a [Binding](#binding) to an [Action](#action), it will be internally sorted based on how specific its [Control](#control) paths are, and the [Controls](#control) are then bound accordingly.

This means that in a case like that:
```typescript
action.addBinding(new InputSingleBinding<bool>()
        .setPath('gamepad/standard/sony-dualshock-4', 'crossButton'))
    .addBinding(new InputSingleBinding<bool>()
        .setPath('gamepad', 'rightFace'))
```
Even if the DualShock 4 is also a gamepad, it will be bound only to the [Bindings](#binding) with the more specific path that matches that controller.

You can also use a regular expressions to define a [Controller](#controller) path:
```typescript
action.addBinding(new InputSingleBinding<bool>()
        // The '*' matches any type of that section
        // The regular expression is enclosed within curly braces and supports flags
        .setPath('gamepad/*/{/sony/}', 'crossButton'))
    .addBinding(new InputSingleBinding<bool>()
        .setPath('gamepad/*/{/044f/}', 'button22'))
```
The path can also be provided in a single string format with the singature `<controllerPath>/controlPath`.
```typescript
action.addBinding(new InputSingleBinding<bool>()
        .setPath('<gamepad/*/{/sony/}>/crossButton'))
```

Path signatures for native [Controllers](#controller) are (anyting but the class is optional):
- The `class` for the [Sensors](#control): `orientation-sensor`
- The `class/type` for the [Pointers](#control): `pointer/mouse`
- The `class` for the [Keyboard](#control): `keyboard`
- The `class/mapping/model` for the [Gamepads](#control): `gamepad/standard/microsoft-xinput`
- The `class/type` for the XR [Viewers](#control): `xr-viewer/head`
- The `handedness/class/mapping/model` for the [XR Gamepads](#control): `left/xr-gamepad/generic-trigger-squeeze-thumbstick/meta-quest-touch-plus`
- The `handedness/class/` for the [XR Hands](#control): `left/xr-hand`

## Extra Binding Setup Tips
You can also add custom [Control Activator Modifiers](#control-activator) for individual [Controls](#control) or, in the case of [Comopsite Bindings](#binding), for all currently active [Controls](#control).
```typescript
// The binding will only listen for the Bottom Face Control of the Player One Controller
const binding = new InputSingleBinding<boolean>()
    .setPath('gamepad', 'bottomFace')
    .setControlActivator('controller', playerOneController);
```

You can also set a [Converter](#converter) that returns a `boolean` as a [Control Activator](#control-activator):
```typescript
// Despite dealing with State Controls, the binding will only be activated when the tips of the index and the thumb are closer than 1cm.
const binding = new InputCompositeBinding<[Vector3, Vector3], boolean>()
    .setConverterAsControlActivator('lessOrEqualDistance', 0.01)
    .setPath(0, 'right/xr-hand', 'indexTip/position')
    .setPath(1, 'right/xr-hand', 'thumbTip/position');
```
or, if you want still be able to get the positions as values from the [Action](#action):
```typescript
const binding = new InputCompositeBinding<[Vector3, Vector3]>()
    .setPath(0, 'right/xr-hand', 'indexTip/position')
    .setPath(1, 'right/xr-hand', 'thumbTip/position')
    .setCompositeControlActivator('lessOrEqualDistance', 0.01);
```

Every [Converter](#converter), [Modifier](#modifier), [Trigger](#trigger), and [Activator](#control-activator) can also be provided as an arrow function for faster custom implementations, as mentioned in the corresponding add/set/replace function signatures.
```typescript
binding.addModifier((value) => value * value);
```



## Rebind an Action
You can rebind an [Action](#action) by accessing the corresponding [Binding](#binding) from it and changing its [Control](#control) path by overriding the current one.
Remember that if the reference of the [Binding](#binding) is not saved, you need to retrieve it through the `getBinding` function:

```typescript
action.getBinding<InputSingleBinding<boolean>>(
    (binding) => binding.path?.controllerPath[0] === 'gamepad')!
    .setPath('gamepad', 'bottomFace');
// or by name
action.getBinding<InputSingleBinding<boolean>>('my-gamepad-binding')!
    .setPath('gamepad', 'bottomFace');
```

You can also listen for user input when changing a [Control](#control) path:
```typescript
if (gamepad.getActivatedButtons(buttons).length) {
    binding.setPath('gamepad', buttons[0].getPath());
}
```

For more important changes just remove the old [Binding](#binding) and add a new one:
```typescript
moveAction.removeBinding(binding);
```
Don't forget that if you need to adjust specific parameters of a [Modifier](#modifier) like a `DeadZone`, you can cache it before assigning it and make changes afterward.

## Get a value from an Action

If you prefer a polling based approach instead of a event based one, you can get the value of the [Action](#action) in a particular state with

```typescript
if(moveAction.state === 'performing') {
    player.move(
            action.readValue().x * deltaTime,
            action.readValue().y * deltaTime);
}
```

## Disable or Pause an Action
Actions and ActionGroups can be enabled/disabled or paused/resumed, affecting the hierarchy.

- `disable`: Controls are no more automatically bound when a Controller connects to the system. This is useful when there are many actions that should not be used for a while (reactivating them creates minimal overhead)
- `pause`: The return value is not updated, and related events are not raised. This is useful when actions need to be disabled for short intervals.

## Create Custom Converterters, Modifiers, Triggers and Control Activators
You can create custom [Converters](#converter), [Modifiers](#modifier), [Triggers](#trigger), and [Control Activators](#control-activator) by implementing the respective interfaces: `InputConverter`, `InputModifier`, `InputTrigger`, `InputControlActivationModifier` or `InputCompositeControlActivationModifier`.
Depending on the [Controls](#control) and [Action](#action) types, these components can be interchangeable.

## Create Custom Controller
To create a custom [Controller](#controller), you just need to extend the `InputController` class, have a constructor with no parameter, and set it up through the `init` function to take advantage of the pooling capabilities of the system.
Note that if you want to create a [Controller](#controller) of a particular category, you should derive your [Controller](#controller) from the base [Controller](#controller) of that category (for example, derive from `GamepadController` if you want to create a new type of gamepad).

## Create Custom Controls
The same applies to [Controls](#control). While there are already many versatile [Controls](#control) available, you can create your own by implementing the `InputControl` interface or by extending the `BaseInputControl` class.

## Create Custom Controls
The same applies to [Controls](#control). While there are already many versatile [Controls](#control) available, you can create your own by implementing the `InputControl` interface or by extending the `BaseInputControl` class.

## More To Come
The actual documentation will be released in the future, and this is just a basic overview of the system's usage. Keep in mind that this is still a beta, and there may be substantial changes in the future.

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
**The entry point of the system.**
- Manages all the [Controllers](#controller):
    - Provides information on the current, connected, and disconnected [Controllers](#controller) and notifies for any related changes.
    - Organizes [Controllers](#controller) by category through [Controller Managers](#controller-manager).
- Organizes [Actions](#action) through [Action Groups](#action-group).

## Controller
**Code representation of a physical input device that contains a [Control](#control) for every readable input.**

The [Controllers](#controller) supported by default are: `mouse`,`touchscreen`,`pen`,  `keyboard`, `gamepad`, `xr-head`, `xr-screen`, `xr-gamepad`, `xr-hand`, `orientaion-sensor`, `accelerometer`, `gyroscope`, `gravity-sensor`, `linear-acceleration-sensor`.

## Control
**Code representation of a readable input.**
- Provides the raw value read from the hardware.
- Defines if there have been physical interactions with it ([Controls](#control) such as positions and rotations are always set as activated and therefore set as [State Controls](#control)).

Can contain more specific [Controls](#control) for organization e readability purpose (for example, Thumbstick contains X Axis and Y Axis).

Common [Control](#control) return types are:
- `boolean` for buttons pressed or touched state.
- `number` for buttons values and axis.
- `Vector2` for 2D positions and axes.
- `Vector3` for 3D positions and linear/angular accellerations.
- `Vector4` for 3D rotations.
(The `Vector` types, besides having elements indexed by letters, can also be accessed by numbers, making them `ArrayLike<number>` as well).

## Controller Manager
**Manages all the [Controllers](#controller) of a specific category.**
- Provides the current [Controller](#controller)
- Provides all the connected [Controllers](#controller) (only for categories that support multiple simultaneous [Controllers](#controller) like `gamepads`)
- Notifies for any [Controller](#controller) connected, disconnected, or set as currently in use.

The available managers and sub-managers are:
- Pointer
    - Mouse
    - Touchscreen
    - Pen
- Keyboard
- Gamepad
- XR
    - Viewer
        - Head
        - Screen
    - Gamepad
        - Left
        - Right
     - Hand
        - Left
        - Right
- Sensor
    - Orientation
    - Accelerometer
    - Gyroscope
    - Gravity
    - Linear Acceleration

## Action
**The representation of the actual action performed as a result of desired inputs.**
(select, jump, move, grab, etc.)

- Provides a value by managing the [Bindings](#binding) from which it retrieves the raw input values.
- Defines a state indicating whether the [Action](#action) is `waiting` for an interaction, is `started`, is `performing` or is `ended`, and raises events accordingly.

If there are multiple matching interactions by the user, they are checked in order, from the last to the oldest previously registered, to prevent unexpected behaviors.
If there is no matching user interaction, it returns either a default value or the value of the first available matching [State Control](#control).

## Action Group
**A folder-like system for the [Actions](#action):**

- Stores and organizes [Actions](#action).
- Facilitates easy retrieval.
- Allows disabling or pausing specific groups of [Actions](#action) based on the hierarchy.

## Binding
**The connection between an [Action](#action) and a [Control](#control).**

It's defined by a path that specifies to the system the type of [Control](#control) from which an [Action](#action) must retrieve the raw input value.

When multiple [Bindings](#binding) match the same [Controller](#controller) within the same [Action](#action), only the ones with the most specific paths for that device are processed. This allows the use of different controls depending on the mapping or model of the same type of controller.

[Composite Binding](#binding) extends this concept by containing multiple paths, even from different [Controllers](#controller), allowing every possible input combination and interaction.

## Converter
**Converts the value retrieved by a [Bindings](#binding) to match the type of the related [Action](#action).**

It can convert the WASD keys [Controls](#control) to a `Vector2` to be compatible with an [Action](#action) that moves the player, or the position of the index and thumb finger tips to a `boolean` when closer than a certain distance for a pinch gesture.

When the [Converter](#converter) returns a `boolean`, it can also be set as [Control Activator](#control-activator).

## Control Activator
**Defines the activation requirement of a [Control](#control) within a [Binding](#binding).**

[Composite Bindings](#binding) also support [Composite Control Activators](#control-activator), which define the activation of the entire [Binding](#binding)   based on the currently active bound controls.

They are useful in specific cases such as checking the input's [Controller](#controller) in local multiplayer scenarios or managing the behaviour of [State Controls](#control).


## Modifier
**Modifies the returned value of an [Action](#action) or a [Binding](#binding) without altering their type.**

[Modifiers](#modifier) applied to the [Binding](#binding) are exclusive to that [Binding](#binding), while those applied to the [Action](#action) are applied to every [Binding](#binding) contained within it (after its own, if any).

Common [Modifiers](#modifier) include inversion, clamping, scaling, normalization, or deadzone control.

## Trigger
**Updates the state of an [Action](#action) based on the behavior of its value.**

The default [Trigger](#trigger) triggers a state change when the retrieved value of the [Action](#action) differs from its default value. Other common [Triggers](#trigger) include interactions like hold, tap, multi-tap, or sequences of buttons.

Any [Converter](#converter) that returns a boolean can also act as a [Trigger](#trigger).

When assigned to a [Binding](#binding), it will overwrite the [Action](#action)'s  [Trigger](#trigger) when that [Binding](#binding) is the active one of the [Action](#action).

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
// Pointers
// For the pointers you can specify the event target of the PointerEvent
// (e.g. the canvas of your game, by default set to "document")
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

// Sensors
// For performance and battery reasons, it's better to enable them only when needed
inputManager.sensor.orientation.native.enable()
inputManager.sensor.accelerometer.native.enable()
inputManager.sensor.linearAcceleration.native.enable()
inputManager.sensor.gravity.native.enable()
inputManager.sensor.gyroscope.native.enable()
```

For using WebXR related inputs, you need to call specific functions when starting or ending an `XRSession`:
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
And provide to the system an `XRContext` object that must be kept updated:
```typescript
// Assign your object that implements the XRContext interface to the input manager
inputManager.xr.native.context = myXRContext;

// Update it as you please
xrSession.requestAnimationFrame((time, xrFrame) => {
    myXRContext.update(xrFrame);
    ...
});
```

To access motion sensor data on iOS Devices, you must request browser permission through a user gesture. This can be done easily by providing an `HTMLElement` (like a button or the game's canvas) to this function:
```typescript
inputManager.sensor.orientation.native.requestPermissionOnElementClick(element);
```

## Wonderland Engine Users
If you're a [Wonderland Engine](https://wonderlandengine.com/) user, you don't have to worry about setting up the [Input Manager](#input-manager). The `WLInputManager` class handles everything for you: it updates itself through the `onPreRender` event and manages all the XR functionality, supporting multi-engine and multi-scene setups.

You can access the [Input Manager](#input-manager) from anywhere using:
```typescript
WLInputManager.get(engine);
// or, if you don't need multi-engine support:
WLInputManager.current;
```

Keep in mind that if you're not using the default `input-manager-component`, which serves just as a visual [Input Manager](#input-manager) initializer for the editor, you should access the [Input Manager](#input-manager) by providing the current engine at least once to make it work.

## Read a value from a controller
In case you want to get the left `xr-gamepad` you're currently using, you can use:
```typescript
const controller = inputManager.xr.gamepad.left.current;
```
And, if you want to retrieve the value of the grip button of that [Controller](#controller) in a 0-1 range, you can:
```typescript
controller.grip.value.readValue();
// or 
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

If the hardware is based on two big rumble motors (`gamepads`), you can also set the strong and weak intesity parameters to represent the intensity of the actual big and small motors (default set as the same value of `strongIntensity`).
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
To be able to use an [Action](#action), you must first get an [Action Group](#action-group) to which you can add it:
```typescript
// Get an Action Group (if not existing, it will be automatically created)
const baseActions = inputManager.getActionGroup('baseActions');
// or create and add it to the Input Manager
const baseActions = new InputActionGroup('baseActions');
inputManager.addActionGroup(baseActions);
```

Keep in mind that you can add in the same way an [Action Group](#action-group) inside another [Action Group](#action-group):
```typescript
const subActions = baseActions.getActionGroup('subActions');
// or
const subActions = baseActions.addActionGroup(new InputActionGroup('subActions'));
```

Than, you can finally add the [Action](#action):
```typescript
// When creating the Action, you have to provide a default value from which it will define its type.
const moveAction = new InputAction('move', Vector2.zero); // returns an InputAction<Vector2>
baseActions.addAction(moveAction);
```

Now you can create a [Binding](#binding), so that the [Action](#action) knows from which [Control](#control) should retrieve the input value from.

If you want to bind the left gamepad stick with a deadzone you can:
```typescript
// When creating the Binding you have to specify the control and the returning type (one is enough if they are the same)
const moveGamepadBinding = new InputSingleBinding<Vector2>('gamepad-stick')
    // Set the path of the controller and the one of the control
    .setPath('gamepad', 'leftStick')
    // Add the deadzone modifier
    .addModifier('stickDeadZone', 0.2, 0.9);
```

If you want to bind a direction vector from the WASD keys of the keyboard, you can check for the key values with a [Composite Binding](#binding) and transform them in a two dimensional vector through a `compositeVector2` [Converter](#converter):
```typescript
// When creating a Composite Binding you have to specify the controls types as a Tuple
const moveKeyboardBinding = new InputCompositeBinding<[boolean, boolean, boolean, boolean], Vector2>()
    // When the control and the returning types are not equal, you have to assing a converter
    .setConverter('compositeVector2')
    // Set the path of the correspoding index
    .setPath(0, 'keyboard', 'keyA')
    .setPath(1, 'keyboard', 'keyD')
    .setPath(2, 'keyboard', 'keyW')
    .setPath(3, 'keyboard', 'keyS');
```

To add a [Binding](#binding) to an action:
```typescript
moveAction.addBinding(moveKeyboardBinding);
```

In certain cases, such as when you want a gun to fire a bullet when a button is pressed for a specific duration, you may also want to set a [Trigger](#trigger):
```typescript
// The action will be triggered when the returned value is true for 0.5 seconds
fireAction.setTrigger('hold', 0.5);
// or
fireAction.setTrigger(new HoldTrigger(0.5));
```
Note that in rare cases where the Action type does not extend a primitive type or an ArrayLike of a primitive, settings the [Trigger](#trigger) is mandatory.

If you want to use an event base approach, you can finally add a callback to the [Action](#action) based on the current state of it.
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

Thanks to the typed nature of the system, all the possible combination are suggested to you in the setup phase.

Take note that you can activate, deactivate, create, remove, assign and modify everything in the order you want and even in the middle of the gameplay with multiple connected [Controllers](#controller).

## Write Control Paths
When adding a [Binding](#binding) to an [Action](#action), it will be internally sorted based on the depth of its [Control](#control) paths. Only the [Controls](#control) of the most specific paths are bound when a [Controller](#controller) matches multiple paths of the same [Action](#action).

For example:
```typescript
action.addBinding(new InputSingleBinding<bool>()
        // The controller path specifies the model
        .setPath('gamepad/standard/sony-dualshock-4', 'crossButton'))
    .addBinding(new InputSingleBinding<bool>()
        // The controller path matches any gamepad
        .setPath('gamepad', 'rightFace'))
```
Even if the DualShock 4 is also a gamepad, it will trigger the action only when the `crossButton` is pressed.

You can also use a regular expressions to define a [Controller](#controller) path:
```typescript
action.addBinding(new InputSingleBinding<bool>()
        // The '*' matches any type of that section
        // The regular expression is enclosed within curly braces and supports flags
        .setPath('gamepad/*/{/sony/}', 'crossButton'))
    .addBinding(new InputSingleBinding<bool>()
        .setPath('gamepad/*/{/044f/}', 'button22'))
```
The path can also be provided in a single string format with the signature `<controllerPath>/controlPath`.
```typescript
action.addBinding(new InputSingleBinding<bool>()
        .setPath('<gamepad/*/{/sony/}>/crossButton'))
```

Path signatures for native [Controllers](#controller) are:
- The `class/type` for the [Pointers](#control)
*(native types are `mouse`, `touch`, `pen` e.g. `pointer/mouse`)*
- The `class` for the [Keyboard](#control)
*(e.g. `keyboard`)*
- The `class/mapping/model` for the [Gamepads](#control)
*(native mappings are `standard` and `nonstandard`, while native models hanno la signature vendor-model sotto forma di id o string per i controller microsoft, sony e nintendo e.g. `gamepad/standard/microsoft-xinput`, `gamepad/standard/046d-c260`)*
- The `class/type` for the XR [Viewers](#control)
*(native types are `head`, `screen` e.g. `xr-viewer/head`)*
- The `handedness/class/mapping/model` for the [XR Gamepads](#control)
*(native mappings are based on the `XRInputSource` [generic profiles](https://developer.mozilla.org/en-US/docs/Web/API/XRInputSource/profiles#generic_input_profile_names), while the native models are based on the [model profiles](https://developer.mozilla.org/en-US/docs/Web/API/XRInputSource/profiles#input_profile_names) e.g. `left/xr-gamepad/generic-trigger-squeeze-thumbstick/meta-quest-touch-plus`)*
- The `handedness/class` for the [XR Hands](#control)
*(e.g. `left/xr-hand`)*
- The `class` for the [Sensors](#control)
*(e.g. `orientation-sensor`)*

You must always specify at lest the class.

## Extra Binding Setup Tips
You can also add [Control Activators](#control-activator) for individual [Controls](#control) and, in the case of [Composite Bindings](#binding), an additional [Composite Control Activator](#control-activator) for all currently active [Controls](#control).
```typescript
// The binding will only listen for the Bottom Face Control of the Player One Controller
const binding = new InputSingleBinding<boolean>()
    .setPath('gamepad', 'bottomFace')
    // Set the Control Activator for the path
    .setControlActivator('controller', playerOneController);
```

You can also set a [Converter](#converter) that returns a `boolean` as a [Control Activator](#control-activator) for [Single Input Bindings](#binding), or as [Composite Control Activator](#control-activator) for [Composite Input Bindings](#binding):
```typescript
// Despite dealing with State Controls, the Binding will only be activated when the tips of the index and the thumb are closer than 1cm
// Returns a boolean
const binding = new InputCompositeBinding<[Vector3, Vector3], boolean>()
    // Set the same object as Converter and Composite Control Activator
    .setConverterAsControlActivator('lessOrEqualDistance', 0.01)
    .setPath(0, 'right/xr-hand', 'indexTip/position')
    .setPath(1, 'right/xr-hand', 'thumbTip/position');
```
or, if you want still be able to get the positions as values from the [Action](#action):
```typescript
// Despite dealing with State Controls, the binding will only be activated when the tips of the index and the thumb are closer than 1cm
// Returns a Tuple containing the finger tips positions
const binding = new InputCompositeBinding<[Vector3, Vector3]>()
    .setPath(0, 'right/xr-hand', 'indexTip/position')
    .setPath(1, 'right/xr-hand', 'thumbTip/position')
    .setCompositeControlActivator('lessOrEqualDistance', 0.01);
```

## Rebind an Action
You can rebind an [Action](#action) by accessing the corresponding [Binding](#binding) from it and changing its [Control](#control) path by overriding the current one.
Remember that if the reference of the [Binding](#binding) is not saved, you need to retrieve it through the `getBinding` function:

```typescript
// When getting a Binding you must specifiy its type
// Get it by predicate
action.getBinding<InputSingleBinding<boolean>>(
    (binding) => binding.path?.controllerPath[0] === 'gamepad')!
    .setPath('gamepad', 'bottomFace');
// or by name
action.getBinding<InputSingleBinding<boolean>>('my-gamepad-binding')!
    .setPath('gamepad', 'bottomFace');
```

You can also listen for user inputs when changing a [Control](#control) path:
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

Remember that regardless of the approach you use, the values of the actions are always readonly.

## Disable or Pause an Action
[Actions](#action) and [Action Groups](#action-group)  can be enabled/disabled or paused/resumed, affecting the hierarchy.

- `disable`: Controls are no more automatically bound when a Controller connects to the system. This is useful when there are many actions that should not be used for a while (reactivating them creates minimal overhead)
- `pause`: The return value is not updated, and related events are not raised. This is useful when actions need to be disabled for short intervals.

```typescript
baseActions.disable();
baseActions.enable();
baseActions.pause();
baseActions.resume();
```

## Create Custom Converterters, Modifiers, Triggers and Control Activators
You can create custom [Converters](#converter), [Modifiers](#modifier), [Triggers](#trigger), and [Control Activators](#control-activator) by implementing the respective interfaces: `InputConverter`, `InputModifier`, `InputTrigger`, `InputControlActivator` or `InputCompositeControlActivator`.
Depending on the main method signature types, these components can be interchangeable.

Each of them can also be provided as an arrow function for faster custom implementations, as mentioned in the corresponding add/set/replace function signatures.
```typescript
binding.setConverter((value) => value > 0.5); // Control type to Action type
binding.addModifier((value) => value * value); // Same Control and Action type
binding.setTrigger((value) => value > 0.5); // Control type to boolean
binding.setControlActivator((control) => control.readValue() > 0.5); // Control to boolean
binding.setCompositeControlActivator((controls) => controls[0].readValue() + controls[1].readValue() > 1); // Array of Controls to boolean
```

## Create Custom Controller
To create a custom [Controller](#controller), you just need to extend the `InputController` class, have a constructor with no parameter, and set it up through the `init` function to take advantage of the pooling capabilities of the system.
Note that if you want to create a [Controller](#controller) of a particular category, you should derive your [Controller](#controller) from the base [Controller](#controller) of that category (for example, derive from `GamepadController` if you want to create a new type of gamepad).

## Create Custom Controls
The same applies to [Controls](#control). While there are already many versatile [Controls](#control) available, you can create your own by implementing the `InputControl` interface or by extending the `BaseInputControl` class.

## More To Come
The actual documentation will be released in the future, and this is just a basic overview of the system's usage. Keep in mind that this is still a beta, and there may be substantial changes in the future.

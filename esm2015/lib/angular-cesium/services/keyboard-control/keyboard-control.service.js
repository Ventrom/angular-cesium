import { isNumber } from 'util';
import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CesiumService } from '../cesium/cesium.service';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';
var KeyEventState;
(function (KeyEventState) {
    KeyEventState[KeyEventState["IGNORED"] = 0] = "IGNORED";
    KeyEventState[KeyEventState["NOT_PRESSED"] = 1] = "NOT_PRESSED";
    KeyEventState[KeyEventState["PRESSED"] = 2] = "PRESSED";
})(KeyEventState || (KeyEventState = {}));
/**
 *  Service that manages keyboard keys and execute actions per request.
 *  Inject the keyboard control service into any layer, under your `ac-map` component,
 *  And defined you keyboard handlers using `setKeyboardControls`.
 *
 * <caption>Simple Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: { action: KeyboardAction.CAMERA_FORWARD },
 *       S: { action: KeyboardAction.CAMERA_BACKWARD },
 *       D: { action: KeyboardAction.CAMERA_RIGHT },
 *       A: { action: KeyboardAction.CAMERA_LEFT },
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 *
 * <caption>Advanced Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   private myCustomValue = 10;
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: {
 *          action: KeyboardAction.CAMERA_FORWARD,
 *          validate: (camera, scene, params, key) => {
 *            // Replace `checkCamera` you with your validation logic
 *            if (checkCamera(camera) || params.customParams === true) {
 *              return true;
 *            }
 *
 *            return false;
 *          },
 *          params: () => {
 *            return {
 *              myValue: this.myCustomValue,
 *            };
 *          },
 *        }
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 * <b>Predefined keyboard actions:</b>
 * + `KeyboardAction.CAMERA_FORWARD` - Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_BACKWARD` - Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_UP` - Moves the camera up, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_DOWN` - Moves the camera down, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_RIGHT` - Moves the camera right, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LEFT` - Moves the camera left, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LOOK_RIGHT` - Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_LEFT` - Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_UP` - Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_DOWN` - Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_TWIST_RIGHT` - Twists the camera to the right, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_TWIST_LEFT` - Twists the camera to the left, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_ROTATE_RIGHT` - Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_LEFT` - Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_UP` - Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_DOWN` - Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ZOOM_IN` - Zoom in into the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 * + `KeyboardAction.CAMERA_ZOOM_OUT` -  Zoom out from the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 */
export class KeyboardControlService {
    /**
     * Creats the keyboard control service.
     */
    constructor(ngZone, cesiumService, document) {
        this.ngZone = ngZone;
        this.cesiumService = cesiumService;
        this.document = document;
        this._currentDefinitions = null;
        this._activeDefinitions = {};
        this._keyMappingFn = this.defaultKeyMappingFn;
    }
    /**
     * Initializes the keyboard control service.
     */
    init() {
        const canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', () => {
            canvas.focus();
        });
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleTick = this.handleTick.bind(this);
    }
    /**
     * Sets the current map keyboard control definitions.
     * The definitions is a key mapping between a key string and a KeyboardControlDefinition:
     * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
     * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
     * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
     * - `params` is an object (or function that returns object) that will be passed into the action executor.
     * - `done` is a function that will be triggered when `keyup` is triggered.
     * @param definitions Keyboard Control Definition
     * @param keyMappingFn - Mapping function for custom keys
     * @param outsideOfAngularZone - if key down events will run outside of angular zone.
     */
    setKeyboardControls(definitions, keyMappingFn, outsideOfAngularZone = false) {
        if (!definitions) {
            return this.removeKeyboardControls();
        }
        if (!this._currentDefinitions) {
            this.registerEvents(outsideOfAngularZone);
        }
        this._currentDefinitions = definitions;
        this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;
        Object.keys(this._currentDefinitions).forEach(key => {
            this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        });
    }
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     */
    removeKeyboardControls() {
        this.unregisterEvents();
        this._currentDefinitions = null;
    }
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     */
    getAction(char) {
        return this._currentDefinitions[char] || null;
    }
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    defaultKeyMappingFn(keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    }
    /**
     * document's `keydown` event handler
     */
    handleKeydown(e) {
        const char = this._keyMappingFn(e);
        const action = this.getAction(char);
        if (action) {
            const actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                let execute = true;
                const params = this.getParams(action.params, e);
                if (action.validation) {
                    execute = action.validation(this.cesiumService, params, e);
                }
                if (execute === true) {
                    this._activeDefinitions[char] = {
                        state: KeyEventState.PRESSED,
                        action,
                        keyboardEvent: e,
                    };
                }
            }
        }
    }
    /**
     * document's `keyup` event handler
     */
    handleKeyup(e) {
        const char = this._keyMappingFn(e);
        const action = this.getAction(char);
        if (action) {
            this._activeDefinitions[char] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: e,
            };
            if (action.done && typeof action.done === 'function') {
                action.done(this.cesiumService, e);
            }
        }
    }
    /**
     * `tick` event handler that triggered by Cesium render loop
     */
    handleTick() {
        const activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach(key => {
            const actionState = this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        });
    }
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     */
    getParams(paramsDef, keyboardEvent) {
        if (!paramsDef) {
            return {};
        }
        if (typeof paramsDef === 'function') {
            return paramsDef(this.cesiumService, keyboardEvent);
        }
        return paramsDef;
    }
    /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     */
    executeAction(execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        const params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            const shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);
            if (shouldCancelEvent === false) {
                this._activeDefinitions[key] = {
                    state: KeyEventState.IGNORED,
                    action: null,
                    keyboardEvent: null,
                };
            }
        }
    }
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     */
    registerEvents(outsideOfAngularZone) {
        const registerToEvents = () => {
            this.document.addEventListener('keydown', this.handleKeydown);
            this.document.addEventListener('keyup', this.handleKeyup);
            this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
        };
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    }
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     */
    unregisterEvents() {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    }
}
KeyboardControlService.decorators = [
    { type: Injectable }
];
KeyboardControlService.ctorParameters = () => [
    { type: NgZone },
    { type: CesiumService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9rZXlib2FyZC1jb250cm9sL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBaUJuRSxJQUFLLGFBSUo7QUFKRCxXQUFLLGFBQWE7SUFDaEIsdURBQU8sQ0FBQTtJQUNQLCtEQUFXLENBQUE7SUFDWCx1REFBTyxDQUFBO0FBQ1QsQ0FBQyxFQUpJLGFBQWEsS0FBYixhQUFhLFFBSWpCO0FBUUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1R0c7QUFFSCxNQUFNLE9BQU8sc0JBQXNCO0lBS2pDOztPQUVHO0lBQ0gsWUFBb0IsTUFBYyxFQUFVLGFBQTRCLEVBQTRCLFFBQWE7UUFBN0YsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQTRCLGFBQVEsR0FBUixRQUFRLENBQUs7UUFQekcsd0JBQW1CLEdBQThCLElBQUksQ0FBQztRQUN0RCx1QkFBa0IsR0FBa0QsRUFBRSxDQUFDO1FBQ3ZF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Q0FBQzs7O1lBN05GLFVBQVU7OztZQXpJa0IsTUFBTTtZQUcxQixhQUFhOzRDQStJdUQsTUFBTSxTQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc051bWJlciB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEtleWJvYXJkQWN0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWtleWJvYXJkLWFjdGlvbi5lbnVtJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUFJFREVGSU5FRF9LRVlCT0FSRF9BQ1RJT05TIH0gZnJvbSAnLi9wcmVkZWZpbmVkLWFjdGlvbnMnO1xuXG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xBY3Rpb25GbiA9IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW4gfCB2b2lkO1xuZXhwb3J0IHR5cGUgS2V5Ym9hcmRDb250cm9sVmFsaWRhdGlvbkZuID0gKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55LCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEtleWJvYXJkQ29udHJvbERvbmVGbiA9IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGludGVyZmFjZSBLZXlib2FyZENvbnRyb2xQYXJhbXMge1xuICBhY3Rpb246IEtleWJvYXJkQWN0aW9uIHwgS2V5Ym9hcmRDb250cm9sQWN0aW9uRm47XG4gIHZhbGlkYXRpb24/OiBLZXlib2FyZENvbnRyb2xWYWxpZGF0aW9uRm47XG4gIHBhcmFtcz86IHsgW3BhcmFtTmFtZTogc3RyaW5nXTogYW55IH07XG4gIGRvbmU/OiBLZXlib2FyZENvbnRyb2xEb25lRm47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5Ym9hcmRDb250cm9sRGVmaW5pdGlvbiB7XG4gIFtrZXlib2FyZENoYXJDb2RlOiBzdHJpbmddOiBLZXlib2FyZENvbnRyb2xQYXJhbXM7XG59XG5cbmVudW0gS2V5RXZlbnRTdGF0ZSB7XG4gIElHTk9SRUQsXG4gIE5PVF9QUkVTU0VELFxuICBQUkVTU0VELFxufVxuXG5pbnRlcmZhY2UgQWN0aXZlRGVmaW5pdGlvbiB7XG4gIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQ7XG4gIHN0YXRlOiBLZXlFdmVudFN0YXRlO1xuICBhY3Rpb246IEtleWJvYXJkQ29udHJvbFBhcmFtcztcbn1cblxuLyoqXG4gKiAgU2VydmljZSB0aGF0IG1hbmFnZXMga2V5Ym9hcmQga2V5cyBhbmQgZXhlY3V0ZSBhY3Rpb25zIHBlciByZXF1ZXN0LlxuICogIEluamVjdCB0aGUga2V5Ym9hcmQgY29udHJvbCBzZXJ2aWNlIGludG8gYW55IGxheWVyLCB1bmRlciB5b3VyIGBhYy1tYXBgIGNvbXBvbmVudCxcbiAqICBBbmQgZGVmaW5lZCB5b3Uga2V5Ym9hcmQgaGFuZGxlcnMgdXNpbmcgYHNldEtleWJvYXJkQ29udHJvbHNgLlxuICpcbiAqIDxjYXB0aW9uPlNpbXBsZSBFeGFtcGxlPC9jYXB0aW9uPlxuICogYGBgdHlwZXNjcmlwdFxuICogQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdrZXlib2FyZC1jb250cm9sLWxheWVyJyxcbiAqICAgdGVtcGxhdGU6ICcnLFxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBLZXlib2FyZENvbnRyb2xMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlKSB7fVxuICpcbiAqICAgbmdPbkluaXQoKSB7XG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnNldEtleWJvYXJkQ29udHJvbHMoe1xuICogICAgICAgVzogeyBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9GT1JXQVJEIH0sXG4gKiAgICAgICBTOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0JBQ0tXQVJEIH0sXG4gKiAgICAgICBEOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JJR0hUIH0sXG4gKiAgICAgICBBOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xFRlQgfSxcbiAqICAgICB9KTtcbiAqICAgIH1cbiAqXG4gKiAgIG5nT25EZXN0cm95KCkge1xuICogICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5yZW1vdmVLZXlib2FyZENvbnRyb2xzKCk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIDxjYXB0aW9uPkFkdmFuY2VkIEV4YW1wbGU8L2NhcHRpb24+XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ2tleWJvYXJkLWNvbnRyb2wtbGF5ZXInLFxuICogICB0ZW1wbGF0ZTogJycsXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEtleWJvYXJkQ29udHJvbExheWVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleWJvYXJkQ29udHJvbFNlcnZpY2U6IEtleWJvYXJkQ29udHJvbFNlcnZpY2UpIHt9XG4gKlxuICogICBwcml2YXRlIG15Q3VzdG9tVmFsdWUgPSAxMDtcbiAqXG4gKiAgIG5nT25Jbml0KCkge1xuICogICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5zZXRLZXlib2FyZENvbnRyb2xzKHtcbiAqICAgICAgIFc6IHtcbiAqICAgICAgICAgIGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0ZPUldBUkQsXG4gKiAgICAgICAgICB2YWxpZGF0ZTogKGNhbWVyYSwgc2NlbmUsIHBhcmFtcywga2V5KSA9PiB7XG4gKiAgICAgICAgICAgIC8vIFJlcGxhY2UgYGNoZWNrQ2FtZXJhYCB5b3Ugd2l0aCB5b3VyIHZhbGlkYXRpb24gbG9naWNcbiAqICAgICAgICAgICAgaWYgKGNoZWNrQ2FtZXJhKGNhbWVyYSkgfHwgcGFyYW1zLmN1c3RvbVBhcmFtcyA9PT0gdHJ1ZSkge1xuICogICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICogICAgICAgICAgICB9XG4gKlxuICogICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gKiAgICAgICAgICB9LFxuICogICAgICAgICAgcGFyYW1zOiAoKSA9PiB7XG4gKiAgICAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgICAgbXlWYWx1ZTogdGhpcy5teUN1c3RvbVZhbHVlLFxuICogICAgICAgICAgICB9O1xuICogICAgICAgICAgfSxcbiAqICAgICAgICB9XG4gKiAgICAgfSk7XG4gKiAgICB9XG4gKlxuICogICBuZ09uRGVzdHJveSgpIHtcbiAqICAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2UucmVtb3ZlS2V5Ym9hcmRDb250cm9scygpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqIDxiPlByZWRlZmluZWQga2V5Ym9hcmQgYWN0aW9uczo8L2I+XG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRk9SV0FSRGAgLSBNb3ZlcyB0aGUgY2FtZXJhIGZvcndhcmQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9CQUNLV0FSRGAgLSBNb3ZlcyB0aGUgY2FtZXJhIGJhY2t3YXJkLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfVVBgIC0gTW92ZXMgdGhlIGNhbWVyYSB1cCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0RPV05gIC0gTW92ZXMgdGhlIGNhbWVyYSBkb3duLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUklHSFRgIC0gTW92ZXMgdGhlIGNhbWVyYSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xFRlRgIC0gTW92ZXMgdGhlIGNhbWVyYSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19SSUdIVGAgLSBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdFxuICogY29udHJvbHMgdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfTEVGVGAgLSBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0XG4gKiBjb250cm9scyB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19VUGAgLSBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB1cCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19ET1dOYCAtIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIGRvd24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1RXSVNUX1JJR0hUYCAtIFR3aXN0cyB0aGUgY2FtZXJhIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbW91bnRgIHRoYXQgY29udHJvbHNcbiAqIHRoZSB0d2lzdCBhbW91bnRcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9UV0lTVF9MRUZUYCAtIFR3aXN0cyB0aGUgY2FtZXJhIHRvIHRoZSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFtb3VudGAgdGhhdCBjb250cm9sc1xuICogdGhlIHR3aXN0IGFtb3VudFxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9SSUdIVGAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgdG8gdGhlIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgcm90YXRpb24gYW5nbGVcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfTEVGVGAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSByb3RhdGlvbiBhbmdsZVxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9VUGAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgdXB3YXJkcywgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX0RPV05gIC0gUm90YXRlcyB0aGUgY2FtZXJhIGRvd253YXJkcywgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfWk9PTV9JTmAgLSBab29tIGluIGludG8gdGhlIGN1cnJlbnQgY2FtZXJhIGNlbnRlciBwb3NpdGlvbiwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkXG4gKiBgYW1vdW50YCB0aGF0IGNvbnRyb2xzIHRoZSBhbW91bnQgb2Ygem9vbSBpbiBtZXRlcnMuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfWk9PTV9PVVRgIC0gIFpvb20gb3V0IGZyb20gdGhlIGN1cnJlbnQgY2FtZXJhIGNlbnRlciBwb3NpdGlvbiwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkXG4gKiBgYW1vdW50YCB0aGF0IGNvbnRyb2xzIHRoZSBhbW91bnQgb2Ygem9vbSBpbiBtZXRlcnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBLZXlib2FyZENvbnRyb2xTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfY3VycmVudERlZmluaXRpb25zOiBLZXlib2FyZENvbnRyb2xEZWZpbml0aW9uID0gbnVsbDtcbiAgcHJpdmF0ZSBfYWN0aXZlRGVmaW5pdGlvbnM6IHsgW2RlZmluaXRpb25LZXk6IHN0cmluZ106IEFjdGl2ZURlZmluaXRpb24gfSA9IHt9O1xuICBwcml2YXRlIF9rZXlNYXBwaW5nRm46IEZ1bmN0aW9uID0gdGhpcy5kZWZhdWx0S2V5TWFwcGluZ0ZuO1xuXG4gIC8qKlxuICAgKiBDcmVhdHMgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55KSB7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZS5cbiAgICovXG4gIGluaXQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldENhbnZhcygpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNhbnZhcy5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5oYW5kbGVLZXlkb3duID0gdGhpcy5oYW5kbGVLZXlkb3duLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVLZXl1cCA9IHRoaXMuaGFuZGxlS2V5dXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVRpY2sgPSB0aGlzLmhhbmRsZVRpY2suYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IG1hcCBrZXlib2FyZCBjb250cm9sIGRlZmluaXRpb25zLlxuICAgKiBUaGUgZGVmaW5pdGlvbnMgaXMgYSBrZXkgbWFwcGluZyBiZXR3ZWVuIGEga2V5IHN0cmluZyBhbmQgYSBLZXlib2FyZENvbnRyb2xEZWZpbml0aW9uOlxuICAgKiAtIGBhY3Rpb25gIGlzIGEgcHJlZGVmaW5lIGFjdGlvbiBmcm9tIGBLZXlib2FyZEFjdGlvbmAgZW51bSwgb3IgYSBjdXN0b20gbWV0aG9kOlxuICAgKiBgKGNhbWVyYSwgc2NlbmUsIHBhcmFtcywga2V5KSA9PiBib29sZWFuIHwgdm9pZGAgLSByZXR1cm5pbmcgZmFsc2Ugd2lsbCBjYW5jZWwgdGhlIGN1cnJlbnQga2V5ZG93bi5cbiAgICogLSBgdmFsaWRhdGlvbmAgaXMgYSBtZXRob2QgdGhhdCB2YWxpZGF0ZXMgaWYgdGhlIGV2ZW50IHNob3VsZCBvY2N1ciBvciBub3QgKGBjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleWApXG4gICAqIC0gYHBhcmFtc2AgaXMgYW4gb2JqZWN0IChvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgb2JqZWN0KSB0aGF0IHdpbGwgYmUgcGFzc2VkIGludG8gdGhlIGFjdGlvbiBleGVjdXRvci5cbiAgICogLSBgZG9uZWAgaXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdHJpZ2dlcmVkIHdoZW4gYGtleXVwYCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSBkZWZpbml0aW9ucyBLZXlib2FyZCBDb250cm9sIERlZmluaXRpb25cbiAgICogQHBhcmFtIGtleU1hcHBpbmdGbiAtIE1hcHBpbmcgZnVuY3Rpb24gZm9yIGN1c3RvbSBrZXlzXG4gICAqIEBwYXJhbSBvdXRzaWRlT2ZBbmd1bGFyWm9uZSAtIGlmIGtleSBkb3duIGV2ZW50cyB3aWxsIHJ1biBvdXRzaWRlIG9mIGFuZ3VsYXIgem9uZS5cbiAgICovXG4gIHNldEtleWJvYXJkQ29udHJvbHMoZGVmaW5pdGlvbnM6IEtleWJvYXJkQ29udHJvbERlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAga2V5TWFwcGluZ0ZuPzogKGtleUV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgb3V0c2lkZU9mQW5ndWxhclpvbmUgPSBmYWxzZSkge1xuICAgIGlmICghZGVmaW5pdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbW92ZUtleWJvYXJkQ29udHJvbHMoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2N1cnJlbnREZWZpbml0aW9ucykge1xuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cyhvdXRzaWRlT2ZBbmd1bGFyWm9uZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY3VycmVudERlZmluaXRpb25zID0gZGVmaW5pdGlvbnM7XG4gICAgdGhpcy5fa2V5TWFwcGluZ0ZuID0ga2V5TWFwcGluZ0ZuIHx8IHRoaXMuZGVmYXVsdEtleU1hcHBpbmdGbjtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2N1cnJlbnREZWZpbml0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNba2V5XSA9IHtcbiAgICAgICAgc3RhdGU6IEtleUV2ZW50U3RhdGUuTk9UX1BSRVNTRUQsXG4gICAgICAgIGFjdGlvbjogbnVsbCxcbiAgICAgICAga2V5Ym9hcmRFdmVudDogbnVsbCxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgY3VycmVudCBzZXQgb2Yga2V5Ym9hcmQgY29udHJvbCBpdGVtcywgYW5kIHVucmVnaXN0ZXIgZnJvbSBtYXAgZXZlbnRzLlxuICAgKi9cbiAgcmVtb3ZlS2V5Ym9hcmRDb250cm9scygpIHtcbiAgICB0aGlzLnVucmVnaXN0ZXJFdmVudHMoKTtcbiAgICB0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aW9uIHRoYXQgaGFuZGxlcyBgY2hhcmAga2V5IHN0cmluZywgb3IgYG51bGxgIGlmIG5vdCBleGlzdHNcbiAgICovXG4gIHByaXZhdGUgZ2V0QWN0aW9uKGNoYXI6IHN0cmluZyk6IEtleWJvYXJkQ29udHJvbFBhcmFtcyB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREZWZpbml0aW9uc1tjaGFyXSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGBkZWZhdWx0S2V5TWFwcGluZ0ZuYCB0aGF0IG1hcHMgYEtleWJvYXJkRXZlbnRgIGludG8gYSBrZXkgc3RyaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBkZWZhdWx0S2V5TWFwcGluZ0ZuKGtleUV2ZW50OiBLZXlib2FyZEV2ZW50KTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlFdmVudC5rZXlDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBkb2N1bWVudCdzIGBrZXlkb3duYCBldmVudCBoYW5kbGVyXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUtleWRvd24oZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLl9rZXlNYXBwaW5nRm4oZSk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5nZXRBY3Rpb24oY2hhcik7XG5cbiAgICBpZiAoYWN0aW9uKSB7XG4gICAgICBjb25zdCBhY3Rpb25TdGF0ZSA9IHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2NoYXJdO1xuXG4gICAgICBpZiAoYWN0aW9uU3RhdGUuc3RhdGUgIT09IEtleUV2ZW50U3RhdGUuSUdOT1JFRCkge1xuICAgICAgICBsZXQgZXhlY3V0ZSA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5nZXRQYXJhbXMoYWN0aW9uLnBhcmFtcywgZSk7XG5cbiAgICAgICAgaWYgKGFjdGlvbi52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgZXhlY3V0ZSA9IGFjdGlvbi52YWxpZGF0aW9uKHRoaXMuY2VzaXVtU2VydmljZSwgcGFyYW1zLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleGVjdXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNbY2hhcl0gPSB7XG4gICAgICAgICAgICBzdGF0ZTogS2V5RXZlbnRTdGF0ZS5QUkVTU0VELFxuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAga2V5Ym9hcmRFdmVudDogZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGRvY3VtZW50J3MgYGtleXVwYCBldmVudCBoYW5kbGVyXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZUtleXVwKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5fa2V5TWFwcGluZ0ZuKGUpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZ2V0QWN0aW9uKGNoYXIpO1xuXG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNbY2hhcl0gPSB7XG4gICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLk5PVF9QUkVTU0VELFxuICAgICAgICBhY3Rpb246IG51bGwsXG4gICAgICAgIGtleWJvYXJkRXZlbnQ6IGUsXG4gICAgICB9O1xuXG4gICAgICBpZiAoYWN0aW9uLmRvbmUgJiYgdHlwZW9mIGFjdGlvbi5kb25lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGFjdGlvbi5kb25lKHRoaXMuY2VzaXVtU2VydmljZSwgZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGB0aWNrYCBldmVudCBoYW5kbGVyIHRoYXQgdHJpZ2dlcmVkIGJ5IENlc2l1bSByZW5kZXIgbG9vcFxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVUaWNrKCkge1xuICAgIGNvbnN0IGFjdGl2ZUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9hY3RpdmVEZWZpbml0aW9ucyk7XG5cbiAgICBhY3RpdmVLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvblN0YXRlID0gdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNba2V5XTtcblxuICAgICAgaWYgKGFjdGlvblN0YXRlICE9PSBudWxsICYmIGFjdGlvblN0YXRlLmFjdGlvbiAhPT0gbnVsbCAmJiBhY3Rpb25TdGF0ZS5zdGF0ZSA9PT0gS2V5RXZlbnRTdGF0ZS5QUkVTU0VEKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUFjdGlvbihhY3Rpb25TdGF0ZS5hY3Rpb24sIGtleSwgYWN0aW9uU3RhdGUua2V5Ym9hcmRFdmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogUGFyYW1zIHJlc29sdmUgZnVuY3Rpb24sIHJldHVybnMgb2JqZWN0LlxuICAgKiBJbiBjYXNlIG9mIHBhcmFtcyBmdW5jdGlvbiwgZXhlY3V0ZXMgaXQgYW5kIHJldHVybnMgaXQncyByZXR1cm4gdmFsdWUuXG4gICAqXG4gICAqL1xuICBwcml2YXRlIGdldFBhcmFtcyhwYXJhbXNEZWY6IGFueSwga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCk6IHsgW3BhcmFtTmFtZTogc3RyaW5nXTogYW55IH0ge1xuICAgIGlmICghcGFyYW1zRGVmKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXNEZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBwYXJhbXNEZWYodGhpcy5jZXNpdW1TZXJ2aWNlLCBrZXlib2FyZEV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zRGVmO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEV4ZWN1dGVzIGEgZ2l2ZW4gYEtleWJvYXJkQ29udHJvbFBhcmFtc2Agb2JqZWN0LlxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBleGVjdXRlQWN0aW9uKGV4ZWN1dGlvbjogS2V5Ym9hcmRDb250cm9sUGFyYW1zLCBrZXk6IHN0cmluZywga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5fY3VycmVudERlZmluaXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5nZXRQYXJhbXMoZXhlY3V0aW9uLnBhcmFtcywga2V5Ym9hcmRFdmVudCk7XG5cbiAgICBpZiAoaXNOdW1iZXIoZXhlY3V0aW9uLmFjdGlvbikpIHtcbiAgICAgIGNvbnN0IHByZWRlZmluZWRBY3Rpb24gPSBQUkVERUZJTkVEX0tFWUJPQVJEX0FDVElPTlNbZXhlY3V0aW9uLmFjdGlvbiBhcyBudW1iZXJdO1xuXG4gICAgICBpZiAocHJlZGVmaW5lZEFjdGlvbikge1xuICAgICAgICBwcmVkZWZpbmVkQWN0aW9uKHRoaXMuY2VzaXVtU2VydmljZSwgcGFyYW1zLCBrZXlib2FyZEV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleGVjdXRpb24uYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBzaG91bGRDYW5jZWxFdmVudCA9IGV4ZWN1dGlvbi5hY3Rpb24odGhpcy5jZXNpdW1TZXJ2aWNlLCBwYXJhbXMsIGtleWJvYXJkRXZlbnQpO1xuXG4gICAgICBpZiAoc2hvdWxkQ2FuY2VsRXZlbnQgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2tleV0gPSB7XG4gICAgICAgICAgc3RhdGU6IEtleUV2ZW50U3RhdGUuSUdOT1JFRCxcbiAgICAgICAgICBhY3Rpb246IG51bGwsXG4gICAgICAgICAga2V5Ym9hcmRFdmVudDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIHRvIGtleWRvd24sIGtleXVwIG9mIGBkb2N1bWVudGAsIGFuZCBgdGlja2Agb2YgQ2VzaXVtLlxuICAgKi9cbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50cyhvdXRzaWRlT2ZBbmd1bGFyWm9uZTogYm9vbGVhbikge1xuICAgIGNvbnN0IHJlZ2lzdGVyVG9FdmVudHMgPSAoKSA9PiB7XG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5dXApO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNsb2NrLm9uVGljay5hZGRFdmVudExpc3RlbmVyKHRoaXMuaGFuZGxlVGljayk7XG4gICAgfTtcblxuICAgIGlmIChvdXRzaWRlT2ZBbmd1bGFyWm9uZSkge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIocmVnaXN0ZXJUb0V2ZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ2lzdGVyVG9FdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW5yZWdpc3RlcnMgdG8ga2V5ZG93biwga2V5dXAgb2YgYGRvY3VtZW50YCwgYW5kIGB0aWNrYCBvZiBDZXNpdW0uXG4gICAqL1xuICBwcml2YXRlIHVucmVnaXN0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXl1cCk7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNsb2NrLm9uVGljay5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuaGFuZGxlVGljayk7XG4gIH1cbn1cbiJdfQ==
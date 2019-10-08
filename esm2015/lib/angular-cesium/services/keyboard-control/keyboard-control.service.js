/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isNumber } from 'util';
import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CesiumService } from '../cesium/cesium.service';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';
/**
 * @record
 */
export function KeyboardControlParams() { }
if (false) {
    /** @type {?} */
    KeyboardControlParams.prototype.action;
    /** @type {?|undefined} */
    KeyboardControlParams.prototype.validation;
    /** @type {?|undefined} */
    KeyboardControlParams.prototype.params;
    /** @type {?|undefined} */
    KeyboardControlParams.prototype.done;
}
/**
 * @record
 */
export function KeyboardControlDefinition() { }
/** @enum {number} */
const KeyEventState = {
    IGNORED: 0,
    NOT_PRESSED: 1,
    PRESSED: 2,
};
KeyEventState[KeyEventState.IGNORED] = 'IGNORED';
KeyEventState[KeyEventState.NOT_PRESSED] = 'NOT_PRESSED';
KeyEventState[KeyEventState.PRESSED] = 'PRESSED';
/**
 * @record
 */
function ActiveDefinition() { }
if (false) {
    /** @type {?} */
    ActiveDefinition.prototype.keyboardEvent;
    /** @type {?} */
    ActiveDefinition.prototype.state;
    /** @type {?} */
    ActiveDefinition.prototype.action;
}
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
     * @param {?} ngZone
     * @param {?} cesiumService
     * @param {?} document
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
     * @return {?}
     */
    init() {
        /** @type {?} */
        const canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', (/**
         * @return {?}
         */
        () => {
            canvas.focus();
        }));
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
     * @param {?} definitions Keyboard Control Definition
     * @param {?=} keyMappingFn - Mapping function for custom keys
     * @param {?=} outsideOfAngularZone - if key down events will run outside of angular zone.
     * @return {?}
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
        Object.keys(this._currentDefinitions).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        }));
    }
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     * @return {?}
     */
    removeKeyboardControls() {
        this.unregisterEvents();
        this._currentDefinitions = null;
    }
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     * @private
     * @param {?} char
     * @return {?}
     */
    getAction(char) {
        return this._currentDefinitions[char] || null;
    }
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     * @private
     * @param {?} keyEvent
     * @return {?}
     */
    defaultKeyMappingFn(keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    }
    /**
     * document's `keydown` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    handleKeydown(e) {
        /** @type {?} */
        const char = this._keyMappingFn(e);
        /** @type {?} */
        const action = this.getAction(char);
        if (action) {
            /** @type {?} */
            const actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                /** @type {?} */
                let execute = true;
                /** @type {?} */
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
     * @private
     * @param {?} e
     * @return {?}
     */
    handleKeyup(e) {
        /** @type {?} */
        const char = this._keyMappingFn(e);
        /** @type {?} */
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
     * @private
     * @return {?}
     */
    handleTick() {
        /** @type {?} */
        const activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            /** @type {?} */
            const actionState = this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        }));
    }
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     * @private
     * @param {?} paramsDef
     * @param {?} keyboardEvent
     * @return {?}
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
     * @private
     * @param {?} execution
     * @param {?} key
     * @param {?} keyboardEvent
     * @return {?}
     */
    executeAction(execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        /** @type {?} */
        const params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            /** @type {?} */
            const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[(/** @type {?} */ (execution.action))];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            /** @type {?} */
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
     * @private
     * @param {?} outsideOfAngularZone
     * @return {?}
     */
    registerEvents(outsideOfAngularZone) {
        /** @type {?} */
        const registerToEvents = (/**
         * @return {?}
         */
        () => {
            this.document.addEventListener('keydown', this.handleKeydown);
            this.document.addEventListener('keyup', this.handleKeyup);
            this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
        });
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    }
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @return {?}
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
/** @nocollapse */
KeyboardControlService.ctorParameters = () => [
    { type: NgZone },
    { type: CesiumService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype._currentDefinitions;
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype._activeDefinitions;
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype._keyMappingFn;
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype.cesiumService;
    /**
     * @type {?}
     * @private
     */
    KeyboardControlService.prototype.document;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9rZXlib2FyZC1jb250cm9sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7QUFNbkUsMkNBS0M7OztJQUpDLHVDQUFpRDs7SUFDakQsMkNBQXlDOztJQUN6Qyx1Q0FBc0M7O0lBQ3RDLHFDQUE2Qjs7Ozs7QUFHL0IsK0NBRUM7OztJQUdDLFVBQU87SUFDUCxjQUFXO0lBQ1gsVUFBTzs7Ozs7Ozs7QUFHVCwrQkFJQzs7O0lBSEMseUNBQTZCOztJQUM3QixpQ0FBcUI7O0lBQ3JCLGtDQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRHaEMsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7OztJQVFqQyxZQUFvQixNQUFjLEVBQVUsYUFBNEIsRUFBNEIsUUFBYTtRQUE3RixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBNEIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQVB6Ryx3QkFBbUIsR0FBOEIsSUFBSSxDQUFDO1FBQ3RELHVC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Ozs7SUFBRSwrQ0FBb0M7Ozs7O0lBQUUsMENBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNOdW1iZXIgfSBmcm9tICd1dGlsJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBLZXlib2FyZEFjdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1rZXlib2FyZC1hY3Rpb24uZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFBSRURFRklORURfS0VZQk9BUkRfQUNUSU9OUyB9IGZyb20gJy4vcHJlZGVmaW5lZC1hY3Rpb25zJztcblxuZXhwb3J0IHR5cGUgS2V5Ym9hcmRDb250cm9sQWN0aW9uRm4gPSAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnksIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFuIHwgdm9pZDtcbmV4cG9ydCB0eXBlIEtleWJvYXJkQ29udHJvbFZhbGlkYXRpb25GbiA9IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW47XG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xEb25lRm4gPSAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5Ym9hcmRDb250cm9sUGFyYW1zIHtcbiAgYWN0aW9uOiBLZXlib2FyZEFjdGlvbiB8IEtleWJvYXJkQ29udHJvbEFjdGlvbkZuO1xuICB2YWxpZGF0aW9uPzogS2V5Ym9hcmRDb250cm9sVmFsaWRhdGlvbkZuO1xuICBwYXJhbXM/OiB7IFtwYXJhbU5hbWU6IHN0cmluZ106IGFueSB9O1xuICBkb25lPzogS2V5Ym9hcmRDb250cm9sRG9uZUZuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleWJvYXJkQ29udHJvbERlZmluaXRpb24ge1xuICBba2V5Ym9hcmRDaGFyQ29kZTogc3RyaW5nXTogS2V5Ym9hcmRDb250cm9sUGFyYW1zO1xufVxuXG5lbnVtIEtleUV2ZW50U3RhdGUge1xuICBJR05PUkVELFxuICBOT1RfUFJFU1NFRCxcbiAgUFJFU1NFRCxcbn1cblxuaW50ZXJmYWNlIEFjdGl2ZURlZmluaXRpb24ge1xuICBrZXlib2FyZEV2ZW50OiBLZXlib2FyZEV2ZW50O1xuICBzdGF0ZTogS2V5RXZlbnRTdGF0ZTtcbiAgYWN0aW9uOiBLZXlib2FyZENvbnRyb2xQYXJhbXM7XG59XG5cbi8qKlxuICogIFNlcnZpY2UgdGhhdCBtYW5hZ2VzIGtleWJvYXJkIGtleXMgYW5kIGV4ZWN1dGUgYWN0aW9ucyBwZXIgcmVxdWVzdC5cbiAqICBJbmplY3QgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZSBpbnRvIGFueSBsYXllciwgdW5kZXIgeW91ciBgYWMtbWFwYCBjb21wb25lbnQsXG4gKiAgQW5kIGRlZmluZWQgeW91IGtleWJvYXJkIGhhbmRsZXJzIHVzaW5nIGBzZXRLZXlib2FyZENvbnRyb2xzYC5cbiAqXG4gKiA8Y2FwdGlvbj5TaW1wbGUgRXhhbXBsZTwvY2FwdGlvbj5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAna2V5Ym9hcmQtY29udHJvbC1sYXllcicsXG4gKiAgIHRlbXBsYXRlOiAnJyxcbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgS2V5Ym9hcmRDb250cm9sTGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5Ym9hcmRDb250cm9sU2VydmljZTogS2V5Ym9hcmRDb250cm9sU2VydmljZSkge31cbiAqXG4gKiAgIG5nT25Jbml0KCkge1xuICogICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5zZXRLZXlib2FyZENvbnRyb2xzKHtcbiAqICAgICAgIFc6IHsgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRk9SV0FSRCB9LFxuICogICAgICAgUzogeyBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9CQUNLV0FSRCB9LFxuICogICAgICAgRDogeyBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9SSUdIVCB9LFxuICogICAgICAgQTogeyBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MRUZUIH0sXG4gKiAgICAgfSk7XG4gKiAgICB9XG4gKlxuICogICBuZ09uRGVzdHJveSgpIHtcbiAqICAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2UucmVtb3ZlS2V5Ym9hcmRDb250cm9scygpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiA8Y2FwdGlvbj5BZHZhbmNlZCBFeGFtcGxlPC9jYXB0aW9uPlxuICogYGBgdHlwZXNjcmlwdFxuICogQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdrZXlib2FyZC1jb250cm9sLWxheWVyJyxcbiAqICAgdGVtcGxhdGU6ICcnLFxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBLZXlib2FyZENvbnRyb2xMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlKSB7fVxuICpcbiAqICAgcHJpdmF0ZSBteUN1c3RvbVZhbHVlID0gMTA7XG4gKlxuICogICBuZ09uSW5pdCgpIHtcbiAqICAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2Uuc2V0S2V5Ym9hcmRDb250cm9scyh7XG4gKiAgICAgICBXOiB7XG4gKiAgICAgICAgICBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9GT1JXQVJELFxuICogICAgICAgICAgdmFsaWRhdGU6IChjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleSkgPT4ge1xuICogICAgICAgICAgICAvLyBSZXBsYWNlIGBjaGVja0NhbWVyYWAgeW91IHdpdGggeW91ciB2YWxpZGF0aW9uIGxvZ2ljXG4gKiAgICAgICAgICAgIGlmIChjaGVja0NhbWVyYShjYW1lcmEpIHx8IHBhcmFtcy5jdXN0b21QYXJhbXMgPT09IHRydWUpIHtcbiAqICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAqICAgICAgICAgICAgfVxuICpcbiAqICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICogICAgICAgICAgfSxcbiAqICAgICAgICAgIHBhcmFtczogKCkgPT4ge1xuICogICAgICAgICAgICByZXR1cm4ge1xuICogICAgICAgICAgICAgIG15VmFsdWU6IHRoaXMubXlDdXN0b21WYWx1ZSxcbiAqICAgICAgICAgICAgfTtcbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgfVxuICogICAgIH0pO1xuICogICAgfVxuICpcbiAqICAgbmdPbkRlc3Ryb3koKSB7XG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnJlbW92ZUtleWJvYXJkQ29udHJvbHMoKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiA8Yj5QcmVkZWZpbmVkIGtleWJvYXJkIGFjdGlvbnM6PC9iPlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0ZPUldBUkRgIC0gTW92ZXMgdGhlIGNhbWVyYSBmb3J3YXJkLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfQkFDS1dBUkRgIC0gTW92ZXMgdGhlIGNhbWVyYSBiYWNrd2FyZCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1VQYCAtIE1vdmVzIHRoZSBjYW1lcmEgdXAsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ET1dOYCAtIE1vdmVzIHRoZSBjYW1lcmEgZG93biwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JJR0hUYCAtIE1vdmVzIHRoZSBjYW1lcmEgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MRUZUYCAtIE1vdmVzIHRoZSBjYW1lcmEgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfUklHSFRgIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgdG8gdGhlIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXRcbiAqIGNvbnRyb2xzIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX0xFRlRgIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdFxuICogY29udHJvbHMgdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfVVBgIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgdXAsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfRE9XTmAgLSBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayBkb3duLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9UV0lTVF9SSUdIVGAgLSBUd2lzdHMgdGhlIGNhbWVyYSB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW1vdW50YCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgdHdpc3QgYW1vdW50XG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfVFdJU1RfTEVGVGAgLSBUd2lzdHMgdGhlIGNhbWVyYSB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbW91bnRgIHRoYXQgY29udHJvbHNcbiAqIHRoZSB0d2lzdCBhbW91bnRcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfUklHSFRgIC0gUm90YXRlcyB0aGUgY2FtZXJhIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX0xFRlRgIC0gUm90YXRlcyB0aGUgY2FtZXJhIHRvIHRoZSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgcm90YXRpb24gYW5nbGVcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfVVBgIC0gUm90YXRlcyB0aGUgY2FtZXJhIHVwd2FyZHMsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSByb3RhdGlvbiBhbmdsZVxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9ET1dOYCAtIFJvdGF0ZXMgdGhlIGNhbWVyYSBkb3dud2FyZHMsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSByb3RhdGlvbiBhbmdsZVxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1pPT01fSU5gIC0gWm9vbSBpbiBpbnRvIHRoZSBjdXJyZW50IGNhbWVyYSBjZW50ZXIgcG9zaXRpb24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZFxuICogYGFtb3VudGAgdGhhdCBjb250cm9scyB0aGUgYW1vdW50IG9mIHpvb20gaW4gbWV0ZXJzLlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1pPT01fT1VUYCAtICBab29tIG91dCBmcm9tIHRoZSBjdXJyZW50IGNhbWVyYSBjZW50ZXIgcG9zaXRpb24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZFxuICogYGFtb3VudGAgdGhhdCBjb250cm9scyB0aGUgYW1vdW50IG9mIHpvb20gaW4gbWV0ZXJzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRDb250cm9sU2VydmljZSB7XG4gIHByaXZhdGUgX2N1cnJlbnREZWZpbml0aW9uczogS2V5Ym9hcmRDb250cm9sRGVmaW5pdGlvbiA9IG51bGw7XG4gIHByaXZhdGUgX2FjdGl2ZURlZmluaXRpb25zOiB7IFtkZWZpbml0aW9uS2V5OiBzdHJpbmddOiBBY3RpdmVEZWZpbml0aW9uIH0gPSB7fTtcbiAgcHJpdmF0ZSBfa2V5TWFwcGluZ0ZuOiBGdW5jdGlvbiA9IHRoaXMuZGVmYXVsdEtleU1hcHBpbmdGbjtcblxuICAvKipcbiAgICogQ3JlYXRzIHRoZSBrZXlib2FyZCBjb250cm9sIHNlcnZpY2UuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSkge1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBrZXlib2FyZCBjb250cm9sIHNlcnZpY2UuXG4gICAqL1xuICBpbml0KCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRDYW52YXMoKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjYW52YXMuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlS2V5dXAgPSB0aGlzLmhhbmRsZUtleXVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVUaWNrID0gdGhpcy5oYW5kbGVUaWNrLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY3VycmVudCBtYXAga2V5Ym9hcmQgY29udHJvbCBkZWZpbml0aW9ucy5cbiAgICogVGhlIGRlZmluaXRpb25zIGlzIGEga2V5IG1hcHBpbmcgYmV0d2VlbiBhIGtleSBzdHJpbmcgYW5kIGEgS2V5Ym9hcmRDb250cm9sRGVmaW5pdGlvbjpcbiAgICogLSBgYWN0aW9uYCBpcyBhIHByZWRlZmluZSBhY3Rpb24gZnJvbSBgS2V5Ym9hcmRBY3Rpb25gIGVudW0sIG9yIGEgY3VzdG9tIG1ldGhvZDpcbiAgICogYChjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleSkgPT4gYm9vbGVhbiB8IHZvaWRgIC0gcmV0dXJuaW5nIGZhbHNlIHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGtleWRvd24uXG4gICAqIC0gYHZhbGlkYXRpb25gIGlzIGEgbWV0aG9kIHRoYXQgdmFsaWRhdGVzIGlmIHRoZSBldmVudCBzaG91bGQgb2NjdXIgb3Igbm90IChgY2FtZXJhLCBzY2VuZSwgcGFyYW1zLCBrZXlgKVxuICAgKiAtIGBwYXJhbXNgIGlzIGFuIG9iamVjdCAob3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIG9iamVjdCkgdGhhdCB3aWxsIGJlIHBhc3NlZCBpbnRvIHRoZSBhY3Rpb24gZXhlY3V0b3IuXG4gICAqIC0gYGRvbmVgIGlzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIGBrZXl1cGAgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbnMgS2V5Ym9hcmQgQ29udHJvbCBEZWZpbml0aW9uXG4gICAqIEBwYXJhbSBrZXlNYXBwaW5nRm4gLSBNYXBwaW5nIGZ1bmN0aW9uIGZvciBjdXN0b20ga2V5c1xuICAgKiBAcGFyYW0gb3V0c2lkZU9mQW5ndWxhclpvbmUgLSBpZiBrZXkgZG93biBldmVudHMgd2lsbCBydW4gb3V0c2lkZSBvZiBhbmd1bGFyIHpvbmUuXG4gICAqL1xuICBzZXRLZXlib2FyZENvbnRyb2xzKGRlZmluaXRpb25zOiBLZXlib2FyZENvbnRyb2xEZWZpbml0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgIGtleU1hcHBpbmdGbj86IChrZXlFdmVudDogS2V5Ym9hcmRFdmVudCkgPT4gc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIG91dHNpZGVPZkFuZ3VsYXJab25lID0gZmFsc2UpIHtcbiAgICBpZiAoIWRlZmluaXRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW1vdmVLZXlib2FyZENvbnRyb2xzKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMob3V0c2lkZU9mQW5ndWxhclpvbmUpO1xuICAgIH1cblxuICAgIHRoaXMuX2N1cnJlbnREZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuICAgIHRoaXMuX2tleU1hcHBpbmdGbiA9IGtleU1hcHBpbmdGbiB8fCB0aGlzLmRlZmF1bHRLZXlNYXBwaW5nRm47XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2tleV0gPSB7XG4gICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLk5PVF9QUkVTU0VELFxuICAgICAgICBhY3Rpb246IG51bGwsXG4gICAgICAgIGtleWJvYXJkRXZlbnQ6IG51bGwsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGN1cnJlbnQgc2V0IG9mIGtleWJvYXJkIGNvbnRyb2wgaXRlbXMsIGFuZCB1bnJlZ2lzdGVyIGZyb20gbWFwIGV2ZW50cy5cbiAgICovXG4gIHJlbW92ZUtleWJvYXJkQ29udHJvbHMoKSB7XG4gICAgdGhpcy51bnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgdGhpcy5fY3VycmVudERlZmluaXRpb25zID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IGFjdGlvbiB0aGF0IGhhbmRsZXMgYGNoYXJgIGtleSBzdHJpbmcsIG9yIGBudWxsYCBpZiBub3QgZXhpc3RzXG4gICAqL1xuICBwcml2YXRlIGdldEFjdGlvbihjaGFyOiBzdHJpbmcpOiBLZXlib2FyZENvbnRyb2xQYXJhbXMge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnNbY2hhcl0gfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBgZGVmYXVsdEtleU1hcHBpbmdGbmAgdGhhdCBtYXBzIGBLZXlib2FyZEV2ZW50YCBpbnRvIGEga2V5IHN0cmluZy5cbiAgICovXG4gIHByaXZhdGUgZGVmYXVsdEtleU1hcHBpbmdGbihrZXlFdmVudDogS2V5Ym9hcmRFdmVudCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5RXZlbnQua2V5Q29kZSk7XG4gIH1cblxuICAvKipcbiAgICogZG9jdW1lbnQncyBga2V5ZG93bmAgZXZlbnQgaGFuZGxlclxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVLZXlkb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBjaGFyID0gdGhpcy5fa2V5TWFwcGluZ0ZuKGUpO1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZ2V0QWN0aW9uKGNoYXIpO1xuXG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgY29uc3QgYWN0aW9uU3RhdGUgPSB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1tjaGFyXTtcblxuICAgICAgaWYgKGFjdGlvblN0YXRlLnN0YXRlICE9PSBLZXlFdmVudFN0YXRlLklHTk9SRUQpIHtcbiAgICAgICAgbGV0IGV4ZWN1dGUgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZ2V0UGFyYW1zKGFjdGlvbi5wYXJhbXMsIGUpO1xuXG4gICAgICAgIGlmIChhY3Rpb24udmFsaWRhdGlvbikge1xuICAgICAgICAgIGV4ZWN1dGUgPSBhY3Rpb24udmFsaWRhdGlvbih0aGlzLmNlc2l1bVNlcnZpY2UsIHBhcmFtcywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXhlY3V0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2NoYXJdID0ge1xuICAgICAgICAgICAgc3RhdGU6IEtleUV2ZW50U3RhdGUuUFJFU1NFRCxcbiAgICAgICAgICAgIGFjdGlvbixcbiAgICAgICAgICAgIGtleWJvYXJkRXZlbnQ6IGUsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBkb2N1bWVudCdzIGBrZXl1cGAgZXZlbnQgaGFuZGxlclxuICAgKi9cbiAgcHJpdmF0ZSBoYW5kbGVLZXl1cChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuX2tleU1hcHBpbmdGbihlKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmdldEFjdGlvbihjaGFyKTtcblxuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2NoYXJdID0ge1xuICAgICAgICBzdGF0ZTogS2V5RXZlbnRTdGF0ZS5OT1RfUFJFU1NFRCxcbiAgICAgICAgYWN0aW9uOiBudWxsLFxuICAgICAgICBrZXlib2FyZEV2ZW50OiBlLFxuICAgICAgfTtcblxuICAgICAgaWYgKGFjdGlvbi5kb25lICYmIHR5cGVvZiBhY3Rpb24uZG9uZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhY3Rpb24uZG9uZSh0aGlzLmNlc2l1bVNlcnZpY2UsIGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBgdGlja2AgZXZlbnQgaGFuZGxlciB0aGF0IHRyaWdnZXJlZCBieSBDZXNpdW0gcmVuZGVyIGxvb3BcbiAgICovXG4gIHByaXZhdGUgaGFuZGxlVGljaygpIHtcbiAgICBjb25zdCBhY3RpdmVLZXlzID0gT2JqZWN0LmtleXModGhpcy5fYWN0aXZlRGVmaW5pdGlvbnMpO1xuXG4gICAgYWN0aXZlS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25TdGF0ZSA9IHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2tleV07XG5cbiAgICAgIGlmIChhY3Rpb25TdGF0ZSAhPT0gbnVsbCAmJiBhY3Rpb25TdGF0ZS5hY3Rpb24gIT09IG51bGwgJiYgYWN0aW9uU3RhdGUuc3RhdGUgPT09IEtleUV2ZW50U3RhdGUuUFJFU1NFRCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGVBY3Rpb24oYWN0aW9uU3RhdGUuYWN0aW9uLCBrZXksIGFjdGlvblN0YXRlLmtleWJvYXJkRXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIFBhcmFtcyByZXNvbHZlIGZ1bmN0aW9uLCByZXR1cm5zIG9iamVjdC5cbiAgICogSW4gY2FzZSBvZiBwYXJhbXMgZnVuY3Rpb24sIGV4ZWN1dGVzIGl0IGFuZCByZXR1cm5zIGl0J3MgcmV0dXJuIHZhbHVlLlxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRQYXJhbXMocGFyYW1zRGVmOiBhbnksIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB7IFtwYXJhbU5hbWU6IHN0cmluZ106IGFueSB9IHtcbiAgICBpZiAoIXBhcmFtc0RlZikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFyYW1zRGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcGFyYW1zRGVmKHRoaXMuY2VzaXVtU2VydmljZSwga2V5Ym9hcmRFdmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtc0RlZjtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBFeGVjdXRlcyBhIGdpdmVuIGBLZXlib2FyZENvbnRyb2xQYXJhbXNgIG9iamVjdC5cbiAgICpcbiAgICovXG4gIHByaXZhdGUgZXhlY3V0ZUFjdGlvbihleGVjdXRpb246IEtleWJvYXJkQ29udHJvbFBhcmFtcywga2V5OiBzdHJpbmcsIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnREZWZpbml0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZ2V0UGFyYW1zKGV4ZWN1dGlvbi5wYXJhbXMsIGtleWJvYXJkRXZlbnQpO1xuXG4gICAgaWYgKGlzTnVtYmVyKGV4ZWN1dGlvbi5hY3Rpb24pKSB7XG4gICAgICBjb25zdCBwcmVkZWZpbmVkQWN0aW9uID0gUFJFREVGSU5FRF9LRVlCT0FSRF9BQ1RJT05TW2V4ZWN1dGlvbi5hY3Rpb24gYXMgbnVtYmVyXTtcblxuICAgICAgaWYgKHByZWRlZmluZWRBY3Rpb24pIHtcbiAgICAgICAgcHJlZGVmaW5lZEFjdGlvbih0aGlzLmNlc2l1bVNlcnZpY2UsIHBhcmFtcywga2V5Ym9hcmRFdmVudCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhlY3V0aW9uLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3Qgc2hvdWxkQ2FuY2VsRXZlbnQgPSBleGVjdXRpb24uYWN0aW9uKHRoaXMuY2VzaXVtU2VydmljZSwgcGFyYW1zLCBrZXlib2FyZEV2ZW50KTtcblxuICAgICAgaWYgKHNob3VsZENhbmNlbEV2ZW50ID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1trZXldID0ge1xuICAgICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLklHTk9SRUQsXG4gICAgICAgICAgYWN0aW9uOiBudWxsLFxuICAgICAgICAgIGtleWJvYXJkRXZlbnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0byBrZXlkb3duLCBrZXl1cCBvZiBgZG9jdW1lbnRgLCBhbmQgYHRpY2tgIG9mIENlc2l1bS5cbiAgICovXG4gIHByaXZhdGUgcmVnaXN0ZXJFdmVudHMob3V0c2lkZU9mQW5ndWxhclpvbmU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCByZWdpc3RlclRvRXZlbnRzID0gKCkgPT4ge1xuICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlkb3duKTtcbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleXVwKTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jbG9jay5vblRpY2suYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmhhbmRsZVRpY2spO1xuICAgIH07XG5cbiAgICBpZiAob3V0c2lkZU9mQW5ndWxhclpvbmUpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKHJlZ2lzdGVyVG9FdmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWdpc3RlclRvRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVucmVnaXN0ZXJzIHRvIGtleWRvd24sIGtleXVwIG9mIGBkb2N1bWVudGAsIGFuZCBgdGlja2Agb2YgQ2VzaXVtLlxuICAgKi9cbiAgcHJpdmF0ZSB1bnJlZ2lzdGVyRXZlbnRzKCkge1xuICAgIHRoaXMuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5dXApO1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jbG9jay5vblRpY2sucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmhhbmRsZVRpY2spO1xuICB9XG59XG4iXX0=
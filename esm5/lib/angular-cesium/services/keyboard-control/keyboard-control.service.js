import { __decorate, __metadata, __param } from "tslib";
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
var KeyboardControlService = /** @class */ (function () {
    /**
     * Creats the keyboard control service.
     */
    function KeyboardControlService(ngZone, cesiumService, document) {
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
    KeyboardControlService.prototype.init = function () {
        var canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', function () {
            canvas.focus();
        });
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleTick = this.handleTick.bind(this);
    };
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
    KeyboardControlService.prototype.setKeyboardControls = function (definitions, keyMappingFn, outsideOfAngularZone) {
        var _this = this;
        if (outsideOfAngularZone === void 0) { outsideOfAngularZone = false; }
        if (!definitions) {
            return this.removeKeyboardControls();
        }
        if (!this._currentDefinitions) {
            this.registerEvents(outsideOfAngularZone);
        }
        this._currentDefinitions = definitions;
        this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;
        Object.keys(this._currentDefinitions).forEach(function (key) {
            _this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        });
    };
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     */
    KeyboardControlService.prototype.removeKeyboardControls = function () {
        this.unregisterEvents();
        this._currentDefinitions = null;
    };
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     */
    KeyboardControlService.prototype.getAction = function (char) {
        return this._currentDefinitions[char] || null;
    };
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    KeyboardControlService.prototype.defaultKeyMappingFn = function (keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    };
    /**
     * document's `keydown` event handler
     */
    KeyboardControlService.prototype.handleKeydown = function (e) {
        var char = this._keyMappingFn(e);
        var action = this.getAction(char);
        if (action) {
            var actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                var execute = true;
                var params = this.getParams(action.params, e);
                if (action.validation) {
                    execute = action.validation(this.cesiumService, params, e);
                }
                if (execute === true) {
                    this._activeDefinitions[char] = {
                        state: KeyEventState.PRESSED,
                        action: action,
                        keyboardEvent: e,
                    };
                }
            }
        }
    };
    /**
     * document's `keyup` event handler
     */
    KeyboardControlService.prototype.handleKeyup = function (e) {
        var char = this._keyMappingFn(e);
        var action = this.getAction(char);
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
    };
    /**
     * `tick` event handler that triggered by Cesium render loop
     */
    KeyboardControlService.prototype.handleTick = function () {
        var _this = this;
        var activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach(function (key) {
            var actionState = _this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                _this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        });
    };
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     */
    KeyboardControlService.prototype.getParams = function (paramsDef, keyboardEvent) {
        if (!paramsDef) {
            return {};
        }
        if (typeof paramsDef === 'function') {
            return paramsDef(this.cesiumService, keyboardEvent);
        }
        return paramsDef;
    };
    /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     */
    KeyboardControlService.prototype.executeAction = function (execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        var params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            var predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            var shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);
            if (shouldCancelEvent === false) {
                this._activeDefinitions[key] = {
                    state: KeyEventState.IGNORED,
                    action: null,
                    keyboardEvent: null,
                };
            }
        }
    };
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     */
    KeyboardControlService.prototype.registerEvents = function (outsideOfAngularZone) {
        var _this = this;
        var registerToEvents = function () {
            _this.document.addEventListener('keydown', _this.handleKeydown);
            _this.document.addEventListener('keyup', _this.handleKeyup);
            _this.cesiumService.getViewer().clock.onTick.addEventListener(_this.handleTick);
        };
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    };
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     */
    KeyboardControlService.prototype.unregisterEvents = function () {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    };
    KeyboardControlService.ctorParameters = function () { return [
        { type: NgZone },
        { type: CesiumService },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    KeyboardControlService = __decorate([
        Injectable(),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [NgZone, CesiumService, Object])
    ], KeyboardControlService);
    return KeyboardControlService;
}());
export { KeyboardControlService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9rZXlib2FyZC1jb250cm9sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFpQm5FLElBQUssYUFJSjtBQUpELFdBQUssYUFBYTtJQUNoQix1REFBTyxDQUFBO0lBQ1AsK0RBQVcsQ0FBQTtJQUNYLHVEQUFPLENBQUE7QUFDVCxDQUFDLEVBSkksYUFBYSxLQUFiLGFBQWEsUUFJakI7QUFRRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVHRztBQUVIO0lBS0U7O09BRUc7SUFDSCxnQ0FBb0IsTUFBYyxFQUFVLGFBQTRCLEVBQTRCLFFBQWE7UUFBN0YsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQTRCLGFBQVEsR0FBUixRQUFRLENBQUs7UUFQekcsd0JBQW1CLEdBQThCLElBQUksQ0FBQztRQUN0RCx1QkFBa0IsR0FBa0QsRUFBRSxDQUFDO1FBQ3ZFLGtCQUFhLEdBQWEsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0lBTTNELENBQUM7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LEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25GLENBQUM7O2dCQXBOMkIsTUFBTTtnQkFBeUIsYUFBYTtnREFBRyxNQUFNLFNBQUMsUUFBUTs7SUFSL0Usc0JBQXNCO1FBRGxDLFVBQVUsRUFBRTtRQVNnRSxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTt5Q0FBL0QsTUFBTSxFQUF5QixhQUFhO09BUjdELHNCQUFzQixDQTZObEM7SUFBRCw2QkFBQztDQUFBLEFBN05ELElBNk5DO1NBN05ZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzTnVtYmVyIH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgS2V5Ym9hcmRBY3Rpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMta2V5Ym9hcmQtYWN0aW9uLmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQUkVERUZJTkVEX0tFWUJPQVJEX0FDVElPTlMgfSBmcm9tICcuL3ByZWRlZmluZWQtYWN0aW9ucyc7XG5cbmV4cG9ydCB0eXBlIEtleWJvYXJkQ29udHJvbEFjdGlvbkZuID0gKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55LCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gYm9vbGVhbiB8IHZvaWQ7XG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xWYWxpZGF0aW9uRm4gPSAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnksIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFuO1xuZXhwb3J0IHR5cGUgS2V5Ym9hcmRDb250cm9sRG9uZUZuID0gKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFuO1xuXG5leHBvcnQgaW50ZXJmYWNlIEtleWJvYXJkQ29udHJvbFBhcmFtcyB7XG4gIGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24gfCBLZXlib2FyZENvbnRyb2xBY3Rpb25GbjtcbiAgdmFsaWRhdGlvbj86IEtleWJvYXJkQ29udHJvbFZhbGlkYXRpb25GbjtcbiAgcGFyYW1zPzogeyBbcGFyYW1OYW1lOiBzdHJpbmddOiBhbnkgfTtcbiAgZG9uZT86IEtleWJvYXJkQ29udHJvbERvbmVGbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlib2FyZENvbnRyb2xEZWZpbml0aW9uIHtcbiAgW2tleWJvYXJkQ2hhckNvZGU6IHN0cmluZ106IEtleWJvYXJkQ29udHJvbFBhcmFtcztcbn1cblxuZW51bSBLZXlFdmVudFN0YXRlIHtcbiAgSUdOT1JFRCxcbiAgTk9UX1BSRVNTRUQsXG4gIFBSRVNTRUQsXG59XG5cbmludGVyZmFjZSBBY3RpdmVEZWZpbml0aW9uIHtcbiAga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudDtcbiAgc3RhdGU6IEtleUV2ZW50U3RhdGU7XG4gIGFjdGlvbjogS2V5Ym9hcmRDb250cm9sUGFyYW1zO1xufVxuXG4vKipcbiAqICBTZXJ2aWNlIHRoYXQgbWFuYWdlcyBrZXlib2FyZCBrZXlzIGFuZCBleGVjdXRlIGFjdGlvbnMgcGVyIHJlcXVlc3QuXG4gKiAgSW5qZWN0IHRoZSBrZXlib2FyZCBjb250cm9sIHNlcnZpY2UgaW50byBhbnkgbGF5ZXIsIHVuZGVyIHlvdXIgYGFjLW1hcGAgY29tcG9uZW50LFxuICogIEFuZCBkZWZpbmVkIHlvdSBrZXlib2FyZCBoYW5kbGVycyB1c2luZyBgc2V0S2V5Ym9hcmRDb250cm9sc2AuXG4gKlxuICogPGNhcHRpb24+U2ltcGxlIEV4YW1wbGU8L2NhcHRpb24+XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ2tleWJvYXJkLWNvbnRyb2wtbGF5ZXInLFxuICogICB0ZW1wbGF0ZTogJycsXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEtleWJvYXJkQ29udHJvbExheWVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleWJvYXJkQ29udHJvbFNlcnZpY2U6IEtleWJvYXJkQ29udHJvbFNlcnZpY2UpIHt9XG4gKlxuICogICBuZ09uSW5pdCgpIHtcbiAqICAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2Uuc2V0S2V5Ym9hcmRDb250cm9scyh7XG4gKiAgICAgICBXOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0ZPUldBUkQgfSxcbiAqICAgICAgIFM6IHsgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfQkFDS1dBUkQgfSxcbiAqICAgICAgIEQ6IHsgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUklHSFQgfSxcbiAqICAgICAgIEE6IHsgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTEVGVCB9LFxuICogICAgIH0pO1xuICogICAgfVxuICpcbiAqICAgbmdPbkRlc3Ryb3koKSB7XG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnJlbW92ZUtleWJvYXJkQ29udHJvbHMoKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogPGNhcHRpb24+QWR2YW5jZWQgRXhhbXBsZTwvY2FwdGlvbj5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAna2V5Ym9hcmQtY29udHJvbC1sYXllcicsXG4gKiAgIHRlbXBsYXRlOiAnJyxcbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgS2V5Ym9hcmRDb250cm9sTGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5Ym9hcmRDb250cm9sU2VydmljZTogS2V5Ym9hcmRDb250cm9sU2VydmljZSkge31cbiAqXG4gKiAgIHByaXZhdGUgbXlDdXN0b21WYWx1ZSA9IDEwO1xuICpcbiAqICAgbmdPbkluaXQoKSB7XG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnNldEtleWJvYXJkQ29udHJvbHMoe1xuICogICAgICAgVzoge1xuICogICAgICAgICAgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRk9SV0FSRCxcbiAqICAgICAgICAgIHZhbGlkYXRlOiAoY2FtZXJhLCBzY2VuZSwgcGFyYW1zLCBrZXkpID0+IHtcbiAqICAgICAgICAgICAgLy8gUmVwbGFjZSBgY2hlY2tDYW1lcmFgIHlvdSB3aXRoIHlvdXIgdmFsaWRhdGlvbiBsb2dpY1xuICogICAgICAgICAgICBpZiAoY2hlY2tDYW1lcmEoY2FtZXJhKSB8fCBwYXJhbXMuY3VzdG9tUGFyYW1zID09PSB0cnVlKSB7XG4gKiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gKiAgICAgICAgICAgIH1cbiAqXG4gKiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgICBwYXJhbXM6ICgpID0+IHtcbiAqICAgICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICAgICBteVZhbHVlOiB0aGlzLm15Q3VzdG9tVmFsdWUsXG4gKiAgICAgICAgICAgIH07XG4gKiAgICAgICAgICB9LFxuICogICAgICAgIH1cbiAqICAgICB9KTtcbiAqICAgIH1cbiAqXG4gKiAgIG5nT25EZXN0cm95KCkge1xuICogICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5yZW1vdmVLZXlib2FyZENvbnRyb2xzKCk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICogPGI+UHJlZGVmaW5lZCBrZXlib2FyZCBhY3Rpb25zOjwvYj5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9GT1JXQVJEYCAtIE1vdmVzIHRoZSBjYW1lcmEgZm9yd2FyZCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0JBQ0tXQVJEYCAtIE1vdmVzIHRoZSBjYW1lcmEgYmFja3dhcmQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9VUGAgLSBNb3ZlcyB0aGUgY2FtZXJhIHVwLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRE9XTmAgLSBNb3ZlcyB0aGUgY2FtZXJhIGRvd24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9SSUdIVGAgLSBNb3ZlcyB0aGUgY2FtZXJhIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTEVGVGAgLSBNb3ZlcyB0aGUgY2FtZXJhIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX1JJR0hUYCAtIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0XG4gKiBjb250cm9scyB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19MRUZUYCAtIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHRvIHRoZSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXRcbiAqIGNvbnRyb2xzIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX1VQYCAtIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHVwLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXQgY29udHJvbHNcbiAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX0RPV05gIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgZG93biwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfVFdJU1RfUklHSFRgIC0gVHdpc3RzIHRoZSBjYW1lcmEgdG8gdGhlIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFtb3VudGAgdGhhdCBjb250cm9sc1xuICogdGhlIHR3aXN0IGFtb3VudFxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1RXSVNUX0xFRlRgIC0gVHdpc3RzIHRoZSBjYW1lcmEgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW1vdW50YCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgdHdpc3QgYW1vdW50XG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX1JJR0hUYCAtIFJvdGF0ZXMgdGhlIGNhbWVyYSB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAqIHRoZSByb3RhdGlvbiBhbmdsZVxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9MRUZUYCAtIFJvdGF0ZXMgdGhlIGNhbWVyYSB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX1VQYCAtIFJvdGF0ZXMgdGhlIGNhbWVyYSB1cHdhcmRzLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgcm90YXRpb24gYW5nbGVcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfRE9XTmAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgZG93bndhcmRzLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXG4gKiB0aGUgcm90YXRpb24gYW5nbGVcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9aT09NX0lOYCAtIFpvb20gaW4gaW50byB0aGUgY3VycmVudCBjYW1lcmEgY2VudGVyIHBvc2l0aW9uLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWRcbiAqIGBhbW91bnRgIHRoYXQgY29udHJvbHMgdGhlIGFtb3VudCBvZiB6b29tIGluIG1ldGVycy5cbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9aT09NX09VVGAgLSAgWm9vbSBvdXQgZnJvbSB0aGUgY3VycmVudCBjYW1lcmEgY2VudGVyIHBvc2l0aW9uLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWRcbiAqIGBhbW91bnRgIHRoYXQgY29udHJvbHMgdGhlIGFtb3VudCBvZiB6b29tIGluIG1ldGVycy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEtleWJvYXJkQ29udHJvbFNlcnZpY2Uge1xuICBwcml2YXRlIF9jdXJyZW50RGVmaW5pdGlvbnM6IEtleWJvYXJkQ29udHJvbERlZmluaXRpb24gPSBudWxsO1xuICBwcml2YXRlIF9hY3RpdmVEZWZpbml0aW9uczogeyBbZGVmaW5pdGlvbktleTogc3RyaW5nXTogQWN0aXZlRGVmaW5pdGlvbiB9ID0ge307XG4gIHByaXZhdGUgX2tleU1hcHBpbmdGbjogRnVuY3Rpb24gPSB0aGlzLmRlZmF1bHRLZXlNYXBwaW5nRm47XG5cbiAgLyoqXG4gICAqIENyZWF0cyB0aGUga2V5Ym9hcmQgY29udHJvbCBzZXJ2aWNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnkpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUga2V5Ym9hcmQgY29udHJvbCBzZXJ2aWNlLlxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Q2FudmFzKCk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY2FudmFzLmZvY3VzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmhhbmRsZUtleWRvd24gPSB0aGlzLmhhbmRsZUtleWRvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUtleXVwID0gdGhpcy5oYW5kbGVLZXl1cC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlVGljayA9IHRoaXMuaGFuZGxlVGljay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGN1cnJlbnQgbWFwIGtleWJvYXJkIGNvbnRyb2wgZGVmaW5pdGlvbnMuXG4gICAqIFRoZSBkZWZpbml0aW9ucyBpcyBhIGtleSBtYXBwaW5nIGJldHdlZW4gYSBrZXkgc3RyaW5nIGFuZCBhIEtleWJvYXJkQ29udHJvbERlZmluaXRpb246XG4gICAqIC0gYGFjdGlvbmAgaXMgYSBwcmVkZWZpbmUgYWN0aW9uIGZyb20gYEtleWJvYXJkQWN0aW9uYCBlbnVtLCBvciBhIGN1c3RvbSBtZXRob2Q6XG4gICAqIGAoY2FtZXJhLCBzY2VuZSwgcGFyYW1zLCBrZXkpID0+IGJvb2xlYW4gfCB2b2lkYCAtIHJldHVybmluZyBmYWxzZSB3aWxsIGNhbmNlbCB0aGUgY3VycmVudCBrZXlkb3duLlxuICAgKiAtIGB2YWxpZGF0aW9uYCBpcyBhIG1ldGhvZCB0aGF0IHZhbGlkYXRlcyBpZiB0aGUgZXZlbnQgc2hvdWxkIG9jY3VyIG9yIG5vdCAoYGNhbWVyYSwgc2NlbmUsIHBhcmFtcywga2V5YClcbiAgICogLSBgcGFyYW1zYCBpcyBhbiBvYmplY3QgKG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvYmplY3QpIHRoYXQgd2lsbCBiZSBwYXNzZWQgaW50byB0aGUgYWN0aW9uIGV4ZWN1dG9yLlxuICAgKiAtIGBkb25lYCBpcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBga2V5dXBgIGlzIHRyaWdnZXJlZC5cbiAgICogQHBhcmFtIGRlZmluaXRpb25zIEtleWJvYXJkIENvbnRyb2wgRGVmaW5pdGlvblxuICAgKiBAcGFyYW0ga2V5TWFwcGluZ0ZuIC0gTWFwcGluZyBmdW5jdGlvbiBmb3IgY3VzdG9tIGtleXNcbiAgICogQHBhcmFtIG91dHNpZGVPZkFuZ3VsYXJab25lIC0gaWYga2V5IGRvd24gZXZlbnRzIHdpbGwgcnVuIG91dHNpZGUgb2YgYW5ndWxhciB6b25lLlxuICAgKi9cbiAgc2V0S2V5Ym9hcmRDb250cm9scyhkZWZpbml0aW9uczogS2V5Ym9hcmRDb250cm9sRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICBrZXlNYXBwaW5nRm4/OiAoa2V5RXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICBvdXRzaWRlT2ZBbmd1bGFyWm9uZSA9IGZhbHNlKSB7XG4gICAgaWYgKCFkZWZpbml0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlS2V5Ym9hcmRDb250cm9scygpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fY3VycmVudERlZmluaXRpb25zKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKG91dHNpZGVPZkFuZ3VsYXJab25lKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcbiAgICB0aGlzLl9rZXlNYXBwaW5nRm4gPSBrZXlNYXBwaW5nRm4gfHwgdGhpcy5kZWZhdWx0S2V5TWFwcGluZ0ZuO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5fY3VycmVudERlZmluaXRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1trZXldID0ge1xuICAgICAgICBzdGF0ZTogS2V5RXZlbnRTdGF0ZS5OT1RfUFJFU1NFRCxcbiAgICAgICAgYWN0aW9uOiBudWxsLFxuICAgICAgICBrZXlib2FyZEV2ZW50OiBudWxsLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBjdXJyZW50IHNldCBvZiBrZXlib2FyZCBjb250cm9sIGl0ZW1zLCBhbmQgdW5yZWdpc3RlciBmcm9tIG1hcCBldmVudHMuXG4gICAqL1xuICByZW1vdmVLZXlib2FyZENvbnRyb2xzKCkge1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50cygpO1xuICAgIHRoaXMuX2N1cnJlbnREZWZpbml0aW9ucyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBhY3Rpb24gdGhhdCBoYW5kbGVzIGBjaGFyYCBrZXkgc3RyaW5nLCBvciBgbnVsbGAgaWYgbm90IGV4aXN0c1xuICAgKi9cbiAgcHJpdmF0ZSBnZXRBY3Rpb24oY2hhcjogc3RyaW5nKTogS2V5Ym9hcmRDb250cm9sUGFyYW1zIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudERlZmluaXRpb25zW2NoYXJdIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgYGRlZmF1bHRLZXlNYXBwaW5nRm5gIHRoYXQgbWFwcyBgS2V5Ym9hcmRFdmVudGAgaW50byBhIGtleSBzdHJpbmcuXG4gICAqL1xuICBwcml2YXRlIGRlZmF1bHRLZXlNYXBwaW5nRm4oa2V5RXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUV2ZW50LmtleUNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIGRvY3VtZW50J3MgYGtleWRvd25gIGV2ZW50IGhhbmRsZXJcbiAgICovXG4gIHByaXZhdGUgaGFuZGxlS2V5ZG93bihlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgY2hhciA9IHRoaXMuX2tleU1hcHBpbmdGbihlKTtcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmdldEFjdGlvbihjaGFyKTtcblxuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIGNvbnN0IGFjdGlvblN0YXRlID0gdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNbY2hhcl07XG5cbiAgICAgIGlmIChhY3Rpb25TdGF0ZS5zdGF0ZSAhPT0gS2V5RXZlbnRTdGF0ZS5JR05PUkVEKSB7XG4gICAgICAgIGxldCBleGVjdXRlID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldFBhcmFtcyhhY3Rpb24ucGFyYW1zLCBlKTtcblxuICAgICAgICBpZiAoYWN0aW9uLnZhbGlkYXRpb24pIHtcbiAgICAgICAgICBleGVjdXRlID0gYWN0aW9uLnZhbGlkYXRpb24odGhpcy5jZXNpdW1TZXJ2aWNlLCBwYXJhbXMsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4ZWN1dGUgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1tjaGFyXSA9IHtcbiAgICAgICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLlBSRVNTRUQsXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICBrZXlib2FyZEV2ZW50OiBlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogZG9jdW1lbnQncyBga2V5dXBgIGV2ZW50IGhhbmRsZXJcbiAgICovXG4gIHByaXZhdGUgaGFuZGxlS2V5dXAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGNoYXIgPSB0aGlzLl9rZXlNYXBwaW5nRm4oZSk7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5nZXRBY3Rpb24oY2hhcik7XG5cbiAgICBpZiAoYWN0aW9uKSB7XG4gICAgICB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1tjaGFyXSA9IHtcbiAgICAgICAgc3RhdGU6IEtleUV2ZW50U3RhdGUuTk9UX1BSRVNTRUQsXG4gICAgICAgIGFjdGlvbjogbnVsbCxcbiAgICAgICAga2V5Ym9hcmRFdmVudDogZSxcbiAgICAgIH07XG5cbiAgICAgIGlmIChhY3Rpb24uZG9uZSAmJiB0eXBlb2YgYWN0aW9uLmRvbmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgYWN0aW9uLmRvbmUodGhpcy5jZXNpdW1TZXJ2aWNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYHRpY2tgIGV2ZW50IGhhbmRsZXIgdGhhdCB0cmlnZ2VyZWQgYnkgQ2VzaXVtIHJlbmRlciBsb29wXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVRpY2soKSB7XG4gICAgY29uc3QgYWN0aXZlS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2FjdGl2ZURlZmluaXRpb25zKTtcblxuICAgIGFjdGl2ZUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uU3RhdGUgPSB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1trZXldO1xuXG4gICAgICBpZiAoYWN0aW9uU3RhdGUgIT09IG51bGwgJiYgYWN0aW9uU3RhdGUuYWN0aW9uICE9PSBudWxsICYmIGFjdGlvblN0YXRlLnN0YXRlID09PSBLZXlFdmVudFN0YXRlLlBSRVNTRUQpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQWN0aW9uKGFjdGlvblN0YXRlLmFjdGlvbiwga2V5LCBhY3Rpb25TdGF0ZS5rZXlib2FyZEV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBQYXJhbXMgcmVzb2x2ZSBmdW5jdGlvbiwgcmV0dXJucyBvYmplY3QuXG4gICAqIEluIGNhc2Ugb2YgcGFyYW1zIGZ1bmN0aW9uLCBleGVjdXRlcyBpdCBhbmQgcmV0dXJucyBpdCdzIHJldHVybiB2YWx1ZS5cbiAgICpcbiAgICovXG4gIHByaXZhdGUgZ2V0UGFyYW1zKHBhcmFtc0RlZjogYW55LCBrZXlib2FyZEV2ZW50OiBLZXlib2FyZEV2ZW50KTogeyBbcGFyYW1OYW1lOiBzdHJpbmddOiBhbnkgfSB7XG4gICAgaWYgKCFwYXJhbXNEZWYpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcmFtc0RlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHBhcmFtc0RlZih0aGlzLmNlc2l1bVNlcnZpY2UsIGtleWJvYXJkRXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXNEZWY7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogRXhlY3V0ZXMgYSBnaXZlbiBgS2V5Ym9hcmRDb250cm9sUGFyYW1zYCBvYmplY3QuXG4gICAqXG4gICAqL1xuICBwcml2YXRlIGV4ZWN1dGVBY3Rpb24oZXhlY3V0aW9uOiBLZXlib2FyZENvbnRyb2xQYXJhbXMsIGtleTogc3RyaW5nLCBrZXlib2FyZEV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldFBhcmFtcyhleGVjdXRpb24ucGFyYW1zLCBrZXlib2FyZEV2ZW50KTtcblxuICAgIGlmIChpc051bWJlcihleGVjdXRpb24uYWN0aW9uKSkge1xuICAgICAgY29uc3QgcHJlZGVmaW5lZEFjdGlvbiA9IFBSRURFRklORURfS0VZQk9BUkRfQUNUSU9OU1tleGVjdXRpb24uYWN0aW9uIGFzIG51bWJlcl07XG5cbiAgICAgIGlmIChwcmVkZWZpbmVkQWN0aW9uKSB7XG4gICAgICAgIHByZWRlZmluZWRBY3Rpb24odGhpcy5jZXNpdW1TZXJ2aWNlLCBwYXJhbXMsIGtleWJvYXJkRXZlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4ZWN1dGlvbi5hY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IHNob3VsZENhbmNlbEV2ZW50ID0gZXhlY3V0aW9uLmFjdGlvbih0aGlzLmNlc2l1bVNlcnZpY2UsIHBhcmFtcywga2V5Ym9hcmRFdmVudCk7XG5cbiAgICAgIGlmIChzaG91bGRDYW5jZWxFdmVudCA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNba2V5XSA9IHtcbiAgICAgICAgICBzdGF0ZTogS2V5RXZlbnRTdGF0ZS5JR05PUkVELFxuICAgICAgICAgIGFjdGlvbjogbnVsbCxcbiAgICAgICAgICBrZXlib2FyZEV2ZW50OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdG8ga2V5ZG93biwga2V5dXAgb2YgYGRvY3VtZW50YCwgYW5kIGB0aWNrYCBvZiBDZXNpdW0uXG4gICAqL1xuICBwcml2YXRlIHJlZ2lzdGVyRXZlbnRzKG91dHNpZGVPZkFuZ3VsYXJab25lOiBib29sZWFuKSB7XG4gICAgY29uc3QgcmVnaXN0ZXJUb0V2ZW50cyA9ICgpID0+IHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bik7XG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXl1cCk7XG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2xvY2sub25UaWNrLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5oYW5kbGVUaWNrKTtcbiAgICB9O1xuXG4gICAgaWYgKG91dHNpZGVPZkFuZ3VsYXJab25lKSB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihyZWdpc3RlclRvRXZlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVnaXN0ZXJUb0V2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnJlZ2lzdGVycyB0byBrZXlkb3duLCBrZXl1cCBvZiBgZG9jdW1lbnRgLCBhbmQgYHRpY2tgIG9mIENlc2l1bS5cbiAgICovXG4gIHByaXZhdGUgdW5yZWdpc3RlckV2ZW50cygpIHtcbiAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xuICAgIHRoaXMuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleXVwKTtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2xvY2sub25UaWNrLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5oYW5kbGVUaWNrKTtcbiAgfVxufVxuIl19
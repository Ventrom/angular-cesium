/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
var PlonterService = /** @class */ (function () {
    function PlonterService() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    Object.defineProperty(PlonterService.prototype, "plonterChangeNotifier", {
        get: /**
         * @return {?}
         */
        function () {
            return this._plonterChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterShown", {
        get: /**
         * @return {?}
         */
        function () {
            return this._plonterShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "entitesToPlonter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._entitesToPlonter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterClickPosition", {
        get: /**
         * @return {?}
         */
        function () {
            return this._eventResult.movement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} eventResult
     * @return {?}
     */
    PlonterService.prototype.plonterIt = /**
     * @param {?} eventResult
     * @return {?}
     */
    function (eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    PlonterService.prototype.resolvePlonter = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    };
    PlonterService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PlonterService.ctorParameters = function () { return []; };
    return PlonterService;
}());
export { PlonterService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PlonterService.prototype._plonterShown;
    /**
     * @type {?}
     * @private
     */
    PlonterService.prototype._entitesToPlonter;
    /**
     * @type {?}
     * @private
     */
    PlonterService.prototype._plonterObserver;
    /**
     * @type {?}
     * @private
     */
    PlonterService.prototype._eventResult;
    /**
     * @type {?}
     * @private
     */
    PlonterService.prototype._plonterChangeNotifier;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7O0FBTy9CO0lBUUU7UUFMUSxzQkFBaUIsR0FBZSxFQUFFLENBQUM7UUFHbkMsMkJBQXNCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHckUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksT0FBTyxFQUFlLENBQUM7SUFDckQsQ0FBQztJQUVELHNCQUFJLGlEQUFxQjs7OztRQUF6QjtZQUNFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDO1FBQ3JDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksd0NBQVk7Ozs7UUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw0Q0FBZ0I7Ozs7UUFBcEI7WUFDRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGdEQUFvQjs7OztRQUF4QjtZQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDcEMsQ0FBQzs7O09BQUE7Ozs7O0lBRUQsa0NBQVM7Ozs7SUFBVCxVQUFVLFdBQXdCO1FBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTFCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVELHVDQUFjOzs7O0lBQWQsVUFBZSxNQUFnQjtRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDOztnQkEzQ0YsVUFBVTs7OztJQTRDWCxxQkFBQztDQUFBLEFBNUNELElBNENDO1NBM0NZLGNBQWM7Ozs7OztJQUN6Qix1Q0FBK0I7Ozs7O0lBQy9CLDJDQUEyQzs7Ozs7SUFDM0MsMENBQStDOzs7OztJQUMvQyxzQ0FBa0M7Ozs7O0lBQ2xDLGdEQUF1RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEV2ZW50UmVzdWx0LCBNb3ZlbWVudCB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBzb2x2aW5nIHBsb250ZXIuXG4gKiBVc2VkIGJ5IG1hcC1ldmVudC1tYW5hZ2VyIGFuZCBwbG9udGVyIGNvbnRleHQgY29tcG9uZW50XG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbG9udGVyU2VydmljZSB7XG4gIHByaXZhdGUgX3Bsb250ZXJTaG93bjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZW50aXRlc1RvUGxvbnRlcjogQWNFbnRpdHlbXSA9IFtdO1xuICBwcml2YXRlIF9wbG9udGVyT2JzZXJ2ZXI6IFN1YmplY3Q8RXZlbnRSZXN1bHQ+O1xuICBwcml2YXRlIF9ldmVudFJlc3VsdDogRXZlbnRSZXN1bHQ7XG4gIHByaXZhdGUgX3Bsb250ZXJDaGFuZ2VOb3RpZmllcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGxvbnRlck9ic2VydmVyID0gbmV3IFN1YmplY3Q8RXZlbnRSZXN1bHQ+KCk7XG4gIH1cblxuICBnZXQgcGxvbnRlckNoYW5nZU5vdGlmaWVyKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fcGxvbnRlckNoYW5nZU5vdGlmaWVyO1xuICB9XG5cbiAgZ2V0IHBsb250ZXJTaG93bigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGxvbnRlclNob3duO1xuICB9XG5cbiAgZ2V0IGVudGl0ZXNUb1Bsb250ZXIoKTogQWNFbnRpdHlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0ZXNUb1Bsb250ZXI7XG4gIH1cblxuICBnZXQgcGxvbnRlckNsaWNrUG9zaXRpb24oKTogTW92ZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9ldmVudFJlc3VsdC5tb3ZlbWVudDtcbiAgfVxuXG4gIHBsb250ZXJJdChldmVudFJlc3VsdDogRXZlbnRSZXN1bHQpIHtcbiAgICB0aGlzLl9ldmVudFJlc3VsdCA9IGV2ZW50UmVzdWx0O1xuICAgIHRoaXMuX2VudGl0ZXNUb1Bsb250ZXIgPSBldmVudFJlc3VsdC5lbnRpdGllcztcbiAgICB0aGlzLl9wbG9udGVyU2hvd24gPSB0cnVlO1xuXG4gICAgdGhpcy5fcGxvbnRlckNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcbiAgICByZXR1cm4gdGhpcy5fcGxvbnRlck9ic2VydmVyO1xuICB9XG5cbiAgcmVzb2x2ZVBsb250ZXIoZW50aXR5OiBBY0VudGl0eSkge1xuICAgIHRoaXMuX3Bsb250ZXJTaG93biA9IGZhbHNlO1xuICAgIHRoaXMuX2V2ZW50UmVzdWx0LmVudGl0aWVzID0gW2VudGl0eV07XG5cbiAgICB0aGlzLl9wbG9udGVyQ2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHRoaXMuX3Bsb250ZXJPYnNlcnZlci5uZXh0KHRoaXMuX2V2ZW50UmVzdWx0KTtcbiAgfVxufVxuIl19
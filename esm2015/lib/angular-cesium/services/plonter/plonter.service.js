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
export class PlonterService {
    constructor() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    /**
     * @return {?}
     */
    get plonterChangeNotifier() {
        return this._plonterChangeNotifier;
    }
    /**
     * @return {?}
     */
    get plonterShown() {
        return this._plonterShown;
    }
    /**
     * @return {?}
     */
    get entitesToPlonter() {
        return this._entitesToPlonter;
    }
    /**
     * @return {?}
     */
    get plonterClickPosition() {
        return this._eventResult.movement;
    }
    /**
     * @param {?} eventResult
     * @return {?}
     */
    plonterIt(eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    resolvePlonter(entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    }
}
PlonterService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PlonterService.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7O0FBUS9CLE1BQU0sT0FBTyxjQUFjO0lBT3pCO1FBTFEsc0JBQWlCLEdBQWUsRUFBRSxDQUFDO1FBR25DLDJCQUFzQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3JFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBZSxDQUFDO0lBQ3JELENBQUM7Ozs7SUFFRCxJQUFJLHFCQUFxQjtRQUN2QixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUNyQyxDQUFDOzs7O0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDOzs7O0lBRUQsSUFBSSxvQkFBb0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUNwQyxDQUFDOzs7OztJQUVELFNBQVMsQ0FBQyxXQUF3QjtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFRCxjQUFjLENBQUMsTUFBZ0I7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7O1lBM0NGLFVBQVU7Ozs7Ozs7OztJQUVULHVDQUErQjs7Ozs7SUFDL0IsMkNBQTJDOzs7OztJQUMzQywwQ0FBK0M7Ozs7O0lBQy9DLHNDQUFrQzs7Ozs7SUFDbEMsZ0RBQXVFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRXZlbnRSZXN1bHQsIE1vdmVtZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIHNvbHZpbmcgcGxvbnRlci5cbiAqIFVzZWQgYnkgbWFwLWV2ZW50LW1hbmFnZXIgYW5kIHBsb250ZXIgY29udGV4dCBjb21wb25lbnRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsb250ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfcGxvbnRlclNob3duOiBib29sZWFuO1xuICBwcml2YXRlIF9lbnRpdGVzVG9QbG9udGVyOiBBY0VudGl0eVtdID0gW107XG4gIHByaXZhdGUgX3Bsb250ZXJPYnNlcnZlcjogU3ViamVjdDxFdmVudFJlc3VsdD47XG4gIHByaXZhdGUgX2V2ZW50UmVzdWx0OiBFdmVudFJlc3VsdDtcbiAgcHJpdmF0ZSBfcGxvbnRlckNoYW5nZU5vdGlmaWVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wbG9udGVyT2JzZXJ2ZXIgPSBuZXcgU3ViamVjdDxFdmVudFJlc3VsdD4oKTtcbiAgfVxuXG4gIGdldCBwbG9udGVyQ2hhbmdlTm90aWZpZXIoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyQ2hhbmdlTm90aWZpZXI7XG4gIH1cblxuICBnZXQgcGxvbnRlclNob3duKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyU2hvd247XG4gIH1cblxuICBnZXQgZW50aXRlc1RvUGxvbnRlcigpOiBBY0VudGl0eVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRlc1RvUGxvbnRlcjtcbiAgfVxuXG4gIGdldCBwbG9udGVyQ2xpY2tQb3NpdGlvbigpOiBNb3ZlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50UmVzdWx0Lm1vdmVtZW50O1xuICB9XG5cbiAgcGxvbnRlckl0KGV2ZW50UmVzdWx0OiBFdmVudFJlc3VsdCkge1xuICAgIHRoaXMuX2V2ZW50UmVzdWx0ID0gZXZlbnRSZXN1bHQ7XG4gICAgdGhpcy5fZW50aXRlc1RvUGxvbnRlciA9IGV2ZW50UmVzdWx0LmVudGl0aWVzO1xuICAgIHRoaXMuX3Bsb250ZXJTaG93biA9IHRydWU7XG5cbiAgICB0aGlzLl9wbG9udGVyQ2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyT2JzZXJ2ZXI7XG4gIH1cblxuICByZXNvbHZlUGxvbnRlcihlbnRpdHk6IEFjRW50aXR5KSB7XG4gICAgdGhpcy5fcGxvbnRlclNob3duID0gZmFsc2U7XG4gICAgdGhpcy5fZXZlbnRSZXN1bHQuZW50aXRpZXMgPSBbZW50aXR5XTtcblxuICAgIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fcGxvbnRlck9ic2VydmVyLm5leHQodGhpcy5fZXZlbnRSZXN1bHQpO1xuICB9XG59XG4iXX0=
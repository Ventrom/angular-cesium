import { __decorate, __metadata } from "tslib";
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
        get: function () {
            return this._plonterChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterShown", {
        get: function () {
            return this._plonterShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "entitesToPlonter", {
        get: function () {
            return this._entitesToPlonter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterClickPosition", {
        get: function () {
            return this._eventResult.movement;
        },
        enumerable: true,
        configurable: true
    });
    PlonterService.prototype.plonterIt = function (eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    };
    PlonterService.prototype.resolvePlonter = function (entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    };
    PlonterService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], PlonterService);
    return PlonterService;
}());
export { PlonterService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHL0I7OztHQUdHO0FBRUg7SUFPRTtRQUxRLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztRQUduQywyQkFBc0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdyRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsc0JBQUksaURBQXFCO2FBQXpCO1lBQ0UsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDckMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx3Q0FBWTthQUFoQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDRDQUFnQjthQUFwQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksZ0RBQW9CO2FBQXhCO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxDQUFDOzs7T0FBQTtJQUVELGtDQUFTLEdBQVQsVUFBVSxXQUF3QjtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELHVDQUFjLEdBQWQsVUFBZSxNQUFnQjtRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBMUNVLGNBQWM7UUFEMUIsVUFBVSxFQUFFOztPQUNBLGNBQWMsQ0EyQzFCO0lBQUQscUJBQUM7Q0FBQSxBQTNDRCxJQTJDQztTQTNDWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRXZlbnRSZXN1bHQsIE1vdmVtZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIHNvbHZpbmcgcGxvbnRlci5cbiAqIFVzZWQgYnkgbWFwLWV2ZW50LW1hbmFnZXIgYW5kIHBsb250ZXIgY29udGV4dCBjb21wb25lbnRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsb250ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfcGxvbnRlclNob3duOiBib29sZWFuO1xuICBwcml2YXRlIF9lbnRpdGVzVG9QbG9udGVyOiBBY0VudGl0eVtdID0gW107XG4gIHByaXZhdGUgX3Bsb250ZXJPYnNlcnZlcjogU3ViamVjdDxFdmVudFJlc3VsdD47XG4gIHByaXZhdGUgX2V2ZW50UmVzdWx0OiBFdmVudFJlc3VsdDtcbiAgcHJpdmF0ZSBfcGxvbnRlckNoYW5nZU5vdGlmaWVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wbG9udGVyT2JzZXJ2ZXIgPSBuZXcgU3ViamVjdDxFdmVudFJlc3VsdD4oKTtcbiAgfVxuXG4gIGdldCBwbG9udGVyQ2hhbmdlTm90aWZpZXIoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyQ2hhbmdlTm90aWZpZXI7XG4gIH1cblxuICBnZXQgcGxvbnRlclNob3duKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyU2hvd247XG4gIH1cblxuICBnZXQgZW50aXRlc1RvUGxvbnRlcigpOiBBY0VudGl0eVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRlc1RvUGxvbnRlcjtcbiAgfVxuXG4gIGdldCBwbG9udGVyQ2xpY2tQb3NpdGlvbigpOiBNb3ZlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50UmVzdWx0Lm1vdmVtZW50O1xuICB9XG5cbiAgcGxvbnRlckl0KGV2ZW50UmVzdWx0OiBFdmVudFJlc3VsdCkge1xuICAgIHRoaXMuX2V2ZW50UmVzdWx0ID0gZXZlbnRSZXN1bHQ7XG4gICAgdGhpcy5fZW50aXRlc1RvUGxvbnRlciA9IGV2ZW50UmVzdWx0LmVudGl0aWVzO1xuICAgIHRoaXMuX3Bsb250ZXJTaG93biA9IHRydWU7XG5cbiAgICB0aGlzLl9wbG9udGVyQ2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHJldHVybiB0aGlzLl9wbG9udGVyT2JzZXJ2ZXI7XG4gIH1cblxuICByZXNvbHZlUGxvbnRlcihlbnRpdHk6IEFjRW50aXR5KSB7XG4gICAgdGhpcy5fcGxvbnRlclNob3duID0gZmFsc2U7XG4gICAgdGhpcy5fZXZlbnRSZXN1bHQuZW50aXRpZXMgPSBbZW50aXR5XTtcblxuICAgIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fcGxvbnRlck9ic2VydmVyLm5leHQodGhpcy5fZXZlbnRSZXN1bHQpO1xuICB9XG59XG4iXX0=
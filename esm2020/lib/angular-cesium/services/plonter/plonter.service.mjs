import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
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
    get plonterChangeNotifier() {
        return this._plonterChangeNotifier;
    }
    get plonterShown() {
        return this._plonterShown;
    }
    get entitesToPlonter() {
        return this._entitesToPlonter;
    }
    get plonterClickPosition() {
        return this._eventResult.movement;
    }
    plonterIt(eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    }
    resolvePlonter(entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    }
}
PlonterService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PlonterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PlonterService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PlonterService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PlonterService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvbnRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9wbG9udGVyL3Bsb250ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUcvQjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sY0FBYztJQU96QjtRQUxRLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztRQUduQywyQkFBc0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdyRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxxQkFBcUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDcEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxXQUF3QjtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELGNBQWMsQ0FBQyxNQUFnQjtRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs0R0ExQ1UsY0FBYztnSEFBZCxjQUFjOzRGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBFdmVudFJlc3VsdCwgTW92ZW1lbnQgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5cbi8qKlxuICogU2VydmljZSBmb3Igc29sdmluZyBwbG9udGVyLlxuICogVXNlZCBieSBtYXAtZXZlbnQtbWFuYWdlciBhbmQgcGxvbnRlciBjb250ZXh0IGNvbXBvbmVudFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGxvbnRlclNlcnZpY2Uge1xuICBwcml2YXRlIF9wbG9udGVyU2hvd246IGJvb2xlYW47XG4gIHByaXZhdGUgX2VudGl0ZXNUb1Bsb250ZXI6IEFjRW50aXR5W10gPSBbXTtcbiAgcHJpdmF0ZSBfcGxvbnRlck9ic2VydmVyOiBTdWJqZWN0PEV2ZW50UmVzdWx0PjtcbiAgcHJpdmF0ZSBfZXZlbnRSZXN1bHQ6IEV2ZW50UmVzdWx0O1xuICBwcml2YXRlIF9wbG9udGVyQ2hhbmdlTm90aWZpZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Bsb250ZXJPYnNlcnZlciA9IG5ldyBTdWJqZWN0PEV2ZW50UmVzdWx0PigpO1xuICB9XG5cbiAgZ2V0IHBsb250ZXJDaGFuZ2VOb3RpZmllcigpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllcjtcbiAgfVxuXG4gIGdldCBwbG9udGVyU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Bsb250ZXJTaG93bjtcbiAgfVxuXG4gIGdldCBlbnRpdGVzVG9QbG9udGVyKCk6IEFjRW50aXR5W10ge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGVzVG9QbG9udGVyO1xuICB9XG5cbiAgZ2V0IHBsb250ZXJDbGlja1Bvc2l0aW9uKCk6IE1vdmVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRSZXN1bHQubW92ZW1lbnQ7XG4gIH1cblxuICBwbG9udGVySXQoZXZlbnRSZXN1bHQ6IEV2ZW50UmVzdWx0KSB7XG4gICAgdGhpcy5fZXZlbnRSZXN1bHQgPSBldmVudFJlc3VsdDtcbiAgICB0aGlzLl9lbnRpdGVzVG9QbG9udGVyID0gZXZlbnRSZXN1bHQuZW50aXRpZXM7XG4gICAgdGhpcy5fcGxvbnRlclNob3duID0gdHJ1ZTtcblxuICAgIHRoaXMuX3Bsb250ZXJDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgcmV0dXJuIHRoaXMuX3Bsb250ZXJPYnNlcnZlcjtcbiAgfVxuXG4gIHJlc29sdmVQbG9udGVyKGVudGl0eTogQWNFbnRpdHkpIHtcbiAgICB0aGlzLl9wbG9udGVyU2hvd24gPSBmYWxzZTtcbiAgICB0aGlzLl9ldmVudFJlc3VsdC5lbnRpdGllcyA9IFtlbnRpdHldO1xuXG4gICAgdGhpcy5fcGxvbnRlckNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcbiAgICB0aGlzLl9wbG9udGVyT2JzZXJ2ZXIubmV4dCh0aGlzLl9ldmVudFJlc3VsdCk7XG4gIH1cbn1cbiJdfQ==
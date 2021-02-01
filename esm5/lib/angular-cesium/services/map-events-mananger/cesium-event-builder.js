import { __decorate, __metadata } from "tslib";
import { publish } from 'rxjs/operators';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEvent } from './consts/cesium-event.enum';
import { Injectable } from '@angular/core';
import { CesiumPureEventObserver } from './event-observers/cesium-pure-event-observer';
import { CesiumLongPressObserver } from './event-observers/cesium-long-press-observer';
var CesiumEventBuilder = /** @class */ (function () {
    function CesiumEventBuilder(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    CesiumEventBuilder_1 = CesiumEventBuilder;
    CesiumEventBuilder.getEventFullName = function (event, modifier) {
        if (modifier) {
            return event + "_" + modifier;
        }
        else {
            return event.toString();
        }
    };
    CesiumEventBuilder.prototype.init = function () {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    };
    CesiumEventBuilder.prototype.get = function (event, modifier) {
        var eventName = CesiumEventBuilder_1.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            var eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    };
    CesiumEventBuilder.prototype.createCesiumEventObservable = function (event, modifier) {
        var cesiumEventObservable;
        if (CesiumEventBuilder_1.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    };
    CesiumEventBuilder.prototype.createSpecialCesiumEventObservable = function (event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    };
    var CesiumEventBuilder_1;
    CesiumEventBuilder.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CesiumEventBuilder.longPressEvents = new Set([
        CesiumEvent.LONG_LEFT_PRESS,
        CesiumEvent.LONG_RIGHT_PRESS,
        CesiumEvent.LONG_MIDDLE_PRESS
    ]);
    CesiumEventBuilder = CesiumEventBuilder_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CesiumEventBuilder);
    return CesiumEventBuilder;
}());
export { CesiumEventBuilder };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWV2ZW50LWJ1aWxkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBSXZGO0lBRUUsNEJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBVXhDLDRCQUF1QixHQUFHLElBQUksR0FBRyxFQUFzQyxDQUFDO0lBVGhGLENBQUM7MkJBSFUsa0JBQWtCO0lBY2YsbUNBQWdCLEdBQTlCLFVBQStCLEtBQWtCLEVBQUUsUUFBOEI7UUFDL0UsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFVLEtBQUssU0FBSSxRQUFVLENBQUM7U0FDL0I7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGlDQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7SUFDOUUsQ0FBQztJQUVELGdDQUFHLEdBQUgsVUFBSSxLQUFrQixFQUFFLFFBQThCO1FBQ3BELElBQU0sU0FBUyxHQUFHLG9CQUFrQixDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDL0MsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFDTCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzNELE9BQU8sYUFBYSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVPLHdEQUEyQixHQUFuQyxVQUFvQyxLQUFrQixFQUFFLFFBQThCO1FBQ3BGLElBQUkscUJBQWlELENBQUM7UUFDdEQsSUFBSSxvQkFBa0IsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pELHFCQUFxQixHQUFHLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEY7YUFBTTtZQUNMLHFCQUFxQixHQUFHLE9BQU8sRUFBRSxDQUFDLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztTQUMxRztRQUNELHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLE9BQU8scUJBQXFCLENBQUM7SUFDL0IsQ0FBQztJQUVPLCtEQUFrQyxHQUExQyxVQUEyQyxLQUFrQixFQUFFLFFBQTZCO1FBQzFGLHNDQUFzQztRQUN0QyxPQUFPLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuRSxDQUFDOzs7Z0JBakRrQyxhQUFhOztJQUdsQyxrQ0FBZSxHQUFxQixJQUFJLEdBQUcsQ0FBQztRQUN4RCxXQUFXLENBQUMsZUFBZTtRQUMzQixXQUFXLENBQUMsZ0JBQWdCO1FBQzVCLFdBQVcsQ0FBQyxpQkFBaUI7S0FDOUIsQ0FBQyxDQUFDO0lBVFEsa0JBQWtCO1FBRDlCLFVBQVUsRUFBRTt5Q0FHd0IsYUFBYTtPQUZyQyxrQkFBa0IsQ0FvRDlCO0lBQUQseUJBQUM7Q0FBQSxBQXBERCxJQW9EQztTQXBEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlciB9IGZyb20gJy4vZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1wdXJlLWV2ZW50LW9ic2VydmVyJztcbmltcG9ydCB7IENlc2l1bUxvbmdQcmVzc09ic2VydmVyIH0gZnJvbSAnLi9ldmVudC1vYnNlcnZlcnMvY2VzaXVtLWxvbmctcHJlc3Mtb2JzZXJ2ZXInO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1FdmVudEJ1aWxkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBsb25nUHJlc3NFdmVudHM6IFNldDxDZXNpdW1FdmVudD4gPSBuZXcgU2V0KFtcbiAgICBDZXNpdW1FdmVudC5MT05HX0xFRlRfUFJFU1MsXG4gICAgQ2VzaXVtRXZlbnQuTE9OR19SSUdIVF9QUkVTUyxcbiAgICBDZXNpdW1FdmVudC5MT05HX01JRERMRV9QUkVTU1xuICBdKTtcblxuICBwcml2YXRlIGV2ZW50c0hhbmRsZXI6IGFueTtcbiAgcHJpdmF0ZSBjZXNpdW1FdmVudHNPYnNlcnZhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55Pj4oKTtcblxuICBwdWJsaWMgc3RhdGljIGdldEV2ZW50RnVsbE5hbWUoZXZlbnQ6IENlc2l1bUV2ZW50LCBtb2RpZmllcj86IENlc2l1bUV2ZW50TW9kaWZpZXIpOiBzdHJpbmcge1xuICAgIGlmIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIGAke2V2ZW50fV8ke21vZGlmaWVyfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBldmVudC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5ldmVudHNIYW5kbGVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnNjcmVlblNwYWNlRXZlbnRIYW5kbGVyO1xuICB9XG5cbiAgZ2V0KGV2ZW50OiBDZXNpdW1FdmVudCwgbW9kaWZpZXI/OiBDZXNpdW1FdmVudE1vZGlmaWVyKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IENlc2l1bUV2ZW50QnVpbGRlci5nZXRFdmVudEZ1bGxOYW1lKGV2ZW50LCBtb2RpZmllcik7XG4gICAgaWYgKHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuaGFzKGV2ZW50TmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNlc2l1bUV2ZW50c09ic2VydmFibGVzLmdldChldmVudE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBldmVudE9ic2VydmVyID0gdGhpcy5jcmVhdGVDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICAgIHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuc2V0KGV2ZW50TmFtZSwgZXZlbnRPYnNlcnZlcik7XG4gICAgICByZXR1cm4gZXZlbnRPYnNlcnZlcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcik6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgY2VzaXVtRXZlbnRPYnNlcnZhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PjtcbiAgICBpZiAoQ2VzaXVtRXZlbnRCdWlsZGVyLmxvbmdQcmVzc0V2ZW50cy5oYXMoZXZlbnQpKSB7XG4gICAgICBjZXNpdW1FdmVudE9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZVNwZWNpYWxDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VzaXVtRXZlbnRPYnNlcnZhYmxlID0gcHVibGlzaCgpKG5ldyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlcihldmVudCwgbW9kaWZpZXIpLmluaXQodGhpcy5ldmVudHNIYW5kbGVyKSk7XG4gICAgfVxuICAgIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZS5jb25uZWN0KCk7XG4gICAgcmV0dXJuIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3BlY2lhbENlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4ge1xuICAgIC8vIGNvdWxkIHN1cHBvcnQgbW9yZSBldmVudHMgaWYgbmVlZGVkXG4gICAgcmV0dXJuIG5ldyBDZXNpdW1Mb25nUHJlc3NPYnNlcnZlcihldmVudCwgbW9kaWZpZXIsIHRoaXMpLmluaXQoKTtcbiAgfVxufVxuXG4iXX0=
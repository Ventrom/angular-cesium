/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.getEventFullName = /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        if (modifier) {
            return event + "_" + modifier;
        }
        else {
            return event.toString();
        }
    };
    /**
     * @return {?}
     */
    CesiumEventBuilder.prototype.init = /**
     * @return {?}
     */
    function () {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    };
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.get = /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        /** @type {?} */
        var eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            /** @type {?} */
            var eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    };
    /**
     * @private
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.createCesiumEventObservable = /**
     * @private
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        /** @type {?} */
        var cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    };
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.createSpecialCesiumEventObservable = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @return {?}
     */
    function (event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    };
    CesiumEventBuilder.longPressEvents = new Set([
        CesiumEvent.LONG_LEFT_PRESS,
        CesiumEvent.LONG_RIGHT_PRESS,
        CesiumEvent.LONG_MIDDLE_PRESS
    ]);
    CesiumEventBuilder.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumEventBuilder.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CesiumEventBuilder;
}());
export { CesiumEventBuilder };
if (false) {
    /** @type {?} */
    CesiumEventBuilder.longPressEvents;
    /**
     * @type {?}
     * @private
     */
    CesiumEventBuilder.prototype.eventsHandler;
    /**
     * @type {?}
     * @private
     */
    CesiumEventBuilder.prototype.cesiumEventsObservables;
    /**
     * @type {?}
     * @private
     */
    CesiumEventBuilder.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWV2ZW50LWJ1aWxkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR3ZGO0lBR0UsNEJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBVXhDLDRCQUF1QixHQUFHLElBQUksR0FBRyxFQUFzQyxDQUFDO0lBVGhGLENBQUM7Ozs7OztJQVdhLG1DQUFnQjs7Ozs7SUFBOUIsVUFBK0IsS0FBa0IsRUFBRSxRQUE4QjtRQUMvRSxJQUFJLFFBQVEsRUFBRTtZQUNaLE9BQVUsS0FBSyxTQUFJLFFBQVUsQ0FBQztTQUMvQjthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7O0lBRUQsaUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO0lBQzlFLENBQUM7Ozs7OztJQUVELGdDQUFHOzs7OztJQUFILFVBQUksS0FBa0IsRUFBRSxRQUE4Qjs7WUFDOUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7UUFDdEUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQy9DLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwRDthQUFNOztnQkFDQyxhQUFhLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7WUFDdkUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDM0QsT0FBTyxhQUFhLENBQUM7U0FDdEI7SUFDSCxDQUFDOzs7Ozs7O0lBRU8sd0RBQTJCOzs7Ozs7SUFBbkMsVUFBb0MsS0FBa0IsRUFBRSxRQUE4Qjs7WUFDaEYscUJBQWlEO1FBQ3JELElBQUksa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqRCxxQkFBcUIsR0FBRyxJQUFJLENBQUMsa0NBQWtDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xGO2FBQU07WUFDTCxxQkFBcUIsR0FBRyxPQUFPLEVBQUUsQ0FBQyxJQUFJLHVCQUF1QixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7U0FDMUc7UUFDRCxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQyxPQUFPLHFCQUFxQixDQUFDO0lBQy9CLENBQUM7Ozs7Ozs7SUFFTywrREFBa0M7Ozs7OztJQUExQyxVQUEyQyxLQUFrQixFQUFFLFFBQTZCO1FBQzFGLHNDQUFzQztRQUN0QyxPQUFPLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0lBOUNhLGtDQUFlLEdBQXFCLElBQUksR0FBRyxDQUFDO1FBQ3hELFdBQVcsQ0FBQyxlQUFlO1FBQzNCLFdBQVcsQ0FBQyxnQkFBZ0I7UUFDNUIsV0FBVyxDQUFDLGlCQUFpQjtLQUM5QixDQUFDLENBQUM7O2dCQVZKLFVBQVU7Ozs7Z0JBUkYsYUFBYTs7SUE2RHRCLHlCQUFDO0NBQUEsQUFyREQsSUFxREM7U0FwRFksa0JBQWtCOzs7SUFLN0IsbUNBSUc7Ozs7O0lBRUgsMkNBQTJCOzs7OztJQUMzQixxREFBZ0Y7Ozs7O0lBVnBFLDJDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2ggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVB1cmVFdmVudE9ic2VydmVyIH0gZnJvbSAnLi9ldmVudC1vYnNlcnZlcnMvY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXInO1xuaW1wb3J0IHsgQ2VzaXVtTG9uZ1ByZXNzT2JzZXJ2ZXIgfSBmcm9tICcuL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tbG9uZy1wcmVzcy1vYnNlcnZlcic7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bUV2ZW50QnVpbGRlciB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGxvbmdQcmVzc0V2ZW50czogU2V0PENlc2l1bUV2ZW50PiA9IG5ldyBTZXQoW1xuICAgIENlc2l1bUV2ZW50LkxPTkdfTEVGVF9QUkVTUyxcbiAgICBDZXNpdW1FdmVudC5MT05HX1JJR0hUX1BSRVNTLFxuICAgIENlc2l1bUV2ZW50LkxPTkdfTUlERExFX1BSRVNTXG4gIF0pO1xuXG4gIHByaXZhdGUgZXZlbnRzSGFuZGxlcjogYW55O1xuICBwcml2YXRlIGNlc2l1bUV2ZW50c09ic2VydmFibGVzID0gbmV3IE1hcDxzdHJpbmcsIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+PigpO1xuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RXZlbnRGdWxsTmFtZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcik6IHN0cmluZyB7XG4gICAgaWYgKG1vZGlmaWVyKSB7XG4gICAgICByZXR1cm4gYCR7ZXZlbnR9XyR7bW9kaWZpZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGV2ZW50LnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmV2ZW50c0hhbmRsZXIgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuc2NyZWVuU3BhY2VFdmVudEhhbmRsZXI7XG4gIH1cblxuICBnZXQoZXZlbnQ6IENlc2l1bUV2ZW50LCBtb2RpZmllcj86IENlc2l1bUV2ZW50TW9kaWZpZXIpOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgZXZlbnROYW1lID0gQ2VzaXVtRXZlbnRCdWlsZGVyLmdldEV2ZW50RnVsbE5hbWUoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICBpZiAodGhpcy5jZXNpdW1FdmVudHNPYnNlcnZhYmxlcy5oYXMoZXZlbnROYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV2ZW50T2JzZXJ2ZXIgPSB0aGlzLmNyZWF0ZUNlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudCwgbW9kaWZpZXIpO1xuICAgICAgdGhpcy5jZXNpdW1FdmVudHNPYnNlcnZhYmxlcy5zZXQoZXZlbnROYW1lLCBldmVudE9ic2VydmVyKTtcbiAgICAgIHJldHVybiBldmVudE9ic2VydmVyO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2VzaXVtRXZlbnRPYnNlcnZhYmxlKGV2ZW50OiBDZXNpdW1FdmVudCwgbW9kaWZpZXI/OiBDZXNpdW1FdmVudE1vZGlmaWVyKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCBjZXNpdW1FdmVudE9ic2VydmFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+O1xuICAgIGlmIChDZXNpdW1FdmVudEJ1aWxkZXIubG9uZ1ByZXNzRXZlbnRzLmhhcyhldmVudCkpIHtcbiAgICAgIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlU3BlY2lhbENlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudCwgbW9kaWZpZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZXNpdW1FdmVudE9ic2VydmFibGUgPSBwdWJsaXNoKCkobmV3IENlc2l1bVB1cmVFdmVudE9ic2VydmVyKGV2ZW50LCBtb2RpZmllcikuaW5pdCh0aGlzLmV2ZW50c0hhbmRsZXIpKTtcbiAgICB9XG4gICAgY2VzaXVtRXZlbnRPYnNlcnZhYmxlLmNvbm5lY3QoKTtcbiAgICByZXR1cm4gY2VzaXVtRXZlbnRPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTcGVjaWFsQ2VzaXVtRXZlbnRPYnNlcnZhYmxlKGV2ZW50OiBDZXNpdW1FdmVudCwgbW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIpOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PiB7XG4gICAgLy8gY291bGQgc3VwcG9ydCBtb3JlIGV2ZW50cyBpZiBuZWVkZWRcbiAgICByZXR1cm4gbmV3IENlc2l1bUxvbmdQcmVzc09ic2VydmVyKGV2ZW50LCBtb2RpZmllciwgdGhpcykuaW5pdCgpO1xuICB9XG59XG5cbiJdfQ==
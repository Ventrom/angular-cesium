/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { of as observableOf } from 'rxjs';
import { delay, mergeMap, publish, takeUntil } from 'rxjs/operators';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
export class CesiumLongPressObserver extends CesiumPureEventObserver {
    /**
     * @param {?} event
     * @param {?} modifier
     * @param {?} eventFactory
     */
    constructor(event, modifier, eventFactory) {
        super(event, modifier);
        this.event = event;
        this.modifier = modifier;
        this.eventFactory = eventFactory;
    }
    /**
     * @return {?}
     */
    init() {
        /** @type {?} */
        let startEvent;
        /** @type {?} */
        let stopEvent;
        if (this.event === CesiumEvent.LONG_LEFT_PRESS) {
            startEvent = CesiumEvent.LEFT_DOWN;
            stopEvent = CesiumEvent.LEFT_UP;
        }
        else if (this.event === CesiumEvent.LONG_RIGHT_PRESS) {
            startEvent = CesiumEvent.RIGHT_DOWN;
            stopEvent = CesiumEvent.RIGHT_UP;
        }
        else if (this.event === CesiumEvent.LONG_MIDDLE_PRESS) {
            startEvent = CesiumEvent.MIDDLE_DOWN;
            stopEvent = CesiumEvent.MIDDLE_UP;
        }
        /** @type {?} */
        const startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        /** @type {?} */
        const stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);
        // publish for preventing side effect
        /** @type {?} */
        const longPressObservable = publish()(startEventObservable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        (e) => observableOf(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable))))));
        return longPressObservable;
    }
}
CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;
if (false) {
    /** @type {?} */
    CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION;
    /**
     * @type {?}
     * @protected
     */
    CesiumLongPressObserver.prototype.event;
    /**
     * @type {?}
     * @protected
     */
    CesiumLongPressObserver.prototype.modifier;
    /**
     * @type {?}
     * @private
     */
    CesiumLongPressObserver.prototype.eventFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWxvbmctcHJlc3Mtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tbG9uZy1wcmVzcy1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUF5QixFQUFFLElBQUksWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFJMUQsTUFBTSxPQUFPLHVCQUF3QixTQUFRLHVCQUF1Qjs7Ozs7O0lBR2xFLFlBQXNCLEtBQWtCLEVBQ2xCLFFBQTZCLEVBQy9CLFlBQWdDO1FBQ2xELEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFISCxVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQXFCO1FBQy9CLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtJQUVwRCxDQUFDOzs7O0lBRUQsSUFBSTs7WUFDRSxVQUF1Qjs7WUFDdkIsU0FBc0I7UUFFMUIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxlQUFlLEVBQUU7WUFDOUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDbkMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7U0FDakM7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLGdCQUFnQixFQUFFO1lBQ3RELFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1lBQ3BDLFNBQVMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1NBQ2xDO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtZQUN2RCxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQztZQUNyQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUNuQzs7Y0FFSyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7Y0FDdkUsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7OztjQUdyRSxtQkFBbUIsR0FBRyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQzdELFFBQVE7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDbEMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLDBCQUEwQixDQUFDLEVBQ3pELFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUMsQ0FDbkMsQ0FBQztRQUNGLE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQzs7QUFqQ2Esa0RBQTBCLEdBQUcsR0FBRyxDQUFDOzs7SUFBL0MsbURBQStDOzs7OztJQUVuQyx3Q0FBNEI7Ozs7O0lBQzVCLDJDQUF1Qzs7Ozs7SUFDdkMsK0NBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgZGVsYXksIG1lcmdlTWFwLCBwdWJsaXNoLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlciB9IGZyb20gJy4vY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXInO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4uL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuLi9jZXNpdW0tZXZlbnQtYnVpbGRlcic7XG5cbmV4cG9ydCBjbGFzcyBDZXNpdW1Mb25nUHJlc3NPYnNlcnZlciBleHRlbmRzIENlc2l1bVB1cmVFdmVudE9ic2VydmVyIHtcbiAgcHVibGljIHN0YXRpYyBMT05HX1BSRVNTX0VWRU5UU19EVVJBVElPTiA9IDI1MDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZXZlbnQ6IENlc2l1bUV2ZW50LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgbW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgZXZlbnRGYWN0b3J5OiBDZXNpdW1FdmVudEJ1aWxkZXIpIHtcbiAgICBzdXBlcihldmVudCwgbW9kaWZpZXIpO1xuICB9XG5cbiAgaW5pdCgpOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IHN0YXJ0RXZlbnQ6IENlc2l1bUV2ZW50O1xuICAgIGxldCBzdG9wRXZlbnQ6IENlc2l1bUV2ZW50O1xuXG4gICAgaWYgKHRoaXMuZXZlbnQgPT09IENlc2l1bUV2ZW50LkxPTkdfTEVGVF9QUkVTUykge1xuICAgICAgc3RhcnRFdmVudCA9IENlc2l1bUV2ZW50LkxFRlRfRE9XTjtcbiAgICAgIHN0b3BFdmVudCA9IENlc2l1bUV2ZW50LkxFRlRfVVA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50ID09PSBDZXNpdW1FdmVudC5MT05HX1JJR0hUX1BSRVNTKSB7XG4gICAgICBzdGFydEV2ZW50ID0gQ2VzaXVtRXZlbnQuUklHSFRfRE9XTjtcbiAgICAgIHN0b3BFdmVudCA9IENlc2l1bUV2ZW50LlJJR0hUX1VQO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ldmVudCA9PT0gQ2VzaXVtRXZlbnQuTE9OR19NSURETEVfUFJFU1MpIHtcbiAgICAgIHN0YXJ0RXZlbnQgPSBDZXNpdW1FdmVudC5NSURETEVfRE9XTjtcbiAgICAgIHN0b3BFdmVudCA9IENlc2l1bUV2ZW50Lk1JRERMRV9VUDtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydEV2ZW50T2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRGYWN0b3J5LmdldChzdGFydEV2ZW50LCB0aGlzLm1vZGlmaWVyKTtcbiAgICBjb25zdCBzdG9wRXZlbnRPYnNlcnZhYmxlID0gdGhpcy5ldmVudEZhY3RvcnkuZ2V0KHN0b3BFdmVudCwgdGhpcy5tb2RpZmllcik7XG5cbiAgICAvLyBwdWJsaXNoIGZvciBwcmV2ZW50aW5nIHNpZGUgZWZmZWN0XG4gICAgY29uc3QgbG9uZ1ByZXNzT2JzZXJ2YWJsZSA9IHB1Ymxpc2goKShzdGFydEV2ZW50T2JzZXJ2YWJsZS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKGUpID0+IG9ic2VydmFibGVPZihlKS5waXBlKFxuICAgICAgICBkZWxheShDZXNpdW1Mb25nUHJlc3NPYnNlcnZlci5MT05HX1BSRVNTX0VWRU5UU19EVVJBVElPTiksXG4gICAgICAgIHRha2VVbnRpbChzdG9wRXZlbnRPYnNlcnZhYmxlKSkpLFxuICAgICkpO1xuICAgIHJldHVybiBsb25nUHJlc3NPYnNlcnZhYmxlO1xuICB9XG59XG4iXX0=
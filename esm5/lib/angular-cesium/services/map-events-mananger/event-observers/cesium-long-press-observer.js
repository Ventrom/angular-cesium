/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { of as observableOf } from 'rxjs';
import { delay, mergeMap, publish, takeUntil } from 'rxjs/operators';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
var CesiumLongPressObserver = /** @class */ (function (_super) {
    tslib_1.__extends(CesiumLongPressObserver, _super);
    function CesiumLongPressObserver(event, modifier, eventFactory) {
        var _this = _super.call(this, event, modifier) || this;
        _this.event = event;
        _this.modifier = modifier;
        _this.eventFactory = eventFactory;
        return _this;
    }
    /**
     * @return {?}
     */
    CesiumLongPressObserver.prototype.init = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var startEvent;
        /** @type {?} */
        var stopEvent;
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
        var startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        /** @type {?} */
        var stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);
        // publish for preventing side effect
        /** @type {?} */
        var longPressObservable = publish()(startEventObservable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return observableOf(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable)); }))));
        return longPressObservable;
    };
    CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;
    return CesiumLongPressObserver;
}(CesiumPureEventObserver));
export { CesiumLongPressObserver };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWxvbmctcHJlc3Mtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tbG9uZy1wcmVzcy1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBeUIsRUFBRSxJQUFJLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVqRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBSTFEO0lBQTZDLG1EQUF1QjtJQUdsRSxpQ0FBc0IsS0FBa0IsRUFDbEIsUUFBNkIsRUFDL0IsWUFBZ0M7UUFGcEQsWUFHRSxrQkFBTSxLQUFLLEVBQUUsUUFBUSxDQUFDLFNBQ3ZCO1FBSnFCLFdBQUssR0FBTCxLQUFLLENBQWE7UUFDbEIsY0FBUSxHQUFSLFFBQVEsQ0FBcUI7UUFDL0Isa0JBQVksR0FBWixZQUFZLENBQW9COztJQUVwRCxDQUFDOzs7O0lBRUQsc0NBQUk7OztJQUFKOztZQUNNLFVBQXVCOztZQUN2QixTQUFzQjtRQUUxQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLGVBQWUsRUFBRTtZQUM5QyxVQUFVLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztZQUNuQyxTQUFTLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztTQUNqQzthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEQsVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7WUFDcEMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7U0FDbEM7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLGlCQUFpQixFQUFFO1lBQ3ZELFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDO1lBQ3JDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO1NBQ25DOztZQUVLLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDOztZQUN2RSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7O1lBR3JFLG1CQUFtQixHQUFHLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FDN0QsUUFBUTs7OztRQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDbEMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLDBCQUEwQixDQUFDLEVBQ3pELFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBRmpCLENBRWlCLEVBQUMsQ0FDbkMsQ0FBQztRQUNGLE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQWpDYSxrREFBMEIsR0FBRyxHQUFHLENBQUM7SUFrQ2pELDhCQUFDO0NBQUEsQUFuQ0QsQ0FBNkMsdUJBQXVCLEdBbUNuRTtTQW5DWSx1QkFBdUI7OztJQUNsQyxtREFBK0M7Ozs7O0lBRW5DLHdDQUE0Qjs7Ozs7SUFDNUIsMkNBQXVDOzs7OztJQUN2QywrQ0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBkZWxheSwgbWVyZ2VNYXAsIHB1Ymxpc2gsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENlc2l1bVB1cmVFdmVudE9ic2VydmVyIH0gZnJvbSAnLi9jZXNpdW0tcHVyZS1ldmVudC1vYnNlcnZlcic7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudE1vZGlmaWVyIH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50QnVpbGRlciB9IGZyb20gJy4uL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcblxuZXhwb3J0IGNsYXNzIENlc2l1bUxvbmdQcmVzc09ic2VydmVyIGV4dGVuZHMgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIge1xuICBwdWJsaWMgc3RhdGljIExPTkdfUFJFU1NfRVZFTlRTX0RVUkFUSU9OID0gMjUwO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBldmVudDogQ2VzaXVtRXZlbnQsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBldmVudEZhY3Rvcnk6IENlc2l1bUV2ZW50QnVpbGRlcikge1xuICAgIHN1cGVyKGV2ZW50LCBtb2RpZmllcik7XG4gIH1cblxuICBpbml0KCk6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgc3RhcnRFdmVudDogQ2VzaXVtRXZlbnQ7XG4gICAgbGV0IHN0b3BFdmVudDogQ2VzaXVtRXZlbnQ7XG5cbiAgICBpZiAodGhpcy5ldmVudCA9PT0gQ2VzaXVtRXZlbnQuTE9OR19MRUZUX1BSRVNTKSB7XG4gICAgICBzdGFydEV2ZW50ID0gQ2VzaXVtRXZlbnQuTEVGVF9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuTEVGVF9VUDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZXZlbnQgPT09IENlc2l1bUV2ZW50LkxPTkdfUklHSFRfUFJFU1MpIHtcbiAgICAgIHN0YXJ0RXZlbnQgPSBDZXNpdW1FdmVudC5SSUdIVF9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuUklHSFRfVVA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50ID09PSBDZXNpdW1FdmVudC5MT05HX01JRERMRV9QUkVTUykge1xuICAgICAgc3RhcnRFdmVudCA9IENlc2l1bUV2ZW50Lk1JRERMRV9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuTUlERExFX1VQO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0RXZlbnRPYnNlcnZhYmxlID0gdGhpcy5ldmVudEZhY3RvcnkuZ2V0KHN0YXJ0RXZlbnQsIHRoaXMubW9kaWZpZXIpO1xuICAgIGNvbnN0IHN0b3BFdmVudE9ic2VydmFibGUgPSB0aGlzLmV2ZW50RmFjdG9yeS5nZXQoc3RvcEV2ZW50LCB0aGlzLm1vZGlmaWVyKTtcblxuICAgIC8vIHB1Ymxpc2ggZm9yIHByZXZlbnRpbmcgc2lkZSBlZmZlY3RcbiAgICBjb25zdCBsb25nUHJlc3NPYnNlcnZhYmxlID0gcHVibGlzaCgpKHN0YXJ0RXZlbnRPYnNlcnZhYmxlLnBpcGUoXG4gICAgICBtZXJnZU1hcCgoZSkgPT4gb2JzZXJ2YWJsZU9mKGUpLnBpcGUoXG4gICAgICAgIGRlbGF5KENlc2l1bUxvbmdQcmVzc09ic2VydmVyLkxPTkdfUFJFU1NfRVZFTlRTX0RVUkFUSU9OKSxcbiAgICAgICAgdGFrZVVudGlsKHN0b3BFdmVudE9ic2VydmFibGUpKSksXG4gICAgKSk7XG4gICAgcmV0dXJuIGxvbmdQcmVzc09ic2VydmFibGU7XG4gIH1cbn1cbiJdfQ==
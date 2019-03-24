/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
var CesiumPureEventObserver = /** @class */ (function () {
    function CesiumPureEventObserver(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    /**
     * @param {?} eventsHandler
     * @return {?}
     */
    CesiumPureEventObserver.prototype.init = /**
     * @param {?} eventsHandler
     * @return {?}
     */
    function (eventsHandler) {
        var _this = this;
        this.observer = Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            eventsHandler.setInputAction((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }), _this.event, _this.modifier);
        }));
        return this.observer;
    };
    return CesiumPureEventObserver;
}());
export { CesiumPureEventObserver };
if (false) {
    /** @type {?} */
    CesiumPureEventObserver.prototype.observer;
    /**
     * @type {?}
     * @protected
     */
    CesiumPureEventObserver.prototype.event;
    /**
     * @type {?}
     * @protected
     */
    CesiumPureEventObserver.prototype.modifier;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tcHVyZS1ldmVudC1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUk5QztJQUdFLGlDQUFzQixLQUFrQixFQUFZLFFBQTZCO1FBQTNELFVBQUssR0FBTCxLQUFLLENBQWE7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFxQjtJQUNqRixDQUFDOzs7OztJQUVELHNDQUFJOzs7O0lBQUosVUFBSyxhQUFrQjtRQUF2QixpQkFZQztRQVhDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFDLFFBQXlCO1lBQ3hELGFBQWEsQ0FBQyxjQUFjOzs7O1lBQUMsVUFBQyxRQUFhO2dCQUN6QyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQ3JCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztvQkFDM0MsUUFBUSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUMxQztnQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFCLENBQUMsR0FBRSxLQUFJLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBQ0YsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0gsOEJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDOzs7O0lBbEJDLDJDQUFpQzs7Ozs7SUFFckIsd0NBQTRCOzs7OztJQUFFLDJDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmliZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi9jb25zdHMvY2VzaXVtLWV2ZW50LW1vZGlmaWVyLmVudW0nO1xuXG5leHBvcnQgY2xhc3MgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIge1xuICBwdWJsaWMgb2JzZXJ2ZXI6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZXZlbnQ6IENlc2l1bUV2ZW50LCBwcm90ZWN0ZWQgbW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIpIHtcbiAgfVxuXG4gIGluaXQoZXZlbnRzSGFuZGxlcjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICB0aGlzLm9ic2VydmVyID0gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyOiBTdWJzY3JpYmVyPGFueT4pID0+IHtcbiAgICAgICAgZXZlbnRzSGFuZGxlci5zZXRJbnB1dEFjdGlvbigobW92ZW1lbnQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChtb3ZlbWVudC5wb3NpdGlvbikge1xuICAgICAgICAgICAgbW92ZW1lbnQuc3RhcnRQb3NpdGlvbiA9IG1vdmVtZW50LnBvc2l0aW9uO1xuICAgICAgICAgICAgbW92ZW1lbnQuZW5kUG9zaXRpb24gPSBtb3ZlbWVudC5wb3NpdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChtb3ZlbWVudCk7XG4gICAgICAgIH0sIHRoaXMuZXZlbnQsIHRoaXMubW9kaWZpZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cbn1cbiJdfQ==
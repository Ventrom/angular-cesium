/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Observable } from 'rxjs';
export class CesiumPureEventObserver {
    /**
     * @param {?} event
     * @param {?} modifier
     */
    constructor(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    /**
     * @param {?} eventsHandler
     * @return {?}
     */
    init(eventsHandler) {
        this.observer = Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => {
            eventsHandler.setInputAction((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }), this.event, this.modifier);
        }));
        return this.observer;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tcHVyZS1ldmVudC1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUk5QyxNQUFNLE9BQU8sdUJBQXVCOzs7OztJQUdsQyxZQUFzQixLQUFrQixFQUFZLFFBQTZCO1FBQTNELFVBQUssR0FBTCxLQUFLLENBQWE7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFxQjtJQUNqRixDQUFDOzs7OztJQUVELElBQUksQ0FBQyxhQUFrQjtRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNOzs7O1FBQUMsQ0FBQyxRQUF5QixFQUFFLEVBQUU7WUFDNUQsYUFBYSxDQUFDLGNBQWM7Ozs7WUFBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQ3JCLFFBQVEsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztvQkFDM0MsUUFBUSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUMxQztnQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFCLENBQUMsR0FBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBQ0YsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7OztJQWxCQywyQ0FBaUM7Ozs7O0lBRXJCLHdDQUE0Qjs7Ozs7SUFBRSwyQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudE1vZGlmaWVyIH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcblxuZXhwb3J0IGNsYXNzIENlc2l1bVB1cmVFdmVudE9ic2VydmVyIHtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGV2ZW50OiBDZXNpdW1FdmVudCwgcHJvdGVjdGVkIG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyKSB7XG4gIH1cblxuICBpbml0KGV2ZW50c0hhbmRsZXI6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgdGhpcy5vYnNlcnZlciA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+KSA9PiB7XG4gICAgICAgIGV2ZW50c0hhbmRsZXIuc2V0SW5wdXRBY3Rpb24oKG1vdmVtZW50OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAobW92ZW1lbnQucG9zaXRpb24pIHtcbiAgICAgICAgICAgIG1vdmVtZW50LnN0YXJ0UG9zaXRpb24gPSBtb3ZlbWVudC5wb3NpdGlvbjtcbiAgICAgICAgICAgIG1vdmVtZW50LmVuZFBvc2l0aW9uID0gbW92ZW1lbnQucG9zaXRpb247XG4gICAgICAgICAgfVxuICAgICAgICAgIG9ic2VydmVyLm5leHQobW92ZW1lbnQpO1xuICAgICAgICB9LCB0aGlzLmV2ZW50LCB0aGlzLm1vZGlmaWVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiB0aGlzLm9ic2VydmVyO1xuICB9XG59XG4iXX0=
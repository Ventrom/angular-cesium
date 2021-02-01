import { Observable } from 'rxjs';
var CesiumPureEventObserver = /** @class */ (function () {
    function CesiumPureEventObserver(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    CesiumPureEventObserver.prototype.init = function (eventsHandler) {
        var _this = this;
        this.observer = Observable.create(function (observer) {
            eventsHandler.setInputAction(function (movement) {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }, _this.event, _this.modifier);
        });
        return this.observer;
    };
    return CesiumPureEventObserver;
}());
export { CesiumPureEventObserver };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tcHVyZS1ldmVudC1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBSTlDO0lBR0UsaUNBQXNCLEtBQWtCLEVBQVksUUFBNkI7UUFBM0QsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUFZLGFBQVEsR0FBUixRQUFRLENBQXFCO0lBQ2pGLENBQUM7SUFFRCxzQ0FBSSxHQUFKLFVBQUssYUFBa0I7UUFBdkIsaUJBWUM7UUFYQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUF5QjtZQUN4RCxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQUMsUUFBYTtnQkFDekMsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO29CQUNyQixRQUFRLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7b0JBQzNDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDMUM7Z0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQixDQUFDLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUNGLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmliZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi9jb25zdHMvY2VzaXVtLWV2ZW50LW1vZGlmaWVyLmVudW0nO1xuXG5leHBvcnQgY2xhc3MgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIge1xuICBwdWJsaWMgb2JzZXJ2ZXI6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZXZlbnQ6IENlc2l1bUV2ZW50LCBwcm90ZWN0ZWQgbW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIpIHtcbiAgfVxuXG4gIGluaXQoZXZlbnRzSGFuZGxlcjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICB0aGlzLm9ic2VydmVyID0gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyOiBTdWJzY3JpYmVyPGFueT4pID0+IHtcbiAgICAgICAgZXZlbnRzSGFuZGxlci5zZXRJbnB1dEFjdGlvbigobW92ZW1lbnQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChtb3ZlbWVudC5wb3NpdGlvbikge1xuICAgICAgICAgICAgbW92ZW1lbnQuc3RhcnRQb3NpdGlvbiA9IG1vdmVtZW50LnBvc2l0aW9uO1xuICAgICAgICAgICAgbW92ZW1lbnQuZW5kUG9zaXRpb24gPSBtb3ZlbWVudC5wb3NpdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChtb3ZlbWVudCk7XG4gICAgICAgIH0sIHRoaXMuZXZlbnQsIHRoaXMubW9kaWZpZXIpO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cbn1cbiJdfQ==
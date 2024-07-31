import { Observable } from 'rxjs';
export class CesiumPureEventObserver {
    constructor(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    init(eventsHandler) {
        this.observer = Observable.create((observer) => {
            eventsHandler.setInputAction((movement) => {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }, this.event, this.modifier);
        });
        return this.observer;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXB1cmUtZXZlbnQtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1wdXJlLWV2ZW50LW9ic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFJOUMsTUFBTSxPQUFPLHVCQUF1QjtJQUdsQyxZQUFzQixLQUFrQixFQUFZLFFBQTZCO1FBQTNELFVBQUssR0FBTCxLQUFLLENBQWE7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFxQjtJQUNqRixDQUFDO0lBRUQsSUFBSSxDQUFDLGFBQWtCO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQXlCLEVBQUUsRUFBRTtZQUM1RCxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7Z0JBQzdDLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN0QixRQUFRLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7b0JBQzNDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFCLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQ0YsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudE1vZGlmaWVyIH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcblxuZXhwb3J0IGNsYXNzIENlc2l1bVB1cmVFdmVudE9ic2VydmVyIHtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGV2ZW50OiBDZXNpdW1FdmVudCwgcHJvdGVjdGVkIG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyKSB7XG4gIH1cblxuICBpbml0KGV2ZW50c0hhbmRsZXI6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgdGhpcy5vYnNlcnZlciA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+KSA9PiB7XG4gICAgICAgIGV2ZW50c0hhbmRsZXIuc2V0SW5wdXRBY3Rpb24oKG1vdmVtZW50OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAobW92ZW1lbnQucG9zaXRpb24pIHtcbiAgICAgICAgICAgIG1vdmVtZW50LnN0YXJ0UG9zaXRpb24gPSBtb3ZlbWVudC5wb3NpdGlvbjtcbiAgICAgICAgICAgIG1vdmVtZW50LmVuZFBvc2l0aW9uID0gbW92ZW1lbnQucG9zaXRpb247XG4gICAgICAgICAgfVxuICAgICAgICAgIG9ic2VydmVyLm5leHQobW92ZW1lbnQpO1xuICAgICAgICB9LCB0aGlzLmV2ZW50LCB0aGlzLm1vZGlmaWVyKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiB0aGlzLm9ic2VydmVyO1xuICB9XG59XG4iXX0=
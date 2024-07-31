import { merge, of as observableOf } from 'rxjs';
import { delay, filter, mergeMap, publish, takeUntil, tap } from 'rxjs/operators';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
export class CesiumLongPressObserver extends CesiumPureEventObserver {
    static { this.LONG_PRESS_EVENTS_DURATION = 250; }
    static { this.LONG_PRESS_EVENTS_MIN_DISTANCE_PX = 10; }
    constructor(event, modifier, eventFactory) {
        super(event, modifier);
        this.event = event;
        this.modifier = modifier;
        this.eventFactory = eventFactory;
    }
    init() {
        let startEvent;
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
        // Save start event position
        let startEventPosition = null;
        const startEventObservable = this.eventFactory.get(startEvent, this.modifier)
            .pipe(tap((movement) => (startEventPosition = movement.endPosition)));
        // Prevent drag mistaken for long press by observing mouse move far from start event position
        const mouseMoveEventObservable = this.eventFactory.get(CesiumEvent.MOUSE_MOVE)
            .pipe(filter((movement) => Math.abs(movement.endPosition.x - startEventPosition.x) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX ||
            Math.abs(movement.endPosition.y - startEventPosition.y) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX));
        const stopEventObservable = merge(this.eventFactory.get(stopEvent, this.modifier), mouseMoveEventObservable);
        // publish for preventing side effect
        const longPressObservable = publish()(startEventObservable.pipe(mergeMap((e) => observableOf(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable)))));
        return longPressObservable;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWxvbmctcHJlc3Mtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1sb25nLXByZXNzLW9ic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBeUIsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDeEUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBSzFELE1BQU0sT0FBTyx1QkFBd0IsU0FBUSx1QkFBdUI7YUFDcEQsK0JBQTBCLEdBQUcsR0FBRyxDQUFDO2FBQ2pDLHNDQUFpQyxHQUFHLEVBQUUsQ0FBQztJQUVyRCxZQUFzQixLQUFrQixFQUNsQixRQUE2QixFQUMvQixZQUFnQztRQUNsRCxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBSEgsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUMvQixpQkFBWSxHQUFaLFlBQVksQ0FBb0I7SUFFcEQsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLFVBQXVCLENBQUM7UUFDNUIsSUFBSSxTQUFzQixDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDL0MsVUFBVSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDbkMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDbEMsQ0FBQzthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN2RCxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztZQUNwQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3hELFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDO1lBQ3JDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO1FBQ3BDLENBQUM7UUFFRCw0QkFBNEI7UUFDNUIsSUFBSSxrQkFBa0IsR0FBZSxJQUFJLENBQUM7UUFDMUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUMxRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEUsNkZBQTZGO1FBQzdGLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQzthQUMzRSxJQUFJLENBQ0gsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxpQ0FBaUM7WUFDbkgsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxpQ0FBaUMsQ0FDcEgsQ0FDRixDQUFDO1FBRUosTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQy9DLHdCQUF3QixDQUN6QixDQUFDO1FBRUYscUNBQXFDO1FBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUM3RCxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2xDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQywwQkFBMEIsQ0FBQyxFQUN6RCxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQ25DLENBQUMsQ0FBQztRQUNILE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgbWVyZ2UsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVsYXksIGZpbHRlciwgbWVyZ2VNYXAsIHB1Ymxpc2gsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIgfSBmcm9tICcuL2Nlc2l1bS1wdXJlLWV2ZW50LW9ic2VydmVyJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi9jb25zdHMvY2VzaXVtLWV2ZW50LW1vZGlmaWVyLmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRCdWlsZGVyIH0gZnJvbSAnLi4vY2VzaXVtLWV2ZW50LWJ1aWxkZXInO1xuaW1wb3J0IHsgQ2FydGVzaWFuMiB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4yJztcblxuZXhwb3J0IGNsYXNzIENlc2l1bUxvbmdQcmVzc09ic2VydmVyIGV4dGVuZHMgQ2VzaXVtUHVyZUV2ZW50T2JzZXJ2ZXIge1xuICBwdWJsaWMgc3RhdGljIExPTkdfUFJFU1NfRVZFTlRTX0RVUkFUSU9OID0gMjUwO1xuICBwdWJsaWMgc3RhdGljIExPTkdfUFJFU1NfRVZFTlRTX01JTl9ESVNUQU5DRV9QWCA9IDEwO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBldmVudDogQ2VzaXVtRXZlbnQsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBldmVudEZhY3Rvcnk6IENlc2l1bUV2ZW50QnVpbGRlcikge1xuICAgIHN1cGVyKGV2ZW50LCBtb2RpZmllcik7XG4gIH1cblxuICBpbml0KCk6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgc3RhcnRFdmVudDogQ2VzaXVtRXZlbnQ7XG4gICAgbGV0IHN0b3BFdmVudDogQ2VzaXVtRXZlbnQ7XG5cbiAgICBpZiAodGhpcy5ldmVudCA9PT0gQ2VzaXVtRXZlbnQuTE9OR19MRUZUX1BSRVNTKSB7XG4gICAgICBzdGFydEV2ZW50ID0gQ2VzaXVtRXZlbnQuTEVGVF9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuTEVGVF9VUDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZXZlbnQgPT09IENlc2l1bUV2ZW50LkxPTkdfUklHSFRfUFJFU1MpIHtcbiAgICAgIHN0YXJ0RXZlbnQgPSBDZXNpdW1FdmVudC5SSUdIVF9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuUklHSFRfVVA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50ID09PSBDZXNpdW1FdmVudC5MT05HX01JRERMRV9QUkVTUykge1xuICAgICAgc3RhcnRFdmVudCA9IENlc2l1bUV2ZW50Lk1JRERMRV9ET1dOO1xuICAgICAgc3RvcEV2ZW50ID0gQ2VzaXVtRXZlbnQuTUlERExFX1VQO1xuICAgIH1cblxuICAgIC8vIFNhdmUgc3RhcnQgZXZlbnQgcG9zaXRpb25cbiAgICBsZXQgc3RhcnRFdmVudFBvc2l0aW9uOiBDYXJ0ZXNpYW4yID0gbnVsbDtcbiAgICBjb25zdCBzdGFydEV2ZW50T2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRGYWN0b3J5LmdldChzdGFydEV2ZW50LCB0aGlzLm1vZGlmaWVyKVxuICAgICAgLnBpcGUodGFwKChtb3ZlbWVudCkgPT4gKHN0YXJ0RXZlbnRQb3NpdGlvbiA9IG1vdmVtZW50LmVuZFBvc2l0aW9uKSkpO1xuXG4gICAgLy8gUHJldmVudCBkcmFnIG1pc3Rha2VuIGZvciBsb25nIHByZXNzIGJ5IG9ic2VydmluZyBtb3VzZSBtb3ZlIGZhciBmcm9tIHN0YXJ0IGV2ZW50IHBvc2l0aW9uXG4gICAgY29uc3QgbW91c2VNb3ZlRXZlbnRPYnNlcnZhYmxlID0gdGhpcy5ldmVudEZhY3RvcnkuZ2V0KENlc2l1bUV2ZW50Lk1PVVNFX01PVkUpXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChtb3ZlbWVudCkgPT5cbiAgICAgICAgICBNYXRoLmFicyhtb3ZlbWVudC5lbmRQb3NpdGlvbi54IC0gc3RhcnRFdmVudFBvc2l0aW9uLngpID4gQ2VzaXVtTG9uZ1ByZXNzT2JzZXJ2ZXIuTE9OR19QUkVTU19FVkVOVFNfTUlOX0RJU1RBTkNFX1BYIHx8XG4gICAgICAgICAgTWF0aC5hYnMobW92ZW1lbnQuZW5kUG9zaXRpb24ueSAtIHN0YXJ0RXZlbnRQb3NpdGlvbi55KSA+IENlc2l1bUxvbmdQcmVzc09ic2VydmVyLkxPTkdfUFJFU1NfRVZFTlRTX01JTl9ESVNUQU5DRV9QWFxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgY29uc3Qgc3RvcEV2ZW50T2JzZXJ2YWJsZSA9IG1lcmdlKFxuICAgICAgdGhpcy5ldmVudEZhY3RvcnkuZ2V0KHN0b3BFdmVudCwgdGhpcy5tb2RpZmllciksXG4gICAgICBtb3VzZU1vdmVFdmVudE9ic2VydmFibGVcbiAgICApO1xuXG4gICAgLy8gcHVibGlzaCBmb3IgcHJldmVudGluZyBzaWRlIGVmZmVjdFxuICAgIGNvbnN0IGxvbmdQcmVzc09ic2VydmFibGUgPSBwdWJsaXNoKCkoc3RhcnRFdmVudE9ic2VydmFibGUucGlwZShcbiAgICAgIG1lcmdlTWFwKChlKSA9PiBvYnNlcnZhYmxlT2YoZSkucGlwZShcbiAgICAgICAgZGVsYXkoQ2VzaXVtTG9uZ1ByZXNzT2JzZXJ2ZXIuTE9OR19QUkVTU19FVkVOVFNfRFVSQVRJT04pLFxuICAgICAgICB0YWtlVW50aWwoc3RvcEV2ZW50T2JzZXJ2YWJsZSkpKSxcbiAgICApKTtcbiAgICByZXR1cm4gbG9uZ1ByZXNzT2JzZXJ2YWJsZTtcbiAgfVxufVxuIl19
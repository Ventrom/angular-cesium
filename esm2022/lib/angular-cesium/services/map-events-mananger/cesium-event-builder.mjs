import { publish } from 'rxjs/operators';
import { CesiumEvent } from './consts/cesium-event.enum';
import { Injectable } from '@angular/core';
import { CesiumPureEventObserver } from './event-observers/cesium-pure-event-observer';
import { CesiumLongPressObserver } from './event-observers/cesium-long-press-observer';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
export class CesiumEventBuilder {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    static { this.longPressEvents = new Set([
        CesiumEvent.LONG_LEFT_PRESS,
        CesiumEvent.LONG_RIGHT_PRESS,
        CesiumEvent.LONG_MIDDLE_PRESS
    ]); }
    static getEventFullName(event, modifier) {
        if (modifier) {
            return `${event}_${modifier}`;
        }
        else {
            return event.toString();
        }
    }
    init() {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    }
    get(event, modifier) {
        const eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            const eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    }
    createCesiumEventObservable(event, modifier) {
        let cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    }
    createSpecialCesiumEventObservable(event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumEventBuilder, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumEventBuilder }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumEventBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWV2ZW50LWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY2VzaXVtLWV2ZW50LWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7QUFJdkYsTUFBTSxPQUFPLGtCQUFrQjtJQUU3QixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVV4Qyw0QkFBdUIsR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztJQVRoRixDQUFDO2FBRWEsb0JBQWUsR0FBcUIsSUFBSSxHQUFHLENBQUM7UUFDeEQsV0FBVyxDQUFDLGVBQWU7UUFDM0IsV0FBVyxDQUFDLGdCQUFnQjtRQUM1QixXQUFXLENBQUMsaUJBQWlCO0tBQzlCLENBQUMsQUFKMkIsQ0FJMUI7SUFLSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBa0IsRUFBRSxRQUE4QjtRQUMvRSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2IsT0FBTyxHQUFHLEtBQUssSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNoQyxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztJQUM5RSxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWtCLEVBQUUsUUFBOEI7UUFDcEQsTUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ2hELE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDM0QsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztJQUNILENBQUM7SUFFTywyQkFBMkIsQ0FBQyxLQUFrQixFQUFFLFFBQThCO1FBQ3BGLElBQUkscUJBQWlELENBQUM7UUFDdEQsSUFBSSxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbEQscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRixDQUFDO2FBQU0sQ0FBQztZQUNOLHFCQUFxQixHQUFHLE9BQU8sRUFBRSxDQUFDLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMzRyxDQUFDO1FBQ0QscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEMsT0FBTyxxQkFBcUIsQ0FBQztJQUMvQixDQUFDO0lBRU8sa0NBQWtDLENBQUMsS0FBa0IsRUFBRSxRQUE2QjtRQUMxRixzQ0FBc0M7UUFDdEMsT0FBTyxJQUFJLHVCQUF1QixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkUsQ0FBQzs4R0FuRFUsa0JBQWtCO2tIQUFsQixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlciB9IGZyb20gJy4vZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1wdXJlLWV2ZW50LW9ic2VydmVyJztcbmltcG9ydCB7IENlc2l1bUxvbmdQcmVzc09ic2VydmVyIH0gZnJvbSAnLi9ldmVudC1vYnNlcnZlcnMvY2VzaXVtLWxvbmctcHJlc3Mtb2JzZXJ2ZXInO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1FdmVudEJ1aWxkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBsb25nUHJlc3NFdmVudHM6IFNldDxDZXNpdW1FdmVudD4gPSBuZXcgU2V0KFtcbiAgICBDZXNpdW1FdmVudC5MT05HX0xFRlRfUFJFU1MsXG4gICAgQ2VzaXVtRXZlbnQuTE9OR19SSUdIVF9QUkVTUyxcbiAgICBDZXNpdW1FdmVudC5MT05HX01JRERMRV9QUkVTU1xuICBdKTtcblxuICBwcml2YXRlIGV2ZW50c0hhbmRsZXI6IGFueTtcbiAgcHJpdmF0ZSBjZXNpdW1FdmVudHNPYnNlcnZhYmxlcyA9IG5ldyBNYXA8c3RyaW5nLCBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55Pj4oKTtcblxuICBwdWJsaWMgc3RhdGljIGdldEV2ZW50RnVsbE5hbWUoZXZlbnQ6IENlc2l1bUV2ZW50LCBtb2RpZmllcj86IENlc2l1bUV2ZW50TW9kaWZpZXIpOiBzdHJpbmcge1xuICAgIGlmIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIGAke2V2ZW50fV8ke21vZGlmaWVyfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBldmVudC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5ldmVudHNIYW5kbGVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnNjcmVlblNwYWNlRXZlbnRIYW5kbGVyO1xuICB9XG5cbiAgZ2V0KGV2ZW50OiBDZXNpdW1FdmVudCwgbW9kaWZpZXI/OiBDZXNpdW1FdmVudE1vZGlmaWVyKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IENlc2l1bUV2ZW50QnVpbGRlci5nZXRFdmVudEZ1bGxOYW1lKGV2ZW50LCBtb2RpZmllcik7XG4gICAgaWYgKHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuaGFzKGV2ZW50TmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNlc2l1bUV2ZW50c09ic2VydmFibGVzLmdldChldmVudE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBldmVudE9ic2VydmVyID0gdGhpcy5jcmVhdGVDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICAgIHRoaXMuY2VzaXVtRXZlbnRzT2JzZXJ2YWJsZXMuc2V0KGV2ZW50TmFtZSwgZXZlbnRPYnNlcnZlcik7XG4gICAgICByZXR1cm4gZXZlbnRPYnNlcnZlcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcik6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgY2VzaXVtRXZlbnRPYnNlcnZhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8YW55PjtcbiAgICBpZiAoQ2VzaXVtRXZlbnRCdWlsZGVyLmxvbmdQcmVzc0V2ZW50cy5oYXMoZXZlbnQpKSB7XG4gICAgICBjZXNpdW1FdmVudE9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZVNwZWNpYWxDZXNpdW1FdmVudE9ic2VydmFibGUoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VzaXVtRXZlbnRPYnNlcnZhYmxlID0gcHVibGlzaCgpKG5ldyBDZXNpdW1QdXJlRXZlbnRPYnNlcnZlcihldmVudCwgbW9kaWZpZXIpLmluaXQodGhpcy5ldmVudHNIYW5kbGVyKSk7XG4gICAgfVxuICAgIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZS5jb25uZWN0KCk7XG4gICAgcmV0dXJuIGNlc2l1bUV2ZW50T2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3BlY2lhbENlc2l1bUV2ZW50T2JzZXJ2YWJsZShldmVudDogQ2VzaXVtRXZlbnQsIG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyKTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPGFueT4ge1xuICAgIC8vIGNvdWxkIHN1cHBvcnQgbW9yZSBldmVudHMgaWYgbmVlZGVkXG4gICAgcmV0dXJuIG5ldyBDZXNpdW1Mb25nUHJlc3NPYnNlcnZlcihldmVudCwgbW9kaWZpZXIsIHRoaXMpLmluaXQoKTtcbiAgfVxufVxuXG4iXX0=
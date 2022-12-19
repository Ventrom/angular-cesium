import { Injectable } from '@angular/core';
import { EditableCircle } from '../../../models/editable-circle';
import * as i0 from "@angular/core";
export class CirclesManagerService {
    constructor() {
        this.circles = new Map();
    }
    createEditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    }
    dispose(id) {
        const circle = this.circles.get(id);
        if (circle) {
            circle.dispose();
        }
        this.circles.delete(id);
    }
    get(id) {
        return this.circles.get(id);
    }
    clear() {
        this.circles.forEach(circle => circle.dispose());
        this.circles.clear();
    }
}
CirclesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CirclesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CirclesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CirclesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CirclesManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7O0FBS2pFLE1BQU0sT0FBTyxxQkFBcUI7SUFEbEM7UUFFVSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7S0E0QnJEO0lBMUJDLG9CQUFvQixDQUFDLEVBQVUsRUFDVixnQkFBa0MsRUFDbEMsZUFBaUMsRUFDakMsYUFBK0IsRUFDL0IsYUFBZ0M7UUFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0csSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7bUhBNUJVLHFCQUFxQjt1SEFBckIscUJBQXFCOzRGQUFyQixxQkFBcUI7a0JBRGpDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0YWJsZUNpcmNsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1jaXJjbGUnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjaXJjbGVzID0gbmV3IE1hcDxzdHJpbmcsIEVkaXRhYmxlQ2lyY2xlPigpO1xuXG4gIGNyZWF0ZUVkaXRhYmxlQ2lyY2xlKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRDaXJjbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdEFyY3NMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlT3B0aW9uczogQ2lyY2xlRWRpdE9wdGlvbnMpOiBFZGl0YWJsZUNpcmNsZSB7XG4gICAgY29uc3QgZWRpdGFibGVDaXJjbGUgPSBuZXcgRWRpdGFibGVDaXJjbGUoaWQsIGVkaXRDaXJjbGVzTGF5ZXIsIGVkaXRQb2ludHNMYXllciwgZWRpdEFyY3NMYXllciwgY2lyY2xlT3B0aW9ucyk7XG4gICAgdGhpcy5jaXJjbGVzLnNldChpZCwgZWRpdGFibGVDaXJjbGUpO1xuICAgIHJldHVybiBlZGl0YWJsZUNpcmNsZTtcbiAgfVxuXG4gIGRpc3Bvc2UoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlcy5nZXQoaWQpO1xuICAgIGlmIChjaXJjbGUpIHtcbiAgICAgIGNpcmNsZS5kaXNwb3NlKCk7XG4gICAgfVxuICAgIHRoaXMuY2lyY2xlcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZUNpcmNsZSB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlcy5nZXQoaWQpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5jaXJjbGVzLmZvckVhY2goY2lyY2xlID0+IGNpcmNsZS5kaXNwb3NlKCkpO1xuICAgIHRoaXMuY2lyY2xlcy5jbGVhcigpO1xuICB9XG59XG4iXX0=
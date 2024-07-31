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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CirclesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CirclesManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CirclesManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7O0FBS2pFLE1BQU0sT0FBTyxxQkFBcUI7SUFEbEM7UUFFVSxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7S0E0QnJEO0lBMUJDLG9CQUFvQixDQUFDLEVBQVUsRUFDVixnQkFBa0MsRUFDbEMsZUFBaUMsRUFDakMsYUFBK0IsRUFDL0IsYUFBZ0M7UUFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0csSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7OEdBNUJVLHFCQUFxQjtrSEFBckIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQURqQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRWRpdGFibGVDaXJjbGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtY2lyY2xlJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC1vcHRpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENpcmNsZXNNYW5hZ2VyU2VydmljZSB7XG4gIHByaXZhdGUgY2lyY2xlcyA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZUNpcmNsZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZUNpcmNsZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0Q2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRBcmNzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZU9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zKTogRWRpdGFibGVDaXJjbGUge1xuICAgIGNvbnN0IGVkaXRhYmxlQ2lyY2xlID0gbmV3IEVkaXRhYmxlQ2lyY2xlKGlkLCBlZGl0Q2lyY2xlc0xheWVyLCBlZGl0UG9pbnRzTGF5ZXIsIGVkaXRBcmNzTGF5ZXIsIGNpcmNsZU9wdGlvbnMpO1xuICAgIHRoaXMuY2lyY2xlcy5zZXQoaWQsIGVkaXRhYmxlQ2lyY2xlKTtcbiAgICByZXR1cm4gZWRpdGFibGVDaXJjbGU7XG4gIH1cblxuICBkaXNwb3NlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXMuZ2V0KGlkKTtcbiAgICBpZiAoY2lyY2xlKSB7XG4gICAgICBjaXJjbGUuZGlzcG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLmNpcmNsZXMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogRWRpdGFibGVDaXJjbGUge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuY2lyY2xlcy5mb3JFYWNoKGNpcmNsZSA9PiBjaXJjbGUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLmNpcmNsZXMuY2xlYXIoKTtcbiAgfVxufVxuIl19
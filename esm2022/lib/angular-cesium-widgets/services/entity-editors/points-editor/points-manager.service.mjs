import { Injectable } from '@angular/core';
import { EditablePoint } from '../../../models/editable-point';
import * as i0 from "@angular/core";
export class PointsManagerService {
    constructor() {
        this.points = new Map();
    }
    createEditablePoint(id, editPointLayer, coordinateConverter, editOptions, position) {
        const editablePoint = new EditablePoint(id, editPointLayer, coordinateConverter, editOptions, position);
        this.points.set(id, editablePoint);
    }
    enableAll() {
        this.points.forEach(point => point.enableEdit = true);
    }
    disableAll() {
        this.points.forEach(point => point.enableEdit = false);
    }
    dispose(id) {
        const point = this.points.get(id);
        if (point.getCurrentPoint()) {
            point.dispose();
        }
        this.points.delete(id);
    }
    get(id) {
        return this.points.get(id);
    }
    clear() {
        this.points.forEach(point => point.dispose());
        this.points.clear();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PointsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PointsManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PointsManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2ludHMtZWRpdG9yL3BvaW50cy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBRy9ELE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFRSxXQUFNLEdBQStCLElBQUksR0FBRyxFQUF5QixDQUFDO0tBeUN2RTtJQXZDQyxtQkFBbUIsQ0FBQyxFQUFVLEVBQ1YsY0FBZ0MsRUFDaEMsbUJBQXdDLEVBQ3hDLFdBQThCLEVBQzlCLFFBQXFCO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLElBQUksYUFBYSxDQUNyQyxFQUFFLEVBQ0YsY0FBYyxFQUNkLG1CQUFtQixFQUNuQixXQUFXLEVBQ1gsUUFBUSxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUNoQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFVO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7WUFDNUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7OEdBekNVLG9CQUFvQjtrSEFBcEIsb0JBQW9COzsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2ludEVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFZGl0YWJsZVBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXBvaW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvaW50c01hbmFnZXJTZXJ2aWNlIHtcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBFZGl0YWJsZVBvaW50PiA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZVBvaW50PigpO1xuXG4gIGNyZWF0ZUVkaXRhYmxlUG9pbnQoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9pbnRMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRPcHRpb25zPzogUG9pbnRFZGl0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbj86IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBlZGl0YWJsZVBvaW50ID0gbmV3IEVkaXRhYmxlUG9pbnQoXG4gICAgICBpZCxcbiAgICAgIGVkaXRQb2ludExheWVyLFxuICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgIGVkaXRPcHRpb25zLFxuICAgICAgcG9zaXRpb24pO1xuICAgIHRoaXMucG9pbnRzLnNldChpZCwgZWRpdGFibGVQb2ludFxuICAgICk7XG4gIH1cblxuICBlbmFibGVBbGwoKSB7XG4gICAgdGhpcy5wb2ludHMuZm9yRWFjaChwb2ludCA9PiBwb2ludC5lbmFibGVFZGl0ID0gdHJ1ZSk7XG4gIH1cblxuICBkaXNhYmxlQWxsKCkge1xuICAgIHRoaXMucG9pbnRzLmZvckVhY2gocG9pbnQgPT4gcG9pbnQuZW5hYmxlRWRpdCA9IGZhbHNlKTtcbiAgfVxuXG4gIGRpc3Bvc2UoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHMuZ2V0KGlkKTtcbiAgICBpZiAocG9pbnQuZ2V0Q3VycmVudFBvaW50KCkpIHtcbiAgICAgIHBvaW50LmRpc3Bvc2UoKTtcbiAgICB9XG4gICAgdGhpcy5wb2ludHMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogRWRpdGFibGVQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzLmdldChpZCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHBvaW50LmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5wb2ludHMuY2xlYXIoKTtcbiAgfVxufVxuIl19
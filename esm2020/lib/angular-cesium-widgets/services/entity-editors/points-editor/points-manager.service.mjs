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
}
PointsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PointsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2ludHMtZWRpdG9yL3BvaW50cy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7O0FBRy9ELE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFRSxXQUFNLEdBQStCLElBQUksR0FBRyxFQUF5QixDQUFDO0tBeUN2RTtJQXZDQyxtQkFBbUIsQ0FBQyxFQUFVLEVBQ1YsY0FBZ0MsRUFDaEMsbUJBQXdDLEVBQ3hDLFdBQThCLEVBQzlCLFFBQXFCO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLElBQUksYUFBYSxDQUNyQyxFQUFFLEVBQ0YsY0FBYyxFQUNkLG1CQUFtQixFQUNuQixXQUFXLEVBQ1gsUUFBUSxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUNoQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFVO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQzNCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQjtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7a0hBekNVLG9CQUFvQjtzSEFBcEIsb0JBQW9COzRGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvaW50RWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEVkaXRhYmxlUG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9pbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9pbnRzTWFuYWdlclNlcnZpY2Uge1xuICBwb2ludHM6IE1hcDxzdHJpbmcsIEVkaXRhYmxlUG9pbnQ+ID0gbmV3IE1hcDxzdHJpbmcsIEVkaXRhYmxlUG9pbnQ+KCk7XG5cbiAgY3JlYXRlRWRpdGFibGVQb2ludChpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRQb2ludExheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgZWRpdE9wdGlvbnM/OiBQb2ludEVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uPzogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IGVkaXRhYmxlUG9pbnQgPSBuZXcgRWRpdGFibGVQb2ludChcbiAgICAgIGlkLFxuICAgICAgZWRpdFBvaW50TGF5ZXIsXG4gICAgICBjb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgZWRpdE9wdGlvbnMsXG4gICAgICBwb3NpdGlvbik7XG4gICAgdGhpcy5wb2ludHMuc2V0KGlkLCBlZGl0YWJsZVBvaW50XG4gICAgKTtcbiAgfVxuXG4gIGVuYWJsZUFsbCgpIHtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHBvaW50LmVuYWJsZUVkaXQgPSB0cnVlKTtcbiAgfVxuXG4gIGRpc2FibGVBbGwoKSB7XG4gICAgdGhpcy5wb2ludHMuZm9yRWFjaChwb2ludCA9PiBwb2ludC5lbmFibGVFZGl0ID0gZmFsc2UpO1xuICB9XG5cbiAgZGlzcG9zZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50cy5nZXQoaWQpO1xuICAgIGlmIChwb2ludC5nZXRDdXJyZW50UG9pbnQoKSkge1xuICAgICAgcG9pbnQuZGlzcG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLnBvaW50cy5kZWxldGUoaWQpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZVBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9pbnRzLmZvckVhY2gocG9pbnQgPT4gcG9pbnQuZGlzcG9zZSgpKTtcbiAgICB0aGlzLnBvaW50cy5jbGVhcigpO1xuICB9XG59XG4iXX0=
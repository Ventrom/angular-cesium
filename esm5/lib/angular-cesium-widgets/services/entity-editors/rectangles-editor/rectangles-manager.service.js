import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { EditableRectangle } from '../../../models/editable-rectangle';
var RectanglesManagerService = /** @class */ (function () {
    function RectanglesManagerService() {
        this.rectangles = new Map();
    }
    RectanglesManagerService.prototype.createEditableRectangle = function (id, editRectanglesLayer, editPointsLayer, coordinateConverter, rectangleOptions, positions) {
        var editableRectangle = new EditableRectangle(id, editPointsLayer, editRectanglesLayer, coordinateConverter, rectangleOptions, positions);
        this.rectangles.set(id, editableRectangle);
    };
    RectanglesManagerService.prototype.dispose = function (id) {
        this.rectangles.get(id).dispose();
        this.rectangles.delete(id);
    };
    RectanglesManagerService.prototype.get = function (id) {
        return this.rectangles.get(id);
    };
    RectanglesManagerService.prototype.clear = function () {
        this.rectangles.forEach(function (rectangle) { return rectangle.dispose(); });
        this.rectangles.clear();
    };
    RectanglesManagerService = __decorate([
        Injectable()
    ], RectanglesManagerService);
    return RectanglesManagerService;
}());
export { RectanglesManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBT3ZFO0lBQUE7UUFDRSxlQUFVLEdBQW1DLElBQUksR0FBRyxFQUE2QixDQUFDO0lBbUNwRixDQUFDO0lBakNDLDBEQUF1QixHQUF2QixVQUNFLEVBQVUsRUFDVixtQkFBcUMsRUFDckMsZUFBaUMsRUFDakMsbUJBQXdDLEVBQ3hDLGdCQUF1QyxFQUN2QyxTQUF3QjtRQUV4QixJQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLENBQzdDLEVBQUUsRUFDRixlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsU0FBUyxDQUNWLENBQUM7UUFFRixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsMENBQU8sR0FBUCxVQUFRLEVBQVU7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHNDQUFHLEdBQUgsVUFBSSxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsd0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBbkNVLHdCQUF3QjtRQURwQyxVQUFVLEVBQUU7T0FDQSx3QkFBd0IsQ0FvQ3BDO0lBQUQsK0JBQUM7Q0FBQSxBQXBDRCxJQW9DQztTQXBDWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0YWJsZVJlY3RhbmdsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1yZWN0YW5nbGUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3JlY3RhbmdsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSB7XG4gIHJlY3RhbmdsZXM6IE1hcDxzdHJpbmcsIEVkaXRhYmxlUmVjdGFuZ2xlPiA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZVJlY3RhbmdsZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZVJlY3RhbmdsZShcbiAgICBpZDogc3RyaW5nLFxuICAgIGVkaXRSZWN0YW5nbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcmVjdGFuZ2xlT3B0aW9ucz86IFJlY3RhbmdsZUVkaXRPcHRpb25zLFxuICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXVxuICApIHtcbiAgICBjb25zdCBlZGl0YWJsZVJlY3RhbmdsZSA9IG5ldyBFZGl0YWJsZVJlY3RhbmdsZShcbiAgICAgIGlkLFxuICAgICAgZWRpdFBvaW50c0xheWVyLFxuICAgICAgZWRpdFJlY3RhbmdsZXNMYXllcixcbiAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICByZWN0YW5nbGVPcHRpb25zLFxuICAgICAgcG9zaXRpb25zXG4gICAgKTtcblxuICAgIHRoaXMucmVjdGFuZ2xlcy5zZXQoaWQsIGVkaXRhYmxlUmVjdGFuZ2xlKTtcbiAgfVxuXG4gIGRpc3Bvc2UoaWQ6IHN0cmluZykge1xuICAgIHRoaXMucmVjdGFuZ2xlcy5nZXQoaWQpLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnJlY3RhbmdsZXMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogRWRpdGFibGVSZWN0YW5nbGUge1xuICAgIHJldHVybiB0aGlzLnJlY3RhbmdsZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucmVjdGFuZ2xlcy5mb3JFYWNoKHJlY3RhbmdsZSA9PiByZWN0YW5nbGUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLnJlY3RhbmdsZXMuY2xlYXIoKTtcbiAgfVxufVxuXG4iXX0=
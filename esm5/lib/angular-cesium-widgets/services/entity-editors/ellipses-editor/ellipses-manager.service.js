import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { EditableEllipse } from '../../../models/editable-ellipse';
var EllipsesManagerService = /** @class */ (function () {
    function EllipsesManagerService() {
        this.ellipses = new Map();
    }
    EllipsesManagerService.prototype.createEditableEllipse = function (id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        var editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    };
    EllipsesManagerService.prototype.dispose = function (id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    };
    EllipsesManagerService.prototype.get = function (id) {
        return this.ellipses.get(id);
    };
    EllipsesManagerService.prototype.clear = function () {
        this.ellipses.forEach(function (ellipse) { return ellipse.dispose(); });
        this.ellipses.clear();
    };
    EllipsesManagerService = __decorate([
        Injectable()
    ], EllipsesManagerService);
    return EllipsesManagerService;
}());
export { EllipsesManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU1uRTtJQUFBO1FBQ1UsYUFBUSxHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO0lBeUJ4RCxDQUFDO0lBdkJDLHNEQUFxQixHQUFyQixVQUFzQixFQUFVLEVBQ1YsaUJBQW1DLEVBQ25DLGVBQWlDLEVBQ2pDLG1CQUF3QyxFQUN4QyxjQUFrQztRQUN0RCxJQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3pILElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN2QyxPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDO0lBRUQsd0NBQU8sR0FBUCxVQUFRLEVBQVU7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELG9DQUFHLEdBQUgsVUFBSSxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBekJVLHNCQUFzQjtRQURsQyxVQUFVLEVBQUU7T0FDQSxzQkFBc0IsQ0EwQmxDO0lBQUQsNkJBQUM7Q0FBQSxBQTFCRCxJQTBCQztTQTFCWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0YWJsZUVsbGlwc2UgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtZWxsaXBzZSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VzTWFuYWdlclNlcnZpY2Uge1xuICBwcml2YXRlIGVsbGlwc2VzID0gbmV3IE1hcDxzdHJpbmcsIEVkaXRhYmxlRWxsaXBzZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZUVsbGlwc2UoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRFbGxpcHNlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbGlwc2VPcHRpb25zOiBFbGxpcHNlRWRpdE9wdGlvbnMpOiBFZGl0YWJsZUVsbGlwc2Uge1xuICAgIGNvbnN0IGVkaXRhYmxlRWxsaXBzZSA9IG5ldyBFZGl0YWJsZUVsbGlwc2UoaWQsIGVkaXRFbGxpcHNlc0xheWVyLCBlZGl0UG9pbnRzTGF5ZXIsIGNvb3JkaW5hdGVDb252ZXJ0ZXIsIGVsbGlwc2VPcHRpb25zKTtcbiAgICB0aGlzLmVsbGlwc2VzLnNldChpZCwgZWRpdGFibGVFbGxpcHNlKTtcbiAgICByZXR1cm4gZWRpdGFibGVFbGxpcHNlO1xuICB9XG5cbiAgZGlzcG9zZShpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5lbGxpcHNlcy5nZXQoaWQpLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmVsbGlwc2VzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlRWxsaXBzZSB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuZWxsaXBzZXMuZm9yRWFjaChlbGxpcHNlID0+IGVsbGlwc2UuZGlzcG9zZSgpKTtcbiAgICB0aGlzLmVsbGlwc2VzLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==
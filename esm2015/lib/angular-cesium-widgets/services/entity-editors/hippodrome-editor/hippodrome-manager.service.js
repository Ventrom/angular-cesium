import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
let HippodromeManagerService = class HippodromeManagerService {
    constructor() {
        this.hippodromes = new Map();
    }
    createEditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        const editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    }
    get(id) {
        return this.hippodromes.get(id);
    }
    clear() {
        this.hippodromes.forEach(hippodrome => hippodrome.dispose());
        this.hippodromes.clear();
    }
};
HippodromeManagerService = __decorate([
    Injectable()
], HippodromeManagerService);
export { HippodromeManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBTXpFLElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBQXJDO1FBQ0UsZ0JBQVcsR0FBb0MsSUFBSSxHQUFHLEVBQThCLENBQUM7SUF1QnZGLENBQUM7SUFyQkMsd0JBQXdCLENBQUMsRUFBVSxFQUFFLG1CQUFxQyxFQUFFLGVBQWlDLEVBQ3BGLG1CQUF3QyxFQUFFLHFCQUE2QyxFQUN2RixTQUF3QjtRQUMvQyxNQUFNLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQy9DLEVBQUUsRUFDRixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsU0FBUyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNCLENBQUM7Q0FDRixDQUFBO0FBeEJZLHdCQUF3QjtJQURwQyxVQUFVLEVBQUU7R0FDQSx3QkFBd0IsQ0F3QnBDO1NBeEJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBFZGl0YWJsZUhpcHBvZHJvbWUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtaGlwcG9kcm9tZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhpcHBvZHJvbWVNYW5hZ2VyU2VydmljZSB7XG4gIGhpcHBvZHJvbWVzOiBNYXA8c3RyaW5nLCBFZGl0YWJsZUhpcHBvZHJvbWU+ID0gbmV3IE1hcDxzdHJpbmcsIEVkaXRhYmxlSGlwcG9kcm9tZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZUhpcHBvZHJvbWUoaWQ6IHN0cmluZywgZWRpdEhpcHBvZHJvbWVMYXllcjogQWNMYXllckNvbXBvbmVudCwgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlciwgaGlwcG9kcm9tZUVkaXRPcHRpb25zPzogSGlwcG9kcm9tZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdKSB7XG4gICAgY29uc3QgZWRpdGFibGVIaXBwb2Ryb21lID0gbmV3IEVkaXRhYmxlSGlwcG9kcm9tZShcbiAgICAgIGlkLFxuICAgICAgZWRpdEhpcHBvZHJvbWVMYXllcixcbiAgICAgIGVkaXRQb2ludHNMYXllcixcbiAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICBoaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgICBwb3NpdGlvbnMpO1xuICAgIHRoaXMuaGlwcG9kcm9tZXMuc2V0KGlkLCBlZGl0YWJsZUhpcHBvZHJvbWUpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZUhpcHBvZHJvbWUge1xuICAgIHJldHVybiB0aGlzLmhpcHBvZHJvbWVzLmdldChpZCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmhpcHBvZHJvbWVzLmZvckVhY2goaGlwcG9kcm9tZSA9PiBoaXBwb2Ryb21lLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5oaXBwb2Ryb21lcy5jbGVhcigpO1xuICB9XG59XG4iXX0=
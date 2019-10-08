/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableEllipse } from '../../../models/editable-ellipse';
export class EllipsesManagerService {
    constructor() {
        this.ellipses = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editEllipsesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?} ellipseOptions
     * @return {?}
     */
    createEditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        /** @type {?} */
        const editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.ellipses.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.ellipses.forEach((/**
         * @param {?} ellipse
         * @return {?}
         */
        ellipse => ellipse.dispose()));
        this.ellipses.clear();
    }
}
EllipsesManagerService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EllipsesManagerService.prototype.ellipses;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU1uRSxNQUFNLE9BQU8sc0JBQXNCO0lBRG5DO1FBRVUsYUFBUSxHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO0lBeUJ4RCxDQUFDOzs7Ozs7Ozs7SUF2QkMscUJBQXFCLENBQUMsRUFBVSxFQUNWLGlCQUFtQyxFQUNuQyxlQUFpQyxFQUNqQyxtQkFBd0MsRUFDeEMsY0FBa0M7O2NBQ2hELGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBQztRQUN4SCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDdkMsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7OztJQUVELEdBQUcsQ0FBQyxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7O0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzs7OztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7WUExQkYsVUFBVTs7Ozs7OztJQUVULDBDQUFzRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRWxsaXBzZXNNYW5hZ2VyU2VydmljZSB7XG4gIHByaXZhdGUgZWxsaXBzZXMgPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVFbGxpcHNlPigpO1xuXG4gIGNyZWF0ZUVkaXRhYmxlRWxsaXBzZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdEVsbGlwc2VzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxsaXBzZU9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyk6IEVkaXRhYmxlRWxsaXBzZSB7XG4gICAgY29uc3QgZWRpdGFibGVFbGxpcHNlID0gbmV3IEVkaXRhYmxlRWxsaXBzZShpZCwgZWRpdEVsbGlwc2VzTGF5ZXIsIGVkaXRQb2ludHNMYXllciwgY29vcmRpbmF0ZUNvbnZlcnRlciwgZWxsaXBzZU9wdGlvbnMpO1xuICAgIHRoaXMuZWxsaXBzZXMuc2V0KGlkLCBlZGl0YWJsZUVsbGlwc2UpO1xuICAgIHJldHVybiBlZGl0YWJsZUVsbGlwc2U7XG4gIH1cblxuICBkaXNwb3NlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmVsbGlwc2VzLmdldChpZCkuZGlzcG9zZSgpO1xuICAgIHRoaXMuZWxsaXBzZXMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogRWRpdGFibGVFbGxpcHNlIHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlcy5nZXQoaWQpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5lbGxpcHNlcy5mb3JFYWNoKGVsbGlwc2UgPT4gZWxsaXBzZS5kaXNwb3NlKCkpO1xuICAgIHRoaXMuZWxsaXBzZXMuY2xlYXIoKTtcbiAgfVxufVxuIl19
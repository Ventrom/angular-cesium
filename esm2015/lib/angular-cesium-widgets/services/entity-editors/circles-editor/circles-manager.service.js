/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableCircle } from '../../../models/editable-circle';
export class CirclesManagerService {
    constructor() {
        this.circles = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editCirclesLayer
     * @param {?} editPointsLayer
     * @param {?} editArcsLayer
     * @param {?} circleOptions
     * @return {?}
     */
    createEditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        /** @type {?} */
        const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.circles.get(id).dispose();
        this.circles.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.circles.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.circles.forEach((/**
         * @param {?} circle
         * @return {?}
         */
        circle => circle.dispose()));
        this.circles.clear();
    }
}
CirclesManagerService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    CirclesManagerService.prototype.circles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUtqRSxNQUFNLE9BQU8scUJBQXFCO0lBRGxDO1FBRVUsWUFBTyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO0lBeUJ0RCxDQUFDOzs7Ozs7Ozs7SUF2QkMsb0JBQW9CLENBQUMsRUFBVSxFQUNWLGdCQUFrQyxFQUNsQyxlQUFpQyxFQUNqQyxhQUErQixFQUMvQixhQUFnQzs7Y0FDN0MsY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQztRQUM5RyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDckMsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDOzs7OztJQUVELEdBQUcsQ0FBQyxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7O0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTzs7OztRQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7WUExQkYsVUFBVTs7Ozs7OztJQUVULHdDQUFvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXQtb3B0aW9ucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDaXJjbGVzTWFuYWdlclNlcnZpY2Uge1xuICBwcml2YXRlIGNpcmNsZXMgPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVDaXJjbGU+KCk7XG5cbiAgY3JlYXRlRWRpdGFibGVDaXJjbGUoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdENpcmNsZXNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0QXJjc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGVPcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyk6IEVkaXRhYmxlQ2lyY2xlIHtcbiAgICBjb25zdCBlZGl0YWJsZUNpcmNsZSA9IG5ldyBFZGl0YWJsZUNpcmNsZShpZCwgZWRpdENpcmNsZXNMYXllciwgZWRpdFBvaW50c0xheWVyLCBlZGl0QXJjc0xheWVyLCBjaXJjbGVPcHRpb25zKTtcbiAgICB0aGlzLmNpcmNsZXMuc2V0KGlkLCBlZGl0YWJsZUNpcmNsZSk7XG4gICAgcmV0dXJuIGVkaXRhYmxlQ2lyY2xlO1xuICB9XG5cbiAgZGlzcG9zZShpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5jaXJjbGVzLmdldChpZCkuZGlzcG9zZSgpO1xuICAgIHRoaXMuY2lyY2xlcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZUNpcmNsZSB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlcy5nZXQoaWQpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5jaXJjbGVzLmZvckVhY2goY2lyY2xlID0+IGNpcmNsZS5kaXNwb3NlKCkpO1xuICAgIHRoaXMuY2lyY2xlcy5jbGVhcigpO1xuICB9XG59XG4iXX0=
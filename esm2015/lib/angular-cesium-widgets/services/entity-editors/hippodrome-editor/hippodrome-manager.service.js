/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
export class HippodromeManagerService {
    constructor() {
        this.hippodromes = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editHippodromeLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} hippodromeEditOptions
     * @param {?=} positions
     * @return {?}
     */
    createEditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        /** @type {?} */
        const editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.hippodromes.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.hippodromes.forEach((/**
         * @param {?} hippodrome
         * @return {?}
         */
        hippodrome => hippodrome.dispose()));
        this.hippodromes.clear();
    }
}
HippodromeManagerService.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    HippodromeManagerService.prototype.hippodromes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBTXpFLE1BQU0sT0FBTyx3QkFBd0I7SUFEckM7UUFFRSxnQkFBVyxHQUFvQyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztJQXVCdkYsQ0FBQzs7Ozs7Ozs7OztJQXJCQyx3QkFBd0IsQ0FBQyxFQUFVLEVBQUUsbUJBQXFDLEVBQUUsZUFBaUMsRUFDcEYsbUJBQXdDLEVBQUUscUJBQTZDLEVBQ3ZGLFNBQXdCOztjQUN6QyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUMvQyxFQUFFLEVBQ0YsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIscUJBQXFCLEVBQ3JCLFNBQVMsQ0FBQztRQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNCLENBQUM7OztZQXhCRixVQUFVOzs7O0lBRVQsK0NBQXFGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlIHtcbiAgaGlwcG9kcm9tZXM6IE1hcDxzdHJpbmcsIEVkaXRhYmxlSGlwcG9kcm9tZT4gPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVIaXBwb2Ryb21lPigpO1xuXG4gIGNyZWF0ZUVkaXRhYmxlSGlwcG9kcm9tZShpZDogc3RyaW5nLCBlZGl0SGlwcG9kcm9tZUxheWVyOiBBY0xheWVyQ29tcG9uZW50LCBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLCBoaXBwb2Ryb21lRWRpdE9wdGlvbnM/OiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBjb25zdCBlZGl0YWJsZUhpcHBvZHJvbWUgPSBuZXcgRWRpdGFibGVIaXBwb2Ryb21lKFxuICAgICAgaWQsXG4gICAgICBlZGl0SGlwcG9kcm9tZUxheWVyLFxuICAgICAgZWRpdFBvaW50c0xheWVyLFxuICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgIGhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICAgIHBvc2l0aW9ucyk7XG4gICAgdGhpcy5oaXBwb2Ryb21lcy5zZXQoaWQsIGVkaXRhYmxlSGlwcG9kcm9tZSk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlSGlwcG9kcm9tZSB7XG4gICAgcmV0dXJuIHRoaXMuaGlwcG9kcm9tZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaGlwcG9kcm9tZXMuZm9yRWFjaChoaXBwb2Ryb21lID0+IGhpcHBvZHJvbWUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLmhpcHBvZHJvbWVzLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==
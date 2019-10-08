/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
var HippodromeManagerService = /** @class */ (function () {
    function HippodromeManagerService() {
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
    HippodromeManagerService.prototype.createEditableHippodrome = /**
     * @param {?} id
     * @param {?} editHippodromeLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} hippodromeEditOptions
     * @param {?=} positions
     * @return {?}
     */
    function (id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        /** @type {?} */
        var editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    HippodromeManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.hippodromes.get(id);
    };
    /**
     * @return {?}
     */
    HippodromeManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.hippodromes.forEach((/**
         * @param {?} hippodrome
         * @return {?}
         */
        function (hippodrome) { return hippodrome.dispose(); }));
        this.hippodromes.clear();
    };
    HippodromeManagerService.decorators = [
        { type: Injectable }
    ];
    return HippodromeManagerService;
}());
export { HippodromeManagerService };
if (false) {
    /** @type {?} */
    HippodromeManagerService.prototype.hippodromes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBS3pFO0lBQUE7UUFFRSxnQkFBVyxHQUFvQyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztJQXVCdkYsQ0FBQzs7Ozs7Ozs7OztJQXJCQywyREFBd0I7Ozs7Ozs7OztJQUF4QixVQUF5QixFQUFVLEVBQUUsbUJBQXFDLEVBQUUsZUFBaUMsRUFDcEYsbUJBQXdDLEVBQUUscUJBQTZDLEVBQ3ZGLFNBQXdCOztZQUN6QyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUMvQyxFQUFFLEVBQ0YsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIscUJBQXFCLEVBQ3JCLFNBQVMsQ0FBQztRQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBRUQsc0NBQUc7Ozs7SUFBSCxVQUFJLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Ozs7SUFFRCx3Q0FBSzs7O0lBQUw7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLFVBQVUsSUFBSSxPQUFBLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBcEIsQ0FBb0IsRUFBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Z0JBeEJGLFVBQVU7O0lBeUJYLCtCQUFDO0NBQUEsQUF6QkQsSUF5QkM7U0F4Qlksd0JBQXdCOzs7SUFDbkMsK0NBQXFGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlIHtcbiAgaGlwcG9kcm9tZXM6IE1hcDxzdHJpbmcsIEVkaXRhYmxlSGlwcG9kcm9tZT4gPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVIaXBwb2Ryb21lPigpO1xuXG4gIGNyZWF0ZUVkaXRhYmxlSGlwcG9kcm9tZShpZDogc3RyaW5nLCBlZGl0SGlwcG9kcm9tZUxheWVyOiBBY0xheWVyQ29tcG9uZW50LCBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLCBoaXBwb2Ryb21lRWRpdE9wdGlvbnM/OiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBjb25zdCBlZGl0YWJsZUhpcHBvZHJvbWUgPSBuZXcgRWRpdGFibGVIaXBwb2Ryb21lKFxuICAgICAgaWQsXG4gICAgICBlZGl0SGlwcG9kcm9tZUxheWVyLFxuICAgICAgZWRpdFBvaW50c0xheWVyLFxuICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgIGhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICAgIHBvc2l0aW9ucyk7XG4gICAgdGhpcy5oaXBwb2Ryb21lcy5zZXQoaWQsIGVkaXRhYmxlSGlwcG9kcm9tZSk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlSGlwcG9kcm9tZSB7XG4gICAgcmV0dXJuIHRoaXMuaGlwcG9kcm9tZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuaGlwcG9kcm9tZXMuZm9yRWFjaChoaXBwb2Ryb21lID0+IGhpcHBvZHJvbWUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLmhpcHBvZHJvbWVzLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==
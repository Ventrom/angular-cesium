/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditablePolygon } from '../../../models/editable-polygon';
var PolygonsManagerService = /** @class */ (function () {
    function PolygonsManagerService() {
        this.polygons = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editPolygonsLayer
     * @param {?} editPointsLayer
     * @param {?} editPolylinesLayer
     * @param {?} coordinateConverter
     * @param {?=} polygonOptions
     * @param {?=} positions
     * @return {?}
     */
    PolygonsManagerService.prototype.createEditablePolygon = /**
     * @param {?} id
     * @param {?} editPolygonsLayer
     * @param {?} editPointsLayer
     * @param {?} editPolylinesLayer
     * @param {?} coordinateConverter
     * @param {?=} polygonOptions
     * @param {?=} positions
     * @return {?}
     */
    function (id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        /** @type {?} */
        var editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    PolygonsManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    PolygonsManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.polygons.get(id);
    };
    /**
     * @return {?}
     */
    PolygonsManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.polygons.forEach((/**
         * @param {?} polygon
         * @return {?}
         */
        function (polygon) { return polygon.dispose(); }));
        this.polygons.clear();
    };
    PolygonsManagerService.decorators = [
        { type: Injectable }
    ];
    return PolygonsManagerService;
}());
export { PolygonsManagerService };
if (false) {
    /** @type {?} */
    PolygonsManagerService.prototype.polygons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU1uRTtJQUFBO1FBRUUsYUFBUSxHQUFpQyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztJQThCOUUsQ0FBQzs7Ozs7Ozs7Ozs7SUE1QkMsc0RBQXFCOzs7Ozs7Ozs7O0lBQXJCLFVBQXNCLEVBQVUsRUFBRSxpQkFBbUMsRUFBRSxlQUFpQyxFQUNsRixrQkFBb0MsRUFBRSxtQkFBd0MsRUFDOUUsY0FBbUMsRUFBRSxTQUF3Qjs7WUFDM0UsZUFBZSxHQUFHLElBQUksZUFBZSxDQUN6QyxFQUFFLEVBQ0YsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsbUJBQW1CLEVBQ25CLGNBQWMsRUFDZCxTQUFTLENBQUM7UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUNwQyxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFRCx3Q0FBTzs7OztJQUFQLFVBQVEsRUFBVTtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7OztJQUVELG9DQUFHOzs7O0lBQUgsVUFBSSxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7O0lBRUQsc0NBQUs7OztJQUFMO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQWpCLENBQWlCLEVBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7O2dCQS9CRixVQUFVOztJQWdDWCw2QkFBQztDQUFBLEFBaENELElBZ0NDO1NBL0JZLHNCQUFzQjs7O0lBQ2pDLDBDQUE0RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRhYmxlUG9seWdvbiB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1wb2x5Z29uJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlnb25zTWFuYWdlclNlcnZpY2Uge1xuICBwb2x5Z29uczogTWFwPHN0cmluZywgRWRpdGFibGVQb2x5Z29uPiA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZVBvbHlnb24+KCk7XG5cbiAgY3JlYXRlRWRpdGFibGVQb2x5Z29uKGlkOiBzdHJpbmcsIGVkaXRQb2x5Z29uc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LCBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9seWxpbmVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uT3B0aW9ucz86IFBvbHlnb25FZGl0T3B0aW9ucywgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdKSB7XG4gICAgY29uc3QgZWRpdGFibGVQb2x5Z29uID0gbmV3IEVkaXRhYmxlUG9seWdvbihcbiAgICAgIGlkLFxuICAgICAgZWRpdFBvbHlnb25zTGF5ZXIsXG4gICAgICBlZGl0UG9pbnRzTGF5ZXIsXG4gICAgICBlZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICBjb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgcG9seWdvbk9wdGlvbnMsXG4gICAgICBwb3NpdGlvbnMpO1xuICAgIHRoaXMucG9seWdvbnMuc2V0KGlkLCBlZGl0YWJsZVBvbHlnb25cbiAgICApO1xuICB9XG5cbiAgZGlzcG9zZShpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5wb2x5Z29ucy5nZXQoaWQpLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnBvbHlnb25zLmRlbGV0ZShpZCk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlUG9seWdvbiB7XG4gICAgcmV0dXJuIHRoaXMucG9seWdvbnMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9seWdvbnMuZm9yRWFjaChwb2x5Z29uID0+IHBvbHlnb24uZGlzcG9zZSgpKTtcbiAgICB0aGlzLnBvbHlnb25zLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==
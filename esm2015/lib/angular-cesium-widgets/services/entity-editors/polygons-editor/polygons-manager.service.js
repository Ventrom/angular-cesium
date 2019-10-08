/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditablePolygon } from '../../../models/editable-polygon';
export class PolygonsManagerService {
    constructor() {
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
    createEditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        /** @type {?} */
        const editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.polygons.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.polygons.forEach((/**
         * @param {?} polygon
         * @return {?}
         */
        polygon => polygon.dispose()));
        this.polygons.clear();
    }
}
PolygonsManagerService.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    PolygonsManagerService.prototype.polygons;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQU9uRSxNQUFNLE9BQU8sc0JBQXNCO0lBRG5DO1FBRUUsYUFBUSxHQUFpQyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztJQThCOUUsQ0FBQzs7Ozs7Ozs7Ozs7SUE1QkMscUJBQXFCLENBQUMsRUFBVSxFQUFFLGlCQUFtQyxFQUFFLGVBQWlDLEVBQ2xGLGtCQUFvQyxFQUFFLG1CQUF3QyxFQUM5RSxjQUFtQyxFQUFFLFNBQXdCOztjQUMzRSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQ3pDLEVBQUUsRUFDRixpQkFBaUIsRUFDakIsZUFBZSxFQUNmLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIsY0FBYyxFQUNkLFNBQVMsQ0FBQztRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQ3BDLENBQUM7SUFDSixDQUFDOzs7OztJQUVELE9BQU8sQ0FBQyxFQUFVO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7O0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7OztZQS9CRixVQUFVOzs7O0lBRVQsMENBQTRFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2x5Z29uIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24nO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlnb25FZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5Z29uLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWdvbnNNYW5hZ2VyU2VydmljZSB7XG4gIHBvbHlnb25zOiBNYXA8c3RyaW5nLCBFZGl0YWJsZVBvbHlnb24+ID0gbmV3IE1hcDxzdHJpbmcsIEVkaXRhYmxlUG9seWdvbj4oKTtcblxuICBjcmVhdGVFZGl0YWJsZVBvbHlnb24oaWQ6IHN0cmluZywgZWRpdFBvbHlnb25zTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRQb2x5bGluZXNMYXllcjogQWNMYXllckNvbXBvbmVudCwgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25PcHRpb25zPzogUG9seWdvbkVkaXRPcHRpb25zLCBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBjb25zdCBlZGl0YWJsZVBvbHlnb24gPSBuZXcgRWRpdGFibGVQb2x5Z29uKFxuICAgICAgaWQsXG4gICAgICBlZGl0UG9seWdvbnNMYXllcixcbiAgICAgIGVkaXRQb2ludHNMYXllcixcbiAgICAgIGVkaXRQb2x5bGluZXNMYXllcixcbiAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICBwb2x5Z29uT3B0aW9ucyxcbiAgICAgIHBvc2l0aW9ucyk7XG4gICAgdGhpcy5wb2x5Z29ucy5zZXQoaWQsIGVkaXRhYmxlUG9seWdvblxuICAgICk7XG4gIH1cblxuICBkaXNwb3NlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBvbHlnb25zLmdldChpZCkuZGlzcG9zZSgpO1xuICAgIHRoaXMucG9seWdvbnMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogRWRpdGFibGVQb2x5Z29uIHtcbiAgICByZXR1cm4gdGhpcy5wb2x5Z29ucy5nZXQoaWQpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5wb2x5Z29ucy5mb3JFYWNoKHBvbHlnb24gPT4gcG9seWdvbi5kaXNwb3NlKCkpO1xuICAgIHRoaXMucG9seWdvbnMuY2xlYXIoKTtcbiAgfVxufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableEllipse } from '../../../models/editable-ellipse';
var EllipsesManagerService = /** @class */ (function () {
    function EllipsesManagerService() {
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
    EllipsesManagerService.prototype.createEditableEllipse = /**
     * @param {?} id
     * @param {?} editEllipsesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?} ellipseOptions
     * @return {?}
     */
    function (id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        /** @type {?} */
        var editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    EllipsesManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    EllipsesManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipses.get(id);
    };
    /**
     * @return {?}
     */
    EllipsesManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.ellipses.forEach((/**
         * @param {?} ellipse
         * @return {?}
         */
        function (ellipse) { return ellipse.dispose(); }));
        this.ellipses.clear();
    };
    EllipsesManagerService.decorators = [
        { type: Injectable }
    ];
    return EllipsesManagerService;
}());
export { EllipsesManagerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EllipsesManagerService.prototype.ellipses;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtuRTtJQUFBO1FBRVUsYUFBUSxHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO0lBeUJ4RCxDQUFDOzs7Ozs7Ozs7SUF2QkMsc0RBQXFCOzs7Ozs7OztJQUFyQixVQUFzQixFQUFVLEVBQ1YsaUJBQW1DLEVBQ25DLGVBQWlDLEVBQ2pDLG1CQUF3QyxFQUN4QyxjQUFrQzs7WUFDaEQsZUFBZSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxDQUFDO1FBQ3hILElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN2QyxPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDOzs7OztJQUVELHdDQUFPOzs7O0lBQVAsVUFBUSxFQUFVO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7O0lBRUQsb0NBQUc7Ozs7SUFBSCxVQUFJLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxzQ0FBSzs7O0lBQUw7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBakIsQ0FBaUIsRUFBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Z0JBMUJGLFVBQVU7O0lBMkJYLDZCQUFDO0NBQUEsQUEzQkQsSUEyQkM7U0ExQlksc0JBQXNCOzs7Ozs7SUFDakMsMENBQXNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRWRpdGFibGVFbGxpcHNlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWVsbGlwc2UnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBlbGxpcHNlcyA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZUVsbGlwc2U+KCk7XG5cbiAgY3JlYXRlRWRpdGFibGVFbGxpcHNlKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0RWxsaXBzZXNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGxpcHNlT3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zKTogRWRpdGFibGVFbGxpcHNlIHtcbiAgICBjb25zdCBlZGl0YWJsZUVsbGlwc2UgPSBuZXcgRWRpdGFibGVFbGxpcHNlKGlkLCBlZGl0RWxsaXBzZXNMYXllciwgZWRpdFBvaW50c0xheWVyLCBjb29yZGluYXRlQ29udmVydGVyLCBlbGxpcHNlT3B0aW9ucyk7XG4gICAgdGhpcy5lbGxpcHNlcy5zZXQoaWQsIGVkaXRhYmxlRWxsaXBzZSk7XG4gICAgcmV0dXJuIGVkaXRhYmxlRWxsaXBzZTtcbiAgfVxuXG4gIGRpc3Bvc2UoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuZWxsaXBzZXMuZ2V0KGlkKS5kaXNwb3NlKCk7XG4gICAgdGhpcy5lbGxpcHNlcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZUVsbGlwc2Uge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzLmdldChpZCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmVsbGlwc2VzLmZvckVhY2goZWxsaXBzZSA9PiBlbGxpcHNlLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5lbGxpcHNlcy5jbGVhcigpO1xuICB9XG59XG4iXX0=
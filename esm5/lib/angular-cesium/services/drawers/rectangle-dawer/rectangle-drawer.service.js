import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing rectangles.
 */
var RectangleDrawerService = /** @class */ (function (_super) {
    __extends(RectangleDrawerService, _super);
    function RectangleDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.rectangle) || this;
    }
    RectangleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    RectangleDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], RectangleDrawerService);
    return RectangleDrawerService;
}(EntitiesDrawerService));
export { RectangleDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFM0U7O0dBRUc7QUFFSDtJQUE0QywwQ0FBcUI7SUFDL0QsZ0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLHNCQUFzQjtRQURsQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0Isc0JBQXNCLENBSWxDO0lBQUQsNkJBQUM7Q0FBQSxBQUpELENBQTRDLHFCQUFxQixHQUloRTtTQUpZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyByZWN0YW5nbGVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUucmVjdGFuZ2xlKTtcbiAgfVxufVxuIl19
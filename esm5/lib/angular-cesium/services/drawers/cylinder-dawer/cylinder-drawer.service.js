import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing cylinders.
 */
var CylinderDrawerService = /** @class */ (function (_super) {
    __extends(CylinderDrawerService, _super);
    function CylinderDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.cylinder) || this;
    }
    CylinderDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CylinderDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CylinderDrawerService);
    return CylinderDrawerService;
}(EntitiesDrawerService));
export { CylinderDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lsaW5kZXItZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFM0U7O0dBRUc7QUFFSDtJQUEyQyx5Q0FBcUI7SUFDOUQsK0JBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDN0MsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLHFCQUFxQjtRQURqQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IscUJBQXFCLENBSWpDO0lBQUQsNEJBQUM7Q0FBQSxBQUpELENBQTJDLHFCQUFxQixHQUkvRDtTQUpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBjeWxpbmRlcnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDeWxpbmRlckRyYXdlclNlcnZpY2UgZXh0ZW5kcyBFbnRpdGllc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoY2VzaXVtU2VydmljZSwgR3JhcGhpY3NUeXBlLmN5bGluZGVyKTtcbiAgfVxufVxuIl19
import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing corridors .
 */
var CorridorDrawerService = /** @class */ (function (_super) {
    __extends(CorridorDrawerService, _super);
    function CorridorDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.corridor) || this;
    }
    CorridorDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CorridorDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CorridorDrawerService);
    return CorridorDrawerService;
}(EntitiesDrawerService));
export { CorridorDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmlkb3ItZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2NvcnJpZG9yLWRhd2VyL2NvcnJpZG9yLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFM0U7O0dBRUc7QUFFSDtJQUEyQyx5Q0FBcUI7SUFDOUQsK0JBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDN0MsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLHFCQUFxQjtRQURqQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IscUJBQXFCLENBSWpDO0lBQUQsNEJBQUM7Q0FBQSxBQUpELENBQTJDLHFCQUFxQixHQUkvRDtTQUpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBjb3JyaWRvcnMgLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5jb3JyaWRvcik7XG4gIH1cbn1cbiJdfQ==
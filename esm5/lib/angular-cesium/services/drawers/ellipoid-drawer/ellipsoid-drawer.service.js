import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
var EllipsoidDrawerService = /** @class */ (function (_super) {
    __extends(EllipsoidDrawerService, _super);
    function EllipsoidDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipsoid) || this;
    }
    EllipsoidDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    EllipsoidDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], EllipsoidDrawerService);
    return EllipsoidDrawerService;
}(EntitiesDrawerService));
export { EllipsoidDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbGxpcG9pZC1kcmF3ZXIvZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFM0U7O0dBRUc7QUFFSDtJQUE0QywwQ0FBcUI7SUFDL0QsZ0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLHNCQUFzQjtRQURsQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0Isc0JBQXNCLENBSWxDO0lBQUQsNkJBQUM7Q0FBQSxBQUpELENBQTRDLHFCQUFxQixHQUloRTtTQUpZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBlbGxpcHNvaWQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5lbGxpcHNvaWQpO1xuICB9XG59XG4iXX0=
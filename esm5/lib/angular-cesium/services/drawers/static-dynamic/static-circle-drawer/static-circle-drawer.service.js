import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
var StaticCircleDrawerService = /** @class */ (function (_super) {
    __extends(StaticCircleDrawerService, _super);
    function StaticCircleDrawerService(cesiumService) {
        return _super.call(this, Cesium.CircleGeometry, cesiumService) || this;
    }
    StaticCircleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticCircleDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticCircleDrawerService);
    return StaticCircleDrawerService;
}(StaticPrimitiveDrawer));
export { StaticCircleDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFFbkc7O0dBRUc7QUFFSDtJQUErQyw2Q0FBcUI7SUFDbEUsbUNBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUM7SUFDN0MsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLHlCQUF5QjtRQURyQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IseUJBQXlCLENBSXJDO0lBQUQsZ0NBQUM7Q0FBQSxBQUpELENBQStDLHFCQUFxQixHQUluRTtTQUpZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgc3RhdGljIHZlcnNpb24gb2YgdGhlIGNpcmNsZSBjb21wb25lbnQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5DaXJjbGVHZW9tZXRyeSwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==
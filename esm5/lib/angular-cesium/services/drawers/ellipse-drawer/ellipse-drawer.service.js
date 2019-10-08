/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing ellipses.
 */
var EllipseDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(EllipseDrawerService, _super);
    function EllipseDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipse, {
            collectionsNumber: 10,
            collectionMaxSize: 450,
            collectionSuspensionTime: 100
        }) || this;
    }
    EllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return EllipseDrawerService;
}(EntitiesDrawerService));
export { EllipseDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQzs7OztBQUszRTtJQUMwQyxnREFBcUI7SUFDN0QsOEJBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDekMsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLHdCQUF3QixFQUFFLEdBQUc7U0FDOUIsQ0FBQztJQUNKLENBQUM7O2dCQVJGLFVBQVU7Ozs7Z0JBTkYsYUFBYTs7SUFldEIsMkJBQUM7Q0FBQSxBQVRELENBQzBDLHFCQUFxQixHQVE5RDtTQVJZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBlbGxpcHNlcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5lbGxpcHNlLCB7XG4gICAgICBjb2xsZWN0aW9uc051bWJlcjogMTAsXG4gICAgICBjb2xsZWN0aW9uTWF4U2l6ZTogNDUwLFxuICAgICAgY29sbGVjdGlvblN1c3BlbnNpb25UaW1lOiAxMDBcbiAgICB9KTtcbiAgfVxufVxuIl19
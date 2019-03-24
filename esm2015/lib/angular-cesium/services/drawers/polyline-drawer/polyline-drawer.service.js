/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible of drawing polylines.
 */
export class PolylineDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polyline);
    }
}
PolylineDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolylineDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBTTNFLE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxxQkFBcUI7Ozs7SUFDOUQsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDOzs7WUFKRixVQUFVOzs7O1lBUEYsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudGl0aWVzLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHBvbHlsaW5lcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUucG9seWxpbmUpO1xuICB9XG59XG4iXX0=
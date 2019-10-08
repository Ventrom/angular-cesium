/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing ellipses.
 */
export class EllipseDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.ellipse, {
            collectionsNumber: 10,
            collectionMaxSize: 450,
            collectionSuspensionTime: 100
        });
    }
}
EllipseDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EllipseDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBTTNFLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxxQkFBcUI7Ozs7SUFDN0QsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDekMsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixpQkFBaUIsRUFBRSxHQUFHO1lBQ3RCLHdCQUF3QixFQUFFLEdBQUc7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBUkYsVUFBVTs7OztZQU5GLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgZWxsaXBzZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbGxpcHNlRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUuZWxsaXBzZSwge1xuICAgICAgY29sbGVjdGlvbnNOdW1iZXI6IDEwLFxuICAgICAgY29sbGVjdGlvbk1heFNpemU6IDQ1MCxcbiAgICAgIGNvbGxlY3Rpb25TdXNwZW5zaW9uVGltZTogMTAwXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
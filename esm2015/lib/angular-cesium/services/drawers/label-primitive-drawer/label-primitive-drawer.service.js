/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
export class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.LabelCollection, cesiumService);
    }
}
LabelPrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
LabelPrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1wcmltaXRpdmUtZHJhd2VyL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7Ozs7O0FBT3pGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSx1QkFBdUI7Ozs7SUFDdEUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7WUFKRixVQUFVOzs7O1lBUEYsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgbGFiZWxzIGFzIHByaW1pdGl2ZXMuXG4gKiAgVGhpcyBkcmF3ZXIgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBMYWJlbERyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgbGFiZWxzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkxhYmVsQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==
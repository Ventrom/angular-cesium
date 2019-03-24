/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
export class AcPrimitivePolylineComponent extends EntityOnMapComponent {
    /**
     * @param {?} polylineDrawer
     * @param {?} mapLayers
     */
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPrimitivePolylineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-primitive-polyline',
                template: ''
            }] }
];
/** @nocollapse */
AcPrimitivePolylineComponent.ctorParameters = () => [
    { type: PolylinePrimitiveDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcHJpbWl0aXZlLXBvbHlsaW5lL2FjLXByaW1pdGl2ZS1wb2x5bGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDaEYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCcEksTUFBTSxPQUFPLDRCQUE2QixTQUFRLG9CQUFvQjs7Ozs7SUFFcEUsWUFBWSxjQUE4QyxFQUFFLFNBQTJCO1FBQ3JGLEtBQUssQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7O1lBUkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFFBQVEsRUFBRSxFQUFFO2FBQ2I7Ozs7WUF2QlEsOEJBQThCO1lBRDlCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvbHlsaW5lIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgUG9seWxpbmUgUHJpbWl0aXZlOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9seWxpbmUuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLXBvbHlsaW5lIFtwcm9wc109XCJ7XG4gKiAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gKiAgICB0ZXh0OiAnbGFiZWxUZXh0JyxcbiAqICAgIGZvbnQ6ICczMHB4IHNhbnMtc2VyaWYnXG4gKiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLkdSRUVOXG4gKiAgfVwiPjtcbiAqICA8L2FjLXBvbHlsaW5lPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXByaW1pdGl2ZS1wb2x5bGluZScsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNQcmltaXRpdmVQb2x5bGluZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwb2x5bGluZURyYXdlcjogUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihwb2x5bGluZURyYXdlciwgbWFwTGF5ZXJzKTtcbiAgfVxufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
export class AcLabelComponent extends EntityOnMapComponent {
    /**
     * @param {?} labelDrawer
     * @param {?} mapLayers
     */
    constructor(labelDrawer, mapLayers) {
        super(labelDrawer, mapLayers);
    }
}
AcLabelComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-label',
                template: ''
            }] }
];
/** @nocollapse */
AcLabelComponent.ctorParameters = () => [
    { type: LabelDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYWJlbC9hYy1sYWJlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QmhGLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxvQkFBb0I7Ozs7O0lBRXhELFlBQVksV0FBK0IsRUFBRSxTQUEyQjtRQUN0RSxLQUFLLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQXpCUSxrQkFBa0I7WUFDbEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGFiZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1kcmF3ZXIvbGFiZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGxhYmVsIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBMYWJlbEdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0xhYmVsR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLWxhYmVsIFtwcm9wc109XCJ7XG4gKiAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gKiAgICB0ZXh0OiAnbGFiZWxUZXh0JyxcbiAqICAgIGZvbnQ6ICczMHB4IHNhbnMtc2VyaWYnLFxuICogICAgZmlsbENvbG9yIDogYXF1YW1hcmluZVxuICogIH1cIj5cbiAqICA8L2FjLWxhYmVsPjtcbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1sYWJlbCcsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNMYWJlbENvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihsYWJlbERyYXdlcjogTGFiZWxEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihsYWJlbERyYXdlciwgbWFwTGF5ZXJzKTtcbiAgfVxufVxuIl19
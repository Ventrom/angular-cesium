/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
export class AcCzmlDescComponent extends BasicDesc {
    /**
     * @param {?} czmlDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcCzmlDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-czml-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcCzmlDescComponent.ctorParameters = () => [
    { type: CzmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY3ptbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtY3ptbC1kZXNjL2FjLWN6bWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQzNGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCbEYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFNBQVM7Ozs7Ozs7SUFDaEQsWUFBWSxVQUE2QixFQUFFLFlBQTBCLEVBQ3pELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQTlCUSxpQkFBaUI7WUFDakIsWUFBWTtZQUZaLGdCQUFnQjtZQURoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBjem1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1jem1sLWRlc2MgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqXG4gKiAgU2VlIENaTUwgR3VpZGUgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgcHJvcHMuY3ptbFBhY2tldDpcbiAqICArIGh0dHBzOi8vZ2l0aHViLmNvbS9BbmFseXRpY2FsR3JhcGhpY3NJbmMvY3ptbC13cml0ZXIvd2lraS9DWk1MLVN0cnVjdHVyZVxuICpcbiAqICBBdHRlbnRpb246IHRoZSBmaXJzdCBjem1sUGFja2V0IGluIHRoZSBzdHJlYW0gbmVlZHMgdG8gYmUgYSBkb2N1bWVudFxuICogIHdpdGggYW4gaWQgYW5kIGEgbmFtZSBhdHRyaWJ1dGUuIFNlZSB0aGlzIGV4YW1wbGVcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9BcHBzL1NhbmRjYXN0bGUvaW5kZXguaHRtbD9zcmM9Q1pNTCUyMFBvaW50JTIwLSUyMFRpbWUlMjBEeW5hbWljLmh0bWwmbGFiZWw9Q1pNTFxuICpcbiAqICBUbyBzZWUgYSB3b3JraW5nIGV4YW1wbGUsIHVzZSB0aGUgZGVtbyBhcHAgYW5kXG4gKiAgKyB1bmNvbW1lbnQgPGN6bWwtbGF5ZXI+PC9jem1sLWxheWVyPiBpbiBkZW1vLW1hcC5jb21wb25lbnQuaHRtbFxuICogICsgc2V0IHRoZSBwcm9wZXJ0aWVzICd0aW1lbGluZScsICdhbmltYXRpb24nIGFuZCAnc2hvdWxkQW5pbWF0ZScgdHJ1ZSBpbiB2aWV3ZXJPcHRpb25zIG9mIGRlbW8tbWFwLmNvbXBvbmVudC50c1xuICpcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICAgPGFjLWN6bWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgY3ptbFBhY2tldDogY3ptbFBhY2tldFxuICogICAgfVwiPlxuICogICAgPC9hYy1jem1sLWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWN6bWwtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNDem1sRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yKGN6bWxEcmF3ZXI6IEN6bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGN6bWxEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuXG59XG4iXX0=
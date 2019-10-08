/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-point-desc props="{
 *     pixelSize : point.pixelSize, //optional
 *     position : point.positions,
 *     color : point.color  //optional
 *   }">
 *   </ac-point-desc>
 *  ```
 */
var AcPointDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcPointDescComponent, _super);
    function AcPointDescComponent(pointDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-point-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPointDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPointDescComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPointDescComponent;
}(BasicDesc));
export { AcPointDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9pbnQtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvaW50LWRlc2MvYWMtcG9pbnQtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQjlGO0lBSzBDLGdEQUFTO0lBRWpELDhCQUFZLGtCQUFzQyxFQUFFLFlBQTBCLEVBQ2xFLGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDN0UsQ0FBQzs7Z0JBVkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVU7Ozs0QkFBQyxjQUFNLE9BQUEsb0JBQW9CLEVBQXBCLENBQW9CLEVBQUMsRUFBQyxDQUFDO2lCQUN2Rjs7OztnQkF6QlEsa0JBQWtCO2dCQURsQixZQUFZO2dCQUVaLGdCQUFnQjtnQkFDaEIsZ0JBQWdCOztJQThCekIsMkJBQUM7Q0FBQSxBQVhELENBSzBDLFNBQVMsR0FNbEQ7U0FOWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvaW50IGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIFBvaW50R3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9pbnRHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgPGFjLXBvaW50LWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgcGl4ZWxTaXplIDogcG9pbnQucGl4ZWxTaXplLCAvL29wdGlvbmFsXG4gKiAgICAgcG9zaXRpb24gOiBwb2ludC5wb3NpdGlvbnMsXG4gKiAgICAgY29sb3IgOiBwb2ludC5jb2xvciAgLy9vcHRpb25hbFxuICogICB9XCI+XG4gKiAgIDwvYWMtcG9pbnQtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtcG9pbnQtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNQb2ludERlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjUG9pbnREZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3Rvcihwb2ludERyYXdlclNlcnZpY2U6IFBvaW50RHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihwb2ludERyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==
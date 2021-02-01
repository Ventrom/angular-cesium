import { __decorate, __extends, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { LabelPrimitiveDrawerService } from '../../services/drawers/label-primitive-drawer/label-primitive-drawer.service';
/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-primitive-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-primitive-desc>
 *  ```
 */
var AcLabelPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcLabelPrimitiveDescComponent, _super);
    function AcLabelPrimitiveDescComponent(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelPrimitiveDescComponent_1 = AcLabelPrimitiveDescComponent;
    var AcLabelPrimitiveDescComponent_1;
    AcLabelPrimitiveDescComponent.ctorParameters = function () { return [
        { type: LabelPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcLabelPrimitiveDescComponent = AcLabelPrimitiveDescComponent_1 = __decorate([
        Component({
            selector: 'ac-label-primitive-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcLabelPrimitiveDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [LabelPrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcLabelPrimitiveDescComponent);
    return AcLabelPrimitiveDescComponent;
}(BasicDesc));
export { AcLabelPrimitiveDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYy9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sOEVBQThFLENBQUM7QUFFM0g7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFPSDtJQUFtRCxpREFBUztJQUUxRCx1Q0FBWSxvQkFBaUQsRUFBRSxZQUEwQixFQUM3RSxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sb0JBQW9CLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQy9FLENBQUM7c0NBTFUsNkJBQTZCOzs7Z0JBRU4sMkJBQTJCO2dCQUFnQixZQUFZO2dCQUMzRCxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFIdkUsNkJBQTZCO1FBTHpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsK0JBQTZCLEVBQTdCLENBQTZCLENBQUMsRUFBQyxDQUFDO1NBQ2hHLENBQUM7eUNBR2tDLDJCQUEyQixFQUFnQixZQUFZO1lBQzNELGdCQUFnQixFQUFvQixnQkFBZ0I7T0FIdkUsNkJBQTZCLENBTXpDO0lBQUQsb0NBQUM7Q0FBQSxBQU5ELENBQW1ELFNBQVMsR0FNM0Q7U0FOWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci9sYWJlbC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgbGFiZWwgcHJpbWl0aXZlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0xhYmVsLmh0bWxcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICBwaXhlbE9mZnNldCA6IFstMTUsMjBdIHwgcGl4ZWxPZmZzZXQsXG4gKiAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXG4gKiAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY0xhYmVsUHJpbWl0aXZlRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNMYWJlbFByaW1pdGl2ZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGxhYmVsUHJpbWl0aXZlRHJhd2VyOiBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIobGFiZWxQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==
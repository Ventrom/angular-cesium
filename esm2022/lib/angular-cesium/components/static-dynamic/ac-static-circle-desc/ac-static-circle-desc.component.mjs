import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
export class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcStaticCircleDescComponent, deps: [{ token: i1.StaticCircleDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcStaticCircleDescComponent, selector: "ac-static-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcStaticCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-circle',
                    template: ''
                }]
        }], ctorParameters: () => [{ type: i1.StaticCircleDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MvYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDOzs7Ozs7QUFHdEg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFLSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsd0JBQXdCO0lBQ3ZFLFlBQVksa0JBQTZDLEVBQUUsWUFBMEIsRUFDekUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RSxDQUFDOzhHQUpVLDJCQUEyQjtrR0FBM0IsMkJBQTJCLCtFQUY1QixFQUFFOzsyRkFFRCwyQkFBMkI7a0JBSnZDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1jaXJjbGUtZHJhd2VyL3N0YXRpYy1jaXJjbGUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1jaXJjbGUtZGVzY1xuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYW4gY2lyY2xlLlxuICogIF9fdXNhZ2U6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1zdGF0aWMtY2lyY2xlLWRlc2NcbiAqICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogY2lyY2xlLmdlb21ldHJ5LmNlbnRlcixcbiAqICAgICAgICAgIHJhZGl1czogY2lyY2xlLmdlb21ldHJ5LnJhZGl1cyxcbiAqICAgICAgfVwiXG4gKiAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhdHRyaWJ1dGVzOiBjaXJjbGUuYXR0cmlidXRlcyAvL09wdGlvbmFsXG4gKiAgICAgIH1cIlxuICogICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgIGFwcGVhcmFuY2U6IGNpcmNsZS5hcHBlYXJhbmNlIC8vT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICAgJmx0Oy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MmZ3Q7XG4gKiAgICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLWNpcmNsZScsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY0NpcmNsZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2Mge1xuICBjb25zdHJ1Y3RvcihzdGF0aWNDaXJjbGVEcmF3ZXI6IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoc3RhdGljQ2lyY2xlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=
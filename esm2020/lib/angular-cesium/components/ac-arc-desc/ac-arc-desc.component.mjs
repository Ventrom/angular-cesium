import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-layer element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc props="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius,
 *          color : arc.color - The color should be Cesium.Color type
 *    }">
 *    </ac-arc-desc>
 *    ```
 *
 *    description of the props :
 *    center - The arc is a section of an outline of a circle, This is the center of the circle
 *    angle - the initial angle of the arc in radians
 *    delta - the spreading of the arc,
 *    radius - the distance from the center to the arc
 *
 *    for example :
 *    angle - 0
 *    delta - π
 *
 *    will draw an half circle
 */
export class AcArcDescComponent extends BasicDesc {
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcArcDescComponent, deps: [{ token: i1.ArcDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcArcDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcArcDescComponent, selector: "ac-arc-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcArcDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: i1.ArcDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFyYy1kZXNjL2FjLWFyYy1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUt0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQUV6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQU9ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxTQUFTO0lBRS9DLFlBQVksU0FBMkIsRUFBRSxZQUEwQixFQUN2RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNyRSxDQUFDOztnSEFMVSxrQkFBa0I7b0dBQWxCLGtCQUFrQixzQ0FGbEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsaURBRDFFLEVBQUU7NEZBR0Qsa0JBQWtCO2tCQUw5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsRUFBQyxDQUFDO2lCQUNyRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGFuIGFyYy5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBBbiBhcmMgaXMgbm90IGNlc2l1bSBuYXRpdmVseSBpbXBsZW1lbnRlZCBhbmQgdGhlcmVmb3JlIGl0J3MgQVBJIGRvZXNuJ3QgYXBwZWFyIGFueXdoZXJlXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYXJjLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gKiAgICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICogICAgICAgICAgZGVsdGE6IGFyYy5kZWx0YSxcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1cyxcbiAqICAgICAgICAgIGNvbG9yIDogYXJjLmNvbG9yIC0gVGhlIGNvbG9yIHNob3VsZCBiZSBDZXNpdW0uQ29sb3IgdHlwZVxuICogICAgfVwiPlxuICogICAgPC9hYy1hcmMtZGVzYz5cbiAqICAgIGBgYFxuICpcbiAqICAgIGRlc2NyaXB0aW9uIG9mIHRoZSBwcm9wcyA6XG4gKiAgICBjZW50ZXIgLSBUaGUgYXJjIGlzIGEgc2VjdGlvbiBvZiBhbiBvdXRsaW5lIG9mIGEgY2lyY2xlLCBUaGlzIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICogICAgYW5nbGUgLSB0aGUgaW5pdGlhbCBhbmdsZSBvZiB0aGUgYXJjIGluIHJhZGlhbnNcbiAqICAgIGRlbHRhIC0gdGhlIHNwcmVhZGluZyBvZiB0aGUgYXJjLFxuICogICAgcmFkaXVzIC0gdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciB0byB0aGUgYXJjXG4gKlxuICogICAgZm9yIGV4YW1wbGUgOlxuICogICAgYW5nbGUgLSAwXG4gKiAgICBkZWx0YSAtIM+AXG4gKlxuICogICAgd2lsbCBkcmF3IGFuIGhhbGYgY2lyY2xlXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYXJjLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQXJjRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcmNEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihhcmNEcmF3ZXI6IEFyY0RyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoYXJjRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cbn1cbiJdfQ==
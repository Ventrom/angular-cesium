import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
export class AcPolygonComponent extends EntityOnMapComponent {
    constructor(polygonDrawer, mapLayers) {
        super(polygonDrawer, mapLayers);
    }
}
AcPolygonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcPolygonComponent, deps: [{ token: i1.PolygonDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPolygonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcPolygonComponent, selector: "ac-polygon", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcPolygonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polygon',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.PolygonDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWdvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcG9seWdvbi9hYy1wb2x5Z29uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBRzVGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUtILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxvQkFBb0I7SUFDMUQsWUFBWSxhQUFtQyxFQUFFLFNBQTJCO1FBQzFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0hBSFUsa0JBQWtCO29HQUFsQixrQkFBa0IseUVBRm5CLEVBQUU7NEZBRUQsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsRUFBRTtpQkFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2x5Z29uIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBfU2V0IGBoZWlnaHRgIHByb3AgZm9yIHBlcmZvcm1hbmNlIGVuaGFuY2VtZW50X1xuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIFBvbHlnb25HcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9Qb2x5Z29uR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtcG9seWdvbiBwcm9wcz1cIntcbiAqICAgICAgaGllcmFyY2h5OiBwb2x5Z29uLmhpZXJhcmNoeSxcbiAqICAgICAgbWF0ZXJpYWw6IHBvbHlnb24ubWF0ZXJpYWwsXG4gKiAgICAgIGhlaWdodDogcG9seWdvbi5oZWlnaHRcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtcG9seWdvbj5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtcG9seWdvbicsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNQb2x5Z29uQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwb2x5Z29uRHJhd2VyOiBQb2x5Z29uRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIocG9seWdvbkRyYXdlciwgbWFwTGF5ZXJzKTtcbiAgfVxufVxuIl19
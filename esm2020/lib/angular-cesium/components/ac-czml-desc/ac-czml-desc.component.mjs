import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/czml-drawer/czml-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
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
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcCzmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcCzmlDescComponent, deps: [{ token: i1.CzmlDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCzmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcCzmlDescComponent, selector: "ac-czml-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcCzmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-czml-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CzmlDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY3ptbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jem1sLWRlc2MvYWMtY3ptbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRWxELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7Ozs7O0FBTXpFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUtILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxTQUFTO0lBQ2hELFlBQVksVUFBNkIsRUFBRSxZQUEwQixFQUN6RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RSxDQUFDOztpSEFKVSxtQkFBbUI7cUdBQW5CLG1CQUFtQiwyRUFGcEIsRUFBRTs0RkFFRCxtQkFBbUI7a0JBSi9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3ptbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N6bWwtZHJhd2VyL2N6bWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgY3ptbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtY3ptbC1kZXNjIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKlxuICogIFNlZSBDWk1MIEd1aWRlIGZvciB0aGUgc3RydWN0dXJlIG9mIHByb3BzLmN6bWxQYWNrZXQ6XG4gKiAgKyBodHRwczovL2dpdGh1Yi5jb20vQW5hbHl0aWNhbEdyYXBoaWNzSW5jL2N6bWwtd3JpdGVyL3dpa2kvQ1pNTC1TdHJ1Y3R1cmVcbiAqXG4gKiAgQXR0ZW50aW9uOiB0aGUgZmlyc3QgY3ptbFBhY2tldCBpbiB0aGUgc3RyZWFtIG5lZWRzIHRvIGJlIGEgZG9jdW1lbnRcbiAqICB3aXRoIGFuIGlkIGFuZCBhIG5hbWUgYXR0cmlidXRlLiBTZWUgdGhpcyBleGFtcGxlXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQXBwcy9TYW5kY2FzdGxlL2luZGV4Lmh0bWw/c3JjPUNaTUwlMjBQb2ludCUyMC0lMjBUaW1lJTIwRHluYW1pYy5odG1sJmxhYmVsPUNaTUxcbiAqXG4gKiAgVG8gc2VlIGEgd29ya2luZyBleGFtcGxlLCB1c2UgdGhlIGRlbW8gYXBwIGFuZFxuICogICsgdW5jb21tZW50IDxjem1sLWxheWVyPjwvY3ptbC1sYXllcj4gaW4gZGVtby1tYXAuY29tcG9uZW50Lmh0bWxcbiAqICArIHNldCB0aGUgcHJvcGVydGllcyAndGltZWxpbmUnLCAnYW5pbWF0aW9uJyBhbmQgJ3Nob3VsZEFuaW1hdGUnIHRydWUgaW4gdmlld2VyT3B0aW9ucyBvZiBkZW1vLW1hcC5jb21wb25lbnQudHNcbiAqXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1jem1sLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGN6bWxQYWNrZXQ6IGN6bWxQYWNrZXRcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtY3ptbC1kZXNjPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1jem1sLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjQ3ptbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuICBjb25zdHJ1Y3Rvcihjem1sRHJhd2VyOiBDem1sRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihjem1sRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cblxufVxuIl19
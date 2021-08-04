import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ModelDrawerService } from '../../services/drawers/model-drawer/model-drawer.service';
/**
 *  This is a model implementation.
 *  The ac-model element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and ModelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/ModelGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-model-desc props="{
 *       position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 *       uri : '../../SampleData/models/CesiumGround/Cesium_Ground.gltf'
 *   }
 *    }">
 *    </ac-model-desc>
 *  ```
 */
export class AcModelDescComponent extends BasicDesc {
    constructor(modelDrawer, layerService, computationCache, cesiumProperties) {
        super(modelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcModelDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-model-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcModelDescComponent) }]
            },] }
];
AcModelDescComponent.ctorParameters = () => [
    { type: ModelDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbW9kZWwtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbW9kZWwtZGVzYy9hYy1tb2RlbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBRTlGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBTUgsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFNBQVM7SUFFakQsWUFBWSxXQUErQixFQUFFLFlBQTBCLEVBQzNELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBQyxDQUFDO2FBQ3ZGOzs7WUF2QlEsa0JBQWtCO1lBSGxCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbW9kZWwtZHJhd2VyL21vZGVsLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIG1vZGVsIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1tb2RlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIE1vZGVsR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vTW9kZWxHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1tb2RlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgcG9zaXRpb24gOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tRGVncmVlcygtMTIzLjA3NDQ2MTksIDQ0LjA1MDM3MDYpLFxuICogICAgICAgdXJpIDogJy4uLy4uL1NhbXBsZURhdGEvbW9kZWxzL0Nlc2l1bUdyb3VuZC9DZXNpdW1fR3JvdW5kLmdsdGYnXG4gKiAgIH1cbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtbW9kZWwtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbW9kZWwtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNNb2RlbERlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjTW9kZWxEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3Rvcihtb2RlbERyYXdlcjogTW9kZWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKG1vZGVsRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=
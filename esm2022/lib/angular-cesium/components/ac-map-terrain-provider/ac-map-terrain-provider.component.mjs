import { Component, Input } from '@angular/core';
import { Checker } from '../../utils/checker';
import { MapTerrainProviderOptions } from '../../models/map-terrain-provider-options.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
export class AcMapTerrainProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)
            && this.provider !== MapTerrainProviderOptions.Ellipsoid
            && this.provider !== MapTerrainProviderOptions.WorldTerrain) {
            throw new Error('options must have a url');
        }
        this.defaultTerrainProvider = this.cesiumService.getViewer().terrainProvider;
        switch (this.provider) {
            case MapTerrainProviderOptions.CesiumTerrain:
            case MapTerrainProviderOptions.ArcGISTiledElevation:
            case MapTerrainProviderOptions.GoogleEarthEnterprise:
            case MapTerrainProviderOptions.VRTheWorld:
            case MapTerrainProviderOptions.Ellipsoid:
                this.terrainProvider = new this.provider(this.options);
                break;
            case MapTerrainProviderOptions.WorldTerrain:
                this.terrainProvider = this.provider(this.options);
                break;
            default:
                console.log('ac-map-terrain-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.terrainProvider = this.defaultTerrainProvider;
                break;
        }
        if (this.show) {
            this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.terrainProvider) {
                    this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
                }
            }
            else {
                this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
            }
        }
    }
    ngOnDestroy() {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcMapTerrainProviderComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcMapTerrainProviderComponent, selector: "ac-map-terrain-provider", inputs: { options: "options", provider: "provider", show: "show" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcMapTerrainProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-terrain-provider',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.CesiumService }], propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], show: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBdUMsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7QUFFM0Y7Ozs7Ozs7Ozs7R0FVRztBQUtILE1BQU0sT0FBTyw2QkFBNkI7SUF1QnhDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBckJoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBUS9COztXQUVHO1FBRUgsU0FBSSxHQUFHLElBQUksQ0FBQztJQU1aLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7ZUFDakMsSUFBSSxDQUFDLFFBQVEsS0FBSyx5QkFBeUIsQ0FBQyxTQUFTO2VBQ3JELElBQUksQ0FBQyxRQUFRLEtBQUsseUJBQXlCLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDN0UsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsS0FBSyx5QkFBeUIsQ0FBQyxhQUFhLENBQUM7WUFDN0MsS0FBSyx5QkFBeUIsQ0FBQyxvQkFBb0IsQ0FBQztZQUNwRCxLQUFLLHlCQUF5QixDQUFDLHFCQUFxQixDQUFDO1lBQ3JELEtBQUsseUJBQXlCLENBQUMsVUFBVSxDQUFDO1lBQzFDLEtBQUsseUJBQXlCLENBQUMsU0FBUztnQkFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNO1lBQ1IsS0FBSyx5QkFBeUIsQ0FBQyxZQUFZO2dCQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1I7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO2dCQUN0RyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbkQsTUFBTTtRQUNWLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDeEUsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztZQUN4RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQy9DLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBQ3hFLENBQUM7WUFDSCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1lBQy9FLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDL0UsQ0FBQzs4R0FyRVUsNkJBQTZCO2tHQUE3Qiw2QkFBNkIsd0pBRjlCLEVBQUU7OzJGQUVELDZCQUE2QjtrQkFKekMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjtrRkFPQyxPQUFPO3NCQUROLEtBQUs7Z0JBT04sUUFBUTtzQkFEUCxLQUFLO2dCQU9OLElBQUk7c0JBREgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NoZWNrZXInO1xuaW1wb3J0IHsgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9tYXAtdGVycmFpbi1wcm92aWRlci1vcHRpb25zLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIGZvciBhZGRpbmcgYSB0ZXJyYWluIHByb3ZpZGVyIHNlcnZpY2UgdG8gdGhlIG1hcCAoYWMtbWFwKVxuICogIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHNlbGVjdGVkIHRlcnJhaW4gcHJvdmlkZXIgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucyBlbnVtLlxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1tYXAtdGVycmFpbi1wcm92aWRlciBbb3B0aW9uc109XCJvcHRpb25zT2JqZWN0XCIgW3Byb3ZpZGVyXT1cIm15UHJvdmlkZXJcIj5cbiAqICAgIDwvYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXI+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcFRlcnJhaW5Qcm92aWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9UZXJyYWluUHJvdmlkZXIuaHRtbFxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiB0aGUgcHJvdmlkZXJcbiAgICovXG4gIEBJbnB1dCgpXG4gIHByb3ZpZGVyOiBhbnk7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuXG4gIHByaXZhdGUgdGVycmFpblByb3ZpZGVyOiBhbnk7XG4gIHByaXZhdGUgZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodGhpcy5vcHRpb25zLnVybClcbiAgICAgICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuRWxsaXBzb2lkXG4gICAgICAmJiB0aGlzLnByb3ZpZGVyICE9PSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLldvcmxkVGVycmFpbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xuICAgIH1cbiAgICB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXIgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyO1xuICAgIHN3aXRjaCAodGhpcy5wcm92aWRlcikge1xuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLkNlc2l1bVRlcnJhaW46XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuQXJjR0lTVGlsZWRFbGV2YXRpb246XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuR29vZ2xlRWFydGhFbnRlcnByaXNlOlxuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLlZSVGhlV29ybGQ6XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuRWxsaXBzb2lkOlxuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IG5ldyB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLldvcmxkVGVycmFpbjpcbiAgICAgICAgdGhpcy50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyOiBbcHJvdmlkZXJdIHdhc25cXCd0IGZvdW5kLiBzZXR0aW5nIE9GRkxJTkUgcHJvdmlkZXIgYXMgZGVmYXVsdCcpO1xuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3cpIHtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnRlcnJhaW5Qcm92aWRlcjtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVycmFpblByb3ZpZGVyKSB7XG4gICAgICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMudGVycmFpblByb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXI7XG4gIH1cbn1cbiJdfQ==
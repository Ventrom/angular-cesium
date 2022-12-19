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
}
AcMapTerrainProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcMapTerrainProviderComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapTerrainProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcMapTerrainProviderComponent, selector: "ac-map-terrain-provider", inputs: { options: "options", provider: "provider", show: "show" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcMapTerrainProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-terrain-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], show: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBdUMsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7QUFFM0Y7Ozs7Ozs7Ozs7R0FVRztBQUtILE1BQU0sT0FBTyw2QkFBNkI7SUF1QnhDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBckJoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBUS9COztXQUVHO1FBRUgsU0FBSSxHQUFHLElBQUksQ0FBQztJQU1aLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7ZUFDakMsSUFBSSxDQUFDLFFBQVEsS0FBSyx5QkFBeUIsQ0FBQyxTQUFTO2VBQ3JELElBQUksQ0FBQyxRQUFRLEtBQUsseUJBQXlCLENBQUMsWUFBWSxFQUFFO1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUM3RSxRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckIsS0FBSyx5QkFBeUIsQ0FBQyxhQUFhLENBQUM7WUFDN0MsS0FBSyx5QkFBeUIsQ0FBQyxvQkFBb0IsQ0FBQztZQUNwRCxLQUFLLHlCQUF5QixDQUFDLHFCQUFxQixDQUFDO1lBQ3JELEtBQUsseUJBQXlCLENBQUMsVUFBVSxDQUFDO1lBQzFDLEtBQUsseUJBQXlCLENBQUMsU0FBUztnQkFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNO1lBQ1IsS0FBSyx5QkFBeUIsQ0FBQyxZQUFZO2dCQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1I7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3RkFBd0YsQ0FBQyxDQUFDO2dCQUN0RyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbkQsTUFBTTtTQUNUO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUN2RTtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDdkQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUMvQyxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7aUJBQ3ZFO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2FBQzlFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUMvRSxDQUFDOzsySEFyRVUsNkJBQTZCOytHQUE3Qiw2QkFBNkIsd0pBRjlCLEVBQUU7NEZBRUQsNkJBQTZCO2tCQUp6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO2lCQUNiO29HQU9DLE9BQU87c0JBRE4sS0FBSztnQkFPTixRQUFRO3NCQURQLEtBQUs7Z0JBT04sSUFBSTtzQkFESCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hlY2tlcic7XG5pbXBvcnQgeyBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL21hcC10ZXJyYWluLXByb3ZpZGVyLW9wdGlvbnMuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIHRlcnJhaW4gcHJvdmlkZXIgc2VydmljZSB0byB0aGUgbWFwIChhYy1tYXApXG4gKiAgb3B0aW9ucyBhY2NvcmRpbmcgdG8gc2VsZWN0ZWQgdGVycmFpbiBwcm92aWRlciBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zIGVudW0uXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLW1hcC10ZXJyYWluLXByb3ZpZGVyIFtvcHRpb25zXT1cIm9wdGlvbnNPYmplY3RcIiBbcHJvdmlkZXJdPVwibXlQcm92aWRlclwiPlxuICogICAgPC9hYy1tYXAtdGVycmFpbi1wcm92aWRlcj5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXInLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjTWFwVGVycmFpblByb3ZpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIHJlZmVyIHRvIGNlc2l1bSBkb2NzIGZvciBkZXRhaWxzIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1RlcnJhaW5Qcm92aWRlci5odG1sXG4gICAqL1xuICBASW5wdXQoKVxuICBvcHRpb25zOiB7IHVybD86IHN0cmluZyB9ID0ge307XG5cbiAgLyoqXG4gICAqIHRoZSBwcm92aWRlclxuICAgKi9cbiAgQElucHV0KClcbiAgcHJvdmlkZXI6IGFueTtcblxuICAvKipcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gRGV0ZXJtaW5lcyBpZiB0aGUgbWFwIGxheWVyIGlzIHNob3duLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG5cbiAgcHJpdmF0ZSB0ZXJyYWluUHJvdmlkZXI6IGFueTtcbiAgcHJpdmF0ZSBkZWZhdWx0VGVycmFpblByb3ZpZGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIUNoZWNrZXIucHJlc2VudCh0aGlzLm9wdGlvbnMudXJsKVxuICAgICAgJiYgdGhpcy5wcm92aWRlciAhPT0gTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5FbGxpcHNvaWRcbiAgICAgICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuV29ybGRUZXJyYWluKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMgbXVzdCBoYXZlIGEgdXJsJyk7XG4gICAgfVxuICAgIHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlciA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXI7XG4gICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuQ2VzaXVtVGVycmFpbjpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5BcmNHSVNUaWxlZEVsZXZhdGlvbjpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5Hb29nbGVFYXJ0aEVudGVycHJpc2U6XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuVlJUaGVXb3JsZDpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5FbGxpcHNvaWQ6XG4gICAgICAgIHRoaXMudGVycmFpblByb3ZpZGVyID0gbmV3IHRoaXMucHJvdmlkZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuV29ybGRUZXJyYWluOlxuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMucHJvdmlkZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXI6IFtwcm92aWRlcl0gd2FzblxcJ3QgZm91bmQuIHNldHRpbmcgT0ZGTElORSBwcm92aWRlciBhcyBkZWZhdWx0Jyk7XG4gICAgICAgIHRoaXMudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdykge1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMudGVycmFpblByb3ZpZGVyO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2hvdyddICYmICFjaGFuZ2VzWydzaG93J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBjb25zdCBzaG93VmFsdWUgPSBjaGFuZ2VzWydzaG93J10uY3VycmVudFZhbHVlO1xuICAgICAgaWYgKHNob3dWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50ZXJyYWluUHJvdmlkZXIpIHtcbiAgICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy50ZXJyYWluUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjtcbiAgfVxufVxuIl19
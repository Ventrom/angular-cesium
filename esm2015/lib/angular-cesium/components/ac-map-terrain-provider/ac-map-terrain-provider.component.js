import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
import { MapTerrainProviderOptions } from '../../models/map-terrain-provider-options.enum';
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
let AcMapTerrainProviderComponent = class AcMapTerrainProviderComponent {
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
};
AcMapTerrainProviderComponent.ctorParameters = () => [
    { type: CesiumService }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcMapTerrainProviderComponent.prototype, "options", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcMapTerrainProviderComponent.prototype, "provider", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcMapTerrainProviderComponent.prototype, "show", void 0);
AcMapTerrainProviderComponent = __decorate([
    Component({
        selector: 'ac-map-terrain-provider',
        template: ''
    }),
    __metadata("design:paramtypes", [CesiumService])
], AcMapTerrainProviderComponent);
export { AcMapTerrainProviderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAtdGVycmFpbi1wcm92aWRlci9hYy1tYXAtdGVycmFpbi1wcm92aWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUF1QyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBRTNGOzs7Ozs7Ozs7O0dBVUc7QUFLSCxJQUFhLDZCQUE2QixHQUExQyxNQUFhLDZCQUE2QjtJQXVCeEMsWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFyQmhEOztXQUVHO1FBRUgsWUFBTyxHQUFxQixFQUFFLENBQUM7UUFRL0I7O1dBRUc7UUFFSCxTQUFJLEdBQUcsSUFBSSxDQUFDO0lBTVosQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztlQUNqQyxJQUFJLENBQUMsUUFBUSxLQUFLLHlCQUF5QixDQUFDLFNBQVM7ZUFDckQsSUFBSSxDQUFDLFFBQVEsS0FBSyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUU7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQzdFLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyQixLQUFLLHlCQUF5QixDQUFDLGFBQWEsQ0FBQztZQUM3QyxLQUFLLHlCQUF5QixDQUFDLG9CQUFvQixDQUFDO1lBQ3BELEtBQUsseUJBQXlCLENBQUMscUJBQXFCLENBQUM7WUFDckQsS0FBSyx5QkFBeUIsQ0FBQyxVQUFVLENBQUM7WUFDMUMsS0FBSyx5QkFBeUIsQ0FBQyxTQUFTO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU07WUFDUixLQUFLLHlCQUF5QixDQUFDLFlBQVk7Z0JBQ3pDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELE1BQU07WUFDUjtnQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdGQUF3RixDQUFDLENBQUM7Z0JBQ3RHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2dCQUNuRCxNQUFNO1NBQ1Q7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN2RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQy9DLElBQUksU0FBUyxFQUFFO2dCQUNiLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDdkU7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7YUFDOUU7U0FDRjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO0lBQy9FLENBQUM7Q0FDRixDQUFBOztZQS9Db0MsYUFBYTs7QUFqQmhEO0lBREMsS0FBSyxFQUFFOzs4REFDdUI7QUFNL0I7SUFEQyxLQUFLLEVBQUU7OytEQUNNO0FBTWQ7SUFEQyxLQUFLLEVBQUU7OzJEQUNJO0FBbEJELDZCQUE2QjtJQUp6QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUseUJBQXlCO1FBQ25DLFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQztxQ0F3Qm1DLGFBQWE7R0F2QnJDLDZCQUE2QixDQXNFekM7U0F0RVksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hlY2tlcic7XG5pbXBvcnQgeyBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL21hcC10ZXJyYWluLXByb3ZpZGVyLW9wdGlvbnMuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIHRlcnJhaW4gcHJvdmlkZXIgc2VydmljZSB0byB0aGUgbWFwIChhYy1tYXApXG4gKiAgb3B0aW9ucyBhY2NvcmRpbmcgdG8gc2VsZWN0ZWQgdGVycmFpbiBwcm92aWRlciBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zIGVudW0uXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLW1hcC10ZXJyYWluLXByb3ZpZGVyIFtvcHRpb25zXT1cIm9wdGlvbnNPYmplY3RcIiBbcHJvdmlkZXJdPVwibXlQcm92aWRlclwiPlxuICogICAgPC9hYy1tYXAtdGVycmFpbi1wcm92aWRlcj5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXInLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjTWFwVGVycmFpblByb3ZpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIHJlZmVyIHRvIGNlc2l1bSBkb2NzIGZvciBkZXRhaWxzIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1RlcnJhaW5Qcm92aWRlci5odG1sXG4gICAqL1xuICBASW5wdXQoKVxuICBvcHRpb25zOiB7IHVybD86IHN0cmluZyB9ID0ge307XG5cbiAgLyoqXG4gICAqIHRoZSBwcm92aWRlclxuICAgKi9cbiAgQElucHV0KClcbiAgcHJvdmlkZXI6IGFueTtcblxuICAvKipcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gRGV0ZXJtaW5lcyBpZiB0aGUgbWFwIGxheWVyIGlzIHNob3duLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG5cbiAgcHJpdmF0ZSB0ZXJyYWluUHJvdmlkZXI6IGFueTtcbiAgcHJpdmF0ZSBkZWZhdWx0VGVycmFpblByb3ZpZGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIUNoZWNrZXIucHJlc2VudCh0aGlzLm9wdGlvbnMudXJsKVxuICAgICAgJiYgdGhpcy5wcm92aWRlciAhPT0gTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5FbGxpcHNvaWRcbiAgICAgICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuV29ybGRUZXJyYWluKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMgbXVzdCBoYXZlIGEgdXJsJyk7XG4gICAgfVxuICAgIHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlciA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXI7XG4gICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuQ2VzaXVtVGVycmFpbjpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5BcmNHSVNUaWxlZEVsZXZhdGlvbjpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5Hb29nbGVFYXJ0aEVudGVycHJpc2U6XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuVlJUaGVXb3JsZDpcbiAgICAgIGNhc2UgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucy5FbGxpcHNvaWQ6XG4gICAgICAgIHRoaXMudGVycmFpblByb3ZpZGVyID0gbmV3IHRoaXMucHJvdmlkZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuV29ybGRUZXJyYWluOlxuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMucHJvdmlkZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXI6IFtwcm92aWRlcl0gd2FzblxcJ3QgZm91bmQuIHNldHRpbmcgT0ZGTElORSBwcm92aWRlciBhcyBkZWZhdWx0Jyk7XG4gICAgICAgIHRoaXMudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdykge1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMudGVycmFpblByb3ZpZGVyO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2hvdyddICYmICFjaGFuZ2VzWydzaG93J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBjb25zdCBzaG93VmFsdWUgPSBjaGFuZ2VzWydzaG93J10uY3VycmVudFZhbHVlO1xuICAgICAgaWYgKHNob3dWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50ZXJyYWluUHJvdmlkZXIpIHtcbiAgICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy50ZXJyYWluUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjtcbiAgfVxufVxuIl19
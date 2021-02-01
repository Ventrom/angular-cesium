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
var AcMapTerrainProviderComponent = /** @class */ (function () {
    function AcMapTerrainProviderComponent(cesiumService) {
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
    AcMapTerrainProviderComponent.prototype.ngOnInit = function () {
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
    };
    AcMapTerrainProviderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            var showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.terrainProvider) {
                    this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
                }
            }
            else {
                this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
            }
        }
    };
    AcMapTerrainProviderComponent.prototype.ngOnDestroy = function () {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
    };
    AcMapTerrainProviderComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
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
    return AcMapTerrainProviderComponent;
}());
export { AcMapTerrainProviderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAtdGVycmFpbi1wcm92aWRlci9hYy1tYXAtdGVycmFpbi1wcm92aWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUF1QyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBRTNGOzs7Ozs7Ozs7O0dBVUc7QUFLSDtJQXVCRSx1Q0FBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFyQmhEOztXQUVHO1FBRUgsWUFBTyxHQUFxQixFQUFFLENBQUM7UUFRL0I7O1dBRUc7UUFFSCxTQUFJLEdBQUcsSUFBSSxDQUFDO0lBTVosQ0FBQztJQUVELGdEQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztlQUNqQyxJQUFJLENBQUMsUUFBUSxLQUFLLHlCQUF5QixDQUFDLFNBQVM7ZUFDckQsSUFBSSxDQUFDLFFBQVEsS0FBSyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUU7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQzdFLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyQixLQUFLLHlCQUF5QixDQUFDLGFBQWEsQ0FBQztZQUM3QyxLQUFLLHlCQUF5QixDQUFDLG9CQUFvQixDQUFDO1lBQ3BELEtBQUsseUJBQXlCLENBQUMscUJBQXFCLENBQUM7WUFDckQsS0FBSyx5QkFBeUIsQ0FBQyxVQUFVLENBQUM7WUFDMUMsS0FBSyx5QkFBeUIsQ0FBQyxTQUFTO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU07WUFDUixLQUFLLHlCQUF5QixDQUFDLFlBQVk7Z0JBQ3pDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELE1BQU07WUFDUjtnQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdGQUF3RixDQUFDLENBQUM7Z0JBQ3RHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2dCQUNuRCxNQUFNO1NBQ1Q7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELG1EQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN2RCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQy9DLElBQUksU0FBUyxFQUFFO2dCQUNiLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDdkU7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7YUFDOUU7U0FDRjtJQUNILENBQUM7SUFFRCxtREFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO0lBQy9FLENBQUM7O2dCQTlDa0MsYUFBYTs7SUFqQmhEO1FBREMsS0FBSyxFQUFFOztrRUFDdUI7SUFNL0I7UUFEQyxLQUFLLEVBQUU7O21FQUNNO0lBTWQ7UUFEQyxLQUFLLEVBQUU7OytEQUNJO0lBbEJELDZCQUE2QjtRQUp6QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQzt5Q0F3Qm1DLGFBQWE7T0F2QnJDLDZCQUE2QixDQXNFekM7SUFBRCxvQ0FBQztDQUFBLEFBdEVELElBc0VDO1NBdEVZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NoZWNrZXInO1xuaW1wb3J0IHsgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9tYXAtdGVycmFpbi1wcm92aWRlci1vcHRpb25zLmVudW0nO1xuXG4vKipcbiAqICBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIGZvciBhZGRpbmcgYSB0ZXJyYWluIHByb3ZpZGVyIHNlcnZpY2UgdG8gdGhlIG1hcCAoYWMtbWFwKVxuICogIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHNlbGVjdGVkIHRlcnJhaW4gcHJvdmlkZXIgTWFwVGVycmFpblByb3ZpZGVyT3B0aW9ucyBlbnVtLlxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1tYXAtdGVycmFpbi1wcm92aWRlciBbb3B0aW9uc109XCJvcHRpb25zT2JqZWN0XCIgW3Byb3ZpZGVyXT1cIm15UHJvdmlkZXJcIj5cbiAqICAgIDwvYWMtbWFwLXRlcnJhaW4tcHJvdmlkZXI+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcFRlcnJhaW5Qcm92aWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9UZXJyYWluUHJvdmlkZXIuaHRtbFxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiB0aGUgcHJvdmlkZXJcbiAgICovXG4gIEBJbnB1dCgpXG4gIHByb3ZpZGVyOiBhbnk7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuXG4gIHByaXZhdGUgdGVycmFpblByb3ZpZGVyOiBhbnk7XG4gIHByaXZhdGUgZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodGhpcy5vcHRpb25zLnVybClcbiAgICAgICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuRWxsaXBzb2lkXG4gICAgICAmJiB0aGlzLnByb3ZpZGVyICE9PSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLldvcmxkVGVycmFpbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xuICAgIH1cbiAgICB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXIgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyO1xuICAgIHN3aXRjaCAodGhpcy5wcm92aWRlcikge1xuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLkNlc2l1bVRlcnJhaW46XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuQXJjR0lTVGlsZWRFbGV2YXRpb246XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuR29vZ2xlRWFydGhFbnRlcnByaXNlOlxuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLlZSVGhlV29ybGQ6XG4gICAgICBjYXNlIE1hcFRlcnJhaW5Qcm92aWRlck9wdGlvbnMuRWxsaXBzb2lkOlxuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IG5ldyB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNYXBUZXJyYWluUHJvdmlkZXJPcHRpb25zLldvcmxkVGVycmFpbjpcbiAgICAgICAgdGhpcy50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyOiBbcHJvdmlkZXJdIHdhc25cXCd0IGZvdW5kLiBzZXR0aW5nIE9GRkxJTkUgcHJvdmlkZXIgYXMgZGVmYXVsdCcpO1xuICAgICAgICB0aGlzLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMuZGVmYXVsdFRlcnJhaW5Qcm92aWRlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3cpIHtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLnRlcnJhaW5Qcm92aWRlcjtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVycmFpblByb3ZpZGVyKSB7XG4gICAgICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLnRlcnJhaW5Qcm92aWRlciA9IHRoaXMudGVycmFpblByb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkudGVycmFpblByb3ZpZGVyID0gdGhpcy5kZWZhdWx0VGVycmFpblByb3ZpZGVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS50ZXJyYWluUHJvdmlkZXIgPSB0aGlzLmRlZmF1bHRUZXJyYWluUHJvdmlkZXI7XG4gIH1cbn1cbiJdfQ==
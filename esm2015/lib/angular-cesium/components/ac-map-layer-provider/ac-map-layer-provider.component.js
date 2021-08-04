import { Component, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
import { MapLayerProviderOptions } from '../../models';
/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
export class AcMapLayerProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
         */
        this.options = {};
        /**
         * the provider
         */
        this.provider = MapLayerProviderOptions.OFFLINE;
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        /**
         * The alpha blending value of this layer: 0.0 to 1.0
         */
        this.alpha = 1.0;
        /**
         * The brightness of this layer: 0.0 to 1.0
         */
        this.brightness = 1.0;
        /**
         * The contrast of this layer: 0.0 to 1.0
         */
        this.contrast = 1.0;
        this.imageryLayersCollection = this.cesiumService.getScene().imageryLayers;
    }
    createOfflineMapProvider() {
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
    ngOnInit() {
        if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
            throw new Error('options must have a url');
        }
        switch (this.provider) {
            case MapLayerProviderOptions.WebMapService:
            case MapLayerProviderOptions.WebMapTileService:
            case MapLayerProviderOptions.ArcGisMapServer:
            case MapLayerProviderOptions.SingleTileImagery:
            case MapLayerProviderOptions.BingMaps:
            case MapLayerProviderOptions.GoogleEarthEnterpriseMaps:
            case MapLayerProviderOptions.MapBox:
            case MapLayerProviderOptions.MapboxStyleImageryProvider:
            case MapLayerProviderOptions.UrlTemplateImagery:
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.OFFLINE:
                this.layerProvider = this.createOfflineMapProvider();
                break;
            default:
                console.log('ac-map-layer-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.layerProvider = this.createOfflineMapProvider();
                break;
        }
        if (this.show) {
            this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
            this.imageryLayer.alpha = this.alpha;
            this.imageryLayer.contrast = this.contrast;
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.imageryLayer) {
                    this.imageryLayersCollection.add(this.imageryLayer, this.index);
                }
                else {
                    this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
                    this.imageryLayer.alpha = this.alpha;
                    this.imageryLayer.contrast = this.contrast;
                    this.imageryLayer.brightness = this.brightness;
                }
            }
            else if (this.imageryLayer) {
                this.imageryLayersCollection.remove(this.imageryLayer, false);
            }
        }
        if (changes['alpha'] && !changes['alpha'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.alpha = this.alpha;
        }
        if (changes['contrast'] && !changes['contrast'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.contrast = this.contrast;
        }
        if (changes['brightness'] && !changes['brightness'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnDestroy() {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    }
}
AcMapLayerProviderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-map-layer-provider',
                template: ''
            },] }
];
AcMapLayerProviderComponent.ctorParameters = () => [
    { type: CesiumService }
];
AcMapLayerProviderComponent.propDecorators = {
    options: [{ type: Input }],
    provider: [{ type: Input }],
    index: [{ type: Input }],
    show: [{ type: Input }],
    alpha: [{ type: Input }],
    brightness: [{ type: Input }],
    contrast: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAtbGF5ZXItcHJvdmlkZXIvYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdkQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUtILE1BQU0sT0FBTywyQkFBMkI7SUFnRHRDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBOUNoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBRS9COztXQUVHO1FBRUgsYUFBUSxHQUFRLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztRQVFoRDs7V0FFRztRQUVILFNBQUksR0FBRyxJQUFJLENBQUM7UUFFWjs7V0FFRztRQUVILFVBQUssR0FBRyxHQUFHLENBQUM7UUFFWjs7V0FFRztRQUVILGVBQVUsR0FBRyxHQUFHLENBQUM7UUFFakI7O1dBRUc7UUFFSCxhQUFRLEdBQUcsR0FBRyxDQUFDO1FBT2IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzdFLENBQUM7SUFFTyx3QkFBd0I7UUFDOUIsT0FBTyxNQUFNLENBQUMsbUNBQW1DLENBQUM7WUFDaEQsR0FBRyxFQUFFLE1BQU0s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LEtBQUs7b0JBTUwsS0FBSzt5QkFNTCxLQUFLO3VCQU1MLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tICcuLi8uLi91dGlscy9jaGVja2VyJztcbmltcG9ydCB7IE1hcExheWVyUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcblxuLyoqXG4gKiAgVGhpcyBjb21wb25lbnQgaXMgdXNlZCBmb3IgYWRkaW5nIGEgbWFwIHByb3ZpZGVyIHNlcnZpY2UgdG8gdGhlIG1hcCAoYWMtbWFwKVxuICogIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHNlbGVjdGVkIG1hcCBwcm92aWRlciBNYXBMYXllclByb3ZpZGVyT3B0aW9ucyBlbnVtLlxuICogIGFkZGl0aW9uYWwgc2V0dGluZyBjYW4gYmUgZG9uZSB3aXRoIGNlc2l1bSBpbWFnZXJ5TGF5ZXIgKGV4cG9zZWQgYXMgY2xhc3MgbWVtYmVyKVxuICogIGNoZWNrIG91dDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeUxheWVyLmh0bWxcbiAqICBhbmQ6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0ltYWdlcnlMYXllckNvbGxlY3Rpb24uaHRtbFxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXIgW29wdGlvbnNdPVwib3B0aW9uc09iamVjdFwiIFtwcm92aWRlcl09XCJteVByb3ZpZGVyXCI+XG4gKiAgICA8L2FjLW1hcC1sYXllci1wcm92aWRlcj5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwLWxheWVyLXByb3ZpZGVyJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcExheWVyUHJvdmlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogcmVmZXIgdG8gY2VzaXVtIGRvY3MgZm9yIGRldGFpbHMgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeVByb3ZpZGVyLmh0bWxcbiAgICovXG4gIEBJbnB1dCgpXG4gIG9wdGlvbnM6IHsgdXJsPzogc3RyaW5nIH0gPSB7fTtcblxuICAvKipcbiAgICogdGhlIHByb3ZpZGVyXG4gICAqL1xuICBASW5wdXQoKVxuICBwcm92aWRlcjogYW55ID0gTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORTtcblxuICAvKipcbiAgICogaW5kZXggKG9wdGlvbmFsKSAtIFRoZSBpbmRleCB0byBhZGQgdGhlIGxheWVyIGF0LiBJZiBvbWl0dGVkLCB0aGUgbGF5ZXIgd2lsbCBhZGRlZCBvbiB0b3Agb2YgYWxsIGV4aXN0aW5nIGxheWVycy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGluZGV4OiBOdW1iZXI7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgYWxwaGEgYmxlbmRpbmcgdmFsdWUgb2YgdGhpcyBsYXllcjogMC4wIHRvIDEuMFxuICAgKi9cbiAgQElucHV0KClcbiAgYWxwaGEgPSAxLjA7XG5cbiAgLyoqXG4gICAqIFRoZSBicmlnaHRuZXNzIG9mIHRoaXMgbGF5ZXI6IDAuMCB0byAxLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGJyaWdodG5lc3MgPSAxLjA7XG5cbiAgLyoqXG4gICAqIFRoZSBjb250cmFzdCBvZiB0aGlzIGxheWVyOiAwLjAgdG8gMS4wXG4gICAqL1xuICBASW5wdXQoKVxuICBjb250cmFzdCA9IDEuMDtcblxuICBwdWJsaWMgaW1hZ2VyeUxheWVyOiBhbnk7XG4gIHB1YmxpYyBpbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbjogYW55O1xuICBwdWJsaWMgbGF5ZXJQcm92aWRlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24gPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5pbWFnZXJ5TGF5ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIENlc2l1bS5jcmVhdGVUaWxlTWFwU2VydmljZUltYWdlcnlQcm92aWRlcih7XG4gICAgICB1cmw6IENlc2l1bS5idWlsZE1vZHVsZVVybCgnQXNzZXRzL1RleHR1cmVzL05hdHVyYWxFYXJ0aElJJylcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghQ2hlY2tlci5wcmVzZW50KHRoaXMub3B0aW9ucy51cmwpICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk9GRkxJTkUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb3B0aW9ucyBtdXN0IGhhdmUgYSB1cmwnKTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLldlYk1hcFNlcnZpY2U6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLldlYk1hcFRpbGVTZXJ2aWNlOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5BcmNHaXNNYXBTZXJ2ZXI6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLlNpbmdsZVRpbGVJbWFnZXJ5OlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5CaW5nTWFwczpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuR29vZ2xlRWFydGhFbnRlcnByaXNlTWFwczpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuTWFwQm94OlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5NYXBib3hTdHlsZUltYWdlcnlQcm92aWRlcjpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuVXJsVGVtcGxhdGVJbWFnZXJ5OlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5NYXBUaWxlU2VydmljZTpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT3BlblN0cmVldE1hcDpcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gbmV3IHRoaXMucHJvdmlkZXIodGhpcy5vcHRpb25zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk9GRkxJTkU6XG4gICAgICAgIHRoaXMubGF5ZXJQcm92aWRlciA9IHRoaXMuY3JlYXRlT2ZmbGluZU1hcFByb3ZpZGVyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ2FjLW1hcC1sYXllci1wcm92aWRlcjogW3Byb3ZpZGVyXSB3YXNuXFwndCBmb3VuZC4gc2V0dGluZyBPRkZMSU5FIHByb3ZpZGVyIGFzIGRlZmF1bHQnKTtcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gdGhpcy5jcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3cpIHtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyID0gdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGRJbWFnZXJ5UHJvdmlkZXIodGhpcy5sYXllclByb3ZpZGVyLCB0aGlzLmluZGV4KTtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmFscGhhID0gdGhpcy5hbHBoYTtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmNvbnRyYXN0ID0gdGhpcy5jb250cmFzdDtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmJyaWdodG5lc3MgPSB0aGlzLmJyaWdodG5lc3M7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzaG93J10gJiYgIWNoYW5nZXNbJ3Nob3cnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHNob3dWYWx1ZSA9IGNoYW5nZXNbJ3Nob3cnXS5jdXJyZW50VmFsdWU7XG4gICAgICBpZiAoc2hvd1ZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlcnlMYXllcikge1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24uYWRkKHRoaXMuaW1hZ2VyeUxheWVyLCB0aGlzLmluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllciA9IHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24uYWRkSW1hZ2VyeVByb3ZpZGVyKHRoaXMubGF5ZXJQcm92aWRlciwgdGhpcy5pbmRleCk7XG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmNvbnRyYXN0ID0gdGhpcy5jb250cmFzdDtcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5icmlnaHRuZXNzID0gdGhpcy5icmlnaHRuZXNzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24ucmVtb3ZlKHRoaXMuaW1hZ2VyeUxheWVyLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ2FscGhhJ10gJiYgIWNoYW5nZXNbJ2FscGhhJ10uaXNGaXJzdENoYW5nZSgpICYmIHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllci5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydjb250cmFzdCddICYmICFjaGFuZ2VzWydjb250cmFzdCddLmlzRmlyc3RDaGFuZ2UoKSAmJiB0aGlzLmltYWdlcnlMYXllcikge1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuY29udHJhc3QgPSB0aGlzLmNvbnRyYXN0O1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snYnJpZ2h0bmVzcyddICYmICFjaGFuZ2VzWydicmlnaHRuZXNzJ10uaXNGaXJzdENoYW5nZSgpICYmIHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllci5icmlnaHRuZXNzID0gdGhpcy5icmlnaHRuZXNzO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmltYWdlcnlMYXllcikge1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy5pbWFnZXJ5TGF5ZXIsIHRydWUpO1xuICAgIH1cbiAgfVxufVxuIl19
import { Component, Input } from '@angular/core';
import { Checker } from '../../utils/checker';
import { MapLayerProviderOptions } from '../../models';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
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
AcMapLayerProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcMapLayerProviderComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapLayerProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcMapLayerProviderComponent, selector: "ac-map-layer-provider", inputs: { options: "options", provider: "provider", index: "index", show: "show", alpha: "alpha", brightness: "brightness", contrast: "contrast" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcMapLayerProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-layer-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], alpha: [{
                type: Input
            }], brightness: [{
                type: Input
            }], contrast: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAtbGF5ZXItcHJvdmlkZXIvYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7O0FBRXZEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFLSCxNQUFNLE9BQU8sMkJBQTJCO0lBZ0R0QyxZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQTlDaEQ7O1dBRUc7UUFFSCxZQUFPLEdBQXFCLEVBQUUsQ0FBQztRQUUvQjs7V0FFRztRQUVILGFBQVEsR0FBUSx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7UUFRaEQ7O1dBRUc7UUFFSCxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBRVo7O1dBRUc7UUFFSCxVQUFLLEdBQUcsR0FBRyxDQUFDO1FBRVo7O1dBRUc7UUFFSCxlQUFVLEdBQUcsR0FBRyxDQUFDO1FBRWpCOztXQUVHO1FBRUgsYUFBUSxHQUFHLEdBQUcsQ0FBQztRQU9iLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM3RSxDQUFDO0lBRU8sd0JBQXdCO1FBQzlCLE9BQU8sTUFBTSxDQUFDLG1DQUFtQyxDQUFDO1lBQ2hELEdBQUcsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDO1NBQzdELENBQUMsQ0FB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QUs7Z0JBT04sS0FBSztzQkFESixLQUFLO2dCQU9OLElBQUk7c0JBREgsS0FBSztnQkFPTixLQUFLO3NCQURKLEtBQUs7Z0JBT04sVUFBVTtzQkFEVCxLQUFLO2dCQU9OLFFBQVE7c0JBRFAsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NoZWNrZXInO1xuaW1wb3J0IHsgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMnO1xuXG4vKipcbiAqICBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIGZvciBhZGRpbmcgYSBtYXAgcHJvdmlkZXIgc2VydmljZSB0byB0aGUgbWFwIChhYy1tYXApXG4gKiAgb3B0aW9ucyBhY2NvcmRpbmcgdG8gc2VsZWN0ZWQgbWFwIHByb3ZpZGVyIE1hcExheWVyUHJvdmlkZXJPcHRpb25zIGVudW0uXG4gKiAgYWRkaXRpb25hbCBzZXR0aW5nIGNhbiBiZSBkb25lIHdpdGggY2VzaXVtIGltYWdlcnlMYXllciAoZXhwb3NlZCBhcyBjbGFzcyBtZW1iZXIpXG4gKiAgY2hlY2sgb3V0OiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9JbWFnZXJ5TGF5ZXIuaHRtbFxuICogIGFuZDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeUxheWVyQ29sbGVjdGlvbi5odG1sXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLW1hcC1sYXllci1wcm92aWRlciBbb3B0aW9uc109XCJvcHRpb25zT2JqZWN0XCIgW3Byb3ZpZGVyXT1cIm15UHJvdmlkZXJcIj5cbiAqICAgIDwvYWMtbWFwLWxheWVyLXByb3ZpZGVyPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1tYXAtbGF5ZXItcHJvdmlkZXInLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjTWFwTGF5ZXJQcm92aWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9JbWFnZXJ5UHJvdmlkZXIuaHRtbFxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiB0aGUgcHJvdmlkZXJcbiAgICovXG4gIEBJbnB1dCgpXG4gIHByb3ZpZGVyOiBhbnkgPSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5PRkZMSU5FO1xuXG4gIC8qKlxuICAgKiBpbmRleCAob3B0aW9uYWwpIC0gVGhlIGluZGV4IHRvIGFkZCB0aGUgbGF5ZXIgYXQuIElmIG9taXR0ZWQsIHRoZSBsYXllciB3aWxsIGFkZGVkIG9uIHRvcCBvZiBhbGwgZXhpc3RpbmcgbGF5ZXJzLlxuICAgKi9cbiAgQElucHV0KClcbiAgaW5kZXg6IE51bWJlcjtcblxuICAvKipcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gRGV0ZXJtaW5lcyBpZiB0aGUgbWFwIGxheWVyIGlzIHNob3duLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBhbHBoYSBibGVuZGluZyB2YWx1ZSBvZiB0aGlzIGxheWVyOiAwLjAgdG8gMS4wXG4gICAqL1xuICBASW5wdXQoKVxuICBhbHBoYSA9IDEuMDtcblxuICAvKipcbiAgICogVGhlIGJyaWdodG5lc3Mgb2YgdGhpcyBsYXllcjogMC4wIHRvIDEuMFxuICAgKi9cbiAgQElucHV0KClcbiAgYnJpZ2h0bmVzcyA9IDEuMDtcblxuICAvKipcbiAgICogVGhlIGNvbnRyYXN0IG9mIHRoaXMgbGF5ZXI6IDAuMCB0byAxLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGNvbnRyYXN0ID0gMS4wO1xuXG4gIHB1YmxpYyBpbWFnZXJ5TGF5ZXI6IGFueTtcbiAgcHVibGljIGltYWdlcnlMYXllcnNDb2xsZWN0aW9uOiBhbnk7XG4gIHB1YmxpYyBsYXllclByb3ZpZGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbiA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLmltYWdlcnlMYXllcnM7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9mZmxpbmVNYXBQcm92aWRlcigpIHtcbiAgICByZXR1cm4gQ2VzaXVtLmNyZWF0ZVRpbGVNYXBTZXJ2aWNlSW1hZ2VyeVByb3ZpZGVyKHtcbiAgICAgIHVybDogQ2VzaXVtLmJ1aWxkTW9kdWxlVXJsKCdBc3NldHMvVGV4dHVyZXMvTmF0dXJhbEVhcnRoSUknKVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodGhpcy5vcHRpb25zLnVybCkgJiYgdGhpcy5wcm92aWRlciAhPT0gTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMucHJvdmlkZXIpIHtcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuV2ViTWFwU2VydmljZTpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuV2ViTWFwVGlsZVNlcnZpY2U6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLkFyY0dpc01hcFNlcnZlcjpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuU2luZ2xlVGlsZUltYWdlcnk6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLkJpbmdNYXBzOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5Hb29nbGVFYXJ0aEVudGVycHJpc2VNYXBzOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5NYXBCb3g6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk1hcGJveFN0eWxlSW1hZ2VyeVByb3ZpZGVyOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5VcmxUZW1wbGF0ZUltYWdlcnk6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk1hcFRpbGVTZXJ2aWNlOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5PcGVuU3RyZWV0TWFwOlxuICAgICAgICB0aGlzLmxheWVyUHJvdmlkZXIgPSBuZXcgdGhpcy5wcm92aWRlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORTpcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gdGhpcy5jcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnYWMtbWFwLWxheWVyLXByb3ZpZGVyOiBbcHJvdmlkZXJdIHdhc25cXCd0IGZvdW5kLiBzZXR0aW5nIE9GRkxJTkUgcHJvdmlkZXIgYXMgZGVmYXVsdCcpO1xuICAgICAgICB0aGlzLmxheWVyUHJvdmlkZXIgPSB0aGlzLmNyZWF0ZU9mZmxpbmVNYXBQcm92aWRlcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdykge1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIgPSB0aGlzLmltYWdlcnlMYXllcnNDb2xsZWN0aW9uLmFkZEltYWdlcnlQcm92aWRlcih0aGlzLmxheWVyUHJvdmlkZXIsIHRoaXMuaW5kZXgpO1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuY29udHJhc3QgPSB0aGlzLmNvbnRyYXN0O1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYnJpZ2h0bmVzcyA9IHRoaXMuYnJpZ2h0bmVzcztcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGQodGhpcy5pbWFnZXJ5TGF5ZXIsIHRoaXMuaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyID0gdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGRJbWFnZXJ5UHJvdmlkZXIodGhpcy5sYXllclByb3ZpZGVyLCB0aGlzLmluZGV4KTtcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuY29udHJhc3QgPSB0aGlzLmNvbnRyYXN0O1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmJyaWdodG5lc3MgPSB0aGlzLmJyaWdodG5lc3M7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy5pbWFnZXJ5TGF5ZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1snYWxwaGEnXSAmJiAhY2hhbmdlc1snYWxwaGEnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmFscGhhID0gdGhpcy5hbHBoYTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRyYXN0J10gJiYgIWNoYW5nZXNbJ2NvbnRyYXN0J10uaXNGaXJzdENoYW5nZSgpICYmIHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllci5jb250cmFzdCA9IHRoaXMuY29udHJhc3Q7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydicmlnaHRuZXNzJ10gJiYgIWNoYW5nZXNbJ2JyaWdodG5lc3MnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmJyaWdodG5lc3MgPSB0aGlzLmJyaWdodG5lc3M7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllcnNDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLmltYWdlcnlMYXllciwgdHJ1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=
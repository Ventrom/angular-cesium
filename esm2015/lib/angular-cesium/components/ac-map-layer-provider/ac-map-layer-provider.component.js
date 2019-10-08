/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} cesiumService
     */
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
    /**
     * @private
     * @return {?}
     */
    createOfflineMapProvider() {
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
    /**
     * @return {?}
     */
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
            case MapLayerProviderOptions.UrlTemplateImagery:
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = this.provider(this.options);
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
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
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
            }] }
];
/** @nocollapse */
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
if (false) {
    /**
     * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.options;
    /**
     * the provider
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.provider;
    /**
     * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.index;
    /**
     * show (optional) - Determines if the map layer is shown.
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.show;
    /**
     * The alpha blending value of this layer: 0.0 to 1.0
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.alpha;
    /**
     * The brightness of this layer: 0.0 to 1.0
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.brightness;
    /**
     * The contrast of this layer: 0.0 to 1.0
     * @type {?}
     */
    AcMapLayerProviderComponent.prototype.contrast;
    /** @type {?} */
    AcMapLayerProviderComponent.prototype.imageryLayer;
    /** @type {?} */
    AcMapLayerProviderComponent.prototype.imageryLayersCollection;
    /** @type {?} */
    AcMapLayerProviderComponent.prototype.layerProvider;
    /**
     * @type {?}
     * @private
     */
    AcMapLayerProviderComponent.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwLWxheWVyLXByb3ZpZGVyL2FjLW1hcC1sYXllci1wcm92aWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBb0J2RCxNQUFNLE9BQU8sMkJBQTJCOzs7O0lBZ0R0QyxZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTs7OztRQTFDaEQsWUFBTyxHQUFxQixFQUFFLENBQUM7Ozs7UUFNL0IsYUFBUSxHQUFRLHVCQUF1QixDQUFDLE9BQU8sQ0FBQzs7OztRQVloRCxTQUFJLEdBQUcsSUFBSSxDQUFDOzs7O1FBTVosVUFBSyxHQUFHLEdBQUcsQ0FBQzs7OztRQU1aLGVBQVUsR0FBRyxHQUFHLENBQUM7Ozs7UUFNakIsYUFBUSxHQUFHLEdBQUcsQ0FBQztRQU9iLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM3RSxDQUFDOzs7OztJQUVPLHdCQUF3QjtRQUM5QixPQUFPLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQztZQUNoRCxHQUFHLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztTQUM3RCxDQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElB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O3VCQU1MLEtBQUs7Ozs7Ozs7SUFwQ04sOENBQytCOzs7OztJQUsvQiwrQ0FDZ0Q7Ozs7O0lBS2hELDRDQUNjOzs7OztJQUtkLDJDQUNZOzs7OztJQUtaLDRDQUNZOzs7OztJQUtaLGlEQUNpQjs7Ozs7SUFLakIsK0NBQ2U7O0lBRWYsbURBQXlCOztJQUN6Qiw4REFBb0M7O0lBQ3BDLG9EQUEwQjs7Ozs7SUFFZCxvREFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tICcuLi8uLi91dGlscy9jaGVja2VyJztcbmltcG9ydCB7IE1hcExheWVyUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcblxuLyoqXG4gKiAgVGhpcyBjb21wb25lbnQgaXMgdXNlZCBmb3IgYWRkaW5nIGEgbWFwIHByb3ZpZGVyIHNlcnZpY2UgdG8gdGhlIG1hcCAoYWMtbWFwKVxuICogIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHNlbGVjdGVkIG1hcCBwcm92aWRlciBNYXBMYXllclByb3ZpZGVyT3B0aW9ucyBlbnVtLlxuICogIGFkZGl0aW9uYWwgc2V0dGluZyBjYW4gYmUgZG9uZSB3aXRoIGNlc2l1bSBpbWFnZXJ5TGF5ZXIgKGV4cG9zZWQgYXMgY2xhc3MgbWVtYmVyKVxuICogIGNoZWNrIG91dDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeUxheWVyLmh0bWxcbiAqICBhbmQ6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0ltYWdlcnlMYXllckNvbGxlY3Rpb24uaHRtbFxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXIgW29wdGlvbnNdPVwib3B0aW9uc09iamVjdFwiIFtwcm92aWRlcl09XCJteVByb3ZpZGVyXCI+XG4gKiAgICA8L2FjLW1hcC1sYXllci1wcm92aWRlcj5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwLWxheWVyLXByb3ZpZGVyJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcExheWVyUHJvdmlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogcmVmZXIgdG8gY2VzaXVtIGRvY3MgZm9yIGRldGFpbHMgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vSW1hZ2VyeVByb3ZpZGVyLmh0bWxcbiAgICovXG4gIEBJbnB1dCgpXG4gIG9wdGlvbnM6IHsgdXJsPzogc3RyaW5nIH0gPSB7fTtcblxuICAvKipcbiAgICogdGhlIHByb3ZpZGVyXG4gICAqL1xuICBASW5wdXQoKVxuICBwcm92aWRlcjogYW55ID0gTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORTtcblxuICAvKipcbiAgICogaW5kZXggKG9wdGlvbmFsKSAtIFRoZSBpbmRleCB0byBhZGQgdGhlIGxheWVyIGF0LiBJZiBvbWl0dGVkLCB0aGUgbGF5ZXIgd2lsbCBhZGRlZCBvbiB0b3Agb2YgYWxsIGV4aXN0aW5nIGxheWVycy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGluZGV4OiBOdW1iZXI7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgYWxwaGEgYmxlbmRpbmcgdmFsdWUgb2YgdGhpcyBsYXllcjogMC4wIHRvIDEuMFxuICAgKi9cbiAgQElucHV0KClcbiAgYWxwaGEgPSAxLjA7XG5cbiAgLyoqXG4gICAqIFRoZSBicmlnaHRuZXNzIG9mIHRoaXMgbGF5ZXI6IDAuMCB0byAxLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGJyaWdodG5lc3MgPSAxLjA7XG5cbiAgLyoqXG4gICAqIFRoZSBjb250cmFzdCBvZiB0aGlzIGxheWVyOiAwLjAgdG8gMS4wXG4gICAqL1xuICBASW5wdXQoKVxuICBjb250cmFzdCA9IDEuMDtcblxuICBwdWJsaWMgaW1hZ2VyeUxheWVyOiBhbnk7XG4gIHB1YmxpYyBpbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbjogYW55O1xuICBwdWJsaWMgbGF5ZXJQcm92aWRlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHRoaXMuaW1hZ2VyeUxheWVyc0NvbGxlY3Rpb24gPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5pbWFnZXJ5TGF5ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIENlc2l1bS5jcmVhdGVUaWxlTWFwU2VydmljZUltYWdlcnlQcm92aWRlcih7XG4gICAgICB1cmw6IENlc2l1bS5idWlsZE1vZHVsZVVybCgnQXNzZXRzL1RleHR1cmVzL05hdHVyYWxFYXJ0aElJJylcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghQ2hlY2tlci5wcmVzZW50KHRoaXMub3B0aW9ucy51cmwpICYmIHRoaXMucHJvdmlkZXIgIT09IE1hcExheWVyUHJvdmlkZXJPcHRpb25zLk9GRkxJTkUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb3B0aW9ucyBtdXN0IGhhdmUgYSB1cmwnKTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLldlYk1hcFNlcnZpY2U6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLldlYk1hcFRpbGVTZXJ2aWNlOlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5BcmNHaXNNYXBTZXJ2ZXI6XG4gICAgICBjYXNlIE1hcExheWVyUHJvdmlkZXJPcHRpb25zLlNpbmdsZVRpbGVJbWFnZXJ5OlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5CaW5nTWFwczpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuR29vZ2xlRWFydGhFbnRlcnByaXNlTWFwczpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuTWFwQm94OlxuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5VcmxUZW1wbGF0ZUltYWdlcnk6XG4gICAgICAgIHRoaXMubGF5ZXJQcm92aWRlciA9IG5ldyB0aGlzLnByb3ZpZGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNYXBMYXllclByb3ZpZGVyT3B0aW9ucy5NYXBUaWxlU2VydmljZTpcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT3BlblN0cmVldE1hcDpcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gdGhpcy5wcm92aWRlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTWFwTGF5ZXJQcm92aWRlck9wdGlvbnMuT0ZGTElORTpcbiAgICAgICAgdGhpcy5sYXllclByb3ZpZGVyID0gdGhpcy5jcmVhdGVPZmZsaW5lTWFwUHJvdmlkZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnYWMtbWFwLWxheWVyLXByb3ZpZGVyOiBbcHJvdmlkZXJdIHdhc25cXCd0IGZvdW5kLiBzZXR0aW5nIE9GRkxJTkUgcHJvdmlkZXIgYXMgZGVmYXVsdCcpO1xuICAgICAgICB0aGlzLmxheWVyUHJvdmlkZXIgPSB0aGlzLmNyZWF0ZU9mZmxpbmVNYXBQcm92aWRlcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvdykge1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIgPSB0aGlzLmltYWdlcnlMYXllcnNDb2xsZWN0aW9uLmFkZEltYWdlcnlQcm92aWRlcih0aGlzLmxheWVyUHJvdmlkZXIsIHRoaXMuaW5kZXgpO1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuY29udHJhc3QgPSB0aGlzLmNvbnRyYXN0O1xuICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuYnJpZ2h0bmVzcyA9IHRoaXMuYnJpZ2h0bmVzcztcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGQodGhpcy5pbWFnZXJ5TGF5ZXIsIHRoaXMuaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyID0gdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5hZGRJbWFnZXJ5UHJvdmlkZXIodGhpcy5sYXllclByb3ZpZGVyLCB0aGlzLmluZGV4KTtcbiAgICAgICAgICB0aGlzLmltYWdlcnlMYXllci5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXIuY29udHJhc3QgPSB0aGlzLmNvbnRyYXN0O1xuICAgICAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmJyaWdodG5lc3MgPSB0aGlzLmJyaWdodG5lc3M7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgICAgdGhpcy5pbWFnZXJ5TGF5ZXJzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy5pbWFnZXJ5TGF5ZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1snYWxwaGEnXSAmJiAhY2hhbmdlc1snYWxwaGEnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmFscGhhID0gdGhpcy5hbHBoYTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRyYXN0J10gJiYgIWNoYW5nZXNbJ2NvbnRyYXN0J10uaXNGaXJzdENoYW5nZSgpICYmIHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllci5jb250cmFzdCA9IHRoaXMuY29udHJhc3Q7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydicmlnaHRuZXNzJ10gJiYgIWNoYW5nZXNbJ2JyaWdodG5lc3MnXS5pc0ZpcnN0Q2hhbmdlKCkgJiYgdGhpcy5pbWFnZXJ5TGF5ZXIpIHtcbiAgICAgIHRoaXMuaW1hZ2VyeUxheWVyLmJyaWdodG5lc3MgPSB0aGlzLmJyaWdodG5lc3M7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW1hZ2VyeUxheWVyKSB7XG4gICAgICB0aGlzLmltYWdlcnlMYXllcnNDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLmltYWdlcnlMYXllciwgdHJ1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=
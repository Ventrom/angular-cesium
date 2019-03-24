/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcMapComponent } from './components/ac-map/ac-map.component';
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import { AcBillboardDescComponent } from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcEllipseDescComponent } from './components/ac-ellipse-desc/ac-ellipse-desc.component';
import { AcPolylineDescComponent } from './components/ac-polyline-desc/ac-polyline-desc.component';
import { Angular2ParseModule, PIPES_CONFIG } from 'angular2parse';
import { PixelOffsetPipe } from './pipes/pixel-offset/pixel-offset.pipe';
import { RadiansToDegreesPipe } from './pipes/radians-to-degrees/radians-to-degrees.pipe';
import { JsonMapper } from './services/json-mapper/json-mapper.service';
import { CesiumProperties } from './services/cesium-properties/cesium-properties.service';
import { AcLabelDescComponent } from './components/ac-label-desc/ac-label-desc.component';
import { UtilsModule } from './utils/utils.module';
import { ViewerFactory } from './services/viewer-factory/viewer-factory.service';
import { GeoUtilsService } from './services/geo-utils/geo-utils.service';
import { AcCircleDescComponent } from './components/ac-circle-desc/ac-circle-desc.component';
import { AcArcDescComponent } from './components/ac-arc-desc/ac-arc-desc.component';
import { AcMapLayerProviderComponent } from './components/ac-map-layer-provider/ac-map-layer-provider.component';
import { AcPointDescComponent } from './components/ac-point-desc/ac-point-desc.component';
import { AcLabelComponent } from './components/ac-label/ac-label.component';
import { AcPolylineComponent } from './components/ac-polyline/ac-polyline.component';
import { AcEllipseComponent } from './components/ac-ellipse/ac-ellipse.component';
import { AcPointComponent } from './components/ac-point/ac-point.component';
import { AcHtmlComponent } from './components/ac-html/ac-html.component';
import { AcCircleComponent } from './components/ac-circle/ac-circle.component';
import { AcArcComponent } from './components/ac-arc/ac-arc.component';
import { AcPolygonDescComponent } from './components/ac-polygon-desc/ac-polygon-desc.component';
import { AcDefaultPlonterComponent } from './components/ac-default-plonter/ac-default-plonter.component';
import { AcPolygonComponent } from './components/ac-polygon/ac-polygon.component';
import { MapsManagerService } from './services/maps-manager/maps-manager.service';
import { AcStaticEllipseDescComponent } from './components/static-dynamic/ac-static-ellipse-desc/ac-static-ellipse-desc.component';
import { AcDynamicEllipseDescComponent } from './components/static-dynamic/ac-dynamic-ellipse-desc/ac-dynamic-ellipse-desc.component';
import { AcDynamicPolylineDescComponent } from './components/static-dynamic/ac-dynamic-polyline-desc/ac-dynamic-polyline-desc.component';
import { AcStaticPolygonDescComponent } from './components/static-dynamic/ac-static-polygon-desc/ac-static-polygon-desc.component';
import { AcStaticCircleDescComponent } from './components/static-dynamic/ac-static-circle-desc/ac-static-circle-desc.component';
import { AcDynamicCircleDescComponent } from './components/static-dynamic/ac-dynamic-circle-desc/ac-dynamic-circle-desc.component';
import { AcStaticPolylineDescComponent } from './components/static-dynamic/ac-static-polyline-desc/ac-static-polyline-desc.component';
import { AcModelDescComponent } from './components/ac-model-desc/ac-model-desc.component';
import { AcTileset3dComponent } from './components/ac-3d-tileset/ac-tileset-3d.component';
import { AcBoxDescComponent } from './components/ac-box-desc/ac-box-desc.component';
import { AcCylinderDescComponent } from './components/ac-cylinder-desc/ac-cylinder-desc.component';
import { AcCorridorDescComponent } from './components/ac-corridor-desc/ac-corridor-desc.component';
import { AcEllipsoidDescComponent } from './components/ac-ellipsoid-desc/ac-ellipsoid-desc.component';
import { AcPolylineVolumeDescComponent } from './components/ac-polyline-volume-desc/ac-polyline-volume-desc.component';
import { AcWallDescComponent } from './components/ac-wall-desc/ac-wall-desc.component';
import { AcRectangleDescComponent } from './components/ac-rectangle-desc/ac-rectangle-desc.component';
import { AcBillboardPrimitiveDescComponent } from './components/ac-billboard-primitive-desc/ac-billboard-primitive-desc.component';
import { AcLabelPrimitiveDescComponent } from './components/ac-label-primitive-desc/ac-label-primitive-desc.component';
import { AcPolylinePrimitiveDescComponent } from './components/ac-polyline-primitive-desc/ac-polyline-primitive-desc.component';
import { ANGULAR_CESIUM_CONFIG, ConfigurationService } from './cesium-enhancements/ConfigurationService';
import { CesiumExtender } from '../cesium-extender/extender';
import { AcHtmlDescComponent } from './components/ac-html-desc/ac-html-desc.component';
import { AcHtmlDirective } from './directives/ac-html/ac-html.directive';
import { AcHtmlContainerDirective } from './directives/ac-html-container/ac-html-container.directive';
import { AcContextMenuWrapperComponent } from './components/ac-context-menu-wrapper/ac-context-menu-wrapper.component';
import { AcArrayDescComponent } from './components/ac-array-desc/ac-array-desc.component';
import { AcPointPrimitiveDescComponent } from './components/ac-point-primitive-desc/ac-point-primitive-desc.component';
import { AcPrimitivePolylineComponent } from './components/ac-primitive-polyline/ac-primitive-polyline.component';
import PARSE_PIPES_CONFIG_MAP from './pipes/pipe-config-map';
import { AcCzmlDescComponent } from './components/ac-czml-desc/ac-czml-desc.component';
export class AngularCesiumModule {
    constructor() {
        CesiumExtender.extend();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: AngularCesiumModule,
            providers: [
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    }
}
AngularCesiumModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    Angular2ParseModule,
                    UtilsModule,
                ],
                declarations: [
                    AcMapComponent,
                    AcLayerComponent,
                    AcBillboardComponent,
                    AcBillboardDescComponent,
                    AcBillboardPrimitiveDescComponent,
                    AcLabelDescComponent,
                    AcLabelPrimitiveDescComponent,
                    AcEllipseDescComponent,
                    AcPolylineDescComponent,
                    AcPolylinePrimitiveDescComponent,
                    PixelOffsetPipe,
                    RadiansToDegreesPipe,
                    AcCircleDescComponent,
                    AcArcDescComponent,
                    AcMapLayerProviderComponent,
                    AcPointDescComponent,
                    AcLabelComponent,
                    AcPolylineComponent,
                    AcPrimitivePolylineComponent,
                    AcEllipseComponent,
                    AcPointComponent,
                    AcBillboardComponent,
                    AcHtmlComponent,
                    AcCircleComponent,
                    AcArcComponent,
                    AcPolygonDescComponent,
                    AcPolygonComponent,
                    AcDefaultPlonterComponent,
                    AcModelDescComponent,
                    AcTileset3dComponent,
                    AcBoxDescComponent,
                    AcCylinderDescComponent,
                    AcCorridorDescComponent,
                    AcEllipsoidDescComponent,
                    AcPolylineVolumeDescComponent,
                    AcWallDescComponent,
                    AcRectangleDescComponent,
                    AcContextMenuWrapperComponent,
                    AcPointPrimitiveDescComponent,
                    AcHtmlDescComponent,
                    AcHtmlDirective,
                    AcHtmlContainerDirective,
                    AcArrayDescComponent,
                    AcCzmlDescComponent,
                    AcStaticEllipseDescComponent,
                    AcDynamicEllipseDescComponent,
                    AcDynamicPolylineDescComponent,
                    AcStaticPolylineDescComponent,
                    AcDynamicCircleDescComponent,
                    AcStaticCircleDescComponent,
                    AcStaticPolygonDescComponent,
                ],
                exports: [
                    AcMapComponent,
                    AcBillboardComponent,
                    AcBillboardDescComponent,
                    AcBillboardPrimitiveDescComponent,
                    AcLabelDescComponent,
                    AcLabelPrimitiveDescComponent,
                    AcEllipseDescComponent,
                    AcPolylineDescComponent,
                    AcPolylinePrimitiveDescComponent,
                    AcLayerComponent,
                    AcCircleDescComponent,
                    AcArcDescComponent,
                    AcMapLayerProviderComponent,
                    AcPointDescComponent,
                    AcLabelComponent,
                    AcPolylineComponent,
                    AcPrimitivePolylineComponent,
                    AcEllipseComponent,
                    AcPointComponent,
                    AcBillboardComponent,
                    AcHtmlComponent,
                    AcCircleComponent,
                    AcArcComponent,
                    AcPolygonDescComponent,
                    AcPolygonComponent,
                    AcDefaultPlonterComponent,
                    AcModelDescComponent,
                    AcTileset3dComponent,
                    AcBoxDescComponent,
                    AcCylinderDescComponent,
                    AcCorridorDescComponent,
                    AcEllipsoidDescComponent,
                    AcPolylineVolumeDescComponent,
                    AcWallDescComponent,
                    AcRectangleDescComponent,
                    AcContextMenuWrapperComponent,
                    AcPointPrimitiveDescComponent,
                    AcHtmlDescComponent,
                    AcArrayDescComponent,
                    AcCzmlDescComponent,
                    AcStaticEllipseDescComponent,
                    AcDynamicEllipseDescComponent,
                    AcDynamicPolylineDescComponent,
                    AcStaticPolylineDescComponent,
                    AcDynamicCircleDescComponent,
                    AcStaticCircleDescComponent,
                    AcStaticPolygonDescComponent,
                ],
                providers: [JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService],
            },] }
];
/** @nocollapse */
AngularCesiumModule.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vYW5ndWxhci1jZXNpdW0ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFl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QUFrQjtvQkFDbEIseUJBQXlCO29CQUN6QixvQkFBb0I7b0JBQ3BCLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQix1QkFBdUI7b0JBQ3ZCLHVCQUF1QjtvQkFDdkIsd0JBQXdCO29CQUN4Qiw2QkFBNkI7b0JBQzdCLG1CQUFtQjtvQkFDbkIsd0JBQXdCO29CQUN4Qiw2QkFBNkI7b0JBQzdCLDZCQUE2QjtvQkFDN0IsbUJBQW1CO29CQUNuQixvQkFBb0I7b0JBQ3BCLG1CQUFtQjtvQkFFbkIsNEJBQTRCO29CQUM1Qiw2QkFBNkI7b0JBQzdCLDhCQUE4QjtvQkFDOUIsNkJBQTZCO29CQUM3Qiw0QkFBNEI7b0JBQzVCLDJCQUEyQjtvQkFDM0IsNEJBQTRCO2lCQUM3QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQzthQUNwSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNCaWxsYm9hcmRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkL2FjLWJpbGxib2FyZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNCaWxsYm9hcmREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJpbGxib3JhZC1kZXNjL2FjLWJpbGxib3JhZC1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY0VsbGlwc2VEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWVsbGlwc2UtZGVzYy9hYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjUG9seWxpbmVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvbHlsaW5lLWRlc2MvYWMtcG9seWxpbmUtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQW5ndWxhcjJQYXJzZU1vZHVsZSwgUElQRVNfQ09ORklHIH0gZnJvbSAnYW5ndWxhcjJwYXJzZSc7XG5pbXBvcnQgeyBQaXhlbE9mZnNldFBpcGUgfSBmcm9tICcuL3BpcGVzL3BpeGVsLW9mZnNldC9waXhlbC1vZmZzZXQucGlwZSc7XG5pbXBvcnQgeyBSYWRpYW5zVG9EZWdyZWVzUGlwZSB9IGZyb20gJy4vcGlwZXMvcmFkaWFucy10by1kZWdyZWVzL3JhZGlhbnMtdG8tZGVncmVlcy5waXBlJztcbmltcG9ydCB7IEpzb25NYXBwZXIgfSBmcm9tICcuL3NlcnZpY2VzL2pzb24tbWFwcGVyL2pzb24tbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0xhYmVsRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1sYWJlbC1kZXNjL2FjLWxhYmVsLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IFV0aWxzTW9kdWxlIH0gZnJvbSAnLi91dGlscy91dGlscy5tb2R1bGUnO1xuaW1wb3J0IHsgVmlld2VyRmFjdG9yeSB9IGZyb20gJy4vc2VydmljZXMvdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZSc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0NpcmNsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtY2lyY2xlLWRlc2MvYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjQXJjRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1hcmMtZGVzYy9hYy1hcmMtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNNYXBMYXllclByb3ZpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLW1hcC1sYXllci1wcm92aWRlci9hYy1tYXAtbGF5ZXItcHJvdmlkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEFjUG9pbnREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvaW50LWRlc2MvYWMtcG9pbnQtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNMYWJlbENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1sYWJlbC9hYy1sYWJlbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNQb2x5bGluZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2x5bGluZS9hYy1wb2x5bGluZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNFbGxpcHNlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWVsbGlwc2UvYWMtZWxsaXBzZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNQb2ludENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2ludC9hYy1wb2ludC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNIdG1sQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWh0bWwvYWMtaHRtbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNDaXJjbGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtY2lyY2xlL2FjLWNpcmNsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNBcmNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtYXJjL2FjLWFyYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNQb2x5Z29uRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2x5Z29uLWRlc2MvYWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY0RlZmF1bHRQbG9udGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWRlZmF1bHQtcGxvbnRlci9hYy1kZWZhdWx0LXBsb250ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEFjUG9seWdvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2x5Z29uL2FjLXBvbHlnb24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjU3RhdGljRWxsaXBzZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy9hYy1zdGF0aWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY0R5bmFtaWNFbGxpcHNlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNEeW5hbWljUG9seWxpbmVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLWR5bmFtaWMtcG9seWxpbmUtZGVzYy9hYy1keW5hbWljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjU3RhdGljUG9seWdvbkRlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLXBvbHlnb24tZGVzYy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY1N0YXRpY0NpcmNsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWNpcmNsZS1kZXNjL2FjLXN0YXRpYy1jaXJjbGUtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNEeW5hbWljQ2lyY2xlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWNpcmNsZS1kZXNjL2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjU3RhdGljUG9seWxpbmVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY01vZGVsRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1tb2RlbC1kZXNjL2FjLW1vZGVsLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjVGlsZXNldDNkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLTNkLXRpbGVzZXQvYWMtdGlsZXNldC0zZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNCb3hEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJveC1kZXNjL2FjLWJveC1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY0N5bGluZGVyRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1jeWxpbmRlci1kZXNjL2FjLWN5bGluZGVyLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjQ29ycmlkb3JEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWNvcnJpZG9yLWRlc2MvYWMtY29ycmlkb3ItZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNFbGxpcHNvaWREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWVsbGlwc29pZC1kZXNjL2FjLWVsbGlwc29pZC1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY1BvbHlsaW5lVm9sdW1lRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2x5bGluZS12b2x1bWUtZGVzYy9hYy1wb2x5bGluZS12b2x1bWUtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNXYWxsRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy13YWxsLWRlc2MvYWMtd2FsbC1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY1JlY3RhbmdsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcmVjdGFuZ2xlLWRlc2MvYWMtcmVjdGFuZ2xlLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY0xhYmVsUHJpbWl0aXZlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYy9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNQb2x5bGluZVByaW1pdGl2ZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MvYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50JztcbmltcG9ydCB7IE1vZHVsZUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL21vZGVscy9tb2R1bGUtb3B0aW9ucyc7XG5pbXBvcnQgeyBBTkdVTEFSX0NFU0lVTV9DT05GSUcsIENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV4dGVuZGVyIH0gZnJvbSAnLi4vY2VzaXVtLWV4dGVuZGVyL2V4dGVuZGVyJztcbmltcG9ydCB7IEFjSHRtbERlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtaHRtbC1kZXNjL2FjLWh0bWwtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNIdG1sRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2FjLWh0bWwvYWMtaHRtbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQWNIdG1sQ29udGFpbmVyRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2FjLWh0bWwtY29udGFpbmVyL2FjLWh0bWwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBY0NvbnRleHRNZW51V3JhcHBlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNBcnJheURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtYXJyYXktZGVzYy9hYy1hcnJheS1kZXNjLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBY1BvaW50UHJpbWl0aXZlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2ludC1wcmltaXRpdmUtZGVzYy9hYy1wb2ludC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNQcmltaXRpdmVQb2x5bGluZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wcmltaXRpdmUtcG9seWxpbmUvYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgUEFSU0VfUElQRVNfQ09ORklHX01BUCBmcm9tICcuL3BpcGVzL3BpcGUtY29uZmlnLW1hcCc7XG5cbmltcG9ydCB7IEFjQ3ptbERlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtY3ptbC1kZXNjL2FjLWN6bWwtZGVzYy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEFuZ3VsYXIyUGFyc2VNb2R1bGUsXG4gICAgVXRpbHNNb2R1bGUsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFjTWFwQ29tcG9uZW50LFxuICAgIEFjTGF5ZXJDb21wb25lbnQsXG4gICAgQWNCaWxsYm9hcmRDb21wb25lbnQsXG4gICAgQWNCaWxsYm9hcmREZXNjQ29tcG9uZW50LFxuICAgIEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcbiAgICBBY0xhYmVsRGVzY0NvbXBvbmVudCxcbiAgICBBY0xhYmVsUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcbiAgICBBY0VsbGlwc2VEZXNjQ29tcG9uZW50LFxuICAgIEFjUG9seWxpbmVEZXNjQ29tcG9uZW50LFxuICAgIEFjUG9seWxpbmVQcmltaXRpdmVEZXNjQ29tcG9uZW50LFxuICAgIFBpeGVsT2Zmc2V0UGlwZSxcbiAgICBSYWRpYW5zVG9EZWdyZWVzUGlwZSxcbiAgICBBY0NpcmNsZURlc2NDb21wb25lbnQsXG4gICAgQWNBcmNEZXNjQ29tcG9uZW50LFxuICAgIEFjTWFwTGF5ZXJQcm92aWRlckNvbXBvbmVudCxcbiAgICBBY1BvaW50RGVzY0NvbXBvbmVudCxcbiAgICBBY0xhYmVsQ29tcG9uZW50LFxuICAgIEFjUG9seWxpbmVDb21wb25lbnQsXG4gICAgQWNQcmltaXRpdmVQb2x5bGluZUNvbXBvbmVudCxcbiAgICBBY0VsbGlwc2VDb21wb25lbnQsXG4gICAgQWNQb2ludENvbXBvbmVudCxcbiAgICBBY0JpbGxib2FyZENvbXBvbmVudCxcbiAgICBBY0h0bWxDb21wb25lbnQsXG4gICAgQWNDaXJjbGVDb21wb25lbnQsXG4gICAgQWNBcmNDb21wb25lbnQsXG4gICAgQWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcbiAgICBBY1BvbHlnb25Db21wb25lbnQsXG4gICAgQWNEZWZhdWx0UGxvbnRlckNvbXBvbmVudCxcbiAgICBBY01vZGVsRGVzY0NvbXBvbmVudCxcbiAgICBBY1RpbGVzZXQzZENvbXBvbmVudCxcbiAgICBBY0JveERlc2NDb21wb25lbnQsXG4gICAgQWNDeWxpbmRlckRlc2NDb21wb25lbnQsXG4gICAgQWNDb3JyaWRvckRlc2NDb21wb25lbnQsXG4gICAgQWNFbGxpcHNvaWREZXNjQ29tcG9uZW50LFxuICAgIEFjUG9seWxpbmVWb2x1bWVEZXNjQ29tcG9uZW50LFxuICAgIEFjV2FsbERlc2NDb21wb25lbnQsXG4gICAgQWNSZWN0YW5nbGVEZXNjQ29tcG9uZW50LFxuICAgIEFjQ29udGV4dE1lbnVXcmFwcGVyQ29tcG9uZW50LFxuICAgIEFjUG9pbnRQcmltaXRpdmVEZXNjQ29tcG9uZW50LFxuICAgIEFjSHRtbERlc2NDb21wb25lbnQsXG4gICAgQWNIdG1sRGlyZWN0aXZlLFxuICAgIEFjSHRtbENvbnRhaW5lckRpcmVjdGl2ZSxcbiAgICBBY0FycmF5RGVzY0NvbXBvbmVudCxcbiAgICBBY0N6bWxEZXNjQ29tcG9uZW50LFxuXG4gICAgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcbiAgICBBY0R5bmFtaWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcbiAgICBBY0R5bmFtaWNQb2x5bGluZURlc2NDb21wb25lbnQsXG4gICAgQWNTdGF0aWNQb2x5bGluZURlc2NDb21wb25lbnQsXG4gICAgQWNEeW5hbWljQ2lyY2xlRGVzY0NvbXBvbmVudCxcbiAgICBBY1N0YXRpY0NpcmNsZURlc2NDb21wb25lbnQsXG4gICAgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEFjTWFwQ29tcG9uZW50LFxuICAgIEFjQmlsbGJvYXJkQ29tcG9uZW50LFxuICAgIEFjQmlsbGJvYXJkRGVzY0NvbXBvbmVudCxcbiAgICBBY0JpbGxib2FyZFByaW1pdGl2ZURlc2NDb21wb25lbnQsXG4gICAgQWNMYWJlbERlc2NDb21wb25lbnQsXG4gICAgQWNMYWJlbFByaW1pdGl2ZURlc2NDb21wb25lbnQsXG4gICAgQWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcbiAgICBBY1BvbHlsaW5lRGVzY0NvbXBvbmVudCxcbiAgICBBY1BvbHlsaW5lUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcbiAgICBBY0xheWVyQ29tcG9uZW50LFxuICAgIEFjQ2lyY2xlRGVzY0NvbXBvbmVudCxcbiAgICBBY0FyY0Rlc2NDb21wb25lbnQsXG4gICAgQWNNYXBMYXllclByb3ZpZGVyQ29tcG9uZW50LFxuICAgIEFjUG9pbnREZXNjQ29tcG9uZW50LFxuICAgIEFjTGFiZWxDb21wb25lbnQsXG4gICAgQWNQb2x5bGluZUNvbXBvbmVudCxcbiAgICBBY1ByaW1pdGl2ZVBvbHlsaW5lQ29tcG9uZW50LFxuICAgIEFjRWxsaXBzZUNvbXBvbmVudCxcbiAgICBBY1BvaW50Q29tcG9uZW50LFxuICAgIEFjQmlsbGJvYXJkQ29tcG9uZW50LFxuICAgIEFjSHRtbENvbXBvbmVudCxcbiAgICBBY0NpcmNsZUNvbXBvbmVudCxcbiAgICBBY0FyY0NvbXBvbmVudCxcbiAgICBBY1BvbHlnb25EZXNjQ29tcG9uZW50LFxuICAgIEFjUG9seWdvbkNvbXBvbmVudCxcbiAgICBBY0RlZmF1bHRQbG9udGVyQ29tcG9uZW50LFxuICAgIEFjTW9kZWxEZXNjQ29tcG9uZW50LFxuICAgIEFjVGlsZXNldDNkQ29tcG9uZW50LFxuICAgIEFjQm94RGVzY0NvbXBvbmVudCxcbiAgICBBY0N5bGluZGVyRGVzY0NvbXBvbmVudCxcbiAgICBBY0NvcnJpZG9yRGVzY0NvbXBvbmVudCxcbiAgICBBY0VsbGlwc29pZERlc2NDb21wb25lbnQsXG4gICAgQWNQb2x5bGluZVZvbHVtZURlc2NDb21wb25lbnQsXG4gICAgQWNXYWxsRGVzY0NvbXBvbmVudCxcbiAgICBBY1JlY3RhbmdsZURlc2NDb21wb25lbnQsXG4gICAgQWNDb250ZXh0TWVudVdyYXBwZXJDb21wb25lbnQsXG4gICAgQWNQb2ludFByaW1pdGl2ZURlc2NDb21wb25lbnQsXG4gICAgQWNIdG1sRGVzY0NvbXBvbmVudCxcbiAgICBBY0FycmF5RGVzY0NvbXBvbmVudCxcbiAgICBBY0N6bWxEZXNjQ29tcG9uZW50LFxuXG4gICAgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcbiAgICBBY0R5bmFtaWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcbiAgICBBY0R5bmFtaWNQb2x5bGluZURlc2NDb21wb25lbnQsXG4gICAgQWNTdGF0aWNQb2x5bGluZURlc2NDb21wb25lbnQsXG4gICAgQWNEeW5hbWljQ2lyY2xlRGVzY0NvbXBvbmVudCxcbiAgICBBY1N0YXRpY0NpcmNsZURlc2NDb21wb25lbnQsXG4gICAgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbSnNvbk1hcHBlciwgQ2VzaXVtUHJvcGVydGllcywgR2VvVXRpbHNTZXJ2aWNlLCBWaWV3ZXJGYWN0b3J5LCBNYXBzTWFuYWdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb25TZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckNlc2l1bU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IE1vZHVsZUNvbmZpZ3VyYXRpb24pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJDZXNpdW1Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IEFOR1VMQVJfQ0VTSVVNX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZ30sXG4gICAgICAgIHtwcm92aWRlOiBQSVBFU19DT05GSUcsIG11bHRpOiB0cnVlLCB1c2VWYWx1ZTogY29uZmlnICYmIGNvbmZpZy5jdXN0b21QaXBlcyB8fCBbXX0sXG4gICAgICAgIHtwcm92aWRlOiBQSVBFU19DT05GSUcsIG11bHRpOiB0cnVlLCB1c2VWYWx1ZTogUEFSU0VfUElQRVNfQ09ORklHX01BUH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDZXNpdW1FeHRlbmRlci5leHRlbmQoKTtcbiAgfVxufVxuIl19
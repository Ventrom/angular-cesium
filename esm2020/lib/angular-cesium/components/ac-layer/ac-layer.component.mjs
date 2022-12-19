import { from as observableFrom, merge as observableMerge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// tslint:disable
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service';
import { StaticPolylineDrawerService } from '../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service';
import { StaticPolygonDrawerService } from '../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service';
import { StaticEllipseDrawerService } from '../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service';
import { ModelDrawerService } from '../../services/drawers/model-drawer/model-drawer.service';
import { BoxDrawerService } from '../../services/drawers/box-dawer/box-drawer.service';
import { CorridorDrawerService } from '../../services/drawers/corridor-dawer/corridor-drawer.service';
import { CylinderDrawerService } from '../../services/drawers/cylinder-dawer/cylinder-drawer.service';
import { EllipsoidDrawerService } from '../../services/drawers/ellipoid-drawer/ellipsoid-drawer.service';
import { PolylineVolumeDrawerService } from '../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service';
import { WallDrawerService } from '../../services/drawers/wall-dawer/wall-drawer.service';
import { RectangleDrawerService } from '../../services/drawers/rectangle-dawer/rectangle-drawer.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
import { LabelPrimitiveDrawerService } from '../../services/drawers/label-primitive-drawer/label-primitive-drawer.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../../services/computation-cache/computation-cache.service";
import * as i3 from "../../services/map-layers/map-layers.service";
import * as i4 from "../../services/drawers/billboard-drawer/billboard-drawer.service";
import * as i5 from "../../services/drawers/label-drawer/label-drawer.service";
import * as i6 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i7 from "../../services/drawers/polyline-drawer/polyline-drawer.service";
import * as i8 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i9 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i10 from "../../services/drawers/point-drawer/point-drawer.service";
import * as i11 from "../../services/drawers/model-drawer/model-drawer.service";
import * as i12 from "../../services/drawers/box-dawer/box-drawer.service";
import * as i13 from "../../services/drawers/corridor-dawer/corridor-drawer.service";
import * as i14 from "../../services/drawers/cylinder-dawer/cylinder-drawer.service";
import * as i15 from "../../services/drawers/ellipoid-drawer/ellipsoid-drawer.service";
import * as i16 from "../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service";
import * as i17 from "../../services/drawers/wall-dawer/wall-drawer.service";
import * as i18 from "../../services/drawers/rectangle-dawer/rectangle-drawer.service";
import * as i19 from "../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service";
import * as i20 from "../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service";
import * as i21 from "../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service";
import * as i22 from "../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service";
import * as i23 from "../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service";
import * as i24 from "../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service";
import * as i25 from "../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service";
import * as i26 from "../../services/drawers/label-primitive-drawer/label-primitive-drawer.service";
import * as i27 from "../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service";
import * as i28 from "../../services/drawers/point-primitive-drawer/point-primitive-drawer.service";
import * as i29 from "../../services/drawers/html-drawer/html-drawer.service";
import * as i30 from "../../services/drawers/czml-drawer/czml-drawer.service";
// tslint:enable
/**
 *  This is a ac-layer implementation.
 *  The ac-layer element must be a child of ac-map element.
 *  + acFor `{string}` - get the tracked observable and entityName (see the example).
 *  + show `{boolean}` - show/hide layer's entities.
 *  + context `{any}` - get the context layer that will use the componnet (most of the time equal to "this").
 *  + options `{LayerOptions}` - sets the layer options for each drawer.
 *  + zIndex `{number}` - controls the zIndex (order) of the layer, layers with greater zIndex will be in front of layers with lower zIndex
 *    (Exception For `Billboard` and `Label`, should use `[eyeOffset]` prop instead)</br>
 *    zIndex won't work for pritimitve descs (like ac-primitive-polyline...)
 *  + debug `{boolean}` - prints every acNotification
 *
 *
 *  __Usage :__
 *  ```
 *  <ac-map>
 *    <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [options]="options" [zIndex]="1">
 *      <ac-billboard-desc props="{
 *        image: track.image,
 *        position: track.position,
 *        scale: track.scale,
 *        color: track.color,
 *        name: track.name
 *      }">
 *      </ac-billboard-desc>
 *        <ac-label-desc props="{
 *          position: track.position,
 *          pixelOffset : [-15,20] | pixelOffset,
 *          text: track.name,
 *          font: '15px sans-serif'
 *        }">
 *      </ac-label-desc>
 *    </ac-layer>
 *  </ac-map>
 *  ```
 */
export class AcLayerComponent {
    constructor(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
        this.debug = false;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.stopObservable = new Subject();
        this._updateStream = new Subject();
        this.entitiesStore = new Map();
        this.layerDrawerDataSources = [];
        this._drawerList = new Map([
            ['billboard', billboardDrawerService],
            ['label', labelDrawerService],
            ['ellipse', ellipseDrawerService],
            ['polyline', polylineDrawerService],
            ['polygon', polygonDrawerService],
            ['arc', arcDrawerService],
            ['point', pointDrawerService],
            ['model', modelDrawerService],
            ['box', boxDrawerService],
            ['corridor', corridorDrawerService],
            ['cylinder', cylinderDrawerService],
            ['ellipsoid', ellipsoidDrawerSerice],
            ['polylineVolume', polylineVolumeDrawerService],
            ['rectangle', rectangleDrawerService],
            ['wall', wallDrawerService],
            ['polylinePrimitive', polylinePrimitiveDrawerService],
            ['labelPrimitive', labelPrimitiveDrawerService],
            ['billboardPrimitive', billboardPrimitiveDrawerService],
            ['pointPrimitive', pointPrimitiveDrawerService],
            ['html', htmlDrawerService],
            ['czml', czmlDrawerService],
            ['dynamicEllipse', dynamicEllipseDrawerService],
            ['dynamicPolyline', dynamicPolylineDrawerService],
            ['staticCircle', staticCircleDrawerService],
            ['staticPolyline', staticPolylineDrawerService],
            ['staticPolygon', staticPolygonDrawerService],
            ['staticEllipse', staticEllipseDrawerService],
        ]);
    }
    init() {
        this.initValidParams();
        observableMerge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((notification) => {
            this._computationCache.clear();
            if (this.debug) {
                console.log('AcLayer received notification:', notification);
            }
            let contextEntity = notification.entity;
            if (this.store) {
                contextEntity = this.updateStore(notification);
            }
            this.context[this.entityName] = contextEntity;
            this.layerService.getDescriptions().forEach((descriptionComponent) => {
                switch (notification.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(this.context, notification.id, contextEntity);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(notification.id);
                        break;
                    default:
                        console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
                }
            });
        });
    }
    updateStore(notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                const entity = this.entitiesStore.get(notification.id);
                Object.assign(entity, notification.entity);
                return entity;
            }
            else {
                this.entitiesStore.set(notification.id, notification.entity);
                return notification.entity;
            }
        }
    }
    initValidParams() {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${this.acFor}`);
        }
        const acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    }
    /** Test for a rxjs Observable */
    isObservable(obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    }
    ngAfterContentInit() {
        this.init();
    }
    ngOnInit() {
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((drawer, drawerName) => {
            const initOptions = this.options ? this.options[drawerName] : undefined;
            const drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                this.layerDrawerDataSources.push(...drawerDataSources);
            }
            drawer.setShow(this.show);
        });
    }
    ngOnChanges(changes) {
        if (changes.show && !changes.show.firstChange) {
            const showValue = changes['show'].currentValue;
            this.layerService.show = showValue;
            this._drawerList.forEach((drawer) => drawer.setShow(showValue));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            const zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    }
    ngOnDestroy() {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    }
    getLayerService() {
        return this.layerService;
    }
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    getLayerDrawerDataSources() {
        return this.layerDrawerDataSources;
    }
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name) {
        return this.layerDrawerDataSources.filter(d => d.name === name);
    }
    /**
     * Returns the store.
     */
    getStore() {
        return this.entitiesStore;
    }
    /**
     * Remove all the entities from the layer.
     */
    removeAll() {
        this.layerService.getDescriptions().forEach((description) => description.removeAll());
        this.entitiesStore.clear();
    }
    /**
     * remove entity from the layer
     */
    remove(entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    }
    /**
     * add/update entity to/from the layer
     */
    updateNotification(notification) {
        this._updateStream.next(notification);
    }
    /**
     * add/update entity to/from the layer
     */
    update(entity, id) {
        this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
    }
    refreshAll(collection) {
        // TODO make entity interface: collection of type entity not notification
        observableFrom(collection).subscribe((entity) => this._updateStream.next(entity));
    }
}
AcLayerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcLayerComponent, deps: [{ token: i1.LayerService }, { token: i2.ComputationCache }, { token: i3.MapLayersService }, { token: i4.BillboardDrawerService }, { token: i5.LabelDrawerService }, { token: i6.EllipseDrawerService }, { token: i7.PolylineDrawerService }, { token: i8.PolygonDrawerService }, { token: i9.ArcDrawerService }, { token: i10.PointDrawerService }, { token: i11.ModelDrawerService }, { token: i12.BoxDrawerService }, { token: i13.CorridorDrawerService }, { token: i14.CylinderDrawerService }, { token: i15.EllipsoidDrawerService }, { token: i16.PolylineVolumeDrawerService }, { token: i17.WallDrawerService }, { token: i18.RectangleDrawerService }, { token: i19.DynamicEllipseDrawerService }, { token: i20.DynamicPolylineDrawerService }, { token: i21.StaticCircleDrawerService }, { token: i22.StaticPolylineDrawerService }, { token: i23.StaticPolygonDrawerService }, { token: i24.StaticEllipseDrawerService }, { token: i25.PolylinePrimitiveDrawerService }, { token: i26.LabelPrimitiveDrawerService }, { token: i27.BillboardPrimitiveDrawerService }, { token: i28.PointPrimitiveDrawerService }, { token: i29.HtmlDrawerService }, { token: i30.CzmlDrawerService }], target: i0.ɵɵFactoryTarget.Component });
AcLayerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcLayerComponent, selector: "ac-layer", inputs: { show: "show", acFor: "acFor", context: "context", store: "store", options: "options", zIndex: "zIndex", debug: "debug" }, providers: [
        LayerService,
        ComputationCache,
        BillboardDrawerService,
        LabelDrawerService,
        EllipseDrawerService,
        PolylineDrawerService,
        ArcDrawerService,
        PointDrawerService,
        PolygonDrawerService,
        ModelDrawerService,
        BoxDrawerService,
        CorridorDrawerService,
        CylinderDrawerService,
        EllipsoidDrawerService,
        PolylineVolumeDrawerService,
        WallDrawerService,
        RectangleDrawerService,
        PolylinePrimitiveDrawerService,
        LabelPrimitiveDrawerService,
        BillboardPrimitiveDrawerService,
        PointPrimitiveDrawerService,
        HtmlDrawerService,
        CzmlDrawerService,
        DynamicEllipseDrawerService,
        DynamicPolylineDrawerService,
        StaticCircleDrawerService,
        StaticPolylineDrawerService,
        StaticPolygonDrawerService,
        StaticEllipseDrawerService,
    ], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcLayerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-layer',
                    template: '<ng-content></ng-content>',
                    providers: [
                        LayerService,
                        ComputationCache,
                        BillboardDrawerService,
                        LabelDrawerService,
                        EllipseDrawerService,
                        PolylineDrawerService,
                        ArcDrawerService,
                        PointDrawerService,
                        PolygonDrawerService,
                        ModelDrawerService,
                        BoxDrawerService,
                        CorridorDrawerService,
                        CylinderDrawerService,
                        EllipsoidDrawerService,
                        PolylineVolumeDrawerService,
                        WallDrawerService,
                        RectangleDrawerService,
                        PolylinePrimitiveDrawerService,
                        LabelPrimitiveDrawerService,
                        BillboardPrimitiveDrawerService,
                        PointPrimitiveDrawerService,
                        HtmlDrawerService,
                        CzmlDrawerService,
                        DynamicEllipseDrawerService,
                        DynamicPolylineDrawerService,
                        StaticCircleDrawerService,
                        StaticPolylineDrawerService,
                        StaticPolygonDrawerService,
                        StaticEllipseDrawerService,
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.LayerService }, { type: i2.ComputationCache }, { type: i3.MapLayersService }, { type: i4.BillboardDrawerService }, { type: i5.LabelDrawerService }, { type: i6.EllipseDrawerService }, { type: i7.PolylineDrawerService }, { type: i8.PolygonDrawerService }, { type: i9.ArcDrawerService }, { type: i10.PointDrawerService }, { type: i11.ModelDrawerService }, { type: i12.BoxDrawerService }, { type: i13.CorridorDrawerService }, { type: i14.CylinderDrawerService }, { type: i15.EllipsoidDrawerService }, { type: i16.PolylineVolumeDrawerService }, { type: i17.WallDrawerService }, { type: i18.RectangleDrawerService }, { type: i19.DynamicEllipseDrawerService }, { type: i20.DynamicPolylineDrawerService }, { type: i21.StaticCircleDrawerService }, { type: i22.StaticPolylineDrawerService }, { type: i23.StaticPolygonDrawerService }, { type: i24.StaticEllipseDrawerService }, { type: i25.PolylinePrimitiveDrawerService }, { type: i26.LabelPrimitiveDrawerService }, { type: i27.BillboardPrimitiveDrawerService }, { type: i28.PointPrimitiveDrawerService }, { type: i29.HtmlDrawerService }, { type: i30.CzmlDrawerService }]; }, propDecorators: { show: [{
                type: Input
            }], acFor: [{
                type: Input
            }], context: [{
                type: Input
            }], store: [{
                type: Input
            }], options: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], debug: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxLQUFLLElBQUksZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsaUJBQWlCO0FBQ2pCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRWxGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUc5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVwRyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxRkFBcUYsQ0FBQztB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Q3RCLGtCQUFrQjt3QkFDbEIsb0JBQW9CO3dCQUNwQixxQkFBcUI7d0JBQ3JCLGdCQUFnQjt3QkFDaEIsa0JBQWtCO3dCQUNsQixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixxQkFBcUI7d0JBQ3JCLHFCQUFxQjt3QkFDckIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLGlCQUFpQjt3QkFDakIsc0JBQXNCO3dCQUN0Qiw4QkFBOEI7d0JBQzlCLDJCQUEyQjt3QkFDM0IsK0JBQStCO3dCQUMvQiwyQkFBMkI7d0JBQzNCLGlCQUFpQjt3QkFDakIsaUJBQWlCO3dCQUVqQiwyQkFBMkI7d0JBQzNCLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6QiwyQkFBMkI7d0JBQzNCLDBCQUEwQjt3QkFDMUIsMEJBQTBCO3FCQUMzQjtvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7MHFDQUdDLElBQUk7c0JBREgsS0FBSztnQkFHTixLQUFLO3NCQURKLEtBQUs7Z0JBR04sT0FBTztzQkFETixLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSztnQkFHTixPQUFPO3NCQUROLEtBQUs7Z0JBR04sTUFBTTtzQkFETCxLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZyb20gYXMgb2JzZXJ2YWJsZUZyb20sIG1lcmdlIGFzIG9ic2VydmFibGVNZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4vLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQmlsbGJvYXJkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLWRyYXdlci9iaWxsYm9hcmQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1kcmF3ZXIvbGFiZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1kcmF3ZXIvcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1kcmF3ZXIvcG9pbnQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9sYXllci1vcHRpb25zJztcbmltcG9ydCB7IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNb2RlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL21vZGVsLWRyYXdlci9tb2RlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCb3hEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9ib3gtZGF3ZXIvYm94LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvcnJpZG9yRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY29ycmlkb3ItZGF3ZXIvY29ycmlkb3ItZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jeWxpbmRlci1kYXdlci9jeWxpbmRlci1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcG9pZC1kcmF3ZXIvZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtdm9sdW1lLWRhd2VyL3BvbHlsaW5lLXZvbHVtZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBXYWxsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvd2FsbC1kYXdlci93YWxsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3RhbmdsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3JlY3RhbmdsZS1kYXdlci9yZWN0YW5nbGUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtcHJpbWl0aXZlLWRyYXdlci9wb2ludC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSHRtbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2h0bWwtZHJhd2VyL2h0bWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3ptbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N6bWwtZHJhd2VyL2N6bWwtZHJhd2VyLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG4vKipcbiAqICBUaGlzIGlzIGEgYWMtbGF5ZXIgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxheWVyIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogICsgYWNGb3IgYHtzdHJpbmd9YCAtIGdldCB0aGUgdHJhY2tlZCBvYnNlcnZhYmxlIGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxuICogICsgc2hvdyBge2Jvb2xlYW59YCAtIHNob3cvaGlkZSBsYXllcidzIGVudGl0aWVzLlxuICogICsgY29udGV4dCBge2FueX1gIC0gZ2V0IHRoZSBjb250ZXh0IGxheWVyIHRoYXQgd2lsbCB1c2UgdGhlIGNvbXBvbm5ldCAobW9zdCBvZiB0aGUgdGltZSBlcXVhbCB0byBcInRoaXNcIikuXG4gKiAgKyBvcHRpb25zIGB7TGF5ZXJPcHRpb25zfWAgLSBzZXRzIHRoZSBsYXllciBvcHRpb25zIGZvciBlYWNoIGRyYXdlci5cbiAqICArIHpJbmRleCBge251bWJlcn1gIC0gY29udHJvbHMgdGhlIHpJbmRleCAob3JkZXIpIG9mIHRoZSBsYXllciwgbGF5ZXJzIHdpdGggZ3JlYXRlciB6SW5kZXggd2lsbCBiZSBpbiBmcm9udCBvZiBsYXllcnMgd2l0aCBsb3dlciB6SW5kZXhcbiAqICAgIChFeGNlcHRpb24gRm9yIGBCaWxsYm9hcmRgIGFuZCBgTGFiZWxgLCBzaG91bGQgdXNlIGBbZXllT2Zmc2V0XWAgcHJvcCBpbnN0ZWFkKTwvYnI+XG4gKiAgICB6SW5kZXggd29uJ3Qgd29yayBmb3IgcHJpdGltaXR2ZSBkZXNjcyAobGlrZSBhYy1wcmltaXRpdmUtcG9seWxpbmUuLi4pXG4gKiAgKyBkZWJ1ZyBge2Jvb2xlYW59YCAtIHByaW50cyBldmVyeSBhY05vdGlmaWNhdGlvblxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICA8YWMtbWFwPlxuICogICAgPGFjLWxheWVyIGFjRm9yPVwibGV0IHRyYWNrIG9mIHRyYWNrcyRcIiBbc2hvd109XCJzaG93XCIgW2NvbnRleHRdPVwidGhpc1wiIFtvcHRpb25zXT1cIm9wdGlvbnNcIiBbekluZGV4XT1cIjFcIj5cbiAqICAgICAgPGFjLWJpbGxib2FyZC1kZXNjIHByb3BzPVwie1xuICogICAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcbiAqICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgICAgc2NhbGU6IHRyYWNrLnNjYWxlLFxuICogICAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcbiAqICAgICAgICBuYW1lOiB0cmFjay5uYW1lXG4gKiAgICAgIH1cIj5cbiAqICAgICAgPC9hYy1iaWxsYm9hcmQtZGVzYz5cbiAqICAgICAgICA8YWMtbGFiZWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICAgIHBpeGVsT2Zmc2V0IDogWy0xNSwyMF0gfCBwaXhlbE9mZnNldCxcbiAqICAgICAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXG4gKiAgICAgICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgICAgIH1cIj5cbiAqICAgICAgPC9hYy1sYWJlbC1kZXNjPlxuICogICAgPC9hYy1sYXllcj5cbiAqICA8L2FjLW1hcD5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbGF5ZXInLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBwcm92aWRlcnM6IFtcbiAgICBMYXllclNlcnZpY2UsXG4gICAgQ29tcHV0YXRpb25DYWNoZSxcbiAgICBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgIExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgQXJjRHJhd2VyU2VydmljZSxcbiAgICBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgTW9kZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEJveERyYXdlclNlcnZpY2UsXG4gICAgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlLFxuICAgIEN5bGluZGVyRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSxcbiAgICBXYWxsRHJhd2VyU2VydmljZSxcbiAgICBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgSHRtbERyYXdlclNlcnZpY2UsXG4gICAgQ3ptbERyYXdlclNlcnZpY2UsXG5cbiAgICBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEFjTGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG4gIEBJbnB1dCgpXG4gIGFjRm9yOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGNvbnRleHQ6IGFueTtcbiAgQElucHV0KClcbiAgc3RvcmUgPSBmYWxzZTtcbiAgQElucHV0KClcbiAgb3B0aW9uczogTGF5ZXJPcHRpb25zO1xuICBASW5wdXQoKVxuICB6SW5kZXggPSAwO1xuICBASW5wdXQoKVxuICBkZWJ1ZyA9IGZhbHNlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYWNGb3JSZ3ggPSAvXmxldFxccysuK1xccytvZlxccysuKyQvO1xuICBwcml2YXRlIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBzdG9wT2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEFjTm90aWZpY2F0aW9uPjtcbiAgcHJpdmF0ZSBfZHJhd2VyTGlzdDogTWFwPHN0cmluZywgQmFzaWNEcmF3ZXJTZXJ2aWNlPjtcbiAgcHJpdmF0ZSBfdXBkYXRlU3RyZWFtOiBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPiA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwcml2YXRlIGVudGl0aWVzU3RvcmUgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICBwcml2YXRlIGxheWVyRHJhd2VyRGF0YVNvdXJjZXM6IGFueVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtYXBMYXllcnNTZXJ2aWNlOiBNYXBMYXllcnNTZXJ2aWNlLFxuICAgICAgICAgICAgICBiaWxsYm9hcmREcmF3ZXJTZXJ2aWNlOiBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZWxsaXBzZURyYXdlclNlcnZpY2U6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBhcmNEcmF3ZXJTZXJ2aWNlOiBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2ludERyYXdlclNlcnZpY2U6IFBvaW50RHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgbW9kZWxEcmF3ZXJTZXJ2aWNlOiBNb2RlbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGJveERyYXdlclNlcnZpY2U6IEJveERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvcnJpZG9yRHJhd2VyU2VydmljZTogQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjeWxpbmRlckRyYXdlclNlcnZpY2U6IEN5bGluZGVyRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZWxsaXBzb2lkRHJhd2VyU2VyaWNlOiBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgd2FsbERyYXdlclNlcnZpY2U6IFdhbGxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICByZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBkeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2U6IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZTogRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZTogU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2U6IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgbGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBodG1sRHJhd2VyU2VydmljZTogSHRtbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGN6bWxEcmF3ZXJTZXJ2aWNlOiBDem1sRHJhd2VyU2VydmljZVxuICApIHtcbiAgICB0aGlzLl9kcmF3ZXJMaXN0ID0gbmV3IE1hcChbXG4gICAgICBbJ2JpbGxib2FyZCcsIGJpbGxib2FyZERyYXdlclNlcnZpY2VdLFxuICAgICAgWydsYWJlbCcsIGxhYmVsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2VsbGlwc2UnLCBlbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlsaW5lJywgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWdvbicsIHBvbHlnb25EcmF3ZXJTZXJ2aWNlIGFzIEJhc2ljRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2FyYycsIGFyY0RyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2ludCcsIHBvaW50RHJhd2VyU2VydmljZV0sXG4gICAgICBbJ21vZGVsJywgbW9kZWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYm94JywgYm94RHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2NvcnJpZG9yJywgY29ycmlkb3JEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY3lsaW5kZXInLCBjeWxpbmRlckRyYXdlclNlcnZpY2VdLFxuICAgICAgWydlbGxpcHNvaWQnLCBlbGxpcHNvaWREcmF3ZXJTZXJpY2VdLFxuICAgICAgWydwb2x5bGluZVZvbHVtZScsIHBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3JlY3RhbmdsZScsIHJlY3RhbmdsZURyYXdlclNlcnZpY2VdLFxuICAgICAgWyd3YWxsJywgd2FsbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5bGluZVByaW1pdGl2ZScsIHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2xhYmVsUHJpbWl0aXZlJywgbGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYmlsbGJvYXJkUHJpbWl0aXZlJywgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvaW50UHJpbWl0aXZlJywgcG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnaHRtbCcsIGh0bWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY3ptbCcsIGN6bWxEcmF3ZXJTZXJ2aWNlXSxcblxuICAgICAgWydkeW5hbWljRWxsaXBzZScsIGR5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2R5bmFtaWNQb2x5bGluZScsIGR5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNDaXJjbGUnLCBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnc3RhdGljUG9seWxpbmUnLCBzdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNQb2x5Z29uJywgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNFbGxpcHNlJywgc3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2VdLFxuICAgIF0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRWYWxpZFBhcmFtcygpO1xuXG4gICAgb2JzZXJ2YWJsZU1lcmdlKHRoaXMuX3VwZGF0ZVN0cmVhbSwgdGhpcy5vYnNlcnZhYmxlKS5waXBlPEFjTm90aWZpY2F0aW9uPih0YWtlVW50aWwodGhpcy5zdG9wT2JzZXJ2YWJsZSkpLnN1YnNjcmliZSgobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICB0aGlzLl9jb21wdXRhdGlvbkNhY2hlLmNsZWFyKCk7XG5cbiAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdBY0xheWVyIHJlY2VpdmVkIG5vdGlmaWNhdGlvbjonLCBub3RpZmljYXRpb24pO1xuICAgICAgfVxuXG4gICAgICBsZXQgY29udGV4dEVudGl0eSA9IG5vdGlmaWNhdGlvbi5lbnRpdHk7XG4gICAgICBpZiAodGhpcy5zdG9yZSkge1xuICAgICAgICBjb250ZXh0RW50aXR5ID0gdGhpcy51cGRhdGVTdG9yZShub3RpZmljYXRpb24pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRleHRbdGhpcy5lbnRpdHlOYW1lXSA9IGNvbnRleHRFbnRpdHk7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS5nZXREZXNjcmlwdGlvbnMoKS5mb3JFYWNoKChkZXNjcmlwdGlvbkNvbXBvbmVudCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5hY3Rpb25UeXBlKSB7XG4gICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLkFERF9VUERBVEU6XG4gICAgICAgICAgICBkZXNjcmlwdGlvbkNvbXBvbmVudC5kcmF3KHRoaXMuY29udGV4dCwgbm90aWZpY2F0aW9uLmlkLCBjb250ZXh0RW50aXR5KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS5ERUxFVEU6XG4gICAgICAgICAgICBkZXNjcmlwdGlvbkNvbXBvbmVudC5yZW1vdmUobm90aWZpY2F0aW9uLmlkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYWMtbGF5ZXJdIHVua25vd24gQWNOb3RpZmljYXRpb24uYWN0aW9uVHlwZSBmb3Igbm90aWZpY2F0aW9uOiAnICsgbm90aWZpY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVN0b3JlKG5vdGlmaWNhdGlvbjogQWNOb3RpZmljYXRpb24pOiBhbnkge1xuICAgIGlmIChub3RpZmljYXRpb24uYWN0aW9uVHlwZSA9PT0gQWN0aW9uVHlwZS5ERUxFVEUpIHtcbiAgICAgIHRoaXMuZW50aXRpZXNTdG9yZS5kZWxldGUobm90aWZpY2F0aW9uLmlkKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmVudGl0aWVzU3RvcmUuaGFzKG5vdGlmaWNhdGlvbi5pZCkpIHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5lbnRpdGllc1N0b3JlLmdldChub3RpZmljYXRpb24uaWQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgbm90aWZpY2F0aW9uLmVudGl0eSk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVudGl0aWVzU3RvcmUuc2V0KG5vdGlmaWNhdGlvbi5pZCwgbm90aWZpY2F0aW9uLmVudGl0eSk7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uZW50aXR5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdFZhbGlkUGFyYW1zKCkge1xuICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRpYWxpemUgW2NvbnRleHRdICcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5hY0ZvclJneC50ZXN0KHRoaXMuYWNGb3IpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGFjLWxheWVyOiBJbnZhbGlkIFthY0Zvcl0gc3ludGF4LiBFeHBlY3RlZDogW2FjRm9yXT1cImxldCBpdGVtIG9mIG9ic2VydmFibGVcIiAuSW5zdGVhZCByZWNlaXZlZDogJHt0aGlzLmFjRm9yfWApO1xuICAgIH1cbiAgICBjb25zdCBhY0ZvckFyciA9IHRoaXMuYWNGb3Iuc3BsaXQoJyAnKTtcbiAgICB0aGlzLm9ic2VydmFibGUgPSB0aGlzLmNvbnRleHRbYWNGb3JBcnJbM11dO1xuICAgIHRoaXMuZW50aXR5TmFtZSA9IGFjRm9yQXJyWzFdO1xuICAgIGlmICghdGhpcy5pc09ic2VydmFibGUodGhpcy5vYnNlcnZhYmxlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhYy1sYXllcjogbXVzdCBpbml0YWlsaXplIFthY0Zvcl0gd2l0aCByeCBvYnNlcnZhYmxlLCBpbnN0ZWFkIHJlY2VpdmVkOiAnICsgdGhpcy5vYnNlcnZhYmxlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNldEVudGl0eU5hbWUodGhpcy5lbnRpdHlOYW1lKTtcbiAgfVxuXG4gIC8qKiBUZXN0IGZvciBhIHJ4anMgT2JzZXJ2YWJsZSAqL1xuICBwcml2YXRlIGlzT2JzZXJ2YWJsZShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8qIGNoZWNrIHZpYSBkdWNrLXR5cGluZyByYXRoZXIgdGhhbiBpbnN0YW5jZSBvZlxuICAgICAqIHRvIGFsbG93IHBhc3NpbmcgYmV0d2VlbiB3aW5kb3cgY29udGV4dHMgKi9cbiAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmouc3Vic2NyaWJlID09PSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICB0aGlzLmxheWVyU2VydmljZS5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNob3cgPSB0aGlzLnNob3c7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuekluZGV4ID0gdGhpcy56SW5kZXg7XG4gICAgdGhpcy5fZHJhd2VyTGlzdC5mb3JFYWNoKChkcmF3ZXIsIGRyYXdlck5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGluaXRPcHRpb25zID0gdGhpcy5vcHRpb25zID8gdGhpcy5vcHRpb25zW2RyYXdlck5hbWVdIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgZHJhd2VyRGF0YVNvdXJjZXMgPSBkcmF3ZXIuaW5pdChpbml0T3B0aW9ucyk7XG4gICAgICAvLyBvbmx5IGVudGl0aWVzIGRyYXdlcnMgY3JlYXRlIGRhdGEgc291cmNlc1xuICAgICAgaWYgKGRyYXdlckRhdGFTb3VyY2VzKSB7XG4gICAgICAgIC8vIHRoaXMubWFwTGF5ZXJzU2VydmljZS5yZWdpc3RlckxheWVyRGF0YVNvdXJjZXMoZHJhd2VyRGF0YVNvdXJjZXMsIHRoaXMuekluZGV4KTtcbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIGZvbGxvd2luZyBsaW5lIGNhdXNlcyBCYWQgUGVyZm9ybWFuY2VcbiAgICAgICAgdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLnB1c2goLi4uZHJhd2VyRGF0YVNvdXJjZXMpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnNldFNob3codGhpcy5zaG93KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5zaG93ICYmICFjaGFuZ2VzLnNob3cuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHNob3dWYWx1ZSA9IGNoYW5nZXNbJ3Nob3cnXS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS5zaG93ID0gc2hvd1ZhbHVlO1xuICAgICAgdGhpcy5fZHJhd2VyTGlzdC5mb3JFYWNoKChkcmF3ZXIpID0+IGRyYXdlci5zZXRTaG93KHNob3dWYWx1ZSkpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnpJbmRleCAmJiAhY2hhbmdlcy56SW5kZXguZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHpJbmRleFZhbHVlID0gY2hhbmdlc1snekluZGV4J10uY3VycmVudFZhbHVlO1xuICAgICAgdGhpcy5sYXllclNlcnZpY2UuekluZGV4ID0gekluZGV4VmFsdWU7XG4gICAgICB0aGlzLm1hcExheWVyc1NlcnZpY2UudXBkYXRlQW5kUmVmcmVzaCh0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMsIHpJbmRleFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcExheWVyc1NlcnZpY2UucmVtb3ZlRGF0YVNvdXJjZXModGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzKTtcbiAgICB0aGlzLnN0b3BPYnNlcnZhYmxlLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLmxheWVyU2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIERhdGFTb3VyY2VzIHJlZ2lzdGVyZWQgYnkgYSBkcmF3ZXIgb2YgdGhpcyBsYXllclxuICAgKiBAcmV0dXJuIEFycmF5IG9mIENlc2l1bS5EYXRhU291cmNlc1xuICAgKi9cbiAgZ2V0TGF5ZXJEcmF3ZXJEYXRhU291cmNlcygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEFycmF5IG9mIERhdGFTb3VyY2VzIG9mIHRoZSBkcmF3ZXIgd2l0aCB0aGUgcHJvdmlkZWQgRGF0YVNvdXJjZS5uYW1lXG4gICAqIEV4YW1wbGU6IGdldERhdGFTb3VyY2VPZkRyYXdlcigncG9seWxpbmUnKSByZXR1cm5zIHRoZSBkYXRhU291cmNlIG9mIHBvbHlsaW5lIGRyYXdlclxuICAgKiBAcmV0dXJuIEFycmF5IG9mIENlc2l1bS5EYXRhU291cmNlc1xuICAgKi9cbiAgZ2V0RHJhd2VyRGF0YVNvdXJjZXNCeU5hbWUobmFtZTogc3RyaW5nKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMuZmlsdGVyKGQgPT4gZC5uYW1lID09PSBuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdG9yZS5cbiAgICovXG4gIGdldFN0b3JlKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0aWVzU3RvcmU7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgbGF5ZXIuXG4gICAqL1xuICByZW1vdmVBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuZ2V0RGVzY3JpcHRpb25zKCkuZm9yRWFjaCgoZGVzY3JpcHRpb24pID0+IGRlc2NyaXB0aW9uLnJlbW92ZUFsbCgpKTtcbiAgICB0aGlzLmVudGl0aWVzU3RvcmUuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgZW50aXR5IGZyb20gdGhlIGxheWVyXG4gICAqL1xuICByZW1vdmUoZW50aXR5SWQ6IHN0cmluZykge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KHtpZDogZW50aXR5SWQsIGFjdGlvblR5cGU6IEFjdGlvblR5cGUuREVMRVRFfSk7XG4gICAgdGhpcy5lbnRpdGllc1N0b3JlLmRlbGV0ZShlbnRpdHlJZCk7XG4gIH1cblxuICAvKipcbiAgICogYWRkL3VwZGF0ZSBlbnRpdHkgdG8vZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZU5vdGlmaWNhdGlvbihub3RpZmljYXRpb246IEFjTm90aWZpY2F0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQobm90aWZpY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQvdXBkYXRlIGVudGl0eSB0by9mcm9tIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlKGVudGl0eTogQWNFbnRpdHksIGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dCh7ZW50aXR5LCBpZCwgYWN0aW9uVHlwZTogQWN0aW9uVHlwZS5BRERfVVBEQVRFfSk7XG4gIH1cblxuICByZWZyZXNoQWxsKGNvbGxlY3Rpb246IEFjTm90aWZpY2F0aW9uW10pOiB2b2lkIHtcbiAgICAvLyBUT0RPIG1ha2UgZW50aXR5IGludGVyZmFjZTogY29sbGVjdGlvbiBvZiB0eXBlIGVudGl0eSBub3Qgbm90aWZpY2F0aW9uXG4gICAgb2JzZXJ2YWJsZUZyb20oY29sbGVjdGlvbikuc3Vic2NyaWJlKChlbnRpdHkpID0+IHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KGVudGl0eSkpO1xuICB9XG59XG4iXX0=
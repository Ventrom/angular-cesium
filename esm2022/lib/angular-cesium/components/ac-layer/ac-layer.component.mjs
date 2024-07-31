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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcLayerComponent, deps: [{ token: i1.LayerService }, { token: i2.ComputationCache }, { token: i3.MapLayersService }, { token: i4.BillboardDrawerService }, { token: i5.LabelDrawerService }, { token: i6.EllipseDrawerService }, { token: i7.PolylineDrawerService }, { token: i8.PolygonDrawerService }, { token: i9.ArcDrawerService }, { token: i10.PointDrawerService }, { token: i11.ModelDrawerService }, { token: i12.BoxDrawerService }, { token: i13.CorridorDrawerService }, { token: i14.CylinderDrawerService }, { token: i15.EllipsoidDrawerService }, { token: i16.PolylineVolumeDrawerService }, { token: i17.WallDrawerService }, { token: i18.RectangleDrawerService }, { token: i19.DynamicEllipseDrawerService }, { token: i20.DynamicPolylineDrawerService }, { token: i21.StaticCircleDrawerService }, { token: i22.StaticPolylineDrawerService }, { token: i23.StaticPolygonDrawerService }, { token: i24.StaticEllipseDrawerService }, { token: i25.PolylinePrimitiveDrawerService }, { token: i26.LabelPrimitiveDrawerService }, { token: i27.BillboardPrimitiveDrawerService }, { token: i28.PointPrimitiveDrawerService }, { token: i29.HtmlDrawerService }, { token: i30.CzmlDrawerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcLayerComponent, selector: "ac-layer", inputs: { show: "show", acFor: "acFor", context: "context", store: "store", options: "options", zIndex: "zIndex", debug: "debug" }, providers: [
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
        ], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcLayerComponent, decorators: [{
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
        }], ctorParameters: () => [{ type: i1.LayerService }, { type: i2.ComputationCache }, { type: i3.MapLayersService }, { type: i4.BillboardDrawerService }, { type: i5.LabelDrawerService }, { type: i6.EllipseDrawerService }, { type: i7.PolylineDrawerService }, { type: i8.PolygonDrawerService }, { type: i9.ArcDrawerService }, { type: i10.PointDrawerService }, { type: i11.ModelDrawerService }, { type: i12.BoxDrawerService }, { type: i13.CorridorDrawerService }, { type: i14.CylinderDrawerService }, { type: i15.EllipsoidDrawerService }, { type: i16.PolylineVolumeDrawerService }, { type: i17.WallDrawerService }, { type: i18.RectangleDrawerService }, { type: i19.DynamicEllipseDrawerService }, { type: i20.DynamicPolylineDrawerService }, { type: i21.StaticCircleDrawerService }, { type: i22.StaticPolylineDrawerService }, { type: i23.StaticPolygonDrawerService }, { type: i24.StaticEllipseDrawerService }, { type: i25.PolylinePrimitiveDrawerService }, { type: i26.LabelPrimitiveDrawerService }, { type: i27.BillboardPrimitiveDrawerService }, { type: i28.PointPrimitiveDrawerService }, { type: i29.HtmlDrawerService }, { type: i30.CzmlDrawerService }], propDecorators: { show: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxLQUFLLElBQUksZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsaUJBQWlCO0FBQ2pCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRWxGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUc5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVwRyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxRkFBcUYsQ0FBQztB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QixnQkFBZ0I7a0JBckM1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxTQUFTLEVBQUU7d0JBQ1QsWUFBWTt3QkFDWixnQkFBZ0I7d0JBQ2hCLHNCQUFzQjt3QkFDdEIsa0JBQWtCO3dCQUNsQixvQkFBb0I7d0JBQ3BCLHFCQUFxQjt3QkFDckIsZ0JBQWdCO3dCQUNoQixrQkFBa0I7d0JBQ2xCLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixnQkFBZ0I7d0JBQ2hCLHFCQUFxQjt3QkFDckIscUJBQXFCO3dCQUNyQixzQkFBc0I7d0JBQ3RCLDJCQUEyQjt3QkFDM0IsaUJBQWlCO3dCQUNqQixzQkFBc0I7d0JBQ3RCLDhCQUE4Qjt3QkFDOUIsMkJBQTJCO3dCQUMzQiwrQkFBK0I7d0JBQy9CLDJCQUEyQjt3QkFDM0IsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBRWpCLDJCQUEyQjt3QkFDM0IsNEJBQTRCO3dCQUM1Qix5QkFBeUI7d0JBQ3pCLDJCQUEyQjt3QkFDM0IsMEJBQTBCO3dCQUMxQiwwQkFBMEI7cUJBQzNCO29CQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDt3cENBR0MsSUFBSTtzQkFESCxLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSztnQkFHTixPQUFPO3NCQUROLEtBQUs7Z0JBR04sS0FBSztzQkFESixLQUFLO2dCQUdOLE9BQU87c0JBRE4sS0FBSztnQkFHTixNQUFNO3NCQURMLEtBQUs7Z0JBR04sS0FBSztzQkFESixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbSBhcyBvYnNlcnZhYmxlRnJvbSwgbWVyZ2UgYXMgb2JzZXJ2YWJsZU1lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbi8vIHRzbGludDpkaXNhYmxlXG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWN0aW9uLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheWVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlsaW5lLWRyYXdlci9zdGF0aWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbW9kZWwtZHJhd2VyL21vZGVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJveERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JveC1kYXdlci9ib3gtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jb3JyaWRvci1kYXdlci9jb3JyaWRvci1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDeWxpbmRlckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc29pZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwb2lkLWRyYXdlci9lbGxpcHNvaWQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS12b2x1bWUtZGF3ZXIvcG9seWxpbmUtdm9sdW1lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFdhbGxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy93YWxsLWRhd2VyL3dhbGwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcmVjdGFuZ2xlLWRhd2VyL3JlY3RhbmdsZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci9sYWJlbC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIdG1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcbi8qKlxuICogIFRoaXMgaXMgYSBhYy1sYXllciBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGF5ZXIgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgKyBhY0ZvciBge3N0cmluZ31gIC0gZ2V0IHRoZSB0cmFja2VkIG9ic2VydmFibGUgYW5kIGVudGl0eU5hbWUgKHNlZSB0aGUgZXhhbXBsZSkuXG4gKiAgKyBzaG93IGB7Ym9vbGVhbn1gIC0gc2hvdy9oaWRlIGxheWVyJ3MgZW50aXRpZXMuXG4gKiAgKyBjb250ZXh0IGB7YW55fWAgLSBnZXQgdGhlIGNvbnRleHQgbGF5ZXIgdGhhdCB3aWxsIHVzZSB0aGUgY29tcG9ubmV0IChtb3N0IG9mIHRoZSB0aW1lIGVxdWFsIHRvIFwidGhpc1wiKS5cbiAqICArIG9wdGlvbnMgYHtMYXllck9wdGlvbnN9YCAtIHNldHMgdGhlIGxheWVyIG9wdGlvbnMgZm9yIGVhY2ggZHJhd2VyLlxuICogICsgekluZGV4IGB7bnVtYmVyfWAgLSBjb250cm9scyB0aGUgekluZGV4IChvcmRlcikgb2YgdGhlIGxheWVyLCBsYXllcnMgd2l0aCBncmVhdGVyIHpJbmRleCB3aWxsIGJlIGluIGZyb250IG9mIGxheWVycyB3aXRoIGxvd2VyIHpJbmRleFxuICogICAgKEV4Y2VwdGlvbiBGb3IgYEJpbGxib2FyZGAgYW5kIGBMYWJlbGAsIHNob3VsZCB1c2UgYFtleWVPZmZzZXRdYCBwcm9wIGluc3RlYWQpPC9icj5cbiAqICAgIHpJbmRleCB3b24ndCB3b3JrIGZvciBwcml0aW1pdHZlIGRlc2NzIChsaWtlIGFjLXByaW1pdGl2ZS1wb2x5bGluZS4uLilcbiAqICArIGRlYnVnIGB7Ym9vbGVhbn1gIC0gcHJpbnRzIGV2ZXJ5IGFjTm90aWZpY2F0aW9uXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogIDxhYy1tYXA+XG4gKiAgICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW29wdGlvbnNdPVwib3B0aW9uc1wiIFt6SW5kZXhdPVwiMVwiPlxuICogICAgICA8YWMtYmlsbGJvYXJkLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgaW1hZ2U6IHRyYWNrLmltYWdlLFxuICogICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICBzY2FsZTogdHJhY2suc2NhbGUsXG4gKiAgICAgICAgY29sb3I6IHRyYWNrLmNvbG9yLFxuICogICAgICAgIG5hbWU6IHRyYWNrLm5hbWVcbiAqICAgICAgfVwiPlxuICogICAgICA8L2FjLWJpbGxib2FyZC1kZXNjPlxuICogICAgICAgIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICAgICAgdGV4dDogdHJhY2submFtZSxcbiAqICAgICAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICAgICAgfVwiPlxuICogICAgICA8L2FjLWxhYmVsLWRlc2M+XG4gKiAgICA8L2FjLWxheWVyPlxuICogIDwvYWMtbWFwPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1sYXllcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHByb3ZpZGVyczogW1xuICAgIExheWVyU2VydmljZSxcbiAgICBDb21wdXRhdGlvbkNhY2hlLFxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBNb2RlbERyYXdlclNlcnZpY2UsXG4gICAgQm94RHJhd2VyU2VydmljZSxcbiAgICBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgIFdhbGxEcmF3ZXJTZXJ2aWNlLFxuICAgIFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBIdG1sRHJhd2VyU2VydmljZSxcbiAgICBDem1sRHJhd2VyU2VydmljZSxcblxuICAgIER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQWNMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBzaG93ID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgYWNGb3I6IHN0cmluZztcbiAgQElucHV0KClcbiAgY29udGV4dDogYW55O1xuICBASW5wdXQoKVxuICBzdG9yZSA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBvcHRpb25zOiBMYXllck9wdGlvbnM7XG4gIEBJbnB1dCgpXG4gIHpJbmRleCA9IDA7XG4gIEBJbnB1dCgpXG4gIGRlYnVnID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhY0ZvclJneCA9IC9ebGV0XFxzKy4rXFxzK29mXFxzKy4rJC87XG4gIHByaXZhdGUgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHN0b3BPYnNlcnZhYmxlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIG9ic2VydmFibGU6IE9ic2VydmFibGU8QWNOb3RpZmljYXRpb24+O1xuICBwcml2YXRlIF9kcmF3ZXJMaXN0OiBNYXA8c3RyaW5nLCBCYXNpY0RyYXdlclNlcnZpY2U+O1xuICBwcml2YXRlIF91cGRhdGVTdHJlYW06IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+ID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHByaXZhdGUgZW50aXRpZXNTdG9yZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gIHByaXZhdGUgbGF5ZXJEcmF3ZXJEYXRhU291cmNlczogYW55W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLFxuICAgICAgICAgICAgICBwcml2YXRlIG1hcExheWVyc1NlcnZpY2U6IE1hcExheWVyc1NlcnZpY2UsXG4gICAgICAgICAgICAgIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGxhYmVsRHJhd2VyU2VydmljZTogTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5Z29uRHJhd2VyU2VydmljZTogUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGFyY0RyYXdlclNlcnZpY2U6IEFyY0RyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBtb2RlbERyYXdlclNlcnZpY2U6IE1vZGVsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYm94RHJhd2VyU2VydmljZTogQm94RHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY29ycmlkb3JEcmF3ZXJTZXJ2aWNlOiBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGN5bGluZGVyRHJhd2VyU2VydmljZTogQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNvaWREcmF3ZXJTZXJpY2U6IEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZTogUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICB3YWxsRHJhd2VyU2VydmljZTogV2FsbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHJlY3RhbmdsZURyYXdlclNlcnZpY2U6IFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGR5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZTogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZTogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZTogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGh0bWxEcmF3ZXJTZXJ2aWNlOiBIdG1sRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuX2RyYXdlckxpc3QgPSBuZXcgTWFwKFtcbiAgICAgIFsnYmlsbGJvYXJkJywgYmlsbGJvYXJkRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2xhYmVsJywgbGFiZWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZWxsaXBzZScsIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWxpbmUnLCBwb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5Z29uJywgcG9seWdvbkRyYXdlclNlcnZpY2UgYXMgQmFzaWNEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYXJjJywgYXJjRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvaW50JywgcG9pbnREcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbW9kZWwnLCBtb2RlbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydib3gnLCBib3hEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY29ycmlkb3InLCBjb3JyaWRvckRyYXdlclNlcnZpY2VdLFxuICAgICAgWydjeWxpbmRlcicsIGN5bGluZGVyRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2VsbGlwc29pZCcsIGVsbGlwc29pZERyYXdlclNlcmljZV0sXG4gICAgICBbJ3BvbHlsaW5lVm9sdW1lJywgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncmVjdGFuZ2xlJywgcmVjdGFuZ2xlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3dhbGwnLCB3YWxsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlsaW5lUHJpbWl0aXZlJywgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbGFiZWxQcmltaXRpdmUnLCBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydiaWxsYm9hcmRQcmltaXRpdmUnLCBiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9pbnRQcmltaXRpdmUnLCBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydodG1sJywgaHRtbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydjem1sJywgY3ptbERyYXdlclNlcnZpY2VdLFxuXG4gICAgICBbJ2R5bmFtaWNFbGxpcHNlJywgZHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZHluYW1pY1BvbHlsaW5lJywgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0NpcmNsZScsIHN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNQb2x5bGluZScsIHN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY1BvbHlnb24nLCBzdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0VsbGlwc2UnLCBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgXSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdFZhbGlkUGFyYW1zKCk7XG5cbiAgICBvYnNlcnZhYmxlTWVyZ2UodGhpcy5fdXBkYXRlU3RyZWFtLCB0aGlzLm9ic2VydmFibGUpLnBpcGU8QWNOb3RpZmljYXRpb24+KHRha2VVbnRpbCh0aGlzLnN0b3BPYnNlcnZhYmxlKSkuc3Vic2NyaWJlKChub3RpZmljYXRpb24pID0+IHtcbiAgICAgIHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUuY2xlYXIoKTtcblxuICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0FjTGF5ZXIgcmVjZWl2ZWQgbm90aWZpY2F0aW9uOicsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb250ZXh0RW50aXR5ID0gbm90aWZpY2F0aW9uLmVudGl0eTtcbiAgICAgIGlmICh0aGlzLnN0b3JlKSB7XG4gICAgICAgIGNvbnRleHRFbnRpdHkgPSB0aGlzLnVwZGF0ZVN0b3JlKG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGV4dFt0aGlzLmVudGl0eU5hbWVdID0gY29udGV4dEVudGl0eTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuQUREX1VQREFURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LmRyYXcodGhpcy5jb250ZXh0LCBub3RpZmljYXRpb24uaWQsIGNvbnRleHRFbnRpdHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLkRFTEVURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LnJlbW92ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thYy1sYXllcl0gdW5rbm93biBBY05vdGlmaWNhdGlvbi5hY3Rpb25UeXBlIGZvciBub3RpZmljYXRpb246ICcgKyBub3RpZmljYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU3RvcmUobm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IGFueSB7XG4gICAgaWYgKG5vdGlmaWNhdGlvbi5hY3Rpb25UeXBlID09PSBBY3Rpb25UeXBlLkRFTEVURSkge1xuICAgICAgdGhpcy5lbnRpdGllc1N0b3JlLmRlbGV0ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZW50aXRpZXNTdG9yZS5oYXMobm90aWZpY2F0aW9uLmlkKSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmVudGl0aWVzU3RvcmUuZ2V0KG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNTdG9yZS5zZXQobm90aWZpY2F0aW9uLmlkLCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5lbnRpdHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0VmFsaWRQYXJhbXMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWMtbGF5ZXI6IG11c3QgaW5pdGlhbGl6ZSBbY29udGV4dF0gJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QodGhpcy5hY0ZvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke3RoaXMuYWNGb3J9YCk7XG4gICAgfVxuICAgIGNvbnN0IGFjRm9yQXJyID0gdGhpcy5hY0Zvci5zcGxpdCgnICcpO1xuICAgIHRoaXMub2JzZXJ2YWJsZSA9IHRoaXMuY29udGV4dFthY0ZvckFyclszXV07XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gYWNGb3JBcnJbMV07XG4gICAgaWYgKCF0aGlzLmlzT2JzZXJ2YWJsZSh0aGlzLm9ic2VydmFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRhaWxpemUgW2FjRm9yXSB3aXRoIHJ4IG9ic2VydmFibGUsIGluc3RlYWQgcmVjZWl2ZWQ6ICcgKyB0aGlzLm9ic2VydmFibGUpO1xuICAgIH1cblxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2V0RW50aXR5TmFtZSh0aGlzLmVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIFRlc3QgZm9yIGEgcnhqcyBPYnNlcnZhYmxlICovXG4gIHByaXZhdGUgaXNPYnNlcnZhYmxlKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgLyogY2hlY2sgdmlhIGR1Y2stdHlwaW5nIHJhdGhlciB0aGFuIGluc3RhbmNlIG9mXG4gICAgICogdG8gYWxsb3cgcGFzc2luZyBiZXR3ZWVuIHdpbmRvdyBjb250ZXh0cyAqL1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iai5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHRoaXMuc2hvdztcbiAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlciwgZHJhd2VyTmFtZSkgPT4ge1xuICAgICAgY29uc3QgaW5pdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnNbZHJhd2VyTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBkcmF3ZXJEYXRhU291cmNlcyA9IGRyYXdlci5pbml0KGluaXRPcHRpb25zKTtcbiAgICAgIC8vIG9ubHkgZW50aXRpZXMgZHJhd2VycyBjcmVhdGUgZGF0YSBzb3VyY2VzXG4gICAgICBpZiAoZHJhd2VyRGF0YVNvdXJjZXMpIHtcbiAgICAgICAgLy8gdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkcmF3ZXJEYXRhU291cmNlcywgdGhpcy56SW5kZXgpO1xuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgZm9sbG93aW5nIGxpbmUgY2F1c2VzIEJhZCBQZXJmb3JtYW5jZVxuICAgICAgICB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMucHVzaCguLi5kcmF3ZXJEYXRhU291cmNlcyk7XG4gICAgICB9XG4gICAgICBkcmF3ZXIuc2V0U2hvdyh0aGlzLnNob3cpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLnNob3cgJiYgIWNoYW5nZXMuc2hvdy5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNob3cgPSBzaG93VmFsdWU7XG4gICAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlcikgPT4gZHJhd2VyLnNldFNob3coc2hvd1ZhbHVlKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuekluZGV4ICYmICFjaGFuZ2VzLnpJbmRleC5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgekluZGV4VmFsdWUgPSBjaGFuZ2VzWyd6SW5kZXgnXS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB6SW5kZXhWYWx1ZTtcbiAgICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS51cGRhdGVBbmRSZWZyZXNoKHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcywgekluZGV4VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMpO1xuICAgIHRoaXMuc3RvcE9ic2VydmFibGUubmV4dCh0cnVlKTtcbiAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgZ2V0TGF5ZXJTZXJ2aWNlKCk6IExheWVyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgRGF0YVNvdXJjZXMgcmVnaXN0ZXJlZCBieSBhIGRyYXdlciBvZiB0aGlzIGxheWVyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXRMYXllckRyYXdlckRhdGFTb3VyY2VzKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQXJyYXkgb2YgRGF0YVNvdXJjZXMgb2YgdGhlIGRyYXdlciB3aXRoIHRoZSBwcm92aWRlZCBEYXRhU291cmNlLm5hbWVcbiAgICogRXhhbXBsZTogZ2V0RGF0YVNvdXJjZU9mRHJhd2VyKCdwb2x5bGluZScpIHJldHVybnMgdGhlIGRhdGFTb3VyY2Ugb2YgcG9seWxpbmUgZHJhd2VyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXREcmF3ZXJEYXRhU291cmNlc0J5TmFtZShuYW1lOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcy5maWx0ZXIoZCA9PiBkLm5hbWUgPT09IG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0U3RvcmUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXRpZXNTdG9yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBsYXllci5cbiAgICovXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5nZXREZXNjcmlwdGlvbnMoKS5mb3JFYWNoKChkZXNjcmlwdGlvbikgPT4gZGVzY3JpcHRpb24ucmVtb3ZlQWxsKCkpO1xuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShlbnRpdHlJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2lkOiBlbnRpdHlJZCwgYWN0aW9uVHlwZTogQWN0aW9uVHlwZS5ERUxFVEV9KTtcbiAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKGVudGl0eUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQvdXBkYXRlIGVudGl0eSB0by9mcm9tIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogQWNOb3RpZmljYXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dChub3RpZmljYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBBY0VudGl0eSwgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KHtlbnRpdHksIGlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkFERF9VUERBVEV9KTtcbiAgfVxuXG4gIHJlZnJlc2hBbGwoY29sbGVjdGlvbjogQWNOb3RpZmljYXRpb25bXSk6IHZvaWQge1xuICAgIC8vIFRPRE8gbWFrZSBlbnRpdHkgaW50ZXJmYWNlOiBjb2xsZWN0aW9uIG9mIHR5cGUgZW50aXR5IG5vdCBub3RpZmljYXRpb25cbiAgICBvYnNlcnZhYmxlRnJvbShjb2xsZWN0aW9uKS5zdWJzY3JpYmUoKGVudGl0eSkgPT4gdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoZW50aXR5KSk7XG4gIH1cbn1cbiJdfQ==
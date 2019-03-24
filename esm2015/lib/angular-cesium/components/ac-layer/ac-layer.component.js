/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
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
    /**
     * @param {?} layerService
     * @param {?} _computationCache
     * @param {?} mapLayersService
     * @param {?} billboardDrawerService
     * @param {?} labelDrawerService
     * @param {?} ellipseDrawerService
     * @param {?} polylineDrawerService
     * @param {?} polygonDrawerService
     * @param {?} arcDrawerService
     * @param {?} pointDrawerService
     * @param {?} modelDrawerService
     * @param {?} boxDrawerService
     * @param {?} corridorDrawerService
     * @param {?} cylinderDrawerService
     * @param {?} ellipsoidDrawerSerice
     * @param {?} polylineVolumeDrawerService
     * @param {?} wallDrawerService
     * @param {?} rectangleDrawerService
     * @param {?} dynamicEllipseDrawerService
     * @param {?} dynamicPolylineDrawerService
     * @param {?} staticCircleDrawerService
     * @param {?} staticPolylineDrawerService
     * @param {?} staticPolygonDrawerService
     * @param {?} staticEllipseDrawerService
     * @param {?} polylinePrimitiveDrawerService
     * @param {?} labelPrimitiveDrawerService
     * @param {?} billboardPrimitiveDrawerService
     * @param {?} pointPrimitiveDrawerService
     * @param {?} htmlDrawerService
     * @param {?} czmlDrawerService
     */
    constructor(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
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
            ['polygon', (/** @type {?} */ (polygonDrawerService))],
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
    /**
     * @return {?}
     */
    init() {
        this.initValidParams();
        observableMerge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((/**
         * @param {?} notification
         * @return {?}
         */
        (notification) => {
            this._computationCache.clear();
            /** @type {?} */
            let contextEntity = notification.entity;
            if (this.store) {
                contextEntity = this.updateStore(notification);
            }
            this.context[this.entityName] = contextEntity;
            this.layerService.getDescriptions().forEach((/**
             * @param {?} descriptionComponent
             * @return {?}
             */
            (descriptionComponent) => {
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
            }));
        }));
    }
    /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    updateStore(notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                /** @type {?} */
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
    /**
     * @private
     * @return {?}
     */
    initValidParams() {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${this.acFor}`);
        }
        /** @type {?} */
        const acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    }
    /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    isObservable(obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.init();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((/**
         * @param {?} drawer
         * @param {?} drawerName
         * @return {?}
         */
        (drawer, drawerName) => {
            /** @type {?} */
            const initOptions = this.options ? this.options[drawerName] : undefined;
            /** @type {?} */
            const drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                this.layerDrawerDataSources.push(...drawerDataSources);
            }
            drawer.setShow(this.show);
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.show && !changes.show.firstChange) {
            /** @type {?} */
            const showValue = changes['show'].currentValue;
            this.layerService.show = showValue;
            this._drawerList.forEach((/**
             * @param {?} drawer
             * @return {?}
             */
            (drawer) => drawer.setShow(showValue)));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            /** @type {?} */
            const zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    }
    /**
     * @return {?}
     */
    getLayerService() {
        return this.layerService;
    }
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    getLayerDrawerDataSources() {
        return this.layerDrawerDataSources;
    }
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name) {
        return this.layerDrawerDataSources.filter((/**
         * @param {?} d
         * @return {?}
         */
        d => d.name === name));
    }
    /**
     * Returns the store.
     * @return {?}
     */
    getStore() {
        return this.entitiesStore;
    }
    /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    removeAll() {
        this.layerService.getDescriptions().forEach((/**
         * @param {?} description
         * @return {?}
         */
        (description) => description.removeAll()));
        this.entitiesStore.clear();
    }
    /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    remove(entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    }
    /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    updateNotification(notification) {
        this._updateStream.next(notification);
    }
    /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    update(entity, id) {
        this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
    }
    /**
     * @param {?} collection
     * @return {?}
     */
    refreshAll(collection) {
        // TODO make entity interface: collection of type entity not notification
        observableFrom(collection).subscribe((/**
         * @param {?} entity
         * @return {?}
         */
        (entity) => this._updateStream.next(entity)));
    }
}
AcLayerComponent.decorators = [
    { type: Component, args: [{
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
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
AcLayerComponent.ctorParameters = () => [
    { type: LayerService },
    { type: ComputationCache },
    { type: MapLayersService },
    { type: BillboardDrawerService },
    { type: LabelDrawerService },
    { type: EllipseDrawerService },
    { type: PolylineDrawerService },
    { type: PolygonDrawerService },
    { type: ArcDrawerService },
    { type: PointDrawerService },
    { type: ModelDrawerService },
    { type: BoxDrawerService },
    { type: CorridorDrawerService },
    { type: CylinderDrawerService },
    { type: EllipsoidDrawerService },
    { type: PolylineVolumeDrawerService },
    { type: WallDrawerService },
    { type: RectangleDrawerService },
    { type: DynamicEllipseDrawerService },
    { type: DynamicPolylineDrawerService },
    { type: StaticCircleDrawerService },
    { type: StaticPolylineDrawerService },
    { type: StaticPolygonDrawerService },
    { type: StaticEllipseDrawerService },
    { type: PolylinePrimitiveDrawerService },
    { type: LabelPrimitiveDrawerService },
    { type: BillboardPrimitiveDrawerService },
    { type: PointPrimitiveDrawerService },
    { type: HtmlDrawerService },
    { type: CzmlDrawerService }
];
AcLayerComponent.propDecorators = {
    show: [{ type: Input }],
    acFor: [{ type: Input }],
    context: [{ type: Input }],
    store: [{ type: Input }],
    options: [{ type: Input }],
    zIndex: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    AcLayerComponent.prototype.show;
    /** @type {?} */
    AcLayerComponent.prototype.acFor;
    /** @type {?} */
    AcLayerComponent.prototype.context;
    /** @type {?} */
    AcLayerComponent.prototype.store;
    /** @type {?} */
    AcLayerComponent.prototype.options;
    /** @type {?} */
    AcLayerComponent.prototype.zIndex;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.acForRgx;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.entityName;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.stopObservable;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.observable;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype._drawerList;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype._updateStream;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.entitiesStore;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.layerDrawerDataSources;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.layerService;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype._computationCache;
    /**
     * @type {?}
     * @private
     */
    AcLayerComponent.prototype.mapLayersService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLElBQUksY0FBYyxFQUFFLEtBQUssSUFBSSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFM0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFvQix1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFbEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBRzlGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBRXBHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFGQUFxRixDQUFDO0FBQ2xJLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLCtGQUEr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QUMzQixpQkFBaUI7WUFDakIsc0JBQXNCO1lBYnRCLDJCQUEyQjtZQUMzQiw0QkFBNEI7WUFDNUIseUJBQXlCO1lBQ3pCLDJCQUEyQjtZQUMzQiwwQkFBMEI7WUFDMUIsMEJBQTBCO1lBUzFCLDhCQUE4QjtZQUM5QiwyQkFBMkI7WUFDM0IsK0JBQStCO1lBRS9CLDJCQUEyQjtZQUMzQixpQkFBaUI7WUFDakIsaUJBQWlCOzs7bUJBNEV2QixLQUFLO29CQUVMLEtBQUs7c0JBRUwsS0FBSztvQkFFTCxLQUFLO3NCQUVMLEtBQUs7cUJBRUwsS0FBSzs7OztJQVZOLGdDQUNZOztJQUNaLGlDQUNjOztJQUNkLG1DQUNhOztJQUNiLGlDQUNjOztJQUNkLG1DQUNzQjs7SUFDdEIsa0NBQ1c7Ozs7O0lBRVgsb0NBQW1EOzs7OztJQUNuRCxzQ0FBMkI7Ozs7O0lBQzNCLDBDQUE0Qzs7Ozs7SUFDNUMsc0NBQStDOzs7OztJQUMvQyx1Q0FBcUQ7Ozs7O0lBQ3JELHlDQUErRTs7Ozs7SUFDL0UseUNBQStDOzs7OztJQUMvQyxrREFBMkM7Ozs7O0lBRS9CLHdDQUFrQzs7Ozs7SUFDbEMsNkNBQTJDOzs7OztJQUMzQyw0Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tIGFzIG9ic2VydmFibGVGcm9tLCBtZXJnZSBhcyBvYnNlcnZhYmxlTWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IEJpbGxib2FyZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1kcmF3ZXIvYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL21vZGVscy9hY3Rpb24tdHlwZS5lbnVtJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtZHJhd2VyL2xhYmVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtZHJhd2VyL3BvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5ZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9keW5hbWljLXBvbHlsaW5lLWRyYXdlci9keW5hbWljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1jaXJjbGUtZHJhd2VyL3N0YXRpYy1jaXJjbGUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9tb2RlbC1kcmF3ZXIvbW9kZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQm94RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYm94LWRhd2VyL2JveC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb3JyaWRvckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2NvcnJpZG9yLWRhd2VyL2NvcnJpZG9yLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN5bGluZGVyRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3lsaW5kZXItZGF3ZXIvY3lsaW5kZXItZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzb2lkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBvaWQtZHJhd2VyL2VsbGlwc29pZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXZvbHVtZS1kYXdlci9wb2x5bGluZS12b2x1bWUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2FsbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3dhbGwtZGF3ZXIvd2FsbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1wcmltaXRpdmUtZHJhd2VyL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIvcG9pbnQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcblxuLy8gdHNsaW50OmVuYWJsZVxuLyoqXG4gKiAgVGhpcyBpcyBhIGFjLWxheWVyIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYXllciBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICArIGFjRm9yIGB7c3RyaW5nfWAgLSBnZXQgdGhlIHRyYWNrZWQgb2JzZXJ2YWJsZSBhbmQgZW50aXR5TmFtZSAoc2VlIHRoZSBleGFtcGxlKS5cbiAqICArIHNob3cgYHtib29sZWFufWAgLSBzaG93L2hpZGUgbGF5ZXIncyBlbnRpdGllcy5cbiAqICArIGNvbnRleHQgYHthbnl9YCAtIGdldCB0aGUgY29udGV4dCBsYXllciB0aGF0IHdpbGwgdXNlIHRoZSBjb21wb25uZXQgKG1vc3Qgb2YgdGhlIHRpbWUgZXF1YWwgdG8gXCJ0aGlzXCIpLlxuICogICsgb3B0aW9ucyBge0xheWVyT3B0aW9uc31gIC0gc2V0cyB0aGUgbGF5ZXIgb3B0aW9ucyBmb3IgZWFjaCBkcmF3ZXIuXG4gKiAgKyB6SW5kZXggYHtudW1iZXJ9YCAtIGNvbnRyb2xzIHRoZSB6SW5kZXggKG9yZGVyKSBvZiB0aGUgbGF5ZXIsIGxheWVycyB3aXRoIGdyZWF0ZXIgekluZGV4IHdpbGwgYmUgaW4gZnJvbnQgb2YgbGF5ZXJzIHdpdGggbG93ZXIgekluZGV4XG4gKiAgICAoRXhjZXB0aW9uIEZvciBgQmlsbGJvYXJkYCBhbmQgYExhYmVsYCwgc2hvdWxkIHVzZSBgW2V5ZU9mZnNldF1gIHByb3AgaW5zdGVhZCk8L2JyPlxuICogICAgekluZGV4IHdvbid0IHdvcmsgZm9yIHByaXRpbWl0dmUgZGVzY3MgKGxpa2UgYWMtcHJpbWl0aXZlLXBvbHlsaW5lLi4uKVxuICpcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICA8YWMtbWFwPlxuICogICAgPGFjLWxheWVyIGFjRm9yPVwibGV0IHRyYWNrIG9mIHRyYWNrcyRcIiBbc2hvd109XCJzaG93XCIgW2NvbnRleHRdPVwidGhpc1wiIFtvcHRpb25zXT1cIm9wdGlvbnNcIiBbekluZGV4XT1cIjFcIj5cbiAqICAgICAgPGFjLWJpbGxib2FyZC1kZXNjIHByb3BzPVwie1xuICogICAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcbiAqICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgICAgc2NhbGU6IHRyYWNrLnNjYWxlLFxuICogICAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcbiAqICAgICAgICBuYW1lOiB0cmFjay5uYW1lXG4gKiAgICAgIH1cIj5cbiAqICAgICAgPC9hYy1iaWxsYm9hcmQtZGVzYz5cbiAqICAgICAgICA8YWMtbGFiZWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICAgIHBpeGVsT2Zmc2V0IDogWy0xNSwyMF0gfCBwaXhlbE9mZnNldCxcbiAqICAgICAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXG4gKiAgICAgICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgICAgIH1cIj5cbiAqICAgICAgPC9hYy1sYWJlbC1kZXNjPlxuICogICAgPC9hYy1sYXllcj5cbiAqICA8L2FjLW1hcD5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbGF5ZXInLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBwcm92aWRlcnM6IFtcbiAgICBMYXllclNlcnZpY2UsXG4gICAgQ29tcHV0YXRpb25DYWNoZSxcbiAgICBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgIExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgQXJjRHJhd2VyU2VydmljZSxcbiAgICBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgTW9kZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEJveERyYXdlclNlcnZpY2UsXG4gICAgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlLFxuICAgIEN5bGluZGVyRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSxcbiAgICBXYWxsRHJhd2VyU2VydmljZSxcbiAgICBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgSHRtbERyYXdlclNlcnZpY2UsXG4gICAgQ3ptbERyYXdlclNlcnZpY2UsXG5cbiAgICBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEFjTGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG4gIEBJbnB1dCgpXG4gIGFjRm9yOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGNvbnRleHQ6IGFueTtcbiAgQElucHV0KClcbiAgc3RvcmUgPSBmYWxzZTtcbiAgQElucHV0KClcbiAgb3B0aW9uczogTGF5ZXJPcHRpb25zO1xuICBASW5wdXQoKVxuICB6SW5kZXggPSAwO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYWNGb3JSZ3ggPSAvXmxldFxccysuK1xccytvZlxccysuKyQvO1xuICBwcml2YXRlIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBzdG9wT2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEFjTm90aWZpY2F0aW9uPjtcbiAgcHJpdmF0ZSBfZHJhd2VyTGlzdDogTWFwPHN0cmluZywgQmFzaWNEcmF3ZXJTZXJ2aWNlPjtcbiAgcHJpdmF0ZSBfdXBkYXRlU3RyZWFtOiBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPiA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwcml2YXRlIGVudGl0aWVzU3RvcmUgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICBwcml2YXRlIGxheWVyRHJhd2VyRGF0YVNvdXJjZXM6IGFueVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtYXBMYXllcnNTZXJ2aWNlOiBNYXBMYXllcnNTZXJ2aWNlLFxuICAgICAgICAgICAgICBiaWxsYm9hcmREcmF3ZXJTZXJ2aWNlOiBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZWxsaXBzZURyYXdlclNlcnZpY2U6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBhcmNEcmF3ZXJTZXJ2aWNlOiBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2ludERyYXdlclNlcnZpY2U6IFBvaW50RHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgbW9kZWxEcmF3ZXJTZXJ2aWNlOiBNb2RlbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGJveERyYXdlclNlcnZpY2U6IEJveERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvcnJpZG9yRHJhd2VyU2VydmljZTogQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjeWxpbmRlckRyYXdlclNlcnZpY2U6IEN5bGluZGVyRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZWxsaXBzb2lkRHJhd2VyU2VyaWNlOiBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgd2FsbERyYXdlclNlcnZpY2U6IFdhbGxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICByZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBkeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2U6IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZTogRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZTogU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2U6IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgbGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBodG1sRHJhd2VyU2VydmljZTogSHRtbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGN6bWxEcmF3ZXJTZXJ2aWNlOiBDem1sRHJhd2VyU2VydmljZVxuICApIHtcbiAgICB0aGlzLl9kcmF3ZXJMaXN0ID0gbmV3IE1hcChbXG4gICAgICBbJ2JpbGxib2FyZCcsIGJpbGxib2FyZERyYXdlclNlcnZpY2VdLFxuICAgICAgWydsYWJlbCcsIGxhYmVsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2VsbGlwc2UnLCBlbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlsaW5lJywgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWdvbicsIHBvbHlnb25EcmF3ZXJTZXJ2aWNlIGFzIEJhc2ljRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2FyYycsIGFyY0RyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2ludCcsIHBvaW50RHJhd2VyU2VydmljZV0sXG4gICAgICBbJ21vZGVsJywgbW9kZWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYm94JywgYm94RHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2NvcnJpZG9yJywgY29ycmlkb3JEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY3lsaW5kZXInLCBjeWxpbmRlckRyYXdlclNlcnZpY2VdLFxuICAgICAgWydlbGxpcHNvaWQnLCBlbGxpcHNvaWREcmF3ZXJTZXJpY2VdLFxuICAgICAgWydwb2x5bGluZVZvbHVtZScsIHBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3JlY3RhbmdsZScsIHJlY3RhbmdsZURyYXdlclNlcnZpY2VdLFxuICAgICAgWyd3YWxsJywgd2FsbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5bGluZVByaW1pdGl2ZScsIHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2xhYmVsUHJpbWl0aXZlJywgbGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYmlsbGJvYXJkUHJpbWl0aXZlJywgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvaW50UHJpbWl0aXZlJywgcG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnaHRtbCcsIGh0bWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY3ptbCcsIGN6bWxEcmF3ZXJTZXJ2aWNlXSxcblxuICAgICAgWydkeW5hbWljRWxsaXBzZScsIGR5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2R5bmFtaWNQb2x5bGluZScsIGR5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNDaXJjbGUnLCBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnc3RhdGljUG9seWxpbmUnLCBzdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNQb2x5Z29uJywgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNFbGxpcHNlJywgc3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2VdLFxuICAgIF0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRWYWxpZFBhcmFtcygpO1xuXG4gICAgb2JzZXJ2YWJsZU1lcmdlKHRoaXMuX3VwZGF0ZVN0cmVhbSwgdGhpcy5vYnNlcnZhYmxlKS5waXBlPEFjTm90aWZpY2F0aW9uPih0YWtlVW50aWwodGhpcy5zdG9wT2JzZXJ2YWJsZSkpLnN1YnNjcmliZSgobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICB0aGlzLl9jb21wdXRhdGlvbkNhY2hlLmNsZWFyKCk7XG5cbiAgICAgIGxldCBjb250ZXh0RW50aXR5ID0gbm90aWZpY2F0aW9uLmVudGl0eTtcbiAgICAgIGlmICh0aGlzLnN0b3JlKSB7XG4gICAgICAgIGNvbnRleHRFbnRpdHkgPSB0aGlzLnVwZGF0ZVN0b3JlKG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGV4dFt0aGlzLmVudGl0eU5hbWVdID0gY29udGV4dEVudGl0eTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuQUREX1VQREFURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LmRyYXcodGhpcy5jb250ZXh0LCBub3RpZmljYXRpb24uaWQsIGNvbnRleHRFbnRpdHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLkRFTEVURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LnJlbW92ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thYy1sYXllcl0gdW5rbm93biBBY05vdGlmaWNhdGlvbi5hY3Rpb25UeXBlIGZvciBub3RpZmljYXRpb246ICcgKyBub3RpZmljYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU3RvcmUobm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IGFueSB7XG4gICAgaWYgKG5vdGlmaWNhdGlvbi5hY3Rpb25UeXBlID09PSBBY3Rpb25UeXBlLkRFTEVURSkge1xuICAgICAgdGhpcy5lbnRpdGllc1N0b3JlLmRlbGV0ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZW50aXRpZXNTdG9yZS5oYXMobm90aWZpY2F0aW9uLmlkKSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmVudGl0aWVzU3RvcmUuZ2V0KG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNTdG9yZS5zZXQobm90aWZpY2F0aW9uLmlkLCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5lbnRpdHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0VmFsaWRQYXJhbXMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWMtbGF5ZXI6IG11c3QgaW5pdGlhbGl6ZSBbY29udGV4dF0gJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QodGhpcy5hY0ZvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke3RoaXMuYWNGb3J9YCk7XG4gICAgfVxuICAgIGNvbnN0IGFjRm9yQXJyID0gdGhpcy5hY0Zvci5zcGxpdCgnICcpO1xuICAgIHRoaXMub2JzZXJ2YWJsZSA9IHRoaXMuY29udGV4dFthY0ZvckFyclszXV07XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gYWNGb3JBcnJbMV07XG4gICAgaWYgKCF0aGlzLmlzT2JzZXJ2YWJsZSh0aGlzLm9ic2VydmFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRhaWxpemUgW2FjRm9yXSB3aXRoIHJ4IG9ic2VydmFibGUsIGluc3RlYWQgcmVjZWl2ZWQ6ICcgKyB0aGlzLm9ic2VydmFibGUpO1xuICAgIH1cblxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2V0RW50aXR5TmFtZSh0aGlzLmVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIFRlc3QgZm9yIGEgcnhqcyBPYnNlcnZhYmxlICovXG4gIHByaXZhdGUgaXNPYnNlcnZhYmxlKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgLyogY2hlY2sgdmlhIGR1Y2stdHlwaW5nIHJhdGhlciB0aGFuIGluc3RhbmNlIG9mXG4gICAgICogdG8gYWxsb3cgcGFzc2luZyBiZXR3ZWVuIHdpbmRvdyBjb250ZXh0cyAqL1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iai5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHRoaXMuc2hvdztcbiAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlciwgZHJhd2VyTmFtZSkgPT4ge1xuICAgICAgY29uc3QgaW5pdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnNbZHJhd2VyTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBkcmF3ZXJEYXRhU291cmNlcyA9IGRyYXdlci5pbml0KGluaXRPcHRpb25zKTtcbiAgICAgIC8vIG9ubHkgZW50aXRpZXMgZHJhd2VycyBjcmVhdGUgZGF0YSBzb3VyY2VzXG4gICAgICBpZiAoZHJhd2VyRGF0YVNvdXJjZXMpIHtcbiAgICAgICAgLy8gdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkcmF3ZXJEYXRhU291cmNlcywgdGhpcy56SW5kZXgpO1xuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgZm9sbG93aW5nIGxpbmUgY2F1c2VzIEJhZCBQZXJmb3JtYW5jZVxuICAgICAgICB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMucHVzaCguLi5kcmF3ZXJEYXRhU291cmNlcyk7XG4gICAgICB9XG4gICAgICBkcmF3ZXIuc2V0U2hvdyh0aGlzLnNob3cpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLnNob3cgJiYgIWNoYW5nZXMuc2hvdy5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNob3cgPSBzaG93VmFsdWU7XG4gICAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlcikgPT4gZHJhd2VyLnNldFNob3coc2hvd1ZhbHVlKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuekluZGV4ICYmICFjaGFuZ2VzLnpJbmRleC5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgekluZGV4VmFsdWUgPSBjaGFuZ2VzWyd6SW5kZXgnXS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB6SW5kZXhWYWx1ZTtcbiAgICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS51cGRhdGVBbmRSZWZyZXNoKHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcywgekluZGV4VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMpO1xuICAgIHRoaXMuc3RvcE9ic2VydmFibGUubmV4dCh0cnVlKTtcbiAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgZ2V0TGF5ZXJTZXJ2aWNlKCk6IExheWVyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgRGF0YVNvdXJjZXMgcmVnaXN0ZXJlZCBieSBhIGRyYXdlciBvZiB0aGlzIGxheWVyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXRMYXllckRyYXdlckRhdGFTb3VyY2VzKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQXJyYXkgb2YgRGF0YVNvdXJjZXMgb2YgdGhlIGRyYXdlciB3aXRoIHRoZSBwcm92aWRlZCBEYXRhU291cmNlLm5hbWVcbiAgICogRXhhbXBsZTogZ2V0RGF0YVNvdXJjZU9mRHJhd2VyKCdwb2x5bGluZScpIHJldHVybnMgdGhlIGRhdGFTb3VyY2Ugb2YgcG9seWxpbmUgZHJhd2VyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXREcmF3ZXJEYXRhU291cmNlc0J5TmFtZShuYW1lOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcy5maWx0ZXIoZCA9PiBkLm5hbWUgPT09IG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0U3RvcmUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXRpZXNTdG9yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBsYXllci5cbiAgICovXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5nZXREZXNjcmlwdGlvbnMoKS5mb3JFYWNoKChkZXNjcmlwdGlvbikgPT4gZGVzY3JpcHRpb24ucmVtb3ZlQWxsKCkpO1xuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShlbnRpdHlJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2lkOiBlbnRpdHlJZCwgYWN0aW9uVHlwZTogQWN0aW9uVHlwZS5ERUxFVEV9KTtcbiAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKGVudGl0eUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQvdXBkYXRlIGVudGl0eSB0by9mcm9tIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogQWNOb3RpZmljYXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dChub3RpZmljYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBBY0VudGl0eSwgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KHtlbnRpdHksIGlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkFERF9VUERBVEV9KTtcbiAgfVxuXG4gIHJlZnJlc2hBbGwoY29sbGVjdGlvbjogQWNOb3RpZmljYXRpb25bXSk6IHZvaWQge1xuICAgIC8vIFRPRE8gbWFrZSBlbnRpdHkgaW50ZXJmYWNlOiBjb2xsZWN0aW9uIG9mIHR5cGUgZW50aXR5IG5vdCBub3RpZmljYXRpb25cbiAgICBvYnNlcnZhYmxlRnJvbShjb2xsZWN0aW9uKS5zdWJzY3JpYmUoKGVudGl0eSkgPT4gdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoZW50aXR5KSk7XG4gIH1cbn1cbiJdfQ==
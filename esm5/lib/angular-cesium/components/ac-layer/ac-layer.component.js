/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var AcLayerComponent = /** @class */ (function () {
    function AcLayerComponent(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
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
    AcLayerComponent.prototype.init = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.initValidParams();
        observableMerge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((/**
         * @param {?} notification
         * @return {?}
         */
        function (notification) {
            _this._computationCache.clear();
            /** @type {?} */
            var contextEntity = notification.entity;
            if (_this.store) {
                contextEntity = _this.updateStore(notification);
            }
            _this.context[_this.entityName] = contextEntity;
            _this.layerService.getDescriptions().forEach((/**
             * @param {?} descriptionComponent
             * @return {?}
             */
            function (descriptionComponent) {
                switch (notification.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(_this.context, notification.id, contextEntity);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(notification.id);
                        break;
                    default:
                        console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
                }
            }));
        }));
    };
    /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    AcLayerComponent.prototype.updateStore = /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    function (notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                /** @type {?} */
                var entity = this.entitiesStore.get(notification.id);
                Object.assign(entity, notification.entity);
                return entity;
            }
            else {
                this.entitiesStore.set(notification.id, notification.entity);
                return notification.entity;
            }
        }
    };
    /**
     * @private
     * @return {?}
     */
    AcLayerComponent.prototype.initValidParams = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + this.acFor);
        }
        /** @type {?} */
        var acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    };
    /** Test for a rxjs Observable */
    /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    AcLayerComponent.prototype.isObservable = /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this.init();
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((/**
         * @param {?} drawer
         * @param {?} drawerName
         * @return {?}
         */
        function (drawer, drawerName) {
            var _a;
            /** @type {?} */
            var initOptions = _this.options ? _this.options[drawerName] : undefined;
            /** @type {?} */
            var drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                (_a = _this.layerDrawerDataSources).push.apply(_a, tslib_1.__spread(drawerDataSources));
            }
            drawer.setShow(_this.show);
        }));
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.show && !changes.show.firstChange) {
            /** @type {?} */
            var showValue_1 = changes['show'].currentValue;
            this.layerService.show = showValue_1;
            this._drawerList.forEach((/**
             * @param {?} drawer
             * @return {?}
             */
            function (drawer) { return drawer.setShow(showValue_1); }));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            /** @type {?} */
            var zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.getLayerService = /**
     * @return {?}
     */
    function () {
        return this.layerService;
    };
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getLayerDrawerDataSources = /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    function () {
        return this.layerDrawerDataSources;
    };
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getDrawerDataSourcesByName = /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    function (name) {
        return this.layerDrawerDataSources.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.name === name; }));
    };
    /**
     * Returns the store.
     */
    /**
     * Returns the store.
     * @return {?}
     */
    AcLayerComponent.prototype.getStore = /**
     * Returns the store.
     * @return {?}
     */
    function () {
        return this.entitiesStore;
    };
    /**
     * Remove all the entities from the layer.
     */
    /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    AcLayerComponent.prototype.removeAll = /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    function () {
        this.layerService.getDescriptions().forEach((/**
         * @param {?} description
         * @return {?}
         */
        function (description) { return description.removeAll(); }));
        this.entitiesStore.clear();
    };
    /**
     * remove entity from the layer
     */
    /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    AcLayerComponent.prototype.remove = /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    function (entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    };
    /**
     * add/update entity to/from the layer
     */
    /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    AcLayerComponent.prototype.updateNotification = /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    function (notification) {
        this._updateStream.next(notification);
    };
    /**
     * add/update entity to/from the layer
     */
    /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    AcLayerComponent.prototype.update = /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    function (entity, id) {
        this._updateStream.next({ entity: entity, id: id, actionType: ActionType.ADD_UPDATE });
    };
    /**
     * @param {?} collection
     * @return {?}
     */
    AcLayerComponent.prototype.refreshAll = /**
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        var _this = this;
        // TODO make entity interface: collection of type entity not notification
        observableFrom(collection).subscribe((/**
         * @param {?} entity
         * @return {?}
         */
        function (entity) { return _this._updateStream.next(entity); }));
    };
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
    AcLayerComponent.ctorParameters = function () { return [
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
    ]; };
    AcLayerComponent.propDecorators = {
        show: [{ type: Input }],
        acFor: [{ type: Input }],
        context: [{ type: Input }],
        store: [{ type: Input }],
        options: [{ type: Input }],
        zIndex: [{ type: Input }]
    };
    return AcLayerComponent;
}());
export { AcLayerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxLQUFLLElBQUksZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRWxGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUc5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVwRyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxRkFBcUYsQ0FBQztBQUNsSSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwrRkFB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IGFzIG9ic2VydmFibGVNZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4vLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQmlsbGJvYXJkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLWRyYXdlci9iaWxsYm9hcmQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1kcmF3ZXIvbGFiZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1kcmF3ZXIvcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1kcmF3ZXIvcG9pbnQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9sYXllci1vcHRpb25zJztcbmltcG9ydCB7IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNb2RlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL21vZGVsLWRyYXdlci9tb2RlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCb3hEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9ib3gtZGF3ZXIvYm94LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvcnJpZG9yRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY29ycmlkb3ItZGF3ZXIvY29ycmlkb3ItZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jeWxpbmRlci1kYXdlci9jeWxpbmRlci1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNvaWREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcG9pZC1kcmF3ZXIvZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtdm9sdW1lLWRhd2VyL3BvbHlsaW5lLXZvbHVtZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBXYWxsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvd2FsbC1kYXdlci93YWxsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3RhbmdsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3JlY3RhbmdsZS1kYXdlci9yZWN0YW5nbGUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtcHJpbWl0aXZlLWRyYXdlci9wb2ludC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSHRtbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2h0bWwtZHJhd2VyL2h0bWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3ptbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N6bWwtZHJhd2VyL2N6bWwtZHJhd2VyLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG4vKipcbiAqICBUaGlzIGlzIGEgYWMtbGF5ZXIgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxheWVyIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogICsgYWNGb3IgYHtzdHJpbmd9YCAtIGdldCB0aGUgdHJhY2tlZCBvYnNlcnZhYmxlIGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxuICogICsgc2hvdyBge2Jvb2xlYW59YCAtIHNob3cvaGlkZSBsYXllcidzIGVudGl0aWVzLlxuICogICsgY29udGV4dCBge2FueX1gIC0gZ2V0IHRoZSBjb250ZXh0IGxheWVyIHRoYXQgd2lsbCB1c2UgdGhlIGNvbXBvbm5ldCAobW9zdCBvZiB0aGUgdGltZSBlcXVhbCB0byBcInRoaXNcIikuXG4gKiAgKyBvcHRpb25zIGB7TGF5ZXJPcHRpb25zfWAgLSBzZXRzIHRoZSBsYXllciBvcHRpb25zIGZvciBlYWNoIGRyYXdlci5cbiAqICArIHpJbmRleCBge251bWJlcn1gIC0gY29udHJvbHMgdGhlIHpJbmRleCAob3JkZXIpIG9mIHRoZSBsYXllciwgbGF5ZXJzIHdpdGggZ3JlYXRlciB6SW5kZXggd2lsbCBiZSBpbiBmcm9udCBvZiBsYXllcnMgd2l0aCBsb3dlciB6SW5kZXhcbiAqICAgIChFeGNlcHRpb24gRm9yIGBCaWxsYm9hcmRgIGFuZCBgTGFiZWxgLCBzaG91bGQgdXNlIGBbZXllT2Zmc2V0XWAgcHJvcCBpbnN0ZWFkKTwvYnI+XG4gKiAgICB6SW5kZXggd29uJ3Qgd29yayBmb3IgcHJpdGltaXR2ZSBkZXNjcyAobGlrZSBhYy1wcmltaXRpdmUtcG9seWxpbmUuLi4pXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogIDxhYy1tYXA+XG4gKiAgICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW29wdGlvbnNdPVwib3B0aW9uc1wiIFt6SW5kZXhdPVwiMVwiPlxuICogICAgICA8YWMtYmlsbGJvYXJkLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgaW1hZ2U6IHRyYWNrLmltYWdlLFxuICogICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICBzY2FsZTogdHJhY2suc2NhbGUsXG4gKiAgICAgICAgY29sb3I6IHRyYWNrLmNvbG9yLFxuICogICAgICAgIG5hbWU6IHRyYWNrLm5hbWVcbiAqICAgICAgfVwiPlxuICogICAgICA8L2FjLWJpbGxib2FyZC1kZXNjPlxuICogICAgICAgIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICAgICAgdGV4dDogdHJhY2submFtZSxcbiAqICAgICAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICAgICAgfVwiPlxuICogICAgICA8L2FjLWxhYmVsLWRlc2M+XG4gKiAgICA8L2FjLWxheWVyPlxuICogIDwvYWMtbWFwPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1sYXllcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHByb3ZpZGVyczogW1xuICAgIExheWVyU2VydmljZSxcbiAgICBDb21wdXRhdGlvbkNhY2hlLFxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBNb2RlbERyYXdlclNlcnZpY2UsXG4gICAgQm94RHJhd2VyU2VydmljZSxcbiAgICBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgIFdhbGxEcmF3ZXJTZXJ2aWNlLFxuICAgIFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBIdG1sRHJhd2VyU2VydmljZSxcbiAgICBDem1sRHJhd2VyU2VydmljZSxcblxuICAgIER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQWNMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBzaG93ID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgYWNGb3I6IHN0cmluZztcbiAgQElucHV0KClcbiAgY29udGV4dDogYW55O1xuICBASW5wdXQoKVxuICBzdG9yZSA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBvcHRpb25zOiBMYXllck9wdGlvbnM7XG4gIEBJbnB1dCgpXG4gIHpJbmRleCA9IDA7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhY0ZvclJneCA9IC9ebGV0XFxzKy4rXFxzK29mXFxzKy4rJC87XG4gIHByaXZhdGUgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHN0b3BPYnNlcnZhYmxlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIG9ic2VydmFibGU6IE9ic2VydmFibGU8QWNOb3RpZmljYXRpb24+O1xuICBwcml2YXRlIF9kcmF3ZXJMaXN0OiBNYXA8c3RyaW5nLCBCYXNpY0RyYXdlclNlcnZpY2U+O1xuICBwcml2YXRlIF91cGRhdGVTdHJlYW06IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+ID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHByaXZhdGUgZW50aXRpZXNTdG9yZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gIHByaXZhdGUgbGF5ZXJEcmF3ZXJEYXRhU291cmNlczogYW55W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLFxuICAgICAgICAgICAgICBwcml2YXRlIG1hcExheWVyc1NlcnZpY2U6IE1hcExheWVyc1NlcnZpY2UsXG4gICAgICAgICAgICAgIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGxhYmVsRHJhd2VyU2VydmljZTogTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5Z29uRHJhd2VyU2VydmljZTogUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGFyY0RyYXdlclNlcnZpY2U6IEFyY0RyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBtb2RlbERyYXdlclNlcnZpY2U6IE1vZGVsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYm94RHJhd2VyU2VydmljZTogQm94RHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY29ycmlkb3JEcmF3ZXJTZXJ2aWNlOiBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGN5bGluZGVyRHJhd2VyU2VydmljZTogQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNvaWREcmF3ZXJTZXJpY2U6IEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZTogUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICB3YWxsRHJhd2VyU2VydmljZTogV2FsbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHJlY3RhbmdsZURyYXdlclNlcnZpY2U6IFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGR5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZTogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZTogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZTogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGh0bWxEcmF3ZXJTZXJ2aWNlOiBIdG1sRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuX2RyYXdlckxpc3QgPSBuZXcgTWFwKFtcbiAgICAgIFsnYmlsbGJvYXJkJywgYmlsbGJvYXJkRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2xhYmVsJywgbGFiZWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZWxsaXBzZScsIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWxpbmUnLCBwb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5Z29uJywgcG9seWdvbkRyYXdlclNlcnZpY2UgYXMgQmFzaWNEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYXJjJywgYXJjRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvaW50JywgcG9pbnREcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbW9kZWwnLCBtb2RlbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydib3gnLCBib3hEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY29ycmlkb3InLCBjb3JyaWRvckRyYXdlclNlcnZpY2VdLFxuICAgICAgWydjeWxpbmRlcicsIGN5bGluZGVyRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2VsbGlwc29pZCcsIGVsbGlwc29pZERyYXdlclNlcmljZV0sXG4gICAgICBbJ3BvbHlsaW5lVm9sdW1lJywgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncmVjdGFuZ2xlJywgcmVjdGFuZ2xlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3dhbGwnLCB3YWxsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlsaW5lUHJpbWl0aXZlJywgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbGFiZWxQcmltaXRpdmUnLCBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydiaWxsYm9hcmRQcmltaXRpdmUnLCBiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9pbnRQcmltaXRpdmUnLCBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydodG1sJywgaHRtbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydjem1sJywgY3ptbERyYXdlclNlcnZpY2VdLFxuXG4gICAgICBbJ2R5bmFtaWNFbGxpcHNlJywgZHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZHluYW1pY1BvbHlsaW5lJywgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0NpcmNsZScsIHN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNQb2x5bGluZScsIHN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY1BvbHlnb24nLCBzdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0VsbGlwc2UnLCBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgXSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdFZhbGlkUGFyYW1zKCk7XG5cbiAgICBvYnNlcnZhYmxlTWVyZ2UodGhpcy5fdXBkYXRlU3RyZWFtLCB0aGlzLm9ic2VydmFibGUpLnBpcGU8QWNOb3RpZmljYXRpb24+KHRha2VVbnRpbCh0aGlzLnN0b3BPYnNlcnZhYmxlKSkuc3Vic2NyaWJlKChub3RpZmljYXRpb24pID0+IHtcbiAgICAgIHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUuY2xlYXIoKTtcblxuICAgICAgbGV0IGNvbnRleHRFbnRpdHkgPSBub3RpZmljYXRpb24uZW50aXR5O1xuICAgICAgaWYgKHRoaXMuc3RvcmUpIHtcbiAgICAgICAgY29udGV4dEVudGl0eSA9IHRoaXMudXBkYXRlU3RvcmUobm90aWZpY2F0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250ZXh0W3RoaXMuZW50aXR5TmFtZV0gPSBjb250ZXh0RW50aXR5O1xuICAgICAgdGhpcy5sYXllclNlcnZpY2UuZ2V0RGVzY3JpcHRpb25zKCkuZm9yRWFjaCgoZGVzY3JpcHRpb25Db21wb25lbnQpID0+IHtcbiAgICAgICAgc3dpdGNoIChub3RpZmljYXRpb24uYWN0aW9uVHlwZSkge1xuICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS5BRERfVVBEQVRFOlxuICAgICAgICAgICAgZGVzY3JpcHRpb25Db21wb25lbnQuZHJhdyh0aGlzLmNvbnRleHQsIG5vdGlmaWNhdGlvbi5pZCwgY29udGV4dEVudGl0eSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuREVMRVRFOlxuICAgICAgICAgICAgZGVzY3JpcHRpb25Db21wb25lbnQucmVtb3ZlKG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FjLWxheWVyXSB1bmtub3duIEFjTm90aWZpY2F0aW9uLmFjdGlvblR5cGUgZm9yIG5vdGlmaWNhdGlvbjogJyArIG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTdG9yZShub3RpZmljYXRpb246IEFjTm90aWZpY2F0aW9uKTogYW55IHtcbiAgICBpZiAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuREVMRVRFKSB7XG4gICAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5lbnRpdGllc1N0b3JlLmhhcyhub3RpZmljYXRpb24uaWQpKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNTdG9yZS5nZXQobm90aWZpY2F0aW9uLmlkKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIG5vdGlmaWNhdGlvbi5lbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1N0b3JlLnNldChub3RpZmljYXRpb24uaWQsIG5vdGlmaWNhdGlvbi5lbnRpdHkpO1xuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmVudGl0eTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRWYWxpZFBhcmFtcygpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhYy1sYXllcjogbXVzdCBpbml0aWFsaXplIFtjb250ZXh0XSAnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWNGb3JSZ3gudGVzdCh0aGlzLmFjRm9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBhYy1sYXllcjogSW52YWxpZCBbYWNGb3JdIHN5bnRheC4gRXhwZWN0ZWQ6IFthY0Zvcl09XCJsZXQgaXRlbSBvZiBvYnNlcnZhYmxlXCIgLkluc3RlYWQgcmVjZWl2ZWQ6ICR7dGhpcy5hY0Zvcn1gKTtcbiAgICB9XG4gICAgY29uc3QgYWNGb3JBcnIgPSB0aGlzLmFjRm9yLnNwbGl0KCcgJyk7XG4gICAgdGhpcy5vYnNlcnZhYmxlID0gdGhpcy5jb250ZXh0W2FjRm9yQXJyWzNdXTtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcbiAgICBpZiAoIXRoaXMuaXNPYnNlcnZhYmxlKHRoaXMub2JzZXJ2YWJsZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWMtbGF5ZXI6IG11c3QgaW5pdGFpbGl6ZSBbYWNGb3JdIHdpdGggcnggb2JzZXJ2YWJsZSwgaW5zdGVhZCByZWNlaXZlZDogJyArIHRoaXMub2JzZXJ2YWJsZSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICB0aGlzLmxheWVyU2VydmljZS5zZXRFbnRpdHlOYW1lKHRoaXMuZW50aXR5TmFtZSk7XG4gIH1cblxuICAvKiogVGVzdCBmb3IgYSByeGpzIE9ic2VydmFibGUgKi9cbiAgcHJpdmF0ZSBpc09ic2VydmFibGUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAvKiBjaGVjayB2aWEgZHVjay10eXBpbmcgcmF0aGVyIHRoYW4gaW5zdGFuY2Ugb2ZcbiAgICAgKiB0byBhbGxvdyBwYXNzaW5nIGJldHdlZW4gd2luZG93IGNvbnRleHRzICovXG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB0aGlzLmxheWVyU2VydmljZS5zaG93ID0gdGhpcy5zaG93O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnpJbmRleCA9IHRoaXMuekluZGV4O1xuICAgIHRoaXMuX2RyYXdlckxpc3QuZm9yRWFjaCgoZHJhd2VyLCBkcmF3ZXJOYW1lKSA9PiB7XG4gICAgICBjb25zdCBpbml0T3B0aW9ucyA9IHRoaXMub3B0aW9ucyA/IHRoaXMub3B0aW9uc1tkcmF3ZXJOYW1lXSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGRyYXdlckRhdGFTb3VyY2VzID0gZHJhd2VyLmluaXQoaW5pdE9wdGlvbnMpO1xuICAgICAgLy8gb25seSBlbnRpdGllcyBkcmF3ZXJzIGNyZWF0ZSBkYXRhIHNvdXJjZXNcbiAgICAgIGlmIChkcmF3ZXJEYXRhU291cmNlcykge1xuICAgICAgICAvLyB0aGlzLm1hcExheWVyc1NlcnZpY2UucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRyYXdlckRhdGFTb3VyY2VzLCB0aGlzLnpJbmRleCk7XG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBmb2xsb3dpbmcgbGluZSBjYXVzZXMgQmFkIFBlcmZvcm1hbmNlXG4gICAgICAgIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcy5wdXNoKC4uLmRyYXdlckRhdGFTb3VyY2VzKTtcbiAgICAgIH1cbiAgICAgIGRyYXdlci5zZXRTaG93KHRoaXMuc2hvdyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuc2hvdyAmJiAhY2hhbmdlcy5zaG93LmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBzaG93VmFsdWUgPSBjaGFuZ2VzWydzaG93J10uY3VycmVudFZhbHVlO1xuICAgICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHNob3dWYWx1ZTtcbiAgICAgIHRoaXMuX2RyYXdlckxpc3QuZm9yRWFjaCgoZHJhd2VyKSA9PiBkcmF3ZXIuc2V0U2hvdyhzaG93VmFsdWUpKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy56SW5kZXggJiYgIWNoYW5nZXMuekluZGV4LmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCB6SW5kZXhWYWx1ZSA9IGNoYW5nZXNbJ3pJbmRleCddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnpJbmRleCA9IHpJbmRleFZhbHVlO1xuICAgICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnVwZGF0ZUFuZFJlZnJlc2godGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLCB6SW5kZXhWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnJlbW92ZURhdGFTb3VyY2VzKHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcyk7XG4gICAgdGhpcy5zdG9wT2JzZXJ2YWJsZS5uZXh0KHRydWUpO1xuICAgIHRoaXMucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBnZXRMYXllclNlcnZpY2UoKTogTGF5ZXJTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5sYXllclNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBEYXRhU291cmNlcyByZWdpc3RlcmVkIGJ5IGEgZHJhd2VyIG9mIHRoaXMgbGF5ZXJcbiAgICogQHJldHVybiBBcnJheSBvZiBDZXNpdW0uRGF0YVNvdXJjZXNcbiAgICovXG4gIGdldExheWVyRHJhd2VyRGF0YVNvdXJjZXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBBcnJheSBvZiBEYXRhU291cmNlcyBvZiB0aGUgZHJhd2VyIHdpdGggdGhlIHByb3ZpZGVkIERhdGFTb3VyY2UubmFtZVxuICAgKiBFeGFtcGxlOiBnZXREYXRhU291cmNlT2ZEcmF3ZXIoJ3BvbHlsaW5lJykgcmV0dXJucyB0aGUgZGF0YVNvdXJjZSBvZiBwb2x5bGluZSBkcmF3ZXJcbiAgICogQHJldHVybiBBcnJheSBvZiBDZXNpdW0uRGF0YVNvdXJjZXNcbiAgICovXG4gIGdldERyYXdlckRhdGFTb3VyY2VzQnlOYW1lKG5hbWU6IHN0cmluZyk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLmZpbHRlcihkID0+IGQubmFtZSA9PT0gbmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RvcmUuXG4gICAqL1xuICBnZXRTdG9yZSgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdGllc1N0b3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIGVudGl0aWVzIGZyb20gdGhlIGxheWVyLlxuICAgKi9cbiAgcmVtb3ZlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uKSA9PiBkZXNjcmlwdGlvbi5yZW1vdmVBbGwoKSk7XG4gICAgdGhpcy5lbnRpdGllc1N0b3JlLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIGVudGl0eSBmcm9tIHRoZSBsYXllclxuICAgKi9cbiAgcmVtb3ZlKGVudGl0eUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dCh7aWQ6IGVudGl0eUlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkRFTEVURX0pO1xuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5kZWxldGUoZW50aXR5SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KG5vdGlmaWNhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogYWRkL3VwZGF0ZSBlbnRpdHkgdG8vZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IEFjRW50aXR5LCBpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2VudGl0eSwgaWQsIGFjdGlvblR5cGU6IEFjdGlvblR5cGUuQUREX1VQREFURX0pO1xuICB9XG5cbiAgcmVmcmVzaEFsbChjb2xsZWN0aW9uOiBBY05vdGlmaWNhdGlvbltdKTogdm9pZCB7XG4gICAgLy8gVE9ETyBtYWtlIGVudGl0eSBpbnRlcmZhY2U6IGNvbGxlY3Rpb24gb2YgdHlwZSBlbnRpdHkgbm90IG5vdGlmaWNhdGlvblxuICAgIG9ic2VydmFibGVGcm9tKGNvbGxlY3Rpb24pLnN1YnNjcmliZSgoZW50aXR5KSA9PiB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dChlbnRpdHkpKTtcbiAgfVxufVxuIl19
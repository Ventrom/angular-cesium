import { __decorate, __metadata, __read, __spread } from "tslib";
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
var AcLayerComponent = /** @class */ (function () {
    function AcLayerComponent(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
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
    AcLayerComponent.prototype.init = function () {
        var _this = this;
        this.initValidParams();
        observableMerge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe(function (notification) {
            _this._computationCache.clear();
            if (_this.debug) {
                console.log('AcLayer received notification:', notification);
            }
            var contextEntity = notification.entity;
            if (_this.store) {
                contextEntity = _this.updateStore(notification);
            }
            _this.context[_this.entityName] = contextEntity;
            _this.layerService.getDescriptions().forEach(function (descriptionComponent) {
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
            });
        });
    };
    AcLayerComponent.prototype.updateStore = function (notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
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
    AcLayerComponent.prototype.initValidParams = function () {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + this.acFor);
        }
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
    AcLayerComponent.prototype.isObservable = function (obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    };
    AcLayerComponent.prototype.ngAfterContentInit = function () {
        this.init();
    };
    AcLayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach(function (drawer, drawerName) {
            var _a;
            var initOptions = _this.options ? _this.options[drawerName] : undefined;
            var drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                (_a = _this.layerDrawerDataSources).push.apply(_a, __spread(drawerDataSources));
            }
            drawer.setShow(_this.show);
        });
    };
    AcLayerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.show && !changes.show.firstChange) {
            var showValue_1 = changes['show'].currentValue;
            this.layerService.show = showValue_1;
            this._drawerList.forEach(function (drawer) { return drawer.setShow(showValue_1); });
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            var zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    };
    AcLayerComponent.prototype.ngOnDestroy = function () {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    };
    AcLayerComponent.prototype.getLayerService = function () {
        return this.layerService;
    };
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getLayerDrawerDataSources = function () {
        return this.layerDrawerDataSources;
    };
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getDrawerDataSourcesByName = function (name) {
        return this.layerDrawerDataSources.filter(function (d) { return d.name === name; });
    };
    /**
     * Returns the store.
     */
    AcLayerComponent.prototype.getStore = function () {
        return this.entitiesStore;
    };
    /**
     * Remove all the entities from the layer.
     */
    AcLayerComponent.prototype.removeAll = function () {
        this.layerService.getDescriptions().forEach(function (description) { return description.removeAll(); });
        this.entitiesStore.clear();
    };
    /**
     * remove entity from the layer
     */
    AcLayerComponent.prototype.remove = function (entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    };
    /**
     * add/update entity to/from the layer
     */
    AcLayerComponent.prototype.updateNotification = function (notification) {
        this._updateStream.next(notification);
    };
    /**
     * add/update entity to/from the layer
     */
    AcLayerComponent.prototype.update = function (entity, id) {
        this._updateStream.next({ entity: entity, id: id, actionType: ActionType.ADD_UPDATE });
    };
    AcLayerComponent.prototype.refreshAll = function (collection) {
        var _this = this;
        // TODO make entity interface: collection of type entity not notification
        observableFrom(collection).subscribe(function (entity) { return _this._updateStream.next(entity); });
    };
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
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "show", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcLayerComponent.prototype, "acFor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "context", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "store", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "zIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "debug", void 0);
    AcLayerComponent = __decorate([
        Component({
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
        }),
        __metadata("design:paramtypes", [LayerService,
            ComputationCache,
            MapLayersService,
            BillboardDrawerService,
            LabelDrawerService,
            EllipseDrawerService,
            PolylineDrawerService,
            PolygonDrawerService,
            ArcDrawerService,
            PointDrawerService,
            ModelDrawerService,
            BoxDrawerService,
            CorridorDrawerService,
            CylinderDrawerService,
            EllipsoidDrawerService,
            PolylineVolumeDrawerService,
            WallDrawerService,
            RectangleDrawerService,
            DynamicEllipseDrawerService,
            DynamicPolylineDrawerService,
            StaticCircleDrawerService,
            StaticPolylineDrawerService,
            StaticPolygonDrawerService,
            StaticEllipseDrawerService,
            PolylinePrimitiveDrawerService,
            LabelPrimitiveDrawerService,
            BillboardPrimitiveDrawerService,
            PointPrimitiveDrawerService,
            HtmlDrawerService,
            CzmlDrawerService])
    ], AcLayerComponent);
    return AcLayerComponent;
}());
export { AcLayerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxJQUFJLElBQUksY0FBYyxFQUFFLEtBQUssSUFBSSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFvQix1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFFbEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBRzlGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBRXBHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFGQUFxRixDQUFDO0FBQ2xJLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxN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aEIsMkJBQTJCO1lBQ3JDLGlCQUFpQjtZQUNaLHNCQUFzQjtZQUNqQiwyQkFBMkI7WUFDMUIsNEJBQTRCO1lBQy9CLHlCQUF5QjtZQUN2QiwyQkFBMkI7WUFDNUIsMEJBQTBCO1lBQzFCLDBCQUEwQjtZQUN0Qiw4QkFBOEI7WUFDakMsMkJBQTJCO1lBQ3ZCLCtCQUErQjtZQUNuQywyQkFBMkI7WUFDckMsaUJBQWlCO1lBQ2pCLGlCQUFpQjtPQXREckMsZ0JBQWdCLENBeVE1QjtJQUFELHVCQUFDO0NBQUEsQUF6UUQsSUF5UUM7U0F6UVksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbSBhcyBvYnNlcnZhYmxlRnJvbSwgbWVyZ2UgYXMgb2JzZXJ2YWJsZU1lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbi8vIHRzbGludDpkaXNhYmxlXG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWN0aW9uLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheWVyLW9wdGlvbnMnO1xuaW1wb3J0IHsgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlsaW5lLWRyYXdlci9zdGF0aWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbW9kZWwtZHJhd2VyL21vZGVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJveERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JveC1kYXdlci9ib3gtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jb3JyaWRvci1kYXdlci9jb3JyaWRvci1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDeWxpbmRlckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc29pZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwb2lkLWRyYXdlci9lbGxpcHNvaWQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS12b2x1bWUtZGF3ZXIvcG9seWxpbmUtdm9sdW1lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFdhbGxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy93YWxsLWRhd2VyL3dhbGwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcmVjdGFuZ2xlLWRhd2VyL3JlY3RhbmdsZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci9sYWJlbC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIdG1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcbi8qKlxuICogIFRoaXMgaXMgYSBhYy1sYXllciBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGF5ZXIgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgKyBhY0ZvciBge3N0cmluZ31gIC0gZ2V0IHRoZSB0cmFja2VkIG9ic2VydmFibGUgYW5kIGVudGl0eU5hbWUgKHNlZSB0aGUgZXhhbXBsZSkuXG4gKiAgKyBzaG93IGB7Ym9vbGVhbn1gIC0gc2hvdy9oaWRlIGxheWVyJ3MgZW50aXRpZXMuXG4gKiAgKyBjb250ZXh0IGB7YW55fWAgLSBnZXQgdGhlIGNvbnRleHQgbGF5ZXIgdGhhdCB3aWxsIHVzZSB0aGUgY29tcG9ubmV0IChtb3N0IG9mIHRoZSB0aW1lIGVxdWFsIHRvIFwidGhpc1wiKS5cbiAqICArIG9wdGlvbnMgYHtMYXllck9wdGlvbnN9YCAtIHNldHMgdGhlIGxheWVyIG9wdGlvbnMgZm9yIGVhY2ggZHJhd2VyLlxuICogICsgekluZGV4IGB7bnVtYmVyfWAgLSBjb250cm9scyB0aGUgekluZGV4IChvcmRlcikgb2YgdGhlIGxheWVyLCBsYXllcnMgd2l0aCBncmVhdGVyIHpJbmRleCB3aWxsIGJlIGluIGZyb250IG9mIGxheWVycyB3aXRoIGxvd2VyIHpJbmRleFxuICogICAgKEV4Y2VwdGlvbiBGb3IgYEJpbGxib2FyZGAgYW5kIGBMYWJlbGAsIHNob3VsZCB1c2UgYFtleWVPZmZzZXRdYCBwcm9wIGluc3RlYWQpPC9icj5cbiAqICAgIHpJbmRleCB3b24ndCB3b3JrIGZvciBwcml0aW1pdHZlIGRlc2NzIChsaWtlIGFjLXByaW1pdGl2ZS1wb2x5bGluZS4uLilcbiAqICArIGRlYnVnIGB7Ym9vbGVhbn1gIC0gcHJpbnRzIGV2ZXJ5IGFjTm90aWZpY2F0aW9uXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogIDxhYy1tYXA+XG4gKiAgICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW29wdGlvbnNdPVwib3B0aW9uc1wiIFt6SW5kZXhdPVwiMVwiPlxuICogICAgICA8YWMtYmlsbGJvYXJkLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgaW1hZ2U6IHRyYWNrLmltYWdlLFxuICogICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICBzY2FsZTogdHJhY2suc2NhbGUsXG4gKiAgICAgICAgY29sb3I6IHRyYWNrLmNvbG9yLFxuICogICAgICAgIG5hbWU6IHRyYWNrLm5hbWVcbiAqICAgICAgfVwiPlxuICogICAgICA8L2FjLWJpbGxib2FyZC1kZXNjPlxuICogICAgICAgIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICAgICAgdGV4dDogdHJhY2submFtZSxcbiAqICAgICAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICAgICAgfVwiPlxuICogICAgICA8L2FjLWxhYmVsLWRlc2M+XG4gKiAgICA8L2FjLWxheWVyPlxuICogIDwvYWMtbWFwPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1sYXllcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHByb3ZpZGVyczogW1xuICAgIExheWVyU2VydmljZSxcbiAgICBDb21wdXRhdGlvbkNhY2hlLFxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBNb2RlbERyYXdlclNlcnZpY2UsXG4gICAgQm94RHJhd2VyU2VydmljZSxcbiAgICBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgIFdhbGxEcmF3ZXJTZXJ2aWNlLFxuICAgIFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBIdG1sRHJhd2VyU2VydmljZSxcbiAgICBDem1sRHJhd2VyU2VydmljZSxcblxuICAgIER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQWNMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBzaG93ID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgYWNGb3I6IHN0cmluZztcbiAgQElucHV0KClcbiAgY29udGV4dDogYW55O1xuICBASW5wdXQoKVxuICBzdG9yZSA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBvcHRpb25zOiBMYXllck9wdGlvbnM7XG4gIEBJbnB1dCgpXG4gIHpJbmRleCA9IDA7XG4gIEBJbnB1dCgpXG4gIGRlYnVnID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhY0ZvclJneCA9IC9ebGV0XFxzKy4rXFxzK29mXFxzKy4rJC87XG4gIHByaXZhdGUgZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHN0b3BPYnNlcnZhYmxlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIG9ic2VydmFibGU6IE9ic2VydmFibGU8QWNOb3RpZmljYXRpb24+O1xuICBwcml2YXRlIF9kcmF3ZXJMaXN0OiBNYXA8c3RyaW5nLCBCYXNpY0RyYXdlclNlcnZpY2U+O1xuICBwcml2YXRlIF91cGRhdGVTdHJlYW06IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+ID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHByaXZhdGUgZW50aXRpZXNTdG9yZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gIHByaXZhdGUgbGF5ZXJEcmF3ZXJEYXRhU291cmNlczogYW55W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLFxuICAgICAgICAgICAgICBwcml2YXRlIG1hcExheWVyc1NlcnZpY2U6IE1hcExheWVyc1NlcnZpY2UsXG4gICAgICAgICAgICAgIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGxhYmVsRHJhd2VyU2VydmljZTogTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2x5Z29uRHJhd2VyU2VydmljZTogUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGFyY0RyYXdlclNlcnZpY2U6IEFyY0RyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBtb2RlbERyYXdlclNlcnZpY2U6IE1vZGVsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYm94RHJhd2VyU2VydmljZTogQm94RHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY29ycmlkb3JEcmF3ZXJTZXJ2aWNlOiBDb3JyaWRvckRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGN5bGluZGVyRHJhd2VyU2VydmljZTogQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBlbGxpcHNvaWREcmF3ZXJTZXJpY2U6IEVsbGlwc29pZERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZTogUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICB3YWxsRHJhd2VyU2VydmljZTogV2FsbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHJlY3RhbmdsZURyYXdlclNlcnZpY2U6IFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGR5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZTogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZTogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZTogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGh0bWxEcmF3ZXJTZXJ2aWNlOiBIdG1sRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuX2RyYXdlckxpc3QgPSBuZXcgTWFwKFtcbiAgICAgIFsnYmlsbGJvYXJkJywgYmlsbGJvYXJkRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2xhYmVsJywgbGFiZWxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZWxsaXBzZScsIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWxpbmUnLCBwb2x5bGluZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5Z29uJywgcG9seWdvbkRyYXdlclNlcnZpY2UgYXMgQmFzaWNEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnYXJjJywgYXJjRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvaW50JywgcG9pbnREcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbW9kZWwnLCBtb2RlbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydib3gnLCBib3hEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnY29ycmlkb3InLCBjb3JyaWRvckRyYXdlclNlcnZpY2VdLFxuICAgICAgWydjeWxpbmRlcicsIGN5bGluZGVyRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2VsbGlwc29pZCcsIGVsbGlwc29pZERyYXdlclNlcmljZV0sXG4gICAgICBbJ3BvbHlsaW5lVm9sdW1lJywgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncmVjdGFuZ2xlJywgcmVjdGFuZ2xlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3dhbGwnLCB3YWxsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlsaW5lUHJpbWl0aXZlJywgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbGFiZWxQcmltaXRpdmUnLCBsYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydiaWxsYm9hcmRQcmltaXRpdmUnLCBiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9pbnRQcmltaXRpdmUnLCBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydodG1sJywgaHRtbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydjem1sJywgY3ptbERyYXdlclNlcnZpY2VdLFxuXG4gICAgICBbJ2R5bmFtaWNFbGxpcHNlJywgZHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZHluYW1pY1BvbHlsaW5lJywgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0NpcmNsZScsIHN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydzdGF0aWNQb2x5bGluZScsIHN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY1BvbHlnb24nLCBzdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY0VsbGlwc2UnLCBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXG4gICAgXSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdFZhbGlkUGFyYW1zKCk7XG5cbiAgICBvYnNlcnZhYmxlTWVyZ2UodGhpcy5fdXBkYXRlU3RyZWFtLCB0aGlzLm9ic2VydmFibGUpLnBpcGU8QWNOb3RpZmljYXRpb24+KHRha2VVbnRpbCh0aGlzLnN0b3BPYnNlcnZhYmxlKSkuc3Vic2NyaWJlKChub3RpZmljYXRpb24pID0+IHtcbiAgICAgIHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUuY2xlYXIoKTtcblxuICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0FjTGF5ZXIgcmVjZWl2ZWQgbm90aWZpY2F0aW9uOicsIG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb250ZXh0RW50aXR5ID0gbm90aWZpY2F0aW9uLmVudGl0eTtcbiAgICAgIGlmICh0aGlzLnN0b3JlKSB7XG4gICAgICAgIGNvbnRleHRFbnRpdHkgPSB0aGlzLnVwZGF0ZVN0b3JlKG5vdGlmaWNhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGV4dFt0aGlzLmVudGl0eU5hbWVdID0gY29udGV4dEVudGl0eTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuQUREX1VQREFURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LmRyYXcodGhpcy5jb250ZXh0LCBub3RpZmljYXRpb24uaWQsIGNvbnRleHRFbnRpdHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBY3Rpb25UeXBlLkRFTEVURTpcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uQ29tcG9uZW50LnJlbW92ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thYy1sYXllcl0gdW5rbm93biBBY05vdGlmaWNhdGlvbi5hY3Rpb25UeXBlIGZvciBub3RpZmljYXRpb246ICcgKyBub3RpZmljYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU3RvcmUobm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IGFueSB7XG4gICAgaWYgKG5vdGlmaWNhdGlvbi5hY3Rpb25UeXBlID09PSBBY3Rpb25UeXBlLkRFTEVURSkge1xuICAgICAgdGhpcy5lbnRpdGllc1N0b3JlLmRlbGV0ZShub3RpZmljYXRpb24uaWQpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZW50aXRpZXNTdG9yZS5oYXMobm90aWZpY2F0aW9uLmlkKSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmVudGl0aWVzU3RvcmUuZ2V0KG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNTdG9yZS5zZXQobm90aWZpY2F0aW9uLmlkLCBub3RpZmljYXRpb24uZW50aXR5KTtcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbi5lbnRpdHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0VmFsaWRQYXJhbXMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWMtbGF5ZXI6IG11c3QgaW5pdGlhbGl6ZSBbY29udGV4dF0gJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QodGhpcy5hY0ZvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke3RoaXMuYWNGb3J9YCk7XG4gICAgfVxuICAgIGNvbnN0IGFjRm9yQXJyID0gdGhpcy5hY0Zvci5zcGxpdCgnICcpO1xuICAgIHRoaXMub2JzZXJ2YWJsZSA9IHRoaXMuY29udGV4dFthY0ZvckFyclszXV07XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gYWNGb3JBcnJbMV07XG4gICAgaWYgKCF0aGlzLmlzT2JzZXJ2YWJsZSh0aGlzLm9ic2VydmFibGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRhaWxpemUgW2FjRm9yXSB3aXRoIHJ4IG9ic2VydmFibGUsIGluc3RlYWQgcmVjZWl2ZWQ6ICcgKyB0aGlzLm9ic2VydmFibGUpO1xuICAgIH1cblxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2V0RW50aXR5TmFtZSh0aGlzLmVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIFRlc3QgZm9yIGEgcnhqcyBPYnNlcnZhYmxlICovXG4gIHByaXZhdGUgaXNPYnNlcnZhYmxlKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgLyogY2hlY2sgdmlhIGR1Y2stdHlwaW5nIHJhdGhlciB0aGFuIGluc3RhbmNlIG9mXG4gICAgICogdG8gYWxsb3cgcGFzc2luZyBiZXR3ZWVuIHdpbmRvdyBjb250ZXh0cyAqL1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iai5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHRoaXMuc2hvdztcbiAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB0aGlzLnpJbmRleDtcbiAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlciwgZHJhd2VyTmFtZSkgPT4ge1xuICAgICAgY29uc3QgaW5pdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnNbZHJhd2VyTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBkcmF3ZXJEYXRhU291cmNlcyA9IGRyYXdlci5pbml0KGluaXRPcHRpb25zKTtcbiAgICAgIC8vIG9ubHkgZW50aXRpZXMgZHJhd2VycyBjcmVhdGUgZGF0YSBzb3VyY2VzXG4gICAgICBpZiAoZHJhd2VyRGF0YVNvdXJjZXMpIHtcbiAgICAgICAgLy8gdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkcmF3ZXJEYXRhU291cmNlcywgdGhpcy56SW5kZXgpO1xuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgZm9sbG93aW5nIGxpbmUgY2F1c2VzIEJhZCBQZXJmb3JtYW5jZVxuICAgICAgICB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMucHVzaCguLi5kcmF3ZXJEYXRhU291cmNlcyk7XG4gICAgICB9XG4gICAgICBkcmF3ZXIuc2V0U2hvdyh0aGlzLnNob3cpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLnNob3cgJiYgIWNoYW5nZXMuc2hvdy5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNob3cgPSBzaG93VmFsdWU7XG4gICAgICB0aGlzLl9kcmF3ZXJMaXN0LmZvckVhY2goKGRyYXdlcikgPT4gZHJhd2VyLnNldFNob3coc2hvd1ZhbHVlKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuekluZGV4ICYmICFjaGFuZ2VzLnpJbmRleC5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgekluZGV4VmFsdWUgPSBjaGFuZ2VzWyd6SW5kZXgnXS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB6SW5kZXhWYWx1ZTtcbiAgICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS51cGRhdGVBbmRSZWZyZXNoKHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcywgekluZGV4VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMpO1xuICAgIHRoaXMuc3RvcE9ic2VydmFibGUubmV4dCh0cnVlKTtcbiAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgZ2V0TGF5ZXJTZXJ2aWNlKCk6IExheWVyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgRGF0YVNvdXJjZXMgcmVnaXN0ZXJlZCBieSBhIGRyYXdlciBvZiB0aGlzIGxheWVyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXRMYXllckRyYXdlckRhdGFTb3VyY2VzKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gQXJyYXkgb2YgRGF0YVNvdXJjZXMgb2YgdGhlIGRyYXdlciB3aXRoIHRoZSBwcm92aWRlZCBEYXRhU291cmNlLm5hbWVcbiAgICogRXhhbXBsZTogZ2V0RGF0YVNvdXJjZU9mRHJhd2VyKCdwb2x5bGluZScpIHJldHVybnMgdGhlIGRhdGFTb3VyY2Ugb2YgcG9seWxpbmUgZHJhd2VyXG4gICAqIEByZXR1cm4gQXJyYXkgb2YgQ2VzaXVtLkRhdGFTb3VyY2VzXG4gICAqL1xuICBnZXREcmF3ZXJEYXRhU291cmNlc0J5TmFtZShuYW1lOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcy5maWx0ZXIoZCA9PiBkLm5hbWUgPT09IG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0b3JlLlxuICAgKi9cbiAgZ2V0U3RvcmUoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXRpZXNTdG9yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBsYXllci5cbiAgICovXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5nZXREZXNjcmlwdGlvbnMoKS5mb3JFYWNoKChkZXNjcmlwdGlvbikgPT4gZGVzY3JpcHRpb24ucmVtb3ZlQWxsKCkpO1xuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShlbnRpdHlJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2lkOiBlbnRpdHlJZCwgYWN0aW9uVHlwZTogQWN0aW9uVHlwZS5ERUxFVEV9KTtcbiAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKGVudGl0eUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGQvdXBkYXRlIGVudGl0eSB0by9mcm9tIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogQWNOb3RpZmljYXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dChub3RpZmljYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGUoZW50aXR5OiBBY0VudGl0eSwgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KHtlbnRpdHksIGlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkFERF9VUERBVEV9KTtcbiAgfVxuXG4gIHJlZnJlc2hBbGwoY29sbGVjdGlvbjogQWNOb3RpZmljYXRpb25bXSk6IHZvaWQge1xuICAgIC8vIFRPRE8gbWFrZSBlbnRpdHkgaW50ZXJmYWNlOiBjb2xsZWN0aW9uIG9mIHR5cGUgZW50aXR5IG5vdCBub3RpZmljYXRpb25cbiAgICBvYnNlcnZhYmxlRnJvbShjb2xsZWN0aW9uKS5zdWJzY3JpYmUoKGVudGl0eSkgPT4gdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoZW50aXR5KSk7XG4gIH1cbn1cbiJdfQ==
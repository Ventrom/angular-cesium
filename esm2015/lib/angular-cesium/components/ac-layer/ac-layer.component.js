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
            },] }
];
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
    zIndex: [{ type: Input }],
    debug: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxLQUFLLElBQUksZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsaUJBQWlCO0FBQ2pCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRWxGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUc5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVwRyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxRkFBcUYsQ0FBQztB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WUEyQmhCLGdCQUFnQjtZQWhDaEIsc0JBQXNCO1lBTXRCLGtCQUFrQjtZQUNsQixvQkFBb0I7WUFDcEIscUJBQXFCO1lBS3JCLG9CQUFvQjtZQUpwQixnQkFBZ0I7WUFDaEIsa0JBQWtCO1lBV2xCLGtCQUFrQjtZQUNsQixnQkFBZ0I7WUFDaEIscUJBQXFCO1lBQ3JCLHFCQUFxQjtZQUNyQixzQkFBc0I7WUFDdEIsMkJBQTJCO1lBQzNCLGlCQUFpQjtZQUNqQixzQkFBc0I7WUFidEIsMkJBQTJCO1lBQzNCLDRCQUE0QjtZQUM1Qix5QkFBeUI7WUFDekIsMkJBQTJCO1lBQzNCLDBCQUEwQjtZQUMxQiwwQkFBMEI7WUFTMUIsOEJBQThCO1lBQzlCLDJCQUEyQjtZQUMzQiwrQkFBK0I7WUFFL0IsMkJBQTJCO1lBQzNCLGlCQUFpQjtZQUNqQixpQkFBaUI7OzttQkE2RXZCLEtBQUs7b0JBRUwsS0FBSztzQkFFTCxLQUFLO29CQUVMLEtBQUs7c0JBRUwsS0FBSztxQkFFTCxLQUFLO29CQUVMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tIGFzIG9ic2VydmFibGVGcm9tLCBtZXJnZSBhcyBvYnNlcnZhYmxlTWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IEJpbGxib2FyZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1kcmF3ZXIvYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL21vZGVscy9hY3Rpb24tdHlwZS5lbnVtJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtZHJhd2VyL2xhYmVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtZHJhd2VyL3BvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5ZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9keW5hbWljLXBvbHlsaW5lLWRyYXdlci9keW5hbWljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1jaXJjbGUtZHJhd2VyL3N0YXRpYy1jaXJjbGUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9tb2RlbC1kcmF3ZXIvbW9kZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQm94RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYm94LWRhd2VyL2JveC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb3JyaWRvckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2NvcnJpZG9yLWRhd2VyL2NvcnJpZG9yLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN5bGluZGVyRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3lsaW5kZXItZGF3ZXIvY3lsaW5kZXItZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzb2lkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBvaWQtZHJhd2VyL2VsbGlwc29pZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXZvbHVtZS1kYXdlci9wb2x5bGluZS12b2x1bWUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2FsbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3dhbGwtZGF3ZXIvd2FsbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1wcmltaXRpdmUtZHJhd2VyL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIvcG9pbnQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcblxuLy8gdHNsaW50OmVuYWJsZVxuLyoqXG4gKiAgVGhpcyBpcyBhIGFjLWxheWVyIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYXllciBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICArIGFjRm9yIGB7c3RyaW5nfWAgLSBnZXQgdGhlIHRyYWNrZWQgb2JzZXJ2YWJsZSBhbmQgZW50aXR5TmFtZSAoc2VlIHRoZSBleGFtcGxlKS5cbiAqICArIHNob3cgYHtib29sZWFufWAgLSBzaG93L2hpZGUgbGF5ZXIncyBlbnRpdGllcy5cbiAqICArIGNvbnRleHQgYHthbnl9YCAtIGdldCB0aGUgY29udGV4dCBsYXllciB0aGF0IHdpbGwgdXNlIHRoZSBjb21wb25uZXQgKG1vc3Qgb2YgdGhlIHRpbWUgZXF1YWwgdG8gXCJ0aGlzXCIpLlxuICogICsgb3B0aW9ucyBge0xheWVyT3B0aW9uc31gIC0gc2V0cyB0aGUgbGF5ZXIgb3B0aW9ucyBmb3IgZWFjaCBkcmF3ZXIuXG4gKiAgKyB6SW5kZXggYHtudW1iZXJ9YCAtIGNvbnRyb2xzIHRoZSB6SW5kZXggKG9yZGVyKSBvZiB0aGUgbGF5ZXIsIGxheWVycyB3aXRoIGdyZWF0ZXIgekluZGV4IHdpbGwgYmUgaW4gZnJvbnQgb2YgbGF5ZXJzIHdpdGggbG93ZXIgekluZGV4XG4gKiAgICAoRXhjZXB0aW9uIEZvciBgQmlsbGJvYXJkYCBhbmQgYExhYmVsYCwgc2hvdWxkIHVzZSBgW2V5ZU9mZnNldF1gIHByb3AgaW5zdGVhZCk8L2JyPlxuICogICAgekluZGV4IHdvbid0IHdvcmsgZm9yIHByaXRpbWl0dmUgZGVzY3MgKGxpa2UgYWMtcHJpbWl0aXZlLXBvbHlsaW5lLi4uKVxuICogICsgZGVidWcgYHtib29sZWFufWAgLSBwcmludHMgZXZlcnkgYWNOb3RpZmljYXRpb25cbiAqXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgPGFjLW1hcD5cbiAqICAgIDxhYy1sYXllciBhY0Zvcj1cImxldCB0cmFjayBvZiB0cmFja3MkXCIgW3Nob3ddPVwic2hvd1wiIFtjb250ZXh0XT1cInRoaXNcIiBbb3B0aW9uc109XCJvcHRpb25zXCIgW3pJbmRleF09XCIxXCI+XG4gKiAgICAgIDxhYy1iaWxsYm9hcmQtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICBpbWFnZTogdHJhY2suaW1hZ2UsXG4gKiAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgIHNjYWxlOiB0cmFjay5zY2FsZSxcbiAqICAgICAgICBjb2xvcjogdHJhY2suY29sb3IsXG4gKiAgICAgICAgbmFtZTogdHJhY2submFtZVxuICogICAgICB9XCI+XG4gKiAgICAgIDwvYWMtYmlsbGJvYXJkLWRlc2M+XG4gKiAgICAgICAgPGFjLWxhYmVsLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgICAgICBwaXhlbE9mZnNldCA6IFstMTUsMjBdIHwgcGl4ZWxPZmZzZXQsXG4gKiAgICAgICAgICB0ZXh0OiB0cmFjay5uYW1lLFxuICogICAgICAgICAgZm9udDogJzE1cHggc2Fucy1zZXJpZidcbiAqICAgICAgICB9XCI+XG4gKiAgICAgIDwvYWMtbGFiZWwtZGVzYz5cbiAqICAgIDwvYWMtbGF5ZXI+XG4gKiAgPC9hYy1tYXA+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWxheWVyJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTGF5ZXJTZXJ2aWNlLFxuICAgIENvbXB1dGF0aW9uQ2FjaGUsXG4gICAgQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICBMYWJlbERyYXdlclNlcnZpY2UsXG4gICAgRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIEFyY0RyYXdlclNlcnZpY2UsXG4gICAgUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIE1vZGVsRHJhd2VyU2VydmljZSxcbiAgICBCb3hEcmF3ZXJTZXJ2aWNlLFxuICAgIENvcnJpZG9yRHJhd2VyU2VydmljZSxcbiAgICBDeWxpbmRlckRyYXdlclNlcnZpY2UsXG4gICAgRWxsaXBzb2lkRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UsXG4gICAgV2FsbERyYXdlclNlcnZpY2UsXG4gICAgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIEh0bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIEN6bWxEcmF3ZXJTZXJ2aWNlLFxuXG4gICAgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSxcbiAgICBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBBY0xheWVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuICBASW5wdXQoKVxuICBhY0Zvcjogc3RyaW5nO1xuICBASW5wdXQoKVxuICBjb250ZXh0OiBhbnk7XG4gIEBJbnB1dCgpXG4gIHN0b3JlID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIG9wdGlvbnM6IExheWVyT3B0aW9ucztcbiAgQElucHV0KClcbiAgekluZGV4ID0gMDtcbiAgQElucHV0KClcbiAgZGVidWcgPSBmYWxzZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGFjRm9yUmd4ID0gL15sZXRcXHMrLitcXHMrb2ZcXHMrLiskLztcbiAgcHJpdmF0ZSBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgc3RvcE9ic2VydmFibGUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxBY05vdGlmaWNhdGlvbj47XG4gIHByaXZhdGUgX2RyYXdlckxpc3Q6IE1hcDxzdHJpbmcsIEJhc2ljRHJhd2VyU2VydmljZT47XG4gIHByaXZhdGUgX3VwZGF0ZVN0cmVhbTogU3ViamVjdDxBY05vdGlmaWNhdGlvbj4gPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHJpdmF0ZSBlbnRpdGllc1N0b3JlID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgcHJpdmF0ZSBsYXllckRyYXdlckRhdGFTb3VyY2VzOiBhbnlbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsXG4gICAgICAgICAgICAgIHByaXZhdGUgbWFwTGF5ZXJzU2VydmljZTogTWFwTGF5ZXJzU2VydmljZSxcbiAgICAgICAgICAgICAgYmlsbGJvYXJkRHJhd2VyU2VydmljZTogQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgbGFiZWxEcmF3ZXJTZXJ2aWNlOiBMYWJlbERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHBvbHlnb25EcmF3ZXJTZXJ2aWNlOiBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgYXJjRHJhd2VyU2VydmljZTogQXJjRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9pbnREcmF3ZXJTZXJ2aWNlOiBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIG1vZGVsRHJhd2VyU2VydmljZTogTW9kZWxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBib3hEcmF3ZXJTZXJ2aWNlOiBCb3hEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb3JyaWRvckRyYXdlclNlcnZpY2U6IENvcnJpZG9yRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgY3lsaW5kZXJEcmF3ZXJTZXJ2aWNlOiBDeWxpbmRlckRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGVsbGlwc29pZERyYXdlclNlcmljZTogRWxsaXBzb2lkRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHdhbGxEcmF3ZXJTZXJ2aWNlOiBXYWxsRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcmVjdGFuZ2xlRHJhd2VyU2VydmljZTogUmVjdGFuZ2xlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgZHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGR5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2U6IER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2U6IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZTogU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBzdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZTogU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIGxhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZTogTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgaHRtbERyYXdlclNlcnZpY2U6IEh0bWxEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjem1sRHJhd2VyU2VydmljZTogQ3ptbERyYXdlclNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5fZHJhd2VyTGlzdCA9IG5ldyBNYXAoW1xuICAgICAgWydiaWxsYm9hcmQnLCBiaWxsYm9hcmREcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnbGFiZWwnLCBsYWJlbERyYXdlclNlcnZpY2VdLFxuICAgICAgWydlbGxpcHNlJywgZWxsaXBzZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2x5bGluZScsIHBvbHlsaW5lRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3BvbHlnb24nLCBwb2x5Z29uRHJhd2VyU2VydmljZSBhcyBCYXNpY0RyYXdlclNlcnZpY2VdLFxuICAgICAgWydhcmMnLCBhcmNEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9pbnQnLCBwb2ludERyYXdlclNlcnZpY2VdLFxuICAgICAgWydtb2RlbCcsIG1vZGVsRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2JveCcsIGJveERyYXdlclNlcnZpY2VdLFxuICAgICAgWydjb3JyaWRvcicsIGNvcnJpZG9yRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2N5bGluZGVyJywgY3lsaW5kZXJEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnZWxsaXBzb2lkJywgZWxsaXBzb2lkRHJhd2VyU2VyaWNlXSxcbiAgICAgIFsncG9seWxpbmVWb2x1bWUnLCBwb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydyZWN0YW5nbGUnLCByZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnd2FsbCcsIHdhbGxEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsncG9seWxpbmVQcmltaXRpdmUnLCBwb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydsYWJlbFByaW1pdGl2ZScsIGxhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2JpbGxib2FyZFByaW1pdGl2ZScsIGJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydwb2ludFByaW1pdGl2ZScsIHBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2h0bWwnLCBodG1sRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ2N6bWwnLCBjem1sRHJhd2VyU2VydmljZV0sXG5cbiAgICAgIFsnZHluYW1pY0VsbGlwc2UnLCBkeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2VdLFxuICAgICAgWydkeW5hbWljUG9seWxpbmUnLCBkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnc3RhdGljQ2lyY2xlJywgc3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZV0sXG4gICAgICBbJ3N0YXRpY1BvbHlsaW5lJywgc3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnc3RhdGljUG9seWdvbicsIHN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlXSxcbiAgICAgIFsnc3RhdGljRWxsaXBzZScsIHN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlXSxcbiAgICBdKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0VmFsaWRQYXJhbXMoKTtcblxuICAgIG9ic2VydmFibGVNZXJnZSh0aGlzLl91cGRhdGVTdHJlYW0sIHRoaXMub2JzZXJ2YWJsZSkucGlwZTxBY05vdGlmaWNhdGlvbj4odGFrZVVudGlsKHRoaXMuc3RvcE9ic2VydmFibGUpKS5zdWJzY3JpYmUoKG5vdGlmaWNhdGlvbikgPT4ge1xuICAgICAgdGhpcy5fY29tcHV0YXRpb25DYWNoZS5jbGVhcigpO1xuXG4gICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnQWNMYXllciByZWNlaXZlZCBub3RpZmljYXRpb246Jywgbm90aWZpY2F0aW9uKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGNvbnRleHRFbnRpdHkgPSBub3RpZmljYXRpb24uZW50aXR5O1xuICAgICAgaWYgKHRoaXMuc3RvcmUpIHtcbiAgICAgICAgY29udGV4dEVudGl0eSA9IHRoaXMudXBkYXRlU3RvcmUobm90aWZpY2F0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250ZXh0W3RoaXMuZW50aXR5TmFtZV0gPSBjb250ZXh0RW50aXR5O1xuICAgICAgdGhpcy5sYXllclNlcnZpY2UuZ2V0RGVzY3JpcHRpb25zKCkuZm9yRWFjaCgoZGVzY3JpcHRpb25Db21wb25lbnQpID0+IHtcbiAgICAgICAgc3dpdGNoIChub3RpZmljYXRpb24uYWN0aW9uVHlwZSkge1xuICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS5BRERfVVBEQVRFOlxuICAgICAgICAgICAgZGVzY3JpcHRpb25Db21wb25lbnQuZHJhdyh0aGlzLmNvbnRleHQsIG5vdGlmaWNhdGlvbi5pZCwgY29udGV4dEVudGl0eSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuREVMRVRFOlxuICAgICAgICAgICAgZGVzY3JpcHRpb25Db21wb25lbnQucmVtb3ZlKG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FjLWxheWVyXSB1bmtub3duIEFjTm90aWZpY2F0aW9uLmFjdGlvblR5cGUgZm9yIG5vdGlmaWNhdGlvbjogJyArIG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTdG9yZShub3RpZmljYXRpb246IEFjTm90aWZpY2F0aW9uKTogYW55IHtcbiAgICBpZiAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuREVMRVRFKSB7XG4gICAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKG5vdGlmaWNhdGlvbi5pZCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5lbnRpdGllc1N0b3JlLmhhcyhub3RpZmljYXRpb24uaWQpKSB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNTdG9yZS5nZXQobm90aWZpY2F0aW9uLmlkKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIG5vdGlmaWNhdGlvbi5lbnRpdHkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1N0b3JlLnNldChub3RpZmljYXRpb24uaWQsIG5vdGlmaWNhdGlvbi5lbnRpdHkpO1xuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmVudGl0eTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRWYWxpZFBhcmFtcygpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhYy1sYXllcjogbXVzdCBpbml0aWFsaXplIFtjb250ZXh0XSAnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWNGb3JSZ3gudGVzdCh0aGlzLmFjRm9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBhYy1sYXllcjogSW52YWxpZCBbYWNGb3JdIHN5bnRheC4gRXhwZWN0ZWQ6IFthY0Zvcl09XCJsZXQgaXRlbSBvZiBvYnNlcnZhYmxlXCIgLkluc3RlYWQgcmVjZWl2ZWQ6ICR7dGhpcy5hY0Zvcn1gKTtcbiAgICB9XG4gICAgY29uc3QgYWNGb3JBcnIgPSB0aGlzLmFjRm9yLnNwbGl0KCcgJyk7XG4gICAgdGhpcy5vYnNlcnZhYmxlID0gdGhpcy5jb250ZXh0W2FjRm9yQXJyWzNdXTtcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcbiAgICBpZiAoIXRoaXMuaXNPYnNlcnZhYmxlKHRoaXMub2JzZXJ2YWJsZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWMtbGF5ZXI6IG11c3QgaW5pdGFpbGl6ZSBbYWNGb3JdIHdpdGggcnggb2JzZXJ2YWJsZSwgaW5zdGVhZCByZWNlaXZlZDogJyArIHRoaXMub2JzZXJ2YWJsZSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICB0aGlzLmxheWVyU2VydmljZS5zZXRFbnRpdHlOYW1lKHRoaXMuZW50aXR5TmFtZSk7XG4gIH1cblxuICAvKiogVGVzdCBmb3IgYSByeGpzIE9ic2VydmFibGUgKi9cbiAgcHJpdmF0ZSBpc09ic2VydmFibGUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAvKiBjaGVjayB2aWEgZHVjay10eXBpbmcgcmF0aGVyIHRoYW4gaW5zdGFuY2Ugb2ZcbiAgICAgKiB0byBhbGxvdyBwYXNzaW5nIGJldHdlZW4gd2luZG93IGNvbnRleHRzICovXG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2Uub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB0aGlzLmxheWVyU2VydmljZS5zaG93ID0gdGhpcy5zaG93O1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnpJbmRleCA9IHRoaXMuekluZGV4O1xuICAgIHRoaXMuX2RyYXdlckxpc3QuZm9yRWFjaCgoZHJhd2VyLCBkcmF3ZXJOYW1lKSA9PiB7XG4gICAgICBjb25zdCBpbml0T3B0aW9ucyA9IHRoaXMub3B0aW9ucyA/IHRoaXMub3B0aW9uc1tkcmF3ZXJOYW1lXSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGRyYXdlckRhdGFTb3VyY2VzID0gZHJhd2VyLmluaXQoaW5pdE9wdGlvbnMpO1xuICAgICAgLy8gb25seSBlbnRpdGllcyBkcmF3ZXJzIGNyZWF0ZSBkYXRhIHNvdXJjZXNcbiAgICAgIGlmIChkcmF3ZXJEYXRhU291cmNlcykge1xuICAgICAgICAvLyB0aGlzLm1hcExheWVyc1NlcnZpY2UucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRyYXdlckRhdGFTb3VyY2VzLCB0aGlzLnpJbmRleCk7XG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBmb2xsb3dpbmcgbGluZSBjYXVzZXMgQmFkIFBlcmZvcm1hbmNlXG4gICAgICAgIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcy5wdXNoKC4uLmRyYXdlckRhdGFTb3VyY2VzKTtcbiAgICAgIH1cbiAgICAgIGRyYXdlci5zZXRTaG93KHRoaXMuc2hvdyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuc2hvdyAmJiAhY2hhbmdlcy5zaG93LmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBzaG93VmFsdWUgPSBjaGFuZ2VzWydzaG93J10uY3VycmVudFZhbHVlO1xuICAgICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHNob3dWYWx1ZTtcbiAgICAgIHRoaXMuX2RyYXdlckxpc3QuZm9yRWFjaCgoZHJhd2VyKSA9PiBkcmF3ZXIuc2V0U2hvdyhzaG93VmFsdWUpKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy56SW5kZXggJiYgIWNoYW5nZXMuekluZGV4LmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCB6SW5kZXhWYWx1ZSA9IGNoYW5nZXNbJ3pJbmRleCddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnpJbmRleCA9IHpJbmRleFZhbHVlO1xuICAgICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnVwZGF0ZUFuZFJlZnJlc2godGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLCB6SW5kZXhWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnJlbW92ZURhdGFTb3VyY2VzKHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcyk7XG4gICAgdGhpcy5zdG9wT2JzZXJ2YWJsZS5uZXh0KHRydWUpO1xuICAgIHRoaXMucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBnZXRMYXllclNlcnZpY2UoKTogTGF5ZXJTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5sYXllclNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBEYXRhU291cmNlcyByZWdpc3RlcmVkIGJ5IGEgZHJhd2VyIG9mIHRoaXMgbGF5ZXJcbiAgICogQHJldHVybiBBcnJheSBvZiBDZXNpdW0uRGF0YVNvdXJjZXNcbiAgICovXG4gIGdldExheWVyRHJhd2VyRGF0YVNvdXJjZXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBBcnJheSBvZiBEYXRhU291cmNlcyBvZiB0aGUgZHJhd2VyIHdpdGggdGhlIHByb3ZpZGVkIERhdGFTb3VyY2UubmFtZVxuICAgKiBFeGFtcGxlOiBnZXREYXRhU291cmNlT2ZEcmF3ZXIoJ3BvbHlsaW5lJykgcmV0dXJucyB0aGUgZGF0YVNvdXJjZSBvZiBwb2x5bGluZSBkcmF3ZXJcbiAgICogQHJldHVybiBBcnJheSBvZiBDZXNpdW0uRGF0YVNvdXJjZXNcbiAgICovXG4gIGdldERyYXdlckRhdGFTb3VyY2VzQnlOYW1lKG5hbWU6IHN0cmluZyk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLmZpbHRlcihkID0+IGQubmFtZSA9PT0gbmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RvcmUuXG4gICAqL1xuICBnZXRTdG9yZSgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdGllc1N0b3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIGVudGl0aWVzIGZyb20gdGhlIGxheWVyLlxuICAgKi9cbiAgcmVtb3ZlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uKSA9PiBkZXNjcmlwdGlvbi5yZW1vdmVBbGwoKSk7XG4gICAgdGhpcy5lbnRpdGllc1N0b3JlLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIGVudGl0eSBmcm9tIHRoZSBsYXllclxuICAgKi9cbiAgcmVtb3ZlKGVudGl0eUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dCh7aWQ6IGVudGl0eUlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkRFTEVURX0pO1xuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5kZWxldGUoZW50aXR5SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KG5vdGlmaWNhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogYWRkL3VwZGF0ZSBlbnRpdHkgdG8vZnJvbSB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZShlbnRpdHk6IEFjRW50aXR5LCBpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2VudGl0eSwgaWQsIGFjdGlvblR5cGU6IEFjdGlvblR5cGUuQUREX1VQREFURX0pO1xuICB9XG5cbiAgcmVmcmVzaEFsbChjb2xsZWN0aW9uOiBBY05vdGlmaWNhdGlvbltdKTogdm9pZCB7XG4gICAgLy8gVE9ETyBtYWtlIGVudGl0eSBpbnRlcmZhY2U6IGNvbGxlY3Rpb24gb2YgdHlwZSBlbnRpdHkgbm90IG5vdGlmaWNhdGlvblxuICAgIG9ic2VydmFibGVGcm9tKGNvbGxlY3Rpb24pLnN1YnNjcmliZSgoZW50aXR5KSA9PiB0aGlzLl91cGRhdGVTdHJlYW0ubmV4dChlbnRpdHkpKTtcbiAgfVxufVxuIl19
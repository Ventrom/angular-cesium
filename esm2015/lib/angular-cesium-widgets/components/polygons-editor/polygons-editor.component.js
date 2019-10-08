/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { PolygonsManagerService } from '../../services/entity-editors/polygons-editor/polygons-manager.service';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polygons-editor.service';
export class PolygonsEditorComponent {
    /**
     * @param {?} polygonsEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} polygonsManager
     */
    constructor(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager) {
        this.polygonsEditor = polygonsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.editPolygons$ = new Subject();
        this.appearance = new Cesium.PerInstanceColorAppearance({ flat: true });
        this.attributes = { color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.2, 0.2, 0.5, 0.5)) };
        this.polygonColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);
        this.lineColor = new Cesium.Color(0, 0, 0, 0.6);
        this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polygonsManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.polygonsEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        (update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} polygon
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(polygon, update, labels) {
        update.positions = polygon.getRealPositions();
        update.points = polygon.getRealPoints();
        if (labels) {
            polygon.labels = labels;
            this.editPolygonsLayer.update(polygon, polygon.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polygon.labels = this.editLabelsRenderFn(update, polygon.labels);
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    /**
     * @param {?} polygon
     * @return {?}
     */
    removeEditLabels(polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                polygon.dispose();
                this.removeEditLabels(polygon);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = true;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.polygonsManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolygonsEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'polygons-editor',
                template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-primitive-desc
        props="{
        positions: polyline.getPositions(),
        width: polyline.props.width,
        material: polyline.props.material()
    }"
      >
      </ac-polyline-primitive-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
        hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
        material: polygon.polygonProps.material
    }"
      >
      </ac-polygon-desc>
      <!-- <ac-static-polygon-desc -->
      <!-- geometryProps="{ -->
      <!-- polygonHierarchy: polygon.getHierarchy(), -->
      <!-- height: 1 -->
      <!-- }" -->
      <!-- instanceProps="{ -->
      <!-- attributes: attributes -->
      <!-- }" -->
      <!-- primitiveProps="{ -->
      <!-- appearance: appearance -->
      <!-- }"> -->
      <!-- </ac-static-polygon-desc -->
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, PolygonsManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PolygonsEditorComponent.ctorParameters = () => [
    { type: PolygonsEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: PolygonsManagerService }
];
PolygonsEditorComponent.propDecorators = {
    editPolygonsLayer: [{ type: ViewChild, args: ['editPolygonsLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
    editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.editLabelsRenderFn;
    /** @type {?} */
    PolygonsEditorComponent.prototype.Cesium;
    /** @type {?} */
    PolygonsEditorComponent.prototype.editPoints$;
    /** @type {?} */
    PolygonsEditorComponent.prototype.editPolylines$;
    /** @type {?} */
    PolygonsEditorComponent.prototype.editPolygons$;
    /** @type {?} */
    PolygonsEditorComponent.prototype.appearance;
    /** @type {?} */
    PolygonsEditorComponent.prototype.attributes;
    /** @type {?} */
    PolygonsEditorComponent.prototype.polygonColor;
    /** @type {?} */
    PolygonsEditorComponent.prototype.lineColor;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.editPolygonsLayer;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.editPointsLayer;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.editPolylinesLayer;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.polygonsEditor;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorComponent.prototype.polygonsManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBR3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUN6SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQztBQUNoSCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1RUFBdUUsQ0FBQztBQXFGOUcsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7Ozs7SUFnQmxDLFlBQ1UsY0FBcUMsRUFDckMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixlQUF1QztRQUp2QyxtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLG9CQUFlLEdB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Qzs7Ozs7SUFFRCxZQUFZLENBQUMsS0FBZ0I7UUFDM0IsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7OztZQTFTRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkVsQjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQztnQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7Ozs7WUFwRlEscUJBQXFCO1lBTnJCLG1CQUFtQjtZQUNuQix1QkFBdUI7WUFFdkIsYUFBYTtZQUViLHNCQUFzQjs7O2dDQWtHNUIsU0FBUyxTQUFDLG1CQUFtQjs4QkFDN0IsU0FBUyxTQUFDLGlCQUFpQjtpQ0FDM0IsU0FBUyxTQUFDLG9CQUFvQjs7Ozs7OztJQWIvQixxREFBOEY7O0lBQzlGLHlDQUF1Qjs7SUFDdkIsOENBQW1EOztJQUNuRCxpREFBc0Q7O0lBQ3RELGdEQUFxRDs7SUFFckQsNkNBQXdFOztJQUN4RSw2Q0FBbUg7O0lBQ25ILCtDQUEyRDs7SUFDM0QsNENBQWtEOzs7OztJQUVsRCxvREFBNEU7Ozs7O0lBQzVFLGtEQUF3RTs7Ozs7SUFDeEUscURBQThFOzs7OztJQUc1RSxpREFBNkM7Ozs7O0lBQzdDLHNEQUFnRDs7Ozs7SUFDaEQsbURBQWlEOzs7OztJQUNqRCxnREFBb0M7Ozs7O0lBQ3BDLGtEQUErQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBQb2x5Z29uc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWdvbnMtZWRpdG9yL3BvbHlnb25zLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZVBvbHlnb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9seWdvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BvbHlnb25zLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgPGFjLWxheWVyICNlZGl0UG9seWxpbmVzTGF5ZXIgYWNGb3I9XCJsZXQgcG9seWxpbmUgb2YgZWRpdFBvbHlsaW5lcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uczogcG9seWxpbmUuZ2V0UG9zaXRpb25zKCksXG4gICAgICAgIHdpZHRoOiBwb2x5bGluZS5wcm9wcy53aWR0aCxcbiAgICAgICAgbWF0ZXJpYWw6IHBvbHlsaW5lLnByb3BzLm1hdGVyaWFsKClcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2M+XG4gICAgPC9hYy1sYXllcj5cblxuICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLXBvaW50LWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbigpLFxuICAgICAgICBwaXhlbFNpemU6IGdldFBvaW50U2l6ZShwb2ludCksXG4gICAgICAgIGNvbG9yOiBwb2ludC5wcm9wcy5jb2xvcixcbiAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgIG91dGxpbmVXaWR0aDogcG9pbnQucHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICBzaG93OiBnZXRQb2ludFNob3cocG9pbnQpXG4gICAgfVwiXG4gICAgICA+XG4gICAgICA8L2FjLXBvaW50LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cblxuICAgIDxhYy1sYXllciAjZWRpdFBvbHlnb25zTGF5ZXIgYWNGb3I9XCJsZXQgcG9seWdvbiBvZiBlZGl0UG9seWdvbnMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLXBvbHlnb24tZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgaGllcmFyY2h5OiBwb2x5Z29uLmdldFBvc2l0aW9uc0hpZXJhcmNoeUNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgbWF0ZXJpYWw6IHBvbHlnb24ucG9seWdvblByb3BzLm1hdGVyaWFsXG4gICAgfVwiXG4gICAgICA+XG4gICAgICA8L2FjLXBvbHlnb24tZGVzYz5cbiAgICAgIDwhLS0gPGFjLXN0YXRpYy1wb2x5Z29uLWRlc2MgLS0+XG4gICAgICA8IS0tIGdlb21ldHJ5UHJvcHM9XCJ7IC0tPlxuICAgICAgPCEtLSBwb2x5Z29uSGllcmFyY2h5OiBwb2x5Z29uLmdldEhpZXJhcmNoeSgpLCAtLT5cbiAgICAgIDwhLS0gaGVpZ2h0OiAxIC0tPlxuICAgICAgPCEtLSB9XCIgLS0+XG4gICAgICA8IS0tIGluc3RhbmNlUHJvcHM9XCJ7IC0tPlxuICAgICAgPCEtLSBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzIC0tPlxuICAgICAgPCEtLSB9XCIgLS0+XG4gICAgICA8IS0tIHByaW1pdGl2ZVByb3BzPVwieyAtLT5cbiAgICAgIDwhLS0gYXBwZWFyYW5jZTogYXBwZWFyYW5jZSAtLT5cbiAgICAgIDwhLS0gfVwiPiAtLT5cbiAgICAgIDwhLS0gPC9hYy1zdGF0aWMtcG9seWdvbi1kZXNjIC0tPlxuICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgcG9seWdvbi5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpblxuICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIFBvbHlnb25zTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUG9seWdvbnNFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogUG9seWdvbkVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdFBvbHlsaW5lcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIGVkaXRQb2x5Z29ucyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBwdWJsaWMgYXBwZWFyYW5jZSA9IG5ldyBDZXNpdW0uUGVySW5zdGFuY2VDb2xvckFwcGVhcmFuY2Uoe2ZsYXQ6IHRydWV9KTtcbiAgcHVibGljIGF0dHJpYnV0ZXMgPSB7Y29sb3I6IENlc2l1bS5Db2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUuZnJvbUNvbG9yKG5ldyBDZXNpdW0uQ29sb3IoMC4yLCAwLjIsIDAuNSwgMC41KSl9O1xuICBwdWJsaWMgcG9seWdvbkNvbG9yID0gbmV3IENlc2l1bS5Db2xvcigwLjEsIDAuNSwgMC4yLCAwLjQpO1xuICBwdWJsaWMgbGluZUNvbG9yID0gbmV3IENlc2l1bS5Db2xvcigwLCAwLCAwLCAwLjYpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2x5Z29uc0xheWVyJykgcHJpdmF0ZSBlZGl0UG9seWdvbnNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2x5bGluZXNMYXllcicpIHByaXZhdGUgZWRpdFBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcG9seWdvbnNFZGl0b3I6IFBvbHlnb25zRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5Z29uc01hbmFnZXI6IFBvbHlnb25zTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMucG9seWdvbnNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCBwb2x5Z29uc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5wb2x5Z29uc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBQb2x5Z29uRWRpdFVwZGF0ZSkgPT4ge1xuICAgICAgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURSB8fCB1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYWJlbElkKGVsZW1lbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKCk7XG4gIH1cblxuICByZW5kZXJFZGl0TGFiZWxzKHBvbHlnb246IEVkaXRhYmxlUG9seWdvbiwgdXBkYXRlOiBQb2x5Z29uRWRpdFVwZGF0ZSwgbGFiZWxzPzogTGFiZWxQcm9wc1tdKSB7XG4gICAgdXBkYXRlLnBvc2l0aW9ucyA9IHBvbHlnb24uZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHVwZGF0ZS5wb2ludHMgPSBwb2x5Z29uLmdldFJlYWxQb2ludHMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIHBvbHlnb24ubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0UG9seWdvbnNMYXllci51cGRhdGUocG9seWdvbiwgcG9seWdvbi5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9seWdvbi5sYWJlbHMgPSB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbih1cGRhdGUsIHBvbHlnb24ubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRQb2x5Z29uc0xheWVyLnVwZGF0ZShwb2x5Z29uLCBwb2x5Z29uLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhwb2x5Z29uOiBFZGl0YWJsZVBvbHlnb24pIHtcbiAgICBwb2x5Z29uLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdFBvbHlnb25zTGF5ZXIudXBkYXRlKHBvbHlnb24sIHBvbHlnb24uZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogUG9seWdvbkVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5wb2x5Z29uc01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2x5Z29uKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2x5Z29uc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvbHlsaW5lc0xheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUucG9seWdvbk9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBwb2x5Z29uLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9seWdvbi5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvbHlnb24uYWRkTGFzdFBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgcG9seWdvbi5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRWRpdExhYmVscyhwb2x5Z29uKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IFBvbHlnb25FZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucG9seWdvbnNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUG9seWdvbihcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWdvbnNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2x5bGluZXNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnBvbHlnb25PcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlnb24gJiYgcG9seWdvbi5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWdvbi5tb3ZlUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlnb24gJiYgcG9seWdvbi5lbmFibGVFZGl0ICYmIHVwZGF0ZS51cGRhdGVkUG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgICBwb2x5Z29uLmNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5SRU1PVkVfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWdvbiAmJiBwb2x5Z29uLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBwb2x5Z29uLnJlbW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNBQkxFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlnb24pIHtcbiAgICAgICAgICBwb2x5Z29uLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uICYmIHBvbHlnb24uZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlnb24ubW92ZVBvbHlnb24odXBkYXRlLmRyYWdnZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWdvbiAmJiBwb2x5Z29uLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBwb2x5Z29uLmVuZE1vdmVQb2x5Z29uKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkVOQUJMRToge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uKSB7XG4gICAgICAgICAgcG9seWdvbi5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucG9seWdvbnNNYW5hZ2VyLmNsZWFyKCk7XG4gIH1cblxuICBnZXRQb2ludFNpemUocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcbiAgfVxuXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LnNob3cgJiYgKHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMuc2hvd1ZpcnR1YWwgOiBwb2ludC5wcm9wcy5zaG93KTtcbiAgfVxufVxuIl19
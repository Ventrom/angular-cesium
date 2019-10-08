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
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';
import { PolylinesManagerService } from '../../services/entity-editors/polyline-editor/polylines-manager.service';
var PolylinesEditorComponent = /** @class */ (function () {
    function PolylinesEditorComponent(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager) {
        this.polylinesEditor = polylinesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.polylineLabels$ = new Subject();
        this.polylinesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polylinesManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    PolylinesEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polylinesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} polyline
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    PolylinesEditorComponent.prototype.renderEditLabels = /**
     * @param {?} polyline
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (polyline, update, labels) {
        update.positions = polyline.getRealPositions();
        update.points = polyline.getRealPoints();
        if (labels) {
            polyline.labels = labels;
            this.polylineLabelsLayer.update(polyline, polyline.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polyline.labels = this.editLabelsRenderFn(update, polyline.labels);
        this.polylineLabelsLayer.update(polyline, polyline.getId());
    };
    /**
     * @param {?} polyline
     * @return {?}
     */
    PolylinesEditorComponent.prototype.removeEditLabels = /**
     * @param {?} polyline
     * @return {?}
     */
    function (polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolylinesEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                polyline.dispose();
                this.removeEditLabels(polyline);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolylinesEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.endMoveShape();
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @return {?}
     */
    PolylinesEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.polylinesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PolylinesEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'polylines-editor',
                    template: /*html*/ "\n    <ac-layer #editPolylinesLayer acFor=\"let polyline of editPolylines$\" [context]=\"this\">\n      <ac-polyline-primitive-desc\n        props=\"{\n        positions: polyline.getPositions(),\n        width: polyline.props.width,\n        material: polyline.props.material()\n    }\"\n      >\n      </ac-polyline-primitive-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #polylineLabelsLayer acFor=\"let polylineLabels of polylineLabels$\" [context]=\"this\">\n      <ac-array-desc acFor=\"let label of polylineLabels.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, PolylinesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PolylinesEditorComponent.ctorParameters = function () { return [
        { type: PolylinesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PolylinesManagerService }
    ]; };
    PolylinesEditorComponent.propDecorators = {
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
        editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }],
        polylineLabelsLayer: [{ type: ViewChild, args: ['polylineLabelsLayer',] }]
    };
    return PolylinesEditorComponent;
}());
export { PolylinesEditorComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.editLabelsRenderFn;
    /** @type {?} */
    PolylinesEditorComponent.prototype.Cesium;
    /** @type {?} */
    PolylinesEditorComponent.prototype.editPoints$;
    /** @type {?} */
    PolylinesEditorComponent.prototype.editPolylines$;
    /** @type {?} */
    PolylinesEditorComponent.prototype.polylineLabels$;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.editPointsLayer;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.editPolylinesLayer;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.polylineLabelsLayer;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.polylinesEditor;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorComponent.prototype.polylinesManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvcG9seWxpbmVzLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXhELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUN6SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQztBQUNoSCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUtsSDtJQXlFRSxrQ0FDVSxlQUF1QyxFQUN2QyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGdCQUF5QztRQUp6QyxvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFk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Q2hEOzs7O2dCQW5FUSxzQkFBc0I7Z0JBTHRCLG1CQUFtQjtnQkFDbkIsdUJBQXVCO2dCQUV2QixhQUFhO2dCQUdiLHVCQUF1Qjs7O2tDQTBFN0IsU0FBUyxTQUFDLGlCQUFpQjtxQ0FDM0IsU0FBUyxTQUFDLG9CQUFvQjtzQ0FDOUIsU0FBUyxTQUFDLHFCQUFxQjs7SUEwTWxDLCtCQUFDO0NBQUEsQUFqUkQsSUFpUkM7U0FuTlksd0JBQXdCOzs7Ozs7SUFDbkMsc0RBQStGOztJQUMvRiwwQ0FBdUI7O0lBQ3ZCLCtDQUFtRDs7SUFDbkQsa0RBQXNEOztJQUN0RCxtREFBdUQ7Ozs7O0lBRXZELG1EQUF3RTs7Ozs7SUFDeEUsc0RBQThFOzs7OztJQUM5RSx1REFBZ0Y7Ozs7O0lBRzlFLG1EQUErQzs7Ozs7SUFDL0MsdURBQWdEOzs7OztJQUNoRCxvREFBaUQ7Ozs7O0lBQ2pELGlEQUFvQzs7Ozs7SUFDcEMsb0RBQWlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWxpbmUtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFZGl0YWJsZVBvbHlsaW5lIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXBvbHlsaW5lJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwb2x5bGluZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2x5bGluZXNMYXllciBhY0Zvcj1cImxldCBwb2x5bGluZSBvZiBlZGl0UG9seWxpbmVzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgcG9zaXRpb25zOiBwb2x5bGluZS5nZXRQb3NpdGlvbnMoKSxcbiAgICAgICAgd2lkdGg6IHBvbHlsaW5lLnByb3BzLndpZHRoLFxuICAgICAgICBtYXRlcmlhbDogcG9seWxpbmUucHJvcHMubWF0ZXJpYWwoKVxuICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0UG9pbnRzTGF5ZXIgYWNGb3I9XCJsZXQgcG9pbnQgb2YgZWRpdFBvaW50cyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9pbnQtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uKCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludClcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNwb2x5bGluZUxhYmVsc0xheWVyIGFjRm9yPVwibGV0IHBvbHlsaW5lTGFiZWxzIG9mIHBvbHlsaW5lTGFiZWxzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIHBvbHlsaW5lTGFiZWxzLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luXG4gICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgUG9seWxpbmVzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHVibGljIENlc2l1bSA9IENlc2l1bTtcbiAgcHVibGljIGVkaXRQb2ludHMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0UG9seWxpbmVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgcG9seWxpbmVMYWJlbHMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2x5bGluZXNMYXllcicpIHByaXZhdGUgZWRpdFBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdwb2x5bGluZUxhYmVsc0xheWVyJykgcHJpdmF0ZSBwb2x5bGluZUxhYmVsc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcG9seWxpbmVzRWRpdG9yOiBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIHBvbHlsaW5lc01hbmFnZXI6IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLnBvbHlsaW5lc0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHBvbHlsaW5lc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5wb2x5bGluZXNFZGl0b3Iub25VcGRhdGUoKS5zdWJzY3JpYmUoKHVwZGF0ZTogUG9seWxpbmVFZGl0VXBkYXRlKSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMocG9seWxpbmU6IEVkaXRhYmxlUG9seWxpbmUsIHVwZGF0ZTogUG9seWxpbmVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUucG9zaXRpb25zID0gcG9seWxpbmUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHVwZGF0ZS5wb2ludHMgPSBwb2x5bGluZS5nZXRSZWFsUG9pbnRzKCk7XG5cbiAgICBpZiAobGFiZWxzKSB7XG4gICAgICBwb2x5bGluZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLnBvbHlsaW5lTGFiZWxzTGF5ZXIudXBkYXRlKHBvbHlsaW5lLCBwb2x5bGluZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9seWxpbmUubGFiZWxzID0gdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4odXBkYXRlLCBwb2x5bGluZS5sYWJlbHMpO1xuICAgIHRoaXMucG9seWxpbmVMYWJlbHNMYXllci51cGRhdGUocG9seWxpbmUsIHBvbHlsaW5lLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhwb2x5bGluZTogRWRpdGFibGVQb2x5bGluZSkge1xuICAgIHBvbHlsaW5lLmxhYmVscyA9IFtdO1xuICAgIHRoaXMucG9seWxpbmVMYWJlbHNMYXllci5yZW1vdmUocG9seWxpbmUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogUG9seWxpbmVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucG9seWxpbmVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZVBvbHlsaW5lKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2x5bGluZXNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnBvbHlsaW5lT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVRlbXBNb3ZpbmdQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBwb2x5bGluZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvbHlsaW5lLmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU1BPU0U6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHBvbHlsaW5lLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKHBvbHlsaW5lKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1bmRlZmluZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvbHlsaW5lc01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2x5bGluZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5wb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICAgdXBkYXRlLnBvc2l0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0ICYmIHVwZGF0ZS51cGRhdGVkUG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgICBwb2x5bGluZS5jaGFuZ2VWaXJ0dWFsUG9pbnRUb1JlYWxQb2ludCh1cGRhdGUudXBkYXRlZFBvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlJFTU9WRV9QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlsaW5lICYmIHBvbHlsaW5lLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBwb2x5bGluZS5yZW1vdmVQb2ludCh1cGRhdGUudXBkYXRlZFBvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSkge1xuICAgICAgICAgIHBvbHlsaW5lLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkVOQUJMRToge1xuICAgICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlsaW5lKSB7XG4gICAgICAgICAgcG9seWxpbmUuZW5hYmxlRWRpdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWxpbmUgJiYgcG9seWxpbmUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlsaW5lLm1vdmVTaGFwZSh1cGRhdGUuZHJhZ2dlZFBvc2l0aW9uLCB1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWxpbmUuZW5kTW92ZVNoYXBlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmNsZWFyKCk7XG4gIH1cblxuICBnZXRQb2ludFNpemUocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcbiAgfVxuXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LnNob3cgJiYgKHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMuc2hvd1ZpcnR1YWwgOiBwb2ludC5wcm9wcy5zaG93KTtcbiAgfVxufVxuIl19
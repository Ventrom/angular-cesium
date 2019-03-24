/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { CirclesManagerService } from '../../services/entity-editors/circles-editor/circles-manager.service';
import { CirclesEditorService } from '../../services/entity-editors/circles-editor/circles-editor.service';
var CirclesEditorComponent = /** @class */ (function () {
    function CirclesEditorComponent(circlesEditor, coordinateConverter, mapEventsManager, cameraService, circlesManager) {
        this.circlesEditor = circlesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editCircles$ = new Subject();
        this.editArcs$ = new Subject();
        this.circlesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.circlesManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    CirclesEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.circlesEditor.onUpdate().subscribe((/**
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
    CirclesEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    CirclesEditorComponent.prototype.renderEditLabels = /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (circle, update, labels) {
        update.center = circle.getCenter();
        update.radiusPoint = circle.getRadiusPoint();
        update.radius = circle.getRadius();
        if (labels) {
            circle.labels = labels;
            this.editCirclesLayer.update(circle, circle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        circle.labels = this.editLabelsRenderFn(update, circle.labels);
        this.editCirclesLayer.update(circle, circle.getId());
    };
    /**
     * @param {?} circle
     * @return {?}
     */
    CirclesEditorComponent.prototype.removeEditLabels = /**
     * @param {?} circle
     * @return {?}
     */
    function (circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    CirclesEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.removeEditLabels(circle);
                this.circlesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
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
    CirclesEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                var circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = true;
                    this.renderEditLabels(circle, update);
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
    CirclesEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.circlesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    CirclesEditorComponent.prototype.getPointSize = /**
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
    CirclesEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    CirclesEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'circles-editor',
                    template: /*html*/ "\n    <ac-layer #editArcsLayer acFor=\"let arc of editArcs$\" [context]=\"this\">\n      <ac-arc-desc\n        props=\"{\n        angle: arc.angle,\n        delta: arc.delta,\n        center: arc.center,\n        radius: arc.radius,\n        quality: 30,\n        color: arc.props.material()\n    }\"\n      >\n      </ac-arc-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editCirclesLayer acFor=\"let circle of editCircles$\" [context]=\"this\" [zIndex]=\"0\">\n      <ac-ellipse-desc\n        props=\"{\n        position: circle.getCenterCallbackProperty(),\n        semiMajorAxis: circle.getRadiusCallbackProperty(),\n        semiMinorAxis: circle.getRadiusCallbackProperty(),\n        material: circle.circleProps.material,\n        outline: circle.circleProps.outline,\n        height: 0\n    }\"\n      >\n      </ac-ellipse-desc>\n\n      <ac-array-desc acFor=\"let label of circle.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, CirclesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    CirclesEditorComponent.ctorParameters = function () { return [
        { type: CirclesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: CirclesManagerService }
    ]; };
    CirclesEditorComponent.propDecorators = {
        editCirclesLayer: [{ type: ViewChild, args: ['editCirclesLayer',] }],
        editArcsLayer: [{ type: ViewChild, args: ['editArcsLayer',] }],
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
    };
    return CirclesEditorComponent;
}());
export { CirclesEditorComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editLabelsRenderFn;
    /** @type {?} */
    CirclesEditorComponent.prototype.Cesium;
    /** @type {?} */
    CirclesEditorComponent.prototype.editPoints$;
    /** @type {?} */
    CirclesEditorComponent.prototype.editCircles$;
    /** @type {?} */
    CirclesEditorComponent.prototype.editArcs$;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editCirclesLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editArcsLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editPointsLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.circlesEditor;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.circlesManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXhELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUN6SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzRUFBc0UsQ0FBQztBQUM3RyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxRUFBcUUsQ0FBQztBQUszRztJQXdGRSxnQ0FDVSxhQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGNBQXFDO1FBSnJDLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBZHhDLFdBQU0sR0FB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QUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDaEcsQ0FBQzs7Ozs7SUFFRCw2Q0FBWTs7OztJQUFaLFVBQWEsS0FBZ0I7UUFDM0IsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7O2dCQS9RRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLFFBQVEsQ0FBQywwOUVBdUVsQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQztvQkFDdkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEOzs7O2dCQWpGUSxvQkFBb0I7Z0JBTnBCLG1CQUFtQjtnQkFDbkIsdUJBQXVCO2dCQUV2QixhQUFhO2dCQUViLHFCQUFxQjs7O21DQTBGM0IsU0FBUyxTQUFDLGtCQUFrQjtnQ0FDNUIsU0FBUyxTQUFDLGVBQWU7a0NBQ3pCLFNBQVMsU0FBQyxpQkFBaUI7O0lBMEw5Qiw2QkFBQztDQUFBLEFBaFJELElBZ1JDO1NBbk1ZLHNCQUFzQjs7Ozs7O0lBQ2pDLG9EQUE2Rjs7SUFDN0Ysd0NBQXVCOztJQUN2Qiw2Q0FBbUQ7O0lBQ25ELDhDQUFvRDs7SUFDcEQsMkNBQWlEOzs7OztJQUVqRCxrREFBMEU7Ozs7O0lBQzFFLCtDQUFvRTs7Ozs7SUFDcEUsaURBQXdFOzs7OztJQUd0RSwrQ0FBMkM7Ozs7O0lBQzNDLHFEQUFnRDs7Ozs7SUFDaEQsa0RBQWlEOzs7OztJQUNqRCwrQ0FBb0M7Ozs7O0lBQ3BDLGdEQUE2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2lyY2xlc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLWVkaXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENpcmNsZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgRWRpdGFibGVDaXJjbGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtY2lyY2xlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2lyY2xlcy1lZGl0b3InLFxuICB0ZW1wbGF0ZTogLypodG1sKi8gYFxuICAgIDxhYy1sYXllciAjZWRpdEFyY3NMYXllciBhY0Zvcj1cImxldCBhcmMgb2YgZWRpdEFyY3MkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLWFyYy1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICAgICAgICBkZWx0YTogYXJjLmRlbHRhLFxuICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gICAgICAgIHJhZGl1czogYXJjLnJhZGl1cyxcbiAgICAgICAgcXVhbGl0eTogMzAsXG4gICAgICAgIGNvbG9yOiBhcmMucHJvcHMubWF0ZXJpYWwoKVxuICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1hcmMtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0UG9pbnRzTGF5ZXIgYWNGb3I9XCJsZXQgcG9pbnQgb2YgZWRpdFBvaW50cyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9pbnQtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uKCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludClcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0Q2lyY2xlc0xheWVyIGFjRm9yPVwibGV0IGNpcmNsZSBvZiBlZGl0Q2lyY2xlcyRcIiBbY29udGV4dF09XCJ0aGlzXCIgW3pJbmRleF09XCIwXCI+XG4gICAgICA8YWMtZWxsaXBzZS1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogY2lyY2xlLmdldENlbnRlckNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgc2VtaU1ham9yQXhpczogY2lyY2xlLmdldFJhZGl1c0NhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgc2VtaU1pbm9yQXhpczogY2lyY2xlLmdldFJhZGl1c0NhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgbWF0ZXJpYWw6IGNpcmNsZS5jaXJjbGVQcm9wcy5tYXRlcmlhbCxcbiAgICAgICAgb3V0bGluZTogY2lyY2xlLmNpcmNsZVByb3BzLm91dGxpbmUsXG4gICAgICAgIGhlaWdodDogMFxuICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1lbGxpcHNlLWRlc2M+XG5cbiAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIGNpcmNsZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpblxuICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIENpcmNsZXNNYW5hZ2VyU2VydmljZV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDaXJjbGVzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdENpcmNsZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0QXJjcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0Q2lyY2xlc0xheWVyJykgcHJpdmF0ZSBlZGl0Q2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0QXJjc0xheWVyJykgcHJpdmF0ZSBlZGl0QXJjc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRzTGF5ZXInKSBwcml2YXRlIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNpcmNsZXNFZGl0b3I6IENpcmNsZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuY2lyY2xlc0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHRoaXMuY2lyY2xlc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5jaXJjbGVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKHVwZGF0ZSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSwgdXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUuY2VudGVyID0gY2lyY2xlLmdldENlbnRlcigpO1xuICAgIHVwZGF0ZS5yYWRpdXNQb2ludCA9IGNpcmNsZS5nZXRSYWRpdXNQb2ludCgpO1xuICAgIHVwZGF0ZS5yYWRpdXMgPSBjaXJjbGUuZ2V0UmFkaXVzKCk7XG5cbiAgICBpZiAobGFiZWxzKSB7XG4gICAgICBjaXJjbGUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2lyY2xlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgY2lyY2xlLmxhYmVscyk7XG4gICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSkge1xuICAgIGNpcmNsZS5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIudXBkYXRlKGNpcmNsZSwgY2lyY2xlLmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUNpcmNsZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdEFyY3NMYXllcixcbiAgICAgICAgICB1cGRhdGUuY2lyY2xlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5jZW50ZXIpIHtcbiAgICAgICAgICBjaXJjbGUuYWRkUG9pbnQodXBkYXRlLmNlbnRlcik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5hZGRMYXN0UG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRWRpdExhYmVscyhjaXJjbGUpO1xuICAgICAgICB0aGlzLmNpcmNsZXNNYW5hZ2VyLmRpc3Bvc2UodXBkYXRlLmlkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0s6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFM6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZTogQ2lyY2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlQ2lyY2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0QXJjc0xheWVyLFxuICAgICAgICAgIHVwZGF0ZS5jaXJjbGVPcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBjaXJjbGUuc2V0TWFudWFsbHkodXBkYXRlLmNlbnRlciwgdXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOlxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChjaXJjbGUgJiYgY2lyY2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBjaXJjbGUubW92ZVBvaW50KHVwZGF0ZS5lbmREcmFnUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSAmJiBjaXJjbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlQ2lyY2xlKHVwZGF0ZS5zdGFydERyYWdQb3NpdGlvbiwgdXBkYXRlLmVuZERyYWdQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSAmJiBjaXJjbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGNpcmNsZS5lbmRNb3ZlUG9seWdvbigpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSkge1xuICAgICAgICAgIGNpcmNsZS5lbmFibGVFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChjaXJjbGUpIHtcbiAgICAgICAgICBjaXJjbGUuZW5hYmxlRWRpdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2lyY2xlc01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
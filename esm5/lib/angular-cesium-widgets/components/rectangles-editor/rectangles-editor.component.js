import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CesiumService } from '../../../angular-cesium/services/cesium/cesium.service';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { RectanglesManagerService } from '../../services/entity-editors/rectangles-editor/rectangles-manager.service';
import { RectanglesEditorService } from '../../services/entity-editors/rectangles-editor/rectangles-editor.service';
var RectanglesEditorComponent = /** @class */ (function () {
    function RectanglesEditorComponent(rectanglesEditor, coordinateConverter, mapEventsManager, cameraService, rectanglesManager, cesiumService) {
        this.rectanglesEditor = rectanglesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editRectangles$ = new Subject();
        this.rectanglesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.rectanglesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    RectanglesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.rectanglesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    RectanglesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    RectanglesEditorComponent.prototype.renderEditLabels = function (rectangle, update, labels) {
        update.positions = rectangle.getRealPositions();
        update.points = rectangle.getRealPoints();
        if (labels) {
            rectangle.labels = labels;
            this.editRectanglesLayer.update(rectangle, rectangle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        rectangle.labels = this.editLabelsRenderFn(update, rectangle.labels);
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    };
    RectanglesEditorComponent.prototype.removeEditLabels = function (rectangle) {
        rectangle.labels = [];
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    };
    RectanglesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.dispose();
                    this.removeEditLabels(rectangle);
                }
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(rectangle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    RectanglesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMovePoint();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = false;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = true;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMoveShape();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    RectanglesEditorComponent.prototype.ngOnDestroy = function () {
        this.rectanglesManager.clear();
    };
    RectanglesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    RectanglesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    RectanglesEditorComponent.ctorParameters = function () { return [
        { type: RectanglesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: RectanglesManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editRectanglesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], RectanglesEditorComponent.prototype, "editRectanglesLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], RectanglesEditorComponent.prototype, "editPointsLayer", void 0);
    RectanglesEditorComponent = __decorate([
        Component({
            selector: 'rectangles-editor',
            template: /*html*/ "\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPositionCallbackProperty(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point),\n        disableDepthTestDistance: point.props.disableDepthTestDistance,\n        heightReference: point.props.heightReference,\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editRectanglesLayer acFor=\"let rectangle of editRectangles$\" [context]=\"this\">\n      <ac-rectangle-desc\n        props=\"{\n          coordinates: rectangle.getRectangleCallbackProperty(),\n          material: rectangle.rectangleProps.material,\n          fill: rectangle.rectangleProps.fill,\n          classificationType: rectangle.rectangleProps.classificationType,\n          zIndex: rectangle.rectangleProps.zIndex,\n          outline: rectangle.rectangleProps.outline,\n          outlineColor: rectangle.rectangleProps.outlineColor,\n          height: rectangle.rectangleProps.height,\n          extrudedHeight: rectangle.rectangleProps.extrudedHeight\n        }\"\n      >\n      </ac-rectangle-desc>\n      <ac-array-desc acFor=\"let label of rectangle.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
            providers: [CoordinateConverter, RectanglesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [RectanglesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            RectanglesManagerService,
            CesiumService])
    ], RectanglesEditorComponent);
    return RectanglesEditorComponent;
}());
export { RectanglesEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDbEcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDbEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFDdEgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUF3RXBIO0lBU0UsbUNBQ1UsZ0JBQXlDLEVBQ3pDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsaUJBQTJDLEVBQzNDLGFBQTRCO1FBTDVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FB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QztZQUMxRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtTQUNoRCxDQUFDO3lDQVc0Qix1QkFBdUI7WUFDcEIsbUJBQW1CO1lBQ3RCLHVCQUF1QjtZQUMxQixhQUFhO1lBQ1Qsd0JBQXdCO1lBQzVCLGFBQWE7T0FmM0IseUJBQXlCLENBa05yQztJQUFELGdDQUFDO0NBQUEsQUFsTkQsSUFrTkM7U0FsTlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcmVjdGFuZ2xlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3RhbmdsZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1lZGl0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlUmVjdGFuZ2xlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXJlY3RhbmdsZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3JlY3RhbmdsZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0UmVjdGFuZ2xlc0xheWVyIGFjRm9yPVwibGV0IHJlY3RhbmdsZSBvZiBlZGl0UmVjdGFuZ2xlcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcmVjdGFuZ2xlLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlY3RhbmdsZS5nZXRSZWN0YW5nbGVDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgbWF0ZXJpYWw6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5tYXRlcmlhbCxcbiAgICAgICAgICBmaWxsOiByZWN0YW5nbGUucmVjdGFuZ2xlUHJvcHMuZmlsbCxcbiAgICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXG4gICAgICAgICAgekluZGV4OiByZWN0YW5nbGUucmVjdGFuZ2xlUHJvcHMuekluZGV4LFxuICAgICAgICAgIG91dGxpbmU6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5vdXRsaW5lLFxuICAgICAgICAgIG91dGxpbmVDb2xvcjogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICBoZWlnaHQ6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5oZWlnaHQsXG4gICAgICAgICAgZXh0cnVkZWRIZWlnaHQ6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5leHRydWRlZEhlaWdodFxuICAgICAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcmVjdGFuZ2xlLWRlc2M+XG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiByZWN0YW5nbGUubGFiZWxzXCIgW2lkR2V0dGVyXT1cImdldExhYmVsSWRcIj5cbiAgICAgICAgPGFjLWxhYmVsLXByaW1pdGl2ZS1kZXNjXG4gICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICBwb3NpdGlvbjogbGFiZWwucG9zaXRpb24sXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcbiAgICAgICAgICAgIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogbGFiZWwuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxuICAgICAgICAgICAgZXllT2Zmc2V0OiBsYWJlbC5leWVPZmZzZXQsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcbiAgICAgICAgICAgIGZvbnQ6IGxhYmVsLmZvbnQsXG4gICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IGxhYmVsLmhlaWdodFJlZmVyZW5jZSxcbiAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXG4gICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGxhYmVsLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgIG91dGxpbmVXaWR0aDogbGFiZWwub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2NhbGU6IGxhYmVsLnNjYWxlLFxuICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzaG93OiBsYWJlbC5zaG93LFxuICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IGxhYmVsLnNob3dCYWNrZ3JvdW5kLFxuICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxuICAgICAgICAgICAgdGV4dDogbGFiZWwudGV4dCxcbiAgICAgICAgICAgIHRyYW5zbHVjZW5jeUJ5RGlzdGFuY2U6IGxhYmVsLnRyYW5zbHVjZW5jeUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICB2ZXJ0aWNhbE9yaWdpbjogbGFiZWwudmVydGljYWxPcmlnaW4sXG4gICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IGxhYmVsLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgfVwiXG4gICAgICAgID5cbiAgICAgICAgPC9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYz5cbiAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuICBgLFxuICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyLCBSZWN0YW5nbGVzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlLCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdO1xuICBwdWJsaWMgQ2VzaXVtID0gQ2VzaXVtO1xuICBwdWJsaWMgZWRpdFBvaW50cyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIGVkaXRSZWN0YW5nbGVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRSZWN0YW5nbGVzTGF5ZXInKSBwcml2YXRlIGVkaXRSZWN0YW5nbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVjdGFuZ2xlc0VkaXRvcjogUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVjdGFuZ2xlc01hbmFnZXI6IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5yZWN0YW5nbGVzRWRpdG9yLmluaXQoXG4gICAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICB0aGlzLmNhbWVyYVNlcnZpY2UsXG4gICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLFxuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlXG4gICAgKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMucmVjdGFuZ2xlc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlKSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlOiBFZGl0YWJsZVJlY3RhbmdsZSwgdXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUucG9zaXRpb25zID0gcmVjdGFuZ2xlLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB1cGRhdGUucG9pbnRzID0gcmVjdGFuZ2xlLmdldFJlYWxQb2ludHMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIHJlY3RhbmdsZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIudXBkYXRlKHJlY3RhbmdsZSwgcmVjdGFuZ2xlLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZWN0YW5nbGUubGFiZWxzID0gdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4odXBkYXRlLCByZWN0YW5nbGUubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIudXBkYXRlKHJlY3RhbmdsZSwgcmVjdGFuZ2xlLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhyZWN0YW5nbGU6IEVkaXRhYmxlUmVjdGFuZ2xlKSB7XG4gICAgcmVjdGFuZ2xlLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllci51cGRhdGUocmVjdGFuZ2xlLCByZWN0YW5nbGUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogUmVjdGFuZ2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUmVjdGFuZ2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5yZWN0YW5nbGVPcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuTU9VU0VfTU9WRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5tb3ZlVGVtcE1vdmluZ1BvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVDoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5hZGRMYXN0UG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmRpc3Bvc2UoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMocmVjdGFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0s6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFM6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZTogUmVjdGFuZ2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUmVjdGFuZ2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5yZWN0YW5nbGVPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUuZW5kTW92ZVBvaW50KCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSkge1xuICAgICAgICAgIHJlY3RhbmdsZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUubW92ZVNoYXBlKHVwZGF0ZS5kcmFnZ2VkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSAmJiByZWN0YW5nbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHJlY3RhbmdsZS5lbmRNb3ZlU2hhcGUoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cblxuIl19
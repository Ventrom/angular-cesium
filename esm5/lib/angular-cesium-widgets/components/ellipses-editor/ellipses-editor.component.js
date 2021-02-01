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
import { EllipsesManagerService } from '../../services/entity-editors/ellipses-editor/ellipses-manager.service';
import { EllipsesEditorService } from '../../services/entity-editors/ellipses-editor/ellipses-editor.service';
var EllipsesEditorComponent = /** @class */ (function () {
    function EllipsesEditorComponent(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager, cesiumService) {
        this.ellipsesEditor = ellipsesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editEllipses$ = new Subject();
        this.ellipsesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.ellipsesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    EllipsesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.ellipsesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    EllipsesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    EllipsesEditorComponent.prototype.renderEditLabels = function (ellipse, update, labels) {
        update.center = ellipse.getCenter();
        update.majorRadius = ellipse.getMajorRadius();
        update.minorRadius = ellipse.getMinorRadius();
        update.rotation = ellipse.getRotation();
        if (labels) {
            ellipse.labels = labels;
            this.editEllipsesLayer.update(ellipse, ellipse.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        ellipse.labels = this.editLabelsRenderFn(update, ellipse.labels);
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    };
    EllipsesEditorComponent.prototype.removeEditLabels = function (ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    };
    EllipsesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    this.removeEditLabels(ellipse);
                    this.ellipsesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    EllipsesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                var ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = true;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    EllipsesEditorComponent.prototype.ngOnDestroy = function () {
        this.ellipsesManager.clear();
    };
    EllipsesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    EllipsesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    EllipsesEditorComponent.ctorParameters = function () { return [
        { type: EllipsesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: EllipsesManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editEllipsesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], EllipsesEditorComponent.prototype, "editEllipsesLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], EllipsesEditorComponent.prototype, "editPointsLayer", void 0);
    EllipsesEditorComponent = __decorate([
        Component({
            selector: 'ellipses-editor',
            template: /*html*/ "\n      <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n          <ac-point-desc\n                  props=\"{\n                    position: point.getPositionCallbackProperty(),\n                    pixelSize: getPointSize(point),\n                    color: point.props.color,\n                    outlineColor: point.props.outlineColor,\n                    outlineWidth: point.props.outlineWidth,\n                    show: getPointShow(point),\n                    disableDepthTestDistance: point.props.disableDepthTestDistance,\n                    heightReference: point.props.heightReference,\n    }\"\n          >\n          </ac-point-desc>\n      </ac-layer>\n\n      <ac-layer #editEllipsesLayer acFor=\"let ellipse of editEllipses$\" [context]=\"this\" [zIndex]=\"0\">\n          <ac-ellipse-desc\n                  props=\"{\n                    position: ellipse.getCenterCallbackProperty(),\n                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),\n                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),\n                    rotation: ellipse.getRotationCallbackProperty(),\n                    material: ellipse.ellipseProps.material,\n                    outline: ellipse.ellipseProps.outline,\n                    outlineWidth: ellipse.ellipseProps.outlineWidth,\n                    outlineColor: ellipse.ellipseProps.outlineColor,\n                    height: 0,\n                    fill: ellipse.ellipseProps.fill,\n                    classificationType: ellipse.ellipseProps.classificationType,\n                    zIndex: ellipse.ellipseProps.zIndex,\n                    shadows: ellipse.ellipseProps.shadows,\n    }\"\n          >\n          </ac-ellipse-desc>\n\n          <ac-array-desc acFor=\"let label of ellipse.labels\" [idGetter]=\"getLabelId\">\n              <ac-label-primitive-desc\n                      props=\"{\n                        position: label.position,\n                        text: label.text,\n                        backgroundColor: label.backgroundColor,\n                        backgroundPadding: label.backgroundPadding,\n                        distanceDisplayCondition: label.distanceDisplayCondition,\n                        eyeOffset: label.eyeOffset,\n                        fillColor: label.fillColor,\n                        font: label.font,\n                        heightReference: label.heightReference,\n                        horizontalOrigin: label.horizontalOrigin,\n                        outlineColor: label.outlineColor,\n                        outlineWidth: label.outlineWidth,\n                        pixelOffset: label.pixelOffset,\n                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n                        scale: label.scale,\n                        scaleByDistance: label.scaleByDistance,\n                        show: label.show,\n                        showBackground: label.showBackground,\n                        style: label.style,\n                        translucencyByDistance: label.translucencyByDistance,\n                        verticalOrigin: label.verticalOrigin,\n                        disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n              >\n              </ac-label-primitive-desc>\n          </ac-array-desc>\n      </ac-layer>\n  ",
            providers: [CoordinateConverter, EllipsesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [EllipsesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            EllipsesManagerService,
            CesiumService])
    ], EllipsesEditorComponent);
    return EllipsesEditorComponent;
}());
export { EllipsesEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDbEcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDbEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0VBQXdFLENBQUM7QUFDaEgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUVBQXVFLENBQUM7QUE4RTlHO0lBU0UsaUNBQ1UsY0FBcUMsRUFDckMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixlQUF1QyxFQUN2QyxhQUE0QjtRQUw1QixtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLGtCQUFhLEdB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LElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRyxDQUFDOztnQkEzTXlCLHFCQUFxQjtnQkFDaEIsbUJBQW1CO2dCQUN0Qix1QkFBdUI7Z0JBQzFCLGFBQWE7Z0JBQ1gsc0JBQXNCO2dCQUN4QixhQUFhOztJQVROO1FBQS9CLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztrQ0FBNEIsZ0JBQWdCO3NFQUFDO0lBQzlDO1FBQTdCLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztrQ0FBMEIsZ0JBQWdCO29FQUFDO0lBUDdELHVCQUF1QjtRQXpFbkMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixRQUFRLEVBQUUsUUFBUSxDQUFDLHEwR0FtRWxCO1lBQ0QsU0FBUyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUM7WUFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQzt5Q0FXMEIscUJBQXFCO1lBQ2hCLG1CQUFtQjtZQUN0Qix1QkFBdUI7WUFDMUIsYUFBYTtZQUNYLHNCQUFzQjtZQUN4QixhQUFhO09BZjNCLHVCQUF1QixDQXNObkM7SUFBRCw4QkFBQztDQUFBLEFBdE5ELElBc05DO1NBdE5ZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZWxsaXBzZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBwaXhlbFNpemU6IGdldFBvaW50U2l6ZShwb2ludCksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBwb2ludC5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogcG9pbnQucHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBzaG93OiBnZXRQb2ludFNob3cocG9pbnQpLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IHBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBwb2ludC5wcm9wcy5oZWlnaHRSZWZlcmVuY2UsXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG5cbiAgICAgIDxhYy1sYXllciAjZWRpdEVsbGlwc2VzTGF5ZXIgYWNGb3I9XCJsZXQgZWxsaXBzZSBvZiBlZGl0RWxsaXBzZXMkXCIgW2NvbnRleHRdPVwidGhpc1wiIFt6SW5kZXhdPVwiMFwiPlxuICAgICAgICAgIDxhYy1lbGxpcHNlLWRlc2NcbiAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWxsaXBzZS5nZXRDZW50ZXJDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHNlbWlNYWpvckF4aXM6IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiBlbGxpcHNlLmdldFJvdGF0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogZWxsaXBzZS5lbGxpcHNlUHJvcHMubWF0ZXJpYWwsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmUsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogZWxsaXBzZS5lbGxpcHNlUHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5maWxsLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IGVsbGlwc2UuZWxsaXBzZVByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBlbGxpcHNlLmVsbGlwc2VQcm9wcy56SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd3M6IGVsbGlwc2UuZWxsaXBzZVByb3BzLnNoYWRvd3MsXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtZWxsaXBzZS1kZXNjPlxuXG4gICAgICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgZWxsaXBzZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogbGFiZWwuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXllT2Zmc2V0OiBsYWJlbC5leWVPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IGxhYmVsLmZvbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IGxhYmVsLmhlaWdodFJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGxhYmVsLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogbGFiZWwub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGxhYmVsLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBsYWJlbC5zaG93LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IGxhYmVsLnNob3dCYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIEVsbGlwc2VzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgRWxsaXBzZXNFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdEVsbGlwc2VzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRFbGxpcHNlc0xheWVyJykgcHJpdmF0ZSBlZGl0RWxsaXBzZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGxpcHNlc0VkaXRvcjogRWxsaXBzZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIGVsbGlwc2VzTWFuYWdlcjogRWxsaXBzZXNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuZWxsaXBzZXNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCB0aGlzLmVsbGlwc2VzTWFuYWdlciwgdGhpcy5jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMuZWxsaXBzZXNFZGl0b3Iub25VcGRhdGUoKS5zdWJzY3JpYmUodXBkYXRlID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhlbGxpcHNlOiBFZGl0YWJsZUVsbGlwc2UsIHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIHVwZGF0ZS5jZW50ZXIgPSBlbGxpcHNlLmdldENlbnRlcigpO1xuICAgIHVwZGF0ZS5tYWpvclJhZGl1cyA9IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICB1cGRhdGUubWlub3JSYWRpdXMgPSBlbGxpcHNlLmdldE1pbm9yUmFkaXVzKCk7XG4gICAgdXBkYXRlLnJvdGF0aW9uID0gZWxsaXBzZS5nZXRSb3RhdGlvbigpO1xuXG4gICAgaWYgKGxhYmVscykge1xuICAgICAgZWxsaXBzZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLnVwZGF0ZShlbGxpcHNlLCBlbGxpcHNlLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbGxpcHNlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgZWxsaXBzZS5sYWJlbHMpO1xuICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIudXBkYXRlKGVsbGlwc2UsIGVsbGlwc2UuZ2V0SWQoKSk7XG4gIH1cblxuICByZW1vdmVFZGl0TGFiZWxzKGVsbGlwc2U6IEVkaXRhYmxlRWxsaXBzZSkge1xuICAgIGVsbGlwc2UubGFiZWxzID0gW107XG4gICAgdGhpcy5lZGl0RWxsaXBzZXNMYXllci51cGRhdGUoZWxsaXBzZSwgZWxsaXBzZS5nZXRJZCgpKTtcbiAgfVxuXG4gIGhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIGVsbGlwc2UubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIGVsbGlwc2UubWFqb3JSYWRpdXNQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUuY2VudGVyKSB7XG4gICAgICAgICAgZWxsaXBzZS5hZGRQb2ludCh1cGRhdGUuY2VudGVyKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIGVsbGlwc2UuYWRkTGFzdFBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoZWxsaXBzZSk7XG4gICAgICAgICAgdGhpcy5lbGxpcHNlc01hbmFnZXIuZGlzcG9zZSh1cGRhdGUuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgZWxsaXBzZS5zZXRNYW51YWxseShcbiAgICAgICAgICB1cGRhdGUuY2VudGVyLFxuICAgICAgICAgIHVwZGF0ZS5tYWpvclJhZGl1cyxcbiAgICAgICAgICB1cGRhdGUucm90YXRpb24sXG4gICAgICAgICAgdXBkYXRlLm1pbm9yUmFkaXVzLFxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMpIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAodXBkYXRlLmVsbGlwc2VPcHRpb25zICYmIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucy5wb2ludFByb3BzKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgKHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyAmJiB1cGRhdGUuZWxsaXBzZU9wdGlvbnMuZWxsaXBzZVByb3BzKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLm1vdmVQb2ludCh1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uLCB1cGRhdGUudXBkYXRlZFBvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGVsbGlwc2UubW92ZUVsbGlwc2UodXBkYXRlLnN0YXJ0RHJhZ1Bvc2l0aW9uLCB1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLmVuZE1vdmVFbGxpcHNlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlRSQU5TRk9STToge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGVsbGlwc2UudHJhbnNmb3JtVG9FbGxpcHNlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSkge1xuICAgICAgICAgIGVsbGlwc2UuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSkge1xuICAgICAgICAgIGVsbGlwc2UuZW5hYmxlRWRpdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
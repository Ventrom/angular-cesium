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
export class EllipsesEditorComponent {
    constructor(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager, cesiumService) {
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
    startListeningToEditorUpdates() {
        this.ellipsesEditor.onUpdate().subscribe(update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(ellipse, update, labels) {
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
    }
    removeEditLabels(ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    this.removeEditLabels(ellipse);
                    this.ellipsesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                const ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
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
    }
    ngOnDestroy() {
        this.ellipsesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
EllipsesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ellipses-editor',
                template: /*html*/ `
      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                    position: ellipse.getCenterCallbackProperty(),
                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
                    rotation: ellipse.getRotationCallbackProperty(),
                    material: ellipse.ellipseProps.material,
                    outline: ellipse.ellipseProps.outline,
                    outlineWidth: ellipse.ellipseProps.outlineWidth,
                    outlineColor: ellipse.ellipseProps.outlineColor,
                    height: 0,
                    fill: ellipse.ellipseProps.fill,
                    classificationType: ellipse.ellipseProps.classificationType,
                    zIndex: ellipse.ellipseProps.zIndex,
                    shadows: ellipse.ellipseProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
                        position: label.position,
                        text: label.text,
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
                        translucencyByDistance: label.translucencyByDistance,
                        verticalOrigin: label.verticalOrigin,
                        disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `,
                providers: [CoordinateConverter, EllipsesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
EllipsesEditorComponent.ctorParameters = () => [
    { type: EllipsesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: EllipsesManagerService },
    { type: CesiumService }
];
EllipsesEditorComponent.propDecorators = {
    editEllipsesLayer: [{ type: ViewChild, args: ['editEllipsesLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFeEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9GQUFvRixDQUFDO0FBQ3pILE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlFQUF5RSxDQUFDO0FBQ2xILE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBRXZGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdFQUF3RSxDQUFDO0FBQ2hILE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVFQUF1RSxDQUFDO0FBOEU5RyxNQUFNLE9BQU8sdUJBQXVCO0lBU2xDLFlBQ1UsY0FBcUMsRUFDckMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixlQUF1QyxFQUN2QyxhQUE0QjtRQUw1QixtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtR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QUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRyxDQUFDOzs7WUE5UkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRWxCO2dCQUNELFNBQVMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO2dCQUN4RCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O1lBN0VRLHFCQUFxQjtZQU5yQixtQkFBbUI7WUFDbkIsdUJBQXVCO1lBRXZCLGFBQWE7WUFFYixzQkFBc0I7WUFWdEIsYUFBYTs7O2dDQStGbkIsU0FBUyxTQUFDLG1CQUFtQjs4QkFDN0IsU0FBUyxTQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZWxsaXBzZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBwaXhlbFNpemU6IGdldFBvaW50U2l6ZShwb2ludCksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBwb2ludC5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogcG9pbnQucHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBzaG93OiBnZXRQb2ludFNob3cocG9pbnQpLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IHBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBwb2ludC5wcm9wcy5oZWlnaHRSZWZlcmVuY2UsXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG5cbiAgICAgIDxhYy1sYXllciAjZWRpdEVsbGlwc2VzTGF5ZXIgYWNGb3I9XCJsZXQgZWxsaXBzZSBvZiBlZGl0RWxsaXBzZXMkXCIgW2NvbnRleHRdPVwidGhpc1wiIFt6SW5kZXhdPVwiMFwiPlxuICAgICAgICAgIDxhYy1lbGxpcHNlLWRlc2NcbiAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWxsaXBzZS5nZXRDZW50ZXJDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHNlbWlNYWpvckF4aXM6IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiBlbGxpcHNlLmdldFJvdGF0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogZWxsaXBzZS5lbGxpcHNlUHJvcHMubWF0ZXJpYWwsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmUsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogZWxsaXBzZS5lbGxpcHNlUHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICBmaWxsOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5maWxsLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IGVsbGlwc2UuZWxsaXBzZVByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBlbGxpcHNlLmVsbGlwc2VQcm9wcy56SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd3M6IGVsbGlwc2UuZWxsaXBzZVByb3BzLnNoYWRvd3MsXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtZWxsaXBzZS1kZXNjPlxuXG4gICAgICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgZWxsaXBzZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogbGFiZWwuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXllT2Zmc2V0OiBsYWJlbC5leWVPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IGxhYmVsLmZvbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IGxhYmVsLmhlaWdodFJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGxhYmVsLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogbGFiZWwub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IGxhYmVsLnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBsYWJlbC5zaG93LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IGxhYmVsLnNob3dCYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIEVsbGlwc2VzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgRWxsaXBzZXNFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdEVsbGlwc2VzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRFbGxpcHNlc0xheWVyJykgcHJpdmF0ZSBlZGl0RWxsaXBzZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGxpcHNlc0VkaXRvcjogRWxsaXBzZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIGVsbGlwc2VzTWFuYWdlcjogRWxsaXBzZXNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuZWxsaXBzZXNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCB0aGlzLmVsbGlwc2VzTWFuYWdlciwgdGhpcy5jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMuZWxsaXBzZXNFZGl0b3Iub25VcGRhdGUoKS5zdWJzY3JpYmUodXBkYXRlID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhlbGxpcHNlOiBFZGl0YWJsZUVsbGlwc2UsIHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIHVwZGF0ZS5jZW50ZXIgPSBlbGxpcHNlLmdldENlbnRlcigpO1xuICAgIHVwZGF0ZS5tYWpvclJhZGl1cyA9IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICB1cGRhdGUubWlub3JSYWRpdXMgPSBlbGxpcHNlLmdldE1pbm9yUmFkaXVzKCk7XG4gICAgdXBkYXRlLnJvdGF0aW9uID0gZWxsaXBzZS5nZXRSb3RhdGlvbigpO1xuXG4gICAgaWYgKGxhYmVscykge1xuICAgICAgZWxsaXBzZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLnVwZGF0ZShlbGxpcHNlLCBlbGxpcHNlLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbGxpcHNlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgZWxsaXBzZS5sYWJlbHMpO1xuICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIudXBkYXRlKGVsbGlwc2UsIGVsbGlwc2UuZ2V0SWQoKSk7XG4gIH1cblxuICByZW1vdmVFZGl0TGFiZWxzKGVsbGlwc2U6IEVkaXRhYmxlRWxsaXBzZSkge1xuICAgIGVsbGlwc2UubGFiZWxzID0gW107XG4gICAgdGhpcy5lZGl0RWxsaXBzZXNMYXllci51cGRhdGUoZWxsaXBzZSwgZWxsaXBzZS5nZXRJZCgpKTtcbiAgfVxuXG4gIGhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIGVsbGlwc2UubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIGVsbGlwc2UubWFqb3JSYWRpdXNQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUuY2VudGVyKSB7XG4gICAgICAgICAgZWxsaXBzZS5hZGRQb2ludCh1cGRhdGUuY2VudGVyKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIGVsbGlwc2UuYWRkTGFzdFBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoZWxsaXBzZSk7XG4gICAgICAgICAgdGhpcy5lbGxpcHNlc01hbmFnZXIuZGlzcG9zZSh1cGRhdGUuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgZWxsaXBzZS5zZXRNYW51YWxseShcbiAgICAgICAgICB1cGRhdGUuY2VudGVyLFxuICAgICAgICAgIHVwZGF0ZS5tYWpvclJhZGl1cyxcbiAgICAgICAgICB1cGRhdGUucm90YXRpb24sXG4gICAgICAgICAgdXBkYXRlLm1pbm9yUmFkaXVzLFxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMpIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAodXBkYXRlLmVsbGlwc2VPcHRpb25zICYmIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucy5wb2ludFByb3BzKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgKHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyAmJiB1cGRhdGUuZWxsaXBzZU9wdGlvbnMuZWxsaXBzZVByb3BzKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLm1vdmVQb2ludCh1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uLCB1cGRhdGUudXBkYXRlZFBvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGVsbGlwc2UubW92ZUVsbGlwc2UodXBkYXRlLnN0YXJ0RHJhZ1Bvc2l0aW9uLCB1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLmVuZE1vdmVFbGxpcHNlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlRSQU5TRk9STToge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGVsbGlwc2UudHJhbnNmb3JtVG9FbGxpcHNlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSkge1xuICAgICAgICAgIGVsbGlwc2UuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSkge1xuICAgICAgICAgIGVsbGlwc2UuZW5hYmxlRWRpdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
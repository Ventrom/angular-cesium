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
export class CirclesEditorComponent {
    constructor(circlesEditor, coordinateConverter, mapEventsManager, cameraService, circlesManager) {
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
    startListeningToEditorUpdates() {
        this.circlesEditor.onUpdate().subscribe(update => {
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
    renderEditLabels(circle, update, labels) {
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
    }
    removeEditLabels(circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    this.removeEditLabels(circle);
                    this.circlesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
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
                const circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const circle = this.circlesManager.get(update.id);
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
    }
    ngOnDestroy() {
        this.circlesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
CirclesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'circles-editor',
                template: /*html*/ `
      <ac-layer #editArcsLayer acFor="let arc of editArcs$" [context]="this">
          <ac-arc-desc
                  props="{
        angle: arc.angle,
        delta: arc.delta,
        center: arc.center,
        radius: arc.radius,
        quality: 30,
        color: arc.props.material()
    }"
          >
          </ac-arc-desc>
      </ac-layer>

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

      <ac-layer #editCirclesLayer acFor="let circle of editCircles$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                  position: circle.getCenterCallbackProperty(),
                  semiMajorAxis: circle.getRadiusCallbackProperty(),
                  semiMinorAxis: circle.getRadiusCallbackProperty(),
                  material: circle.circleProps.material,
                  outline: circle.circleProps.outline,
                  height: 0
                  outlineWidth: circle.circleProps.outlineWidth,
                  outlineColor: circle.circleProps.outlineColor,
                  fill: circle.circleProps.fill,
                  classificationType: circle.circleProps.classificationType,
                  zIndex: circle.circleProps.zIndex,
                  shadows: circle.circleProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of circle.labels" [idGetter]="getLabelId">
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
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `,
                providers: [CoordinateConverter, CirclesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
CirclesEditorComponent.ctorParameters = () => [
    { type: CirclesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: CirclesManagerService }
];
CirclesEditorComponent.propDecorators = {
    editCirclesLayer: [{ type: ViewChild, args: ['editCirclesLayer',] }],
    editArcsLayer: [{ type: ViewChild, args: ['editArcsLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDbEcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDbEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7QUFDN0csT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUVBQXFFLENBQUM7QUEyRjNHLE1BQU0sT0FBTyxzQkFBc0I7SUFXakMsWUFDVSxhQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGNBQXFDO1FBSnJDLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7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QUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ2hHLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBZ0I7UUFDM0IsT0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7OztZQTFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnRmxCO2dCQUNELFNBQVMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLHFCQUFxQixDQUFDO2dCQUN2RCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O1lBMUZRLG9CQUFvQjtZQU5wQixtQkFBbUI7WUFDbkIsdUJBQXVCO1lBRXZCLGFBQWE7WUFFYixxQkFBcUI7OzsrQkFtRzNCLFNBQVMsU0FBQyxrQkFBa0I7NEJBQzVCLFNBQVMsU0FBQyxlQUFlOzhCQUN6QixTQUFTLFNBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDaXJjbGVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDaXJjbGVzRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZUNpcmNsZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1jaXJjbGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjaXJjbGVzLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRBcmNzTGF5ZXIgYWNGb3I9XCJsZXQgYXJjIG9mIGVkaXRBcmNzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgICAgICA8YWMtYXJjLWRlc2NcbiAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICAgICAgICBkZWx0YTogYXJjLmRlbHRhLFxuICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gICAgICAgIHJhZGl1czogYXJjLnJhZGl1cyxcbiAgICAgICAgcXVhbGl0eTogMzAsXG4gICAgICAgIGNvbG9yOiBhcmMucHJvcHMubWF0ZXJpYWwoKVxuICAgIH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FjLWFyYy1kZXNjPlxuICAgICAgPC9hYy1sYXllcj5cblxuICAgICAgPGFjLWxheWVyICNlZGl0UG9pbnRzTGF5ZXIgYWNGb3I9XCJsZXQgcG9pbnQgb2YgZWRpdFBvaW50cyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICAgICAgPGFjLXBvaW50LWRlc2NcbiAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC9hYy1wb2ludC1kZXNjPlxuICAgICAgPC9hYy1sYXllcj5cblxuICAgICAgPGFjLWxheWVyICNlZGl0Q2lyY2xlc0xheWVyIGFjRm9yPVwibGV0IGNpcmNsZSBvZiBlZGl0Q2lyY2xlcyRcIiBbY29udGV4dF09XCJ0aGlzXCIgW3pJbmRleF09XCIwXCI+XG4gICAgICAgICAgPGFjLWVsbGlwc2UtZGVzY1xuICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogY2lyY2xlLmdldENlbnRlckNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgICAgICAgIHNlbWlNYWpvckF4aXM6IGNpcmNsZS5nZXRSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICBzZW1pTWlub3JBeGlzOiBjaXJjbGUuZ2V0UmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IGNpcmNsZS5jaXJjbGVQcm9wcy5tYXRlcmlhbCxcbiAgICAgICAgICAgICAgICAgIG91dGxpbmU6IGNpcmNsZS5jaXJjbGVQcm9wcy5vdXRsaW5lLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGNpcmNsZS5jaXJjbGVQcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGNpcmNsZS5jaXJjbGVQcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICAgICAgICBmaWxsOiBjaXJjbGUuY2lyY2xlUHJvcHMuZmlsbCxcbiAgICAgICAgICAgICAgICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogY2lyY2xlLmNpcmNsZVByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgICAgICAgICAgICAgIHpJbmRleDogY2lyY2xlLmNpcmNsZVByb3BzLnpJbmRleCxcbiAgICAgICAgICAgICAgICAgIHNoYWRvd3M6IGNpcmNsZS5jaXJjbGVQcm9wcy5zaGFkb3dzLFxuICAgIH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FjLWVsbGlwc2UtZGVzYz5cblxuICAgICAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIGNpcmNsZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIENpcmNsZXNNYW5hZ2VyU2VydmljZV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDaXJjbGVzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdENpcmNsZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0QXJjcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0Q2lyY2xlc0xheWVyJykgcHJpdmF0ZSBlZGl0Q2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0QXJjc0xheWVyJykgcHJpdmF0ZSBlZGl0QXJjc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRzTGF5ZXInKSBwcml2YXRlIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNpcmNsZXNFZGl0b3I6IENpcmNsZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuY2lyY2xlc0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHRoaXMuY2lyY2xlc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5jaXJjbGVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKHVwZGF0ZSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSwgdXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUuY2VudGVyID0gY2lyY2xlLmdldENlbnRlcigpO1xuICAgIHVwZGF0ZS5yYWRpdXNQb2ludCA9IGNpcmNsZS5nZXRSYWRpdXNQb2ludCgpO1xuICAgIHVwZGF0ZS5yYWRpdXMgPSBjaXJjbGUuZ2V0UmFkaXVzKCk7XG5cbiAgICBpZiAobGFiZWxzKSB7XG4gICAgICBjaXJjbGUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2lyY2xlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgY2lyY2xlLmxhYmVscyk7XG4gICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSkge1xuICAgIGNpcmNsZS5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIudXBkYXRlKGNpcmNsZSwgY2lyY2xlLmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUNpcmNsZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdEFyY3NMYXllcixcbiAgICAgICAgICB1cGRhdGUuY2lyY2xlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5jZW50ZXIpIHtcbiAgICAgICAgICBjaXJjbGUuYWRkUG9pbnQodXBkYXRlLmNlbnRlcik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5hZGRMYXN0UG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChjaXJjbGUpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoY2lyY2xlKTtcbiAgICAgICAgICB0aGlzLmNpcmNsZXNNYW5hZ2VyLmRpc3Bvc2UodXBkYXRlLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVDaXJjbGUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdENpcmNsZXNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRBcmNzTGF5ZXIsXG4gICAgICAgICAgdXBkYXRlLmNpcmNsZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGNpcmNsZS5zZXRNYW51YWxseSh1cGRhdGUuY2VudGVyLCB1cGRhdGUucmFkaXVzUG9pbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSAmJiBjaXJjbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLmVuZERyYWdQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLm1vdmVDaXJjbGUodXBkYXRlLnN0YXJ0RHJhZ1Bvc2l0aW9uLCB1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLmVuZE1vdmVQb2x5Z29uKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlKSB7XG4gICAgICAgICAgY2lyY2xlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSkge1xuICAgICAgICAgIGNpcmNsZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
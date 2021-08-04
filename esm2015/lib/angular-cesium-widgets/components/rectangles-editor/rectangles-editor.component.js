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
export class RectanglesEditorComponent {
    constructor(rectanglesEditor, coordinateConverter, mapEventsManager, cameraService, rectanglesManager, cesiumService) {
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
    startListeningToEditorUpdates() {
        this.rectanglesEditor.onUpdate().subscribe((update) => {
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
    renderEditLabels(rectangle, update, labels) {
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
    }
    removeEditLabels(rectangle) {
        rectangle.labels = [];
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    rectangle.addPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.dispose();
                    this.removeEditLabels(rectangle);
                }
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(rectangle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
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
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMovePoint();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = false;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = true;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const rectangle = this.rectanglesManager.get(update.id);
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
    }
    ngOnDestroy() {
        this.rectanglesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
RectanglesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'rectangles-editor',
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

    <ac-layer #editRectanglesLayer acFor="let rectangle of editRectangles$" [context]="this">
      <ac-rectangle-desc
        props="{
          coordinates: rectangle.getRectangleCallbackProperty(),
          material: rectangle.rectangleProps.material,
          fill: rectangle.rectangleProps.fill,
          classificationType: rectangle.rectangleProps.classificationType,
          zIndex: rectangle.rectangleProps.zIndex,
          outline: rectangle.rectangleProps.outline,
          outlineColor: rectangle.rectangleProps.outlineColor,
          height: rectangle.rectangleProps.height,
          extrudedHeight: rectangle.rectangleProps.extrudedHeight
        }"
      >
      </ac-rectangle-desc>
      <ac-array-desc acFor="let label of rectangle.labels" [idGetter]="getLabelId">
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
                providers: [CoordinateConverter, RectanglesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
RectanglesEditorComponent.ctorParameters = () => [
    { type: RectanglesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: RectanglesManagerService },
    { type: CesiumService }
];
RectanglesEditorComponent.propDecorators = {
    editRectanglesLayer: [{ type: ViewChild, args: ['editRectanglesLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHeEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9GQUFvRixDQUFDO0FBQ3pILE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlFQUF5RSxDQUFDO0FBQ2xILE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBRXZGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJFQUEyRSxDQUFDO0FBd0VwSCxNQUFNLE9BQU8seUJBQXlCO0lBU3BDLFlBQ1UsZ0JBQXlDLEVBQ3pDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsaUJBQTJDLEVBQzNDLGFBQTRCO1FBTDVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsd0JBQW1CLEdBQW5CLG1C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LHdCQUF3QjtZQVh4QixhQUFhOzs7a0NBMEZuQixTQUFTLFNBQUMscUJBQXFCOzhCQUMvQixTQUFTLFNBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcmVjdGFuZ2xlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3RhbmdsZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1lZGl0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlUmVjdGFuZ2xlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXJlY3RhbmdsZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3JlY3RhbmdsZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0UmVjdGFuZ2xlc0xheWVyIGFjRm9yPVwibGV0IHJlY3RhbmdsZSBvZiBlZGl0UmVjdGFuZ2xlcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcmVjdGFuZ2xlLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlY3RhbmdsZS5nZXRSZWN0YW5nbGVDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgbWF0ZXJpYWw6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5tYXRlcmlhbCxcbiAgICAgICAgICBmaWxsOiByZWN0YW5nbGUucmVjdGFuZ2xlUHJvcHMuZmlsbCxcbiAgICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXG4gICAgICAgICAgekluZGV4OiByZWN0YW5nbGUucmVjdGFuZ2xlUHJvcHMuekluZGV4LFxuICAgICAgICAgIG91dGxpbmU6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5vdXRsaW5lLFxuICAgICAgICAgIG91dGxpbmVDb2xvcjogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICBoZWlnaHQ6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5oZWlnaHQsXG4gICAgICAgICAgZXh0cnVkZWRIZWlnaHQ6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5leHRydWRlZEhlaWdodFxuICAgICAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcmVjdGFuZ2xlLWRlc2M+XG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiByZWN0YW5nbGUubGFiZWxzXCIgW2lkR2V0dGVyXT1cImdldExhYmVsSWRcIj5cbiAgICAgICAgPGFjLWxhYmVsLXByaW1pdGl2ZS1kZXNjXG4gICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICBwb3NpdGlvbjogbGFiZWwucG9zaXRpb24sXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcbiAgICAgICAgICAgIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogbGFiZWwuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxuICAgICAgICAgICAgZXllT2Zmc2V0OiBsYWJlbC5leWVPZmZzZXQsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcbiAgICAgICAgICAgIGZvbnQ6IGxhYmVsLmZvbnQsXG4gICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IGxhYmVsLmhlaWdodFJlZmVyZW5jZSxcbiAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXG4gICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGxhYmVsLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgIG91dGxpbmVXaWR0aDogbGFiZWwub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2NhbGU6IGxhYmVsLnNjYWxlLFxuICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzaG93OiBsYWJlbC5zaG93LFxuICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IGxhYmVsLnNob3dCYWNrZ3JvdW5kLFxuICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxuICAgICAgICAgICAgdGV4dDogbGFiZWwudGV4dCxcbiAgICAgICAgICAgIHRyYW5zbHVjZW5jeUJ5RGlzdGFuY2U6IGxhYmVsLnRyYW5zbHVjZW5jeUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICB2ZXJ0aWNhbE9yaWdpbjogbGFiZWwudmVydGljYWxPcmlnaW4sXG4gICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IGxhYmVsLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgfVwiXG4gICAgICAgID5cbiAgICAgICAgPC9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYz5cbiAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuICBgLFxuICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyLCBSZWN0YW5nbGVzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlLCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdO1xuICBwdWJsaWMgQ2VzaXVtID0gQ2VzaXVtO1xuICBwdWJsaWMgZWRpdFBvaW50cyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIGVkaXRSZWN0YW5nbGVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRSZWN0YW5nbGVzTGF5ZXInKSBwcml2YXRlIGVkaXRSZWN0YW5nbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVjdGFuZ2xlc0VkaXRvcjogUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVjdGFuZ2xlc01hbmFnZXI6IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5yZWN0YW5nbGVzRWRpdG9yLmluaXQoXG4gICAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIsXG4gICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICB0aGlzLmNhbWVyYVNlcnZpY2UsXG4gICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLFxuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlXG4gICAgKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMucmVjdGFuZ2xlc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlKSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlOiBFZGl0YWJsZVJlY3RhbmdsZSwgdXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUucG9zaXRpb25zID0gcmVjdGFuZ2xlLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB1cGRhdGUucG9pbnRzID0gcmVjdGFuZ2xlLmdldFJlYWxQb2ludHMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIHJlY3RhbmdsZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIudXBkYXRlKHJlY3RhbmdsZSwgcmVjdGFuZ2xlLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZWN0YW5nbGUubGFiZWxzID0gdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4odXBkYXRlLCByZWN0YW5nbGUubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIudXBkYXRlKHJlY3RhbmdsZSwgcmVjdGFuZ2xlLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhyZWN0YW5nbGU6IEVkaXRhYmxlUmVjdGFuZ2xlKSB7XG4gICAgcmVjdGFuZ2xlLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllci51cGRhdGUocmVjdGFuZ2xlLCByZWN0YW5nbGUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogUmVjdGFuZ2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUmVjdGFuZ2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5yZWN0YW5nbGVPcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuTU9VU0VfTU9WRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5tb3ZlVGVtcE1vdmluZ1BvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5tb3ZlVGVtcE1vdmluZ1BvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHJlY3RhbmdsZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVDoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHJlY3RhbmdsZS5hZGRMYXN0UG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmRpc3Bvc2UoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMocmVjdGFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0s6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFM6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZTogUmVjdGFuZ2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUmVjdGFuZ2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRSZWN0YW5nbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5yZWN0YW5nbGVPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUuZW5kTW92ZVBvaW50KCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSkge1xuICAgICAgICAgIHJlY3RhbmdsZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUgJiYgcmVjdGFuZ2xlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICByZWN0YW5nbGUubW92ZVNoYXBlKHVwZGF0ZS5kcmFnZ2VkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSAmJiByZWN0YW5nbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHJlY3RhbmdsZS5lbmRNb3ZlU2hhcGUoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cblxuIl19
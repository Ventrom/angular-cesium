import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';
import { HippodromeEditorService } from '../../services/entity-editors/hippodrome-editor/hippodrome-editor.service';
export class HippodromeEditorComponent {
    constructor(hippodromesEditor, coordinateConverter, mapEventsManager, cameraService, hippodromesManager) {
        this.hippodromesEditor = hippodromesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.hippodromesManager = hippodromesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editHippodromes$ = new Subject();
        this.hippodromesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, hippodromesManager);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.hippodromesEditor.onUpdate().subscribe((update) => {
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
    renderEditLabels(hippodrome, update, labels) {
        update.positions = hippodrome.getRealPositions();
        update.points = hippodrome.getRealPoints();
        if (labels) {
            hippodrome.labels = labels;
            this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        hippodrome.labels = this.editLabelsRenderFn(update, hippodrome.labels);
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    removeEditLabels(hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.dispose();
                    this.removeEditLabels(hippodrome);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
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
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMoveShape();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.hippodromesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
HippodromeEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'hippodrome-editor',
                template: /*html*/ `
      <ac-layer #editHippodromesLayer acFor="let hippodrome of editHippodromes$" [context]="this">
          <ac-corridor-desc props="{
            positions: hippodrome.getRealPositionsCallbackProperty(),
            cornerType: Cesium.CornerType.ROUNDED,
            material: hippodrome.hippodromeProps.material,
            width : hippodrome.hippodromeProps.width,
            outline: hippodrome.hippodromeProps.outline,
            outlineColor: hippodrome.hippodromeProps.outlineColor,
            outlineWidth: hippodrome.hippodromeProps.outlineWidth,
            height: 0,
            classificationType: hippodrome.hippodromeProps.classificationType,
            zIndex: hippodrome.hippodromeProps.zIndex,
            shadows: hippodrome.hippodromeProps.shadows,
    }">
          </ac-corridor-desc>

          <ac-array-desc acFor="let label of hippodrome.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc props="{
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
        }">
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>

      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc props="{
         position: point.getPositionCallbackProperty(),
         pixelSize: getPointSize(point),
         color: point.props.color,
         outlineColor: point.props.outlineColor,
         outlineWidth: point.props.outlineWidth,
         show: getPointShow(point),
         disableDepthTestDistance: point.props.disableDepthTestDistance,
         heightReference: point.props.heightReference,
    }">
          </ac-point-desc>
      </ac-layer>
  `,
                providers: [CoordinateConverter, HippodromeManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
HippodromeEditorComponent.ctorParameters = () => [
    { type: HippodromeEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: HippodromeManagerService }
];
HippodromeEditorComponent.propDecorators = {
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
    editHippodromesLayer: [{ type: ViewChild, args: ['editHippodromesLayer',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDN0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDbEcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDbEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFDdEgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUFzRXBILE1BQU0sT0FBTyx5QkFBeUI7SUFTcEMsWUFDVSxpQkFBMEMsRUFDMUMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixrQkFBNEM7UUFKNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUF5QjtRQUMxQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEs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QztJQUNoRyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWdCO1FBQzNCLE9BQU8sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRyxDQUFDOzs7WUFuUUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkRsQjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsQ0FBQztnQkFDMUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQXJFUSx1QkFBdUI7WUFOdkIsbUJBQW1CO1lBQ25CLHVCQUF1QjtZQUV2QixhQUFhO1lBRWIsd0JBQXdCOzs7OEJBNkU5QixTQUFTLFNBQUMsaUJBQWlCO21DQUMzQixTQUFTLFNBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9oaXBwb2Ryb21lLWVkaXRvci9oaXBwb2Ryb21lLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnaGlwcG9kcm9tZS1lZGl0b3InLFxuICB0ZW1wbGF0ZTogLypodG1sKi8gYFxuICAgICAgPGFjLWxheWVyICNlZGl0SGlwcG9kcm9tZXNMYXllciBhY0Zvcj1cImxldCBoaXBwb2Ryb21lIG9mIGVkaXRIaXBwb2Ryb21lcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICAgICAgPGFjLWNvcnJpZG9yLWRlc2MgcHJvcHM9XCJ7XG4gICAgICAgICAgICBwb3NpdGlvbnM6IGhpcHBvZHJvbWUuZ2V0UmVhbFBvc2l0aW9uc0NhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgIGNvcm5lclR5cGU6IENlc2l1bS5Db3JuZXJUeXBlLlJPVU5ERUQsXG4gICAgICAgICAgICBtYXRlcmlhbDogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMubWF0ZXJpYWwsXG4gICAgICAgICAgICB3aWR0aCA6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLndpZHRoLFxuICAgICAgICAgICAgb3V0bGluZTogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMub3V0bGluZSxcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBoaXBwb2Ryb21lLmhpcHBvZHJvbWVQcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgICAgICAgIHpJbmRleDogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMuekluZGV4LFxuICAgICAgICAgICAgc2hhZG93czogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMuc2hhZG93cyxcbiAgICB9XCI+XG4gICAgICAgICAgPC9hYy1jb3JyaWRvci1kZXNjPlxuXG4gICAgICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgaGlwcG9kcm9tZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MgcHJvcHM9XCJ7XG4gICAgICAgICAgICBwb3NpdGlvbjogbGFiZWwucG9zaXRpb24sXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcbiAgICAgICAgICAgIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjogbGFiZWwuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxuICAgICAgICAgICAgZXllT2Zmc2V0OiBsYWJlbC5leWVPZmZzZXQsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcbiAgICAgICAgICAgIGZvbnQ6IGxhYmVsLmZvbnQsXG4gICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IGxhYmVsLmhlaWdodFJlZmVyZW5jZSxcbiAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXG4gICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGxhYmVsLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgIG91dGxpbmVXaWR0aDogbGFiZWwub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxuICAgICAgICAgICAgcGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2NhbGU6IGxhYmVsLnNjYWxlLFxuICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzaG93OiBsYWJlbC5zaG93LFxuICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IGxhYmVsLnNob3dCYWNrZ3JvdW5kLFxuICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxuICAgICAgICAgICAgdGV4dDogbGFiZWwudGV4dCxcbiAgICAgICAgICAgIHRyYW5zbHVjZW5jeUJ5RGlzdGFuY2U6IGxhYmVsLnRyYW5zbHVjZW5jeUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICB2ZXJ0aWNhbE9yaWdpbjogbGFiZWwudmVydGljYWxPcmlnaW4sXG4gICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IGxhYmVsLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgfVwiPlxuICAgICAgICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgICAgIDwvYWMtYXJyYXktZGVzYz5cbiAgICAgIDwvYWMtbGF5ZXI+XG5cbiAgICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgICAgIDxhYy1wb2ludC1kZXNjIHByb3BzPVwie1xuICAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IHBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogcG9pbnQucHJvcHMuaGVpZ2h0UmVmZXJlbmNlLFxuICAgIH1cIj5cbiAgICAgICAgICA8L2FjLXBvaW50LWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuICBgLFxuICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyLCBIaXBwb2Ryb21lTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgSGlwcG9kcm9tZUVkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHVibGljIENlc2l1bSA9IENlc2l1bTtcbiAgcHVibGljIGVkaXRQb2ludHMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0SGlwcG9kcm9tZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRIaXBwb2Ryb21lc0xheWVyJykgcHJpdmF0ZSBlZGl0SGlwcG9kcm9tZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGhpcHBvZHJvbWVzRWRpdG9yOiBIaXBwb2Ryb21lRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBoaXBwb2Ryb21lc01hbmFnZXI6IEhpcHBvZHJvbWVNYW5hZ2VyU2VydmljZSxcbiAgKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lc0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIGhpcHBvZHJvbWVzTWFuYWdlcik7XG4gICAgdGhpcy5zdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpIHtcbiAgICB0aGlzLmhpcHBvZHJvbWVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKCh1cGRhdGU6IEhpcHBvZHJvbWVFZGl0VXBkYXRlKSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZTogRWRpdGFibGVIaXBwb2Ryb21lLCB1cGRhdGU6IEhpcHBvZHJvbWVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUucG9zaXRpb25zID0gaGlwcG9kcm9tZS5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdXBkYXRlLnBvaW50cyA9IGhpcHBvZHJvbWUuZ2V0UmVhbFBvaW50cygpO1xuXG4gICAgaWYgKGxhYmVscykge1xuICAgICAgaGlwcG9kcm9tZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRIaXBwb2Ryb21lc0xheWVyLnVwZGF0ZShoaXBwb2Ryb21lLCBoaXBwb2Ryb21lLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBoaXBwb2Ryb21lLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgaGlwcG9kcm9tZS5sYWJlbHMpO1xuICAgIHRoaXMuZWRpdEhpcHBvZHJvbWVzTGF5ZXIudXBkYXRlKGhpcHBvZHJvbWUsIGhpcHBvZHJvbWUuZ2V0SWQoKSk7XG4gIH1cblxuICByZW1vdmVFZGl0TGFiZWxzKGhpcHBvZHJvbWU6IEVkaXRhYmxlSGlwcG9kcm9tZSkge1xuICAgIGhpcHBvZHJvbWUubGFiZWxzID0gW107XG4gICAgdGhpcy5lZGl0SGlwcG9kcm9tZXNMYXllci51cGRhdGUoaGlwcG9kcm9tZSwgaGlwcG9kcm9tZS5nZXRJZCgpKTtcbiAgfVxuXG4gIGhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUhpcHBvZHJvbWUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdEhpcHBvZHJvbWVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5oaXBwb2Ryb21lT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIGhpcHBvZHJvbWUubW92ZVRlbXBNb3ZpbmdQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBoaXBwb2Ryb21lLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgaGlwcG9kcm9tZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5kaXNwb3NlKCk7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKGhpcHBvZHJvbWUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IEhpcHBvZHJvbWVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlSGlwcG9kcm9tZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0SGlwcG9kcm9tZXNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLmhpcHBvZHJvbWVPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5tb3ZlUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmRNb3ZlUG9pbnQoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmFibGVFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkVOQUJMRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lICYmIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGhpcHBvZHJvbWUubW92ZVNoYXBlKHVwZGF0ZS5kcmFnZ2VkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmRNb3ZlU2hhcGUoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmNsZWFyKCk7XG4gIH1cblxuICBnZXRQb2ludFNpemUocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcbiAgfVxuXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LnNob3cgJiYgKHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMuc2hvd1ZpcnR1YWwgOiBwb2ludC5wcm9wcy5zaG93KTtcbiAgfVxufVxuIl19
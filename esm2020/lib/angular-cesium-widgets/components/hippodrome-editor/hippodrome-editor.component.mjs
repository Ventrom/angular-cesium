import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/hippodrome-editor/hippodrome-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/hippodrome-editor/hippodrome-manager.service";
import * as i6 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i7 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i8 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i9 from "../../../angular-cesium/components/ac-corridor-desc/ac-corridor-desc.component";
import * as i10 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
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
HippodromeEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: HippodromeEditorComponent, deps: [{ token: i1.HippodromeEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.HippodromeManagerService }], target: i0.ɵɵFactoryTarget.Component });
HippodromeEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: HippodromeEditorComponent, selector: "hippodrome-editor", providers: [CoordinateConverter, HippodromeManagerService], viewQueries: [{ propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editHippodromesLayer", first: true, predicate: ["editHippodromesLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i6.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i7.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i8.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i9.AcCorridorDescComponent, selector: "ac-corridor-desc" }, { kind: "component", type: i10.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: HippodromeEditorComponent, decorators: [{
            type: Component,
            args: [{
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
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.HippodromeEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.HippodromeManagerService }]; }, propDecorators: { editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editHippodromesLayer: [{
                type: ViewChild,
                args: ['editHippodromesLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7Ozs7Ozs7O0FBdUV0SCxNQUFNLE9BQU8seUJBQXlCO0lBU3BDLFlBQ1UsaUJBQTBDLEVBQzFDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsa0JBQTRDO1FBSjVDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBeUI7UUFDMUMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFaL0MsV0FBTSxHQUFHLE1BQU0sQ0FBQztRQUNoQixnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBQzVDLHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBWXRELElBQUksQ0FBQyxp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SUFBSSxDQUFDLENBQUM7SUFDakcsQ0FBQzs7dUhBbE1VLHlCQUF5QjsyR0FBekIseUJBQXlCLDRDQUh6QixDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixDQUFDLDZQQTVEaEQsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJEbEI7NEZBSVUseUJBQXlCO2tCQWpFckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJEbEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsd0JBQXdCLENBQUM7b0JBQzFELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDt5UEFPdUMsZUFBZTtzQkFBcEQsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBQ2Usb0JBQW9CO3NCQUE5RCxTQUFTO3VCQUFDLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9oaXBwb2Ryb21lLWVkaXRvci9oaXBwb2Ryb21lLWVkaXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2hpcHBvZHJvbWUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZUhpcHBvZHJvbWUgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtaGlwcG9kcm9tZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2hpcHBvZHJvbWUtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICAgIDxhYy1sYXllciAjZWRpdEhpcHBvZHJvbWVzTGF5ZXIgYWNGb3I9XCJsZXQgaGlwcG9kcm9tZSBvZiBlZGl0SGlwcG9kcm9tZXMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgICAgIDxhYy1jb3JyaWRvci1kZXNjIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb25zOiBoaXBwb2Ryb21lLmdldFJlYWxQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICBjb3JuZXJUeXBlOiBDZXNpdW0uQ29ybmVyVHlwZS5ST1VOREVELFxuICAgICAgICAgICAgbWF0ZXJpYWw6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLm1hdGVyaWFsLFxuICAgICAgICAgICAgd2lkdGggOiBoaXBwb2Ryb21lLmhpcHBvZHJvbWVQcm9wcy53aWR0aCxcbiAgICAgICAgICAgIG91dGxpbmU6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLm91dGxpbmUsXG4gICAgICAgICAgICBvdXRsaW5lQ29sb3I6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgIG91dGxpbmVXaWR0aDogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgY2xhc3NpZmljYXRpb25UeXBlOiBoaXBwb2Ryb21lLmhpcHBvZHJvbWVQcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXG4gICAgICAgICAgICB6SW5kZXg6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLnpJbmRleCxcbiAgICAgICAgICAgIHNoYWRvd3M6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLnNoYWRvd3MsXG4gICAgfVwiPlxuICAgICAgICAgIDwvYWMtY29ycmlkb3ItZGVzYz5cblxuICAgICAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIGhpcHBvZHJvbWUubGFiZWxzXCIgW2lkR2V0dGVyXT1cImdldExhYmVsSWRcIj5cbiAgICAgICAgICAgICAgPGFjLWxhYmVsLXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luLFxuICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBsYWJlbC5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIH1cIj5cbiAgICAgICAgICAgICAgPC9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYz5cbiAgICAgICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgICAgICA8YWMtcG9pbnQtZGVzYyBwcm9wcz1cIntcbiAgICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgIGNvbG9yOiBwb2ludC5wcm9wcy5jb2xvcixcbiAgICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgICBzaG93OiBnZXRQb2ludFNob3cocG9pbnQpLFxuICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBwb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCI+XG4gICAgICAgICAgPC9hYy1wb2ludC1kZXNjPlxuICAgICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogSGlwcG9kcm9tZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdEhpcHBvZHJvbWVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0SGlwcG9kcm9tZXNMYXllcicpIHByaXZhdGUgZWRpdEhpcHBvZHJvbWVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBoaXBwb2Ryb21lc0VkaXRvcjogSGlwcG9kcm9tZUVkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgaGlwcG9kcm9tZXNNYW5hZ2VyOiBIaXBwb2Ryb21lTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuaGlwcG9kcm9tZXNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCBoaXBwb2Ryb21lc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSkgPT4ge1xuICAgICAgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURSB8fCB1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYWJlbElkKGVsZW1lbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKCk7XG4gIH1cblxuICByZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWU6IEVkaXRhYmxlSGlwcG9kcm9tZSwgdXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSwgbGFiZWxzPzogTGFiZWxQcm9wc1tdKSB7XG4gICAgdXBkYXRlLnBvc2l0aW9ucyA9IGhpcHBvZHJvbWUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHVwZGF0ZS5wb2ludHMgPSBoaXBwb2Ryb21lLmdldFJlYWxQb2ludHMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIGhpcHBvZHJvbWUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0SGlwcG9kcm9tZXNMYXllci51cGRhdGUoaGlwcG9kcm9tZSwgaGlwcG9kcm9tZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGlwcG9kcm9tZS5sYWJlbHMgPSB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbih1cGRhdGUsIGhpcHBvZHJvbWUubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRIaXBwb2Ryb21lc0xheWVyLnVwZGF0ZShoaXBwb2Ryb21lLCBoaXBwb2Ryb21lLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhoaXBwb2Ryb21lOiBFZGl0YWJsZUhpcHBvZHJvbWUpIHtcbiAgICBoaXBwb2Ryb21lLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdEhpcHBvZHJvbWVzTGF5ZXIudXBkYXRlKGhpcHBvZHJvbWUsIGhpcHBvZHJvbWUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogSGlwcG9kcm9tZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuY3JlYXRlRWRpdGFibGVIaXBwb2Ryb21lKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRIaXBwb2Ryb21lc0xheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUuaGlwcG9kcm9tZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBoaXBwb2Ryb21lLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5tb3ZlVGVtcE1vdmluZ1BvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIGhpcHBvZHJvbWUuYWRkUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU1BPU0U6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoaGlwcG9kcm9tZSkge1xuICAgICAgICAgIGhpcHBvZHJvbWUuZGlzcG9zZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlRWRpdExhYmVscyhoaXBwb2Ryb21lKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdXBkYXRlLmxhYmVsc1JlbmRlckZuO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUhpcHBvZHJvbWUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdEhpcHBvZHJvbWVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5oaXBwb2Ryb21lT3B0aW9ucyxcbiAgICAgICAgICB1cGRhdGUucG9zaXRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVDoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lICYmIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGhpcHBvZHJvbWUubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lICYmIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGhpcHBvZHJvbWUuZW5kTW92ZVBvaW50KCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoaGlwcG9kcm9tZSkge1xuICAgICAgICAgIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoaGlwcG9kcm9tZSkge1xuICAgICAgICAgIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEU6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoaGlwcG9kcm9tZSAmJiBoaXBwb2Ryb21lLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBoaXBwb2Ryb21lLm1vdmVTaGFwZSh1cGRhdGUuZHJhZ2dlZFBvc2l0aW9uLCB1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lICYmIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGhpcHBvZHJvbWUuZW5kTW92ZVNoYXBlKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
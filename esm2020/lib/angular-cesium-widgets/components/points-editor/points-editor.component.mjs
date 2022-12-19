import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { PointsManagerService } from '../../services/entity-editors/points-editor/points-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/points-editor/points-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/points-editor/points-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i9 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i10 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
export class PointsEditorComponent {
    constructor(pointsEditor, coordinateConverter, mapEventsManager, cameraService, pointsManager, cesiumService) {
        this.pointsEditor = pointsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.pointsManager = pointsManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoint$ = new Subject();
        this.pointLabels$ = new Subject();
        this.pointsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, pointsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.pointsEditor.onUpdate().subscribe((update) => {
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
    renderEditLabels(point, update, labels) {
        if (labels) {
            point.labels = labels;
            this.pointLabelsLayer.update(point, point.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        update.position = point.getPosition();
        update.point = point.getCurrentPoint();
        point.labels = this.editLabelsRenderFn(update, point.labels);
        this.pointLabelsLayer.update(point, point.getId());
    }
    removeEditLabels(point) {
        point.labels = [];
        this.pointLabelsLayer.remove(point.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const point = this.pointsManager.get(update.id);
                if (point && point.getCurrentPoint()) {
                    this.removeEditLabels(point);
                }
                this.pointsManager.dispose(update.id);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const point = this.pointsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(point, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
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
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.DRAG_POINT: {
                const point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = false;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = true;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.pointsManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PointsEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsEditorComponent, deps: [{ token: i1.PointsEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.PointsManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PointsEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PointsEditorComponent, selector: "points-editor", providers: [CoordinateConverter, PointsManagerService], viewQueries: [{ propertyName: "editPointLayer", first: true, predicate: ["editPointLayer"], descendants: true }, { propertyName: "pointLabelsLayer", first: true, predicate: ["pointLabelsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPointLayer acFor="let point of editPoint$" [context]="this">
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
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #pointLabelsLayer acFor="let pointLabels of pointLabels$" [context]="this">
      <ac-array-desc acFor="let label of pointLabels.labels" [idGetter]="getLabelId">
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i9.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i10.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'points-editor',
                    template: /*html*/ `
    <ac-layer #editPointLayer acFor="let point of editPoint$" [context]="this">
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
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #pointLabelsLayer acFor="let pointLabels of pointLabels$" [context]="this">
      <ac-array-desc acFor="let label of pointLabels.labels" [idGetter]="getLabelId">
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
                    providers: [CoordinateConverter, PointsManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.PointsEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.PointsManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editPointLayer: [{
                type: ViewChild,
                args: ['editPointLayer']
            }], pointLabelsLayer: [{
                type: ViewChild,
                args: ['pointLabelsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy9wb2ludHMtZWRpdG9yL3BvaW50cy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUkvQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQzs7Ozs7Ozs7Ozs7O0FBMEQxRyxNQUFNLE9BQU8scUJBQXFCO0lBU2hDLFlBQ1UsWUFBaUMsRUFDakMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixhQUFtQyxFQUNuQyxhQUE0QjtRQUw1QixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDakMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWIvQixXQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2hCLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUMzQyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FB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SyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFnQjtRQUMzQixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWdCO1FBQzNCLE9BQU8sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRyxDQUFDOzttSEFoTFUscUJBQXFCO3VHQUFyQixxQkFBcUIsd0NBSHJCLENBQUMsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUMsbVBBaEQ1QyxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0NsQjs0RkFJVSxxQkFBcUI7a0JBckRqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStDbEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7b0JBQ3RELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs2UUFPc0MsY0FBYztzQkFBbEQsU0FBUzt1QkFBQyxnQkFBZ0I7Z0JBQ1ksZ0JBQWdCO3NCQUF0RCxTQUFTO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBQb2ludHNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9pbnRzLWVkaXRvci9wb2ludHMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2ludHMtZWRpdG9yL3BvaW50cy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRhYmxlUG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9pbnQnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BvaW50cy1lZGl0b3InLFxuICB0ZW1wbGF0ZTogLypodG1sKi8gYFxuICAgIDxhYy1sYXllciAjZWRpdFBvaW50TGF5ZXIgYWNGb3I9XCJsZXQgcG9pbnQgb2YgZWRpdFBvaW50JFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgID48L2FjLXBvaW50LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cblxuICAgIDxhYy1sYXllciAjcG9pbnRMYWJlbHNMYXllciBhY0Zvcj1cImxldCBwb2ludExhYmVscyBvZiBwb2ludExhYmVscyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiBwb2ludExhYmVscy5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIFBvaW50c01hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFBvaW50c0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBQb2ludEVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnQkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBwb2ludExhYmVscyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRMYXllcicpIHByaXZhdGUgZWRpdFBvaW50TGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3BvaW50TGFiZWxzTGF5ZXInKSBwcml2YXRlIHBvaW50TGFiZWxzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwb2ludHNFZGl0b3I6IFBvaW50c0VkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9pbnRzTWFuYWdlcjogUG9pbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLnBvaW50c0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHBvaW50c01hbmFnZXIsIHRoaXMuY2VzaXVtU2VydmljZSk7XG4gICAgdGhpcy5zdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpIHtcbiAgICB0aGlzLnBvaW50c0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBQb2ludEVkaXRVcGRhdGUpID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhwb2ludDogRWRpdGFibGVQb2ludCwgdXBkYXRlOiBQb2ludEVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIHBvaW50LmxhYmVscyA9IGxhYmVscztcbiAgICAgIHRoaXMucG9pbnRMYWJlbHNMYXllci51cGRhdGUocG9pbnQsIHBvaW50LmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cGRhdGUucG9zaXRpb24gPSBwb2ludC5nZXRQb3NpdGlvbigpO1xuICAgIHVwZGF0ZS5wb2ludCA9IHBvaW50LmdldEN1cnJlbnRQb2ludCgpO1xuICAgIHBvaW50LmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgcG9pbnQubGFiZWxzKTtcbiAgICB0aGlzLnBvaW50TGFiZWxzTGF5ZXIudXBkYXRlKHBvaW50LCBwb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMocG9pbnQ6IEVkaXRhYmxlUG9pbnQpIHtcbiAgICBwb2ludC5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLnBvaW50TGFiZWxzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IFBvaW50RWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvaW50c01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2ludChcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnBvaW50T3B0aW9ucyxcbiAgICAgICAgICB1cGRhdGUucG9zaXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvaW50LmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvaW50ICYmIHBvaW50LmdldEN1cnJlbnRQb2ludCgpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50c01hbmFnZXIuZGlzcG9zZSh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0s6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdXBkYXRlLmxhYmVsc1JlbmRlckZuO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFM6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvaW50LCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZTogUG9pbnRFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucG9pbnRzTWFuYWdlci5jcmVhdGVFZGl0YWJsZVBvaW50KFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludExheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUucG9pbnRPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbixcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2ludCAmJiBwb2ludC5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2ludCAmJiBwb2ludC5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvaW50KSB7XG4gICAgICAgICAgcG9pbnQuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9pbnQpIHtcbiAgICAgICAgICBwb2ludC5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnBvaW50c01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
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
        this.editorUpdatesSubscription = this.pointsEditor.onUpdate().subscribe((update) => {
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
        this.editorUpdatesSubscription.unsubscribe();
        this.pointsManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PointsEditorComponent, deps: [{ token: i1.PointsEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.PointsManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: PointsEditorComponent, selector: "points-editor", providers: [CoordinateConverter, PointsManagerService], viewQueries: [{ propertyName: "editPointLayer", first: true, predicate: ["editPointLayer"], descendants: true }, { propertyName: "pointLabelsLayer", first: true, predicate: ["pointLabelsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i9.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i10.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PointsEditorComponent, decorators: [{
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
        }], ctorParameters: () => [{ type: i1.PointsEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.PointsManagerService }, { type: i6.CesiumService }], propDecorators: { editPointLayer: [{
                type: ViewChild,
                args: ['editPointLayer']
            }], pointLabelsLayer: [{
                type: ViewChild,
                args: ['pointLabelsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy9wb2ludHMtZWRpdG9yL3BvaW50cy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFJN0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0VBQW9FLENBQUM7Ozs7Ozs7Ozs7OztBQTBEMUcsTUFBTSxPQUFPLHFCQUFxQjtJQVVoQyxZQUNVLFlBQWlDLEVBQ2pDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsYUFBbUMsRUFDbkMsYUFBNEI7UUFMNUIsaUJBQVksR0FBWixZQUFZLENBQXFCO1FBQ2pDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFDbkMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFiL0IsV0FBTSxHQUFHLE1BQU0sQ0FBQztRQUNoQixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7UUFDM0MsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztR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USxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStDbEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUM7b0JBQ3RELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDsyUEFRc0MsY0FBYztzQkFBbEQsU0FBUzt1QkFBQyxnQkFBZ0I7Z0JBQ1ksZ0JBQWdCO3NCQUF0RCxTQUFTO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IFBvaW50c0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2ludHMtZWRpdG9yL3BvaW50cy1lZGl0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvaW50cy1lZGl0b3IvcG9pbnRzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludEVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1wb2ludCc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncG9pbnRzLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgPGFjLWxheWVyICNlZGl0UG9pbnRMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnQkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLXBvaW50LWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXG4gICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KSxcbiAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBwb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIGhlaWdodFJlZmVyZW5jZTogcG9pbnQucHJvcHMuaGVpZ2h0UmVmZXJlbmNlLFxuICAgIH1cIlxuICAgICAgPjwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNwb2ludExhYmVsc0xheWVyIGFjRm9yPVwibGV0IHBvaW50TGFiZWxzIG9mIHBvaW50TGFiZWxzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIHBvaW50TGFiZWxzLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luLFxuICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBsYWJlbC5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgUG9pbnRzTWFuYWdlclNlcnZpY2VdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUG9pbnRzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IFBvaW50RWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHJpdmF0ZSBlZGl0b3JVcGRhdGVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnQkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBwb2ludExhYmVscyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRMYXllcicpIHByaXZhdGUgZWRpdFBvaW50TGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3BvaW50TGFiZWxzTGF5ZXInKSBwcml2YXRlIHBvaW50TGFiZWxzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwb2ludHNFZGl0b3I6IFBvaW50c0VkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9pbnRzTWFuYWdlcjogUG9pbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLnBvaW50c0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHBvaW50c01hbmFnZXIsIHRoaXMuY2VzaXVtU2VydmljZSk7XG4gICAgdGhpcy5zdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpIHtcbiAgICB0aGlzLmVkaXRvclVwZGF0ZXNTdWJzY3JpcHRpb24gPSB0aGlzLnBvaW50c0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBQb2ludEVkaXRVcGRhdGUpID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhwb2ludDogRWRpdGFibGVQb2ludCwgdXBkYXRlOiBQb2ludEVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIHBvaW50LmxhYmVscyA9IGxhYmVscztcbiAgICAgIHRoaXMucG9pbnRMYWJlbHNMYXllci51cGRhdGUocG9pbnQsIHBvaW50LmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cGRhdGUucG9zaXRpb24gPSBwb2ludC5nZXRQb3NpdGlvbigpO1xuICAgIHVwZGF0ZS5wb2ludCA9IHBvaW50LmdldEN1cnJlbnRQb2ludCgpO1xuICAgIHBvaW50LmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgcG9pbnQubGFiZWxzKTtcbiAgICB0aGlzLnBvaW50TGFiZWxzTGF5ZXIudXBkYXRlKHBvaW50LCBwb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMocG9pbnQ6IEVkaXRhYmxlUG9pbnQpIHtcbiAgICBwb2ludC5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLnBvaW50TGFiZWxzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IFBvaW50RWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvaW50c01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2ludChcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnBvaW50T3B0aW9ucyxcbiAgICAgICAgICB1cGRhdGUucG9zaXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvaW50LmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvaW50ICYmIHBvaW50LmdldEN1cnJlbnRQb2ludCgpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50c01hbmFnZXIuZGlzcG9zZSh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0s6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdXBkYXRlLmxhYmVsc1JlbmRlckZuO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFM6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvaW50LCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZTogUG9pbnRFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucG9pbnRzTWFuYWdlci5jcmVhdGVFZGl0YWJsZVBvaW50KFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludExheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUucG9pbnRPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbixcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2ludCAmJiBwb2ludC5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2ludCAmJiBwb2ludC5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9pbnQubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvaW50KSB7XG4gICAgICAgICAgcG9pbnQuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2ludCwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9pbnQpIHtcbiAgICAgICAgICBwb2ludC5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9pbnQsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmVkaXRvclVwZGF0ZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnBvaW50c01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
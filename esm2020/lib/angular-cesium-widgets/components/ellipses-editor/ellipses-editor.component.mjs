import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { EllipsesManagerService } from '../../services/entity-editors/ellipses-editor/ellipses-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/ellipses-editor/ellipses-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/ellipses-editor/ellipses-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-ellipse-desc/ac-ellipse-desc.component";
import * as i9 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i10 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
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
EllipsesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EllipsesEditorComponent, deps: [{ token: i1.EllipsesEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.EllipsesManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
EllipsesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: EllipsesEditorComponent, selector: "ellipses-editor", providers: [CoordinateConverter, EllipsesManagerService], viewQueries: [{ propertyName: "editEllipsesLayer", first: true, predicate: ["editEllipsesLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcEllipseDescComponent, selector: "ac-ellipse-desc" }, { kind: "component", type: i9.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i10.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i11.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EllipsesEditorComponent, decorators: [{
            type: Component,
            args: [{
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
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipsesEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.EllipsesManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editEllipsesLayer: [{
                type: ViewChild,
                args: ['editEllipsesLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQzs7Ozs7Ozs7Ozs7OztBQStFaEgsTUFBTSxPQUFPLHVCQUF1QjtJQVNsQyxZQUNVLGNBQXFDLEVBQ3JDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsZUFBdUMsRUFDdkMsYUFBNEI7UUFMNUIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBQ3JDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFiL0IsV0FBTSxHQUFHLE1BQU0sQ0FBQztRQUNoQixnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBQzVDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQWtC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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUVsQjs0RkFJVSx1QkFBdUI7a0JBekVuQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRWxCO29CQUNELFNBQVMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDO29CQUN4RCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7aVJBT3lDLGlCQUFpQjtzQkFBeEQsU0FBUzt1QkFBQyxtQkFBbUI7Z0JBQ1EsZUFBZTtzQkFBcEQsU0FBUzt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgRWxsaXBzZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLWVkaXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZUVsbGlwc2UgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtZWxsaXBzZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VsbGlwc2VzLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgICAgICA8YWMtcG9pbnQtZGVzY1xuICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgICAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBwb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogcG9pbnQucHJvcHMuaGVpZ2h0UmVmZXJlbmNlLFxuICAgIH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FjLXBvaW50LWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRFbGxpcHNlc0xheWVyIGFjRm9yPVwibGV0IGVsbGlwc2Ugb2YgZWRpdEVsbGlwc2VzJFwiIFtjb250ZXh0XT1cInRoaXNcIiBbekluZGV4XT1cIjBcIj5cbiAgICAgICAgICA8YWMtZWxsaXBzZS1kZXNjXG4gICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGVsbGlwc2UuZ2V0Q2VudGVyQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBzZW1pTWFqb3JBeGlzOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICBzZW1pTWlub3JBeGlzOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogZWxsaXBzZS5nZXRSb3RhdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm1hdGVyaWFsLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5vdXRsaW5lLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogZWxsaXBzZS5lbGxpcHNlUHJvcHMuZmlsbCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NpZmljYXRpb25UeXBlOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogZWxsaXBzZS5lbGxpcHNlUHJvcHMuekluZGV4LFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dzOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5zaGFkb3dzLFxuICAgIH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FjLWVsbGlwc2UtZGVzYz5cblxuICAgICAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIGVsbGlwc2UubGFiZWxzXCIgW2lkR2V0dGVyXT1cImdldExhYmVsSWRcIj5cbiAgICAgICAgICAgICAgPGFjLWxhYmVsLXByaW1pdGl2ZS1kZXNjXG4gICAgICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGFiZWwucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbHVjZW5jeUJ5RGlzdGFuY2U6IGxhYmVsLnRyYW5zbHVjZW5jeUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9yaWdpbjogbGFiZWwudmVydGljYWxPcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IGxhYmVsLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcbiAgICAgICAgfVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPC9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYz5cbiAgICAgICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuICBgLFxuICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyLCBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlLCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdO1xuICBwdWJsaWMgQ2VzaXVtID0gQ2VzaXVtO1xuICBwdWJsaWMgZWRpdFBvaW50cyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIGVkaXRFbGxpcHNlcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0RWxsaXBzZXNMYXllcicpIHByaXZhdGUgZWRpdEVsbGlwc2VzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxsaXBzZXNFZGl0b3I6IEVsbGlwc2VzRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLmVsbGlwc2VzRWRpdG9yLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyLCB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsIHRoaXMuY2FtZXJhU2VydmljZSwgdGhpcy5lbGxpcHNlc01hbmFnZXIsIHRoaXMuY2VzaXVtU2VydmljZSk7XG4gICAgdGhpcy5zdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpIHtcbiAgICB0aGlzLmVsbGlwc2VzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKHVwZGF0ZSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZTogRWRpdGFibGVFbGxpcHNlLCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUuY2VudGVyID0gZWxsaXBzZS5nZXRDZW50ZXIoKTtcbiAgICB1cGRhdGUubWFqb3JSYWRpdXMgPSBlbGxpcHNlLmdldE1ham9yUmFkaXVzKCk7XG4gICAgdXBkYXRlLm1pbm9yUmFkaXVzID0gZWxsaXBzZS5nZXRNaW5vclJhZGl1cygpO1xuICAgIHVwZGF0ZS5yb3RhdGlvbiA9IGVsbGlwc2UuZ2V0Um90YXRpb24oKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIGVsbGlwc2UubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0RWxsaXBzZXNMYXllci51cGRhdGUoZWxsaXBzZSwgZWxsaXBzZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZWxsaXBzZS5sYWJlbHMgPSB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbih1cGRhdGUsIGVsbGlwc2UubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLnVwZGF0ZShlbGxpcHNlLCBlbGxpcHNlLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhlbGxpcHNlOiBFZGl0YWJsZUVsbGlwc2UpIHtcbiAgICBlbGxpcHNlLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIudXBkYXRlKGVsbGlwc2UsIGVsbGlwc2UuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5lbGxpcHNlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVFbGxpcHNlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUuZWxsaXBzZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBlbGxpcHNlLm1vdmVQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uLCBlbGxpcHNlLm1ham9yUmFkaXVzUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLmNlbnRlcikge1xuICAgICAgICAgIGVsbGlwc2UuYWRkUG9pbnQodXBkYXRlLmNlbnRlcik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBlbGxpcHNlLmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChlbGxpcHNlKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKGVsbGlwc2UpO1xuICAgICAgICAgIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmRpc3Bvc2UodXBkYXRlLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdXBkYXRlLmxhYmVsc1JlbmRlckZuO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVFbGxpcHNlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUuZWxsaXBzZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGVsbGlwc2Uuc2V0TWFudWFsbHkoXG4gICAgICAgICAgdXBkYXRlLmNlbnRlcixcbiAgICAgICAgICB1cGRhdGUubWFqb3JSYWRpdXMsXG4gICAgICAgICAgdXBkYXRlLnJvdGF0aW9uLFxuICAgICAgICAgIHVwZGF0ZS5taW5vclJhZGl1cyxcbiAgICAgICAgICAodXBkYXRlLmVsbGlwc2VPcHRpb25zICYmIHVwZGF0ZS5lbGxpcHNlT3B0aW9ucy5wb2ludFByb3BzKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgKHVwZGF0ZS5lbGxpcHNlT3B0aW9ucyAmJiB1cGRhdGUuZWxsaXBzZU9wdGlvbnMucG9pbnRQcm9wcykgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLmVsbGlwc2VQcm9wcykgfHwgdW5kZWZpbmVkLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOlxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UgJiYgZWxsaXBzZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgZWxsaXBzZS5tb3ZlUG9pbnQodXBkYXRlLmVuZERyYWdQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEU6IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLm1vdmVFbGxpcHNlKHVwZGF0ZS5zdGFydERyYWdQb3NpdGlvbiwgdXBkYXRlLmVuZERyYWdQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UgJiYgZWxsaXBzZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgZWxsaXBzZS5lbmRNb3ZlRWxsaXBzZSgpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5UUkFOU0ZPUk06IHtcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoZWxsaXBzZSAmJiBlbGxpcHNlLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBlbGxpcHNlLnRyYW5zZm9ybVRvRWxsaXBzZSgpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNBQkxFOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UpIHtcbiAgICAgICAgICBlbGxpcHNlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGVsbGlwc2UpIHtcbiAgICAgICAgICBlbGxpcHNlLmVuYWJsZUVkaXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhlbGxpcHNlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5lbGxpcHNlc01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
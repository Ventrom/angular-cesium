import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { PolylinesManagerService } from '../../services/entity-editors/polyline-editor/polylines-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/polyline-editor/polylines-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/polyline-editor/polylines-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-polyline-desc/ac-polyline-desc.component";
import * as i9 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i10 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
export class PolylinesEditorComponent {
    constructor(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager, cesiumService) {
        this.polylinesEditor = polylinesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.polylineLabels$ = new Subject();
        this.polylinesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polylinesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.polylinesEditor.onUpdate().subscribe((update) => {
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
    renderEditLabels(polyline, update, labels) {
        update.positions = polyline.getRealPositions();
        update.points = polyline.getRealPoints();
        if (labels) {
            polyline.labels = labels;
            this.polylineLabelsLayer.update(polyline, polyline.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polyline.labels = this.editLabelsRenderFn(update, polyline.labels);
        this.polylineLabelsLayer.update(polyline, polyline.getId());
    }
    removeEditLabels(polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.dispose();
                    this.removeEditLabels(polyline);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
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
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polyline, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.endMoveShape();
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.polylinesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolylinesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolylinesEditorComponent, deps: [{ token: i1.PolylinesEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.PolylinesManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PolylinesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PolylinesEditorComponent, selector: "polylines-editor", providers: [CoordinateConverter, PolylinesManagerService], viewQueries: [{ propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editPolylinesLayer", first: true, predicate: ["editPolylinesLayer"], descendants: true }, { propertyName: "polylineLabelsLayer", first: true, predicate: ["polylineLabelsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
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
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #polylineLabelsLayer acFor="let polylineLabels of polylineLabels$" [context]="this">
      <ac-array-desc acFor="let label of polylineLabels.labels" [idGetter]="getLabelId">
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcPolylineDescComponent, selector: "ac-polyline-desc" }, { kind: "component", type: i9.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i10.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i11.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolylinesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'polylines-editor',
                    template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
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
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #polylineLabelsLayer acFor="let polylineLabels of polylineLabels$" [context]="this">
      <ac-array-desc acFor="let label of polylineLabels.labels" [idGetter]="getLabelId">
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
                    providers: [CoordinateConverter, PolylinesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.PolylinesEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.PolylinesManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editPolylinesLayer: [{
                type: ViewChild,
                args: ['editPolylinesLayer']
            }], polylineLabelsLayer: [{
                type: ViewChild,
                args: ['polylineLabelsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy9wb2x5bGluZXMtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUkvQixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQXdFbEgsTUFBTSxPQUFPLHdCQUF3QjtJQVduQyxZQUNVLGVBQXVDLEVBQ3ZDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsZ0JBQXlDLEVBQ3pDLGFBQTRCO1FBTDVCLG9CQUFlLEdBQWYsZUFBZSxDQUF3QjtRQUN2Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWYvQixXQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7UUFDNUMsbUJBQWMsR0FBRyxJQUFJLE9B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QVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZEbEI7NEZBSVUsd0JBQXdCO2tCQW5FcEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixRQUFRLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkRsQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSx1QkFBdUIsQ0FBQztvQkFDekQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEO21SQVF1QyxlQUFlO3NCQUFwRCxTQUFTO3VCQUFDLGlCQUFpQjtnQkFDYSxrQkFBa0I7c0JBQTFELFNBQVM7dUJBQUMsb0JBQW9CO2dCQUNXLG1CQUFtQjtzQkFBNUQsU0FBUzt1QkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgUG9seWxpbmVzRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2x5bGluZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1wb2x5bGluZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncG9seWxpbmVzLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgPGFjLWxheWVyICNlZGl0UG9seWxpbmVzTGF5ZXIgYWNGb3I9XCJsZXQgcG9seWxpbmUgb2YgZWRpdFBvbHlsaW5lcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9seWxpbmUtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgcG9zaXRpb25zOiBwb2x5bGluZS5nZXRQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHdpZHRoOiBwb2x5bGluZS5wcm9wcy53aWR0aCxcbiAgICAgICAgbWF0ZXJpYWw6IHBvbHlsaW5lLnByb3BzLm1hdGVyaWFsKCksXG4gICAgICAgIGNsYW1wVG9Hcm91bmQ6IHBvbHlsaW5lLnByb3BzLmNsYW1wVG9Hcm91bmQsXG4gICAgICAgIHpJbmRleDogcG9seWxpbmUucHJvcHMuekluZGV4LFxuICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IHBvbHlsaW5lLnByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2x5bGluZS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG5cbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgID48L2FjLXBvaW50LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cblxuICAgIDxhYy1sYXllciAjcG9seWxpbmVMYWJlbHNMYXllciBhY0Zvcj1cImxldCBwb2x5bGluZUxhYmVscyBvZiBwb2x5bGluZUxhYmVscyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiBwb2x5bGluZUxhYmVscy5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBQb2x5bGluZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdFBvbHlsaW5lcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIHBvbHlsaW5lTGFiZWxzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0UG9seWxpbmVzTGF5ZXInKSBwcml2YXRlIGVkaXRQb2x5bGluZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgncG9seWxpbmVMYWJlbHNMYXllcicpIHByaXZhdGUgcG9seWxpbmVMYWJlbHNMYXllcjogQWNMYXllckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBvbHlsaW5lc0VkaXRvcjogUG9seWxpbmVzRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5bGluZXNNYW5hZ2VyOiBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMucG9seWxpbmVzRWRpdG9yLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyLCB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsIHRoaXMuY2FtZXJhU2VydmljZSwgcG9seWxpbmVzTWFuYWdlciwgdGhpcy5jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMucG9seWxpbmVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKCh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSkgPT4ge1xuICAgICAgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURSB8fCB1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYWJlbElkKGVsZW1lbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKCk7XG4gIH1cblxuICByZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lOiBFZGl0YWJsZVBvbHlsaW5lLCB1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzPzogTGFiZWxQcm9wc1tdKSB7XG4gICAgdXBkYXRlLnBvc2l0aW9ucyA9IHBvbHlsaW5lLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB1cGRhdGUucG9pbnRzID0gcG9seWxpbmUuZ2V0UmVhbFBvaW50cygpO1xuXG4gICAgaWYgKGxhYmVscykge1xuICAgICAgcG9seWxpbmUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5wb2x5bGluZUxhYmVsc0xheWVyLnVwZGF0ZShwb2x5bGluZSwgcG9seWxpbmUuZ2V0SWQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvbHlsaW5lLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgcG9seWxpbmUubGFiZWxzKTtcbiAgICB0aGlzLnBvbHlsaW5lTGFiZWxzTGF5ZXIudXBkYXRlKHBvbHlsaW5lLCBwb2x5bGluZS5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMocG9seWxpbmU6IEVkaXRhYmxlUG9seWxpbmUpIHtcbiAgICBwb2x5bGluZS5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLnBvbHlsaW5lTGFiZWxzTGF5ZXIucmVtb3ZlKHBvbHlsaW5lLmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvbHlsaW5lc01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2x5bGluZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5wb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvbHlsaW5lLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVRlbXBNb3ZpbmdQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICBwb2x5bGluZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvbHlsaW5lLmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU1BPU0U6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSkge1xuICAgICAgICAgIHBvbHlsaW5lLmRpc3Bvc2UoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMocG9seWxpbmUpO1xuICAgICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvbHlsaW5lc01hbmFnZXIuY3JlYXRlRWRpdGFibGVQb2x5bGluZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5wb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICAgdXBkYXRlLnBvc2l0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVBvaW50RmluaXNoKHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuXG4gICAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgICAgIHBvbHlsaW5lLmNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlsaW5lLCB1cGRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuUkVNT1ZFX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWxpbmUgJiYgcG9seWxpbmUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlsaW5lLnJlbW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlsaW5lKSB7XG4gICAgICAgICAgcG9seWxpbmUuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWxpbmUpIHtcbiAgICAgICAgICBwb2x5bGluZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEU6IHtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5bGluZSAmJiBwb2x5bGluZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWxpbmUubW92ZVNoYXBlKHVwZGF0ZS5kcmFnZ2VkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5bGluZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlsaW5lICYmIHBvbHlsaW5lLmVuYWJsZUVkaXQpIHtcbiAgICAgICAgICBwb2x5bGluZS5lbmRNb3ZlU2hhcGUoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWxpbmUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnBvbHlsaW5lc01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
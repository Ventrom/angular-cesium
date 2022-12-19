import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { PolygonsManagerService } from '../../services/entity-editors/polygons-editor/polygons-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/polygons-editor/polygons-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/polygons-editor/polygons-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-polyline-desc/ac-polyline-desc.component";
import * as i9 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i10 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-polygon-desc/ac-polygon-desc.component";
import * as i12 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
export class PolygonsEditorComponent {
    constructor(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager, cesiumService) {
        this.polygonsEditor = polygonsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.editPolygons$ = new Subject();
        this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.polygonsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.polygonsEditor.onUpdate().subscribe((update) => {
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
    renderEditLabels(polygon, update, labels) {
        update.positions = polygon.getRealPositions();
        update.points = polygon.getRealPoints();
        if (labels) {
            polygon.labels = labels;
            this.editPolygonsLayer.update(polygon, polygon.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polygon.labels = this.editLabelsRenderFn(update, polygon.labels);
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    removeEditLabels(polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.dispose();
                    this.removeEditLabels(polygon);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
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
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polygon, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = true;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.polygonsManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolygonsEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolygonsEditorComponent, deps: [{ token: i1.PolygonsEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.PolygonsManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PolygonsEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PolygonsEditorComponent, selector: "polygons-editor", providers: [CoordinateConverter, PolygonsManagerService], viewQueries: [{ propertyName: "editPolygonsLayer", first: true, predicate: ["editPolygonsLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editPolylinesLayer", first: true, predicate: ["editPolylinesLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
          hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
          material: polygon.polygonProps.material,
          fill: polygon.polygonProps.fill,
          classificationType: polygon.polygonProps.classificationType,
          zIndex: polygon.polygonProps.zIndex,
        }"
      >
      </ac-polygon-desc>
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcPolylineDescComponent, selector: "ac-polyline-desc" }, { kind: "component", type: i9.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i10.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i11.AcPolygonDescComponent, selector: "ac-polygon-desc" }, { kind: "component", type: i12.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolygonsEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'polygons-editor',
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
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
          hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
          material: polygon.polygonProps.material,
          fill: polygon.polygonProps.fill,
          classificationType: polygon.polygonProps.classificationType,
          zIndex: polygon.polygonProps.zIndex,
        }"
      >
      </ac-polygon-desc>
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
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
                    providers: [CoordinateConverter, PolygonsManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.PolygonsEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.PolygonsManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editPolygonsLayer: [{
                type: ViewChild,
                args: ['editPolygonsLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editPolylinesLayer: [{
                type: ViewChild,
                args: ['editPolylinesLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFtRmhILE1BQU0sT0FBTyx1QkFBdUI7SUFXbEMsWUFDVSxjQUFxQyxFQUNyQyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGVBQXVDLEVBQ3ZDLGFBQTRCO1FBTDVCLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUNyQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsb0JBQWUsR0FBZixlQUFlLENBQXdCO1FBQ3ZDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBZi9CLFdBQU0sR0FBRyxNQUFNLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUM1QyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFr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LHNCQUFzQixDQUFDLGtXQXpFOUMsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3RWxCOzRGQUlVLHVCQUF1QjtrQkE5RW5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0VsQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQztvQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEO2lSQVF5QyxpQkFBaUI7c0JBQXhELFNBQVM7dUJBQUMsbUJBQW1CO2dCQUNRLGVBQWU7c0JBQXBELFNBQVM7dUJBQUMsaUJBQWlCO2dCQUNhLGtCQUFrQjtzQkFBMUQsU0FBUzt1QkFBQyxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBQb2x5Z29uc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWdvbnMtZWRpdG9yL3BvbHlnb25zLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZVBvbHlnb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9seWdvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BvbHlnb25zLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgPGFjLWxheWVyICNlZGl0UG9seWxpbmVzTGF5ZXIgYWNGb3I9XCJsZXQgcG9seWxpbmUgb2YgZWRpdFBvbHlsaW5lcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9seWxpbmUtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgcG9zaXRpb25zOiBwb2x5bGluZS5nZXRQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHdpZHRoOiBwb2x5bGluZS5wcm9wcy53aWR0aCxcbiAgICAgICAgbWF0ZXJpYWw6IHBvbHlsaW5lLnByb3BzLm1hdGVyaWFsKCksXG4gICAgICAgIGNsYW1wVG9Hcm91bmQ6IHBvbHlsaW5lLnByb3BzLmNsYW1wVG9Hcm91bmQsXG4gICAgICAgIHpJbmRleDogcG9seWxpbmUucHJvcHMuekluZGV4LFxuICAgICAgICBjbGFzc2lmaWNhdGlvblR5cGU6IHBvbHlsaW5lLnByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2x5bGluZS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG5cbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcbiAgICAgICAgY29sb3I6IHBvaW50LnByb3BzLmNvbG9yLFxuICAgICAgICBvdXRsaW5lQ29sb3I6IHBvaW50LnByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXG4gICAgICAgIHNob3c6IGdldFBvaW50U2hvdyhwb2ludCksXG4gICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogcG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcbiAgICB9XCJcbiAgICAgID5cbiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAgICA8L2FjLWxheWVyPlxuXG4gICAgPGFjLWxheWVyICNlZGl0UG9seWdvbnNMYXllciBhY0Zvcj1cImxldCBwb2x5Z29uIG9mIGVkaXRQb2x5Z29ucyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtcG9seWdvbi1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICAgIGhpZXJhcmNoeTogcG9seWdvbi5nZXRQb3NpdGlvbnNIaWVyYXJjaHlDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgbWF0ZXJpYWw6IHBvbHlnb24ucG9seWdvblByb3BzLm1hdGVyaWFsLFxuICAgICAgICAgIGZpbGw6IHBvbHlnb24ucG9seWdvblByb3BzLmZpbGwsXG4gICAgICAgICAgY2xhc3NpZmljYXRpb25UeXBlOiBwb2x5Z29uLnBvbHlnb25Qcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXG4gICAgICAgICAgekluZGV4OiBwb2x5Z29uLnBvbHlnb25Qcm9wcy56SW5kZXgsXG4gICAgICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2x5Z29uLWRlc2M+XG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiBwb2x5Z29uLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luLFxuICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBsYWJlbC5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgUG9seWdvbnNNYW5hZ2VyU2VydmljZV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBQb2x5Z29uc0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgZWRpdExhYmVsc1JlbmRlckZuOiAodXBkYXRlOiBQb2x5Z29uRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHVibGljIENlc2l1bSA9IENlc2l1bTtcbiAgcHVibGljIGVkaXRQb2ludHMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0UG9seWxpbmVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdFBvbHlnb25zJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2x5Z29uc0xheWVyJykgcHJpdmF0ZSBlZGl0UG9seWdvbnNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2x5bGluZXNMYXllcicpIHByaXZhdGUgZWRpdFBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcG9seWdvbnNFZGl0b3I6IFBvbHlnb25zRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5Z29uc01hbmFnZXI6IFBvbHlnb25zTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlXG4gICkge1xuICAgIHRoaXMucG9seWdvbnNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCB0aGlzLnBvbHlnb25zTWFuYWdlciwgdGhpcy5jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xuICAgIHRoaXMucG9seWdvbnNFZGl0b3Iub25VcGRhdGUoKS5zdWJzY3JpYmUoKHVwZGF0ZTogUG9seWdvbkVkaXRVcGRhdGUpID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhwb2x5Z29uOiBFZGl0YWJsZVBvbHlnb24sIHVwZGF0ZTogUG9seWdvbkVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIHVwZGF0ZS5wb3NpdGlvbnMgPSBwb2x5Z29uLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB1cGRhdGUucG9pbnRzID0gcG9seWdvbi5nZXRSZWFsUG9pbnRzKCk7XG5cbiAgICBpZiAobGFiZWxzKSB7XG4gICAgICBwb2x5Z29uLmxhYmVscyA9IGxhYmVscztcbiAgICAgIHRoaXMuZWRpdFBvbHlnb25zTGF5ZXIudXBkYXRlKHBvbHlnb24sIHBvbHlnb24uZ2V0SWQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvbHlnb24ubGFiZWxzID0gdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4odXBkYXRlLCBwb2x5Z29uLmxhYmVscyk7XG4gICAgdGhpcy5lZGl0UG9seWdvbnNMYXllci51cGRhdGUocG9seWdvbiwgcG9seWdvbi5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMocG9seWdvbjogRWRpdGFibGVQb2x5Z29uKSB7XG4gICAgcG9seWdvbi5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLmVkaXRQb2x5Z29uc0xheWVyLnVwZGF0ZShwb2x5Z29uLCBwb2x5Z29uLmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IFBvbHlnb25FZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucG9seWdvbnNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlUG9seWdvbihcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWdvbnNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2x5bGluZXNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnBvbHlnb25PcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuTU9VU0VfTU9WRToge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9seWdvbi5tb3ZlVGVtcE1vdmluZ1BvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xuICAgICAgICAgIHBvbHlnb24ubW92ZVRlbXBNb3ZpbmdQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICBwb2x5Z29uLmFkZFBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcG9seWdvbi5hZGRMYXN0UG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU1BPU0U6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWdvbikge1xuICAgICAgICAgIHBvbHlnb24uZGlzcG9zZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlRWRpdExhYmVscyhwb2x5Z29uKTtcbiAgICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdXBkYXRlLmxhYmVsc1JlbmRlckZuO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBQb2x5Z29uRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLnBvbHlnb25zTWFuYWdlci5jcmVhdGVFZGl0YWJsZVBvbHlnb24oXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdFBvbHlnb25zTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgIHVwZGF0ZS5wb2x5Z29uT3B0aW9ucyxcbiAgICAgICAgICB1cGRhdGUucG9zaXRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uICYmIHBvbHlnb24uZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlnb24ubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uICYmIHBvbHlnb24uZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlnb24ubW92ZVBvaW50RmluaXNoKHVwZGF0ZS51cGRhdGVkUG9pbnQpO1xuXG4gICAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgICAgIHBvbHlnb24uY2hhbmdlVmlydHVhbFBvaW50VG9SZWFsUG9pbnQodXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlJFTU9WRV9QT0lOVDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uICYmIHBvbHlnb24uZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlnb24ucmVtb3ZlUG9pbnQodXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHBvbHlnb24sIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU0FCTEU6IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocG9seWdvbikge1xuICAgICAgICAgIHBvbHlnb24uZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlnb24gJiYgcG9seWdvbi5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcG9seWdvbi5tb3ZlUG9seWdvbih1cGRhdGUuZHJhZ2dlZFBvc2l0aW9uLCB1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChwb2x5Z29uICYmIHBvbHlnb24uZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHBvbHlnb24uZW5kTW92ZVBvbHlnb24oKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocG9seWdvbiwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRU5BQkxFOiB7XG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHBvbHlnb24pIHtcbiAgICAgICAgICBwb2x5Z29uLmVuYWJsZUVkaXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhwb2x5Z29uLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5wb2x5Z29uc01hbmFnZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGdldFBvaW50U2l6ZShwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMudmlydHVhbFBvaW50UGl4ZWxTaXplIDogcG9pbnQucHJvcHMucGl4ZWxTaXplO1xuICB9XG5cbiAgZ2V0UG9pbnRTaG93KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xuICB9XG59XG4iXX0=
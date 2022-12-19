import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { RectanglesManagerService } from '../../services/entity-editors/rectangles-editor/rectangles-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/rectangles-editor/rectangles-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/rectangles-editor/rectangles-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i9 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i10 from "../../../angular-cesium/components/ac-rectangle-desc/ac-rectangle-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
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
RectanglesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RectanglesEditorComponent, deps: [{ token: i1.RectanglesEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.RectanglesManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
RectanglesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: RectanglesEditorComponent, selector: "rectangles-editor", providers: [CoordinateConverter, RectanglesManagerService], viewQueries: [{ propertyName: "editRectanglesLayer", first: true, predicate: ["editRectanglesLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i7.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i8.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i9.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i10.AcRectangleDescComponent, selector: "ac-rectangle-desc" }, { kind: "component", type: i11.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RectanglesEditorComponent, decorators: [{
            type: Component,
            args: [{
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
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.RectanglesEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.RectanglesManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editRectanglesLayer: [{
                type: ViewChild,
                args: ['editRectanglesLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQXlFdEgsTUFBTSxPQUFPLHlCQUF5QjtJQVNwQyxZQUNVLGdCQUF5QyxFQUN6QyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGlCQUEyQyxFQUMzQyxhQUE0QjtRQUw1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQTBCO1FBQzNDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBYi9CLFdBQU0sR0FBRyxNQUFNLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUM1QyxvQkFBZSxHQUFH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cnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uL21vZGVscy9yZWN0YW5nbGUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcmVjdGFuZ2xlcy1lZGl0b3IvcmVjdGFuZ2xlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9yZWN0YW5nbGVzLWVkaXRvci9yZWN0YW5nbGVzLWVkaXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgRWRpdGFibGVSZWN0YW5nbGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdGFibGUtcmVjdGFuZ2xlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncmVjdGFuZ2xlcy1lZGl0b3InLFxuICB0ZW1wbGF0ZTogLypodG1sKi8gYFxuICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLXBvaW50LWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXG4gICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KSxcbiAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBwb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIGhlaWdodFJlZmVyZW5jZTogcG9pbnQucHJvcHMuaGVpZ2h0UmVmZXJlbmNlLFxuICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2ludC1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG5cbiAgICA8YWMtbGF5ZXIgI2VkaXRSZWN0YW5nbGVzTGF5ZXIgYWNGb3I9XCJsZXQgcmVjdGFuZ2xlIG9mIGVkaXRSZWN0YW5nbGVzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1yZWN0YW5nbGUtZGVzY1xuICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICBjb29yZGluYXRlczogcmVjdGFuZ2xlLmdldFJlY3RhbmdsZUNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICBtYXRlcmlhbDogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLm1hdGVyaWFsLFxuICAgICAgICAgIGZpbGw6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy5maWxsLFxuICAgICAgICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLmNsYXNzaWZpY2F0aW9uVHlwZSxcbiAgICAgICAgICB6SW5kZXg6IHJlY3RhbmdsZS5yZWN0YW5nbGVQcm9wcy56SW5kZXgsXG4gICAgICAgICAgb3V0bGluZTogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLm91dGxpbmUsXG4gICAgICAgICAgb3V0bGluZUNvbG9yOiByZWN0YW5nbGUucmVjdGFuZ2xlUHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICAgIGhlaWdodDogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLmhlaWdodCxcbiAgICAgICAgICBleHRydWRlZEhlaWdodDogcmVjdGFuZ2xlLnJlY3RhbmdsZVByb3BzLmV4dHJ1ZGVkSGVpZ2h0XG4gICAgICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1yZWN0YW5nbGUtZGVzYz5cbiAgICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGxhYmVsIG9mIHJlY3RhbmdsZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxuICAgICAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2NcbiAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbGFiZWwuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgYmFja2dyb3VuZFBhZGRpbmc6IGxhYmVsLmJhY2tncm91bmRQYWRkaW5nLFxuICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXG4gICAgICAgICAgICBleWVPZmZzZXQ6IGxhYmVsLmV5ZU9mZnNldCxcbiAgICAgICAgICAgIGZpbGxDb2xvcjogbGFiZWwuZmlsbENvbG9yLFxuICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcbiAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogbGFiZWwuaGVpZ2h0UmVmZXJlbmNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbE9yaWdpbjogbGFiZWwuaG9yaXpvbnRhbE9yaWdpbixcbiAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBsYWJlbC5vdXRsaW5lV2lkdGgsXG4gICAgICAgICAgICBwaXhlbE9mZnNldDogbGFiZWwucGl4ZWxPZmZzZXQsXG4gICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXG4gICAgICAgICAgICBzY2FsZTogbGFiZWwuc2NhbGUsXG4gICAgICAgICAgICBzY2FsZUJ5RGlzdGFuY2U6IGxhYmVsLnNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXG4gICAgICAgICAgICBzaG93QmFja2dyb3VuZDogbGFiZWwuc2hvd0JhY2tncm91bmQsXG4gICAgICAgICAgICBzdHlsZTogbGFiZWwuc3R5bGUsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbC50ZXh0LFxuICAgICAgICAgICAgdHJhbnNsdWNlbmN5QnlEaXN0YW5jZTogbGFiZWwudHJhbnNsdWNlbmN5QnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHZlcnRpY2FsT3JpZ2luOiBsYWJlbC52ZXJ0aWNhbE9yaWdpbixcbiAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxuICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxuICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXIsIFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVzRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IFJlY3RhbmdsZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdFJlY3RhbmdsZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgQFZpZXdDaGlsZCgnZWRpdFJlY3RhbmdsZXNMYXllcicpIHByaXZhdGUgZWRpdFJlY3RhbmdsZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWRpdFBvaW50c0xheWVyJykgcHJpdmF0ZSBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWN0YW5nbGVzRWRpdG9yOiBSZWN0YW5nbGVzRWRpdG9yU2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWN0YW5nbGVzTWFuYWdlcjogUmVjdGFuZ2xlc01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZVxuICApIHtcbiAgICB0aGlzLnJlY3RhbmdsZXNFZGl0b3IuaW5pdChcbiAgICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlcixcbiAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgIHRoaXMuY2FtZXJhU2VydmljZSxcbiAgICAgIHRoaXMucmVjdGFuZ2xlc01hbmFnZXIsXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2VcbiAgICApO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5yZWN0YW5nbGVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKCh1cGRhdGU6IFJlY3RhbmdsZUVkaXRVcGRhdGUpID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGU6IEVkaXRhYmxlUmVjdGFuZ2xlLCB1cGRhdGU6IFJlY3RhbmdsZUVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIHVwZGF0ZS5wb3NpdGlvbnMgPSByZWN0YW5nbGUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHVwZGF0ZS5wb2ludHMgPSByZWN0YW5nbGUuZ2V0UmVhbFBvaW50cygpO1xuXG4gICAgaWYgKGxhYmVscykge1xuICAgICAgcmVjdGFuZ2xlLmxhYmVscyA9IGxhYmVscztcbiAgICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllci51cGRhdGUocmVjdGFuZ2xlLCByZWN0YW5nbGUuZ2V0SWQoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlY3RhbmdsZS5sYWJlbHMgPSB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbih1cGRhdGUsIHJlY3RhbmdsZS5sYWJlbHMpO1xuICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllci51cGRhdGUocmVjdGFuZ2xlLCByZWN0YW5nbGUuZ2V0SWQoKSk7XG4gIH1cblxuICByZW1vdmVFZGl0TGFiZWxzKHJlY3RhbmdsZTogRWRpdGFibGVSZWN0YW5nbGUpIHtcbiAgICByZWN0YW5nbGUubGFiZWxzID0gW107XG4gICAgdGhpcy5lZGl0UmVjdGFuZ2xlc0xheWVyLnVwZGF0ZShyZWN0YW5nbGUsIHJlY3RhbmdsZS5nZXRJZCgpKTtcbiAgfVxuXG4gIGhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVSZWN0YW5nbGUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnJlY3RhbmdsZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgcmVjdGFuZ2xlLmFkZFBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmFkZExhc3RQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUpIHtcbiAgICAgICAgICByZWN0YW5nbGUuZGlzcG9zZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlRWRpdExhYmVscyhyZWN0YW5nbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWRpdExhYmVsc1JlbmRlckZuID0gdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBSZWN0YW5nbGVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVSZWN0YW5nbGUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdFJlY3RhbmdsZXNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLnJlY3RhbmdsZU9wdGlvbnMsXG4gICAgICAgICAgdXBkYXRlLnBvc2l0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSAmJiByZWN0YW5nbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHJlY3RhbmdsZS5tb3ZlUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSAmJiByZWN0YW5nbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHJlY3RhbmdsZS5lbmRNb3ZlUG9pbnQoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMocmVjdGFuZ2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNBQkxFOiB7XG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChyZWN0YW5nbGUpIHtcbiAgICAgICAgICByZWN0YW5nbGUuZW5hYmxlRWRpdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkVOQUJMRToge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlKSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmVuYWJsZUVkaXQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEU6IHtcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHJlY3RhbmdsZSAmJiByZWN0YW5nbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIHJlY3RhbmdsZS5tb3ZlU2hhcGUodXBkYXRlLmRyYWdnZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKHJlY3RhbmdsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAocmVjdGFuZ2xlICYmIHJlY3RhbmdsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgcmVjdGFuZ2xlLmVuZE1vdmVTaGFwZSgpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhyZWN0YW5nbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmNsZWFyKCk7XG4gIH1cblxuICBnZXRQb2ludFNpemUocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcbiAgfVxuXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LnNob3cgJiYgKHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMuc2hvd1ZpcnR1YWwgOiBwb2ludC5wcm9wcy5zaG93KTtcbiAgfVxufVxuXG4iXX0=
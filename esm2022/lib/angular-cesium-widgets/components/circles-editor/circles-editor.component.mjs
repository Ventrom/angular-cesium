import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { CirclesManagerService } from '../../services/entity-editors/circles-editor/circles-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/circles-editor/circles-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/circles-editor/circles-manager.service";
import * as i6 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
import * as i7 from "../../../angular-cesium/components/ac-ellipse-desc/ac-ellipse-desc.component";
import * as i8 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i9 from "../../../angular-cesium/components/ac-arc-desc/ac-arc-desc.component";
import * as i10 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
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
        this.editorUpdatesSubscription = this.circlesEditor.onUpdate().subscribe(update => {
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
        this.editorUpdatesSubscription.unsubscribe();
        this.circlesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CirclesEditorComponent, deps: [{ token: i1.CirclesEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.CirclesManagerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: CirclesEditorComponent, selector: "circles-editor", providers: [CoordinateConverter, CirclesManagerService], viewQueries: [{ propertyName: "editCirclesLayer", first: true, predicate: ["editCirclesLayer"], descendants: true }, { propertyName: "editArcsLayer", first: true, predicate: ["editArcsLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i6.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { kind: "component", type: i7.AcEllipseDescComponent, selector: "ac-ellipse-desc" }, { kind: "component", type: i8.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { kind: "component", type: i9.AcArcDescComponent, selector: "ac-arc-desc" }, { kind: "component", type: i10.AcPointDescComponent, selector: "ac-point-desc" }, { kind: "component", type: i11.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CirclesEditorComponent, decorators: [{
            type: Component,
            args: [{
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
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: () => [{ type: i1.CirclesEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.CirclesManagerService }], propDecorators: { editCirclesLayer: [{
                type: ViewChild,
                args: ['editCirclesLayer']
            }], editArcsLayer: [{
                type: ViewChild,
                args: ['editArcsLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFHN0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0VBQXNFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUE0RjdHLE1BQU0sT0FBTyxzQkFBc0I7SUFZakMsWUFDVSxhQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGNBQXFDO1FBSnJDLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBZHhDLFdBQU0sR0FBRyxNQUFNLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUM1QyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBQzdDLGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FB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QUMsTUFBTTtpQkFDaEQ7aU9BU3dDLGdCQUFnQjtzQkFBdEQsU0FBUzt1QkFBQyxrQkFBa0I7Z0JBQ08sYUFBYTtzQkFBaEQsU0FBUzt1QkFBQyxlQUFlO2dCQUNZLGVBQWU7c0JBQXBELFNBQVM7dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENpcmNsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENpcmNsZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NpcmNsZXMtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IC8qaHRtbCovIGBcbiAgICAgIDxhYy1sYXllciAjZWRpdEFyY3NMYXllciBhY0Zvcj1cImxldCBhcmMgb2YgZWRpdEFyY3MkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgICAgIDxhYy1hcmMtZGVzY1xuICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXG4gICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXG4gICAgICAgIGNlbnRlcjogYXJjLmNlbnRlcixcbiAgICAgICAgcmFkaXVzOiBhcmMucmFkaXVzLFxuICAgICAgICBxdWFsaXR5OiAzMCxcbiAgICAgICAgY29sb3I6IGFyYy5wcm9wcy5tYXRlcmlhbCgpXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtYXJjLWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgICAgICA8YWMtcG9pbnQtZGVzY1xuICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgICAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBwb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodFJlZmVyZW5jZTogcG9pbnQucHJvcHMuaGVpZ2h0UmVmZXJlbmNlLFxuICAgIH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FjLXBvaW50LWRlc2M+XG4gICAgICA8L2FjLWxheWVyPlxuXG4gICAgICA8YWMtbGF5ZXIgI2VkaXRDaXJjbGVzTGF5ZXIgYWNGb3I9XCJsZXQgY2lyY2xlIG9mIGVkaXRDaXJjbGVzJFwiIFtjb250ZXh0XT1cInRoaXNcIiBbekluZGV4XT1cIjBcIj5cbiAgICAgICAgICA8YWMtZWxsaXBzZS1kZXNjXG4gICAgICAgICAgICAgICAgICBwcm9wcz1cIntcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBjaXJjbGUuZ2V0Q2VudGVyQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICAgICAgICAgICAgc2VtaU1ham9yQXhpczogY2lyY2xlLmdldFJhZGl1c0NhbGxiYWNrUHJvcGVydHkoKSxcbiAgICAgICAgICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGNpcmNsZS5nZXRSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXG4gICAgICAgICAgICAgICAgICBtYXRlcmlhbDogY2lyY2xlLmNpcmNsZVByb3BzLm1hdGVyaWFsLFxuICAgICAgICAgICAgICAgICAgb3V0bGluZTogY2lyY2xlLmNpcmNsZVByb3BzLm91dGxpbmUsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogY2lyY2xlLmNpcmNsZVByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogY2lyY2xlLmNpcmNsZVByb3BzLm91dGxpbmVDb2xvcixcbiAgICAgICAgICAgICAgICAgIGZpbGw6IGNpcmNsZS5jaXJjbGVQcm9wcy5maWxsLFxuICAgICAgICAgICAgICAgICAgY2xhc3NpZmljYXRpb25UeXBlOiBjaXJjbGUuY2lyY2xlUHJvcHMuY2xhc3NpZmljYXRpb25UeXBlLFxuICAgICAgICAgICAgICAgICAgekluZGV4OiBjaXJjbGUuY2lyY2xlUHJvcHMuekluZGV4LFxuICAgICAgICAgICAgICAgICAgc2hhZG93czogY2lyY2xlLmNpcmNsZVByb3BzLnNoYWRvd3MsXG4gICAgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvYWMtZWxsaXBzZS1kZXNjPlxuXG4gICAgICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgY2lyY2xlLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luLFxuICAgICAgICAgICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBsYWJlbC5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UsXG4gICAgICAgIH1cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICAgICAgPC9hYy1hcnJheS1kZXNjPlxuICAgICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENpcmNsZXNFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogQ2lyY2xlRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHJpdmF0ZSBlZGl0b3JVcGRhdGVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdENpcmNsZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0QXJjcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcblxuICBAVmlld0NoaWxkKCdlZGl0Q2lyY2xlc0xheWVyJykgcHJpdmF0ZSBlZGl0Q2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0QXJjc0xheWVyJykgcHJpdmF0ZSBlZGl0QXJjc0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRzTGF5ZXInKSBwcml2YXRlIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNpcmNsZXNFZGl0b3I6IENpcmNsZXNFZGl0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuY2lyY2xlc0VkaXRvci5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlciwgdGhpcy5jb29yZGluYXRlQ29udmVydGVyLCB0aGlzLmNhbWVyYVNlcnZpY2UsIHRoaXMuY2lyY2xlc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5lZGl0b3JVcGRhdGVzU3Vic2NyaXB0aW9uID0gdGhpcy5jaXJjbGVzRWRpdG9yLm9uVXBkYXRlKCkuc3Vic2NyaWJlKHVwZGF0ZSA9PiB7XG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5FRElUKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExhYmVsSWQoZWxlbWVudDogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJlbmRlckVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSwgdXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcbiAgICB1cGRhdGUuY2VudGVyID0gY2lyY2xlLmdldENlbnRlcigpO1xuICAgIHVwZGF0ZS5yYWRpdXNQb2ludCA9IGNpcmNsZS5nZXRSYWRpdXNQb2ludCgpO1xuICAgIHVwZGF0ZS5yYWRpdXMgPSBjaXJjbGUuZ2V0UmFkaXVzKCk7XG5cbiAgICBpZiAobGFiZWxzKSB7XG4gICAgICBjaXJjbGUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2lyY2xlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgY2lyY2xlLmxhYmVscyk7XG4gICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLnVwZGF0ZShjaXJjbGUsIGNpcmNsZS5nZXRJZCgpKTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRMYWJlbHMoY2lyY2xlOiBFZGl0YWJsZUNpcmNsZSkge1xuICAgIGNpcmNsZS5sYWJlbHMgPSBbXTtcbiAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIudXBkYXRlKGNpcmNsZSwgY2lyY2xlLmdldElkKCkpO1xuICB9XG5cbiAgaGFuZGxlQ3JlYXRlVXBkYXRlcyh1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUNpcmNsZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0Q2lyY2xlc0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdFBvaW50c0xheWVyLFxuICAgICAgICAgIHRoaXMuZWRpdEFyY3NMYXllcixcbiAgICAgICAgICB1cGRhdGUuY2lyY2xlT3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5jZW50ZXIpIHtcbiAgICAgICAgICBjaXJjbGUuYWRkUG9pbnQodXBkYXRlLmNlbnRlcik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS5yYWRpdXNQb2ludCkge1xuICAgICAgICAgIGNpcmNsZS5hZGRMYXN0UG9pbnQodXBkYXRlLnJhZGl1c1BvaW50KTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChjaXJjbGUpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoY2lyY2xlKTtcbiAgICAgICAgICB0aGlzLmNpcmNsZXNNYW5hZ2VyLmRpc3Bvc2UodXBkYXRlLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVDaXJjbGUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdENpcmNsZXNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRBcmNzTGF5ZXIsXG4gICAgICAgICAgdXBkYXRlLmNpcmNsZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGNpcmNsZS5zZXRNYW51YWxseSh1cGRhdGUuY2VudGVyLCB1cGRhdGUucmFkaXVzUG9pbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSAmJiBjaXJjbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLmVuZERyYWdQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLm1vdmVDaXJjbGUodXBkYXRlLnN0YXJ0RHJhZ1Bvc2l0aW9uLCB1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLmVuZE1vdmVQb2x5Z29uKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlKSB7XG4gICAgICAgICAgY2lyY2xlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSkge1xuICAgICAgICAgIGNpcmNsZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5lZGl0b3JVcGRhdGVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
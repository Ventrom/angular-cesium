/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { CirclesManagerService } from '../../services/entity-editors/circles-editor/circles-manager.service';
import { CirclesEditorService } from '../../services/entity-editors/circles-editor/circles-editor.service';
export class CirclesEditorComponent {
    /**
     * @param {?} circlesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} circlesManager
     */
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
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.circlesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
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
    /**
     * @param {?} circle
     * @return {?}
     */
    removeEditLabels(circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.removeEditLabels(circle);
                this.circlesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                const circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.circlesManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
CirclesEditorComponent.decorators = [
    { type: Component, args: [{
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
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
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
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, CirclesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
CirclesEditorComponent.ctorParameters = () => [
    { type: CirclesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: CirclesManagerService }
];
CirclesEditorComponent.propDecorators = {
    editCirclesLayer: [{ type: ViewChild, args: ['editCirclesLayer',] }],
    editArcsLayer: [{ type: ViewChild, args: ['editArcsLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editLabelsRenderFn;
    /** @type {?} */
    CirclesEditorComponent.prototype.Cesium;
    /** @type {?} */
    CirclesEditorComponent.prototype.editPoints$;
    /** @type {?} */
    CirclesEditorComponent.prototype.editCircles$;
    /** @type {?} */
    CirclesEditorComponent.prototype.editArcs$;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editCirclesLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editArcsLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.editPointsLayer;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.circlesEditor;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorComponent.prototype.circlesManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXhELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUN6SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzRUFBc0UsQ0FBQztBQUM3RyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxRUFBcUUsQ0FBQztBQWtGM0csTUFBTSxPQUFPLHNCQUFzQjs7Ozs7Ozs7SUFXakMsWUFDVSxhQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsZ0JBQXlDLEVBQ3pDLGFBQTRCLEVBQzVCLGNBQXFDO1FBSnJDLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsbUJBQWMsR0FBZCxj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O1FBQzNCLE9BQU8sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRyxDQUFDOzs7WUEvUUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUVsQjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQztnQkFDdkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7Ozs7WUFqRlEsb0JBQW9CO1lBTnBCLG1CQUFtQjtZQUNuQix1QkFBdUI7WUFFdkIsYUFBYTtZQUViLHFCQUFxQjs7OytCQTBGM0IsU0FBUyxTQUFDLGtCQUFrQjs0QkFDNUIsU0FBUyxTQUFDLGVBQWU7OEJBQ3pCLFNBQVMsU0FBQyxpQkFBaUI7Ozs7Ozs7SUFSNUIsb0RBQTZGOztJQUM3Rix3Q0FBdUI7O0lBQ3ZCLDZDQUFtRDs7SUFDbkQsOENBQW9EOztJQUNwRCwyQ0FBaUQ7Ozs7O0lBRWpELGtEQUEwRTs7Ozs7SUFDMUUsK0NBQW9FOzs7OztJQUNwRSxpREFBd0U7Ozs7O0lBR3RFLCtDQUEyQzs7Ozs7SUFDM0MscURBQWdEOzs7OztJQUNoRCxrREFBaUQ7Ozs7O0lBQ2pELCtDQUFvQzs7Ozs7SUFDcEMsZ0RBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDaXJjbGVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDaXJjbGVzRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFZGl0YWJsZUNpcmNsZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1jaXJjbGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjaXJjbGVzLWVkaXRvcicsXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXG4gICAgPGFjLWxheWVyICNlZGl0QXJjc0xheWVyIGFjRm9yPVwibGV0IGFyYyBvZiBlZGl0QXJjcyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gICAgICA8YWMtYXJjLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXG4gICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXG4gICAgICAgIGNlbnRlcjogYXJjLmNlbnRlcixcbiAgICAgICAgcmFkaXVzOiBhcmMucmFkaXVzLFxuICAgICAgICBxdWFsaXR5OiAzMCxcbiAgICAgICAgY29sb3I6IGFyYy5wcm9wcy5tYXRlcmlhbCgpXG4gICAgfVwiXG4gICAgICA+XG4gICAgICA8L2FjLWFyYy1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG5cbiAgICA8YWMtbGF5ZXIgI2VkaXRQb2ludHNMYXllciBhY0Zvcj1cImxldCBwb2ludCBvZiBlZGl0UG9pbnRzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiAgICAgIDxhYy1wb2ludC1kZXNjXG4gICAgICAgIHByb3BzPVwie1xuICAgICAgICBwb3NpdGlvbjogcG9pbnQuZ2V0UG9zaXRpb24oKSxcbiAgICAgICAgcGl4ZWxTaXplOiBnZXRQb2ludFNpemUocG9pbnQpLFxuICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXG4gICAgICAgIG91dGxpbmVDb2xvcjogcG9pbnQucHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICBvdXRsaW5lV2lkdGg6IHBvaW50LnByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KVxuICAgIH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1wb2ludC1kZXNjPlxuICAgIDwvYWMtbGF5ZXI+XG5cbiAgICA8YWMtbGF5ZXIgI2VkaXRDaXJjbGVzTGF5ZXIgYWNGb3I9XCJsZXQgY2lyY2xlIG9mIGVkaXRDaXJjbGVzJFwiIFtjb250ZXh0XT1cInRoaXNcIiBbekluZGV4XT1cIjBcIj5cbiAgICAgIDxhYy1lbGxpcHNlLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBjaXJjbGUuZ2V0Q2VudGVyQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICBzZW1pTWFqb3JBeGlzOiBjaXJjbGUuZ2V0UmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICBzZW1pTWlub3JBeGlzOiBjaXJjbGUuZ2V0UmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxuICAgICAgICBtYXRlcmlhbDogY2lyY2xlLmNpcmNsZVByb3BzLm1hdGVyaWFsLFxuICAgICAgICBvdXRsaW5lOiBjaXJjbGUuY2lyY2xlUHJvcHMub3V0bGluZSxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgfVwiXG4gICAgICA+XG4gICAgICA8L2FjLWVsbGlwc2UtZGVzYz5cblxuICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgY2lyY2xlLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luXG4gICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENpcmNsZXNFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogQ2lyY2xlRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbiAgcHVibGljIENlc2l1bSA9IENlc2l1bTtcbiAgcHVibGljIGVkaXRQb2ludHMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG4gIHB1YmxpYyBlZGl0Q2lyY2xlcyQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcbiAgcHVibGljIGVkaXRBcmNzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRDaXJjbGVzTGF5ZXInKSBwcml2YXRlIGVkaXRDaXJjbGVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRBcmNzTGF5ZXInKSBwcml2YXRlIGVkaXRBcmNzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2lyY2xlc0VkaXRvcjogQ2lyY2xlc0VkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2lyY2xlc01hbmFnZXI6IENpcmNsZXNNYW5hZ2VyU2VydmljZSxcbiAgKSB7XG4gICAgdGhpcy5jaXJjbGVzRWRpdG9yLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyLCB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsIHRoaXMuY2FtZXJhU2VydmljZSwgdGhpcy5jaXJjbGVzTWFuYWdlcik7XG4gICAgdGhpcy5zdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydExpc3RlbmluZ1RvRWRpdG9yVXBkYXRlcygpIHtcbiAgICB0aGlzLmNpcmNsZXNFZGl0b3Iub25VcGRhdGUoKS5zdWJzY3JpYmUodXBkYXRlID0+IHtcbiAgICAgIGlmICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgfHwgdXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkVESVQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGFiZWxJZChlbGVtZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleC50b1N0cmluZygpO1xuICB9XG5cbiAgcmVuZGVyRWRpdExhYmVscyhjaXJjbGU6IEVkaXRhYmxlQ2lyY2xlLCB1cGRhdGU6IENpcmNsZUVkaXRVcGRhdGUsIGxhYmVscz86IExhYmVsUHJvcHNbXSkge1xuICAgIHVwZGF0ZS5jZW50ZXIgPSBjaXJjbGUuZ2V0Q2VudGVyKCk7XG4gICAgdXBkYXRlLnJhZGl1c1BvaW50ID0gY2lyY2xlLmdldFJhZGl1c1BvaW50KCk7XG4gICAgdXBkYXRlLnJhZGl1cyA9IGNpcmNsZS5nZXRSYWRpdXMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIGNpcmNsZS5sYWJlbHMgPSBsYWJlbHM7XG4gICAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIudXBkYXRlKGNpcmNsZSwgY2lyY2xlLmdldElkKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjaXJjbGUubGFiZWxzID0gdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4odXBkYXRlLCBjaXJjbGUubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIudXBkYXRlKGNpcmNsZSwgY2lyY2xlLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhjaXJjbGU6IEVkaXRhYmxlQ2lyY2xlKSB7XG4gICAgY2lyY2xlLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdENpcmNsZXNMYXllci51cGRhdGUoY2lyY2xlLCBjaXJjbGUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogQ2lyY2xlRWRpdFVwZGF0ZSkge1xuICAgIHN3aXRjaCAodXBkYXRlLmVkaXRBY3Rpb24pIHtcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xuICAgICAgICB0aGlzLmNpcmNsZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlQ2lyY2xlKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRDaXJjbGVzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0QXJjc0xheWVyLFxuICAgICAgICAgIHVwZGF0ZS5jaXJjbGVPcHRpb25zLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuTU9VU0VfTU9WRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnJhZGl1c1BvaW50KSB7XG4gICAgICAgICAgY2lyY2xlLm1vdmVQb2ludCh1cGRhdGUucmFkaXVzUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLmNlbnRlcikge1xuICAgICAgICAgIGNpcmNsZS5hZGRQb2ludCh1cGRhdGUuY2VudGVyKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAodXBkYXRlLnJhZGl1c1BvaW50KSB7XG4gICAgICAgICAgY2lyY2xlLmFkZExhc3RQb2ludCh1cGRhdGUucmFkaXVzUG9pbnQpO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRJU1BPU0U6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFZGl0TGFiZWxzKGNpcmNsZSk7XG4gICAgICAgIHRoaXMuY2lyY2xlc01hbmFnZXIuZGlzcG9zZSh1cGRhdGUuaWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUsIHVwZGF0ZS51cGRhdGVMYWJlbHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhjaXJjbGUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlOiBDaXJjbGVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuY3JlYXRlRWRpdGFibGVDaXJjbGUoXG4gICAgICAgICAgdXBkYXRlLmlkLFxuICAgICAgICAgIHRoaXMuZWRpdENpcmNsZXNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRBcmNzTGF5ZXIsXG4gICAgICAgICAgdXBkYXRlLmNpcmNsZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGNpcmNsZS5zZXRNYW51YWxseSh1cGRhdGUuY2VudGVyLCB1cGRhdGUucmFkaXVzUG9pbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g6XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSAmJiBjaXJjbGUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGNpcmNsZS5tb3ZlUG9pbnQodXBkYXRlLmVuZERyYWdQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLm1vdmVDaXJjbGUodXBkYXRlLnN0YXJ0RHJhZ1Bvc2l0aW9uLCB1cGRhdGUuZW5kRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSDoge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlICYmIGNpcmNsZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgY2lyY2xlLmVuZE1vdmVQb2x5Z29uKCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGNpcmNsZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICBpZiAoY2lyY2xlKSB7XG4gICAgICAgICAgY2lyY2xlLmVuYWJsZUVkaXQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGNpcmNsZSkge1xuICAgICAgICAgIGNpcmNsZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoY2lyY2xlLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jaXJjbGVzTWFuYWdlci5jbGVhcigpO1xuICB9XG5cbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICByZXR1cm4gcG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy52aXJ0dWFsUG9pbnRQaXhlbFNpemUgOiBwb2ludC5wcm9wcy5waXhlbFNpemU7XG4gIH1cblxuICBnZXRQb2ludFNob3cocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5zaG93ICYmIChwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnNob3dWaXJ0dWFsIDogcG9pbnQucHJvcHMuc2hvdyk7XG4gIH1cbn1cbiJdfQ==
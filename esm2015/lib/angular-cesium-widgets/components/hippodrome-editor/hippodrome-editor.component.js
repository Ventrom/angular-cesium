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
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';
import { HippodromeEditorService } from '../../services/entity-editors/hippodrome-editor/hippodrome-editor.service';
export class HippodromeEditorComponent {
    /**
     * @param {?} hippodromesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} hippodromesManager
     */
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
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.hippodromesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        (update) => {
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
     * @param {?} hippodrome
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
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
    /**
     * @param {?} hippodrome
     * @return {?}
     */
    removeEditLabels(hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                hippodrome.dispose();
                this.removeEditLabels(hippodrome);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
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
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.hippodromesManager.clear();
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
HippodromeEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'hippodrome-editor',
                template: /*html*/ `
    <ac-layer #editHippodromesLayer acFor="let hippodrome of editHippodromes$" [context]="this">
      <ac-corridor-desc
        props="{
		positions: hippodrome.getRealPositionsCallbackProperty(),
		cornerType: Cesium.CornerType.ROUNDED,
		material: hippodrome.hippodromeProps.material,
		width : hippodrome.hippodromeProps.width,
		outline: hippodrome.hippodromeProps.outline,
		outlineColor: hippodrome.hippodromeProps.outlineColor,
        outlineWidth: hippodrome.hippodromeProps.outlineWidth,
        height: 0
	}"
      >
      </ac-corridor-desc>

      <ac-array-desc acFor="let label of hippodrome.labels" [idGetter]="getLabelId">
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
  `,
                providers: [CoordinateConverter, HippodromeManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.editLabelsRenderFn;
    /** @type {?} */
    HippodromeEditorComponent.prototype.Cesium;
    /** @type {?} */
    HippodromeEditorComponent.prototype.editPoints$;
    /** @type {?} */
    HippodromeEditorComponent.prototype.editHippodromes$;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.editPointsLayer;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.editHippodromesLayer;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.hippodromesEditor;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorComponent.prototype.hippodromesManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXhELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUN6SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5RUFBeUUsQ0FBQztBQUNsSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUN0SCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyRUFBMkUsQ0FBQztBQXNFcEgsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7Ozs7SUFTcEMsWUFDVSxpQkFBMEMsRUFDMUMsbUJBQXdDLEVBQ3hDLGdCQUF5QyxFQUN6QyxhQUE0QixFQUM1QixrQkFBNEM7UUFKNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUF5QjtRQUMxQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFD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LElBQUksQ0FBQyxDQUFDO0lBQ2pHLENBQUM7OztZQWhRRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyRGxCO2dCQUNELFNBQVMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLHdCQUF3QixDQUFDO2dCQUMxRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7OztZQXJFUSx1QkFBdUI7WUFOdkIsbUJBQW1CO1lBQ25CLHVCQUF1QjtZQUV2QixhQUFhO1lBRWIsd0JBQXdCOzs7OEJBNkU5QixTQUFTLFNBQUMsaUJBQWlCO21DQUMzQixTQUFTLFNBQUMsc0JBQXNCOzs7Ozs7O0lBTmpDLHVEQUFpRzs7SUFDakcsMkNBQXVCOztJQUN2QixnREFBbUQ7O0lBQ25ELHFEQUF3RDs7Ozs7SUFFeEQsb0RBQXdFOzs7OztJQUN4RSx5REFBa0Y7Ozs7O0lBR2hGLHNEQUFrRDs7Ozs7SUFDbEQsd0RBQWdEOzs7OztJQUNoRCxxREFBaUQ7Ozs7O0lBQ2pELGtEQUFvQzs7Ozs7SUFDcEMsdURBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9oaXBwb2Ryb21lLWVkaXRvci9oaXBwb2Ryb21lLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtZWRpdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnaGlwcG9kcm9tZS1lZGl0b3InLFxuICB0ZW1wbGF0ZTogLypodG1sKi8gYFxuICAgIDxhYy1sYXllciAjZWRpdEhpcHBvZHJvbWVzTGF5ZXIgYWNGb3I9XCJsZXQgaGlwcG9kcm9tZSBvZiBlZGl0SGlwcG9kcm9tZXMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLWNvcnJpZG9yLWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG5cdFx0cG9zaXRpb25zOiBoaXBwb2Ryb21lLmdldFJlYWxQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCksXG5cdFx0Y29ybmVyVHlwZTogQ2VzaXVtLkNvcm5lclR5cGUuUk9VTkRFRCxcblx0XHRtYXRlcmlhbDogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMubWF0ZXJpYWwsXG5cdFx0d2lkdGggOiBoaXBwb2Ryb21lLmhpcHBvZHJvbWVQcm9wcy53aWR0aCxcblx0XHRvdXRsaW5lOiBoaXBwb2Ryb21lLmhpcHBvZHJvbWVQcm9wcy5vdXRsaW5lLFxuXHRcdG91dGxpbmVDb2xvcjogaGlwcG9kcm9tZS5oaXBwb2Ryb21lUHJvcHMub3V0bGluZUNvbG9yLFxuICAgICAgICBvdXRsaW5lV2lkdGg6IGhpcHBvZHJvbWUuaGlwcG9kcm9tZVByb3BzLm91dGxpbmVXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiAwXG5cdH1cIlxuICAgICAgPlxuICAgICAgPC9hYy1jb3JyaWRvci1kZXNjPlxuXG4gICAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBsYWJlbCBvZiBoaXBwb2Ryb21lLmxhYmVsc1wiIFtpZEdldHRlcl09XCJnZXRMYWJlbElkXCI+XG4gICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xuICAgICAgICAgIHByb3BzPVwie1xuICAgICAgICAgICAgcG9zaXRpb246IGxhYmVsLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kUGFkZGluZzogbGFiZWwuYmFja2dyb3VuZFBhZGRpbmcsXG4gICAgICAgICAgICBkaXN0YW5jZURpc3BsYXlDb25kaXRpb246IGxhYmVsLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbixcbiAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxuICAgICAgICAgICAgZmlsbENvbG9yOiBsYWJlbC5maWxsQ29sb3IsXG4gICAgICAgICAgICBmb250OiBsYWJlbC5mb250LFxuICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXG4gICAgICAgICAgICBob3Jpem9udGFsT3JpZ2luOiBsYWJlbC5ob3Jpem9udGFsT3JpZ2luLFxuICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBsYWJlbC5vdXRsaW5lQ29sb3IsXG4gICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBsYWJlbC5waXhlbE9mZnNldCxcbiAgICAgICAgICAgIHBpeGVsT2Zmc2V0U2NhbGVCeURpc3RhbmNlOiBsYWJlbC5waXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZSxcbiAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcbiAgICAgICAgICAgIHNjYWxlQnlEaXN0YW5jZTogbGFiZWwuc2NhbGVCeURpc3RhbmNlLFxuICAgICAgICAgICAgc2hvdzogbGFiZWwuc2hvdyxcbiAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcbiAgICAgICAgICAgIHN0eWxlOiBsYWJlbC5zdHlsZSxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLnRleHQsXG4gICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxuICAgICAgICAgICAgdmVydGljYWxPcmlnaW46IGxhYmVsLnZlcnRpY2FsT3JpZ2luXG4gICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2M+XG4gICAgICA8L2FjLWFycmF5LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cblxuICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuICAgICAgPGFjLXBvaW50LWRlc2NcbiAgICAgICAgcHJvcHM9XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwb2ludC5nZXRQb3NpdGlvbigpLFxuICAgICAgICBwaXhlbFNpemU6IGdldFBvaW50U2l6ZShwb2ludCksXG4gICAgICAgIGNvbG9yOiBwb2ludC5wcm9wcy5jb2xvcixcbiAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXG4gICAgICAgIG91dGxpbmVXaWR0aDogcG9pbnQucHJvcHMub3V0bGluZVdpZHRoLFxuICAgICAgICBzaG93OiBnZXRQb2ludFNob3cocG9pbnQpXG4gICAgfVwiXG4gICAgICA+XG4gICAgICA8L2FjLXBvaW50LWRlc2M+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGVkaXRMYWJlbHNSZW5kZXJGbjogKHVwZGF0ZTogSGlwcG9kcm9tZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG4gIHB1YmxpYyBDZXNpdW0gPSBDZXNpdW07XG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuICBwdWJsaWMgZWRpdEhpcHBvZHJvbWVzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2VkaXRQb2ludHNMYXllcicpIHByaXZhdGUgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdlZGl0SGlwcG9kcm9tZXNMYXllcicpIHByaXZhdGUgZWRpdEhpcHBvZHJvbWVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBoaXBwb2Ryb21lc0VkaXRvcjogSGlwcG9kcm9tZUVkaXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgaGlwcG9kcm9tZXNNYW5hZ2VyOiBIaXBwb2Ryb21lTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMuaGlwcG9kcm9tZXNFZGl0b3IuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIsIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciwgdGhpcy5jYW1lcmFTZXJ2aWNlLCBoaXBwb2Ryb21lc01hbmFnZXIpO1xuICAgIHRoaXMuc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRMaXN0ZW5pbmdUb0VkaXRvclVwZGF0ZXMoKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSgodXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSkgPT4ge1xuICAgICAgaWYgKHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURSB8fCB1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuRURJVCkge1xuICAgICAgICB0aGlzLmhhbmRsZUVkaXRVcGRhdGVzKHVwZGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMYWJlbElkKGVsZW1lbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKCk7XG4gIH1cblxuICByZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWU6IEVkaXRhYmxlSGlwcG9kcm9tZSwgdXBkYXRlOiBIaXBwb2Ryb21lRWRpdFVwZGF0ZSwgbGFiZWxzPzogTGFiZWxQcm9wc1tdKSB7XG4gICAgdXBkYXRlLnBvc2l0aW9ucyA9IGhpcHBvZHJvbWUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHVwZGF0ZS5wb2ludHMgPSBoaXBwb2Ryb21lLmdldFJlYWxQb2ludHMoKTtcblxuICAgIGlmIChsYWJlbHMpIHtcbiAgICAgIGhpcHBvZHJvbWUubGFiZWxzID0gbGFiZWxzO1xuICAgICAgdGhpcy5lZGl0SGlwcG9kcm9tZXNMYXllci51cGRhdGUoaGlwcG9kcm9tZSwgaGlwcG9kcm9tZS5nZXRJZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGlwcG9kcm9tZS5sYWJlbHMgPSB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbih1cGRhdGUsIGhpcHBvZHJvbWUubGFiZWxzKTtcbiAgICB0aGlzLmVkaXRIaXBwb2Ryb21lc0xheWVyLnVwZGF0ZShoaXBwb2Ryb21lLCBoaXBwb2Ryb21lLmdldElkKCkpO1xuICB9XG5cbiAgcmVtb3ZlRWRpdExhYmVscyhoaXBwb2Ryb21lOiBFZGl0YWJsZUhpcHBvZHJvbWUpIHtcbiAgICBoaXBwb2Ryb21lLmxhYmVscyA9IFtdO1xuICAgIHRoaXMuZWRpdEhpcHBvZHJvbWVzTGF5ZXIudXBkYXRlKGhpcHBvZHJvbWUsIGhpcHBvZHJvbWUuZ2V0SWQoKSk7XG4gIH1cblxuICBoYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZTogSGlwcG9kcm9tZUVkaXRVcGRhdGUpIHtcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcbiAgICAgICAgdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuY3JlYXRlRWRpdGFibGVIaXBwb2Ryb21lKFxuICAgICAgICAgIHVwZGF0ZS5pZCxcbiAgICAgICAgICB0aGlzLmVkaXRQb2ludHNMYXllcixcbiAgICAgICAgICB0aGlzLmVkaXRIaXBwb2Ryb21lc0xheWVyLFxuICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICB1cGRhdGUuaGlwcG9kcm9tZU9wdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICBoaXBwb2Ryb21lLm1vdmVUZW1wTW92aW5nUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkFERF9QT0lOVDoge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmICh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5hZGRQb2ludCh1cGRhdGUudXBkYXRlZFBvc2l0aW9uKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTUE9TRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGhpcHBvZHJvbWUuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoaGlwcG9kcm9tZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5lZGl0TGFiZWxzUmVuZGVyRm4gPSB1cGRhdGUubGFiZWxzUmVuZGVyRm47XG4gICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSwgdXBkYXRlLnVwZGF0ZUxhYmVscyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFk6IHtcbiAgICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IEhpcHBvZHJvbWVFZGl0VXBkYXRlKSB7XG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5JTklUOiB7XG4gICAgICAgIHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmNyZWF0ZUVkaXRhYmxlSGlwcG9kcm9tZShcbiAgICAgICAgICB1cGRhdGUuaWQsXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXG4gICAgICAgICAgdGhpcy5lZGl0SGlwcG9kcm9tZXNMYXllcixcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgdXBkYXRlLmhpcHBvZHJvbWVPcHRpb25zLFxuICAgICAgICAgIHVwZGF0ZS5wb3NpdGlvbnMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5tb3ZlUG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmRNb3ZlUG9pbnQoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmFibGVFZGl0ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGhpcHBvZHJvbWUsIHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkVOQUJMRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lKSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRToge1xuICAgICAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XG4gICAgICAgIGlmIChoaXBwb2Ryb21lICYmIGhpcHBvZHJvbWUuZW5hYmxlRWRpdCkge1xuICAgICAgICAgIGhpcHBvZHJvbWUubW92ZVNoYXBlKHVwZGF0ZS5kcmFnZ2VkUG9zaXRpb24sIHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMucmVuZGVyRWRpdExhYmVscyhoaXBwb2Ryb21lLCB1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIOiB7XG4gICAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcbiAgICAgICAgaWYgKGhpcHBvZHJvbWUgJiYgaGlwcG9kcm9tZS5lbmFibGVFZGl0KSB7XG4gICAgICAgICAgaGlwcG9kcm9tZS5lbmRNb3ZlU2hhcGUoKTtcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoaGlwcG9kcm9tZSwgdXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuaGlwcG9kcm9tZXNNYW5hZ2VyLmNsZWFyKCk7XG4gIH1cblxuICBnZXRQb2ludFNpemUocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcbiAgfVxuXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcmV0dXJuIHBvaW50LnNob3cgJiYgKHBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpID8gcG9pbnQucHJvcHMuc2hvd1ZpcnR1YWwgOiBwb2ludC5wcm9wcy5zaG93KTtcbiAgfVxufVxuIl19
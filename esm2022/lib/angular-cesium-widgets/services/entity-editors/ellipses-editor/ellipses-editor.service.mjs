import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableEllipse } from '../../../models/editable-ellipse';
import { generateKey } from '../../utils';
import { CesiumEventModifier } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import * as i0 from "@angular/core";
export const DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: true,
        outlineWidth: 1,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
        shadows: Cesium.ShadowMode.DISABLED,
    },
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: () => Cesium.Color.WHITE,
    },
    circleToEllipseTransformation: false,
};
/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
export class EllipsesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, ellipsesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                updatedPosition: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next({
                ...update,
            });
            const changeMode = {
                id,
                center,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next({
                ...update,
            });
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next({
                    ...update,
                });
                center = position;
            }
            else {
                finishedCreate = finishCreation(position);
            }
        });
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next({
                    ...update,
                });
            }
        });
        return editorObservable;
    }
    edit(center, majorRadius, rotation = Math.PI / 2, minorRadius, options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const update = {
            id,
            center,
            majorRadius,
            rotation,
            minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
        });
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    }
    editEllipse(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            const point = entities[0];
            const pointIsCenter = point === this.getCenterPoint(id);
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && this.ellipsesManager.get(id).enableEdit &&
                (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = {
                id,
                updatedPoint: point,
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
                ...this.getEllipseProperties(id),
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
            });
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
                const update = {
                    id,
                    editMode: EditModes.EDIT,
                    editAction: EditActions.TRANSFORM,
                    ...this.getEllipseProperties(id),
                };
                this.updateSubject.next(update);
                editSubject.next({
                    ...update,
                });
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = {
                    id,
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                    ...this.getEllipseProperties(id),
                };
                this.updateSubject.next(update);
                editSubject.next({
                    ...update,
                });
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
                ...this.getEllipseProperties(id),
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
                ...this.getEllipseProperties(id),
            });
        };
        observableToExtend.setManually = (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) => {
            const ellipse = this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Ellipses editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.ellipsesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getMajorRadius = () => this.getMajorRadius(id);
        observableToExtend.getMinorRadius = () => this.getMinorRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        const ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    }
    getCenterPosition(id) {
        return this.ellipsesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.ellipsesManager.get(id).center;
    }
    getMajorRadius(id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    }
    getMinorRadius(id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    }
    getEllipseProperties(id) {
        const ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: EllipsesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: EllipsesEditorService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: EllipsesEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUluRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJGQUEyRixDQUFDOztBQUdoSSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBdUI7SUFDekQsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsNkJBQTZCLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFD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LE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDM0IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDL0IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDckMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDckMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLDJCQUEyQixFQUFFO1lBQy9ELHdCQUF3QixFQUFFLE9BQU8sQ0FBQywyQkFBMkIsRUFBRTtTQUNoRSxDQUFDO0lBQ0osQ0FBQzs4R0FuYlUscUJBQXFCO2tIQUFyQixxQkFBcUI7OzJGQUFyQixxQkFBcUI7a0JBRGpDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9lbGxpcHNlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdE9wdGlvbnMsIEVsbGlwc2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFZGl0YWJsZUVsbGlwc2UgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtZWxsaXBzZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEJhc2ljRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9iYXNpYy1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0nO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9FTExJUFNFX09QVElPTlM6IEVsbGlwc2VFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50TW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIuQUxULFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIGVsbGlwc2VQcm9wczoge1xuICAgIG1hdGVyaWFsOiBDZXNpdW0uQ29sb3IuQ09STkZMT1dFUkJMVUUud2l0aEFscGhhKDAuNCksXG4gICAgZmlsbDogdHJ1ZSxcbiAgICBvdXRsaW5lOiB0cnVlLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC44KSxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgICB6SW5kZXg6IDAsXG4gICAgc2hhZG93czogQ2VzaXVtLlNoYWRvd01vZGUuRElTQUJMRUQsXG4gIH0sXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjIpLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDEzLFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxuICBwb2x5bGluZVByb3BzOiB7XG4gICAgd2lkdGg6IDEsXG4gICAgbWF0ZXJpYWw6ICgpID0+IENlc2l1bS5Db2xvci5XSElURSxcbiAgfSxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtYXRpb246IGZhbHNlLFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBlbGxpcHNlc1xuICpcbiAqIFlvdSBtdXN0IHByb3ZpZGUgYEVsbGlwc2VzRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBFbGxpcHNlc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPGVsbGlwc2UtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxlbGxpcHNlLWVkaXRvcj5gXG4gKiBmb3IgZWFjaCBgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cbiAqXG4gKiArIGBjcmVhdGVgIGZvciBzdGFydGluZyBhIGNyZWF0aW9uIG9mIHRoZSBzaGFwZSBvdmVyIHRoZSBtYXAuIFJldHVybnMgYSBleHRlbnNpb24gb2YgYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZGlzcG9zZSgpYCBmcm9tIHRoZSBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXG4gKlxuICogKipMYWJlbHMgb3ZlciBlZGl0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIGVsbGlwc2VcbiAqICBjb25zdCBlZGl0aW5nJCA9IGVsbGlwc2VzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBlbGxpcHNlIGZyb20gZXhpc3RpbmcgY2VudGVyIHBvaW50LCB0d28gcmFkaXVzZXMgYW5kIHJvdGF0aW9uXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLmVsbGlwc2VzRWRpdG9yU2VydmljZS5lZGl0KGNlbnRlciwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uLCBtaW5vclJhZGl1cyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbGxpcHNlc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPEVsbGlwc2VFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lOiBhbnk7XG5cbiAgaW5pdChcbiAgICBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgZWxsaXBzZXNNYW5hZ2VyOiBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlLFxuICAgIGNlc2l1bVZpZXdlcjogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5lbGxpcHNlc01hbmFnZXIgPSBlbGxpcHNlc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuXG4gICAgdGhpcy5jZXNpdW1TY2VuZSA9IGNlc2l1bVZpZXdlci5nZXRTY2VuZSgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxFbGxpcHNlRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9FTExJUFNFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGxldCBjZW50ZXI6IGFueTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgZWxsaXBzZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcixcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNoYW5nZU1vZGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGUsXG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy5lZGl0RWxsaXBzZShpZCwgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBlbGxpcHNlT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IGVsbGlwc2VPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQsIGZpbmlzaENyZWF0aW9uKTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghY2VudGVyKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNlbnRlciA9IHBvc2l0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChcbiAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgbWFqb3JSYWRpdXM6IG51bWJlcixcbiAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyLFxuICAgIG1pbm9yUmFkaXVzPzogbnVtYmVyLFxuICAgIG9wdGlvbnMgPSBERUZBVUxUX0VMTElQU0VfT1BUSU9OUyxcbiAgICBwcmlvcml0eSA9IDEwMCxcbiAgKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGNlbnRlcixcbiAgICAgIG1ham9yUmFkaXVzLFxuICAgICAgcm90YXRpb24sXG4gICAgICBtaW5vclJhZGl1cyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBlbGxpcHNlT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5lZGl0RWxsaXBzZShpZCwgcHJpb3JpdHksIGVkaXRTdWJqZWN0LCBlbGxpcHNlT3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRFbGxpcHNlKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBlZGl0U3ViamVjdDogU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4sXG4gICAgb3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zLFxuICAgIGVkaXRPYnNlcnZhYmxlPzogRWxsaXBzZUVkaXRvck9ic2VydmFibGUsXG4gICk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybWF0aW9uKSB7XG4gICAgICBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudCxcbiAgICAgICAgbW9kaWZpZXI6IG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcixcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVFbGxpcHNlLFxuICAgICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlRWxsaXBzZSxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgLnBpcGUodGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICAgIGNvbnN0IHBvaW50SXNDZW50ZXIgPSBwb2ludCA9PT0gdGhpcy5nZXRDZW50ZXJQb2ludChpZCk7XG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xuICAgICAgICBpZiAoZHJvcCkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93RHJhZyAmJiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiZcbiAgICAgICAgICAoZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSB8fCBlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCkpIHtcbiAgICAgICAgICB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb24sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pIHtcbiAgICAgIGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIHN0YXJ0UG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5UUkFOU0ZPUk0sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3AgfSB9KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uIHx8ICFzdGFydERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuICAgIGlmIChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiBlZGl0T2JzZXJ2YWJsZSB8fCB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZywgZmluaXNoQ3JlYXRpb24/OiAocG9zaXRpb246IENhcnRlc2lhbjMpID0+IGJvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcbiAgICAgICAgb2JzZXJ2YWJsZXMuZm9yRWFjaChvYnMgPT4gb2JzLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNQT1NFLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChcbiAgICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICAgIG1ham9yUmFkaXVzOiBudW1iZXIsXG4gICAgICByb3RhdGlvbj86IG51bWJlcixcbiAgICAgIG1pbm9yUmFkaXVzPzogbnVtYmVyLFxuICAgICAgY2VudGVyUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIHJhZGl1c1BvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICBlbGxpcHNlUHJvcD86IEVsbGlwc2VQcm9wcyxcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgZWxsaXBzZS5zZXRNYW51YWxseShjZW50ZXIsIG1ham9yUmFkaXVzLCByb3RhdGlvbiwgbWlub3JSYWRpdXMsIGNlbnRlclBvaW50UHJvcCwgcmFkaXVzUG9pbnRQcm9wLCBlbGxpcHNlUHJvcCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiAodXBkYXRlOiBCYXNpY0VkaXRVcGRhdGU8YW55PiwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xuICAgICAgaWYgKCFmaW5pc2hDcmVhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsbGlwc2VzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24obnVsbCk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDZW50ZXIgPSAoKTogQ2FydGVzaWFuMyA9PiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TWFqb3JSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0TWFqb3JSYWRpdXMoaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRNaW5vclJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRNaW5vclJhZGl1cyhpZCk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyk6IEVsbGlwc2VFZGl0T3B0aW9ucyB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0VMTElQU0VfT1BUSU9OUykpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLmVsbGlwc2VQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLmVsbGlwc2VQcm9wcywgb3B0aW9ucy5lbGxpcHNlUHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvbHlsaW5lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2x5bGluZVByb3BzLCBvcHRpb25zLnBvbHlsaW5lUHJvcHMpO1xuICAgIHJldHVybiBlbGxpcHNlT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9zaXRpb24oaWQ6IHN0cmluZyk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldENlbnRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludChpZDogc3RyaW5nKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5jZW50ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldE1ham9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1ham9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldE1pbm9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1pbm9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyOiBlbGxpcHNlLmdldENlbnRlcigpLFxuICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2V0Um90YXRpb24oKSxcbiAgICAgIG1pbm9yUmFkaXVzOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzKCksXG4gICAgICBtYWpvclJhZGl1czogZWxsaXBzZS5nZXRNYWpvclJhZGl1cygpLFxuICAgICAgbWlub3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgICAgbWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==
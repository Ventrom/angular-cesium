import { __decorate } from "tslib";
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
const ɵ0 = () => Cesium.Color.WHITE;
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
        material: ɵ0,
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
let EllipsesEditorService = class EllipsesEditorService {
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
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
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
                clientEditSubject.next(Object.assign({}, update));
                center = position;
            }
            else {
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
                const changeMode = {
                    id,
                    center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(Object.assign({}, update));
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach(registration => registration.dispose());
                }
                this.observablesMap.delete(id);
                this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
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
                clientEditSubject.next(Object.assign({}, update));
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
        editSubject.next(Object.assign({}, update));
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
            const update = Object.assign({ id, updatedPoint: point, startDragPosition,
                endDragPosition, editMode: EditModes.EDIT, editAction }, this.getEllipseProperties(id));
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update));
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
                const update = Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
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
                const update = Object.assign({ id,
                    startDragPosition,
                    endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
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
    createEditorObservable(observableToExtend, id) {
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
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, this.getEllipseProperties(id)));
        };
        observableToExtend.disable = () => {
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, this.getEllipseProperties(id)));
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
};
EllipsesEditorService = __decorate([
    Injectable()
], EllipsesEditorService);
export { EllipsesEditorService };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBSW5FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkZBQTJGLENBQUM7V0FnQ2xILEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztBQTdCdEMsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQXVCO0lBQ3pELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLDZCQUE2QixFQUFFLFdB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QUVPLGNBQWMsQ0FBQyxFQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVPLG9CQUFvQixDQUFDLEVBQVU7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsT0FBTztZQUNMLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQzNCLFFBQVEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQy9CLFdBQVcsRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3JDLFdBQVcsRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3JDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQywyQkFBMkIsRUFBRTtZQUMvRCx3QkFBd0IsRUFBRSxPQUFPLENBQUMsMkJBQTJCLEVBQUU7U0FDaEUsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFBO0FBdGFZLHFCQUFxQjtJQURqQyxVQUFVLEVBQUU7R0FDQSxxQkFBcUIsQ0FzYWpDO1NBdGFZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucywgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgQmFzaWNFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2Jhc2ljLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUzogRWxsaXBzZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllci5BTFQsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgZWxsaXBzZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBmaWxsOiB0cnVlLFxuICAgIG91dGxpbmU6IHRydWUsXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjgpLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICAgIHpJbmRleDogMCxcbiAgICBzaGFkb3dzOiBDZXNpdW0uU2hhZG93TW9kZS5ESVNBQkxFRCxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuMiksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTMsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICB3aWR0aDogMSxcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLldISVRFLFxuICB9LFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbjogZmFsc2UsXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGVsbGlwc2VzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIEVsbGlwc2VzRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8ZWxsaXBzZS1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPGVsbGlwc2UtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBFbGxpcHNlc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkaXNwb3NlKClgIGZyb20gdGhlIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgZWxsaXBzZVxuICogIGNvbnN0IGVkaXRpbmckID0gZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGVsbGlwc2UgZnJvbSBleGlzdGluZyBjZW50ZXIgcG9pbnQsIHR3byByYWRpdXNlcyBhbmQgcm90YXRpb25cbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmVkaXQoY2VudGVyLCBtYWpvclJhZGl1cywgcm90YXRpb24sIG1pbm9yUmFkaXVzKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8RWxsaXBzZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGVsbGlwc2VzTWFuYWdlcjogRWxsaXBzZXNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG4gIHByaXZhdGUgY2VzaXVtU2NlbmU6IGFueTtcblxuICBpbml0KFxuICAgIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UsXG4gICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlciA9IGVsbGlwc2VzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPEVsbGlwc2VFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX0VMTElQU0VfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgbGV0IGNlbnRlcjogYW55O1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBlbGxpcHNlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IGVsbGlwc2VPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgY2VudGVyID0gcG9zaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNoYW5nZU1vZGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZWRpdEVsbGlwc2UoaWQsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgZWxsaXBzZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChcbiAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgbWFqb3JSYWRpdXM6IG51bWJlcixcbiAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyLFxuICAgIG1pbm9yUmFkaXVzPzogbnVtYmVyLFxuICAgIG9wdGlvbnMgPSBERUZBVUxUX0VMTElQU0VfT1BUSU9OUyxcbiAgICBwcmlvcml0eSA9IDEwMCxcbiAgKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGNlbnRlcixcbiAgICAgIG1ham9yUmFkaXVzLFxuICAgICAgcm90YXRpb24sXG4gICAgICBtaW5vclJhZGl1cyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBlbGxpcHNlT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5lZGl0RWxsaXBzZShpZCwgcHJpb3JpdHksIGVkaXRTdWJqZWN0LCBlbGxpcHNlT3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRFbGxpcHNlKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBlZGl0U3ViamVjdDogU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4sXG4gICAgb3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zLFxuICAgIGVkaXRPYnNlcnZhYmxlPzogRWxsaXBzZUVkaXRvck9ic2VydmFibGUsXG4gICk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybWF0aW9uKSB7XG4gICAgICBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudCxcbiAgICAgICAgbW9kaWZpZXI6IG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcixcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVFbGxpcHNlLFxuICAgICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlRWxsaXBzZSxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgLnBpcGUodGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICAgIGNvbnN0IHBvaW50SXNDZW50ZXIgPSBwb2ludCA9PT0gdGhpcy5nZXRDZW50ZXJQb2ludChpZCk7XG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xuICAgICAgICBpZiAoZHJvcCkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93RHJhZyAmJiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiZcbiAgICAgICAgICAoZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSB8fCBlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCkpIHtcbiAgICAgICAgICB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb24sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pIHtcbiAgICAgIGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIHN0YXJ0UG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5UUkFOU0ZPUk0sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3AgfSB9KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uIHx8ICFzdGFydERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuICAgIGlmIChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiBlZGl0T2JzZXJ2YWJsZSB8fCB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZyk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoXG4gICAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgICBtYWpvclJhZGl1czogbnVtYmVyLFxuICAgICAgcm90YXRpb24/OiBudW1iZXIsXG4gICAgICBtaW5vclJhZGl1cz86IG51bWJlcixcbiAgICAgIGNlbnRlclBvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICByYWRpdXNQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgZWxsaXBzZVByb3A/OiBFbGxpcHNlUHJvcHMsXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGVsbGlwc2Uuc2V0TWFudWFsbHkoY2VudGVyLCBtYWpvclJhZGl1cywgcm90YXRpb24sIG1pbm9yUmFkaXVzLCBjZW50ZXJQb2ludFByb3AsIHJhZGl1c1BvaW50UHJvcCwgZWxsaXBzZVByb3ApO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogKHVwZGF0ZTogQmFzaWNFZGl0VXBkYXRlPGFueT4sIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDZW50ZXIgPSAoKTogQ2FydGVzaWFuMyA9PiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TWFqb3JSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0TWFqb3JSYWRpdXMoaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRNaW5vclJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRNaW5vclJhZGl1cyhpZCk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyk6IEVsbGlwc2VFZGl0T3B0aW9ucyB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0VMTElQU0VfT1BUSU9OUykpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLmVsbGlwc2VQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLmVsbGlwc2VQcm9wcywgb3B0aW9ucy5lbGxpcHNlUHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvbHlsaW5lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2x5bGluZVByb3BzLCBvcHRpb25zLnBvbHlsaW5lUHJvcHMpO1xuICAgIHJldHVybiBlbGxpcHNlT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9zaXRpb24oaWQ6IHN0cmluZyk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldENlbnRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludChpZDogc3RyaW5nKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5jZW50ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldE1ham9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1ham9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldE1pbm9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1pbm9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyOiBlbGxpcHNlLmdldENlbnRlcigpLFxuICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2V0Um90YXRpb24oKSxcbiAgICAgIG1pbm9yUmFkaXVzOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzKCksXG4gICAgICBtYWpvclJhZGl1czogZWxsaXBzZS5nZXRNYWpvclJhZGl1cygpLFxuICAgICAgbWlub3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgICAgbWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==
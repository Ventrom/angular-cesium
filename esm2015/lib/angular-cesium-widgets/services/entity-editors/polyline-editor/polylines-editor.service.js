/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditPolyline } from '../../../models';
import { generateKey } from '../../utils';
/** @type {?} */
export const DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
    polylineProps: {
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
        width: 3,
    },
};
/**
 * Service for creating editable polylines
 *
 *  * You must provide `PolylineEditorService` yourself.
 * PolygonsEditorService works together with `<polylines-editor>` component. Therefor you need to create `<polylines-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolylineEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolylineEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolylineEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolylineEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polyline
 *  const editing$ = polylinesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
export class PolylinesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polylinesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, polylinesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polylineOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const allPositions = this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            (cartesian) => cartesian.equals(position)))) {
                return;
            }
            /** @type {?} */
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    }
    /**
     * @private
     * @param {?} id
     * @param {?} position
     * @param {?} clientEditSubject
     * @param {?} positions
     * @param {?} eventPriority
     * @param {?} polylineOptions
     * @param {?} editorObservable
     * @param {?} finishedCreate
     * @return {?}
     */
    switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        const update = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach((/**
             * @param {?} registration
             * @return {?}
             */
            registration => registration.dispose()));
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_POLYLINE_OPTIONS, priority = 100) {
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polylineOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editPolyline(id, positions, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.editedEntityId),
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop }, entities }) => {
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
            }));
        }
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, drop }, entities }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ entities }) => {
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 3) {
                return;
            }
            /** @type {?} */
            const index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            position => point.getPosition().equals((/** @type {?} */ (position)))));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        /** @type {?} */
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        /** @type {?} */
        const polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps, options.pointProps);
        polylineOptions.polylineProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps, options.polylineProps);
        return polylineOptions;
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polylineProps
         * @return {?}
         */
        (points, polylineProps) => {
            /** @type {?} */
            const polyline = this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        () => this.getPoints(id));
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.polylinesManager.get(id).labels);
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    }
}
PolylinesEditorService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.updateSubject;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.updatePublisher;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.polylinesManager;
    /**
     * @type {?}
     * @private
     */
    PolylinesEditorService.prototype.observablesMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQUM5RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBR2hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQU92RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFFMUMsTUFBTSxPQUFPLHdCQUF3QixHQUF3QjtJQUMzRCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLGlCQUFpQjtJQUNoRCxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsV0FBVztJQUN6QyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLFNBQVMsRUFBRSxJQUFJO0lBQ2YsVUFBVSxFQUFFO1FBQ1YsS0FB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RCwrQ0FBcUM7Ozs7O0lBQ3JDLGtEQUFrRDs7Ozs7SUFDbEQsZ0RBQXdFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVibGlzaCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wb2x5bGluZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMsIFBvbHlsaW5lRWRpdE9wdGlvbnMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BPTFlMSU5FX09QVElPTlM6IFBvbHlsaW5lRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGFkZExhc3RQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0RPVUJMRV9DTElDSyxcbiAgcmVtb3ZlUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICAgIHdpZHRoOiAzLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5bGluZXNcbiAqXG4gKiAgKiBZb3UgbXVzdCBwcm92aWRlIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxwb2x5bGluZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5bGluZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBwb2x5bGluZVxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWxpbmVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5bGluZSBmcm9tIGV4aXN0aW5nIHBvbHlsaW5lIGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnBvbHlsaW5lc0VkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlsaW5lRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgICAgIHBvbHlsaW5lc01hbmFnZXI6IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5wb2x5bGluZXNNYW5hZ2VyID0gcG9seWxpbmVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFBvbHlsaW5lRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9QT0xZTElORV9PUFRJT05TLCBldmVudFByaW9yaXR5ID0gMTAwKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSA9IFtdO1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURVxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBwb2x5bGluZU9wdGlvbnM6IHBvbHlsaW5lT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5bGluZU9wdGlvbnMuYWRkTGFzdFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmZpbmQoKGNhcnRlc2lhbikgPT4gY2FydGVzaWFuLmVxdWFscyhwb3NpdGlvbikpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcbiAgICAgIGlmIChwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzICYmIGFsbFBvc2l0aW9ucy5sZW5ndGggKyAxID09PSBwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzKSB7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgIHBvc2l0aW9ucyxcbiAgICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICAgIHBvbHlsaW5lT3B0aW9ucyxcbiAgICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHBvc2l0aW9uIGFscmVhZHkgYWRkZWQgYnkgYWRkUG9pbnRSZWdpc3RyYXRpb25cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgIGV2ZW50UHJpb3JpdHksXG4gICAgICAgIHBvbHlsaW5lT3B0aW9ucyxcbiAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgZmluaXNoZWRDcmVhdGUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5bGluZShpZCwgcG9zaXRpb25zLCBldmVudFByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWxpbmVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xuICB9XG5cbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5bGluZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogcG9seWxpbmUgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMiBwb3NpdGlvbnMnKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvbHlsaW5lT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcbiAgICB9KTtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIHBvbHlsaW5lT3B0aW9uczogcG9seWxpbmVPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlsaW5lKFxuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgcG9seWxpbmVPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdFBvbHlsaW5lKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+LFxuICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0T2JzZXJ2YWJsZT86IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSkge1xuXG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5yZW1vdmVQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2x5bGluZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7c3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3B9LCBlbnRpdGllc30pID0+IHtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBkcmFnZ2VkUG9zaXRpb246IHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb24ucGlwZShcbiAgICAgIHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe2VudGl0aWVzfSkgPT4ge1xuICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gWy4uLnRoaXMuZ2V0UG9zaXRpb25zKGlkKV07XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5kZXggPSBhbGxQb3NpdGlvbnMuZmluZEluZGV4KHBvc2l0aW9uID0+IHBvaW50LmdldFBvc2l0aW9uKCkuZXF1YWxzKHBvc2l0aW9uIGFzIENhcnRlc2lhbjMpKTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5SRU1PVkVfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX1BPTFlMSU5FX09QVElPTlMpKTtcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgcG9seWxpbmVPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICBwb2x5bGluZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sXG4gICAgICBERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9seWxpbmVQcm9wcywgb3B0aW9ucy5wb2x5bGluZVByb3BzKTtcbiAgICByZXR1cm4gcG9seWxpbmVPcHRpb25zO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcbiAgICAgICAgb2JzZXJ2YWJsZXMuZm9yRWFjaChvYnMgPT4gb2JzLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAocG9pbnRzOiB7XG4gICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgIHBvaW50UHJvcD86IFBvaW50UHJvcHNcbiAgICB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlsaW5lUHJvcHM/OiBQb2x5bGluZVByb3BzKSA9PiB7XG4gICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgcG9seWxpbmUuc2V0TWFudWFsbHkocG9pbnRzLCBwb2x5bGluZVByb3BzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnRzID0gKCkgPT4gdGhpcy5nZXRQb2ludHMoaWQpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBQb2x5bGluZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcG9seWxpbmUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlsaW5lLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuIl19
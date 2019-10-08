/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { generateKey } from '../../utils';
/** @type {?} */
export const DEFAULT_HIPPODROME_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    hippodromeProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        width: 200000.0,
        outline: false,
    },
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
};
/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
export class HippodromeEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} managerService
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
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
    create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const hippodromeOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
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
            /** @type {?} */
            const isFirstPoint = this.getPositions(id).length === 0;
            /** @type {?} */
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            if (!isFirstPoint) {
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
                this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        return editorObservable;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_HIPPODROME_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const hippodromeEditOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editHippodrome(id, priority, editSubject, options, editObservable) {
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
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
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        }));
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
                editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration];
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
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        /** @type {?} */
        const hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
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
         * @param {?} firstPosition
         * @param {?} secondPosition
         * @param {?} widthMeters
         * @param {?=} firstPointProp
         * @param {?=} secondPointProp
         * @return {?}
         */
        (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) => {
            /** @type {?} */
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            const hippodrome = this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
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
        () => this.hippodromeManager.get(id).labels);
        observableToExtend.getCurrentWidth = (/**
         * @return {?}
         */
        () => this.getWidth(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getWidth(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    }
}
HippodromeEditorService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.updateSubject;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.updatePublisher;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.hippodromeManager;
    /**
     * @type {?}
     * @private
     */
    HippodromeEditorService.prototype.observablesMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPdkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFHekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFFMUMsTUFBTSxPQUFPLDBCQUEwQixHQUEwQjtJQUMvRCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLGVBQWUsRUFBRTtRQUNmLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQzND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akQsT0FBTyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBRU8sUUFBUSxDQUFDLEVBQVU7O2NBQ25CLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7WUFqVkYsVUFBVTs7Ozs7OztJQUVULG1EQUFrRDs7Ozs7SUFDbEQsZ0RBQTREOzs7OztJQUM1RCxrREFBOEU7Ozs7O0lBQzlFLHNEQUFpRDs7Ozs7SUFDakQsZ0RBQXFDOzs7OztJQUNyQyxvREFBb0Q7Ozs7O0lBQ3BELGlEQUF3RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9oaXBwb2Ryb21lLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXRvci1vYm9zZXJ2YWJsZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUzogSGlwcG9kcm9tZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIGhpcHBvZHJvbWVQcm9wczoge1xuICAgIG1hdGVyaWFsOiBDZXNpdW0uQ29sb3IuR1JFRU4ud2l0aEFscGhhKDAuNSksXG4gICAgd2lkdGg6IDIwMDAwMC4wLFxuICAgIG91dGxpbmU6IGZhbHNlLFxuICB9LFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxNSxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VydmljZSBmb3IgY3JlYXRpbmcgZWRpdGFibGUgaGlwcG9kcm9tZXNcbiAqXG4gKiBZb3UgbXVzdCBwcm92aWRlIGBIaXBwb2Ryb21lRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBIaXBwb2Ryb21lRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8aGlwcG9kcm9tZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxoaXBwb2Ryb21lcy1lZGl0b3I+YFxuICogZm9yIGVhY2ggYFBvbHlsaW5lRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIGhpcHBvZHJvbWVcbiAqICBjb25zdCBlZGl0aW5nJCA9IGhpcHBvZHJvbWVFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGhpcHBvZHJvbWVzIGZyb20gZXhpc3RpbmcgaGlwcG9kcm9tZXMgY2FydGVzaWFuMyBwb3NpdGlvbnNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuaGlwcG9kcm9tZUVkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGlwcG9kcm9tZUVkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxIaXBwb2Ryb21lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPEhpcHBvZHJvbWVFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBoaXBwb2Ryb21lTWFuYWdlcjogSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICAgICBtYW5hZ2VyU2VydmljZTogSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5oaXBwb2Ryb21lTWFuYWdlciA9IG1hbmFnZXJTZXJ2aWNlO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8SGlwcG9kcm9tZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLCBldmVudFByaW9yaXR5ID0gMTAwKTogSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvc2l0aW9uczogQ2FydGVzaWFuM1tdID0gW107XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGhpcHBvZHJvbWVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEhpcHBvZHJvbWVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURVxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBoaXBwb2Ryb21lT3B0aW9uczogaGlwcG9kcm9tZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IGhpcHBvZHJvbWVPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb25dKTtcbiAgICBjb25zdCBlZGl0b3JPYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGNsaWVudEVkaXRTdWJqZWN0LCBpZCk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKTtcbiAgICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKS5sZW5ndGggPT09IDA7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKGlkKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWlzRmlyc3RQb2ludCkge1xuICAgICAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZWRpdEhpcHBvZHJvbWUoaWQsIGV2ZW50UHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBoaXBwb2Ryb21lT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBpZiAocG9zaXRpb25zLmxlbmd0aCAhPT0gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIaXBwb2Ryb21lIGVkaXRvciBlcnJvciBlZGl0KCk6IHBvbHlnb24gc2hvdWxkIGhhdmUgMiBwb3NpdGlvbnMgYnV0IHJlY2VpdmVkICcgKyBwb3NpdGlvbnMpO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgaGlwcG9kcm9tZUVkaXRPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxIaXBwb2Ryb21lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElUXG4gICAgfSk7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBoaXBwb2Ryb21lT3B0aW9uczogaGlwcG9kcm9tZUVkaXRPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB3aWR0aDogdGhpcy5nZXRXaWR0aChpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdEhpcHBvZHJvbWUoXG4gICAgICBpZCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBoaXBwb2Ryb21lRWRpdE9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGl0SGlwcG9kcm9tZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8SGlwcG9kcm9tZUVkaXRVcGRhdGU+LFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0T2JzZXJ2YWJsZT86IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlKTogSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGUge1xuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5kcmFnU2hhcGVFdmVudCxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVIaXBwb2Ryb21lLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb24ucGlwZShcbiAgICAgIHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgICB3aWR0aDogdGhpcy5nZXRXaWR0aChpZCksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5nZXRXaWR0aChpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyk6IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUykpO1xuICAgIGNvbnN0IGhpcHBvZHJvbWVPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGhpcHBvZHJvbWVPcHRpb25zLmhpcHBvZHJvbWVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLmhpcHBvZHJvbWVQcm9wcywgb3B0aW9ucy5oaXBwb2Ryb21lUHJvcHMpO1xuICAgIGhpcHBvZHJvbWVPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIHJldHVybiBoaXBwb2Ryb21lT3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nKTogSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGUge1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcbiAgICAgICAgb2JzZXJ2YWJsZXMuZm9yRWFjaChvYnMgPT4gb2JzLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoZmlyc3RQb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoTWV0ZXJzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9pbnRQcm9wPzogUG9pbnRQcm9wcykgPT4ge1xuICAgICAgY29uc3QgZmlyc3RQID0gbmV3IEVkaXRQb2ludChpZCwgZmlyc3RQb3NpdGlvbiwgZmlyc3RQb2ludFByb3AgPyBmaXJzdFBvaW50UHJvcCA6IERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLnBvaW50UHJvcHMpO1xuICAgICAgY29uc3Qgc2VjUCA9IG5ldyBFZGl0UG9pbnQoaWQsIHNlY29uZFBvc2l0aW9uLCBzZWNvbmRQb2ludFByb3AgPyBzZWNvbmRQb2ludFByb3AgOiBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUy5wb2ludFByb3BzKTtcblxuICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGhpcHBvZHJvbWUuc2V0UG9pbnRzTWFudWFsbHkoW2ZpcnN0UCwgc2VjUF0sIHdpZHRoTWV0ZXJzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRXaWR0aCA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRXaWR0aChpZCk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbnMoaWQ6IGFueSkge1xuICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIGhpcHBvZHJvbWUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IGFueSkge1xuICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIGhpcHBvZHJvbWUuZ2V0UmVhbFBvaW50cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRXaWR0aChpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gaGlwcG9kcm9tZS5nZXRXaWR0aCgpO1xuICB9XG59XG4iXX0=
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
import { EditablePolygon } from '../../../models/editable-polygon';
import { generateKey } from '../../utils';
/** @type {?} */
export const DEFAULT_POLYGON_OPTIONS = {
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
    polygonProps: {
        material: new Cesium.Color(0.1, 0.5, 0.2, 0.4),
    },
    polylineProps: {
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
        width: 1,
    },
};
/**
 * Service for creating editable polygons
 *
 * You must provide `PolygonsEditorService` yourself.
 * PolygonsEditorService works together with `<polygons-editor>` component. Therefor you need to create `<polygons-editor>`
 * for each `PolygonsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolygonEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolygonEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolygonEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolygonEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polygon
 *  const editing$ = polygonsEditorService.create();
 *  this.editing$.subscribe(editResult => {
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
export class PolygonsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polygonsManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, polygonsManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
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
     * @param {?=} priority
     * @return {?}
     */
    create(options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
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
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
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
            finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    }
    /**
     * @private
     * @param {?} id
     * @param {?} position
     * @param {?} clientEditSubject
     * @param {?} positions
     * @param {?} priority
     * @param {?} polygonOptions
     * @param {?} editorObservable
     * @param {?} finishedCreate
     * @return {?}
     */
    switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        const updateValue = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
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
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
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
    editPolygon(id, positions, priority, editSubject, options, editObservable) {
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
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
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
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ entities }) => {
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 4) {
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
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        /** @type {?} */
        const polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps, options.pointProps);
        polygonOptions.polygonProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps, options.polygonProps);
        polygonOptions.polylineProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps, options.polylineProps);
        return polygonOptions;
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
         * @param {?=} polygonProps
         * @return {?}
         */
        (points, polygonProps) => {
            /** @type {?} */
            const polygon = this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
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
        () => this.polygonsManager.get(id).labels);
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    }
}
PolygonsEditorService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.updateSubject;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.updatePublisher;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.polygonsManager;
    /**
     * @type {?}
     * @private
     */
    PolygonsEditorService.prototype.observablesMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFFOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFLdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBSW5FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRTFDLE1BQU0sT0FBTyx1QkFBdUIsR0FBdUI7SUFDekQsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxpQkFBaUI7SUFDaEQsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFdBQVc7SUFDekMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLFVBQVUsRUFBRTtRQUNWLEtBQUss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QyxFQUFVOztjQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBRU8sU0FBUyxDQUFDLEVBQVU7O2NBQ3BCLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDNUMsT0FBTyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakMsQ0FBQzs7O1lBdmFGLFVBQVU7Ozs7Ozs7SUFFVCxpREFBa0Q7Ozs7O0lBQ2xELDhDQUF5RDs7Ozs7SUFDekQsZ0RBQTJFOzs7OztJQUMzRSxvREFBaUQ7Ozs7O0lBQ2pELDhDQUFxQzs7Ozs7SUFDckMsZ0RBQWdEOzs7OztJQUNoRCwrQ0FBd0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5Z29uc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wb2x5Z29ucy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBFZGl0YWJsZVBvbHlnb24gfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtcG9seWdvbic7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdE9wdGlvbnMsIFBvbHlnb25Qcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5Z29uLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QT0xZR09OX09QVElPTlM6IFBvbHlnb25FZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgYWRkTGFzdFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfRE9VQkxFX0NMSUNLLFxuICByZW1vdmVQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxNSxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgfSxcbiAgcG9seWdvblByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IG5ldyBDZXNpdW0uQ29sb3IoMC4xLCAwLjUsIDAuMiwgMC40KSxcbiAgfSxcbiAgcG9seWxpbmVQcm9wczoge1xuICAgIG1hdGVyaWFsOiAoKSA9PiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgd2lkdGg6IDEsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIHBvbHlnb25zXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgUG9seWdvbnNFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIFBvbHlnb25zRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8cG9seWdvbnMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5Z29ucy1lZGl0b3I+YFxuICogZm9yIGVhY2ggYFBvbHlnb25zRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgUG9seWdvbkVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgcG9seWdvblxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWdvbnNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IHBvbHlnb24gZnJvbSBleGlzdGluZyBwb2x5Z29uIHBvc2l0aW9uc1xuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5wb2x5Z29uc0VkaXRvclNlcnZpY2UuZWRpdChpbml0aWFsUG9zKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlnb25zRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlnb25FZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8UG9seWdvbkVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIHBvbHlnb25zTWFuYWdlcjogUG9seWdvbnNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgcG9seWdvbnNNYW5hZ2VyOiBQb2x5Z29uc01hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5wb2x5Z29uc01hbmFnZXIgPSBwb2x5Z29uc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxQb2x5Z29uRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9QT0xZR09OX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUG9seWdvbkVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvc2l0aW9uczogQ2FydGVzaWFuM1tdID0gW107XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvbHlnb25PcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlnb25FZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURVxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBwb2x5Z29uT3B0aW9uczogcG9seWdvbk9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHBvbHlnb25PcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5Z29uT3B0aW9ucy5hZGRMYXN0UG9pbnRFdmVudCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbiwgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcblxuICAgICAgaWYgKHBvbHlnb25PcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBhbGxQb3NpdGlvbnMubGVuZ3RoICsgMSA9PT0gcG9seWdvbk9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzKSB7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgIHBvc2l0aW9ucyxcbiAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICBwb2x5Z29uT3B0aW9ucyxcbiAgICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gcG9zaXRpb24gYWxyZWFkeSBhZGRlZCBieSBhZGRQb2ludFJlZ2lzdHJhdGlvblxuICAgICAgZmluaXNoZWRDcmVhdGUgPSB0aGlzLnN3aXRjaFRvRWRpdE1vZGUoXG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgIHBvc2l0aW9ucyxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVG9FZGl0TW9kZShpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWdvbk9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWRDcmVhdGU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoYW5nZU1vZGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgIHRoaXMuZWRpdFBvbHlnb24oaWQsIHBvc2l0aW9ucywgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBwb2x5Z29uT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgIHJldHVybiBmaW5pc2hlZENyZWF0ZTtcbiAgfVxuXG4gIGVkaXQocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sIG9wdGlvbnMgPSBERUZBVUxUX1BPTFlHT05fT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPCAzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvbHlnb25zIGVkaXRvciBlcnJvciBlZGl0KCk6IHBvbHlnb24gc2hvdWxkIGhhdmUgYXQgbGVhc3QgMyBwb3NpdGlvbnMnKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvbHlnb25PcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElUXG4gICAgfSk7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBwb2x5Z29uT3B0aW9uczogcG9seWdvbk9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5lZGl0UG9seWdvbihcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBlZGl0U3ViamVjdCxcbiAgICAgIHBvbHlnb25PcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdFBvbHlnb24oaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PFBvbHlnb25FZGl0VXBkYXRlPixcbiAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBQb2x5Z29uRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSk6IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIHtcblxuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdTaGFwZUV2ZW50LFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZVBvbHlnb24sXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5yZW1vdmVQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb24ucGlwZShcbiAgICAgIHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge3N0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZHJhZ2dlZFBvc2l0aW9uOiBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7ZW50aXRpZXN9KSA9PiB7XG4gICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSBbLi4udGhpcy5nZXRQb3NpdGlvbnMoaWQpXTtcbiAgICAgIGlmIChhbGxQb3NpdGlvbnMubGVuZ3RoIDwgNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleCA9IGFsbFBvc2l0aW9ucy5maW5kSW5kZXgocG9zaXRpb24gPT4gcG9pbnQuZ2V0UG9zaXRpb24oKS5lcXVhbHMocG9zaXRpb24gYXMgQ2FydGVzaWFuMykpO1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlJFTU9WRV9QT0lOVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb24sIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gZWRpdE9ic2VydmFibGUgfHwgdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogUG9seWdvbkVkaXRPcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzICYmIG9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzIDwgMykge1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuOiBQb2x5Z29uRWRpdG9yIGludmFsaWQgb3B0aW9uLicgK1xuICAgICAgICAnIG1heGltdW1OdW1iZXJPZlBvaW50cyBzbWFsbGVyIHRoZW4gMywgbWF4aW11bU51bWJlck9mUG9pbnRzIGNoYW5nZWQgdG8gMycpO1xuICAgICAgb3B0aW9ucy5tYXhpbXVtTnVtYmVyT2ZQb2ludHMgPSAzO1xuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9QT0xZR09OX09QVElPTlMpKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9QT0xZR09OX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2x5Z29uUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1BPTFlHT05fT1BUSU9OUy5wb2x5Z29uUHJvcHMsIG9wdGlvbnMucG9seWdvblByb3BzKTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2x5bGluZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9QT0xZR09OX09QVElPTlMucG9seWxpbmVQcm9wcywgb3B0aW9ucy5wb2x5bGluZVByb3BzKTtcbiAgICByZXR1cm4gcG9seWdvbk9wdGlvbnM7XG4gIH1cblxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZyk6IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKHBvaW50czoge1xuICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsIHBvaW50UHJvcHM6IFBvaW50UHJvcHNcbiAgICB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlnb25Qcm9wcz86IFBvbHlnb25Qcm9wcykgPT4ge1xuICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBwb2x5Z29uLnNldFBvaW50c01hbnVhbGx5KHBvaW50cywgcG9seWdvblByb3BzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpLmxhYmVscztcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgUG9seWdvbkVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlnb24uZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5Z29uLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuIl19
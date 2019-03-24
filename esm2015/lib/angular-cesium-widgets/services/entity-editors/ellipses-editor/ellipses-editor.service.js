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
import { EditableEllipse } from '../../../models/editable-ellipse';
import { generateKey } from '../../utils';
import { CesiumEventModifier } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
/** @type {?} */
export const DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: true,
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK,
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
    polylineProps: {
        width: 1,
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
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
 * 				console.log(editResult.positions);
 * 		});
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
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} ellipsesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, ellipsesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
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
    create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        /** @type {?} */
        let center;
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const ellipseOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
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
            if (!center) {
                /** @type {?} */
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
                /** @type {?} */
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
                /** @type {?} */
                const changeMode = {
                    id,
                    center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(Object.assign({}, update));
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    registration => registration.dispose()));
                }
                this.observablesMap.delete(id);
                this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
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
        }));
        return editorObservable;
    }
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(center, majorRadius, rotation = Math.PI / 2, minorRadius, options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const ellipseOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
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
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editEllipse(id, priority, editSubject, options, editObservable) {
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
        let addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
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
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        pointDragRegistration
            .pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, startPosition, drop }, entities }) => {
            /** @type {?} */
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const pointIsCenter = point === this.getCenterPoint(id);
            /** @type {?} */
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            /** @type {?} */
            const update = Object.assign({ id, updatedPoint: point, startDragPosition,
                endDragPosition, editMode: EditModes.EDIT, editAction }, this.getEllipseProperties(id));
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update));
        }));
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { endPosition, startPosition, drop }, entities }) => {
                /** @type {?} */
                const update = Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            }));
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
            ({ movement: { startPosition, endPosition, drop } }) => {
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = Object.assign({ id,
                    startDragPosition,
                    endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration, addSecondRadiusRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
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
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.CREATE_OR_EDIT, editAction: EditActions.DISPOSE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.setManually = (/**
         * @param {?} center
         * @param {?} majorRadius
         * @param {?=} rotation
         * @param {?=} minorRadius
         * @param {?=} centerPointProp
         * @param {?=} radiusPointProp
         * @param {?=} ellipseProp
         * @return {?}
         */
        (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) => {
            /** @type {?} */
            const ellipse = this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
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
            this.updateSubject.next((/** @type {?} */ ({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            })));
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next((/** @type {?} */ ({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            })));
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.ellipsesManager.get(id).labels);
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        () => this.getCenterPosition(id));
        observableToExtend.getMajorRadius = (/**
         * @return {?}
         */
        () => this.getMajorRadius(id));
        observableToExtend.getMinorRadius = (/**
         * @return {?}
         */
        () => this.getMinorRadius(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        /** @type {?} */
        const ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPosition(id) {
        return this.ellipsesManager.get(id).getCenter();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPoint(id) {
        return this.ellipsesManager.get(id).center;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getMajorRadius(id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getMinorRadius(id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getEllipseProperties(id) {
        /** @type {?} */
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
}
EllipsesEditorService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.updateSubject;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.updatePublisher;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.ellipsesManager;
    /**
     * @type {?}
     * @private
     */
    EllipsesEditorService.prototype.observablesMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBSW5FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkZBQTJGLENBQUM7O0FBRWhJLE1BQU0sT0FBTyx1QkFBdUIsR0FBdUI7SUFDekQsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsNkJBQTZCLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckQscUNBQXFDLEVBQUUsbUJBQW1CLENBQUMsR0FBRztJ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QUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsRCxDQUFDOzs7Ozs7SUFFTyxjQUFjLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM3QyxDQUFDOzs7Ozs7SUFFTyxjQUFjLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7Ozs7OztJQUVPLGNBQWMsQ0FBQyxFQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdkQsQ0FBQzs7Ozs7O0lBRU8sb0JBQW9CLENBQUMsRUFBVTs7Y0FDL0IsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxPQUFPO1lBQ0wsTUFBTSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDM0IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDL0IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDckMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDckMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLDJCQUEyQixFQUFFO1lBQy9ELHdCQUF3QixFQUFFLE9BQU8sQ0FBQywyQkFBMkIsRUFBRTtTQUNoRSxDQUFDO0lBQ0osQ0FBQzs7O1lBN1pGLFVBQVU7Ozs7Ozs7SUFFVCxpREFBa0Q7Ozs7O0lBQ2xELDhDQUF5RDs7Ozs7SUFDekQsZ0RBQTJFOzs7OztJQUMzRSxvREFBaUQ7Ozs7O0lBQ2pELDhDQUFxQzs7Ozs7SUFDckMsZ0RBQWdEOzs7OztJQUNoRCwrQ0FBd0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9lbGxpcHNlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdE9wdGlvbnMsIEVsbGlwc2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFZGl0YWJsZUVsbGlwc2UgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtZWxsaXBzZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEJhc2ljRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9iYXNpYy1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUzogRWxsaXBzZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllci5BTFQsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgZWxsaXBzZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5HUkVFTi53aXRoQWxwaGEoMC41KSxcbiAgICBvdXRsaW5lOiB0cnVlLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICB3aWR0aDogMSxcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICB9LFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbjogZmFsc2UsXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGVsbGlwc2VzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIEVsbGlwc2VzRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8ZWxsaXBzZS1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPGVsbGlwc2UtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBFbGxpcHNlc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkaXNwb3NlKClgIGZyb20gdGhlIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgZWxsaXBzZVxuICogIGNvbnN0IGVkaXRpbmckID0gZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGVsbGlwc2UgZnJvbSBleGlzdGluZyBjZW50ZXIgcG9pbnQsIHR3byByYWRpdXNlcyBhbmQgcm90YXRpb25cbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmVkaXQoY2VudGVyLCBtYWpvclJhZGl1cywgcm90YXRpb24sIG1pbm9yUmFkaXVzKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8RWxsaXBzZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGVsbGlwc2VzTWFuYWdlcjogRWxsaXBzZXNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG5cbiAgaW5pdChcbiAgICBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgZWxsaXBzZXNNYW5hZ2VyOiBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlciA9IGVsbGlwc2VzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPEVsbGlwc2VFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX0VMTElQU0VfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgbGV0IGNlbnRlcjogYW55O1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBlbGxpcHNlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogZWxsaXBzZU9wdGlvbnMuYWRkUG9pbnRFdmVudCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgY2VudGVyID0gcG9zaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNoYW5nZU1vZGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZWRpdEVsbGlwc2UoaWQsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgZWxsaXBzZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBlZGl0KFxuICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICBtYWpvclJhZGl1czogbnVtYmVyLFxuICAgIHJvdGF0aW9uID0gTWF0aC5QSSAvIDIsXG4gICAgbWlub3JSYWRpdXM/OiBudW1iZXIsXG4gICAgb3B0aW9ucyA9IERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLFxuICAgIHByaW9yaXR5ID0gMTAwLFxuICApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgY2VudGVyLFxuICAgICAgbWFqb3JSYWRpdXMsXG4gICAgICByb3RhdGlvbixcbiAgICAgIG1pbm9yUmFkaXVzLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGVsbGlwc2VPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVkaXRFbGxpcHNlKGlkLCBwcmlvcml0eSwgZWRpdFN1YmplY3QsIGVsbGlwc2VPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdEVsbGlwc2UoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPixcbiAgICBvcHRpb25zOiBFbGxpcHNlRWRpdE9wdGlvbnMsXG4gICAgZWRpdE9ic2VydmFibGU/OiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSxcbiAgKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbikge1xuICAgICAgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnQsXG4gICAgICAgIG1vZGlmaWVyOiBvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50TW9kaWZpZXIsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlRWxsaXBzZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdTaGFwZUV2ZW50LFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZUVsbGlwc2UsXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb25cbiAgICAgIC5waXBlKHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgICBjb25zdCBwb2ludElzQ2VudGVyID0gcG9pbnQgPT09IHRoaXMuZ2V0Q2VudGVyUG9pbnQoaWQpO1xuICAgICAgICBsZXQgZWRpdEFjdGlvbjtcbiAgICAgICAgaWYgKGRyb3ApIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHBvaW50SXNDZW50ZXIgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd0RyYWcgJiYgKGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgfHwgZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0gpKSB7XG4gICAgICAgICAgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKSB7XG4gICAgICBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbiwgc3RhcnRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5UUkFOU0ZPUk0sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcH19KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uIHx8ICFzdGFydERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcbiAgICAgICAgb2JzZXJ2YWJsZXMuZm9yRWFjaChvYnMgPT4gb2JzLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNQT1NFLFxuICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoXG4gICAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgICBtYWpvclJhZGl1czogbnVtYmVyLFxuICAgICAgcm90YXRpb24/OiBudW1iZXIsXG4gICAgICBtaW5vclJhZGl1cz86IG51bWJlcixcbiAgICAgIGNlbnRlclBvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICByYWRpdXNQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgZWxsaXBzZVByb3A/OiBFbGxpcHNlUHJvcHMsXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGVsbGlwc2Uuc2V0TWFudWFsbHkoY2VudGVyLCBtYWpvclJhZGl1cywgcm90YXRpb24sIG1pbm9yUmFkaXVzLCBjZW50ZXJQb2ludFByb3AsIHJhZGl1c1BvaW50UHJvcCwgZWxsaXBzZVByb3ApO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogKHVwZGF0ZTogQmFzaWNFZGl0VXBkYXRlPGFueT4sIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDZW50ZXIgPSAoKTogQ2FydGVzaWFuMyA9PiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TWFqb3JSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0TWFqb3JSYWRpdXMoaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRNaW5vclJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRNaW5vclJhZGl1cyhpZCk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyk6IEVsbGlwc2VFZGl0T3B0aW9ucyB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0VMTElQU0VfT1BUSU9OUykpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLmVsbGlwc2VQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLmVsbGlwc2VQcm9wcywgb3B0aW9ucy5lbGxpcHNlUHJvcHMpO1xuICAgIGVsbGlwc2VPcHRpb25zLnBvbHlsaW5lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5wb2x5bGluZVByb3BzLCBvcHRpb25zLnBvbHlsaW5lUHJvcHMpO1xuICAgIHJldHVybiBlbGxpcHNlT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9zaXRpb24oaWQ6IHN0cmluZyk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldENlbnRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludChpZDogc3RyaW5nKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5jZW50ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldE1ham9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1ham9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldE1pbm9yUmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmdldE1pbm9yUmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyOiBlbGxpcHNlLmdldENlbnRlcigpLFxuICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2V0Um90YXRpb24oKSxcbiAgICAgIG1pbm9yUmFkaXVzOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzKCksXG4gICAgICBtYWpvclJhZGl1czogZWxsaXBzZS5nZXRNYWpvclJhZGl1cygpLFxuICAgICAgbWlub3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgICAgbWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==
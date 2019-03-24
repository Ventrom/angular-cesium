/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { publish, tap } from 'rxjs/operators';
import { GeoUtilsService } from '../../../../angular-cesium/services/geo-utils/geo-utils.service';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableCircle } from '../../../models/editable-circle';
import { generateKey } from '../../utils';
/** @type {?} */
export const DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: false,
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
};
/**
 * Service for creating editable circles
 *
 * You must provide `CircleEditorService` yourself.
 * PolygonsEditorService works together with `<circle-editor>` component. Therefor you need to create `<circle-editor>`
 * for each `CircleEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `CircleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `CircleEditorObservable`.
 * + To stop editing call `dsipose()` from the `CircleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `CircleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating circle
 *  const editing$ = circlesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
export class CirclesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} circlesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
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
    create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        /** @type {?} */
        let center;
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const circleOptions = this.setOptions(options);
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
            circleOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
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
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                center = position;
            }
            else {
                /** @type {?} */
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                /** @type {?} */
                const changeMode = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    registration => registration.dispose()));
                }
                this.observablesMap.delete(id);
                this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
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
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
            }
        }));
        return editorObservable;
    }
    /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(center, radius, options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const circleOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        /** @type {?} */
        const update = {
            id,
            center,
            radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
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
    editCircle(id, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
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
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
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
            const update = {
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
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
            ({ movement: { startPosition, endPosition, drop } }) => {
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    center: this.getCenterPosition(id),
                    radiusPoint: this.getRadiusPosition(id),
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
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
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
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
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
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
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} center
         * @param {?} radius
         * @param {?=} centerPointProp
         * @param {?=} radiusPointProp
         * @param {?=} circleProp
         * @return {?}
         */
        (center, radius, centerPointProp, radiusPointProp, circleProp) => {
            /** @type {?} */
            const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            /** @type {?} */
            const circle = this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.circlesManager.get(id).labels);
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        () => this.getCenterPosition(id));
        observableToExtend.getRadius = (/**
         * @return {?}
         */
        () => this.getRadius(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        /** @type {?} */
        const circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPosition(id) {
        return this.circlesManager.get(id).getCenter();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPoint(id) {
        return this.circlesManager.get(id).center;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getRadiusPosition(id) {
        return this.circlesManager.get(id).getRadiusPoint();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getRadius(id) {
        return this.circlesManager.get(id).getRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCircleProperties(id) {
        /** @type {?} */
        const circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    }
}
CirclesEditorService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.updateSubject;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.updatePublisher;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.circlesManager;
    /**
     * @type {?}
     * @private
     */
    CirclesEditorService.prototype.observablesMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBTzlHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUlqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUcxQyxNQUFNLE9BQU8sc0JBQXNCLEdBQXNCO0lBQ3ZELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLFNBQVMsRUFBRSxJQUFJO0lBQ2YsV0FBVyxFQUFFO1FBQ1gsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FB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QyxTQUFTLEVBQUUsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxFQUFVOztjQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzFDLE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUMxQixXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUNwQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtTQUMzQixDQUFDO0lBQ0osQ0FBQzs7O1lBL1hGLFVBQVU7Ozs7Ozs7SUFFVCxnREFBa0Q7Ozs7O0lBQ2xELDZDQUF3RDs7Ozs7SUFDeEQsK0NBQTBFOzs7OztJQUMxRSxtREFBaUQ7Ozs7O0lBQ2pELDZDQUFxQzs7Ozs7SUFDckMsOENBQThDOzs7OztJQUM5Qyw4Q0FBd0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmFzaWNFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2Jhc2ljLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XG5pbXBvcnQgeyBFbGxpcHNlUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENpcmNsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DSVJDTEVfT1BUSU9OUzogQ2lyY2xlRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgY2lyY2xlUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogQ2VzaXVtLkNvbG9yLkdSRUVOLndpdGhBbHBoYSgwLjUpLFxuICAgIG91dGxpbmU6IGZhbHNlLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICB3aWR0aDogMSxcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBjaXJjbGVzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgQ2lyY2xlRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPGNpcmNsZS1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPGNpcmNsZS1lZGl0b3I+YFxuICogZm9yIGVhY2ggYENpcmNsZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYENpcmNsZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZHNpcG9zZSgpYCBmcm9tIHRoZSBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYENpcmNsZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgY2lyY2xlXG4gKiAgY29uc3QgZWRpdGluZyQgPSBjaXJjbGVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBjaXJjbGUgZnJvbSBleGlzdGluZyBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1c1xuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5jaXJjbGVzRWRpdG9yU2VydmljZS5lZGl0KGNlbnRlciwgcmFkaXVzKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENpcmNsZXNFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPENpcmNsZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuXG4gIGluaXQoXG4gICAgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuY2lyY2xlc01hbmFnZXIgPSBjaXJjbGVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPENpcmNsZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfQ0lSQ0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgbGV0IGNlbnRlcjogYW55O1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxDaXJjbGVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgY2lyY2xlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNlbnRlciA9IHBvc2l0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZWRpdENpcmNsZShpZCwgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBjaXJjbGVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgcmFkaXVzUG9pbnQ6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyLCBvcHRpb25zID0gREVGQVVMVF9DSVJDTEVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmFkaXVzUG9pbnQ6IENhcnRlc2lhbjMgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGNlbnRlcixcbiAgICAgIHJhZGl1c1BvaW50LFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGNpcmNsZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVkaXRDaXJjbGUoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgY2lyY2xlT3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRDaXJjbGUoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+LFxuICAgIG9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zLFxuICAgIGVkaXRPYnNlcnZhYmxlPzogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSxcbiAgKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICB9KTtcblxuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZUNpcmNsZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb24sIHN0YXJ0UG9zaXRpb24sIGRyb3B9LCBlbnRpdGllc30pID0+IHtcbiAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICAgIGNvbnN0IHBvaW50SXNDZW50ZXIgPSBwb2ludCA9PT0gdGhpcy5nZXRDZW50ZXJQb2ludChpZCk7XG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xuICAgICAgICBpZiAoZHJvcCkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93RHJhZyAmJiAoZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSB8fCBlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCkpIHtcbiAgICAgICAgICB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb24sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7c3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3B9fSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbiB8fCAhc3RhcnREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXG4gICAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gZWRpdE9ic2VydmFibGUgfHwgdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNQT1NFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKFxuICAgICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgICAgcmFkaXVzOiBudW1iZXIsXG4gICAgICBjZW50ZXJQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgcmFkaXVzUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIGNpcmNsZVByb3A/OiBFbGxpcHNlUHJvcHMsXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCByYWRpdXNQb2ludCA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2VudGVyLCByYWRpdXMsIE1hdGguUEkgLyAyLCB0cnVlKTtcbiAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGNpcmNsZS5zZXRNYW51YWxseShjZW50ZXIsIHJhZGl1c1BvaW50LCBjZW50ZXJQb2ludFByb3AsIHJhZGl1c1BvaW50UHJvcCwgY2lyY2xlUHJvcCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiAodXBkYXRlOiBCYXNpY0VkaXRVcGRhdGU8YW55PiwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmxhYmVscztcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q2VudGVyID0gKCk6IENhcnRlc2lhbjMgPT4gdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRSYWRpdXMoaWQpO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zKTogQ2lyY2xlRWRpdE9wdGlvbnMge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9DSVJDTEVfT1BUSU9OUykpO1xuICAgIGNvbnN0IGNpcmNsZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgY2lyY2xlT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DSVJDTEVfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIGNpcmNsZU9wdGlvbnMuY2lyY2xlUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0NJUkNMRV9PUFRJT05TLmNpcmNsZVByb3BzLCBvcHRpb25zLmNpcmNsZVByb3BzKTtcbiAgICBjaXJjbGVPcHRpb25zLnBvbHlsaW5lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0NJUkNMRV9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIG9wdGlvbnMucG9seWxpbmVQcm9wcyk7XG4gICAgcmV0dXJuIGNpcmNsZU9wdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIGdldENlbnRlclBvc2l0aW9uKGlkOiBzdHJpbmcpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldENlbnRlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludChpZDogc3RyaW5nKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmNlbnRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmFkaXVzUG9zaXRpb24oaWQ6IHN0cmluZyk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuZ2V0UmFkaXVzUG9pbnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmFkaXVzKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuZ2V0UmFkaXVzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENpcmNsZVByb3BlcnRpZXMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4ge1xuICAgICAgY2VudGVyOiBjaXJjbGUuZ2V0Q2VudGVyKCksXG4gICAgICByYWRpdXNQb2ludDogY2lyY2xlLmdldFJhZGl1c1BvaW50KCksXG4gICAgICByYWRpdXM6IGNpcmNsZS5nZXRSYWRpdXMoKSxcbiAgICB9O1xuICB9XG59XG4iXX0=
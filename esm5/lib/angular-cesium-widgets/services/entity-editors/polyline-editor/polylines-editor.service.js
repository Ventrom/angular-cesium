/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
export var DEFAULT_POLYLINE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var PolylinesEditorService = /** @class */ (function () {
    function PolylinesEditorService() {
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
    PolylinesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polylinesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, polylinesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    PolylinesEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    PolylinesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polylineOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
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
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var allPositions = _this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            function (cartesian) { return cartesian.equals(position); }))) {
                return;
            }
            /** @type {?} */
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(tslib_1.__assign({}, updateValue, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    };
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
    PolylinesEditorService.prototype.switchToEditMode = /**
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
    function (id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        var update = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(tslib_1.__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        var changeMode = {
            id: id,
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
            function (registration) { return registration.dispose(); }));
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolylinesEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polylineOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(tslib_1.__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    };
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
    PolylinesEditorService.prototype.editPolyline = /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.editedEntityId; }),
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(tslib_1.__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            }));
        }
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(tslib_1.__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var entities = _a.entities;
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var allPositions = tslib_1.__spread(_this.getPositions(id));
            if (allPositions.length < 3) {
                return;
            }
            /** @type {?} */
            var index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            function (position) { return point.getPosition().equals((/** @type {?} */ (position))); }));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(tslib_1.__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        /** @type {?} */
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    PolylinesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        /** @type {?} */
        var polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps, options.pointProps);
        polylineOptions.polylineProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps, options.polylineProps);
        return polylineOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polylineProps
         * @return {?}
         */
        function (points, polylineProps) {
            /** @type {?} */
            var polyline = _this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        function () { return _this.getPoints(id); });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.polylinesManager.get(id).labels; });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    };
    PolylinesEditorService.decorators = [
        { type: Injectable }
    ];
    return PolylinesEditorService;
}());
export { PolylinesEditorService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRTFDLE1BQU0sS0FBTyx3QkFBd0IsR0FBd0I7SUFDM0QsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxpQkFBaUI7SUFDaEQsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFdBQVc7SUFDekMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLFVBQVUsRUFBRTtRQUNWLEtB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VUFBa0IsRUFBVTs7WUFDcEIsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzlDLE9BQU8sUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2xDLENBQUM7O2dCQWhhRixVQUFVOztJQWlhWCw2QkFBQztDQUFBLEFBamFELElBaWFDO1NBaGFZLHNCQUFzQjs7Ozs7O0lBQ2pDLGtEQUFrRDs7Ozs7SUFDbEQsK0NBQTBEOzs7OztJQUMxRCxpREFBNEU7Ozs7O0lBQzVFLHFEQUFpRDs7Ozs7SUFDakQsK0NBQXFDOzs7OztJQUNyQyxrREFBa0Q7Ozs7O0lBQ2xELGdEQUF3RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vcG9seWxpbmVzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzLCBQb2x5bGluZUVkaXRPcHRpb25zLCBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVkaXRQb2x5bGluZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QT0xZTElORV9PUFRJT05TOiBQb2x5bGluZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBhZGRMYXN0UG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9ET1VCTEVfQ0xJQ0ssXG4gIHJlbW92ZVBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjkpLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDE1LFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICB9LFxuICBwb2x5bGluZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6ICgpID0+IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICB3aWR0aDogMyxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VydmljZSBmb3IgY3JlYXRpbmcgZWRpdGFibGUgcG9seWxpbmVzXG4gKlxuICogICogWW91IG11c3QgcHJvdmlkZSBgUG9seWxpbmVFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIFBvbHlnb25zRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8cG9seWxpbmVzLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8cG9seWxpbmVzLWVkaXRvcj5gXG4gKiBmb3IgZWFjaCBgUG9seWxpbmVFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cbiAqXG4gKiArIGBjcmVhdGVgIGZvciBzdGFydGluZyBhIGNyZWF0aW9uIG9mIHRoZSBzaGFwZSBvdmVyIHRoZSBtYXAuIFJldHVybnMgYSBleHRlbnNpb24gb2YgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBQb2x5bGluZUVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXG4gKlxuICogKipMYWJlbHMgb3ZlciBlZGl0dGVkIHNoYXBlcyoqXG4gKiBBbmd1bGFyIENlc2l1bSBhbGxvd3MgeW91IHRvIGRyYXcgbGFiZWxzIG92ZXIgYSBzaGFwZSB0aGF0IGlzIGJlaW5nIGVkaXRlZCB3aXRoIG9uZSBvZiB0aGUgZWRpdG9ycy5cbiAqIFRvIGFkZCBsYWJlbCBkcmF3aW5nIGxvZ2ljIHRvIHlvdXIgZWRpdG9yIHVzZSB0aGUgZnVuY3Rpb24gYHNldExhYmVsc1JlbmRlckZuKClgIHRoYXQgaXMgZGVmaW5lZCBvbiB0aGVcbiAqIGBQb2x5bGluZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgcG9seWxpbmVcbiAqICBjb25zdCBlZGl0aW5nJCA9IHBvbHlsaW5lc0VkaXRvclNlcnZpY2UuY3JlYXRlKCk7XG4gKiAgdGhpcy5lZGl0aW5nJC5zdWJzY3JpYmUoZWRpdFJlc3VsdCA9PiB7XG4gKlx0XHRcdFx0Y29uc29sZS5sb2coZWRpdFJlc3VsdC5wb3NpdGlvbnMpO1xuICpcdFx0fSk7XG4gKlxuICogIC8vIE9yIGVkaXQgcG9seWxpbmUgZnJvbSBleGlzdGluZyBwb2x5bGluZSBjYXJ0ZXNpYW4zIHBvc2l0aW9uc1xuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5wb2x5bGluZXNFZGl0b3IuZWRpdChpbml0aWFsUG9zKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+KCk7XG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxQb2x5bGluZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIHBvbHlsaW5lc01hbmFnZXI6IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICAgICBwb2x5bGluZXNNYW5hZ2VyOiBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMucG9seWxpbmVzTWFuYWdlciA9IHBvbHlsaW5lc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxQb2x5bGluZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgZXZlbnRQcmlvcml0eSA9IDEwMCk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHBvbHlsaW5lT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZExhc3RQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uLCBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb25dKTtcbiAgICBjb25zdCBlZGl0b3JPYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGNsaWVudEVkaXRTdWJqZWN0LCBpZCk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG4gICAgICBpZiAocG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBhbGxQb3NpdGlvbnMubGVuZ3RoICsgMSA9PT0gcG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cykge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwb3NpdGlvbiBhbHJlYWR5IGFkZGVkIGJ5IGFkZFBvaW50UmVnaXN0cmF0aW9uXG4gICAgICBmaW5pc2hlZENyZWF0ZSA9IHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgcG9zaXRpb25zLFxuICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzd2l0Y2hUb0VkaXRNb2RlKGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlsaW5lT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZENyZWF0ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hhbmdlTW9kZSA9IHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5lZGl0UG9seWxpbmUoaWQsIHBvc2l0aW9ucywgZXZlbnRQcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIHBvbHlsaW5lT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgIHJldHVybiBmaW5pc2hlZENyZWF0ZTtcbiAgfVxuXG4gIGVkaXQocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sIG9wdGlvbnMgPSBERUZBVUxUX1BPTFlMSU5FX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9seWxpbmVzIGVkaXRvciBlcnJvciBlZGl0KCk6IHBvbHlsaW5lIHNob3VsZCBoYXZlIGF0IGxlYXN0IDIgcG9zaXRpb25zJyk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5bGluZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgZWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElUXG4gICAgfSk7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHBvc2l0aW9ucyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBwb2x5bGluZU9wdGlvbnM6IHBvbHlsaW5lT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmVkaXRQb2x5bGluZShcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBlZGl0U3ViamVjdCxcbiAgICAgIHBvbHlsaW5lT3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRQb2x5bGluZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPixcbiAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUG9seWxpbmVFZGl0T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUpIHtcblxuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdTaGFwZUV2ZW50LFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0UG9seWxpbmUsXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge3N0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZHJhZ2dlZFBvc2l0aW9uOiBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcblxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHtlbnRpdGllc30pID0+IHtcbiAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IFsuLi50aGlzLmdldFBvc2l0aW9ucyhpZCldO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5sZW5ndGggPCAzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluZGV4ID0gYWxsUG9zaXRpb25zLmZpbmRJbmRleChwb3NpdGlvbiA9PiBwb2ludC5nZXRQb3NpdGlvbigpLmVxdWFscyhwb3NpdGlvbiBhcyBDYXJ0ZXNpYW4zKSk7XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuUkVNT1ZFX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbiwgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogUG9seWxpbmVFZGl0T3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9QT0xZTElORV9PUFRJT05TKSk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9QT0xZTElORV9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgcG9seWxpbmVPcHRpb25zLnBvbHlsaW5lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LFxuICAgICAgREVGQVVMVF9QT0xZTElORV9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIG9wdGlvbnMucG9seWxpbmVQcm9wcyk7XG4gICAgcmV0dXJuIHBvbHlsaW5lT3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKHBvaW50czoge1xuICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICBwb2ludFByb3A/OiBQb2ludFByb3BzXG4gICAgfVtdIHwgQ2FydGVzaWFuM1tdLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykgPT4ge1xuICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIHBvbHlsaW5lLnNldE1hbnVhbGx5KHBvaW50cywgcG9seWxpbmVQcm9wcyk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q3VycmVudFBvaW50cyA9ICgpID0+IHRoaXMuZ2V0UG9pbnRzKGlkKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpLmxhYmVscztcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbnMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlsaW5lLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5bGluZS5nZXRSZWFsUG9pbnRzKCk7XG4gIH1cbn1cbiJdfQ==
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
import { EditablePolygon } from '../../../models/editable-polygon';
import { generateKey } from '../../utils';
/** @type {?} */
export var DEFAULT_POLYGON_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var PolygonsEditorService = /** @class */ (function () {
    function PolygonsEditorService() {
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
    PolygonsEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polygonsManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, polygonsManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    PolygonsEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolygonsEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
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
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
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
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    };
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
    PolygonsEditorService.prototype.switchToEditMode = /**
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
    function (id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        var updateValue = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(tslib_1.__assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
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
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolygonsEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(tslib_1.__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
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
    PolygonsEditorService.prototype.editPolygon = /**
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
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.id; }),
            });
        }
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
            if (allPositions.length < 4) {
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
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    PolygonsEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        /** @type {?} */
        var polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps, options.pointProps);
        polygonOptions.polygonProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps, options.polygonProps);
        polygonOptions.polylineProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps, options.polylineProps);
        return polygonOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.createEditorObservable = /**
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
         * @param {?=} polygonProps
         * @return {?}
         */
        function (points, polygonProps) {
            /** @type {?} */
            var polygon = _this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
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
        function () { return _this.polygonsManager.get(id).labels; });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    };
    PolygonsEditorService.decorators = [
        { type: Injectable }
    ];
    return PolygonsEditorService;
}());
export { PolygonsEditorService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBRTlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBS3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUluRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUUxQyxNQUFNLEtBQU8sdUJBQXVCLEdBQXVCO0lBQ3pELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsaUJBQWlCO0lBQ2hELGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxXQUFXO0lBQ3pDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsU0FBUyxFQUFFLElBQUk7SUFDZixVQUFVLEVBQUU7UUFDVixLQUFL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QixDQUE2QixDQUFBLENBQUM7UUFFdEUsa0JBQWtCLENBQUMsU0FBUzs7O1FBQUcsY0FBb0IsT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQW5DLENBQW1DLENBQUEsQ0FBQztRQUV2RixPQUFPLG1CQUFBLGtCQUFrQixFQUEyQixDQUFDO0lBQ3ZELENBQUM7Ozs7OztJQUVPLDRDQUFZOzs7OztJQUFwQixVQUFxQixFQUFVOztZQUN2QixPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBRU8seUNBQVM7Ozs7O0lBQWpCLFVBQWtCLEVBQVU7O1lBQ3BCLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDNUMsT0FBTyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakMsQ0FBQzs7Z0JBdmFGLFVBQVU7O0lBd2FYLDRCQUFDO0NBQUEsQUF4YUQsSUF3YUM7U0F2YVkscUJBQXFCOzs7Ozs7SUFDaEMsaURBQWtEOzs7OztJQUNsRCw4Q0FBeUQ7Ozs7O0lBQ3pELGdEQUEyRTs7Ozs7SUFDM0Usb0RBQWlEOzs7OztJQUNqRCw4Q0FBcUM7Ozs7O0lBQ3JDLGdEQUFnRDs7Ozs7SUFDaEQsK0NBQXdFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVibGlzaCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IFBvbHlnb25FZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlnb24tZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9seWdvbnNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vcG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlnb24tZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2x5Z29uIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24nO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRPcHRpb25zLCBQb2x5Z29uUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9MWUdPTl9PUFRJT05TOiBQb2x5Z29uRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGFkZExhc3RQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0RPVUJMRV9DTElDSyxcbiAgcmVtb3ZlUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gIH0sXG4gIHBvbHlnb25Qcm9wczoge1xuICAgIG1hdGVyaWFsOiBuZXcgQ2VzaXVtLkNvbG9yKDAuMSwgMC41LCAwLjIsIDAuNCksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICAgIHdpZHRoOiAxLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5Z29uc1xuICpcbiAqIFlvdSBtdXN0IHByb3ZpZGUgYFBvbHlnb25zRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPHBvbHlnb25zLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8cG9seWdvbnMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5Z29uc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWdvbkVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIHBvbHlnb25cbiAqICBjb25zdCBlZGl0aW5nJCA9IHBvbHlnb25zRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5Z29uIGZyb20gZXhpc3RpbmcgcG9seWdvbiBwb3NpdGlvbnNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMucG9seWdvbnNFZGl0b3JTZXJ2aWNlLmVkaXQoaW5pdGlhbFBvcyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5Z29uc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlnb25FZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBwb2x5Z29uc01hbmFnZXI6IFBvbHlnb25zTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgICAgIHBvbHlnb25zTWFuYWdlcjogUG9seWdvbnNNYW5hZ2VyU2VydmljZSkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMucG9seWdvbnNNYW5hZ2VyID0gcG9seWdvbnNNYW5hZ2VyO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8UG9seWdvbkVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUdPTl9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSA9IFtdO1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWdvbk9wdGlvbnM6IHBvbHlnb25PcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5Z29uT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWdvbk9wdGlvbnMuYWRkTGFzdFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKTtcbiAgICAgIGlmIChhbGxQb3NpdGlvbnMuZmluZCgoY2FydGVzaWFuKSA9PiBjYXJ0ZXNpYW4uZXF1YWxzKHBvc2l0aW9uKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwb2x5Z29uT3B0aW9ucy5tYXhpbXVtTnVtYmVyT2ZQb2ludHMgJiYgYWxsUG9zaXRpb25zLmxlbmd0aCArIDEgPT09IHBvbHlnb25PcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cykge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgICAgcG9seWdvbk9wdGlvbnMsXG4gICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHBvc2l0aW9uIGFscmVhZHkgYWRkZWQgYnkgYWRkUG9pbnRSZWdpc3RyYXRpb25cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwb2x5Z29uT3B0aW9ucyxcbiAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgZmluaXNoZWRDcmVhdGUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGVWYWx1ZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5Z29uKGlkLCBwb3NpdGlvbnMsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWdvbk9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gIH1cblxuICBlZGl0KHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLCBvcHRpb25zID0gREVGQVVMVF9QT0xZR09OX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUG9seWdvbkVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5Z29ucyBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5Z29uIHNob3VsZCBoYXZlIGF0IGxlYXN0IDMgcG9zaXRpb25zJyk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWdvbkVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWdvbk9wdGlvbnM6IHBvbHlnb25PcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlnb24oXG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBwb2x5Z29uT3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRQb2x5Z29uKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUG9seWdvbkVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUG9seWdvbkVkaXRvck9ic2VydmFibGUpOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG5cbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICB9KTtcblxuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5kcmFnU2hhcGVFdmVudCxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVQb2x5Z29uLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcblxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe2VudGl0aWVzfSkgPT4ge1xuICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gWy4uLnRoaXMuZ2V0UG9zaXRpb25zKGlkKV07XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5kZXggPSBhbGxQb3NpdGlvbnMuZmluZEluZGV4KHBvc2l0aW9uID0+IHBvaW50LmdldFBvc2l0aW9uKCkuZXF1YWxzKHBvc2l0aW9uIGFzIENhcnRlc2lhbjMpKTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5SRU1PVkVfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyA8IDMpIHtcbiAgICAgIGNvbnNvbGUud2FybignV2FybjogUG9seWdvbkVkaXRvciBpbnZhbGlkIG9wdGlvbi4nICtcbiAgICAgICAgJyBtYXhpbXVtTnVtYmVyT2ZQb2ludHMgc21hbGxlciB0aGVuIDMsIG1heGltdW1OdW1iZXJPZlBvaW50cyBjaGFuZ2VkIHRvIDMnKTtcbiAgICAgIG9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzID0gMztcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfUE9MWUdPTl9PUFRJT05TKSk7XG4gICAgY29uc3QgcG9seWdvbk9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgcG9seWdvbk9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUE9MWUdPTl9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgcG9seWdvbk9wdGlvbnMucG9seWdvblByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9QT0xZR09OX09QVElPTlMucG9seWdvblByb3BzLCBvcHRpb25zLnBvbHlnb25Qcm9wcyk7XG4gICAgcG9seWdvbk9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUE9MWUdPTl9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIG9wdGlvbnMucG9seWxpbmVQcm9wcyk7XG4gICAgcmV0dXJuIHBvbHlnb25PcHRpb25zO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNQT1NFLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChwb2ludHM6IHtcbiAgICAgIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2ludFByb3BzOiBQb2ludFByb3BzXG4gICAgfVtdIHwgQ2FydGVzaWFuM1tdLCBwb2x5Z29uUHJvcHM/OiBQb2x5Z29uUHJvcHMpID0+IHtcbiAgICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpO1xuICAgICAgcG9seWdvbi5zZXRQb2ludHNNYW51YWxseShwb2ludHMsIHBvbHlnb25Qcm9wcyk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnRzID0gKCkgPT4gdGhpcy5nZXRQb2ludHMoaWQpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbnMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5Z29uLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcG9seWdvbi5nZXRSZWFsUG9pbnRzKCk7XG4gIH1cbn1cbiJdfQ==
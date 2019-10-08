/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { generateKey } from '../../utils';
/** @type {?} */
export var DEFAULT_HIPPODROME_OPTIONS = {
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
var HippodromeEditorService = /** @class */ (function () {
    function HippodromeEditorService() {
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
    HippodromeEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} managerService
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    HippodromeEditorService.prototype.onUpdate = /**
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
    HippodromeEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var hippodromeOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
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
            /** @type {?} */
            var isFirstPoint = _this.getPositions(id).length === 0;
            /** @type {?} */
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(tslib_1.__assign({}, updateValue, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            if (!isFirstPoint) {
                /** @type {?} */
                var changeMode = {
                    id: id,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(changeMode);
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        return editorObservable;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    HippodromeEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var hippodromeEditOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(tslib_1.__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    };
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    HippodromeEditorService.prototype.editHippodrome = /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
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
            editSubject.next(tslib_1.__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
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
                editSubject.next(tslib_1.__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration];
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
    HippodromeEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        /** @type {?} */
        var hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.createEditorObservable = /**
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
         * @param {?} firstPosition
         * @param {?} secondPosition
         * @param {?} widthMeters
         * @param {?=} firstPointProp
         * @param {?=} secondPointProp
         * @return {?}
         */
        function (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) {
            /** @type {?} */
            var firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            var secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            var hippodrome = _this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
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
        function () { return _this.hippodromeManager.get(id).labels; });
        observableToExtend.getCurrentWidth = (/**
         * @return {?}
         */
        function () { return _this.getWidth(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getWidth = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    };
    HippodromeEditorService.decorators = [
        { type: Injectable }
    ];
    return HippodromeEditorService;
}());
export { HippodromeEditorService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBR3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRTFDLE1BQU0sS0FBTywwQkFBMEIsR0FBMEI7SUFDL0QsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsU0FBUyxFQUFFLElBQUk7SUFDZixlQUFlLEVBQUU7UUFDZixRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUMz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LENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7Ozs7OztJQUVPLDJDQUFTOzs7OztJQUFqQixVQUFrQixFQUFPOztZQUNqQixVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDakQsT0FBTyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Ozs7O0lBRU8sMENBQVE7Ozs7O0lBQWhCLFVBQWlCLEVBQVU7O1lBQ25CLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNqRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDOztnQkFqVkYsVUFBVTs7SUFrVlgsOEJBQUM7Q0FBQSxBQWxWRCxJQWtWQztTQWpWWSx1QkFBdUI7Ozs7OztJQUNsQyxtREFBa0Q7Ozs7O0lBQ2xELGdEQUE0RDs7Ozs7SUFDNUQsa0RBQThFOzs7OztJQUM5RSxzREFBaUQ7Ozs7O0lBQ2pELGdEQUFxQzs7Ozs7SUFDckMsb0RBQW9EOzs7OztJQUNwRCxpREFBd0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2hpcHBvZHJvbWUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEhpcHBvZHJvbWVNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vaGlwcG9kcm9tZS1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0b3Itb2Jvc2VydmFibGUnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFZGl0YWJsZUhpcHBvZHJvbWUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtaGlwcG9kcm9tZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9ISVBQT0RST01FX09QVElPTlM6IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBoaXBwb2Ryb21lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogQ2VzaXVtLkNvbG9yLkdSRUVOLndpdGhBbHBoYSgwLjUpLFxuICAgIHdpZHRoOiAyMDAwMDAuMCxcbiAgICBvdXRsaW5lOiBmYWxzZSxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGhpcHBvZHJvbWVzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgSGlwcG9kcm9tZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogSGlwcG9kcm9tZUVkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPGhpcHBvZHJvbWVzLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8aGlwcG9kcm9tZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBoaXBwb2Ryb21lXG4gKiAgY29uc3QgZWRpdGluZyQgPSBoaXBwb2Ryb21lRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBoaXBwb2Ryb21lcyBmcm9tIGV4aXN0aW5nIGhpcHBvZHJvbWVzIGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLmhpcHBvZHJvbWVFZGl0b3IuZWRpdChpbml0aWFsUG9zKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhpcHBvZHJvbWVFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8SGlwcG9kcm9tZUVkaXRVcGRhdGU+KCk7XG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxIaXBwb2Ryb21lRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgaGlwcG9kcm9tZU1hbmFnZXI6IEhpcHBvZHJvbWVNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgbWFuYWdlclNlcnZpY2U6IEhpcHBvZHJvbWVNYW5hZ2VyU2VydmljZSkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIgPSBtYW5hZ2VyU2VydmljZTtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPEhpcHBvZHJvbWVFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUywgZXZlbnRQcmlvcml0eSA9IDEwMCk6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSA9IFtdO1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBoaXBwb2Ryb21lT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxIaXBwb2Ryb21lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgaGlwcG9kcm9tZU9wdGlvbnM6IGhpcHBvZHJvbWVPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBoaXBwb2Ryb21lT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBjb25zdCBpc0ZpcnN0UG9pbnQgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCkubGVuZ3RoID09PSAwO1xuXG4gICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICB3aWR0aDogdGhpcy5nZXRXaWR0aChpZCksXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc0ZpcnN0UG9pbnQpIHtcbiAgICAgICAgY29uc3QgY2hhbmdlTW9kZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgICB0aGlzLmVkaXRIaXBwb2Ryb21lKGlkLCBldmVudFByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgaGlwcG9kcm9tZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGVkaXQocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sIG9wdGlvbnMgPSBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGlwcG9kcm9tZSBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5Z29uIHNob3VsZCBoYXZlIDIgcG9zaXRpb25zIGJ1dCByZWNlaXZlZCAnICsgcG9zaXRpb25zKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGhpcHBvZHJvbWVFZGl0T3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8SGlwcG9kcm9tZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgaGlwcG9kcm9tZU9wdGlvbnM6IGhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoaWQpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmVkaXRIaXBwb2Ryb21lKFxuICAgICAgaWQsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgaGlwcG9kcm9tZUVkaXRPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdEhpcHBvZHJvbWUoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PEhpcHBvZHJvbWVFZGl0VXBkYXRlPixcbiAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSk6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlSGlwcG9kcm9tZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcblxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7c3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3B9LCBlbnRpdGllc30pID0+IHtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBkcmFnZ2VkUG9zaXRpb246IHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoaWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMpOiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9ISVBQT0RST01FX09QVElPTlMpKTtcbiAgICBjb25zdCBoaXBwb2Ryb21lT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBoaXBwb2Ryb21lT3B0aW9ucy5oaXBwb2Ryb21lUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUy5oaXBwb2Ryb21lUHJvcHMsIG9wdGlvbnMuaGlwcG9kcm9tZVByb3BzKTtcbiAgICBoaXBwb2Ryb21lT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9ISVBQT0RST01FX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICByZXR1cm4gaGlwcG9kcm9tZU9wdGlvbnM7XG4gIH1cblxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZyk6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKGZpcnN0UG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aE1ldGVyczogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFBvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZFBvaW50UHJvcD86IFBvaW50UHJvcHMpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0UCA9IG5ldyBFZGl0UG9pbnQoaWQsIGZpcnN0UG9zaXRpb24sIGZpcnN0UG9pbnRQcm9wID8gZmlyc3RQb2ludFByb3AgOiBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUy5wb2ludFByb3BzKTtcbiAgICAgIGNvbnN0IHNlY1AgPSBuZXcgRWRpdFBvaW50KGlkLCBzZWNvbmRQb3NpdGlvbiwgc2Vjb25kUG9pbnRQcm9wID8gc2Vjb25kUG9pbnRQcm9wIDogREVGQVVMVF9ISVBQT0RST01FX09QVElPTlMucG9pbnRQcm9wcyk7XG5cbiAgICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVNYW5hZ2VyLmdldChpZCk7XG4gICAgICBoaXBwb2Ryb21lLnNldFBvaW50c01hbnVhbGx5KFtmaXJzdFAsIHNlY1BdLCB3aWR0aE1ldGVycyk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnRzID0gKCkgPT4gdGhpcy5nZXRQb2ludHMoaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLmhpcHBvZHJvbWVNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50V2lkdGggPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0V2lkdGgoaWQpO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9zaXRpb25zKGlkOiBhbnkpIHtcbiAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBoaXBwb2Ryb21lLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBhbnkpIHtcbiAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBoaXBwb2Ryb21lLmdldFJlYWxQb2ludHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0V2lkdGgoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGhpcHBvZHJvbWUgPSB0aGlzLmhpcHBvZHJvbWVNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIGhpcHBvZHJvbWUuZ2V0V2lkdGgoKTtcbiAgfVxufVxuIl19
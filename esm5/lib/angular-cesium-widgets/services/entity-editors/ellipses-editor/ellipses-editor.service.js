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
import { EditableEllipse } from '../../../models/editable-ellipse';
import { generateKey } from '../../utils';
import { CesiumEventModifier } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
/** @type {?} */
export var DEFAULT_ELLIPSE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var EllipsesEditorService = /** @class */ (function () {
    function EllipsesEditorService() {
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
    EllipsesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} ellipsesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, ellipsesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    EllipsesEditorService.prototype.onUpdate = /**
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
    EllipsesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var center;
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var ellipseOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
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
            if (!center) {
                /** @type {?} */
                var update = {
                    id: id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(tslib_1.__assign({}, update));
                center = position;
            }
            else {
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(tslib_1.__assign({}, update));
                /** @type {?} */
                var changeMode = {
                    id: id,
                    center: center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(tslib_1.__assign({}, update));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(tslib_1.__assign({}, update));
            }
        }));
        return editorObservable;
    };
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    EllipsesEditorService.prototype.edit = /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (center, majorRadius, rotation, minorRadius, options, priority) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var ellipseOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        var update = {
            id: id,
            center: center,
            majorRadius: majorRadius,
            rotation: rotation,
            minorRadius: minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(tslib_1.__assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
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
    EllipsesEditorService.prototype.editEllipse = /**
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
        var addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
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
        var shapeDragRegistration;
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
                function (entity) { return id === entity.id; }),
            });
        }
        pointDragRegistration
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
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var pointIsCenter = point === _this.getCenterPoint(id);
            /** @type {?} */
            var editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                _this.cameraService.enableInputs(true);
                return;
            }
            /** @type {?} */
            var update = tslib_1.__assign({ id: id, updatedPoint: point, startDragPosition: startDragPosition,
                endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: editAction }, _this.getEllipseProperties(id));
            _this.updateSubject.next(update);
            editSubject.next(tslib_1.__assign({}, update));
        }));
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var update = tslib_1.__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(tslib_1.__assign({}, update));
            }));
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
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = tslib_1.__assign({ id: id,
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(tslib_1.__assign({}, update));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration, addSecondRadiusRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.createEditorObservable = /**
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
            _this.updateSubject.next((/** @type {?} */ (tslib_1.__assign({ id: id, editMode: EditModes.CREATE_OR_EDIT, editAction: EditActions.DISPOSE }, _this.getEllipseProperties(id)))));
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next((/** @type {?} */ (tslib_1.__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, _this.getEllipseProperties(id)))));
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next((/** @type {?} */ (tslib_1.__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, _this.getEllipseProperties(id)))));
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
        function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
            /** @type {?} */
            var ellipse = _this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
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
            _this.updateSubject.next((/** @type {?} */ ({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            })));
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next((/** @type {?} */ ({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            })));
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.ellipsesManager.get(id).labels; });
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        function () { return _this.getCenterPosition(id); });
        observableToExtend.getMajorRadius = (/**
         * @return {?}
         */
        function () { return _this.getMajorRadius(id); });
        observableToExtend.getMinorRadius = (/**
         * @return {?}
         */
        function () { return _this.getMinorRadius(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    EllipsesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        /** @type {?} */
        var ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getCenterPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getCenter();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getCenterPoint = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).center;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getMajorRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getMinorRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getEllipseProperties = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    };
    EllipsesEditorService.decorators = [
        { type: Injectable }
    ];
    return EllipsesEditorService;
}());
export { EllipsesEditorService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUluRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJGQUEyRixDQUFDOztBQUVoSSxNQUFNLEtBQU8sdUJBQXVCLEdBQXVCO0lBQ3pELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLDZCQUE2QixFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JELHFDQUFxQyxFQUFFLG1CQUFtQixDQUFDLEdBQUc7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Y0FBYyxFQUFFO1lBQ3JDLFdBQVcsRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQ3JDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQywyQkFBMkIsRUFBRTtZQUMvRCx3QkFBd0IsRUFBRSxPQUFPLENBQUMsMkJBQTJCLEVBQUU7U0FDaEUsQ0FBQztJQUNKLENBQUM7O2dCQTdaRixVQUFVOztJQThaWCw0QkFBQztDQUFBLEFBOVpELElBOFpDO1NBN1pZLHFCQUFxQjs7Ozs7O0lBQ2hDLGlEQUFrRDs7Ozs7SUFDbEQsOENBQXlEOzs7OztJQUN6RCxnREFBMkU7Ozs7O0lBQzNFLG9EQUFpRDs7Ozs7SUFDakQsOENBQXFDOzs7OztJQUNyQyxnREFBZ0Q7Ozs7O0lBQ2hELCtDQUF3RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucywgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgQmFzaWNFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2Jhc2ljLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfRUxMSVBTRV9PUFRJT05TOiBFbGxpcHNlRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudE1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyLkFMVCxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBlbGxpcHNlUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogQ2VzaXVtLkNvbG9yLkdSRUVOLndpdGhBbHBoYSgwLjUpLFxuICAgIG91dGxpbmU6IHRydWUsXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICB9LFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxNSxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgfSxcbiAgcG9seWxpbmVQcm9wczoge1xuICAgIHdpZHRoOiAxLFxuICAgIG1hdGVyaWFsOiAoKSA9PiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gIH0sXG4gIGNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybWF0aW9uOiBmYWxzZSxcbn07XG5cbi8qKlxuICogU2VydmljZSBmb3IgY3JlYXRpbmcgZWRpdGFibGUgZWxsaXBzZXNcbiAqXG4gKiBZb3UgbXVzdCBwcm92aWRlIGBFbGxpcHNlc0VkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogRWxsaXBzZXNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxlbGxpcHNlLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8ZWxsaXBzZS1lZGl0b3I+YFxuICogZm9yIGVhY2ggYEVsbGlwc2VzRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRpc3Bvc2UoKWAgZnJvbSB0aGUgYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdGVkIHNoYXBlcyoqXG4gKiBBbmd1bGFyIENlc2l1bSBhbGxvd3MgeW91IHRvIGRyYXcgbGFiZWxzIG92ZXIgYSBzaGFwZSB0aGF0IGlzIGJlaW5nIGVkaXRlZCB3aXRoIG9uZSBvZiB0aGUgZWRpdG9ycy5cbiAqIFRvIGFkZCBsYWJlbCBkcmF3aW5nIGxvZ2ljIHRvIHlvdXIgZWRpdG9yIHVzZSB0aGUgZnVuY3Rpb24gYHNldExhYmVsc1JlbmRlckZuKClgIHRoYXQgaXMgZGVmaW5lZCBvbiB0aGVcbiAqIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBlbGxpcHNlXG4gKiAgY29uc3QgZWRpdGluZyQgPSBlbGxpcHNlc0VkaXRvclNlcnZpY2UuY3JlYXRlKCk7XG4gKiAgdGhpcy5lZGl0aW5nJC5zdWJzY3JpYmUoZWRpdFJlc3VsdCA9PiB7XG4gKlx0XHRcdFx0Y29uc29sZS5sb2coZWRpdFJlc3VsdC5wb3NpdGlvbnMpO1xuICpcdFx0fSk7XG4gKlxuICogIC8vIE9yIGVkaXQgZWxsaXBzZSBmcm9tIGV4aXN0aW5nIGNlbnRlciBwb2ludCwgdHdvIHJhZGl1c2VzIGFuZCByb3RhdGlvblxuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5lbGxpcHNlc0VkaXRvclNlcnZpY2UuZWRpdChjZW50ZXIsIG1ham9yUmFkaXVzLCByb3RhdGlvbiwgbWlub3JSYWRpdXMpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KCk7XG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxFbGxpcHNlRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgZWxsaXBzZXNNYW5hZ2VyOiBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcblxuICBpbml0KFxuICAgIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuZWxsaXBzZXNNYW5hZ2VyID0gZWxsaXBzZXNNYW5hZ2VyO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8RWxsaXBzZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBsZXQgY2VudGVyOiBhbnk7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgfSk7XG4gICAgbGV0IGZpbmlzaGVkQ3JlYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICBpZCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGVsbGlwc2VPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBlbGxpcHNlT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBjZW50ZXIgPSBwb3NpdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY2hhbmdlTW9kZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgICAgdGhpcy5lZGl0RWxsaXBzZShpZCwgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBlbGxpcHNlT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGlmICghY2VudGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGVkaXQoXG4gICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgIG1ham9yUmFkaXVzOiBudW1iZXIsXG4gICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMixcbiAgICBtaW5vclJhZGl1cz86IG51bWJlcixcbiAgICBvcHRpb25zID0gREVGQVVMVF9FTExJUFNFX09QVElPTlMsXG4gICAgcHJpb3JpdHkgPSAxMDAsXG4gICk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgZWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBjZW50ZXIsXG4gICAgICBtYWpvclJhZGl1cyxcbiAgICAgIHJvdGF0aW9uLFxuICAgICAgbWlub3JSYWRpdXMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgZWxsaXBzZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuZWRpdEVsbGlwc2UoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgZWxsaXBzZU9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGl0RWxsaXBzZShcbiAgICBpZDogc3RyaW5nLFxuICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+LFxuICAgIG9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyxcbiAgICBlZGl0T2JzZXJ2YWJsZT86IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlLFxuICApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybWF0aW9uKSB7XG4gICAgICBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudCxcbiAgICAgICAgbW9kaWZpZXI6IG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcixcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVFbGxpcHNlLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlRWxsaXBzZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb24sIHN0YXJ0UG9zaXRpb24sIGRyb3B9LCBlbnRpdGllc30pID0+IHtcbiAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICAgIGNvbnN0IHBvaW50SXNDZW50ZXIgPSBwb2ludCA9PT0gdGhpcy5nZXRDZW50ZXJQb2ludChpZCk7XG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xuICAgICAgICBpZiAoZHJvcCkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93RHJhZyAmJiAoZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSB8fCBlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCkpIHtcbiAgICAgICAgICB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb24sXG4gICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pIHtcbiAgICAgIGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlRSQU5TRk9STSxcbiAgICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge3N0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wfX0pID0+IHtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24gfHwgIXN0YXJ0RHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb24sIGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gZWRpdE9ic2VydmFibGUgfHwgdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChcbiAgICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICAgIG1ham9yUmFkaXVzOiBudW1iZXIsXG4gICAgICByb3RhdGlvbj86IG51bWJlcixcbiAgICAgIG1pbm9yUmFkaXVzPzogbnVtYmVyLFxuICAgICAgY2VudGVyUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIHJhZGl1c1BvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICBlbGxpcHNlUHJvcD86IEVsbGlwc2VQcm9wcyxcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgZWxsaXBzZS5zZXRNYW51YWxseShjZW50ZXIsIG1ham9yUmFkaXVzLCByb3RhdGlvbiwgbWlub3JSYWRpdXMsIGNlbnRlclBvaW50UHJvcCwgcmFkaXVzUG9pbnRQcm9wLCBlbGxpcHNlUHJvcCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiAodXBkYXRlOiBCYXNpY0VkaXRVcGRhdGU8YW55PiwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSBhcyBFbGxpcHNlRWRpdFVwZGF0ZSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldENlbnRlciA9ICgpOiBDYXJ0ZXNpYW4zID0+IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRNYWpvclJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRNYWpvclJhZGl1cyhpZCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldE1pbm9yUmFkaXVzID0gKCk6IG51bWJlciA9PiB0aGlzLmdldE1pbm9yUmFkaXVzKGlkKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgRWxsaXBzZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zKTogRWxsaXBzZUVkaXRPcHRpb25zIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfRUxMSVBTRV9PUFRJT05TKSk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgZWxsaXBzZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgZWxsaXBzZU9wdGlvbnMuZWxsaXBzZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9FTExJUFNFX09QVElPTlMuZWxsaXBzZVByb3BzLCBvcHRpb25zLmVsbGlwc2VQcm9wcyk7XG4gICAgZWxsaXBzZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIG9wdGlvbnMucG9seWxpbmVQcm9wcyk7XG4gICAgcmV0dXJuIGVsbGlwc2VPcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENlbnRlclBvaW50KGlkOiBzdHJpbmcpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmNlbnRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWFqb3JSYWRpdXMoaWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWlub3JSYWRpdXMoaWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0TWlub3JSYWRpdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXI6IGVsbGlwc2UuZ2V0Q2VudGVyKCksXG4gICAgICByb3RhdGlvbjogZWxsaXBzZS5nZXRSb3RhdGlvbigpLFxuICAgICAgbWlub3JSYWRpdXM6IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXMoKSxcbiAgICAgIG1ham9yUmFkaXVzOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzKCksXG4gICAgICBtaW5vclJhZGl1c1BvaW50UG9zaXRpb246IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXNQb2ludFBvc2l0aW9uKCksXG4gICAgICBtYWpvclJhZGl1c1BvaW50UG9zaXRpb246IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uKCksXG4gICAgfTtcbiAgfVxufVxuIl19
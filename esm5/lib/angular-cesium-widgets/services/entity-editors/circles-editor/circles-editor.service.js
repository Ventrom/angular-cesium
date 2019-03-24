/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
export var DEFAULT_CIRCLE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var CirclesEditorService = /** @class */ (function () {
    function CirclesEditorService() {
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
    CirclesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} circlesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    CirclesEditorService.prototype.onUpdate = /**
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
    CirclesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var center;
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var circleOptions = this.setOptions(options);
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
            circleOptions: circleOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
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
                clientEditSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
                center = position;
            }
            else {
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
                /** @type {?} */
                var changeMode = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
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
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
            }
        }));
        return editorObservable;
    };
    /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    CirclesEditorService.prototype.edit = /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (center, radius, options, priority) {
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var circleOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        /** @type {?} */
        var update = {
            id: id,
            center: center,
            radiusPoint: radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(tslib_1.__assign({}, update, this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
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
    CirclesEditorService.prototype.editCircle = /**
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
            event: CesiumEvent.LEFT_CLICK_DRAG,
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
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
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
            var update = {
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                startDragPosition: startDragPosition,
                endDragPosition: endDragPosition,
                editMode: EditModes.EDIT,
                editAction: editAction,
            };
            _this.updateSubject.next(update);
            editSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
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
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = {
                    id: id,
                    center: _this.getCenterPosition(id),
                    radiusPoint: _this.getRadiusPosition(id),
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(tslib_1.__assign({}, update, _this.getCircleProperties(id)));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
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
    CirclesEditorService.prototype.createEditorObservable = /**
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
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
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
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
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
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
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
        function (center, radius, centerPointProp, radiusPointProp, circleProp) {
            /** @type {?} */
            var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            /** @type {?} */
            var circle = _this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.circlesManager.get(id).labels; });
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        function () { return _this.getCenterPosition(id); });
        observableToExtend.getRadius = (/**
         * @return {?}
         */
        function () { return _this.getRadius(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    CirclesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        /** @type {?} */
        var circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCenterPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getCenter();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCenterPoint = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).center;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getRadiusPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getRadiusPoint();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCircleProperties = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    };
    CirclesEditorService.decorators = [
        { type: Injectable }
    ];
    return CirclesEditorService;
}());
export { CirclesEditorService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDbEcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQU85RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFJakUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFHMUMsTUFBTSxLQUFPLHNCQUFzQixHQUFzQjtJQUN2RCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRTtRQUNYLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtB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QUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1QyxDQUFDOzs7Ozs7SUFFTyxnREFBaUI7Ozs7O0lBQXpCLFVBQTBCLEVBQVU7UUFDbEMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN0RCxDQUFDOzs7Ozs7SUFFTyx3Q0FBUzs7Ozs7SUFBakIsVUFBa0IsRUFBVTtRQUMxQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pELENBQUM7Ozs7OztJQUVPLGtEQUFtQjs7Ozs7SUFBM0IsVUFBNEIsRUFBVTs7WUFDOUIsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMxQyxPQUFPO1lBQ0wsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDMUIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDcEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUU7U0FDM0IsQ0FBQztJQUNKLENBQUM7O2dCQS9YRixVQUFVOztJQWdZWCwyQkFBQztDQUFBLEFBaFlELElBZ1lDO1NBL1hZLG9CQUFvQjs7Ozs7O0lBQy9CLGdEQUFrRDs7Ozs7SUFDbEQsNkNBQXdEOzs7OztJQUN4RCwrQ0FBMEU7Ozs7O0lBQzFFLG1EQUFpRDs7Ozs7SUFDakQsNkNBQXFDOzs7OztJQUNyQyw4Q0FBOEM7Ozs7O0lBQzlDLDhDQUF3RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgcHVibGlzaCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCYXNpY0VkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvYmFzaWMtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgRWRpdGFibGVDaXJjbGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtY2lyY2xlJztcbmltcG9ydCB7IEVsbGlwc2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2lyY2xlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9jaXJjbGVzLW1hbmFnZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NJUkNMRV9PUFRJT05TOiBDaXJjbGVFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBjaXJjbGVQcm9wczoge1xuICAgIG1hdGVyaWFsOiBDZXNpdW0uQ29sb3IuR1JFRU4ud2l0aEFscGhhKDAuNSksXG4gICAgb3V0bGluZTogZmFsc2UsXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICB9LFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxNSxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgfSxcbiAgcG9seWxpbmVQcm9wczoge1xuICAgIHdpZHRoOiAxLFxuICAgIG1hdGVyaWFsOiAoKSA9PiBDZXNpdW0uQ29sb3IuQkxBQ0ssXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGNpcmNsZXNcbiAqXG4gKiBZb3UgbXVzdCBwcm92aWRlIGBDaXJjbGVFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIFBvbHlnb25zRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8Y2lyY2xlLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8Y2lyY2xlLWVkaXRvcj5gXG4gKiBmb3IgZWFjaCBgQ2lyY2xlRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBjaXJjbGVcbiAqICBjb25zdCBlZGl0aW5nJCA9IGNpcmNsZXNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGNpcmNsZSBmcm9tIGV4aXN0aW5nIGNlbnRlciBwb2ludCBhbmQgcmFkaXVzXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLmNpcmNsZXNFZGl0b3JTZXJ2aWNlLmVkaXQoY2VudGVyLCByYWRpdXMpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2lyY2xlc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxDaXJjbGVFZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8Q2lyY2xlRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgY2lyY2xlc01hbmFnZXI6IENpcmNsZXNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG5cbiAgaW5pdChcbiAgICBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgY2lyY2xlc01hbmFnZXI6IENpcmNsZXNNYW5hZ2VyU2VydmljZSxcbiAgKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5jaXJjbGVzTWFuYWdlciA9IGNpcmNsZXNNYW5hZ2VyO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8Q2lyY2xlRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9DSVJDTEVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBsZXQgY2VudGVyOiBhbnk7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGNpcmNsZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBjaXJjbGVPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgICAgY2VudGVyID0gcG9zaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIHJhZGl1c1BvaW50OiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNoYW5nZU1vZGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyLFxuICAgICAgICAgIHJhZGl1c1BvaW50OiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgICAgdGhpcy5lZGl0Q2lyY2xlKGlkLCBwcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIGNpcmNsZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBlZGl0KGNlbnRlcjogQ2FydGVzaWFuMywgcmFkaXVzOiBudW1iZXIsIG9wdGlvbnMgPSBERUZBVUxUX0NJUkNMRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IENpcmNsZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxDaXJjbGVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgfSk7XG5cbiAgICBjb25zdCByYWRpdXNQb2ludDogQ2FydGVzaWFuMyA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2VudGVyLCByYWRpdXMsIE1hdGguUEkgLyAyLCB0cnVlKTtcblxuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgY2VudGVyLFxuICAgICAgcmFkaXVzUG9pbnQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgY2lyY2xlT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuZWRpdENpcmNsZShpZCwgcHJpb3JpdHksIGVkaXRTdWJqZWN0LCBjaXJjbGVPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdENpcmNsZShcbiAgICBpZDogc3RyaW5nLFxuICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4sXG4gICAgb3B0aW9uczogQ2lyY2xlRWRpdE9wdGlvbnMsXG4gICAgZWRpdE9ic2VydmFibGU/OiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlLFxuICApOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlQ2lyY2xlLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eTogcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uXG4gICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbiwgc3RhcnRQb3NpdGlvbiwgZHJvcH0sIGVudGl0aWVzfSkgPT4ge1xuICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcbiAgICAgICAgY29uc3QgcG9pbnRJc0NlbnRlciA9IHBvaW50ID09PSB0aGlzLmdldENlbnRlclBvaW50KGlkKTtcbiAgICAgICAgbGV0IGVkaXRBY3Rpb247XG4gICAgICAgIGlmIChkcm9wKSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHBvaW50SXNDZW50ZXIgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dEcmFnICYmIChlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIHx8IGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIKSkge1xuICAgICAgICAgIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHModHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgIGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgZWRpdEFjdGlvbixcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcH19KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uIHx8ICFzdGFydERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiBlZGl0T2JzZXJ2YWJsZSB8fCB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZyk6IENpcmNsZUVkaXRvck9ic2VydmFibGUge1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCk7XG4gICAgICBpZiAob2JzZXJ2YWJsZXMpIHtcbiAgICAgICAgb2JzZXJ2YWJsZXMuZm9yRWFjaChvYnMgPT4gb2JzLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoXG4gICAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgICByYWRpdXM6IG51bWJlcixcbiAgICAgIGNlbnRlclBvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICByYWRpdXNQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgY2lyY2xlUHJvcD86IEVsbGlwc2VQcm9wcyxcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHJhZGl1c1BvaW50ID0gR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aChjZW50ZXIsIHJhZGl1cywgTWF0aC5QSSAvIDIsIHRydWUpO1xuICAgICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgY2lyY2xlLnNldE1hbnVhbGx5KGNlbnRlciwgcmFkaXVzUG9pbnQsIGNlbnRlclBvaW50UHJvcCwgcmFkaXVzUG9pbnRQcm9wLCBjaXJjbGVQcm9wKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6ICh1cGRhdGU6IEJhc2ljRWRpdFVwZGF0ZTxhbnk+LCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnVwZGF0ZUxhYmVscyA9IChsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDZW50ZXIgPSAoKTogQ2FydGVzaWFuMyA9PiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0UmFkaXVzID0gKCk6IG51bWJlciA9PiB0aGlzLmdldFJhZGl1cyhpZCk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIENpcmNsZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogQ2lyY2xlRWRpdE9wdGlvbnMpOiBDaXJjbGVFZGl0T3B0aW9ucyB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX0NJUkNMRV9PUFRJT05TKSk7XG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBjaXJjbGVPcHRpb25zLnBvaW50UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0NJUkNMRV9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgY2lyY2xlT3B0aW9ucy5jaXJjbGVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMuY2lyY2xlUHJvcHMsIG9wdGlvbnMuY2lyY2xlUHJvcHMpO1xuICAgIGNpcmNsZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMucG9seWxpbmVQcm9wcywgb3B0aW9ucy5wb2x5bGluZVByb3BzKTtcbiAgICByZXR1cm4gY2lyY2xlT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9zaXRpb24oaWQ6IHN0cmluZyk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENlbnRlclBvaW50KGlkOiBzdHJpbmcpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCkuY2VudGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSYWRpdXNQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5nZXRSYWRpdXNQb2ludCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSYWRpdXMoaWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5nZXRSYWRpdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2lyY2xlUHJvcGVydGllcyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2lyY2xlID0gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXI6IGNpcmNsZS5nZXRDZW50ZXIoKSxcbiAgICAgIHJhZGl1c1BvaW50OiBjaXJjbGUuZ2V0UmFkaXVzUG9pbnQoKSxcbiAgICAgIHJhZGl1czogY2lyY2xlLmdldFJhZGl1cygpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==
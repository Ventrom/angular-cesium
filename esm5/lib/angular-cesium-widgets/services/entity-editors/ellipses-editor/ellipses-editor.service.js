import { __assign, __decorate } from "tslib";
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
var ɵ0 = function () { return Cesium.Color.WHITE; };
export var DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: true,
        outlineWidth: 1,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
        shadows: Cesium.ShadowMode.DISABLED,
    },
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: ɵ0,
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
 *				console.log(editResult.positions);
 *		});
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
    EllipsesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, ellipsesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    EllipsesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    EllipsesEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var center;
        var id = generateKey();
        var ellipseOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                var update = {
                    id: id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
                center = position;
            }
            else {
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
                var changeMode = {
                    id: id,
                    center: center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign({}, update));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        });
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
            }
        });
        return editorObservable;
    };
    EllipsesEditorService.prototype.edit = function (center, majorRadius, rotation, minorRadius, options, priority) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var id = generateKey();
        var ellipseOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
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
        editSubject.next(__assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    };
    EllipsesEditorService.prototype.editEllipse = function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        pointDragRegistration
            .pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.ellipsesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            var point = entities[0];
            var pointIsCenter = point === _this.getCenterPoint(id);
            var editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && _this.ellipsesManager.get(id).enableEdit &&
                (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                _this.cameraService.enableInputs(true);
                return;
            }
            var update = __assign({ id: id, updatedPoint: point, startDragPosition: startDragPosition,
                endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: editAction }, _this.getEllipseProperties(id));
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update));
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(function (_a) {
                var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
                var update = __assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.ellipsesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                var update = __assign({ id: id,
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    EllipsesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next(__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, _this.getEllipseProperties(id)));
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next(__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, _this.getEllipseProperties(id)));
        };
        observableToExtend.setManually = function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
            var ellipse = _this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.ellipsesManager.get(id).labels; };
        observableToExtend.getCenter = function () { return _this.getCenterPosition(id); };
        observableToExtend.getMajorRadius = function () { return _this.getMajorRadius(id); };
        observableToExtend.getMinorRadius = function () { return _this.getMinorRadius(id); };
        return observableToExtend;
    };
    EllipsesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        var ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    };
    EllipsesEditorService.prototype.getCenterPosition = function (id) {
        return this.ellipsesManager.get(id).getCenter();
    };
    EllipsesEditorService.prototype.getCenterPoint = function (id) {
        return this.ellipsesManager.get(id).center;
    };
    EllipsesEditorService.prototype.getMajorRadius = function (id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    };
    EllipsesEditorService.prototype.getMinorRadius = function (id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    };
    EllipsesEditorService.prototype.getEllipseProperties = function (id) {
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
    EllipsesEditorService = __decorate([
        Injectable()
    ], EllipsesEditorService);
    return EllipsesEditorService;
}());
export { EllipsesEditorService };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFPdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBSW5FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkZBQTJGLENBQUM7U0FnQ2xILGNBQU0sT0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBbEIsQ0FBa0I7QUE3QnRDLE1BQU0sQ0FBQyxJQUFNLHVCQUF1QixHQUF1QjtJQUN6RCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyw2QkFBNkIs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QyxTQUFTLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBRU8sOENBQWMsR0FBdEIsVUFBdUIsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM3QyxDQUFDO0lBRU8sOENBQWMsR0FBdEIsVUFBdUIsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFTyw4Q0FBYyxHQUF0QixVQUF1QixFQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVPLG9EQUFvQixHQUE1QixVQUE2QixFQUFVO1FBQ3JDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU87WUFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMzQixRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUMvQixXQUFXLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUNyQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUNyQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsMkJBQTJCLEVBQUU7WUFDL0Qsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLDJCQUEyQixFQUFFO1NBQ2hFLENBQUM7SUFDSixDQUFDO0lBcmFVLHFCQUFxQjtRQURqQyxVQUFVLEVBQUU7T0FDQSxxQkFBcUIsQ0FzYWpDO0lBQUQsNEJBQUM7Q0FBQSxBQXRhRCxJQXNhQztTQXRhWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9lbGxpcHNlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdE9wdGlvbnMsIEVsbGlwc2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBFZGl0YWJsZUVsbGlwc2UgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtZWxsaXBzZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IEJhc2ljRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9iYXNpYy1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0nO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9FTExJUFNFX09QVElPTlM6IEVsbGlwc2VFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50TW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIuQUxULFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIGVsbGlwc2VQcm9wczoge1xuICAgIG1hdGVyaWFsOiBDZXNpdW0uQ29sb3IuQ09STkZMT1dFUkJMVUUud2l0aEFscGhhKDAuNCksXG4gICAgZmlsbDogdHJ1ZSxcbiAgICBvdXRsaW5lOiB0cnVlLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC44KSxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgICB6SW5kZXg6IDAsXG4gICAgc2hhZG93czogQ2VzaXVtLlNoYWRvd01vZGUuRElTQUJMRUQsXG4gIH0sXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjIpLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDEzLFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxuICBwb2x5bGluZVByb3BzOiB7XG4gICAgd2lkdGg6IDEsXG4gICAgbWF0ZXJpYWw6ICgpID0+IENlc2l1bS5Db2xvci5XSElURSxcbiAgfSxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtYXRpb246IGZhbHNlLFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBlbGxpcHNlc1xuICpcbiAqIFlvdSBtdXN0IHByb3ZpZGUgYEVsbGlwc2VzRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBFbGxpcHNlc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPGVsbGlwc2UtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxlbGxpcHNlLWVkaXRvcj5gXG4gKiBmb3IgZWFjaCBgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cbiAqXG4gKiArIGBjcmVhdGVgIGZvciBzdGFydGluZyBhIGNyZWF0aW9uIG9mIHRoZSBzaGFwZSBvdmVyIHRoZSBtYXAuIFJldHVybnMgYSBleHRlbnNpb24gb2YgYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZGlzcG9zZSgpYCBmcm9tIHRoZSBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXG4gKlxuICogKipMYWJlbHMgb3ZlciBlZGl0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIGVsbGlwc2VcbiAqICBjb25zdCBlZGl0aW5nJCA9IGVsbGlwc2VzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBlbGxpcHNlIGZyb20gZXhpc3RpbmcgY2VudGVyIHBvaW50LCB0d28gcmFkaXVzZXMgYW5kIHJvdGF0aW9uXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLmVsbGlwc2VzRWRpdG9yU2VydmljZS5lZGl0KGNlbnRlciwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uLCBtaW5vclJhZGl1cyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbGxpcHNlc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPEVsbGlwc2VFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lOiBhbnk7XG5cbiAgaW5pdChcbiAgICBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgZWxsaXBzZXNNYW5hZ2VyOiBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlLFxuICAgIGNlc2l1bVZpZXdlcjogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5lbGxpcHNlc01hbmFnZXIgPSBlbGxpcHNlc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuXG4gICAgdGhpcy5jZXNpdW1TY2VuZSA9IGNlc2l1bVZpZXdlci5nZXRTY2VuZSgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxFbGxpcHNlRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9FTExJUFNFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGxldCBjZW50ZXI6IGFueTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgZWxsaXBzZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBlbGxpcHNlT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghY2VudGVyKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNlbnRlciA9IHBvc2l0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjaGFuZ2VNb2RlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgICB0aGlzLmVkaXRFbGxpcHNlKGlkLCBwcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIGVsbGlwc2VPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmICghY2VudGVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGVkaXQoXG4gICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgIG1ham9yUmFkaXVzOiBudW1iZXIsXG4gICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMixcbiAgICBtaW5vclJhZGl1cz86IG51bWJlcixcbiAgICBvcHRpb25zID0gREVGQVVMVF9FTExJUFNFX09QVElPTlMsXG4gICAgcHJpb3JpdHkgPSAxMDAsXG4gICk6IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgZWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBjZW50ZXIsXG4gICAgICBtYWpvclJhZGl1cyxcbiAgICAgIHJvdGF0aW9uLFxuICAgICAgbWlub3JSYWRpdXMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgZWxsaXBzZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuZWRpdEVsbGlwc2UoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgZWxsaXBzZU9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGl0RWxsaXBzZShcbiAgICBpZDogc3RyaW5nLFxuICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+LFxuICAgIG9wdGlvbnM6IEVsbGlwc2VFZGl0T3B0aW9ucyxcbiAgICBlZGl0T2JzZXJ2YWJsZT86IEVsbGlwc2VFZGl0b3JPYnNlcnZhYmxlLFxuICApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbikge1xuICAgICAgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnQsXG4gICAgICAgIG1vZGlmaWVyOiBvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50TW9kaWZpZXIsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlRWxsaXBzZSxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdTaGFwZUV2ZW50LFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZUVsbGlwc2UsXG4gICAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb25cbiAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiwgc3RhcnRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgICBjb25zdCBwb2ludElzQ2VudGVyID0gcG9pbnQgPT09IHRoaXMuZ2V0Q2VudGVyUG9pbnQoaWQpO1xuICAgICAgICBsZXQgZWRpdEFjdGlvbjtcbiAgICAgICAgaWYgKGRyb3ApIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHBvaW50SXNDZW50ZXIgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd0RyYWcgJiYgdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmXG4gICAgICAgICAgKGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgfHwgZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0gpKSB7XG4gICAgICAgICAgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKSB7XG4gICAgICBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVFJBTlNGT1JNLFxuICAgICAgICAgIC4uLnRoaXMuZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wIH0gfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbiB8fCAhc3RhcnREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cbiAgICBpZiAoYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gZWRpdE9ic2VydmFibGUgfHwgdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKFxuICAgICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgICAgbWFqb3JSYWRpdXM6IG51bWJlcixcbiAgICAgIHJvdGF0aW9uPzogbnVtYmVyLFxuICAgICAgbWlub3JSYWRpdXM/OiBudW1iZXIsXG4gICAgICBjZW50ZXJQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgcmFkaXVzUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIGVsbGlwc2VQcm9wPzogRWxsaXBzZVByb3BzLFxuICAgICkgPT4ge1xuICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBlbGxpcHNlLnNldE1hbnVhbGx5KGNlbnRlciwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uLCBtaW5vclJhZGl1cywgY2VudGVyUG9pbnRQcm9wLCByYWRpdXNQb2ludFByb3AsIGVsbGlwc2VQcm9wKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6ICh1cGRhdGU6IEJhc2ljRWRpdFVwZGF0ZTxhbnk+LCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnVwZGF0ZUxhYmVscyA9IChsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmxhYmVscztcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q2VudGVyID0gKCk6IENhcnRlc2lhbjMgPT4gdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldE1ham9yUmFkaXVzID0gKCk6IG51bWJlciA9PiB0aGlzLmdldE1ham9yUmFkaXVzKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TWlub3JSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0TWlub3JSYWRpdXMoaWQpO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBFbGxpcHNlRWRpdE9wdGlvbnMpOiBFbGxpcHNlRWRpdE9wdGlvbnMge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9FTExJUFNFX09QVElPTlMpKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBlbGxpcHNlT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9FTExJUFNFX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICBlbGxpcHNlT3B0aW9ucy5lbGxpcHNlUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUy5lbGxpcHNlUHJvcHMsIG9wdGlvbnMuZWxsaXBzZVByb3BzKTtcbiAgICBlbGxpcHNlT3B0aW9ucy5wb2x5bGluZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9FTExJUFNFX09QVElPTlMucG9seWxpbmVQcm9wcywgb3B0aW9ucy5wb2x5bGluZVByb3BzKTtcbiAgICByZXR1cm4gZWxsaXBzZU9wdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIGdldENlbnRlclBvc2l0aW9uKGlkOiBzdHJpbmcpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9pbnQoaWQ6IHN0cmluZyk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuY2VudGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRNYWpvclJhZGl1cyhpZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5nZXRNYWpvclJhZGl1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRNaW5vclJhZGl1cyhpZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5nZXRNaW5vclJhZGl1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbGxpcHNlUHJvcGVydGllcyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlcjogZWxsaXBzZS5nZXRDZW50ZXIoKSxcbiAgICAgIHJvdGF0aW9uOiBlbGxpcHNlLmdldFJvdGF0aW9uKCksXG4gICAgICBtaW5vclJhZGl1czogZWxsaXBzZS5nZXRNaW5vclJhZGl1cygpLFxuICAgICAgbWFqb3JSYWRpdXM6IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXMoKSxcbiAgICAgIG1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbjogZWxsaXBzZS5nZXRNaW5vclJhZGl1c1BvaW50UG9zaXRpb24oKSxcbiAgICAgIG1ham9yUmFkaXVzUG9pbnRQb3NpdGlvbjogZWxsaXBzZS5nZXRNYWpvclJhZGl1c1BvaW50UG9zaXRpb24oKSxcbiAgICB9O1xuICB9XG59XG4iXX0=
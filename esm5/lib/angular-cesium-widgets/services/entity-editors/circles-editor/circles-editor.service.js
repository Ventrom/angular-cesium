import { __assign, __decorate } from "tslib";
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
var ɵ0 = function () { return Cesium.Color.WHITE.withAlpha(0.8); };
export var DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: false,
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
 *				console.log(editResult.positions);
 *		});
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
    CirclesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    };
    CirclesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    CirclesEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var center;
        var id = generateKey();
        var circleOptions = this.setOptions(options);
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
            circleOptions: circleOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
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
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                center = position;
            }
            else {
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                var changeMode = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
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
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
            }
        });
        return editorObservable;
    };
    CirclesEditorService.prototype.edit = function (center, radius, options, priority) {
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var id = generateKey();
        var circleOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        var update = {
            id: id,
            center: center,
            radiusPoint: radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    };
    CirclesEditorService.prototype.editCircle = function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        pointDragRegistration
            .pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
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
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                _this.cameraService.enableInputs(true);
                return;
            }
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
            editSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
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
                editSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    CirclesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (center, radius, centerPointProp, radiusPointProp, circleProp) {
            var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            var circle = _this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
        observableToExtend.getLabels = function () { return _this.circlesManager.get(id).labels; };
        observableToExtend.getCenter = function () { return _this.getCenterPosition(id); };
        observableToExtend.getRadius = function () { return _this.getRadius(id); };
        return observableToExtend;
    };
    CirclesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        var circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    };
    CirclesEditorService.prototype.getCenterPosition = function (id) {
        return this.circlesManager.get(id).getCenter();
    };
    CirclesEditorService.prototype.getCenterPoint = function (id) {
        return this.circlesManager.get(id).center;
    };
    CirclesEditorService.prototype.getRadiusPosition = function (id) {
        return this.circlesManager.get(id).getRadiusPoint();
    };
    CirclesEditorService.prototype.getRadius = function (id) {
        return this.circlesManager.get(id).getRadius();
    };
    CirclesEditorService.prototype.getCircleProperties = function (id) {
        var circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    };
    CirclesEditorService = __decorate([
        Injectable()
    ], CirclesEditorService);
    return CirclesEditorService;
}());
export { CirclesEditorService };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTlDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBTzlHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUlqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO1NBOEI1QixjQUFNLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFqQyxDQUFpQztBQTNCckQsTUFBTSxDQUFDLElBQU0sc0JBQXNCLEdBQXNCO0lBQ3ZELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FB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QUFDLGNBQWMsRUFBRTtZQUNwQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtTQUMzQixDQUFDO0lBQ0osQ0FBQztJQWxZVSxvQkFBb0I7UUFEaEMsVUFBVSxFQUFFO09BQ0Esb0JBQW9CLENBbVloQztJQUFELDJCQUFDO0NBQUEsQUFuWUQsSUFtWUM7U0FuWVksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJhc2ljRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9iYXNpYy1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IENpcmNsZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IENpcmNsZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvY2lyY2xlLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBFZGl0YWJsZUNpcmNsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1jaXJjbGUnO1xuaW1wb3J0IHsgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBDaXJjbGVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2NpcmNsZXMtbWFuYWdlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ0lSQ0xFX09QVElPTlM6IENpcmNsZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIGNpcmNsZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBmaWxsOiB0cnVlLFxuICAgIG91dGxpbmU6IGZhbHNlLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC44KSxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgICB6SW5kZXg6IDAsXG4gICAgc2hhZG93czogQ2VzaXVtLlNoYWRvd01vZGUuRElTQUJMRUQsXG4gIH0sXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjIpLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDEzLFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxuICBwb2x5bGluZVByb3BzOiB7XG4gICAgd2lkdGg6IDEsXG4gICAgbWF0ZXJpYWw6ICgpID0+IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC44KSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VydmljZSBmb3IgY3JlYXRpbmcgZWRpdGFibGUgY2lyY2xlc1xuICpcbiAqIFlvdSBtdXN0IHByb3ZpZGUgYENpcmNsZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxjaXJjbGUtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxjaXJjbGUtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBDaXJjbGVFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cbiAqXG4gKiArIGBjcmVhdGVgIGZvciBzdGFydGluZyBhIGNyZWF0aW9uIG9mIHRoZSBzaGFwZSBvdmVyIHRoZSBtYXAuIFJldHVybnMgYSBleHRlbnNpb24gb2YgYENpcmNsZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYENpcmNsZUVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXG4gKlxuICogKipMYWJlbHMgb3ZlciBlZGl0dGVkIHNoYXBlcyoqXG4gKiBBbmd1bGFyIENlc2l1bSBhbGxvd3MgeW91IHRvIGRyYXcgbGFiZWxzIG92ZXIgYSBzaGFwZSB0aGF0IGlzIGJlaW5nIGVkaXRlZCB3aXRoIG9uZSBvZiB0aGUgZWRpdG9ycy5cbiAqIFRvIGFkZCBsYWJlbCBkcmF3aW5nIGxvZ2ljIHRvIHlvdXIgZWRpdG9yIHVzZSB0aGUgZnVuY3Rpb24gYHNldExhYmVsc1JlbmRlckZuKClgIHRoYXQgaXMgZGVmaW5lZCBvbiB0aGVcbiAqIGBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIGNpcmNsZVxuICogIGNvbnN0IGVkaXRpbmckID0gY2lyY2xlc0VkaXRvclNlcnZpY2UuY3JlYXRlKCk7XG4gKiAgdGhpcy5lZGl0aW5nJC5zdWJzY3JpYmUoZWRpdFJlc3VsdCA9PiB7XG4gKlx0XHRcdFx0Y29uc29sZS5sb2coZWRpdFJlc3VsdC5wb3NpdGlvbnMpO1xuICpcdFx0fSk7XG4gKlxuICogIC8vIE9yIGVkaXQgY2lyY2xlIGZyb20gZXhpc3RpbmcgY2VudGVyIHBvaW50IGFuZCByYWRpdXNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuY2lyY2xlc0VkaXRvclNlcnZpY2UuZWRpdChjZW50ZXIsIHJhZGl1cyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDaXJjbGVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+KCk7XG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxDaXJjbGVFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBjaXJjbGVzTWFuYWdlcjogQ2lyY2xlc01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcblxuICBpbml0KFxuICAgIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBjaXJjbGVzTWFuYWdlcjogQ2lyY2xlc01hbmFnZXJTZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmNpcmNsZXNNYW5hZ2VyID0gY2lyY2xlc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxDaXJjbGVFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX0NJUkNMRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IENpcmNsZUVkaXRvck9ic2VydmFibGUge1xuICAgIGxldCBjZW50ZXI6IGFueTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgfSk7XG4gICAgbGV0IGZpbmlzaGVkQ3JlYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICBpZCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGNpcmNsZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNlbnRlciA9IHBvc2l0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcixcbiAgICAgICAgICByYWRpdXNQb2ludDogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZWRpdENpcmNsZShpZCwgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBjaXJjbGVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb259fSkgPT4ge1xuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgcmFkaXVzUG9pbnQ6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyLCBvcHRpb25zID0gREVGQVVMVF9DSVJDTEVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmFkaXVzUG9pbnQ6IENhcnRlc2lhbjMgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGNlbnRlcixcbiAgICAgIHJhZGl1c1BvaW50LFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGNpcmNsZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVkaXRDaXJjbGUoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgY2lyY2xlT3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRDaXJjbGUoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+LFxuICAgIG9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zLFxuICAgIGVkaXRPYnNlcnZhYmxlPzogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSxcbiAgKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVDaXJjbGUsXG4gICAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb25cbiAgICAgIC5waXBlKHRhcCgoe21vdmVtZW50OiB7ZHJvcH19KSA9PiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgICBjb25zdCBwb2ludElzQ2VudGVyID0gcG9pbnQgPT09IHRoaXMuZ2V0Q2VudGVyUG9pbnQoaWQpO1xuICAgICAgICBsZXQgZWRpdEFjdGlvbjtcbiAgICAgICAgaWYgKGRyb3ApIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHBvaW50SXNDZW50ZXIgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd0RyYWcgJiYgKGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgfHwgZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0gpKSB7XG4gICAgICAgICAgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyh0cnVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgICByYWRpdXNQb2ludDogdGhpcy5nZXRSYWRpdXNQb3NpdGlvbihpZCksXG4gICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICBlZGl0QWN0aW9uLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge3N0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wfX0pID0+IHtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24gfHwgIXN0YXJ0RHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIC4uLnRoaXMuZ2V0Q2lyY2xlUHJvcGVydGllcyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChcbiAgICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICAgIHJhZGl1czogbnVtYmVyLFxuICAgICAgY2VudGVyUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIHJhZGl1c1BvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICBjaXJjbGVQcm9wPzogRWxsaXBzZVByb3BzLFxuICAgICkgPT4ge1xuICAgICAgY29uc3QgcmFkaXVzUG9pbnQgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XG4gICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjaXJjbGUuc2V0TWFudWFsbHkoY2VudGVyLCByYWRpdXNQb2ludCwgY2VudGVyUG9pbnRQcm9wLCByYWRpdXNQb2ludFByb3AsIGNpcmNsZVByb3ApO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogKHVwZGF0ZTogQmFzaWNFZGl0VXBkYXRlPGFueT4sIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldENlbnRlciA9ICgpOiBDYXJ0ZXNpYW4zID0+IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0UmFkaXVzKGlkKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyk6IENpcmNsZUVkaXRPcHRpb25zIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfQ0lSQ0xFX09QVElPTlMpKTtcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGNpcmNsZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICBjaXJjbGVPcHRpb25zLmNpcmNsZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DSVJDTEVfT1BUSU9OUy5jaXJjbGVQcm9wcywgb3B0aW9ucy5jaXJjbGVQcm9wcyk7XG4gICAgY2lyY2xlT3B0aW9ucy5wb2x5bGluZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DSVJDTEVfT1BUSU9OUy5wb2x5bGluZVByb3BzLCBvcHRpb25zLnBvbHlsaW5lUHJvcHMpO1xuICAgIHJldHVybiBjaXJjbGVPcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9pbnQoaWQ6IHN0cmluZyk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5jZW50ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1c1Bvc2l0aW9uKGlkOiBzdHJpbmcpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldFJhZGl1c1BvaW50KCk7XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1cyhpZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldFJhZGl1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaXJjbGVQcm9wZXJ0aWVzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlcjogY2lyY2xlLmdldENlbnRlcigpLFxuICAgICAgcmFkaXVzUG9pbnQ6IGNpcmNsZS5nZXRSYWRpdXNQb2ludCgpLFxuICAgICAgcmFkaXVzOiBjaXJjbGUuZ2V0UmFkaXVzKCksXG4gICAgfTtcbiAgfVxufVxuIl19
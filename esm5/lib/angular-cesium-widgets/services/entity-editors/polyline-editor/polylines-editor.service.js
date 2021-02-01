import { __assign, __decorate, __read, __spread } from "tslib";
import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditPoint } from '../../../models/edit-point';
import { EditPolyline } from '../../../models';
import { debounce, generateKey } from '../../utils';
var ɵ0 = function () { return Cesium.Color.BLACK; };
export var DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        material: ɵ0,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: Cesium.ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
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
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
var PolylinesEditorService = /** @class */ (function () {
    function PolylinesEditorService() {
        var _this = this;
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce(function (id, clampHeightTo3D, clampHeightTo3DOptions) {
            _this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    PolylinesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, polylinesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    PolylinesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    PolylinesEditorService.prototype.clampPoints = function (id, clampHeightTo3D, _a) {
        var _this = this;
        var clampToTerrain = _a.clampToTerrain, clampMostDetailed = _a.clampMostDetailed, clampToHeightPickWidth = _a.clampToHeightPickWidth;
        if (clampHeightTo3D && clampMostDetailed) {
            var polyline = this.polylinesManager.get(id);
            var points_1 = polyline.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points_1.forEach(function (point) {
                    point.setPosition(_this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
            }
            else {
                var cartographics = points_1.map(function (point) { return _this.coordinateConverter.cartesian3ToCartographic(point.getPosition()); });
                var promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                Cesium.when(promise, function (updatedPositions) {
                    points_1.forEach(function (point, index) {
                        point.setPosition(Cesium.Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    };
    PolylinesEditorService.prototype.screenToPosition = function (cartesian2, clampHeightTo3D, _a) {
        var _this = this;
        var clampToHeightPickWidth = _a.clampToHeightPickWidth, clampToTerrain = _a.clampToTerrain;
        var cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            var globePositionPick = function () {
                var ray = _this.cameraService.getCamera().getPickRay(cartesian2);
                return _this.cesiumScene.globe.pick(ray, _this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                var cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                var latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    };
    PolylinesEditorService.prototype.create = function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        var positions = [];
        var id = generateKey();
        var polylineOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            modifier: polylineOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            modifier: polylineOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var allPositions = _this.getPositions(id);
            if (allPositions.find(function (cartesian) { return cartesian.equals(position); })) {
                return;
            }
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign(__assign({}, updateValue), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        });
        addLastPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        });
        return editorObservable;
    };
    PolylinesEditorService.prototype.switchToEditMode = function (id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        var update = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        var changeMode = {
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    PolylinesEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        var id = generateKey();
        var polylineOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    };
    PolylinesEditorService.prototype.editPolyline = function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.editedEntityId; },
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.polylinesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                var endDragPosition = _this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                var startDragPosition = _this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            });
        }
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.polylinesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var position = _this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var point = entities[0];
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        pointRemoveRegistration.subscribe(function (_a) {
            var entities = _a.entities;
            var point = entities[0];
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 3) {
                return;
            }
            var index = allPositions.findIndex(function (position) { return point.getPosition().equals(position); });
            if (index < 0) {
                return;
            }
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    PolylinesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        var polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps), options.pointProps);
        polylineOptions.polylineProps = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps), options.polylineProps);
        polylineOptions.clampHeightTo3DOptions = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error("Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D");
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn("Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D");
            }
            if (polylineOptions.pointProps.color.alpha === 1 || polylineOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polylineOptions.allowDrag = false;
            polylineOptions.polylineProps.clampToGround = true;
            polylineOptions.pointProps.heightReference = polylineOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            polylineOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polylineOptions;
    };
    PolylinesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
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
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (points, polylineProps) {
            var polyline = _this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
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
        observableToExtend.getCurrentPoints = function () { return _this.getPoints(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.polylinesManager.get(id).labels; };
        return observableToExtend;
    };
    PolylinesEditorService.prototype.getPositions = function (id) {
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    };
    PolylinesEditorService.prototype.getPoints = function (id) {
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    };
    PolylinesEditorService = __decorate([
        Injectable()
    ], PolylinesEditorService);
    return PolylinesEditorService;
}());
export { PolylinesEditorService };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQUM5RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRWhFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVGQUF1RixDQUFDO0FBQzVILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQVF2RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7U0FxQnRDLGNBQU0sT0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBbEIsQ0FBa0I7QUFsQnRDLE1BQU0sQ0FBQyxJQUFNLHdCQUF3QixHQUF3QjtJQUMzRCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLGlCQUFpQjtJQUNoRCxnQkFBZ0IsRUFBRSxXQUFXLENBQUMs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RSxFQUE3QixDQUE2QixDQUFDO1FBRXRFLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxjQUFvQixPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFwQyxDQUFvQyxDQUFDO1FBRXhGLE9BQU8sa0JBQThDLENBQUM7SUFDeEQsQ0FBQztJQUVPLDZDQUFZLEdBQXBCLFVBQXFCLEVBQVU7UUFDN0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTywwQ0FBUyxHQUFqQixVQUFrQixFQUFVO1FBQzFCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsT0FBTyxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQXpmVSxzQkFBc0I7UUFEbEMsVUFBVSxFQUFFO09BQ0Esc0JBQXNCLENBMGZsQztJQUFELDZCQUFDO0NBQUEsQUExZkQsSUEwZkM7U0ExZlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVibGlzaCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wb2x5bGluZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENsYW1wVG8zRE9wdGlvbnMsIFBvbHlsaW5lRWRpdE9wdGlvbnMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZGVib3VuY2UsIGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUzogUG9seWxpbmVFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgYWRkTGFzdFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfRE9VQkxFX0NMSUNLLFxuICByZW1vdmVQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45NSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuNSksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICAgIHdpZHRoOiAzLFxuICAgIGNsYW1wVG9Hcm91bmQ6IGZhbHNlLFxuICAgIHpJbmRleDogMCxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgfSxcbiAgY2xhbXBIZWlnaHRUbzNEOiBmYWxzZSxcbiAgY2xhbXBIZWlnaHRUbzNET3B0aW9uczoge1xuICAgIGNsYW1wVG9UZXJyYWluOiBmYWxzZSxcbiAgICBjbGFtcE1vc3REZXRhaWxlZDogdHJ1ZSxcbiAgICBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoOiAyLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5bGluZXNcbiAqXG4gKiAgKiBZb3UgbXVzdCBwcm92aWRlIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxwb2x5bGluZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5bGluZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBwb2x5bGluZVxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWxpbmVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5bGluZSBmcm9tIGV4aXN0aW5nIHBvbHlsaW5lIGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnBvbHlsaW5lc0VkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlsaW5lRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lO1xuXG4gIHByaXZhdGUgY2xhbXBQb2ludHNEZWJvdW5jZWQgPSBkZWJvdW5jZSgoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucykgPT4ge1xuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRCwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gIH0sIDMwMCk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5wb2x5bGluZXNNYW5hZ2VyID0gcG9seWxpbmVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFBvbHlsaW5lRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgeyBjbGFtcFRvVGVycmFpbiwgY2xhbXBNb3N0RGV0YWlsZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGggfTogQ2xhbXBUbzNET3B0aW9ucykge1xuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2xhbXBNb3N0RGV0YWlsZWQpIHtcbiAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjb25zdCBwb2ludHMgPSBwb2x5bGluZS5nZXRQb2ludHMoKTtcblxuICAgICAgaWYgKCFjbGFtcFRvVGVycmFpbikge1xuICAgICAgICAvLyAzZFRpbGVzXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgICAgICBwb2ludC5zZXRQb3NpdGlvbih0aGlzLmNlc2l1bVNjZW5lLmNsYW1wVG9IZWlnaHQocG9pbnQuZ2V0UG9zaXRpb24oKSwgdW5kZWZpbmVkLCBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydG9ncmFwaGljcyA9IHBvaW50cy5tYXAocG9pbnQgPT4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhwb2ludC5nZXRQb3NpdGlvbigpKSk7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBDZXNpdW0uc2FtcGxlVGVycmFpbih0aGlzLmNlc2l1bVNjZW5lLnRlcnJhaW5Qcm92aWRlciwgMTEsIGNhcnRvZ3JhcGhpY3MpO1xuICAgICAgICBDZXNpdW0ud2hlbihwcm9taXNlLCBmdW5jdGlvbiAodXBkYXRlZFBvc2l0aW9ucykge1xuICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHBvaW50LnNldFBvc2l0aW9uKENlc2l1bS5DYXJ0b2dyYXBoaWMudG9DYXJ0ZXNpYW4odXBkYXRlZFBvc2l0aW9uc1tpbmRleF0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBwcml2YXRlIHNjcmVlblRvUG9zaXRpb24oY2FydGVzaWFuMiwgY2xhbXBIZWlnaHRUbzNEOiBib29sZWFuLCB7Y2xhbXBUb0hlaWdodFBpY2tXaWR0aCwgY2xhbXBUb1RlcnJhaW59OiBDbGFtcFRvM0RPcHRpb25zKSB7XG4gICAgY29uc3QgY2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoY2FydGVzaWFuMik7XG5cbiAgICAvLyBJZiBjYXJ0ZXNpYW4zIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBwb2ludCBpbnN0IG9uIHRoZSBnbG9iZVxuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2FydGVzaWFuMykge1xuICAgICAgY29uc3QgZ2xvYmVQb3NpdGlvblBpY2sgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJheSA9IHRoaXMuY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKS5nZXRQaWNrUmF5KGNhcnRlc2lhbjIpO1xuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5nbG9iZS5waWNrKHJheSwgdGhpcy5jZXNpdW1TY2VuZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBpcyB0ZXJyYWluP1xuICAgICAgaWYgKGNsYW1wVG9UZXJyYWluKSB7XG4gICAgICAgIHJldHVybiBnbG9iZVBvc2l0aW9uUGljaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydGVzaWFuM1BpY2tQb3NpdGlvbiA9IHRoaXMuY2VzaXVtU2NlbmUucGlja1Bvc2l0aW9uKGNhcnRlc2lhbjIpO1xuICAgICAgICBjb25zdCBsYXRMb24gPSBDb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKGxhdExvbi5oZWlnaHQgPCAwKSB7Ly8gbWVhbnMgbm90aGluZyBwaWNrZWQgLT4gVmFsaWRhdGUgaXRcbiAgICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KGNhcnRlc2lhbjNQaWNrUG9zaXRpb24sIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcnRlc2lhbjM7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgZXZlbnRQcmlvcml0eSA9IDEwMCk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5bGluZU9wdGlvbnMuYWRkUG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBwb2x5bGluZU9wdGlvbnMuYWRkUG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgfSk7XG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5bGluZU9wdGlvbnMuYWRkTGFzdFBvaW50RXZlbnQsXG4gICAgICBtb2RpZmllcjogcG9seWxpbmVPcHRpb25zLmFkZExhc3RQb2ludE1vZGlmaWVyLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbiwgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQpO1xuXG4gICAgbW91c2VNb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZVZhbHVlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG4gICAgICBpZiAocG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBhbGxQb3NpdGlvbnMubGVuZ3RoICsgMSA9PT0gcG9seWxpbmVPcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cykge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gcG9zaXRpb24gYWxyZWFkeSBhZGRlZCBieSBhZGRQb2ludFJlZ2lzdHJhdGlvblxuICAgICAgZmluaXNoZWRDcmVhdGUgPSB0aGlzLnN3aXRjaFRvRWRpdE1vZGUoXG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgIHBvc2l0aW9ucyxcbiAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgcG9seWxpbmVPcHRpb25zLFxuICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc3dpdGNoVG9FZGl0TW9kZShpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50UHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoZWRDcmVhdGU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoYW5nZU1vZGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgIHRoaXMuZWRpdFBvbHlsaW5lKGlkLCBwb3NpdGlvbnMsIGV2ZW50UHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBwb2x5bGluZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gIH1cblxuICBlZGl0KHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLCBvcHRpb25zID0gREVGQVVMVF9QT0xZTElORV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvbHlsaW5lcyBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5bGluZSBzaG91bGQgaGF2ZSBhdCBsZWFzdCAyIHBvc2l0aW9ucycpO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5lZGl0UG9seWxpbmUoXG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBwb2x5bGluZU9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGl0UG9seWxpbmUoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlKSB7XG4gICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG5cbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5yZW1vdmVQb2ludEV2ZW50LFxuICAgICAgbW9kaWZpZXI6IG9wdGlvbnMucmVtb3ZlUG9pbnRNb2RpZmllcixcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICB9KTtcblxuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5kcmFnU2hhcGVFdmVudCxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdFBvbHlsaW5lLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb25cbiAgICAgICAgLnBpcGUodGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIGZhbHNlLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKHN0YXJ0UG9zaXRpb24sIGZhbHNlLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZHJhZ2dlZFBvc2l0aW9uOiBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcblxuICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19QT0lOVF9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xhbXBQb2ludHNEZWJvdW5jZWQoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgfSk7XG5cbiAgICBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gWy4uLnRoaXMuZ2V0UG9zaXRpb25zKGlkKV07XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5kZXggPSBhbGxQb3NpdGlvbnMuZmluZEluZGV4KHBvc2l0aW9uID0+IHBvaW50LmdldFBvc2l0aW9uKCkuZXF1YWxzKHBvc2l0aW9uIGFzIENhcnRlc2lhbjMpKTtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5SRU1PVkVfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNsYW1wUG9pbnRzKGlkLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbiwgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogUG9seWxpbmVFZGl0T3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9QT0xZTElORV9PUFRJT05TKSk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzID0gey4uLkRFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUy5wb2ludFByb3BzLCAuLi5vcHRpb25zLnBvaW50UHJvcHN9O1xuICAgIHBvbHlsaW5lT3B0aW9ucy5wb2x5bGluZVByb3BzID0gey4uLkRFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUy5wb2x5bGluZVByb3BzLCAuLi5vcHRpb25zLnBvbHlsaW5lUHJvcHN9O1xuICAgIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zID0gey4uLkRFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUy5jbGFtcEhlaWdodFRvM0RPcHRpb25zLCAuLi5vcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnN9O1xuXG4gICAgaWYgKG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNEKSB7XG4gICAgICBpZiAoIXRoaXMuY2VzaXVtU2NlbmUucGlja1Bvc2l0aW9uU3VwcG9ydGVkIHx8ICF0aGlzLmNlc2l1bVNjZW5lLmNsYW1wVG9IZWlnaHRTdXBwb3J0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDZXNpdW0gcGlja1Bvc2l0aW9uIGFuZCBjbGFtcFRvSGVpZ2h0IG11c3QgYmUgc3VwcG9ydGVkIHRvIHVzZSBjbGFtcEhlaWdodFRvM0RgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2VzaXVtU2NlbmUucGlja1RyYW5zbHVjZW50RGVwdGgpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBDZXNpdW0gc2NlbmUucGlja1RyYW5zbHVjZW50RGVwdGggbXVzdCBiZSBmYWxzZSBpbiBvcmRlciB0byBtYWtlIHRoZSBlZGl0b3JzIHdvcmsgcHJvcGVybHkgb24gM0RgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmNvbG9yLmFscGhhID09PSAxIHx8IHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLm91dGxpbmVDb2xvci5hbHBoYSA9PT0gMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1BvaW50IGNvbG9yIGFuZCBvdXRsaW5lIGNvbG9yIG11c3QgaGF2ZSBhbHBoYSBpbiBvcmRlciB0byBtYWtlIHRoZSBlZGl0b3Igd29yayBwcm9wZXJseSBvbiAzRCcpO1xuICAgICAgfVxuXG4gICAgICBwb2x5bGluZU9wdGlvbnMuYWxsb3dEcmFnID0gZmFsc2U7XG4gICAgICBwb2x5bGluZU9wdGlvbnMucG9seWxpbmVQcm9wcy5jbGFtcFRvR3JvdW5kID0gdHJ1ZTtcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmhlaWdodFJlZmVyZW5jZSA9IHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zLmNsYW1wVG9UZXJyYWluID9cbiAgICAgICAgQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5DTEFNUF9UT19HUk9VTkQgOiBDZXNpdW0uSGVpZ2h0UmVmZXJlbmNlLlJFTEFUSVZFX1RPX0dST1VORDtcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB9XG4gICAgcmV0dXJuIHBvbHlsaW5lT3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAocG9pbnRzOiB7XG4gICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgIHBvaW50UHJvcD86IFBvaW50UHJvcHNcbiAgICB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlsaW5lUHJvcHM/OiBQb2x5bGluZVByb3BzKSA9PiB7XG4gICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgcG9seWxpbmUuc2V0TWFudWFsbHkocG9pbnRzLCBwb2x5bGluZVByb3BzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnRzID0gKCkgPT4gdGhpcy5nZXRQb2ludHMoaWQpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBQb2x5bGluZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcG9seWxpbmUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlsaW5lLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuIl19
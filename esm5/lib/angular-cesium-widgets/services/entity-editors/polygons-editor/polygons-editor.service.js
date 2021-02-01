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
import { EditablePolygon } from '../../../models/editable-polygon';
import { debounce, generateKey } from '../../utils';
var ɵ0 = function () { return Cesium.Color.WHITE; };
export var DEFAULT_POLYGON_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polygonProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
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
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
var PolygonsEditorService = /** @class */ (function () {
    function PolygonsEditorService() {
        var _this = this;
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce(function (id, clampHeightTo3D, clampHeightTo3DOptions) {
            _this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    PolygonsEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, polygonsManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    PolygonsEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    PolygonsEditorService.prototype.clampPoints = function (id, clampHeightTo3D, _a) {
        var _this = this;
        var clampToTerrain = _a.clampToTerrain, clampMostDetailed = _a.clampMostDetailed, clampToHeightPickWidth = _a.clampToHeightPickWidth;
        if (clampHeightTo3D && clampMostDetailed) {
            var polygon = this.polygonsManager.get(id);
            var points_1 = polygon.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points_1.forEach(function (point) {
                    point.setPosition(_this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
                // const cartesians = points.map(point => point.getPosition());
                // const promise = this.cesiumScene.clampToHeightMostDetailed(cartesians, undefined, clampToHeightPickWidth);
                // promise.then((updatedCartesians) => {
                //   points.forEach((point, index) => {
                //     point.setPosition(updatedCartesians[index]);
                //   });
                // });
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
    PolygonsEditorService.prototype.screenToPosition = function (cartesian2, clampHeightTo3D, _a) {
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
    PolygonsEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var positions = [];
        var id = generateKey();
        var polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            modifier: polygonOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            modifier: polygonOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
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
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
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
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
            }
        });
        addLastPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        });
        return editorObservable;
    };
    PolygonsEditorService.prototype.switchToEditMode = function (id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        var updateValue = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(__assign(__assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
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
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    PolygonsEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        var id = generateKey();
        var polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    };
    PolygonsEditorService.prototype.editPolygon = function (id, positions, priority, editSubject, options, editObservable) {
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
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            modifier: options.removePointModifier,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.polygonsManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
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
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.polygonsManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
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
        pointRemoveRegistration.subscribe(function (_a) {
            var entities = _a.entities;
            var point = entities[0];
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 4) {
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
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    PolygonsEditorService.prototype.setOptions = function (options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        var polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.pointProps), options.pointProps);
        polygonOptions.polygonProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps), options.polygonProps);
        polygonOptions.polylineProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps), options.polylineProps);
        polygonOptions.clampHeightTo3DOptions = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error("Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D");
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn("Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D");
            }
            if (polygonOptions.pointProps.color.alpha === 1 || polygonOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polygonOptions.allowDrag = false;
            polygonOptions.polylineProps.clampToGround = true;
            polygonOptions.pointProps.heightReference = polygonOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            polygonOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polygonOptions;
    };
    PolygonsEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
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
        observableToExtend.setManually = function (points, polygonProps) {
            var polygon = _this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
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
        observableToExtend.getLabels = function () { return _this.polygonsManager.get(id).labels; };
        return observableToExtend;
    };
    PolygonsEditorService.prototype.getPositions = function (id) {
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    };
    PolygonsEditorService.prototype.getPoints = function (id) {
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    };
    PolygonsEditorService = __decorate([
        Injectable()
    ], PolygonsEditorService);
    return PolygonsEditorService;
}());
export { PolygonsEditorService };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFFOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1RkFBdUYsQ0FBQztBQUM1SCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFLdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBS25FLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO1NBMEJ0QyxjQUFNLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQWxCLENBQWtCO0FBeEJ0QyxNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FBdUI7SUFDekQsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxpQkFBaUI7SUFDaEQsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFdB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YSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQXhnQlUscUJBQXFCO1FBRGpDLFVBQVUsRUFBRTtPQUNBLHFCQUFxQixDQXlnQmpDO0lBQUQsNEJBQUM7Q0FBQSxBQXpnQkQsSUF5Z0JDO1NBemdCWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5Z29uLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlnb25zTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3BvbHlnb25zLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5Z29uLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVkaXRhYmxlUG9seWdvbiB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1wb2x5Z29uJztcbmltcG9ydCB7IFBvbHlnb25FZGl0T3B0aW9ucywgUG9seWdvblByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlnb24tZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IENsYW1wVG8zRE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZGVib3VuY2UsIGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9QT0xZR09OX09QVElPTlM6IFBvbHlnb25FZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgYWRkTGFzdFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfRE9VQkxFX0NMSUNLLFxuICByZW1vdmVQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45NSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuMiksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTMsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlnb25Qcm9wczoge1xuICAgIG1hdGVyaWFsOiBDZXNpdW0uQ29sb3IuQ09STkZMT1dFUkJMVUUud2l0aEFscGhhKDAuNCksXG4gICAgZmlsbDogdHJ1ZSxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgICB6SW5kZXg6IDAsXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgIHdpZHRoOiAzLFxuICAgIGNsYW1wVG9Hcm91bmQ6IGZhbHNlLFxuICAgIHpJbmRleDogMCxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgfSxcbiAgY2xhbXBIZWlnaHRUbzNEOiBmYWxzZSxcbiAgY2xhbXBIZWlnaHRUbzNET3B0aW9uczoge1xuICAgIGNsYW1wVG9UZXJyYWluOiBmYWxzZSxcbiAgICBjbGFtcE1vc3REZXRhaWxlZDogdHJ1ZSxcbiAgICBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoOiAyLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5Z29uc1xuICpcbiAqIFlvdSBtdXN0IHByb3ZpZGUgYFBvbHlnb25zRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPHBvbHlnb25zLWVkaXRvcj5gIGNvbXBvbmVudC4gVGhlcmVmb3IgeW91IG5lZWQgdG8gY3JlYXRlIGA8cG9seWdvbnMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5Z29uc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWdvbkVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYCB0aGF0IGlzIHJldHVybmVkIGZyb20gY2FsbGluZyBgY3JlYXRlKClgIFxcIGBlZGl0KClgIG9mIG9uZSBvZiB0aGUgZWRpdG9yIHNlcnZpY2VzLlxuICogYHNldExhYmVsc1JlbmRlckZuKClgIC0gcmVjZWl2ZXMgYSBjYWxsYmFjayB0aGF0IGlzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSBzaGFwZSBpcyByZWRyYXduXG4gKiAoZXhjZXB0IHdoZW4gdGhlIHNoYXBlIGlzIGJlaW5nIGRyYWdnZWQpLiBUaGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIGxhc3Qgc2hhcGUgc3RhdGUgYW5kIHdpdGggYW4gYXJyYXkgb2YgdGhlIGN1cnJlbnQgbGFiZWxzLlxuICogVGhlIGNhbGxiYWNrIHNob3VsZCByZXR1cm4gdHlwZSBgTGFiZWxQcm9wc1tdYC5cbiAqIFlvdSBjYW4gYWxzbyB1c2UgYHVwZGF0ZUxhYmVscygpYCB0byBwYXNzIGFuIGFycmF5IG9mIGxhYmVscyBvZiB0eXBlIGBMYWJlbFByb3BzW11gIHRvIGJlIGRyYXduLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIHBvbHlnb25cbiAqICBjb25zdCBlZGl0aW5nJCA9IHBvbHlnb25zRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5Z29uIGZyb20gZXhpc3RpbmcgcG9seWdvbiBwb3NpdGlvbnNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMucG9seWdvbnNFZGl0b3JTZXJ2aWNlLmVkaXQoaW5pdGlhbFBvcyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5Z29uc0VkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlnb25FZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBwb2x5Z29uc01hbmFnZXI6IFBvbHlnb25zTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lOiBhbnk7XG5cbiAgcHJpdmF0ZSBjbGFtcFBvaW50c0RlYm91bmNlZCA9IGRlYm91bmNlKChpZCwgY2xhbXBIZWlnaHRUbzNEOiBib29sZWFuLCBjbGFtcEhlaWdodFRvM0RPcHRpb25zKSA9PiB7XG4gICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgY2xhbXBIZWlnaHRUbzNELCBjbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgfSwgMzAwKTtcblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICAgICBwb2x5Z29uc01hbmFnZXI6IFBvbHlnb25zTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLnBvbHlnb25zTWFuYWdlciA9IHBvbHlnb25zTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFBvbHlnb25FZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcFBvaW50cyhpZCwgY2xhbXBIZWlnaHRUbzNEOiBib29sZWFuLCB7IGNsYW1wVG9UZXJyYWluLCBjbGFtcE1vc3REZXRhaWxlZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCB9OiBDbGFtcFRvM0RPcHRpb25zKSB7XG4gICAgaWYgKGNsYW1wSGVpZ2h0VG8zRCAmJiBjbGFtcE1vc3REZXRhaWxlZCkge1xuICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjb25zdCBwb2ludHMgPSBwb2x5Z29uLmdldFBvaW50cygpO1xuXG4gICAgICBpZiAoIWNsYW1wVG9UZXJyYWluKSB7XG4gICAgICAgIC8vIDNkVGlsZXNcbiAgICAgICAgcG9pbnRzLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgICAgIHBvaW50LnNldFBvc2l0aW9uKHRoaXMuY2VzaXVtU2NlbmUuY2xhbXBUb0hlaWdodChwb2ludC5nZXRQb3NpdGlvbigpLCB1bmRlZmluZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGNvbnN0IGNhcnRlc2lhbnMgPSBwb2ludHMubWFwKHBvaW50ID0+IHBvaW50LmdldFBvc2l0aW9uKCkpO1xuICAgICAgICAvLyBjb25zdCBwcm9taXNlID0gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0TW9zdERldGFpbGVkKGNhcnRlc2lhbnMsIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XG4gICAgICAgIC8vIHByb21pc2UudGhlbigodXBkYXRlZENhcnRlc2lhbnMpID0+IHtcbiAgICAgICAgLy8gICBwb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vICAgICBwb2ludC5zZXRQb3NpdGlvbih1cGRhdGVkQ2FydGVzaWFuc1tpbmRleF0pO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgICAvLyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNhcnRvZ3JhcGhpY3MgPSBwb2ludHMubWFwKHBvaW50ID0+IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5jYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWMocG9pbnQuZ2V0UG9zaXRpb24oKSkpO1xuICAgICAgICBjb25zdCBwcm9taXNlID0gQ2VzaXVtLnNhbXBsZVRlcnJhaW4odGhpcy5jZXNpdW1TY2VuZS50ZXJyYWluUHJvdmlkZXIsIDExLCBjYXJ0b2dyYXBoaWNzKTtcbiAgICAgICAgQ2VzaXVtLndoZW4ocHJvbWlzZSwgKHVwZGF0ZWRQb3NpdGlvbnMpID0+IHtcbiAgICAgICAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBwb2ludC5zZXRQb3NpdGlvbihDZXNpdW0uQ2FydG9ncmFwaGljLnRvQ2FydGVzaWFuKHVwZGF0ZWRQb3NpdGlvbnNbaW5kZXhdKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2NyZWVuVG9Qb3NpdGlvbihjYXJ0ZXNpYW4yLCBjbGFtcEhlaWdodFRvM0Q6IGJvb2xlYW4sIHsgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCwgY2xhbXBUb1RlcnJhaW4gfTogQ2xhbXBUbzNET3B0aW9ucykge1xuICAgIGNvbnN0IGNhcnRlc2lhbjMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGNhcnRlc2lhbjIpO1xuXG4gICAgLy8gSWYgY2FydGVzaWFuMyBpcyB1bmRlZmluZWQgdGhlbiB0aGUgcG9pbnQgaW5zdCBvbiB0aGUgZ2xvYmVcbiAgICBpZiAoY2xhbXBIZWlnaHRUbzNEICYmIGNhcnRlc2lhbjMpIHtcbiAgICAgIGNvbnN0IGdsb2JlUG9zaXRpb25QaWNrID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByYXkgPSB0aGlzLmNhbWVyYVNlcnZpY2UuZ2V0Q2FtZXJhKCkuZ2V0UGlja1JheShjYXJ0ZXNpYW4yKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VzaXVtU2NlbmUuZ2xvYmUucGljayhyYXksIHRoaXMuY2VzaXVtU2NlbmUpO1xuICAgICAgfTtcblxuICAgICAgLy8gaXMgdGVycmFpbj9cbiAgICAgIGlmIChjbGFtcFRvVGVycmFpbikge1xuICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNhcnRlc2lhbjNQaWNrUG9zaXRpb24gPSB0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvbihjYXJ0ZXNpYW4yKTtcbiAgICAgICAgY29uc3QgbGF0TG9uID0gQ29vcmRpbmF0ZUNvbnZlcnRlci5jYXJ0ZXNpYW4zVG9MYXRMb24oY2FydGVzaWFuM1BpY2tQb3NpdGlvbik7XG4gICAgICAgIGlmIChsYXRMb24uaGVpZ2h0IDwgMCkgey8vIG1lYW5zIG5vdGhpbmcgcGlja2VkIC0+IFZhbGlkYXRlIGl0XG4gICAgICAgICAgcmV0dXJuIGdsb2JlUG9zaXRpb25QaWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2VzaXVtU2NlbmUuY2xhbXBUb0hlaWdodChjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uLCB1bmRlZmluZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjYXJ0ZXNpYW4zO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX1BPTFlHT05fT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWdvbk9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWdvbkVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFXG4gICAgfSk7XG4gICAgbGV0IGZpbmlzaGVkQ3JlYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIHBvbHlnb25PcHRpb25zOiBwb2x5Z29uT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHBvbHlnb25PcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBtb2RpZmllcjogcG9seWdvbk9wdGlvbnMuYWRkUG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5Z29uT3B0aW9ucy5hZGRMYXN0UG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBwb2x5Z29uT3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkKTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBwb2x5Z29uT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBwb2x5Z29uT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlnb25PcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmZpbmQoKGNhcnRlc2lhbikgPT4gY2FydGVzaWFuLmVxdWFscyhwb3NpdGlvbikpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGVWYWx1ZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlVmFsdWUsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocG9seWdvbk9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzICYmIGFsbFBvc2l0aW9ucy5sZW5ndGggKyAxID09PSBwb2x5Z29uT3B0aW9ucy5tYXhpbXVtTnVtYmVyT2ZQb2ludHMpIHtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSB0aGlzLnN3aXRjaFRvRWRpdE1vZGUoXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgICAgcG9zaXRpb25zLFxuICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgICAgZmluaXNoZWRDcmVhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlnb25PcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHBvc2l0aW9uIGFscmVhZHkgYWRkZWQgYnkgYWRkUG9pbnRSZWdpc3RyYXRpb25cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdGhpcy5zd2l0Y2hUb0VkaXRNb2RlKFxuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb24sXG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICBwb3NpdGlvbnMsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwb2x5Z29uT3B0aW9ucyxcbiAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgZmluaXNoZWRDcmVhdGUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGVWYWx1ZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5Z29uKGlkLCBwb3NpdGlvbnMsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWdvbk9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gIH1cblxuICBlZGl0KHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLCBvcHRpb25zID0gREVGQVVMVF9QT0xZR09OX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUG9seWdvbkVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5Z29ucyBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5Z29uIHNob3VsZCBoYXZlIGF0IGxlYXN0IDMgcG9zaXRpb25zJyk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWdvbkVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWdvbk9wdGlvbnM6IHBvbHlnb25PcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlnb24oXG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBwb2x5Z29uT3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRQb2x5Z29uKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUG9seWdvbkVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUG9seWdvbkVkaXRvck9ic2VydmFibGUpOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG5cbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlUG9seWdvbixcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLnJlbW92ZVBvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBtb2RpZmllcjogb3B0aW9ucy5yZW1vdmVQb2ludE1vZGlmaWVyLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGFtcFBvaW50c0RlYm91bmNlZChpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihzdGFydFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBlbnRpdGllcyB9KSA9PiB7XG4gICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSBbLi4udGhpcy5nZXRQb3NpdGlvbnMoaWQpXTtcbiAgICAgIGlmIChhbGxQb3NpdGlvbnMubGVuZ3RoIDwgNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleCA9IGFsbFBvc2l0aW9ucy5maW5kSW5kZXgocG9zaXRpb24gPT4gcG9pbnQuZ2V0UG9zaXRpb24oKS5lcXVhbHMocG9zaXRpb24gYXMgQ2FydGVzaWFuMykpO1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlJFTU9WRV9QT0lOVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyA8IDMpIHtcbiAgICAgIGNvbnNvbGUud2FybignV2FybjogUG9seWdvbkVkaXRvciBpbnZhbGlkIG9wdGlvbi4nICtcbiAgICAgICAgJyBtYXhpbXVtTnVtYmVyT2ZQb2ludHMgc21hbGxlciB0aGVuIDMsIG1heGltdW1OdW1iZXJPZlBvaW50cyBjaGFuZ2VkIHRvIDMnKTtcbiAgICAgIG9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzID0gMztcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfUE9MWUdPTl9PUFRJT05TKSk7XG4gICAgY29uc3QgcG9seWdvbk9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzID0geyAuLi5ERUZBVUxUX1BPTFlHT05fT1BUSU9OUy5wb2ludFByb3BzLCAuLi5vcHRpb25zLnBvaW50UHJvcHN9O1xuICAgIHBvbHlnb25PcHRpb25zLnBvbHlnb25Qcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlHT05fT1BUSU9OUy5wb2x5Z29uUHJvcHMsIC4uLm9wdGlvbnMucG9seWdvblByb3BzfTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2x5bGluZVByb3BzID0gey4uLkRFRkFVTFRfUE9MWUdPTl9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIC4uLm9wdGlvbnMucG9seWxpbmVQcm9wc307XG4gICAgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyA9IHsgLi4uREVGQVVMVF9QT0xZR09OX09QVElPTlMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucywgLi4ub3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zfTtcblxuICAgIGlmIChvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgaWYgKCF0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvblN1cHBvcnRlZCB8fCAhdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0U3VwcG9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2VzaXVtIHNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoIG11c3QgYmUgZmFsc2UgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9ycyB3b3JrIHByb3Blcmx5IG9uIDNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzLmNvbG9yLmFscGhhID09PSAxIHx8IHBvbHlnb25PcHRpb25zLnBvaW50UHJvcHMub3V0bGluZUNvbG9yLmFscGhhID09PSAxKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignUG9pbnQgY29sb3IgYW5kIG91dGxpbmUgY29sb3IgbXVzdCBoYXZlIGFscGhhIGluIG9yZGVyIHRvIG1ha2UgdGhlIGVkaXRvciB3b3JrIHByb3Blcmx5IG9uIDNEJyk7XG4gICAgICB9XG5cbiAgICAgIHBvbHlnb25PcHRpb25zLmFsbG93RHJhZyA9IGZhbHNlO1xuICAgICAgcG9seWdvbk9wdGlvbnMucG9seWxpbmVQcm9wcy5jbGFtcFRvR3JvdW5kID0gdHJ1ZTtcbiAgICAgIHBvbHlnb25PcHRpb25zLnBvaW50UHJvcHMuaGVpZ2h0UmVmZXJlbmNlID0gcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucy5jbGFtcFRvVGVycmFpbiA/XG4gICAgICAgIENlc2l1bS5IZWlnaHRSZWZlcmVuY2UuQ0xBTVBfVE9fR1JPVU5EIDogQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5SRUxBVElWRV9UT19HUk9VTkQ7XG4gICAgICBwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB9XG4gICAgcmV0dXJuIHBvbHlnb25PcHRpb25zO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcpOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKHBvaW50czoge1xuICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsIHBvaW50UHJvcHM6IFBvaW50UHJvcHNcbiAgICB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlnb25Qcm9wcz86IFBvbHlnb25Qcm9wcykgPT4ge1xuICAgICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBwb2x5Z29uLnNldFBvaW50c01hbnVhbGx5KHBvaW50cywgcG9seWdvblByb3BzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpLmxhYmVscztcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgUG9seWdvbkVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlnb24uZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5Z29uLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuIl19
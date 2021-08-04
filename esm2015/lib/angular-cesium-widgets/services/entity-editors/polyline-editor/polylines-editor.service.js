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
const ɵ0 = () => Cesium.Color.BLACK;
export const DEFAULT_POLYLINE_OPTIONS = {
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
export class PolylinesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce((id, clampHeightTo3D, clampHeightTo3DOptions) => {
            this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    init(mapEventsManager, coordinateConverter, cameraService, polylinesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    clampPoints(id, clampHeightTo3D, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }) {
        if (clampHeightTo3D && clampMostDetailed) {
            const polyline = this.polylinesManager.get(id);
            const points = polyline.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points.forEach(point => {
                    point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
            }
            else {
                const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
                const promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                Cesium.when(promise, function (updatedPositions) {
                    points.forEach((point, index) => {
                        point.setPosition(Cesium.Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    }
    screenToPosition(cartesian2, clampHeightTo3D, { clampToHeightPickWidth, clampToTerrain }) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            const globePositionPick = () => {
                const ray = this.cameraService.getCamera().getPickRay(cartesian2);
                return this.cesiumScene.globe.pick(ray, this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    }
    create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100) {
        const positions = [];
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            modifier: polylineOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            modifier: polylineOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            if (allPositions.find((cartesian) => cartesian.equals(position))) {
                return;
            }
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = finishCreation(position);
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // Add last point to positions if not already added
            const allPositions = this.getPositions(id);
            if (!allPositions.find((cartesian) => cartesian.equals(position))) {
                const updateValue = {
                    id,
                    positions: allPositions,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(updateValue);
                clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            }
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(registration => registration.dispose());
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(positions, options = DEFAULT_POLYLINE_OPTIONS, priority = 100) {
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    }
    editPolyline(id, positions, priority, editSubject, options, editObservable) {
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.editedEntityId,
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                const startDragPosition = this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            });
        }
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        pointRemoveRegistration.subscribe(({ entities }) => {
            const point = entities[0];
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 3) {
                return;
            }
            const index = allPositions.findIndex(position => point.getPosition().equals(position));
            if (index < 0) {
                return;
            }
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        const polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps), options.pointProps);
        polylineOptions.polylineProps = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps), options.polylineProps);
        polylineOptions.clampHeightTo3DOptions = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
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
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (points, polylineProps) => {
            const polyline = this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Polylines editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.polylinesManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    }
    getPoints(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    }
}
PolylinesEditorService.decorators = [
    { type: Injectable }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1RkFBdUYsQ0FBQztBQUM1SCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFRdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO1dBcUJ0QyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7QUFsQnRDLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUF3QjtJQUMzRCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLGlCQUFpQjtJQUNo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QyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsT0FBTyxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbEMsQ0FBQzs7O1lBbGhCRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHVibGlzaCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlsaW5lc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wb2x5bGluZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENsYW1wVG8zRE9wdGlvbnMsIFBvbHlsaW5lRWRpdE9wdGlvbnMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZGVib3VuY2UsIGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUzogUG9seWxpbmVFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgYWRkTGFzdFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfRE9VQkxFX0NMSUNLLFxuICByZW1vdmVQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURS53aXRoQWxwaGEoMC45NSksXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuNSksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTUsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLkJMQUNLLFxuICAgIHdpZHRoOiAzLFxuICAgIGNsYW1wVG9Hcm91bmQ6IGZhbHNlLFxuICAgIHpJbmRleDogMCxcbiAgICBjbGFzc2lmaWNhdGlvblR5cGU6IENlc2l1bS5DbGFzc2lmaWNhdGlvblR5cGUuQk9USCxcbiAgfSxcbiAgY2xhbXBIZWlnaHRUbzNEOiBmYWxzZSxcbiAgY2xhbXBIZWlnaHRUbzNET3B0aW9uczoge1xuICAgIGNsYW1wVG9UZXJyYWluOiBmYWxzZSxcbiAgICBjbGFtcE1vc3REZXRhaWxlZDogdHJ1ZSxcbiAgICBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoOiAyLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5bGluZXNcbiAqXG4gKiAgKiBZb3UgbXVzdCBwcm92aWRlIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxwb2x5bGluZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5bGluZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBwb2x5bGluZVxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWxpbmVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5bGluZSBmcm9tIGV4aXN0aW5nIHBvbHlsaW5lIGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnBvbHlsaW5lc0VkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlsaW5lRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lO1xuXG4gIHByaXZhdGUgY2xhbXBQb2ludHNEZWJvdW5jZWQgPSBkZWJvdW5jZSgoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucykgPT4ge1xuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRCwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gIH0sIDMwMCk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5wb2x5bGluZXNNYW5hZ2VyID0gcG9seWxpbmVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFBvbHlsaW5lRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgeyBjbGFtcFRvVGVycmFpbiwgY2xhbXBNb3N0RGV0YWlsZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGggfTogQ2xhbXBUbzNET3B0aW9ucykge1xuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2xhbXBNb3N0RGV0YWlsZWQpIHtcbiAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjb25zdCBwb2ludHMgPSBwb2x5bGluZS5nZXRQb2ludHMoKTtcblxuICAgICAgaWYgKCFjbGFtcFRvVGVycmFpbikge1xuICAgICAgICAvLyAzZFRpbGVzXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgICAgICBwb2ludC5zZXRQb3NpdGlvbih0aGlzLmNlc2l1bVNjZW5lLmNsYW1wVG9IZWlnaHQocG9pbnQuZ2V0UG9zaXRpb24oKSwgdW5kZWZpbmVkLCBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydG9ncmFwaGljcyA9IHBvaW50cy5tYXAocG9pbnQgPT4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhwb2ludC5nZXRQb3NpdGlvbigpKSk7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBDZXNpdW0uc2FtcGxlVGVycmFpbih0aGlzLmNlc2l1bVNjZW5lLnRlcnJhaW5Qcm92aWRlciwgMTEsIGNhcnRvZ3JhcGhpY3MpO1xuICAgICAgICBDZXNpdW0ud2hlbihwcm9taXNlLCBmdW5jdGlvbiAodXBkYXRlZFBvc2l0aW9ucykge1xuICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHBvaW50LnNldFBvc2l0aW9uKENlc2l1bS5DYXJ0b2dyYXBoaWMudG9DYXJ0ZXNpYW4odXBkYXRlZFBvc2l0aW9uc1tpbmRleF0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBwcml2YXRlIHNjcmVlblRvUG9zaXRpb24oY2FydGVzaWFuMiwgY2xhbXBIZWlnaHRUbzNEOiBib29sZWFuLCB7Y2xhbXBUb0hlaWdodFBpY2tXaWR0aCwgY2xhbXBUb1RlcnJhaW59OiBDbGFtcFRvM0RPcHRpb25zKSB7XG4gICAgY29uc3QgY2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoY2FydGVzaWFuMik7XG5cbiAgICAvLyBJZiBjYXJ0ZXNpYW4zIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBwb2ludCBpbnN0IG9uIHRoZSBnbG9iZVxuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2FydGVzaWFuMykge1xuICAgICAgY29uc3QgZ2xvYmVQb3NpdGlvblBpY2sgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJheSA9IHRoaXMuY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKS5nZXRQaWNrUmF5KGNhcnRlc2lhbjIpO1xuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5nbG9iZS5waWNrKHJheSwgdGhpcy5jZXNpdW1TY2VuZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBpcyB0ZXJyYWluP1xuICAgICAgaWYgKGNsYW1wVG9UZXJyYWluKSB7XG4gICAgICAgIHJldHVybiBnbG9iZVBvc2l0aW9uUGljaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydGVzaWFuM1BpY2tQb3NpdGlvbiA9IHRoaXMuY2VzaXVtU2NlbmUucGlja1Bvc2l0aW9uKGNhcnRlc2lhbjIpO1xuICAgICAgICBjb25zdCBsYXRMb24gPSBDb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKGxhdExvbi5oZWlnaHQgPCAwKSB7Ly8gbWVhbnMgbm90aGluZyBwaWNrZWQgLT4gVmFsaWRhdGUgaXRcbiAgICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KGNhcnRlc2lhbjNQaWNrUG9zaXRpb24sIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcnRlc2lhbjM7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgZXZlbnRQcmlvcml0eSA9IDEwMCk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgcG9zaXRpb25zLFxuICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBtb2RpZmllcjogcG9seWxpbmVPcHRpb25zLmFkZFBvaW50TW9kaWZpZXIsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZExhc3RQb2ludEV2ZW50LFxuICAgICAgbW9kaWZpZXI6IHBvbHlsaW5lT3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkLCBmaW5pc2hDcmVhdGlvbik7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmZpbmQoKGNhcnRlc2lhbikgPT4gY2FydGVzaWFuLmVxdWFscyhwb3NpdGlvbikpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcbiAgICAgIGlmIChwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzICYmIGFsbFBvc2l0aW9ucy5sZW5ndGggKyAxID09PSBwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzKSB7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGxhc3QgcG9pbnQgdG8gcG9zaXRpb25zIGlmIG5vdCBhbHJlYWR5IGFkZGVkXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoIWFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5bGluZShpZCwgcG9zaXRpb25zLCBldmVudFByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWxpbmVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xuICB9XG5cbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5bGluZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogcG9seWxpbmUgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMiBwb3NpdGlvbnMnKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvbHlsaW5lT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcbiAgICB9KTtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIHBvbHlsaW5lT3B0aW9uczogcG9seWxpbmVPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlsaW5lKFxuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgcG9seWxpbmVPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdFBvbHlsaW5lKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+LFxuICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0T2JzZXJ2YWJsZT86IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSkge1xuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuXG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBvcHRpb25zLnJlbW92ZVBvaW50TW9kaWZpZXIsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2x5bGluZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihzdGFydFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvbi5waXBlKFxuICAgICAgdGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG5cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNsYW1wUG9pbnRzRGVib3VuY2VkKGlkLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IGVudGl0aWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IFsuLi50aGlzLmdldFBvc2l0aW9ucyhpZCldO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5sZW5ndGggPCAzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluZGV4ID0gYWxsUG9zaXRpb25zLmZpbmRJbmRleChwb3NpdGlvbiA9PiBwb2ludC5nZXRQb3NpdGlvbigpLmVxdWFscyhwb3NpdGlvbiBhcyBDYXJ0ZXNpYW4zKSk7XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuUkVNT1ZFX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb24sIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUykpO1xuICAgIGNvbnN0IHBvbHlsaW5lT3B0aW9uczogUG9seWxpbmVFZGl0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9pbnRQcm9wcywgLi4ub3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICBwb2x5bGluZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9seWxpbmVQcm9wcywgLi4ub3B0aW9ucy5wb2x5bGluZVByb3BzfTtcbiAgICBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucywgLi4ub3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zfTtcblxuICAgIGlmIChvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgaWYgKCF0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvblN1cHBvcnRlZCB8fCAhdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0U3VwcG9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2VzaXVtIHNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoIG11c3QgYmUgZmFsc2UgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9ycyB3b3JrIHByb3Blcmx5IG9uIDNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5jb2xvci5hbHBoYSA9PT0gMSB8fCBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5vdXRsaW5lQ29sb3IuYWxwaGEgPT09IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdQb2ludCBjb2xvciBhbmQgb3V0bGluZSBjb2xvciBtdXN0IGhhdmUgYWxwaGEgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9yIHdvcmsgcHJvcGVybHkgb24gM0QnKTtcbiAgICAgIH1cblxuICAgICAgcG9seWxpbmVPcHRpb25zLmFsbG93RHJhZyA9IGZhbHNlO1xuICAgICAgcG9seWxpbmVPcHRpb25zLnBvbHlsaW5lUHJvcHMuY2xhbXBUb0dyb3VuZCA9IHRydWU7XG4gICAgICBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5oZWlnaHRSZWZlcmVuY2UgPSBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucy5jbGFtcFRvVGVycmFpbiA/XG4gICAgICAgIENlc2l1bS5IZWlnaHRSZWZlcmVuY2UuQ0xBTVBfVE9fR1JPVU5EIDogQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5SRUxBVElWRV9UT19HUk9VTkQ7XG4gICAgICBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgfVxuICAgIHJldHVybiBwb2x5bGluZU9wdGlvbnM7XG4gIH1cblxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZywgZmluaXNoQ3JlYXRpb24/OiAocG9zaXRpb246IENhcnRlc2lhbjMpID0+IGJvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU0FCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKHBvaW50czoge1xuICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICBwb2ludFByb3A/OiBQb2ludFByb3BzXG4gICAgfVtdIHwgQ2FydGVzaWFuM1tdLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykgPT4ge1xuICAgICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIHBvbHlsaW5lLnNldE1hbnVhbGx5KHBvaW50cywgcG9seWxpbmVQcm9wcyk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5maW5pc2hDcmVhdGlvbiA9ICgpID0+IHtcbiAgICAgIGlmICghZmluaXNoQ3JlYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5bGluZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbihudWxsKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9zaXRpb25zKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5bGluZS5nZXRSZWFsUG9zaXRpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFBvaW50cyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcG9seWxpbmUuZ2V0UmVhbFBvaW50cygpO1xuICB9XG59XG4iXX0=
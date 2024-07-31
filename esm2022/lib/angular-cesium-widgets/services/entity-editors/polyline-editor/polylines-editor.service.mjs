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
import * as i0 from "@angular/core";
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
        material: () => Cesium.Color.BLACK,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: Cesium.ClassificationType.BOTH,
        useGroundPrimitiveOutline: false
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
            clientEditSubject.next({
                ...updateValue,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
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
                clientEditSubject.next({
                    ...updateValue,
                    positions: this.getPositions(id),
                    points: this.getPoints(id),
                });
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
        clientEditSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
        });
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
        editSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
        });
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
                editSubject.next({
                    ...update,
                    positions: this.getPositions(id),
                    points: this.getPoints(id),
                });
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
            editSubject.next({
                ...update,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
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
            editSubject.next({
                ...update,
                positions: this.getPositions(id),
                points: this.getPoints(id),
            });
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
        polylineOptions.pointProps = { ...DEFAULT_POLYLINE_OPTIONS.pointProps, ...options.pointProps };
        polylineOptions.polylineProps = { ...DEFAULT_POLYLINE_OPTIONS.polylineProps, ...options.polylineProps };
        polylineOptions.clampHeightTo3DOptions = { ...DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions, ...options.clampHeightTo3DOptions };
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
            polylineOptions.allowDrag = !!options.allowDrag;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinesEditorService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinesEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrRkFBa0YsQ0FBQztBQUMvRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1RkFBdUYsQ0FBQztBQUM1SCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFRdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUdwRCxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBd0I7SUFDM0QsYUFBYSxFQUFFLFdBQVcsQ0FBQyxVQUFVO0lBQ3JDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxpQkFBaUI7SUFDaEQsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLFdBQVc7SUFDekMsY0FBYyxFQUFFLFdB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QUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0Qsa0JBQWtCLENBQUMsWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRFLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFeEYsT0FBTyxrQkFBOEMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sWUFBWSxDQUFDLEVBQVU7UUFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTyxTQUFTLENBQUMsRUFBVTtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2xDLENBQUM7OEdBamhCVSxzQkFBc0I7a0hBQXRCLHNCQUFzQjs7MkZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vcG9seWxpbmVzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDbGFtcFRvM0RPcHRpb25zLCBQb2x5bGluZUVkaXRPcHRpb25zLCBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVkaXRQb2x5bGluZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IGRlYm91bmNlLCBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BPTFlMSU5FX09QVElPTlM6IFBvbHlsaW5lRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGFkZExhc3RQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0RPVUJMRV9DTElDSyxcbiAgcmVtb3ZlUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOTUpLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjUpLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDE1LFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxuICBwb2x5bGluZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6ICgpID0+IENlc2l1bS5Db2xvci5CTEFDSyxcbiAgICB3aWR0aDogMyxcbiAgICBjbGFtcFRvR3JvdW5kOiBmYWxzZSxcbiAgICB6SW5kZXg6IDAsXG4gICAgY2xhc3NpZmljYXRpb25UeXBlOiBDZXNpdW0uQ2xhc3NpZmljYXRpb25UeXBlLkJPVEgsXG4gICAgdXNlR3JvdW5kUHJpbWl0aXZlT3V0bGluZTogZmFsc2VcbiAgfSxcbiAgY2xhbXBIZWlnaHRUbzNEOiBmYWxzZSxcbiAgY2xhbXBIZWlnaHRUbzNET3B0aW9uczoge1xuICAgIGNsYW1wVG9UZXJyYWluOiBmYWxzZSxcbiAgICBjbGFtcE1vc3REZXRhaWxlZDogdHJ1ZSxcbiAgICBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoOiAyLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2x5bGluZXNcbiAqXG4gKiAgKiBZb3UgbXVzdCBwcm92aWRlIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxwb2x5bGluZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5bGluZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2x5bGluZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyBwb2x5bGluZVxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWxpbmVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2x5bGluZSBmcm9tIGV4aXN0aW5nIHBvbHlsaW5lIGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnBvbHlsaW5lc0VkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFBvbHlsaW5lRWRpdFVwZGF0ZT4oKSh0aGlzLnVwZGF0ZVN1YmplY3QpOyAvLyBUT0RPIG1heWJlIG5vdCBuZWVkZWRcbiAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyO1xuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lO1xuXG4gIHByaXZhdGUgY2xhbXBQb2ludHNEZWJvdW5jZWQgPSBkZWJvdW5jZSgoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucykgPT4ge1xuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRCwgY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gIH0sIDMwMCk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgcG9seWxpbmVzTWFuYWdlcjogUG9seWxpbmVzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5wb2x5bGluZXNNYW5hZ2VyID0gcG9seWxpbmVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFBvbHlsaW5lRWRpdFVwZGF0ZT4ge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1Ymxpc2hlcjtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBQb2ludHMoaWQsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgeyBjbGFtcFRvVGVycmFpbiwgY2xhbXBNb3N0RGV0YWlsZWQsIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGggfTogQ2xhbXBUbzNET3B0aW9ucykge1xuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2xhbXBNb3N0RGV0YWlsZWQpIHtcbiAgICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjb25zdCBwb2ludHMgPSBwb2x5bGluZS5nZXRQb2ludHMoKTtcblxuICAgICAgaWYgKCFjbGFtcFRvVGVycmFpbikge1xuICAgICAgICAvLyAzZFRpbGVzXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgICAgICBwb2ludC5zZXRQb3NpdGlvbih0aGlzLmNlc2l1bVNjZW5lLmNsYW1wVG9IZWlnaHQocG9pbnQuZ2V0UG9zaXRpb24oKSwgdW5kZWZpbmVkLCBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydG9ncmFwaGljcyA9IHBvaW50cy5tYXAocG9pbnQgPT4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhwb2ludC5nZXRQb3NpdGlvbigpKSk7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBDZXNpdW0uc2FtcGxlVGVycmFpbih0aGlzLmNlc2l1bVNjZW5lLnRlcnJhaW5Qcm92aWRlciwgMTEsIGNhcnRvZ3JhcGhpY3MpO1xuICAgICAgICBDZXNpdW0ud2hlbihwcm9taXNlLCBmdW5jdGlvbiAodXBkYXRlZFBvc2l0aW9ucykge1xuICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHBvaW50LnNldFBvc2l0aW9uKENlc2l1bS5DYXJ0b2dyYXBoaWMudG9DYXJ0ZXNpYW4odXBkYXRlZFBvc2l0aW9uc1tpbmRleF0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBwcml2YXRlIHNjcmVlblRvUG9zaXRpb24oY2FydGVzaWFuMiwgY2xhbXBIZWlnaHRUbzNEOiBib29sZWFuLCB7Y2xhbXBUb0hlaWdodFBpY2tXaWR0aCwgY2xhbXBUb1RlcnJhaW59OiBDbGFtcFRvM0RPcHRpb25zKSB7XG4gICAgY29uc3QgY2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoY2FydGVzaWFuMik7XG5cbiAgICAvLyBJZiBjYXJ0ZXNpYW4zIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBwb2ludCBpbnN0IG9uIHRoZSBnbG9iZVxuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2FydGVzaWFuMykge1xuICAgICAgY29uc3QgZ2xvYmVQb3NpdGlvblBpY2sgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJheSA9IHRoaXMuY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKS5nZXRQaWNrUmF5KGNhcnRlc2lhbjIpO1xuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5nbG9iZS5waWNrKHJheSwgdGhpcy5jZXNpdW1TY2VuZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBpcyB0ZXJyYWluP1xuICAgICAgaWYgKGNsYW1wVG9UZXJyYWluKSB7XG4gICAgICAgIHJldHVybiBnbG9iZVBvc2l0aW9uUGljaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydGVzaWFuM1BpY2tQb3NpdGlvbiA9IHRoaXMuY2VzaXVtU2NlbmUucGlja1Bvc2l0aW9uKGNhcnRlc2lhbjIpO1xuICAgICAgICBjb25zdCBsYXRMb24gPSBDb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKGxhdExvbi5oZWlnaHQgPCAwKSB7Ly8gbWVhbnMgbm90aGluZyBwaWNrZWQgLT4gVmFsaWRhdGUgaXRcbiAgICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KGNhcnRlc2lhbjNQaWNrUG9zaXRpb24sIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcnRlc2lhbjM7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgZXZlbnRQcmlvcml0eSA9IDEwMCk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9seWxpbmVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvbHlsaW5lRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWxpbmVPcHRpb25zOiBwb2x5bGluZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uLFxuICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgcG9zaXRpb25zLFxuICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICBwb2x5bGluZU9wdGlvbnMsXG4gICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBtb2RpZmllcjogcG9seWxpbmVPcHRpb25zLmFkZFBvaW50TW9kaWZpZXIsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9seWxpbmVPcHRpb25zLmFkZExhc3RQb2ludEV2ZW50LFxuICAgICAgbW9kaWZpZXI6IHBvbHlsaW5lT3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkLCBmaW5pc2hDcmVhdGlvbik7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWxpbmVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoYWxsUG9zaXRpb25zLmZpbmQoKGNhcnRlc2lhbikgPT4gY2FydGVzaWFuLmVxdWFscyhwb3NpdGlvbikpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcbiAgICAgIGlmIChwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzICYmIGFsbFBvc2l0aW9ucy5sZW5ndGggKyAxID09PSBwb2x5bGluZU9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzKSB7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGxhc3QgcG9pbnQgdG8gcG9zaXRpb25zIGlmIG5vdCBhbHJlYWR5IGFkZGVkXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoIWFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWxpbmVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5bGluZShpZCwgcG9zaXRpb25zLCBldmVudFByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWxpbmVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xuICB9XG5cbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5bGluZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogcG9seWxpbmUgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMiBwb3NpdGlvbnMnKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvbHlsaW5lT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWxpbmVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcbiAgICB9KTtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIHBvbHlsaW5lT3B0aW9uczogcG9seWxpbmVPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlsaW5lKFxuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgcG9seWxpbmVPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdFBvbHlsaW5lKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLFxuICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5bGluZUVkaXRVcGRhdGU+LFxuICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0T2JzZXJ2YWJsZT86IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSkge1xuICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuXG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBvcHRpb25zLnJlbW92ZVBvaW50TW9kaWZpZXIsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2x5bGluZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihzdGFydFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvbi5waXBlKFxuICAgICAgdGFwKCh7IG1vdmVtZW50OiB7IGRyb3AgfSB9KSA9PiB0aGlzLnBvbHlsaW5lc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG5cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNsYW1wUG9pbnRzRGVib3VuY2VkKGlkLCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIH0pO1xuXG4gICAgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IGVudGl0aWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IFsuLi50aGlzLmdldFBvc2l0aW9ucyhpZCldO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5sZW5ndGggPCAzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluZGV4ID0gYWxsUG9zaXRpb25zLmZpbmRJbmRleChwb3NpdGlvbiA9PiBwb2ludC5nZXRQb3NpdGlvbigpLmVxdWFscyhwb3NpdGlvbiBhcyBDYXJ0ZXNpYW4zKSk7XG4gICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgdXBkYXRlZFBvaW50OiBwb2ludCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuUkVNT1ZFX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb24sIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfUE9MWUxJTkVfT1BUSU9OUykpO1xuICAgIGNvbnN0IHBvbHlsaW5lT3B0aW9uczogUG9seWxpbmVFZGl0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9pbnRQcm9wcywgLi4ub3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICBwb2x5bGluZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMucG9seWxpbmVQcm9wcywgLi4ub3B0aW9ucy5wb2x5bGluZVByb3BzfTtcbiAgICBwb2x5bGluZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyA9IHsuLi5ERUZBVUxUX1BPTFlMSU5FX09QVElPTlMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucywgLi4ub3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zfTtcblxuICAgIGlmIChvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgaWYgKCF0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvblN1cHBvcnRlZCB8fCAhdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0U3VwcG9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2VzaXVtIHNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoIG11c3QgYmUgZmFsc2UgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9ycyB3b3JrIHByb3Blcmx5IG9uIDNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5jb2xvci5hbHBoYSA9PT0gMSB8fCBwb2x5bGluZU9wdGlvbnMucG9pbnRQcm9wcy5vdXRsaW5lQ29sb3IuYWxwaGEgPT09IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdQb2ludCBjb2xvciBhbmQgb3V0bGluZSBjb2xvciBtdXN0IGhhdmUgYWxwaGEgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9yIHdvcmsgcHJvcGVybHkgb24gM0QnKTtcbiAgICAgIH1cblxuICAgICAgcG9seWxpbmVPcHRpb25zLmFsbG93RHJhZyA9ICEhb3B0aW9ucy5hbGxvd0RyYWc7XG4gICAgICBwb2x5bGluZU9wdGlvbnMucG9seWxpbmVQcm9wcy5jbGFtcFRvR3JvdW5kID0gdHJ1ZTtcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmhlaWdodFJlZmVyZW5jZSA9IHBvbHlsaW5lT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zLmNsYW1wVG9UZXJyYWluID9cbiAgICAgICAgQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5DTEFNUF9UT19HUk9VTkQgOiBDZXNpdW0uSGVpZ2h0UmVmZXJlbmNlLlJFTEFUSVZFX1RPX0dST1VORDtcbiAgICAgIHBvbHlsaW5lT3B0aW9ucy5wb2ludFByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB9XG4gICAgcmV0dXJuIHBvbHlsaW5lT3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nLCBmaW5pc2hDcmVhdGlvbj86IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4gYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAocG9pbnRzOiB7XG4gICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgIHBvaW50UHJvcD86IFBvaW50UHJvcHNcbiAgICB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlsaW5lUHJvcHM/OiBQb2x5bGluZVByb3BzKSA9PiB7XG4gICAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgcG9seWxpbmUuc2V0TWFudWFsbHkocG9pbnRzLCBwb2x5bGluZVByb3BzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xuICAgICAgaWYgKCFmaW5pc2hDcmVhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvbHlsaW5lcyBlZGl0b3IgZXJyb3IgZWRpdCgpOiBjYW5ub3QgY2FsbCBmaW5pc2hDcmVhdGlvbigpIG9uIGVkaXQnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpbmlzaENyZWF0aW9uKG51bGwpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q3VycmVudFBvaW50cyA9ICgpID0+IHRoaXMuZ2V0UG9pbnRzKGlkKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpLmxhYmVscztcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbnMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5wb2x5bGluZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlsaW5lLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMucG9seWxpbmVzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5bGluZS5nZXRSZWFsUG9pbnRzKCk7XG4gIH1cbn1cbiJdfQ==
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
import * as i0 from "@angular/core";
export const DEFAULT_POLYGON_OPTIONS = {
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
        material: () => Cesium.Color.WHITE,
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
export class PolygonsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce((id, clampHeightTo3D, clampHeightTo3DOptions) => {
            this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    init(mapEventsManager, coordinateConverter, cameraService, polygonsManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    clampPoints(id, clampHeightTo3D, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }) {
        if (clampHeightTo3D && clampMostDetailed) {
            const polygon = this.polygonsManager.get(id);
            const points = polygon.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points.forEach(point => {
                    point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
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
                const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
                const promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                Cesium.when(promise, (updatedPositions) => {
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
    create(options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        const positions = [];
        const id = generateKey();
        const polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            modifier: polygonOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            modifier: polygonOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
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
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
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
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = finishCreation(position);
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
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
    switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        const updateValue = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next({
            ...updateValue,
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
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(positions, options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        const id = generateKey();
        const polygonOptions = this.setOptions(options);
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
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
        });
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    }
    editPolygon(id, positions, priority, editSubject, options, editObservable) {
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
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
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            modifier: options.removePointModifier,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.polygonsManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.polygonsManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
        pointRemoveRegistration.subscribe(({ entities }) => {
            const point = entities[0];
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 4) {
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
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        const polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = { ...DEFAULT_POLYGON_OPTIONS.pointProps, ...options.pointProps };
        polygonOptions.polygonProps = { ...DEFAULT_POLYGON_OPTIONS.polygonProps, ...options.polygonProps };
        polygonOptions.polylineProps = { ...DEFAULT_POLYGON_OPTIONS.polylineProps, ...options.polylineProps };
        polygonOptions.clampHeightTo3DOptions = { ...DEFAULT_POLYGON_OPTIONS.clampHeightTo3DOptions, ...options.clampHeightTo3DOptions };
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
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
        observableToExtend.setManually = (points, polygonProps) => {
            const polygon = this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
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
                throw new Error('Polygons editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.polygonsManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    }
    getPoints(id) {
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    }
}
PolygonsEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolygonsEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolygonsEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolygonsEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolygonsEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbnMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWdvbnMtZWRpdG9yL3BvbHlnb25zLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBRTlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFaEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUZBQXVGLENBQUM7QUFDNUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBS3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtuRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFFcEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQXVCO0lBQ3pELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsaUJBQWlCO0lBQ2hELGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxXQUFXO0lBQ3pDLGNBQWMsRUFBRSxXQUFX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UUFFRixrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQzthQUN2RjtZQUVELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0Qsa0JBQWtCLENBQUMsWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRFLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXZGLE9BQU8sa0JBQTZDLENBQUM7SUFDdkQsQ0FBQztJQUVPLFlBQVksQ0FBQyxFQUFVO1FBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxFQUFVO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7O21IQS9oQlUscUJBQXFCO3VIQUFyQixxQkFBcUI7NEZBQXJCLHFCQUFxQjtrQkFEakMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IFBvbHlnb25FZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlnb24tZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9seWdvbnNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vcG9seWdvbnMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvbHlnb24tZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2x5Z29uIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24nO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRPcHRpb25zLCBQb2x5Z29uUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQ2xhbXBUbzNET3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBkZWJvdW5jZSwgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BPTFlHT05fT1BUSU9OUzogUG9seWdvbkVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBhZGRMYXN0UG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9ET1VCTEVfQ0xJQ0ssXG4gIHJlbW92ZVBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjk1KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSy53aXRoQWxwaGEoMC4yKSxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxMyxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgfSxcbiAgcG9seWdvblByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBmaWxsOiB0cnVlLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICAgIHpJbmRleDogMCxcbiAgfSxcbiAgcG9seWxpbmVQcm9wczoge1xuICAgIG1hdGVyaWFsOiAoKSA9PiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgd2lkdGg6IDMsXG4gICAgY2xhbXBUb0dyb3VuZDogZmFsc2UsXG4gICAgekluZGV4OiAwLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICB9LFxuICBjbGFtcEhlaWdodFRvM0Q6IGZhbHNlLFxuICBjbGFtcEhlaWdodFRvM0RPcHRpb25zOiB7XG4gICAgY2xhbXBUb1RlcnJhaW46IGZhbHNlLFxuICAgIGNsYW1wTW9zdERldGFpbGVkOiB0cnVlLFxuICAgIGNsYW1wVG9IZWlnaHRQaWNrV2lkdGg6IDIsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIHBvbHlnb25zXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgUG9seWdvbnNFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIFBvbHlnb25zRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8cG9seWdvbnMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2x5Z29ucy1lZGl0b3I+YFxuICogZm9yIGVhY2ggYFBvbHlnb25zRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgUG9seWdvbkVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgcG9seWdvblxuICogIGNvbnN0IGVkaXRpbmckID0gcG9seWdvbnNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IHBvbHlnb24gZnJvbSBleGlzdGluZyBwb2x5Z29uIHBvc2l0aW9uc1xuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5wb2x5Z29uc0VkaXRvclNlcnZpY2UuZWRpdChpbml0aWFsUG9zKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlnb25zRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFBvbHlnb25FZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8UG9seWdvbkVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIHBvbHlnb25zTWFuYWdlcjogUG9seWdvbnNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG4gIHByaXZhdGUgY2VzaXVtU2NlbmU6IGFueTtcblxuICBwcml2YXRlIGNsYW1wUG9pbnRzRGVib3VuY2VkID0gZGVib3VuY2UoKGlkLCBjbGFtcEhlaWdodFRvM0Q6IGJvb2xlYW4sIGNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpID0+IHtcbiAgICB0aGlzLmNsYW1wUG9pbnRzKGlkLCBjbGFtcEhlaWdodFRvM0QsIGNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICB9LCAzMDApO1xuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgICAgIHBvbHlnb25zTWFuYWdlcjogUG9seWdvbnNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjZXNpdW1WaWV3ZXI6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMucG9seWdvbnNNYW5hZ2VyID0gcG9seWdvbnNNYW5hZ2VyO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcblxuICAgIHRoaXMuY2VzaXVtU2NlbmUgPSBjZXNpdW1WaWV3ZXIuZ2V0U2NlbmUoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8UG9seWdvbkVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBwcml2YXRlIGNsYW1wUG9pbnRzKGlkLCBjbGFtcEhlaWdodFRvM0Q6IGJvb2xlYW4sIHsgY2xhbXBUb1RlcnJhaW4sIGNsYW1wTW9zdERldGFpbGVkLCBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoIH06IENsYW1wVG8zRE9wdGlvbnMpIHtcbiAgICBpZiAoY2xhbXBIZWlnaHRUbzNEICYmIGNsYW1wTW9zdERldGFpbGVkKSB7XG4gICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGNvbnN0IHBvaW50cyA9IHBvbHlnb24uZ2V0UG9pbnRzKCk7XG5cbiAgICAgIGlmICghY2xhbXBUb1RlcnJhaW4pIHtcbiAgICAgICAgLy8gM2RUaWxlc1xuICAgICAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICAgICAgcG9pbnQuc2V0UG9zaXRpb24odGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KHBvaW50LmdldFBvc2l0aW9uKCksIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gY29uc3QgY2FydGVzaWFucyA9IHBvaW50cy5tYXAocG9pbnQgPT4gcG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIC8vIGNvbnN0IHByb21pc2UgPSB0aGlzLmNlc2l1bVNjZW5lLmNsYW1wVG9IZWlnaHRNb3N0RGV0YWlsZWQoY2FydGVzaWFucywgdW5kZWZpbmVkLCBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoKTtcbiAgICAgICAgLy8gcHJvbWlzZS50aGVuKCh1cGRhdGVkQ2FydGVzaWFucykgPT4ge1xuICAgICAgICAvLyAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gICAgIHBvaW50LnNldFBvc2l0aW9uKHVwZGF0ZWRDYXJ0ZXNpYW5zW2luZGV4XSk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydG9ncmFwaGljcyA9IHBvaW50cy5tYXAocG9pbnQgPT4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhwb2ludC5nZXRQb3NpdGlvbigpKSk7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBDZXNpdW0uc2FtcGxlVGVycmFpbih0aGlzLmNlc2l1bVNjZW5lLnRlcnJhaW5Qcm92aWRlciwgMTEsIGNhcnRvZ3JhcGhpY3MpO1xuICAgICAgICBDZXNpdW0ud2hlbihwcm9taXNlLCAodXBkYXRlZFBvc2l0aW9ucykgPT4ge1xuICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHBvaW50LnNldFBvc2l0aW9uKENlc2l1bS5DYXJ0b2dyYXBoaWMudG9DYXJ0ZXNpYW4odXBkYXRlZFBvc2l0aW9uc1tpbmRleF0pKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzY3JlZW5Ub1Bvc2l0aW9uKGNhcnRlc2lhbjIsIGNsYW1wSGVpZ2h0VG8zRDogYm9vbGVhbiwgeyBjbGFtcFRvSGVpZ2h0UGlja1dpZHRoLCBjbGFtcFRvVGVycmFpbiB9OiBDbGFtcFRvM0RPcHRpb25zKSB7XG4gICAgY29uc3QgY2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoY2FydGVzaWFuMik7XG5cbiAgICAvLyBJZiBjYXJ0ZXNpYW4zIGlzIHVuZGVmaW5lZCB0aGVuIHRoZSBwb2ludCBpbnN0IG9uIHRoZSBnbG9iZVxuICAgIGlmIChjbGFtcEhlaWdodFRvM0QgJiYgY2FydGVzaWFuMykge1xuICAgICAgY29uc3QgZ2xvYmVQb3NpdGlvblBpY2sgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJheSA9IHRoaXMuY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKS5nZXRQaWNrUmF5KGNhcnRlc2lhbjIpO1xuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5nbG9iZS5waWNrKHJheSwgdGhpcy5jZXNpdW1TY2VuZSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBpcyB0ZXJyYWluP1xuICAgICAgaWYgKGNsYW1wVG9UZXJyYWluKSB7XG4gICAgICAgIHJldHVybiBnbG9iZVBvc2l0aW9uUGljaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2FydGVzaWFuM1BpY2tQb3NpdGlvbiA9IHRoaXMuY2VzaXVtU2NlbmUucGlja1Bvc2l0aW9uKGNhcnRlc2lhbjIpO1xuICAgICAgICBjb25zdCBsYXRMb24gPSBDb29yZGluYXRlQ29udmVydGVyLmNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zUGlja1Bvc2l0aW9uKTtcbiAgICAgICAgaWYgKGxhdExvbi5oZWlnaHQgPCAwKSB7Ly8gbWVhbnMgbm90aGluZyBwaWNrZWQgLT4gVmFsaWRhdGUgaXRcbiAgICAgICAgICByZXR1cm4gZ2xvYmVQb3NpdGlvblBpY2soKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0KGNhcnRlc2lhbjNQaWNrUG9zaXRpb24sIHVuZGVmaW5lZCwgY2xhbXBUb0hlaWdodFBpY2tXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcnRlc2lhbjM7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUE9MWUdPTl9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSA9IFtdO1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWdvbk9wdGlvbnM6IHBvbHlnb25PcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQ3JlYXRpb24gPSAocG9zaXRpb246IENhcnRlc2lhbjMpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnN3aXRjaFRvRWRpdE1vZGUoXG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QsXG4gICAgICAgIHBvc2l0aW9ucyxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICBmaW5pc2hlZENyZWF0ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHBvbHlnb25PcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBtb2RpZmllcjogcG9seWdvbk9wdGlvbnMuYWRkUG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBwb2x5Z29uT3B0aW9ucy5hZGRMYXN0UG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBwb2x5Z29uT3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24sIGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkLCBmaW5pc2hDcmVhdGlvbik7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlnb25PcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG5cbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFBvaW50UmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiB9IH0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBwb2x5Z29uT3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xuICAgICAgaWYgKGFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcblxuICAgICAgaWYgKHBvbHlnb25PcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBhbGxQb3NpdGlvbnMubGVuZ3RoICsgMSA9PT0gcG9seWdvbk9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzKSB7XG4gICAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24sIHBvbHlnb25PcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCwgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGxhc3QgcG9pbnQgdG8gcG9zaXRpb25zIGlmIG5vdCBhbHJlYWR5IGFkZGVkXG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSB0aGlzLmdldFBvc2l0aW9ucyhpZCk7XG4gICAgICBpZiAoIWFsbFBvc2l0aW9ucy5maW5kKChjYXJ0ZXNpYW4pID0+IGNhcnRlc2lhbi5lcXVhbHMocG9zaXRpb24pKSkge1xuICAgICAgICBjb25zdCB1cGRhdGVWYWx1ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gZmluaXNoQ3JlYXRpb24ocG9zaXRpb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25PcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yT2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmlzaGVkQ3JlYXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGVWYWx1ZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGVWYWx1ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2x5Z29uKGlkLCBwb3NpdGlvbnMsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcG9seWdvbk9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gIH1cblxuICBlZGl0KHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLCBvcHRpb25zID0gREVGQVVMVF9QT0xZR09OX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUG9seWdvbkVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoIDwgMykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQb2x5Z29ucyBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5Z29uIHNob3VsZCBoYXZlIGF0IGxlYXN0IDMgcG9zaXRpb25zJyk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBwb2x5Z29uT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9seWdvbkVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9seWdvbk9wdGlvbnM6IHBvbHlnb25PcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvbHlnb24oXG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBwb2x5Z29uT3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRQb2x5Z29uKGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sXG4gICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICBlZGl0U3ViamVjdDogU3ViamVjdDxQb2x5Z29uRWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUG9seWdvbkVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUG9seWdvbkVkaXRvck9ic2VydmFibGUpOiBQb2x5Z29uRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgdGhpcy5jbGFtcFBvaW50cyhpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG5cbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlUG9seWdvbixcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLnJlbW92ZVBvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBtb2RpZmllcjogb3B0aW9ucy5yZW1vdmVQb2ludE1vZGlmaWVyLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbiwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGFtcFBvaW50c0RlYm91bmNlZChpZCwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0QsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihzdGFydFBvc2l0aW9uLCBmYWxzZSwgb3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBlbnRpdGllcyB9KSA9PiB7XG4gICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICBjb25zdCBhbGxQb3NpdGlvbnMgPSBbLi4udGhpcy5nZXRQb3NpdGlvbnMoaWQpXTtcbiAgICAgIGlmIChhbGxQb3NpdGlvbnMubGVuZ3RoIDwgNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleCA9IGFsbFBvc2l0aW9ucy5maW5kSW5kZXgocG9zaXRpb24gPT4gcG9pbnQuZ2V0UG9zaXRpb24oKS5lcXVhbHMocG9zaXRpb24gYXMgQ2FydGVzaWFuMykpO1xuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogYWxsUG9zaXRpb25zLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlJFTU9WRV9QT0lOVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY2xhbXBQb2ludHMoaWQsIG9wdGlvbnMuY2xhbXBIZWlnaHRUbzNELCBvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uLCBwb2ludFJlbW92ZVJlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyAmJiBvcHRpb25zLm1heGltdW1OdW1iZXJPZlBvaW50cyA8IDMpIHtcbiAgICAgIGNvbnNvbGUud2FybignV2FybjogUG9seWdvbkVkaXRvciBpbnZhbGlkIG9wdGlvbi4nICtcbiAgICAgICAgJyBtYXhpbXVtTnVtYmVyT2ZQb2ludHMgc21hbGxlciB0aGVuIDMsIG1heGltdW1OdW1iZXJPZlBvaW50cyBjaGFuZ2VkIHRvIDMnKTtcbiAgICAgIG9wdGlvbnMubWF4aW11bU51bWJlck9mUG9pbnRzID0gMztcbiAgICB9XG5cbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfUE9MWUdPTl9PUFRJT05TKSk7XG4gICAgY29uc3QgcG9seWdvbk9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdENsb25lLCBvcHRpb25zKTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzID0geyAuLi5ERUZBVUxUX1BPTFlHT05fT1BUSU9OUy5wb2ludFByb3BzLCAuLi5vcHRpb25zLnBvaW50UHJvcHN9O1xuICAgIHBvbHlnb25PcHRpb25zLnBvbHlnb25Qcm9wcyA9IHsuLi5ERUZBVUxUX1BPTFlHT05fT1BUSU9OUy5wb2x5Z29uUHJvcHMsIC4uLm9wdGlvbnMucG9seWdvblByb3BzfTtcbiAgICBwb2x5Z29uT3B0aW9ucy5wb2x5bGluZVByb3BzID0gey4uLkRFRkFVTFRfUE9MWUdPTl9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIC4uLm9wdGlvbnMucG9seWxpbmVQcm9wc307XG4gICAgcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucyA9IHsgLi4uREVGQVVMVF9QT0xZR09OX09QVElPTlMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucywgLi4ub3B0aW9ucy5jbGFtcEhlaWdodFRvM0RPcHRpb25zfTtcblxuICAgIGlmIChvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgaWYgKCF0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvblN1cHBvcnRlZCB8fCAhdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0U3VwcG9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2VzaXVtIHNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoIG11c3QgYmUgZmFsc2UgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9ycyB3b3JrIHByb3Blcmx5IG9uIDNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzLmNvbG9yLmFscGhhID09PSAxIHx8IHBvbHlnb25PcHRpb25zLnBvaW50UHJvcHMub3V0bGluZUNvbG9yLmFscGhhID09PSAxKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignUG9pbnQgY29sb3IgYW5kIG91dGxpbmUgY29sb3IgbXVzdCBoYXZlIGFscGhhIGluIG9yZGVyIHRvIG1ha2UgdGhlIGVkaXRvciB3b3JrIHByb3Blcmx5IG9uIDNEJyk7XG4gICAgICB9XG5cbiAgICAgIHBvbHlnb25PcHRpb25zLmFsbG93RHJhZyA9IGZhbHNlO1xuICAgICAgcG9seWdvbk9wdGlvbnMucG9seWxpbmVQcm9wcy5jbGFtcFRvR3JvdW5kID0gdHJ1ZTtcbiAgICAgIHBvbHlnb25PcHRpb25zLnBvaW50UHJvcHMuaGVpZ2h0UmVmZXJlbmNlID0gcG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucy5jbGFtcFRvVGVycmFpbiA/XG4gICAgICAgIENlc2l1bS5IZWlnaHRSZWZlcmVuY2UuQ0xBTVBfVE9fR1JPVU5EIDogQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5SRUxBVElWRV9UT19HUk9VTkQ7XG4gICAgICBwb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB9XG4gICAgcmV0dXJuIHBvbHlnb25PcHRpb25zO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcsIGZpbmlzaENyZWF0aW9uPzogKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiBib29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFBvbHlnb25FZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgfSk7XG4gICAgfTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAocG9pbnRzOiB7XG4gICAgICBwb3NpdGlvbjogQ2FydGVzaWFuMywgcG9pbnRQcm9wczogUG9pbnRQcm9wc1xuICAgIH1bXSB8IENhcnRlc2lhbjNbXSwgcG9seWdvblByb3BzPzogUG9seWdvblByb3BzKSA9PiB7XG4gICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIHBvbHlnb24uc2V0UG9pbnRzTWFudWFsbHkocG9pbnRzLCBwb2x5Z29uUHJvcHMpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnVwZGF0ZUxhYmVscyA9IChsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZmluaXNoQ3JlYXRpb24gPSAoKSA9PiB7XG4gICAgICBpZiAoIWZpbmlzaENyZWF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUG9seWdvbnMgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbihudWxsKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpLmxhYmVscztcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgUG9seWdvbkVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9seWdvbiA9IHRoaXMucG9seWdvbnNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvbHlnb24uZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25zTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBwb2x5Z29uLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuIl19
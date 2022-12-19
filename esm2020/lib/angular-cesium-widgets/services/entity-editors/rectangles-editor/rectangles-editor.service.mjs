import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableRectangle } from '../../../models/editable-rectangle';
import { generateKey } from '../../utils';
import * as i0 from "@angular/core";
export const DEFAULT_RECTANGLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
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
    rectangleProps: {
        height: 0,
        extrudedHeight: 0,
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        zIndex: 0,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
    },
};
/**
 * Service for creating editable rectangles
 *
 * You must provide `RectanglesEditorService` yourself.
 * RectanglesEditorService works together with `<rectangles-editor>` component. Therefor you need to create `<rectangles-editor>`
 * for each `RectanglesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `RectangleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `RectangleEditorObservable`.
 * + To stop editing call `dsipose()` from the `RectangleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `RectangleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating rectangle
 *  const editing$ = rectanglesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit rectangle from existing rectangle positions
 *  const editing$ = this.rectanglesEditorService.edit(initialPos);
 *
 * ```
 */
export class RectanglesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, rectanglesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_RECTANGLE_OPTIONS, priority = 100) {
        const positions = [];
        const id = generateKey();
        const rectangleOptions = this.setOptions(options);
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
            rectangleOptions: rectangleOptions,
        });
        const finishCreation = () => {
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
            this.editRectangle(id, positions, priority, clientEditSubject, rectangleOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: rectangleOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
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
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            const isFirstPoint = this.getPositions(id).length === 0;
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
            if (!isFirstPoint) {
                finishedCreate = finishCreation();
            }
        });
        return editorObservable;
    }
    edit(positions, options = DEFAULT_RECTANGLE_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Rectangles editor error edit(): rectangle should have at least 2 positions');
        }
        const id = generateKey();
        const rectangleOptions = this.setOptions(options);
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
            rectangleOptions: rectangleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            positions: this.getPositions(id),
            points: this.getPoints(id),
        });
        return this.editRectangle(id, positions, priority, editSubject, rectangleOptions);
    }
    editRectangle(id, positions, priority, editSubject, options, editObservable) {
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
                entityType: EditableRectangle,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
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
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
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
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_RECTANGLE_OPTIONS));
        const rectangleOptions = Object.assign(defaultClone, options);
        rectangleOptions.pointProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.pointProps, options.pointProps);
        rectangleOptions.rectangleProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.rectangleProps, options.rectangleProps);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
            }
            if (rectangleOptions.pointProps.color.alpha === 1 || rectangleOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            rectangleOptions.pointProps.heightReference = rectangleOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            rectangleOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return rectangleOptions;
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
        observableToExtend.setManually = (firstPosition, secondPosition, firstPointProp, secondPointProp) => {
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            const rectangle = this.rectanglesManager.get(id);
            rectangle.setPointsManually([firstP, secP]);
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
                throw new Error('Rectangles editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation();
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.rectanglesManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPositions();
    }
    getPoints(id) {
        const rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPoints();
    }
}
RectanglesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RectanglesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RectanglesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RectanglesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RectanglesEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9yZWN0YW5nbGVzLWVkaXRvci9yZWN0YW5nbGVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBRTlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBS3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBSXZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRTFDLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUF5QjtJQUM3RCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyxTQUFTLEVBQUUsSUFBSTtJQUNmLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDekIsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDL0MsWUFBWSxFQUFFLENBQUM7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLHFCQUFxQixFQUFFLENBQUM7UUFDeEIsSUFBSSxFQUFFLElBQUk7UUFDVixXQUFXLEVBQUUsSUFBSTtRQUNqQix3QkFBd0IsRUFBRSxNQUFNLENBQUMsaUJBQWlCO0tBQ25EO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsTUFBTSxFQUFFLENBQUM7UUFDVCxjQUFjLEVBQUUsQ0FBQztRQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUNwRCxJQUFJLEVBQUUsSUFBSTtRQUNWLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO1FBQ2xELE9BQU8sRUFBRSxJQUFJO1FBQ2IsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztRQUNoQyxNQUFNLEVBQUUsQ0FBQztLQUNWO0lBQ0QsZUFBZSxFQUFFLEtBQUs7SUFDdEIsc0JBQXNCLEVBQUU7UUFDdEIsY0FBYyxFQUFFLEtBQUs7S0FDdEI7Q0FDRixDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NHO0FBRUgsTUFBTSxPQUFPLHVCQUF1QjtJQURwQztRQUdVLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQXVCLENBQUM7UUFDbkQsb0JBQWUsR0FBRyxPQUFPLEVBQXVCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1FBSTlGLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7S0EwV3pFO0lBdldDLElBQUksQ0FBQyxnQkFBeUMsRUFDekMsbUJBQXdDLEVBQ3hDLGFBQTRCLEVBQzVCLGlCQUEyQyxFQUMzQyxZQUEyQjtRQUU5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQy9DLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLHlCQUF5QixFQUFFLFFBQVEsR0FBRyxHQUFHO1FBQ3hELE1BQU0sU0FBUyxHQUFpQixFQUFFLENBQUM7UUFDbkMsTUFBTSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFDekIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxlQUFlLENBQXNCO1lBQ2pFLEVBQUU7WUFDRixVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsU0FBUyxDQUFDLE1BQU07U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBRTNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ3RCLEVBQUU7WUFDRixTQUFTO1lBQ1QsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1lBQzFCLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSTtZQUM1QixnQkFBZ0IsRUFBRSxnQkFBZ0I7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQzFCLE1BQU0sVUFBVSxHQUFHO2dCQUNqQixFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDMUIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxjQUFjO2FBQ3ZDLENBQUM7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDN0U7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDbkcsY0FBYyxHQUFHLElBQUksQ0FBQztZQUN0QixPQUFPLGNBQWMsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFFRixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7WUFDM0QsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVO1lBQzdCLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTztZQUN6QixVQUFVLEVBQUUsT0FBTyxDQUFDLGlCQUFpQjtZQUNyQyxRQUFRO1NBQ1QsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1lBQzFELEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhO1lBQ3JDLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTztZQUN6QixVQUFVLEVBQUUsT0FBTyxDQUFDLGlCQUFpQjtZQUNyQyxRQUFRO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMscUJBQXFCLEVBQUUsb0JBQW9CLENBQUUsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUU1RixxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUNoRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUUsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQ3RCLEVBQUU7b0JBQ0YsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO29CQUNoQyxRQUFRLEVBQUUsU0FBUyxDQUFDLE1BQU07b0JBQzFCLGVBQWUsRUFBRSxRQUFRO29CQUN6QixVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVU7aUJBQ25DLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUMvRCxJQUFJLGNBQWMsRUFBRTtnQkFDbEIsT0FBTzthQUNSO1lBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsT0FBTzthQUNSO1lBQ0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFFeEQsTUFBTSxXQUFXLEdBQUc7Z0JBQ2xCLEVBQUU7Z0JBQ0YsU0FBUyxFQUFFLFlBQVk7Z0JBQ3ZCLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDMUIsZUFBZSxFQUFFLFFBQVE7Z0JBQ3pCLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUzthQUNsQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO2dCQUNyQixHQUFHLFdBQVc7Z0JBQ2QsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7YUFDM0IsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDakIsY0FBYyxHQUFHLGNBQWMsRUFBRSxDQUFDO2FBQ25DO1FBRUgsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQUMsU0FBdUIsRUFBRSxPQUFPLEdBQUcseUJBQXlCLEVBQUUsUUFBUSxHQUFHLEdBQUc7UUFDL0UsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFDRCxNQUFNLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUN6QixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQXNCO1lBQzNELEVBQUU7WUFDRixVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUc7WUFDYixFQUFFO1lBQ0YsU0FBUyxFQUFFLFNBQVM7WUFDcEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJO1lBQ3hCLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSTtZQUM1QixnQkFBZ0IsRUFBRSxnQkFBZ0I7U0FDbkMsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDZixHQUFHLE1BQU07WUFDVCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7WUFDaEMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1NBQzNCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FDdkIsRUFBRSxFQUNGLFNBQVMsRUFDVCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixDQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVPLGFBQWEsQ0FBQyxFQUFVLEVBQ1osU0FBdUIsRUFDdkIsUUFBZ0IsRUFDaEIsV0FBeUMsRUFDekMsT0FBNkIsRUFDN0IsY0FBMEM7UUFFNUQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1lBQzNELEtBQUssRUFBRSxPQUFPLENBQUMsY0FBYztZQUM3QixVQUFVLEVBQUUsU0FBUztZQUNyQixJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVU7WUFDNUIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUI7WUFDckMsUUFBUTtZQUNSLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsY0FBYztTQUNuRCxDQUFDLENBQUM7UUFFSCxJQUFJLHFCQUFxQixDQUFDO1FBQzFCLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNyQixxQkFBcUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO2dCQUNyRCxLQUFLLEVBQUUsT0FBTyxDQUFDLGNBQWM7Z0JBQzdCLFVBQVUsRUFBRSxpQkFBaUI7Z0JBQzdCLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVTtnQkFDNUIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUI7Z0JBQ3JDLFFBQVE7Z0JBQ1IsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxFQUFFO2FBQ3ZDLENBQUMsQ0FBQztTQUNKO1FBRUQscUJBQXFCLENBQUMsSUFBSSxDQUN4QixHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDbkgsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUMzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixPQUFPO2FBQ1I7WUFDRCxNQUFNLEtBQUssR0FBYyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFckMsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsRUFBRTtnQkFDRixTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLFFBQVEsRUFBRSxTQUFTLENBQUMsSUFBSTtnQkFDeEIsZUFBZSxFQUFFLFFBQVE7Z0JBQ3pCLFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVO2FBQzFFLENBQUM7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNmLEdBQUcsTUFBTTtnQkFDVCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQzthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUkscUJBQXFCLEVBQUU7WUFDekIscUJBQXFCO2lCQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUN6SCxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtnQkFDMUUsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckYsSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDcEIsT0FBTztpQkFDUjtnQkFFRCxNQUFNLE1BQU0sR0FBRztvQkFDYixFQUFFO29CQUNGLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztvQkFDaEMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJO29CQUN4QixlQUFlLEVBQUUsZUFBZTtvQkFDaEMsZUFBZSxFQUFFLGlCQUFpQjtvQkFDbEMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVTtpQkFDMUUsQ0FBQztnQkFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEMsV0FBVyxDQUFDLElBQUksQ0FBQztvQkFDZixHQUFHLE1BQU07b0JBQ1QsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7aUJBQzNCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsSUFBSSxxQkFBcUIsRUFBRTtZQUN6QixXQUFXLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDekM7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekMsT0FBTyxjQUFjLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU8sVUFBVSxDQUFDLE9BQTZCO1FBQzlDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxnQkFBZ0IsR0FBeUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEYsZ0JBQWdCLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUcsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLHlCQUF5QixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdEgsSUFBSSxPQUFPLENBQUMsZUFBZSxFQUFFO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRTtnQkFDdkYsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO2FBQ25HO1lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFO2dCQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLGtHQUFrRyxDQUFDLENBQUM7YUFDbEg7WUFFRCxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ3pHLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0ZBQStGLENBQUMsQ0FBQzthQUMvRztZQUVELGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUksZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3JHLE1BQU0sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDO1lBQ3JGLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7U0FDakY7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFHTyxzQkFBc0IsQ0FBQyxrQkFBdUIsRUFBRSxFQUFVLEVBQUUsY0FBOEI7UUFDaEcsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNoQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRCxJQUFJLFdBQVcsRUFBRTtnQkFDZixXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFDdEIsRUFBRTtnQkFDRixRQUFRLEVBQUUsU0FBUyxDQUFDLGNBQWM7Z0JBQ2xDLFVBQVUsRUFBRSxXQUFXLENBQUMsT0FBTzthQUNoQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFDRixrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFO2dCQUNGLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztnQkFDaEMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJO2dCQUN4QixVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU07YUFDL0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0Ysa0JBQWtCLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFDdEIsRUFBRTtnQkFDRixTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLFFBQVEsRUFBRSxTQUFTLENBQUMsSUFBSTtnQkFDeEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxPQUFPO2FBQ2hDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxDQUFDLGFBQXlCLEVBQ3pCLGNBQTBCLEVBQzFCLGNBQTJCLEVBQzNCLGVBQTRCLEVBQUUsRUFBRTtZQUNoRSxNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4SCxNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV6SCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDbEMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxZQUFZO2FBQ3JDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLGlCQUFpQixHQUFHLENBQUMsUUFBYSxFQUFFLEVBQUU7WUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dCQUNsQyxVQUFVLEVBQUUsV0FBVyxDQUFDLCtCQUErQjtnQkFDdkQsY0FBYyxFQUFFLFFBQVE7YUFDekIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsTUFBb0IsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDbEMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxrQkFBa0I7Z0JBQzFDLFlBQVksRUFBRSxNQUFNO2FBQ3JCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxHQUFHLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsT0FBTyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELGtCQUFrQixDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV0RSxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsR0FBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXpGLE9BQU8sa0JBQStDLENBQUM7SUFDekQsQ0FBQztJQUVPLFlBQVksQ0FBQyxFQUFPO1FBQzFCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRU8sU0FBUyxDQUFDLEVBQU87UUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxPQUFPLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNuQyxDQUFDOztxSEFoWFUsdUJBQXVCO3lIQUF2Qix1QkFBdUI7NEZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcmVjdGFuZ2xlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vcmVjdGFuZ2xlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9yZWN0YW5nbGUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdGFibGVSZWN0YW5nbGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtcmVjdGFuZ2xlJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3JlY3RhbmdsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlM6IFJlY3RhbmdsZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMQUNLLndpdGhBbHBoYSgwLjIpLFxuICAgIG91dGxpbmVXaWR0aDogMSxcbiAgICBwaXhlbFNpemU6IDEzLFxuICAgIHZpcnR1YWxQb2ludFBpeGVsU2l6ZTogOCxcbiAgICBzaG93OiB0cnVlLFxuICAgIHNob3dWaXJ0dWFsOiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxuICByZWN0YW5nbGVQcm9wczoge1xuICAgIGhlaWdodDogMCxcbiAgICBleHRydWRlZEhlaWdodDogMCxcbiAgICBtYXRlcmlhbDogQ2VzaXVtLkNvbG9yLkNPUk5GTE9XRVJCTFVFLndpdGhBbHBoYSgwLjQpLFxuICAgIGZpbGw6IHRydWUsXG4gICAgY2xhc3NpZmljYXRpb25UeXBlOiBDZXNpdW0uQ2xhc3NpZmljYXRpb25UeXBlLkJPVEgsXG4gICAgb3V0bGluZTogdHJ1ZSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICB6SW5kZXg6IDAsXG4gIH0sXG4gIGNsYW1wSGVpZ2h0VG8zRDogZmFsc2UsXG4gIGNsYW1wSGVpZ2h0VG8zRE9wdGlvbnM6IHtcbiAgICBjbGFtcFRvVGVycmFpbjogZmFsc2UsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIHJlY3RhbmdsZXNcbiAqXG4gKiBZb3UgbXVzdCBwcm92aWRlIGBSZWN0YW5nbGVzRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBSZWN0YW5nbGVzRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8cmVjdGFuZ2xlcy1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPHJlY3RhbmdsZXMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBSZWN0YW5nbGVzRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBSZWN0YW5nbGVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgYGVkaXRgIGZvciBlZGl0aW5nIHNoYXBlIG92ZXIgdGhlIG1hcCBzdGFydGluZyBmcm9tIGEgZ2l2ZW4gcG9zaXRpb25zLiBSZXR1cm5zIGFuIGV4dGVuc2lvbiBvZiBgUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBSZWN0YW5nbGVFZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZWAgdGhhdCBpcyByZXR1cm5lZCBmcm9tIGNhbGxpbmcgYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYCBvZiBvbmUgb2YgdGhlIGVkaXRvciBzZXJ2aWNlcy5cbiAqIGBzZXRMYWJlbHNSZW5kZXJGbigpYCAtIHJlY2VpdmVzIGEgY2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgc2hhcGUgaXMgcmVkcmF3blxuICogKGV4Y2VwdCB3aGVuIHRoZSBzaGFwZSBpcyBiZWluZyBkcmFnZ2VkKS4gVGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBsYXN0IHNoYXBlIHN0YXRlIGFuZCB3aXRoIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGxhYmVscy5cbiAqIFRoZSBjYWxsYmFjayBzaG91bGQgcmV0dXJuIHR5cGUgYExhYmVsUHJvcHNbXWAuXG4gKiBZb3UgY2FuIGFsc28gdXNlIGB1cGRhdGVMYWJlbHMoKWAgdG8gcGFzcyBhbiBhcnJheSBvZiBsYWJlbHMgb2YgdHlwZSBgTGFiZWxQcm9wc1tdYCB0byBiZSBkcmF3bi5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICAvLyBTdGFydCBjcmVhdGluZyByZWN0YW5nbGVcbiAqICBjb25zdCBlZGl0aW5nJCA9IHJlY3RhbmdsZXNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IHJlY3RhbmdsZSBmcm9tIGV4aXN0aW5nIHJlY3RhbmdsZSBwb3NpdGlvbnNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMucmVjdGFuZ2xlc0VkaXRvclNlcnZpY2UuZWRpdChpbml0aWFsUG9zKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlY3RhbmdsZXNFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8UmVjdGFuZ2xlRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPFJlY3RhbmdsZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIHJlY3RhbmdsZXNNYW5hZ2VyOiBSZWN0YW5nbGVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuICBwcml2YXRlIGNlc2l1bVNjZW5lOiBhbnk7XG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgICAgcmVjdGFuZ2xlc01hbmFnZXI6IFJlY3RhbmdsZXNNYW5hZ2VyU2VydmljZSxcbiAgICAgICBjZXNpdW1WaWV3ZXI6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMucmVjdGFuZ2xlc01hbmFnZXIgPSByZWN0YW5nbGVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPFJlY3RhbmdsZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10gPSBbXTtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcmVjdGFuZ2xlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxSZWN0YW5nbGVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURVxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICByZWN0YW5nbGVPcHRpb25zOiByZWN0YW5nbGVPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmluaXNoQ3JlYXRpb24gPSAoKSA9PiB7XG4gICAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgIGlmICh0aGlzLm9ic2VydmFibGVzTWFwLmhhcyhpZCkpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpLmZvckVhY2gocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy5lZGl0UmVjdGFuZ2xlKGlkLCBwb3NpdGlvbnMsIHByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgcmVjdGFuZ2xlT3B0aW9ucywgZWRpdG9yT2JzZXJ2YWJsZSk7XG4gICAgICBmaW5pc2hlZENyZWF0ZSA9IHRydWU7XG4gICAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZVJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG4gICAgY29uc3QgYWRkUG9pbnRSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHJlY3RhbmdsZU9wdGlvbnMuYWRkUG9pbnRFdmVudCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb24gXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQsIGZpbmlzaENyZWF0aW9uKTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBpZiAoZmluaXNoZWRDcmVhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxsUG9zaXRpb25zID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpO1xuICAgICAgY29uc3QgaXNGaXJzdFBvaW50ID0gdGhpcy5nZXRQb3NpdGlvbnMoaWQpLmxlbmd0aCA9PT0gMDtcblxuICAgICAgY29uc3QgdXBkYXRlVmFsdWUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IGFsbFBvc2l0aW9ucyxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGVWYWx1ZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlVmFsdWUsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWlzRmlyc3RQb2ludCkge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IGZpbmlzaENyZWF0aW9uKCk7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSwgb3B0aW9ucyA9IERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlcyBlZGl0b3IgZXJyb3IgZWRpdCgpOiByZWN0YW5nbGUgc2hvdWxkIGhhdmUgYXQgbGVhc3QgMiBwb3NpdGlvbnMnKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHJlY3RhbmdsZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgZWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJlY3RhbmdsZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcmVjdGFuZ2xlT3B0aW9uczogcmVjdGFuZ2xlT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmVkaXRSZWN0YW5nbGUoXG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9ucyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICByZWN0YW5nbGVPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdFJlY3RhbmdsZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdLFxuICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgZWRpdFN1YmplY3Q6IFN1YmplY3Q8UmVjdGFuZ2xlRWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogUmVjdGFuZ2xlRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBSZWN0YW5nbGVFZGl0b3JPYnNlcnZhYmxlKTogUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG5cbiAgICBjb25zdCBwb2ludERyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1BvaW50RXZlbnQsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlUmVjdGFuZ2xlLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb24ucGlwZShcbiAgICAgIHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG5cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGRyYWdnZWRQb3NpdGlvbjogc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gW3BvaW50RHJhZ1JlZ2lzdHJhdGlvbl07XG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChzaGFwZURyYWdSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IFJlY3RhbmdsZUVkaXRPcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX1JFQ1RBTkdMRV9PUFRJT05TKSk7XG4gICAgY29uc3QgcmVjdGFuZ2xlT3B0aW9uczogUmVjdGFuZ2xlRWRpdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgcmVjdGFuZ2xlT3B0aW9ucy5wb2ludFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9SRUNUQU5HTEVfT1BUSU9OUy5wb2ludFByb3BzLCBvcHRpb25zLnBvaW50UHJvcHMpO1xuICAgIHJlY3RhbmdsZU9wdGlvbnMucmVjdGFuZ2xlUHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1JFQ1RBTkdMRV9PUFRJT05TLnJlY3RhbmdsZVByb3BzLCBvcHRpb25zLnJlY3RhbmdsZVByb3BzKTtcblxuICAgIGlmIChvcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgaWYgKCF0aGlzLmNlc2l1bVNjZW5lLnBpY2tQb3NpdGlvblN1cHBvcnRlZCB8fCAhdGhpcy5jZXNpdW1TY2VuZS5jbGFtcFRvSGVpZ2h0U3VwcG9ydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2VzaXVtIHBpY2tQb3NpdGlvbiBhbmQgY2xhbXBUb0hlaWdodCBtdXN0IGJlIHN1cHBvcnRlZCB0byB1c2UgY2xhbXBIZWlnaHRUbzNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNlc2l1bVNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2VzaXVtIHNjZW5lLnBpY2tUcmFuc2x1Y2VudERlcHRoIG11c3QgYmUgZmFsc2UgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9ycyB3b3JrIHByb3Blcmx5IG9uIDNEYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWN0YW5nbGVPcHRpb25zLnBvaW50UHJvcHMuY29sb3IuYWxwaGEgPT09IDEgfHwgcmVjdGFuZ2xlT3B0aW9ucy5wb2ludFByb3BzLm91dGxpbmVDb2xvci5hbHBoYSA9PT0gMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1BvaW50IGNvbG9yIGFuZCBvdXRsaW5lIGNvbG9yIG11c3QgaGF2ZSBhbHBoYSBpbiBvcmRlciB0byBtYWtlIHRoZSBlZGl0b3Igd29yayBwcm9wZXJseSBvbiAzRCcpO1xuICAgICAgfVxuXG4gICAgICByZWN0YW5nbGVPcHRpb25zLnBvaW50UHJvcHMuaGVpZ2h0UmVmZXJlbmNlID0gIHJlY3RhbmdsZU9wdGlvbnMuY2xhbXBIZWlnaHRUbzNET3B0aW9ucy5jbGFtcFRvVGVycmFpbiA/XG4gICAgICAgIENlc2l1bS5IZWlnaHRSZWZlcmVuY2UuQ0xBTVBfVE9fR1JPVU5EIDogQ2VzaXVtLkhlaWdodFJlZmVyZW5jZS5SRUxBVElWRV9UT19HUk9VTkQ7XG4gICAgICByZWN0YW5nbGVPcHRpb25zLnBvaW50UHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIH1cbiAgICByZXR1cm4gcmVjdGFuZ2xlT3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nLCBmaW5pc2hDcmVhdGlvbj86ICgpID0+IGJvb2xlYW4pOiBSZWN0YW5nbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChmaXJzdFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRQb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRQb2ludFByb3A/OiBQb2ludFByb3BzKSA9PiB7XG4gICAgICBjb25zdCBmaXJzdFAgPSBuZXcgRWRpdFBvaW50KGlkLCBmaXJzdFBvc2l0aW9uLCBmaXJzdFBvaW50UHJvcCA/IGZpcnN0UG9pbnRQcm9wIDogREVGQVVMVF9SRUNUQU5HTEVfT1BUSU9OUy5wb2ludFByb3BzKTtcbiAgICAgIGNvbnN0IHNlY1AgPSBuZXcgRWRpdFBvaW50KGlkLCBzZWNvbmRQb3NpdGlvbiwgc2Vjb25kUG9pbnRQcm9wID8gc2Vjb25kUG9pbnRQcm9wIDogREVGQVVMVF9SRUNUQU5HTEVfT1BUSU9OUy5wb2ludFByb3BzKTtcblxuICAgICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQoaWQpO1xuICAgICAgcmVjdGFuZ2xlLnNldFBvaW50c01hbnVhbGx5KFtmaXJzdFAsIHNlY1BdKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xuICAgICAgaWYgKCFmaW5pc2hDcmVhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbigpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q3VycmVudFBvaW50cyA9ICgpID0+IHRoaXMuZ2V0UG9pbnRzKGlkKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRvRXh0ZW5kIGFzIFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogYW55KSB7XG4gICAgY29uc3QgcmVjdGFuZ2xlID0gdGhpcy5yZWN0YW5nbGVzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiByZWN0YW5nbGUuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2ludHMoaWQ6IGFueSkge1xuICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcmVjdGFuZ2xlLmdldFJlYWxQb2ludHMoKTtcbiAgfVxufVxuXG4iXX0=
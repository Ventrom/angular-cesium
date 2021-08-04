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
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
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
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
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
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
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
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
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
RectanglesEditorService.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGFuZ2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9yZWN0YW5nbGVzLWVkaXRvci9yZWN0YW5nbGVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBRTlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBS3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBSXZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFMUMsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQXlCO0lBQzdELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLFNBQVMsRUFBRSxJQUFJO0lBQ2YsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FB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QUFZLEdBQUcsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFdEUsa0JBQWtCLENBQUMsU0FBUyxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUV6RixPQUFPLGtCQUErQyxDQUFDO0lBQ3pELENBQUM7SUFFTyxZQUFZLENBQUMsRUFBTztRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxFQUFPO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7O1lBalhGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3JlY3RhbmdsZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBSZWN0YW5nbGVzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3JlY3RhbmdsZXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcmVjdGFuZ2xlLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVkaXRhYmxlUmVjdGFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLXJlY3RhbmdsZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9yZWN0YW5nbGUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1JFQ1RBTkdMRV9PUFRJT05TOiBSZWN0YW5nbGVFZGl0T3B0aW9ucyA9IHtcbiAgYWRkUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgZHJhZ1BvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgZHJhZ1NoYXBlRXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgYWxsb3dEcmFnOiB0cnVlLFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSy53aXRoQWxwaGEoMC4yKSxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxMyxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgfSxcbiAgcmVjdGFuZ2xlUHJvcHM6IHtcbiAgICBoZWlnaHQ6IDAsXG4gICAgZXh0cnVkZWRIZWlnaHQ6IDAsXG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBmaWxsOiB0cnVlLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICAgIG91dGxpbmU6IHRydWUsXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgekluZGV4OiAwLFxuICB9LFxuICBjbGFtcEhlaWdodFRvM0Q6IGZhbHNlLFxuICBjbGFtcEhlaWdodFRvM0RPcHRpb25zOiB7XG4gICAgY2xhbXBUb1RlcnJhaW46IGZhbHNlLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSByZWN0YW5nbGVzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPHJlY3RhbmdsZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxyZWN0YW5nbGVzLWVkaXRvcj5gXG4gKiBmb3IgZWFjaCBgUmVjdGFuZ2xlc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZHNpcG9zZSgpYCBmcm9tIHRoZSBgUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgcmVjdGFuZ2xlXG4gKiAgY29uc3QgZWRpdGluZyQgPSByZWN0YW5nbGVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCByZWN0YW5nbGUgZnJvbSBleGlzdGluZyByZWN0YW5nbGUgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnJlY3RhbmdsZXNFZGl0b3JTZXJ2aWNlLmVkaXQoaW5pdGlhbFBvcyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGVzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PFJlY3RhbmdsZUVkaXRVcGRhdGU+KCk7XG4gIHByaXZhdGUgdXBkYXRlUHVibGlzaGVyID0gcHVibGlzaDxSZWN0YW5nbGVFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSByZWN0YW5nbGVzTWFuYWdlcjogUmVjdGFuZ2xlc01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcbiAgcHJpdmF0ZSBjZXNpdW1TY2VuZTogYW55O1xuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgICAgIHJlY3RhbmdsZXNNYW5hZ2VyOiBSZWN0YW5nbGVzTWFuYWdlclNlcnZpY2UsXG4gICAgICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyID0gcmVjdGFuZ2xlc01hbmFnZXI7XG4gICAgdGhpcy51cGRhdGVQdWJsaXNoZXIuY29ubmVjdCgpO1xuXG4gICAgdGhpcy5jZXNpdW1TY2VuZSA9IGNlc2l1bVZpZXdlci5nZXRTY2VuZSgpO1xuICB9XG5cbiAgb25VcGRhdGUoKTogT2JzZXJ2YWJsZTxSZWN0YW5nbGVFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX1JFQ1RBTkdMRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvc2l0aW9uczogQ2FydGVzaWFuM1tdID0gW107XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHJlY3RhbmdsZU9wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UmVjdGFuZ2xlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcmVjdGFuZ2xlT3B0aW9uczogcmVjdGFuZ2xlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xuICAgICAgY29uc3QgY2hhbmdlTW9kZSA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgIH07XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMuZWRpdFJlY3RhbmdsZShpZCwgcG9zaXRpb25zLCBwcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIHJlY3RhbmdsZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiByZWN0YW5nbGVPcHRpb25zLmFkZFBvaW50RXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIFttb3VzZU1vdmVSZWdpc3RyYXRpb24sIGFkZFBvaW50UmVnaXN0cmF0aW9uIF0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkLCBmaW5pc2hDcmVhdGlvbik7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKTtcbiAgICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKS5sZW5ndGggPT09IDA7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc0ZpcnN0UG9pbnQpIHtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbigpO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGVkaXQocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sIG9wdGlvbnMgPSBERUZBVUxUX1JFQ1RBTkdMRV9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGUge1xuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoICE9PSAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogcmVjdGFuZ2xlIHNob3VsZCBoYXZlIGF0IGxlYXN0IDIgcG9zaXRpb25zJyk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCByZWN0YW5nbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxSZWN0YW5nbGVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcbiAgICB9KTtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uczogcG9zaXRpb25zLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIHJlY3RhbmdsZU9wdGlvbnM6IHJlY3RhbmdsZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5lZGl0UmVjdGFuZ2xlKFxuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgcmVjdGFuZ2xlT3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRSZWN0YW5nbGUoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PFJlY3RhbmdsZUVkaXRVcGRhdGU+LFxuICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IFJlY3RhbmdsZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSk6IFJlY3RhbmdsZUVkaXRvck9ic2VydmFibGUge1xuXG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgbGV0IHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0RyYWcpIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdTaGFwZUV2ZW50LFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZVJlY3RhbmdsZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uLnBpcGUoXG4gICAgICB0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnQ6IEVkaXRQb2ludCA9IGVudGl0aWVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBkcmFnZ2VkUG9zaXRpb246IHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiBlZGl0T2JzZXJ2YWJsZSB8fCB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBSZWN0YW5nbGVFZGl0T3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRDbG9uZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9SRUNUQU5HTEVfT1BUSU9OUykpO1xuICAgIGNvbnN0IHJlY3RhbmdsZU9wdGlvbnM6IFJlY3RhbmdsZUVkaXRPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIHJlY3RhbmdsZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICByZWN0YW5nbGVPcHRpb25zLnJlY3RhbmdsZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9SRUNUQU5HTEVfT1BUSU9OUy5yZWN0YW5nbGVQcm9wcywgb3B0aW9ucy5yZWN0YW5nbGVQcm9wcyk7XG5cbiAgICBpZiAob3B0aW9ucy5jbGFtcEhlaWdodFRvM0QpIHtcbiAgICAgIGlmICghdGhpcy5jZXNpdW1TY2VuZS5waWNrUG9zaXRpb25TdXBwb3J0ZWQgfHwgIXRoaXMuY2VzaXVtU2NlbmUuY2xhbXBUb0hlaWdodFN1cHBvcnRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENlc2l1bSBwaWNrUG9zaXRpb24gYW5kIGNsYW1wVG9IZWlnaHQgbXVzdCBiZSBzdXBwb3J0ZWQgdG8gdXNlIGNsYW1wSGVpZ2h0VG8zRGApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jZXNpdW1TY2VuZS5waWNrVHJhbnNsdWNlbnREZXB0aCkge1xuICAgICAgICBjb25zb2xlLndhcm4oYENlc2l1bSBzY2VuZS5waWNrVHJhbnNsdWNlbnREZXB0aCBtdXN0IGJlIGZhbHNlIGluIG9yZGVyIHRvIG1ha2UgdGhlIGVkaXRvcnMgd29yayBwcm9wZXJseSBvbiAzRGApO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjdGFuZ2xlT3B0aW9ucy5wb2ludFByb3BzLmNvbG9yLmFscGhhID09PSAxIHx8IHJlY3RhbmdsZU9wdGlvbnMucG9pbnRQcm9wcy5vdXRsaW5lQ29sb3IuYWxwaGEgPT09IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdQb2ludCBjb2xvciBhbmQgb3V0bGluZSBjb2xvciBtdXN0IGhhdmUgYWxwaGEgaW4gb3JkZXIgdG8gbWFrZSB0aGUgZWRpdG9yIHdvcmsgcHJvcGVybHkgb24gM0QnKTtcbiAgICAgIH1cblxuICAgICAgcmVjdGFuZ2xlT3B0aW9ucy5wb2ludFByb3BzLmhlaWdodFJlZmVyZW5jZSA9ICByZWN0YW5nbGVPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRE9wdGlvbnMuY2xhbXBUb1RlcnJhaW4gP1xuICAgICAgICBDZXNpdW0uSGVpZ2h0UmVmZXJlbmNlLkNMQU1QX1RPX0dST1VORCA6IENlc2l1bS5IZWlnaHRSZWZlcmVuY2UuUkVMQVRJVkVfVE9fR1JPVU5EO1xuICAgICAgcmVjdGFuZ2xlT3B0aW9ucy5wb2ludFByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB9XG4gICAgcmV0dXJuIHJlY3RhbmdsZU9wdGlvbnM7XG4gIH1cblxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZywgZmluaXNoQ3JlYXRpb24/OiAoKSA9PiBib29sZWFuKTogUmVjdGFuZ2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5lbmFibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoZmlyc3RQb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9pbnRQcm9wPzogUG9pbnRQcm9wcykgPT4ge1xuICAgICAgY29uc3QgZmlyc3RQID0gbmV3IEVkaXRQb2ludChpZCwgZmlyc3RQb3NpdGlvbiwgZmlyc3RQb2ludFByb3AgPyBmaXJzdFBvaW50UHJvcCA6IERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlMucG9pbnRQcm9wcyk7XG4gICAgICBjb25zdCBzZWNQID0gbmV3IEVkaXRQb2ludChpZCwgc2Vjb25kUG9zaXRpb24sIHNlY29uZFBvaW50UHJvcCA/IHNlY29uZFBvaW50UHJvcCA6IERFRkFVTFRfUkVDVEFOR0xFX09QVElPTlMucG9pbnRQcm9wcyk7XG5cbiAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIHJlY3RhbmdsZS5zZXRQb2ludHNNYW51YWxseShbZmlyc3RQLCBzZWNQXSk7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfTUFOVUFMTFksXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldExhYmVsc1JlbmRlckZuID0gKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5maW5pc2hDcmVhdGlvbiA9ICgpID0+IHtcbiAgICAgIGlmICghZmluaXNoQ3JlYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWN0YW5nbGVzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24oKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEN1cnJlbnRQb2ludHMgPSAoKSA9PiB0aGlzLmdldFBvaW50cyhpZCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0TGFiZWxzID0gKCk6IExhYmVsUHJvcHNbXSA9PiB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBSZWN0YW5nbGVFZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb3NpdGlvbnMoaWQ6IGFueSkge1xuICAgIGNvbnN0IHJlY3RhbmdsZSA9IHRoaXMucmVjdGFuZ2xlc01hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gcmVjdGFuZ2xlLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UG9pbnRzKGlkOiBhbnkpIHtcbiAgICBjb25zdCByZWN0YW5nbGUgPSB0aGlzLnJlY3RhbmdsZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHJlY3RhbmdsZS5nZXRSZWFsUG9pbnRzKCk7XG4gIH1cbn1cblxuIl19
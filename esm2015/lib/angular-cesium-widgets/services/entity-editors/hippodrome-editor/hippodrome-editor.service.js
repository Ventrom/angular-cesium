import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { generateKey } from '../../utils';
export const DEFAULT_HIPPODROME_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    hippodromeProps: {
        fill: true,
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        outline: true,
        width: 200000.0,
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
};
/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
export class HippodromeEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100) {
        const positions = [];
        const id = generateKey();
        const hippodromeOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeOptions,
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
            this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
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
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            if (!isFirstPoint) {
                finishedCreate = finishCreation();
            }
        });
        return editorObservable;
    }
    edit(positions, options = DEFAULT_HIPPODROME_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        const id = generateKey();
        const hippodromeEditOptions = this.setOptions(options);
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
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    }
    editHippodrome(id, priority, editSubject, options, editObservable) {
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        const hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
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
        observableToExtend.setManually = (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) => {
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            const hippodrome = this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
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
                throw new Error('Hippodrome editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation();
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.hippodromeManager.get(id).labels;
        observableToExtend.getCurrentWidth = () => this.getWidth(id);
        return observableToExtend;
    }
    getPositions(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    }
    getPoints(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    }
    getWidth(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    }
}
HippodromeEditorService.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlwcG9kcm9tZS1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9oaXBwb2Ryb21lLWVkaXRvci9oaXBwb2Ryb21lLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBR3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFMUMsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQTBCO0lBQy9ELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLFNBQVMsRUFBRSxJQUFJO0lBQ2YsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLElBQUk7UUFDVixRQUFRLEVBQUUsTUFB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LEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRU8sUUFBUSxDQUFDLEVBQVU7UUFDekIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7WUFqV0YsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvaGlwcG9kcm9tZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9oaXBwb2Ryb21lLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXRvci1vYm9zZXJ2YWJsZSc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9oaXBwb2Ryb21lLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRhYmxlSGlwcG9kcm9tZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1oaXBwb2Ryb21lJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVLZXkgfSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUzogSGlwcG9kcm9tZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIGhpcHBvZHJvbWVQcm9wczoge1xuICAgIGZpbGw6IHRydWUsXG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBvdXRsaW5lOiB0cnVlLFxuICAgIHdpZHRoOiAyMDAwMDAuMCxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUud2l0aEFscGhhKDAuOCksXG4gICAgY2xhc3NpZmljYXRpb25UeXBlOiBDZXNpdW0uQ2xhc3NpZmljYXRpb25UeXBlLkJPVEgsXG4gICAgekluZGV4OiAwLFxuICAgIHNoYWRvd3M6IENlc2l1bS5TaGFkb3dNb2RlLkRJU0FCTEVELFxuICB9LFxuICBwb2ludFByb3BzOiB7XG4gICAgY29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSy53aXRoQWxwaGEoMC4yKSxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxMyxcbiAgICB2aXJ0dWFsUG9pbnRQaXhlbFNpemU6IDgsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBzaG93VmlydHVhbDogdHJ1ZSxcbiAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2VydmljZSBmb3IgY3JlYXRpbmcgZWRpdGFibGUgaGlwcG9kcm9tZXNcbiAqXG4gKiBZb3UgbXVzdCBwcm92aWRlIGBIaXBwb2Ryb21lRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBIaXBwb2Ryb21lRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8aGlwcG9kcm9tZXMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxoaXBwb2Ryb21lcy1lZGl0b3I+YFxuICogZm9yIGVhY2ggYFBvbHlsaW5lRWRpdG9yU2VydmljZWAsIEFuZCBvZiBjb3Vyc2Ugc29tZXdoZXJlIHVuZGVyIGA8YWMtbWFwPmAvXG4gKlxuICogKyBgY3JlYXRlYCBmb3Igc3RhcnRpbmcgYSBjcmVhdGlvbiBvZiB0aGUgc2hhcGUgb3ZlciB0aGUgbWFwLiBSZXR1cm5zIGEgZXh0ZW5zaW9uIG9mIGBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlYC5cbiAqICsgVG8gc3RvcCBlZGl0aW5nIGNhbGwgYGRzaXBvc2UoKWAgZnJvbSB0aGUgYEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlYCB5b3UgZ2V0IGJhY2sgZnJvbSBgY3JlYXRlKClgIFxcIGBlZGl0KClgLlxuICpcbiAqICoqTGFiZWxzIG92ZXIgZWRpdHRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogIC8vIFN0YXJ0IGNyZWF0aW5nIGhpcHBvZHJvbWVcbiAqICBjb25zdCBlZGl0aW5nJCA9IGhpcHBvZHJvbWVFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGhpcHBvZHJvbWVzIGZyb20gZXhpc3RpbmcgaGlwcG9kcm9tZXMgY2FydGVzaWFuMyBwb3NpdGlvbnNcbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuaGlwcG9kcm9tZUVkaXRvci5lZGl0KGluaXRpYWxQb3MpO1xuICpcbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGlwcG9kcm9tZUVkaXRvclNlcnZpY2Uge1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIHVwZGF0ZVN1YmplY3QgPSBuZXcgU3ViamVjdDxIaXBwb2Ryb21lRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPEhpcHBvZHJvbWVFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBoaXBwb2Ryb21lTWFuYWdlcjogSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICAgICBtYW5hZ2VyU2VydmljZTogSGlwcG9kcm9tZU1hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5oaXBwb2Ryb21lTWFuYWdlciA9IG1hbmFnZXJTZXJ2aWNlO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8SGlwcG9kcm9tZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLCBldmVudFByaW9yaXR5ID0gMTAwKTogSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvc2l0aW9uczogQ2FydGVzaWFuM1tdID0gW107XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGhpcHBvZHJvbWVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEhpcHBvZHJvbWVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURVxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBoaXBwb2Ryb21lT3B0aW9uczogaGlwcG9kcm9tZU9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5nZU1vZGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQ0hBTkdFX1RPX0VESVQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLmVkaXRIaXBwb2Ryb21lKGlkLCBldmVudFByaW9yaXR5LCBjbGllbnRFZGl0U3ViamVjdCwgaGlwcG9kcm9tZU9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgICAgZmluaXNoZWRDcmVhdGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpbmlzaGVkQ3JlYXRlO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZFBvaW50UmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBoaXBwb2Ryb21lT3B0aW9ucy5hZGRQb2ludEV2ZW50LFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBbbW91c2VNb3ZlUmVnaXN0cmF0aW9uLCBhZGRQb2ludFJlZ2lzdHJhdGlvbl0pO1xuICAgIGNvbnN0IGVkaXRvck9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoY2xpZW50RWRpdFN1YmplY3QsIGlkLCBmaW5pc2hDcmVhdGlvbik7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7bW92ZW1lbnQ6IHtlbmRQb3NpdGlvbn19KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuTU9VU0VfTU9WRSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRQb2ludFJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHttb3ZlbWVudDoge2VuZFBvc2l0aW9ufX0pID0+IHtcbiAgICAgIGlmIChmaW5pc2hlZENyZWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFsbFBvc2l0aW9ucyA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKTtcbiAgICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9IHRoaXMuZ2V0UG9zaXRpb25zKGlkKS5sZW5ndGggPT09IDA7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZVZhbHVlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiBhbGxQb3NpdGlvbnMsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlVmFsdWUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZVZhbHVlLFxuICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgcG9pbnRzOiB0aGlzLmdldFBvaW50cyhpZCksXG4gICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKGlkKSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWlzRmlyc3RQb2ludCkge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IGZpbmlzaENyZWF0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGVkaXQocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10sIG9wdGlvbnMgPSBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGlwcG9kcm9tZSBlZGl0b3IgZXJyb3IgZWRpdCgpOiBwb2x5Z29uIHNob3VsZCBoYXZlIDIgcG9zaXRpb25zIGJ1dCByZWNlaXZlZCAnICsgcG9zaXRpb25zKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGhpcHBvZHJvbWVFZGl0T3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8SGlwcG9kcm9tZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVFxuICAgIH0pO1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgaGlwcG9kcm9tZU9wdGlvbnM6IGhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoaWQpLFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmVkaXRIaXBwb2Ryb21lKFxuICAgICAgaWQsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIGVkaXRTdWJqZWN0LFxuICAgICAgaGlwcG9kcm9tZUVkaXRPcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdEhpcHBvZHJvbWUoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PEhpcHBvZHJvbWVFZGl0VXBkYXRlPixcbiAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZWRpdE9ic2VydmFibGU/OiBIaXBwb2Ryb21lRWRpdG9yT2JzZXJ2YWJsZSk6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IG9wdGlvbnMuZHJhZ1NoYXBlRXZlbnQsXG4gICAgICAgIGVudGl0eVR5cGU6IEVkaXRhYmxlSGlwcG9kcm9tZSxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICB9KTtcblxuICAgIHBvaW50RHJhZ1JlZ2lzdHJhdGlvbi5waXBlKFxuICAgICAgdGFwKCh7bW92ZW1lbnQ6IHtkcm9wfX0pID0+IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKS5lbmFibGVFZGl0ICYmIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHMoZHJvcCkpKVxuICAgICAgLnN1YnNjcmliZSgoe21vdmVtZW50OiB7ZW5kUG9zaXRpb24sIGRyb3B9LCBlbnRpdGllc30pID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFwb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG5cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIHVwZGF0ZWRQb2ludDogcG9pbnQsXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIHBvc2l0aW9uczogdGhpcy5nZXRQb3NpdGlvbnMoaWQpLFxuICAgICAgICAgIHBvaW50czogdGhpcy5nZXRQb2ludHMoaWQpLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHttb3ZlbWVudDoge2Ryb3B9fSkgPT4gdGhpcy5oaXBwb2Ryb21lTWFuYWdlci5nZXQoaWQpLmVuYWJsZUVkaXQgJiYgdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHttb3ZlbWVudDoge3N0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBkcm9wfSwgZW50aXRpZXN9KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBwb3NpdGlvbnM6IHRoaXMuZ2V0UG9zaXRpb25zKGlkKSxcbiAgICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICAgIHVwZGF0ZWRQb3NpdGlvbjogZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZHJhZ2dlZFBvc2l0aW9uOiBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICAgIGVkaXRBY3Rpb246IGRyb3AgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgICAgICBwb2ludHM6IHRoaXMuZ2V0UG9pbnRzKGlkKSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKGlkKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSBbcG9pbnREcmFnUmVnaXN0cmF0aW9uXTtcbiAgICBpZiAoc2hhcGVEcmFnUmVnaXN0cmF0aW9uKSB7XG4gICAgICBvYnNlcnZhYmxlcy5wdXNoKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZhYmxlc01hcC5zZXQoaWQsIG9ic2VydmFibGVzKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGVkaXRTdWJqZWN0LCBpZCk7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogSGlwcG9kcm9tZUVkaXRPcHRpb25zKTogSGlwcG9kcm9tZUVkaXRPcHRpb25zIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TKSk7XG4gICAgY29uc3QgaGlwcG9kcm9tZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgaGlwcG9kcm9tZU9wdGlvbnMuaGlwcG9kcm9tZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9ISVBQT0RST01FX09QVElPTlMuaGlwcG9kcm9tZVByb3BzLCBvcHRpb25zLmhpcHBvZHJvbWVQcm9wcyk7XG4gICAgaGlwcG9kcm9tZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgcmV0dXJuIGhpcHBvZHJvbWVPcHRpb25zO1xuICB9XG5cblxuICBwcml2YXRlIGNyZWF0ZUVkaXRvck9ic2VydmFibGUob2JzZXJ2YWJsZVRvRXh0ZW5kOiBhbnksIGlkOiBzdHJpbmcsIGZpbmlzaENyZWF0aW9uPzogKCkgPT4gYm9vbGVhbik6IEhpcHBvZHJvbWVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlc01hcC5nZXQoaWQpO1xuICAgICAgaWYgKG9ic2VydmFibGVzKSB7XG4gICAgICAgIG9ic2VydmFibGVzLmZvckVhY2gob2JzID0+IG9icy5kaXNwb3NlKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlc01hcC5kZWxldGUoaWQpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5kaXNhYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgcG9zaXRpb25zOiB0aGlzLmdldFBvc2l0aW9ucyhpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAoZmlyc3RQb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoTWV0ZXJzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0UG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kUG9pbnRQcm9wPzogUG9pbnRQcm9wcykgPT4ge1xuICAgICAgY29uc3QgZmlyc3RQID0gbmV3IEVkaXRQb2ludChpZCwgZmlyc3RQb3NpdGlvbiwgZmlyc3RQb2ludFByb3AgPyBmaXJzdFBvaW50UHJvcCA6IERFRkFVTFRfSElQUE9EUk9NRV9PUFRJT05TLnBvaW50UHJvcHMpO1xuICAgICAgY29uc3Qgc2VjUCA9IG5ldyBFZGl0UG9pbnQoaWQsIHNlY29uZFBvc2l0aW9uLCBzZWNvbmRQb2ludFByb3AgPyBzZWNvbmRQb2ludFByb3AgOiBERUZBVUxUX0hJUFBPRFJPTUVfT1BUSU9OUy5wb2ludFByb3BzKTtcblxuICAgICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKTtcbiAgICAgIGhpcHBvZHJvbWUuc2V0UG9pbnRzTWFudWFsbHkoW2ZpcnN0UCwgc2VjUF0sIHdpZHRoTWV0ZXJzKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSyxcbiAgICAgICAgbGFiZWxzUmVuZGVyRm46IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC51cGRhdGVMYWJlbHMgPSAobGFiZWxzOiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUyxcbiAgICAgICAgdXBkYXRlTGFiZWxzOiBsYWJlbHMsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmZpbmlzaENyZWF0aW9uID0gKCkgPT4ge1xuICAgICAgaWYgKCFmaW5pc2hDcmVhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hpcHBvZHJvbWUgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbigpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q3VycmVudFBvaW50cyA9ICgpID0+IHRoaXMuZ2V0UG9pbnRzKGlkKTtcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0RWRpdFZhbHVlID0gKCkgPT4gb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldFZhbHVlKCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5oaXBwb2Ryb21lTWFuYWdlci5nZXQoaWQpLmxhYmVscztcbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0Q3VycmVudFdpZHRoID0gKCk6IG51bWJlciA9PiB0aGlzLmdldFdpZHRoKGlkKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgSGlwcG9kcm9tZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9ucyhpZDogYW55KSB7XG4gICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gaGlwcG9kcm9tZS5nZXRSZWFsUG9zaXRpb25zKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFBvaW50cyhpZDogYW55KSB7XG4gICAgY29uc3QgaGlwcG9kcm9tZSA9IHRoaXMuaGlwcG9kcm9tZU1hbmFnZXIuZ2V0KGlkKTtcbiAgICByZXR1cm4gaGlwcG9kcm9tZS5nZXRSZWFsUG9pbnRzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFdpZHRoKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoaXBwb2Ryb21lID0gdGhpcy5oaXBwb2Ryb21lTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiBoaXBwb2Ryb21lLmdldFdpZHRoKCk7XG4gIH1cbn1cbiJdfQ==
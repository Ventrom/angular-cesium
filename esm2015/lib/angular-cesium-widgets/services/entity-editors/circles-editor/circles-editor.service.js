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
const ɵ0 = () => Cesium.Color.WHITE.withAlpha(0.8);
export const DEFAULT_CIRCLE_OPTIONS = {
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
export class CirclesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            const changeMode = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
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
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
                center = position;
            }
            else {
                finishedCreate = finishCreation(position);
            }
        });
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            }
        });
        return editorObservable;
    }
    edit(center, radius, options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        const update = {
            id,
            center,
            radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    }
    editCircle(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            const point = entities[0];
            const pointIsCenter = point === this.getCenterPoint(id);
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = {
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = {
                    id,
                    center: this.getCenterPosition(id),
                    radiusPoint: this.getRadiusPosition(id),
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
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
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (center, radius, centerPointProp, radiusPointProp, circleProp) => {
            const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            const circle = this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
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
                throw new Error('Circles editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.circlesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getRadius = () => this.getRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        const circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    }
    getCenterPosition(id) {
        return this.circlesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.circlesManager.get(id).center;
    }
    getRadiusPosition(id) {
        return this.circlesManager.get(id).getRadiusPoint();
    }
    getRadius(id) {
        return this.circlesManager.get(id).getRadius();
    }
    getCircleProperties(id) {
        const circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    }
}
CirclesEditorService.decorators = [
    { type: Injectable }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1lZGl0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9jaXJjbGVzLWVkaXRvci9jaXJjbGVzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDbEcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtGQUFrRixDQUFDO0FBQy9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpRkFBaUYsQ0FBQztBQU85RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFJakUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztXQThCNUIsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQTNCckQsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQXNCO0lBQ3ZELGFBQWEsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7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QUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUMxQixXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUNwQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRTtTQUMzQixDQUFDO0lBQ0osQ0FBQzs7O1lBalpGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmFzaWNFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2Jhc2ljLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0LXBvaW50JztcbmltcG9ydCB7IEVkaXRhYmxlQ2lyY2xlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWNpcmNsZSc7XG5pbXBvcnQgeyBFbGxpcHNlUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWxsaXBzZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENpcmNsZXNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DSVJDTEVfT1BUSU9OUzogQ2lyY2xlRWRpdE9wdGlvbnMgPSB7XG4gIGFkZFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIGRyYWdQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGRyYWdTaGFwZUV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgY2lyY2xlUHJvcHM6IHtcbiAgICBtYXRlcmlhbDogQ2VzaXVtLkNvbG9yLkNPUk5GTE9XRVJCTFVFLndpdGhBbHBoYSgwLjQpLFxuICAgIGZpbGw6IHRydWUsXG4gICAgb3V0bGluZTogZmFsc2UsXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjgpLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICAgIHpJbmRleDogMCxcbiAgICBzaGFkb3dzOiBDZXNpdW0uU2hhZG93TW9kZS5ESVNBQkxFRCxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuMiksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTMsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICB3aWR0aDogMSxcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjgpLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBjaXJjbGVzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgQ2lyY2xlRWRpdG9yU2VydmljZWAgeW91cnNlbGYuXG4gKiBQb2x5Z29uc0VkaXRvclNlcnZpY2Ugd29ya3MgdG9nZXRoZXIgd2l0aCBgPGNpcmNsZS1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPGNpcmNsZS1lZGl0b3I+YFxuICogZm9yIGVhY2ggYENpcmNsZUVkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYENpcmNsZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBUbyBzdG9wIGVkaXRpbmcgY2FsbCBgZHNpcG9zZSgpYCBmcm9tIHRoZSBgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXR0ZWQgc2hhcGVzKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIGFsbG93cyB5b3UgdG8gZHJhdyBsYWJlbHMgb3ZlciBhIHNoYXBlIHRoYXQgaXMgYmVpbmcgZWRpdGVkIHdpdGggb25lIG9mIHRoZSBlZGl0b3JzLlxuICogVG8gYWRkIGxhYmVsIGRyYXdpbmcgbG9naWMgdG8geW91ciBlZGl0b3IgdXNlIHRoZSBmdW5jdGlvbiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgdGhhdCBpcyBkZWZpbmVkIG9uIHRoZVxuICogYENpcmNsZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgY2lyY2xlXG4gKiAgY29uc3QgZWRpdGluZyQgPSBjaXJjbGVzRWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBjaXJjbGUgZnJvbSBleGlzdGluZyBjZW50ZXIgcG9pbnQgYW5kIHJhZGl1c1xuICogIGNvbnN0IGVkaXRpbmckID0gdGhpcy5jaXJjbGVzRWRpdG9yU2VydmljZS5lZGl0KGNlbnRlciwgcmFkaXVzKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENpcmNsZXNFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oKTtcbiAgcHJpdmF0ZSB1cGRhdGVQdWJsaXNoZXIgPSBwdWJsaXNoPENpcmNsZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PltdPigpO1xuXG4gIGluaXQoXG4gICAgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIGNpcmNsZXNNYW5hZ2VyOiBDaXJjbGVzTWFuYWdlclNlcnZpY2UsXG4gICkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuY2lyY2xlc01hbmFnZXIgPSBjaXJjbGVzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPENpcmNsZUVkaXRVcGRhdGU+IHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVQdWJsaXNoZXI7XG4gIH1cblxuICBjcmVhdGUob3B0aW9ucyA9IERFRkFVTFRfQ0lSQ0xFX09QVElPTlMsIHByaW9yaXR5ID0gMTAwKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgbGV0IGNlbnRlcjogYW55O1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGNsaWVudEVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxDaXJjbGVFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgY2lyY2xlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaENyZWF0aW9uID0gKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXIsXG4gICAgICAgIHJhZGl1c1BvaW50OiBwb3NpdGlvbixcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5ULFxuICAgICAgfTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGNoYW5nZU1vZGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXIsXG4gICAgICAgIHJhZGl1c1BvaW50OiBwb3NpdGlvbixcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgICAgfTtcblxuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKS5mb3JFYWNoKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24uZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMuZWRpdENpcmNsZShpZCwgcHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBjaXJjbGVPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaW5pc2hlZENyZWF0ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb25dKTtcbiAgICBjb25zdCBlZGl0b3JPYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGNsaWVudEVkaXRTdWJqZWN0LCBpZCwgZmluaXNoQ3JlYXRpb24pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGNlbnRlcjogcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX1BPSU5ULFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNlbnRlciA9IHBvc2l0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb3VzZU1vdmVSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgcmFkaXVzUG9pbnQ6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLk1PVVNFX01PVkUsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBlZGl0b3JPYnNlcnZhYmxlO1xuICB9XG5cbiAgZWRpdChjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyLCBvcHRpb25zID0gREVGQVVMVF9DSVJDTEVfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBDaXJjbGVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgY2lyY2xlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2lyY2xlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmFkaXVzUG9pbnQ6IENhcnRlc2lhbjMgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIGNlbnRlcixcbiAgICAgIHJhZGl1c1BvaW50LFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGNpcmNsZU9wdGlvbnMsXG4gICAgfTtcbiAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgLi4udXBkYXRlLFxuICAgICAgLi4udGhpcy5nZXRDaXJjbGVQcm9wZXJ0aWVzKGlkKSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVkaXRDaXJjbGUoaWQsIHByaW9yaXR5LCBlZGl0U3ViamVjdCwgY2lyY2xlT3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGVkaXRDaXJjbGUoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PENpcmNsZUVkaXRVcGRhdGU+LFxuICAgIG9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zLFxuICAgIGVkaXRPYnNlcnZhYmxlPzogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSxcbiAgKTogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBsZXQgc2hhcGVEcmFnUmVnaXN0cmF0aW9uO1xuICAgIGlmIChvcHRpb25zLmFsbG93RHJhZykge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRyxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVDaXJjbGUsXG4gICAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuaWQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb25cbiAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBzdGFydFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICBjb25zdCBlbmREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludDogRWRpdFBvaW50ID0gZW50aXRpZXNbMF07XG4gICAgICAgIGNvbnN0IHBvaW50SXNDZW50ZXIgPSBwb2ludCA9PT0gdGhpcy5nZXRDZW50ZXJQb2ludChpZCk7XG4gICAgICAgIGxldCBlZGl0QWN0aW9uO1xuICAgICAgICBpZiAoZHJvcCkge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0gcG9pbnRJc0NlbnRlciA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEUgOiBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93RHJhZyAmJiAoZWRpdEFjdGlvbiA9PT0gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSB8fCBlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCkpIHtcbiAgICAgICAgICB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKHRydWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXI6IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpLFxuICAgICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgICBzdGFydERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb24sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNoYXBlRHJhZ1JlZ2lzdHJhdGlvbikge1xuICAgICAgc2hhcGVEcmFnUmVnaXN0cmF0aW9uXG4gICAgICAgIC5waXBlKHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIGRyb3AgfSB9KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhcnREcmFnUG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICAgIGlmICghZW5kRHJhZ1Bvc2l0aW9uIHx8ICFzdGFydERyYWdQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZW5kRHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19TSEFQRSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgICAgICAuLi50aGlzLmdldENpcmNsZVByb3BlcnRpZXMoaWQpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiBlZGl0T2JzZXJ2YWJsZSB8fCB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShvYnNlcnZhYmxlVG9FeHRlbmQ6IGFueSwgaWQ6IHN0cmluZywgZmluaXNoQ3JlYXRpb24/OiAocG9zaXRpb246IENhcnRlc2lhbjMpID0+IGJvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTUE9TRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZW5hYmxlID0gKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyOiB0aGlzLmdldENlbnRlclBvc2l0aW9uKGlkKSxcbiAgICAgICAgcmFkaXVzUG9pbnQ6IHRoaXMuZ2V0UmFkaXVzUG9zaXRpb24oaWQpLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkVOQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNlbnRlcjogdGhpcy5nZXRDZW50ZXJQb3NpdGlvbihpZCksXG4gICAgICAgIHJhZGl1c1BvaW50OiB0aGlzLmdldFJhZGl1c1Bvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5ESVNBQkxFLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRNYW51YWxseSA9IChcbiAgICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICAgIHJhZGl1czogbnVtYmVyLFxuICAgICAgY2VudGVyUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIHJhZGl1c1BvaW50UHJvcD86IFBvaW50UHJvcHMsXG4gICAgICBjaXJjbGVQcm9wPzogRWxsaXBzZVByb3BzLFxuICAgICkgPT4ge1xuICAgICAgY29uc3QgcmFkaXVzUG9pbnQgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlbnRlciwgcmFkaXVzLCBNYXRoLlBJIC8gMiwgdHJ1ZSk7XG4gICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBjaXJjbGUuc2V0TWFudWFsbHkoY2VudGVyLCByYWRpdXNQb2ludCwgY2VudGVyUG9pbnRQcm9wLCByYWRpdXNQb2ludFByb3AsIGNpcmNsZVByb3ApO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogKHVwZGF0ZTogQmFzaWNFZGl0VXBkYXRlPGFueT4sIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW10pID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9FRElUX0xBQkVMU19SRU5ERVJfQ0FMTEJBQ0ssXG4gICAgICAgIGxhYmVsc1JlbmRlckZuOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQudXBkYXRlTGFiZWxzID0gKGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5VUERBVEVfRURJVF9MQUJFTFMsXG4gICAgICAgIHVwZGF0ZUxhYmVsczogbGFiZWxzLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5maW5pc2hDcmVhdGlvbiA9ICgpID0+IHtcbiAgICAgIGlmICghZmluaXNoQ3JlYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDaXJjbGVzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24obnVsbCk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldENlbnRlciA9ICgpOiBDYXJ0ZXNpYW4zID0+IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRSYWRpdXMgPSAoKTogbnVtYmVyID0+IHRoaXMuZ2V0UmFkaXVzKGlkKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgQ2lyY2xlRWRpdG9yT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyk6IENpcmNsZUVkaXRPcHRpb25zIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfQ0lSQ0xFX09QVElPTlMpKTtcbiAgICBjb25zdCBjaXJjbGVPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Q2xvbmUsIG9wdGlvbnMpO1xuICAgIGNpcmNsZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ0lSQ0xFX09QVElPTlMucG9pbnRQcm9wcywgb3B0aW9ucy5wb2ludFByb3BzKTtcbiAgICBjaXJjbGVPcHRpb25zLmNpcmNsZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DSVJDTEVfT1BUSU9OUy5jaXJjbGVQcm9wcywgb3B0aW9ucy5jaXJjbGVQcm9wcyk7XG4gICAgY2lyY2xlT3B0aW9ucy5wb2x5bGluZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9DSVJDTEVfT1BUSU9OUy5wb2x5bGluZVByb3BzLCBvcHRpb25zLnBvbHlsaW5lUHJvcHMpO1xuICAgIHJldHVybiBjaXJjbGVPcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2VudGVyUG9pbnQoaWQ6IHN0cmluZyk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlc01hbmFnZXIuZ2V0KGlkKS5jZW50ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1c1Bvc2l0aW9uKGlkOiBzdHJpbmcpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldFJhZGl1c1BvaW50KCk7XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1cyhpZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzTWFuYWdlci5nZXQoaWQpLmdldFJhZGl1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaXJjbGVQcm9wZXJ0aWVzKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNpcmNsZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNlbnRlcjogY2lyY2xlLmdldENlbnRlcigpLFxuICAgICAgcmFkaXVzUG9pbnQ6IGNpcmNsZS5nZXRSYWRpdXNQb2ludCgpLFxuICAgICAgcmFkaXVzOiBjaXJjbGUuZ2V0UmFkaXVzKCksXG4gICAgfTtcbiAgfVxufVxuIl19
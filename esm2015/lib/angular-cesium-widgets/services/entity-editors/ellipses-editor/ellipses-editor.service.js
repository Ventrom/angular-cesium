import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { EditableEllipse } from '../../../models/editable-ellipse';
import { generateKey } from '../../utils';
import { CesiumEventModifier } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
const ɵ0 = () => Cesium.Color.WHITE;
export const DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: true,
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
    circleToEllipseTransformation: false,
};
/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
export class EllipsesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, ellipsesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
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
            ellipseOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                updatedPosition: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next(Object.assign({}, update));
            const changeMode = {
                id,
                center,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(Object.assign({}, update));
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
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
            event: ellipseOptions.addPointEvent,
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
                clientEditSubject.next(Object.assign({}, update));
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
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
            }
        });
        return editorObservable;
    }
    edit(center, majorRadius, rotation = Math.PI / 2, minorRadius, options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const update = {
            id,
            center,
            majorRadius,
            rotation,
            minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    }
    editEllipse(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
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
            if (!options.allowDrag && this.ellipsesManager.get(id).enableEdit &&
                (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = Object.assign({ id, updatedPoint: point, startDragPosition,
                endDragPosition, editMode: EditModes.EDIT, editAction }, this.getEllipseProperties(id));
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update));
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
                const update = Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = Object.assign({ id,
                    startDragPosition,
                    endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
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
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, this.getEllipseProperties(id)));
        };
        observableToExtend.disable = () => {
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, this.getEllipseProperties(id)));
        };
        observableToExtend.setManually = (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) => {
            const ellipse = this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
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
                throw new Error('Ellipses editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.ellipsesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getMajorRadius = () => this.getMajorRadius(id);
        observableToExtend.getMinorRadius = () => this.getMinorRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        const ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    }
    getCenterPosition(id) {
        return this.ellipsesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.ellipsesManager.get(id).center;
    }
    getMajorRadius(id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    }
    getMinorRadius(id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    }
    getEllipseProperties(id) {
        const ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    }
}
EllipsesEditorService.decorators = [
    { type: Injectable }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUluRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJGQUEyRixDQUFDO1dBZ0NsSCxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7QUE3QnRDLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUF1QjtJQUN6RCxhQUFhLEVBQUUsV0FBVyxDQUFDLFVBQVU7SUFDckMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxlQUFlO0lBQzNDLGNBQWMsRUFBRSxXQUFXLENBQUMsZUFBZTtJQUMzQyw2QkFBNkIsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUNyRCxxQ0FBcUMsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHO0lBQzlELFNBQVMsRUFBRSxJQUFJO0lBQ2YsWUFBWSxFQUFFO1FBQ1osUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDcEQsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsSUFBSTtRQUNiLFlBQVksRUFBRSxDQUFDO1FBQ2YsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDL0Msa0JBQWtCLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUk7UUFDbEQsTUFBTSxFQUFFLENBQUM7UUFDVCxPQUFPLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRO0tBQ3BDO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztRQUN6QixZQUFZLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUMvQyxZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxFQUFFO1FBQ2IscUJBQXFCLEVBQUUsQ0FBQztRQUN4QixJQUFJLEVBQUUsSUFBSTtRQUNWLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7S0FDbkQ7SUFDRCxhQUFhLEVBQUU7UUFDYixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsSUFBMEI7S0FDbkM7SUFDRCw2QkFBNkIsRUFBRSxLQUFLO0NBQ3JDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFFSCxNQUFNLE9BQU8scUJBQXFCO0lBRGxDO1FBR1Usa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztRQUNqRCxvQkFBZSxHQUFHLE9BQU8sRUFBcUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7UUFJNUYsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBdUMsQ0FBQztJQTZhMUUsQ0FBQztJQTFhQyxJQUFJLENBQ0YsZ0JBQXlDLEVBQ3pDLG1CQUF3QyxFQUN4QyxhQUE0QixFQUM1QixlQUF1QyxFQUN2QyxZQUEyQjtRQUUzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQy9DLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLEVBQUUsUUFBUSxHQUFHLEdBQUc7UUFDdEQsSUFBSSxNQUFXLENBQUM7UUFDaEIsTUFBTSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFDekIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxNQUFNLGlCQUFpQixHQUFHLElBQUksZUFBZSxDQUFvQjtZQUMvRCxFQUFFO1lBQ0YsVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1NBQzNCLENBQUMsQ0FBQztRQUNILElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztRQUUzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztZQUN0QixFQUFFO1lBQ0YsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1lBQzFCLFVBQVUsRUFBRSxXQUFXLENBQUMsSUFBSTtZQUM1QixjQUFjO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsQ0FBQyxRQUFvQixFQUFFLEVBQUU7WUFDOUMsTUFBTSxNQUFNLEdBQXNCO2dCQUNoQyxFQUFFO2dCQUNGLE1BQU07Z0JBQ04sZUFBZSxFQUFFLFFBQVE7Z0JBQ3pCLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDMUIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxjQUFjO2FBQ3ZDLENBQUM7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNqQixNQUFNLEVBQ1QsQ0FBQztZQUVILE1BQU0sVUFBVSxHQUFzQjtnQkFDcEMsRUFBRTtnQkFDRixNQUFNO2dCQUNOLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDMUIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxjQUFjO2FBQ3ZDLENBQUM7WUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwQyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNqQixNQUFNLEVBQ1QsQ0FBQztZQUNILElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzdFO1lBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BGLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDdEIsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBRUYsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1lBQzNELEtBQUssRUFBRSxXQUFXLENBQUMsVUFBVTtZQUM3QixJQUFJLEVBQUUsV0FBVyxDQUFDLE9BQU87WUFDekIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUI7WUFDckMsUUFBUTtTQUNULENBQUMsQ0FBQztRQUNILE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztZQUMxRCxLQUFLLEVBQUUsY0FBYyxDQUFDLGFBQWE7WUFDbkMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxPQUFPO1lBQ3pCLFVBQVUsRUFBRSxPQUFPLENBQUMsaUJBQWlCO1lBQ3JDLFFBQVE7U0FDVCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRTVGLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQy9ELElBQUksY0FBYyxFQUFFO2dCQUNsQixPQUFPO2FBQ1I7WUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE1BQU0sTUFBTSxHQUFzQjtvQkFDaEMsRUFBRTtvQkFDRixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxNQUFNO29CQUMxQixVQUFVLEVBQUUsV0FBVyxDQUFDLFNBQVM7aUJBQ2xDLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLGlCQUFpQixDQUFDLElBQUksbUJBQ2pCLE1BQU0sRUFDVCxDQUFDO2dCQUNILE1BQU0sR0FBRyxRQUFRLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0wsY0FBYyxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDaEUsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxPQUFPO2FBQ1I7WUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUUsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osTUFBTSxNQUFNLEdBQXNCO29CQUNoQyxFQUFFO29CQUNGLE1BQU07b0JBQ04sZUFBZSxFQUFFLFFBQVE7b0JBQ3pCLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtvQkFDMUIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxVQUFVO2lCQUNuQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNqQixNQUFNLEVBQ1QsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQ0YsTUFBa0IsRUFDbEIsV0FBbUIsRUFDbkIsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUN0QixXQUFvQixFQUNwQixPQUFPLEdBQUcsdUJBQXVCLEVBQ2pDLFFBQVEsR0FBRyxHQUFHO1FBRWQsTUFBTSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFDekIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBb0I7WUFDekQsRUFBRTtZQUNGLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxTQUFTLENBQUMsSUFBSTtTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBc0I7WUFDaEMsRUFBRTtZQUNGLE1BQU07WUFDTixXQUFXO1lBQ1gsUUFBUTtZQUNSLFdBQVc7WUFDWCxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUk7WUFDeEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxJQUFJO1lBQzVCLGNBQWM7U0FDZixDQUFDO1FBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsV0FBVyxDQUFDLElBQUksbUJBQ1gsTUFBTSxFQUNULENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVPLFdBQVcsQ0FDakIsRUFBVSxFQUNWLFFBQWdCLEVBQ2hCLFdBQXVDLEVBQ3ZDLE9BQTJCLEVBQzNCLGNBQXdDO1FBRXhDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztZQUMzRCxLQUFLLEVBQUUsT0FBTyxDQUFDLGNBQWM7WUFDN0IsVUFBVSxFQUFFLFNBQVM7WUFDckIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUI7WUFDckMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVO1lBQzVCLFFBQVE7WUFDUixVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLGNBQWM7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSwyQkFBMkIsQ0FBQztRQUNoQyxJQUFJLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRTtZQUN6QywyQkFBMkIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO2dCQUMzRCxLQUFLLEVBQUUsT0FBTyxDQUFDLDZCQUE2QjtnQkFDNUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxxQ0FBcUM7Z0JBQ3ZELFVBQVUsRUFBRSxlQUFlO2dCQUMzQixVQUFVLEVBQUUsT0FBTyxDQUFDLGlCQUFpQjtnQkFDckMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxVQUFVO2dCQUM1QixRQUFRO2dCQUNSLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsRUFBRTthQUN2QyxDQUFDLENBQUM7U0FDSjtRQUVELElBQUkscUJBQXFCLENBQUM7UUFDMUIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3JCLHFCQUFxQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Z0JBQ3JELEtBQUssRUFBRSxPQUFPLENBQUMsY0FBYztnQkFDN0IsVUFBVSxFQUFFLGVBQWU7Z0JBQzNCLFVBQVUsRUFBRSxPQUFPLENBQUMsaUJBQWlCO2dCQUNyQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVU7Z0JBQzVCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLEVBQUU7YUFDdkMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxxQkFBcUI7YUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDdkgsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDMUUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDckYsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BCLE9BQU87YUFDUjtZQUVELE1BQU0sS0FBSyxHQUFjLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLGFBQWEsR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4RCxJQUFJLFVBQVUsQ0FBQztZQUNmLElBQUksSUFBSSxFQUFFO2dCQUNSLFVBQVUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDO2FBQzVGO2lCQUFNO2dCQUNMLFVBQVUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7YUFDOUU7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVO2dCQUMvRCxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUMsVUFBVSxJQUFJLFVBQVUsS0FBSyxXQUFXLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDekYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLE9BQU87YUFDUjtZQUVELE1BQU0sTUFBTSxtQkFDVixFQUFFLEVBQ0YsWUFBWSxFQUFFLEtBQUssRUFDbkIsaUJBQWlCO2dCQUNqQixlQUFlLEVBQ2YsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQ3hCLFVBQVUsSUFDUCxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQ2pDLENBQUM7WUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxXQUFXLENBQUMsSUFBSSxtQkFDWCxNQUFNLEVBQ1QsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSwyQkFBMkIsRUFBRTtZQUMvQiwyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtnQkFDckcsTUFBTSxNQUFNLG1CQUNWLEVBQUUsRUFDRixRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksRUFDeEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxTQUFTLElBQzlCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FDakMsQ0FBQztnQkFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEMsV0FBVyxDQUFDLElBQUksbUJBQ1gsTUFBTSxFQUNULENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxxQkFBcUIsRUFBRTtZQUN6QixxQkFBcUI7aUJBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUN2SCxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO2dCQUNoRSxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckYsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRixJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7b0JBQzFDLE9BQU87aUJBQ1I7Z0JBRUQsTUFBTSxNQUFNLG1CQUNWLEVBQUU7b0JBQ0YsaUJBQWlCO29CQUNqQixlQUFlLEVBQ2YsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQ3hCLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsSUFDdEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUNqQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQyxXQUFXLENBQUMsSUFBSSxtQkFDWCxNQUFNLEVBQ1QsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsSUFBSSxxQkFBcUIsRUFBRTtZQUN6QixXQUFXLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDekM7UUFDRCxJQUFJLDJCQUEyQixFQUFFO1lBQy9CLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUMvQztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6QyxPQUFPLGNBQWMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxrQkFBdUIsRUFBRSxFQUFVLEVBQUUsY0FBa0Q7UUFFcEgsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNoQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRCxJQUFJLFdBQVcsRUFBRTtnQkFDZixXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFDdEIsRUFBRTtnQkFDRixRQUFRLEVBQUUsU0FBUyxDQUFDLGNBQWM7Z0JBQ2xDLFVBQVUsRUFBRSxXQUFXLENBQUMsT0FBTzthQUNYLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUN0QixFQUFFLEVBQ0YsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQ3hCLFVBQVUsRUFBRSxXQUFXLENBQUMsTUFBTSxJQUMzQixJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQ1osQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQ3RCLEVBQUUsRUFDRixRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksRUFDeEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxPQUFPLElBQzVCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FDWixDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCLENBQUMsV0FBVyxHQUFHLENBQy9CLE1BQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLFFBQWlCLEVBQ2pCLFdBQW9CLEVBQ3BCLGVBQTRCLEVBQzVCLGVBQTRCLEVBQzVCLFdBQTBCLEVBQzFCLEVBQUU7WUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9HLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDbEMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxZQUFZO2FBQ3JDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLGlCQUFpQixHQUFHLENBQUMsUUFBOEUsRUFBRSxFQUFFO1lBQ3hILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFO2dCQUNGLFFBQVEsRUFBRSxTQUFTLENBQUMsY0FBYztnQkFDbEMsVUFBVSxFQUFFLFdBQVcsQ0FBQywrQkFBK0I7Z0JBQ3ZELGNBQWMsRUFBRSxRQUFRO2FBQ0osQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLE1BQW9CLEVBQUUsRUFBRTtZQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFDdEIsRUFBRTtnQkFDRixRQUFRLEVBQUUsU0FBUyxDQUFDLGNBQWM7Z0JBQ2xDLFVBQVUsRUFBRSxXQUFXLENBQUMsa0JBQWtCO2dCQUMxQyxZQUFZLEVBQUUsTUFBTTthQUNBLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUM7UUFFRixrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQzthQUN2RjtZQUVELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUVGLGtCQUFrQixDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV0RSxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsR0FBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN2RixrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsR0FBZSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFFLE9BQU8sa0JBQTZDLENBQUM7SUFDdkQsQ0FBQztJQUVPLFVBQVUsQ0FBQyxPQUEyQjtRQUM1QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVELGNBQWMsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsdUJBQXVCLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RyxjQUFjLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLHVCQUF1QixDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUcsY0FBYyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9HLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxFQUFVO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxFQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzdDLENBQUM7SUFFTyxjQUFjLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFTyxjQUFjLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxFQUFVO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU87WUFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMzQixRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUMvQixXQUFXLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUNyQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUNyQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsMkJBQTJCLEVBQUU7WUFDL0Qsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLDJCQUEyQixFQUFFO1NBQ2hFLENBQUM7SUFDSixDQUFDOzs7WUFwYkYsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2gsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbGxpcHNlLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucywgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEVkaXRhYmxlRWxsaXBzZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1lbGxpcHNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgQmFzaWNFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2Jhc2ljLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IGdlbmVyYXRlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VMTElQU0VfT1BUSU9OUzogRWxsaXBzZUVkaXRPcHRpb25zID0ge1xuICBhZGRQb2ludEV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBkcmFnU2hhcGVFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtRXZlbnRNb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllci5BTFQsXG4gIGFsbG93RHJhZzogdHJ1ZSxcbiAgZWxsaXBzZVByb3BzOiB7XG4gICAgbWF0ZXJpYWw6IENlc2l1bS5Db2xvci5DT1JORkxPV0VSQkxVRS53aXRoQWxwaGEoMC40KSxcbiAgICBmaWxsOiB0cnVlLFxuICAgIG91dGxpbmU6IHRydWUsXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjgpLFxuICAgIGNsYXNzaWZpY2F0aW9uVHlwZTogQ2VzaXVtLkNsYXNzaWZpY2F0aW9uVHlwZS5CT1RILFxuICAgIHpJbmRleDogMCxcbiAgICBzaGFkb3dzOiBDZXNpdW0uU2hhZG93TW9kZS5ESVNBQkxFRCxcbiAgfSxcbiAgcG9pbnRQcm9wczoge1xuICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxBQ0sud2l0aEFscGhhKDAuMiksXG4gICAgb3V0bGluZVdpZHRoOiAxLFxuICAgIHBpeGVsU2l6ZTogMTMsXG4gICAgdmlydHVhbFBvaW50UGl4ZWxTaXplOiA4LFxuICAgIHNob3c6IHRydWUsXG4gICAgc2hvd1ZpcnR1YWw6IHRydWUsXG4gICAgZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIH0sXG4gIHBvbHlsaW5lUHJvcHM6IHtcbiAgICB3aWR0aDogMSxcbiAgICBtYXRlcmlhbDogKCkgPT4gQ2VzaXVtLkNvbG9yLldISVRFLFxuICB9LFxuICBjaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbjogZmFsc2UsXG59O1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGNyZWF0aW5nIGVkaXRhYmxlIGVsbGlwc2VzXG4gKlxuICogWW91IG11c3QgcHJvdmlkZSBgRWxsaXBzZXNFZGl0b3JTZXJ2aWNlYCB5b3Vyc2VsZi5cbiAqIEVsbGlwc2VzRWRpdG9yU2VydmljZSB3b3JrcyB0b2dldGhlciB3aXRoIGA8ZWxsaXBzZS1lZGl0b3I+YCBjb21wb25lbnQuIFRoZXJlZm9yIHlvdSBuZWVkIHRvIGNyZWF0ZSBgPGVsbGlwc2UtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBFbGxpcHNlc0VkaXRvclNlcnZpY2VgLCBBbmQgb2YgY291cnNlIHNvbWV3aGVyZSB1bmRlciBgPGFjLW1hcD5gL1xuICpcbiAqICsgYGNyZWF0ZWAgZm9yIHN0YXJ0aW5nIGEgY3JlYXRpb24gb2YgdGhlIHNoYXBlIG92ZXIgdGhlIG1hcC4gUmV0dXJucyBhIGV4dGVuc2lvbiBvZiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgLlxuICogKyBgZWRpdGAgZm9yIGVkaXRpbmcgc2hhcGUgb3ZlciB0aGUgbWFwIHN0YXJ0aW5nIGZyb20gYSBnaXZlbiBwb3NpdGlvbnMuIFJldHVybnMgYW4gZXh0ZW5zaW9uIG9mIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkaXNwb3NlKClgIGZyb20gdGhlIGBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZWAgeW91IGdldCBiYWNrIGZyb20gYGNyZWF0ZSgpYCBcXCBgZWRpdCgpYC5cbiAqXG4gKiAqKkxhYmVscyBvdmVyIGVkaXRlZCBzaGFwZXMqKlxuICogQW5ndWxhciBDZXNpdW0gYWxsb3dzIHlvdSB0byBkcmF3IGxhYmVscyBvdmVyIGEgc2hhcGUgdGhhdCBpcyBiZWluZyBlZGl0ZWQgd2l0aCBvbmUgb2YgdGhlIGVkaXRvcnMuXG4gKiBUbyBhZGQgbGFiZWwgZHJhd2luZyBsb2dpYyB0byB5b3VyIGVkaXRvciB1c2UgdGhlIGZ1bmN0aW9uIGBzZXRMYWJlbHNSZW5kZXJGbigpYCB0aGF0IGlzIGRlZmluZWQgb24gdGhlXG4gKiBgRWxsaXBzZUVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgZWxsaXBzZVxuICogIGNvbnN0IGVkaXRpbmckID0gZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmNyZWF0ZSgpO1xuICogIHRoaXMuZWRpdGluZyQuc3Vic2NyaWJlKGVkaXRSZXN1bHQgPT4ge1xuICpcdFx0XHRcdGNvbnNvbGUubG9nKGVkaXRSZXN1bHQucG9zaXRpb25zKTtcbiAqXHRcdH0pO1xuICpcbiAqICAvLyBPciBlZGl0IGVsbGlwc2UgZnJvbSBleGlzdGluZyBjZW50ZXIgcG9pbnQsIHR3byByYWRpdXNlcyBhbmQgcm90YXRpb25cbiAqICBjb25zdCBlZGl0aW5nJCA9IHRoaXMuZWxsaXBzZXNFZGl0b3JTZXJ2aWNlLmVkaXQoY2VudGVyLCBtYWpvclJhZGl1cywgcm90YXRpb24sIG1pbm9yUmFkaXVzKTtcbiAqXG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVsbGlwc2VzRWRpdG9yU2VydmljZSB7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgdXBkYXRlU3ViamVjdCA9IG5ldyBTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8RWxsaXBzZUVkaXRVcGRhdGU+KCkodGhpcy51cGRhdGVTdWJqZWN0KTsgLy8gVE9ETyBtYXliZSBub3QgbmVlZGVkXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGVsbGlwc2VzTWFuYWdlcjogRWxsaXBzZXNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+W10+KCk7XG4gIHByaXZhdGUgY2VzaXVtU2NlbmU6IGFueTtcblxuICBpbml0KFxuICAgIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UsXG4gICAgY2VzaXVtVmlld2VyOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA9IGNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlciA9IGVsbGlwc2VzTWFuYWdlcjtcbiAgICB0aGlzLnVwZGF0ZVB1Ymxpc2hlci5jb25uZWN0KCk7XG5cbiAgICB0aGlzLmNlc2l1bVNjZW5lID0gY2VzaXVtVmlld2VyLmdldFNjZW5lKCk7XG4gIH1cblxuICBvblVwZGF0ZSgpOiBPYnNlcnZhYmxlPEVsbGlwc2VFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgY3JlYXRlKG9wdGlvbnMgPSBERUZBVUxUX0VMTElQU0VfT1BUSU9OUywgcHJpb3JpdHkgPSAxMDApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgbGV0IGNlbnRlcjogYW55O1xuICAgIGNvbnN0IGlkID0gZ2VuZXJhdGVLZXkoKTtcbiAgICBjb25zdCBlbGxpcHNlT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBjbGllbnRFZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RWxsaXBzZUVkaXRVcGRhdGU+KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdEFjdGlvbjogbnVsbCxcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgIH0pO1xuICAgIGxldCBmaW5pc2hlZENyZWF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBlbGxpcHNlT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZpbmlzaENyZWF0aW9uID0gKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgY2VudGVyLFxuICAgICAgICB1cGRhdGVkUG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuQUREX0xBU1RfUE9JTlQsXG4gICAgICB9O1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgIGNsaWVudEVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAuLi51cGRhdGUsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY2hhbmdlTW9kZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBjZW50ZXIsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5DSEFOR0VfVE9fRURJVCxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KGNoYW5nZU1vZGUpO1xuICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgIC4uLnVwZGF0ZSxcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZXNNYXAuaGFzKGlkKSkge1xuICAgICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmRlbGV0ZShpZCk7XG4gICAgICB0aGlzLmVkaXRFbGxpcHNlKGlkLCBwcmlvcml0eSwgY2xpZW50RWRpdFN1YmplY3QsIGVsbGlwc2VPcHRpb25zLCBlZGl0b3JPYnNlcnZhYmxlKTtcbiAgICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmaW5pc2hlZENyZWF0ZTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5NT1VTRV9NT1ZFLFxuICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICB9KTtcbiAgICBjb25zdCBhZGRQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogZWxsaXBzZU9wdGlvbnMuYWRkUG9pbnRFdmVudCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkUG9pbnRSZWdpc3RyYXRpb25dKTtcbiAgICBjb25zdCBlZGl0b3JPYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVFZGl0b3JPYnNlcnZhYmxlKGNsaWVudEVkaXRTdWJqZWN0LCBpZCwgZmluaXNoQ3JlYXRpb24pO1xuXG4gICAgYWRkUG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgaWYgKGZpbmlzaGVkQ3JlYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXI6IHBvc2l0aW9uLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFLFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkFERF9QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgICAgY2VudGVyID0gcG9zaXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5pc2hlZENyZWF0ZSA9IGZpbmlzaENyZWF0aW9uKHBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuXG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjZW50ZXIsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICBjbGllbnRFZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAuLi51cGRhdGUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBlZGl0KFxuICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICBtYWpvclJhZGl1czogbnVtYmVyLFxuICAgIHJvdGF0aW9uID0gTWF0aC5QSSAvIDIsXG4gICAgbWlub3JSYWRpdXM/OiBudW1iZXIsXG4gICAgb3B0aW9ucyA9IERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLFxuICAgIHByaW9yaXR5ID0gMTAwLFxuICApOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IGVsbGlwc2VPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IGVkaXRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxFbGxpcHNlRWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgY2VudGVyLFxuICAgICAgbWFqb3JSYWRpdXMsXG4gICAgICByb3RhdGlvbixcbiAgICAgIG1pbm9yUmFkaXVzLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuSU5JVCxcbiAgICAgIGVsbGlwc2VPcHRpb25zLFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICBlZGl0U3ViamVjdC5uZXh0KHtcbiAgICAgIC4uLnVwZGF0ZSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmVkaXRFbGxpcHNlKGlkLCBwcmlvcml0eSwgZWRpdFN1YmplY3QsIGVsbGlwc2VPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZWRpdEVsbGlwc2UoXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PEVsbGlwc2VFZGl0VXBkYXRlPixcbiAgICBvcHRpb25zOiBFbGxpcHNlRWRpdE9wdGlvbnMsXG4gICAgZWRpdE9ic2VydmFibGU/OiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSxcbiAgKTogRWxsaXBzZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHBvaW50RHJhZ1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogb3B0aW9ucy5kcmFnUG9pbnRFdmVudCxcbiAgICAgIGVudGl0eVR5cGU6IEVkaXRQb2ludCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5lZGl0ZWRFbnRpdHlJZCxcbiAgICB9KTtcblxuICAgIGxldCBhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtYXRpb24pIHtcbiAgICAgIGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBvcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybUV2ZW50LFxuICAgICAgICBtb2RpZmllcjogb3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1FdmVudE1vZGlmaWVyLFxuICAgICAgICBlbnRpdHlUeXBlOiBFZGl0YWJsZUVsbGlwc2UsXG4gICAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfRklSU1QsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyOiBlbnRpdHkgPT4gaWQgPT09IGVudGl0eS5pZCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBzaGFwZURyYWdSZWdpc3RyYXRpb247XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dEcmFnKSB7XG4gICAgICBzaGFwZURyYWdSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogb3B0aW9ucy5kcmFnU2hhcGVFdmVudCxcbiAgICAgICAgZW50aXR5VHlwZTogRWRpdGFibGVFbGxpcHNlLFxuICAgICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgICBwcmlvcml0eTogcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmlkLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcG9pbnREcmFnUmVnaXN0cmF0aW9uXG4gICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24sIHN0YXJ0UG9zaXRpb24sIGRyb3AgfSwgZW50aXRpZXMgfSkgPT4ge1xuICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IGVuZERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZW5kUG9zaXRpb24pO1xuICAgICAgICBpZiAoIWVuZERyYWdQb3NpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50OiBFZGl0UG9pbnQgPSBlbnRpdGllc1swXTtcbiAgICAgICAgY29uc3QgcG9pbnRJc0NlbnRlciA9IHBvaW50ID09PSB0aGlzLmdldENlbnRlclBvaW50KGlkKTtcbiAgICAgICAgbGV0IGVkaXRBY3Rpb247XG4gICAgICAgIGlmIChkcm9wKSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHBvaW50SXNDZW50ZXIgPyBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFX0ZJTklTSCA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVkaXRBY3Rpb24gPSBwb2ludElzQ2VudGVyID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRSA6IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dEcmFnICYmIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJlxuICAgICAgICAgIChlZGl0QWN0aW9uID09PSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFIHx8IGVkaXRBY3Rpb24gPT09IEVkaXRBY3Rpb25zLkRSQUdfU0hBUEVfRklOSVNIKSkge1xuICAgICAgICAgIHRoaXMuY2FtZXJhU2VydmljZS5lbmFibGVJbnB1dHModHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICB1cGRhdGVkUG9pbnQ6IHBvaW50LFxuICAgICAgICAgIHN0YXJ0RHJhZ1Bvc2l0aW9uLFxuICAgICAgICAgIGVuZERyYWdQb3NpdGlvbixcbiAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgZWRpdEFjdGlvbixcbiAgICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbikge1xuICAgICAgYWRkU2Vjb25kUmFkaXVzUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBlbmRQb3NpdGlvbiwgc3RhcnRQb3NpdGlvbiwgZHJvcCB9LCBlbnRpdGllcyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRWxsaXBzZUVkaXRVcGRhdGUgPSB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlRSQU5TRk9STSxcbiAgICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIHNoYXBlRHJhZ1JlZ2lzdHJhdGlvblxuICAgICAgICAucGlwZSh0YXAoKHsgbW92ZW1lbnQ6IHsgZHJvcCB9IH0pID0+IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZW5hYmxlRWRpdCAmJiB0aGlzLmNhbWVyYVNlcnZpY2UuZW5hYmxlSW5wdXRzKGRyb3ApKSlcbiAgICAgICAgLnN1YnNjcmliZSgoeyBtb3ZlbWVudDogeyBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgZHJvcCB9IH0pID0+IHtcbiAgICAgICAgICBjb25zdCBzdGFydERyYWdQb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc3RhcnRQb3NpdGlvbik7XG4gICAgICAgICAgY29uc3QgZW5kRHJhZ1Bvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhlbmRQb3NpdGlvbik7XG4gICAgICAgICAgaWYgKCFlbmREcmFnUG9zaXRpb24gfHwgIXN0YXJ0RHJhZ1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgdXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSA9IHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgc3RhcnREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlbmREcmFnUG9zaXRpb24sXG4gICAgICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVQsXG4gICAgICAgICAgICBlZGl0QWN0aW9uOiBkcm9wID8gRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0ggOiBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFLFxuICAgICAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh1cGRhdGUpO1xuICAgICAgICAgIGVkaXRTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb25dO1xuICAgIGlmIChzaGFwZURyYWdSZWdpc3RyYXRpb24pIHtcbiAgICAgIG9ic2VydmFibGVzLnB1c2goc2hhcGVEcmFnUmVnaXN0cmF0aW9uKTtcbiAgICB9XG4gICAgaWYgKGFkZFNlY29uZFJhZGl1c1JlZ2lzdHJhdGlvbikge1xuICAgICAgb2JzZXJ2YWJsZXMucHVzaChhZGRTZWNvbmRSYWRpdXNSZWdpc3RyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuc2V0KGlkLCBvYnNlcnZhYmxlcyk7XG4gICAgcmV0dXJuIGVkaXRPYnNlcnZhYmxlIHx8IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShlZGl0U3ViamVjdCwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nLCBmaW5pc2hDcmVhdGlvbj86IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4gYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBFbGxpcHNlRWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRU5BQkxFLFxuICAgICAgICAuLi50aGlzLmdldEVsbGlwc2VQcm9wZXJ0aWVzKGlkKSxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZGlzYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgICAgLi4udGhpcy5nZXRFbGxpcHNlUHJvcGVydGllcyhpZCksXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnNldE1hbnVhbGx5ID0gKFxuICAgICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgICAgbWFqb3JSYWRpdXM6IG51bWJlcixcbiAgICAgIHJvdGF0aW9uPzogbnVtYmVyLFxuICAgICAgbWlub3JSYWRpdXM/OiBudW1iZXIsXG4gICAgICBjZW50ZXJQb2ludFByb3A/OiBQb2ludFByb3BzLFxuICAgICAgcmFkaXVzUG9pbnRQcm9wPzogUG9pbnRQcm9wcyxcbiAgICAgIGVsbGlwc2VQcm9wPzogRWxsaXBzZVByb3BzLFxuICAgICkgPT4ge1xuICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCk7XG4gICAgICBlbGxpcHNlLnNldE1hbnVhbGx5KGNlbnRlciwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uLCBtaW5vclJhZGl1cywgY2VudGVyUG9pbnRQcm9wLCByYWRpdXNQb2ludFByb3AsIGVsbGlwc2VQcm9wKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TGFiZWxzUmVuZGVyRm4gPSAoY2FsbGJhY2s6ICh1cGRhdGU6IEJhc2ljRWRpdFVwZGF0ZTxhbnk+LCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXG4gICAgICB9IGFzIEVsbGlwc2VFZGl0VXBkYXRlKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnVwZGF0ZUxhYmVscyA9IChsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcbiAgICAgIH0gYXMgRWxsaXBzZUVkaXRVcGRhdGUpO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZmluaXNoQ3JlYXRpb24gPSAoKSA9PiB7XG4gICAgICBpZiAoIWZpbmlzaENyZWF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxsaXBzZXMgZWRpdG9yIGVycm9yIGVkaXQoKTogY2Fubm90IGNhbGwgZmluaXNoQ3JlYXRpb24oKSBvbiBlZGl0Jyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5pc2hDcmVhdGlvbihudWxsKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldEVkaXRWYWx1ZSA9ICgpID0+IG9ic2VydmFibGVUb0V4dGVuZC5nZXRWYWx1ZSgpO1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldExhYmVscyA9ICgpOiBMYWJlbFByb3BzW10gPT4gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KGlkKS5sYWJlbHM7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldENlbnRlciA9ICgpOiBDYXJ0ZXNpYW4zID0+IHRoaXMuZ2V0Q2VudGVyUG9zaXRpb24oaWQpO1xuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRNYWpvclJhZGl1cyA9ICgpOiBudW1iZXIgPT4gdGhpcy5nZXRNYWpvclJhZGl1cyhpZCk7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmdldE1pbm9yUmFkaXVzID0gKCk6IG51bWJlciA9PiB0aGlzLmdldE1pbm9yUmFkaXVzKGlkKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlVG9FeHRlbmQgYXMgRWxsaXBzZUVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbnMob3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zKTogRWxsaXBzZUVkaXRPcHRpb25zIHtcbiAgICBjb25zdCBkZWZhdWx0Q2xvbmUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KERFRkFVTFRfRUxMSVBTRV9PUFRJT05TKSk7XG4gICAgY29uc3QgZWxsaXBzZU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgZWxsaXBzZU9wdGlvbnMucG9pbnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLnBvaW50UHJvcHMsIG9wdGlvbnMucG9pbnRQcm9wcyk7XG4gICAgZWxsaXBzZU9wdGlvbnMuZWxsaXBzZVByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9FTExJUFNFX09QVElPTlMuZWxsaXBzZVByb3BzLCBvcHRpb25zLmVsbGlwc2VQcm9wcyk7XG4gICAgZWxsaXBzZU9wdGlvbnMucG9seWxpbmVQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfRUxMSVBTRV9PUFRJT05TLnBvbHlsaW5lUHJvcHMsIG9wdGlvbnMucG9seWxpbmVQcm9wcyk7XG4gICAgcmV0dXJuIGVsbGlwc2VPcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZW50ZXJQb3NpdGlvbihpZDogc3RyaW5nKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENlbnRlclBvaW50KGlkOiBzdHJpbmcpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpLmNlbnRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWFqb3JSYWRpdXMoaWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWlub3JSYWRpdXMoaWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldChpZCkuZ2V0TWlub3JSYWRpdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RWxsaXBzZVByb3BlcnRpZXMoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQoaWQpO1xuICAgIHJldHVybiB7XG4gICAgICBjZW50ZXI6IGVsbGlwc2UuZ2V0Q2VudGVyKCksXG4gICAgICByb3RhdGlvbjogZWxsaXBzZS5nZXRSb3RhdGlvbigpLFxuICAgICAgbWlub3JSYWRpdXM6IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXMoKSxcbiAgICAgIG1ham9yUmFkaXVzOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzKCksXG4gICAgICBtaW5vclJhZGl1c1BvaW50UG9zaXRpb246IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXNQb2ludFBvc2l0aW9uKCksXG4gICAgICBtYWpvclJhZGl1c1BvaW50UG9zaXRpb246IGVsbGlwc2UuZ2V0TWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uKCksXG4gICAgfTtcbiAgfVxufVxuIl19
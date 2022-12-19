import { publish, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../../../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../../../../angular-cesium/services/map-events-mananger/consts/pickOptions.enum';
import { EditModes } from '../../../models/edit-mode.enum';
import { EditActions } from '../../../models/edit-actions.enum';
import { EditPoint } from '../../../models/edit-point';
import { generateKey } from '../../utils';
import * as i0 from "@angular/core";
export const DEFAULT_POINT_OPTIONS = {
    addLastPointEvent: CesiumEvent.LEFT_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 10,
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable point
 *
 *  * You must provide `PointsEditorService` yourself.
 * PolygonsEditorService works together with `<points-editor>` component. Therefor you need to create `<points-editor>`
 * for each `PointsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PointEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PointEditorObservable`.
 * + To stop editing call `dsipose()` from the `PointEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PointEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating point
 *  const editing$ = pointEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit point from existing point cartesian3 positions
 *  const editing$ = this.pointEditor.edit(initialPos);
 *
 * ```
 */
export class PointsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, pointManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.pointManager = pointManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    screenToPosition(cartesian2) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (cartesian3) {
            const ray = this.cameraService.getCamera().getPickRay(cartesian2);
            return this.cesiumScene.globe.pick(ray, this.cesiumScene);
        }
        return cartesian3;
    }
    create(options = DEFAULT_POINT_OPTIONS, eventPriority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, true);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: pointOptions.addLastPointEvent,
            modifier: pointOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    position,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            position: position,
            editMode: EditModes.CREATE_OR_EDIT,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next({
            ...update,
            position: position,
            point: this.getPoint(id),
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
        this.editPoint(id, position, eventPriority, clientEditSubject, pointOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(position, options = DEFAULT_POINT_OPTIONS, priority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            position: position,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        };
        this.updateSubject.next(update);
        editSubject.next({
            ...update,
            position: position,
            point: this.getPoint(id),
        });
        return this.editPoint(id, position, priority, editSubject, pointOptions);
    }
    editPoint(id, position, priority, editSubject, options, editObservable) {
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
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const updatedPosition = this.screenToPosition(endPosition);
            if (!updatedPosition) {
                return;
            }
            const update = {
                id,
                editMode: EditModes.EDIT,
                updatedPosition,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next({
                ...update,
                position: updatedPosition,
                point: this.getPoint(id),
            });
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POINT_OPTIONS));
        const pointOptions = Object.assign(defaultClone, options);
        pointOptions.pointProps = { ...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps };
        pointOptions.pointProps = { ...DEFAULT_POINT_OPTIONS.pointProps, ...options.pointProps };
        return pointOptions;
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
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (point, pointProps) => {
            const newPoint = this.pointManager.get(id);
            newPoint.setManually(point, pointProps);
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
                throw new Error('Points editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoint = () => this.getPoint(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.pointManager.get(id).labels;
        return observableToExtend;
    }
    getPosition(id) {
        const point = this.pointManager.get(id);
        return point.getPosition();
    }
    getPoint(id) {
        const point = this.pointManager.get(id);
        if (point) {
            return point.getCurrentPoint();
        }
    }
}
PointsEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PointsEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PointsEditorService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLWVkaXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvaW50cy1lZGl0b3IvcG9pbnRzLWVkaXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0ZBQWtGLENBQUM7QUFDL0csT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlGQUFpRixDQUFDO0FBQzlHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBS3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBTTFDLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFxQjtJQUNyRCxpQkFBaUIsRUFBRSxXQUFXLENBQUMsVUFBVTtJQUN6QyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsV0FBVztJQUN6QyxjQUFjLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDM0MsU0FBUyxFQUFFLElBQUk7SUFDZixVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUN6QyxZQUFZLEVBQUUsTUFBTSxDQUFD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TUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQ3JGO1lBRUQsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBRUYsa0JBQWtCLENBQUMsZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0Qsa0JBQWtCLENBQUMsWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRFLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxHQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRXBGLE9BQU8sa0JBQTJDLENBQUM7SUFDckQsQ0FBQztJQUVPLFdBQVcsQ0FBQyxFQUFVO1FBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTyxRQUFRLENBQUMsRUFBVTtRQUN6QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQzs7aUhBclVVLG1CQUFtQjtxSEFBbkIsbUJBQW1COzRGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWJsaXNoLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9pbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3BvaW50cy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bSc7XG5pbXBvcnQgeyBQb2ludEVkaXRPcHRpb25zLCBQb2ludFByb3BzIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludEVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9pbnQtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgUG9pbnRFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvaW50LWVkaXRvci1vYnNlcnZhYmxlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUE9JTlRfT1BUSU9OUzogUG9pbnRFZGl0T3B0aW9ucyA9IHtcbiAgYWRkTGFzdFBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gIHJlbW92ZVBvaW50RXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLFxuICBkcmFnUG9pbnRFdmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS19EUkFHLFxuICBhbGxvd0RyYWc6IHRydWUsXG4gIHBvaW50UHJvcHM6IHtcbiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLndpdGhBbHBoYSgwLjk1KSxcbiAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTEFDSy53aXRoQWxwaGEoMC41KSxcbiAgICBvdXRsaW5lV2lkdGg6IDEsXG4gICAgcGl4ZWxTaXplOiAxMCxcbiAgICBzaG93OiB0cnVlLFxuICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBjcmVhdGluZyBlZGl0YWJsZSBwb2ludFxuICpcbiAqICAqIFlvdSBtdXN0IHByb3ZpZGUgYFBvaW50c0VkaXRvclNlcnZpY2VgIHlvdXJzZWxmLlxuICogUG9seWdvbnNFZGl0b3JTZXJ2aWNlIHdvcmtzIHRvZ2V0aGVyIHdpdGggYDxwb2ludHMtZWRpdG9yPmAgY29tcG9uZW50LiBUaGVyZWZvciB5b3UgbmVlZCB0byBjcmVhdGUgYDxwb2ludHMtZWRpdG9yPmBcbiAqIGZvciBlYWNoIGBQb2ludHNFZGl0b3JTZXJ2aWNlYCwgQW5kIG9mIGNvdXJzZSBzb21ld2hlcmUgdW5kZXIgYDxhYy1tYXA+YC9cbiAqXG4gKiArIGBjcmVhdGVgIGZvciBzdGFydGluZyBhIGNyZWF0aW9uIG9mIHRoZSBzaGFwZSBvdmVyIHRoZSBtYXAuIFJldHVybnMgYSBleHRlbnNpb24gb2YgYFBvaW50RWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIGBlZGl0YCBmb3IgZWRpdGluZyBzaGFwZSBvdmVyIHRoZSBtYXAgc3RhcnRpbmcgZnJvbSBhIGdpdmVuIHBvc2l0aW9ucy4gUmV0dXJucyBhbiBleHRlbnNpb24gb2YgYFBvaW50RWRpdG9yT2JzZXJ2YWJsZWAuXG4gKiArIFRvIHN0b3AgZWRpdGluZyBjYWxsIGBkc2lwb3NlKClgIGZyb20gdGhlIGBQb2ludEVkaXRvck9ic2VydmFibGVgIHlvdSBnZXQgYmFjayBmcm9tIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAuXG4gKlxuICogKipMYWJlbHMgb3ZlciBlZGl0dGVkIHNoYXBlcyoqXG4gKiBBbmd1bGFyIENlc2l1bSBhbGxvd3MgeW91IHRvIGRyYXcgbGFiZWxzIG92ZXIgYSBzaGFwZSB0aGF0IGlzIGJlaW5nIGVkaXRlZCB3aXRoIG9uZSBvZiB0aGUgZWRpdG9ycy5cbiAqIFRvIGFkZCBsYWJlbCBkcmF3aW5nIGxvZ2ljIHRvIHlvdXIgZWRpdG9yIHVzZSB0aGUgZnVuY3Rpb24gYHNldExhYmVsc1JlbmRlckZuKClgIHRoYXQgaXMgZGVmaW5lZCBvbiB0aGVcbiAqIGBQb2ludEVkaXRvck9ic2VydmFibGVgIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBjYWxsaW5nIGBjcmVhdGUoKWAgXFwgYGVkaXQoKWAgb2Ygb25lIG9mIHRoZSBlZGl0b3Igc2VydmljZXMuXG4gKiBgc2V0TGFiZWxzUmVuZGVyRm4oKWAgLSByZWNlaXZlcyBhIGNhbGxiYWNrIHRoYXQgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHNoYXBlIGlzIHJlZHJhd25cbiAqIChleGNlcHQgd2hlbiB0aGUgc2hhcGUgaXMgYmVpbmcgZHJhZ2dlZCkuIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbGFzdCBzaGFwZSBzdGF0ZSBhbmQgd2l0aCBhbiBhcnJheSBvZiB0aGUgY3VycmVudCBsYWJlbHMuXG4gKiBUaGUgY2FsbGJhY2sgc2hvdWxkIHJldHVybiB0eXBlIGBMYWJlbFByb3BzW11gLlxuICogWW91IGNhbiBhbHNvIHVzZSBgdXBkYXRlTGFiZWxzKClgIHRvIHBhc3MgYW4gYXJyYXkgb2YgbGFiZWxzIG9mIHR5cGUgYExhYmVsUHJvcHNbXWAgdG8gYmUgZHJhd24uXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgLy8gU3RhcnQgY3JlYXRpbmcgcG9pbnRcbiAqICBjb25zdCBlZGl0aW5nJCA9IHBvaW50RWRpdG9yU2VydmljZS5jcmVhdGUoKTtcbiAqICB0aGlzLmVkaXRpbmckLnN1YnNjcmliZShlZGl0UmVzdWx0ID0+IHtcbiAqXHRcdFx0XHRjb25zb2xlLmxvZyhlZGl0UmVzdWx0LnBvc2l0aW9ucyk7XG4gKlx0XHR9KTtcbiAqXG4gKiAgLy8gT3IgZWRpdCBwb2ludCBmcm9tIGV4aXN0aW5nIHBvaW50IGNhcnRlc2lhbjMgcG9zaXRpb25zXG4gKiAgY29uc3QgZWRpdGluZyQgPSB0aGlzLnBvaW50RWRpdG9yLmVkaXQoaW5pdGlhbFBvcyk7XG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2ludHNFZGl0b3JTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSB1cGRhdGVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8UG9pbnRFZGl0VXBkYXRlPigpO1xuICBwcml2YXRlIHVwZGF0ZVB1Ymxpc2hlciA9IHB1Ymxpc2g8UG9pbnRFZGl0VXBkYXRlPigpKHRoaXMudXBkYXRlU3ViamVjdCk7IC8vIFRPRE8gbWF5YmUgbm90IG5lZWRlZFxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBwb2ludE1hbmFnZXI6IFBvaW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT5bXT4oKTtcbiAgcHJpdmF0ZSBjZXNpdW1TY2VuZTtcblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICAgICBwb2ludE1hbmFnZXI6IFBvaW50c01hbmFnZXJTZXJ2aWNlLFxuICAgICAgIGNlc2l1bVZpZXdlcjogQ2VzaXVtU2VydmljZSkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMucG9pbnRNYW5hZ2VyID0gcG9pbnRNYW5hZ2VyO1xuICAgIHRoaXMudXBkYXRlUHVibGlzaGVyLmNvbm5lY3QoKTtcblxuICAgIHRoaXMuY2VzaXVtU2NlbmUgPSBjZXNpdW1WaWV3ZXIuZ2V0U2NlbmUoKTtcbiAgfVxuXG4gIG9uVXBkYXRlKCk6IE9ic2VydmFibGU8UG9pbnRFZGl0VXBkYXRlPiB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlUHVibGlzaGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JlZW5Ub1Bvc2l0aW9uKGNhcnRlc2lhbjIpIHtcbiAgICBjb25zdCBjYXJ0ZXNpYW4zID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhjYXJ0ZXNpYW4yKTtcblxuICAgIC8vIElmIGNhcnRlc2lhbjMgaXMgdW5kZWZpbmVkIHRoZW4gdGhlIHBvaW50IGluc3Qgb24gdGhlIGdsb2JlXG4gICAgaWYgKGNhcnRlc2lhbjMpIHtcbiAgICAgIGNvbnN0IHJheSA9IHRoaXMuY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKS5nZXRQaWNrUmF5KGNhcnRlc2lhbjIpO1xuICAgICAgcmV0dXJuIHRoaXMuY2VzaXVtU2NlbmUuZ2xvYmUucGljayhyYXksIHRoaXMuY2VzaXVtU2NlbmUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FydGVzaWFuMztcbiAgfVxuXG4gIGNyZWF0ZShvcHRpb25zID0gREVGQVVMVF9QT0lOVF9PUFRJT05TLCBldmVudFByaW9yaXR5ID0gMTAwKTogUG9pbnRFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlS2V5KCk7XG4gICAgY29uc3QgcG9pbnRPcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY2xpZW50RWRpdFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFBvaW50RWRpdFVwZGF0ZT4oe1xuICAgICAgaWQsXG4gICAgICBlZGl0QWN0aW9uOiBudWxsLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVcbiAgICB9KTtcbiAgICBsZXQgZmluaXNoZWRDcmVhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgIGlkLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5JTklULFxuICAgICAgcG9pbnRPcHRpb25zOiBwb2ludE9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmaW5pc2hDcmVhdGlvbiA9IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc3dpdGNoVG9FZGl0TW9kZShcbiAgICAgICAgaWQsXG4gICAgICAgIGNsaWVudEVkaXRTdWJqZWN0LFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgcG9pbnRPcHRpb25zLFxuICAgICAgICBlZGl0b3JPYnNlcnZhYmxlLFxuICAgICAgICB0cnVlXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3VzZU1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50Lk1PVVNFX01PVkUsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgICBwaWNrQ29uZmlnOiBvcHRpb25zLnBpY2tDb25maWd1cmF0aW9uLFxuICAgIH0pO1xuICAgIGNvbnN0IGFkZExhc3RQb2ludFJlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICBldmVudDogcG9pbnRPcHRpb25zLmFkZExhc3RQb2ludEV2ZW50LFxuICAgICAgbW9kaWZpZXI6IHBvaW50T3B0aW9ucy5hZGRMYXN0UG9pbnRNb2RpZmllcixcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgfSk7XG5cbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgW21vdXNlTW92ZVJlZ2lzdHJhdGlvbiwgYWRkTGFzdFBvaW50UmVnaXN0cmF0aW9uXSk7XG4gICAgY29uc3QgZWRpdG9yT2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRWRpdG9yT2JzZXJ2YWJsZShjbGllbnRFZGl0U3ViamVjdCwgaWQsIGZpbmlzaENyZWF0aW9uKTtcblxuICAgIG1vdXNlTW92ZVJlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKHsgbW92ZW1lbnQ6IHsgZW5kUG9zaXRpb24gfSB9KSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuc2NyZWVuVG9Qb3NpdGlvbihlbmRQb3NpdGlvbik7XG4gICAgICBpZiAocG9zaXRpb24pIHtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEUsXG4gICAgICAgICAgdXBkYXRlZFBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5NT1VTRV9NT1ZFLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhZGRMYXN0UG9pbnRSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uIH0gfSkgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnNjcmVlblRvUG9zaXRpb24oZW5kUG9zaXRpb24pO1xuICAgICAgZmluaXNoZWRDcmVhdGUgPSBmaW5pc2hDcmVhdGlvbihwb3NpdGlvbik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIHN3aXRjaFRvRWRpdE1vZGUoaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRFZGl0U3ViamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRQcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50T3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvck9ic2VydmFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hlZENyZWF0ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHtcbiAgICAgIGlkLFxuICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgIHVwZGF0ZWRQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVCxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBwb2ludDogdGhpcy5nZXRQb2ludChpZCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VNb2RlID0ge1xuICAgICAgaWQsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURSxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkNIQU5HRV9UT19FRElULFxuICAgIH07XG4gICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoY2hhbmdlTW9kZSk7XG4gICAgY2xpZW50RWRpdFN1YmplY3QubmV4dChjaGFuZ2VNb2RlKTtcbiAgICBpZiAodGhpcy5vYnNlcnZhYmxlc01hcC5oYXMoaWQpKSB7XG4gICAgICB0aGlzLm9ic2VydmFibGVzTWFwLmdldChpZCkuZm9yRWFjaChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLmRpc3Bvc2UoKSk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmVkaXRQb2ludChpZCwgcG9zaXRpb24sIGV2ZW50UHJpb3JpdHksIGNsaWVudEVkaXRTdWJqZWN0LCBwb2ludE9wdGlvbnMsIGVkaXRvck9ic2VydmFibGUpO1xuICAgIGZpbmlzaGVkQ3JlYXRlID0gdHJ1ZTtcbiAgICByZXR1cm4gZmluaXNoZWRDcmVhdGU7XG4gIH1cblxuICBlZGl0KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBvcHRpb25zID0gREVGQVVMVF9QT0lOVF9PUFRJT05TLCBwcmlvcml0eSA9IDEwMCk6IFBvaW50RWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZUtleSgpO1xuICAgIGNvbnN0IHBvaW50T3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBlZGl0U3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UG9pbnRFZGl0VXBkYXRlPih7XG4gICAgICBpZCxcbiAgICAgIGVkaXRBY3Rpb246IG51bGwsXG4gICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkVESVRcbiAgICB9KTtcbiAgICBjb25zdCB1cGRhdGUgPSB7XG4gICAgICBpZCxcbiAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLklOSVQsXG4gICAgICBwb2ludE9wdGlvbnM6IHBvaW50T3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHVwZGF0ZSk7XG4gICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAuLi51cGRhdGUsXG4gICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBwb2ludDogdGhpcy5nZXRQb2ludChpZCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdFBvaW50KFxuICAgICAgaWQsXG4gICAgICBwb3NpdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgZWRpdFN1YmplY3QsXG4gICAgICBwb2ludE9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGl0UG9pbnQoaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IENhcnRlc2lhbjMsXG4gICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRTdWJqZWN0OiBTdWJqZWN0PFBvaW50RWRpdFVwZGF0ZT4sXG4gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IFBvaW50RWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRPYnNlcnZhYmxlPzogUG9pbnRFZGl0b3JPYnNlcnZhYmxlKSB7XG4gICAgY29uc3QgcG9pbnREcmFnUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBvcHRpb25zLmRyYWdQb2ludEV2ZW50LFxuICAgICAgZW50aXR5VHlwZTogRWRpdFBvaW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19GSVJTVCxcbiAgICAgIHBpY2tDb25maWc6IG9wdGlvbnMucGlja0NvbmZpZ3VyYXRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXI6IGVudGl0eSA9PiBpZCA9PT0gZW50aXR5LmVkaXRlZEVudGl0eUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcG9pbnRSZW1vdmVSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IG9wdGlvbnMucmVtb3ZlUG9pbnRFdmVudCxcbiAgICAgIG1vZGlmaWVyOiBvcHRpb25zLnJlbW92ZVBvaW50TW9kaWZpZXIsXG4gICAgICBlbnRpdHlUeXBlOiBFZGl0UG9pbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNULFxuICAgICAgcGlja0NvbmZpZzogb3B0aW9ucy5waWNrQ29uZmlndXJhdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcjogZW50aXR5ID0+IGlkID09PSBlbnRpdHkuZWRpdGVkRW50aXR5SWQsXG4gICAgfSk7XG5cbiAgICBwb2ludERyYWdSZWdpc3RyYXRpb24ucGlwZShcbiAgICAgIHRhcCgoeyBtb3ZlbWVudDogeyBkcm9wIH0gfSkgPT4gdGhpcy5jYW1lcmFTZXJ2aWNlLmVuYWJsZUlucHV0cyhkcm9wKSkpXG4gICAgICAuc3Vic2NyaWJlKCh7IG1vdmVtZW50OiB7IGVuZFBvc2l0aW9uLCBkcm9wIH0sIGVudGl0aWVzIH0pID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlZFBvc2l0aW9uID0gdGhpcy5zY3JlZW5Ub1Bvc2l0aW9uKGVuZFBvc2l0aW9uKTtcbiAgICAgICAgaWYgKCF1cGRhdGVkUG9zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXBkYXRlID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgICB1cGRhdGVkUG9zaXRpb24sXG4gICAgICAgICAgZWRpdEFjdGlvbjogZHJvcCA/IEVkaXRBY3Rpb25zLkRSQUdfUE9JTlRfRklOSVNIIDogRWRpdEFjdGlvbnMuRFJBR19QT0lOVCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgZWRpdFN1YmplY3QubmV4dCh7XG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICAgIHBvc2l0aW9uOiB1cGRhdGVkUG9zaXRpb24sXG4gICAgICAgICAgcG9pbnQ6IHRoaXMuZ2V0UG9pbnQoaWQpLFxuICAgICAgICB9KTtcblxuICAgICAgfSk7XG5cbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IFtwb2ludERyYWdSZWdpc3RyYXRpb24sIHBvaW50UmVtb3ZlUmVnaXN0cmF0aW9uXTtcbiAgICB0aGlzLm9ic2VydmFibGVzTWFwLnNldChpZCwgb2JzZXJ2YWJsZXMpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVkaXRvck9ic2VydmFibGUoZWRpdFN1YmplY3QsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucyhvcHRpb25zOiBQb2ludEVkaXRPcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdENsb25lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShERUZBVUxUX1BPSU5UX09QVElPTlMpKTtcbiAgICBjb25zdCBwb2ludE9wdGlvbnM6IFBvaW50RWRpdE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRDbG9uZSwgb3B0aW9ucyk7XG4gICAgcG9pbnRPcHRpb25zLnBvaW50UHJvcHMgPSB7Li4uREVGQVVMVF9QT0lOVF9PUFRJT05TLnBvaW50UHJvcHMsIC4uLm9wdGlvbnMucG9pbnRQcm9wc307XG4gICAgcG9pbnRPcHRpb25zLnBvaW50UHJvcHMgPSB7Li4uREVGQVVMVF9QT0lOVF9PUFRJT05TLnBvaW50UHJvcHMsIC4uLm9wdGlvbnMucG9pbnRQcm9wc307XG4gICAgcmV0dXJuIHBvaW50T3B0aW9ucztcbiAgfVxuXG5cbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3JPYnNlcnZhYmxlKG9ic2VydmFibGVUb0V4dGVuZDogYW55LCBpZDogc3RyaW5nLCBmaW5pc2hDcmVhdGlvbj86IChwb3NpdGlvbjogQ2FydGVzaWFuMykgPT4gYm9vbGVhbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFBvaW50RWRpdG9yT2JzZXJ2YWJsZSB7XG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXNNYXAuZ2V0KGlkKTtcbiAgICAgIGlmIChvYnNlcnZhYmxlcykge1xuICAgICAgICBvYnNlcnZhYmxlcy5mb3JFYWNoKG9icyA9PiBvYnMuZGlzcG9zZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXNNYXAuZGVsZXRlKGlkKTtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuQ1JFQVRFX09SX0VESVQsXG4gICAgICAgIGVkaXRBY3Rpb246IEVkaXRBY3Rpb25zLkRJU1BPU0UsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmVuYWJsZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU3ViamVjdC5uZXh0KHtcbiAgICAgICAgaWQsXG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLmdldFBvc2l0aW9uKGlkKSxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5FTkFCTEUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLmRpc2FibGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBwb3NpdGlvbjogdGhpcy5nZXRQb3NpdGlvbihpZCksXG4gICAgICAgIGVkaXRNb2RlOiBFZGl0TW9kZXMuRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuRElTQUJMRSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuc2V0TWFudWFsbHkgPSAocG9pbnQ6IHtcbiAgICAgIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLFxuICAgICAgcG9pbnRQcm9wPzogUG9pbnRQcm9wc1xuICAgIH0gfCBDYXJ0ZXNpYW4zLCBwb2ludFByb3BzPzogUG9pbnRQcm9wcykgPT4ge1xuICAgICAgY29uc3QgbmV3UG9pbnQgPSB0aGlzLnBvaW50TWFuYWdlci5nZXQoaWQpO1xuICAgICAgbmV3UG9pbnQuc2V0TWFudWFsbHkocG9pbnQsIHBvaW50UHJvcHMpO1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuU0VUX01BTlVBTExZLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5zZXRMYWJlbHNSZW5kZXJGbiA9IChjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVN1YmplY3QubmV4dCh7XG4gICAgICAgIGlkLFxuICAgICAgICBlZGl0TW9kZTogRWRpdE1vZGVzLkNSRUFURV9PUl9FRElULFxuICAgICAgICBlZGl0QWN0aW9uOiBFZGl0QWN0aW9ucy5TRVRfRURJVF9MQUJFTFNfUkVOREVSX0NBTExCQUNLLFxuICAgICAgICBsYWJlbHNSZW5kZXJGbjogY2FsbGJhY2ssXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2YWJsZVRvRXh0ZW5kLnVwZGF0ZUxhYmVscyA9IChsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdWJqZWN0Lm5leHQoe1xuICAgICAgICBpZCxcbiAgICAgICAgZWRpdE1vZGU6IEVkaXRNb2Rlcy5DUkVBVEVfT1JfRURJVCxcbiAgICAgICAgZWRpdEFjdGlvbjogRWRpdEFjdGlvbnMuVVBEQVRFX0VESVRfTEFCRUxTLFxuICAgICAgICB1cGRhdGVMYWJlbHM6IGxhYmVscyxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlVG9FeHRlbmQuZmluaXNoQ3JlYXRpb24gPSAoKSA9PiB7XG4gICAgICBpZiAoIWZpbmlzaENyZWF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUG9pbnRzIGVkaXRvciBlcnJvciBlZGl0KCk6IGNhbm5vdCBjYWxsIGZpbmlzaENyZWF0aW9uKCkgb24gZWRpdCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmluaXNoQ3JlYXRpb24obnVsbCk7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRDdXJyZW50UG9pbnQgPSAoKSA9PiB0aGlzLmdldFBvaW50KGlkKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRFZGl0VmFsdWUgPSAoKSA9PiBvYnNlcnZhYmxlVG9FeHRlbmQuZ2V0VmFsdWUoKTtcblxuICAgIG9ic2VydmFibGVUb0V4dGVuZC5nZXRMYWJlbHMgPSAoKTogTGFiZWxQcm9wc1tdID0+IHRoaXMucG9pbnRNYW5hZ2VyLmdldChpZCkubGFiZWxzO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGVUb0V4dGVuZCBhcyBQb2ludEVkaXRvck9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGdldFBvc2l0aW9uKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRNYW5hZ2VyLmdldChpZCk7XG4gICAgcmV0dXJuIHBvaW50LmdldFBvc2l0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIGdldFBvaW50KGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRNYW5hZ2VyLmdldChpZCk7XG4gICAgaWYgKHBvaW50KSB7XG4gICAgICByZXR1cm4gcG9pbnQuZ2V0Q3VycmVudFBvaW50KCk7XG4gICAgfVxuICB9XG59XG4iXX0=
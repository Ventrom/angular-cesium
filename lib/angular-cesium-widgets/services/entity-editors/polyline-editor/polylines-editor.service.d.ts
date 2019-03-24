import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolylinesManagerService } from './polylines-manager.service';
import { PolylineEditOptions } from '../../../models/polyline-edit-options';
import { PolylineEditUpdate } from '../../../models/polyline-edit-update';
import { PolylineEditorObservable } from '../../../models/polyline-editor-observable';
export declare const DEFAULT_POLYLINE_OPTIONS: PolylineEditOptions;
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
export declare class PolylinesEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private polylinesManager;
    private observablesMap;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, polylinesManager: PolylinesManagerService): void;
    onUpdate(): Observable<PolylineEditUpdate>;
    create(options?: PolylineEditOptions, eventPriority?: number): PolylineEditorObservable;
    private switchToEditMode;
    edit(positions: Cartesian3[], options?: PolylineEditOptions, priority?: number): PolylineEditorObservable;
    private editPolyline;
    private setOptions;
    private createEditorObservable;
    private getPositions;
    private getPoints;
}

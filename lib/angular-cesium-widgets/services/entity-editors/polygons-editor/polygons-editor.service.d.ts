import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { PolygonEditUpdate } from '../../../models/polygon-edit-update';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonsManagerService } from './polygons-manager.service';
import { PolygonEditorObservable } from '../../../models/polygon-editor-observable';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
export declare const DEFAULT_POLYGON_OPTIONS: PolygonEditOptions;
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
export declare class PolygonsEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private polygonsManager;
    private observablesMap;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, polygonsManager: PolygonsManagerService): void;
    onUpdate(): Observable<PolygonEditUpdate>;
    create(options?: PolygonEditOptions, priority?: number): PolygonEditorObservable;
    private switchToEditMode;
    edit(positions: Cartesian3[], options?: PolygonEditOptions, priority?: number): PolygonEditorObservable;
    private editPolygon;
    private setOptions;
    private createEditorObservable;
    private getPositions;
    private getPoints;
}

import { OnDestroy } from '@angular/core';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';
import { HippodromeEditorService } from '../../services/entity-editors/hippodrome-editor/hippodrome-editor.service';
import { HippodromeEditUpdate } from '../../models/hippodrome-edit-update';
import { LabelProps } from '../../models/label-props';
import { EditableHippodrome } from '../../models/editable-hippodrome';
import * as i0 from "@angular/core";
export declare class HippodromeEditorComponent implements OnDestroy {
    private hippodromesEditor;
    private coordinateConverter;
    private mapEventsManager;
    private cameraService;
    private hippodromesManager;
    private editLabelsRenderFn;
    Cesium: any;
    editPoints$: Subject<AcNotification>;
    editHippodromes$: Subject<AcNotification>;
    private editPointsLayer;
    private editHippodromesLayer;
    constructor(hippodromesEditor: HippodromeEditorService, coordinateConverter: CoordinateConverter, mapEventsManager: MapEventsManagerService, cameraService: CameraService, hippodromesManager: HippodromeManagerService);
    private startListeningToEditorUpdates;
    getLabelId(element: any, index: number): string;
    renderEditLabels(hippodrome: EditableHippodrome, update: HippodromeEditUpdate, labels?: LabelProps[]): void;
    removeEditLabels(hippodrome: EditableHippodrome): void;
    handleCreateUpdates(update: HippodromeEditUpdate): void;
    handleEditUpdates(update: HippodromeEditUpdate): void;
    ngOnDestroy(): void;
    getPointSize(point: EditPoint): number;
    getPointShow(point: EditPoint): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<HippodromeEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HippodromeEditorComponent, "hippodrome-editor", never, {}, {}, never, never, false>;
}

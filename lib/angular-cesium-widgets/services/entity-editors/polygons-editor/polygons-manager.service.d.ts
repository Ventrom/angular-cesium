import { EditablePolygon } from '../../../models/editable-polygon';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
export declare class PolygonsManagerService {
    polygons: Map<string, EditablePolygon>;
    createEditablePolygon(id: string, editPolygonsLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, editPolylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, polygonOptions?: PolygonEditOptions, positions?: Cartesian3[]): void;
    dispose(id: string): void;
    get(id: string): EditablePolygon;
    clear(): void;
}

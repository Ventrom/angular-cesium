import { CoordinateConverter } from './../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { AcLayerComponent } from './../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { EditablePolyline } from '../../../models/editable-polyline';
export declare class PolylinesManagerService {
    polylines: Map<string, EditablePolyline>;
    createEditablePolyline(id: string, editPolylinesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, polylineOptions?: PolygonEditOptions, positions?: Cartesian3[]): void;
    get(id: string): EditablePolyline;
    clear(): void;
}

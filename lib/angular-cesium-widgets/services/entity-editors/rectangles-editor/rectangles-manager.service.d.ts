import { EditableRectangle } from '../../../models/editable-rectangle';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { RectangleEditOptions } from '../../../models/rectangle-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
export declare class RectanglesManagerService {
    rectangles: Map<string, EditableRectangle>;
    createEditableRectangle(id: string, editRectanglesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, rectangleOptions?: RectangleEditOptions, positions?: Cartesian3[]): void;
    dispose(id: string): void;
    get(id: string): EditableRectangle;
    clear(): void;
}

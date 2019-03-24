import { EditableEllipse } from '../../../models/editable-ellipse';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { EllipseEditOptions } from '../../../models/ellipse-edit-options';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
export declare class EllipsesManagerService {
    private ellipses;
    createEditableEllipse(id: string, editEllipsesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, ellipseOptions: EllipseEditOptions): EditableEllipse;
    dispose(id: string): void;
    get(id: string): EditableEllipse;
    clear(): void;
}

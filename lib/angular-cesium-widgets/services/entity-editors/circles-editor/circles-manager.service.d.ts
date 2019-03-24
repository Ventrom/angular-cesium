import { EditableCircle } from '../../../models/editable-circle';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CircleEditOptions } from '../../../models/circle-edit-options';
export declare class CirclesManagerService {
    private circles;
    createEditableCircle(id: string, editCirclesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent, editArcsLayer: AcLayerComponent, circleOptions: CircleEditOptions): EditableCircle;
    dispose(id: string): void;
    get(id: string): EditableCircle;
    clear(): void;
}

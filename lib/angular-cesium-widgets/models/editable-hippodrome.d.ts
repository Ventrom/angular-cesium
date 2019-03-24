import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './polyline-edit-options';
import { HippodromeEditOptions, HippodromeProps } from './hippodrome-edit-options';
import { LabelProps } from './label-props';
export declare class EditableHippodrome extends AcEntity {
    private id;
    private pointsLayer;
    private hippodromeLayer;
    private coordinateConverter;
    private positions;
    private movingPoint;
    private done;
    private _enableEdit;
    private _defaultPointProps;
    private _hippodromeProps;
    private lastDraggedToPosition;
    private _labels;
    constructor(id: string, pointsLayer: AcLayerComponent, hippodromeLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, editOptions: HippodromeEditOptions, positions?: Cartesian3[]);
    labels: LabelProps[];
    hippodromeProps: HippodromeProps;
    defaultPointProps: PointProps;
    enableEdit: boolean;
    private createFromExisting;
    setPointsManually(points: EditPoint[], widthMeters?: number): void;
    addPointFromExisting(position: Cartesian3): void;
    addPoint(position: Cartesian3): void;
    private createHeightEditPoints;
    private createMiddleEditablePoint;
    movePoint(toPosition: Cartesian3, editPoint: EditPoint): void;
    private changeWidthByNewPoint;
    moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3): void;
    endMoveShape(): void;
    endMovePoint(): void;
    moveTempMovingPoint(toPosition: Cartesian3): void;
    removePoint(pointToRemove: EditPoint): void;
    addLastPoint(position: Cartesian3): void;
    getRealPositions(): Cartesian3[];
    getRealPositionsCallbackProperty(): any;
    getRealPoints(): EditPoint[];
    getWidth(): number;
    getPositions(): Cartesian3[];
    private removePosition;
    private updatePointsLayer;
    private updateHippdromeLayer;
    dispose(): void;
    getPointsCount(): number;
    getId(): string;
}

import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PointProps } from './point-edit-options';
import { PolylineEditOptions, PolylineProps } from './polyline-edit-options';
import { LabelProps } from './label-props';
export declare class EditablePolyline extends AcEntity {
    private id;
    private pointsLayer;
    private polylinesLayer;
    private coordinateConverter;
    private scene;
    private editOptions;
    private positions;
    private polylines;
    private movingPoint;
    private doneCreation;
    private _enableEdit;
    private _pointProps;
    private polylineProps;
    private lastDraggedToPosition;
    private _labels;
    private _outlineInstance;
    constructor(id: string, pointsLayer: AcLayerComponent, polylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, scene: any, editOptions: PolylineEditOptions, positions?: Cartesian3[]);
    get labels(): LabelProps[];
    set labels(labels: LabelProps[]);
    get props(): PolylineProps;
    set props(value: PolylineProps);
    get pointProps(): PointProps;
    set pointProps(value: PointProps);
    get enableEdit(): boolean;
    set enableEdit(value: boolean);
    private createFromExisting;
    setManually(points: {
        position: Cartesian3;
        pointProp?: PointProps;
    }[] | Cartesian3[], polylineProps?: PolylineProps): void;
    private addAllVirtualEditPoints;
    private setMiddleVirtualPoint;
    private updateMiddleVirtualPoint;
    changeVirtualPointToRealPoint(point: EditPoint): void;
    private renderPolylines;
    addPointFromExisting(position: Cartesian3): void;
    addPoint(position: Cartesian3): void;
    movePointFinish(editPoint: EditPoint): void;
    movePoint(toPosition: Cartesian3, editPoint: EditPoint): void;
    moveTempMovingPoint(toPosition: Cartesian3): void;
    moveShape(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3): void;
    endMoveShape(): void;
    removePoint(pointToRemove: EditPoint): void;
    addLastPoint(position: Cartesian3): void;
    getRealPositions(): Cartesian3[];
    getRealPoints(): EditPoint[];
    getPoints(): EditPoint[];
    getPositions(): Cartesian3[];
    getPositionsCallbackProperty(): Cartesian3[];
    private removePosition;
    private updatePointsLayer;
    update(): void;
    dispose(): void;
    getPointsCount(): number;
    getId(): string;
}

import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PolygonEditOptions, PolygonProps } from './polygon-edit-options';
import { PointProps, PolylineProps } from './polyline-edit-options';
import { LabelProps } from './label-props';
export declare class EditablePolygon extends AcEntity {
    private id;
    private polygonsLayer;
    private pointsLayer;
    private polylinesLayer;
    private coordinateConverter;
    private positions;
    private polylines;
    private movingPoint;
    private doneCreation;
    private _enableEdit;
    private _polygonProps;
    private _defaultPointProps;
    private _defaultPolylineProps;
    private lastDraggedToPosition;
    private _labels;
    constructor(id: string, polygonsLayer: AcLayerComponent, pointsLayer: AcLayerComponent, polylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter, polygonOptions: PolygonEditOptions, positions?: Cartesian3[]);
    labels: LabelProps[];
    defaultPolylineProps: PolylineProps;
    defaultPointProps: PointProps;
    polygonProps: PolygonProps;
    enableEdit: boolean;
    private createFromExisting;
    setPointsManually(points: {
        position: Cartesian3;
        pointProps: PointProps;
    }[] | Cartesian3[], polygonProps?: PolygonProps): void;
    private addAllVirtualEditPoints;
    private setMiddleVirtualPoint;
    private updateMiddleVirtualPoint;
    changeVirtualPointToRealPoint(point: EditPoint): void;
    private renderPolylines;
    addPointFromExisting(position: Cartesian3): void;
    addPoint(position: Cartesian3): void;
    movePoint(toPosition: Cartesian3, editPoint: EditPoint): void;
    moveTempMovingPoint(toPosition: Cartesian3): void;
    movePolygon(startMovingPosition: Cartesian3, draggedToPosition: Cartesian3): void;
    endMovePolygon(): void;
    removePoint(pointToRemove: EditPoint): void;
    addLastPoint(position: Cartesian3): void;
    getRealPositions(): Cartesian3[];
    getRealPoints(): EditPoint[];
    getPositionsHierarchy(): Cartesian3[];
    getPositionsHierarchyCallbackProperty(): Cartesian3[];
    private removePosition;
    private updatePolygonsLayer;
    private updatePointsLayer;
    dispose(): void;
    getPointsCount(): number;
    getId(): string;
}

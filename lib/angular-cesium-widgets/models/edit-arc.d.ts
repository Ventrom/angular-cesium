import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { PolylineProps } from './polyline-edit-options';
export declare class EditArc extends AcEntity {
    private _arcProps;
    static counter: number;
    private id;
    private editedEntityId;
    private _center;
    private _radius;
    private _delta;
    private _angle;
    constructor(entityId: string, center: Cartesian3, radius: number, delta: number, angle: number, _arcProps: PolylineProps);
    props: PolylineProps;
    angle: number;
    delta: number;
    radius: number;
    center: Cartesian3;
    updateCenter(center: Cartesian3): void;
    getId(): string;
    private generateId;
}

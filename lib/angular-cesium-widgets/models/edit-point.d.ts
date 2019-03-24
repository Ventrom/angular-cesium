import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { PointProps } from './polyline-edit-options';
export declare class EditPoint extends AcEntity {
    static counter: number;
    private id;
    private editedEntityId;
    private position;
    private _virtualEditPoint;
    private pointProps;
    private _show;
    constructor(entityId: string, position: Cartesian3, pointProps?: PointProps, virtualPoint?: boolean);
    show: boolean;
    props: PointProps;
    isVirtualEditPoint(): boolean;
    setVirtualEditPoint(value: boolean): void;
    getEditedEntityId(): string;
    getPosition(): Cartesian3;
    setPosition(position: Cartesian3): void;
    getId(): string;
    private generateId;
}

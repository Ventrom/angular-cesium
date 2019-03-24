import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { Cartesian2 } from '../../angular-cesium/models/cartesian2';
export interface LabelStyle {
    show?: boolean;
    font?: string;
    style?: any;
    fillColor?: any;
    outlineColor?: any;
    backgroundColor?: any;
    backgroundPadding?: any;
    showBackground?: boolean;
    scale?: number;
    distanceDisplayCondition?: any;
    heightReference?: any;
    horizontalOrigin?: any;
    eyeOffset?: Cartesian3;
    position?: Cartesian3;
    pixelOffset?: Cartesian2;
    pixelOffsetScaleByDistance?: any;
    outlineWidth?: any;
    scaleByDistance?: any;
    translucencyByDistance?: any;
    verticalOrigin?: any;
}
export interface LabelProps {
    text: string;
    show?: boolean;
    font?: string;
    style?: any;
    fillColor?: any;
    outlineColor?: any;
    backgroundColor?: any;
    backgroundPadding?: any;
    showBackground?: boolean;
    scale?: number;
    distanceDisplayCondition?: any;
    heightReference?: any;
    horizontalOrigin?: any;
    eyeOffset?: Cartesian3;
    position?: Cartesian3;
    pixelOffset?: Cartesian2;
    pixelOffsetScaleByDistance?: any;
    outlineWidth?: any;
    scaleByDistance?: any;
    translucencyByDistance?: any;
    verticalOrigin?: any;
}
export declare const defaultLabelProps: LabelProps;

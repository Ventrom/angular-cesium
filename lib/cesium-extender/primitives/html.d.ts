import { HtmlCollection } from '../collections';
import { Cartesian2 } from '../../angular-cesium/models/cartesian2';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
export declare class HtmlPrimitive {
    private _scene;
    private _show;
    private _position;
    private _lastPosition;
    private _pixelOffset;
    private _element;
    private _collection;
    private _mapContainer;
    constructor(options: any, collection?: HtmlCollection);
    scene: any;
    show: boolean;
    position: Cartesian3;
    pixelOffset: Cartesian2;
    element: HTMLElement;
    collection: HtmlCollection;
    update(): void;
}

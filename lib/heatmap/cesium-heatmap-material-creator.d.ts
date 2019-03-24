import { Cartesian3 } from '../angular-cesium/models/cartesian3';
export interface Rectangle {
    west: number;
    south: number;
    east: number;
    north: number;
}
/**
 *  x: lon
 *  y: lat
 *  value: point value
 */
export interface HeatPointDataPoint {
    x: number;
    y: number;
    value: number;
}
/**
 *   min:  the minimum allowed value for the data values
 *  max:  the maximum allowed value for the data values
 *  heatPointsData: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value)
 */
export interface HeatmapDataSet {
    min?: number;
    max?: number;
    heatPointsData: HeatPointDataPoint[];
}
/**
 * a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
 */
export interface HeatMapOptions {
    [propName: string]: any;
    gradient?: any;
    radius?: number;
    opacity?: number;
    maxOpacity?: number;
    minOpacity?: number;
    blur?: any;
}
/**
 * Create heatmap material (Cesium.ImageMaterialProperty with heatmap as the image)
 * works with http://www.patrick-wied.at/static/heatmapjs. must do npm -i heatmap.js
 * usage:
 * ```
 *
 const mCreator = new CesiumHeatMapMaterialCreator();
 const containingRect = CesiumHeatMapMaterialCreator.calcCircleContainingRect(this.circleCenter, this.circleRadius);
 const userHeatmapOptions = {
            radius : 2000,
            minOpacity : 0,
            maxOpacity : 0.9,
        } as any;

 this.circleHeatMapMaterial = mCreator.create(containingRect, {
            heatPointsData : [
                {
                    x : -100.0,
                    y : 24.0,
                    value : 95
                }
            ],
            min : 0,
            max : 100,
        }, userHeatmapOptions);
 * ```
 *
 * inspired by https://github.com/danwild/CesiumHeatmap
 */
export declare class CesiumHeatMapMaterialCreator {
    private static containerCanvasCounter;
    heatmapOptionsDefaults: {
        minCanvasSize: number;
        maxCanvasSize: number;
        radiusFactor: number;
        spacingFactor: number;
        maxOpacity: number;
        minOpacity: number;
        blur: number;
        gradient: {
            '.3': string;
            '.65': string;
            '.8': string;
            '.95': string;
        };
    };
    WMP: any;
    _spacing: number;
    width: number;
    height: number;
    _mbounds: any;
    bounds: any;
    _factor: number;
    _rectangle: Rectangle;
    heatmap: any;
    _xoffset: any;
    _yoffset: any;
    /**
     *
     * @param center - Cartesian3
     * @param radius - Meters
     */
    static calcCircleContainingRect(center: Cartesian3, radius: number): any;
    /**
     *
     * @param center - Cartesian3
     * @param semiMinorAxis - meters
     * @param semiMajorAxis - meters
     */
    static calcEllipseContainingRect(center: Cartesian3, semiMajorAxis: number, semiMinorAxis: number): any;
    /**
     *
     * @param points Cartesian3
     */
    static calculateContainingRectFromPoints(points: Cartesian3[]): any;
    /**  Set an array of heatmap locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in heatmap coordinates and values like {x, y, value}
     */
    setData(min: any, max: any, data: any): boolean;
    /**  Set an array of WGS84 locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
     */
    private setWGS84Data;
    /**  Convert a mercator location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x: lon, y:lat}
     */
    private mercatorPointToHeatmapPoint;
    /**  Convert a WGS84 location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x:lon, y:lat}
     */
    private wgs84PointToHeatmapPoint;
    private createContainer;
    /**  Convert a WGS84 location into a mercator location
     *
     *  p: the WGS84 location like {x: lon, y: lat}
     */
    private wgs84ToMercator;
    private rad2deg;
    /**  Convert a WGS84 bounding box into a mercator bounding box*
     *  bb: the WGS84 bounding box like {north, east, south, west}
     */
    private wgs84ToMercatorBB;
    /**  Convert a mercator bounding box into a WGS84 bounding box
     *
     *  bb: the mercator bounding box like {north, east, south, west}
     */
    private mercatorToWgs84BB;
    private setWidthAndHeight;
    /**
     * containingBoundingRect: Cesium.Rectangle like {north, east, south, west}
     * min:  the minimum allowed value for the data values
     * max:  the maximum allowed value for the data values
     * datapoint: {x,y,value}
     * heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
     *
     */
    create(containingBoundingRect: Rectangle, heatmapDataSet: HeatmapDataSet, heatmapOptions: HeatMapOptions): any;
    private setClear;
}

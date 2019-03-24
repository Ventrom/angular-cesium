import { CesiumService } from '../cesium/cesium.service';
import * as geodesy from 'geodesy';
import { hemisphere } from 'geodesy';
import { Cartesian3 } from '../../models/cartesian3';
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * @example
 * import { Component, OnInit } from '@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * @Component({
 * 		selector:'my-component',
 * 		template:'<div>{{showCartographic}}</div>',
 * 		providers:[CoordinateConverter]
 * })
 * export class MyComponent implements OnInit {
 * 		showCartographic;
 *
 * 		constructor(private coordinateConverter:CoordinateConverter){
 * 		}
 *
 * 		ngOnInit(){
 * 			this.showCartographic = this.coordinateConverter.degreesToCartographic(5, 5, 5);
 *  }
 * }
 *
 */
export declare class CoordinateConverter {
    private cesiumService?;
    constructor(cesiumService?: CesiumService);
    screenToCartesian3(screenPos: {
        x: number;
        y: number;
    }, addMapCanvasBoundsToPos?: boolean): any;
    screenToCartographic(screenPos: {
        x: number;
        y: number;
    }, ellipsoid?: any): any;
    cartesian3ToCartographic(cartesian: Cartesian3, ellipsoid?: any): any;
    degreesToCartographic(longitude: number, latitude: number, height?: number): any;
    radiansToCartographic(longitude: number, latitude: number, height?: number): any;
    degreesToUTM(longitude: number, latitude: number): geodesy.Utm;
    UTMToDegrees(zone: number, hemisphereType: hemisphere, easting: number, northing: number): {
        longitude: number;
        latitude: number;
        height: any;
    };
    private geodesyToCesiumObject;
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    midPointToCartesian3(first: {
        latitude: number;
        longitude: number;
    }, second: {
        latitude: number;
        longitude: number;
    }): any;
    middlePointByScreen(position0: Cartesian3, position1: Cartesian3): Cartesian3;
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    bearingTo(first: {
        latitude: number;
        longitude: number;
    }, second: {
        latitude: number;
        longitude: number;
    }): number;
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    bearingToCartesian(firstCartesian3: Cartesian3, secondCartesian3: Cartesian3): number;
}

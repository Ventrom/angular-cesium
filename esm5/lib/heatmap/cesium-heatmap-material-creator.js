/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { GeoUtilsService } from '../angular-cesium/services/geo-utils/geo-utils.service';
import * as h337 from 'heatmap.js/build/heatmap.js';
import { Injectable } from '@angular/core';
// Consider moving to a different package.
if (!h337) {
    throw new Error('must install heatmap.js. please do npm -i heatmap.js ');
}
/**
 * @record
 */
export function Rectangle() { }
if (false) {
    /** @type {?} */
    Rectangle.prototype.west;
    /** @type {?} */
    Rectangle.prototype.south;
    /** @type {?} */
    Rectangle.prototype.east;
    /** @type {?} */
    Rectangle.prototype.north;
}
/**
 *  x: lon
 *  y: lat
 *  value: point value
 * @record
 */
export function HeatPointDataPoint() { }
if (false) {
    /** @type {?} */
    HeatPointDataPoint.prototype.x;
    /** @type {?} */
    HeatPointDataPoint.prototype.y;
    /** @type {?} */
    HeatPointDataPoint.prototype.value;
}
/**
 *   min:  the minimum allowed value for the data values
 *  max:  the maximum allowed value for the data values
 *  heatPointsData: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value)
 * @record
 */
export function HeatmapDataSet() { }
if (false) {
    /** @type {?|undefined} */
    HeatmapDataSet.prototype.min;
    /** @type {?|undefined} */
    HeatmapDataSet.prototype.max;
    /** @type {?} */
    HeatmapDataSet.prototype.heatPointsData;
}
/**
 * a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
 * @record
 */
export function HeatMapOptions() { }
if (false) {
    /** @type {?|undefined} */
    HeatMapOptions.prototype.gradient;
    /** @type {?|undefined} */
    HeatMapOptions.prototype.radius;
    /** @type {?|undefined} */
    HeatMapOptions.prototype.opacity;
    /** @type {?|undefined} */
    HeatMapOptions.prototype.maxOpacity;
    /** @type {?|undefined} */
    HeatMapOptions.prototype.minOpacity;
    /** @type {?|undefined} */
    HeatMapOptions.prototype.blur;
    /* Skipping unhandled member: [propName: string]: any;*/
}
/**
 * Create heatmap material (Cesium.ImageMaterialProperty with heatmap as the image)
 * works with http://www.patrick-wied.at/static/heatmapjs. must do npm -i heatmap.js
 * usage:
 * ```
 *
 * const mCreator = new CesiumHeatMapMaterialCreator();
 * const containingRect = CesiumHeatMapMaterialCreator.calcCircleContainingRect(this.circleCenter, this.circleRadius);
 * const userHeatmapOptions = {
 * radius : 2000,
 * minOpacity : 0,
 * maxOpacity : 0.9,
 * } as any;
 * this.circleHeatMapMaterial = mCreator.create(containingRect, {
 * heatPointsData : [
 * {
 * x : -100.0,
 * y : 24.0,
 * value : 95
 * }
 * ],
 * min : 0,
 * max : 100,
 * }, userHeatmapOptions);
 * ```
 *
 * inspired by https://github.com/danwild/CesiumHeatmap
 */
var CesiumHeatMapMaterialCreator = /** @class */ (function () {
    function CesiumHeatMapMaterialCreator() {
        this.heatmapOptionsDefaults = {
            minCanvasSize: 700,
            // minimum size (in pixels) for the heatmap canvas
            maxCanvasSize: 2000,
            // maximum size (in pixels) for the heatmap canvas
            radiusFactor: 60,
            // data point size factor used if no radius is given
            // (the greater of height and width divided by this number yields the used radius)
            spacingFactor: 1,
            // extra space around the borders (point radius multiplied by this number yields the spacing)
            maxOpacity: 0.8,
            // the maximum opacity used if not given in the heatmap options object
            minOpacity: 0.1,
            // the minimum opacity used if not given in the heatmap options object
            blur: 0.85,
            // the blur used if not given in the heatmap options object
            gradient: {
                // the gradient used if not given in the heatmap options object
                '.3': 'blue',
                '.65': 'yellow',
                '.8': 'orange',
                '.95': 'red'
            },
        };
        this.WMP = new Cesium.WebMercatorProjection();
        /**
         * Convert a WGS84 location to the corresponding heatmap location
         *
         *  p: a WGS84 location like {x:lon, y:lat}
         */
        this.wgs84PointToHeatmapPoint = (/**
         * @param {?} p
         * @return {?}
         */
        function (p) {
            return this.mercatorPointToHeatmapPoint(this.wgs84ToMercator(p));
        });
        this.rad2deg = (/**
         * @param {?} r
         * @return {?}
         */
        function (r) {
            /** @type {?} */
            var d = r / (Math.PI / 180.0);
            return d;
        });
    }
    /**
     *
     * @param center - Cartesian3
     * @param radius - Meters
     */
    /**
     *
     * @param {?} center - Cartesian3
     * @param {?} radius - Meters
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.calcCircleContainingRect = /**
     *
     * @param {?} center - Cartesian3
     * @param {?} radius - Meters
     * @return {?}
     */
    function (center, radius) {
        return CesiumHeatMapMaterialCreator.calcEllipseContainingRect(center, radius, radius);
    };
    /**
     *
     * @param center - Cartesian3
     * @param semiMinorAxis - meters
     * @param semiMajorAxis - meters
     */
    /**
     *
     * @param {?} center - Cartesian3
     * @param {?} semiMajorAxis - meters
     * @param {?} semiMinorAxis - meters
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.calcEllipseContainingRect = /**
     *
     * @param {?} center - Cartesian3
     * @param {?} semiMajorAxis - meters
     * @param {?} semiMinorAxis - meters
     * @return {?}
     */
    function (center, semiMajorAxis, semiMinorAxis) {
        /** @type {?} */
        var top = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMinorAxis, 0, true);
        /** @type {?} */
        var right = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI / 2, true);
        /** @type {?} */
        var bottom = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI, true);
        /** @type {?} */
        var left = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI * 1.5, true);
        /** @type {?} */
        var ellipsePoints = [top, right, bottom, left];
        return Cesium.Rectangle.fromCartesianArray(ellipsePoints);
    };
    /**
     *
     * @param points Cartesian3
     */
    /**
     *
     * @param {?} points Cartesian3
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.calculateContainingRectFromPoints = /**
     *
     * @param {?} points Cartesian3
     * @return {?}
     */
    function (points) {
        return Cesium.Rectangle.fromCartesianArray(points);
    };
    /**  Set an array of heatmap locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in heatmap coordinates and values like {x, y, value}
     */
    /**
     * Set an array of heatmap locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in heatmap coordinates and values like {x, y, value}
     * @param {?} min
     * @param {?} max
     * @param {?} data
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.setData = /**
     * Set an array of heatmap locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in heatmap coordinates and values like {x, y, value}
     * @param {?} min
     * @param {?} max
     * @param {?} data
     * @return {?}
     */
    function (min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            this.heatmap.setData({
                min: min,
                max: max,
                data: data
            });
            return true;
        }
        return false;
    };
    /**  Set an array of WGS84 locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
     */
    /**
     * Set an array of WGS84 locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
     * @private
     * @param {?} min
     * @param {?} max
     * @param {?} data
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.setWGS84Data = /**
     * Set an array of WGS84 locations
     *
     *  min:  the minimum allowed value for the data values
     *  max:  the maximum allowed value for the data values
     *  data: an array of data points in WGS84 coordinates and values like { x:lon, y:lat, value }
     * @private
     * @param {?} min
     * @param {?} max
     * @param {?} data
     * @return {?}
     */
    function (min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            /** @type {?} */
            var convdata = [];
            for (var i = 0; i < data.length; i++) {
                /** @type {?} */
                var gp = data[i];
                /** @type {?} */
                var hp = this.wgs84PointToHeatmapPoint(gp);
                if (gp.value || gp.value === 0) {
                    hp.value = gp.value;
                }
                convdata.push(hp);
            }
            return this.setData(min, max, convdata);
        }
        return false;
    };
    /**  Convert a mercator location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x: lon, y:lat}
     */
    /**
     * Convert a mercator location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x: lon, y:lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.mercatorPointToHeatmapPoint = /**
     * Convert a mercator location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x: lon, y:lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    function (p) {
        /** @type {?} */
        var pn = {};
        pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
        pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
        pn.y = this.height - pn.y;
        return pn;
    };
    /**
     * @private
     * @param {?} height
     * @param {?} width
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.createContainer = /**
     * @private
     * @param {?} height
     * @param {?} width
     * @return {?}
     */
    function (height, width) {
        /** @type {?} */
        var id = 'heatmap' + CesiumHeatMapMaterialCreator.containerCanvasCounter++;
        /** @type {?} */
        var container = document.createElement('div');
        container.setAttribute('id', id);
        container.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px; margin: 0px; display: none;');
        document.body.appendChild(container);
        return { container: container, id: id };
    };
    /**  Convert a WGS84 location into a mercator location
     *
     *  p: the WGS84 location like {x: lon, y: lat}
     */
    /**
     * Convert a WGS84 location into a mercator location
     *
     *  p: the WGS84 location like {x: lon, y: lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.wgs84ToMercator = /**
     * Convert a WGS84 location into a mercator location
     *
     *  p: the WGS84 location like {x: lon, y: lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    function (p) {
        /** @type {?} */
        var mp = this.WMP.project(Cesium.Cartographic.fromDegrees(p.x, p.y));
        return {
            x: mp.x,
            y: mp.y
        };
    };
    /**  Convert a WGS84 bounding box into a mercator bounding box*
     *  bb: the WGS84 bounding box like {north, east, south, west}
     */
    /**
     * Convert a WGS84 bounding box into a mercator bounding box*
     *  bb: the WGS84 bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.wgs84ToMercatorBB = /**
     * Convert a WGS84 bounding box into a mercator bounding box*
     *  bb: the WGS84 bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    function (bb) {
        // TODO validate rad or deg
        /** @type {?} */
        var sw = this.WMP.project(Cesium.Cartographic.fromRadians(bb.west, bb.south));
        /** @type {?} */
        var ne = this.WMP.project(Cesium.Cartographic.fromRadians(bb.east, bb.north));
        return {
            north: ne.y,
            east: ne.x,
            south: sw.y,
            west: sw.x
        };
    };
    /**  Convert a mercator bounding box into a WGS84 bounding box
     *
     *  bb: the mercator bounding box like {north, east, south, west}
     */
    /**
     * Convert a mercator bounding box into a WGS84 bounding box
     *
     *  bb: the mercator bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.mercatorToWgs84BB = /**
     * Convert a mercator bounding box into a WGS84 bounding box
     *
     *  bb: the mercator bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    function (bb) {
        /** @type {?} */
        var sw = this.WMP.unproject(new Cesium.Cartesian3(bb.west, bb.south));
        /** @type {?} */
        var ne = this.WMP.unproject(new Cesium.Cartesian3(bb.east, bb.north));
        return {
            north: this.rad2deg(ne.latitude),
            east: this.rad2deg(ne.longitude),
            south: this.rad2deg(sw.latitude),
            west: this.rad2deg(sw.longitude)
        };
    };
    /**
     * @private
     * @param {?} mbb
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.setWidthAndHeight = /**
     * @private
     * @param {?} mbb
     * @return {?}
     */
    function (mbb) {
        this.width = ((mbb.east > 0 && mbb.west < 0) ? mbb.east + Math.abs(mbb.west) : Math.abs(mbb.east - mbb.west));
        this.height = ((mbb.north > 0 && mbb.south < 0) ? mbb.north + Math.abs(mbb.south) : Math.abs(mbb.north - mbb.south));
        this._factor = 1;
        if (this.width > this.height && this.width > this.heatmapOptionsDefaults.maxCanvasSize) {
            this._factor = this.width / this.heatmapOptionsDefaults.maxCanvasSize;
            if (this.height / this._factor < this.heatmapOptionsDefaults.minCanvasSize) {
                this._factor = this.height / this.heatmapOptionsDefaults.minCanvasSize;
            }
        }
        else if (this.height > this.width && this.height > this.heatmapOptionsDefaults.maxCanvasSize) {
            this._factor = this.height / this.heatmapOptionsDefaults.maxCanvasSize;
            if (this.width / this._factor < this.heatmapOptionsDefaults.minCanvasSize) {
                this._factor = this.width / this.heatmapOptionsDefaults.minCanvasSize;
            }
        }
        else if (this.width < this.height && this.width < this.heatmapOptionsDefaults.minCanvasSize) {
            this._factor = this.width / this.heatmapOptionsDefaults.minCanvasSize;
            if (this.height / this._factor > this.heatmapOptionsDefaults.maxCanvasSize) {
                this._factor = this.height / this.heatmapOptionsDefaults.maxCanvasSize;
            }
        }
        else if (this.height < this.width && this.height < this.heatmapOptionsDefaults.minCanvasSize) {
            this._factor = this.height / this.heatmapOptionsDefaults.minCanvasSize;
            if (this.width / this._factor > this.heatmapOptionsDefaults.maxCanvasSize) {
                this._factor = this.width / this.heatmapOptionsDefaults.maxCanvasSize;
            }
        }
        this.width = this.width / this._factor;
        this.height = this.height / this._factor;
    };
    /**
     * containingBoundingRect: Cesium.Rectangle like {north, east, south, west}
     * min:  the minimum allowed value for the data values
     * max:  the maximum allowed value for the data values
     * datapoint: {x,y,value}
     * heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
     *
     */
    /**
     * containingBoundingRect: Cesium.Rectangle like {north, east, south, west}
     * min:  the minimum allowed value for the data values
     * max:  the maximum allowed value for the data values
     * datapoint: {x,y,value}
     * heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
     *
     * @param {?} containingBoundingRect
     * @param {?} heatmapDataSet
     * @param {?} heatmapOptions
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.create = /**
     * containingBoundingRect: Cesium.Rectangle like {north, east, south, west}
     * min:  the minimum allowed value for the data values
     * max:  the maximum allowed value for the data values
     * datapoint: {x,y,value}
     * heatmapOptions: a heatmap.js options object (see http://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create)
     *
     * @param {?} containingBoundingRect
     * @param {?} heatmapDataSet
     * @param {?} heatmapOptions
     * @return {?}
     */
    function (containingBoundingRect, heatmapDataSet, heatmapOptions) {
        /** @type {?} */
        var userBB = containingBoundingRect;
        var heatPointsData = heatmapDataSet.heatPointsData, _a = heatmapDataSet.min, min = _a === void 0 ? 0 : _a, _b = heatmapDataSet.max, max = _b === void 0 ? 100 : _b;
        /** @type {?} */
        var finalHeatmapOptions = Object.assign({}, this.heatmapOptionsDefaults, heatmapOptions);
        this._mbounds = this.wgs84ToMercatorBB(userBB);
        this.setWidthAndHeight(this._mbounds);
        finalHeatmapOptions.radius = Math.round((heatmapOptions.radius) ?
            heatmapOptions.radius : ((this.width > this.height) ?
            this.width / this.heatmapOptionsDefaults.radiusFactor :
            this.height / this.heatmapOptionsDefaults.radiusFactor));
        this._spacing = finalHeatmapOptions.radius * this.heatmapOptionsDefaults.spacingFactor;
        this._xoffset = this._mbounds.west;
        this._yoffset = this._mbounds.south;
        this.width = Math.round(this.width + this._spacing * 2);
        this.height = Math.round(this.height + this._spacing * 2);
        this._mbounds.west -= this._spacing * this._factor;
        this._mbounds.east += this._spacing * this._factor;
        this._mbounds.south -= this._spacing * this._factor;
        this._mbounds.north += this._spacing * this._factor;
        this.bounds = this.mercatorToWgs84BB(this._mbounds);
        this._rectangle = Cesium.Rectangle.fromDegrees(this.bounds.west, this.bounds.south, this.bounds.east, this.bounds.north);
        var _c = this.createContainer(this.height, this.width), container = _c.container, id = _c.id;
        Object.assign(finalHeatmapOptions, { container: container });
        this.heatmap = h337.create(finalHeatmapOptions);
        this.setWGS84Data(0, 100, heatPointsData);
        /** @type {?} */
        var heatMapCanvas = this.heatmap._renderer.canvas;
        /** @type {?} */
        var heatMapMaterial = new Cesium.ImageMaterialProperty({
            image: heatMapCanvas,
            transparent: true,
        });
        this.setClear(heatMapMaterial, id);
        return heatMapMaterial;
    };
    /**
     * @private
     * @param {?} heatMapMaterial
     * @param {?} id
     * @return {?}
     */
    CesiumHeatMapMaterialCreator.prototype.setClear = /**
     * @private
     * @param {?} heatMapMaterial
     * @param {?} id
     * @return {?}
     */
    function (heatMapMaterial, id) {
        heatMapMaterial.clear = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var elem = document.getElementById(id);
            return elem.parentNode.removeChild(elem);
        });
    };
    CesiumHeatMapMaterialCreator.containerCanvasCounter = 0;
    CesiumHeatMapMaterialCreator.decorators = [
        { type: Injectable }
    ];
    return CesiumHeatMapMaterialCreator;
}());
export { CesiumHeatMapMaterialCreator };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CesiumHeatMapMaterialCreator.containerCanvasCounter;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.heatmapOptionsDefaults;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.WMP;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._spacing;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.width;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.height;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._mbounds;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.bounds;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._factor;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._rectangle;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype.heatmap;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._xoffset;
    /** @type {?} */
    CesiumHeatMapMaterialCreator.prototype._yoffset;
    /**
     * Convert a WGS84 location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x:lon, y:lat}
     * @type {?}
     * @private
     */
    CesiumHeatMapMaterialCreator.prototype.wgs84PointToHeatmapPoint;
    /**
     * @type {?}
     * @private
     */
    CesiumHeatMapMaterialCreator.prototype.rad2deg;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWhlYXRtYXAtbWF0ZXJpYWwtY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2hlYXRtYXAvY2VzaXVtLWhlYXRtYXAtbWF0ZXJpYWwtY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQ3pGLE9BQU8sS0FBSyxJQUFJLE1BQU0sNkJBQTZCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJM0MsSUFBSSxDQUFDLElBQUksRUFBRTtJQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztDQUMxRTs7OztBQUdELCtCQUtDOzs7SUFKQyx5QkFBYTs7SUFDYiwwQkFBYzs7SUFDZCx5QkFBYTs7SUFDYiwwQkFBYzs7Ozs7Ozs7QUFTaEIsd0NBSUM7OztJQUhDLCtCQUFVOztJQUNWLCtCQUFVOztJQUNWLG1DQUFjOzs7Ozs7OztBQVFoQixvQ0FJQzs7O0lBSEMsNkJBQWE7O0lBQ2IsNkJBQWE7O0lBQ2Isd0NBQXFDOzs7Ozs7QUFNdkMsb0NBU0M7OztJQU5DLGtDQUFlOztJQUNmLGdDQUFnQjs7SUFDaEIsaUNBQWlCOztJQUNqQixvQ0FBb0I7O0lBQ3BCLG9DQUFvQjs7SUFDcEIsOEJBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ2I7SUFBQTtRQU1FLDJCQUFzQixHQUFHO1lBQ3ZCLGFBQWEsRUFBRSxHQUFHOztZQUNsQixhQUFhLEVBQUUsSUFBSTs7WUFDbkIsWUFBWSxFQUFFLEVBQUU7OztZQUVoQixhQUFhLEVBQUUsQ0FBQzs7WUFDaEIsVUFBVSxFQUFFLEdBQUc7O1lBQ2YsVUFBVSxFQUFFLEdBQUc7O1lBQ2YsSUFBSSxFQUFFLElBQUk7O1lBQ1YsUUFBUSxFQUFFOztnQkFDUixJQUFJLEVBQUUsTUFBTTtn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O0lBQ2pCLDZDQUFjOztJQUNkLDhDQUFlOztJQUNmLGdEQUFjOztJQUNkLDhDQUFZOztJQUNaLCtDQUFnQjs7SUFDaEIsa0RBQXNCOztJQUN0QiwrQ0FBYTs7SUFDYixnREFBYzs7SUFDZCxnREFBYzs7Ozs7Ozs7SUF5SGQsZ0VBRUU7Ozs7O0lBd0JGLCtDQUdFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FydGVzaWFuMiB9IGZyb20gJy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4yJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgaDMzNyBmcm9tICdoZWF0bWFwLmpzL2J1aWxkL2hlYXRtYXAuanMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vLyBDb25zaWRlciBtb3ZpbmcgdG8gYSBkaWZmZXJlbnQgcGFja2FnZS5cblxuaWYgKCFoMzM3KSB7XG4gIHRocm93IG5ldyBFcnJvcignbXVzdCBpbnN0YWxsIGhlYXRtYXAuanMuIHBsZWFzZSBkbyBucG0gLWkgaGVhdG1hcC5qcyAnKTtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY3RhbmdsZSB7XG4gIHdlc3Q6IG51bWJlcjtcbiAgc291dGg6IG51bWJlcjtcbiAgZWFzdDogbnVtYmVyO1xuICBub3J0aDogbnVtYmVyO1xufVxuXG5cbi8qKlxuICogIHg6IGxvblxuICogIHk6IGxhdFxuICogIHZhbHVlOiBwb2ludCB2YWx1ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhlYXRQb2ludERhdGFQb2ludCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB2YWx1ZTogbnVtYmVyO1xufVxuXG4vKipcbiAqICAgbWluOiAgdGhlIG1pbmltdW0gYWxsb3dlZCB2YWx1ZSBmb3IgdGhlIGRhdGEgdmFsdWVzXG4gKiAgbWF4OiAgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBmb3IgdGhlIGRhdGEgdmFsdWVzXG4gKiAgaGVhdFBvaW50c0RhdGE6IGFuIGFycmF5IG9mIGRhdGEgcG9pbnRzIGluIFdHUzg0IGNvb3JkaW5hdGVzIGFuZCB2YWx1ZXMgbGlrZSB7IHg6bG9uLCB5OmxhdCwgdmFsdWUpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGVhdG1hcERhdGFTZXQge1xuICBtaW4/OiBudW1iZXI7XG4gIG1heD86IG51bWJlcjtcbiAgaGVhdFBvaW50c0RhdGE6IEhlYXRQb2ludERhdGFQb2ludFtdO1xufVxuXG4vKipcbiAqIGEgaGVhdG1hcC5qcyBvcHRpb25zIG9iamVjdCAoc2VlIGh0dHA6Ly93d3cucGF0cmljay13aWVkLmF0L3N0YXRpYy9oZWF0bWFwanMvZG9jcy5odG1sI2gzMzctY3JlYXRlKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhlYXRNYXBPcHRpb25zIHtcbiAgW3Byb3BOYW1lOiBzdHJpbmddOiBhbnk7XG5cbiAgZ3JhZGllbnQ/OiBhbnk7XG4gIHJhZGl1cz86IG51bWJlcjtcbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgbWF4T3BhY2l0eT86IG51bWJlcjtcbiAgbWluT3BhY2l0eT86IG51bWJlcjtcbiAgYmx1cj86IGFueTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgaGVhdG1hcCBtYXRlcmlhbCAoQ2VzaXVtLkltYWdlTWF0ZXJpYWxQcm9wZXJ0eSB3aXRoIGhlYXRtYXAgYXMgdGhlIGltYWdlKVxuICogd29ya3Mgd2l0aCBodHRwOi8vd3d3LnBhdHJpY2std2llZC5hdC9zdGF0aWMvaGVhdG1hcGpzLiBtdXN0IGRvIG5wbSAtaSBoZWF0bWFwLmpzXG4gKiB1c2FnZTpcbiAqIGBgYFxuICpcbiBjb25zdCBtQ3JlYXRvciA9IG5ldyBDZXNpdW1IZWF0TWFwTWF0ZXJpYWxDcmVhdG9yKCk7XG4gY29uc3QgY29udGFpbmluZ1JlY3QgPSBDZXNpdW1IZWF0TWFwTWF0ZXJpYWxDcmVhdG9yLmNhbGNDaXJjbGVDb250YWluaW5nUmVjdCh0aGlzLmNpcmNsZUNlbnRlciwgdGhpcy5jaXJjbGVSYWRpdXMpO1xuIGNvbnN0IHVzZXJIZWF0bWFwT3B0aW9ucyA9IHtcblx0XHRcdHJhZGl1cyA6IDIwMDAsXG5cdFx0XHRtaW5PcGFjaXR5IDogMCxcblx0XHRcdG1heE9wYWNpdHkgOiAwLjksXG5cdFx0fSBhcyBhbnk7XG5cbiB0aGlzLmNpcmNsZUhlYXRNYXBNYXRlcmlhbCA9IG1DcmVhdG9yLmNyZWF0ZShjb250YWluaW5nUmVjdCwge1xuXHRcdFx0aGVhdFBvaW50c0RhdGEgOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR4IDogLTEwMC4wLFxuXHRcdFx0XHRcdHkgOiAyNC4wLFxuXHRcdFx0XHRcdHZhbHVlIDogOTVcblx0XHRcdFx0fVxuXHRcdFx0XSxcblx0XHRcdG1pbiA6IDAsXG5cdFx0XHRtYXggOiAxMDAsXG5cdFx0fSwgdXNlckhlYXRtYXBPcHRpb25zKTtcbiAqIGBgYFxuICpcbiAqIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kYW53aWxkL0Nlc2l1bUhlYXRtYXBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bUhlYXRNYXBNYXRlcmlhbENyZWF0b3Ige1xuXG5cbiAgcHJpdmF0ZSBzdGF0aWMgY29udGFpbmVyQ2FudmFzQ291bnRlciA9IDA7XG5cbiAgaGVhdG1hcE9wdGlvbnNEZWZhdWx0cyA9IHtcbiAgICBtaW5DYW52YXNTaXplOiA3MDAsICAgICAgICAgICAvLyBtaW5pbXVtIHNpemUgKGluIHBpeGVscykgZm9yIHRoZSBoZWF0bWFwIGNhbnZhc1xuICAgIG1heENhbnZhc1NpemU6IDIwMDAsICAgICAgICAgIC8vIG1heGltdW0gc2l6ZSAoaW4gcGl4ZWxzKSBmb3IgdGhlIGhlYXRtYXAgY2FudmFzXG4gICAgcmFkaXVzRmFjdG9yOiA2MCwgICAgICAgICAgICAgLy8gZGF0YSBwb2ludCBzaXplIGZhY3RvciB1c2VkIGlmIG5vIHJhZGl1cyBpcyBnaXZlblxuICAgIC8vICh0aGUgZ3JlYXRlciBvZiBoZWlnaHQgYW5kIHdpZHRoIGRpdmlkZWQgYnkgdGhpcyBudW1iZXIgeWllbGRzIHRoZSB1c2VkIHJhZGl1cylcbiAgICBzcGFjaW5nRmFjdG9yOiAxLCAgICAgICAgICAgLy8gZXh0cmEgc3BhY2UgYXJvdW5kIHRoZSBib3JkZXJzIChwb2ludCByYWRpdXMgbXVsdGlwbGllZCBieSB0aGlzIG51bWJlciB5aWVsZHMgdGhlIHNwYWNpbmcpXG4gICAgbWF4T3BhY2l0eTogMC44LCAgICAgICAgICAgICAgLy8gdGhlIG1heGltdW0gb3BhY2l0eSB1c2VkIGlmIG5vdCBnaXZlbiBpbiB0aGUgaGVhdG1hcCBvcHRpb25zIG9iamVjdFxuICAgIG1pbk9wYWNpdHk6IDAuMSwgICAgICAgICAgICAgIC8vIHRoZSBtaW5pbXVtIG9wYWNpdHkgdXNlZCBpZiBub3QgZ2l2ZW4gaW4gdGhlIGhlYXRtYXAgb3B0aW9ucyBvYmplY3RcbiAgICBibHVyOiAwLjg1LCAgICAgICAgICAgICAgICAgICAvLyB0aGUgYmx1ciB1c2VkIGlmIG5vdCBnaXZlbiBpbiB0aGUgaGVhdG1hcCBvcHRpb25zIG9iamVjdFxuICAgIGdyYWRpZW50OiB7ICAgICAgICAgICAgICAgICAgIC8vIHRoZSBncmFkaWVudCB1c2VkIGlmIG5vdCBnaXZlbiBpbiB0aGUgaGVhdG1hcCBvcHRpb25zIG9iamVjdFxuICAgICAgJy4zJzogJ2JsdWUnLFxuICAgICAgJy42NSc6ICd5ZWxsb3cnLFxuICAgICAgJy44JzogJ29yYW5nZScsXG4gICAgICAnLjk1JzogJ3JlZCdcbiAgICB9LFxuICB9O1xuXG4gIFdNUCA9IG5ldyBDZXNpdW0uV2ViTWVyY2F0b3JQcm9qZWN0aW9uKCk7XG4gIF9zcGFjaW5nOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBfbWJvdW5kczogYW55O1xuICBib3VuZHM6IGFueTtcbiAgX2ZhY3RvcjogbnVtYmVyO1xuICBfcmVjdGFuZ2xlOiBSZWN0YW5nbGU7XG4gIGhlYXRtYXA6IGFueTtcbiAgX3hvZmZzZXQ6IGFueTtcbiAgX3lvZmZzZXQ6IGFueTtcblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGNlbnRlciAtIENhcnRlc2lhbjNcbiAgICogQHBhcmFtIHJhZGl1cyAtIE1ldGVyc1xuICAgKi9cbiAgc3RhdGljIGNhbGNDaXJjbGVDb250YWluaW5nUmVjdChjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bUhlYXRNYXBNYXRlcmlhbENyZWF0b3IuY2FsY0VsbGlwc2VDb250YWluaW5nUmVjdChjZW50ZXIsIHJhZGl1cywgcmFkaXVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gY2VudGVyIC0gQ2FydGVzaWFuM1xuICAgKiBAcGFyYW0gc2VtaU1pbm9yQXhpcyAtIG1ldGVyc1xuICAgKiBAcGFyYW0gc2VtaU1ham9yQXhpcyAtIG1ldGVyc1xuICAgKi9cbiAgc3RhdGljIGNhbGNFbGxpcHNlQ29udGFpbmluZ1JlY3QoY2VudGVyOiBDYXJ0ZXNpYW4zLCBzZW1pTWFqb3JBeGlzOiBudW1iZXIsIHNlbWlNaW5vckF4aXM6IG51bWJlcikge1xuICAgIGNvbnN0IHRvcCA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoXG4gICAgICBjZW50ZXIsXG4gICAgICBzZW1pTWlub3JBeGlzLFxuICAgICAgMCxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIGNvbnN0IHJpZ2h0ID0gR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aChcbiAgICAgIGNlbnRlcixcbiAgICAgIHNlbWlNYWpvckF4aXMsXG4gICAgICBNYXRoLlBJIC8gMixcbiAgICAgIHRydWVcbiAgICApO1xuICAgIGNvbnN0IGJvdHRvbSA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoXG4gICAgICBjZW50ZXIsXG4gICAgICBzZW1pTWFqb3JBeGlzLFxuICAgICAgTWF0aC5QSSxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIGNvbnN0IGxlZnQgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKFxuICAgICAgY2VudGVyLFxuICAgICAgc2VtaU1ham9yQXhpcyxcbiAgICAgIE1hdGguUEkgKiAxLjUsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IGVsbGlwc2VQb2ludHMgPSBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XTtcbiAgICByZXR1cm4gQ2VzaXVtLlJlY3RhbmdsZS5mcm9tQ2FydGVzaWFuQXJyYXkoZWxsaXBzZVBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHBvaW50cyBDYXJ0ZXNpYW4zXG4gICAqL1xuICBzdGF0aWMgY2FsY3VsYXRlQ29udGFpbmluZ1JlY3RGcm9tUG9pbnRzKHBvaW50czogQ2FydGVzaWFuM1tdKSB7XG4gICAgcmV0dXJuIENlc2l1bS5SZWN0YW5nbGUuZnJvbUNhcnRlc2lhbkFycmF5KHBvaW50cyk7XG4gIH1cblxuXG4gIC8qKiAgU2V0IGFuIGFycmF5IG9mIGhlYXRtYXAgbG9jYXRpb25zXG4gICAqXG4gICAqICBtaW46ICB0aGUgbWluaW11bSBhbGxvd2VkIHZhbHVlIGZvciB0aGUgZGF0YSB2YWx1ZXNcbiAgICogIG1heDogIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUgZm9yIHRoZSBkYXRhIHZhbHVlc1xuICAgKiAgZGF0YTogYW4gYXJyYXkgb2YgZGF0YSBwb2ludHMgaW4gaGVhdG1hcCBjb29yZGluYXRlcyBhbmQgdmFsdWVzIGxpa2Uge3gsIHksIHZhbHVlfVxuICAgKi9cbiAgc2V0RGF0YShtaW46IGFueSwgbWF4OiBhbnksIGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCAmJiBtaW4gIT09IG51bGwgJiYgbWluICE9PSBmYWxzZSAmJiBtYXggIT09IG51bGwgJiYgbWF4ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5oZWF0bWFwLnNldERhdGEoe1xuICAgICAgICBtaW46IG1pbixcbiAgICAgICAgbWF4OiBtYXgsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogIFNldCBhbiBhcnJheSBvZiBXR1M4NCBsb2NhdGlvbnNcbiAgICpcbiAgICogIG1pbjogIHRoZSBtaW5pbXVtIGFsbG93ZWQgdmFsdWUgZm9yIHRoZSBkYXRhIHZhbHVlc1xuICAgKiAgbWF4OiAgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBmb3IgdGhlIGRhdGEgdmFsdWVzXG4gICAqICBkYXRhOiBhbiBhcnJheSBvZiBkYXRhIHBvaW50cyBpbiBXR1M4NCBjb29yZGluYXRlcyBhbmQgdmFsdWVzIGxpa2UgeyB4OmxvbiwgeTpsYXQsIHZhbHVlIH1cbiAgICovXG4gIHByaXZhdGUgc2V0V0dTODREYXRhKG1pbjogYW55LCBtYXg6IGFueSwgZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwICYmIG1pbiAhPT0gbnVsbCAmJiBtaW4gIT09IGZhbHNlICYmIG1heCAhPT0gbnVsbCAmJiBtYXggIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBjb252ZGF0YSA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ3AgPSBkYXRhW2ldO1xuXG4gICAgICAgIGNvbnN0IGhwID0gdGhpcy53Z3M4NFBvaW50VG9IZWF0bWFwUG9pbnQoZ3ApO1xuICAgICAgICBpZiAoZ3AudmFsdWUgfHwgZ3AudmFsdWUgPT09IDApIHtcbiAgICAgICAgICBocC52YWx1ZSA9IGdwLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udmRhdGEucHVzaChocCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldERhdGEobWluLCBtYXgsIGNvbnZkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogIENvbnZlcnQgYSBtZXJjYXRvciBsb2NhdGlvbiB0byB0aGUgY29ycmVzcG9uZGluZyBoZWF0bWFwIGxvY2F0aW9uXG4gICAqXG4gICAqICBwOiBhIFdHUzg0IGxvY2F0aW9uIGxpa2Uge3g6IGxvbiwgeTpsYXR9XG4gICAqL1xuICBwcml2YXRlIG1lcmNhdG9yUG9pbnRUb0hlYXRtYXBQb2ludChwOiBDYXJ0ZXNpYW4yKSB7XG4gICAgY29uc3QgcG46IGFueSA9IHt9O1xuXG4gICAgcG4ueCA9IE1hdGgucm91bmQoKHAueCAtIHRoaXMuX3hvZmZzZXQpIC8gdGhpcy5fZmFjdG9yICsgdGhpcy5fc3BhY2luZyk7XG4gICAgcG4ueSA9IE1hdGgucm91bmQoKHAueSAtIHRoaXMuX3lvZmZzZXQpIC8gdGhpcy5fZmFjdG9yICsgdGhpcy5fc3BhY2luZyk7XG4gICAgcG4ueSA9IHRoaXMuaGVpZ2h0IC0gcG4ueTtcblxuICAgIHJldHVybiBwbjtcbiAgfVxuXG4gIC8qKiAgQ29udmVydCBhIFdHUzg0IGxvY2F0aW9uIHRvIHRoZSBjb3JyZXNwb25kaW5nIGhlYXRtYXAgbG9jYXRpb25cbiAgICpcbiAgICogIHA6IGEgV0dTODQgbG9jYXRpb24gbGlrZSB7eDpsb24sIHk6bGF0fVxuICAgKi9cbiAgcHJpdmF0ZSB3Z3M4NFBvaW50VG9IZWF0bWFwUG9pbnQgPSBmdW5jdGlvbiAocDogQ2FydGVzaWFuMikge1xuICAgIHJldHVybiB0aGlzLm1lcmNhdG9yUG9pbnRUb0hlYXRtYXBQb2ludCh0aGlzLndnczg0VG9NZXJjYXRvcihwKSk7XG4gIH07XG5cblxuICBwcml2YXRlIGNyZWF0ZUNvbnRhaW5lcihoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcikge1xuICAgIGNvbnN0IGlkID0gJ2hlYXRtYXAnICsgQ2VzaXVtSGVhdE1hcE1hdGVyaWFsQ3JlYXRvci5jb250YWluZXJDYW52YXNDb3VudGVyKys7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6ICcgKyB3aWR0aCArICdweDsgaGVpZ2h0OiAnICsgaGVpZ2h0ICsgJ3B4OyBtYXJnaW46IDBweDsgZGlzcGxheTogbm9uZTsnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgcmV0dXJuIHtjb250YWluZXIsIGlkfTtcbiAgfVxuXG4gIC8qKiAgQ29udmVydCBhIFdHUzg0IGxvY2F0aW9uIGludG8gYSBtZXJjYXRvciBsb2NhdGlvblxuICAgKlxuICAgKiAgcDogdGhlIFdHUzg0IGxvY2F0aW9uIGxpa2Uge3g6IGxvbiwgeTogbGF0fVxuICAgKi9cbiAgcHJpdmF0ZSB3Z3M4NFRvTWVyY2F0b3IocDogQ2FydGVzaWFuMikge1xuICAgIGNvbnN0IG1wID0gdGhpcy5XTVAucHJvamVjdChDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21EZWdyZWVzKHAueCwgcC55KSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1wLngsXG4gICAgICB5OiBtcC55XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmFkMmRlZyA9IGZ1bmN0aW9uIChyOiBudW1iZXIpIHtcbiAgICBjb25zdCBkID0gciAvIChNYXRoLlBJIC8gMTgwLjApO1xuICAgIHJldHVybiBkO1xuICB9O1xuXG4gIC8qKiAgQ29udmVydCBhIFdHUzg0IGJvdW5kaW5nIGJveCBpbnRvIGEgbWVyY2F0b3IgYm91bmRpbmcgYm94KlxuICAgKiAgYmI6IHRoZSBXR1M4NCBib3VuZGluZyBib3ggbGlrZSB7bm9ydGgsIGVhc3QsIHNvdXRoLCB3ZXN0fVxuICAgKi9cbiAgcHJpdmF0ZSB3Z3M4NFRvTWVyY2F0b3JCQihiYjogYW55KSB7XG4gICAgLy8gVE9ETyB2YWxpZGF0ZSByYWQgb3IgZGVnXG4gICAgY29uc3Qgc3cgPSB0aGlzLldNUC5wcm9qZWN0KENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbVJhZGlhbnMoYmIud2VzdCwgYmIuc291dGgpKTtcbiAgICBjb25zdCBuZSA9IHRoaXMuV01QLnByb2plY3QoQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tUmFkaWFucyhiYi5lYXN0LCBiYi5ub3J0aCkpO1xuICAgIHJldHVybiB7XG4gICAgICBub3J0aDogbmUueSxcbiAgICAgIGVhc3Q6IG5lLngsXG4gICAgICBzb3V0aDogc3cueSxcbiAgICAgIHdlc3Q6IHN3LnhcbiAgICB9O1xuICB9XG5cbiAgLyoqICBDb252ZXJ0IGEgbWVyY2F0b3IgYm91bmRpbmcgYm94IGludG8gYSBXR1M4NCBib3VuZGluZyBib3hcbiAgICpcbiAgICogIGJiOiB0aGUgbWVyY2F0b3IgYm91bmRpbmcgYm94IGxpa2Uge25vcnRoLCBlYXN0LCBzb3V0aCwgd2VzdH1cbiAgICovXG4gIHByaXZhdGUgbWVyY2F0b3JUb1dnczg0QkIoYmI6IGFueSkge1xuICAgIGNvbnN0IHN3ID0gdGhpcy5XTVAudW5wcm9qZWN0KG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhiYi53ZXN0LCBiYi5zb3V0aCkpO1xuICAgIGNvbnN0IG5lID0gdGhpcy5XTVAudW5wcm9qZWN0KG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhiYi5lYXN0LCBiYi5ub3J0aCkpO1xuICAgIHJldHVybiB7XG4gICAgICBub3J0aDogdGhpcy5yYWQyZGVnKG5lLmxhdGl0dWRlKSxcbiAgICAgIGVhc3Q6IHRoaXMucmFkMmRlZyhuZS5sb25naXR1ZGUpLFxuICAgICAgc291dGg6IHRoaXMucmFkMmRlZyhzdy5sYXRpdHVkZSksXG4gICAgICB3ZXN0OiB0aGlzLnJhZDJkZWcoc3cubG9uZ2l0dWRlKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNldFdpZHRoQW5kSGVpZ2h0KG1iYjogYW55KSB7XG4gICAgdGhpcy53aWR0aCA9ICgobWJiLmVhc3QgPiAwICYmIG1iYi53ZXN0IDwgMCkgPyBtYmIuZWFzdCArIE1hdGguYWJzKG1iYi53ZXN0KSA6IE1hdGguYWJzKG1iYi5lYXN0IC0gbWJiLndlc3QpKTtcbiAgICB0aGlzLmhlaWdodCA9ICgobWJiLm5vcnRoID4gMCAmJiBtYmIuc291dGggPCAwKSA/IG1iYi5ub3J0aCArIE1hdGguYWJzKG1iYi5zb3V0aCkgOiBNYXRoLmFicyhtYmIubm9ydGggLSBtYmIuc291dGgpKTtcbiAgICB0aGlzLl9mYWN0b3IgPSAxO1xuXG4gICAgaWYgKHRoaXMud2lkdGggPiB0aGlzLmhlaWdodCAmJiB0aGlzLndpZHRoID4gdGhpcy5oZWF0bWFwT3B0aW9uc0RlZmF1bHRzLm1heENhbnZhc1NpemUpIHtcbiAgICAgIHRoaXMuX2ZhY3RvciA9IHRoaXMud2lkdGggLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWF4Q2FudmFzU2l6ZTtcblxuICAgICAgaWYgKHRoaXMuaGVpZ2h0IC8gdGhpcy5fZmFjdG9yIDwgdGhpcy5oZWF0bWFwT3B0aW9uc0RlZmF1bHRzLm1pbkNhbnZhc1NpemUpIHtcbiAgICAgICAgdGhpcy5fZmFjdG9yID0gdGhpcy5oZWlnaHQgLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWluQ2FudmFzU2l6ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVpZ2h0ID4gdGhpcy53aWR0aCAmJiB0aGlzLmhlaWdodCA+IHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5tYXhDYW52YXNTaXplKSB7XG4gICAgICB0aGlzLl9mYWN0b3IgPSB0aGlzLmhlaWdodCAvIHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5tYXhDYW52YXNTaXplO1xuXG4gICAgICBpZiAodGhpcy53aWR0aCAvIHRoaXMuX2ZhY3RvciA8IHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5taW5DYW52YXNTaXplKSB7XG4gICAgICAgIHRoaXMuX2ZhY3RvciA9IHRoaXMud2lkdGggLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWluQ2FudmFzU2l6ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMud2lkdGggPCB0aGlzLmhlaWdodCAmJiB0aGlzLndpZHRoIDwgdGhpcy5oZWF0bWFwT3B0aW9uc0RlZmF1bHRzLm1pbkNhbnZhc1NpemUpIHtcbiAgICAgIHRoaXMuX2ZhY3RvciA9IHRoaXMud2lkdGggLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWluQ2FudmFzU2l6ZTtcblxuICAgICAgaWYgKHRoaXMuaGVpZ2h0IC8gdGhpcy5fZmFjdG9yID4gdGhpcy5oZWF0bWFwT3B0aW9uc0RlZmF1bHRzLm1heENhbnZhc1NpemUpIHtcbiAgICAgICAgdGhpcy5fZmFjdG9yID0gdGhpcy5oZWlnaHQgLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWF4Q2FudmFzU2l6ZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaGVpZ2h0IDwgdGhpcy53aWR0aCAmJiB0aGlzLmhlaWdodCA8IHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5taW5DYW52YXNTaXplKSB7XG4gICAgICB0aGlzLl9mYWN0b3IgPSB0aGlzLmhlaWdodCAvIHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5taW5DYW52YXNTaXplO1xuXG4gICAgICBpZiAodGhpcy53aWR0aCAvIHRoaXMuX2ZhY3RvciA+IHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5tYXhDYW52YXNTaXplKSB7XG4gICAgICAgIHRoaXMuX2ZhY3RvciA9IHRoaXMud2lkdGggLyB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMubWF4Q2FudmFzU2l6ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLndpZHRoID0gdGhpcy53aWR0aCAvIHRoaXMuX2ZhY3RvcjtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuaGVpZ2h0IC8gdGhpcy5fZmFjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnRhaW5pbmdCb3VuZGluZ1JlY3Q6IENlc2l1bS5SZWN0YW5nbGUgbGlrZSB7bm9ydGgsIGVhc3QsIHNvdXRoLCB3ZXN0fVxuICAgKiBtaW46ICB0aGUgbWluaW11bSBhbGxvd2VkIHZhbHVlIGZvciB0aGUgZGF0YSB2YWx1ZXNcbiAgICogbWF4OiAgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZSBmb3IgdGhlIGRhdGEgdmFsdWVzXG4gICAqIGRhdGFwb2ludDoge3gseSx2YWx1ZX1cbiAgICogaGVhdG1hcE9wdGlvbnM6IGEgaGVhdG1hcC5qcyBvcHRpb25zIG9iamVjdCAoc2VlIGh0dHA6Ly93d3cucGF0cmljay13aWVkLmF0L3N0YXRpYy9oZWF0bWFwanMvZG9jcy5odG1sI2gzMzctY3JlYXRlKVxuICAgKlxuICAgKi9cbiAgcHVibGljIGNyZWF0ZShjb250YWluaW5nQm91bmRpbmdSZWN0OiBSZWN0YW5nbGUsIGhlYXRtYXBEYXRhU2V0OiBIZWF0bWFwRGF0YVNldCwgaGVhdG1hcE9wdGlvbnM6IEhlYXRNYXBPcHRpb25zKSB7XG4gICAgY29uc3QgdXNlckJCID0gY29udGFpbmluZ0JvdW5kaW5nUmVjdDtcbiAgICBjb25zdCB7aGVhdFBvaW50c0RhdGEsIG1pbiA9IDAsIG1heCA9IDEwMH0gPSBoZWF0bWFwRGF0YVNldDtcbiAgICBjb25zdCBmaW5hbEhlYXRtYXBPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oZWF0bWFwT3B0aW9uc0RlZmF1bHRzLCBoZWF0bWFwT3B0aW9ucyk7XG5cbiAgICB0aGlzLl9tYm91bmRzID0gdGhpcy53Z3M4NFRvTWVyY2F0b3JCQih1c2VyQkIpO1xuICAgIHRoaXMuc2V0V2lkdGhBbmRIZWlnaHQodGhpcy5fbWJvdW5kcyk7XG5cbiAgICBmaW5hbEhlYXRtYXBPcHRpb25zLnJhZGl1cyA9IE1hdGgucm91bmQoKGhlYXRtYXBPcHRpb25zLnJhZGl1cykgP1xuICAgICAgaGVhdG1hcE9wdGlvbnMucmFkaXVzIDogKCh0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQpID9cbiAgICAgICAgdGhpcy53aWR0aCAvIHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5yYWRpdXNGYWN0b3IgOlxuICAgICAgICB0aGlzLmhlaWdodCAvIHRoaXMuaGVhdG1hcE9wdGlvbnNEZWZhdWx0cy5yYWRpdXNGYWN0b3IpKTtcbiAgICB0aGlzLl9zcGFjaW5nID0gZmluYWxIZWF0bWFwT3B0aW9ucy5yYWRpdXMgKiB0aGlzLmhlYXRtYXBPcHRpb25zRGVmYXVsdHMuc3BhY2luZ0ZhY3RvcjtcbiAgICB0aGlzLl94b2Zmc2V0ID0gdGhpcy5fbWJvdW5kcy53ZXN0O1xuICAgIHRoaXMuX3lvZmZzZXQgPSB0aGlzLl9tYm91bmRzLnNvdXRoO1xuXG4gICAgdGhpcy53aWR0aCA9IE1hdGgucm91bmQodGhpcy53aWR0aCArIHRoaXMuX3NwYWNpbmcgKiAyKTtcbiAgICB0aGlzLmhlaWdodCA9IE1hdGgucm91bmQodGhpcy5oZWlnaHQgKyB0aGlzLl9zcGFjaW5nICogMik7XG5cbiAgICB0aGlzLl9tYm91bmRzLndlc3QgLT0gdGhpcy5fc3BhY2luZyAqIHRoaXMuX2ZhY3RvcjtcbiAgICB0aGlzLl9tYm91bmRzLmVhc3QgKz0gdGhpcy5fc3BhY2luZyAqIHRoaXMuX2ZhY3RvcjtcbiAgICB0aGlzLl9tYm91bmRzLnNvdXRoIC09IHRoaXMuX3NwYWNpbmcgKiB0aGlzLl9mYWN0b3I7XG4gICAgdGhpcy5fbWJvdW5kcy5ub3J0aCArPSB0aGlzLl9zcGFjaW5nICogdGhpcy5fZmFjdG9yO1xuXG4gICAgdGhpcy5ib3VuZHMgPSB0aGlzLm1lcmNhdG9yVG9XZ3M4NEJCKHRoaXMuX21ib3VuZHMpO1xuICAgIHRoaXMuX3JlY3RhbmdsZSA9IENlc2l1bS5SZWN0YW5nbGUuZnJvbURlZ3JlZXModGhpcy5ib3VuZHMud2VzdCwgdGhpcy5ib3VuZHMuc291dGgsIHRoaXMuYm91bmRzLmVhc3QsIHRoaXMuYm91bmRzLm5vcnRoKTtcblxuICAgIGNvbnN0IHtjb250YWluZXIsIGlkfSA9IHRoaXMuY3JlYXRlQ29udGFpbmVyKHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoKTtcbiAgICBPYmplY3QuYXNzaWduKGZpbmFsSGVhdG1hcE9wdGlvbnMsIHtjb250YWluZXJ9KTtcblxuICAgIHRoaXMuaGVhdG1hcCA9IGgzMzcuY3JlYXRlKGZpbmFsSGVhdG1hcE9wdGlvbnMpO1xuXG5cbiAgICB0aGlzLnNldFdHUzg0RGF0YSgwLCAxMDAsIGhlYXRQb2ludHNEYXRhKTtcbiAgICBjb25zdCBoZWF0TWFwQ2FudmFzID0gdGhpcy5oZWF0bWFwLl9yZW5kZXJlci5jYW52YXM7XG4gICAgY29uc3QgaGVhdE1hcE1hdGVyaWFsID0gbmV3IENlc2l1bS5JbWFnZU1hdGVyaWFsUHJvcGVydHkoe1xuICAgICAgaW1hZ2U6IGhlYXRNYXBDYW52YXMsXG4gICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLnNldENsZWFyKGhlYXRNYXBNYXRlcmlhbCwgaWQpO1xuXG4gICAgcmV0dXJuIGhlYXRNYXBNYXRlcmlhbDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q2xlYXIoaGVhdE1hcE1hdGVyaWFsOiBhbnksIGlkOiBzdHJpbmcpIHtcbiAgICBoZWF0TWFwTWF0ZXJpYWwuY2xlYXIgPSAoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgcmV0dXJuIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICB9O1xuICB9XG59XG5cbiJdfQ==
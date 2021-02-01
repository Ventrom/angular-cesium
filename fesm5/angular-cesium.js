import { __assign, __decorate, __metadata, __param, __extends, __spread } from 'tslib';
import { Injectable, NgZone, Optional, InjectionToken, Inject, EventEmitter, ElementRef, Input, Component, ChangeDetectionStrategy, Directive, Output, forwardRef, Pipe, NgModule, Renderer2, ChangeDetectorRef, TemplateRef, ViewContainerRef, ViewChild, ContentChild, ComponentFactoryResolver, ContentChildren, HostListener } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as geodesy from 'geodesy';
import { LatLonVectors as LatLonVectors$1, LatLonEllipsoidal, Utm } from 'geodesy';
import { isNumber } from 'util';
import { publish, mergeMap, delay, takeUntil, filter, map, switchMap, tap, merge as merge$1 } from 'rxjs/operators';
import { Observable, of, Subject, merge, from, BehaviorSubject, fromEvent } from 'rxjs';
import { EllipsePrimitive } from 'primitive-primitives';
import { JsonStringMapper } from 'json-string-mapper';
import { Parse, PIPES_CONFIG, Angular2ParseModule } from 'angular2parse';
import * as _get from 'lodash.get';

var ViewerFactory = /** @class */ (function () {
    function ViewerFactory() {
        this.cesium = Cesium;
    }
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    ViewerFactory.prototype.createViewer = function (mapContainer, options) {
        var viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, __assign({ contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                } }, options));
        }
        else {
            viewer = new this.cesium.Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
            });
        }
        return viewer;
    };
    ViewerFactory = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ViewerFactory);
    return ViewerFactory;
}());

/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
var ViewerConfiguration = /** @class */ (function () {
    function ViewerConfiguration() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    Object.defineProperty(ViewerConfiguration.prototype, "viewerOptions", {
        get: function () {
            return this._viewerOptions;
        },
        /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: function (value) {
            this._viewerOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    ViewerConfiguration.prototype.getNextViewerOptions = function () {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    };
    Object.defineProperty(ViewerConfiguration.prototype, "viewerModifier", {
        get: function () {
            return this._viewerModifier;
        },
        /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: function (value) {
            this._viewerModifier = value;
        },
        enumerable: true,
        configurable: true
    });
    ViewerConfiguration.prototype.getNextViewerModifier = function () {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    };
    ViewerConfiguration = __decorate([
        Injectable()
    ], ViewerConfiguration);
    return ViewerConfiguration;
}());

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
var CesiumService = /** @class */ (function () {
    function CesiumService(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    CesiumService.prototype.init = function (mapContainer, map) {
        var _this = this;
        this.map = map;
        this.ngZone.runOutsideAngular(function () {
            var options = _this.viewerConfiguration ? _this.viewerConfiguration.getNextViewerOptions() : undefined;
            _this.cesiumViewer = _this.viewerFactory.createViewer(mapContainer, options);
            var viewerModifier = _this.viewerConfiguration && _this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(_this.cesiumViewer);
            }
        });
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    CesiumService.prototype.getViewer = function () {
        return this.cesiumViewer;
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    CesiumService.prototype.getScene = function () {
        return this.cesiumViewer.scene;
    };
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    CesiumService.prototype.getCanvas = function () {
        return this.cesiumViewer.canvas;
    };
    CesiumService.prototype.getMap = function () {
        return this.map;
    };
    CesiumService.ctorParameters = function () { return [
        { type: NgZone },
        { type: ViewerFactory },
        { type: ViewerConfiguration, decorators: [{ type: Optional }] }
    ]; };
    CesiumService = __decorate([
        Injectable(),
        __param(2, Optional()),
        __metadata("design:paramtypes", [NgZone, ViewerFactory, ViewerConfiguration])
    ], CesiumService);
    return CesiumService;
}());

/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
// tslint:disable
var AssociativeArray = Cesium.AssociativeArray;
var Color = Cesium.Color;
var ColorGeometryInstanceAttribute = Cesium.ColorGeometryInstanceAttribute;
var defined = Cesium.defined;
var DistanceDisplayCondition = Cesium.DistanceDisplayCondition;
var DistanceDisplayConditionGeometryInstanceAttribute = Cesium.DistanceDisplayConditionGeometryInstanceAttribute;
var ShowGeometryInstanceAttribute = Cesium.ShowGeometryInstanceAttribute;
var Primitive = Cesium.Primitive;
var ShadowMode = Cesium.ShadowMode;
var BoundingSphereState = Cesium.BoundingSphereState;
var ColorMaterialProperty = Cesium.ColorMaterialProperty;
var MaterialProperty = Cesium.MaterialProperty;
var Property = Cesium.Property;
var colorScratch = new Color();
var distanceDisplayConditionScratch = new DistanceDisplayCondition();
var defaultDistanceDisplayCondition = new DistanceDisplayCondition();
function Batch(primitives, translucent, appearanceType, depthFailAppearanceType, depthFailMaterialProperty, closed, shadows) {
    this.translucent = translucent;
    this.appearanceType = appearanceType;
    this.depthFailAppearanceType = depthFailAppearanceType;
    this.depthFailMaterialProperty = depthFailMaterialProperty;
    this.depthFailMaterial = undefined;
    this.closed = closed;
    this.shadows = shadows;
    this.primitives = primitives;
    this.createPrimitive = false;
    this.waitingOnCreate = false;
    this.primitive = undefined;
    this.oldPrimitive = undefined;
    this.geometry = new AssociativeArray();
    this.updaters = new AssociativeArray();
    this.updatersWithAttributes = new AssociativeArray();
    this.attributes = new AssociativeArray();
    this.subscriptions = new AssociativeArray();
    this.showsUpdated = new AssociativeArray();
    this.itemsToRemove = [];
    this.invalidated = false;
    var removeMaterialSubscription;
    if (defined(depthFailMaterialProperty)) {
        removeMaterialSubscription = depthFailMaterialProperty.definitionChanged.addEventListener(Batch.prototype.onMaterialChanged, this);
    }
    this.removeMaterialSubscription = removeMaterialSubscription;
}
Batch.prototype.onMaterialChanged = function () {
    this.invalidated = true;
};
Batch.prototype.isMaterial = function (updater) {
    var material = this.depthFailMaterialProperty;
    var updaterMaterial = updater.depthFailMaterialProperty;
    if (updaterMaterial === material) {
        return true;
    }
    if (defined(material)) {
        return material.equals(updaterMaterial);
    }
    return false;
};
Batch.prototype.add = function (updater, instance) {
    var id = updater.id;
    this.createPrimitive = true;
    this.geometry.set(id, instance);
    this.updaters.set(id, updater);
    if (!updater.hasConstantFill || !updater.fillMaterialProperty.isConstant || !Property.isConstant(updater.distanceDisplayConditionProperty)) {
        this.updatersWithAttributes.set(id, updater);
    }
    else {
        var that = this;
        this.subscriptions.set(id, updater.entity.definitionChanged.addEventListener(function (entity, propertyName, newValue, oldValue) {
            if (propertyName === 'isShowing') {
                that.showsUpdated.set(updater.id, updater);
            }
        }));
    }
};
Batch.prototype.remove = function (updater) {
    var id = updater.id;
    this.createPrimitive = this.geometry.remove(id) || this.createPrimitive;
    if (this.updaters.remove(id)) {
        this.updatersWithAttributes.remove(id);
        var unsubscribe = this.subscriptions.get(id);
        if (defined(unsubscribe)) {
            unsubscribe();
            this.subscriptions.remove(id);
        }
    }
};
Batch.prototype.update = function (time) {
    var isUpdated = true;
    var removedCount = 0;
    var primitive = this.primitive;
    var primitives = this.primitives;
    var attributes;
    var i;
    if (this.createPrimitive) {
        var geometries = this.geometry.values;
        var geometriesLength = geometries.length;
        if (geometriesLength > 0) {
            if (defined(primitive)) {
                if (!defined(this.oldPrimitive)) {
                    this.oldPrimitive = primitive;
                }
                else {
                    primitives.remove(primitive);
                }
            }
            for (i = 0; i < geometriesLength; i++) {
                var geometryItem = geometries[i];
                var originalAttributes = geometryItem.attributes;
                attributes = this.attributes.get(geometryItem.id.id);
                if (defined(attributes)) {
                    if (defined(originalAttributes.show)) {
                        originalAttributes.show.value = attributes.show;
                    }
                    if (defined(originalAttributes.color)) {
                        originalAttributes.color.value = attributes.color;
                    }
                    if (defined(originalAttributes.depthFailColor)) {
                        originalAttributes.depthFailColor.value = attributes.depthFailColor;
                    }
                }
            }
            var depthFailAppearance;
            if (defined(this.depthFailAppearanceType)) {
                if (defined(this.depthFailMaterialProperty)) {
                    this.depthFailMaterial = MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
                }
                depthFailAppearance = new this.depthFailAppearanceType({
                    material: this.depthFailMaterial,
                    translucent: this.translucent,
                    closed: this.closed
                });
            }
            primitive = new Primitive({
                show: false,
                asynchronous: true,
                geometryInstances: geometries,
                appearance: new this.appearanceType({
                    flat: this.shadows === ShadowMode.DISABLED || this.shadows === ShadowMode.CAST_ONLY,
                    translucent: this.translucent,
                    closed: this.closed
                }),
                depthFailAppearance: depthFailAppearance,
                shadows: this.shadows
            });
            primitives.add(primitive);
            isUpdated = false;
        }
        else {
            if (defined(primitive)) {
                primitives.remove(primitive);
                primitive = undefined;
            }
            var oldPrimitive = this.oldPrimitive;
            if (defined(oldPrimitive)) {
                primitives.remove(oldPrimitive);
                this.oldPrimitive = undefined;
            }
        }
        this.attributes.removeAll();
        this.primitive = primitive;
        this.createPrimitive = false;
        this.waitingOnCreate = true;
    }
    else if (defined(primitive) && primitive.ready) {
        primitive.show = true;
        if (defined(this.oldPrimitive)) {
            primitives.remove(this.oldPrimitive);
            this.oldPrimitive = undefined;
        }
        if (defined(this.depthFailAppearanceType) && !(this.depthFailMaterialProperty instanceof ColorMaterialProperty)) {
            this.depthFailMaterial = MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
            this.primitive.depthFailAppearance.material = this.depthFailMaterial;
        }
        var updatersWithAttributes = this.updatersWithAttributes.values;
        var length = updatersWithAttributes.length;
        var waitingOnCreate = this.waitingOnCreate;
        for (i = 0; i < length; i++) {
            var updater = updatersWithAttributes[i];
            var instance = this.geometry.get(updater.id);
            attributes = this.attributes.get(instance.id.id);
            if (!defined(attributes)) {
                attributes = primitive.getGeometryInstanceAttributes(instance.id);
                this.attributes.set(instance.id.id, attributes);
            }
            if (!updater.fillMaterialProperty.isConstant || waitingOnCreate) {
                var colorProperty = updater.fillMaterialProperty.color;
                var resultColor = Property.getValueOrDefault(colorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastColor, resultColor)) {
                    attributes._lastColor = Color.clone(resultColor, attributes._lastColor);
                    attributes.color = ColorGeometryInstanceAttribute.toValue(resultColor, attributes.color);
                    if ((this.translucent && attributes.color[3] === 255) || (!this.translucent && attributes.color[3] !== 255)) {
                        this.itemsToRemove[removedCount++] = updater;
                    }
                }
            }
            if (defined(this.depthFailAppearanceType) && updater.depthFailMaterialProperty instanceof ColorMaterialProperty && (!updater.depthFailMaterialProperty.isConstant || waitingOnCreate)) {
                var depthFailColorProperty = updater.depthFailMaterialProperty.color;
                var depthColor = Property.getValueOrDefault(depthFailColorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastDepthFailColor, depthColor)) {
                    attributes._lastDepthFailColor = Color.clone(depthColor, attributes._lastDepthFailColor);
                    attributes.depthFailColor = ColorGeometryInstanceAttribute.toValue(depthColor, attributes.depthFailColor);
                }
            }
            var show = updater.entity.isShowing && (updater.hasConstantFill || updater.isFilled(time));
            var currentShow = attributes.show[0] === 1;
            if (show !== currentShow) {
                attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
            }
            var distanceDisplayConditionProperty = updater.distanceDisplayConditionProperty;
            if (!Property.isConstant(distanceDisplayConditionProperty)) {
                var distanceDisplayCondition = Property.getValueOrDefault(distanceDisplayConditionProperty, time, defaultDistanceDisplayCondition, distanceDisplayConditionScratch);
                if (!DistanceDisplayCondition.equals(distanceDisplayCondition, attributes._lastDistanceDisplayCondition)) {
                    attributes._lastDistanceDisplayCondition = DistanceDisplayCondition.clone(distanceDisplayCondition, attributes._lastDistanceDisplayCondition);
                    attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.toValue(distanceDisplayCondition, attributes.distanceDisplayCondition);
                }
            }
        }
        this.updateShows(primitive);
        this.waitingOnCreate = false;
    }
    else if (defined(primitive) && !primitive.ready) {
        isUpdated = false;
    }
    this.itemsToRemove.length = removedCount;
    return isUpdated;
};
Batch.prototype.updateShows = function (primitive) {
    var showsUpdated = this.showsUpdated.values;
    var length = showsUpdated.length;
    for (var i = 0; i < length; i++) {
        var updater = showsUpdated[i];
        var instance = this.geometry.get(updater.id);
        var attributes = this.attributes.get(instance.id.id);
        if (!defined(attributes)) {
            attributes = primitive.getGeometryInstanceAttributes(instance.id);
            this.attributes.set(instance.id.id, attributes);
        }
        var show = updater.entity.isShowing;
        var currentShow = attributes.show[0] === 1;
        if (show !== currentShow) {
            attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
        }
    }
    this.showsUpdated.removeAll();
};
Batch.prototype.contains = function (updater) {
    return this.updaters.contains(updater.id);
};
Batch.prototype.getBoundingSphere = function (updater, result) {
    var primitive = this.primitive;
    if (!primitive.ready) {
        return BoundingSphereState.PENDING;
    }
    var attributes = primitive.getGeometryInstanceAttributes(updater.entity);
    if (!defined(attributes) || !defined(attributes.boundingSphere) || //
        (defined(attributes.show) && attributes.show[0] === 0)) {
        return BoundingSphereState.FAILED;
    }
    attributes.boundingSphere.clone(result);
    return BoundingSphereState.DONE;
};
Batch.prototype.removeAllPrimitives = function () {
    var primitives = this.primitives;
    var primitive = this.primitive;
    if (defined(primitive)) {
        primitives.remove(primitive);
        this.primitive = undefined;
        this.geometry.removeAll();
        this.updaters.removeAll();
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
        this.oldPrimitive = undefined;
    }
};
Batch.prototype.destroy = function () {
    var primitive = this.primitive;
    var primitives = this.primitives;
    if (defined(primitive)) {
        primitives.remove(primitive);
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
    }
    if (defined(this.removeMaterialSubscription)) {
        this.removeMaterialSubscription();
    }
};
var wasFixed = false;
function fixCesiumEntitiesShadows() {
    if (wasFixed) {
        return;
    }
    Cesium.StaticGeometryColorBatch.prototype.add = function (time, updater) {
        var items;
        var translucent;
        var instance = updater.createFillGeometryInstance(time);
        if (instance.attributes.color.value[3] === 255) {
            items = this._solidItems;
            translucent = false;
        }
        else {
            items = this._translucentItems;
            translucent = true;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var item = items[i];
            if (item.isMaterial(updater)) {
                item.add(updater, instance);
                return;
            }
        }
        var batch = new Batch(this._primitives, translucent, this._appearanceType, this._depthFailAppearanceType, updater.depthFailMaterialProperty, this._closed, this._shadows);
        batch.add(updater, instance);
        items.push(batch);
    };
    wasFixed = true;
}

var ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(config) {
        this.config = config;
        var fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
    ConfigurationService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
    ]; };
    ConfigurationService = __decorate([
        Injectable(),
        __param(0, Optional()), __param(0, Inject(ANGULAR_CESIUM_CONFIG)),
        __metadata("design:paramtypes", [Object])
    ], ConfigurationService);
    return ConfigurationService;
}());

/**
 * Cesium scene modes
 */
var SceneMode;
(function (SceneMode) {
    SceneMode[SceneMode["SCENE3D"] = 0] = "SCENE3D";
    SceneMode[SceneMode["COLUMBUS_VIEW"] = 1] = "COLUMBUS_VIEW";
    SceneMode[SceneMode["SCENE2D"] = 2] = "SCENE2D";
    SceneMode[SceneMode["PERFORMANCE_SCENE2D"] = 3] = "PERFORMANCE_SCENE2D";
})(SceneMode || (SceneMode = {}));

/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
var CameraService = /** @class */ (function () {
    function CameraService() {
        this.isSceneModePerformance2D = false;
    }
    CameraService_1 = CameraService;
    CameraService.prototype.init = function (cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    };
    CameraService.prototype._listenToSceneModeMorph = function (callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    };
    CameraService.prototype._revertCameraProperties = function () {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    };
    /**
     * Gets the scene's camera
     */
    CameraService.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Gets the scene's screenSpaceCameraController
     */
    CameraService.prototype.getScreenSpaceCameraController = function () {
        return this.screenSpaceCameraController;
    };
    /**
     * Gets the minimum zoom value in meters
     */
    CameraService.prototype.getMinimumZoom = function () {
        return this.screenSpaceCameraController.minimumZoomDistance;
    };
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    CameraService.prototype.setMinimumZoom = function (amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    };
    /**
     * Gets the maximum zoom value in meters
     */
    CameraService.prototype.getMaximumZoom = function () {
        return this.screenSpaceCameraController.maximumZoomDistance;
    };
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    CameraService.prototype.setMaximumZoom = function (amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    };
    /**
     * Sets if the camera is able to tilt
     */
    CameraService.prototype.enableTilt = function (tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    };
    /**
     * Sets if the camera is able to rotate
     */
    CameraService.prototype.enableRotate = function (rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    };
    /**
     * Sets if the camera is able to free-look
     */
    CameraService.prototype.enableLook = function (lock) {
        this.screenSpaceCameraController.enableLook = lock;
    };
    /**
     * Sets if the camera is able to translate
     */
    CameraService.prototype.enableTranslate = function (translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    };
    /**
     * Sets if the camera is able to zoom
     */
    CameraService.prototype.enableZoom = function (zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    };
    /**
     * Sets if the camera receives inputs
     */
    CameraService.prototype.enableInputs = function (inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    };
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    CameraService.prototype.setSceneMode = function (sceneMode, duration) {
        var _this = this;
        switch (sceneMode) {
            case SceneMode.SCENE3D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo3D(duration);
                break;
            }
            case SceneMode.COLUMBUS_VIEW: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphToColumbusView(duration);
                break;
            }
            case SceneMode.SCENE2D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo2D(duration);
                break;
            }
            case SceneMode.PERFORMANCE_SCENE2D: {
                this.isSceneModePerformance2D = true;
                this.lastLook = this.screenSpaceCameraController.enableLook;
                this.lastTilt = this.screenSpaceCameraController.enableTilt;
                this.lastRotate = this.screenSpaceCameraController.enableRotate;
                this.screenSpaceCameraController.enableTilt = false;
                this.screenSpaceCameraController.enableRotate = false;
                this.screenSpaceCameraController.enableLook = false;
                if (this.morphListenerCancelFn) {
                    this.morphListenerCancelFn();
                }
                this.scene.morphToColumbusView(duration);
                var morphCompleteEventListener_1 = this.scene.morphComplete.addEventListener(function () {
                    _this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService_1.PERFORMANCE_2D_ALTITUDE, _this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener_1();
                    _this._listenToSceneModeMorph(_this._revertCameraProperties.bind(_this));
                });
                break;
            }
        }
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    CameraService.prototype.cameraFlyTo = function (options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    };
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    CameraService.prototype.flyTo = function (target, options) {
        return this.viewer.flyTo(target, options);
    };
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    CameraService.prototype.zoomIn = function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    CameraService.prototype.zoomOut = function (amount) {
        return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    CameraService.prototype.zoomTo = function (target, offset) {
        return this.viewer.zoomTo(target, offset);
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    CameraService.prototype.setView = function (options) {
        this.camera.setView(options);
    };
    /**
     * Set camera's rotation
     */
    CameraService.prototype.setRotation = function (degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    };
    /**
     * Locks or unlocks camera rotation
     */
    CameraService.prototype.lockRotation = function (lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    };
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    CameraService.prototype.trackEntity = function (cesiumEntity, options) {
        var _this = this;
        var flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise(function (resolve) {
            if (flyTo) {
                var flyToDuration = (options && options.flyToDuration) || 1;
                var altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                var entPosCar3 = cesiumEntity.position.getValue(Cesium.JulianDate.now());
                var entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                var zoomAmount_1 = altitude - entPosCart.height;
                entPosCart.height = altitude;
                var flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                _this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: function () {
                        _this.viewer.trackedEntity = cesiumEntity;
                        setTimeout(function () {
                            if (zoomAmount_1 > 0) {
                                _this.camera.zoomOut(zoomAmount_1);
                            }
                            else {
                                _this.camera.zoomIn(zoomAmount_1);
                            }
                        }, 0);
                        resolve();
                    }
                });
            }
            else {
                _this.viewer.trackedEntity = cesiumEntity;
                resolve();
            }
        });
    };
    CameraService.prototype.untrackEntity = function () {
        this.trackEntity();
    };
    var CameraService_1;
    CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
    CameraService = CameraService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CameraService);
    return CameraService;
}());

/**
 * Event options for registration on map-event-manager.
 */
var CesiumEvent;
(function (CesiumEvent) {
    CesiumEvent[CesiumEvent["MOUSE_MOVE"] = Cesium.ScreenSpaceEventType.MOUSE_MOVE] = "MOUSE_MOVE";
    CesiumEvent[CesiumEvent["LEFT_CLICK"] = Cesium.ScreenSpaceEventType.LEFT_CLICK] = "LEFT_CLICK";
    CesiumEvent[CesiumEvent["LEFT_DOUBLE_CLICK"] = Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK] = "LEFT_DOUBLE_CLICK";
    CesiumEvent[CesiumEvent["LEFT_DOWN"] = Cesium.ScreenSpaceEventType.LEFT_DOWN] = "LEFT_DOWN";
    CesiumEvent[CesiumEvent["LEFT_UP"] = Cesium.ScreenSpaceEventType.LEFT_UP] = "LEFT_UP";
    CesiumEvent[CesiumEvent["MIDDLE_CLICK"] = Cesium.ScreenSpaceEventType.MIDDLE_CLICK] = "MIDDLE_CLICK";
    CesiumEvent[CesiumEvent["MIDDLE_DOUBLE_CLICK"] = Cesium.ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK] = "MIDDLE_DOUBLE_CLICK";
    CesiumEvent[CesiumEvent["MIDDLE_DOWN"] = Cesium.ScreenSpaceEventType.MIDDLE_DOWN] = "MIDDLE_DOWN";
    CesiumEvent[CesiumEvent["MIDDLE_UP"] = Cesium.ScreenSpaceEventType.MIDDLE_UP] = "MIDDLE_UP";
    CesiumEvent[CesiumEvent["PINCH_START"] = Cesium.ScreenSpaceEventType.PINCH_START] = "PINCH_START";
    CesiumEvent[CesiumEvent["PINCH_END"] = Cesium.ScreenSpaceEventType.PINCH_END] = "PINCH_END";
    CesiumEvent[CesiumEvent["PINCH_MOVE"] = Cesium.ScreenSpaceEventType.PINCH_MOVE] = "PINCH_MOVE";
    CesiumEvent[CesiumEvent["RIGHT_CLICK"] = Cesium.ScreenSpaceEventType.RIGHT_CLICK] = "RIGHT_CLICK";
    CesiumEvent[CesiumEvent["RIGHT_DOUBLE_CLICK"] = Cesium.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK] = "RIGHT_DOUBLE_CLICK";
    CesiumEvent[CesiumEvent["RIGHT_DOWN"] = Cesium.ScreenSpaceEventType.RIGHT_DOWN] = "RIGHT_DOWN";
    CesiumEvent[CesiumEvent["RIGHT_UP"] = Cesium.ScreenSpaceEventType.RIGHT_UP] = "RIGHT_UP";
    CesiumEvent[CesiumEvent["WHEEL"] = Cesium.ScreenSpaceEventType.WHEEL] = "WHEEL";
    CesiumEvent[CesiumEvent["LONG_LEFT_PRESS"] = 110] = "LONG_LEFT_PRESS";
    CesiumEvent[CesiumEvent["LONG_RIGHT_PRESS"] = 111] = "LONG_RIGHT_PRESS";
    CesiumEvent[CesiumEvent["LONG_MIDDLE_PRESS"] = 112] = "LONG_MIDDLE_PRESS";
    CesiumEvent[CesiumEvent["LEFT_CLICK_DRAG"] = 113] = "LEFT_CLICK_DRAG";
    CesiumEvent[CesiumEvent["RIGHT_CLICK_DRAG"] = 114] = "RIGHT_CLICK_DRAG";
    CesiumEvent[CesiumEvent["MIDDLE_CLICK_DRAG"] = 115] = "MIDDLE_CLICK_DRAG";
})(CesiumEvent || (CesiumEvent = {}));

/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
var PickOptions;
(function (PickOptions) {
    PickOptions[PickOptions["NO_PICK"] = 0] = "NO_PICK";
    PickOptions[PickOptions["PICK_FIRST"] = 1] = "PICK_FIRST";
    PickOptions[PickOptions["PICK_ONE"] = 2] = "PICK_ONE";
    PickOptions[PickOptions["PICK_ALL"] = 3] = "PICK_ALL";
})(PickOptions || (PickOptions = {}));

/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 *
 * notice, `data` will be injected to your custom menu component into the `data` field in the component.
 * __Usage :__
 * ```
 *  ngOnInit() {
 *   this.clickEvent$ = this.eventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.PICK_ONE });
 *   this.clickEvent$.subscribe(result => {
 *    if (result.entities) {
 *      const pickedMarker = result.entities[0];
 *      this.contextMenuService.open(MapContextmenuComponent, pickedMarker.position, {
 *        data: {
 *          myData: data,
 *          onDelete: () => this.delete(pickedMarker.id)
 *        }
 *      });
 *    }
 *   });
 *  }
 *
 *
 *  private delete(id) {
 *    this.mapMenu.close();
 *    this.detailedSiteService.removeMarker(id);
 *  }
 * ```
 */
var ContextMenuService = /** @class */ (function () {
    function ContextMenuService() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    Object.defineProperty(ContextMenuService.prototype, "contextMenuChangeNotifier", {
        get: function () {
            return this._contextMenuChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "showContextMenu", {
        get: function () {
            return this._showContextMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onOpen", {
        get: function () {
            return this._onOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onClose", {
        get: function () {
            return this._onClose;
        },
        enumerable: true,
        configurable: true
    });
    ContextMenuService.prototype.init = function (mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    };
    ContextMenuService.prototype.open = function (contentComponent, position, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.close();
        this._content = contentComponent;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe(function () {
                _this.leftClickSubscription.unsubscribe();
                _this.close();
            });
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    };
    ContextMenuService.prototype.close = function () {
        this._content = undefined;
        this._position = undefined;
        this._options = undefined;
        this._showContextMenu = false;
        if (this.leftClickRegistration) {
            this.leftClickRegistration.dispose();
            this.leftClickRegistration = undefined;
        }
        if (this.leftClickSubscription) {
            this.leftClickSubscription.unsubscribe();
            this.leftClickSubscription = undefined;
        }
        this._contextMenuChangeNotifier.emit();
        this._onClose.emit();
    };
    ContextMenuService = __decorate([
        Injectable()
    ], ContextMenuService);
    return ContextMenuService;
}());

var LatLonVectors = LatLonVectors$1; // doesnt exists on typings
window['geodesy'] = geodesy;
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
var CoordinateConverter = /** @class */ (function () {
    function CoordinateConverter(cesiumService) {
        this.cesiumService = cesiumService;
    }
    CoordinateConverter.cartesian3ToLatLon = function (cartesian3, ellipsoid) {
        var cart = Cesium.Cartographic.fromCartesian(cartesian3, ellipsoid);
        return {
            lon: Cesium.Math.toDegrees(cart.longitude),
            lat: Cesium.Math.toDegrees(cart.latitude),
            height: cart.height
        };
    };
    CoordinateConverter.prototype.screenToCartesian3 = function (screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            var screenPosition = __assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                var mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            var camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    };
    CoordinateConverter.prototype.screenToCartographic = function (screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    };
    CoordinateConverter.prototype.cartesian3ToCartographic = function (cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    };
    CoordinateConverter.prototype.degreesToCartographic = function (longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    };
    CoordinateConverter.prototype.radiansToCartographic = function (longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    };
    CoordinateConverter.prototype.degreesToUTM = function (longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    };
    CoordinateConverter.prototype.UTMToDegrees = function (zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    };
    CoordinateConverter.prototype.geodesyToCesiumObject = function (geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    };
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    CoordinateConverter.prototype.midPointToCartesian3 = function (first, second) {
        var toDeg = function (rad) { return Cesium.Math.toDegrees(rad); };
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        var middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    };
    CoordinateConverter.prototype.middlePointByScreen = function (position0, position1) {
        var scene = this.cesiumService.getScene();
        var screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        var screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        var middleScreenPoint = new Cesium.Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    };
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    CoordinateConverter.prototype.bearingTo = function (first, second) {
        var toDeg = function (rad) { return Cesium.Math.toDegrees(rad); };
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        var bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    };
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    CoordinateConverter.prototype.bearingToCartesian = function (firstCartesian3, secondCartesian3) {
        var firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        var secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    };
    CoordinateConverter.ctorParameters = function () { return [
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    CoordinateConverter = __decorate([
        Injectable(),
        __param(0, Optional()),
        __metadata("design:paramtypes", [CesiumService])
    ], CoordinateConverter);
    return CoordinateConverter;
}());

/**
 *  Abstract drawer. All drawers extends this class.
 */
var BasicDrawerService = /** @class */ (function () {
    function BasicDrawerService() {
    }
    BasicDrawerService.prototype.setPropsAssigner = function (assigner) {
        this._propsAssigner = assigner;
    };
    return BasicDrawerService;
}());

/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
var PrimitivesDrawerService = /** @class */ (function (_super) {
    __extends(PrimitivesDrawerService, _super);
    function PrimitivesDrawerService(drawerType, cesiumService) {
        var _this = _super.call(this) || this;
        _this.drawerType = drawerType;
        _this.cesiumService = cesiumService;
        _this._show = true;
        return _this;
    }
    PrimitivesDrawerService.prototype.init = function () {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    };
    PrimitivesDrawerService.prototype.add = function (cesiumProps) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this._cesiumCollection.add(cesiumProps);
    };
    PrimitivesDrawerService.prototype.update = function (entity, cesiumProps) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    };
    PrimitivesDrawerService.prototype.remove = function (entity) {
        this._cesiumCollection.remove(entity);
    };
    PrimitivesDrawerService.prototype.removeAll = function () {
        this._cesiumCollection.removeAll();
    };
    PrimitivesDrawerService.prototype.setShow = function (showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    };
    PrimitivesDrawerService.prototype.getShow = function () {
        return this._show;
    };
    return PrimitivesDrawerService;
}(BasicDrawerService));

var GeoUtilsService = /** @class */ (function () {
    function GeoUtilsService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    GeoUtilsService_1 = GeoUtilsService;
    GeoUtilsService.pointByLocationDistanceAndAzimuth = function (currentLocation, meterDistance, radianAzimuth, deprecated) {
        var distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
        var cartographicLocation = currentLocation instanceof Cesium.Cartesian3 ? Cesium.Cartographic.fromCartesian(currentLocation) : currentLocation;
        var cartesianLocation = currentLocation instanceof Cesium.Cartesian3
            ? currentLocation
            : Cesium.Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        var resultPosition;
        var resultDistance;
        var counter = 0;
        var distanceFactorRangeMax = 0.1;
        var distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            var factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            resultPosition = GeoUtilsService_1._pointByLocationDistanceAndAzimuth(cartographicLocation, distance * (1 + factor), radianAzimuth);
            resultDistance = this.distance(cartesianLocation, resultPosition);
            if (resultDistance > meterDistance) {
                distanceFactorRangeMax = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            else {
                distanceFactorRangeMin = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            counter++;
        }
        return resultPosition;
    };
    GeoUtilsService._pointByLocationDistanceAndAzimuth = function (cartographicLocation, distance, radianAzimuth) {
        var curLat = cartographicLocation.latitude;
        var curLon = cartographicLocation.longitude;
        var destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        var destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
    };
    GeoUtilsService.distance = function (pos0, pos1) {
        return Cesium.Cartesian3.distance(pos0, pos1);
    };
    GeoUtilsService.getPositionsDelta = function (position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    };
    GeoUtilsService.addDeltaToPosition = function (position, delta, updateReference) {
        if (updateReference === void 0) { updateReference = false; }
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = 0;
            var cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            var cartesian = new Cesium.Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    };
    GeoUtilsService.middleCartesian3Point = function (position0, position1) {
        return new Cesium.Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    };
    GeoUtilsService.prototype.screenPositionToCartesian3 = function (screenPos) {
        var camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    };
    var GeoUtilsService_1;
    GeoUtilsService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    GeoUtilsService = GeoUtilsService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], GeoUtilsService);
    return GeoUtilsService;
}());

/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
var ArcDrawerService = /** @class */ (function (_super) {
    __extends(ArcDrawerService, _super);
    function ArcDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    ArcDrawerService.prototype._calculateArcPositions = function (cesiumProps) {
        var quality = cesiumProps.quality || 18;
        var delta = (cesiumProps.delta) / quality;
        var pointsArray = [];
        for (var i = 0; i < quality + 1; ++i) {
            var point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    };
    ArcDrawerService.prototype._calculateTriangle = function (cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    };
    ArcDrawerService.prototype._calculateArc = function (cesiumProps) {
        var arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    };
    ArcDrawerService.prototype.add = function (cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    };
    ArcDrawerService.prototype.update = function (primitive, cesiumProps) {
        if (!cesiumProps.constantColor && cesiumProps.color &&
            !primitive.material.uniforms.color.equals(cesiumProps.color)) {
            primitive.material.uniforms.color = cesiumProps.color;
        }
        primitive.width = cesiumProps.width !== undefined ? cesiumProps.width : primitive.width;
        primitive.show = cesiumProps.show !== undefined ? cesiumProps.show : primitive.show;
        primitive.distanceDisplayCondition = cesiumProps.distanceDisplayCondition !== undefined ?
            cesiumProps.distanceDisplayCondition : primitive.distanceDisplayCondition;
        primitive.positions = this._calculateArc(cesiumProps);
        return primitive;
    };
    ArcDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    ArcDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], ArcDrawerService);
    return ArcDrawerService;
}(PrimitivesDrawerService));

var GraphicsType;
(function (GraphicsType) {
    GraphicsType[GraphicsType["ellipse"] = Cesium.EllipseGraphics] = "ellipse";
    GraphicsType[GraphicsType["ellipsoid"] = Cesium.EllipsoidGraphics] = "ellipsoid";
    GraphicsType[GraphicsType["polygon"] = Cesium.PolygonGraphics] = "polygon";
    GraphicsType[GraphicsType["polyline"] = Cesium.PolylineGraphics] = "polyline";
    GraphicsType[GraphicsType["polylineVolume"] = Cesium.PolylineVolumeGraphics] = "polylineVolume";
    GraphicsType[GraphicsType["box"] = Cesium.BoxGraphics] = "box";
    GraphicsType[GraphicsType["corridor"] = Cesium.CorridorGraphics] = "corridor";
    GraphicsType[GraphicsType["cylinder"] = Cesium.CylinderGraphics] = "cylinder";
    GraphicsType[GraphicsType["label"] = Cesium.LabelGraphics] = "label";
    GraphicsType[GraphicsType["billboard"] = Cesium.BillboardGraphics] = "billboard";
    GraphicsType[GraphicsType["model"] = Cesium.ModelGraphics] = "model";
    GraphicsType[GraphicsType["path"] = Cesium.PathGraphics] = "path";
    GraphicsType[GraphicsType["point"] = Cesium.PointGraphics] = "point";
    GraphicsType[GraphicsType["rectangle"] = Cesium.RectangleGraphics] = "rectangle";
    GraphicsType[GraphicsType["wall"] = Cesium.WallGraphics] = "wall";
})(GraphicsType || (GraphicsType = {}));

var OptimizedEntityCollection = /** @class */ (function () {
    function OptimizedEntityCollection(entityCollection, collectionSize, updateRate) {
        if (collectionSize === void 0) { collectionSize = -1; }
        if (updateRate === void 0) { updateRate = -1; }
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    OptimizedEntityCollection.prototype.setShow = function (show) {
        this.entityCollection.show = show;
    };
    Object.defineProperty(OptimizedEntityCollection.prototype, "isSuspended", {
        get: function () {
            return this._isSuspended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "updateRate", {
        get: function () {
            return this._updateRate;
        },
        set: function (value) {
            this._updateRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "collectionSize", {
        get: function () {
            return this._collectionSize;
        },
        set: function (value) {
            this._collectionSize = value;
        },
        enumerable: true,
        configurable: true
    });
    OptimizedEntityCollection.prototype.collection = function () {
        return this.entityCollection;
    };
    OptimizedEntityCollection.prototype.isFree = function () {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    };
    OptimizedEntityCollection.prototype.add = function (entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    };
    OptimizedEntityCollection.prototype.remove = function (entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    };
    OptimizedEntityCollection.prototype.removeNoSuspend = function (entity) {
        this.entityCollection.remove(entity);
    };
    OptimizedEntityCollection.prototype.removeAll = function () {
        this.suspend();
        this.entityCollection.removeAll();
    };
    OptimizedEntityCollection.prototype.onEventSuspension = function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventSuspensionCallback = { callback: callback, once: once };
        return function () {
            _this._onEventSuspensionCallback = undefined;
        };
    };
    OptimizedEntityCollection.prototype.onEventResume = function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventResumeCallback = { callback: callback, once: once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return function () {
            _this._onEventResumeCallback = undefined;
        };
    };
    OptimizedEntityCollection.prototype.triggerEventSuspension = function () {
        if (this._onEventSuspensionCallback !== undefined) {
            var callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    };
    OptimizedEntityCollection.prototype.triggerEventResume = function () {
        if (this._onEventResumeCallback !== undefined) {
            var callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    };
    OptimizedEntityCollection.prototype.suspend = function () {
        var _this = this;
        if (this._updateRate < 0) {
            return;
        }
        if (this._isHardSuspend) {
            return;
        }
        if (!this._isSuspended) {
            this._isSuspended = true;
            this.entityCollection.suspendEvents();
            this.triggerEventSuspension();
            this._suspensionTimeout = setTimeout(function () {
                _this.entityCollection.resumeEvents();
                _this.triggerEventResume();
                _this._isSuspended = false;
                _this._suspensionTimeout = undefined;
            }, this._updateRate);
        }
    };
    OptimizedEntityCollection.prototype.hardSuspend = function () {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    };
    OptimizedEntityCollection.prototype.hardResume = function () {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    };
    return OptimizedEntityCollection;
}());

/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
var EntitiesDrawerService = /** @class */ (function (_super) {
    __extends(EntitiesDrawerService, _super);
    function EntitiesDrawerService(cesiumService, graphicsType, defaultOptions) {
        if (defaultOptions === void 0) { defaultOptions = {
            collectionMaxSize: -1,
            collectionSuspensionTime: -1,
            collectionsNumber: 1,
        }; }
        var _this = _super.call(this) || this;
        _this.cesiumService = cesiumService;
        _this.graphicsType = graphicsType;
        _this.defaultOptions = defaultOptions;
        _this.entityCollections = new Map();
        _this.graphicsTypeName = GraphicsType[_this.graphicsType];
        // Fix bad enum compilation
        for (var i in GraphicsType) {
            if (GraphicsType[i] === _this.graphicsType) {
                _this.graphicsTypeName = i;
            }
        }
        return _this;
    }
    EntitiesDrawerService.prototype.getFreeEntitiesCollection = function () {
        var freeEntityCollection = null;
        this.entityCollections.forEach(function (entityCollection) {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        });
        return freeEntityCollection;
    };
    EntitiesDrawerService.prototype.init = function (options) {
        var finalOptions = options || this.defaultOptions;
        var dataSources = [];
        for (var i = 0; i < finalOptions.collectionsNumber; i++) {
            var dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    };
    EntitiesDrawerService.prototype.add = function (cesiumProps) {
        var _a;
        var optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        var entityObject = (_a = {
                position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
                description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
                orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
                viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined
            },
            _a[this.graphicsTypeName] = cesiumProps,
            _a);
        if (cesiumProps.name !== undefined) {
            entityObject.name = cesiumProps.name;
        }
        if (cesiumProps.availability !== undefined) {
            entityObject.availability = cesiumProps.availability;
        }
        return optimizedEntityCollection.add(entityObject);
    };
    EntitiesDrawerService.prototype.update = function (entity, cesiumProps) {
        this.suspendEntityCollection(entity);
        if (entity.position instanceof Cesium.CallbackProperty) {
            if (entity.position._isConstant) {
                entity.position = cesiumProps.position;
            }
        }
        entity.position = cesiumProps.position !== undefined ? cesiumProps.position : undefined;
        entity.name = cesiumProps.name !== undefined ? cesiumProps.name : entity.name;
        entity.description = cesiumProps.description !== undefined ? cesiumProps.description : entity.description;
        entity.orientation = cesiumProps.orientation !== undefined ? cesiumProps.orientation : entity.orientation;
        entity.viewFrom = cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : entity.viewFrom;
        entity.availability = cesiumProps.availability !== undefined ? cesiumProps.availability : cesiumProps.availability;
        if (this._propsAssigner) {
            this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
        }
        else {
            Object.assign(entity[this.graphicsTypeName], cesiumProps);
        }
    };
    EntitiesDrawerService.prototype.remove = function (entity) {
        var optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    };
    EntitiesDrawerService.prototype.removeAll = function () {
        this.entityCollections.forEach(function (entityCollection) {
            entityCollection.removeAll();
        });
    };
    EntitiesDrawerService.prototype.setShow = function (showValue) {
        this.entityCollections.forEach(function (entityCollection) {
            entityCollection.setShow(showValue);
        });
    };
    EntitiesDrawerService.prototype.suspendEntityCollection = function (entity) {
        var id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        var entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    };
    return EntitiesDrawerService;
}(BasicDrawerService));

/**
 *  This drawer is responsible for drawing billboards.
 */
var BillboardDrawerService = /** @class */ (function (_super) {
    __extends(BillboardDrawerService, _super);
    function BillboardDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.billboard) || this;
    }
    BillboardDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    BillboardDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], BillboardDrawerService);
    return BillboardDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing czml dataSources.
 */
var CzmlDrawerService = /** @class */ (function (_super) {
    __extends(CzmlDrawerService, _super);
    function CzmlDrawerService(cesiumService) {
        var _this = _super.call(this) || this;
        _this.cesiumService = cesiumService;
        return _this;
    }
    CzmlDrawerService.prototype.init = function (options) {
        var dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    };
    // returns the packet, provided by the stream
    CzmlDrawerService.prototype.add = function (cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    };
    CzmlDrawerService.prototype.update = function (entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    };
    CzmlDrawerService.prototype.remove = function (entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    };
    CzmlDrawerService.prototype.removeAll = function () {
        this.czmlStream.entities.removeAll();
    };
    CzmlDrawerService.prototype.setShow = function (showValue) {
        this.czmlStream.entities.show = showValue;
    };
    CzmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CzmlDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CzmlDrawerService);
    return CzmlDrawerService;
}(BasicDrawerService));

/**
 *  This drawer is responsible for drawing ellipses.
 */
var EllipseDrawerService = /** @class */ (function (_super) {
    __extends(EllipseDrawerService, _super);
    function EllipseDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipse) || this;
    }
    EllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    EllipseDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], EllipseDrawerService);
    return EllipseDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing labels.
 */
var LabelDrawerService = /** @class */ (function (_super) {
    __extends(LabelDrawerService, _super);
    function LabelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.label) || this;
    }
    LabelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    LabelDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], LabelDrawerService);
    return LabelDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing points.
 */
var PointDrawerService = /** @class */ (function (_super) {
    __extends(PointDrawerService, _super);
    function PointDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.point) || this;
    }
    PointDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PointDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PointDrawerService);
    return PointDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing polygons.
 */
var PolygonDrawerService = /** @class */ (function (_super) {
    __extends(PolygonDrawerService, _super);
    function PolygonDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polygon) || this;
    }
    PolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolygonDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolygonDrawerService);
    return PolygonDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible of drawing polylines.
 */
var PolylineDrawerService = /** @class */ (function (_super) {
    __extends(PolylineDrawerService, _super);
    function PolylineDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polyline) || this;
    }
    PolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolylineDrawerService);
    return PolylineDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
var PolylinePrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PolylinePrimitiveDrawerService, _super);
    function PolylinePrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    PolylinePrimitiveDrawerService.prototype.add = function (cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    };
    PolylinePrimitiveDrawerService.prototype.update = function (cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Cesium.Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        _super.prototype.update.call(this, cesiumObject, cesiumProps);
    };
    PolylinePrimitiveDrawerService.prototype.withColorMaterial = function (cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    };
    PolylinePrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolylinePrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolylinePrimitiveDrawerService);
    return PolylinePrimitiveDrawerService;
}(PrimitivesDrawerService));

var KeyboardAction;
(function (KeyboardAction) {
    KeyboardAction[KeyboardAction["CAMERA_FORWARD"] = 0] = "CAMERA_FORWARD";
    KeyboardAction[KeyboardAction["CAMERA_BACKWARD"] = 1] = "CAMERA_BACKWARD";
    KeyboardAction[KeyboardAction["CAMERA_RIGHT"] = 2] = "CAMERA_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_LEFT"] = 3] = "CAMERA_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_UP"] = 4] = "CAMERA_UP";
    KeyboardAction[KeyboardAction["CAMERA_DOWN"] = 5] = "CAMERA_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_RIGHT"] = 6] = "CAMERA_LOOK_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_LEFT"] = 7] = "CAMERA_LOOK_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_UP"] = 8] = "CAMERA_LOOK_UP";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_DOWN"] = 9] = "CAMERA_LOOK_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_TWIST_RIGHT"] = 10] = "CAMERA_TWIST_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_TWIST_LEFT"] = 11] = "CAMERA_TWIST_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_RIGHT"] = 12] = "CAMERA_ROTATE_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_LEFT"] = 13] = "CAMERA_ROTATE_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_UP"] = 14] = "CAMERA_ROTATE_UP";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_DOWN"] = 15] = "CAMERA_ROTATE_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_ZOOM_IN"] = 16] = "CAMERA_ZOOM_IN";
    KeyboardAction[KeyboardAction["CAMERA_ZOOM_OUT"] = 17] = "CAMERA_ZOOM_OUT";
})(KeyboardAction || (KeyboardAction = {}));

var _a;
var CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
var CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
var CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
var CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
var PREDEFINED_KEYBOARD_ACTIONS = (_a = {},
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_FORWARD] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    },
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_BACKWARD] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    },
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_UP] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    },
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_DOWN] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    },
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_RIGHT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    },
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_LEFT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var scene = cesiumService.getScene();
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    },
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_RIGHT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var currentPosition = camera.positionCartographic;
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    },
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_LEFT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var currentPosition = camera.positionCartographic;
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    },
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_UP] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var currentPosition = camera.positionCartographic;
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    },
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_DOWN] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var currentPosition = camera.positionCartographic;
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    },
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_RIGHT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    },
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_LEFT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    },
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_RIGHT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    },
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_LEFT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    },
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_UP] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    },
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_DOWN] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    },
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_IN] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var amount = params.amount;
        camera.zoomIn(amount);
    },
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_OUT] = function (cesiumService, params) {
        var camera = cesiumService.getViewer().camera;
        var amount = params.amount;
        camera.zoomOut(amount);
    },
    _a);

var KeyEventState;
(function (KeyEventState) {
    KeyEventState[KeyEventState["IGNORED"] = 0] = "IGNORED";
    KeyEventState[KeyEventState["NOT_PRESSED"] = 1] = "NOT_PRESSED";
    KeyEventState[KeyEventState["PRESSED"] = 2] = "PRESSED";
})(KeyEventState || (KeyEventState = {}));
/**
 *  Service that manages keyboard keys and execute actions per request.
 *  Inject the keyboard control service into any layer, under your `ac-map` component,
 *  And defined you keyboard handlers using `setKeyboardControls`.
 *
 * <caption>Simple Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: { action: KeyboardAction.CAMERA_FORWARD },
 *       S: { action: KeyboardAction.CAMERA_BACKWARD },
 *       D: { action: KeyboardAction.CAMERA_RIGHT },
 *       A: { action: KeyboardAction.CAMERA_LEFT },
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 *
 * <caption>Advanced Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   private myCustomValue = 10;
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: {
 *          action: KeyboardAction.CAMERA_FORWARD,
 *          validate: (camera, scene, params, key) => {
 *            // Replace `checkCamera` you with your validation logic
 *            if (checkCamera(camera) || params.customParams === true) {
 *              return true;
 *            }
 *
 *            return false;
 *          },
 *          params: () => {
 *            return {
 *              myValue: this.myCustomValue,
 *            };
 *          },
 *        }
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 * <b>Predefined keyboard actions:</b>
 * + `KeyboardAction.CAMERA_FORWARD` - Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_BACKWARD` - Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_UP` - Moves the camera up, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_DOWN` - Moves the camera down, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_RIGHT` - Moves the camera right, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LEFT` - Moves the camera left, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LOOK_RIGHT` - Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_LEFT` - Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_UP` - Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_DOWN` - Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_TWIST_RIGHT` - Twists the camera to the right, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_TWIST_LEFT` - Twists the camera to the left, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_ROTATE_RIGHT` - Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_LEFT` - Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_UP` - Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_DOWN` - Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ZOOM_IN` - Zoom in into the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 * + `KeyboardAction.CAMERA_ZOOM_OUT` -  Zoom out from the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 */
var KeyboardControlService = /** @class */ (function () {
    /**
     * Creats the keyboard control service.
     */
    function KeyboardControlService(ngZone, cesiumService, document) {
        this.ngZone = ngZone;
        this.cesiumService = cesiumService;
        this.document = document;
        this._currentDefinitions = null;
        this._activeDefinitions = {};
        this._keyMappingFn = this.defaultKeyMappingFn;
    }
    /**
     * Initializes the keyboard control service.
     */
    KeyboardControlService.prototype.init = function () {
        var canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', function () {
            canvas.focus();
        });
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleTick = this.handleTick.bind(this);
    };
    /**
     * Sets the current map keyboard control definitions.
     * The definitions is a key mapping between a key string and a KeyboardControlDefinition:
     * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
     * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
     * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
     * - `params` is an object (or function that returns object) that will be passed into the action executor.
     * - `done` is a function that will be triggered when `keyup` is triggered.
     * @param definitions Keyboard Control Definition
     * @param keyMappingFn - Mapping function for custom keys
     * @param outsideOfAngularZone - if key down events will run outside of angular zone.
     */
    KeyboardControlService.prototype.setKeyboardControls = function (definitions, keyMappingFn, outsideOfAngularZone) {
        var _this = this;
        if (outsideOfAngularZone === void 0) { outsideOfAngularZone = false; }
        if (!definitions) {
            return this.removeKeyboardControls();
        }
        if (!this._currentDefinitions) {
            this.registerEvents(outsideOfAngularZone);
        }
        this._currentDefinitions = definitions;
        this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;
        Object.keys(this._currentDefinitions).forEach(function (key) {
            _this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        });
    };
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     */
    KeyboardControlService.prototype.removeKeyboardControls = function () {
        this.unregisterEvents();
        this._currentDefinitions = null;
    };
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     */
    KeyboardControlService.prototype.getAction = function (char) {
        return this._currentDefinitions[char] || null;
    };
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    KeyboardControlService.prototype.defaultKeyMappingFn = function (keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    };
    /**
     * document's `keydown` event handler
     */
    KeyboardControlService.prototype.handleKeydown = function (e) {
        var char = this._keyMappingFn(e);
        var action = this.getAction(char);
        if (action) {
            var actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                var execute = true;
                var params = this.getParams(action.params, e);
                if (action.validation) {
                    execute = action.validation(this.cesiumService, params, e);
                }
                if (execute === true) {
                    this._activeDefinitions[char] = {
                        state: KeyEventState.PRESSED,
                        action: action,
                        keyboardEvent: e,
                    };
                }
            }
        }
    };
    /**
     * document's `keyup` event handler
     */
    KeyboardControlService.prototype.handleKeyup = function (e) {
        var char = this._keyMappingFn(e);
        var action = this.getAction(char);
        if (action) {
            this._activeDefinitions[char] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: e,
            };
            if (action.done && typeof action.done === 'function') {
                action.done(this.cesiumService, e);
            }
        }
    };
    /**
     * `tick` event handler that triggered by Cesium render loop
     */
    KeyboardControlService.prototype.handleTick = function () {
        var _this = this;
        var activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach(function (key) {
            var actionState = _this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                _this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        });
    };
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     */
    KeyboardControlService.prototype.getParams = function (paramsDef, keyboardEvent) {
        if (!paramsDef) {
            return {};
        }
        if (typeof paramsDef === 'function') {
            return paramsDef(this.cesiumService, keyboardEvent);
        }
        return paramsDef;
    };
    /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     */
    KeyboardControlService.prototype.executeAction = function (execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        var params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            var predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            var shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);
            if (shouldCancelEvent === false) {
                this._activeDefinitions[key] = {
                    state: KeyEventState.IGNORED,
                    action: null,
                    keyboardEvent: null,
                };
            }
        }
    };
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     */
    KeyboardControlService.prototype.registerEvents = function (outsideOfAngularZone) {
        var _this = this;
        var registerToEvents = function () {
            _this.document.addEventListener('keydown', _this.handleKeydown);
            _this.document.addEventListener('keyup', _this.handleKeyup);
            _this.cesiumService.getViewer().clock.onTick.addEventListener(_this.handleTick);
        };
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    };
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     */
    KeyboardControlService.prototype.unregisterEvents = function () {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    };
    KeyboardControlService.ctorParameters = function () { return [
        { type: NgZone },
        { type: CesiumService },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    KeyboardControlService = __decorate([
        Injectable(),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [NgZone, CesiumService, Object])
    ], KeyboardControlService);
    return KeyboardControlService;
}());

var CesiumPureEventObserver = /** @class */ (function () {
    function CesiumPureEventObserver(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    CesiumPureEventObserver.prototype.init = function (eventsHandler) {
        var _this = this;
        this.observer = Observable.create(function (observer) {
            eventsHandler.setInputAction(function (movement) {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }, _this.event, _this.modifier);
        });
        return this.observer;
    };
    return CesiumPureEventObserver;
}());

var CesiumLongPressObserver = /** @class */ (function (_super) {
    __extends(CesiumLongPressObserver, _super);
    function CesiumLongPressObserver(event, modifier, eventFactory) {
        var _this = _super.call(this, event, modifier) || this;
        _this.event = event;
        _this.modifier = modifier;
        _this.eventFactory = eventFactory;
        return _this;
    }
    CesiumLongPressObserver.prototype.init = function () {
        var startEvent;
        var stopEvent;
        if (this.event === CesiumEvent.LONG_LEFT_PRESS) {
            startEvent = CesiumEvent.LEFT_DOWN;
            stopEvent = CesiumEvent.LEFT_UP;
        }
        else if (this.event === CesiumEvent.LONG_RIGHT_PRESS) {
            startEvent = CesiumEvent.RIGHT_DOWN;
            stopEvent = CesiumEvent.RIGHT_UP;
        }
        else if (this.event === CesiumEvent.LONG_MIDDLE_PRESS) {
            startEvent = CesiumEvent.MIDDLE_DOWN;
            stopEvent = CesiumEvent.MIDDLE_UP;
        }
        var startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        var stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);
        // publish for preventing side effect
        var longPressObservable = publish()(startEventObservable.pipe(mergeMap(function (e) { return of(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable)); })));
        return longPressObservable;
    };
    CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;
    return CesiumLongPressObserver;
}(CesiumPureEventObserver));

var CesiumEventBuilder = /** @class */ (function () {
    function CesiumEventBuilder(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    CesiumEventBuilder_1 = CesiumEventBuilder;
    CesiumEventBuilder.getEventFullName = function (event, modifier) {
        if (modifier) {
            return event + "_" + modifier;
        }
        else {
            return event.toString();
        }
    };
    CesiumEventBuilder.prototype.init = function () {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    };
    CesiumEventBuilder.prototype.get = function (event, modifier) {
        var eventName = CesiumEventBuilder_1.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            var eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    };
    CesiumEventBuilder.prototype.createCesiumEventObservable = function (event, modifier) {
        var cesiumEventObservable;
        if (CesiumEventBuilder_1.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    };
    CesiumEventBuilder.prototype.createSpecialCesiumEventObservable = function (event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    };
    var CesiumEventBuilder_1;
    CesiumEventBuilder.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CesiumEventBuilder.longPressEvents = new Set([
        CesiumEvent.LONG_LEFT_PRESS,
        CesiumEvent.LONG_RIGHT_PRESS,
        CesiumEvent.LONG_MIDDLE_PRESS
    ]);
    CesiumEventBuilder = CesiumEventBuilder_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CesiumEventBuilder);
    return CesiumEventBuilder;
}());

/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
var PlonterService = /** @class */ (function () {
    function PlonterService() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    Object.defineProperty(PlonterService.prototype, "plonterChangeNotifier", {
        get: function () {
            return this._plonterChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterShown", {
        get: function () {
            return this._plonterShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "entitesToPlonter", {
        get: function () {
            return this._entitesToPlonter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterClickPosition", {
        get: function () {
            return this._eventResult.movement;
        },
        enumerable: true,
        configurable: true
    });
    PlonterService.prototype.plonterIt = function (eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    };
    PlonterService.prototype.resolvePlonter = function (entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    };
    PlonterService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], PlonterService);
    return PlonterService;
}());

var ɵ0 = function (array) {
    return array.reduce(function (accumulator, currentValue) {
        if (accumulator.indexOf(currentValue) < 0) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
};
var UtilsService = {
    unique: ɵ0
};

var CesiumDragDropHelper = /** @class */ (function () {
    function CesiumDragDropHelper() {
    }
    CesiumDragDropHelper.getDragEventTypes = function (dragEvent) {
        var mouseDownEvent;
        var mouseUpEvent;
        if (dragEvent === CesiumEvent.LEFT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.LEFT_DOWN;
            mouseUpEvent = CesiumEvent.LEFT_UP;
        }
        else if (dragEvent === CesiumEvent.RIGHT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.RIGHT_DOWN;
            mouseUpEvent = CesiumEvent.RIGHT_UP;
        }
        else if (dragEvent === CesiumEvent.MIDDLE_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.MIDDLE_DOWN;
            mouseUpEvent = CesiumEvent.MIDDLE_UP;
        }
        return { mouseDownEvent: mouseDownEvent, mouseUpEvent: mouseUpEvent };
    };
    CesiumDragDropHelper.dragEvents = new Set([
        CesiumEvent.LEFT_CLICK_DRAG,
        CesiumEvent.RIGHT_CLICK_DRAG,
        CesiumEvent.MIDDLE_CLICK_DRAG
    ]);
    return CesiumDragDropHelper;
}());

var Registration = /** @class */ (function () {
    function Registration(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
    return Registration;
}());
/**
 * Manages all map events. Notice events will run outside of Angular zone.
 * Provided by `<ac-map/>` component there for could be injected at any component under `<ac-map/>` hierarchy
 * or from the `<ac-map/>` component reference `acMapComponent.getMapEventsManager()`
 *
 * __usage:__
 * ```
 * MapEventsManagerService.register({event, modifier, priority, entityType, pickOption}).subscribe()
 * ```
 * __param:__ {CesiumEvent} event
 * __param:__ {CesiumEventModifier} modifier
 * __param:__ priority - the bigger the number the bigger the priority. default : 0.
 * __param:__ entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 * __param:__ pickOption - self explained
 */
var MapEventsManagerService = /** @class */ (function () {
    function MapEventsManagerService(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    MapEventsManagerService.prototype.init = function () {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    };
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    MapEventsManagerService.prototype.register = function (input) {
        var _this = this;
        if (this.scene === undefined) {
            throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
        }
        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;
        input.pickConfig = input.pickConfig || {};
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw new Error('MapEventsManagerService: can\'t register an event ' +
                'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
        }
        var eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        var eventRegistration = this.createEventRegistration(input);
        var registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = function () { return _this.disposeObservable(eventRegistration, eventName); };
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return registrationObservable;
    };
    MapEventsManagerService.prototype.disposeObservable = function (eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        var registrations = this.eventRegistrations.get(eventName);
        var index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    };
    MapEventsManagerService.prototype.sortRegistrationsByPriority = function (eventName) {
        var registrations = this.eventRegistrations.get(eventName);
        registrations.sort(function (a, b) { return b.priority - a.priority; });
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        var currentPriority = registrations[0].priority;
        registrations.forEach(function (registration) {
            registration.isPaused = registration.priority < currentPriority;
        });
    };
    MapEventsManagerService.prototype.createEventRegistration = function (_a) {
        var _this = this;
        var event = _a.event, modifier = _a.modifier, entityType = _a.entityType, pickOption = _a.pick, priority = _a.priority, pickFilter = _a.pickFilter, pickConfig = _a.pickConfig;
        var cesiumEventObservable = this.eventBuilder.get(event, modifier);
        var stopper = new Subject();
        var registration = new Registration(undefined, stopper, priority, false);
        var observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter(function () { return !registration.isPaused; }), map(function (movement) { return _this.triggerPick(movement, pickOption, pickConfig); }), filter(function (result) { return result.cesiumEntities !== null || entityType === undefined; }), map(function (picksAndMovement) { return _this.addEntities(picksAndMovement, entityType, pickOption, pickFilter); }), filter(function (result) { return result.entities !== null || (entityType === undefined && !pickFilter); }), switchMap(function (entitiesAndMovement) { return _this.plonter(entitiesAndMovement, pickOption); }), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent({
                event: event,
                modifier: modifier,
                entityType: entityType,
                pick: pickOption,
                priority: priority,
                pickFilter: pickFilter,
                pickConfig: pickConfig
            }).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    };
    MapEventsManagerService.prototype.createDragEvent = function (_a) {
        var event = _a.event, modifier = _a.modifier, entityType = _a.entityType, pickOption = _a.pick, priority = _a.priority, pickFilter = _a.pickFilter, pickConfig = _a.pickConfig;
        var _b = CesiumDragDropHelper.getDragEventTypes(event), mouseDownEvent = _b.mouseDownEvent, mouseUpEvent = _b.mouseUpEvent;
        var mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        var mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        var mouseDownRegistration = this.createEventRegistration({
            event: mouseDownEvent,
            modifier: modifier,
            entityType: entityType,
            pick: pickOption,
            priority: priority,
            pickFilter: pickFilter,
            pickConfig: pickConfig,
        });
        var dropSubject = new Subject();
        var dragObserver = mouseDownRegistration.observable.pipe(mergeMap(function (e) {
            var lastMove = null;
            var dragStartPositionX = e.movement.startPosition.x;
            var dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map(function (movement) {
                lastMove = {
                    movement: {
                        drop: false,
                        startPosition: {
                            x: dragStartPositionX,
                            y: dragStartPositionY,
                        },
                        endPosition: movement.endPosition,
                    },
                    entities: e.entities,
                    cesiumEntities: e.cesiumEntities
                };
                return lastMove;
            }), takeUntil(mouseUpObservable), tap({
                complete: function () {
                    // On complete
                    if (lastMove) {
                        var dropEvent = Object.assign({}, lastMove);
                        dropEvent.movement.drop = true;
                        dropSubject.next(dropEvent);
                    }
                }
            }));
        }));
        return merge(dragObserver, dropSubject);
    };
    MapEventsManagerService.prototype.triggerPick = function (movement, pickOptions, pickConfig) {
        var picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition, pickConfig.drillPickLimit, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                var pick = this.scene.pick(movement.endPosition, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map(function (pick) { return pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive; });
        }
        return { movement: movement, cesiumEntities: picks };
    };
    MapEventsManagerService.prototype.addEntities = function (picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        var entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map(function (pick) { return pick.acEntity; }).filter(function (acEntity) {
                    return acEntity && acEntity instanceof entityType;
                });
            }
            else {
                entities = picksAndMovement.cesiumEntities.map(function (pick) { return pick.acEntity; });
            }
            entities = UtilsService.unique(entities);
            entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
            if (entities.length === 0) {
                entities = null;
            }
        }
        picksAndMovement.entities = entities;
        return picksAndMovement;
    };
    MapEventsManagerService.prototype.plonter = function (entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return of(entitiesAndMovement);
        }
    };
    MapEventsManagerService.ctorParameters = function () { return [
        { type: CesiumService },
        { type: CesiumEventBuilder },
        { type: PlonterService }
    ]; };
    MapEventsManagerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService,
            CesiumEventBuilder,
            PlonterService])
    ], MapEventsManagerService);
    return MapEventsManagerService;
}());

var MapLayersService = /** @class */ (function () {
    function MapLayersService(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    MapLayersService.prototype.registerLayerDataSources = function (dataSources, zIndex) {
        var _this = this;
        dataSources.forEach(function (ds) {
            ds.zIndex = zIndex;
            _this.layersDataSources.push(ds);
        });
    };
    MapLayersService.prototype.drawAllLayers = function () {
        var _this = this;
        this.layersDataSources.sort(function (a, b) { return a.zIndex - b.zIndex; });
        this.layersDataSources.forEach(function (dataSource) {
            _this.cesiumService.getViewer().dataSources.add(dataSource);
        });
    };
    MapLayersService.prototype.updateAndRefresh = function (dataSources, newZIndex) {
        var _this = this;
        if (dataSources && dataSources.length) {
            dataSources.forEach(function (ds) {
                var index = _this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    _this.layersDataSources[index].zIndex = newZIndex;
                }
            });
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    };
    MapLayersService.prototype.removeDataSources = function (dataSources) {
        var _this = this;
        dataSources.forEach(function (ds) {
            var index = _this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                _this.layersDataSources.splice(index, 1);
                _this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        });
    };
    MapLayersService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    MapLayersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], MapLayersService);
    return MapLayersService;
}());

/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
var MapsManagerService = /** @class */ (function () {
    function MapsManagerService() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    MapsManagerService.prototype.getMap = function (id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    };
    MapsManagerService.prototype._registerMap = function (id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        var mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error("Map with id: " + mapId + " already exist");
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    };
    MapsManagerService.prototype._removeMapById = function (id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            var iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    };
    MapsManagerService.prototype.generateDefaultId = function () {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    };
    /**
     * Binds multiple 2D map's cameras together.
     * @param mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     */
    MapsManagerService.prototype.sync2DMapsCameras = function (mapsConfiguration) {
        var _this = this;
        var DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        var maps = mapsConfiguration.map(function (config) {
            var map = _this.getMap(config.id);
            if (!map) {
                throw new Error("Couldn't find map with id: " + config.id);
            }
            return { map: map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        });
        maps.forEach(function (masterMapConfig) {
            var masterMap = masterMapConfig.map;
            var options = masterMapConfig.options;
            var masterCamera = masterMap.getCameraService().getCamera();
            var masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            var removeCallback = masterCamera.changed.addEventListener(function () {
                maps.forEach(function (slaveMapConfig) {
                    var slaveMap = slaveMapConfig.map;
                    var slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    var slaveCamera = slaveMap.getCameraService().getCamera();
                    var slaveCameraCartographic = slaveCamera.positionCartographic;
                    var position = Cesium.Ellipsoid.WGS84.cartographicToCartesian({
                        longitude: masterCameraCartographic.longitude,
                        latitude: masterCameraCartographic.latitude,
                        height: slaveMapOptions.bindZoom ? masterCameraCartographic.height : slaveCameraCartographic.height,
                    });
                    if (slaveMap.getCesiumViewer().scene.mode !== Cesium.SceneMode.MORPHING) {
                        slaveCamera.setView({
                            destination: position,
                            orientation: {
                                heading: slaveCamera.heading,
                                pitch: slaveCamera.pitch,
                            },
                        });
                    }
                });
            });
            _this.eventRemoveCallbacks.push(removeCallback);
        });
    };
    /**
     * Unsyncs maps cameras
     */
    MapsManagerService.prototype.unsyncMapsCameras = function () {
        this.eventRemoveCallbacks.forEach(function (removeCallback) { return removeCallback(); });
        this.eventRemoveCallbacks = [];
    };
    MapsManagerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], MapsManagerService);
    return MapsManagerService;
}());

/**
 * Take screenshot of your cesium globe.
 *
 * usage:
 * ```typescript
 * // get base 64 data url
 * const dataUrl = screenshotService.getMapScreenshotDataUrl();
 *
 * // or download as png
 * screenshotService.downloadMapScreenshot('my-map.png');
 *
 * ```
 *
 */
var ScreenshotService = /** @class */ (function () {
    function ScreenshotService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    ScreenshotService.prototype.getMapScreenshotDataUrlBase64 = function () {
        var canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    };
    ScreenshotService.prototype.downloadMapScreenshot = function (filename) {
        if (filename === void 0) { filename = 'map.png'; }
        var dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    };
    ScreenshotService.prototype.downloadURI = function (uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    ScreenshotService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    ScreenshotService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], ScreenshotService);
    return ScreenshotService;
}());

/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getCesiumViewer()
 * 2. Use MapManagerService.getMap().getCesiumViewer() or if more then one map: MapManagerService.getMap(mapId).getCesiumViewer()
 *
 *
 * @example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
var AcMapComponent = /** @class */ (function () {
    function AcMapComponent(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, configurationService, screenshotService, contextMenuService, coordinateConverter) {
        this._cesiumService = _cesiumService;
        this._cameraService = _cameraService;
        this._elemRef = _elemRef;
        this.document = document;
        this.mapsManagerService = mapsManagerService;
        this.billboardDrawerService = billboardDrawerService;
        this.labelDrawerService = labelDrawerService;
        this.ellipseDrawerService = ellipseDrawerService;
        this.polylineDrawerService = polylineDrawerService;
        this.polygonDrawerService = polygonDrawerService;
        this.arcDrawerService = arcDrawerService;
        this.pointDrawerService = pointDrawerService;
        this.czmlDrawerService = czmlDrawerService;
        this.mapEventsManager = mapEventsManager;
        this.keyboardControlService = keyboardControlService;
        this.mapLayersService = mapLayersService;
        this.configurationService = configurationService;
        this.screenshotService = screenshotService;
        this.contextMenuService = contextMenuService;
        this.coordinateConverter = coordinateConverter;
        /**
         * Disable default plonter context menu
         */
        this.disableDefaultPlonter = false;
        this.mapContainer = this.document.createElement('div');
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        this.mapContainer.className = 'map-container';
        this._cesiumService.init(this.mapContainer, this);
        this._cameraService.init(this._cesiumService);
        this.mapEventsManager.init();
        this.billboardDrawerService.init();
        this.labelDrawerService.init();
        this.ellipseDrawerService.init();
        this.polylineDrawerService.init();
        this.polygonDrawerService.init();
        this.arcDrawerService.init();
        this.pointDrawerService.init();
        this.czmlDrawerService.init();
        this.keyboardControlService.init();
        this.contextMenuService.init(this.mapEventsManager);
    }
    AcMapComponent.prototype.ngOnInit = function () {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    };
    AcMapComponent.prototype.ngOnChanges = function (changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            var element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error("No element found with id: " + changes['containerId'].currentValue);
            }
        }
    };
    AcMapComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout(function () {
                var element = _this.document.getElementById(_this.containerId);
                if (element) {
                    element.appendChild(_this.mapContainer);
                }
                else {
                    throw new Error("No element found with id: " + _this.containerId);
                }
            }, 0);
        }
    };
    AcMapComponent.prototype.ngOnDestroy = function () {
        var viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    };
    /**
     * @returns ac-map's cesium service
     */
    AcMapComponent.prototype.getCesiumService = function () {
        return this._cesiumService;
    };
    /**
     * @returns map's cesium viewer
     */
    AcMapComponent.prototype.getCesiumViewer = function () {
        return this._cesiumService.getViewer();
    };
    AcMapComponent.prototype.getCameraService = function () {
        return this._cameraService;
    };
    AcMapComponent.prototype.getId = function () {
        return this.mapId;
    };
    AcMapComponent.prototype.getMapContainer = function () {
        return this.mapContainer;
    };
    AcMapComponent.prototype.getMapEventsManager = function () {
        return this.mapEventsManager;
    };
    AcMapComponent.prototype.getContextMenuService = function () {
        return this.contextMenuService;
    };
    AcMapComponent.prototype.getScreenshotService = function () {
        return this.screenshotService;
    };
    AcMapComponent.prototype.getKeyboardControlService = function () {
        return this.keyboardControlService;
    };
    AcMapComponent.prototype.getCoordinateConverter = function () {
        return this.coordinateConverter;
    };
    AcMapComponent.ctorParameters = function () { return [
        { type: CesiumService },
        { type: CameraService },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: MapsManagerService },
        { type: BillboardDrawerService },
        { type: LabelDrawerService },
        { type: EllipseDrawerService },
        { type: PolylineDrawerService },
        { type: PolygonDrawerService },
        { type: ArcDrawerService },
        { type: PointDrawerService },
        { type: CzmlDrawerService },
        { type: MapEventsManagerService },
        { type: KeyboardControlService },
        { type: MapLayersService },
        { type: ConfigurationService },
        { type: ScreenshotService },
        { type: ContextMenuService },
        { type: CoordinateConverter }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapComponent.prototype, "disableDefaultPlonter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcMapComponent.prototype, "mapId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapComponent.prototype, "flyTo", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AcMapComponent.prototype, "sceneMode", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcMapComponent.prototype, "containerId", void 0);
    AcMapComponent = __decorate([
        Component({
            selector: 'ac-map',
            template: "\n    <ac-default-plonter *ngIf=\"!disableDefaultPlonter\"></ac-default-plonter>\n    <ac-context-menu-wrapper></ac-context-menu-wrapper>\n    <ng-content></ng-content>\n  ",
            providers: [
                CesiumService,
                BillboardDrawerService,
                CesiumEventBuilder,
                KeyboardControlService,
                MapEventsManagerService,
                PlonterService,
                LabelDrawerService,
                PolylineDrawerService,
                PolylinePrimitiveDrawerService,
                EllipseDrawerService,
                PointDrawerService,
                ArcDrawerService,
                CzmlDrawerService,
                PolygonDrawerService,
                MapLayersService,
                CameraService,
                ScreenshotService,
                ContextMenuService,
                CoordinateConverter,
            ]
        }),
        __param(3, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [CesiumService,
            CameraService,
            ElementRef, Object, MapsManagerService,
            BillboardDrawerService,
            LabelDrawerService,
            EllipseDrawerService,
            PolylineDrawerService,
            PolygonDrawerService,
            ArcDrawerService,
            PointDrawerService,
            CzmlDrawerService,
            MapEventsManagerService,
            KeyboardControlService,
            MapLayersService,
            ConfigurationService,
            ScreenshotService,
            ContextMenuService,
            CoordinateConverter])
    ], AcMapComponent);
    return AcMapComponent;
}());

var LayerService = /** @class */ (function () {
    function LayerService() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    Object.defineProperty(LayerService.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        set: function (value) {
            this._cache = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "zIndex", {
        get: function () {
            return this._zIndex;
        },
        set: function (value) {
            if (value !== this._zIndex) {
                this.layerUpdate.emit();
            }
            this._zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (value) {
            if (value !== this._show) {
                this.layerUpdate.emit();
            }
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (context) {
            this._context = context;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    LayerService.prototype.setEntityName = function (name) {
        this._entityName = name;
    };
    LayerService.prototype.getEntityName = function () {
        return this._entityName;
    };
    LayerService.prototype.registerDescription = function (descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    };
    LayerService.prototype.unregisterDescription = function (descriptionComponent) {
        var index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    };
    LayerService.prototype.getDescriptions = function () {
        return this.descriptions;
    };
    LayerService.prototype.layerUpdates = function () {
        return this.layerUpdate;
    };
    LayerService = __decorate([
        Injectable()
    ], LayerService);
    return LayerService;
}());

/**
 * Action to do on entity
 */
var ActionType;
(function (ActionType) {
    ActionType[ActionType["ADD_UPDATE"] = 0] = "ADD_UPDATE";
    ActionType[ActionType["DELETE"] = 1] = "DELETE";
})(ActionType || (ActionType = {}));

var ComputationCache = /** @class */ (function () {
    function ComputationCache() {
        this._cache = new Map();
    }
    ComputationCache.prototype.get = function (expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        var value = insertFn();
        this._cache.set(expression, value);
        return value;
    };
    ComputationCache.prototype.clear = function () {
        this._cache.clear();
    };
    ComputationCache = __decorate([
        Injectable()
    ], ComputationCache);
    return ComputationCache;
}());

var Checker = /** @class */ (function () {
    function Checker() {
    }
    Checker.throwIfAnyNotPresent = function (values, propertyNames) {
        propertyNames.forEach(function (propertyName) { return Checker.throwIfNotPresent(values, propertyName); });
    };
    Checker.throwIfNotPresent = function (value, name) {
        if (!Checker.present(value[name])) {
            throw new Error("Error: " + name + " was not given.");
        }
    };
    Checker.present = function (value) {
        return value !== undefined && value !== null;
    };
    return Checker;
}());

/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
var DynamicEllipseDrawerService = /** @class */ (function (_super) {
    __extends(DynamicEllipseDrawerService, _super);
    function DynamicEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
    }
    DynamicEllipseDrawerService.prototype.add = function (cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return _super.prototype.add.call(this, new EllipsePrimitive(cesiumProps));
    };
    DynamicEllipseDrawerService.prototype.update = function (ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    };
    DynamicEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    DynamicEllipseDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], DynamicEllipseDrawerService);
    return DynamicEllipseDrawerService;
}(PrimitivesDrawerService));

/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
var DynamicPolylineDrawerService = /** @class */ (function (_super) {
    __extends(DynamicPolylineDrawerService, _super);
    function DynamicPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    DynamicPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    DynamicPolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], DynamicPolylineDrawerService);
    return DynamicPolylineDrawerService;
}(PrimitivesDrawerService));

/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 */
var StaticPrimitiveDrawer = /** @class */ (function (_super) {
    __extends(StaticPrimitiveDrawer, _super);
    function StaticPrimitiveDrawer(geometryType, cesiumService) {
        var _this = _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
        _this.geometryType = geometryType;
        return _this;
    }
    StaticPrimitiveDrawer.prototype.add = function (geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        var primitive = new Cesium.Primitive(primitiveProps);
        return _super.prototype.add.call(this, primitive);
    };
    StaticPrimitiveDrawer.prototype.update = function (primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return _super.prototype.add.call(this, new Cesium.Primitive(primitiveProps));
    };
    return StaticPrimitiveDrawer;
}(PrimitivesDrawerService));

/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
var StaticCircleDrawerService = /** @class */ (function (_super) {
    __extends(StaticCircleDrawerService, _super);
    function StaticCircleDrawerService(cesiumService) {
        return _super.call(this, Cesium.CircleGeometry, cesiumService) || this;
    }
    StaticCircleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticCircleDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticCircleDrawerService);
    return StaticCircleDrawerService;
}(StaticPrimitiveDrawer));

/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
var StaticPolylineDrawerService = /** @class */ (function (_super) {
    __extends(StaticPolylineDrawerService, _super);
    function StaticPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineGeometry, cesiumService) || this;
    }
    /**
     * Update function can only change the primitive color.
     */
    StaticPolylineDrawerService.prototype.update = function (primitive, geometryProps, instanceProps, primitiveProps) {
        var color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then(function (readyPrimitive) {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    };
    StaticPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticPolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticPolylineDrawerService);
    return StaticPolylineDrawerService;
}(StaticPrimitiveDrawer));

/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
var StaticPolygonDrawerService = /** @class */ (function (_super) {
    __extends(StaticPolygonDrawerService, _super);
    function StaticPolygonDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolygonGeometry, cesiumService) || this;
    }
    StaticPolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticPolygonDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticPolygonDrawerService);
    return StaticPolygonDrawerService;
}(StaticPrimitiveDrawer));

/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
var StaticEllipseDrawerService = /** @class */ (function (_super) {
    __extends(StaticEllipseDrawerService, _super);
    function StaticEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.EllipseGeometry, cesiumService) || this;
    }
    StaticEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticEllipseDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticEllipseDrawerService);
    return StaticEllipseDrawerService;
}(StaticPrimitiveDrawer));

/**
 *  This drawer is responsible for drawing models.
 */
var ModelDrawerService = /** @class */ (function (_super) {
    __extends(ModelDrawerService, _super);
    function ModelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.model) || this;
    }
    ModelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    ModelDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], ModelDrawerService);
    return ModelDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing box.
 */
var BoxDrawerService = /** @class */ (function (_super) {
    __extends(BoxDrawerService, _super);
    function BoxDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.box) || this;
    }
    BoxDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    BoxDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], BoxDrawerService);
    return BoxDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing corridors .
 */
var CorridorDrawerService = /** @class */ (function (_super) {
    __extends(CorridorDrawerService, _super);
    function CorridorDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.corridor) || this;
    }
    CorridorDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CorridorDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CorridorDrawerService);
    return CorridorDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing cylinders.
 */
var CylinderDrawerService = /** @class */ (function (_super) {
    __extends(CylinderDrawerService, _super);
    function CylinderDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.cylinder) || this;
    }
    CylinderDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CylinderDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CylinderDrawerService);
    return CylinderDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing ellipsoid.
 */
var EllipsoidDrawerService = /** @class */ (function (_super) {
    __extends(EllipsoidDrawerService, _super);
    function EllipsoidDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipsoid) || this;
    }
    EllipsoidDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    EllipsoidDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], EllipsoidDrawerService);
    return EllipsoidDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing polylines.
 */
var PolylineVolumeDrawerService = /** @class */ (function (_super) {
    __extends(PolylineVolumeDrawerService, _super);
    function PolylineVolumeDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polylineVolume) || this;
    }
    PolylineVolumeDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolylineVolumeDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolylineVolumeDrawerService);
    return PolylineVolumeDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing polygons.
 */
var WallDrawerService = /** @class */ (function (_super) {
    __extends(WallDrawerService, _super);
    function WallDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.wall) || this;
    }
    WallDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    WallDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], WallDrawerService);
    return WallDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing rectangles.
 */
var RectangleDrawerService = /** @class */ (function (_super) {
    __extends(RectangleDrawerService, _super);
    function RectangleDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.rectangle) || this;
    }
    RectangleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    RectangleDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], RectangleDrawerService);
    return RectangleDrawerService;
}(EntitiesDrawerService));

/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
var LabelPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(LabelPrimitiveDrawerService, _super);
    function LabelPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.LabelCollection, cesiumService) || this;
    }
    LabelPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    LabelPrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], LabelPrimitiveDrawerService);
    return LabelPrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
var BillboardPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(BillboardPrimitiveDrawerService, _super);
    function BillboardPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.BillboardCollection, cesiumService) || this;
    }
    BillboardPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    BillboardPrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], BillboardPrimitiveDrawerService);
    return BillboardPrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
var PointPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PointPrimitiveDrawerService, _super);
    function PointPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PointPrimitiveCollection, cesiumService) || this;
    }
    PointPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PointPrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PointPrimitiveDrawerService);
    return PointPrimitiveDrawerService;
}(PrimitivesDrawerService));

var HtmlDrawerService = /** @class */ (function (_super) {
    __extends(HtmlDrawerService, _super);
    function HtmlDrawerService(_cesiumService) {
        var _this = _super.call(this, Cesium.HtmlCollection, _cesiumService) || this;
        _this._cesiumService = _cesiumService;
        return _this;
    }
    HtmlDrawerService.prototype.add = function (cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return _super.prototype.add.call(this, cesiumProps);
    };
    HtmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    HtmlDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], HtmlDrawerService);
    return HtmlDrawerService;
}(PrimitivesDrawerService));

// tslint:enable
/**
 *  This is a ac-layer implementation.
 *  The ac-layer element must be a child of ac-map element.
 *  + acFor `{string}` - get the tracked observable and entityName (see the example).
 *  + show `{boolean}` - show/hide layer's entities.
 *  + context `{any}` - get the context layer that will use the componnet (most of the time equal to "this").
 *  + options `{LayerOptions}` - sets the layer options for each drawer.
 *  + zIndex `{number}` - controls the zIndex (order) of the layer, layers with greater zIndex will be in front of layers with lower zIndex
 *    (Exception For `Billboard` and `Label`, should use `[eyeOffset]` prop instead)</br>
 *    zIndex won't work for pritimitve descs (like ac-primitive-polyline...)
 *  + debug `{boolean}` - prints every acNotification
 *
 *
 *  __Usage :__
 *  ```
 *  <ac-map>
 *    <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [options]="options" [zIndex]="1">
 *      <ac-billboard-desc props="{
 *        image: track.image,
 *        position: track.position,
 *        scale: track.scale,
 *        color: track.color,
 *        name: track.name
 *      }">
 *      </ac-billboard-desc>
 *        <ac-label-desc props="{
 *          position: track.position,
 *          pixelOffset : [-15,20] | pixelOffset,
 *          text: track.name,
 *          font: '15px sans-serif'
 *        }">
 *      </ac-label-desc>
 *    </ac-layer>
 *  </ac-map>
 *  ```
 */
var AcLayerComponent = /** @class */ (function () {
    function AcLayerComponent(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
        this.debug = false;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.stopObservable = new Subject();
        this._updateStream = new Subject();
        this.entitiesStore = new Map();
        this.layerDrawerDataSources = [];
        this._drawerList = new Map([
            ['billboard', billboardDrawerService],
            ['label', labelDrawerService],
            ['ellipse', ellipseDrawerService],
            ['polyline', polylineDrawerService],
            ['polygon', polygonDrawerService],
            ['arc', arcDrawerService],
            ['point', pointDrawerService],
            ['model', modelDrawerService],
            ['box', boxDrawerService],
            ['corridor', corridorDrawerService],
            ['cylinder', cylinderDrawerService],
            ['ellipsoid', ellipsoidDrawerSerice],
            ['polylineVolume', polylineVolumeDrawerService],
            ['rectangle', rectangleDrawerService],
            ['wall', wallDrawerService],
            ['polylinePrimitive', polylinePrimitiveDrawerService],
            ['labelPrimitive', labelPrimitiveDrawerService],
            ['billboardPrimitive', billboardPrimitiveDrawerService],
            ['pointPrimitive', pointPrimitiveDrawerService],
            ['html', htmlDrawerService],
            ['czml', czmlDrawerService],
            ['dynamicEllipse', dynamicEllipseDrawerService],
            ['dynamicPolyline', dynamicPolylineDrawerService],
            ['staticCircle', staticCircleDrawerService],
            ['staticPolyline', staticPolylineDrawerService],
            ['staticPolygon', staticPolygonDrawerService],
            ['staticEllipse', staticEllipseDrawerService],
        ]);
    }
    AcLayerComponent.prototype.init = function () {
        var _this = this;
        this.initValidParams();
        merge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe(function (notification) {
            _this._computationCache.clear();
            if (_this.debug) {
                console.log('AcLayer received notification:', notification);
            }
            var contextEntity = notification.entity;
            if (_this.store) {
                contextEntity = _this.updateStore(notification);
            }
            _this.context[_this.entityName] = contextEntity;
            _this.layerService.getDescriptions().forEach(function (descriptionComponent) {
                switch (notification.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(_this.context, notification.id, contextEntity);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(notification.id);
                        break;
                    default:
                        console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
                }
            });
        });
    };
    AcLayerComponent.prototype.updateStore = function (notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                var entity = this.entitiesStore.get(notification.id);
                Object.assign(entity, notification.entity);
                return entity;
            }
            else {
                this.entitiesStore.set(notification.id, notification.entity);
                return notification.entity;
            }
        }
    };
    AcLayerComponent.prototype.initValidParams = function () {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + this.acFor);
        }
        var acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    };
    /** Test for a rxjs Observable */
    AcLayerComponent.prototype.isObservable = function (obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    };
    AcLayerComponent.prototype.ngAfterContentInit = function () {
        this.init();
    };
    AcLayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach(function (drawer, drawerName) {
            var _a;
            var initOptions = _this.options ? _this.options[drawerName] : undefined;
            var drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                (_a = _this.layerDrawerDataSources).push.apply(_a, __spread(drawerDataSources));
            }
            drawer.setShow(_this.show);
        });
    };
    AcLayerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.show && !changes.show.firstChange) {
            var showValue_1 = changes['show'].currentValue;
            this.layerService.show = showValue_1;
            this._drawerList.forEach(function (drawer) { return drawer.setShow(showValue_1); });
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            var zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    };
    AcLayerComponent.prototype.ngOnDestroy = function () {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    };
    AcLayerComponent.prototype.getLayerService = function () {
        return this.layerService;
    };
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getLayerDrawerDataSources = function () {
        return this.layerDrawerDataSources;
    };
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getDrawerDataSourcesByName = function (name) {
        return this.layerDrawerDataSources.filter(function (d) { return d.name === name; });
    };
    /**
     * Returns the store.
     */
    AcLayerComponent.prototype.getStore = function () {
        return this.entitiesStore;
    };
    /**
     * Remove all the entities from the layer.
     */
    AcLayerComponent.prototype.removeAll = function () {
        this.layerService.getDescriptions().forEach(function (description) { return description.removeAll(); });
        this.entitiesStore.clear();
    };
    /**
     * remove entity from the layer
     */
    AcLayerComponent.prototype.remove = function (entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    };
    /**
     * add/update entity to/from the layer
     */
    AcLayerComponent.prototype.updateNotification = function (notification) {
        this._updateStream.next(notification);
    };
    /**
     * add/update entity to/from the layer
     */
    AcLayerComponent.prototype.update = function (entity, id) {
        this._updateStream.next({ entity: entity, id: id, actionType: ActionType.ADD_UPDATE });
    };
    AcLayerComponent.prototype.refreshAll = function (collection) {
        var _this = this;
        // TODO make entity interface: collection of type entity not notification
        from(collection).subscribe(function (entity) { return _this._updateStream.next(entity); });
    };
    AcLayerComponent.ctorParameters = function () { return [
        { type: LayerService },
        { type: ComputationCache },
        { type: MapLayersService },
        { type: BillboardDrawerService },
        { type: LabelDrawerService },
        { type: EllipseDrawerService },
        { type: PolylineDrawerService },
        { type: PolygonDrawerService },
        { type: ArcDrawerService },
        { type: PointDrawerService },
        { type: ModelDrawerService },
        { type: BoxDrawerService },
        { type: CorridorDrawerService },
        { type: CylinderDrawerService },
        { type: EllipsoidDrawerService },
        { type: PolylineVolumeDrawerService },
        { type: WallDrawerService },
        { type: RectangleDrawerService },
        { type: DynamicEllipseDrawerService },
        { type: DynamicPolylineDrawerService },
        { type: StaticCircleDrawerService },
        { type: StaticPolylineDrawerService },
        { type: StaticPolygonDrawerService },
        { type: StaticEllipseDrawerService },
        { type: PolylinePrimitiveDrawerService },
        { type: LabelPrimitiveDrawerService },
        { type: BillboardPrimitiveDrawerService },
        { type: PointPrimitiveDrawerService },
        { type: HtmlDrawerService },
        { type: CzmlDrawerService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "show", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcLayerComponent.prototype, "acFor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "context", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "store", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "zIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcLayerComponent.prototype, "debug", void 0);
    AcLayerComponent = __decorate([
        Component({
            selector: 'ac-layer',
            template: '<ng-content></ng-content>',
            providers: [
                LayerService,
                ComputationCache,
                BillboardDrawerService,
                LabelDrawerService,
                EllipseDrawerService,
                PolylineDrawerService,
                ArcDrawerService,
                PointDrawerService,
                PolygonDrawerService,
                ModelDrawerService,
                BoxDrawerService,
                CorridorDrawerService,
                CylinderDrawerService,
                EllipsoidDrawerService,
                PolylineVolumeDrawerService,
                WallDrawerService,
                RectangleDrawerService,
                PolylinePrimitiveDrawerService,
                LabelPrimitiveDrawerService,
                BillboardPrimitiveDrawerService,
                PointPrimitiveDrawerService,
                HtmlDrawerService,
                CzmlDrawerService,
                DynamicEllipseDrawerService,
                DynamicPolylineDrawerService,
                StaticCircleDrawerService,
                StaticPolylineDrawerService,
                StaticPolygonDrawerService,
                StaticEllipseDrawerService,
            ],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [LayerService,
            ComputationCache,
            MapLayersService,
            BillboardDrawerService,
            LabelDrawerService,
            EllipseDrawerService,
            PolylineDrawerService,
            PolygonDrawerService,
            ArcDrawerService,
            PointDrawerService,
            ModelDrawerService,
            BoxDrawerService,
            CorridorDrawerService,
            CylinderDrawerService,
            EllipsoidDrawerService,
            PolylineVolumeDrawerService,
            WallDrawerService,
            RectangleDrawerService,
            DynamicEllipseDrawerService,
            DynamicPolylineDrawerService,
            StaticCircleDrawerService,
            StaticPolylineDrawerService,
            StaticPolygonDrawerService,
            StaticEllipseDrawerService,
            PolylinePrimitiveDrawerService,
            LabelPrimitiveDrawerService,
            BillboardPrimitiveDrawerService,
            PointPrimitiveDrawerService,
            HtmlDrawerService,
            CzmlDrawerService])
    ], AcLayerComponent);
    return AcLayerComponent;
}());

/**
 *  Extend this class to create drawing on map components.
 */
var EntityOnMapComponent = /** @class */ (function () {
    function EntityOnMapComponent(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    EntityOnMapComponent.prototype.ngOnInit = function () {
        this.selfPrimitiveIsDraw = false;
        var dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    };
    EntityOnMapComponent.prototype.ngOnChanges = function (changes) {
        var props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    };
    EntityOnMapComponent.prototype.drawOnMap = function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    };
    EntityOnMapComponent.prototype.removeFromMap = function () {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    };
    EntityOnMapComponent.prototype.updateOnMap = function () {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    };
    EntityOnMapComponent.prototype.ngOnDestroy = function () {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    };
    EntityOnMapComponent.ctorParameters = function () { return [
        { type: BasicDrawerService },
        { type: MapLayersService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], EntityOnMapComponent.prototype, "props", void 0);
    EntityOnMapComponent = __decorate([
        Directive(),
        __metadata("design:paramtypes", [BasicDrawerService, MapLayersService])
    ], EntityOnMapComponent);
    return EntityOnMapComponent;
}());

/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }">;
 *    </ac-billboard>
 *  ```
 */
var AcBillboardComponent = /** @class */ (function (_super) {
    __extends(AcBillboardComponent, _super);
    function AcBillboardComponent(billboardDrawer, mapLayers) {
        return _super.call(this, billboardDrawer, mapLayers) || this;
    }
    AcBillboardComponent.ctorParameters = function () { return [
        { type: BillboardDrawerService },
        { type: MapLayersService }
    ]; };
    AcBillboardComponent = __decorate([
        Component({
            selector: 'ac-billboard',
            template: ''
        }),
        __metadata("design:paramtypes", [BillboardDrawerService, MapLayersService])
    ], AcBillboardComponent);
    return AcBillboardComponent;
}(EntityOnMapComponent));

var JsonMapper = /** @class */ (function () {
    function JsonMapper() {
        this._mapper = new JsonStringMapper();
    }
    JsonMapper.prototype.map = function (expression) {
        return this._mapper.map(expression);
    };
    JsonMapper = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], JsonMapper);
    return JsonMapper;
}());

/**
 * Service for effective assignment.
 */
var SmartAssigner = /** @class */ (function () {
    function SmartAssigner() {
    }
    SmartAssigner.create = function (props, allowUndefined) {
        if (props === void 0) { props = []; }
        if (allowUndefined === void 0) { allowUndefined = true; }
        var fnBody = "";
        props.forEach(function (prop) {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += "if (!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty) && obj2['" + prop + "'] !== undefined) { obj1['" + prop + "'] = obj2['" + prop + "']; } ";
            }
            else {
                fnBody += "if(!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty))obj1['" + prop + "'] = obj2['" + prop + "']; ";
            }
        });
        fnBody += "return obj1";
        var assignFn = new Function('obj1', 'obj2', fnBody);
        return function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        };
    };
    return SmartAssigner;
}());

var CesiumProperties = /** @class */ (function () {
    function CesiumProperties(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    CesiumProperties.prototype._compile = function (expression, withCache) {
        var _this = this;
        if (withCache === void 0) { withCache = true; }
        var cesiumDesc = {};
        var propsMap = new Map();
        var resultMap = this._jsonMapper.map(expression);
        resultMap.forEach(function (resultExpression, prop) { return propsMap.set(prop, {
            expression: resultExpression,
            get: _this._parser.eval(resultExpression)
        }); });
        propsMap.forEach(function (value, prop) {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = "cache.get(`" + value.expression + "`, () => propsMap.get('" + prop + "').get(context))";
            }
            else {
                cesiumDesc[prop || 'undefined'] = "propsMap.get('" + prop + "').get(context)";
            }
        });
        var fnBody = "return " + JSON.stringify(cesiumDesc).replace(/"/g, '') + ";";
        var getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        };
    };
    CesiumProperties.prototype._build = function (expression) {
        var props = Array.from(this._jsonMapper.map(expression).keys());
        var smartAssigner = SmartAssigner.create(props);
        return function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        };
    };
    CesiumProperties.prototype.createEvaluator = function (expression, withCache, newEvaluator) {
        if (withCache === void 0) { withCache = true; }
        if (newEvaluator === void 0) { newEvaluator = false; }
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        var evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    };
    CesiumProperties.prototype.createAssigner = function (expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        var assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    };
    CesiumProperties.ctorParameters = function () { return [
        { type: Parse },
        { type: JsonMapper }
    ]; };
    CesiumProperties = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Parse,
            JsonMapper])
    ], CesiumProperties);
    return CesiumProperties;
}());

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
var BasicDesc = /** @class */ (function () {
    function BasicDesc(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    BasicDesc.prototype._propsEvaluator = function (context) {
        return this._propsEvaluateFn(this._computationCache, context);
    };
    BasicDesc.prototype._getPropsAssigner = function () {
        var _this = this;
        return function (cesiumObject, desc) { return _this._propsAssignerFn(cesiumObject, desc); };
    };
    BasicDesc.prototype.getLayerService = function () {
        return this._layerService;
    };
    BasicDesc.prototype.setLayerService = function (layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    BasicDesc.prototype.ngOnInit = function () {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    BasicDesc.prototype.getCesiumObjectsMap = function () {
        return this._cesiumObjectsMap;
    };
    BasicDesc.prototype.draw = function (context, id, entity) {
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            var cesiumObject = this._drawer.add(cesiumProps);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._cesiumObjectsMap.set(id, cesiumObject);
        }
        else {
            var cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    };
    BasicDesc.prototype.remove = function (id) {
        var cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    };
    BasicDesc.prototype.removeAll = function () {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    BasicDesc.prototype.ngOnDestroy = function () {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    };
    BasicDesc.ctorParameters = function () { return [
        { type: BasicDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicDesc.prototype, "props", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BasicDesc.prototype, "onDraw", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BasicDesc.prototype, "onRemove", void 0);
    BasicDesc = __decorate([
        Directive(),
        __metadata("design:paramtypes", [BasicDrawerService,
            LayerService,
            ComputationCache,
            CesiumProperties])
    ], BasicDesc);
    return BasicDesc;
}());

/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-desc>
 *  ```
 */
var AcBillboardDescComponent = /** @class */ (function (_super) {
    __extends(AcBillboardDescComponent, _super);
    function AcBillboardDescComponent(billboardDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardDescComponent_1 = AcBillboardDescComponent;
    var AcBillboardDescComponent_1;
    AcBillboardDescComponent.ctorParameters = function () { return [
        { type: BillboardDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcBillboardDescComponent = AcBillboardDescComponent_1 = __decorate([
        Component({
            selector: 'ac-billboard-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcBillboardDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [BillboardDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcBillboardDescComponent);
    return AcBillboardDescComponent;
}(BasicDesc));

/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-layer element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-ellipse-desc props="{
 *      position: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      height: 0
 *    }">
 *    </ac-ellipse-desc>
 *  ```
 */
var AcEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcEllipseDescComponent, _super);
    function AcEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcEllipseDescComponent_1 = AcEllipseDescComponent;
    var AcEllipseDescComponent_1;
    AcEllipseDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcEllipseDescComponent = AcEllipseDescComponent_1 = __decorate([
        Component({
            selector: 'ac-ellipse-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcEllipseDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcEllipseDescComponent);
    return AcEllipseDescComponent;
}(BasicDesc));

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and PolylineGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-desc>
 * ```
 */
var AcPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylineDescComponent, _super);
    function AcPolylineDescComponent(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylineDescComponent_1 = AcPolylineDescComponent;
    var AcPolylineDescComponent_1;
    AcPolylineDescComponent.ctorParameters = function () { return [
        { type: PolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPolylineDescComponent = AcPolylineDescComponent_1 = __decorate([
        Component({
            selector: 'ac-polyline-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcPolylineDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [PolylineDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPolylineDescComponent);
    return AcPolylineDescComponent;
}(BasicDesc));

/**
 * @example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
var PixelOffsetPipe = /** @class */ (function () {
    function PixelOffsetPipe() {
    }
    PixelOffsetPipe.prototype.transform = function (value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    };
    PixelOffsetPipe = __decorate([
        Pipe({
            name: 'pixelOffset'
        })
    ], PixelOffsetPipe);
    return PixelOffsetPipe;
}());

var RadiansToDegreesPipe = /** @class */ (function () {
    function RadiansToDegreesPipe() {
    }
    RadiansToDegreesPipe.prototype.transform = function (value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    };
    RadiansToDegreesPipe = __decorate([
        Pipe({
            name: 'radiansToDegrees'
        })
    ], RadiansToDegreesPipe);
    return RadiansToDegreesPipe;
}());

/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-desc>
 *  ```
 */
var AcLabelDescComponent = /** @class */ (function (_super) {
    __extends(AcLabelDescComponent, _super);
    function AcLabelDescComponent(labelDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelDescComponent_1 = AcLabelDescComponent;
    var AcLabelDescComponent_1;
    AcLabelDescComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcLabelDescComponent = AcLabelDescComponent_1 = __decorate([
        Component({
            selector: 'ac-label-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcLabelDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [LabelDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcLabelDescComponent);
    return AcLabelDescComponent;
}(BasicDesc));

var UtilsModule = /** @class */ (function () {
    function UtilsModule() {
    }
    UtilsModule = __decorate([
        NgModule({
            imports: [CommonModule],
            providers: []
        })
    ], UtilsModule);
    return UtilsModule;
}());

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *__Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
var AcCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcCircleDescComponent, _super);
    function AcCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcCircleDescComponent_1 = AcCircleDescComponent;
    AcCircleDescComponent.prototype._propsEvaluator = function (context) {
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    };
    AcCircleDescComponent.prototype._getPropsAssigner = function () {
        return function (cesiumObject, desc) { return Object.assign(cesiumObject, desc); };
    };
    var AcCircleDescComponent_1;
    AcCircleDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCircleDescComponent = AcCircleDescComponent_1 = __decorate([
        Component({
            selector: 'ac-circle-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcCircleDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCircleDescComponent);
    return AcCircleDescComponent;
}(BasicDesc));

/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-layer element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc props="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius,
 *          color : arc.color - The color should be Cesium.Color type
 *    }">
 *    </ac-arc-desc>
 *    ```
 *
 *    description of the props :
 *    center - The arc is a section of an outline of a circle, This is the center of the circle
 *    angle - the initial angle of the arc in radians
 *    delta - the spreading of the arc,
 *    radius - the distance from the center to the arc
 *
 *    for example :
 *    angle - 0
 *    delta - π
 *
 *    will draw an half circle
 */
var AcArcDescComponent = /** @class */ (function (_super) {
    __extends(AcArcDescComponent, _super);
    function AcArcDescComponent(arcDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, arcDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcArcDescComponent_1 = AcArcDescComponent;
    var AcArcDescComponent_1;
    AcArcDescComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcArcDescComponent = AcArcDescComponent_1 = __decorate([
        Component({
            selector: 'ac-arc-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcArcDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [ArcDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcArcDescComponent);
    return AcArcDescComponent;
}(BasicDesc));

/**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= new AcEntity({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
var AcEntity = /** @class */ (function () {
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    function AcEntity(json) {
        Object.assign(this, json);
    }
    /**
     * Creates entity from a json
     * @param json entity object
     * @returns entity as AcEntity
     */
    AcEntity.create = function (json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    };
    return AcEntity;
}());

var AcNotification = /** @class */ (function () {
    function AcNotification() {
    }
    return AcNotification;
}());

var MapLayerProviderOptions;
(function (MapLayerProviderOptions) {
    MapLayerProviderOptions[MapLayerProviderOptions["ArcGisMapServer"] = Cesium.ArcGisMapServerImageryProvider] = "ArcGisMapServer";
    MapLayerProviderOptions[MapLayerProviderOptions["WebMapTileService"] = Cesium.WebMapTileServiceImageryProvider] = "WebMapTileService";
    MapLayerProviderOptions[MapLayerProviderOptions["MapTileService"] = Cesium.TileMapServiceImageryProvider] = "MapTileService";
    MapLayerProviderOptions[MapLayerProviderOptions["WebMapService"] = Cesium.WebMapServiceImageryProvider] = "WebMapService";
    MapLayerProviderOptions[MapLayerProviderOptions["SingleTileImagery"] = Cesium.SingleTileImageryProvider] = "SingleTileImagery";
    MapLayerProviderOptions[MapLayerProviderOptions["OpenStreetMap"] = Cesium.OpenStreetMapImageryProvider] = "OpenStreetMap";
    MapLayerProviderOptions[MapLayerProviderOptions["BingMaps"] = Cesium.BingMapsImageryProvider] = "BingMaps";
    MapLayerProviderOptions[MapLayerProviderOptions["GoogleEarthEnterpriseMaps"] = Cesium.GoogleEarthEnterpriseMapsProvider] = "GoogleEarthEnterpriseMaps";
    MapLayerProviderOptions[MapLayerProviderOptions["MapBox"] = Cesium.MapboxImageryProvider] = "MapBox";
    MapLayerProviderOptions[MapLayerProviderOptions["UrlTemplateImagery"] = Cesium.UrlTemplateImageryProvider] = "UrlTemplateImagery";
    MapLayerProviderOptions[MapLayerProviderOptions["OFFLINE"] = null] = "OFFLINE";
})(MapLayerProviderOptions || (MapLayerProviderOptions = {}));

var MapTerrainProviderOptions;
(function (MapTerrainProviderOptions) {
    MapTerrainProviderOptions[MapTerrainProviderOptions["CesiumTerrain"] = Cesium.CesiumTerrainProvider] = "CesiumTerrain";
    MapTerrainProviderOptions[MapTerrainProviderOptions["ArcGISTiledElevation"] = Cesium.ArcGISTiledElevationTerrainProvider] = "ArcGISTiledElevation";
    MapTerrainProviderOptions[MapTerrainProviderOptions["GoogleEarthEnterprise"] = Cesium.GoogleEarthEnterpriseTerrainProvider] = "GoogleEarthEnterprise";
    MapTerrainProviderOptions[MapTerrainProviderOptions["VRTheWorld"] = Cesium.VRTheWorldTerrainProvider] = "VRTheWorld";
    MapTerrainProviderOptions[MapTerrainProviderOptions["Ellipsoid"] = Cesium.EllipsoidTerrainProvider] = "Ellipsoid";
    MapTerrainProviderOptions[MapTerrainProviderOptions["WorldTerrain"] = Cesium.createWorldTerrain] = "WorldTerrain";
})(MapTerrainProviderOptions || (MapTerrainProviderOptions = {}));

/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
var AcMapLayerProviderComponent = /** @class */ (function () {
    function AcMapLayerProviderComponent(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
         */
        this.options = {};
        /**
         * the provider
         */
        this.provider = MapLayerProviderOptions.OFFLINE;
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        /**
         * The alpha blending value of this layer: 0.0 to 1.0
         */
        this.alpha = 1.0;
        /**
         * The brightness of this layer: 0.0 to 1.0
         */
        this.brightness = 1.0;
        /**
         * The contrast of this layer: 0.0 to 1.0
         */
        this.contrast = 1.0;
        this.imageryLayersCollection = this.cesiumService.getScene().imageryLayers;
    }
    AcMapLayerProviderComponent.prototype.createOfflineMapProvider = function () {
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    };
    AcMapLayerProviderComponent.prototype.ngOnInit = function () {
        if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
            throw new Error('options must have a url');
        }
        switch (this.provider) {
            case MapLayerProviderOptions.WebMapService:
            case MapLayerProviderOptions.WebMapTileService:
            case MapLayerProviderOptions.ArcGisMapServer:
            case MapLayerProviderOptions.SingleTileImagery:
            case MapLayerProviderOptions.BingMaps:
            case MapLayerProviderOptions.GoogleEarthEnterpriseMaps:
            case MapLayerProviderOptions.MapBox:
            case MapLayerProviderOptions.UrlTemplateImagery:
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.OFFLINE:
                this.layerProvider = this.createOfflineMapProvider();
                break;
            default:
                console.log('ac-map-layer-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.layerProvider = this.createOfflineMapProvider();
                break;
        }
        if (this.show) {
            this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
            this.imageryLayer.alpha = this.alpha;
            this.imageryLayer.contrast = this.contrast;
            this.imageryLayer.brightness = this.brightness;
        }
    };
    AcMapLayerProviderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            var showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.imageryLayer) {
                    this.imageryLayersCollection.add(this.imageryLayer, this.index);
                }
                else {
                    this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
                    this.imageryLayer.alpha = this.alpha;
                    this.imageryLayer.contrast = this.contrast;
                    this.imageryLayer.brightness = this.brightness;
                }
            }
            else if (this.imageryLayer) {
                this.imageryLayersCollection.remove(this.imageryLayer, false);
            }
        }
        if (changes['alpha'] && !changes['alpha'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.alpha = this.alpha;
        }
        if (changes['contrast'] && !changes['contrast'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.contrast = this.contrast;
        }
        if (changes['brightness'] && !changes['brightness'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.brightness = this.brightness;
        }
    };
    AcMapLayerProviderComponent.prototype.ngOnDestroy = function () {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    };
    AcMapLayerProviderComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "provider", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AcMapLayerProviderComponent.prototype, "index", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "show", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "alpha", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "brightness", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapLayerProviderComponent.prototype, "contrast", void 0);
    AcMapLayerProviderComponent = __decorate([
        Component({
            selector: 'ac-map-layer-provider',
            template: ''
        }),
        __metadata("design:paramtypes", [CesiumService])
    ], AcMapLayerProviderComponent);
    return AcMapLayerProviderComponent;
}());

/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
var AcMapTerrainProviderComponent = /** @class */ (function () {
    function AcMapTerrainProviderComponent(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
    }
    AcMapTerrainProviderComponent.prototype.ngOnInit = function () {
        if (!Checker.present(this.options.url)
            && this.provider !== MapTerrainProviderOptions.Ellipsoid
            && this.provider !== MapTerrainProviderOptions.WorldTerrain) {
            throw new Error('options must have a url');
        }
        this.defaultTerrainProvider = this.cesiumService.getViewer().terrainProvider;
        switch (this.provider) {
            case MapTerrainProviderOptions.CesiumTerrain:
            case MapTerrainProviderOptions.ArcGISTiledElevation:
            case MapTerrainProviderOptions.GoogleEarthEnterprise:
            case MapTerrainProviderOptions.VRTheWorld:
            case MapTerrainProviderOptions.Ellipsoid:
                this.terrainProvider = new this.provider(this.options);
                break;
            case MapTerrainProviderOptions.WorldTerrain:
                this.terrainProvider = this.provider(this.options);
                break;
            default:
                console.log('ac-map-terrain-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.terrainProvider = this.defaultTerrainProvider;
                break;
        }
        if (this.show) {
            this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
        }
    };
    AcMapTerrainProviderComponent.prototype.ngOnChanges = function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            var showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.terrainProvider) {
                    this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
                }
            }
            else {
                this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
            }
        }
    };
    AcMapTerrainProviderComponent.prototype.ngOnDestroy = function () {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
    };
    AcMapTerrainProviderComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapTerrainProviderComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapTerrainProviderComponent.prototype, "provider", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcMapTerrainProviderComponent.prototype, "show", void 0);
    AcMapTerrainProviderComponent = __decorate([
        Component({
            selector: 'ac-map-terrain-provider',
            template: ''
        }),
        __metadata("design:paramtypes", [CesiumService])
    ], AcMapTerrainProviderComponent);
    return AcMapTerrainProviderComponent;
}());

/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-point-desc props="{
 *     pixelSize : point.pixelSize, //optional
 *     position : point.positions,
 *     color : point.color  //optional
 *   }">
 *   </ac-point-desc>
 *  ```
 */
var AcPointDescComponent = /** @class */ (function (_super) {
    __extends(AcPointDescComponent, _super);
    function AcPointDescComponent(pointDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointDescComponent_1 = AcPointDescComponent;
    var AcPointDescComponent_1;
    AcPointDescComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPointDescComponent = AcPointDescComponent_1 = __decorate([
        Component({
            selector: 'ac-point-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcPointDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [PointDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPointDescComponent);
    return AcPointDescComponent;
}(BasicDesc));

/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
var AcLabelComponent = /** @class */ (function (_super) {
    __extends(AcLabelComponent, _super);
    function AcLabelComponent(labelDrawer, mapLayers) {
        return _super.call(this, labelDrawer, mapLayers) || this;
    }
    AcLabelComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: MapLayersService }
    ]; };
    AcLabelComponent = __decorate([
        Component({
            selector: 'ac-label',
            template: ''
        }),
        __metadata("design:paramtypes", [LabelDrawerService, MapLayersService])
    ], AcLabelComponent);
    return AcLabelComponent;
}(EntityOnMapComponent));

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
var AcPolylineComponent = /** @class */ (function (_super) {
    __extends(AcPolylineComponent, _super);
    function AcPolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPolylineComponent.ctorParameters = function () { return [
        { type: PolylineDrawerService },
        { type: MapLayersService }
    ]; };
    AcPolylineComponent = __decorate([
        Component({
            selector: 'ac-polyline',
            template: ''
        }),
        __metadata("design:paramtypes", [PolylineDrawerService, MapLayersService])
    ], AcPolylineComponent);
    return AcPolylineComponent;
}(EntityOnMapComponent));

/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-ellipse [props]="{
 *    position: position,
 *    semiMajorAxis:40000.0,
 *    semiMinorAxis:25000.0,
 *    rotation : 0.785398
 *  }">
 *  </ac-ellipse>
 *  ```
 */
var AcEllipseComponent = /** @class */ (function (_super) {
    __extends(AcEllipseComponent, _super);
    function AcEllipseComponent(ellipseDrawer, mapLayers) {
        return _super.call(this, ellipseDrawer, mapLayers) || this;
    }
    AcEllipseComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    AcEllipseComponent = __decorate([
        Component({
            selector: 'ac-ellipse',
            template: ''
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, MapLayersService])
    ], AcEllipseComponent);
    return AcEllipseComponent;
}(EntityOnMapComponent));

/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-point [props]="{
 *    position: position,
 *    width: 3
 *  }">
 *  </ac-point>
 *  ```
 */
var AcPointComponent = /** @class */ (function (_super) {
    __extends(AcPointComponent, _super);
    function AcPointComponent(pointDrawer, mapLayers) {
        return _super.call(this, pointDrawer, mapLayers) || this;
    }
    AcPointComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: MapLayersService }
    ]; };
    AcPointComponent = __decorate([
        Component({
            selector: 'ac-point',
            template: ''
        }),
        __metadata("design:paramtypes", [PointDrawerService, MapLayersService])
    ], AcPointComponent);
    return AcPointComponent;
}(EntityOnMapComponent));

/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-map element.
 *  __Usage:__
 *  ```
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
var AcHtmlComponent = /** @class */ (function () {
    function AcHtmlComponent(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    AcHtmlComponent.prototype.setScreenPosition = function (screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', screenPosition.y + "px");
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', screenPosition.x + "px");
        }
    };
    AcHtmlComponent.prototype.ngOnInit = function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    };
    AcHtmlComponent.prototype.remove = function () {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    };
    AcHtmlComponent.prototype.hideElement = function () {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', "none");
    };
    AcHtmlComponent.prototype.add = function () {
        var _this = this;
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = function () {
                var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.cesiumService.getScene(), _this.props.position);
                _this.setScreenPosition(screenPosition);
            };
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', "block");
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    };
    AcHtmlComponent.prototype.ngDoCheck = function () {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    };
    AcHtmlComponent.prototype.ngOnDestroy = function () {
        this.remove();
    };
    AcHtmlComponent.ctorParameters = function () { return [
        { type: CesiumService },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcHtmlComponent.prototype, "props", void 0);
    AcHtmlComponent = __decorate([
        Component({
            selector: 'ac-html',
            template: "<ng-content></ng-content>",
            styles: [":host {\n                position: absolute;\n                z-index: 100;\n\t\t\t\t}"]
        }),
        __metadata("design:paramtypes", [CesiumService, ElementRef, Renderer2])
    ], AcHtmlComponent);
    return AcHtmlComponent;
}());

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */
var AcCircleComponent = /** @class */ (function (_super) {
    __extends(AcCircleComponent, _super);
    function AcCircleComponent(ellipseDrawerService, mapLayers) {
        return _super.call(this, ellipseDrawerService, mapLayers) || this;
    }
    AcCircleComponent.prototype.updateEllipseProps = function () {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    };
    AcCircleComponent.prototype.drawOnMap = function () {
        this.updateEllipseProps();
        _super.prototype.drawOnMap.call(this);
    };
    AcCircleComponent.prototype.updateOnMap = function () {
        this.updateEllipseProps();
        _super.prototype.updateOnMap.call(this);
    };
    AcCircleComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    AcCircleComponent = __decorate([
        Component({
            selector: 'ac-circle',
            template: ''
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, MapLayersService])
    ], AcCircleComponent);
    return AcCircleComponent;
}(EntityOnMapComponent));

/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */
var AcArcComponent = /** @class */ (function (_super) {
    __extends(AcArcComponent, _super);
    function AcArcComponent(arcDrawer, mapLayers) {
        return _super.call(this, arcDrawer, mapLayers) || this;
    }
    AcArcComponent.prototype.updateOnMap = function () {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    };
    AcArcComponent.prototype.drawOnMap = function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    };
    AcArcComponent.prototype.ngOnChanges = function (changes) {
        var geometryProps = changes['geometryProps'];
        var instanceProps = changes['instanceProps'];
        var primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    };
    AcArcComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: MapLayersService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "geometryProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "instanceProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "primitiveProps", void 0);
    AcArcComponent = __decorate([
        Component({
            selector: 'ac-arc',
            template: ''
        }),
        __metadata("design:paramtypes", [ArcDrawerService, MapLayersService])
    ], AcArcComponent);
    return AcArcComponent;
}(EntityOnMapComponent));

/**
 *  This is a polygon implementation.
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon-desc props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon-desc>
 *  ```
 */
var AcPolygonDescComponent = /** @class */ (function (_super) {
    __extends(AcPolygonDescComponent, _super);
    function AcPolygonDescComponent(polygonDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polygonDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolygonDescComponent_1 = AcPolygonDescComponent;
    var AcPolygonDescComponent_1;
    AcPolygonDescComponent.ctorParameters = function () { return [
        { type: PolygonDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPolygonDescComponent = AcPolygonDescComponent_1 = __decorate([
        Component({
            selector: 'ac-polygon-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcPolygonDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [PolygonDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPolygonDescComponent);
    return AcPolygonDescComponent;
}(BasicDesc));

var AcDefaultPlonterComponent = /** @class */ (function () {
    function AcDefaultPlonterComponent(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    AcDefaultPlonterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.plonterService.plonterChangeNotifier.subscribe(function () { return _this.cd.detectChanges(); });
    };
    Object.defineProperty(AcDefaultPlonterComponent.prototype, "plonterPosition", {
        get: function () {
            if (this.plonterService.plonterShown) {
                var screenPos = this.plonterService.plonterClickPosition.endPosition;
                return this.geoConverter.screenToCartesian3(screenPos);
            }
        },
        enumerable: true,
        configurable: true
    });
    AcDefaultPlonterComponent.prototype.chooseEntity = function (entity) {
        this.plonterService.resolvePlonter(entity);
    };
    AcDefaultPlonterComponent.ctorParameters = function () { return [
        { type: PlonterService },
        { type: ChangeDetectorRef },
        { type: CoordinateConverter }
    ]; };
    AcDefaultPlonterComponent = __decorate([
        Component({
            selector: 'ac-default-plonter',
            template: "\n      <ac-html *ngIf=\"plonterService.plonterShown\" [props]=\"{\n        position: plonterPosition\n      }\">\n        <div class=\"plonter-context-menu\">\n          <div *ngFor=\"let entity of plonterService.entitesToPlonter\">\n            <div class=\"plonter-item\" (click)=\"chooseEntity(entity)\">{{ entity?.name || entity?.id }}\n            </div>\n          </div>\n        </div>\n      </ac-html>\n    ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [CoordinateConverter],
            styles: ["\n        .plonter-context-menu {\n            background-color: rgba(250, 250, 250, 0.8);\n            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);\n        }\n\n        .plonter-item {\n            cursor: pointer;\n            padding: 2px 15px;\n            text-align: start;\n        }\n\n        .plonter-item:hover {\n            background-color: rgba(0, 0, 0, 0.15);\n        }\n\n    "]
        }),
        __metadata("design:paramtypes", [PlonterService,
            ChangeDetectorRef,
            CoordinateConverter])
    ], AcDefaultPlonterComponent);
    return AcDefaultPlonterComponent;
}());

/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
var AcPolygonComponent = /** @class */ (function (_super) {
    __extends(AcPolygonComponent, _super);
    function AcPolygonComponent(polygonDrawer, mapLayers) {
        return _super.call(this, polygonDrawer, mapLayers) || this;
    }
    AcPolygonComponent.ctorParameters = function () { return [
        { type: PolygonDrawerService },
        { type: MapLayersService }
    ]; };
    AcPolygonComponent = __decorate([
        Component({
            selector: 'ac-polygon',
            template: ''
        }),
        __metadata("design:paramtypes", [PolygonDrawerService, MapLayersService])
    ], AcPolygonComponent);
    return AcPolygonComponent;
}(EntityOnMapComponent));

var BasicStaticPrimitiveDesc = /** @class */ (function (_super) {
    __extends(BasicStaticPrimitiveDesc, _super);
    function BasicStaticPrimitiveDesc(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        var _this = _super.call(this, _staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
        _this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
        return _this;
    }
    BasicStaticPrimitiveDesc.prototype.ngOnInit = function () {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    };
    BasicStaticPrimitiveDesc.prototype.draw = function (context, id, entity) {
        var geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        var instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        var primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            var primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            var primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    };
    BasicStaticPrimitiveDesc.ctorParameters = function () { return [
        { type: StaticPrimitiveDrawer },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "geometryProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "instanceProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "primitiveProps", void 0);
    BasicStaticPrimitiveDesc = __decorate([
        Directive(),
        __metadata("design:paramtypes", [StaticPrimitiveDrawer, LayerService,
            ComputationCache, CesiumProperties])
    ], BasicStaticPrimitiveDesc);
    return BasicStaticPrimitiveDesc;
}(BasicDesc));

/**
 *
 * @deprecated use ac-ellipse-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an ellipse.
 *  __usage:__
 *  ```
 *  &lt;ac-static-ellipse-desc-desc
 *      geometryProps="{
 *          center: ellipse.geometry.center,
 *          semiMajorAxis: ellipse.geometry.semiMajorAxis,
 *          semiMinorAxis: ellipse.geometry.semiMinorAxis,
 *          height: ellipse.geometry.height,
 *          rotation: ellipse.geometry.rotation
 *      }"
 *      instanceProps="{
 *          attributes: ellipse.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: ellipse.appearance //Optional
 *      }"&gt;
 *  &lt;/ac-static-ellipse-desc-desc&gt;
 *  ```
 */
var AcStaticEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticEllipseDescComponent, _super);
    function AcStaticEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticEllipseDescComponent.ctorParameters = function () { return [
        { type: StaticEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticEllipseDescComponent = __decorate([
        Component({
            selector: 'ac-static-ellipse-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticEllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticEllipseDescComponent);
    return AcStaticEllipseDescComponent;
}(BasicStaticPrimitiveDesc));

/**
 *
 *
 *  This is a dynamic(position is updatable) implementation of an ellipse.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-dynamic-ellipse-desc props="{
 *      center: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    ">
 *    &lt;/ac-dynamic-ellipse-desc&gt;
 *  ```
 *  __param:__ {Cesium.Cartesian3} center
 *  __param:__ {number} semiMajorAxis
 *  __param:__ {number} semiMinorAxis
 *  __param:__ {number} rotation
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
var AcDynamicEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicEllipseDescComponent, _super);
    function AcDynamicEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicEllipseDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcDynamicEllipseDescComponent = __decorate([
        Component({
            selector: 'ac-dynamic-ellipse-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [DynamicEllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcDynamicEllipseDescComponent);
    return AcDynamicEllipseDescComponent;
}(BasicDesc));

// tslint:enable
/**
 * @deprecated use ac-polylinc-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-dynamic-polyline-desc element must be a child of ac-layer element.
 *  __Usage:__
 *  ```
 *    &lt;ac-dynamic-polyline-desc props="{width : polyline.width, //optional
 *                                      positions: polyline.positions,
 *                                      material: polyline.material //optional
 *                                      }"
 *    &gt;
 *    &lt;/ac-dynamic-polyline-desc&gt;
 * ```
 */
var AcDynamicPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicPolylineDescComponent, _super);
    function AcDynamicPolylineDescComponent(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicPolylineDescComponent.ctorParameters = function () { return [
        { type: DynamicPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcDynamicPolylineDescComponent = __decorate([
        Component({
            selector: 'ac-dynamic-polyline-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [DynamicPolylineDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcDynamicPolylineDescComponent);
    return AcDynamicPolylineDescComponent;
}(BasicDesc));

// tslint:enable
/**
 * @deprecated use ac-ploygon-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of a polygon.
 *  __Usage:__
 *  ```
 *    &lt;ac-static-polygon-desc
 *          geometryProps="{
 *                     polygonHierarchy: polygon.geometry.polygonHierarchy,
 *                     height: polygon.geometry.height,
 *                     granularity: polygon.geometry.granularity
 *                 }"
 *          instanceProps="{
 *                     attributes: polygon.attributes
 *                 }"
 *          primitiveProps="{
 *                     appearance: polygon.appearance
 *                 }"
 *    &gt;&lt;/ac-static-polygon-desc&gt;
 *    ```
 */
var AcStaticPolygonDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticPolygonDescComponent, _super);
    function AcStaticPolygonDescComponent(polygonDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polygonDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolygonDescComponent.ctorParameters = function () { return [
        { type: StaticPolygonDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticPolygonDescComponent = __decorate([
        Component({
            selector: 'ac-static-polygon-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticPolygonDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticPolygonDescComponent);
    return AcStaticPolygonDescComponent;
}(BasicStaticPrimitiveDesc));

/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
var AcStaticCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticCircleDescComponent, _super);
    function AcStaticCircleDescComponent(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, staticCircleDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticCircleDescComponent.ctorParameters = function () { return [
        { type: StaticCircleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticCircleDescComponent = __decorate([
        Component({
            selector: 'ac-static-circle',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticCircleDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticCircleDescComponent);
    return AcStaticCircleDescComponent;
}(BasicStaticPrimitiveDesc));

/**
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cesium.Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
var AcDynamicCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicCircleDescComponent, _super);
    function AcDynamicCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicCircleDescComponent.prototype._propsEvaluator = function (context) {
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    };
    AcDynamicCircleDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcDynamicCircleDescComponent = __decorate([
        Component({
            selector: 'ac-dynamic-circle-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [DynamicEllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcDynamicCircleDescComponent);
    return AcDynamicCircleDescComponent;
}(BasicDesc));

// tslint:enable
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new Cesium.PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
var AcStaticPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticPolylineDescComponent, _super);
    function AcStaticPolylineDescComponent(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolylineDescComponent.ctorParameters = function () { return [
        { type: StaticPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticPolylineDescComponent = __decorate([
        Component({
            selector: 'ac-static-polyline-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticPolylineDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticPolylineDescComponent);
    return AcStaticPolylineDescComponent;
}(BasicStaticPrimitiveDesc));

/**
 *  This is a model implementation.
 *  The ac-model element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and ModelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/ModelGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-model-desc props="{
 *       position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 *       uri : '../../SampleData/models/CesiumGround/Cesium_Ground.gltf'
 *   }
 *    }">
 *    </ac-model-desc>
 *  ```
 */
var AcModelDescComponent = /** @class */ (function (_super) {
    __extends(AcModelDescComponent, _super);
    function AcModelDescComponent(modelDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, modelDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcModelDescComponent_1 = AcModelDescComponent;
    var AcModelDescComponent_1;
    AcModelDescComponent.ctorParameters = function () { return [
        { type: ModelDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcModelDescComponent = AcModelDescComponent_1 = __decorate([
        Component({
            selector: 'ac-model-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcModelDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [ModelDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcModelDescComponent);
    return AcModelDescComponent;
}(BasicDesc));

/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
var AcTileset3dComponent = /** @class */ (function () {
    function AcTileset3dComponent(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        this.tilesetInstance = null;
    }
    AcTileset3dComponent.prototype.ngOnInit = function () {
        if (!Checker.present(this.options.url)) {
            throw new Error('Options must have a url');
        }
        this._3dtilesCollection = new Cesium.PrimitiveCollection();
        this.cesiumService.getScene().primitives.add(this._3dtilesCollection);
        if (this.show) {
            this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
            if (this.style) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    };
    AcTileset3dComponent.prototype.ngOnChanges = function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            var showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.tilesetInstance) {
                    this._3dtilesCollection.add(this.tilesetInstance, this.index);
                }
                else {
                    this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
                    if (this.style) {
                        this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
                    }
                }
            }
            else if (this.tilesetInstance) {
                this._3dtilesCollection.remove(this.tilesetInstance, false);
            }
        }
        if (changes['style'] && !changes['style'].isFirstChange()) {
            var styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    };
    AcTileset3dComponent.prototype.ngOnDestroy = function () {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    };
    AcTileset3dComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcTileset3dComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], AcTileset3dComponent.prototype, "index", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcTileset3dComponent.prototype, "show", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcTileset3dComponent.prototype, "style", void 0);
    AcTileset3dComponent = __decorate([
        Component({
            selector: 'ac-3d-tile-layer',
            template: ''
        }),
        __metadata("design:paramtypes", [CesiumService])
    ], AcTileset3dComponent);
    return AcTileset3dComponent;
}());

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BoxGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-box-desc props="{
 *     show : point.show, //optional
 *     position : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-box-desc>
 *  ```
 */
var AcBoxDescComponent = /** @class */ (function (_super) {
    __extends(AcBoxDescComponent, _super);
    function AcBoxDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcBoxDescComponent_1 = AcBoxDescComponent;
    var AcBoxDescComponent_1;
    AcBoxDescComponent.ctorParameters = function () { return [
        { type: BoxDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcBoxDescComponent = AcBoxDescComponent_1 = __decorate([
        Component({
            selector: 'ac-box-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcBoxDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [BoxDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcBoxDescComponent);
    return AcBoxDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CylinderGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-cylinder-desc props="{
 *     show : cylinder.show, //optional
 *     position : cylinder.position,
 *     material : cylinder.color  //optional
 *   }">
 *   </ac-cylinder-desc>
 *  ```
 */
var AcCylinderDescComponent = /** @class */ (function (_super) {
    __extends(AcCylinderDescComponent, _super);
    function AcCylinderDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcCylinderDescComponent_1 = AcCylinderDescComponent;
    var AcCylinderDescComponent_1;
    AcCylinderDescComponent.ctorParameters = function () { return [
        { type: CylinderDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCylinderDescComponent = AcCylinderDescComponent_1 = __decorate([
        Component({
            selector: 'ac-cylinder-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcCylinderDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [CylinderDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCylinderDescComponent);
    return AcCylinderDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CorridorGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-corridor-desc props="{
 *     show : point.show, //optional
 *     positions : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-corridor-desc>
 *  ```
 */
var AcCorridorDescComponent = /** @class */ (function (_super) {
    __extends(AcCorridorDescComponent, _super);
    function AcCorridorDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcCorridorDescComponent_1 = AcCorridorDescComponent;
    var AcCorridorDescComponent_1;
    AcCorridorDescComponent.ctorParameters = function () { return [
        { type: CorridorDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCorridorDescComponent = AcCorridorDescComponent_1 = __decorate([
        Component({
            selector: 'ac-corridor-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcCorridorDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [CorridorDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCorridorDescComponent);
    return AcCorridorDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipsoidGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-ellipsoid-desc props="{
 *     show : ellipsoid.show, //optional
 *     radii : ellipsoid.radii,
 *     material : ellipsoid.color  //optional
 *   }">
 *   </ac-ellipsoid-desc>
 *  ```
 */
var AcEllipsoidDescComponent = /** @class */ (function (_super) {
    __extends(AcEllipsoidDescComponent, _super);
    function AcEllipsoidDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcEllipsoidDescComponent_1 = AcEllipsoidDescComponent;
    var AcEllipsoidDescComponent_1;
    AcEllipsoidDescComponent.ctorParameters = function () { return [
        { type: EllipsoidDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcEllipsoidDescComponent = AcEllipsoidDescComponent_1 = __decorate([
        Component({
            selector: 'ac-ellipsoid-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcEllipsoidDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [EllipsoidDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcEllipsoidDescComponent);
    return AcEllipsoidDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineVolumeGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-polyline-volume-desc props="{
 *     show : line.show, //optional
 *     positions : line.positions,
 *     material : line.color  //optional
 *   }">
 *   </ac-polyline-volume-desc>
 *  ```
 */
var AcPolylineVolumeDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylineVolumeDescComponent, _super);
    function AcPolylineVolumeDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylineVolumeDescComponent.ctorParameters = function () { return [
        { type: PolylineVolumeDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPolylineVolumeDescComponent = __decorate([
        Component({
            selector: 'ac-polyline-volume-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [PolylineVolumeDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPolylineVolumeDescComponent);
    return AcPolylineVolumeDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/WallGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-wall-desc props="{
 *     show : wall.show, //optional
 *     positions : wall.positions,
 *     material : wall.color  //optional
 *   }">
 *   </ac-wall-desc>
 *  ```
 */
var AcWallDescComponent = /** @class */ (function (_super) {
    __extends(AcWallDescComponent, _super);
    function AcWallDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcWallDescComponent_1 = AcWallDescComponent;
    var AcWallDescComponent_1;
    AcWallDescComponent.ctorParameters = function () { return [
        { type: WallDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcWallDescComponent = AcWallDescComponent_1 = __decorate([
        Component({
            selector: 'ac-wall-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcWallDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [WallDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcWallDescComponent);
    return AcWallDescComponent;
}(BasicDesc));

/**
 *  This is a point implementation.
 *  The ac-rectangle-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties RectangleGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-rectangle-desc props="{
 *     show : rectangle.show, //optional
 *     coordinates : rectangle.positions,
 *     material : rectangle.color  //optional
 *   }">
 *   </ac-rectangle-desc>
 *  ```
 */
var AcRectangleDescComponent = /** @class */ (function (_super) {
    __extends(AcRectangleDescComponent, _super);
    function AcRectangleDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcRectangleDescComponent_1 = AcRectangleDescComponent;
    var AcRectangleDescComponent_1;
    AcRectangleDescComponent.ctorParameters = function () { return [
        { type: RectangleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcRectangleDescComponent = AcRectangleDescComponent_1 = __decorate([
        Component({
            selector: 'ac-rectangle-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcRectangleDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [RectangleDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcRectangleDescComponent);
    return AcRectangleDescComponent;
}(BasicDesc));

/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
var AcBillboardPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcBillboardPrimitiveDescComponent, _super);
    function AcBillboardPrimitiveDescComponent(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardPrimitiveDescComponent_1 = AcBillboardPrimitiveDescComponent;
    var AcBillboardPrimitiveDescComponent_1;
    AcBillboardPrimitiveDescComponent.ctorParameters = function () { return [
        { type: BillboardPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcBillboardPrimitiveDescComponent = AcBillboardPrimitiveDescComponent_1 = __decorate([
        Component({
            selector: 'ac-billboard-primitive-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcBillboardPrimitiveDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [BillboardPrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcBillboardPrimitiveDescComponent);
    return AcBillboardPrimitiveDescComponent;
}(BasicDesc));

/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-primitive-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-primitive-desc>
 *  ```
 */
var AcLabelPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcLabelPrimitiveDescComponent, _super);
    function AcLabelPrimitiveDescComponent(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelPrimitiveDescComponent_1 = AcLabelPrimitiveDescComponent;
    var AcLabelPrimitiveDescComponent_1;
    AcLabelPrimitiveDescComponent.ctorParameters = function () { return [
        { type: LabelPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcLabelPrimitiveDescComponent = AcLabelPrimitiveDescComponent_1 = __decorate([
        Component({
            selector: 'ac-label-primitive-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcLabelPrimitiveDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [LabelPrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcLabelPrimitiveDescComponent);
    return AcLabelPrimitiveDescComponent;
}(BasicDesc));

/**
 *  This is a polyline primitive implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-primitive-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-primitive-desc>
 * ```
 */
var AcPolylinePrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylinePrimitiveDescComponent, _super);
    function AcPolylinePrimitiveDescComponent(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylinePrimitiveDescComponent_1 = AcPolylinePrimitiveDescComponent;
    var AcPolylinePrimitiveDescComponent_1;
    AcPolylinePrimitiveDescComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPolylinePrimitiveDescComponent = AcPolylinePrimitiveDescComponent_1 = __decorate([
        Component({
            selector: 'ac-polyline-primitive-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcPolylinePrimitiveDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [PolylinePrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPolylinePrimitiveDescComponent);
    return AcPolylinePrimitiveDescComponent;
}(BasicDesc));

var HtmlPrimitive = /** @class */ (function () {
    function HtmlPrimitive(options, collection) {
        if (collection === void 0) { collection = null; }
        if (typeof options !== 'object') {
            throw new Error('HtmlPrimitive ERROR: invalid html options!');
        }
        this.scene = options.scene;
        this._mapContainer = options.mapContainer;
        this.show = options.show || true;
        this.position = options.position;
        this.pixelOffset = options.pixelOffset;
        this.element = options.element;
        this.collection = collection;
    }
    Object.defineProperty(HtmlPrimitive.prototype, "scene", {
        set: function (scene) {
            this._scene = scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (show) {
            this._show = show;
            if (Cesium.defined(this.element)) {
                if (show) {
                    this._element.style.display = 'block';
                }
                else {
                    this._element.style.display = 'none';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "pixelOffset", {
        get: function () {
            return this._pixelOffset;
        },
        set: function (pixelOffset) {
            this._pixelOffset = pixelOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "element", {
        get: function () {
            return this._element;
        },
        set: function (element) {
            this._element = element;
            if (Cesium.defined(element)) {
                this._mapContainer.appendChild(element);
                this._element.style.position = 'absolute';
                this._element.style.zIndex = Number.MAX_VALUE.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "collection", {
        get: function () {
            return this._collection;
        },
        set: function (collection) {
            this._collection = collection;
        },
        enumerable: true,
        configurable: true
    });
    HtmlPrimitive.prototype.update = function () {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
        var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._scene, this._position);
        if (!Cesium.defined(screenPosition)) {
            screenPosition = new Cesium.Cartesian2((-1000), (-1000));
        }
        else if (Cesium.defined(this._pixelOffset) && Cesium.defined(this._pixelOffset.x) && Cesium.defined(this._pixelOffset.y)) {
            screenPosition.y += this._pixelOffset.y;
            screenPosition.x += this._pixelOffset.x;
        }
        if (this._lastPosition && this._lastPosition.equals(screenPosition)) {
            return;
        }
        this._element.style.top = screenPosition.y + "px";
        this._element.style.left = screenPosition.x + "px";
        this._lastPosition = screenPosition;
    };
    HtmlPrimitive.prototype.remove = function () {
        if (this._element) {
            this._element.remove();
        }
    };
    return HtmlPrimitive;
}());

var HtmlCollection = /** @class */ (function () {
    function HtmlCollection() {
        this._collection = [];
    }
    Object.defineProperty(HtmlCollection.prototype, "length", {
        get: function () {
            return this._collection.length;
        },
        enumerable: true,
        configurable: true
    });
    HtmlCollection.prototype.get = function (index) {
        return this._collection[index];
    };
    HtmlCollection.prototype.add = function (options) {
        var html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    };
    HtmlCollection.prototype.remove = function (html) {
        var index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection[index].remove();
        this._collection.splice(index, 1);
        return true;
    };
    HtmlCollection.prototype.update = function () {
        for (var i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    };
    HtmlCollection.prototype.removeAll = function () {
        while (this._collection.length > 0) {
            var html = this._collection.pop();
            html.remove();
        }
    };
    HtmlCollection.prototype.contains = function (html) {
        return Cesium.defined(html) && html.collection === this;
    };
    HtmlCollection.prototype.destroy = function () {
        this.removeAll();
    };
    return HtmlCollection;
}());

var CesiumExtender = /** @class */ (function () {
    function CesiumExtender() {
    }
    CesiumExtender.extend = function () {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    };
    return CesiumExtender;
}());

var AcHtmlManager = /** @class */ (function () {
    function AcHtmlManager() {
        this._entities = new Map();
    }
    AcHtmlManager.prototype.has = function (id) {
        return this._entities.has(id);
    };
    AcHtmlManager.prototype.get = function (id) {
        return this._entities.get(id);
    };
    AcHtmlManager.prototype.addOrUpdate = function (id, info) {
        this._entities.set(id, info);
    };
    AcHtmlManager.prototype.remove = function (id) {
        this._entities.delete(id);
    };
    AcHtmlManager.prototype.forEach = function (callback) {
        this._entities.forEach(callback);
    };
    AcHtmlManager = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], AcHtmlManager);
    return AcHtmlManager;
}());

var AcHtmlContext = /** @class */ (function () {
    function AcHtmlContext(id, context) {
        this.id = id;
        this.context = context;
    }
    return AcHtmlContext;
}());
var AcHtmlDirective = /** @class */ (function () {
    function AcHtmlDirective(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    AcHtmlDirective.prototype.ngOnInit = function () {
    };
    AcHtmlDirective.prototype._handleView = function (id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            var context = new AcHtmlContext(id, { $implicit: entity });
            var viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef: viewRef, context: context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    };
    AcHtmlDirective.prototype.addOrUpdate = function (id, primitive) {
        var context = this._layerService.context;
        var entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity: entity, primitive: primitive });
        this._handleView(id, primitive, entity);
    };
    AcHtmlDirective.prototype.remove = function (id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        var viewRef = this._views.get(id).viewRef;
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    };
    AcHtmlDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ChangeDetectorRef },
        { type: LayerService },
        { type: AcHtmlManager }
    ]; };
    AcHtmlDirective = __decorate([
        Directive({
            selector: '[acHtml]',
        }),
        __metadata("design:paramtypes", [TemplateRef,
            ViewContainerRef,
            ChangeDetectorRef,
            LayerService,
            AcHtmlManager])
    ], AcHtmlDirective);
    return AcHtmlDirective;
}());

/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-layer element.
 *  <br>
 *  [props] accepts position(Cartesian3) and show(boolean).
 *
 *  __Usage:__
 *  ```
 *  <ac-layer acFor="let html of htmls$" [context]="this">
 <ac-html-desc props="{position: html.position, show: html.show}">
 <ng-template let-html>
 <div>
 <h1>This is ac-html {{html.name}}</h1>
 <button (click)="changeText(html, 'Test')">change text</button>
 </div>
 </ng-template>
 </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
var AcHtmlDescComponent = /** @class */ (function (_super) {
    __extends(AcHtmlDescComponent, _super);
    function AcHtmlDescComponent(htmlDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, htmlDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcHtmlDescComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (!this.acHtmlCreator) {
            throw new Error("AcHtml desc ERROR: ac html directive not found.");
        }
        if (!this.acHtmlTemplate) {
            throw new Error("AcHtml desc ERROR: html template not found.");
        }
    };
    AcHtmlDescComponent.prototype.draw = function (context, id) {
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            var primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            var primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    };
    AcHtmlDescComponent.prototype.remove = function (id) {
        var primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    };
    AcHtmlDescComponent.prototype.removeAll = function () {
        var _this = this;
        this._cesiumObjectsMap.forEach((function (primitive, id) {
            _this.acHtmlCreator.remove(id, primitive);
        }));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    AcHtmlDescComponent.ctorParameters = function () { return [
        { type: HtmlDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    __decorate([
        ViewChild(AcHtmlDirective, { static: true }),
        __metadata("design:type", AcHtmlDirective)
    ], AcHtmlDescComponent.prototype, "acHtmlCreator", void 0);
    __decorate([
        ContentChild(TemplateRef, { static: true }),
        __metadata("design:type", TemplateRef)
    ], AcHtmlDescComponent.prototype, "acHtmlTemplate", void 0);
    AcHtmlDescComponent = __decorate([
        Component({
            selector: 'ac-html-desc',
            providers: [AcHtmlManager],
            template: "\n      <div *acHtml=\"let acHtmlEntityId = id; let acHtmlContext = context\">\n          <div [acHtmlContainer]=\"acHtmlEntityId\">\n              <ng-template [ngTemplateOutlet]=\"acHtmlTemplate\"\n                           [ngTemplateOutletContext]=\"acHtmlContext\"></ng-template>\n          </div>\n      </div>"
        }),
        __metadata("design:paramtypes", [HtmlDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcHtmlDescComponent);
    return AcHtmlDescComponent;
}(BasicDesc));

var AcHtmlContainerDirective = /** @class */ (function () {
    function AcHtmlContainerDirective(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    Object.defineProperty(AcHtmlContainerDirective.prototype, "acHtmlContainer", {
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    AcHtmlContainerDirective.prototype.ngOnInit = function () {
        if (this._id === undefined) {
            throw new Error("AcHtml container ERROR: entity id not defined");
        }
        var entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    };
    AcHtmlContainerDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: AcHtmlManager }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], AcHtmlContainerDirective.prototype, "acHtmlContainer", null);
    AcHtmlContainerDirective = __decorate([
        Directive({
            selector: '[acHtmlContainer]'
        }),
        __metadata("design:paramtypes", [ElementRef,
            AcHtmlManager])
    ], AcHtmlContainerDirective);
    return AcHtmlContainerDirective;
}());

/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 *
 * usage:
 * ```typescript
 * // We want to open the context menu on mouse right click.
 * // Register to mouse right click with the MapEventsManager
 * this.mapEventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
 *    .subscribe(event => {
 *       const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition, true);
 *       if (!position) {
 *         return;
 *       }
 *       // Open the context menu on the position that was clicked and pass some data to MyCustomContextMenuComponent.
 *       this.contextMenuService.open(
 *         MyCustomContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
var AcContextMenuWrapperComponent = /** @class */ (function () {
    function AcContextMenuWrapperComponent(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    AcContextMenuWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe(function () { return _this.cd.detectChanges(); });
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe(function () {
                var componentFactory = _this.componentFactoryResolver.resolveComponentFactory(_this.contextMenuService.content);
                _this.viewContainerRef.clear();
                var componentRef = _this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.data = _this.contextMenuService.options.data;
                _this.cd.detectChanges();
            });
    };
    AcContextMenuWrapperComponent.prototype.ngOnDestroy = function () {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    };
    AcContextMenuWrapperComponent.ctorParameters = function () { return [
        { type: ContextMenuService },
        { type: ChangeDetectorRef },
        { type: ComponentFactoryResolver }
    ]; };
    __decorate([
        ViewChild('contextMenuContainer', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], AcContextMenuWrapperComponent.prototype, "viewContainerRef", void 0);
    AcContextMenuWrapperComponent = __decorate([
        Component({
            selector: 'ac-context-menu-wrapper',
            template: "\n    <ac-html *ngIf=\"contextMenuService.showContextMenu\" [props]=\"{position: contextMenuService.position}\">\n      <ng-template #contextMenuContainer></ng-template>\n    </ac-html>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [ContextMenuService,
            ChangeDetectorRef,
            ComponentFactoryResolver])
    ], AcContextMenuWrapperComponent);
    return AcContextMenuWrapperComponent;
}());

/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Cesium.Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 *</ac-layer>
 *  ```
 */
var AcArrayDescComponent = /** @class */ (function () {
    function AcArrayDescComponent(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    AcArrayDescComponent_1 = AcArrayDescComponent;
    AcArrayDescComponent.prototype.ngOnChanges = function (changes) {
        if (changes['acFor'].firstChange) {
            var acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + acForString);
            }
            var acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    };
    AcArrayDescComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.layer) {
            this.layer.getLayerService().cache = false;
        }
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(function () {
            _this.cd.detectChanges();
        });
    };
    AcArrayDescComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach(function (component) {
            component.setLayerService(_this.layer.getLayerService());
        });
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach(function (component) {
            _this.layerService.unregisterDescription(component);
            _this.layer.getLayerService().registerDescription(component);
            component.layerService = _this.layer.getLayerService();
            component.setLayerService(_this.layer.getLayerService());
        });
    };
    AcArrayDescComponent.prototype.ngOnDestroy = function () {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    };
    AcArrayDescComponent.prototype.setLayerService = function (layerService) {
        this.layerService = layerService;
    };
    AcArrayDescComponent.prototype.draw = function (context, id, contextEntity) {
        var _this = this;
        var get = _get;
        var entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        var previousEntitiesIdArray = this.entitiesMap.get(id);
        var entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach(function (item, index) {
            _this.layerService.context[_this.entityName] = item;
            var arrayItemId = _this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            _this.layer.update(contextEntity, arrayItemId);
        });
        if (previousEntitiesIdArray) {
            var entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter(function (entityId) { return entitiesIdArray.indexOf(entityId) < 0; }) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach(function (entityId) { return _this.layer.remove(entityId); });
            }
        }
    };
    AcArrayDescComponent.prototype.remove = function (id) {
        var _this = this;
        var entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach(function (entityId) { return _this.layer.remove(entityId); });
        }
        this.entitiesMap.delete(id);
    };
    AcArrayDescComponent.prototype.removeAll = function () {
        this.layer.removeAll();
        this.entitiesMap.clear();
    };
    AcArrayDescComponent.prototype.getAcForString = function () {
        return "let " + (this.entityName + '___temp') + " of arrayObservable$";
    };
    AcArrayDescComponent.prototype.generateCombinedId = function (entityId, arrayItem, index) {
        var arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    };
    var AcArrayDescComponent_1;
    AcArrayDescComponent.ctorParameters = function () { return [
        { type: LayerService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcArrayDescComponent.prototype, "acFor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], AcArrayDescComponent.prototype, "idGetter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "show", void 0);
    __decorate([
        ViewChild('layer', { static: true }),
        __metadata("design:type", AcLayerComponent)
    ], AcArrayDescComponent.prototype, "layer", void 0);
    __decorate([
        ContentChildren(BasicDesc, { descendants: false }),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "basicDescs", void 0);
    __decorate([
        ContentChildren(AcArrayDescComponent_1, { descendants: false }),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "arrayDescs", void 0);
    AcArrayDescComponent = AcArrayDescComponent_1 = __decorate([
        Component({
            selector: 'ac-array-desc',
            template: "\n    <ac-layer #layer [acFor]=\"getAcForString()\"\n              [context]=\"layerService.context\"\n              [options]=\"layerService.options\"\n              [show]=\"layerService.show && show\"\n              [zIndex]=\"layerService.zIndex\">\n      <ng-content #content></ng-content>\n    </ac-layer>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [LayerService, ChangeDetectorRef])
    ], AcArrayDescComponent);
    return AcArrayDescComponent;
}());

/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Point.html
 *
 *  __Usage :__
 *  ```
 *    <ac-point-primitive-desc props="{
 *      position: track.position,
 *      color: Cesium.Color.RED
 *    }">
 *    </ac-point-primitive-desc>
 *  ```
 */
var AcPointPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcPointPrimitiveDescComponent, _super);
    function AcPointPrimitiveDescComponent(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointPrimitiveDescComponent.ctorParameters = function () { return [
        { type: PointPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPointPrimitiveDescComponent = __decorate([
        Component({
            selector: 'ac-point-primitive-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [PointPrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPointPrimitiveDescComponent);
    return AcPointPrimitiveDescComponent;
}(BasicDesc));

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
var AcPrimitivePolylineComponent = /** @class */ (function (_super) {
    __extends(AcPrimitivePolylineComponent, _super);
    function AcPrimitivePolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPrimitivePolylineComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: MapLayersService }
    ]; };
    AcPrimitivePolylineComponent = __decorate([
        Component({
            selector: 'ac-primitive-polyline',
            template: ''
        }),
        __metadata("design:paramtypes", [PolylinePrimitiveDrawerService, MapLayersService])
    ], AcPrimitivePolylineComponent);
    return AcPrimitivePolylineComponent;
}(EntityOnMapComponent));

// For angular parse usage
var PARSE_PIPES_CONFIG_MAP = [
    { pipeName: 'pixelOffset', pipeInstance: new PixelOffsetPipe() },
    { pipeName: 'radiansToDegrees', pipeInstance: new RadiansToDegreesPipe() },
];

/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
var AcCzmlDescComponent = /** @class */ (function (_super) {
    __extends(AcCzmlDescComponent, _super);
    function AcCzmlDescComponent(czmlDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, czmlDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcCzmlDescComponent.ctorParameters = function () { return [
        { type: CzmlDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCzmlDescComponent = __decorate([
        Component({
            selector: 'ac-czml-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [CzmlDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCzmlDescComponent);
    return AcCzmlDescComponent;
}(BasicDesc));

/**
 *  This is a rectangle implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and RectangleGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-rectangle props="{
 *      coordinates: rectangle.coordinates,
 *      material: rectangle.material,
 *      height: rectangle.height
 *    }">
 *    </ac-rectangle>
 *  ```
 */
var AcRectangleComponent = /** @class */ (function (_super) {
    __extends(AcRectangleComponent, _super);
    function AcRectangleComponent(rectangleDrawer, mapLayers) {
        return _super.call(this, rectangleDrawer, mapLayers) || this;
    }
    AcRectangleComponent.ctorParameters = function () { return [
        { type: RectangleDrawerService },
        { type: MapLayersService }
    ]; };
    AcRectangleComponent = __decorate([
        Component({
            selector: 'ac-rectangle',
            template: ''
        }),
        __metadata("design:paramtypes", [RectangleDrawerService, MapLayersService])
    ], AcRectangleComponent);
    return AcRectangleComponent;
}(EntityOnMapComponent));

var AngularCesiumModule = /** @class */ (function () {
    function AngularCesiumModule() {
        CesiumExtender.extend();
    }
    AngularCesiumModule_1 = AngularCesiumModule;
    AngularCesiumModule.forRoot = function (config) {
        return {
            ngModule: AngularCesiumModule_1,
            providers: [
                JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService,
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    };
    var AngularCesiumModule_1;
    AngularCesiumModule = AngularCesiumModule_1 = __decorate([
        NgModule({
            imports: [
                CommonModule,
                Angular2ParseModule,
                UtilsModule,
            ],
            declarations: [
                AcMapComponent,
                AcLayerComponent,
                AcBillboardComponent,
                AcBillboardDescComponent,
                AcBillboardPrimitiveDescComponent,
                AcLabelDescComponent,
                AcLabelPrimitiveDescComponent,
                AcEllipseDescComponent,
                AcPolylineDescComponent,
                AcPolylinePrimitiveDescComponent,
                PixelOffsetPipe,
                RadiansToDegreesPipe,
                AcCircleDescComponent,
                AcArcDescComponent,
                AcMapLayerProviderComponent,
                AcMapTerrainProviderComponent,
                AcPointDescComponent,
                AcLabelComponent,
                AcPolylineComponent,
                AcPrimitivePolylineComponent,
                AcEllipseComponent,
                AcPointComponent,
                AcBillboardComponent,
                AcHtmlComponent,
                AcCircleComponent,
                AcArcComponent,
                AcPolygonDescComponent,
                AcPolygonComponent,
                AcDefaultPlonterComponent,
                AcModelDescComponent,
                AcTileset3dComponent,
                AcBoxDescComponent,
                AcCylinderDescComponent,
                AcCorridorDescComponent,
                AcEllipsoidDescComponent,
                AcPolylineVolumeDescComponent,
                AcWallDescComponent,
                AcRectangleDescComponent,
                AcContextMenuWrapperComponent,
                AcPointPrimitiveDescComponent,
                AcHtmlDescComponent,
                AcHtmlDirective,
                AcHtmlContainerDirective,
                AcArrayDescComponent,
                AcCzmlDescComponent,
                AcStaticEllipseDescComponent,
                AcDynamicEllipseDescComponent,
                AcDynamicPolylineDescComponent,
                AcStaticPolylineDescComponent,
                AcDynamicCircleDescComponent,
                AcStaticCircleDescComponent,
                AcStaticPolygonDescComponent,
                AcRectangleComponent
            ],
            exports: [
                AcMapComponent,
                AcBillboardComponent,
                AcBillboardDescComponent,
                AcBillboardPrimitiveDescComponent,
                AcLabelDescComponent,
                AcLabelPrimitiveDescComponent,
                AcEllipseDescComponent,
                AcPolylineDescComponent,
                AcPolylinePrimitiveDescComponent,
                AcLayerComponent,
                AcCircleDescComponent,
                AcArcDescComponent,
                AcMapLayerProviderComponent,
                AcMapTerrainProviderComponent,
                AcPointDescComponent,
                AcLabelComponent,
                AcPolylineComponent,
                AcPrimitivePolylineComponent,
                AcEllipseComponent,
                AcPointComponent,
                AcBillboardComponent,
                AcHtmlComponent,
                AcCircleComponent,
                AcArcComponent,
                AcPolygonDescComponent,
                AcPolygonComponent,
                AcDefaultPlonterComponent,
                AcModelDescComponent,
                AcTileset3dComponent,
                AcBoxDescComponent,
                AcCylinderDescComponent,
                AcCorridorDescComponent,
                AcEllipsoidDescComponent,
                AcPolylineVolumeDescComponent,
                AcWallDescComponent,
                AcRectangleDescComponent,
                AcPointPrimitiveDescComponent,
                AcHtmlDescComponent,
                AcArrayDescComponent,
                AcCzmlDescComponent,
                AcRectangleComponent,
                AcStaticEllipseDescComponent,
                AcDynamicEllipseDescComponent,
                AcDynamicPolylineDescComponent,
                AcStaticPolylineDescComponent,
                AcDynamicCircleDescComponent,
                AcStaticCircleDescComponent,
                AcStaticPolygonDescComponent,
            ],
        }),
        __metadata("design:paramtypes", [])
    ], AngularCesiumModule);
    return AngularCesiumModule;
}());

var DisposableObservable = /** @class */ (function (_super) {
    __extends(DisposableObservable, _super);
    function DisposableObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DisposableObservable;
}(Observable));

/**
 * EventModifier options for registration on map-event-manager.
 */
var CesiumEventModifier;
(function (CesiumEventModifier) {
    CesiumEventModifier[CesiumEventModifier["ALT"] = Cesium.KeyboardEventModifier.ALT] = "ALT";
    CesiumEventModifier[CesiumEventModifier["CTRL"] = Cesium.KeyboardEventModifier.CTRL] = "CTRL";
    CesiumEventModifier[CesiumEventModifier["SHIFT"] = Cesium.KeyboardEventModifier.SHIFT] = "SHIFT";
})(CesiumEventModifier || (CesiumEventModifier = {}));

/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
var SelectionManagerService = /** @class */ (function () {
    function SelectionManagerService(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    SelectionManagerService.prototype.selectedEntities$ = function () {
        return this.selectedEntitiesItems$.asObservable();
    };
    SelectionManagerService.prototype.selectedEntities = function () {
        return this.selectedEntitiesItems$.getValue();
    };
    SelectionManagerService.prototype.selectedEntity$ = function () {
        return this.selectedEntitySubject$;
    };
    SelectionManagerService.prototype.toggleSelection = function (entity, addSelectedIndicator) {
        var current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    };
    SelectionManagerService.prototype.addToSelected = function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        var current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next(__spread(current, [entity]));
    };
    SelectionManagerService.prototype.removeSelected = function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        var current = this.selectedEntities();
        var entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    };
    SelectionManagerService.prototype.initSelection = function (selectionOptions, addSelectedIndicator, eventPriority, mapId) {
        var _this = this;
        if (addSelectedIndicator === void 0) { addSelectedIndicator = true; }
        var mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        var eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map(function (result) { return result.entities; }), filter(function (entities) { return entities && entities.length > 0; }))
            .subscribe(function (entities) {
            var entity = entities[0];
            _this.toggleSelection(entity, addSelectedIndicator);
        });
    };
    SelectionManagerService.ctorParameters = function () { return [
        { type: MapsManagerService }
    ]; };
    SelectionManagerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [MapsManagerService])
    ], SelectionManagerService);
    return SelectionManagerService;
}());

// import './src/angular-cesium/operators';

var EditModes;
(function (EditModes) {
    EditModes[EditModes["CREATE"] = 0] = "CREATE";
    EditModes[EditModes["EDIT"] = 1] = "EDIT";
    EditModes[EditModes["CREATE_OR_EDIT"] = 2] = "CREATE_OR_EDIT";
})(EditModes || (EditModes = {}));

var EditActions;
(function (EditActions) {
    EditActions[EditActions["INIT"] = 0] = "INIT";
    EditActions[EditActions["MOUSE_MOVE"] = 1] = "MOUSE_MOVE";
    EditActions[EditActions["ADD_POINT"] = 2] = "ADD_POINT";
    EditActions[EditActions["ADD_LAST_POINT"] = 3] = "ADD_LAST_POINT";
    EditActions[EditActions["CHANGE_TO_EDIT"] = 4] = "CHANGE_TO_EDIT";
    EditActions[EditActions["REMOVE_POINT"] = 5] = "REMOVE_POINT";
    EditActions[EditActions["DRAG_POINT"] = 6] = "DRAG_POINT";
    EditActions[EditActions["DRAG_POINT_FINISH"] = 7] = "DRAG_POINT_FINISH";
    EditActions[EditActions["DRAG_SHAPE"] = 8] = "DRAG_SHAPE";
    EditActions[EditActions["DRAG_SHAPE_FINISH"] = 9] = "DRAG_SHAPE_FINISH";
    EditActions[EditActions["DONE"] = 10] = "DONE";
    EditActions[EditActions["DISABLE"] = 11] = "DISABLE";
    EditActions[EditActions["ENABLE"] = 12] = "ENABLE";
    EditActions[EditActions["DISPOSE"] = 13] = "DISPOSE";
    EditActions[EditActions["SET_EDIT_LABELS_RENDER_CALLBACK"] = 14] = "SET_EDIT_LABELS_RENDER_CALLBACK";
    EditActions[EditActions["UPDATE_EDIT_LABELS"] = 15] = "UPDATE_EDIT_LABELS";
    EditActions[EditActions["SET_MANUALLY"] = 16] = "SET_MANUALLY";
    EditActions[EditActions["TRANSFORM"] = 17] = "TRANSFORM";
})(EditActions || (EditActions = {}));

var EditPoint = /** @class */ (function (_super) {
    __extends(EditPoint, _super);
    function EditPoint(entityId, position, pointProps, virtualPoint) {
        if (virtualPoint === void 0) { virtualPoint = false; }
        var _this = _super.call(this) || this;
        _this._show = true;
        _this.editedEntityId = entityId;
        _this.position = position;
        _this.id = _this.generateId();
        _this.pointProps = __assign({}, pointProps);
        _this._virtualEditPoint = virtualPoint;
        return _this;
    }
    Object.defineProperty(EditPoint.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (value) {
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPoint.prototype, "props", {
        get: function () {
            return this.pointProps;
        },
        set: function (value) {
            this.pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    EditPoint.prototype.isVirtualEditPoint = function () {
        return this._virtualEditPoint;
    };
    EditPoint.prototype.setVirtualEditPoint = function (value) {
        this._virtualEditPoint = value;
    };
    EditPoint.prototype.getEditedEntityId = function () {
        return this.editedEntityId;
    };
    EditPoint.prototype.getPosition = function () {
        return this.position.clone();
    };
    EditPoint.prototype.getPositionCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPosition.bind(this), false);
    };
    EditPoint.prototype.setPosition = function (position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    };
    EditPoint.prototype.getId = function () {
        return this.id;
    };
    EditPoint.prototype.generateId = function () {
        return 'edit-point-' + EditPoint.counter++;
    };
    EditPoint.counter = 0;
    return EditPoint;
}(AcEntity));

function generateKey(length) {
    if (length === void 0) { length = 12; }
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}
function debounce(func, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(context, args); }, wait);
    };
}

var DEFAULT_POINT_OPTIONS = {
    addLastPointEvent: CesiumEvent.LEFT_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 10,
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable point
 *
 *  * You must provide `PointsEditorService` yourself.
 * PolygonsEditorService works together with `<points-editor>` component. Therefor you need to create `<points-editor>`
 * for each `PointsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PointEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PointEditorObservable`.
 * + To stop editing call `dsipose()` from the `PointEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PointEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating point
 *  const editing$ = pointEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit point from existing point cartesian3 positions
 *  const editing$ = this.pointEditor.edit(initialPos);
 *
 * ```
 */
var PointsEditorService = /** @class */ (function () {
    function PointsEditorService() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    PointsEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, pointManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.pointManager = pointManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    PointsEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    PointsEditorService.prototype.screenToPosition = function (cartesian2) {
        var cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (cartesian3) {
            var ray = this.cameraService.getCamera().getPickRay(cartesian2);
            return this.cesiumScene.globe.pick(ray, this.cesiumScene);
        }
        return cartesian3;
    };
    PointsEditorService.prototype.create = function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POINT_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        var id = generateKey();
        var pointOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        var addLastPointRegistration = this.mapEventsManager.register({
            event: pointOptions.addLastPointEvent,
            modifier: pointOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addLastPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    position: position,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addLastPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition);
            finishedCreate = _this.switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, true);
        });
        return editorObservable;
    };
    PointsEditorService.prototype.switchToEditMode = function (id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, finishedCreate) {
        var update = {
            id: id,
            position: position,
            editMode: EditModes.CREATE_OR_EDIT,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(__assign(__assign({}, update), { position: position, point: this.getPoint(id) }));
        var changeMode = {
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
        }
        this.observablesMap.delete(id);
        this.editPoint(id, position, eventPriority, clientEditSubject, pointOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    PointsEditorService.prototype.edit = function (position, options, priority) {
        if (options === void 0) { options = DEFAULT_POINT_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var id = generateKey();
        var pointOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            position: position,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { position: position, point: this.getPoint(id) }));
        return this.editPoint(id, position, priority, editSubject, pointOptions);
    };
    PointsEditorService.prototype.editPoint = function (id, position, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var updatedPosition = _this.screenToPosition(endPosition);
            if (!updatedPosition) {
                return;
            }
            var update = {
                id: id,
                editMode: EditModes.EDIT,
                updatedPosition: updatedPosition,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { position: updatedPosition, point: _this.getPoint(id) }));
        });
        var observables = [pointDragRegistration, pointRemoveRegistration];
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    PointsEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POINT_OPTIONS));
        var pointOptions = Object.assign(defaultClone, options);
        pointOptions.pointProps = __assign(__assign({}, DEFAULT_POINT_OPTIONS.pointProps), options.pointProps);
        pointOptions.pointProps = __assign(__assign({}, DEFAULT_POINT_OPTIONS.pointProps), options.pointProps);
        return pointOptions;
    };
    PointsEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                position: _this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                position: _this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (point, pointProps) {
            var newPoint = _this.pointManager.get(id);
            newPoint.setManually(point, pointProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getCurrentPoint = function () { return _this.getPoint(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.pointManager.get(id).labels; };
        return observableToExtend;
    };
    PointsEditorService.prototype.getPosition = function (id) {
        var point = this.pointManager.get(id);
        return point.getPosition();
    };
    PointsEditorService.prototype.getPoint = function (id) {
        var point = this.pointManager.get(id);
        if (point) {
            return point.getCurrentPoint();
        }
    };
    PointsEditorService = __decorate([
        Injectable()
    ], PointsEditorService);
    return PointsEditorService;
}());

var defaultLabelProps = {
    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.7),
    backgroundPadding: new Cesium.Cartesian2(25, 20),
    distanceDisplayCondition: undefined,
    fillColor: Cesium.Color.WHITE,
    font: '30px sans-serif',
    heightReference: Cesium.HeightReference.NONE,
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,
    pixelOffset: Cesium.Cartesian2.ZERO,
    pixelOffsetScaleByDistance: undefined,
    scale: 1.0,
    scaleByDistance: undefined,
    show: true,
    showBackground: false,
    style: Cesium.LabelStyle.FILL,
    text: '',
    translucencyByDistance: undefined,
    verticalOrigin: Cesium.VerticalOrigin.BASELINE,
    eyeOffset: Cesium.Cartesian3.ZERO,
    disableDepthTestDistance: 0,
};

var EditablePoint = /** @class */ (function (_super) {
    __extends(EditablePoint, _super);
    function EditablePoint(id, pointLayer, coordinateConverter, editOptions, position) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointLayer = pointLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.editOptions = editOptions;
        _this._enableEdit = true;
        _this._labels = [];
        _this._props = __assign({}, editOptions.pointProps);
        if (position) {
            _this.createFromExisting(position);
        }
        return _this;
    }
    Object.defineProperty(EditablePoint.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var position = this.point.getPosition();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = position;
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePoint.prototype, "props", {
        get: function () {
            return this._props;
        },
        set: function (value) {
            this._props = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePoint.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            if (value) {
                this.point.props.color = Cesium.Color.WHITE;
            }
            else {
                this.point.props.color = Cesium.Color.DIMGREY;
                this.point.props.pixelSize = 10;
            }
            this.updatePointLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditablePoint.prototype.createFromExisting = function (position) {
        this.point = new EditPoint(this.id, position, this._props);
        this.updatePointLayer();
    };
    EditablePoint.prototype.hasPosition = function (point) {
        if (point.position) {
            return true;
        }
        return false;
    };
    EditablePoint.prototype.setManually = function (point, props) {
        if (!this.enableEdit) {
            throw new Error('Update manually only in edit mode, after point is created');
        }
        var newProps = props;
        if (this.hasPosition(point)) {
            newProps = point.pointProp ? point.pointProp : props;
            this.point.setPosition(point.position);
        }
        else {
            this.point.setPosition(point);
        }
        this.point.props = newProps;
        this.updatePointLayer();
    };
    EditablePoint.prototype.addLastPoint = function (position) {
        this.point.setPosition(position);
        this.updatePointLayer();
    };
    EditablePoint.prototype.movePoint = function (toPosition) {
        if (!this.point) {
            this.point = new EditPoint(this.id, toPosition, this._props);
        }
        else {
            this.point.setPosition(toPosition);
        }
        this.updatePointLayer();
    };
    EditablePoint.prototype.getCurrentPoint = function () {
        return this.point;
    };
    EditablePoint.prototype.getPosition = function () {
        return this.point.getPosition();
    };
    EditablePoint.prototype.getPositionCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPosition.bind(this), false);
    };
    EditablePoint.prototype.updatePointLayer = function () {
        this.pointLayer.update(this.point, this.point.getId());
    };
    EditablePoint.prototype.update = function () {
        this.updatePointLayer();
    };
    EditablePoint.prototype.dispose = function () {
        this.pointLayer.remove(this.point.getId());
    };
    EditablePoint.prototype.getId = function () {
        return this.id;
    };
    return EditablePoint;
}(AcEntity));

var PointsManagerService = /** @class */ (function () {
    function PointsManagerService() {
        this.points = new Map();
    }
    PointsManagerService.prototype.createEditablePoint = function (id, editPointLayer, coordinateConverter, editOptions, position) {
        var editablePoint = new EditablePoint(id, editPointLayer, coordinateConverter, editOptions, position);
        this.points.set(id, editablePoint);
    };
    PointsManagerService.prototype.enableAll = function () {
        this.points.forEach(function (point) { return point.enableEdit = true; });
    };
    PointsManagerService.prototype.disableAll = function () {
        this.points.forEach(function (point) { return point.enableEdit = false; });
    };
    PointsManagerService.prototype.dispose = function (id) {
        var point = this.points.get(id);
        if (point.getCurrentPoint()) {
            point.dispose();
        }
        this.points.delete(id);
    };
    PointsManagerService.prototype.get = function (id) {
        return this.points.get(id);
    };
    PointsManagerService.prototype.clear = function () {
        this.points.forEach(function (point) { return point.dispose(); });
        this.points.clear();
    };
    PointsManagerService = __decorate([
        Injectable()
    ], PointsManagerService);
    return PointsManagerService;
}());

var PointsEditorComponent = /** @class */ (function () {
    function PointsEditorComponent(pointsEditor, coordinateConverter, mapEventsManager, cameraService, pointsManager, cesiumService) {
        this.pointsEditor = pointsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.pointsManager = pointsManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoint$ = new Subject();
        this.pointLabels$ = new Subject();
        this.pointsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, pointsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    PointsEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.pointsEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    PointsEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    PointsEditorComponent.prototype.renderEditLabels = function (point, update, labels) {
        if (labels) {
            point.labels = labels;
            this.pointLabelsLayer.update(point, point.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        update.position = point.getPosition();
        update.point = point.getCurrentPoint();
        point.labels = this.editLabelsRenderFn(update, point.labels);
        this.pointLabelsLayer.update(point, point.getId());
    };
    PointsEditorComponent.prototype.removeEditLabels = function (point) {
        point.labels = [];
        this.pointLabelsLayer.remove(point.getId());
    };
    PointsEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var point = this.pointsManager.get(update.id);
                if (point && point.getCurrentPoint()) {
                    this.removeEditLabels(point);
                }
                this.pointsManager.dispose(update.id);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var point = this.pointsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(point, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    PointsEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.DRAG_POINT: {
                var point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = false;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = true;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    PointsEditorComponent.prototype.ngOnDestroy = function () {
        this.pointsManager.clear();
    };
    PointsEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    PointsEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PointsEditorComponent.ctorParameters = function () { return [
        { type: PointsEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PointsManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editPointLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PointsEditorComponent.prototype, "editPointLayer", void 0);
    __decorate([
        ViewChild('pointLabelsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PointsEditorComponent.prototype, "pointLabelsLayer", void 0);
    PointsEditorComponent = __decorate([
        Component({
            selector: 'points-editor',
            template: /*html*/ "\n    <ac-layer #editPointLayer acFor=\"let point of editPoint$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPositionCallbackProperty(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point),\n        disableDepthTestDistance: point.props.disableDepthTestDistance,\n        heightReference: point.props.heightReference,\n    }\"\n      ></ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #pointLabelsLayer acFor=\"let pointLabels of pointLabels$\" [context]=\"this\">\n      <ac-array-desc acFor=\"let label of pointLabels.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
            providers: [CoordinateConverter, PointsManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [PointsEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            PointsManagerService,
            CesiumService])
    ], PointsEditorComponent);
    return PointsEditorComponent;
}());

var EditPolyline = /** @class */ (function (_super) {
    __extends(EditPolyline, _super);
    function EditPolyline(entityId, startPosition, endPosition, polylineProps) {
        var _this = _super.call(this) || this;
        _this.editedEntityId = entityId;
        _this.id = _this.generateId();
        _this.positions = [startPosition, endPosition];
        _this._polylineProps = __assign({}, polylineProps);
        return _this;
    }
    Object.defineProperty(EditPolyline.prototype, "props", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    EditPolyline.prototype.getEditedEntityId = function () {
        return this.editedEntityId;
    };
    EditPolyline.prototype.getPositions = function () {
        return this.positions.map(function (p) { return p.clone(); });
    };
    EditPolyline.prototype.getPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositions.bind(this), false);
    };
    EditPolyline.prototype.validatePositions = function () {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    };
    EditPolyline.prototype.getStartPosition = function () {
        return this.positions[0];
    };
    EditPolyline.prototype.getEndPosition = function () {
        return this.positions[1];
    };
    EditPolyline.prototype.setStartPosition = function (position) {
        this.positions[0] = position;
    };
    EditPolyline.prototype.setEndPosition = function (position) {
        this.positions[1] = position;
    };
    EditPolyline.prototype.getId = function () {
        return this.id;
    };
    EditPolyline.prototype.generateId = function () {
        return 'edit-polyline-' + EditPolyline.counter++;
    };
    EditPolyline.counter = 0;
    return EditPolyline;
}(AcEntity));

var EditablePolygon = /** @class */ (function (_super) {
    __extends(EditablePolygon, _super);
    function EditablePolygon(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.polygonsLayer = polygonsLayer;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.polygonOptions = polygonOptions;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.polygonProps = __assign({}, polygonOptions.polygonProps);
        _this.defaultPointProps = __assign({}, polygonOptions.pointProps);
        _this.defaultPolylineProps = __assign({}, polygonOptions.polylineProps);
        if (positions && positions.length >= 3) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolygon.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var positions = this.getRealPositions();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPolylineProps", {
        get: function () {
            return this._defaultPolylineProps;
        },
        set: function (value) {
            this._defaultPolylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "polygonProps", {
        get: function () {
            return this._polygonProps;
        },
        set: function (value) {
            this._polygonProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditablePolygon.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    };
    EditablePolygon.prototype.setPointsManually = function (points, polygonProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
        }
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            var pointOrCartesian = points[i];
            var newPoint = null;
            if (pointOrCartesian.pointProps) {
                newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
            }
            else {
                newPoint = new EditPoint(this.id, pointOrCartesian, this.defaultPointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polygonProps = polygonProps ? polygonProps : this.polygonProps;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.addAllVirtualEditPoints = function () {
        var _this = this;
        var currentPoints = __spread(this.positions);
        currentPoints.forEach(function (pos, index) {
            var currentPoint = pos;
            var nextIndex = (index + 1) % (currentPoints.length);
            var nextPoint = currentPoints[nextIndex];
            var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
            _this.updatePointsLayer(false, midPoint);
        });
    };
    EditablePolygon.prototype.setMiddleVirtualPoint = function (firstP, secondP) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cesium.Cartesian3());
        var midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    EditablePolygon.prototype.updateMiddleVirtualPoint = function (virtualEditPoint, prevPoint, nextPoint) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cesium.Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    };
    EditablePolygon.prototype.changeVirtualPointToRealPoint = function (point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        var pointsCount = this.positions.length;
        var pointIndex = this.positions.indexOf(point);
        var nextIndex = (pointIndex + 1) % (pointsCount);
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        var nextPoint = this.positions[nextIndex];
        var prePoint = this.positions[preIndex];
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.renderPolylines = function () {
        var _this = this;
        this.polylines.forEach(function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); });
        this.polylines = [];
        var realPoints = this.positions.filter(function (pos) { return !pos.isVirtualEditPoint(); });
        realPoints.forEach(function (point, index) {
            var nextIndex = (index + 1) % (realPoints.length);
            var nextPoint = realPoints[nextIndex];
            var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.defaultPolylineProps);
            _this.polylines.push(polyline);
            _this.polylinesLayer.update(polyline, polyline.getId());
        });
    };
    EditablePolygon.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    EditablePolygon.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.movePointFinish = function (editPoint) {
        if (this.polygonOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    };
    EditablePolygon.prototype.movePoint = function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.polygonOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            var pointsCount = this.positions.length;
            var pointIndex = this.positions.indexOf(editPoint);
            var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
        }
        this.updatePolygonsLayer();
        this.updatePointsLayer(true, editPoint);
    };
    EditablePolygon.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditablePolygon.prototype.movePolygon = function (startMovingPosition, draggedToPosition) {
        var _this = this;
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach(function (point) {
            var newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach(function (point) { return _this.updatePointsLayer(true, point); });
    };
    EditablePolygon.prototype.endMovePolygon = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditablePolygon.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter(function (p) { return p.isVirtualEditPoint(); })
            .forEach(function (p) { return _this.removePosition(p); });
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    EditablePolygon.prototype.addLastPoint = function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    };
    EditablePolygon.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditablePolygon.prototype.getRealPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; });
    };
    EditablePolygon.prototype.getPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return position !== _this.movingPoint; });
    };
    EditablePolygon.prototype.getPositionsHierarchy = function () {
        var positions = this.positions.filter(function (position) { return !position.isVirtualEditPoint(); }).map(function (position) { return position.getPosition().clone(); });
        return new Cesium.PolygonHierarchy(positions);
    };
    EditablePolygon.prototype.getPositionsHierarchyCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    };
    EditablePolygon.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditablePolygon.prototype.updatePolygonsLayer = function () {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    EditablePolygon.prototype.updatePointsLayer = function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var points = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            points[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditablePolygon.prototype.dispose = function () {
        var _this = this;
        this.polygonsLayer.remove(this.id);
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        this.polylines.forEach(function (line) { return _this.polylinesLayer.remove(line.getId()); });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditablePolygon.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditablePolygon.prototype.getId = function () {
        return this.id;
    };
    return EditablePolygon;
}(AcEntity));

var PolygonsManagerService = /** @class */ (function () {
    function PolygonsManagerService() {
        this.polygons = new Map();
    }
    PolygonsManagerService.prototype.createEditablePolygon = function (id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        var editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    };
    PolygonsManagerService.prototype.dispose = function (id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    };
    PolygonsManagerService.prototype.get = function (id) {
        return this.polygons.get(id);
    };
    PolygonsManagerService.prototype.clear = function () {
        this.polygons.forEach(function (polygon) { return polygon.dispose(); });
        this.polygons.clear();
    };
    PolygonsManagerService = __decorate([
        Injectable()
    ], PolygonsManagerService);
    return PolygonsManagerService;
}());

var ɵ0$1 = function () { return Cesium.Color.WHITE; };
var DEFAULT_POLYGON_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polygonProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
    },
    polylineProps: {
        material: ɵ0$1,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: Cesium.ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
    },
};
/**
 * Service for creating editable polygons
 *
 * You must provide `PolygonsEditorService` yourself.
 * PolygonsEditorService works together with `<polygons-editor>` component. Therefor you need to create `<polygons-editor>`
 * for each `PolygonsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolygonEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolygonEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolygonEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolygonEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polygon
 *  const editing$ = polygonsEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
var PolygonsEditorService = /** @class */ (function () {
    function PolygonsEditorService() {
        var _this = this;
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce(function (id, clampHeightTo3D, clampHeightTo3DOptions) {
            _this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    PolygonsEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, polygonsManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    PolygonsEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    PolygonsEditorService.prototype.clampPoints = function (id, clampHeightTo3D, _a) {
        var _this = this;
        var clampToTerrain = _a.clampToTerrain, clampMostDetailed = _a.clampMostDetailed, clampToHeightPickWidth = _a.clampToHeightPickWidth;
        if (clampHeightTo3D && clampMostDetailed) {
            var polygon = this.polygonsManager.get(id);
            var points_1 = polygon.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points_1.forEach(function (point) {
                    point.setPosition(_this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
                // const cartesians = points.map(point => point.getPosition());
                // const promise = this.cesiumScene.clampToHeightMostDetailed(cartesians, undefined, clampToHeightPickWidth);
                // promise.then((updatedCartesians) => {
                //   points.forEach((point, index) => {
                //     point.setPosition(updatedCartesians[index]);
                //   });
                // });
            }
            else {
                var cartographics = points_1.map(function (point) { return _this.coordinateConverter.cartesian3ToCartographic(point.getPosition()); });
                var promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                Cesium.when(promise, function (updatedPositions) {
                    points_1.forEach(function (point, index) {
                        point.setPosition(Cesium.Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    };
    PolygonsEditorService.prototype.screenToPosition = function (cartesian2, clampHeightTo3D, _a) {
        var _this = this;
        var clampToHeightPickWidth = _a.clampToHeightPickWidth, clampToTerrain = _a.clampToTerrain;
        var cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            var globePositionPick = function () {
                var ray = _this.cameraService.getCamera().getPickRay(cartesian2);
                return _this.cesiumScene.globe.pick(ray, _this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                var cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                var latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    };
    PolygonsEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var positions = [];
        var id = generateKey();
        var polygonOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            modifier: polygonOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            modifier: polygonOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var allPositions = _this.getPositions(id);
            if (allPositions.find(function (cartesian) { return cartesian.equals(position); })) {
                return;
            }
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign(__assign({}, updateValue), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
            }
        });
        addLastPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        });
        return editorObservable;
    };
    PolygonsEditorService.prototype.switchToEditMode = function (id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        var updateValue = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(__assign(__assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
        var changeMode = {
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
        }
        this.observablesMap.delete(id);
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    PolygonsEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        var id = generateKey();
        var polygonOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    };
    PolygonsEditorService.prototype.editPolygon = function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            modifier: options.removePointModifier,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.polygonsManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var position = _this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var point = entities[0];
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.polygonsManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                var endDragPosition = _this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                var startDragPosition = _this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            });
        }
        pointRemoveRegistration.subscribe(function (_a) {
            var entities = _a.entities;
            var point = entities[0];
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 4) {
                return;
            }
            var index = allPositions.findIndex(function (position) { return point.getPosition().equals(position); });
            if (index < 0) {
                return;
            }
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    PolygonsEditorService.prototype.setOptions = function (options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        var polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.pointProps), options.pointProps);
        polygonOptions.polygonProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps), options.polygonProps);
        polygonOptions.polylineProps = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps), options.polylineProps);
        polygonOptions.clampHeightTo3DOptions = __assign(__assign({}, DEFAULT_POLYGON_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error("Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D");
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn("Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D");
            }
            if (polygonOptions.pointProps.color.alpha === 1 || polygonOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polygonOptions.allowDrag = false;
            polygonOptions.polylineProps.clampToGround = true;
            polygonOptions.pointProps.heightReference = polygonOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            polygonOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polygonOptions;
    };
    PolygonsEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (points, polygonProps) {
            var polygon = _this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getCurrentPoints = function () { return _this.getPoints(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.polygonsManager.get(id).labels; };
        return observableToExtend;
    };
    PolygonsEditorService.prototype.getPositions = function (id) {
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    };
    PolygonsEditorService.prototype.getPoints = function (id) {
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    };
    PolygonsEditorService = __decorate([
        Injectable()
    ], PolygonsEditorService);
    return PolygonsEditorService;
}());

var PolygonsEditorComponent = /** @class */ (function () {
    function PolygonsEditorComponent(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager, cesiumService) {
        this.polygonsEditor = polygonsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.editPolygons$ = new Subject();
        this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.polygonsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    PolygonsEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.polygonsEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    PolygonsEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    PolygonsEditorComponent.prototype.renderEditLabels = function (polygon, update, labels) {
        update.positions = polygon.getRealPositions();
        update.points = polygon.getRealPoints();
        if (labels) {
            polygon.labels = labels;
            this.editPolygonsLayer.update(polygon, polygon.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polygon.labels = this.editLabelsRenderFn(update, polygon.labels);
        this.editPolygonsLayer.update(polygon, polygon.getId());
    };
    PolygonsEditorComponent.prototype.removeEditLabels = function (polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    };
    PolygonsEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.dispose();
                    this.removeEditLabels(polygon);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    PolygonsEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polygon, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = true;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    PolygonsEditorComponent.prototype.ngOnDestroy = function () {
        this.polygonsManager.clear();
    };
    PolygonsEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    PolygonsEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PolygonsEditorComponent.ctorParameters = function () { return [
        { type: PolygonsEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PolygonsManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editPolygonsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolygonsEditorComponent.prototype, "editPolygonsLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolygonsEditorComponent.prototype, "editPointsLayer", void 0);
    __decorate([
        ViewChild('editPolylinesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolygonsEditorComponent.prototype, "editPolylinesLayer", void 0);
    PolygonsEditorComponent = __decorate([
        Component({
            selector: 'polygons-editor',
            template: /*html*/ "\n    <ac-layer #editPolylinesLayer acFor=\"let polyline of editPolylines$\" [context]=\"this\">\n      <ac-polyline-desc\n        props=\"{\n        positions: polyline.getPositionsCallbackProperty(),\n        width: polyline.props.width,\n        material: polyline.props.material(),\n        clampToGround: polyline.props.clampToGround,\n        zIndex: polyline.props.zIndex,\n        classificationType: polyline.props.classificationType,\n      }\"\n      >\n      </ac-polyline-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPositionCallbackProperty(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point),\n        disableDepthTestDistance: point.props.disableDepthTestDistance,\n        heightReference: point.props.heightReference,\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editPolygonsLayer acFor=\"let polygon of editPolygons$\" [context]=\"this\">\n      <ac-polygon-desc\n        props=\"{\n          hierarchy: polygon.getPositionsHierarchyCallbackProperty(),\n          material: polygon.polygonProps.material,\n          fill: polygon.polygonProps.fill,\n          classificationType: polygon.polygonProps.classificationType,\n          zIndex: polygon.polygonProps.zIndex,\n        }\"\n      >\n      </ac-polygon-desc>\n      <ac-array-desc acFor=\"let label of polygon.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
            providers: [CoordinateConverter, PolygonsManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [PolygonsEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            PolygonsManagerService,
            CesiumService])
    ], PolygonsEditorComponent);
    return PolygonsEditorComponent;
}());

var EditArc = /** @class */ (function (_super) {
    __extends(EditArc, _super);
    function EditArc(entityId, center, radius, delta, angle, _arcProps) {
        var _this = _super.call(this) || this;
        _this._arcProps = _arcProps;
        _this.id = _this.generateId();
        _this.editedEntityId = entityId;
        _this._center = center;
        _this._radius = radius;
        _this._delta = delta;
        _this._angle = angle;
        return _this;
    }
    Object.defineProperty(EditArc.prototype, "props", {
        get: function () {
            return this._arcProps;
        },
        set: function (props) {
            this._arcProps = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "delta", {
        get: function () {
            return this._delta;
        },
        set: function (value) {
            this._delta = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (value) {
            this._center = value;
        },
        enumerable: true,
        configurable: true
    });
    EditArc.prototype.updateCenter = function (center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    };
    EditArc.prototype.getId = function () {
        return this.id;
    };
    EditArc.prototype.generateId = function () {
        return 'edit-arc-' + EditArc.counter++;
    };
    EditArc.counter = 0;
    return EditArc;
}(AcEntity));

var EditableCircle = /** @class */ (function (_super) {
    __extends(EditableCircle, _super);
    function EditableCircle(id, circlesLayer, pointsLayer, arcsLayer, options) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.circlesLayer = circlesLayer;
        _this.pointsLayer = pointsLayer;
        _this.arcsLayer = arcsLayer;
        _this.options = options;
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this._circleProps = __assign({}, options.circleProps);
        _this._pointProps = __assign({}, options.pointProps);
        _this._polylineProps = __assign({}, options.polylineProps);
        return _this;
    }
    Object.defineProperty(EditableCircle.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            var _this = this;
            if (!labels || !this._center || !this._radiusPoint) {
                return;
            }
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    if (index !== labels.length - 1) {
                        label.position = _this._center.getPosition();
                    }
                    else {
                        label.position = _this._radiusPoint.getPosition();
                    }
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "polylineProps", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "circleProps", {
        get: function () {
            return this._circleProps;
        },
        set: function (value) {
            this._circleProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "center", {
        get: function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "radiusPoint", {
        get: function () {
            return this._radiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._radiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditableCircle.prototype.setManually = function (center, radiusPoint, centerPointProp, radiusPointProp, circleProp) {
        if (centerPointProp === void 0) { centerPointProp = this.pointProps; }
        if (radiusPointProp === void 0) { radiusPointProp = this.pointProps; }
        if (circleProp === void 0) { circleProp = this.circleProps; }
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        if (!this._radiusPoint) {
            this._radiusPoint = new EditPoint(this.id, radiusPoint, radiusPointProp);
        }
        else {
            this._radiusPoint.setPosition(radiusPoint);
        }
        if (!this._outlineArc) {
            this.createOutlineArc();
        }
        else {
            this._outlineArc.radius = this.getRadius();
        }
        this.circleProps = circleProp;
        this.doneCreation = true;
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        if (!this._center) {
            this._center = new EditPoint(this.id, position, this.pointProps);
            this._radiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            if (!this._outlineArc) {
                this.createOutlineArc();
            }
        }
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.addLastPoint = function (position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.movePoint = function (toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.moveCircle = function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        var radius = this.getRadius();
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        var newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this._outlineArc.center = this._center.getPosition();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    EditableCircle.prototype.endMovePolygon = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditableCircle.prototype.getRadius = function () {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    };
    EditableCircle.prototype.getRadiusCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRadius.bind(this), false);
    };
    EditableCircle.prototype.getCenter = function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    EditableCircle.prototype.getCenterCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getCenter.bind(this), false);
    };
    EditableCircle.prototype.getRadiusPoint = function () {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    };
    EditableCircle.prototype.dispose = function () {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.remove(this._radiusPoint.getId());
        }
        if (this._outlineArc) {
            this.arcsLayer.remove(this._outlineArc.getId());
        }
        this.circlesLayer.remove(this.id);
    };
    EditableCircle.prototype.getId = function () {
        return this.id;
    };
    EditableCircle.prototype.updateCirclesLayer = function () {
        this.circlesLayer.update(this, this.id);
    };
    EditableCircle.prototype.updatePointsLayer = function () {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    };
    EditableCircle.prototype.updateArcsLayer = function () {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    };
    EditableCircle.prototype.createOutlineArc = function () {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    };
    return EditableCircle;
}(AcEntity));

var CirclesManagerService = /** @class */ (function () {
    function CirclesManagerService() {
        this.circles = new Map();
    }
    CirclesManagerService.prototype.createEditableCircle = function (id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        var editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    };
    CirclesManagerService.prototype.dispose = function (id) {
        var circle = this.circles.get(id);
        if (circle) {
            circle.dispose();
        }
        this.circles.delete(id);
    };
    CirclesManagerService.prototype.get = function (id) {
        return this.circles.get(id);
    };
    CirclesManagerService.prototype.clear = function () {
        this.circles.forEach(function (circle) { return circle.dispose(); });
        this.circles.clear();
    };
    CirclesManagerService = __decorate([
        Injectable()
    ], CirclesManagerService);
    return CirclesManagerService;
}());

var ɵ0$2 = function () { return Cesium.Color.WHITE.withAlpha(0.8); };
var DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: false,
        outlineWidth: 1,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
        shadows: Cesium.ShadowMode.DISABLED,
    },
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: ɵ0$2,
    },
};
/**
 * Service for creating editable circles
 *
 * You must provide `CircleEditorService` yourself.
 * PolygonsEditorService works together with `<circle-editor>` component. Therefor you need to create `<circle-editor>`
 * for each `CircleEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `CircleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `CircleEditorObservable`.
 * + To stop editing call `dsipose()` from the `CircleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `CircleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating circle
 *  const editing$ = circlesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
var CirclesEditorService = /** @class */ (function () {
    function CirclesEditorService() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    CirclesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    };
    CirclesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    CirclesEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var center;
        var id = generateKey();
        var circleOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                var update = {
                    id: id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                center = position;
            }
            else {
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                var changeMode = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
                finishedCreate = true;
            }
        });
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
            }
        });
        return editorObservable;
    };
    CirclesEditorService.prototype.edit = function (center, radius, options, priority) {
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var id = generateKey();
        var circleOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        var update = {
            id: id,
            center: center,
            radiusPoint: radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    };
    CirclesEditorService.prototype.editCircle = function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        pointDragRegistration
            .pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            var point = entities[0];
            var pointIsCenter = point === _this.getCenterPoint(id);
            var editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                _this.cameraService.enableInputs(true);
                return;
            }
            var update = {
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                startDragPosition: startDragPosition,
                endDragPosition: endDragPosition,
                editMode: EditModes.EDIT,
                editAction: editAction,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    center: _this.getCenterPosition(id),
                    radiusPoint: _this.getRadiusPosition(id),
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), _this.getCircleProperties(id)));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    CirclesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (center, radius, centerPointProp, radiusPointProp, circleProp) {
            var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            var circle = _this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.circlesManager.get(id).labels; };
        observableToExtend.getCenter = function () { return _this.getCenterPosition(id); };
        observableToExtend.getRadius = function () { return _this.getRadius(id); };
        return observableToExtend;
    };
    CirclesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        var circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    };
    CirclesEditorService.prototype.getCenterPosition = function (id) {
        return this.circlesManager.get(id).getCenter();
    };
    CirclesEditorService.prototype.getCenterPoint = function (id) {
        return this.circlesManager.get(id).center;
    };
    CirclesEditorService.prototype.getRadiusPosition = function (id) {
        return this.circlesManager.get(id).getRadiusPoint();
    };
    CirclesEditorService.prototype.getRadius = function (id) {
        return this.circlesManager.get(id).getRadius();
    };
    CirclesEditorService.prototype.getCircleProperties = function (id) {
        var circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    };
    CirclesEditorService = __decorate([
        Injectable()
    ], CirclesEditorService);
    return CirclesEditorService;
}());

var CirclesEditorComponent = /** @class */ (function () {
    function CirclesEditorComponent(circlesEditor, coordinateConverter, mapEventsManager, cameraService, circlesManager) {
        this.circlesEditor = circlesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editCircles$ = new Subject();
        this.editArcs$ = new Subject();
        this.circlesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.circlesManager);
        this.startListeningToEditorUpdates();
    }
    CirclesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.circlesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    CirclesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    CirclesEditorComponent.prototype.renderEditLabels = function (circle, update, labels) {
        update.center = circle.getCenter();
        update.radiusPoint = circle.getRadiusPoint();
        update.radius = circle.getRadius();
        if (labels) {
            circle.labels = labels;
            this.editCirclesLayer.update(circle, circle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        circle.labels = this.editLabelsRenderFn(update, circle.labels);
        this.editCirclesLayer.update(circle, circle.getId());
    };
    CirclesEditorComponent.prototype.removeEditLabels = function (circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    };
    CirclesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    this.removeEditLabels(circle);
                    this.circlesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    CirclesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                var circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = true;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    CirclesEditorComponent.prototype.ngOnDestroy = function () {
        this.circlesManager.clear();
    };
    CirclesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    CirclesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    CirclesEditorComponent.ctorParameters = function () { return [
        { type: CirclesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: CirclesManagerService }
    ]; };
    __decorate([
        ViewChild('editCirclesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], CirclesEditorComponent.prototype, "editCirclesLayer", void 0);
    __decorate([
        ViewChild('editArcsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], CirclesEditorComponent.prototype, "editArcsLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], CirclesEditorComponent.prototype, "editPointsLayer", void 0);
    CirclesEditorComponent = __decorate([
        Component({
            selector: 'circles-editor',
            template: /*html*/ "\n      <ac-layer #editArcsLayer acFor=\"let arc of editArcs$\" [context]=\"this\">\n          <ac-arc-desc\n                  props=\"{\n        angle: arc.angle,\n        delta: arc.delta,\n        center: arc.center,\n        radius: arc.radius,\n        quality: 30,\n        color: arc.props.material()\n    }\"\n          >\n          </ac-arc-desc>\n      </ac-layer>\n\n      <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n          <ac-point-desc\n                  props=\"{\n                    position: point.getPositionCallbackProperty(),\n                    pixelSize: getPointSize(point),\n                    color: point.props.color,\n                    outlineColor: point.props.outlineColor,\n                    outlineWidth: point.props.outlineWidth,\n                    show: getPointShow(point),\n                    disableDepthTestDistance: point.props.disableDepthTestDistance,\n                    heightReference: point.props.heightReference,\n    }\"\n          >\n          </ac-point-desc>\n      </ac-layer>\n\n      <ac-layer #editCirclesLayer acFor=\"let circle of editCircles$\" [context]=\"this\" [zIndex]=\"0\">\n          <ac-ellipse-desc\n                  props=\"{\n                  position: circle.getCenterCallbackProperty(),\n                  semiMajorAxis: circle.getRadiusCallbackProperty(),\n                  semiMinorAxis: circle.getRadiusCallbackProperty(),\n                  material: circle.circleProps.material,\n                  outline: circle.circleProps.outline,\n                  height: 0\n                  outlineWidth: circle.circleProps.outlineWidth,\n                  outlineColor: circle.circleProps.outlineColor,\n                  fill: circle.circleProps.fill,\n                  classificationType: circle.circleProps.classificationType,\n                  zIndex: circle.circleProps.zIndex,\n                  shadows: circle.circleProps.shadows,\n    }\"\n          >\n          </ac-ellipse-desc>\n\n          <ac-array-desc acFor=\"let label of circle.labels\" [idGetter]=\"getLabelId\">\n              <ac-label-primitive-desc\n                      props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n              >\n              </ac-label-primitive-desc>\n          </ac-array-desc>\n      </ac-layer>\n  ",
            providers: [CoordinateConverter, CirclesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [CirclesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            CirclesManagerService])
    ], CirclesEditorComponent);
    return CirclesEditorComponent;
}());

var EditableEllipse = /** @class */ (function (_super) {
    __extends(EditableEllipse, _super);
    function EditableEllipse(id, ellipsesLayer, pointsLayer, coordinateConverter, options) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.ellipsesLayer = ellipsesLayer;
        _this.pointsLayer = pointsLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.options = options;
        _this._rotation = 0;
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._minorRadiusPoints = [];
        _this._labels = [];
        _this._ellipseProps = __assign({}, options.ellipseProps);
        _this._pointProps = __assign({}, options.pointProps);
        return _this;
    }
    Object.defineProperty(EditableEllipse.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            var _this = this;
            if (!labels || !this._center) {
                return;
            }
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    if (index === 0) {
                        label.position = _this._center.getPosition();
                    }
                    else if (index === 1) {
                        label.position = _this._majorRadiusPoint
                            ? Cesium.Cartesian3.midpoint(_this.getCenter(), _this._majorRadiusPoint.getPosition(), new Cesium.Cartesian3())
                            : new Cesium.Cartesian3();
                    }
                    else if (index === 2) {
                        label.position =
                            _this._minorRadiusPoints.length > 0 && _this._minorRadius
                                ? Cesium.Cartesian3.midpoint(_this.getCenter(), _this.getMinorRadiusPointPosition(), new Cesium.Cartesian3())
                                : new Cesium.Cartesian3();
                    }
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "polylineProps", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "ellipseProps", {
        get: function () {
            return this._ellipseProps;
        },
        set: function (value) {
            this._ellipseProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "center", {
        get: function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "majorRadiusPoint", {
        get: function () {
            return this._majorRadiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    EditableEllipse.prototype.getMajorRadiusPointPosition = function () {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    };
    EditableEllipse.prototype.getMinorRadiusPointPosition = function () {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    };
    Object.defineProperty(EditableEllipse.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._majorRadiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditableEllipse.prototype.setManually = function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (centerPointProp === void 0) { centerPointProp = this.pointProps; }
        if (radiusPointProp === void 0) { radiusPointProp = this.pointProps; }
        if (ellipseProp === void 0) { ellipseProp = this.ellipseProps; }
        if (majorRadius < minorRadius) {
            throw new Error('Major radius muse be equal or greater than minor radius');
        }
        this._rotation = rotation;
        this._majorRadius = majorRadius;
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        var majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);
        if (!this._majorRadiusPoint) {
            this._majorRadiusPoint = new EditPoint(this.id, majorRadiusPosition, radiusPointProp);
        }
        else {
            this._majorRadiusPoint.setPosition(majorRadiusPosition);
        }
        if (minorRadius) {
            this._minorRadius = minorRadius;
        }
        this.ellipseProps = ellipseProp;
        this.doneCreation = true;
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        if (!this._center) {
            this._center = new EditPoint(this.id, position, this.pointProps);
            this._majorRadiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            this._majorRadius = 0;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.transformToEllipse = function () {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.addLastPoint = function (position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        var newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
        this._majorRadiusPoint.setPosition(position);
        this._majorRadius = newRadius;
        this.doneCreation = true;
        if (!this.options.circleToEllipseTransformation) {
            this._minorRadius = this._majorRadius;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.movePoint = function (toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        var newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
        if (this.majorRadiusPoint === editPoint) {
            if (newRadius < this._minorRadius) {
                this._majorRadius = this._minorRadius;
                this._majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), this._minorRadius, this._rotation));
            }
            else {
                this.majorRadiusPoint.setPosition(toPosition);
                this._majorRadius = newRadius;
            }
        }
        else {
            if (newRadius > this._majorRadius) {
                this._minorRadius = this._majorRadius;
            }
            else {
                this._minorRadius = newRadius;
            }
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.moveEllipse = function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        var majorRadius = this.getMajorRadius();
        var rotation = this.getRotation();
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        var newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    EditableEllipse.prototype.endMoveEllipse = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditableEllipse.prototype.updateMinorRadiusEditPoints = function () {
        if (this._minorRadius === undefined) {
            return;
        }
        if (this._minorRadiusPoints.length === 0) {
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
        }
        this._minorRadiusPoints[0].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2));
        this._minorRadiusPoints[1].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2));
    };
    EditableEllipse.prototype.getMajorRadius = function () {
        return this._majorRadius || 0;
    };
    EditableEllipse.prototype.getMinorRadius = function () {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    };
    EditableEllipse.prototype.getRotation = function () {
        return this._rotation || 0;
    };
    EditableEllipse.prototype.updateRotation = function () {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        var azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    };
    EditableEllipse.prototype.getRotationCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return Math.PI / 2 - _this.getRotation(); }, false);
    };
    EditableEllipse.prototype.getMinorRadiusCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getMinorRadius(); }, false);
    };
    EditableEllipse.prototype.getMajorRadiusCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getMajorRadius(); }, false);
    };
    EditableEllipse.prototype.getCenter = function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    EditableEllipse.prototype.getCenterCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getCenter(); }, false);
    };
    EditableEllipse.prototype.dispose = function () {
        var _this = this;
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.remove(this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints) {
            this._minorRadiusPoints.forEach(function (point) { return _this.pointsLayer.remove(point.getId()); });
        }
        this.ellipsesLayer.remove(this.id);
    };
    EditableEllipse.prototype.getId = function () {
        return this.id;
    };
    EditableEllipse.prototype.updateEllipsesLayer = function () {
        this.ellipsesLayer.update(this, this.id);
    };
    EditableEllipse.prototype.updatePointsLayer = function () {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.update(this._majorRadiusPoint, this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints.length > 0) {
            this.pointsLayer.update(this._minorRadiusPoints[0], this._minorRadiusPoints[0].getId());
            this.pointsLayer.update(this._minorRadiusPoints[1], this._minorRadiusPoints[1].getId());
        }
    };
    return EditableEllipse;
}(AcEntity));

var EllipsesManagerService = /** @class */ (function () {
    function EllipsesManagerService() {
        this.ellipses = new Map();
    }
    EllipsesManagerService.prototype.createEditableEllipse = function (id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        var editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    };
    EllipsesManagerService.prototype.dispose = function (id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    };
    EllipsesManagerService.prototype.get = function (id) {
        return this.ellipses.get(id);
    };
    EllipsesManagerService.prototype.clear = function () {
        this.ellipses.forEach(function (ellipse) { return ellipse.dispose(); });
        this.ellipses.clear();
    };
    EllipsesManagerService = __decorate([
        Injectable()
    ], EllipsesManagerService);
    return EllipsesManagerService;
}());

var ɵ0$3 = function () { return Cesium.Color.WHITE; };
var DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: true,
        outlineWidth: 1,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
        shadows: Cesium.ShadowMode.DISABLED,
    },
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: ɵ0$3,
    },
    circleToEllipseTransformation: false,
};
/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
var EllipsesEditorService = /** @class */ (function () {
    function EllipsesEditorService() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    EllipsesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, ellipsesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    EllipsesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    EllipsesEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var center;
        var id = generateKey();
        var ellipseOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                var update = {
                    id: id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
                center = position;
            }
            else {
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
                var changeMode = {
                    id: id,
                    center: center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign({}, update));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        });
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
            }
        });
        return editorObservable;
    };
    EllipsesEditorService.prototype.edit = function (center, majorRadius, rotation, minorRadius, options, priority) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var id = generateKey();
        var ellipseOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        var update = {
            id: id,
            center: center,
            majorRadius: majorRadius,
            rotation: rotation,
            minorRadius: minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    };
    EllipsesEditorService.prototype.editEllipse = function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        pointDragRegistration
            .pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.ellipsesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            var point = entities[0];
            var pointIsCenter = point === _this.getCenterPoint(id);
            var editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && _this.ellipsesManager.get(id).enableEdit &&
                (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                _this.cameraService.enableInputs(true);
                return;
            }
            var update = __assign({ id: id, updatedPoint: point, startDragPosition: startDragPosition,
                endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: editAction }, _this.getEllipseProperties(id));
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update));
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(function (_a) {
                var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
                var update = __assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.ellipsesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                var update = __assign({ id: id,
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    EllipsesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next(__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, _this.getEllipseProperties(id)));
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next(__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, _this.getEllipseProperties(id)));
        };
        observableToExtend.setManually = function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
            var ellipse = _this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.ellipsesManager.get(id).labels; };
        observableToExtend.getCenter = function () { return _this.getCenterPosition(id); };
        observableToExtend.getMajorRadius = function () { return _this.getMajorRadius(id); };
        observableToExtend.getMinorRadius = function () { return _this.getMinorRadius(id); };
        return observableToExtend;
    };
    EllipsesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        var ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    };
    EllipsesEditorService.prototype.getCenterPosition = function (id) {
        return this.ellipsesManager.get(id).getCenter();
    };
    EllipsesEditorService.prototype.getCenterPoint = function (id) {
        return this.ellipsesManager.get(id).center;
    };
    EllipsesEditorService.prototype.getMajorRadius = function (id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    };
    EllipsesEditorService.prototype.getMinorRadius = function (id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    };
    EllipsesEditorService.prototype.getEllipseProperties = function (id) {
        var ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    };
    EllipsesEditorService = __decorate([
        Injectable()
    ], EllipsesEditorService);
    return EllipsesEditorService;
}());

var EllipsesEditorComponent = /** @class */ (function () {
    function EllipsesEditorComponent(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager, cesiumService) {
        this.ellipsesEditor = ellipsesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editEllipses$ = new Subject();
        this.ellipsesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.ellipsesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    EllipsesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.ellipsesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    EllipsesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    EllipsesEditorComponent.prototype.renderEditLabels = function (ellipse, update, labels) {
        update.center = ellipse.getCenter();
        update.majorRadius = ellipse.getMajorRadius();
        update.minorRadius = ellipse.getMinorRadius();
        update.rotation = ellipse.getRotation();
        if (labels) {
            ellipse.labels = labels;
            this.editEllipsesLayer.update(ellipse, ellipse.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        ellipse.labels = this.editLabelsRenderFn(update, ellipse.labels);
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    };
    EllipsesEditorComponent.prototype.removeEditLabels = function (ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    };
    EllipsesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    this.removeEditLabels(ellipse);
                    this.ellipsesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    EllipsesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                var ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = true;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    EllipsesEditorComponent.prototype.ngOnDestroy = function () {
        this.ellipsesManager.clear();
    };
    EllipsesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    EllipsesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    EllipsesEditorComponent.ctorParameters = function () { return [
        { type: EllipsesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: EllipsesManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editEllipsesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], EllipsesEditorComponent.prototype, "editEllipsesLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], EllipsesEditorComponent.prototype, "editPointsLayer", void 0);
    EllipsesEditorComponent = __decorate([
        Component({
            selector: 'ellipses-editor',
            template: /*html*/ "\n      <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n          <ac-point-desc\n                  props=\"{\n                    position: point.getPositionCallbackProperty(),\n                    pixelSize: getPointSize(point),\n                    color: point.props.color,\n                    outlineColor: point.props.outlineColor,\n                    outlineWidth: point.props.outlineWidth,\n                    show: getPointShow(point),\n                    disableDepthTestDistance: point.props.disableDepthTestDistance,\n                    heightReference: point.props.heightReference,\n    }\"\n          >\n          </ac-point-desc>\n      </ac-layer>\n\n      <ac-layer #editEllipsesLayer acFor=\"let ellipse of editEllipses$\" [context]=\"this\" [zIndex]=\"0\">\n          <ac-ellipse-desc\n                  props=\"{\n                    position: ellipse.getCenterCallbackProperty(),\n                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),\n                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),\n                    rotation: ellipse.getRotationCallbackProperty(),\n                    material: ellipse.ellipseProps.material,\n                    outline: ellipse.ellipseProps.outline,\n                    outlineWidth: ellipse.ellipseProps.outlineWidth,\n                    outlineColor: ellipse.ellipseProps.outlineColor,\n                    height: 0,\n                    fill: ellipse.ellipseProps.fill,\n                    classificationType: ellipse.ellipseProps.classificationType,\n                    zIndex: ellipse.ellipseProps.zIndex,\n                    shadows: ellipse.ellipseProps.shadows,\n    }\"\n          >\n          </ac-ellipse-desc>\n\n          <ac-array-desc acFor=\"let label of ellipse.labels\" [idGetter]=\"getLabelId\">\n              <ac-label-primitive-desc\n                      props=\"{\n                        position: label.position,\n                        text: label.text,\n                        backgroundColor: label.backgroundColor,\n                        backgroundPadding: label.backgroundPadding,\n                        distanceDisplayCondition: label.distanceDisplayCondition,\n                        eyeOffset: label.eyeOffset,\n                        fillColor: label.fillColor,\n                        font: label.font,\n                        heightReference: label.heightReference,\n                        horizontalOrigin: label.horizontalOrigin,\n                        outlineColor: label.outlineColor,\n                        outlineWidth: label.outlineWidth,\n                        pixelOffset: label.pixelOffset,\n                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n                        scale: label.scale,\n                        scaleByDistance: label.scaleByDistance,\n                        show: label.show,\n                        showBackground: label.showBackground,\n                        style: label.style,\n                        translucencyByDistance: label.translucencyByDistance,\n                        verticalOrigin: label.verticalOrigin,\n                        disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n              >\n              </ac-label-primitive-desc>\n          </ac-array-desc>\n      </ac-layer>\n  ",
            providers: [CoordinateConverter, EllipsesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [EllipsesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            EllipsesManagerService,
            CesiumService])
    ], EllipsesEditorComponent);
    return EllipsesEditorComponent;
}());

var EditablePolyline = /** @class */ (function (_super) {
    __extends(EditablePolyline, _super);
    function EditablePolyline(id, pointsLayer, polylinesLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.editOptions = editOptions;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this._pointProps = __assign({}, editOptions.pointProps);
        _this.props = __assign({}, editOptions.polylineProps);
        if (positions && positions.length >= 2) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolyline.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var positions = this.getRealPositions();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "props", {
        get: function () {
            return this.polylineProps;
        },
        set: function (value) {
            this.polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditablePolyline.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    };
    EditablePolyline.prototype.setManually = function (points, polylineProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            var pointOrCartesian = points[i];
            var newPoint = null;
            if (pointOrCartesian.pointProps) {
                newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
            }
            else {
                newPoint = new EditPoint(this.id, pointOrCartesian, this._pointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polylineProps = polylineProps ? polylineProps : this.polylineProps;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.addAllVirtualEditPoints();
    };
    EditablePolyline.prototype.addAllVirtualEditPoints = function () {
        var _this = this;
        var currentPoints = __spread(this.positions);
        currentPoints.forEach(function (pos, index) {
            if (index !== currentPoints.length - 1) {
                var currentPoint = pos;
                var nextIndex = (index + 1) % (currentPoints.length);
                var nextPoint = currentPoints[nextIndex];
                var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
                _this.updatePointsLayer(false, midPoint);
            }
        });
    };
    EditablePolyline.prototype.setMiddleVirtualPoint = function (firstP, secondP) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cesium.Cartesian3());
        var midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    EditablePolyline.prototype.updateMiddleVirtualPoint = function (virtualEditPoint, prevPoint, nextPoint) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cesium.Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    };
    EditablePolyline.prototype.changeVirtualPointToRealPoint = function (point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        var pointsCount = this.positions.length;
        var pointIndex = this.positions.indexOf(point);
        var nextIndex = (pointIndex + 1) % (pointsCount);
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        var nextPoint = this.positions[nextIndex];
        var prePoint = this.positions[preIndex];
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    };
    EditablePolyline.prototype.renderPolylines = function () {
        var _this = this;
        this.polylines.forEach(function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); });
        this.polylines = [];
        var realPoints = this.positions.filter(function (point) { return !point.isVirtualEditPoint(); });
        realPoints.forEach(function (point, index) {
            if (index !== realPoints.length - 1) {
                var nextIndex = (index + 1);
                var nextPoint = realPoints[nextIndex];
                var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.polylineProps);
                _this.polylines.push(polyline);
                _this.polylinesLayer.update(polyline, polyline.getId());
            }
        });
    };
    EditablePolyline.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    EditablePolyline.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    };
    EditablePolyline.prototype.movePointFinish = function (editPoint) {
        if (this.editOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    };
    EditablePolyline.prototype.movePoint = function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.editOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            var pointsCount = this.positions.length;
            var pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            }
            if (pointIndex > 0) {
                var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    };
    EditablePolyline.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditablePolyline.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach(function (point) {
            var newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditablePolyline.prototype.endMoveShape = function () {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
    };
    EditablePolyline.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter(function (p) { return p.isVirtualEditPoint(); })
            .forEach(function (p) { return _this.removePosition(p); });
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    };
    EditablePolyline.prototype.addLastPoint = function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    };
    EditablePolyline.prototype.getRealPositions = function () {
        return this.getRealPoints()
            .map(function (position) { return position.getPosition(); });
    };
    EditablePolyline.prototype.getRealPoints = function () {
        var _this = this;
        return this.positions
            .filter(function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; });
    };
    EditablePolyline.prototype.getPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return position !== _this.movingPoint; });
    };
    EditablePolyline.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditablePolyline.prototype.getPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositions.bind(this), false);
    };
    EditablePolyline.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditablePolyline.prototype.updatePointsLayer = function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var point = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            point[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditablePolyline.prototype.update = function () {
        this.updatePointsLayer();
    };
    EditablePolyline.prototype.dispose = function () {
        var _this = this;
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        this.polylines.forEach(function (line) { return _this.polylinesLayer.remove(line.getId()); });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditablePolyline.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditablePolyline.prototype.getId = function () {
        return this.id;
    };
    return EditablePolyline;
}(AcEntity));

var EditableRectangle = /** @class */ (function (_super) {
    __extends(EditableRectangle, _super);
    function EditableRectangle(id, pointsLayer, rectangleLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.rectangleLayer = rectangleLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.done = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.defaultPointProps = __assign({}, editOptions.pointProps);
        _this.rectangleProps = __assign({}, editOptions.rectangleProps);
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableRectangle.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var positions = this.getRealPositions();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableRectangle.prototype, "rectangleProps", {
        get: function () {
            return this._rectangleProps;
        },
        set: function (value) {
            this._rectangleProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableRectangle.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableRectangle.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditableRectangle.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.updateRectangleLayer();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.done = true;
    };
    EditableRectangle.prototype.setPointsManually = function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after rectangle is created');
        }
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        this.positions = points;
        this.updatePointsLayer.apply(this, __spread(points));
        this.updateRectangleLayer();
    };
    EditableRectangle.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    EditableRectangle.prototype.addPoint = function (position) {
        if (this.done) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateRectangleLayer();
            this.done = true;
            this.movingPoint = null;
        }
    };
    EditableRectangle.prototype.movePoint = function (toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateRectangleLayer();
        }
    };
    EditableRectangle.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var lastDraggedCartographic = Cesium.Cartographic.fromCartesian(this.lastDraggedToPosition);
        var draggedToPositionCartographic = Cesium.Cartographic.fromCartesian(draggedToPosition);
        this.getRealPoints().forEach(function (point) {
            var cartographic = Cesium.Cartographic.fromCartesian(point.getPosition());
            cartographic.longitude += (draggedToPositionCartographic.longitude - lastDraggedCartographic.longitude);
            cartographic.latitude += (draggedToPositionCartographic.latitude - lastDraggedCartographic.latitude);
            point.setPosition(Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0));
        });
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateRectangleLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditableRectangle.prototype.endMoveShape = function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.positions.forEach(function (point) { return _this.updatePointsLayer(point); });
        this.updateRectangleLayer();
    };
    EditableRectangle.prototype.endMovePoint = function () {
        this.updatePointsLayer.apply(this, __spread(this.positions));
    };
    EditableRectangle.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditableRectangle.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
    };
    EditableRectangle.prototype.addLastPoint = function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    EditableRectangle.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditableRectangle.prototype.getRealPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    EditableRectangle.prototype.getRealPoints = function () {
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint(); });
    };
    EditableRectangle.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditableRectangle.prototype.getRectangle = function () {
        var cartographics = this.getPositions().map(function (cartesian) { return Cesium.Cartographic.fromCartesian(cartesian); });
        var longitudes = cartographics.map(function (position) { return position.longitude; });
        var latitudes = cartographics.map(function (position) { return position.latitude; });
        return new Cesium.Rectangle(Math.min.apply(Math, __spread(longitudes)), Math.min.apply(Math, __spread(latitudes)), Math.max.apply(Math, __spread(longitudes)), Math.max.apply(Math, __spread(latitudes)));
    };
    EditableRectangle.prototype.getRectangleCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRectangle.bind(this), false);
    };
    EditableRectangle.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditableRectangle.prototype.updatePointsLayer = function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditableRectangle.prototype.updateRectangleLayer = function () {
        this.rectangleLayer.update(this, this.id);
    };
    EditableRectangle.prototype.dispose = function () {
        var _this = this;
        this.rectangleLayer.remove(this.id);
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditableRectangle.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditableRectangle.prototype.getId = function () {
        return this.id;
    };
    return EditableRectangle;
}(AcEntity));

var EditorObservable = /** @class */ (function (_super) {
    __extends(EditorObservable, _super);
    function EditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EditorObservable;
}(Observable));

var PointEditorObservable = /** @class */ (function (_super) {
    __extends(PointEditorObservable, _super);
    function PointEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointEditorObservable;
}(EditorObservable));

var PolylineEditorObservable = /** @class */ (function (_super) {
    __extends(PolylineEditorObservable, _super);
    function PolylineEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolylineEditorObservable;
}(EditorObservable));

var PolygonEditorObservable = /** @class */ (function (_super) {
    __extends(PolygonEditorObservable, _super);
    function PolygonEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolygonEditorObservable;
}(EditorObservable));

var RectangleEditorObservable = /** @class */ (function (_super) {
    __extends(RectangleEditorObservable, _super);
    function RectangleEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RectangleEditorObservable;
}(EditorObservable));

var CircleEditorObservable = /** @class */ (function (_super) {
    __extends(CircleEditorObservable, _super);
    function CircleEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CircleEditorObservable;
}(EditorObservable));

var EllipseEditorObservable = /** @class */ (function (_super) {
    __extends(EllipseEditorObservable, _super);
    function EllipseEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EllipseEditorObservable;
}(EditorObservable));

var HippodromeEditorObservable = /** @class */ (function (_super) {
    __extends(HippodromeEditorObservable, _super);
    function HippodromeEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HippodromeEditorObservable;
}(EditorObservable));

var EditableHippodrome = /** @class */ (function (_super) {
    __extends(EditableHippodrome, _super);
    function EditableHippodrome(id, pointsLayer, hippodromeLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.hippodromeLayer = hippodromeLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.done = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.defaultPointProps = __assign({}, editOptions.pointProps);
        _this.hippodromeProps = __assign({}, editOptions.hippodromeProps);
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableHippodrome.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var positions = this.getRealPositions();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "hippodromeProps", {
        get: function () {
            return this._hippodromeProps;
        },
        set: function (value) {
            this._hippodromeProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditableHippodrome.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.done = true;
    };
    EditableHippodrome.prototype.setPointsManually = function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(points));
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    EditableHippodrome.prototype.addPoint = function (position) {
        if (this.done) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    };
    EditableHippodrome.prototype.createHeightEditPoints = function () {
        var _this = this;
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
        var firstP = this.getRealPoints()[0];
        var secP = this.getRealPoints()[1];
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        var bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        var upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        var downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    };
    EditableHippodrome.prototype.createMiddleEditablePoint = function (midPointCartesian3, azimuth) {
        var upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        var midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    };
    EditableHippodrome.prototype.movePoint = function (toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    };
    EditableHippodrome.prototype.changeWidthByNewPoint = function (toPosition) {
        var firstP = this.getRealPoints()[0];
        var secP = this.getRealPoints()[1];
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        var bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        var normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        var bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        var fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        var distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        var radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach(function (point) {
            var newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditableHippodrome.prototype.endMoveShape = function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach(function (point) { return _this.updatePointsLayer(point); });
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.endMovePoint = function () {
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
    };
    EditableHippodrome.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditableHippodrome.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
    };
    EditableHippodrome.prototype.addLastPoint = function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    EditableHippodrome.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditableHippodrome.prototype.getRealPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    EditableHippodrome.prototype.getRealPoints = function () {
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint(); });
    };
    EditableHippodrome.prototype.getWidth = function () {
        return this.hippodromeProps.width;
    };
    EditableHippodrome.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditableHippodrome.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditableHippodrome.prototype.updatePointsLayer = function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditableHippodrome.prototype.updateHippdromeLayer = function () {
        this.hippodromeLayer.update(this, this.id);
    };
    EditableHippodrome.prototype.dispose = function () {
        var _this = this;
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditableHippodrome.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditableHippodrome.prototype.getId = function () {
        return this.id;
    };
    return EditableHippodrome;
}(AcEntity));

var ɵ0$4 = function () { return Cesium.Color.BLACK; };
var DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.95),
        outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        material: ɵ0$4,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: Cesium.ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
    },
};
/**
 * Service for creating editable polylines
 *
 *  * You must provide `PolylineEditorService` yourself.
 * PolygonsEditorService works together with `<polylines-editor>` component. Therefor you need to create `<polylines-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolylineEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolylineEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolylineEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolylineEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polyline
 *  const editing$ = polylinesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
var PolylinesEditorService = /** @class */ (function () {
    function PolylinesEditorService() {
        var _this = this;
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce(function (id, clampHeightTo3D, clampHeightTo3DOptions) {
            _this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    PolylinesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, polylinesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    PolylinesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    PolylinesEditorService.prototype.clampPoints = function (id, clampHeightTo3D, _a) {
        var _this = this;
        var clampToTerrain = _a.clampToTerrain, clampMostDetailed = _a.clampMostDetailed, clampToHeightPickWidth = _a.clampToHeightPickWidth;
        if (clampHeightTo3D && clampMostDetailed) {
            var polyline = this.polylinesManager.get(id);
            var points_1 = polyline.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points_1.forEach(function (point) {
                    point.setPosition(_this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
            }
            else {
                var cartographics = points_1.map(function (point) { return _this.coordinateConverter.cartesian3ToCartographic(point.getPosition()); });
                var promise = Cesium.sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                Cesium.when(promise, function (updatedPositions) {
                    points_1.forEach(function (point, index) {
                        point.setPosition(Cesium.Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    };
    PolylinesEditorService.prototype.screenToPosition = function (cartesian2, clampHeightTo3D, _a) {
        var _this = this;
        var clampToHeightPickWidth = _a.clampToHeightPickWidth, clampToTerrain = _a.clampToTerrain;
        var cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            var globePositionPick = function () {
                var ray = _this.cameraService.getCamera().getPickRay(cartesian2);
                return _this.cesiumScene.globe.pick(ray, _this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                var cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                var latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    };
    PolylinesEditorService.prototype.create = function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        var positions = [];
        var id = generateKey();
        var polylineOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            modifier: polylineOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            modifier: polylineOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var allPositions = _this.getPositions(id);
            if (allPositions.find(function (cartesian) { return cartesian.equals(position); })) {
                return;
            }
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign(__assign({}, updateValue), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        });
        addLastPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        });
        return editorObservable;
    };
    PolylinesEditorService.prototype.switchToEditMode = function (id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        var update = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        var changeMode = {
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    PolylinesEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        var id = generateKey();
        var polylineOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    };
    PolylinesEditorService.prototype.editPolyline = function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.editedEntityId; },
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.polylinesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                var endDragPosition = _this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                var startDragPosition = _this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            });
        }
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.polylinesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var position = _this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            var point = entities[0];
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        pointRemoveRegistration.subscribe(function (_a) {
            var entities = _a.entities;
            var point = entities[0];
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 3) {
                return;
            }
            var index = allPositions.findIndex(function (position) { return point.getPosition().equals(position); });
            if (index < 0) {
                return;
            }
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            _this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    PolylinesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        var polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps), options.pointProps);
        polylineOptions.polylineProps = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps), options.polylineProps);
        polylineOptions.clampHeightTo3DOptions = __assign(__assign({}, DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error("Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D");
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn("Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D");
            }
            if (polylineOptions.pointProps.color.alpha === 1 || polylineOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polylineOptions.allowDrag = false;
            polylineOptions.polylineProps.clampToGround = true;
            polylineOptions.pointProps.heightReference = polylineOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            polylineOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polylineOptions;
    };
    PolylinesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (points, polylineProps) {
            var polyline = _this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getCurrentPoints = function () { return _this.getPoints(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.polylinesManager.get(id).labels; };
        return observableToExtend;
    };
    PolylinesEditorService.prototype.getPositions = function (id) {
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    };
    PolylinesEditorService.prototype.getPoints = function (id) {
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    };
    PolylinesEditorService = __decorate([
        Injectable()
    ], PolylinesEditorService);
    return PolylinesEditorService;
}());

var PolylinesManagerService = /** @class */ (function () {
    function PolylinesManagerService() {
        this.polylines = new Map();
    }
    PolylinesManagerService.prototype.createEditablePolyline = function (id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        var editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    };
    PolylinesManagerService.prototype.get = function (id) {
        return this.polylines.get(id);
    };
    PolylinesManagerService.prototype.clear = function () {
        this.polylines.forEach(function (polyline) { return polyline.dispose(); });
        this.polylines.clear();
    };
    PolylinesManagerService = __decorate([
        Injectable()
    ], PolylinesManagerService);
    return PolylinesManagerService;
}());

var PolylinesEditorComponent = /** @class */ (function () {
    function PolylinesEditorComponent(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager, cesiumService) {
        this.polylinesEditor = polylinesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.polylineLabels$ = new Subject();
        this.polylinesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polylinesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    PolylinesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.polylinesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    PolylinesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    PolylinesEditorComponent.prototype.renderEditLabels = function (polyline, update, labels) {
        update.positions = polyline.getRealPositions();
        update.points = polyline.getRealPoints();
        if (labels) {
            polyline.labels = labels;
            this.polylineLabelsLayer.update(polyline, polyline.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polyline.labels = this.editLabelsRenderFn(update, polyline.labels);
        this.polylineLabelsLayer.update(polyline, polyline.getId());
    };
    PolylinesEditorComponent.prototype.removeEditLabels = function (polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    };
    PolylinesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.dispose();
                    this.removeEditLabels(polyline);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    PolylinesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polyline, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.endMoveShape();
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    PolylinesEditorComponent.prototype.ngOnDestroy = function () {
        this.polylinesManager.clear();
    };
    PolylinesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    PolylinesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PolylinesEditorComponent.ctorParameters = function () { return [
        { type: PolylinesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PolylinesManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolylinesEditorComponent.prototype, "editPointsLayer", void 0);
    __decorate([
        ViewChild('editPolylinesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolylinesEditorComponent.prototype, "editPolylinesLayer", void 0);
    __decorate([
        ViewChild('polylineLabelsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], PolylinesEditorComponent.prototype, "polylineLabelsLayer", void 0);
    PolylinesEditorComponent = __decorate([
        Component({
            selector: 'polylines-editor',
            template: /*html*/ "\n    <ac-layer #editPolylinesLayer acFor=\"let polyline of editPolylines$\" [context]=\"this\">\n      <ac-polyline-desc\n        props=\"{\n        positions: polyline.getPositionsCallbackProperty(),\n        width: polyline.props.width,\n        material: polyline.props.material(),\n        clampToGround: polyline.props.clampToGround,\n        zIndex: polyline.props.zIndex,\n        classificationType: polyline.props.classificationType,\n      }\"\n      >\n      </ac-polyline-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPositionCallbackProperty(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point),\n        disableDepthTestDistance: point.props.disableDepthTestDistance,\n        heightReference: point.props.heightReference,\n    }\"\n      ></ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #polylineLabelsLayer acFor=\"let polylineLabels of polylineLabels$\" [context]=\"this\">\n      <ac-array-desc acFor=\"let label of polylineLabels.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
            providers: [CoordinateConverter, PolylinesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [PolylinesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            PolylinesManagerService,
            CesiumService])
    ], PolylinesEditorComponent);
    return PolylinesEditorComponent;
}());

var HippodromeManagerService = /** @class */ (function () {
    function HippodromeManagerService() {
        this.hippodromes = new Map();
    }
    HippodromeManagerService.prototype.createEditableHippodrome = function (id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        var editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    };
    HippodromeManagerService.prototype.get = function (id) {
        return this.hippodromes.get(id);
    };
    HippodromeManagerService.prototype.clear = function () {
        this.hippodromes.forEach(function (hippodrome) { return hippodrome.dispose(); });
        this.hippodromes.clear();
    };
    HippodromeManagerService = __decorate([
        Injectable()
    ], HippodromeManagerService);
    return HippodromeManagerService;
}());

var DEFAULT_HIPPODROME_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    hippodromeProps: {
        fill: true,
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        outline: true,
        width: 200000.0,
        outlineWidth: 1,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
        classificationType: Cesium.ClassificationType.BOTH,
        zIndex: 0,
        shadows: Cesium.ShadowMode.DISABLED,
    },
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
var HippodromeEditorService = /** @class */ (function () {
    function HippodromeEditorService() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    HippodromeEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    };
    HippodromeEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    HippodromeEditorService.prototype.create = function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        var positions = [];
        var id = generateKey();
        var hippodromeOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            var allPositions = _this.getPositions(id);
            var isFirstPoint = _this.getPositions(id).length === 0;
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign(__assign({}, updateValue), { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            if (!isFirstPoint) {
                var changeMode = {
                    id: id,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(changeMode);
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
                finishedCreate = true;
            }
        });
        return editorObservable;
    };
    HippodromeEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        var id = generateKey();
        var hippodromeEditOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    };
    HippodromeEditorService.prototype.editHippodrome = function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.hippodromeManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            var point = entities[0];
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.hippodromeManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    HippodromeEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        var hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
    };
    HippodromeEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) {
            var firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            var secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            var hippodrome = _this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getCurrentPoints = function () { return _this.getPoints(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.hippodromeManager.get(id).labels; };
        observableToExtend.getCurrentWidth = function () { return _this.getWidth(id); };
        return observableToExtend;
    };
    HippodromeEditorService.prototype.getPositions = function (id) {
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    };
    HippodromeEditorService.prototype.getPoints = function (id) {
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    };
    HippodromeEditorService.prototype.getWidth = function (id) {
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    };
    HippodromeEditorService = __decorate([
        Injectable()
    ], HippodromeEditorService);
    return HippodromeEditorService;
}());

var HippodromeEditorComponent = /** @class */ (function () {
    function HippodromeEditorComponent(hippodromesEditor, coordinateConverter, mapEventsManager, cameraService, hippodromesManager) {
        this.hippodromesEditor = hippodromesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.hippodromesManager = hippodromesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editHippodromes$ = new Subject();
        this.hippodromesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, hippodromesManager);
        this.startListeningToEditorUpdates();
    }
    HippodromeEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.hippodromesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    HippodromeEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    HippodromeEditorComponent.prototype.renderEditLabels = function (hippodrome, update, labels) {
        update.positions = hippodrome.getRealPositions();
        update.points = hippodrome.getRealPoints();
        if (labels) {
            hippodrome.labels = labels;
            this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        hippodrome.labels = this.editLabelsRenderFn(update, hippodrome.labels);
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    };
    HippodromeEditorComponent.prototype.removeEditLabels = function (hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    };
    HippodromeEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.dispose();
                    this.removeEditLabels(hippodrome);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    HippodromeEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMoveShape();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    HippodromeEditorComponent.prototype.ngOnDestroy = function () {
        this.hippodromesManager.clear();
    };
    HippodromeEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    HippodromeEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    HippodromeEditorComponent.ctorParameters = function () { return [
        { type: HippodromeEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: HippodromeManagerService }
    ]; };
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], HippodromeEditorComponent.prototype, "editPointsLayer", void 0);
    __decorate([
        ViewChild('editHippodromesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], HippodromeEditorComponent.prototype, "editHippodromesLayer", void 0);
    HippodromeEditorComponent = __decorate([
        Component({
            selector: 'hippodrome-editor',
            template: /*html*/ "\n      <ac-layer #editHippodromesLayer acFor=\"let hippodrome of editHippodromes$\" [context]=\"this\">\n          <ac-corridor-desc props=\"{\n            positions: hippodrome.getRealPositionsCallbackProperty(),\n            cornerType: Cesium.CornerType.ROUNDED,\n            material: hippodrome.hippodromeProps.material,\n            width : hippodrome.hippodromeProps.width,\n            outline: hippodrome.hippodromeProps.outline,\n            outlineColor: hippodrome.hippodromeProps.outlineColor,\n            outlineWidth: hippodrome.hippodromeProps.outlineWidth,\n            height: 0,\n            classificationType: hippodrome.hippodromeProps.classificationType,\n            zIndex: hippodrome.hippodromeProps.zIndex,\n            shadows: hippodrome.hippodromeProps.shadows,\n    }\">\n          </ac-corridor-desc>\n\n          <ac-array-desc acFor=\"let label of hippodrome.labels\" [idGetter]=\"getLabelId\">\n              <ac-label-primitive-desc props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\">\n              </ac-label-primitive-desc>\n          </ac-array-desc>\n      </ac-layer>\n\n      <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n          <ac-point-desc props=\"{\n         position: point.getPositionCallbackProperty(),\n         pixelSize: getPointSize(point),\n         color: point.props.color,\n         outlineColor: point.props.outlineColor,\n         outlineWidth: point.props.outlineWidth,\n         show: getPointShow(point),\n         disableDepthTestDistance: point.props.disableDepthTestDistance,\n         heightReference: point.props.heightReference,\n    }\">\n          </ac-point-desc>\n      </ac-layer>\n  ",
            providers: [CoordinateConverter, HippodromeManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [HippodromeEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            HippodromeManagerService])
    ], HippodromeEditorComponent);
    return HippodromeEditorComponent;
}());

/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
var DraggableToMapService = /** @class */ (function () {
    function DraggableToMapService(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    DraggableToMapService.prototype.setCoordinateConverter = function (coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    };
    DraggableToMapService.prototype.drag = function (imageSrc, style) {
        var _this = this;
        if (!this.coordinateConverter) {
            var mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        var imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.style.position = 'fixed';
        imgElement.style.visibility = 'hidden';
        imgElement.style.width = '30px';
        imgElement.style.height = '30px';
        imgElement.style['user-drag'] = 'none';
        imgElement.style['user-select'] = 'none';
        imgElement.style['-moz-user-select'] = 'none';
        imgElement.style['-webkit-user-drag'] = 'none';
        imgElement.style['-webkit-user-select'] = 'none';
        imgElement.style['-ms-user-select'] = 'none';
        Object.assign(imgElement.style, style);
        document.body.appendChild(imgElement);
        this.createDragObservable();
        this.dragObservable.subscribe(function (e) {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            _this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }, function (e) {
            imgElement.remove();
        }, function () {
            imgElement.remove();
        });
    };
    DraggableToMapService.prototype.dragUpdates = function () {
        return this.mainSubject;
    };
    DraggableToMapService.prototype.cancel = function () {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    };
    DraggableToMapService.prototype.createDragObservable = function () {
        var _this = this;
        var stopper = new Subject();
        var dropSubject = new Subject();
        var pointerUp = fromEvent(document, 'pointerup');
        var pointerMove = fromEvent(document, 'pointermove');
        var dragStartPositionX;
        var dragStartPositionY;
        var lastMove;
        var moveObservable = pointerMove.pipe(map(function (e) {
            dragStartPositionX = dragStartPositionX ? dragStartPositionX : e.x;
            dragStartPositionY = dragStartPositionY ? dragStartPositionY : e.y;
            lastMove = {
                drop: false,
                initialScreenPosition: {
                    x: dragStartPositionX,
                    y: dragStartPositionY,
                },
                screenPosition: {
                    x: e.x,
                    y: e.y,
                },
                mapPosition: _this.coordinateConverter ?
                    _this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        }), takeUntil(pointerUp), tap(undefined, undefined, function () {
            if (lastMove) {
                var dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        }));
        this.dragObservable = moveObservable.pipe(merge$1(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    };
    DraggableToMapService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: MapsManagerService }
    ]; };
    DraggableToMapService = __decorate([
        Injectable(),
        __param(0, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Object, MapsManagerService])
    ], DraggableToMapService);
    return DraggableToMapService;
}());

/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * @Input {src: string, style?: any} | string -
 * the [src: string | string] should be the image src of the dragged image.
 * The style is an optional style object for the image.
 *
 * example:
 * ```
 * <a href="..." class="..." [draggableToMap]="{src: '../assets/GitHub-Mark-Light.png', style: {width: '50px', height: '50px'}}">
 *     <img class="github" src="../assets/GitHub-Mark-Light.png">
 * </a>
 * ```
 *
 * In order the get notified of the dragging location  and drop state subscribe to `DraggableToMapService.dragUpdates()`
 * ```
 *  this.iconDragService.dragUpdates().subscribe(e => console.log(e));
 * ```
 *
 * In order the cancel dragging use `DraggableToMapService.cancel()`
 * ```
 *  this.iconDragService.cancel();
 * ```
 */
var DraggableToMapDirective = /** @class */ (function () {
    function DraggableToMapDirective(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    DraggableToMapDirective.prototype.ngOnInit = function () {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    };
    DraggableToMapDirective.prototype.onMouseDown = function () {
        this.iconDragService.drag(this.src, this.style);
    };
    DraggableToMapDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DraggableToMapService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], DraggableToMapDirective.prototype, "draggableToMap", void 0);
    __decorate([
        HostListener('mousedown'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DraggableToMapDirective.prototype, "onMouseDown", null);
    DraggableToMapDirective = __decorate([
        Directive({ selector: '[draggableToMap]' }),
        __metadata("design:paramtypes", [ElementRef, DraggableToMapService])
    ], DraggableToMapDirective);
    return DraggableToMapDirective;
}());

/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
var AcToolbarComponent = /** @class */ (function () {
    function AcToolbarComponent(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.onDrag = new EventEmitter();
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    AcToolbarComponent.prototype.ngOnInit = function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            this.listenForDragging();
        }
    };
    AcToolbarComponent.prototype.ngOnChanges = function (changes) {
        if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
            this.listenForDragging();
        }
        if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
            this.dragSubscription.unsubscribe();
        }
    };
    AcToolbarComponent.prototype.ngOnDestroy = function () {
        if (this.dragSubscription) {
            this.dragSubscription.unsubscribe();
        }
    };
    AcToolbarComponent.prototype.listenForDragging = function () {
        var _this = this;
        this.mouseDown$ = this.mouseDown$ || fromEvent(this.element.nativeElement, 'mousedown');
        this.mouseMove$ = this.mouseMove$ || fromEvent(document, 'mousemove');
        this.mouseUp$ = this.mouseUp$ || fromEvent(document, 'mouseup');
        this.drag$ = this.drag$ ||
            this.mouseDown$.pipe(switchMap(function () { return _this.mouseMove$.pipe(tap(_this.onDrag.emit), takeUntil(_this.mouseUp$)); }));
        this.dragSubscription = this.drag$.subscribe(function (event) {
            _this.element.nativeElement.style.left = event.x + "px";
            _this.element.nativeElement.style.top = event.y + "px";
        });
    };
    AcToolbarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CesiumService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcToolbarComponent.prototype, "toolbarClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcToolbarComponent.prototype, "allowDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AcToolbarComponent.prototype, "onDrag", void 0);
    AcToolbarComponent = __decorate([
        Component({
            selector: 'ac-toolbar',
            template: "\n        <div class=\"{{toolbarClass}}\">\n            <div *ngIf=\"allowDrag\">\n                <ac-toolbar-button>\n                    <ac-drag-icon></ac-drag-icon>\n                </ac-toolbar-button>\n            </div>\n\n            <ng-content></ng-content>\n        </div>\n    ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: ["\n        :host {\n            position: absolute;\n            top: 20px;\n            left: 20px;\n            width: 20px;\n            height: 20px;\n            z-index: 999;\n            -webkit-user-drag: none;\n        }\n    "]
        }),
        __metadata("design:paramtypes", [ElementRef, CesiumService])
    ], AcToolbarComponent);
    return AcToolbarComponent;
}());

var DragIconComponent = /** @class */ (function () {
    function DragIconComponent() {
    }
    DragIconComponent = __decorate([
        Component({
            selector: 'ac-drag-icon',
            template: "\n        <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\"  x=\"0px\" y=\"0px\"  height=\"25\"  width=\"25\"\n\t viewBox=\"0 0 476.737 476.737\" style=\"enable-background:new 0 0 476.737 476.737;\" xml:space=\"preserve\">\n<g>\n\t<g>\n\t\t<path style=\"fill:#010002;\" d=\"M475.498,232.298l-3.401-5.149l-63.565-63.565c-6.198-6.198-16.304-6.198-22.47,0\n\t\t\tc-6.198,6.198-6.198,16.273,0,22.47l36.423,36.423H254.26V54.253l36.423,36.423c6.166,6.198,16.273,6.198,22.47,0\n\t\t\tc6.166-6.198,6.166-16.273,0-22.47L249.588,4.64l-0.159-0.095l-4.99-3.305L238.369,0h-0.064l-6.007,1.24l-4.99,3.305l-0.191,0.095\n\t\t\tl-63.565,63.565c-6.198,6.198-6.198,16.273,0,22.47s16.273,6.198,22.47,0l36.455-36.423v168.225H54.253l36.423-36.423\n\t\t\tc6.198-6.198,6.198-16.273,0-22.47s-16.273-6.198-22.47,0L4.64,227.149l-0.095,0.159l-3.305,4.99L0,238.369v0.064l1.24,6.007\n\t\t\tl3.305,4.958l0.095,0.191l63.565,63.565c6.198,6.198,16.273,6.198,22.47,0c6.198-6.166,6.198-16.273,0-22.47L54.253,254.26\n\t\t\th168.225v168.225l-36.423-36.423c-6.198-6.166-16.273-6.166-22.47,0c-6.198,6.198-6.198,16.304,0,22.47l63.565,63.565l5.149,3.432\n\t\t\tl6.007,1.208h0.064l6.07-1.24l5.149-3.401l63.565-63.565c6.166-6.198,6.166-16.304,0-22.47c-6.198-6.198-16.304-6.198-22.47,0\n\t\t\tl-36.423,36.423V254.26h168.225l-36.423,36.423c-6.166,6.166-6.166,16.273,0,22.47c6.198,6.166,16.304,6.166,22.47,0\n\t\t\tl63.565-63.565l3.432-5.149l1.208-6.007v-0.064L475.498,232.298z\"/>\n\t</g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n    "
        }),
        __metadata("design:paramtypes", [])
    ], DragIconComponent);
    return DragIconComponent;
}());

/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
var AcToolbarButtonComponent = /** @class */ (function () {
    function AcToolbarButtonComponent() {
        this.onClick = new EventEmitter();
    }
    AcToolbarButtonComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcToolbarButtonComponent.prototype, "iconUrl", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcToolbarButtonComponent.prototype, "buttonClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcToolbarButtonComponent.prototype, "iconClass", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AcToolbarButtonComponent.prototype, "onClick", void 0);
    AcToolbarButtonComponent = __decorate([
        Component({
            selector: 'ac-toolbar-button',
            template: "\n        <div (click)=\"onClick.emit()\" class=\"button-container {{buttonClass}}\">\n            <img *ngIf=\"iconUrl\" [src]=\"iconUrl\" class=\"icon {{iconClass}}\"/>\n            <ng-content></ng-content>\n        </div>\n    ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: ["\n        .button-container {\n            border-radius: 1px;\n            background-color: rgba(255, 255, 255, 0.8);\n            height: 30px;\n            width: 30px;\n            padding: 5px;\n            transition: all 0.2s;\n            cursor: pointer;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            flex-direction: column;\n        }\n\n        .button-container:hover {\n            background-color: rgba(255, 255, 255, 0.95);\n        }\n\n        .icon {\n            height: 30px;\n            width: 30px;\n        }\n    "]
        }),
        __metadata("design:paramtypes", [])
    ], AcToolbarButtonComponent);
    return AcToolbarButtonComponent;
}());

/**
 *
 * Range and bearing component that is used to draw range and bearing on the map.
 * The inputs are used to customize the range and bearing style and behavior.
 * Create component reference and use the `create()` function to start creating R&B on the map.
 * The function receives an optional RangeAndBearingOptions object that defines the created range and bearing style and behavior
 * (on top of the default and global definitions).
 *
 * Usage:
 *
 * my-component.ts:
 *
 * ```
 * \@ViewChild('rangeAndBearing', {static: false}) private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
 *  // ...
 * this.rangeAndBearing.create({style: { pointProps: { pixelSize: 12 } }, bearingLabelsStyle: { fillColor: Cesium.Color.GREEN } });
 * ```
 *
 * my-component.html
 * ```
 * <range-and-bearing #rangeAndBearing></range-and-bearing> // Optional inputs defines global style and behavior.
 * ```
 *
 */
var RangeAndBearingComponent = /** @class */ (function () {
    function RangeAndBearingComponent(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    RangeAndBearingComponent.prototype.create = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} } : _a, _c = _b.lineEditOptions, lineEditOptions = _c === void 0 ? {} : _c, _d = _b.labelsStyle, labelsStyle = _d === void 0 ? {} : _d, _e = _b.distanceLabelsStyle, distanceLabelsStyle = _e === void 0 ? {} : _e, _f = _b.bearingLabelsStyle, bearingLabelsStyle = _f === void 0 ? {} : _f, bearingStringFn = _b.bearingStringFn, distanceStringFn = _b.distanceStringFn, labelsRenderFn = _b.labelsRenderFn;
        var rnb = this.polylineEditor.create(__assign(__assign({ allowDrag: false, pointProps: {
                showVirtual: false,
                pixelSize: 8,
            }, polylineProps: {
                width: 2,
            } }, this.lineEditOptions), lineEditOptions));
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn(function (update) {
                var positions = update.positions;
                var totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? __spread(positions, [update.updatedPosition]) : positions).reduce(function (labels, position, index, array) {
                    if (index !== 0) {
                        var previousPosition = array[index - 1];
                        var bearing = _this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        var distance = Cesium.Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(__assign(__assign(__assign(__assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (_this.bearingStringFn && _this.bearingStringFn(bearing)) ||
                                bearing.toFixed(2) + "\u00B0", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, _this.labelsStyle), labelsStyle), _this.bearingLabelsStyle), bearingLabelsStyle), __assign(__assign(__assign(__assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (_this.distanceStringFn && _this.distanceStringFn(totalDistance + distance)) ||
                                (totalDistance + distance).toFixed(2) + " Km", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-35, -8), position: position, fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, _this.labelsStyle), labelsStyle), _this.distanceLabelsStyle), distanceLabelsStyle));
                        totalDistance += distance;
                    }
                    return labels;
                }, [
                    __assign(__assign(__assign(__assign({ text: (distanceStringFn && distanceStringFn(0)) || (_this.distanceStringFn && _this.distanceStringFn(0)) || "0 Km", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: positions[0], fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, _this.labelsStyle), labelsStyle), _this.distanceLabelsStyle), distanceLabelsStyle),
                ]);
            });
        }
        return rnb;
    };
    RangeAndBearingComponent.ctorParameters = function () { return [
        { type: PolylinesEditorService },
        { type: CoordinateConverter }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], RangeAndBearingComponent.prototype, "lineEditOptions", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], RangeAndBearingComponent.prototype, "labelsStyle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], RangeAndBearingComponent.prototype, "distanceLabelsStyle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], RangeAndBearingComponent.prototype, "bearingLabelsStyle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], RangeAndBearingComponent.prototype, "bearingStringFn", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], RangeAndBearingComponent.prototype, "distanceStringFn", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], RangeAndBearingComponent.prototype, "labelsRenderFn", void 0);
    RangeAndBearingComponent = __decorate([
        Component({
            selector: 'range-and-bearing',
            template: "\n    <polylines-editor></polylines-editor>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [PolylinesEditorService]
        }),
        __metadata("design:paramtypes", [PolylinesEditorService, CoordinateConverter])
    ], RangeAndBearingComponent);
    return RangeAndBearingComponent;
}());

/**
 * The Service is as a "zoom to rectangle" tool
 *
 * example:
 * ```
 * constructor(
 *   private cameraService: CameraService,
 *   private cesiumService: CesiumService,
 *   private zoomToRectangleService: ZoomToRectangleService,
 * ) {
 *   this.zoomToRectangleService.init(cesiumService, cameraService);
 * }
 * ...
 * this.zoomToRectangleService.activate({onComplete: () => this.zoomToRectangleService.disable()});
 * ```
 *
 * `init()` - initialize the service with CameraService and CesiumService.
 * If no mapId is provided to activate() - must be called before calling `activate()`.
 *
 * `disable()` - disables the tool.
 *
 * `activate()` -
 * @param options
 * {
 *  onStart - optional - a callback that will be called when the user start drawing the rectangle
 *  onComplete - optional - a callback that will be called when the tool zoom in
 *  autoDisableOnZoom - optional - determines if the tool should auto disable after zoom - default: true
 *  animationDurationInSeconds - optional - zoom animation duration in seconds - default: 0.5
 *  borderStyle - optional - the style of the rectangle element border - default: '3px dashed #FFFFFF'
 *  backgroundColor - optional - the background color of the rectangle element - default: 'transparent'
 *  resetKeyCode - optional - the key code of the key that is used to reset the drawing of the rectangle - default: 27 (ESC key)
 *  threshold - optional - the minimum area of the screen rectangle (in pixels) that is required to perform zoom - default: 9
 *  keepRotation - optional - whether or not to keep the rotation when zooming in - default: true
 *  mouseButton - optional - sets the mouse button for drawing the rectangle - default: left mouse button (0)
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["LEFT"] = 0] = "LEFT";
    MouseButtons[MouseButtons["MIDDLE"] = 1] = "MIDDLE";
    MouseButtons[MouseButtons["RIGHT"] = 2] = "RIGHT";
})(MouseButtons || (MouseButtons = {}));
var ZoomToRectangleService = /** @class */ (function () {
    function ZoomToRectangleService(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
            threshold: 9,
            keepRotation: true,
            mouseButton: MouseButtons.LEFT,
        };
    }
    ZoomToRectangleService.prototype.init = function (cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    };
    ZoomToRectangleService.prototype.activate = function (options, mapId) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        var finalOptions = Object.assign({}, this.defaultOptions, options);
        var cameraService = this.cameraService;
        var mapContainer;
        var map;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
            map = this.cesiumService.getMap();
        }
        if (mapId) {
            map = this.mapsManager.getMap(mapId);
            if (!map) {
                throw new Error("Map not found with id: " + mapId);
            }
            cameraService = map.getCameraService();
            mapContainer = map.getCesiumViewer().container;
        }
        if (!cameraService || !mapContainer) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        this.disable(mapId);
        var container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        var mapZoomData = { container: container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        var mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        var borderElement;
        container.onmousedown = function (e) {
            if (e.button !== finalOptions.mouseButton) {
                return;
            }
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                var rect = e.currentTarget.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var offsetY = e.clientY - rect.top;
                mouse.startX = offsetX;
                mouse.startY = offsetY;
                borderElement = document.createElement('div');
                borderElement.className = 'zoom-to-rectangle-border';
                borderElement.style.position = 'absolute';
                borderElement.style.border = finalOptions.borderStyle;
                borderElement.style.backgroundColor = finalOptions.backgroundColor;
                borderElement.style.left = mouse.startX + 'px';
                borderElement.style.top = mouse.startY + 'px';
                container.appendChild(borderElement);
                mapZoomData.borderElement = borderElement;
            }
        };
        container.onmouseup = function (e) {
            if (borderElement) {
                var zoomApplied = void 0;
                if (mouse && Math.abs(mouse.endX - mouse.startX) * Math.abs(mouse.endY - mouse.startY) > finalOptions.threshold) {
                    zoomApplied = _this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds, finalOptions);
                }
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
                if (!!finalOptions.onComplete) {
                    finalOptions.onComplete(map);
                }
                if (finalOptions.autoDisableOnZoom && zoomApplied) {
                    _this.disable(mapId);
                }
            }
        };
        container.onmousemove = function (e) {
            if (borderElement) {
                var rect = e.currentTarget.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        };
        var resetOnEscapePress = function (e) {
            if (e.keyCode === finalOptions.resetKeyCode && borderElement) {
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
            }
        };
        document.addEventListener('keydown', resetOnEscapePress);
        mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
    };
    ZoomToRectangleService.prototype.disable = function (mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        var data = this.mapsZoomElements.get(mapId || this.cesiumService.getMap().getId());
        if (data) {
            data.container.remove();
            if (data.borderElement) {
                data.borderElement.remove();
            }
            if (data.resetOnEscapePressFunc) {
                document.removeEventListener('keydown', data.resetOnEscapePressFunc);
            }
        }
        this.mapsZoomElements.delete(mapId);
    };
    ZoomToRectangleService.prototype.zoomCameraToRectangle = function (cameraService, positions, animationDuration, options) {
        var camera = cameraService.getCamera();
        var cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        var cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        var cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        var cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            orientation: options.keepRotation ? { heading: camera.heading } : undefined,
            duration: animationDuration,
        });
        return true;
    };
    ZoomToRectangleService.ctorParameters = function () { return [
        { type: MapsManagerService },
        { type: CameraService, decorators: [{ type: Optional }] },
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    ZoomToRectangleService = __decorate([
        Injectable(),
        __param(1, Optional()),
        __param(2, Optional()),
        __metadata("design:paramtypes", [MapsManagerService,
            CameraService,
            CesiumService])
    ], ZoomToRectangleService);
    return ZoomToRectangleService;
}());

var RectanglesManagerService = /** @class */ (function () {
    function RectanglesManagerService() {
        this.rectangles = new Map();
    }
    RectanglesManagerService.prototype.createEditableRectangle = function (id, editRectanglesLayer, editPointsLayer, coordinateConverter, rectangleOptions, positions) {
        var editableRectangle = new EditableRectangle(id, editPointsLayer, editRectanglesLayer, coordinateConverter, rectangleOptions, positions);
        this.rectangles.set(id, editableRectangle);
    };
    RectanglesManagerService.prototype.dispose = function (id) {
        this.rectangles.get(id).dispose();
        this.rectangles.delete(id);
    };
    RectanglesManagerService.prototype.get = function (id) {
        return this.rectangles.get(id);
    };
    RectanglesManagerService.prototype.clear = function () {
        this.rectangles.forEach(function (rectangle) { return rectangle.dispose(); });
        this.rectangles.clear();
    };
    RectanglesManagerService = __decorate([
        Injectable()
    ], RectanglesManagerService);
    return RectanglesManagerService;
}());

var DEFAULT_RECTANGLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    rectangleProps: {
        height: 0,
        extrudedHeight: 0,
        material: Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        zIndex: 0,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
    },
};
/**
 * Service for creating editable rectangles
 *
 * You must provide `RectanglesEditorService` yourself.
 * RectanglesEditorService works together with `<rectangles-editor>` component. Therefor you need to create `<rectangles-editor>`
 * for each `RectanglesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `RectangleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `RectangleEditorObservable`.
 * + To stop editing call `dsipose()` from the `RectangleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `RectangleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating rectangle
 *  const editing$ = rectanglesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit rectangle from existing rectangle positions
 *  const editing$ = this.rectanglesEditorService.edit(initialPos);
 *
 * ```
 */
var RectanglesEditorService = /** @class */ (function () {
    function RectanglesEditorService() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    RectanglesEditorService.prototype.init = function (mapEventsManager, coordinateConverter, cameraService, rectanglesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    };
    RectanglesEditorService.prototype.onUpdate = function () {
        return this.updatePublisher;
    };
    RectanglesEditorService.prototype.create = function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_RECTANGLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        var positions = [];
        var id = generateKey();
        var rectangleOptions = this.setOptions(options);
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            rectangleOptions: rectangleOptions,
        });
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        var addPointRegistration = this.mapEventsManager.register({
            event: rectangleOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                _this.updateSubject.next({
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            var allPositions = _this.getPositions(id);
            var isFirstPoint = _this.getPositions(id).length === 0;
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign(__assign({}, updateValue), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (!isFirstPoint) {
                var changeMode = {
                    id: id,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(changeMode);
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach(function (registration) { return registration.dispose(); });
                }
                _this.observablesMap.delete(id);
                _this.editRectangle(id, positions, priority, clientEditSubject, rectangleOptions, editorObservable);
                finishedCreate = true;
            }
        });
        return editorObservable;
    };
    RectanglesEditorService.prototype.edit = function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_RECTANGLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length !== 2) {
            throw new Error('Rectangles editor error edit(): rectangle should have at least 2 positions');
        }
        var id = generateKey();
        var rectangleOptions = this.setOptions(options);
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            rectangleOptions: rectangleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign(__assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editRectangle(id, positions, priority, editSubject, rectangleOptions);
    };
    RectanglesEditorService.prototype.editRectangle = function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority: priority,
            pickFilter: function (entity) { return id === entity.editedEntityId; },
        });
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableRectangle,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority: priority,
                pickFilter: function (entity) { return id === entity.id; },
            });
        }
        pointDragRegistration.pipe(tap(function (_a) {
            var drop = _a.movement.drop;
            return _this.rectanglesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
        }))
            .subscribe(function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            var point = entities[0];
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(function (_a) {
                var drop = _a.movement.drop;
                return _this.rectanglesManager.get(id).enableEdit && _this.cameraService.enableInputs(drop);
            }))
                .subscribe(function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign(__assign({}, update), { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            });
        }
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    RectanglesEditorService.prototype.setOptions = function (options) {
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_RECTANGLE_OPTIONS));
        var rectangleOptions = Object.assign(defaultClone, options);
        rectangleOptions.pointProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.pointProps, options.pointProps);
        rectangleOptions.rectangleProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.rectangleProps, options.rectangleProps);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error("Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D");
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn("Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D");
            }
            if (rectangleOptions.pointProps.color.alpha === 1 || rectangleOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            rectangleOptions.pointProps.heightReference = rectangleOptions.clampHeightTo3DOptions.clampToTerrain ?
                Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.RELATIVE_TO_GROUND;
            rectangleOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return rectangleOptions;
    };
    RectanglesEditorService.prototype.createEditorObservable = function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = function () {
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach(function (obs) { return obs.dispose(); });
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = function (firstPosition, secondPosition, firstPointProp, secondPointProp) {
            var firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            var secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            var rectangle = _this.rectanglesManager.get(id);
            rectangle.setPointsManually([firstP, secP]);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.getCurrentPoints = function () { return _this.getPoints(id); };
        observableToExtend.getEditValue = function () { return observableToExtend.getValue(); };
        observableToExtend.getLabels = function () { return _this.rectanglesManager.get(id).labels; };
        return observableToExtend;
    };
    RectanglesEditorService.prototype.getPositions = function (id) {
        var rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPositions();
    };
    RectanglesEditorService.prototype.getPoints = function (id) {
        var rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPoints();
    };
    RectanglesEditorService = __decorate([
        Injectable()
    ], RectanglesEditorService);
    return RectanglesEditorService;
}());

var RectanglesEditorComponent = /** @class */ (function () {
    function RectanglesEditorComponent(rectanglesEditor, coordinateConverter, mapEventsManager, cameraService, rectanglesManager, cesiumService) {
        this.rectanglesEditor = rectanglesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.cesiumService = cesiumService;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editRectangles$ = new Subject();
        this.rectanglesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.rectanglesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    RectanglesEditorComponent.prototype.startListeningToEditorUpdates = function () {
        var _this = this;
        this.rectanglesEditor.onUpdate().subscribe(function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        });
    };
    RectanglesEditorComponent.prototype.getLabelId = function (element, index) {
        return index.toString();
    };
    RectanglesEditorComponent.prototype.renderEditLabels = function (rectangle, update, labels) {
        update.positions = rectangle.getRealPositions();
        update.points = rectangle.getRealPoints();
        if (labels) {
            rectangle.labels = labels;
            this.editRectanglesLayer.update(rectangle, rectangle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        rectangle.labels = this.editLabelsRenderFn(update, rectangle.labels);
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    };
    RectanglesEditorComponent.prototype.removeEditLabels = function (rectangle) {
        rectangle.labels = [];
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    };
    RectanglesEditorComponent.prototype.handleCreateUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.dispose();
                    this.removeEditLabels(rectangle);
                }
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(rectangle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                var rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    RectanglesEditorComponent.prototype.handleEditUpdates = function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMovePoint();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = false;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = true;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                var rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMoveShape();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    };
    RectanglesEditorComponent.prototype.ngOnDestroy = function () {
        this.rectanglesManager.clear();
    };
    RectanglesEditorComponent.prototype.getPointSize = function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    RectanglesEditorComponent.prototype.getPointShow = function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    RectanglesEditorComponent.ctorParameters = function () { return [
        { type: RectanglesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: RectanglesManagerService },
        { type: CesiumService }
    ]; };
    __decorate([
        ViewChild('editRectanglesLayer'),
        __metadata("design:type", AcLayerComponent)
    ], RectanglesEditorComponent.prototype, "editRectanglesLayer", void 0);
    __decorate([
        ViewChild('editPointsLayer'),
        __metadata("design:type", AcLayerComponent)
    ], RectanglesEditorComponent.prototype, "editPointsLayer", void 0);
    RectanglesEditorComponent = __decorate([
        Component({
            selector: 'rectangles-editor',
            template: /*html*/ "\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPositionCallbackProperty(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point),\n        disableDepthTestDistance: point.props.disableDepthTestDistance,\n        heightReference: point.props.heightReference,\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editRectanglesLayer acFor=\"let rectangle of editRectangles$\" [context]=\"this\">\n      <ac-rectangle-desc\n        props=\"{\n          coordinates: rectangle.getRectangleCallbackProperty(),\n          material: rectangle.rectangleProps.material,\n          fill: rectangle.rectangleProps.fill,\n          classificationType: rectangle.rectangleProps.classificationType,\n          zIndex: rectangle.rectangleProps.zIndex,\n          outline: rectangle.rectangleProps.outline,\n          outlineColor: rectangle.rectangleProps.outlineColor,\n          height: rectangle.rectangleProps.height,\n          extrudedHeight: rectangle.rectangleProps.extrudedHeight\n        }\"\n      >\n      </ac-rectangle-desc>\n      <ac-array-desc acFor=\"let label of rectangle.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin,\n            disableDepthTestDistance: label.disableDepthTestDistance,\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
            providers: [CoordinateConverter, RectanglesManagerService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [RectanglesEditorService,
            CoordinateConverter,
            MapEventsManagerService,
            CameraService,
            RectanglesManagerService,
            CesiumService])
    ], RectanglesEditorComponent);
    return RectanglesEditorComponent;
}());

var AngularCesiumWidgetsModule = /** @class */ (function () {
    function AngularCesiumWidgetsModule() {
    }
    AngularCesiumWidgetsModule = __decorate([
        NgModule({
            imports: [CommonModule, AngularCesiumModule],
            declarations: [
                PointsEditorComponent,
                HippodromeEditorComponent,
                PolygonsEditorComponent,
                RectanglesEditorComponent,
                CirclesEditorComponent,
                EllipsesEditorComponent,
                PolylinesEditorComponent,
                DraggableToMapDirective,
                DragIconComponent,
                AcToolbarComponent,
                AcToolbarButtonComponent,
                RangeAndBearingComponent,
            ],
            exports: [
                PointsEditorComponent,
                HippodromeEditorComponent,
                PolygonsEditorComponent,
                RectanglesEditorComponent,
                CirclesEditorComponent,
                EllipsesEditorComponent,
                PolylinesEditorComponent,
                DraggableToMapDirective,
                AcToolbarComponent,
                AcToolbarButtonComponent,
                RangeAndBearingComponent,
            ],
            providers: [
                DraggableToMapService,
                ZoomToRectangleService,
            ]
        })
    ], AngularCesiumWidgetsModule);
    return AngularCesiumWidgetsModule;
}());

/*
 * Public API Surface of angular-cesium
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AcArcComponent, AcArcDescComponent, AcArrayDescComponent, AcBillboardComponent, AcBillboardDescComponent, AcBillboardPrimitiveDescComponent, AcBoxDescComponent, AcCircleComponent, AcCircleDescComponent, AcCorridorDescComponent, AcCylinderDescComponent, AcCzmlDescComponent, AcDefaultPlonterComponent, AcDynamicCircleDescComponent, AcDynamicEllipseDescComponent, AcDynamicPolylineDescComponent, AcEllipseComponent, AcEllipseDescComponent, AcEllipsoidDescComponent, AcEntity, AcHtmlComponent, AcHtmlDescComponent, AcLabelComponent, AcLabelDescComponent, AcLabelPrimitiveDescComponent, AcLayerComponent, AcMapComponent, AcMapLayerProviderComponent, AcMapTerrainProviderComponent, AcModelDescComponent, AcNotification, AcPointComponent, AcPointDescComponent, AcPointPrimitiveDescComponent, AcPolygonComponent, AcPolygonDescComponent, AcPolylineComponent, AcPolylineDescComponent, AcPolylinePrimitiveDescComponent, AcPolylineVolumeDescComponent, AcPrimitivePolylineComponent, AcRectangleComponent, AcRectangleDescComponent, AcStaticCircleDescComponent, AcStaticEllipseDescComponent, AcStaticPolygonDescComponent, AcStaticPolylineDescComponent, AcTileset3dComponent, AcToolbarButtonComponent, AcToolbarComponent, AcWallDescComponent, ActionType, AngularCesiumModule, AngularCesiumWidgetsModule, CameraService, CesiumEvent, CesiumEventModifier, CesiumService, CircleEditorObservable, CirclesEditorComponent, CirclesEditorService, ContextMenuService, CoordinateConverter, DEFAULT_CIRCLE_OPTIONS, DEFAULT_ELLIPSE_OPTIONS, DEFAULT_HIPPODROME_OPTIONS, DEFAULT_POINT_OPTIONS, DEFAULT_POLYGON_OPTIONS, DEFAULT_POLYLINE_OPTIONS, DEFAULT_RECTANGLE_OPTIONS, DisposableObservable, DraggableToMapDirective, DraggableToMapService, EditActions, EditArc, EditModes, EditPoint, EditPolyline, EditableCircle, EditableEllipse, EditableHippodrome, EditablePoint, EditablePolygon, EditablePolyline, EditableRectangle, EditorObservable, EllipseEditorObservable, EllipsesEditorComponent, EllipsesEditorService, GeoUtilsService, HippodromeEditorComponent, HippodromeEditorObservable, HippodromeEditorService, KeyboardAction, KeyboardControlService, MapEventsManagerService, MapLayerProviderOptions, MapTerrainProviderOptions, MapsManagerService, MouseButtons, PREDEFINED_KEYBOARD_ACTIONS, PickOptions, PixelOffsetPipe, PlonterService, PointEditorObservable, PointsEditorComponent, PointsEditorService, PolygonEditorObservable, PolygonsEditorComponent, PolygonsEditorService, PolylineEditorObservable, PolylinesEditorComponent, PolylinesEditorService, RadiansToDegreesPipe, RangeAndBearingComponent, RectangleEditorObservable, RectanglesEditorComponent, RectanglesEditorService, SceneMode, ScreenshotService, SelectionManagerService, ViewerConfiguration, ZoomToRectangleService, defaultLabelProps, ɵ0$1 as ɵ0, UtilsModule as ɵa, ViewerFactory as ɵb, PolylineVolumeDrawerService as ɵba, WallDrawerService as ɵbb, RectangleDrawerService as ɵbc, LabelPrimitiveDrawerService as ɵbd, BillboardPrimitiveDrawerService as ɵbe, PointPrimitiveDrawerService as ɵbf, HtmlDrawerService as ɵbg, DynamicEllipseDrawerService as ɵbh, DynamicPolylineDrawerService as ɵbi, StaticCircleDrawerService as ɵbj, StaticPrimitiveDrawer as ɵbk, StaticPolylineDrawerService as ɵbl, StaticPolygonDrawerService as ɵbm, StaticEllipseDrawerService as ɵbn, EntityOnMapComponent as ɵbo, BasicDesc as ɵbp, CesiumProperties as ɵbq, JsonMapper as ɵbr, AcContextMenuWrapperComponent as ɵbs, AcHtmlManager as ɵbt, AcHtmlContext as ɵbu, AcHtmlDirective as ɵbv, AcHtmlContainerDirective as ɵbw, BasicStaticPrimitiveDesc as ɵbx, PointsManagerService as ɵby, HippodromeManagerService as ɵbz, BillboardDrawerService as ɵc, PolygonsManagerService as ɵca, RectanglesManagerService as ɵcb, CirclesManagerService as ɵcc, EllipsesManagerService as ɵcd, PolylinesManagerService as ɵce, DragIconComponent as ɵcf, EntitiesDrawerService as ɵd, BasicDrawerService as ɵe, GraphicsType as ɵf, CesiumEventBuilder as ɵg, LabelDrawerService as ɵh, PolylineDrawerService as ɵi, PolylinePrimitiveDrawerService as ɵj, PrimitivesDrawerService as ɵk, EllipseDrawerService as ɵl, PointDrawerService as ɵm, ArcDrawerService as ɵn, CzmlDrawerService as ɵo, PolygonDrawerService as ɵp, MapLayersService as ɵq, ANGULAR_CESIUM_CONFIG as ɵr, ConfigurationService as ɵs, LayerService as ɵt, ComputationCache as ɵu, ModelDrawerService as ɵv, BoxDrawerService as ɵw, CorridorDrawerService as ɵx, CylinderDrawerService as ɵy, EllipsoidDrawerService as ɵz };
//# sourceMappingURL=angular-cesium.js.map

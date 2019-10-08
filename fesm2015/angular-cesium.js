import * as geodesy from 'geodesy';
import { LatLonVectors, LatLonEllipsoidal, Utm } from 'geodesy';
import { isNumber } from 'util';
import { EllipsePrimitive } from 'primitive-primitives';
import { JsonStringMapper } from 'json-string-mapper';
import { Parse, Angular2ParseModule, PIPES_CONFIG } from 'angular2parse';
import * as _get from 'lodash.get';
import * as h337 from 'heatmap.js/build/heatmap.js';
import { create } from 'heatmap.js/build/heatmap.js';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Observable, of, Subject, merge, from, BehaviorSubject, fromEvent } from 'rxjs';
import { delay, mergeMap, publish, takeUntil, filter, map, switchMap, tap, merge as merge$1 } from 'rxjs/operators';
import { Inject, Injectable, InjectionToken, Optional, NgZone, EventEmitter, Component, ElementRef, Input, ChangeDetectionStrategy, Output, forwardRef, Pipe, NgModule, Renderer2, ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef, ContentChild, ViewChild, ComponentFactoryResolver, ContentChildren, HostListener } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
// tslint:disable
/** @type {?} */
const AssociativeArray = Cesium.AssociativeArray;
/** @type {?} */
const Color = Cesium.Color;
/** @type {?} */
const ColorGeometryInstanceAttribute = Cesium.ColorGeometryInstanceAttribute;
/** @type {?} */
const defined = Cesium.defined;
/** @type {?} */
const DistanceDisplayCondition = Cesium.DistanceDisplayCondition;
/** @type {?} */
const DistanceDisplayConditionGeometryInstanceAttribute = Cesium.DistanceDisplayConditionGeometryInstanceAttribute;
/** @type {?} */
const ShowGeometryInstanceAttribute = Cesium.ShowGeometryInstanceAttribute;
/** @type {?} */
const Primitive = Cesium.Primitive;
/** @type {?} */
const ShadowMode = Cesium.ShadowMode;
/** @type {?} */
const BoundingSphereState = Cesium.BoundingSphereState;
/** @type {?} */
const ColorMaterialProperty = Cesium.ColorMaterialProperty;
/** @type {?} */
const MaterialProperty = Cesium.MaterialProperty;
/** @type {?} */
const Property = Cesium.Property;
/** @type {?} */
var colorScratch = new Color();
/** @type {?} */
var distanceDisplayConditionScratch = new DistanceDisplayCondition();
/** @type {?} */
var defaultDistanceDisplayCondition = new DistanceDisplayCondition();
/**
 * @param {?} primitives
 * @param {?} translucent
 * @param {?} appearanceType
 * @param {?} depthFailAppearanceType
 * @param {?} depthFailMaterialProperty
 * @param {?} closed
 * @param {?} shadows
 * @return {?}
 */
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
    /** @type {?} */
    var removeMaterialSubscription;
    if (defined(depthFailMaterialProperty)) {
        removeMaterialSubscription = depthFailMaterialProperty.definitionChanged.addEventListener(Batch.prototype.onMaterialChanged, this);
    }
    this.removeMaterialSubscription = removeMaterialSubscription;
}
Batch.prototype.onMaterialChanged = (/**
 * @return {?}
 */
function () {
    this.invalidated = true;
});
Batch.prototype.isMaterial = (/**
 * @param {?} updater
 * @return {?}
 */
function (updater) {
    /** @type {?} */
    var material = this.depthFailMaterialProperty;
    /** @type {?} */
    var updaterMaterial = updater.depthFailMaterialProperty;
    if (updaterMaterial === material) {
        return true;
    }
    if (defined(material)) {
        return material.equals(updaterMaterial);
    }
    return false;
});
Batch.prototype.add = (/**
 * @param {?} updater
 * @param {?} instance
 * @return {?}
 */
function (updater, instance) {
    /** @type {?} */
    var id = updater.id;
    this.createPrimitive = true;
    this.geometry.set(id, instance);
    this.updaters.set(id, updater);
    if (!updater.hasConstantFill || !updater.fillMaterialProperty.isConstant || !Property.isConstant(updater.distanceDisplayConditionProperty)) {
        this.updatersWithAttributes.set(id, updater);
    }
    else {
        /** @type {?} */
        var that = this;
        this.subscriptions.set(id, updater.entity.definitionChanged.addEventListener((/**
         * @param {?} entity
         * @param {?} propertyName
         * @param {?} newValue
         * @param {?} oldValue
         * @return {?}
         */
        function (entity, propertyName, newValue, oldValue) {
            if (propertyName === 'isShowing') {
                that.showsUpdated.set(updater.id, updater);
            }
        })));
    }
});
Batch.prototype.remove = (/**
 * @param {?} updater
 * @return {?}
 */
function (updater) {
    /** @type {?} */
    var id = updater.id;
    this.createPrimitive = this.geometry.remove(id) || this.createPrimitive;
    if (this.updaters.remove(id)) {
        this.updatersWithAttributes.remove(id);
        /** @type {?} */
        var unsubscribe = this.subscriptions.get(id);
        if (defined(unsubscribe)) {
            unsubscribe();
            this.subscriptions.remove(id);
        }
    }
});
Batch.prototype.update = (/**
 * @param {?} time
 * @return {?}
 */
function (time) {
    /** @type {?} */
    var isUpdated = true;
    /** @type {?} */
    var removedCount = 0;
    /** @type {?} */
    var primitive = this.primitive;
    /** @type {?} */
    var primitives = this.primitives;
    /** @type {?} */
    var attributes;
    /** @type {?} */
    var i;
    if (this.createPrimitive) {
        /** @type {?} */
        var geometries = this.geometry.values;
        /** @type {?} */
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
                /** @type {?} */
                var geometryItem = geometries[i];
                /** @type {?} */
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
            /** @type {?} */
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
            /** @type {?} */
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
        /** @type {?} */
        var updatersWithAttributes = this.updatersWithAttributes.values;
        /** @type {?} */
        var length = updatersWithAttributes.length;
        /** @type {?} */
        var waitingOnCreate = this.waitingOnCreate;
        for (i = 0; i < length; i++) {
            /** @type {?} */
            var updater = updatersWithAttributes[i];
            /** @type {?} */
            var instance = this.geometry.get(updater.id);
            attributes = this.attributes.get(instance.id.id);
            if (!defined(attributes)) {
                attributes = primitive.getGeometryInstanceAttributes(instance.id);
                this.attributes.set(instance.id.id, attributes);
            }
            if (!updater.fillMaterialProperty.isConstant || waitingOnCreate) {
                /** @type {?} */
                var colorProperty = updater.fillMaterialProperty.color;
                /** @type {?} */
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
                /** @type {?} */
                var depthFailColorProperty = updater.depthFailMaterialProperty.color;
                /** @type {?} */
                var depthColor = Property.getValueOrDefault(depthFailColorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastDepthFailColor, depthColor)) {
                    attributes._lastDepthFailColor = Color.clone(depthColor, attributes._lastDepthFailColor);
                    attributes.depthFailColor = ColorGeometryInstanceAttribute.toValue(depthColor, attributes.depthFailColor);
                }
            }
            /** @type {?} */
            var show = updater.entity.isShowing && (updater.hasConstantFill || updater.isFilled(time));
            /** @type {?} */
            var currentShow = attributes.show[0] === 1;
            if (show !== currentShow) {
                attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
            }
            /** @type {?} */
            var distanceDisplayConditionProperty = updater.distanceDisplayConditionProperty;
            if (!Property.isConstant(distanceDisplayConditionProperty)) {
                /** @type {?} */
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
});
Batch.prototype.updateShows = (/**
 * @param {?} primitive
 * @return {?}
 */
function (primitive) {
    /** @type {?} */
    var showsUpdated = this.showsUpdated.values;
    /** @type {?} */
    var length = showsUpdated.length;
    for (var i = 0; i < length; i++) {
        /** @type {?} */
        var updater = showsUpdated[i];
        /** @type {?} */
        var instance = this.geometry.get(updater.id);
        /** @type {?} */
        var attributes = this.attributes.get(instance.id.id);
        if (!defined(attributes)) {
            attributes = primitive.getGeometryInstanceAttributes(instance.id);
            this.attributes.set(instance.id.id, attributes);
        }
        /** @type {?} */
        var show = updater.entity.isShowing;
        /** @type {?} */
        var currentShow = attributes.show[0] === 1;
        if (show !== currentShow) {
            attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
        }
    }
    this.showsUpdated.removeAll();
});
Batch.prototype.contains = (/**
 * @param {?} updater
 * @return {?}
 */
function (updater) {
    return this.updaters.contains(updater.id);
});
Batch.prototype.getBoundingSphere = (/**
 * @param {?} updater
 * @param {?} result
 * @return {?}
 */
function (updater, result) {
    /** @type {?} */
    var primitive = this.primitive;
    if (!primitive.ready) {
        return BoundingSphereState.PENDING;
    }
    /** @type {?} */
    var attributes = primitive.getGeometryInstanceAttributes(updater.entity);
    if (!defined(attributes) || !defined(attributes.boundingSphere) || //
        (defined(attributes.show) && attributes.show[0] === 0)) {
        return BoundingSphereState.FAILED;
    }
    attributes.boundingSphere.clone(result);
    return BoundingSphereState.DONE;
});
Batch.prototype.removeAllPrimitives = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    var primitives = this.primitives;
    /** @type {?} */
    var primitive = this.primitive;
    if (defined(primitive)) {
        primitives.remove(primitive);
        this.primitive = undefined;
        this.geometry.removeAll();
        this.updaters.removeAll();
    }
    /** @type {?} */
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
        this.oldPrimitive = undefined;
    }
});
Batch.prototype.destroy = (/**
 * @return {?}
 */
function () {
    /** @type {?} */
    var primitive = this.primitive;
    /** @type {?} */
    var primitives = this.primitives;
    if (defined(primitive)) {
        primitives.remove(primitive);
    }
    /** @type {?} */
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
    }
    if (defined(this.removeMaterialSubscription)) {
        this.removeMaterialSubscription();
    }
});
/** @type {?} */
let wasFixed = false;
/**
 * @return {?}
 */
function fixCesiumEntitiesShadows() {
    if (wasFixed) {
        return;
    }
    Cesium.StaticGeometryColorBatch.prototype.add = (/**
     * @param {?} time
     * @param {?} updater
     * @return {?}
     */
    function (time, updater) {
        /** @type {?} */
        var items;
        /** @type {?} */
        var translucent;
        /** @type {?} */
        var instance = updater.createFillGeometryInstance(time);
        if (instance.attributes.color.value[3] === 255) {
            items = this._solidItems;
            translucent = false;
        }
        else {
            items = this._translucentItems;
            translucent = true;
        }
        /** @type {?} */
        var length = items.length;
        for (var i = 0; i < length; i++) {
            /** @type {?} */
            var item = items[i];
            if (item.isMaterial(updater)) {
                item.add(updater, instance);
                return;
            }
        }
        /** @type {?} */
        var batch = new Batch(this._primitives, translucent, this._appearanceType, this._depthFailAppearanceType, updater.depthFailMaterialProperty, this._closed, this._shadows);
        batch.add(updater, instance);
        items.push(batch);
    });
    wasFixed = true;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
class ConfigurationService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.config = config;
        /** @type {?} */
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
}
ConfigurationService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ConfigurationService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const SceneMode = {
    SCENE3D: 0,
    COLUMBUS_VIEW: 1,
    SCENE2D: 2,
    PERFORMANCE_SCENE2D: 3,
};
SceneMode[SceneMode.SCENE3D] = 'SCENE3D';
SceneMode[SceneMode.COLUMBUS_VIEW] = 'COLUMBUS_VIEW';
SceneMode[SceneMode.SCENE2D] = 'SCENE2D';
SceneMode[SceneMode.PERFORMANCE_SCENE2D] = 'PERFORMANCE_SCENE2D';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
class CameraService {
    constructor() {
        this.isSceneModePerformance2D = false;
    }
    /**
     * @param {?} cesiumService
     * @return {?}
     */
    init(cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    _listenToSceneModeMorph(callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    }
    /**
     * @return {?}
     */
    _revertCameraProperties() {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    }
    /**
     * Gets the scene's camera
     * @return {?}
     */
    getCamera() {
        return this.camera;
    }
    /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    getScreenSpaceCameraController() {
        return this.screenSpaceCameraController;
    }
    /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    getMinimumZoom() {
        return this.screenSpaceCameraController.minimumZoomDistance;
    }
    /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    setMinimumZoom(amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    }
    /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    getMaximumZoom() {
        return this.screenSpaceCameraController.maximumZoomDistance;
    }
    /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    setMaximumZoom(amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    }
    /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    enableTilt(tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    }
    /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    enableRotate(rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    }
    /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    enableLook(lock) {
        this.screenSpaceCameraController.enableLook = lock;
    }
    /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    enableTranslate(translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    }
    /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    enableZoom(zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    }
    /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    enableInputs(inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    }
    /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    setSceneMode(sceneMode, duration) {
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
                /** @type {?} */
                const morphCompleteEventListener = this.scene.morphComplete.addEventListener((/**
                 * @return {?}
                 */
                () => {
                    this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener();
                    this._listenToSceneModeMorph(this._revertCameraProperties.bind(this));
                }));
                break;
            }
        }
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    cameraFlyTo(options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    }
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    flyTo(target, options) {
        return this.viewer.flyTo(target, options);
    }
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    zoomIn(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    zoomOut(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    zoomTo(target, offset) {
        return this.viewer.zoomTo(target, offset);
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    setView(options) {
        this.camera.setView(options);
    }
    /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    setRotation(degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    }
    /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    lockRotation(lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    }
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    trackEntity(entity, options) {
        /** @type {?} */
        const flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            if (flyTo) {
                /** @type {?} */
                const flyToDuration = (options && options.flyToDuration) || 1;
                /** @type {?} */
                const altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                /** @type {?} */
                const entPosCar3 = entity.position.getValue(Cesium.JulianDate.now());
                /** @type {?} */
                const entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                /** @type {?} */
                const zoomAmount = altitude - entPosCart.height;
                entPosCart.height = altitude;
                /** @type {?} */
                const flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: (/**
                     * @return {?}
                     */
                    () => {
                        this.viewer.trackedEntity = entity;
                        setTimeout((/**
                         * @return {?}
                         */
                        () => {
                            if (zoomAmount > 0) {
                                this.camera.zoomOut(zoomAmount);
                            }
                            else {
                                this.camera.zoomIn(zoomAmount);
                            }
                        }), 0);
                        resolve();
                    })
                });
            }
            else {
                this.viewer.trackedEntity = entity;
                resolve();
            }
        }));
    }
    /**
     * @return {?}
     */
    untrackEntity() {
        this.trackEntity();
    }
}
CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
CameraService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CameraService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ViewerFactory {
    constructor() {
        this.cesium = Cesium;
    }
    /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    createViewer(mapContainer, options) {
        /** @type {?} */
        let viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, Object.assign({ contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                } }, options));
        }
        else {
            viewer = new this.cesium.Viewer(mapContainer, {
                // Poor internet connection - use default globe image, TODO: should be removed
                imageryProvider: Cesium.createTileMapServiceImageryProvider({
                    url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                }),
                baseLayerPicker: false,
                geocoder: false,
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
            });
        }
        return viewer;
    }
}
ViewerFactory.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ViewerFactory.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class ViewerConfiguration {
    constructor() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    /**
     * @return {?}
     */
    get viewerOptions() {
        return this._viewerOptions;
    }
    /**
     * @return {?}
     */
    getNextViewerOptions() {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    }
    /**
     * Can be used to set initial map viewer options.
     * If there is more than one map you can give the function an array of options.
     * The map initialized first will be set with the first option object in the options array and so on.
     * @param {?} value
     * @return {?}
     */
    set viewerOptions(value) {
        this._viewerOptions = value;
    }
    /**
     * @return {?}
     */
    get viewerModifier() {
        return this._viewerModifier;
    }
    /**
     * @return {?}
     */
    getNextViewerModifier() {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    }
    /**
     * Can be used to set map viewer options after the map has been initialized.
     * If there is more than one map you can give the function an array of functions.
     * The map initialized first will be set with the first option object in the options array and so on.
     * @param {?} value
     * @return {?}
     */
    set viewerModifier(value) {
        this._viewerModifier = value;
    }
}
ViewerConfiguration.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
class CesiumService {
    /**
     * @param {?} ngZone
     * @param {?} viewerFactory
     * @param {?} viewerConfiguration
     */
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    init(mapContainer, map$$1) {
        this.map = map$$1;
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            /** @type {?} */
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        }));
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    getCanvas() {
        return (/** @type {?} */ (this.cesiumViewer.canvas));
    }
    /**
     * @return {?}
     */
    getMap() {
        return this.map;
    }
}
CesiumService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CesiumService.ctorParameters = () => [
    { type: NgZone },
    { type: ViewerFactory },
    { type: ViewerConfiguration, decorators: [{ type: Optional }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {?} */
const CesiumEvent = {
    MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    LEFT_CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
    LEFT_DOUBLE_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    LEFT_DOWN: Cesium.ScreenSpaceEventType.LEFT_DOWN,
    LEFT_UP: Cesium.ScreenSpaceEventType.LEFT_UP,
    MIDDLE_CLICK: Cesium.ScreenSpaceEventType.MIDDLE_CLICK,
    MIDDLE_DOUBLE_CLICK: Cesium.ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK,
    MIDDLE_DOWN: Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
    MIDDLE_UP: Cesium.ScreenSpaceEventType.MIDDLE_UP,
    PINCH_START: Cesium.ScreenSpaceEventType.PINCH_START,
    PINCH_END: Cesium.ScreenSpaceEventType.PINCH_END,
    PINCH_MOVE: Cesium.ScreenSpaceEventType.PINCH_MOVE,
    RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
    RIGHT_DOUBLE_CLICK: Cesium.ScreenSpaceEventType.RIGHT_DOUBLE_CLICK,
    RIGHT_DOWN: Cesium.ScreenSpaceEventType.RIGHT_DOWN,
    RIGHT_UP: Cesium.ScreenSpaceEventType.RIGHT_UP,
    WHEEL: Cesium.ScreenSpaceEventType.WHEEL,
    LONG_LEFT_PRESS: 110,
    LONG_RIGHT_PRESS: 111,
    LONG_MIDDLE_PRESS: 112,
    LEFT_CLICK_DRAG: 113,
    RIGHT_CLICK_DRAG: 114,
    MIDDLE_CLICK_DRAG: 115,
};
CesiumEvent[CesiumEvent.LONG_LEFT_PRESS] = 'LONG_LEFT_PRESS';
CesiumEvent[CesiumEvent.LONG_RIGHT_PRESS] = 'LONG_RIGHT_PRESS';
CesiumEvent[CesiumEvent.LONG_MIDDLE_PRESS] = 'LONG_MIDDLE_PRESS';
CesiumEvent[CesiumEvent.LEFT_CLICK_DRAG] = 'LEFT_CLICK_DRAG';
CesiumEvent[CesiumEvent.RIGHT_CLICK_DRAG] = 'RIGHT_CLICK_DRAG';
CesiumEvent[CesiumEvent.MIDDLE_CLICK_DRAG] = 'MIDDLE_CLICK_DRAG';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const PickOptions = {
    NO_PICK: 0,
    PICK_FIRST: 1,
    PICK_ONE: 2,
    PICK_ALL: 3,
};
PickOptions[PickOptions.NO_PICK] = 'NO_PICK';
PickOptions[PickOptions.PICK_FIRST] = 'PICK_FIRST';
PickOptions[PickOptions.PICK_ONE] = 'PICK_ONE';
PickOptions[PickOptions.PICK_ALL] = 'PICK_ALL';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 */
class ContextMenuService {
    constructor() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    /**
     * @return {?}
     */
    get contextMenuChangeNotifier() {
        return this._contextMenuChangeNotifier;
    }
    /**
     * @return {?}
     */
    get showContextMenu() {
        return this._showContextMenu;
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @return {?}
     */
    get position() {
        return this._position;
    }
    /**
     * @return {?}
     */
    get content() {
        return this._content;
    }
    /**
     * @return {?}
     */
    get onOpen() {
        return this._onOpen;
    }
    /**
     * @return {?}
     */
    get onClose() {
        return this._onClose;
    }
    /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    init(mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    }
    /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    open(content, position, options = {}) {
        this.close();
        this._content = content;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe((/**
             * @return {?}
             */
            () => {
                this.leftClickSubscription.unsubscribe();
                this.close();
            }));
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    }
    /**
     * @return {?}
     */
    close() {
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
    }
}
ContextMenuService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const LatLonVectors$1 = LatLonVectors;
// doesnt exists on typings
window['geodesy'] = geodesy;
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * \@example
 * import { Component, OnInit } from '\@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * \@Component({
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
class CoordinateConverter {
    /**
     * @param {?=} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    screenToCartesian3(screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            /** @type {?} */
            const screenPosition = Object.assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                /** @type {?} */
                const mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            /** @type {?} */
            const camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    }
    /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    screenToCartographic(screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    }
    /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    cartesian3ToCartographic(cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    degreesToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    radiansToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    degreesToUTM(longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    }
    /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    UTMToDegrees(zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    }
    /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    geodesyToCesiumObject(geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    }
    /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    midPointToCartesian3(first, second) {
        /** @type {?} */
        const toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        (rad) => Cesium.Math.toDegrees(rad));
        /** @type {?} */
        const firstPoint = new LatLonVectors$1(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        const secondPoint = new LatLonVectors$1(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        const middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    middlePointByScreen(position0, position1) {
        /** @type {?} */
        const scene = this.cesiumService.getScene();
        /** @type {?} */
        const screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        /** @type {?} */
        const screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        /** @type {?} */
        const middleScreenPoint = new Cesium.Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    }
    /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    bearingTo(first, second) {
        /** @type {?} */
        const toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        (rad) => Cesium.Math.toDegrees(rad));
        /** @type {?} */
        const firstPoint = new LatLonVectors$1(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        const secondPoint = new LatLonVectors$1(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        const bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    }
    /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    bearingToCartesian(firstCartesian3, secondCartesian3) {
        /** @type {?} */
        const firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        /** @type {?} */
        const secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    }
}
CoordinateConverter.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CoordinateConverter.ctorParameters = () => [
    { type: CesiumService, decorators: [{ type: Optional }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Abstract drawer. All drawers extends this class.
 */
/**
 * @abstract
 */
class BasicDrawerService {
    constructor() {
    }
    /**
     * @param {?} assigner
     * @return {?}
     */
    setPropsAssigner(assigner) {
        this._propsAssigner = assigner;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
class PrimitivesDrawerService extends BasicDrawerService {
    /**
     * @param {?} drawerType
     * @param {?} cesiumService
     */
    constructor(drawerType, cesiumService) {
        super();
        this.drawerType = drawerType;
        this.cesiumService = cesiumService;
        this._show = true;
    }
    /**
     * @return {?}
     */
    init() {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    }
    /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    add(cesiumProps, ...args) {
        return this._cesiumCollection.add(cesiumProps);
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    update(entity, cesiumProps, ...args) {
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this._cesiumCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumCollection.removeAll();
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    }
    /**
     * @return {?}
     */
    getShow() {
        return this._show;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GeoUtilsService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    static pointByLocationDistanceAndAzimuth(currentLocation, meterDistance, radianAzimuth, deprecated) {
        /** @type {?} */
        const distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
        /** @type {?} */
        const cartographicLocation = currentLocation instanceof Cesium.Cartesian3 ? Cesium.Cartographic.fromCartesian(currentLocation) : currentLocation;
        /** @type {?} */
        const cartesianLocation = currentLocation instanceof Cesium.Cartesian3
            ? currentLocation
            : Cesium.Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        /** @type {?} */
        let resultPosition;
        /** @type {?} */
        let resultDistance;
        /** @type {?} */
        let counter = 0;
        /** @type {?} */
        let distanceFactorRangeMax = 0.1;
        /** @type {?} */
        let distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            /** @type {?} */
            const factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            resultPosition = GeoUtilsService._pointByLocationDistanceAndAzimuth(cartographicLocation, distance * (1 + factor), radianAzimuth);
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
    }
    /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    static _pointByLocationDistanceAndAzimuth(cartographicLocation, distance, radianAzimuth) {
        /** @type {?} */
        const curLat = cartographicLocation.latitude;
        /** @type {?} */
        const curLon = cartographicLocation.longitude;
        /** @type {?} */
        const destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        /** @type {?} */
        let destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
    }
    /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    static distance(pos0, pos1) {
        return Cesium.Cartesian3.distance(pos0, pos1);
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    static getPositionsDelta(position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    }
    /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    static addDeltaToPosition(position, delta, updateReference = false) {
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            /** @type {?} */
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = 0;
            /** @type {?} */
            const cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            /** @type {?} */
            const cartesian = new Cesium.Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            /** @type {?} */
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    static middleCartesian3Point(position0, position1) {
        return new Cesium.Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    }
    /**
     * @param {?} screenPos
     * @return {?}
     */
    screenPositionToCartesian3(screenPos) {
        /** @type {?} */
        const camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    }
}
GeoUtilsService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GeoUtilsService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * +  This drawer is responsible for drawing an arc over the Cesium map.
 * +  This implementation uses simple PolylineGeometry and Primitive parameters.
 * +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
class ArcDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateArcPositions(cesiumProps) {
        /** @type {?} */
        const quality = cesiumProps.quality || 18;
        /** @type {?} */
        const delta = (cesiumProps.delta) / quality;
        /** @type {?} */
        const pointsArray = [];
        for (let i = 0; i < quality + 1; ++i) {
            /** @type {?} */
            const point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateTriangle(cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateArc(cesiumProps) {
        /** @type {?} */
        const arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            /** @type {?} */
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    }
    /**
     * @param {?} primitive
     * @param {?} cesiumProps
     * @return {?}
     */
    update(primitive, cesiumProps) {
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
    }
}
ArcDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ArcDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const GraphicsType = {
    ellipse: Cesium.EllipseGraphics,
    ellipsoid: Cesium.EllipsoidGraphics,
    polygon: Cesium.PolygonGraphics,
    polyline: Cesium.PolylineGraphics,
    polylineVolume: Cesium.PolylineVolumeGraphics,
    box: Cesium.BoxGraphics,
    corridor: Cesium.CorridorGraphics,
    cylinder: Cesium.CylinderGraphics,
    label: Cesium.LabelGraphics,
    billboard: Cesium.BillboardGraphics,
    model: Cesium.ModelGraphics,
    path: Cesium.PathGraphics,
    point: Cesium.PointGraphics,
    rectangle: Cesium.RectangleGraphics,
    wall: Cesium.WallGraphics,
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OptimizedEntityCollection {
    /**
     * @param {?} entityCollection
     * @param {?=} collectionSize
     * @param {?=} updateRate
     */
    constructor(entityCollection, collectionSize = -1, updateRate = -1) {
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    /**
     * @param {?} show
     * @return {?}
     */
    setShow(show) {
        this.entityCollection.show = show;
    }
    /**
     * @return {?}
     */
    get isSuspended() {
        return this._isSuspended;
    }
    /**
     * @return {?}
     */
    get updateRate() {
        return this._updateRate;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set updateRate(value) {
        this._updateRate = value;
    }
    /**
     * @return {?}
     */
    get collectionSize() {
        return this._collectionSize;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set collectionSize(value) {
        this._collectionSize = value;
    }
    /**
     * @return {?}
     */
    collection() {
        return this.entityCollection;
    }
    /**
     * @return {?}
     */
    isFree() {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    add(entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    removeNoSuspend(entity) {
        this.entityCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.suspend();
        this.entityCollection.removeAll();
    }
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    onEventSuspension(callback, once = false) {
        this._onEventSuspensionCallback = { callback, once };
        return (/**
         * @return {?}
         */
        () => {
            this._onEventSuspensionCallback = undefined;
        });
    }
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    onEventResume(callback, once = false) {
        this._onEventResumeCallback = { callback, once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return (/**
         * @return {?}
         */
        () => {
            this._onEventResumeCallback = undefined;
        });
    }
    /**
     * @return {?}
     */
    triggerEventSuspension() {
        if (this._onEventSuspensionCallback !== undefined) {
            /** @type {?} */
            const callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    }
    /**
     * @return {?}
     */
    triggerEventResume() {
        if (this._onEventResumeCallback !== undefined) {
            /** @type {?} */
            const callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    }
    /**
     * @return {?}
     */
    suspend() {
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
            this._suspensionTimeout = setTimeout((/**
             * @return {?}
             */
            () => {
                this.entityCollection.resumeEvents();
                this.triggerEventResume();
                this._isSuspended = false;
                this._suspensionTimeout = undefined;
            }), this._updateRate);
        }
    }
    /**
     * @return {?}
     */
    hardSuspend() {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    }
    /**
     * @return {?}
     */
    hardResume() {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
class EntitiesDrawerService extends BasicDrawerService {
    /**
     * @param {?} cesiumService
     * @param {?} graphicsType
     * @param {?=} defaultOptions
     */
    constructor(cesiumService, graphicsType, defaultOptions = {
        collectionMaxSize: -1,
        collectionSuspensionTime: -1,
        collectionsNumber: 1,
    }) {
        super();
        this.cesiumService = cesiumService;
        this.graphicsType = graphicsType;
        this.defaultOptions = defaultOptions;
        this.entityCollections = new Map();
        this.graphicsTypeName = GraphicsType[this.graphicsType];
        // Fix bad enum compilation
        for (const i in GraphicsType) {
            if ((/** @type {?} */ (GraphicsType[i])) === this.graphicsType) {
                this.graphicsTypeName = i;
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    getFreeEntitiesCollection() {
        /** @type {?} */
        let freeEntityCollection = null;
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        }));
        return freeEntityCollection;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    init(options) {
        /** @type {?} */
        const finalOptions = options || this.defaultOptions;
        /** @type {?} */
        const dataSources = [];
        for (let i = 0; i < finalOptions.collectionsNumber; i++) {
            /** @type {?} */
            const dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        /** @type {?} */
        const optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        /** @type {?} */
        const graphicsClass = (/** @type {?} */ (this.graphicsType));
        /** @type {?} */
        const entityObject = {
            position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
            description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
            orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
            viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined,
            [this.graphicsTypeName]: cesiumProps,
        };
        if (cesiumProps.name !== undefined) {
            entityObject.name = cesiumProps.name;
        }
        return optimizedEntityCollection.add(entityObject);
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    update(entity, cesiumProps) {
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
        if (this._propsAssigner) {
            this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
        }
        else {
            Object.assign(entity[this.graphicsTypeName], cesiumProps);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        /** @type {?} */
        const optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            entityCollection.removeAll();
        }));
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            entityCollection.setShow(showValue);
        }));
    }
    /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    suspendEntityCollection(entity) {
        /** @type {?} */
        const id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        /** @type {?} */
        const entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing billboards.
 */
class BillboardDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.billboard);
    }
}
BillboardDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
BillboardDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
class CzmlDrawerService extends BasicDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    init(options) {
        /** @type {?} */
        const dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
}
CzmlDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CzmlDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing ellipses.
 */
class EllipseDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.ellipse, {
            collectionsNumber: 10,
            collectionMaxSize: 450,
            collectionSuspensionTime: 100
        });
    }
}
EllipseDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EllipseDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing labels.
 */
class LabelDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.label);
    }
}
LabelDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
LabelDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing points.
 */
class PointDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.point);
    }
}
PointDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PointDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polygons.
 */
class PolygonDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polygon);
    }
}
PolygonDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolygonDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing polylines.
 */
class PolylineDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polyline);
    }
}
PolylineDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolylineDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    }
    /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    update(cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Cesium.Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        super.update(cesiumObject, cesiumProps);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    withColorMaterial(cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            /** @type {?} */
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    }
}
PolylinePrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolylinePrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const KeyboardAction = {
    CAMERA_FORWARD: 0,
    CAMERA_BACKWARD: 1,
    CAMERA_RIGHT: 2,
    CAMERA_LEFT: 3,
    CAMERA_UP: 4,
    CAMERA_DOWN: 5,
    CAMERA_LOOK_RIGHT: 6,
    CAMERA_LOOK_LEFT: 7,
    CAMERA_LOOK_UP: 8,
    CAMERA_LOOK_DOWN: 9,
    CAMERA_TWIST_RIGHT: 10,
    CAMERA_TWIST_LEFT: 11,
    CAMERA_ROTATE_RIGHT: 12,
    CAMERA_ROTATE_LEFT: 13,
    CAMERA_ROTATE_UP: 14,
    CAMERA_ROTATE_DOWN: 15,
    CAMERA_ZOOM_IN: 16,
    CAMERA_ZOOM_OUT: 17,
};
KeyboardAction[KeyboardAction.CAMERA_FORWARD] = 'CAMERA_FORWARD';
KeyboardAction[KeyboardAction.CAMERA_BACKWARD] = 'CAMERA_BACKWARD';
KeyboardAction[KeyboardAction.CAMERA_RIGHT] = 'CAMERA_RIGHT';
KeyboardAction[KeyboardAction.CAMERA_LEFT] = 'CAMERA_LEFT';
KeyboardAction[KeyboardAction.CAMERA_UP] = 'CAMERA_UP';
KeyboardAction[KeyboardAction.CAMERA_DOWN] = 'CAMERA_DOWN';
KeyboardAction[KeyboardAction.CAMERA_LOOK_RIGHT] = 'CAMERA_LOOK_RIGHT';
KeyboardAction[KeyboardAction.CAMERA_LOOK_LEFT] = 'CAMERA_LOOK_LEFT';
KeyboardAction[KeyboardAction.CAMERA_LOOK_UP] = 'CAMERA_LOOK_UP';
KeyboardAction[KeyboardAction.CAMERA_LOOK_DOWN] = 'CAMERA_LOOK_DOWN';
KeyboardAction[KeyboardAction.CAMERA_TWIST_RIGHT] = 'CAMERA_TWIST_RIGHT';
KeyboardAction[KeyboardAction.CAMERA_TWIST_LEFT] = 'CAMERA_TWIST_LEFT';
KeyboardAction[KeyboardAction.CAMERA_ROTATE_RIGHT] = 'CAMERA_ROTATE_RIGHT';
KeyboardAction[KeyboardAction.CAMERA_ROTATE_LEFT] = 'CAMERA_ROTATE_LEFT';
KeyboardAction[KeyboardAction.CAMERA_ROTATE_UP] = 'CAMERA_ROTATE_UP';
KeyboardAction[KeyboardAction.CAMERA_ROTATE_DOWN] = 'CAMERA_ROTATE_DOWN';
KeyboardAction[KeyboardAction.CAMERA_ZOOM_IN] = 'CAMERA_ZOOM_IN';
KeyboardAction[KeyboardAction.CAMERA_ZOOM_OUT] = 'CAMERA_ZOOM_OUT';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
/** @type {?} */
const CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
/** @type {?} */
const CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
/** @type {?} */
const CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
/** @type {?} */
const PREDEFINED_KEYBOARD_ACTIONS = {
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_FORWARD]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    }),
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_BACKWARD]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    }),
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    }),
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    }),
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    }),
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    }),
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    }),
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    }),
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    }),
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    }),
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    }),
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    }),
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_IN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const amount = params.amount;
        camera.zoomIn(amount);
    }),
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_OUT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const amount = params.amount;
        camera.zoomOut(amount);
    }),
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const KeyEventState = {
    IGNORED: 0,
    NOT_PRESSED: 1,
    PRESSED: 2,
};
KeyEventState[KeyEventState.IGNORED] = 'IGNORED';
KeyEventState[KeyEventState.NOT_PRESSED] = 'NOT_PRESSED';
KeyEventState[KeyEventState.PRESSED] = 'PRESSED';
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
class KeyboardControlService {
    /**
     * Creats the keyboard control service.
     * @param {?} ngZone
     * @param {?} cesiumService
     * @param {?} document
     */
    constructor(ngZone, cesiumService, document) {
        this.ngZone = ngZone;
        this.cesiumService = cesiumService;
        this.document = document;
        this._currentDefinitions = null;
        this._activeDefinitions = {};
        this._keyMappingFn = this.defaultKeyMappingFn;
    }
    /**
     * Initializes the keyboard control service.
     * @return {?}
     */
    init() {
        /** @type {?} */
        const canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', (/**
         * @return {?}
         */
        () => {
            canvas.focus();
        }));
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleTick = this.handleTick.bind(this);
    }
    /**
     * Sets the current map keyboard control definitions.
     * The definitions is a key mapping between a key string and a KeyboardControlDefinition:
     * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
     * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
     * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
     * - `params` is an object (or function that returns object) that will be passed into the action executor.
     * - `done` is a function that will be triggered when `keyup` is triggered.
     * @param {?} definitions Keyboard Control Definition
     * @param {?=} keyMappingFn - Mapping function for custom keys
     * @param {?=} outsideOfAngularZone - if key down events will run outside of angular zone.
     * @return {?}
     */
    setKeyboardControls(definitions, keyMappingFn, outsideOfAngularZone = false) {
        if (!definitions) {
            return this.removeKeyboardControls();
        }
        if (!this._currentDefinitions) {
            this.registerEvents(outsideOfAngularZone);
        }
        this._currentDefinitions = definitions;
        this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;
        Object.keys(this._currentDefinitions).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        }));
    }
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     * @return {?}
     */
    removeKeyboardControls() {
        this.unregisterEvents();
        this._currentDefinitions = null;
    }
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     * @private
     * @param {?} char
     * @return {?}
     */
    getAction(char) {
        return this._currentDefinitions[char] || null;
    }
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     * @private
     * @param {?} keyEvent
     * @return {?}
     */
    defaultKeyMappingFn(keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    }
    /**
     * document's `keydown` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    handleKeydown(e) {
        /** @type {?} */
        const char = this._keyMappingFn(e);
        /** @type {?} */
        const action = this.getAction(char);
        if (action) {
            /** @type {?} */
            const actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                /** @type {?} */
                let execute = true;
                /** @type {?} */
                const params = this.getParams(action.params, e);
                if (action.validation) {
                    execute = action.validation(this.cesiumService, params, e);
                }
                if (execute === true) {
                    this._activeDefinitions[char] = {
                        state: KeyEventState.PRESSED,
                        action,
                        keyboardEvent: e,
                    };
                }
            }
        }
    }
    /**
     * document's `keyup` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    handleKeyup(e) {
        /** @type {?} */
        const char = this._keyMappingFn(e);
        /** @type {?} */
        const action = this.getAction(char);
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
    }
    /**
     * `tick` event handler that triggered by Cesium render loop
     * @private
     * @return {?}
     */
    handleTick() {
        /** @type {?} */
        const activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            /** @type {?} */
            const actionState = this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        }));
    }
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     * @private
     * @param {?} paramsDef
     * @param {?} keyboardEvent
     * @return {?}
     */
    getParams(paramsDef, keyboardEvent) {
        if (!paramsDef) {
            return {};
        }
        if (typeof paramsDef === 'function') {
            return paramsDef(this.cesiumService, keyboardEvent);
        }
        return paramsDef;
    }
    /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     * @private
     * @param {?} execution
     * @param {?} key
     * @param {?} keyboardEvent
     * @return {?}
     */
    executeAction(execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        /** @type {?} */
        const params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            /** @type {?} */
            const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[(/** @type {?} */ (execution.action))];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            /** @type {?} */
            const shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);
            if (shouldCancelEvent === false) {
                this._activeDefinitions[key] = {
                    state: KeyEventState.IGNORED,
                    action: null,
                    keyboardEvent: null,
                };
            }
        }
    }
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @param {?} outsideOfAngularZone
     * @return {?}
     */
    registerEvents(outsideOfAngularZone) {
        /** @type {?} */
        const registerToEvents = (/**
         * @return {?}
         */
        () => {
            this.document.addEventListener('keydown', this.handleKeydown);
            this.document.addEventListener('keyup', this.handleKeyup);
            this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
        });
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    }
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @return {?}
     */
    unregisterEvents() {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    }
}
KeyboardControlService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
KeyboardControlService.ctorParameters = () => [
    { type: NgZone },
    { type: CesiumService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumPureEventObserver {
    /**
     * @param {?} event
     * @param {?} modifier
     */
    constructor(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    /**
     * @param {?} eventsHandler
     * @return {?}
     */
    init(eventsHandler) {
        this.observer = Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => {
            eventsHandler.setInputAction((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }), this.event, this.modifier);
        }));
        return this.observer;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumLongPressObserver extends CesiumPureEventObserver {
    /**
     * @param {?} event
     * @param {?} modifier
     * @param {?} eventFactory
     */
    constructor(event, modifier, eventFactory) {
        super(event, modifier);
        this.event = event;
        this.modifier = modifier;
        this.eventFactory = eventFactory;
    }
    /**
     * @return {?}
     */
    init() {
        /** @type {?} */
        let startEvent;
        /** @type {?} */
        let stopEvent;
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
        /** @type {?} */
        const startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        /** @type {?} */
        const stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);
        // publish for preventing side effect
        /** @type {?} */
        const longPressObservable = publish()(startEventObservable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        (e) => of(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable))))));
        return longPressObservable;
    }
}
CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumEventBuilder {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    static getEventFullName(event, modifier) {
        if (modifier) {
            return `${event}_${modifier}`;
        }
        else {
            return event.toString();
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    }
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    get(event, modifier) {
        /** @type {?} */
        const eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            /** @type {?} */
            const eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    }
    /**
     * @private
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    createCesiumEventObservable(event, modifier) {
        /** @type {?} */
        let cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    }
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @return {?}
     */
    createSpecialCesiumEventObservable(event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    }
}
CesiumEventBuilder.longPressEvents = new Set([
    CesiumEvent.LONG_LEFT_PRESS,
    CesiumEvent.LONG_RIGHT_PRESS,
    CesiumEvent.LONG_MIDDLE_PRESS
]);
CesiumEventBuilder.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CesiumEventBuilder.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
class PlonterService {
    constructor() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    /**
     * @return {?}
     */
    get plonterChangeNotifier() {
        return this._plonterChangeNotifier;
    }
    /**
     * @return {?}
     */
    get plonterShown() {
        return this._plonterShown;
    }
    /**
     * @return {?}
     */
    get entitesToPlonter() {
        return this._entitesToPlonter;
    }
    /**
     * @return {?}
     */
    get plonterClickPosition() {
        return this._eventResult.movement;
    }
    /**
     * @param {?} eventResult
     * @return {?}
     */
    plonterIt(eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    resolvePlonter(entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    }
}
PlonterService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PlonterService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const UtilsService = {
    unique: (/**
     * @param {?} array
     * @return {?}
     */
    (array) => {
        return array.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => {
            if (accumulator.indexOf(currentValue) < 0) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }), []);
    })
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumDragDropHelper {
    /**
     * @param {?} dragEvent
     * @return {?}
     */
    static getDragEventTypes(dragEvent) {
        /** @type {?} */
        let mouseDownEvent;
        /** @type {?} */
        let mouseUpEvent;
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
        return { mouseDownEvent, mouseUpEvent };
    }
}
CesiumDragDropHelper.dragEvents = new Set([
    CesiumEvent.LEFT_CLICK_DRAG,
    CesiumEvent.RIGHT_CLICK_DRAG,
    CesiumEvent.MIDDLE_CLICK_DRAG
]);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Registration {
    /**
     * @param {?} observable
     * @param {?} stopper
     * @param {?} priority
     * @param {?} isPaused
     */
    constructor(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
}
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
class MapEventsManagerService {
    /**
     * @param {?} cesiumService
     * @param {?} eventBuilder
     * @param {?} plonterService
     */
    constructor(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    /**
     * @return {?}
     */
    init() {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    }
    /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    register(input) {
        if (this.scene === undefined) {
            throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
        }
        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw new Error('MapEventsManagerService: can\'t register an event ' +
                'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
        }
        /** @type {?} */
        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        /** @type {?} */
        const eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority, input.pickFilter);
        /** @type {?} */
        const registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = (/**
         * @return {?}
         */
        () => this.disposeObservable(eventRegistration, eventName));
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return (/** @type {?} */ (registrationObservable));
    }
    /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        /** @type {?} */
        const registrations = this.eventRegistrations.get(eventName);
        /** @type {?} */
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }
    /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    sortRegistrationsByPriority(eventName) {
        /** @type {?} */
        const registrations = this.eventRegistrations.get(eventName);
        registrations.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => b.priority - a.priority));
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        /** @type {?} */
        const currentPriority = registrations[0].priority;
        registrations.forEach((/**
         * @param {?} registration
         * @return {?}
         */
        (registration) => {
            registration.isPaused = registration.priority < currentPriority;
        }));
    }
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    createEventRegistration(event, modifier, entityType, pickOption, priority, pickFilter) {
        /** @type {?} */
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        /** @type {?} */
        const stopper = new Subject();
        /** @type {?} */
        const registration = new Registration(undefined, stopper, priority, false);
        /** @type {?} */
        let observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter((/**
             * @return {?}
             */
            () => !registration.isPaused)), map((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => this.triggerPick(movement, pickOption))), filter((/**
             * @param {?} result
             * @return {?}
             */
            (result) => result.cesiumEntities !== null || entityType === undefined)), map((/**
             * @param {?} picksAndMovement
             * @return {?}
             */
            (picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter))), filter((/**
             * @param {?} result
             * @return {?}
             */
            (result) => result.entities !== null || (entityType === undefined && !pickFilter))), switchMap((/**
             * @param {?} entitiesAndMovement
             * @return {?}
             */
            (entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption))), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    }
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter) {
        const { mouseDownEvent, mouseUpEvent } = CesiumDragDropHelper.getDragEventTypes(event);
        /** @type {?} */
        const mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        /** @type {?} */
        const mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        /** @type {?} */
        const mouseDownRegistration = this.createEventRegistration(mouseDownEvent, modifier, entityType, pickOption, priority, pickFilter);
        /** @type {?} */
        const dropSubject = new Subject();
        /** @type {?} */
        const dragObserver = mouseDownRegistration.observable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        e => {
            /** @type {?} */
            let lastMove = null;
            /** @type {?} */
            const dragStartPositionX = e.movement.startPosition.x;
            /** @type {?} */
            const dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => {
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
            })), takeUntil(mouseUpObservable), tap(undefined, undefined, (/**
             * @return {?}
             */
            () => {
                // On complete
                if (lastMove) {
                    /** @type {?} */
                    const dropEvent = Object.assign({}, lastMove);
                    dropEvent.movement.drop = true;
                    dropSubject.next(dropEvent);
                }
            })));
        })));
        return merge(dragObserver, dropSubject);
    }
    /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    triggerPick(movement, pickOptions) {
        /** @type {?} */
        let picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                /** @type {?} */
                const pick = this.scene.pick(movement.endPosition);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map((/**
             * @param {?} pick
             * @return {?}
             */
            (pick) => pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive));
        }
        return { movement: movement, cesiumEntities: picks };
    }
    /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    addEntities(picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        /** @type {?} */
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                (pick) => pick.acEntity)).filter((/**
                 * @param {?} acEntity
                 * @return {?}
                 */
                (acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                }));
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                (pick) => pick.acEntity));
            }
            entities = UtilsService.unique(entities);
            entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
            if (entities.length === 0) {
                entities = null;
            }
        }
        picksAndMovement.entities = entities;
        return picksAndMovement;
    }
    /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    plonter(entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return of(entitiesAndMovement);
        }
    }
}
MapEventsManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapEventsManagerService.ctorParameters = () => [
    { type: CesiumService },
    { type: CesiumEventBuilder },
    { type: PlonterService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MapLayersService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    registerLayerDataSources(dataSources, zIndex) {
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        ds => {
            ds.zIndex = zIndex;
            this.layersDataSources.push(ds);
        }));
    }
    /**
     * @return {?}
     */
    drawAllLayers() {
        this.layersDataSources.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a.zIndex - b.zIndex));
        this.layersDataSources.forEach((/**
         * @param {?} dataSource
         * @return {?}
         */
        (dataSource) => {
            this.cesiumService.getViewer().dataSources.add(dataSource);
        }));
    }
    /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    updateAndRefresh(dataSources, newZIndex) {
        if (dataSources && dataSources.length) {
            dataSources.forEach((/**
             * @param {?} ds
             * @return {?}
             */
            (ds) => {
                /** @type {?} */
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources[index].zIndex = newZIndex;
                }
            }));
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    }
    /**
     * @param {?} dataSources
     * @return {?}
     */
    removeDataSources(dataSources) {
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        ds => {
            /** @type {?} */
            const index = this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                this.layersDataSources.splice(index, 1);
                this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        }));
    }
}
MapLayersService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapLayersService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
class MapsManagerService {
    constructor() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    getMap(id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    }
    /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    _registerMap(id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        /** @type {?} */
        const mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error(`Map with id: ${mapId} already exist`);
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _removeMapById(id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            /** @type {?} */
            const iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    }
    /**
     * @private
     * @return {?}
     */
    generateDefaultId() {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    }
    /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    sync2DMapsCameras(mapsConfiguration) {
        /** @type {?} */
        const DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        /** @type {?} */
        const maps = mapsConfiguration.map((/**
         * @param {?} config
         * @return {?}
         */
        config => {
            /** @type {?} */
            const map$$1 = this.getMap(config.id);
            if (!map$$1) {
                throw new Error(`Couldn't find map with id: ${config.id}`);
            }
            return { map: map$$1, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        }));
        maps.forEach((/**
         * @param {?} masterMapConfig
         * @return {?}
         */
        masterMapConfig => {
            /** @type {?} */
            const masterMap = masterMapConfig.map;
            /** @type {?} */
            const options = masterMapConfig.options;
            /** @type {?} */
            const masterCamera = masterMap.getCameraService().getCamera();
            /** @type {?} */
            const masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            /** @type {?} */
            const removeCallback = masterCamera.changed.addEventListener((/**
             * @return {?}
             */
            () => {
                maps.forEach((/**
                 * @param {?} slaveMapConfig
                 * @return {?}
                 */
                slaveMapConfig => {
                    /** @type {?} */
                    const slaveMap = slaveMapConfig.map;
                    /** @type {?} */
                    const slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    /** @type {?} */
                    const slaveCamera = slaveMap.getCameraService().getCamera();
                    /** @type {?} */
                    const slaveCameraCartographic = slaveCamera.positionCartographic;
                    /** @type {?} */
                    const position = Cesium.Ellipsoid.WGS84.cartographicToCartesian({
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
                }));
            }));
            this.eventRemoveCallbacks.push(removeCallback);
        }));
    }
    /**
     * Unsyncs maps cameras
     * @return {?}
     */
    unsyncMapsCameras() {
        this.eventRemoveCallbacks.forEach((/**
         * @param {?} removeCallback
         * @return {?}
         */
        removeCallback => removeCallback()));
        this.eventRemoveCallbacks = [];
    }
}
MapsManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapsManagerService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class ScreenshotService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @return {?}
     */
    getMapScreenshotDataUrlBase64() {
        /** @type {?} */
        const canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    }
    /**
     * @param {?=} filename
     * @return {?}
     */
    downloadMapScreenshot(filename = 'map.png') {
        /** @type {?} */
        const dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    }
    /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    downloadURI(uri, name) {
        /** @type {?} */
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
ScreenshotService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ScreenshotService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getCesiumViewer()
 * 2. Use MapManagerService.getMap().getCesiumViewer() or if more then one map: MapManagerService.getMap(mapId).getCesiumViewer()
 *
 *
 * \@example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
class AcMapComponent {
    /**
     * @param {?} _cesiumService
     * @param {?} _cameraService
     * @param {?} _elemRef
     * @param {?} document
     * @param {?} mapsManagerService
     * @param {?} billboardDrawerService
     * @param {?} labelDrawerService
     * @param {?} ellipseDrawerService
     * @param {?} polylineDrawerService
     * @param {?} polygonDrawerService
     * @param {?} arcDrawerService
     * @param {?} pointDrawerService
     * @param {?} czmlDrawerService
     * @param {?} mapEventsManager
     * @param {?} keyboardControlService
     * @param {?} mapLayersService
     * @param {?} configurationService
     * @param {?} screenshotService
     * @param {?} contextMenuService
     * @param {?} coordinateConverter
     */
    constructor(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, configurationService, screenshotService, contextMenuService, coordinateConverter) {
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
    /**
     * @return {?}
     */
    ngOnInit() {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            /** @type {?} */
            const element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const element = this.document.getElementById(this.containerId);
                if (element) {
                    element.appendChild(this.mapContainer);
                }
                else {
                    throw new Error(`No element found with id: ${this.containerId}`);
                }
            }), 0);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    }
    /**
     * @return {?} ac-map's cesium service
     */
    getCesiumSerivce() {
        return this._cesiumService;
    }
    /**
     * @return {?} map's cesium viewer
     */
    getCesiumViewer() {
        return this._cesiumService.getViewer();
    }
    /**
     * @return {?}
     */
    getCameraService() {
        return this._cameraService;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.mapId;
    }
    /**
     * @return {?}
     */
    getMapContainer() {
        return this.mapContainer;
    }
    /**
     * @return {?}
     */
    getMapEventsManager() {
        return this.mapEventsManager;
    }
    /**
     * @return {?}
     */
    getContextMenuService() {
        return this.contextMenuService;
    }
    /**
     * @return {?}
     */
    getScreenshotService() {
        return this.screenshotService;
    }
    /**
     * @return {?}
     */
    getKeyboardControlService() {
        return this.keyboardControlService;
    }
    /**
     * @return {?}
     */
    getCoordinateConverter() {
        return this.coordinateConverter;
    }
}
AcMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-map',
                template: `
    <ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `,
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
            }] }
];
/** @nocollapse */
AcMapComponent.ctorParameters = () => [
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
];
AcMapComponent.propDecorators = {
    disableDefaultPlonter: [{ type: Input }],
    mapId: [{ type: Input }],
    flyTo: [{ type: Input }],
    sceneMode: [{ type: Input }],
    containerId: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LayerService {
    constructor() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get cache() {
        return this._cache;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set cache(value) {
        this._cache = value;
    }
    /**
     * @return {?}
     */
    get zIndex() {
        return this._zIndex;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set zIndex(value) {
        if (value !== this._zIndex) {
            this.layerUpdate.emit();
        }
        this._zIndex = value;
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set show(value) {
        if (value !== this._show) {
            this.layerUpdate.emit();
        }
        this._show = value;
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set options(value) {
        this._options = value;
        this.layerUpdate.emit();
    }
    /**
     * @return {?}
     */
    get context() {
        return this._context;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    set context(context) {
        this._context = context;
        this.layerUpdate.emit();
    }
    /**
     * @param {?} name
     * @return {?}
     */
    setEntityName(name) {
        this._entityName = name;
    }
    /**
     * @return {?}
     */
    getEntityName() {
        return this._entityName;
    }
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    registerDescription(descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    }
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    unregisterDescription(descriptionComponent) {
        /** @type {?} */
        const index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    }
    /**
     * @return {?}
     */
    getDescriptions() {
        return this.descriptions;
    }
    /**
     * @return {?}
     */
    layerUpdates() {
        return this.layerUpdate;
    }
}
LayerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const ActionType = {
    ADD_UPDATE: 0,
    DELETE: 1,
};
ActionType[ActionType.ADD_UPDATE] = 'ADD_UPDATE';
ActionType[ActionType.DELETE] = 'DELETE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ComputationCache {
    constructor() {
        this._cache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    get(expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        /** @type {?} */
        const value = insertFn();
        this._cache.set(expression, value);
        return value;
    }
    /**
     * @return {?}
     */
    clear() {
        this._cache.clear();
    }
}
ComputationCache.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Checker {
    /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    static throwIfAnyNotPresent(values, propertyNames) {
        propertyNames.forEach((/**
         * @param {?} propertyName
         * @return {?}
         */
        propertyName => Checker.throwIfNotPresent(values, propertyName)));
    }
    /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    static throwIfNotPresent(value, name) {
        if (!Checker.present(value[name])) {
            throw new Error(`Error: ${name} was not given.`);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static present(value) {
        return value !== undefined && value !== null;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
class DynamicEllipseDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return super.add(new EllipsePrimitive(cesiumProps));
    }
    /**
     * @param {?} ellipse
     * @param {?} cesiumProps
     * @return {?}
     */
    update(ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    }
}
DynamicEllipseDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DynamicEllipseDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
class DynamicPolylineDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
}
DynamicPolylineDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DynamicPolylineDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
class StaticPrimitiveDrawer extends PrimitivesDrawerService {
    /**
     * @param {?} geometryType
     * @param {?} cesiumService
     */
    constructor(geometryType, cesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
        this.geometryType = geometryType;
    }
    /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    add(geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        /** @type {?} */
        const primitive = new Cesium.Primitive(primitiveProps);
        return super.add(primitive);
    }
    /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return super.add(new Cesium.Primitive(primitiveProps));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
class StaticCircleDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.CircleGeometry, cesiumService);
    }
}
StaticCircleDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticCircleDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        /** @type {?} */
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((/**
             * @param {?} readyPrimitive
             * @return {?}
             */
            (readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            }));
        }
        return primitive;
    }
}
StaticPolylineDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticPolylineDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * + This drawer is responsible for drawing a polygon over the Cesium map.
 * + This implementation uses simple PolygonGeometry and Primitive parameters.
 * + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolygonGeometry, cesiumService);
    }
}
StaticPolygonDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticPolygonDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 * + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 * + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 * +
 */
class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.EllipseGeometry, cesiumService);
    }
}
StaticEllipseDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticEllipseDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing models.
 */
class ModelDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.model);
    }
}
ModelDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ModelDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing box.
 */
class BoxDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.box);
    }
}
BoxDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
BoxDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing corridors .
 */
class CorridorDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.corridor);
    }
}
CorridorDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CorridorDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing cylinders.
 */
class CylinderDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.cylinder);
    }
}
CylinderDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CylinderDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
class EllipsoidDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.ellipsoid);
    }
}
EllipsoidDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EllipsoidDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polylines.
 */
class PolylineVolumeDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polylineVolume);
    }
}
PolylineVolumeDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolylineVolumeDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polygons.
 */
class WallDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.wall);
    }
}
WallDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
WallDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing rectangle.
 */
class RectangleDrawerService extends EntitiesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.rectangle);
    }
}
RectangleDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
RectangleDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.LabelCollection, cesiumService);
    }
}
LabelPrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
LabelPrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
class BillboardPrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.BillboardCollection, cesiumService);
    }
}
BillboardPrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
BillboardPrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
class PointPrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PointPrimitiveCollection, cesiumService);
    }
}
PointPrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PointPrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HtmlDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} _cesiumService
     */
    constructor(_cesiumService) {
        super(Cesium.HtmlCollection, _cesiumService);
        this._cesiumService = _cesiumService;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return super.add(cesiumProps);
    }
}
HtmlDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
HtmlDrawerService.ctorParameters = () => [
    { type: CesiumService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcLayerComponent {
    /**
     * @param {?} layerService
     * @param {?} _computationCache
     * @param {?} mapLayersService
     * @param {?} billboardDrawerService
     * @param {?} labelDrawerService
     * @param {?} ellipseDrawerService
     * @param {?} polylineDrawerService
     * @param {?} polygonDrawerService
     * @param {?} arcDrawerService
     * @param {?} pointDrawerService
     * @param {?} modelDrawerService
     * @param {?} boxDrawerService
     * @param {?} corridorDrawerService
     * @param {?} cylinderDrawerService
     * @param {?} ellipsoidDrawerSerice
     * @param {?} polylineVolumeDrawerService
     * @param {?} wallDrawerService
     * @param {?} rectangleDrawerService
     * @param {?} dynamicEllipseDrawerService
     * @param {?} dynamicPolylineDrawerService
     * @param {?} staticCircleDrawerService
     * @param {?} staticPolylineDrawerService
     * @param {?} staticPolygonDrawerService
     * @param {?} staticEllipseDrawerService
     * @param {?} polylinePrimitiveDrawerService
     * @param {?} labelPrimitiveDrawerService
     * @param {?} billboardPrimitiveDrawerService
     * @param {?} pointPrimitiveDrawerService
     * @param {?} htmlDrawerService
     * @param {?} czmlDrawerService
     */
    constructor(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
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
            ['polygon', (/** @type {?} */ (polygonDrawerService))],
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
    /**
     * @return {?}
     */
    init() {
        this.initValidParams();
        merge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((/**
         * @param {?} notification
         * @return {?}
         */
        (notification) => {
            this._computationCache.clear();
            /** @type {?} */
            let contextEntity = notification.entity;
            if (this.store) {
                contextEntity = this.updateStore(notification);
            }
            this.context[this.entityName] = contextEntity;
            this.layerService.getDescriptions().forEach((/**
             * @param {?} descriptionComponent
             * @return {?}
             */
            (descriptionComponent) => {
                switch (notification.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(this.context, notification.id, contextEntity);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(notification.id);
                        break;
                    default:
                        console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
                }
            }));
        }));
    }
    /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    updateStore(notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                /** @type {?} */
                const entity = this.entitiesStore.get(notification.id);
                Object.assign(entity, notification.entity);
                return entity;
            }
            else {
                this.entitiesStore.set(notification.id, notification.entity);
                return notification.entity;
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    initValidParams() {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${this.acFor}`);
        }
        /** @type {?} */
        const acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    }
    /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    isObservable(obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.init();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((/**
         * @param {?} drawer
         * @param {?} drawerName
         * @return {?}
         */
        (drawer, drawerName) => {
            /** @type {?} */
            const initOptions = this.options ? this.options[drawerName] : undefined;
            /** @type {?} */
            const drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                this.layerDrawerDataSources.push(...drawerDataSources);
            }
            drawer.setShow(this.show);
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.show && !changes.show.firstChange) {
            /** @type {?} */
            const showValue = changes['show'].currentValue;
            this.layerService.show = showValue;
            this._drawerList.forEach((/**
             * @param {?} drawer
             * @return {?}
             */
            (drawer) => drawer.setShow(showValue)));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            /** @type {?} */
            const zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    }
    /**
     * @return {?}
     */
    getLayerService() {
        return this.layerService;
    }
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    getLayerDrawerDataSources() {
        return this.layerDrawerDataSources;
    }
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name) {
        return this.layerDrawerDataSources.filter((/**
         * @param {?} d
         * @return {?}
         */
        d => d.name === name));
    }
    /**
     * Returns the store.
     * @return {?}
     */
    getStore() {
        return this.entitiesStore;
    }
    /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    removeAll() {
        this.layerService.getDescriptions().forEach((/**
         * @param {?} description
         * @return {?}
         */
        (description) => description.removeAll()));
        this.entitiesStore.clear();
    }
    /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    remove(entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    }
    /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    updateNotification(notification) {
        this._updateStream.next(notification);
    }
    /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    update(entity, id) {
        this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
    }
    /**
     * @param {?} collection
     * @return {?}
     */
    refreshAll(collection) {
        // TODO make entity interface: collection of type entity not notification
        from(collection).subscribe((/**
         * @param {?} entity
         * @return {?}
         */
        (entity) => this._updateStream.next(entity)));
    }
}
AcLayerComponent.decorators = [
    { type: Component, args: [{
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
            }] }
];
/** @nocollapse */
AcLayerComponent.ctorParameters = () => [
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
];
AcLayerComponent.propDecorators = {
    show: [{ type: Input }],
    acFor: [{ type: Input }],
    context: [{ type: Input }],
    store: [{ type: Input }],
    options: [{ type: Input }],
    zIndex: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Extend this class to create drawing on map components.
 */
class EntityOnMapComponent {
    /**
     * @param {?} _drawer
     * @param {?} mapLayers
     */
    constructor(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.selfPrimitiveIsDraw = false;
        /** @type {?} */
        const dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    }
    /**
     * @return {?}
     */
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    }
    /**
     * @return {?}
     */
    removeFromMap() {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    }
    /**
     * @return {?}
     */
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    }
}
EntityOnMapComponent.propDecorators = {
    props: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcBillboardComponent extends EntityOnMapComponent {
    /**
     * @param {?} billboardDrawer
     * @param {?} mapLayers
     */
    constructor(billboardDrawer, mapLayers) {
        super(billboardDrawer, mapLayers);
    }
}
AcBillboardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-billboard',
                template: ''
            }] }
];
/** @nocollapse */
AcBillboardComponent.ctorParameters = () => [
    { type: BillboardDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
class BasicDesc {
    /**
     * @param {?} _drawer
     * @param {?} _layerService
     * @param {?} _computationCache
     * @param {?} _cesiumProperties
     */
    constructor(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    _propsEvaluator(context) {
        return this._propsEvaluateFn(this._computationCache, context);
    }
    /**
     * @protected
     * @return {?}
     */
    _getPropsAssigner() {
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        (cesiumObject, desc) => this._propsAssignerFn(cesiumObject, desc));
    }
    /**
     * @return {?}
     */
    getLayerService() {
        return this._layerService;
    }
    /**
     * @param {?} layerService
     * @return {?}
     */
    setLayerService(layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    /**
     * @return {?}
     */
    getCesiumObjectsMap() {
        return this._cesiumObjectsMap;
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    draw(context, id, entity) {
        /** @type {?} */
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const cesiumObject = this._drawer.add(cesiumProps);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._cesiumObjectsMap.set(id, cesiumObject);
        }
        else {
            /** @type {?} */
            const cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    }
}
BasicDesc.propDecorators = {
    props: [{ type: Input }],
    onDraw: [{ type: Output }],
    onRemove: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JsonMapper {
    constructor() {
        this._mapper = new JsonStringMapper();
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    map(expression) {
        return this._mapper.map(expression);
    }
}
JsonMapper.decorators = [
    { type: Injectable }
];
/** @nocollapse */
JsonMapper.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Service for effective assignment.
 */
class SmartAssigner {
    /**
     * @param {?=} props
     * @param {?=} allowUndefined
     * @return {?}
     */
    static create(props = [], allowUndefined = true) {
        /** @type {?} */
        let fnBody = ``;
        props.forEach((/**
         * @param {?} prop
         * @return {?}
         */
        prop => {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += `if (!(obj1['${prop}'] instanceof Cesium.CallbackProperty) && obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
            }
            else {
                fnBody += `if(!(obj1['${prop}'] instanceof Cesium.CallbackProperty))obj1['${prop}'] = obj2['${prop}']; `;
            }
        }));
        fnBody += `return obj1`;
        /** @type {?} */
        const assignFn = new Function('obj1', 'obj2', fnBody);
        return (/**
         * @param {?} obj1
         * @param {?} obj2
         * @return {?}
         */
        function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumProperties {
    /**
     * @param {?} _parser
     * @param {?} _jsonMapper
     */
    constructor(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @return {?}
     */
    _compile(expression, withCache = true) {
        /** @type {?} */
        const cesiumDesc = {};
        /** @type {?} */
        const propsMap = new Map();
        /** @type {?} */
        const resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((/**
         * @param {?} resultExpression
         * @param {?} prop
         * @return {?}
         */
        (resultExpression, prop) => propsMap.set(prop, {
            expression: resultExpression,
            get: this._parser.eval(resultExpression)
        })));
        propsMap.forEach((/**
         * @param {?} value
         * @param {?} prop
         * @return {?}
         */
        (value, prop) => {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
            }
            else {
                cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
            }
        }));
        /** @type {?} */
        const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
        /** @type {?} */
        const getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return (/**
         * @param {?} cache
         * @param {?} context
         * @return {?}
         */
        function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        });
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    _build(expression) {
        /** @type {?} */
        const props = Array.from(this._jsonMapper.map(expression).keys());
        /** @type {?} */
        const smartAssigner = SmartAssigner.create(props);
        return (/**
         * @param {?} oldVal
         * @param {?} newVal
         * @return {?}
         */
        function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        });
    }
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    createEvaluator(expression, withCache = true, newEvaluator = false) {
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        /** @type {?} */
        const evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    createAssigner(expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        /** @type {?} */
        const assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    }
}
CesiumProperties.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CesiumProperties.ctorParameters = () => [
    { type: Parse },
    { type: JsonMapper }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcBillboardDescComponent extends BasicDesc {
    /**
     * @param {?} billboardDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(billboardDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-billboard-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcBillboardDescComponent)) }]
            }] }
];
/** @nocollapse */
AcBillboardDescComponent.ctorParameters = () => [
    { type: BillboardDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcEllipseDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipse-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcEllipseDescComponent)) }]
            }] }
];
/** @nocollapse */
AcEllipseDescComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolylineDescComponent extends BasicDesc {
    /**
     * @param {?} dynamicPolylineDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylineDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcPolylineDescComponent)) }]
            }] }
];
/** @nocollapse */
AcPolylineDescComponent.ctorParameters = () => [
    { type: PolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * \@example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
class PixelOffsetPipe {
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    transform(value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.decorators = [
    { type: Pipe, args: [{
                name: 'pixelOffset'
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RadiansToDegreesPipe {
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    transform(value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    }
}
RadiansToDegreesPipe.decorators = [
    { type: Pipe, args: [{
                name: 'radiansToDegrees'
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcLabelDescComponent extends BasicDesc {
    /**
     * @param {?} labelDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(labelDrawer, layerService, computationCache, cesiumProperties) {
        super(labelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcLabelDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-label-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcLabelDescComponent)) }]
            }] }
];
/** @nocollapse */
AcLabelDescComponent.ctorParameters = () => [
    { type: LabelDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UtilsModule {
}
UtilsModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                providers: []
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 * __Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
class AcCircleDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    _propsEvaluator(context) {
        /** @type {?} */
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    }
    /**
     * @protected
     * @return {?}
     */
    _getPropsAssigner() {
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        (cesiumObject, desc) => Object.assign(cesiumObject, desc));
    }
}
AcCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-circle-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcCircleDescComponent)) }]
            }] }
];
/** @nocollapse */
AcCircleDescComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcArcDescComponent extends BasicDesc {
    /**
     * @param {?} arcDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-arc-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcArcDescComponent)) }]
            }] }
];
/** @nocollapse */
AcArcDescComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcEntity {
    /**
     * Creates entity from a json
     * @param {?=} json entity object
     * @return {?} entity as AcEntity
     */
    static create(json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    }
    /**
     * Creates entity from a json
     * @param {?=} json (Optional) entity object
     */
    constructor(json) {
        Object.assign(this, json);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// WARNING: interface has both a type and a value, skipping emit
class AcNotification {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const MapLayerProviderOptions = {
    ArcGisMapServer: Cesium.ArcGisMapServerImageryProvider,
    WebMapTileService: Cesium.WebMapTileServiceImageryProvider,
    MapTileService: Cesium.createTileMapServiceImageryProvider,
    WebMapService: Cesium.WebMapServiceImageryProvider,
    SingleTileImagery: Cesium.SingleTileImageryProvider,
    OpenStreetMap: Cesium.createOpenStreetMapImageryProvider,
    BingMaps: Cesium.BingMapsImageryProvider,
    GoogleEarthEnterpriseMaps: Cesium.GoogleEarthEnterpriseMapsProvider,
    MapBox: Cesium.MapboxImageryProvider,
    UrlTemplateImagery: Cesium.UrlTemplateImageryProvider,
    OFFLINE: null,
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcMapLayerProviderComponent {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
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
    /**
     * @private
     * @return {?}
     */
    createOfflineMapProvider() {
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = this.provider(this.options);
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
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
            const showValue = changes['show'].currentValue;
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    }
}
AcMapLayerProviderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-map-layer-provider',
                template: ''
            }] }
];
/** @nocollapse */
AcMapLayerProviderComponent.ctorParameters = () => [
    { type: CesiumService }
];
AcMapLayerProviderComponent.propDecorators = {
    options: [{ type: Input }],
    provider: [{ type: Input }],
    index: [{ type: Input }],
    show: [{ type: Input }],
    alpha: [{ type: Input }],
    brightness: [{ type: Input }],
    contrast: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPointDescComponent extends BasicDesc {
    /**
     * @param {?} pointDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(pointDrawerService, layerService, computationCache, cesiumProperties) {
        super(pointDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPointDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-point-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcPointDescComponent)) }]
            }] }
];
/** @nocollapse */
AcPointDescComponent.ctorParameters = () => [
    { type: PointDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcLabelComponent extends EntityOnMapComponent {
    /**
     * @param {?} labelDrawer
     * @param {?} mapLayers
     */
    constructor(labelDrawer, mapLayers) {
        super(labelDrawer, mapLayers);
    }
}
AcLabelComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-label',
                template: ''
            }] }
];
/** @nocollapse */
AcLabelComponent.ctorParameters = () => [
    { type: LabelDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolylineComponent extends EntityOnMapComponent {
    /**
     * @param {?} polylineDrawer
     * @param {?} mapLayers
     */
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPolylineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline',
                template: ''
            }] }
];
/** @nocollapse */
AcPolylineComponent.ctorParameters = () => [
    { type: PolylineDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcEllipseComponent extends EntityOnMapComponent {
    /**
     * @param {?} ellipseDrawer
     * @param {?} mapLayers
     */
    constructor(ellipseDrawer, mapLayers) {
        super(ellipseDrawer, mapLayers);
    }
}
AcEllipseComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipse',
                template: ''
            }] }
];
/** @nocollapse */
AcEllipseComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPointComponent extends EntityOnMapComponent {
    /**
     * @param {?} pointDrawer
     * @param {?} mapLayers
     */
    constructor(pointDrawer, mapLayers) {
        super(pointDrawer, mapLayers);
    }
}
AcPointComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-point',
                template: ''
            }] }
];
/** @nocollapse */
AcPointComponent.ctorParameters = () => [
    { type: PointDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcHtmlComponent {
    /**
     * @param {?} cesiumService
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    /**
     * @param {?} screenPosition
     * @return {?}
     */
    setScreenPosition(screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${screenPosition.y}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${screenPosition.x}px`);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    }
    /**
     * @return {?}
     */
    hideElement() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `none`);
    }
    /**
     * @return {?}
     */
    add() {
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = (/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(), this.props.position);
                this.setScreenPosition(screenPosition);
            });
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.remove();
    }
}
AcHtmlComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-html',
                template: `<ng-content></ng-content>`,
                styles: [`:host {
                position: absolute;
                z-index: 100;
				}`]
            }] }
];
/** @nocollapse */
AcHtmlComponent.ctorParameters = () => [
    { type: CesiumService },
    { type: ElementRef },
    { type: Renderer2 }
];
AcHtmlComponent.propDecorators = {
    props: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcCircleComponent extends EntityOnMapComponent {
    /**
     * @param {?} ellipseDrawerService
     * @param {?} mapLayers
     */
    constructor(ellipseDrawerService, mapLayers) {
        super(ellipseDrawerService, mapLayers);
    }
    /**
     * @private
     * @return {?}
     */
    updateEllipseProps() {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    }
    /**
     * @return {?}
     */
    drawOnMap() {
        this.updateEllipseProps();
        super.drawOnMap();
    }
    /**
     * @return {?}
     */
    updateOnMap() {
        this.updateEllipseProps();
        super.updateOnMap();
    }
}
AcCircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-circle',
                template: ''
            }] }
];
/** @nocollapse */
AcCircleComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcArcComponent extends EntityOnMapComponent {
    /**
     * @param {?} arcDrawer
     * @param {?} mapLayers
     */
    constructor(arcDrawer, mapLayers) {
        super(arcDrawer, mapLayers);
    }
    /**
     * @return {?}
     */
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    }
    /**
     * @return {?}
     */
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const geometryProps = changes['geometryProps'];
        /** @type {?} */
        const instanceProps = changes['instanceProps'];
        /** @type {?} */
        const primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    }
}
AcArcComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-arc',
                template: ''
            }] }
];
/** @nocollapse */
AcArcComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: MapLayersService }
];
AcArcComponent.propDecorators = {
    geometryProps: [{ type: Input }],
    instanceProps: [{ type: Input }],
    primitiveProps: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolygonDescComponent extends BasicDesc {
    /**
     * @param {?} polygonDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcPolygonDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polygon-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcPolygonDescComponent)) }]
            }] }
];
/** @nocollapse */
AcPolygonDescComponent.ctorParameters = () => [
    { type: PolygonDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AcDefaultPlonterComponent {
    /**
     * @param {?} plonterService
     * @param {?} cd
     * @param {?} geoConverter
     */
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe((/**
         * @return {?}
         */
        () => this.cd.detectChanges()));
    }
    /**
     * @return {?}
     */
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            /** @type {?} */
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
}
AcDefaultPlonterComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-default-plonter',
                template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [CoordinateConverter],
                styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `]
            }] }
];
/** @nocollapse */
AcDefaultPlonterComponent.ctorParameters = () => [
    { type: PlonterService },
    { type: ChangeDetectorRef },
    { type: CoordinateConverter }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolygonComponent extends EntityOnMapComponent {
    /**
     * @param {?} polygonDrawer
     * @param {?} mapLayers
     */
    constructor(polygonDrawer, mapLayers) {
        super(polygonDrawer, mapLayers);
    }
}
AcPolygonComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polygon',
                template: ''
            }] }
];
/** @nocollapse */
AcPolygonComponent.ctorParameters = () => [
    { type: PolygonDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BasicStaticPrimitiveDesc extends BasicDesc {
    /**
     * @param {?} _staticPrimitiveDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
        this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    draw(context, id, entity) {
        /** @type {?} */
        const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        /** @type {?} */
        const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        /** @type {?} */
        const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            /** @type {?} */
            const primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    }
}
BasicStaticPrimitiveDesc.propDecorators = {
    geometryProps: [{ type: Input }],
    instanceProps: [{ type: Input }],
    primitiveProps: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcStaticEllipseDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-ellipse-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticEllipseDescComponent.ctorParameters = () => [
    { type: StaticEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcDynamicEllipseDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-dynamic-ellipse-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcDynamicEllipseDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcDynamicPolylineDescComponent extends BasicDesc {
    /**
     * @param {?} dynamicPolylineDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicPolylineDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-dynamic-polyline-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcDynamicPolylineDescComponent.ctorParameters = () => [
    { type: DynamicPolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcStaticPolygonDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} polygonDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolygonDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polygon-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticPolygonDescComponent.ctorParameters = () => [
    { type: StaticPolygonDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} staticCircleDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-circle',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticCircleDescComponent.ctorParameters = () => [
    { type: StaticCircleDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 * __Usage :__
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
class AcDynamicCircleDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    _propsEvaluator(context) {
        /** @type {?} */
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
}
AcDynamicCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-dynamic-circle-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcDynamicCircleDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} polylineDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polyline-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticPolylineDescComponent.ctorParameters = () => [
    { type: StaticPolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcModelDescComponent extends BasicDesc {
    /**
     * @param {?} modelDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(modelDrawer, layerService, computationCache, cesiumProperties) {
        super(modelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcModelDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-model-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcModelDescComponent)) }]
            }] }
];
/** @nocollapse */
AcModelDescComponent.ctorParameters = () => [
    { type: ModelDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcTileset3dComponent {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
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
    /**
     * @return {?}
     */
    ngOnInit() {
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
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
            const showValue = changes['show'].currentValue;
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
            /** @type {?} */
            const styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    }
}
AcTileset3dComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-3d-tile-layer',
                template: ''
            }] }
];
/** @nocollapse */
AcTileset3dComponent.ctorParameters = () => [
    { type: CesiumService }
];
AcTileset3dComponent.propDecorators = {
    options: [{ type: Input }],
    index: [{ type: Input }],
    show: [{ type: Input }],
    style: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcBoxDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcBoxDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-box-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcBoxDescComponent)) }]
            }] }
];
/** @nocollapse */
AcBoxDescComponent.ctorParameters = () => [
    { type: BoxDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcCylinderDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcCylinderDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-cylinder-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcCylinderDescComponent)) }]
            }] }
];
/** @nocollapse */
AcCylinderDescComponent.ctorParameters = () => [
    { type: CylinderDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcCorridorDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcCorridorDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-corridor-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcCorridorDescComponent)) }]
            }] }
];
/** @nocollapse */
AcCorridorDescComponent.ctorParameters = () => [
    { type: CorridorDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcEllipsoidDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcEllipsoidDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipsoid-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcEllipsoidDescComponent)) }]
            }] }
];
/** @nocollapse */
AcEllipsoidDescComponent.ctorParameters = () => [
    { type: EllipsoidDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolylineVolumeDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylineVolumeDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline-volume-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcPolylineVolumeDescComponent.ctorParameters = () => [
    { type: PolylineVolumeDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcWallDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcWallDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-wall-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcWallDescComponent)) }]
            }] }
];
/** @nocollapse */
AcWallDescComponent.ctorParameters = () => [
    { type: WallDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This is a point implementation.
 *  The ac-rectangle-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
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
class AcRectangleDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcRectangleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-rectangle-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcRectangleDescComponent)) }]
            }] }
];
/** @nocollapse */
AcRectangleDescComponent.ctorParameters = () => [
    { type: RectangleDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcBillboardPrimitiveDescComponent extends BasicDesc {
    /**
     * @param {?} billboardPrimitiveDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardPrimitiveDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-billboard-primitive-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcBillboardPrimitiveDescComponent)) }]
            }] }
];
/** @nocollapse */
AcBillboardPrimitiveDescComponent.ctorParameters = () => [
    { type: BillboardPrimitiveDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcLabelPrimitiveDescComponent extends BasicDesc {
    /**
     * @param {?} labelPrimitiveDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcLabelPrimitiveDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-label-primitive-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcLabelPrimitiveDescComponent)) }]
            }] }
];
/** @nocollapse */
AcLabelPrimitiveDescComponent.ctorParameters = () => [
    { type: LabelPrimitiveDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPolylinePrimitiveDescComponent extends BasicDesc {
    /**
     * @param {?} polylinePrimitiveDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylinePrimitiveDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline-primitive-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcPolylinePrimitiveDescComponent)) }]
            }] }
];
/** @nocollapse */
AcPolylinePrimitiveDescComponent.ctorParameters = () => [
    { type: PolylinePrimitiveDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HtmlPrimitive {
    /**
     * @param {?} options
     * @param {?=} collection
     */
    constructor(options, collection = null) {
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
    /**
     * @param {?} scene
     * @return {?}
     */
    set scene(scene) {
        this._scene = scene;
    }
    /**
     * @param {?} show
     * @return {?}
     */
    set show(show) {
        this._show = show;
        if (Cesium.defined(this.element)) {
            if (show) {
                this._element.style.display = 'block';
            }
            else {
                this._element.style.display = 'none';
            }
        }
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        this._position = position;
    }
    /**
     * @return {?}
     */
    get position() {
        return this._position;
    }
    /**
     * @param {?} pixelOffset
     * @return {?}
     */
    set pixelOffset(pixelOffset) {
        this._pixelOffset = pixelOffset;
    }
    /**
     * @return {?}
     */
    get pixelOffset() {
        return this._pixelOffset;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    set element(element) {
        this._element = element;
        if (Cesium.defined(element)) {
            this._mapContainer.appendChild(element);
            this._element.style.position = 'absolute';
            this._element.style.zIndex = Number.MAX_VALUE.toString();
        }
    }
    /**
     * @return {?}
     */
    get element() {
        return this._element;
    }
    /**
     * @param {?} collection
     * @return {?}
     */
    set collection(collection) {
        this._collection = collection;
    }
    /**
     * @return {?}
     */
    get collection() {
        return this._collection;
    }
    /**
     * @return {?}
     */
    update() {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
        /** @type {?} */
        let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._scene, this._position);
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
        this._element.style.top = `${screenPosition.y}px`;
        this._element.style.left = `${screenPosition.x}px`;
        this._lastPosition = screenPosition;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HtmlCollection {
    constructor() {
        this._collection = [];
    }
    /**
     * @return {?}
     */
    get length() {
        return this._collection.length;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    get(index) {
        return this._collection[index];
    }
    /**
     * @param {?} options
     * @return {?}
     */
    add(options) {
        /** @type {?} */
        const html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    }
    /**
     * @param {?} html
     * @return {?}
     */
    remove(html) {
        /** @type {?} */
        const index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection.splice(index, 1);
        return true;
    }
    /**
     * @return {?}
     */
    update() {
        for (let i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    }
    /**
     * @return {?}
     */
    removeAll() {
        while (this._collection.length > 0) {
            this._collection.pop();
        }
    }
    /**
     * @param {?} html
     * @return {?}
     */
    contains(html) {
        return Cesium.defined(html) && html.collection === this;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CesiumExtender {
    /**
     * @return {?}
     */
    static extend() {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AcHtmlManager {
    constructor() {
        this._entities = new Map();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    has(id) {
        return this._entities.has(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this._entities.get(id);
    }
    /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    addOrUpdate(id, info) {
        this._entities.set(id, info);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        this._entities.delete(id);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    forEach(callback) {
        this._entities.forEach(callback);
    }
}
AcHtmlManager.decorators = [
    { type: Injectable }
];
/** @nocollapse */
AcHtmlManager.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AcHtmlContext {
    /**
     * @param {?} id
     * @param {?} context
     */
    constructor(id, context) {
        this.id = id;
        this.context = context;
    }
}
class AcHtmlDirective {
    /**
     * @param {?} _templateRef
     * @param {?} _viewContainerRef
     * @param {?} _changeDetector
     * @param {?} _layerService
     * @param {?} _acHtmlManager
     */
    constructor(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @private
     * @param {?} id
     * @param {?} primitive
     * @param {?} entity
     * @return {?}
     */
    _handleView(id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            /** @type {?} */
            const context = new AcHtmlContext(id, { $implicit: entity });
            /** @type {?} */
            const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef, context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && !primitive.show) {
            this.remove(id, primitive);
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    }
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    addOrUpdate(id, primitive) {
        /** @type {?} */
        const context = this._layerService.context;
        /** @type {?} */
        const entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity, primitive });
        this._handleView(id, primitive, entity);
    }
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    remove(id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        const { viewRef } = this._views.get(id);
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    }
}
AcHtmlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[acHtml]',
            },] }
];
/** @nocollapse */
AcHtmlDirective.ctorParameters = () => [
    { type: TemplateRef },
    { type: ViewContainerRef },
    { type: ChangeDetectorRef },
    { type: LayerService },
    { type: AcHtmlManager }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-layer element.
 *  <br>
 *  [props] accepts position(Cartesian3) and show(boolean).
 *
 *  __Usage:__
 *  ```
 *  <ac-layer acFor="let html of htmls$" [context]="this">
 * <ac-html-desc props="{position: html.position, show: html.show}">
 * <ng-template let-html>
 * <div>
 * <h1>This is ac-html {{html.name}}</h1>
 * <button (click)="changeText(html, 'Test')">change text</button>
 * </div>
 * </ng-template>
 * </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
class AcHtmlDescComponent extends BasicDesc {
    /**
     * @param {?} htmlDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(htmlDrawer, layerService, computationCache, cesiumProperties) {
        super(htmlDrawer, layerService, computationCache, cesiumProperties);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        if (!this.acHtmlCreator) {
            throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
        }
        if (!this.acHtmlTemplate) {
            throw new Error(`AcHtml desc ERROR: html template not found.`);
        }
    }
    /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    draw(context, id) {
        /** @type {?} */
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            /** @type {?} */
            const primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumObjectsMap.forEach(((/**
         * @param {?} primitive
         * @param {?} id
         * @return {?}
         */
        (primitive, id) => {
            this.acHtmlCreator.remove(id, primitive);
        })));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
}
AcHtmlDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-html-desc',
                providers: [AcHtmlManager],
                template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
            }] }
];
/** @nocollapse */
AcHtmlDescComponent.ctorParameters = () => [
    { type: HtmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcHtmlDescComponent.propDecorators = {
    acHtmlCreator: [{ type: ViewChild, args: [AcHtmlDirective,] }],
    acHtmlTemplate: [{ type: ContentChild, args: [TemplateRef,] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AcHtmlContainerDirective {
    /**
     * @param {?} _element
     * @param {?} _acHtmlManager
     */
    constructor(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    set acHtmlContainer(id) {
        this._id = id;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._id === undefined) {
            throw new Error(`AcHtml container ERROR: entity id not defined`);
        }
        /** @type {?} */
        const entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    }
}
AcHtmlContainerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[acHtmlContainer]'
            },] }
];
/** @nocollapse */
AcHtmlContainerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: AcHtmlManager }
];
AcHtmlContainerDirective.propDecorators = {
    acHtmlContainer: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 *       // Open the context menu on the position that was clicked and pass some data to ContextMenuComponent.
 *       this.contextMenuService.open(
 *         ContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
class AcContextMenuWrapperComponent {
    /**
     * @param {?} contextMenuService
     * @param {?} cd
     * @param {?} componentFactoryResolver
     */
    constructor(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe((/**
             * @return {?}
             */
            () => this.cd.detectChanges()));
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory((/** @type {?} */ (this.contextMenuService.content)));
                this.viewContainerRef.clear();
                /** @type {?} */
                const componentRef = this.viewContainerRef.createComponent(componentFactory);
                ((/** @type {?} */ (componentRef.instance))).data = this.contextMenuService.options.data;
                this.cd.detectChanges();
            }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    }
}
AcContextMenuWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-context-menu-wrapper',
                template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <div #contextMenuContainer></div>
    </ac-html>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
AcContextMenuWrapperComponent.ctorParameters = () => [
    { type: ContextMenuService },
    { type: ChangeDetectorRef },
    { type: ComponentFactoryResolver }
];
AcContextMenuWrapperComponent.propDecorators = {
    viewContainerRef: [{ type: ViewChild, args: ['contextMenuContainer', { read: ViewContainerRef },] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 * <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
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
 * </ac-layer>
 *  ```
 */
class AcArrayDescComponent {
    /**
     * @param {?} layerService
     * @param {?} cd
     */
    constructor(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['acFor'].firstChange) {
            /** @type {?} */
            const acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
            }
            /** @type {?} */
            const acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.layer.getLayerService().cache = false;
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe((/**
         * @return {?}
         */
        () => {
            this.cd.detectChanges();
        }));
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        (component) => {
            component.setLayerService(this.layer.getLayerService());
        }));
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        (component) => {
            this.layerService.unregisterDescription(component);
            this.layer.getLayerService().registerDescription(component);
            component.layerService = this.layer.getLayerService();
            component.setLayerService(this.layer.getLayerService());
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    }
    /**
     * @param {?} layerService
     * @return {?}
     */
    setLayerService(layerService) {
        this.layerService = layerService;
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    draw(context, id, contextEntity) {
        /** @type {?} */
        const get = _get;
        /** @type {?} */
        const entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        /** @type {?} */
        const previousEntitiesIdArray = this.entitiesMap.get(id);
        /** @type {?} */
        const entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            this.layerService.context[this.entityName] = item;
            /** @type {?} */
            const arrayItemId = this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            this.layer.update(contextEntity, arrayItemId);
        }));
        if (previousEntitiesIdArray) {
            /** @type {?} */
            const entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                (entityId) => entitiesIdArray.indexOf(entityId) < 0)) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                (entityId) => this.layer.remove(entityId)));
            }
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((/**
             * @param {?} entityId
             * @return {?}
             */
            (entityId) => this.layer.remove(entityId)));
        }
        this.entitiesMap.delete(id);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.layer.removeAll();
        this.entitiesMap.clear();
    }
    /**
     * @return {?}
     */
    getAcForString() {
        return `let ${this.entityName + '___temp'} of arrayObservable$`;
    }
    /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    generateCombinedId(entityId, arrayItem, index) {
        /** @type {?} */
        let arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    }
}
AcArrayDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-array-desc',
                template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
AcArrayDescComponent.ctorParameters = () => [
    { type: LayerService },
    { type: ChangeDetectorRef }
];
AcArrayDescComponent.propDecorators = {
    acFor: [{ type: Input }],
    idGetter: [{ type: Input }],
    show: [{ type: Input }],
    layer: [{ type: ViewChild, args: ['layer',] }],
    basicDescs: [{ type: ContentChildren, args: [BasicDesc, { descendants: false },] }],
    arrayDescs: [{ type: ContentChildren, args: [AcArrayDescComponent, { descendants: false },] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPointPrimitiveDescComponent extends BasicDesc {
    /**
     * @param {?} pointPrimitiveDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPointPrimitiveDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-point-primitive-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcPointPrimitiveDescComponent.ctorParameters = () => [
    { type: PointPrimitiveDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcPrimitivePolylineComponent extends EntityOnMapComponent {
    /**
     * @param {?} polylineDrawer
     * @param {?} mapLayers
     */
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPrimitivePolylineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-primitive-polyline',
                template: ''
            }] }
];
/** @nocollapse */
AcPrimitivePolylineComponent.ctorParameters = () => [
    { type: PolylinePrimitiveDrawerService },
    { type: MapLayersService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// For angular parse usage
var PARSE_PIPES_CONFIG_MAP = [
    { pipeName: 'pixelOffset', pipeInstance: new PixelOffsetPipe() },
    { pipeName: 'radiansToDegrees', pipeInstance: new RadiansToDegreesPipe() },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class AcCzmlDescComponent extends BasicDesc {
    /**
     * @param {?} czmlDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcCzmlDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-czml-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcCzmlDescComponent.ctorParameters = () => [
    { type: CzmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AngularCesiumModule {
    constructor() {
        CesiumExtender.extend();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: AngularCesiumModule,
            providers: [
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    }
}
AngularCesiumModule.decorators = [
    { type: NgModule, args: [{
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
                    AcArrayDescComponent,
                    AcCzmlDescComponent,
                    AcStaticEllipseDescComponent,
                    AcDynamicEllipseDescComponent,
                    AcDynamicPolylineDescComponent,
                    AcStaticPolylineDescComponent,
                    AcDynamicCircleDescComponent,
                    AcStaticCircleDescComponent,
                    AcStaticPolygonDescComponent,
                ],
                providers: [JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService],
            },] }
];
/** @nocollapse */
AngularCesiumModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class DisposableObservable extends Observable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const CesiumEventModifier = {
    ALT: Cesium.KeyboardEventModifier.ALT,
    CTRL: Cesium.KeyboardEventModifier.CTRL,
    SHIFT: Cesium.KeyboardEventModifier.SHIFT,
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * \@Component({
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
class SelectionManagerService {
    /**
     * @param {?} mapsManager
     */
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    /**
     * @return {?}
     */
    selectedEntities$() {
        return this.selectedEntitiesItems$.asObservable();
    }
    /**
     * @return {?}
     */
    selectedEntities() {
        return this.selectedEntitiesItems$.getValue();
    }
    /**
     * @return {?}
     */
    selectedEntity$() {
        return this.selectedEntitySubject$;
    }
    /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    toggleSelection(entity, addSelectedIndicator) {
        /** @type {?} */
        const current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    }
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    addToSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        /** @type {?} */
        const current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next([...current, entity]);
    }
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    removeSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        /** @type {?} */
        const current = this.selectedEntities();
        /** @type {?} */
        const entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    }
    /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    initSelection(selectionOptions, addSelectedIndicator = true, eventPriority, mapId) {
        /** @type {?} */
        const mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        /** @type {?} */
        const eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map((/**
         * @param {?} result
         * @return {?}
         */
        result => result.entities)), filter((/**
         * @param {?} entities
         * @return {?}
         */
        entities => entities && entities.length > 0)))
            .subscribe((/**
         * @param {?} entities
         * @return {?}
         */
        entities => {
            /** @type {?} */
            const entity = entities[0];
            this.toggleSelection(entity, addSelectedIndicator);
        }));
    }
}
SelectionManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SelectionManagerService.ctorParameters = () => [
    { type: MapsManagerService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Consider moving to a different package.
if (!h337) {
    throw new Error('must install heatmap.js. please do npm -i heatmap.js ');
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
class CesiumHeatMapMaterialCreator {
    constructor() {
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
            const d = r / (Math.PI / 180.0);
            return d;
        });
    }
    /**
     *
     * @param {?} center - Cartesian3
     * @param {?} radius - Meters
     * @return {?}
     */
    static calcCircleContainingRect(center, radius) {
        return CesiumHeatMapMaterialCreator.calcEllipseContainingRect(center, radius, radius);
    }
    /**
     *
     * @param {?} center - Cartesian3
     * @param {?} semiMajorAxis - meters
     * @param {?} semiMinorAxis - meters
     * @return {?}
     */
    static calcEllipseContainingRect(center, semiMajorAxis, semiMinorAxis) {
        /** @type {?} */
        const top = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMinorAxis, 0, true);
        /** @type {?} */
        const right = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI / 2, true);
        /** @type {?} */
        const bottom = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI, true);
        /** @type {?} */
        const left = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, semiMajorAxis, Math.PI * 1.5, true);
        /** @type {?} */
        const ellipsePoints = [top, right, bottom, left];
        return Cesium.Rectangle.fromCartesianArray(ellipsePoints);
    }
    /**
     *
     * @param {?} points Cartesian3
     * @return {?}
     */
    static calculateContainingRectFromPoints(points) {
        return Cesium.Rectangle.fromCartesianArray(points);
    }
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
    setData(min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            this.heatmap.setData({
                min: min,
                max: max,
                data: data
            });
            return true;
        }
        return false;
    }
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
    setWGS84Data(min, max, data) {
        if (data && data.length > 0 && min !== null && min !== false && max !== null && max !== false) {
            /** @type {?} */
            const convdata = [];
            for (let i = 0; i < data.length; i++) {
                /** @type {?} */
                const gp = data[i];
                /** @type {?} */
                const hp = this.wgs84PointToHeatmapPoint(gp);
                if (gp.value || gp.value === 0) {
                    hp.value = gp.value;
                }
                convdata.push(hp);
            }
            return this.setData(min, max, convdata);
        }
        return false;
    }
    /**
     * Convert a mercator location to the corresponding heatmap location
     *
     *  p: a WGS84 location like {x: lon, y:lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    mercatorPointToHeatmapPoint(p) {
        /** @type {?} */
        const pn = {};
        pn.x = Math.round((p.x - this._xoffset) / this._factor + this._spacing);
        pn.y = Math.round((p.y - this._yoffset) / this._factor + this._spacing);
        pn.y = this.height - pn.y;
        return pn;
    }
    /**
     * @private
     * @param {?} height
     * @param {?} width
     * @return {?}
     */
    createContainer(height, width) {
        /** @type {?} */
        const id = 'heatmap' + CesiumHeatMapMaterialCreator.containerCanvasCounter++;
        /** @type {?} */
        const container = document.createElement('div');
        container.setAttribute('id', id);
        container.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px; margin: 0px; display: none;');
        document.body.appendChild(container);
        return { container, id };
    }
    /**
     * Convert a WGS84 location into a mercator location
     *
     *  p: the WGS84 location like {x: lon, y: lat}
     * @private
     * @param {?} p
     * @return {?}
     */
    wgs84ToMercator(p) {
        /** @type {?} */
        const mp = this.WMP.project(Cesium.Cartographic.fromDegrees(p.x, p.y));
        return {
            x: mp.x,
            y: mp.y
        };
    }
    /**
     * Convert a WGS84 bounding box into a mercator bounding box*
     *  bb: the WGS84 bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    wgs84ToMercatorBB(bb) {
        // TODO validate rad or deg
        /** @type {?} */
        const sw = this.WMP.project(Cesium.Cartographic.fromRadians(bb.west, bb.south));
        /** @type {?} */
        const ne = this.WMP.project(Cesium.Cartographic.fromRadians(bb.east, bb.north));
        return {
            north: ne.y,
            east: ne.x,
            south: sw.y,
            west: sw.x
        };
    }
    /**
     * Convert a mercator bounding box into a WGS84 bounding box
     *
     *  bb: the mercator bounding box like {north, east, south, west}
     * @private
     * @param {?} bb
     * @return {?}
     */
    mercatorToWgs84BB(bb) {
        /** @type {?} */
        const sw = this.WMP.unproject(new Cesium.Cartesian3(bb.west, bb.south));
        /** @type {?} */
        const ne = this.WMP.unproject(new Cesium.Cartesian3(bb.east, bb.north));
        return {
            north: this.rad2deg(ne.latitude),
            east: this.rad2deg(ne.longitude),
            south: this.rad2deg(sw.latitude),
            west: this.rad2deg(sw.longitude)
        };
    }
    /**
     * @private
     * @param {?} mbb
     * @return {?}
     */
    setWidthAndHeight(mbb) {
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
    }
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
    create(containingBoundingRect, heatmapDataSet, heatmapOptions) {
        /** @type {?} */
        const userBB = containingBoundingRect;
        const { heatPointsData, min = 0, max = 100 } = heatmapDataSet;
        /** @type {?} */
        const finalHeatmapOptions = Object.assign({}, this.heatmapOptionsDefaults, heatmapOptions);
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
        const { container, id } = this.createContainer(this.height, this.width);
        Object.assign(finalHeatmapOptions, { container });
        this.heatmap = create(finalHeatmapOptions);
        this.setWGS84Data(0, 100, heatPointsData);
        /** @type {?} */
        const heatMapCanvas = this.heatmap._renderer.canvas;
        /** @type {?} */
        const heatMapMaterial = new Cesium.ImageMaterialProperty({
            image: heatMapCanvas,
            transparent: true,
        });
        this.setClear(heatMapMaterial, id);
        return heatMapMaterial;
    }
    /**
     * @private
     * @param {?} heatMapMaterial
     * @param {?} id
     * @return {?}
     */
    setClear(heatMapMaterial, id) {
        heatMapMaterial.clear = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const elem = document.getElementById(id);
            return elem.parentNode.removeChild(elem);
        });
    }
}
CesiumHeatMapMaterialCreator.containerCanvasCounter = 0;
CesiumHeatMapMaterialCreator.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const EditModes = {
    CREATE: 0,
    EDIT: 1,
    CREATE_OR_EDIT: 2,
};
EditModes[EditModes.CREATE] = 'CREATE';
EditModes[EditModes.EDIT] = 'EDIT';
EditModes[EditModes.CREATE_OR_EDIT] = 'CREATE_OR_EDIT';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const EditActions = {
    INIT: 0,
    MOUSE_MOVE: 1,
    ADD_POINT: 2,
    ADD_LAST_POINT: 3,
    CHANGE_TO_EDIT: 4,
    REMOVE_POINT: 5,
    DRAG_POINT: 6,
    DRAG_POINT_FINISH: 7,
    DRAG_SHAPE: 8,
    DRAG_SHAPE_FINISH: 9,
    DONE: 10,
    DISABLE: 11,
    ENABLE: 12,
    DISPOSE: 13,
    SET_EDIT_LABELS_RENDER_CALLBACK: 14,
    UPDATE_EDIT_LABELS: 15,
    SET_MANUALLY: 16,
    TRANSFORM: 17,
};
EditActions[EditActions.INIT] = 'INIT';
EditActions[EditActions.MOUSE_MOVE] = 'MOUSE_MOVE';
EditActions[EditActions.ADD_POINT] = 'ADD_POINT';
EditActions[EditActions.ADD_LAST_POINT] = 'ADD_LAST_POINT';
EditActions[EditActions.CHANGE_TO_EDIT] = 'CHANGE_TO_EDIT';
EditActions[EditActions.REMOVE_POINT] = 'REMOVE_POINT';
EditActions[EditActions.DRAG_POINT] = 'DRAG_POINT';
EditActions[EditActions.DRAG_POINT_FINISH] = 'DRAG_POINT_FINISH';
EditActions[EditActions.DRAG_SHAPE] = 'DRAG_SHAPE';
EditActions[EditActions.DRAG_SHAPE_FINISH] = 'DRAG_SHAPE_FINISH';
EditActions[EditActions.DONE] = 'DONE';
EditActions[EditActions.DISABLE] = 'DISABLE';
EditActions[EditActions.ENABLE] = 'ENABLE';
EditActions[EditActions.DISPOSE] = 'DISPOSE';
EditActions[EditActions.SET_EDIT_LABELS_RENDER_CALLBACK] = 'SET_EDIT_LABELS_RENDER_CALLBACK';
EditActions[EditActions.UPDATE_EDIT_LABELS] = 'UPDATE_EDIT_LABELS';
EditActions[EditActions.SET_MANUALLY] = 'SET_MANUALLY';
EditActions[EditActions.TRANSFORM] = 'TRANSFORM';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditPoint extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} position
     * @param {?=} pointProps
     * @param {?=} virtualPoint
     */
    constructor(entityId, position, pointProps, virtualPoint = false) {
        super();
        this._show = true;
        this.editedEntityId = entityId;
        this.position = position;
        this.id = this.generateId();
        this.pointProps = pointProps;
        this._virtualEditPoint = virtualPoint;
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set show(value) {
        this._show = value;
    }
    /**
     * @return {?}
     */
    get props() {
        return this.pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this.pointProps = value;
    }
    /**
     * @return {?}
     */
    isVirtualEditPoint() {
        return this._virtualEditPoint;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setVirtualEditPoint(value) {
        this._virtualEditPoint = value;
    }
    /**
     * @return {?}
     */
    getEditedEntityId() {
        return this.editedEntityId;
    }
    /**
     * @return {?}
     */
    getPosition() {
        return this.position;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    generateId() {
        return 'edit-point-' + EditPoint.counter++;
    }
}
EditPoint.counter = 0;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditPolyline extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} startPosition
     * @param {?} endPosition
     * @param {?=} polylineProps
     */
    constructor(entityId, startPosition, endPosition, polylineProps) {
        super();
        this.editedEntityId = entityId;
        this.id = this.generateId();
        this.positions = [startPosition, endPosition];
        this._polylineProps = polylineProps;
    }
    /**
     * @return {?}
     */
    get props() {
        return this._polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this._polylineProps = value;
    }
    /**
     * @return {?}
     */
    getEditedEntityId() {
        return this.editedEntityId;
    }
    /**
     * @return {?}
     */
    getPositions() {
        return this.positions;
    }
    /**
     * @return {?}
     */
    validatePositions() {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    }
    /**
     * @return {?}
     */
    getStartPosition() {
        return this.positions[0];
    }
    /**
     * @return {?}
     */
    getEndPosition() {
        return this.positions[1];
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setStartPosition(position) {
        this.positions[0] = position;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setEndPosition(position) {
        this.positions[1] = position;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    generateId() {
        return 'edit-polyline-' + EditPolyline.counter++;
    }
}
EditPolyline.counter = 0;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const defaultLabelProps = {
    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.7),
    backgroundPadding: new Cesium.Cartesian2(7, 5),
    distanceDisplayCondition: undefined,
    eyeOffset: new Cesium.Cartesian3(0, 0, -999),
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
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditablePolygon extends AcEntity {
    /**
     * @param {?} id
     * @param {?} polygonsLayer
     * @param {?} pointsLayer
     * @param {?} polylinesLayer
     * @param {?} coordinateConverter
     * @param {?} polygonOptions
     * @param {?=} positions
     */
    constructor(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        super();
        this.id = id;
        this.polygonsLayer = polygonsLayer;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this.polygonProps = polygonOptions.polygonProps;
        this.defaultPointProps = polygonOptions.pointProps;
        this.defaultPolylineProps = polygonOptions.polylineProps;
        if (positions && positions.length >= 3) {
            this.createFromExisting(positions);
        }
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels) {
            return;
        }
        /** @type {?} */
        const positions = this.getRealPositions();
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get defaultPolylineProps() {
        return this._defaultPolylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set defaultPolylineProps(value) {
        this._defaultPolylineProps = value;
    }
    /**
     * @return {?}
     */
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    /**
     * @return {?}
     */
    get polygonProps() {
        return this._polygonProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set polygonProps(value) {
        this._polygonProps = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            point.show = value;
            this.updatePointsLayer(false, point);
        }));
    }
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    createFromExisting(positions) {
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        (position) => {
            this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    }
    /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    setPointsManually(points, polygonProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.remove(p.getId())));
        /** @type {?} */
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            /** @type {?} */
            const pointOrCartesian = points[i];
            /** @type {?} */
            let newPoint = null;
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
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
    }
    /**
     * @private
     * @return {?}
     */
    addAllVirtualEditPoints() {
        /** @type {?} */
        const currentPoints = [...this.positions];
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        (pos, index) => {
            /** @type {?} */
            const currentPoint = pos;
            /** @type {?} */
            const nextIndex = (index + 1) % (currentPoints.length);
            /** @type {?} */
            const nextPoint = currentPoints[nextIndex];
            /** @type {?} */
            const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
            this.updatePointsLayer(false, midPoint);
        }));
    }
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    setMiddleVirtualPoint(firstP, secondP) {
        /** @type {?} */
        const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        const midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        const firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    }
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    updateMiddleVirtualPoint(virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        const prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        const nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    }
    /**
     * @param {?} point
     * @return {?}
     */
    changeVirtualPointToRealPoint(point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        // virtual point becomes a real point
        /** @type {?} */
        const pointsCount = this.positions.length;
        /** @type {?} */
        const pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        const nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        const nextPoint = this.positions[nextIndex];
        /** @type {?} */
        const prePoint = this.positions[preIndex];
        /** @type {?} */
        const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    }
    /**
     * @private
     * @return {?}
     */
    renderPolylines() {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        polyline => this.polylinesLayer.remove(polyline.getId())));
        this.polylines = [];
        /** @type {?} */
        const realPoints = this.positions.filter((/**
         * @param {?} pos
         * @return {?}
         */
        pos => !pos.isVirtualEditPoint()));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        (point, index) => {
            /** @type {?} */
            const nextIndex = (index + 1) % (realPoints.length);
            /** @type {?} */
            const nextPoint = realPoints[nextIndex];
            /** @type {?} */
            const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.defaultPolylineProps);
            this.polylines.push(polyline);
            this.polylinesLayer.update(polyline, polyline.getId());
        }));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        this.updatePolygonsLayer();
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            const pointsCount = this.positions.length;
            /** @type {?} */
            const pointIndex = this.positions.indexOf(editPoint);
            /** @type {?} */
            const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            /** @type {?} */
            const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            /** @type {?} */
            const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            /** @type {?} */
            const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            this.updatePointsLayer(false, nextVirtualPoint);
            this.updatePointsLayer(false, prevVirtualPoint);
        }
        this.updatePointsLayer(true, editPoint);
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    movePolygon(startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => this.updatePointsLayer(true, point)));
    }
    /**
     * @return {?}
     */
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
    }
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint()))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    }
    /**
     * @return {?}
     */
    getRealPositions() {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getRealPoints() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint() && position !== this.movingPoint));
    }
    /**
     * @return {?}
     */
    getPositionsHierarchy() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint())).map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getPositionsHierarchyCallbackProperty() {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    }
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    removePosition(point) {
        /** @type {?} */
        const index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        (p) => p === point));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    /**
     * @private
     * @return {?}
     */
    updatePolygonsLayer() {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    updatePointsLayer(renderPolylines = true, ...points) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @return {?}
     */
    dispose() {
        this.polygonsLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        line => this.polylinesLayer.remove(line.getId())));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    /**
     * @return {?}
     */
    getPointsCount() {
        return this.positions.length;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolygonsManagerService {
    constructor() {
        this.polygons = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editPolygonsLayer
     * @param {?} editPointsLayer
     * @param {?} editPolylinesLayer
     * @param {?} coordinateConverter
     * @param {?=} polygonOptions
     * @param {?=} positions
     * @return {?}
     */
    createEditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        /** @type {?} */
        const editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.polygons.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.polygons.forEach((/**
         * @param {?} polygon
         * @return {?}
         */
        polygon => polygon.dispose()));
        this.polygons.clear();
    }
}
PolygonsManagerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?=} length
 * @return {?}
 */
function generateKey(length = 12) {
    /** @type {?} */
    let id = '';
    /** @type {?} */
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_POLYGON_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
    polygonProps: {
        material: new Cesium.Color(0.1, 0.5, 0.2, 0.4),
    },
    polylineProps: {
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
        width: 1,
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
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
class PolygonsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polygonsManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, polygonsManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    create(options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polygonOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const allPositions = this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            (cartesian) => cartesian.equals(position)))) {
                return;
            }
            /** @type {?} */
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    }
    /**
     * @private
     * @param {?} id
     * @param {?} position
     * @param {?} clientEditSubject
     * @param {?} positions
     * @param {?} priority
     * @param {?} polygonOptions
     * @param {?} editorObservable
     * @param {?} finishedCreate
     * @return {?}
     */
    switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        const updateValue = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach((/**
             * @param {?} registration
             * @return {?}
             */
            registration => registration.dispose()));
        }
        this.observablesMap.delete(id);
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polygonOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editPolygon(id, positions, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        /** @type {?} */
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, drop }, entities }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop }, entities }) => {
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
            }));
        }
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ entities }) => {
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 4) {
                return;
            }
            /** @type {?} */
            const index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            position => point.getPosition().equals((/** @type {?} */ (position)))));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        /** @type {?} */
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        /** @type {?} */
        const polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps, options.pointProps);
        polygonOptions.polygonProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps, options.polygonProps);
        polygonOptions.polylineProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps, options.polylineProps);
        return polygonOptions;
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polygonProps
         * @return {?}
         */
        (points, polygonProps) => {
            /** @type {?} */
            const polygon = this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        () => this.getPoints(id));
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.polygonsManager.get(id).labels);
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    }
}
PolygonsEditorService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolygonsEditorComponent {
    /**
     * @param {?} polygonsEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} polygonsManager
     */
    constructor(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager) {
        this.polygonsEditor = polygonsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.editPolygons$ = new Subject();
        this.appearance = new Cesium.PerInstanceColorAppearance({ flat: true });
        this.attributes = { color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.2, 0.2, 0.5, 0.5)) };
        this.polygonColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);
        this.lineColor = new Cesium.Color(0, 0, 0, 0.6);
        this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polygonsManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.polygonsEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        (update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} polygon
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(polygon, update, labels) {
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
    }
    /**
     * @param {?} polygon
     * @return {?}
     */
    removeEditLabels(polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                polygon.dispose();
                this.removeEditLabels(polygon);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const polygon = this.polygonsManager.get(update.id);
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.polygonsManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolygonsEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'polygons-editor',
                template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-primitive-desc
        props="{
        positions: polyline.getPositions(),
        width: polyline.props.width,
        material: polyline.props.material()
    }"
      >
      </ac-polyline-primitive-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
        hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
        material: polygon.polygonProps.material
    }"
      >
      </ac-polygon-desc>
      <!-- <ac-static-polygon-desc -->
      <!-- geometryProps="{ -->
      <!-- polygonHierarchy: polygon.getHierarchy(), -->
      <!-- height: 1 -->
      <!-- }" -->
      <!-- instanceProps="{ -->
      <!-- attributes: attributes -->
      <!-- }" -->
      <!-- primitiveProps="{ -->
      <!-- appearance: appearance -->
      <!-- }"> -->
      <!-- </ac-static-polygon-desc -->
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, PolygonsManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PolygonsEditorComponent.ctorParameters = () => [
    { type: PolygonsEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: PolygonsManagerService }
];
PolygonsEditorComponent.propDecorators = {
    editPolygonsLayer: [{ type: ViewChild, args: ['editPolygonsLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
    editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditArc extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} center
     * @param {?} radius
     * @param {?} delta
     * @param {?} angle
     * @param {?} _arcProps
     */
    constructor(entityId, center, radius, delta, angle, _arcProps) {
        super();
        this._arcProps = _arcProps;
        this.id = this.generateId();
        this.editedEntityId = entityId;
        this._center = center;
        this._radius = radius;
        this._delta = delta;
        this._angle = angle;
    }
    /**
     * @return {?}
     */
    get props() {
        return this._arcProps;
    }
    /**
     * @param {?} props
     * @return {?}
     */
    set props(props) {
        this._arcProps = props;
    }
    /**
     * @return {?}
     */
    get angle() {
        return this._angle;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set angle(value) {
        this._angle = value;
    }
    /**
     * @return {?}
     */
    get delta() {
        return this._delta;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set delta(value) {
        this._delta = value;
    }
    /**
     * @return {?}
     */
    get radius() {
        return this._radius;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set radius(value) {
        this._radius = value;
    }
    /**
     * @return {?}
     */
    get center() {
        return this._center;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set center(value) {
        this._center = value;
    }
    /**
     * @param {?} center
     * @return {?}
     */
    updateCenter(center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    generateId() {
        return 'edit-arc-' + EditArc.counter++;
    }
}
EditArc.counter = 0;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditableCircle extends AcEntity {
    /**
     * @param {?} id
     * @param {?} circlesLayer
     * @param {?} pointsLayer
     * @param {?} arcsLayer
     * @param {?} options
     */
    constructor(id, circlesLayer, pointsLayer, arcsLayer, options) {
        super();
        this.id = id;
        this.circlesLayer = circlesLayer;
        this.pointsLayer = pointsLayer;
        this.arcsLayer = arcsLayer;
        this.options = options;
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._circleProps = options.circleProps;
        this._pointProps = options.pointProps;
        this._polylineProps = options.polylineProps;
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels || !this._center || !this._radiusPoint) {
            return;
        }
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                if (index !== labels.length - 1) {
                    label.position = this._center.getPosition();
                }
                else {
                    label.position = this._radiusPoint.getPosition();
                }
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get polylineProps() {
        return this._polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set polylineProps(value) {
        this._polylineProps = value;
    }
    /**
     * @return {?}
     */
    get pointProps() {
        return this._pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set pointProps(value) {
        this._pointProps = value;
    }
    /**
     * @return {?}
     */
    get circleProps() {
        return this._circleProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set circleProps(value) {
        this._circleProps = value;
    }
    /**
     * @return {?}
     */
    get center() {
        return this._center;
    }
    /**
     * @return {?}
     */
    get radiusPoint() {
        return this._radiusPoint;
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this._center.show = value;
        this._radiusPoint.show = value;
        this.updatePointsLayer();
    }
    /**
     * @param {?} center
     * @param {?} radiusPoint
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} circleProp
     * @return {?}
     */
    setManually(center, radiusPoint, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, circleProp = this.circleProps) {
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
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
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
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    movePoint(toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    moveCircle(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        const radius = this.getRadius();
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    /**
     * @return {?}
     */
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
    }
    /**
     * @return {?}
     */
    getRadius() {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    }
    /**
     * @return {?}
     */
    getRadiusCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRadius.bind(this), false);
    }
    /**
     * @return {?}
     */
    getCenter() {
        return this._center ? this._center.getPosition() : undefined;
    }
    /**
     * @return {?}
     */
    getCenterCallbackProperty() {
        return new Cesium.CallbackProperty(this.getCenter.bind(this), false);
    }
    /**
     * @return {?}
     */
    getRadiusPoint() {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    }
    /**
     * @return {?}
     */
    dispose() {
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
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    updateCirclesLayer() {
        this.circlesLayer.update(this, this.id);
    }
    /**
     * @private
     * @return {?}
     */
    updatePointsLayer() {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    }
    /**
     * @private
     * @return {?}
     */
    updateArcsLayer() {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    }
    /**
     * @private
     * @return {?}
     */
    createOutlineArc() {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CirclesManagerService {
    constructor() {
        this.circles = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editCirclesLayer
     * @param {?} editPointsLayer
     * @param {?} editArcsLayer
     * @param {?} circleOptions
     * @return {?}
     */
    createEditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        /** @type {?} */
        const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.circles.get(id).dispose();
        this.circles.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.circles.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.circles.forEach((/**
         * @param {?} circle
         * @return {?}
         */
        circle => circle.dispose()));
        this.circles.clear();
    }
}
CirclesManagerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: false,
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK,
    },
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
    polylineProps: {
        width: 1,
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
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
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
class CirclesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} circlesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        /** @type {?} */
        let center;
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const circleOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                /** @type {?} */
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                center = position;
            }
            else {
                /** @type {?} */
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                /** @type {?} */
                const changeMode = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    registration => registration.dispose()));
                }
                this.observablesMap.delete(id);
                this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
            }
        }));
        return editorObservable;
    }
    /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(center, radius, options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const circleOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        /** @type {?} */
        const update = {
            id,
            center,
            radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editCircle(id, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        pointDragRegistration
            .pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, startPosition, drop }, entities }) => {
            /** @type {?} */
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const pointIsCenter = point === this.getCenterPoint(id);
            /** @type {?} */
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            /** @type {?} */
            const update = {
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop } }) => {
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    center: this.getCenterPosition(id),
                    radiusPoint: this.getRadiusPosition(id),
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, this.getCircleProperties(id)));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} center
         * @param {?} radius
         * @param {?=} centerPointProp
         * @param {?=} radiusPointProp
         * @param {?=} circleProp
         * @return {?}
         */
        (center, radius, centerPointProp, radiusPointProp, circleProp) => {
            /** @type {?} */
            const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            /** @type {?} */
            const circle = this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.circlesManager.get(id).labels);
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        () => this.getCenterPosition(id));
        observableToExtend.getRadius = (/**
         * @return {?}
         */
        () => this.getRadius(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        /** @type {?} */
        const circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPosition(id) {
        return this.circlesManager.get(id).getCenter();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPoint(id) {
        return this.circlesManager.get(id).center;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getRadiusPosition(id) {
        return this.circlesManager.get(id).getRadiusPoint();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getRadius(id) {
        return this.circlesManager.get(id).getRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCircleProperties(id) {
        /** @type {?} */
        const circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    }
}
CirclesEditorService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CirclesEditorComponent {
    /**
     * @param {?} circlesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} circlesManager
     */
    constructor(circlesEditor, coordinateConverter, mapEventsManager, cameraService, circlesManager) {
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
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.circlesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(circle, update, labels) {
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
    }
    /**
     * @param {?} circle
     * @return {?}
     */
    removeEditLabels(circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.removeEditLabels(circle);
                this.circlesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                const circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const circle = this.circlesManager.get(update.id);
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.circlesManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
CirclesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'circles-editor',
                template: /*html*/ `
    <ac-layer #editArcsLayer acFor="let arc of editArcs$" [context]="this">
      <ac-arc-desc
        props="{
        angle: arc.angle,
        delta: arc.delta,
        center: arc.center,
        radius: arc.radius,
        quality: 30,
        color: arc.props.material()
    }"
      >
      </ac-arc-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editCirclesLayer acFor="let circle of editCircles$" [context]="this" [zIndex]="0">
      <ac-ellipse-desc
        props="{
        position: circle.getCenterCallbackProperty(),
        semiMajorAxis: circle.getRadiusCallbackProperty(),
        semiMinorAxis: circle.getRadiusCallbackProperty(),
        material: circle.circleProps.material,
        outline: circle.circleProps.outline,
        height: 0
    }"
      >
      </ac-ellipse-desc>

      <ac-array-desc acFor="let label of circle.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, CirclesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
CirclesEditorComponent.ctorParameters = () => [
    { type: CirclesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: CirclesManagerService }
];
CirclesEditorComponent.propDecorators = {
    editCirclesLayer: [{ type: ViewChild, args: ['editCirclesLayer',] }],
    editArcsLayer: [{ type: ViewChild, args: ['editArcsLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditableEllipse extends AcEntity {
    /**
     * @param {?} id
     * @param {?} ellipsesLayer
     * @param {?} pointsLayer
     * @param {?} coordinateConverter
     * @param {?} options
     */
    constructor(id, ellipsesLayer, pointsLayer, coordinateConverter, options) {
        super();
        this.id = id;
        this.ellipsesLayer = ellipsesLayer;
        this.pointsLayer = pointsLayer;
        this.coordinateConverter = coordinateConverter;
        this.options = options;
        this._rotation = 0;
        this.doneCreation = false;
        this._enableEdit = true;
        this._minorRadiusPoints = [];
        this._labels = [];
        this._ellipseProps = options.ellipseProps;
        this._pointProps = options.pointProps;
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels || !this._center) {
            return;
        }
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                if (index === 0) {
                    label.position = this._center.getPosition();
                }
                else if (index === 1) {
                    label.position = this._majorRadiusPoint
                        ? Cesium.Cartesian3.midpoint(this.getCenter(), this._majorRadiusPoint.getPosition(), new Cesium.Cartesian3())
                        : new Cesium.Cartesian3();
                }
                else if (index === 2) {
                    label.position =
                        this._minorRadiusPoints.length > 0 && this._minorRadius
                            ? Cesium.Cartesian3.midpoint(this.getCenter(), this.getMinorRadiusPointPosition(), new Cesium.Cartesian3())
                            : new Cesium.Cartesian3();
                }
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get polylineProps() {
        return this._polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set polylineProps(value) {
        this._polylineProps = value;
    }
    /**
     * @return {?}
     */
    get pointProps() {
        return this._pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set pointProps(value) {
        this._pointProps = value;
    }
    /**
     * @return {?}
     */
    get ellipseProps() {
        return this._ellipseProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set ellipseProps(value) {
        this._ellipseProps = value;
    }
    /**
     * @return {?}
     */
    get center() {
        return this._center;
    }
    /**
     * @return {?}
     */
    get majorRadiusPoint() {
        return this._majorRadiusPoint;
    }
    /**
     * @return {?}
     */
    getMajorRadiusPointPosition() {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    }
    /**
     * @return {?}
     */
    getMinorRadiusPointPosition() {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this._center.show = value;
        this._majorRadiusPoint.show = value;
        this.updatePointsLayer();
    }
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} ellipseProp
     * @return {?}
     */
    setManually(center, majorRadius, rotation = Math.PI / 2, minorRadius, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, ellipseProp = this.ellipseProps) {
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
        /** @type {?} */
        const majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);
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
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
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
    }
    /**
     * @return {?}
     */
    transformToEllipse() {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
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
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
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
    }
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    moveEllipse(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        const majorRadius = this.getMajorRadius();
        /** @type {?} */
        const rotation = this.getRotation();
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    /**
     * @return {?}
     */
    endMoveEllipse() {
        this.lastDraggedToPosition = undefined;
    }
    /**
     * @private
     * @return {?}
     */
    updateMinorRadiusEditPoints() {
        if (this._minorRadius === undefined) {
            return;
        }
        if (this._minorRadiusPoints.length === 0) {
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
        }
        this._minorRadiusPoints[0].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2));
        this._minorRadiusPoints[1].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2));
    }
    /**
     * @return {?}
     */
    getMajorRadius() {
        return this._majorRadius || 0;
    }
    /**
     * @return {?}
     */
    getMinorRadius() {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    }
    /**
     * @return {?}
     */
    getRotation() {
        return this._rotation || 0;
    }
    /**
     * @return {?}
     */
    updateRotation() {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        /** @type {?} */
        const azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    }
    /**
     * @return {?}
     */
    getRotationCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => Math.PI / 2 - this.getRotation()), false);
    }
    /**
     * @return {?}
     */
    getMinorRadiusCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getMinorRadius()), false);
    }
    /**
     * @return {?}
     */
    getMajorRadiusCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getMajorRadius()), false);
    }
    /**
     * @return {?}
     */
    getCenter() {
        return this._center ? this._center.getPosition() : undefined;
    }
    /**
     * @return {?}
     */
    getCenterCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getCenter()), false);
    }
    /**
     * @return {?}
     */
    dispose() {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.remove(this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints) {
            this._minorRadiusPoints.forEach((/**
             * @param {?} point
             * @return {?}
             */
            point => this.pointsLayer.remove(point.getId())));
        }
        this.ellipsesLayer.remove(this.id);
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    updateEllipsesLayer() {
        this.ellipsesLayer.update(this, this.id);
    }
    /**
     * @private
     * @return {?}
     */
    updatePointsLayer() {
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
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EllipsesManagerService {
    constructor() {
        this.ellipses = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editEllipsesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?} ellipseOptions
     * @return {?}
     */
    createEditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        /** @type {?} */
        const editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    dispose(id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.ellipses.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.ellipses.forEach((/**
         * @param {?} ellipse
         * @return {?}
         */
        ellipse => ellipse.dispose()));
        this.ellipses.clear();
    }
}
EllipsesManagerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: true,
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK,
    },
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
    polylineProps: {
        width: 1,
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
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
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
class EllipsesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} ellipsesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, ellipsesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        /** @type {?} */
        let center;
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const ellipseOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                /** @type {?} */
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
                center = position;
            }
            else {
                /** @type {?} */
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
                /** @type {?} */
                const changeMode = {
                    id,
                    center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(Object.assign({}, update));
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    registration => registration.dispose()));
                }
                this.observablesMap.delete(id);
                this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
            }
        }));
        return editorObservable;
    }
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(center, majorRadius, rotation = Math.PI / 2, minorRadius, options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const ellipseOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        const update = {
            id,
            center,
            majorRadius,
            rotation,
            minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editEllipse(id, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        let addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        pointDragRegistration
            .pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, startPosition, drop }, entities }) => {
            /** @type {?} */
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const pointIsCenter = point === this.getCenterPoint(id);
            /** @type {?} */
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            /** @type {?} */
            const update = Object.assign({ id, updatedPoint: point, startDragPosition,
                endDragPosition, editMode: EditModes.EDIT, editAction }, this.getEllipseProperties(id));
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update));
        }));
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { endPosition, startPosition, drop }, entities }) => {
                /** @type {?} */
                const update = Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            }));
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop } }) => {
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = Object.assign({ id,
                    startDragPosition,
                    endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration, addSecondRadiusRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.CREATE_OR_EDIT, editAction: EditActions.DISPOSE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next((/** @type {?} */ (Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, this.getEllipseProperties(id)))));
        });
        observableToExtend.setManually = (/**
         * @param {?} center
         * @param {?} majorRadius
         * @param {?=} rotation
         * @param {?=} minorRadius
         * @param {?=} centerPointProp
         * @param {?=} radiusPointProp
         * @param {?=} ellipseProp
         * @return {?}
         */
        (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) => {
            /** @type {?} */
            const ellipse = this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next((/** @type {?} */ ({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            })));
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next((/** @type {?} */ ({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            })));
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.ellipsesManager.get(id).labels);
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        () => this.getCenterPosition(id));
        observableToExtend.getMajorRadius = (/**
         * @return {?}
         */
        () => this.getMajorRadius(id));
        observableToExtend.getMinorRadius = (/**
         * @return {?}
         */
        () => this.getMinorRadius(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        /** @type {?} */
        const ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPosition(id) {
        return this.ellipsesManager.get(id).getCenter();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getCenterPoint(id) {
        return this.ellipsesManager.get(id).center;
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getMajorRadius(id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getMinorRadius(id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getEllipseProperties(id) {
        /** @type {?} */
        const ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    }
}
EllipsesEditorService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EllipsesEditorComponent {
    /**
     * @param {?} ellipsesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} ellipsesManager
     */
    constructor(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager) {
        this.ellipsesEditor = ellipsesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editEllipses$ = new Subject();
        this.ellipsesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.ellipsesManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.ellipsesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} ellipse
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(ellipse, update, labels) {
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
    }
    /**
     * @param {?} ellipse
     * @return {?}
     */
    removeEditLabels(ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                this.removeEditLabels(ellipse);
                this.ellipsesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const ellipse = this.ellipsesManager.get(update.id);
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.ellipsesManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
EllipsesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ellipses-editor',
                template: /*html*/ `
    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
      <ac-ellipse-desc
        props="{
        position: ellipse.getCenterCallbackProperty(),
        semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
        semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
        rotation: ellipse.getRotationCallbackProperty(),
        material: ellipse.ellipseProps.material,
        outline: ellipse.ellipseProps.outline,
        outlineWidth: ellipse.ellipseProps.outlineWidth,
        outlineColor: ellipse.ellipseProps.outlineColor,
        height: 0
    }"
      >
      </ac-ellipse-desc>

      <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            text: label.text,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, EllipsesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
EllipsesEditorComponent.ctorParameters = () => [
    { type: EllipsesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: EllipsesManagerService }
];
EllipsesEditorComponent.propDecorators = {
    editEllipsesLayer: [{ type: ViewChild, args: ['editEllipsesLayer',] }],
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditablePolyline extends AcEntity {
    /**
     * @param {?} id
     * @param {?} pointsLayer
     * @param {?} polylinesLayer
     * @param {?} coordinateConverter
     * @param {?} editOptions
     * @param {?=} positions
     */
    constructor(id, pointsLayer, polylinesLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.editOptions = editOptions;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._pointProps = editOptions.pointProps;
        this.props = editOptions.polylineProps;
        if (positions && positions.length >= 2) {
            this.createFromExisting(positions);
        }
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels) {
            return;
        }
        /** @type {?} */
        const positions = this.getRealPositions();
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get props() {
        return this.polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this.polylineProps = value;
    }
    /**
     * @return {?}
     */
    get pointProps() {
        return this._pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set pointProps(value) {
        this._pointProps = value;
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            point.show = value;
            this.updatePointsLayer(false, point);
        }));
    }
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    createFromExisting(positions) {
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        (position) => {
            this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    }
    /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    setManually(points, polylineProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.remove(p.getId())));
        /** @type {?} */
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            /** @type {?} */
            const pointOrCartesian = points[i];
            /** @type {?} */
            let newPoint = null;
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
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
    }
    /**
     * @private
     * @return {?}
     */
    addAllVirtualEditPoints() {
        /** @type {?} */
        const currentPoints = [...this.positions];
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        (pos, index) => {
            if (index !== currentPoints.length - 1) {
                /** @type {?} */
                const currentPoint = pos;
                /** @type {?} */
                const nextIndex = (index + 1) % (currentPoints.length);
                /** @type {?} */
                const nextPoint = currentPoints[nextIndex];
                /** @type {?} */
                const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
                this.updatePointsLayer(false, midPoint);
            }
        }));
    }
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    setMiddleVirtualPoint(firstP, secondP) {
        /** @type {?} */
        const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        const midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        const firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    }
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    updateMiddleVirtualPoint(virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        const prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        const nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    }
    /**
     * @param {?} point
     * @return {?}
     */
    changeVirtualPointToRealPoint(point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        // actual point becomes a real point
        /** @type {?} */
        const pointsCount = this.positions.length;
        /** @type {?} */
        const pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        const nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        const nextPoint = this.positions[nextIndex];
        /** @type {?} */
        const prePoint = this.positions[preIndex];
        /** @type {?} */
        const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    }
    /**
     * @private
     * @return {?}
     */
    renderPolylines() {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        polyline => this.polylinesLayer.remove(polyline.getId())));
        this.polylines = [];
        /** @type {?} */
        const realPoints = this.positions.filter((/**
         * @param {?} point
         * @return {?}
         */
        point => !point.isVirtualEditPoint()));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        (point, index) => {
            if (index !== realPoints.length - 1) {
                /** @type {?} */
                const nextIndex = (index + 1);
                /** @type {?} */
                const nextPoint = realPoints[nextIndex];
                /** @type {?} */
                const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.polylineProps);
                this.polylines.push(polyline);
                this.polylinesLayer.update(polyline, polyline.getId());
            }
        }));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            const firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            const pointsCount = this.positions.length;
            /** @type {?} */
            const pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                /** @type {?} */
                const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                /** @type {?} */
                const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
                this.updatePointsLayer(false, nextVirtualPoint);
            }
            if (pointIndex > 0) {
                /** @type {?} */
                const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                /** @type {?} */
                const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
                this.updatePointsLayer(false, prevVirtualPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer(true, ...this.positions);
        this.lastDraggedToPosition = draggedToPosition;
    }
    /**
     * @return {?}
     */
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer(true, ...this.positions);
    }
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint()))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    }
    /**
     * @return {?}
     */
    getRealPositions() {
        return this.getRealPoints()
            .map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getRealPoints() {
        return this.positions
            .filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint() && position !== this.movingPoint));
    }
    /**
     * @return {?}
     */
    getPositions() {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    removePosition(point) {
        /** @type {?} */
        const index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        (p) => p === point));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    updatePointsLayer(renderPolylines = true, ...point) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @return {?}
     */
    update() {
        this.updatePointsLayer();
    }
    /**
     * @return {?}
     */
    dispose() {
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        line => this.polylinesLayer.remove(line.getId())));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    /**
     * @return {?}
     */
    getPointsCount() {
        return this.positions.length;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class EditorObservable extends Observable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolylineEditorObservable extends EditorObservable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolygonEditorObservable extends EditorObservable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CircleEditorObservable extends EditorObservable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EllipseEditorObservable extends EditorObservable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HippodromeEditorObservable extends EditorObservable {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EditableHippodrome extends AcEntity {
    /**
     * @param {?} id
     * @param {?} pointsLayer
     * @param {?} hippodromeLayer
     * @param {?} coordinateConverter
     * @param {?} editOptions
     * @param {?=} positions
     */
    constructor(id, pointsLayer, hippodromeLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.hippodromeLayer = hippodromeLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = editOptions.pointProps;
        this.hippodromeProps = editOptions.hippodromeProps;
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels) {
            return;
        }
        /** @type {?} */
        const positions = this.getRealPositions();
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get hippodromeProps() {
        return this._hippodromeProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hippodromeProps(value) {
        this._hippodromeProps = value;
    }
    /**
     * @return {?}
     */
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            point.show = value;
            this.updatePointsLayer(point);
        }));
    }
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    createFromExisting(positions) {
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        position => {
            this.addPointFromExisting(position);
        }));
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.remove(p.getId())));
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer(...points);
        this.updateHippdromeLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.done) {
            return;
        }
        /** @type {?} */
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    /**
     * @private
     * @return {?}
     */
    createHeightEditPoints() {
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint())).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
        /** @type {?} */
        const firstP = this.getRealPoints()[0];
        /** @type {?} */
        const secP = this.getRealPoints()[1];
        /** @type {?} */
        const midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        const bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        /** @type {?} */
        const upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        /** @type {?} */
        const downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    }
    /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    createMiddleEditablePoint(midPointCartesian3, azimuth) {
        /** @type {?} */
        const upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        /** @type {?} */
        const midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    }
    /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    changeWidthByNewPoint(toPosition) {
        /** @type {?} */
        const firstP = this.getRealPoints()[0];
        /** @type {?} */
        const secP = this.getRealPoints()[1];
        /** @type {?} */
        const midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        const bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        /** @type {?} */
        let normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        /** @type {?} */
        let bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        /** @type {?} */
        let fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        /** @type {?} */
        const distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        /** @type {?} */
        const radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
    }
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    }
    /**
     * @return {?}
     */
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => this.updatePointsLayer(point)));
        this.updateHippdromeLayer();
    }
    /**
     * @return {?}
     */
    endMovePoint() {
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint())).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    /**
     * @return {?}
     */
    getRealPositions() {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getRealPositionsCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    }
    /**
     * @return {?}
     */
    getRealPoints() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint()));
    }
    /**
     * @return {?}
     */
    getWidth() {
        return this.hippodromeProps.width;
    }
    /**
     * @return {?}
     */
    getPositions() {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    removePosition(point) {
        /** @type {?} */
        const index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        p => p === point));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    /**
     * @private
     * @param {...?} point
     * @return {?}
     */
    updatePointsLayer(...point) {
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @private
     * @return {?}
     */
    updateHippdromeLayer() {
        this.hippodromeLayer.update(this, this.id);
    }
    /**
     * @return {?}
     */
    dispose() {
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    /**
     * @return {?}
     */
    getPointsCount() {
        return this.positions.length;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
    },
    polylineProps: {
        material: (/**
         * @return {?}
         */
        () => Cesium.Color.BLACK),
        width: 3,
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
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
class PolylinesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polylinesManager
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, polylinesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polylineOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const allPositions = this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            (cartesian) => cartesian.equals(position)))) {
                return;
            }
            /** @type {?} */
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    }
    /**
     * @private
     * @param {?} id
     * @param {?} position
     * @param {?} clientEditSubject
     * @param {?} positions
     * @param {?} eventPriority
     * @param {?} polylineOptions
     * @param {?} editorObservable
     * @param {?} finishedCreate
     * @return {?}
     */
    switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        const update = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach((/**
             * @param {?} registration
             * @return {?}
             */
            registration => registration.dispose()));
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_POLYLINE_OPTIONS, priority = 100) {
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const polylineOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editPolyline(id, positions, priority, editSubject, options, editObservable) {
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.editedEntityId),
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop }, entities }) => {
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
            }));
        }
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, drop }, entities }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ entities }) => {
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 3) {
                return;
            }
            /** @type {?} */
            const index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            position => point.getPosition().equals((/** @type {?} */ (position)))));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        }));
        /** @type {?} */
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        /** @type {?} */
        const polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps, options.pointProps);
        polylineOptions.polylineProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps, options.polylineProps);
        return polylineOptions;
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polylineProps
         * @return {?}
         */
        (points, polylineProps) => {
            /** @type {?} */
            const polyline = this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        () => this.getPoints(id));
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.polylinesManager.get(id).labels);
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    }
}
PolylinesEditorService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolylinesManagerService {
    constructor() {
        this.polylines = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editPolylinesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} polylineOptions
     * @param {?=} positions
     * @return {?}
     */
    createEditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        /** @type {?} */
        const editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.polylines.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        polyline => polyline.dispose()));
        this.polylines.clear();
    }
}
PolylinesManagerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PolylinesEditorComponent {
    /**
     * @param {?} polylinesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} polylinesManager
     */
    constructor(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager) {
        this.polylinesEditor = polylinesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.Cesium = Cesium;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.polylineLabels$ = new Subject();
        this.polylinesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polylinesManager);
        this.startListeningToEditorUpdates();
    }
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.polylinesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        (update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} polyline
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(polyline, update, labels) {
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
    }
    /**
     * @param {?} polyline
     * @return {?}
     */
    removeEditLabels(polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                polyline.dispose();
                this.removeEditLabels(polyline);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const polyline = this.polylinesManager.get(update.id);
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.polylinesManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolylinesEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'polylines-editor',
                template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-primitive-desc
        props="{
        positions: polyline.getPositions(),
        width: polyline.props.width,
        material: polyline.props.material()
    }"
      >
      </ac-polyline-primitive-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #polylineLabelsLayer acFor="let polylineLabels of polylineLabels$" [context]="this">
      <ac-array-desc acFor="let label of polylineLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, PolylinesManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
PolylinesEditorComponent.ctorParameters = () => [
    { type: PolylinesEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: PolylinesManagerService }
];
PolylinesEditorComponent.propDecorators = {
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
    editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }],
    polylineLabelsLayer: [{ type: ViewChild, args: ['polylineLabelsLayer',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HippodromeManagerService {
    constructor() {
        this.hippodromes = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editHippodromeLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} hippodromeEditOptions
     * @param {?=} positions
     * @return {?}
     */
    createEditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        /** @type {?} */
        const editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.hippodromes.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.hippodromes.forEach((/**
         * @param {?} hippodrome
         * @return {?}
         */
        hippodrome => hippodrome.dispose()));
        this.hippodromes.clear();
    }
}
HippodromeManagerService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_HIPPODROME_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    hippodromeProps: {
        material: Cesium.Color.GREEN.withAlpha(0.5),
        width: 200000.0,
        outline: false,
    },
    pointProps: {
        color: Cesium.Color.WHITE.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
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
 * 				console.log(editResult.positions);
 * 		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
class HippodromeEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} managerService
     * @return {?}
     */
    init(mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    }
    /**
     * @return {?}
     */
    onUpdate() {
        return this.updatePublisher;
    }
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const hippodromeOptions = this.setOptions(options);
        /** @type {?} */
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeOptions,
        });
        /** @type {?} */
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        const addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        const editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const allPositions = this.getPositions(id);
            /** @type {?} */
            const isFirstPoint = this.getPositions(id).length === 0;
            /** @type {?} */
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            if (!isFirstPoint) {
                /** @type {?} */
                const changeMode = {
                    id,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                this.updateSubject.next(changeMode);
                clientEditSubject.next(changeMode);
                if (this.observablesMap.has(id)) {
                    this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    registration => registration.dispose()));
                }
                this.observablesMap.delete(id);
                this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        return editorObservable;
    }
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    edit(positions, options = DEFAULT_HIPPODROME_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        /** @type {?} */
        const id = generateKey();
        /** @type {?} */
        const hippodromeEditOptions = this.setOptions(options);
        /** @type {?} */
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    }
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    editHippodrome(id, priority, editSubject, options, editObservable) {
        /** @type {?} */
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                entity => id === entity.id),
            });
        }
        /** @type {?} */
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            entity => id === entity.editedEntityId),
        });
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ movement: { endPosition, drop }, entities }) => {
            /** @type {?} */
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            const point = entities[0];
            /** @type {?} */
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { drop } }) => this.cameraService.enableInputs(drop))))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ movement: { startPosition, endPosition, drop }, entities }) => {
                /** @type {?} */
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            }));
        }
        /** @type {?} */
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    setOptions(options) {
        /** @type {?} */
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        /** @type {?} */
        const hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
    }
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    createEditorObservable(observableToExtend, id) {
        observableToExtend.dispose = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                obs => obs.dispose()));
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} firstPosition
         * @param {?} secondPosition
         * @param {?} widthMeters
         * @param {?=} firstPointProp
         * @param {?=} secondPointProp
         * @return {?}
         */
        (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) => {
            /** @type {?} */
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            const hippodrome = this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        () => this.getPoints(id));
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        () => observableToExtend.getValue());
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        () => this.hippodromeManager.get(id).labels);
        observableToExtend.getCurrentWidth = (/**
         * @return {?}
         */
        () => this.getWidth(id));
        return (/** @type {?} */ (observableToExtend));
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPositions(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getPoints(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    }
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    getWidth(id) {
        /** @type {?} */
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    }
}
HippodromeEditorService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HippodromeEditorComponent {
    /**
     * @param {?} hippodromesEditor
     * @param {?} coordinateConverter
     * @param {?} mapEventsManager
     * @param {?} cameraService
     * @param {?} hippodromesManager
     */
    constructor(hippodromesEditor, coordinateConverter, mapEventsManager, cameraService, hippodromesManager) {
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
    /**
     * @private
     * @return {?}
     */
    startListeningToEditorUpdates() {
        this.hippodromesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        (update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        }));
    }
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    getLabelId(element, index) {
        return index.toString();
    }
    /**
     * @param {?} hippodrome
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    renderEditLabels(hippodrome, update, labels) {
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
    }
    /**
     * @param {?} hippodrome
     * @return {?}
     */
    removeEditLabels(hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                hippodrome.dispose();
                this.removeEditLabels(hippodrome);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    /**
     * @param {?} update
     * @return {?}
     */
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                const hippodrome = this.hippodromesManager.get(update.id);
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.hippodromesManager.clear();
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    /**
     * @param {?} point
     * @return {?}
     */
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
HippodromeEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'hippodrome-editor',
                template: /*html*/ `
    <ac-layer #editHippodromesLayer acFor="let hippodrome of editHippodromes$" [context]="this">
      <ac-corridor-desc
        props="{
		positions: hippodrome.getRealPositionsCallbackProperty(),
		cornerType: Cesium.CornerType.ROUNDED,
		material: hippodrome.hippodromeProps.material,
		width : hippodrome.hippodromeProps.width,
		outline: hippodrome.hippodromeProps.outline,
		outlineColor: hippodrome.hippodromeProps.outlineColor,
        outlineWidth: hippodrome.hippodromeProps.outlineWidth,
        height: 0
	}"
      >
      </ac-corridor-desc>

      <ac-array-desc acFor="let label of hippodrome.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>
  `,
                providers: [CoordinateConverter, HippodromeManagerService],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
HippodromeEditorComponent.ctorParameters = () => [
    { type: HippodromeEditorService },
    { type: CoordinateConverter },
    { type: MapEventsManagerService },
    { type: CameraService },
    { type: HippodromeManagerService }
];
HippodromeEditorComponent.propDecorators = {
    editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
    editHippodromesLayer: [{ type: ViewChild, args: ['editHippodromesLayer',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
class DraggableToMapService {
    /**
     * @param {?} document
     * @param {?} mapsManager
     */
    constructor(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    /**
     * @param {?} coordinateConverter
     * @return {?}
     */
    setCoordinateConverter(coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    }
    /**
     * @param {?} imageSrc
     * @param {?=} style
     * @return {?}
     */
    drag(imageSrc, style) {
        if (!this.coordinateConverter) {
            /** @type {?} */
            const mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        /** @type {?} */
        const imgElement = document.createElement('img');
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
        this.dragObservable.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }), (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            imgElement.remove();
        }), (/**
         * @return {?}
         */
        () => {
            imgElement.remove();
        }));
    }
    /**
     * @return {?}
     */
    dragUpdates() {
        return this.mainSubject;
    }
    /**
     * @return {?}
     */
    cancel() {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    }
    /**
     * @private
     * @return {?}
     */
    createDragObservable() {
        /** @type {?} */
        const stopper = new Subject();
        /** @type {?} */
        const dropSubject = new Subject();
        /** @type {?} */
        const pointerUp = fromEvent(document, 'pointerup');
        /** @type {?} */
        const pointerMove = fromEvent(document, 'pointermove');
        /** @type {?} */
        let dragStartPositionX;
        /** @type {?} */
        let dragStartPositionY;
        /** @type {?} */
        let lastMove;
        /** @type {?} */
        const moveObservable = pointerMove.pipe(map((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
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
                mapPosition: this.coordinateConverter ?
                    this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        })), takeUntil(pointerUp), tap(undefined, undefined, (/**
         * @return {?}
         */
        () => {
            if (lastMove) {
                /** @type {?} */
                const dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        })));
        this.dragObservable = moveObservable.pipe(merge$1(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    }
}
DraggableToMapService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DraggableToMapService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: MapsManagerService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * \@Input {src: string, style?: any} | string -
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
class DraggableToMapDirective {
    /**
     * @param {?} el
     * @param {?} iconDragService
     */
    constructor(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    }
    /**
     * @return {?}
     */
    onMouseDown() {
        this.iconDragService.drag(this.src, this.style);
    }
}
DraggableToMapDirective.decorators = [
    { type: Directive, args: [{ selector: '[draggableToMap]' },] }
];
/** @nocollapse */
DraggableToMapDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: DraggableToMapService }
];
DraggableToMapDirective.propDecorators = {
    draggableToMap: [{ type: Input }],
    onMouseDown: [{ type: HostListener, args: ['mousedown',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 * <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 * </ac-toolbar-button>
 * <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 * </ac-toolbar-button>
 * </ac-toolbar>
 * ```
 *
 */
class AcToolbarComponent {
    /**
     * @param {?} element
     * @param {?} cesiumService
     */
    constructor(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            /** @type {?} */
            const mouseDown$ = fromEvent(this.element.nativeElement, 'mousedown');
            /** @type {?} */
            const mouseMove$ = fromEvent(document, 'mousemove');
            /** @type {?} */
            const mouseUp$ = fromEvent(document, 'mouseup');
            /** @type {?} */
            const drag$ = mouseDown$.pipe(switchMap((/**
             * @return {?}
             */
            () => mouseMove$.pipe(takeUntil(mouseUp$)))));
            this.subscription = drag$.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this.element.nativeElement.style.left = event.x + 'px';
                this.element.nativeElement.style.top = event.y + 'px';
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
AcToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-toolbar',
                template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
        :host {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 999;
            -webkit-user-drag: none;
        }
    `]
            }] }
];
/** @nocollapse */
AcToolbarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: CesiumService }
];
AcToolbarComponent.propDecorators = {
    toolbarClass: [{ type: Input }],
    allowDrag: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DragIconComponent {
    constructor() {
    }
}
DragIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-drag-icon',
                template: `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"  height="25"  width="25"
	 viewBox="0 0 476.737 476.737" style="enable-background:new 0 0 476.737 476.737;" xml:space="preserve">
<g>
	<g>
		<path style="fill:#010002;" d="M475.498,232.298l-3.401-5.149l-63.565-63.565c-6.198-6.198-16.304-6.198-22.47,0
			c-6.198,6.198-6.198,16.273,0,22.47l36.423,36.423H254.26V54.253l36.423,36.423c6.166,6.198,16.273,6.198,22.47,0
			c6.166-6.198,6.166-16.273,0-22.47L249.588,4.64l-0.159-0.095l-4.99-3.305L238.369,0h-0.064l-6.007,1.24l-4.99,3.305l-0.191,0.095
			l-63.565,63.565c-6.198,6.198-6.198,16.273,0,22.47s16.273,6.198,22.47,0l36.455-36.423v168.225H54.253l36.423-36.423
			c6.198-6.198,6.198-16.273,0-22.47s-16.273-6.198-22.47,0L4.64,227.149l-0.095,0.159l-3.305,4.99L0,238.369v0.064l1.24,6.007
			l3.305,4.958l0.095,0.191l63.565,63.565c6.198,6.198,16.273,6.198,22.47,0c6.198-6.166,6.198-16.273,0-22.47L54.253,254.26
			h168.225v168.225l-36.423-36.423c-6.198-6.166-16.273-6.166-22.47,0c-6.198,6.198-6.198,16.304,0,22.47l63.565,63.565l5.149,3.432
			l6.007,1.208h0.064l6.07-1.24l5.149-3.401l63.565-63.565c6.166-6.198,6.166-16.304,0-22.47c-6.198-6.198-16.304-6.198-22.47,0
			l-36.423,36.423V254.26h168.225l-36.423,36.423c-6.166,6.166-6.166,16.273,0,22.47c6.198,6.166,16.304,6.166,22.47,0
			l63.565-63.565l3.432-5.149l1.208-6.007v-0.064L475.498,232.298z"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
    `
            }] }
];
/** @nocollapse */
DragIconComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 * <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 * </ac-toolbar-button>
 * <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 * </ac-toolbar-button>
 * </ac-toolbar>
 * ```
 *
 */
class AcToolbarButtonComponent {
    constructor() {
        this.onClick = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
AcToolbarButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-toolbar-button',
                template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
        .button-container {
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            height: 30px;
            width: 30px;
            padding: 5px;
            transition: all 0.2s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .button-container:hover {
            background-color: rgba(255, 255, 255, 0.95);
        }

        .icon {
            height: 30px;
            width: 30px;
        }
    `]
            }] }
];
/** @nocollapse */
AcToolbarButtonComponent.ctorParameters = () => [];
AcToolbarButtonComponent.propDecorators = {
    iconUrl: [{ type: Input }],
    buttonClass: [{ type: Input }],
    iconClass: [{ type: Input }],
    onClick: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * \\@ViewChild('rangeAndBearing') private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
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
class RangeAndBearingComponent {
    /**
     * @param {?} polylineEditor
     * @param {?} coordinateConverter
     */
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    /**
     * @param {?=} __0
     * @return {?}
     */
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        /** @type {?} */
        const rnb = this.polylineEditor.create(Object.assign({ allowDrag: false, pointProps: {
                showVirtual: false,
                pixelSize: 8,
            }, polylineProps: {
                width: 2,
            } }, this.lineEditOptions, lineEditOptions));
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn((/**
             * @param {?} update
             * @return {?}
             */
            update => {
                /** @type {?} */
                const positions = update.positions;
                /** @type {?} */
                let totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? [...positions, update.updatedPosition]
                    : positions).reduce((/**
                 * @param {?} labels
                 * @param {?} position
                 * @param {?} index
                 * @param {?} array
                 * @return {?}
                 */
                (labels, position, index, array) => {
                    if (index !== 0) {
                        /** @type {?} */
                        const previousPosition = array[index - 1];
                        /** @type {?} */
                        const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        /** @type {?} */
                        const distance = Cesium.Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(Object.assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.bearingLabelsStyle))), ((/** @type {?} */ (bearingLabelsStyle)))), Object.assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-35, -8), position: position, fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))));
                        totalDistance += distance;
                    }
                    return labels;
                }), [
                    Object.assign({ text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: positions[0], fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))),
                ]);
            }));
        }
        return rnb;
    }
}
RangeAndBearingComponent.decorators = [
    { type: Component, args: [{
                selector: 'range-and-bearing',
                template: `
    <polylines-editor></polylines-editor>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [PolylinesEditorService]
            }] }
];
/** @nocollapse */
RangeAndBearingComponent.ctorParameters = () => [
    { type: PolylinesEditorService },
    { type: CoordinateConverter }
];
RangeAndBearingComponent.propDecorators = {
    lineEditOptions: [{ type: Input }],
    labelsStyle: [{ type: Input }],
    distanceLabelsStyle: [{ type: Input }],
    bearingLabelsStyle: [{ type: Input }],
    bearingStringFn: [{ type: Input }],
    distanceStringFn: [{ type: Input }],
    labelsRenderFn: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */
class ZoomToRectangleService {
    /**
     * @param {?} mapsManager
     * @param {?} cameraService
     * @param {?} cesiumService
     */
    constructor(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
        };
    }
    /**
     * @param {?} cesiumService
     * @param {?} cameraService
     * @return {?}
     */
    init(cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    activate(options = {}, mapId) {
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        /** @type {?} */
        const finalOptions = Object.assign({}, this.defaultOptions, options);
        /** @type {?} */
        let cameraService = this.cameraService;
        /** @type {?} */
        let mapContainer;
        /** @type {?} */
        let map$$1;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
            map$$1 = this.cesiumService.getMap();
        }
        if (mapId) {
            map$$1 = this.mapsManager.getMap(mapId);
            if (!map$$1) {
                throw new Error(`Map not found with id: ${mapId}`);
            }
            cameraService = map$$1.getCameraService();
            mapContainer = map$$1.getCesiumViewer().container;
        }
        if (!cameraService || !mapContainer) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        this.disable(mapId);
        /** @type {?} */
        const container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        /** @type {?} */
        const mapZoomData = { container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        /** @type {?} */
        let mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        /** @type {?} */
        let borderElement;
        container.onmousedown = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map$$1);
                }
                /** @type {?} */
                const rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                const offsetX = e.clientX - rect.left;
                /** @type {?} */
                const offsetY = e.clientY - rect.top;
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
        });
        container.onmouseup = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (borderElement) {
                /** @type {?} */
                const zoomApplied = this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds);
                if (borderElement) {
                    borderElement.remove();
                    borderElement = undefined;
                    mapZoomData.borderElement = undefined;
                }
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
                if (!!finalOptions.onComplete) {
                    finalOptions.onComplete(map$$1);
                }
                if (finalOptions.autoDisableOnZoom && zoomApplied) {
                    this.disable(mapId);
                }
            }
        });
        container.onmousemove = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (borderElement) {
                /** @type {?} */
                const rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                const offsetX = e.clientX - rect.left;
                /** @type {?} */
                const offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        });
        /** @type {?} */
        const resetOnEscapePress = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
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
        });
        document.addEventListener('keydown', resetOnEscapePress);
        mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
    }
    /**
     * @param {?=} mapId
     * @return {?}
     */
    disable(mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        /** @type {?} */
        const data = this.mapsZoomElements.get(mapId || this.cesiumService.getMap().getId());
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
    }
    /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    zoomCameraToRectangle(cameraService, positions, animationDuration) {
        /** @type {?} */
        const camera = cameraService.getCamera();
        /** @type {?} */
        const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        /** @type {?} */
        const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        /** @type {?} */
        const cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        /** @type {?} */
        const cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            duration: animationDuration,
        });
        return true;
    }
}
ZoomToRectangleService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ZoomToRectangleService.ctorParameters = () => [
    { type: MapsManagerService },
    { type: CameraService, decorators: [{ type: Optional }] },
    { type: CesiumService, decorators: [{ type: Optional }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AngularCesiumWidgetsModule {
}
AngularCesiumWidgetsModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, AngularCesiumModule],
                declarations: [
                    HippodromeEditorComponent,
                    PolygonsEditorComponent,
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
                    HippodromeEditorComponent,
                    PolygonsEditorComponent,
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AngularCesiumModule, AcEntity, AcNotification, ActionType, MapLayerProviderOptions, SceneMode, KeyboardAction, AcMapComponent, AcLayerComponent, AcArcDescComponent, AcBillboardComponent, AcBillboardDescComponent, AcBillboardPrimitiveDescComponent, AcCircleDescComponent, AcEllipseDescComponent, AcPolylineDescComponent, AcPolylinePrimitiveDescComponent, AcLabelComponent, AcLabelDescComponent, AcLabelPrimitiveDescComponent, AcPolygonDescComponent, AcPolygonComponent, AcPolylineComponent, AcPrimitivePolylineComponent, AcPointComponent, AcPointDescComponent, AcCircleComponent, AcArcComponent, AcEllipseComponent, AcHtmlComponent, AcMapLayerProviderComponent, AcDefaultPlonterComponent, AcBoxDescComponent, AcCorridorDescComponent, AcCylinderDescComponent, AcEllipsoidDescComponent, AcPolylineVolumeDescComponent, AcWallDescComponent, AcRectangleDescComponent, AcTileset3dComponent, AcHtmlDescComponent, AcArrayDescComponent, AcDynamicCircleDescComponent, AcDynamicEllipseDescComponent, AcDynamicPolylineDescComponent, AcStaticCircleDescComponent, AcStaticEllipseDescComponent, AcStaticPolygonDescComponent, AcStaticPolylineDescComponent, MapEventsManagerService, DisposableObservable, CesiumEventModifier, CesiumEvent, PickOptions, CesiumService, CameraService, CoordinateConverter, GeoUtilsService, PlonterService, ViewerConfiguration, MapsManagerService, KeyboardControlService, PREDEFINED_KEYBOARD_ACTIONS, ScreenshotService, SelectionManagerService, ContextMenuService, PixelOffsetPipe, RadiansToDegreesPipe, CesiumHeatMapMaterialCreator, AngularCesiumWidgetsModule, EditActions, EditModes, EditPoint, EditPolyline, EditArc, EditablePolygon, EditableCircle, EditablePolyline, EditableEllipse, EditorObservable, PolylineEditorObservable, PolygonEditorObservable, CircleEditorObservable, EllipseEditorObservable, defaultLabelProps, HippodromeEditorObservable, EditableHippodrome, PolygonsEditorComponent, CirclesEditorComponent, PolylinesEditorComponent, HippodromeEditorComponent, EllipsesEditorComponent, DraggableToMapDirective, AcToolbarComponent, AcToolbarButtonComponent, RangeAndBearingComponent, DEFAULT_POLYGON_OPTIONS, PolygonsEditorService, DEFAULT_CIRCLE_OPTIONS, CirclesEditorService, DEFAULT_POLYLINE_OPTIONS, PolylinesEditorService, DEFAULT_HIPPODROME_OPTIONS, HippodromeEditorService, DEFAULT_ELLIPSE_OPTIONS, EllipsesEditorService, DraggableToMapService, ZoomToRectangleService, DragIconComponent as ɵcg, CirclesManagerService as ɵcd, EllipsesManagerService as ɵce, HippodromeManagerService as ɵcb, PolygonsManagerService as ɵcc, PolylinesManagerService as ɵcf, ANGULAR_CESIUM_CONFIG as ɵr, ConfigurationService as ɵs, AcContextMenuWrapperComponent as ɵbt, AcCzmlDescComponent as ɵbz, AcModelDescComponent as ɵbs, AcPointPrimitiveDescComponent as ɵbu, AcHtmlContainerDirective as ɵby, AcHtmlContext as ɵbw, AcHtmlDirective as ɵbx, AcHtmlManager as ɵbv, BasicDesc as ɵbp, BasicStaticPrimitiveDesc as ɵca, CesiumProperties as ɵbq, ComputationCache as ɵu, ArcDrawerService as ɵn, BasicDrawerService as ɵe, BillboardDrawerService as ɵc, BillboardPrimitiveDrawerService as ɵbe, BoxDrawerService as ɵw, CorridorDrawerService as ɵx, CylinderDrawerService as ɵy, CzmlDrawerService as ɵo, EllipsoidDrawerService as ɵz, EllipseDrawerService as ɵl, EntitiesDrawerService as ɵd, GraphicsType as ɵf, HtmlDrawerService as ɵbg, LabelDrawerService as ɵh, LabelPrimitiveDrawerService as ɵbd, ModelDrawerService as ɵv, PointDrawerService as ɵm, PointPrimitiveDrawerService as ɵbf, PolygonDrawerService as ɵp, PolylineDrawerService as ɵi, PolylinePrimitiveDrawerService as ɵj, PolylineVolumeDrawerService as ɵba, PrimitivesDrawerService as ɵk, RectangleDrawerService as ɵbc, DynamicPolylineDrawerService as ɵbi, DynamicEllipseDrawerService as ɵbh, StaticEllipseDrawerService as ɵbn, StaticCircleDrawerService as ɵbj, StaticPolygonDrawerService as ɵbm, StaticPolylineDrawerService as ɵbl, StaticPrimitiveDrawer as ɵbk, WallDrawerService as ɵbb, EntityOnMapComponent as ɵbo, JsonMapper as ɵbr, LayerService as ɵt, CesiumEventBuilder as ɵg, MapLayersService as ɵq, ViewerFactory as ɵb, UtilsModule as ɵa };

//# sourceMappingURL=angular-cesium.js.map
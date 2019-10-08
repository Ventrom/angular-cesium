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
import { __extends, __assign, __spread } from 'tslib';
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
var AssociativeArray = Cesium.AssociativeArray;
/** @type {?} */
var Color = Cesium.Color;
/** @type {?} */
var ColorGeometryInstanceAttribute = Cesium.ColorGeometryInstanceAttribute;
/** @type {?} */
var defined = Cesium.defined;
/** @type {?} */
var DistanceDisplayCondition = Cesium.DistanceDisplayCondition;
/** @type {?} */
var DistanceDisplayConditionGeometryInstanceAttribute = Cesium.DistanceDisplayConditionGeometryInstanceAttribute;
/** @type {?} */
var ShowGeometryInstanceAttribute = Cesium.ShowGeometryInstanceAttribute;
/** @type {?} */
var Primitive = Cesium.Primitive;
/** @type {?} */
var ShadowMode = Cesium.ShadowMode;
/** @type {?} */
var BoundingSphereState = Cesium.BoundingSphereState;
/** @type {?} */
var ColorMaterialProperty = Cesium.ColorMaterialProperty;
/** @type {?} */
var MaterialProperty = Cesium.MaterialProperty;
/** @type {?} */
var Property = Cesium.Property;
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
var wasFixed = false;
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
var ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(config) {
        this.config = config;
        /** @type {?} */
        var fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
    ConfigurationService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ConfigurationService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
    ]; };
    return ConfigurationService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var SceneMode = {
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
var CameraService = /** @class */ (function () {
    function CameraService() {
        this.isSceneModePerformance2D = false;
    }
    /**
     * @param {?} cesiumService
     * @return {?}
     */
    CameraService.prototype.init = /**
     * @param {?} cesiumService
     * @return {?}
     */
    function (cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    CameraService.prototype._listenToSceneModeMorph = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    };
    /**
     * @return {?}
     */
    CameraService.prototype._revertCameraProperties = /**
     * @return {?}
     */
    function () {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    };
    /**
     * Gets the scene's camera
     */
    /**
     * Gets the scene's camera
     * @return {?}
     */
    CameraService.prototype.getCamera = /**
     * Gets the scene's camera
     * @return {?}
     */
    function () {
        return this.camera;
    };
    /**
     * Gets the scene's screenSpaceCameraController
     */
    /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    CameraService.prototype.getScreenSpaceCameraController = /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController;
    };
    /**
     * Gets the minimum zoom value in meters
     */
    /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    CameraService.prototype.getMinimumZoom = /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController.minimumZoomDistance;
    };
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.setMinimumZoom = /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    };
    /**
     * Gets the maximum zoom value in meters
     */
    /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    CameraService.prototype.getMaximumZoom = /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController.maximumZoomDistance;
    };
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.setMaximumZoom = /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    };
    /**
     * Sets if the camera is able to tilt
     */
    /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    CameraService.prototype.enableTilt = /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    function (tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    };
    /**
     * Sets if the camera is able to rotate
     */
    /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    CameraService.prototype.enableRotate = /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    function (rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    };
    /**
     * Sets if the camera is able to free-look
     */
    /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    CameraService.prototype.enableLook = /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    function (lock) {
        this.screenSpaceCameraController.enableLook = lock;
    };
    /**
     * Sets if the camera is able to translate
     */
    /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    CameraService.prototype.enableTranslate = /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    function (translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    };
    /**
     * Sets if the camera is able to zoom
     */
    /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    CameraService.prototype.enableZoom = /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    function (zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    };
    /**
     * Sets if the camera receives inputs
     */
    /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    CameraService.prototype.enableInputs = /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    function (inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    };
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    CameraService.prototype.setSceneMode = /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    function (sceneMode, duration) {
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
                /** @type {?} */
                var morphCompleteEventListener_1 = this.scene.morphComplete.addEventListener((/**
                 * @return {?}
                 */
                function () {
                    _this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, _this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener_1();
                    _this._listenToSceneModeMorph(_this._revertCameraProperties.bind(_this));
                }));
                break;
            }
        }
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    CameraService.prototype.cameraFlyTo = /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    function (options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    };
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    CameraService.prototype.flyTo = /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    function (target, options) {
        return this.viewer.flyTo(target, options);
    };
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.zoomIn = /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.zoomOut = /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    CameraService.prototype.zoomTo = /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    function (target, offset) {
        return this.viewer.zoomTo(target, offset);
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    CameraService.prototype.setView = /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    function (options) {
        this.camera.setView(options);
    };
    /**
     * Set camera's rotation
     */
    /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    CameraService.prototype.setRotation = /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    function (degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    };
    /**
     * Locks or unlocks camera rotation
     */
    /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    CameraService.prototype.lockRotation = /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    function (lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    };
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param entity - entity to track
     * @param options - track entity options
     */
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    CameraService.prototype.trackEntity = /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    function (entity, options) {
        var _this = this;
        /** @type {?} */
        var flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            if (flyTo) {
                /** @type {?} */
                var flyToDuration = (options && options.flyToDuration) || 1;
                /** @type {?} */
                var altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                /** @type {?} */
                var entPosCar3 = entity.position.getValue(Cesium.JulianDate.now());
                /** @type {?} */
                var entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                /** @type {?} */
                var zoomAmount_1 = altitude - entPosCart.height;
                entPosCart.height = altitude;
                /** @type {?} */
                var flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                _this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: (/**
                     * @return {?}
                     */
                    function () {
                        _this.viewer.trackedEntity = entity;
                        setTimeout((/**
                         * @return {?}
                         */
                        function () {
                            if (zoomAmount_1 > 0) {
                                _this.camera.zoomOut(zoomAmount_1);
                            }
                            else {
                                _this.camera.zoomIn(zoomAmount_1);
                            }
                        }), 0);
                        resolve();
                    })
                });
            }
            else {
                _this.viewer.trackedEntity = entity;
                resolve();
            }
        }));
    };
    /**
     * @return {?}
     */
    CameraService.prototype.untrackEntity = /**
     * @return {?}
     */
    function () {
        this.trackEntity();
    };
    CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
    CameraService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CameraService.ctorParameters = function () { return []; };
    return CameraService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    ViewerFactory.prototype.createViewer = /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    function (mapContainer, options) {
        /** @type {?} */
        var viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, __assign({ contextOptions: {
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
    };
    ViewerFactory.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ViewerFactory.ctorParameters = function () { return []; };
    return ViewerFactory;
}());

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
var ViewerConfiguration = /** @class */ (function () {
    function ViewerConfiguration() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    Object.defineProperty(ViewerConfiguration.prototype, "viewerOptions", {
        get: /**
         * @return {?}
         */
        function () {
            return this._viewerOptions;
        },
        /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._viewerOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ViewerConfiguration.prototype.getNextViewerOptions = /**
     * @return {?}
     */
    function () {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    };
    Object.defineProperty(ViewerConfiguration.prototype, "viewerModifier", {
        get: /**
         * @return {?}
         */
        function () {
            return this._viewerModifier;
        },
        /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._viewerModifier = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ViewerConfiguration.prototype.getNextViewerModifier = /**
     * @return {?}
     */
    function () {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    };
    ViewerConfiguration.decorators = [
        { type: Injectable }
    ];
    return ViewerConfiguration;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
var CesiumService = /** @class */ (function () {
    function CesiumService(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    CesiumService.prototype.init = /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    function (mapContainer, map$$1) {
        var _this = this;
        this.map = map$$1;
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var options = _this.viewerConfiguration ? _this.viewerConfiguration.getNextViewerOptions() : undefined;
            _this.cesiumViewer = _this.viewerFactory.createViewer(mapContainer, options);
            /** @type {?} */
            var viewerModifier = _this.viewerConfiguration && _this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(_this.cesiumViewer);
            }
        }));
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    CesiumService.prototype.getViewer = /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    function () {
        return this.cesiumViewer;
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    CesiumService.prototype.getScene = /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    function () {
        return this.cesiumViewer.scene;
    };
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    CesiumService.prototype.getCanvas = /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    function () {
        return (/** @type {?} */ (this.cesiumViewer.canvas));
    };
    /**
     * @return {?}
     */
    CesiumService.prototype.getMap = /**
     * @return {?}
     */
    function () {
        return this.map;
    };
    CesiumService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumService.ctorParameters = function () { return [
        { type: NgZone },
        { type: ViewerFactory },
        { type: ViewerConfiguration, decorators: [{ type: Optional }] }
    ]; };
    return CesiumService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {?} */
var CesiumEvent = {
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
var PickOptions = {
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
        get: /**
         * @return {?}
         */
        function () {
            return this._contextMenuChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "showContextMenu", {
        get: /**
         * @return {?}
         */
        function () {
            return this._showContextMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "options", {
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "position", {
        get: /**
         * @return {?}
         */
        function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "content", {
        get: /**
         * @return {?}
         */
        function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onOpen", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onClose", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onClose;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    ContextMenuService.prototype.init = /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    function (mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    };
    /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    ContextMenuService.prototype.open = /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    function (content, position, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
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
            function () {
                _this.leftClickSubscription.unsubscribe();
                _this.close();
            }));
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    };
    /**
     * @return {?}
     */
    ContextMenuService.prototype.close = /**
     * @return {?}
     */
    function () {
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
    ContextMenuService.decorators = [
        { type: Injectable }
    ];
    return ContextMenuService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var LatLonVectors$1 = LatLonVectors;
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
var CoordinateConverter = /** @class */ (function () {
    function CoordinateConverter(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    CoordinateConverter.prototype.screenToCartesian3 = /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    function (screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            /** @type {?} */
            var screenPosition = __assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                /** @type {?} */
                var mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            /** @type {?} */
            var camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    };
    /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    CoordinateConverter.prototype.screenToCartographic = /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    function (screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    };
    /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    CoordinateConverter.prototype.cartesian3ToCartographic = /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    function (cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    CoordinateConverter.prototype.degreesToCartographic = /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    function (longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    CoordinateConverter.prototype.radiansToCartographic = /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    function (longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    CoordinateConverter.prototype.degreesToUTM = /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    function (longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    };
    /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    CoordinateConverter.prototype.UTMToDegrees = /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    function (zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    };
    /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    CoordinateConverter.prototype.geodesyToCesiumObject = /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    function (geodesyRadians) {
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
    /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    CoordinateConverter.prototype.midPointToCartesian3 = /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    function (first, second) {
        /** @type {?} */
        var toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        function (rad) { return Cesium.Math.toDegrees(rad); });
        /** @type {?} */
        var firstPoint = new LatLonVectors$1(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        var secondPoint = new LatLonVectors$1(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        var middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    CoordinateConverter.prototype.middlePointByScreen = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        /** @type {?} */
        var scene = this.cesiumService.getScene();
        /** @type {?} */
        var screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        /** @type {?} */
        var screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        /** @type {?} */
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
    /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    CoordinateConverter.prototype.bearingTo = /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    function (first, second) {
        /** @type {?} */
        var toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        function (rad) { return Cesium.Math.toDegrees(rad); });
        /** @type {?} */
        var firstPoint = new LatLonVectors$1(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        var secondPoint = new LatLonVectors$1(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        var bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    };
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    CoordinateConverter.prototype.bearingToCartesian = /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    function (firstCartesian3, secondCartesian3) {
        /** @type {?} */
        var firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        /** @type {?} */
        var secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    };
    CoordinateConverter.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CoordinateConverter.ctorParameters = function () { return [
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    return CoordinateConverter;
}());

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
var  /**
 * @abstract
 */
BasicDrawerService = /** @class */ (function () {
    function BasicDrawerService() {
    }
    /**
     * @param {?} assigner
     * @return {?}
     */
    BasicDrawerService.prototype.setPropsAssigner = /**
     * @param {?} assigner
     * @return {?}
     */
    function (assigner) {
        this._propsAssigner = assigner;
    };
    return BasicDrawerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
var  /**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
PrimitivesDrawerService = /** @class */ (function (_super) {
    __extends(PrimitivesDrawerService, _super);
    function PrimitivesDrawerService(drawerType, cesiumService) {
        var _this = _super.call(this) || this;
        _this.drawerType = drawerType;
        _this.cesiumService = cesiumService;
        _this._show = true;
        return _this;
    }
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.init = /**
     * @return {?}
     */
    function () {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    };
    /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    PrimitivesDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    function (cesiumProps) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this._cesiumCollection.add(cesiumProps);
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    PrimitivesDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    function (entity, cesiumProps) {
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
    /**
     * @param {?} entity
     * @return {?}
     */
    PrimitivesDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this._cesiumCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this._cesiumCollection.removeAll();
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    PrimitivesDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    };
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.getShow = /**
     * @return {?}
     */
    function () {
        return this._show;
    };
    return PrimitivesDrawerService;
}(BasicDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GeoUtilsService = /** @class */ (function () {
    function GeoUtilsService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    GeoUtilsService.pointByLocationDistanceAndAzimuth = /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    function (currentLocation, meterDistance, radianAzimuth, deprecated) {
        /** @type {?} */
        var distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
        /** @type {?} */
        var cartographicLocation = currentLocation instanceof Cesium.Cartesian3 ? Cesium.Cartographic.fromCartesian(currentLocation) : currentLocation;
        /** @type {?} */
        var cartesianLocation = currentLocation instanceof Cesium.Cartesian3
            ? currentLocation
            : Cesium.Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        /** @type {?} */
        var resultPosition;
        /** @type {?} */
        var resultDistance;
        /** @type {?} */
        var counter = 0;
        /** @type {?} */
        var distanceFactorRangeMax = 0.1;
        /** @type {?} */
        var distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            /** @type {?} */
            var factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
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
    };
    /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    GeoUtilsService._pointByLocationDistanceAndAzimuth = /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    function (cartographicLocation, distance, radianAzimuth) {
        /** @type {?} */
        var curLat = cartographicLocation.latitude;
        /** @type {?} */
        var curLon = cartographicLocation.longitude;
        /** @type {?} */
        var destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        /** @type {?} */
        var destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
    };
    /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    GeoUtilsService.distance = /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    function (pos0, pos1) {
        return Cesium.Cartesian3.distance(pos0, pos1);
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    GeoUtilsService.getPositionsDelta = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    };
    /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    GeoUtilsService.addDeltaToPosition = /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    function (position, delta, updateReference) {
        if (updateReference === void 0) { updateReference = false; }
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            /** @type {?} */
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = 0;
            /** @type {?} */
            var cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            /** @type {?} */
            var cartesian = new Cesium.Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            /** @type {?} */
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    GeoUtilsService.middleCartesian3Point = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        return new Cesium.Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    };
    /**
     * @param {?} screenPos
     * @return {?}
     */
    GeoUtilsService.prototype.screenPositionToCartesian3 = /**
     * @param {?} screenPos
     * @return {?}
     */
    function (screenPos) {
        /** @type {?} */
        var camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    };
    GeoUtilsService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GeoUtilsService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return GeoUtilsService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * +  This drawer is responsible for drawing an arc over the Cesium map.
 * +  This implementation uses simple PolylineGeometry and Primitive parameters.
 * +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
var ArcDrawerService = /** @class */ (function (_super) {
    __extends(ArcDrawerService, _super);
    function ArcDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    ArcDrawerService.prototype._calculateArcPositions = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        /** @type {?} */
        var quality = cesiumProps.quality || 18;
        /** @type {?} */
        var delta = (cesiumProps.delta) / quality;
        /** @type {?} */
        var pointsArray = [];
        for (var i = 0; i < quality + 1; ++i) {
            /** @type {?} */
            var point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    ArcDrawerService.prototype._calculateTriangle = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    ArcDrawerService.prototype._calculateArc = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        /** @type {?} */
        var arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    ArcDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            /** @type {?} */
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    };
    /**
     * @param {?} primitive
     * @param {?} cesiumProps
     * @return {?}
     */
    ArcDrawerService.prototype.update = /**
     * @param {?} primitive
     * @param {?} cesiumProps
     * @return {?}
     */
    function (primitive, cesiumProps) {
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
    ArcDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ArcDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return ArcDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var GraphicsType = {
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
    /**
     * @param {?} show
     * @return {?}
     */
    OptimizedEntityCollection.prototype.setShow = /**
     * @param {?} show
     * @return {?}
     */
    function (show) {
        this.entityCollection.show = show;
    };
    Object.defineProperty(OptimizedEntityCollection.prototype, "isSuspended", {
        get: /**
         * @return {?}
         */
        function () {
            return this._isSuspended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "updateRate", {
        get: /**
         * @return {?}
         */
        function () {
            return this._updateRate;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._updateRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "collectionSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._collectionSize;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._collectionSize = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.collection = /**
     * @return {?}
     */
    function () {
        return this.entityCollection;
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.isFree = /**
     * @return {?}
     */
    function () {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.add = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.removeNoSuspend = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.entityCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.suspend();
        this.entityCollection.removeAll();
    };
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    OptimizedEntityCollection.prototype.onEventSuspension = /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventSuspensionCallback = { callback: callback, once: once };
        return (/**
         * @return {?}
         */
        function () {
            _this._onEventSuspensionCallback = undefined;
        });
    };
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    OptimizedEntityCollection.prototype.onEventResume = /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventResumeCallback = { callback: callback, once: once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return (/**
         * @return {?}
         */
        function () {
            _this._onEventResumeCallback = undefined;
        });
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.triggerEventSuspension = /**
     * @return {?}
     */
    function () {
        if (this._onEventSuspensionCallback !== undefined) {
            /** @type {?} */
            var callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.triggerEventResume = /**
     * @return {?}
     */
    function () {
        if (this._onEventResumeCallback !== undefined) {
            /** @type {?} */
            var callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.suspend = /**
     * @return {?}
     */
    function () {
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
            this._suspensionTimeout = setTimeout((/**
             * @return {?}
             */
            function () {
                _this.entityCollection.resumeEvents();
                _this.triggerEventResume();
                _this._isSuspended = false;
                _this._suspensionTimeout = undefined;
            }), this._updateRate);
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.hardSuspend = /**
     * @return {?}
     */
    function () {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.hardResume = /**
     * @return {?}
     */
    function () {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    };
    return OptimizedEntityCollection;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
var  /**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
EntitiesDrawerService = /** @class */ (function (_super) {
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
            if ((/** @type {?} */ (GraphicsType[i])) === _this.graphicsType) {
                _this.graphicsTypeName = i;
            }
        }
        return _this;
    }
    /**
     * @private
     * @return {?}
     */
    EntitiesDrawerService.prototype.getFreeEntitiesCollection = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var freeEntityCollection = null;
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        }));
        return freeEntityCollection;
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    EntitiesDrawerService.prototype.init = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var finalOptions = options || this.defaultOptions;
        /** @type {?} */
        var dataSources = [];
        for (var i = 0; i < finalOptions.collectionsNumber; i++) {
            /** @type {?} */
            var dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    EntitiesDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        var _a;
        /** @type {?} */
        var optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        /** @type {?} */
        var graphicsClass = (/** @type {?} */ (this.graphicsType));
        /** @type {?} */
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
        return optimizedEntityCollection.add(entityObject);
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    EntitiesDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    function (entity, cesiumProps) {
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
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    EntitiesDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    EntitiesDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            entityCollection.removeAll();
        }));
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    EntitiesDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            entityCollection.setShow(showValue);
        }));
    };
    /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    EntitiesDrawerService.prototype.suspendEntityCollection = /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        /** @type {?} */
        var entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    };
    return EntitiesDrawerService;
}(BasicDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing billboards.
 */
var BillboardDrawerService = /** @class */ (function (_super) {
    __extends(BillboardDrawerService, _super);
    function BillboardDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.billboard) || this;
    }
    BillboardDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BillboardDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return BillboardDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?=} options
     * @return {?}
     */
    CzmlDrawerService.prototype.init = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    };
    // returns the packet, provided by the stream
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    CzmlDrawerService.prototype.add = 
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    CzmlDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    function (entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    CzmlDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    };
    /**
     * @return {?}
     */
    CzmlDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.czmlStream.entities.removeAll();
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    CzmlDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this.czmlStream.entities.show = showValue;
    };
    CzmlDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CzmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CzmlDrawerService;
}(BasicDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing ellipses.
 */
var EllipseDrawerService = /** @class */ (function (_super) {
    __extends(EllipseDrawerService, _super);
    function EllipseDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipse, {
            collectionsNumber: 10,
            collectionMaxSize: 450,
            collectionSuspensionTime: 100
        }) || this;
    }
    EllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return EllipseDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing labels.
 */
var LabelDrawerService = /** @class */ (function (_super) {
    __extends(LabelDrawerService, _super);
    function LabelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.label) || this;
    }
    LabelDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    LabelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return LabelDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing points.
 */
var PointDrawerService = /** @class */ (function (_super) {
    __extends(PointDrawerService, _super);
    function PointDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.point) || this;
    }
    PointDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PointDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PointDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polygons.
 */
var PolygonDrawerService = /** @class */ (function (_super) {
    __extends(PolygonDrawerService, _super);
    function PolygonDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polygon) || this;
    }
    PolygonDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolygonDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing polylines.
 */
var PolylineDrawerService = /** @class */ (function (_super) {
    __extends(PolylineDrawerService, _super);
    function PolylineDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polyline) || this;
    }
    PolylineDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolylineDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
var PolylinePrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PolylinePrimitiveDrawerService, _super);
    function PolylinePrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    };
    /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.update = /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumObject, cesiumProps) {
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
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.withColorMaterial = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            /** @type {?} */
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    };
    PolylinePrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolylinePrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolylinePrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var KeyboardAction = {
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

var _a;
/** @type {?} */
var CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
/** @type {?} */
var CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
/** @type {?} */
var CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
/** @type {?} */
var CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
/** @type {?} */
var PREDEFINED_KEYBOARD_ACTIONS = (_a = {},
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_FORWARD] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    }),
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_BACKWARD] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    }),
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    }),
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    }),
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    }),
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    }),
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    }),
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    }),
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    }),
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    }),
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    }),
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    }),
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_IN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var amount = params.amount;
        camera.zoomIn(amount);
    }),
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_OUT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var amount = params.amount;
        camera.zoomOut(amount);
    }),
    _a);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var KeyEventState = {
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
    /**
     * Initializes the keyboard control service.
     * @return {?}
     */
    KeyboardControlService.prototype.init = /**
     * Initializes the keyboard control service.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', (/**
         * @return {?}
         */
        function () {
            canvas.focus();
        }));
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
    KeyboardControlService.prototype.setKeyboardControls = /**
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
    function (definitions, keyMappingFn, outsideOfAngularZone) {
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
        Object.keys(this._currentDefinitions).forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            _this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        }));
    };
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     */
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     * @return {?}
     */
    KeyboardControlService.prototype.removeKeyboardControls = /**
     * Removes the current set of keyboard control items, and unregister from map events.
     * @return {?}
     */
    function () {
        this.unregisterEvents();
        this._currentDefinitions = null;
    };
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     */
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     * @private
     * @param {?} char
     * @return {?}
     */
    KeyboardControlService.prototype.getAction = /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     * @private
     * @param {?} char
     * @return {?}
     */
    function (char) {
        return this._currentDefinitions[char] || null;
    };
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     * @private
     * @param {?} keyEvent
     * @return {?}
     */
    KeyboardControlService.prototype.defaultKeyMappingFn = /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     * @private
     * @param {?} keyEvent
     * @return {?}
     */
    function (keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    };
    /**
     * document's `keydown` event handler
     */
    /**
     * document's `keydown` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    KeyboardControlService.prototype.handleKeydown = /**
     * document's `keydown` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        /** @type {?} */
        var char = this._keyMappingFn(e);
        /** @type {?} */
        var action = this.getAction(char);
        if (action) {
            /** @type {?} */
            var actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                /** @type {?} */
                var execute = true;
                /** @type {?} */
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
    /**
     * document's `keyup` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    KeyboardControlService.prototype.handleKeyup = /**
     * document's `keyup` event handler
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        /** @type {?} */
        var char = this._keyMappingFn(e);
        /** @type {?} */
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
    /**
     * `tick` event handler that triggered by Cesium render loop
     * @private
     * @return {?}
     */
    KeyboardControlService.prototype.handleTick = /**
     * `tick` event handler that triggered by Cesium render loop
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            /** @type {?} */
            var actionState = _this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                _this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        }));
    };
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     */
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
    KeyboardControlService.prototype.getParams = /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     * @private
     * @param {?} paramsDef
     * @param {?} keyboardEvent
     * @return {?}
     */
    function (paramsDef, keyboardEvent) {
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
    KeyboardControlService.prototype.executeAction = /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     * @private
     * @param {?} execution
     * @param {?} key
     * @param {?} keyboardEvent
     * @return {?}
     */
    function (execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        /** @type {?} */
        var params = this.getParams(execution.params, keyboardEvent);
        if (isNumber(execution.action)) {
            /** @type {?} */
            var predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[(/** @type {?} */ (execution.action))];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            /** @type {?} */
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
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @param {?} outsideOfAngularZone
     * @return {?}
     */
    KeyboardControlService.prototype.registerEvents = /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @param {?} outsideOfAngularZone
     * @return {?}
     */
    function (outsideOfAngularZone) {
        var _this = this;
        /** @type {?} */
        var registerToEvents = (/**
         * @return {?}
         */
        function () {
            _this.document.addEventListener('keydown', _this.handleKeydown);
            _this.document.addEventListener('keyup', _this.handleKeyup);
            _this.cesiumService.getViewer().clock.onTick.addEventListener(_this.handleTick);
        });
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
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @return {?}
     */
    KeyboardControlService.prototype.unregisterEvents = /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     * @private
     * @return {?}
     */
    function () {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    };
    KeyboardControlService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    KeyboardControlService.ctorParameters = function () { return [
        { type: NgZone },
        { type: CesiumService },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    return KeyboardControlService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CesiumPureEventObserver = /** @class */ (function () {
    function CesiumPureEventObserver(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    /**
     * @param {?} eventsHandler
     * @return {?}
     */
    CesiumPureEventObserver.prototype.init = /**
     * @param {?} eventsHandler
     * @return {?}
     */
    function (eventsHandler) {
        var _this = this;
        this.observer = Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            eventsHandler.setInputAction((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }), _this.event, _this.modifier);
        }));
        return this.observer;
    };
    return CesiumPureEventObserver;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CesiumLongPressObserver = /** @class */ (function (_super) {
    __extends(CesiumLongPressObserver, _super);
    function CesiumLongPressObserver(event, modifier, eventFactory) {
        var _this = _super.call(this, event, modifier) || this;
        _this.event = event;
        _this.modifier = modifier;
        _this.eventFactory = eventFactory;
        return _this;
    }
    /**
     * @return {?}
     */
    CesiumLongPressObserver.prototype.init = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var startEvent;
        /** @type {?} */
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
        /** @type {?} */
        var startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        /** @type {?} */
        var stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);
        // publish for preventing side effect
        /** @type {?} */
        var longPressObservable = publish()(startEventObservable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return of(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable)); }))));
        return longPressObservable;
    };
    CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;
    return CesiumLongPressObserver;
}(CesiumPureEventObserver));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CesiumEventBuilder = /** @class */ (function () {
    function CesiumEventBuilder(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.getEventFullName = /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        if (modifier) {
            return event + "_" + modifier;
        }
        else {
            return event.toString();
        }
    };
    /**
     * @return {?}
     */
    CesiumEventBuilder.prototype.init = /**
     * @return {?}
     */
    function () {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    };
    /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.get = /**
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        /** @type {?} */
        var eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            /** @type {?} */
            var eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    };
    /**
     * @private
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.createCesiumEventObservable = /**
     * @private
     * @param {?} event
     * @param {?=} modifier
     * @return {?}
     */
    function (event, modifier) {
        /** @type {?} */
        var cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    };
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @return {?}
     */
    CesiumEventBuilder.prototype.createSpecialCesiumEventObservable = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @return {?}
     */
    function (event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    };
    CesiumEventBuilder.longPressEvents = new Set([
        CesiumEvent.LONG_LEFT_PRESS,
        CesiumEvent.LONG_RIGHT_PRESS,
        CesiumEvent.LONG_MIDDLE_PRESS
    ]);
    CesiumEventBuilder.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumEventBuilder.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CesiumEventBuilder;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        get: /**
         * @return {?}
         */
        function () {
            return this._plonterChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterShown", {
        get: /**
         * @return {?}
         */
        function () {
            return this._plonterShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "entitesToPlonter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._entitesToPlonter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlonterService.prototype, "plonterClickPosition", {
        get: /**
         * @return {?}
         */
        function () {
            return this._eventResult.movement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} eventResult
     * @return {?}
     */
    PlonterService.prototype.plonterIt = /**
     * @param {?} eventResult
     * @return {?}
     */
    function (eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    PlonterService.prototype.resolvePlonter = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    };
    PlonterService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PlonterService.ctorParameters = function () { return []; };
    return PlonterService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var UtilsService = {
    unique: (/**
     * @param {?} array
     * @return {?}
     */
    function (array) {
        return array.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        function (accumulator, currentValue) {
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
var CesiumDragDropHelper = /** @class */ (function () {
    function CesiumDragDropHelper() {
    }
    /**
     * @param {?} dragEvent
     * @return {?}
     */
    CesiumDragDropHelper.getDragEventTypes = /**
     * @param {?} dragEvent
     * @return {?}
     */
    function (dragEvent) {
        /** @type {?} */
        var mouseDownEvent;
        /** @type {?} */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @return {?}
     */
    MapEventsManagerService.prototype.init = /**
     * @return {?}
     */
    function () {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    };
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    MapEventsManagerService.prototype.register = /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    function (input) {
        var _this = this;
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
        var eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        /** @type {?} */
        var eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority, input.pickFilter);
        /** @type {?} */
        var registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = (/**
         * @return {?}
         */
        function () { return _this.disposeObservable(eventRegistration, eventName); });
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return (/** @type {?} */ (registrationObservable));
    };
    /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    MapEventsManagerService.prototype.disposeObservable = /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    function (eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        /** @type {?} */
        var registrations = this.eventRegistrations.get(eventName);
        /** @type {?} */
        var index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    };
    /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    MapEventsManagerService.prototype.sortRegistrationsByPriority = /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) {
        /** @type {?} */
        var registrations = this.eventRegistrations.get(eventName);
        registrations.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return b.priority - a.priority; }));
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        /** @type {?} */
        var currentPriority = registrations[0].priority;
        registrations.forEach((/**
         * @param {?} registration
         * @return {?}
         */
        function (registration) {
            registration.isPaused = registration.priority < currentPriority;
        }));
    };
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
    MapEventsManagerService.prototype.createEventRegistration = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    function (event, modifier, entityType, pickOption, priority, pickFilter) {
        var _this = this;
        /** @type {?} */
        var cesiumEventObservable = this.eventBuilder.get(event, modifier);
        /** @type {?} */
        var stopper = new Subject();
        /** @type {?} */
        var registration = new Registration(undefined, stopper, priority, false);
        /** @type {?} */
        var observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter((/**
             * @return {?}
             */
            function () { return !registration.isPaused; })), map((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) { return _this.triggerPick(movement, pickOption); })), filter((/**
             * @param {?} result
             * @return {?}
             */
            function (result) { return result.cesiumEntities !== null || entityType === undefined; })), map((/**
             * @param {?} picksAndMovement
             * @return {?}
             */
            function (picksAndMovement) { return _this.addEntities(picksAndMovement, entityType, pickOption, pickFilter); })), filter((/**
             * @param {?} result
             * @return {?}
             */
            function (result) { return result.entities !== null || (entityType === undefined && !pickFilter); })), switchMap((/**
             * @param {?} entitiesAndMovement
             * @return {?}
             */
            function (entitiesAndMovement) { return _this.plonter(entitiesAndMovement, pickOption); })), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    };
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
    MapEventsManagerService.prototype.createDragEvent = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    function (event, modifier, entityType, pickOption, priority, pickFilter) {
        var _a = CesiumDragDropHelper.getDragEventTypes(event), mouseDownEvent = _a.mouseDownEvent, mouseUpEvent = _a.mouseUpEvent;
        /** @type {?} */
        var mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        /** @type {?} */
        var mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        /** @type {?} */
        var mouseDownRegistration = this.createEventRegistration(mouseDownEvent, modifier, entityType, pickOption, priority, pickFilter);
        /** @type {?} */
        var dropSubject = new Subject();
        /** @type {?} */
        var dragObserver = mouseDownRegistration.observable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            /** @type {?} */
            var lastMove = null;
            /** @type {?} */
            var dragStartPositionX = e.movement.startPosition.x;
            /** @type {?} */
            var dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) {
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
            function () {
                // On complete
                if (lastMove) {
                    /** @type {?} */
                    var dropEvent = Object.assign({}, lastMove);
                    dropEvent.movement.drop = true;
                    dropSubject.next(dropEvent);
                }
            })));
        })));
        return merge(dragObserver, dropSubject);
    };
    /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    MapEventsManagerService.prototype.triggerPick = /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    function (movement, pickOptions) {
        /** @type {?} */
        var picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                /** @type {?} */
                var pick = this.scene.pick(movement.endPosition);
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
            function (pick) { return pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive; }));
        }
        return { movement: movement, cesiumEntities: picks };
    };
    /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    MapEventsManagerService.prototype.addEntities = /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    function (picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        /** @type {?} */
        var entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                function (pick) { return pick.acEntity; })).filter((/**
                 * @param {?} acEntity
                 * @return {?}
                 */
                function (acEntity) {
                    return acEntity && acEntity instanceof entityType;
                }));
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                function (pick) { return pick.acEntity; }));
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
    /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    MapEventsManagerService.prototype.plonter = /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    function (entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return of(entitiesAndMovement);
        }
    };
    MapEventsManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapEventsManagerService.ctorParameters = function () { return [
        { type: CesiumService },
        { type: CesiumEventBuilder },
        { type: PlonterService }
    ]; };
    return MapEventsManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var MapLayersService = /** @class */ (function () {
    function MapLayersService(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    MapLayersService.prototype.registerLayerDataSources = /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    function (dataSources, zIndex) {
        var _this = this;
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        function (ds) {
            ds.zIndex = zIndex;
            _this.layersDataSources.push(ds);
        }));
    };
    /**
     * @return {?}
     */
    MapLayersService.prototype.drawAllLayers = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layersDataSources.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return a.zIndex - b.zIndex; }));
        this.layersDataSources.forEach((/**
         * @param {?} dataSource
         * @return {?}
         */
        function (dataSource) {
            _this.cesiumService.getViewer().dataSources.add(dataSource);
        }));
    };
    /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    MapLayersService.prototype.updateAndRefresh = /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    function (dataSources, newZIndex) {
        var _this = this;
        if (dataSources && dataSources.length) {
            dataSources.forEach((/**
             * @param {?} ds
             * @return {?}
             */
            function (ds) {
                /** @type {?} */
                var index = _this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    _this.layersDataSources[index].zIndex = newZIndex;
                }
            }));
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    };
    /**
     * @param {?} dataSources
     * @return {?}
     */
    MapLayersService.prototype.removeDataSources = /**
     * @param {?} dataSources
     * @return {?}
     */
    function (dataSources) {
        var _this = this;
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        function (ds) {
            /** @type {?} */
            var index = _this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                _this.layersDataSources.splice(index, 1);
                _this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        }));
    };
    MapLayersService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapLayersService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return MapLayersService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?=} id
     * @return {?}
     */
    MapsManagerService.prototype.getMap = /**
     * @param {?=} id
     * @return {?}
     */
    function (id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    };
    /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    MapsManagerService.prototype._registerMap = /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    function (id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        /** @type {?} */
        var mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error("Map with id: " + mapId + " already exist");
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    MapsManagerService.prototype._removeMapById = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            /** @type {?} */
            var iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    };
    /**
     * @private
     * @return {?}
     */
    MapsManagerService.prototype.generateDefaultId = /**
     * @private
     * @return {?}
     */
    function () {
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
    /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    MapsManagerService.prototype.sync2DMapsCameras = /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    function (mapsConfiguration) {
        var _this = this;
        /** @type {?} */
        var DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        /** @type {?} */
        var maps = mapsConfiguration.map((/**
         * @param {?} config
         * @return {?}
         */
        function (config) {
            /** @type {?} */
            var map$$1 = _this.getMap(config.id);
            if (!map$$1) {
                throw new Error("Couldn't find map with id: " + config.id);
            }
            return { map: map$$1, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        }));
        maps.forEach((/**
         * @param {?} masterMapConfig
         * @return {?}
         */
        function (masterMapConfig) {
            /** @type {?} */
            var masterMap = masterMapConfig.map;
            /** @type {?} */
            var options = masterMapConfig.options;
            /** @type {?} */
            var masterCamera = masterMap.getCameraService().getCamera();
            /** @type {?} */
            var masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            /** @type {?} */
            var removeCallback = masterCamera.changed.addEventListener((/**
             * @return {?}
             */
            function () {
                maps.forEach((/**
                 * @param {?} slaveMapConfig
                 * @return {?}
                 */
                function (slaveMapConfig) {
                    /** @type {?} */
                    var slaveMap = slaveMapConfig.map;
                    /** @type {?} */
                    var slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    /** @type {?} */
                    var slaveCamera = slaveMap.getCameraService().getCamera();
                    /** @type {?} */
                    var slaveCameraCartographic = slaveCamera.positionCartographic;
                    /** @type {?} */
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
                }));
            }));
            _this.eventRemoveCallbacks.push(removeCallback);
        }));
    };
    /**
     * Unsyncs maps cameras
     */
    /**
     * Unsyncs maps cameras
     * @return {?}
     */
    MapsManagerService.prototype.unsyncMapsCameras = /**
     * Unsyncs maps cameras
     * @return {?}
     */
    function () {
        this.eventRemoveCallbacks.forEach((/**
         * @param {?} removeCallback
         * @return {?}
         */
        function (removeCallback) { return removeCallback(); }));
        this.eventRemoveCallbacks = [];
    };
    MapsManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapsManagerService.ctorParameters = function () { return []; };
    return MapsManagerService;
}());

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
var ScreenshotService = /** @class */ (function () {
    function ScreenshotService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @return {?}
     */
    ScreenshotService.prototype.getMapScreenshotDataUrlBase64 = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    };
    /**
     * @param {?=} filename
     * @return {?}
     */
    ScreenshotService.prototype.downloadMapScreenshot = /**
     * @param {?=} filename
     * @return {?}
     */
    function (filename) {
        if (filename === void 0) { filename = 'map.png'; }
        /** @type {?} */
        var dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    };
    /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    ScreenshotService.prototype.downloadURI = /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    function (uri, name) {
        /** @type {?} */
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    ScreenshotService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ScreenshotService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return ScreenshotService;
}());

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
    /**
     * @return {?}
     */
    AcMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcMapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            /** @type {?} */
            var element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error("No element found with id: " + changes['containerId'].currentValue);
            }
        }
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var element = _this.document.getElementById(_this.containerId);
                if (element) {
                    element.appendChild(_this.mapContainer);
                }
                else {
                    throw new Error("No element found with id: " + _this.containerId);
                }
            }), 0);
        }
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    };
    /**
     * @returns ac-map's cesium service
     */
    /**
     * @return {?} ac-map's cesium service
     */
    AcMapComponent.prototype.getCesiumSerivce = /**
     * @return {?} ac-map's cesium service
     */
    function () {
        return this._cesiumService;
    };
    /**
     * @returns map's cesium viewer
     */
    /**
     * @return {?} map's cesium viewer
     */
    AcMapComponent.prototype.getCesiumViewer = /**
     * @return {?} map's cesium viewer
     */
    function () {
        return this._cesiumService.getViewer();
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getCameraService = /**
     * @return {?}
     */
    function () {
        return this._cameraService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.mapId;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getMapContainer = /**
     * @return {?}
     */
    function () {
        return this.mapContainer;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getMapEventsManager = /**
     * @return {?}
     */
    function () {
        return this.mapEventsManager;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getContextMenuService = /**
     * @return {?}
     */
    function () {
        return this.contextMenuService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getScreenshotService = /**
     * @return {?}
     */
    function () {
        return this.screenshotService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getKeyboardControlService = /**
     * @return {?}
     */
    function () {
        return this.keyboardControlService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getCoordinateConverter = /**
     * @return {?}
     */
    function () {
        return this.coordinateConverter;
    };
    AcMapComponent.decorators = [
        { type: Component, args: [{
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
                }] }
    ];
    /** @nocollapse */
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
    AcMapComponent.propDecorators = {
        disableDefaultPlonter: [{ type: Input }],
        mapId: [{ type: Input }],
        flyTo: [{ type: Input }],
        sceneMode: [{ type: Input }],
        containerId: [{ type: Input }]
    };
    return AcMapComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LayerService = /** @class */ (function () {
    function LayerService() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    Object.defineProperty(LayerService.prototype, "cache", {
        get: /**
         * @return {?}
         */
        function () {
            return this._cache;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._cache = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "zIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return this._zIndex;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== this._zIndex) {
                this.layerUpdate.emit();
            }
            this._zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== this._show) {
                this.layerUpdate.emit();
            }
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "options", {
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._options = value;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "context", {
        get: /**
         * @return {?}
         */
        function () {
            return this._context;
        },
        set: /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            this._context = context;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} name
     * @return {?}
     */
    LayerService.prototype.setEntityName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        this._entityName = name;
    };
    /**
     * @return {?}
     */
    LayerService.prototype.getEntityName = /**
     * @return {?}
     */
    function () {
        return this._entityName;
    };
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    LayerService.prototype.registerDescription = /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    function (descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    };
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    LayerService.prototype.unregisterDescription = /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    function (descriptionComponent) {
        /** @type {?} */
        var index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    };
    /**
     * @return {?}
     */
    LayerService.prototype.getDescriptions = /**
     * @return {?}
     */
    function () {
        return this.descriptions;
    };
    /**
     * @return {?}
     */
    LayerService.prototype.layerUpdates = /**
     * @return {?}
     */
    function () {
        return this.layerUpdate;
    };
    LayerService.decorators = [
        { type: Injectable }
    ];
    return LayerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var ActionType = {
    ADD_UPDATE: 0,
    DELETE: 1,
};
ActionType[ActionType.ADD_UPDATE] = 'ADD_UPDATE';
ActionType[ActionType.DELETE] = 'DELETE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ComputationCache = /** @class */ (function () {
    function ComputationCache() {
        this._cache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    ComputationCache.prototype.get = /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    function (expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        /** @type {?} */
        var value = insertFn();
        this._cache.set(expression, value);
        return value;
    };
    /**
     * @return {?}
     */
    ComputationCache.prototype.clear = /**
     * @return {?}
     */
    function () {
        this._cache.clear();
    };
    ComputationCache.decorators = [
        { type: Injectable }
    ];
    return ComputationCache;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var Checker = /** @class */ (function () {
    function Checker() {
    }
    /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    Checker.throwIfAnyNotPresent = /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    function (values, propertyNames) {
        propertyNames.forEach((/**
         * @param {?} propertyName
         * @return {?}
         */
        function (propertyName) { return Checker.throwIfNotPresent(values, propertyName); }));
    };
    /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    Checker.throwIfNotPresent = /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    function (value, name) {
        if (!Checker.present(value[name])) {
            throw new Error("Error: " + name + " was not given.");
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Checker.present = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value !== undefined && value !== null;
    };
    return Checker;
}());

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
var DynamicEllipseDrawerService = /** @class */ (function (_super) {
    __extends(DynamicEllipseDrawerService, _super);
    function DynamicEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    DynamicEllipseDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return _super.prototype.add.call(this, new EllipsePrimitive(cesiumProps));
    };
    /**
     * @param {?} ellipse
     * @param {?} cesiumProps
     * @return {?}
     */
    DynamicEllipseDrawerService.prototype.update = /**
     * @param {?} ellipse
     * @param {?} cesiumProps
     * @return {?}
     */
    function (ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    };
    DynamicEllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DynamicEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return DynamicEllipseDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
var DynamicPolylineDrawerService = /** @class */ (function (_super) {
    __extends(DynamicPolylineDrawerService, _super);
    function DynamicPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    DynamicPolylineDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DynamicPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return DynamicPolylineDrawerService;
}(PrimitivesDrawerService));

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
var  /**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
StaticPrimitiveDrawer = /** @class */ (function (_super) {
    __extends(StaticPrimitiveDrawer, _super);
    function StaticPrimitiveDrawer(geometryType, cesiumService) {
        var _this = _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
        _this.geometryType = geometryType;
        return _this;
    }
    /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPrimitiveDrawer.prototype.add = /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        /** @type {?} */
        var primitive = new Cesium.Primitive(primitiveProps);
        return _super.prototype.add.call(this, primitive);
    };
    /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPrimitiveDrawer.prototype.update = /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return _super.prototype.add.call(this, new Cesium.Primitive(primitiveProps));
    };
    return StaticPrimitiveDrawer;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
var StaticCircleDrawerService = /** @class */ (function (_super) {
    __extends(StaticCircleDrawerService, _super);
    function StaticCircleDrawerService(cesiumService) {
        return _super.call(this, Cesium.CircleGeometry, cesiumService) || this;
    }
    StaticCircleDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticCircleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticCircleDrawerService;
}(StaticPrimitiveDrawer));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPolylineDrawerService.prototype.update = /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (primitive, geometryProps, instanceProps, primitiveProps) {
        /** @type {?} */
        var color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((/**
             * @param {?} readyPrimitive
             * @return {?}
             */
            function (readyPrimitive) {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            }));
        }
        return primitive;
    };
    StaticPolylineDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticPolylineDrawerService;
}(StaticPrimitiveDrawer));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * + This drawer is responsible for drawing a polygon over the Cesium map.
 * + This implementation uses simple PolygonGeometry and Primitive parameters.
 * + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
var StaticPolygonDrawerService = /** @class */ (function (_super) {
    __extends(StaticPolygonDrawerService, _super);
    function StaticPolygonDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolygonGeometry, cesiumService) || this;
    }
    StaticPolygonDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticPolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticPolygonDrawerService;
}(StaticPrimitiveDrawer));

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
var StaticEllipseDrawerService = /** @class */ (function (_super) {
    __extends(StaticEllipseDrawerService, _super);
    function StaticEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.EllipseGeometry, cesiumService) || this;
    }
    StaticEllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticEllipseDrawerService;
}(StaticPrimitiveDrawer));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing models.
 */
var ModelDrawerService = /** @class */ (function (_super) {
    __extends(ModelDrawerService, _super);
    function ModelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.model) || this;
    }
    ModelDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ModelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return ModelDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing box.
 */
var BoxDrawerService = /** @class */ (function (_super) {
    __extends(BoxDrawerService, _super);
    function BoxDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.box) || this;
    }
    BoxDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BoxDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return BoxDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing corridors .
 */
var CorridorDrawerService = /** @class */ (function (_super) {
    __extends(CorridorDrawerService, _super);
    function CorridorDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.corridor) || this;
    }
    CorridorDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CorridorDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CorridorDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing cylinders.
 */
var CylinderDrawerService = /** @class */ (function (_super) {
    __extends(CylinderDrawerService, _super);
    function CylinderDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.cylinder) || this;
    }
    CylinderDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CylinderDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CylinderDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
var EllipsoidDrawerService = /** @class */ (function (_super) {
    __extends(EllipsoidDrawerService, _super);
    function EllipsoidDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipsoid) || this;
    }
    EllipsoidDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EllipsoidDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return EllipsoidDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polylines.
 */
var PolylineVolumeDrawerService = /** @class */ (function (_super) {
    __extends(PolylineVolumeDrawerService, _super);
    function PolylineVolumeDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polylineVolume) || this;
    }
    PolylineVolumeDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolylineVolumeDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolylineVolumeDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing polygons.
 */
var WallDrawerService = /** @class */ (function (_super) {
    __extends(WallDrawerService, _super);
    function WallDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.wall) || this;
    }
    WallDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    WallDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return WallDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing rectangle.
 */
var RectangleDrawerService = /** @class */ (function (_super) {
    __extends(RectangleDrawerService, _super);
    function RectangleDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.rectangle) || this;
    }
    RectangleDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    RectangleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return RectangleDrawerService;
}(EntitiesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
var LabelPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(LabelPrimitiveDrawerService, _super);
    function LabelPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.LabelCollection, cesiumService) || this;
    }
    LabelPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    LabelPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return LabelPrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
var BillboardPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(BillboardPrimitiveDrawerService, _super);
    function BillboardPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.BillboardCollection, cesiumService) || this;
    }
    BillboardPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BillboardPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return BillboardPrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
var PointPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PointPrimitiveDrawerService, _super);
    function PointPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PointPrimitiveCollection, cesiumService) || this;
    }
    PointPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PointPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PointPrimitiveDrawerService;
}(PrimitivesDrawerService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var HtmlDrawerService = /** @class */ (function (_super) {
    __extends(HtmlDrawerService, _super);
    function HtmlDrawerService(_cesiumService) {
        var _this = _super.call(this, Cesium.HtmlCollection, _cesiumService) || this;
        _this._cesiumService = _cesiumService;
        return _this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    HtmlDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return _super.prototype.add.call(this, cesiumProps);
    };
    HtmlDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    HtmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return HtmlDrawerService;
}(PrimitivesDrawerService));

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
var AcLayerComponent = /** @class */ (function () {
    function AcLayerComponent(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
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
    AcLayerComponent.prototype.init = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.initValidParams();
        merge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((/**
         * @param {?} notification
         * @return {?}
         */
        function (notification) {
            _this._computationCache.clear();
            /** @type {?} */
            var contextEntity = notification.entity;
            if (_this.store) {
                contextEntity = _this.updateStore(notification);
            }
            _this.context[_this.entityName] = contextEntity;
            _this.layerService.getDescriptions().forEach((/**
             * @param {?} descriptionComponent
             * @return {?}
             */
            function (descriptionComponent) {
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
            }));
        }));
    };
    /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    AcLayerComponent.prototype.updateStore = /**
     * @private
     * @param {?} notification
     * @return {?}
     */
    function (notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                /** @type {?} */
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
    /**
     * @private
     * @return {?}
     */
    AcLayerComponent.prototype.initValidParams = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + this.acFor);
        }
        /** @type {?} */
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
    /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    AcLayerComponent.prototype.isObservable = /**
     * Test for a rxjs Observable
     * @private
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this.init();
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((/**
         * @param {?} drawer
         * @param {?} drawerName
         * @return {?}
         */
        function (drawer, drawerName) {
            var _a;
            /** @type {?} */
            var initOptions = _this.options ? _this.options[drawerName] : undefined;
            /** @type {?} */
            var drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                (_a = _this.layerDrawerDataSources).push.apply(_a, __spread(drawerDataSources));
            }
            drawer.setShow(_this.show);
        }));
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.show && !changes.show.firstChange) {
            /** @type {?} */
            var showValue_1 = changes['show'].currentValue;
            this.layerService.show = showValue_1;
            this._drawerList.forEach((/**
             * @param {?} drawer
             * @return {?}
             */
            function (drawer) { return drawer.setShow(showValue_1); }));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            /** @type {?} */
            var zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    };
    /**
     * @return {?}
     */
    AcLayerComponent.prototype.getLayerService = /**
     * @return {?}
     */
    function () {
        return this.layerService;
    };
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getLayerDrawerDataSources = /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return {?} Array of Cesium.DataSources
     */
    function () {
        return this.layerDrawerDataSources;
    };
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    AcLayerComponent.prototype.getDrawerDataSourcesByName = /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @param {?} name
     * @return {?} Array of Cesium.DataSources
     */
    function (name) {
        return this.layerDrawerDataSources.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.name === name; }));
    };
    /**
     * Returns the store.
     */
    /**
     * Returns the store.
     * @return {?}
     */
    AcLayerComponent.prototype.getStore = /**
     * Returns the store.
     * @return {?}
     */
    function () {
        return this.entitiesStore;
    };
    /**
     * Remove all the entities from the layer.
     */
    /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    AcLayerComponent.prototype.removeAll = /**
     * Remove all the entities from the layer.
     * @return {?}
     */
    function () {
        this.layerService.getDescriptions().forEach((/**
         * @param {?} description
         * @return {?}
         */
        function (description) { return description.removeAll(); }));
        this.entitiesStore.clear();
    };
    /**
     * remove entity from the layer
     */
    /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    AcLayerComponent.prototype.remove = /**
     * remove entity from the layer
     * @param {?} entityId
     * @return {?}
     */
    function (entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    };
    /**
     * add/update entity to/from the layer
     */
    /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    AcLayerComponent.prototype.updateNotification = /**
     * add/update entity to/from the layer
     * @param {?} notification
     * @return {?}
     */
    function (notification) {
        this._updateStream.next(notification);
    };
    /**
     * add/update entity to/from the layer
     */
    /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    AcLayerComponent.prototype.update = /**
     * add/update entity to/from the layer
     * @param {?} entity
     * @param {?} id
     * @return {?}
     */
    function (entity, id) {
        this._updateStream.next({ entity: entity, id: id, actionType: ActionType.ADD_UPDATE });
    };
    /**
     * @param {?} collection
     * @return {?}
     */
    AcLayerComponent.prototype.refreshAll = /**
     * @param {?} collection
     * @return {?}
     */
    function (collection) {
        var _this = this;
        // TODO make entity interface: collection of type entity not notification
        from(collection).subscribe((/**
         * @param {?} entity
         * @return {?}
         */
        function (entity) { return _this._updateStream.next(entity); }));
    };
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
    AcLayerComponent.propDecorators = {
        show: [{ type: Input }],
        acFor: [{ type: Input }],
        context: [{ type: Input }],
        store: [{ type: Input }],
        options: [{ type: Input }],
        zIndex: [{ type: Input }]
    };
    return AcLayerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Extend this class to create drawing on map components.
 */
var EntityOnMapComponent = /** @class */ (function () {
    function EntityOnMapComponent(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = false;
        /** @type {?} */
        var dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.removeFromMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    };
    EntityOnMapComponent.propDecorators = {
        props: [{ type: Input }]
    };
    return EntityOnMapComponent;
}());

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
var AcBillboardComponent = /** @class */ (function (_super) {
    __extends(AcBillboardComponent, _super);
    function AcBillboardComponent(billboardDrawer, mapLayers) {
        return _super.call(this, billboardDrawer, mapLayers) || this;
    }
    AcBillboardComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-billboard',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcBillboardComponent.ctorParameters = function () { return [
        { type: BillboardDrawerService },
        { type: MapLayersService }
    ]; };
    return AcBillboardComponent;
}(EntityOnMapComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    BasicDesc.prototype._propsEvaluator = /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this._propsEvaluateFn(this._computationCache, context);
    };
    /**
     * @protected
     * @return {?}
     */
    BasicDesc.prototype._getPropsAssigner = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        function (cesiumObject, desc) { return _this._propsAssignerFn(cesiumObject, desc); });
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.getLayerService = /**
     * @return {?}
     */
    function () {
        return this._layerService;
    };
    /**
     * @param {?} layerService
     * @return {?}
     */
    BasicDesc.prototype.setLayerService = /**
     * @param {?} layerService
     * @return {?}
     */
    function (layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.getCesiumObjectsMap = /**
     * @return {?}
     */
    function () {
        return this._cesiumObjectsMap;
    };
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    BasicDesc.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    function (context, id, entity) {
        /** @type {?} */
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
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
            /** @type {?} */
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
    /**
     * @param {?} id
     * @return {?}
     */
    BasicDesc.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
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
    /**
     * @return {?}
     */
    BasicDesc.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    };
    BasicDesc.propDecorators = {
        props: [{ type: Input }],
        onDraw: [{ type: Output }],
        onRemove: [{ type: Output }]
    };
    return BasicDesc;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var JsonMapper = /** @class */ (function () {
    function JsonMapper() {
        this._mapper = new JsonStringMapper();
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    JsonMapper.prototype.map = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        return this._mapper.map(expression);
    };
    JsonMapper.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    JsonMapper.ctorParameters = function () { return []; };
    return JsonMapper;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Service for effective assignment.
 */
var /**
 * Service for effective assignment.
 */
SmartAssigner = /** @class */ (function () {
    function SmartAssigner() {
    }
    /**
     * @param {?=} props
     * @param {?=} allowUndefined
     * @return {?}
     */
    SmartAssigner.create = /**
     * @param {?=} props
     * @param {?=} allowUndefined
     * @return {?}
     */
    function (props, allowUndefined) {
        if (props === void 0) { props = []; }
        if (allowUndefined === void 0) { allowUndefined = true; }
        /** @type {?} */
        var fnBody = "";
        props.forEach((/**
         * @param {?} prop
         * @return {?}
         */
        function (prop) {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += "if (!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty) && obj2['" + prop + "'] !== undefined) { obj1['" + prop + "'] = obj2['" + prop + "']; } ";
            }
            else {
                fnBody += "if(!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty))obj1['" + prop + "'] = obj2['" + prop + "']; ";
            }
        }));
        fnBody += "return obj1";
        /** @type {?} */
        var assignFn = new Function('obj1', 'obj2', fnBody);
        return (/**
         * @param {?} obj1
         * @param {?} obj2
         * @return {?}
         */
        function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        });
    };
    return SmartAssigner;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CesiumProperties = /** @class */ (function () {
    function CesiumProperties(_parser, _jsonMapper) {
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
    CesiumProperties.prototype._compile = /**
     * @param {?} expression
     * @param {?=} withCache
     * @return {?}
     */
    function (expression, withCache) {
        var _this = this;
        if (withCache === void 0) { withCache = true; }
        /** @type {?} */
        var cesiumDesc = {};
        /** @type {?} */
        var propsMap = new Map();
        /** @type {?} */
        var resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((/**
         * @param {?} resultExpression
         * @param {?} prop
         * @return {?}
         */
        function (resultExpression, prop) { return propsMap.set(prop, {
            expression: resultExpression,
            get: _this._parser.eval(resultExpression)
        }); }));
        propsMap.forEach((/**
         * @param {?} value
         * @param {?} prop
         * @return {?}
         */
        function (value, prop) {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = "cache.get(`" + value.expression + "`, () => propsMap.get('" + prop + "').get(context))";
            }
            else {
                cesiumDesc[prop || 'undefined'] = "propsMap.get('" + prop + "').get(context)";
            }
        }));
        /** @type {?} */
        var fnBody = "return " + JSON.stringify(cesiumDesc).replace(/"/g, '') + ";";
        /** @type {?} */
        var getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return (/**
         * @param {?} cache
         * @param {?} context
         * @return {?}
         */
        function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        });
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    CesiumProperties.prototype._build = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        /** @type {?} */
        var props = Array.from(this._jsonMapper.map(expression).keys());
        /** @type {?} */
        var smartAssigner = SmartAssigner.create(props);
        return (/**
         * @param {?} oldVal
         * @param {?} newVal
         * @return {?}
         */
        function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        });
    };
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    CesiumProperties.prototype.createEvaluator = /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    function (expression, withCache, newEvaluator) {
        if (withCache === void 0) { withCache = true; }
        if (newEvaluator === void 0) { newEvaluator = false; }
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        /** @type {?} */
        var evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    CesiumProperties.prototype.createAssigner = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        /** @type {?} */
        var assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    };
    CesiumProperties.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumProperties.ctorParameters = function () { return [
        { type: Parse },
        { type: JsonMapper }
    ]; };
    return CesiumProperties;
}());

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
var AcBillboardDescComponent = /** @class */ (function (_super) {
    __extends(AcBillboardDescComponent, _super);
    function AcBillboardDescComponent(billboardDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-billboard-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcBillboardDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcBillboardDescComponent.ctorParameters = function () { return [
        { type: BillboardDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcBillboardDescComponent;
}(BasicDesc));

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
var AcEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcEllipseDescComponent, _super);
    function AcEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcEllipseDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-ellipse-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcEllipseDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcEllipseDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcEllipseDescComponent;
}(BasicDesc));

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
var AcPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylineDescComponent, _super);
    function AcPolylineDescComponent(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylineDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPolylineDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPolylineDescComponent.ctorParameters = function () { return [
        { type: PolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolylineDescComponent;
}(BasicDesc));

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
var PixelOffsetPipe = /** @class */ (function () {
    function PixelOffsetPipe() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    PixelOffsetPipe.prototype.transform = /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    function (value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    };
    PixelOffsetPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'pixelOffset'
                },] }
    ];
    return PixelOffsetPipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var RadiansToDegreesPipe = /** @class */ (function () {
    function RadiansToDegreesPipe() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    RadiansToDegreesPipe.prototype.transform = /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    function (value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    };
    RadiansToDegreesPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'radiansToDegrees'
                },] }
    ];
    return RadiansToDegreesPipe;
}());

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
var AcLabelDescComponent = /** @class */ (function (_super) {
    __extends(AcLabelDescComponent, _super);
    function AcLabelDescComponent(labelDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-label-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcLabelDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcLabelDescComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcLabelDescComponent;
}(BasicDesc));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var UtilsModule = /** @class */ (function () {
    function UtilsModule() {
    }
    UtilsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    providers: []
                },] }
    ];
    return UtilsModule;
}());

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
var AcCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcCircleDescComponent, _super);
    function AcCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    AcCircleDescComponent.prototype._propsEvaluator = /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    function (context) {
        /** @type {?} */
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    };
    /**
     * @protected
     * @return {?}
     */
    AcCircleDescComponent.prototype._getPropsAssigner = /**
     * @protected
     * @return {?}
     */
    function () {
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        function (cesiumObject, desc) { return Object.assign(cesiumObject, desc); });
    };
    AcCircleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-circle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcCircleDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcCircleDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcCircleDescComponent;
}(BasicDesc));

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
var AcArcDescComponent = /** @class */ (function (_super) {
    __extends(AcArcDescComponent, _super);
    function AcArcDescComponent(arcDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, arcDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcArcDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-arc-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcArcDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcArcDescComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcArcDescComponent;
}(BasicDesc));

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
var  /**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= new AcEntity({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
AcEntity = /** @class */ (function () {
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
    /**
     * Creates entity from a json
     * @param {?=} json entity object
     * @return {?} entity as AcEntity
     */
    AcEntity.create = /**
     * Creates entity from a json
     * @param {?=} json entity object
     * @return {?} entity as AcEntity
     */
    function (json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    };
    return AcEntity;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// WARNING: interface has both a type and a value, skipping emit
var AcNotification = /** @class */ (function () {
    function AcNotification() {
    }
    return AcNotification;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var MapLayerProviderOptions = {
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
    /**
     * @private
     * @return {?}
     */
    AcMapLayerProviderComponent.prototype.createOfflineMapProvider = /**
     * @private
     * @return {?}
     */
    function () {
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    };
    /**
     * @return {?}
     */
    AcMapLayerProviderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcMapLayerProviderComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    AcMapLayerProviderComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    };
    AcMapLayerProviderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-map-layer-provider',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcMapLayerProviderComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    AcMapLayerProviderComponent.propDecorators = {
        options: [{ type: Input }],
        provider: [{ type: Input }],
        index: [{ type: Input }],
        show: [{ type: Input }],
        alpha: [{ type: Input }],
        brightness: [{ type: Input }],
        contrast: [{ type: Input }]
    };
    return AcMapLayerProviderComponent;
}());

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
var AcPointDescComponent = /** @class */ (function (_super) {
    __extends(AcPointDescComponent, _super);
    function AcPointDescComponent(pointDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-point-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPointDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPointDescComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPointDescComponent;
}(BasicDesc));

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
var AcLabelComponent = /** @class */ (function (_super) {
    __extends(AcLabelComponent, _super);
    function AcLabelComponent(labelDrawer, mapLayers) {
        return _super.call(this, labelDrawer, mapLayers) || this;
    }
    AcLabelComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-label',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcLabelComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: MapLayersService }
    ]; };
    return AcLabelComponent;
}(EntityOnMapComponent));

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
var AcPolylineComponent = /** @class */ (function (_super) {
    __extends(AcPolylineComponent, _super);
    function AcPolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPolylineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPolylineComponent.ctorParameters = function () { return [
        { type: PolylineDrawerService },
        { type: MapLayersService }
    ]; };
    return AcPolylineComponent;
}(EntityOnMapComponent));

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
var AcEllipseComponent = /** @class */ (function (_super) {
    __extends(AcEllipseComponent, _super);
    function AcEllipseComponent(ellipseDrawer, mapLayers) {
        return _super.call(this, ellipseDrawer, mapLayers) || this;
    }
    AcEllipseComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-ellipse',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcEllipseComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    return AcEllipseComponent;
}(EntityOnMapComponent));

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
var AcPointComponent = /** @class */ (function (_super) {
    __extends(AcPointComponent, _super);
    function AcPointComponent(pointDrawer, mapLayers) {
        return _super.call(this, pointDrawer, mapLayers) || this;
    }
    AcPointComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-point',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPointComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: MapLayersService }
    ]; };
    return AcPointComponent;
}(EntityOnMapComponent));

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
var AcHtmlComponent = /** @class */ (function () {
    function AcHtmlComponent(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    /**
     * @param {?} screenPosition
     * @return {?}
     */
    AcHtmlComponent.prototype.setScreenPosition = /**
     * @param {?} screenPosition
     * @return {?}
     */
    function (screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', screenPosition.y + "px");
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', screenPosition.x + "px");
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.remove = /**
     * @return {?}
     */
    function () {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.hideElement = /**
     * @return {?}
     */
    function () {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', "none");
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.add = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.cesiumService.getScene(), _this.props.position);
                _this.setScreenPosition(screenPosition);
            });
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', "block");
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.remove();
    };
    AcHtmlComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-html',
                    template: "<ng-content></ng-content>",
                    styles: [":host {\n                position: absolute;\n                z-index: 100;\n\t\t\t\t}"]
                }] }
    ];
    /** @nocollapse */
    AcHtmlComponent.ctorParameters = function () { return [
        { type: CesiumService },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    AcHtmlComponent.propDecorators = {
        props: [{ type: Input }]
    };
    return AcHtmlComponent;
}());

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
var AcCircleComponent = /** @class */ (function (_super) {
    __extends(AcCircleComponent, _super);
    function AcCircleComponent(ellipseDrawerService, mapLayers) {
        return _super.call(this, ellipseDrawerService, mapLayers) || this;
    }
    /**
     * @private
     * @return {?}
     */
    AcCircleComponent.prototype.updateEllipseProps = /**
     * @private
     * @return {?}
     */
    function () {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    };
    /**
     * @return {?}
     */
    AcCircleComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.updateEllipseProps();
        _super.prototype.drawOnMap.call(this);
    };
    /**
     * @return {?}
     */
    AcCircleComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        this.updateEllipseProps();
        _super.prototype.updateOnMap.call(this);
    };
    AcCircleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-circle',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcCircleComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    return AcCircleComponent;
}(EntityOnMapComponent));

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
var AcArcComponent = /** @class */ (function (_super) {
    __extends(AcArcComponent, _super);
    function AcArcComponent(arcDrawer, mapLayers) {
        return _super.call(this, arcDrawer, mapLayers) || this;
    }
    /**
     * @return {?}
     */
    AcArcComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    };
    /**
     * @return {?}
     */
    AcArcComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcArcComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var geometryProps = changes['geometryProps'];
        /** @type {?} */
        var instanceProps = changes['instanceProps'];
        /** @type {?} */
        var primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    };
    AcArcComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-arc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcArcComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: MapLayersService }
    ]; };
    AcArcComponent.propDecorators = {
        geometryProps: [{ type: Input }],
        instanceProps: [{ type: Input }],
        primitiveProps: [{ type: Input }]
    };
    return AcArcComponent;
}(EntityOnMapComponent));

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
var AcPolygonDescComponent = /** @class */ (function (_super) {
    __extends(AcPolygonDescComponent, _super);
    function AcPolygonDescComponent(polygonDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polygonDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolygonDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polygon-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPolygonDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPolygonDescComponent.ctorParameters = function () { return [
        { type: PolygonDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolygonDescComponent;
}(BasicDesc));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AcDefaultPlonterComponent = /** @class */ (function () {
    function AcDefaultPlonterComponent(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    /**
     * @return {?}
     */
    AcDefaultPlonterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.plonterService.plonterChangeNotifier.subscribe((/**
         * @return {?}
         */
        function () { return _this.cd.detectChanges(); }));
    };
    Object.defineProperty(AcDefaultPlonterComponent.prototype, "plonterPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.plonterService.plonterShown) {
                /** @type {?} */
                var screenPos = this.plonterService.plonterClickPosition.endPosition;
                return this.geoConverter.screenToCartesian3(screenPos);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} entity
     * @return {?}
     */
    AcDefaultPlonterComponent.prototype.chooseEntity = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.plonterService.resolvePlonter(entity);
    };
    AcDefaultPlonterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-default-plonter',
                    template: "\n      <ac-html *ngIf=\"plonterService.plonterShown\" [props]=\"{\n        position: plonterPosition\n      }\">\n        <div class=\"plonter-context-menu\">\n          <div *ngFor=\"let entity of plonterService.entitesToPlonter\">\n            <div class=\"plonter-item\" (click)=\"chooseEntity(entity)\">{{ entity?.name || entity?.id }}\n            </div>\n          </div>\n        </div>\n      </ac-html>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [CoordinateConverter],
                    styles: ["\n        .plonter-context-menu {\n            background-color: rgba(250, 250, 250, 0.8);\n            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);\n        }\n\n        .plonter-item {\n            cursor: pointer;\n            padding: 2px 15px;\n            text-align: start;\n        }\n\n        .plonter-item:hover {\n            background-color: rgba(0, 0, 0, 0.15);\n        }\n\n    "]
                }] }
    ];
    /** @nocollapse */
    AcDefaultPlonterComponent.ctorParameters = function () { return [
        { type: PlonterService },
        { type: ChangeDetectorRef },
        { type: CoordinateConverter }
    ]; };
    return AcDefaultPlonterComponent;
}());

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
var AcPolygonComponent = /** @class */ (function (_super) {
    __extends(AcPolygonComponent, _super);
    function AcPolygonComponent(polygonDrawer, mapLayers) {
        return _super.call(this, polygonDrawer, mapLayers) || this;
    }
    AcPolygonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polygon',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPolygonComponent.ctorParameters = function () { return [
        { type: PolygonDrawerService },
        { type: MapLayersService }
    ]; };
    return AcPolygonComponent;
}(EntityOnMapComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var BasicStaticPrimitiveDesc = /** @class */ (function (_super) {
    __extends(BasicStaticPrimitiveDesc, _super);
    function BasicStaticPrimitiveDesc(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        var _this = _super.call(this, _staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
        _this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
        return _this;
    }
    /**
     * @return {?}
     */
    BasicStaticPrimitiveDesc.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    };
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    BasicStaticPrimitiveDesc.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    function (context, id, entity) {
        /** @type {?} */
        var geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        /** @type {?} */
        var instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        /** @type {?} */
        var primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            var primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            /** @type {?} */
            var primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    };
    BasicStaticPrimitiveDesc.propDecorators = {
        geometryProps: [{ type: Input }],
        instanceProps: [{ type: Input }],
        primitiveProps: [{ type: Input }]
    };
    return BasicStaticPrimitiveDesc;
}(BasicDesc));

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
var AcStaticEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticEllipseDescComponent, _super);
    function AcStaticEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticEllipseDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-ellipse-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticEllipseDescComponent.ctorParameters = function () { return [
        { type: StaticEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticEllipseDescComponent;
}(BasicStaticPrimitiveDesc));

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
var AcDynamicEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicEllipseDescComponent, _super);
    function AcDynamicEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicEllipseDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-dynamic-ellipse-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcDynamicEllipseDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcDynamicEllipseDescComponent;
}(BasicDesc));

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
var AcDynamicPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicPolylineDescComponent, _super);
    function AcDynamicPolylineDescComponent(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicPolylineDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-dynamic-polyline-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcDynamicPolylineDescComponent.ctorParameters = function () { return [
        { type: DynamicPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcDynamicPolylineDescComponent;
}(BasicDesc));

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
var AcStaticPolygonDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticPolygonDescComponent, _super);
    function AcStaticPolygonDescComponent(polygonDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polygonDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolygonDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-polygon-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticPolygonDescComponent.ctorParameters = function () { return [
        { type: StaticPolygonDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticPolygonDescComponent;
}(BasicStaticPrimitiveDesc));

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
var AcStaticCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticCircleDescComponent, _super);
    function AcStaticCircleDescComponent(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, staticCircleDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticCircleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-circle',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticCircleDescComponent.ctorParameters = function () { return [
        { type: StaticCircleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticCircleDescComponent;
}(BasicStaticPrimitiveDesc));

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
var AcDynamicCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicCircleDescComponent, _super);
    function AcDynamicCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    AcDynamicCircleDescComponent.prototype._propsEvaluator = /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    function (context) {
        /** @type {?} */
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    };
    AcDynamicCircleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-dynamic-circle-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcDynamicCircleDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcDynamicCircleDescComponent;
}(BasicDesc));

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
var AcStaticPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticPolylineDescComponent, _super);
    function AcStaticPolylineDescComponent(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolylineDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-polyline-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticPolylineDescComponent.ctorParameters = function () { return [
        { type: StaticPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticPolylineDescComponent;
}(BasicStaticPrimitiveDesc));

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
var AcModelDescComponent = /** @class */ (function (_super) {
    __extends(AcModelDescComponent, _super);
    function AcModelDescComponent(modelDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, modelDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcModelDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-model-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcModelDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcModelDescComponent.ctorParameters = function () { return [
        { type: ModelDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcModelDescComponent;
}(BasicDesc));

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
    /**
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    /**
     * @param {?} changes
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
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
            /** @type {?} */
            var styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    };
    /**
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    };
    AcTileset3dComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-3d-tile-layer',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcTileset3dComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    AcTileset3dComponent.propDecorators = {
        options: [{ type: Input }],
        index: [{ type: Input }],
        show: [{ type: Input }],
        style: [{ type: Input }]
    };
    return AcTileset3dComponent;
}());

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
var AcBoxDescComponent = /** @class */ (function (_super) {
    __extends(AcBoxDescComponent, _super);
    function AcBoxDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcBoxDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-box-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcBoxDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcBoxDescComponent.ctorParameters = function () { return [
        { type: BoxDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcBoxDescComponent;
}(BasicDesc));

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
var AcCylinderDescComponent = /** @class */ (function (_super) {
    __extends(AcCylinderDescComponent, _super);
    function AcCylinderDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcCylinderDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-cylinder-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcCylinderDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcCylinderDescComponent.ctorParameters = function () { return [
        { type: CylinderDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcCylinderDescComponent;
}(BasicDesc));

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
var AcCorridorDescComponent = /** @class */ (function (_super) {
    __extends(AcCorridorDescComponent, _super);
    function AcCorridorDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcCorridorDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-corridor-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcCorridorDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcCorridorDescComponent.ctorParameters = function () { return [
        { type: CorridorDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcCorridorDescComponent;
}(BasicDesc));

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
var AcEllipsoidDescComponent = /** @class */ (function (_super) {
    __extends(AcEllipsoidDescComponent, _super);
    function AcEllipsoidDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcEllipsoidDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-ellipsoid-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcEllipsoidDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcEllipsoidDescComponent.ctorParameters = function () { return [
        { type: EllipsoidDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcEllipsoidDescComponent;
}(BasicDesc));

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
var AcPolylineVolumeDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylineVolumeDescComponent, _super);
    function AcPolylineVolumeDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylineVolumeDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline-volume-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPolylineVolumeDescComponent.ctorParameters = function () { return [
        { type: PolylineVolumeDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolylineVolumeDescComponent;
}(BasicDesc));

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
var AcWallDescComponent = /** @class */ (function (_super) {
    __extends(AcWallDescComponent, _super);
    function AcWallDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcWallDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-wall-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcWallDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcWallDescComponent.ctorParameters = function () { return [
        { type: WallDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcWallDescComponent;
}(BasicDesc));

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
var AcRectangleDescComponent = /** @class */ (function (_super) {
    __extends(AcRectangleDescComponent, _super);
    function AcRectangleDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcRectangleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-rectangle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcRectangleDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcRectangleDescComponent.ctorParameters = function () { return [
        { type: RectangleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcRectangleDescComponent;
}(BasicDesc));

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
var AcBillboardPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcBillboardPrimitiveDescComponent, _super);
    function AcBillboardPrimitiveDescComponent(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardPrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-billboard-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcBillboardPrimitiveDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcBillboardPrimitiveDescComponent.ctorParameters = function () { return [
        { type: BillboardPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcBillboardPrimitiveDescComponent;
}(BasicDesc));

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
var AcLabelPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcLabelPrimitiveDescComponent, _super);
    function AcLabelPrimitiveDescComponent(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelPrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-label-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcLabelPrimitiveDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcLabelPrimitiveDescComponent.ctorParameters = function () { return [
        { type: LabelPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcLabelPrimitiveDescComponent;
}(BasicDesc));

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
var AcPolylinePrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcPolylinePrimitiveDescComponent, _super);
    function AcPolylinePrimitiveDescComponent(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylinePrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPolylinePrimitiveDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPolylinePrimitiveDescComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolylinePrimitiveDescComponent;
}(BasicDesc));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        set: /**
         * @param {?} scene
         * @return {?}
         */
        function (scene) {
            this._scene = scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} show
         * @return {?}
         */
        function (show) {
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
        get: /**
         * @return {?}
         */
        function () {
            return this._position;
        },
        set: /**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "pixelOffset", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pixelOffset;
        },
        set: /**
         * @param {?} pixelOffset
         * @return {?}
         */
        function (pixelOffset) {
            this._pixelOffset = pixelOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "element", {
        get: /**
         * @return {?}
         */
        function () {
            return this._element;
        },
        set: /**
         * @param {?} element
         * @return {?}
         */
        function (element) {
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
        get: /**
         * @return {?}
         */
        function () {
            return this._collection;
        },
        set: /**
         * @param {?} collection
         * @return {?}
         */
        function (collection) {
            this._collection = collection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    HtmlPrimitive.prototype.update = /**
     * @return {?}
     */
    function () {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
        /** @type {?} */
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
    return HtmlPrimitive;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var HtmlCollection = /** @class */ (function () {
    function HtmlCollection() {
        this._collection = [];
    }
    Object.defineProperty(HtmlCollection.prototype, "length", {
        get: /**
         * @return {?}
         */
        function () {
            return this._collection.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} index
     * @return {?}
     */
    HtmlCollection.prototype.get = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this._collection[index];
    };
    /**
     * @param {?} options
     * @return {?}
     */
    HtmlCollection.prototype.add = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    };
    /**
     * @param {?} html
     * @return {?}
     */
    HtmlCollection.prototype.remove = /**
     * @param {?} html
     * @return {?}
     */
    function (html) {
        /** @type {?} */
        var index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection.splice(index, 1);
        return true;
    };
    /**
     * @return {?}
     */
    HtmlCollection.prototype.update = /**
     * @return {?}
     */
    function () {
        for (var i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    };
    /**
     * @return {?}
     */
    HtmlCollection.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        while (this._collection.length > 0) {
            this._collection.pop();
        }
    };
    /**
     * @param {?} html
     * @return {?}
     */
    HtmlCollection.prototype.contains = /**
     * @param {?} html
     * @return {?}
     */
    function (html) {
        return Cesium.defined(html) && html.collection === this;
    };
    return HtmlCollection;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CesiumExtender = /** @class */ (function () {
    function CesiumExtender() {
    }
    /**
     * @return {?}
     */
    CesiumExtender.extend = /**
     * @return {?}
     */
    function () {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    };
    return CesiumExtender;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AcHtmlManager = /** @class */ (function () {
    function AcHtmlManager() {
        this._entities = new Map();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.has = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this._entities.has(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this._entities.get(id);
    };
    /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    AcHtmlManager.prototype.addOrUpdate = /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    function (id, info) {
        this._entities.set(id, info);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this._entities.delete(id);
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    AcHtmlManager.prototype.forEach = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) {
        this._entities.forEach(callback);
    };
    AcHtmlManager.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    AcHtmlManager.ctorParameters = function () { return []; };
    return AcHtmlManager;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @return {?}
     */
    AcHtmlDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @private
     * @param {?} id
     * @param {?} primitive
     * @param {?} entity
     * @return {?}
     */
    AcHtmlDirective.prototype._handleView = /**
     * @private
     * @param {?} id
     * @param {?} primitive
     * @param {?} entity
     * @return {?}
     */
    function (id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            /** @type {?} */
            var context = new AcHtmlContext(id, { $implicit: entity });
            /** @type {?} */
            var viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef: viewRef, context: context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && !primitive.show) {
            this.remove(id, primitive);
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    };
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    AcHtmlDirective.prototype.addOrUpdate = /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    function (id, primitive) {
        /** @type {?} */
        var context = this._layerService.context;
        /** @type {?} */
        var entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity: entity, primitive: primitive });
        this._handleView(id, primitive, entity);
    };
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    AcHtmlDirective.prototype.remove = /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    function (id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        var viewRef = this._views.get(id).viewRef;
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    };
    AcHtmlDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[acHtml]',
                },] }
    ];
    /** @nocollapse */
    AcHtmlDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ChangeDetectorRef },
        { type: LayerService },
        { type: AcHtmlManager }
    ]; };
    return AcHtmlDirective;
}());

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
var AcHtmlDescComponent = /** @class */ (function (_super) {
    __extends(AcHtmlDescComponent, _super);
    function AcHtmlDescComponent(htmlDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, htmlDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    /**
     * @return {?}
     */
    AcHtmlDescComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        if (!this.acHtmlCreator) {
            throw new Error("AcHtml desc ERROR: ac html directive not found.");
        }
        if (!this.acHtmlTemplate) {
            throw new Error("AcHtml desc ERROR: html template not found.");
        }
    };
    /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    AcHtmlDescComponent.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    function (context, id) {
        /** @type {?} */
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            var primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            /** @type {?} */
            var primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlDescComponent.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    };
    /**
     * @return {?}
     */
    AcHtmlDescComponent.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._cesiumObjectsMap.forEach(((/**
         * @param {?} primitive
         * @param {?} id
         * @return {?}
         */
        function (primitive, id) {
            _this.acHtmlCreator.remove(id, primitive);
        })));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    AcHtmlDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-html-desc',
                    providers: [AcHtmlManager],
                    template: "\n      <div *acHtml=\"let acHtmlEntityId = id; let acHtmlContext = context\">\n          <div [acHtmlContainer]=\"acHtmlEntityId\">\n              <ng-template [ngTemplateOutlet]=\"acHtmlTemplate\"\n                           [ngTemplateOutletContext]=\"acHtmlContext\"></ng-template>\n          </div>\n      </div>"
                }] }
    ];
    /** @nocollapse */
    AcHtmlDescComponent.ctorParameters = function () { return [
        { type: HtmlDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcHtmlDescComponent.propDecorators = {
        acHtmlCreator: [{ type: ViewChild, args: [AcHtmlDirective,] }],
        acHtmlTemplate: [{ type: ContentChild, args: [TemplateRef,] }]
    };
    return AcHtmlDescComponent;
}(BasicDesc));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AcHtmlContainerDirective = /** @class */ (function () {
    function AcHtmlContainerDirective(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    Object.defineProperty(AcHtmlContainerDirective.prototype, "acHtmlContainer", {
        set: /**
         * @param {?} id
         * @return {?}
         */
        function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AcHtmlContainerDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this._id === undefined) {
            throw new Error("AcHtml container ERROR: entity id not defined");
        }
        /** @type {?} */
        var entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    };
    AcHtmlContainerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[acHtmlContainer]'
                },] }
    ];
    /** @nocollapse */
    AcHtmlContainerDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: AcHtmlManager }
    ]; };
    AcHtmlContainerDirective.propDecorators = {
        acHtmlContainer: [{ type: Input }]
    };
    return AcHtmlContainerDirective;
}());

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
var AcContextMenuWrapperComponent = /** @class */ (function () {
    function AcContextMenuWrapperComponent(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    /**
     * @return {?}
     */
    AcContextMenuWrapperComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe((/**
             * @return {?}
             */
            function () { return _this.cd.detectChanges(); }));
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var componentFactory = _this.componentFactoryResolver.resolveComponentFactory((/** @type {?} */ (_this.contextMenuService.content)));
                _this.viewContainerRef.clear();
                /** @type {?} */
                var componentRef = _this.viewContainerRef.createComponent(componentFactory);
                ((/** @type {?} */ (componentRef.instance))).data = _this.contextMenuService.options.data;
                _this.cd.detectChanges();
            }));
    };
    /**
     * @return {?}
     */
    AcContextMenuWrapperComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    };
    AcContextMenuWrapperComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-context-menu-wrapper',
                    template: "\n    <ac-html *ngIf=\"contextMenuService.showContextMenu\" [props]=\"{position: contextMenuService.position}\">\n      <div #contextMenuContainer></div>\n    </ac-html>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    AcContextMenuWrapperComponent.ctorParameters = function () { return [
        { type: ContextMenuService },
        { type: ChangeDetectorRef },
        { type: ComponentFactoryResolver }
    ]; };
    AcContextMenuWrapperComponent.propDecorators = {
        viewContainerRef: [{ type: ViewChild, args: ['contextMenuContainer', { read: ViewContainerRef },] }]
    };
    return AcContextMenuWrapperComponent;
}());

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
    /**
     * @param {?} changes
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['acFor'].firstChange) {
            /** @type {?} */
            var acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + acForString);
            }
            /** @type {?} */
            var acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layer.getLayerService().cache = false;
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe((/**
         * @return {?}
         */
        function () {
            _this.cd.detectChanges();
        }));
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            component.setLayerService(_this.layer.getLayerService());
        }));
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            _this.layerService.unregisterDescription(component);
            _this.layer.getLayerService().registerDescription(component);
            component.layerService = _this.layer.getLayerService();
            component.setLayerService(_this.layer.getLayerService());
        }));
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} layerService
     * @return {?}
     */
    AcArrayDescComponent.prototype.setLayerService = /**
     * @param {?} layerService
     * @return {?}
     */
    function (layerService) {
        this.layerService = layerService;
    };
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    AcArrayDescComponent.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    function (context, id, contextEntity) {
        var _this = this;
        /** @type {?} */
        var get = _get;
        /** @type {?} */
        var entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        /** @type {?} */
        var previousEntitiesIdArray = this.entitiesMap.get(id);
        /** @type {?} */
        var entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        function (item, index) {
            _this.layerService.context[_this.entityName] = item;
            /** @type {?} */
            var arrayItemId = _this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            _this.layer.update(contextEntity, arrayItemId);
        }));
        if (previousEntitiesIdArray) {
            /** @type {?} */
            var entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                function (entityId) { return entitiesIdArray.indexOf(entityId) < 0; })) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                function (entityId) { return _this.layer.remove(entityId); }));
            }
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcArrayDescComponent.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        var _this = this;
        /** @type {?} */
        var entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((/**
             * @param {?} entityId
             * @return {?}
             */
            function (entityId) { return _this.layer.remove(entityId); }));
        }
        this.entitiesMap.delete(id);
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.layer.removeAll();
        this.entitiesMap.clear();
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.getAcForString = /**
     * @return {?}
     */
    function () {
        return "let " + (this.entityName + '___temp') + " of arrayObservable$";
    };
    /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    AcArrayDescComponent.prototype.generateCombinedId = /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    function (entityId, arrayItem, index) {
        /** @type {?} */
        var arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    };
    AcArrayDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-array-desc',
                    template: "\n    <ac-layer #layer [acFor]=\"getAcForString()\"\n              [context]=\"layerService.context\"\n              [options]=\"layerService.options\"\n              [show]=\"layerService.show && show\"\n              [zIndex]=\"layerService.zIndex\">\n      <ng-content #content></ng-content>\n    </ac-layer>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    AcArrayDescComponent.ctorParameters = function () { return [
        { type: LayerService },
        { type: ChangeDetectorRef }
    ]; };
    AcArrayDescComponent.propDecorators = {
        acFor: [{ type: Input }],
        idGetter: [{ type: Input }],
        show: [{ type: Input }],
        layer: [{ type: ViewChild, args: ['layer',] }],
        basicDescs: [{ type: ContentChildren, args: [BasicDesc, { descendants: false },] }],
        arrayDescs: [{ type: ContentChildren, args: [AcArrayDescComponent, { descendants: false },] }]
    };
    return AcArrayDescComponent;
}());

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
var AcPointPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcPointPrimitiveDescComponent, _super);
    function AcPointPrimitiveDescComponent(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointPrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-point-primitive-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPointPrimitiveDescComponent.ctorParameters = function () { return [
        { type: PointPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPointPrimitiveDescComponent;
}(BasicDesc));

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
var AcPrimitivePolylineComponent = /** @class */ (function (_super) {
    __extends(AcPrimitivePolylineComponent, _super);
    function AcPrimitivePolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPrimitivePolylineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-primitive-polyline',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPrimitivePolylineComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: MapLayersService }
    ]; };
    return AcPrimitivePolylineComponent;
}(EntityOnMapComponent));

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
var AcCzmlDescComponent = /** @class */ (function (_super) {
    __extends(AcCzmlDescComponent, _super);
    function AcCzmlDescComponent(czmlDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, czmlDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcCzmlDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-czml-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcCzmlDescComponent.ctorParameters = function () { return [
        { type: CzmlDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcCzmlDescComponent;
}(BasicDesc));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AngularCesiumModule = /** @class */ (function () {
    function AngularCesiumModule() {
        CesiumExtender.extend();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    AngularCesiumModule.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: AngularCesiumModule,
            providers: [
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    };
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
    AngularCesiumModule.ctorParameters = function () { return []; };
    return AngularCesiumModule;
}());

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
var  /**
 * @template T
 */
DisposableObservable = /** @class */ (function (_super) {
    __extends(DisposableObservable, _super);
    function DisposableObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DisposableObservable;
}(Observable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var CesiumEventModifier = {
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
var SelectionManagerService = /** @class */ (function () {
    function SelectionManagerService(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntities$ = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitiesItems$.asObservable();
    };
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntities = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitiesItems$.getValue();
    };
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntity$ = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitySubject$;
    };
    /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.toggleSelection = /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        /** @type {?} */
        var current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    };
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.addToSelected = /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        /** @type {?} */
        var current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next(__spread(current, [entity]));
    };
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.removeSelected = /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        /** @type {?} */
        var current = this.selectedEntities();
        /** @type {?} */
        var entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    };
    /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    SelectionManagerService.prototype.initSelection = /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    function (selectionOptions, addSelectedIndicator, eventPriority, mapId) {
        var _this = this;
        if (addSelectedIndicator === void 0) { addSelectedIndicator = true; }
        /** @type {?} */
        var mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        /** @type {?} */
        var eventSubscription = this.mapEventsManagerService.register({
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
        function (result) { return result.entities; })), filter((/**
         * @param {?} entities
         * @return {?}
         */
        function (entities) { return entities && entities.length > 0; })))
            .subscribe((/**
         * @param {?} entities
         * @return {?}
         */
        function (entities) {
            /** @type {?} */
            var entity = entities[0];
            _this.toggleSelection(entity, addSelectedIndicator);
        }));
    };
    SelectionManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    SelectionManagerService.ctorParameters = function () { return [
        { type: MapsManagerService }
    ]; };
    return SelectionManagerService;
}());

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
        var heatPointsData = heatmapDataSet.heatPointsData, _a = heatmapDataSet.min, _b = heatmapDataSet.max;
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
        this.heatmap = create(finalHeatmapOptions);
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
var EditModes = {
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
var EditActions = {
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
var EditPoint = /** @class */ (function (_super) {
    __extends(EditPoint, _super);
    function EditPoint(entityId, position, pointProps, virtualPoint) {
        if (virtualPoint === void 0) { virtualPoint = false; }
        var _this = _super.call(this) || this;
        _this._show = true;
        _this.editedEntityId = entityId;
        _this.position = position;
        _this.id = _this.generateId();
        _this.pointProps = pointProps;
        _this._virtualEditPoint = virtualPoint;
        return _this;
    }
    Object.defineProperty(EditPoint.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPoint.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this.pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditPoint.prototype.isVirtualEditPoint = /**
     * @return {?}
     */
    function () {
        return this._virtualEditPoint;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    EditPoint.prototype.setVirtualEditPoint = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._virtualEditPoint = value;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getEditedEntityId = /**
     * @return {?}
     */
    function () {
        return this.editedEntityId;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getPosition = /**
     * @return {?}
     */
    function () {
        return this.position;
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPoint.prototype.setPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditPoint.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-point-' + EditPoint.counter++;
    };
    EditPoint.counter = 0;
    return EditPoint;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var EditPolyline = /** @class */ (function (_super) {
    __extends(EditPolyline, _super);
    function EditPolyline(entityId, startPosition, endPosition, polylineProps) {
        var _this = _super.call(this) || this;
        _this.editedEntityId = entityId;
        _this.id = _this.generateId();
        _this.positions = [startPosition, endPosition];
        _this._polylineProps = polylineProps;
        return _this;
    }
    Object.defineProperty(EditPolyline.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditPolyline.prototype.getEditedEntityId = /**
     * @return {?}
     */
    function () {
        return this.editedEntityId;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getPositions = /**
     * @return {?}
     */
    function () {
        return this.positions;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.validatePositions = /**
     * @return {?}
     */
    function () {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getStartPosition = /**
     * @return {?}
     */
    function () {
        return this.positions[0];
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getEndPosition = /**
     * @return {?}
     */
    function () {
        return this.positions[1];
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPolyline.prototype.setStartPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.positions[0] = position;
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPolyline.prototype.setEndPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.positions[1] = position;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditPolyline.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-polyline-' + EditPolyline.counter++;
    };
    EditPolyline.counter = 0;
    return EditPolyline;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var defaultLabelProps = {
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
var EditablePolygon = /** @class */ (function (_super) {
    __extends(EditablePolygon, _super);
    function EditablePolygon(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.polygonsLayer = polygonsLayer;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.polygonProps = polygonOptions.polygonProps;
        _this.defaultPointProps = polygonOptions.pointProps;
        _this.defaultPolylineProps = polygonOptions.polylineProps;
        if (positions && positions.length >= 3) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolygon.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            if (!labels) {
                return;
            }
            /** @type {?} */
            var positions = this.getRealPositions();
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPolylineProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._defaultPolylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._defaultPolylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._defaultPointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "polygonProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polygonProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polygonProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    EditablePolygon.prototype.createFromExisting = /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    function (positions) {
        var _this = this;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            _this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    };
    /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    EditablePolygon.prototype.setPointsManually = /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    function (points, polygonProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.remove(p.getId()); }));
        /** @type {?} */
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            /** @type {?} */
            var pointOrCartesian = points[i];
            /** @type {?} */
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
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.addAllVirtualEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var currentPoints = __spread(this.positions);
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        function (pos, index) {
            /** @type {?} */
            var currentPoint = pos;
            /** @type {?} */
            var nextIndex = (index + 1) % (currentPoints.length);
            /** @type {?} */
            var nextPoint = currentPoints[nextIndex];
            /** @type {?} */
            var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
            _this.updatePointsLayer(false, midPoint);
        }));
    };
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    EditablePolygon.prototype.setMiddleVirtualPoint = /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    function (firstP, secondP) {
        /** @type {?} */
        var currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        var nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        var midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        var midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    EditablePolygon.prototype.updateMiddleVirtualPoint = /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    function (virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        var prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        var nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    };
    /**
     * @param {?} point
     * @return {?}
     */
    EditablePolygon.prototype.changeVirtualPointToRealPoint = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        // virtual point becomes a real point
        /** @type {?} */
        var pointsCount = this.positions.length;
        /** @type {?} */
        var pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        var nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        var nextPoint = this.positions[nextIndex];
        /** @type {?} */
        var prePoint = this.positions[preIndex];
        /** @type {?} */
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.renderPolylines = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); }));
        this.polylines = [];
        /** @type {?} */
        var realPoints = this.positions.filter((/**
         * @param {?} pos
         * @return {?}
         */
        function (pos) { return !pos.isVirtualEditPoint(); }));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            /** @type {?} */
            var nextIndex = (index + 1) % (realPoints.length);
            /** @type {?} */
            var nextPoint = realPoints[nextIndex];
            /** @type {?} */
            var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.defaultPolylineProps);
            _this.polylines.push(polyline);
            _this.polylinesLayer.update(polyline, polyline.getId());
        }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditablePolygon.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        this.updatePolygonsLayer();
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            var pointsCount = this.positions.length;
            /** @type {?} */
            var pointIndex = this.positions.indexOf(editPoint);
            /** @type {?} */
            var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            /** @type {?} */
            var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            /** @type {?} */
            var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            /** @type {?} */
            var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            this.updatePointsLayer(false, nextVirtualPoint);
            this.updatePointsLayer(false, prevVirtualPoint);
        }
        this.updatePointsLayer(true, editPoint);
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditablePolygon.prototype.moveTempMovingPoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    EditablePolygon.prototype.movePolygon = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
        var _this = this;
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) { return _this.updatePointsLayer(true, point); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.endMovePolygon = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditablePolygon.prototype.removePoint = /**
     * @param {?} pointToRemove
     * @return {?}
     */
    function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); }))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getRealPositions = /**
     * @return {?}
     */
    function () {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPositionsHierarchy = /**
     * @return {?}
     */
    function () {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint(); })).map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPositionsHierarchyCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    };
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    EditablePolygon.prototype.removePosition = /**
     * @private
     * @param {?} point
     * @return {?}
     */
    function (point) {
        /** @type {?} */
        var index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p === point; }));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.updatePolygonsLayer = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    EditablePolygon.prototype.updatePointsLayer = /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var points = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            points[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.polygonsLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        function (line) { return _this.polylinesLayer.remove(line.getId()); }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditablePolygon;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolygonsManagerService = /** @class */ (function () {
    function PolygonsManagerService() {
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
    PolygonsManagerService.prototype.createEditablePolygon = /**
     * @param {?} id
     * @param {?} editPolygonsLayer
     * @param {?} editPointsLayer
     * @param {?} editPolylinesLayer
     * @param {?} coordinateConverter
     * @param {?=} polygonOptions
     * @param {?=} positions
     * @return {?}
     */
    function (id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        /** @type {?} */
        var editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    PolygonsManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    PolygonsManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.polygons.get(id);
    };
    /**
     * @return {?}
     */
    PolygonsManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.polygons.forEach((/**
         * @param {?} polygon
         * @return {?}
         */
        function (polygon) { return polygon.dispose(); }));
        this.polygons.clear();
    };
    PolygonsManagerService.decorators = [
        { type: Injectable }
    ];
    return PolygonsManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?=} length
 * @return {?}
 */
function generateKey(length) {
    if (length === void 0) { length = 12; }
    /** @type {?} */
    var id = '';
    /** @type {?} */
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_POLYGON_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var PolygonsEditorService = /** @class */ (function () {
    function PolygonsEditorService() {
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
    PolygonsEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polygonsManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, polygonsManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    PolygonsEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolygonsEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polygonOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
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
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var allPositions = _this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            function (cartesian) { return cartesian.equals(position); }))) {
                return;
            }
            /** @type {?} */
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign({}, updateValue, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    };
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
    PolygonsEditorService.prototype.switchToEditMode = /**
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
    function (id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        var updateValue = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(__assign({}, updateValue, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        var changeMode = {
            id: id,
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
            function (registration) { return registration.dispose(); }));
        }
        this.observablesMap.delete(id);
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolygonsEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYGON_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polygonOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    };
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
    PolygonsEditorService.prototype.editPolygon = /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.id; }),
            });
        }
        /** @type {?} */
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            }));
        }
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var entities = _a.entities;
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 4) {
                return;
            }
            /** @type {?} */
            var index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            function (position) { return point.getPosition().equals((/** @type {?} */ (position))); }));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        /** @type {?} */
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    PolygonsEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        /** @type {?} */
        var polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps, options.pointProps);
        polygonOptions.polygonProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps, options.polygonProps);
        polygonOptions.polylineProps = Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps, options.polylineProps);
        return polygonOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polygonProps
         * @return {?}
         */
        function (points, polygonProps) {
            /** @type {?} */
            var polygon = _this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        function () { return _this.getPoints(id); });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.polygonsManager.get(id).labels; });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolygonsEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    };
    PolygonsEditorService.decorators = [
        { type: Injectable }
    ];
    return PolygonsEditorService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolygonsEditorComponent = /** @class */ (function () {
    function PolygonsEditorComponent(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager) {
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
    PolygonsEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polygonsEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    PolygonsEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} polygon
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    PolygonsEditorComponent.prototype.renderEditLabels = /**
     * @param {?} polygon
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (polygon, update, labels) {
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
    /**
     * @param {?} polygon
     * @return {?}
     */
    PolygonsEditorComponent.prototype.removeEditLabels = /**
     * @param {?} polygon
     * @return {?}
     */
    function (polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolygonsEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                polygon.dispose();
                this.removeEditLabels(polygon);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolygonsEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                var polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    PolygonsEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.polygonsManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolygonsEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolygonsEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PolygonsEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'polygons-editor',
                    template: /*html*/ "\n    <ac-layer #editPolylinesLayer acFor=\"let polyline of editPolylines$\" [context]=\"this\">\n      <ac-polyline-primitive-desc\n        props=\"{\n        positions: polyline.getPositions(),\n        width: polyline.props.width,\n        material: polyline.props.material()\n    }\"\n      >\n      </ac-polyline-primitive-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editPolygonsLayer acFor=\"let polygon of editPolygons$\" [context]=\"this\">\n      <ac-polygon-desc\n        props=\"{\n        hierarchy: polygon.getPositionsHierarchyCallbackProperty(),\n        material: polygon.polygonProps.material\n    }\"\n      >\n      </ac-polygon-desc>\n      <!-- <ac-static-polygon-desc -->\n      <!-- geometryProps=\"{ -->\n      <!-- polygonHierarchy: polygon.getHierarchy(), -->\n      <!-- height: 1 -->\n      <!-- }\" -->\n      <!-- instanceProps=\"{ -->\n      <!-- attributes: attributes -->\n      <!-- }\" -->\n      <!-- primitiveProps=\"{ -->\n      <!-- appearance: appearance -->\n      <!-- }\"> -->\n      <!-- </ac-static-polygon-desc -->\n      <ac-array-desc acFor=\"let label of polygon.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, PolygonsManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PolygonsEditorComponent.ctorParameters = function () { return [
        { type: PolygonsEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PolygonsManagerService }
    ]; };
    PolygonsEditorComponent.propDecorators = {
        editPolygonsLayer: [{ type: ViewChild, args: ['editPolygonsLayer',] }],
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
        editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }]
    };
    return PolygonsEditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        get: /**
         * @return {?}
         */
        function () {
            return this._arcProps;
        },
        set: /**
         * @param {?} props
         * @return {?}
         */
        function (props) {
            this._arcProps = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "angle", {
        get: /**
         * @return {?}
         */
        function () {
            return this._angle;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._angle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "delta", {
        get: /**
         * @return {?}
         */
        function () {
            return this._delta;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._delta = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "radius", {
        get: /**
         * @return {?}
         */
        function () {
            return this._radius;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "center", {
        get: /**
         * @return {?}
         */
        function () {
            return this._center;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._center = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} center
     * @return {?}
     */
    EditArc.prototype.updateCenter = /**
     * @param {?} center
     * @return {?}
     */
    function (center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    };
    /**
     * @return {?}
     */
    EditArc.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditArc.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-arc-' + EditArc.counter++;
    };
    EditArc.counter = 0;
    return EditArc;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        _this._circleProps = options.circleProps;
        _this._pointProps = options.pointProps;
        _this._polylineProps = options.polylineProps;
        return _this;
    }
    Object.defineProperty(EditableCircle.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            var _this = this;
            if (!labels || !this._center || !this._radiusPoint) {
                return;
            }
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    if (index !== labels.length - 1) {
                        label.position = _this._center.getPosition();
                    }
                    else {
                        label.position = _this._radiusPoint.getPosition();
                    }
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "polylineProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "pointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "circleProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._circleProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._circleProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "center", {
        get: /**
         * @return {?}
         */
        function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "radiusPoint", {
        get: /**
         * @return {?}
         */
        function () {
            return this._radiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._radiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} center
     * @param {?} radiusPoint
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} circleProp
     * @return {?}
     */
    EditableCircle.prototype.setManually = /**
     * @param {?} center
     * @param {?} radiusPoint
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} circleProp
     * @return {?}
     */
    function (center, radiusPoint, centerPointProp, radiusPointProp, circleProp) {
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
    /**
     * @param {?} position
     * @return {?}
     */
    EditableCircle.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
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
    /**
     * @param {?} position
     * @return {?}
     */
    EditableCircle.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditableCircle.prototype.movePoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    EditableCircle.prototype.moveCircle = /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        var radius = this.getRadius();
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.endMovePolygon = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.getRadius = /**
     * @return {?}
     */
    function () {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.getRadiusCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getRadius.bind(this), false);
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.getCenter = /**
     * @return {?}
     */
    function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.getCenterCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getCenter.bind(this), false);
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.getRadiusPoint = /**
     * @return {?}
     */
    function () {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    };
    /**
     * @return {?}
     */
    EditableCircle.prototype.dispose = /**
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    EditableCircle.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditableCircle.prototype.updateCirclesLayer = /**
     * @private
     * @return {?}
     */
    function () {
        this.circlesLayer.update(this, this.id);
    };
    /**
     * @private
     * @return {?}
     */
    EditableCircle.prototype.updatePointsLayer = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    };
    /**
     * @private
     * @return {?}
     */
    EditableCircle.prototype.updateArcsLayer = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    };
    /**
     * @private
     * @return {?}
     */
    EditableCircle.prototype.createOutlineArc = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    };
    return EditableCircle;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CirclesManagerService = /** @class */ (function () {
    function CirclesManagerService() {
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
    CirclesManagerService.prototype.createEditableCircle = /**
     * @param {?} id
     * @param {?} editCirclesLayer
     * @param {?} editPointsLayer
     * @param {?} editArcsLayer
     * @param {?} circleOptions
     * @return {?}
     */
    function (id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        /** @type {?} */
        var editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    CirclesManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.circles.get(id).dispose();
        this.circles.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    CirclesManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circles.get(id);
    };
    /**
     * @return {?}
     */
    CirclesManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.circles.forEach((/**
         * @param {?} circle
         * @return {?}
         */
        function (circle) { return circle.dispose(); }));
        this.circles.clear();
    };
    CirclesManagerService.decorators = [
        { type: Injectable }
    ];
    return CirclesManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_CIRCLE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var CirclesEditorService = /** @class */ (function () {
    function CirclesEditorService() {
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
    CirclesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} circlesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    CirclesEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    CirclesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var center;
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var circleOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                /** @type {?} */
                var update = {
                    id: id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update, _this.getCircleProperties(id)));
                center = position;
            }
            else {
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update, _this.getCircleProperties(id)));
                /** @type {?} */
                var changeMode = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign({}, update, _this.getCircleProperties(id)));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update, _this.getCircleProperties(id)));
            }
        }));
        return editorObservable;
    };
    /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    CirclesEditorService.prototype.edit = /**
     * @param {?} center
     * @param {?} radius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (center, radius, options, priority) {
        if (options === void 0) { options = DEFAULT_CIRCLE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var circleOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
        var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        /** @type {?} */
        var update = {
            id: id,
            center: center,
            radiusPoint: radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions: circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign({}, update, this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    };
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    CirclesEditorService.prototype.editCircle = /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var shapeDragRegistration;
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
                function (entity) { return id === entity.id; }),
            });
        }
        pointDragRegistration
            .pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var pointIsCenter = point === _this.getCenterPoint(id);
            /** @type {?} */
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
            /** @type {?} */
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
            editSubject.next(__assign({}, update, _this.getCircleProperties(id)));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
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
                editSubject.next(__assign({}, update, _this.getCircleProperties(id)));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                center: _this.getCenterPosition(id),
                radiusPoint: _this.getRadiusPosition(id),
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
        function (center, radius, centerPointProp, radiusPointProp, circleProp) {
            /** @type {?} */
            var radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            /** @type {?} */
            var circle = _this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.circlesManager.get(id).labels; });
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        function () { return _this.getCenterPosition(id); });
        observableToExtend.getRadius = (/**
         * @return {?}
         */
        function () { return _this.getRadius(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    CirclesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        /** @type {?} */
        var circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCenterPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getCenter();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCenterPoint = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).center;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getRadiusPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getRadiusPoint();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circlesManager.get(id).getRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    CirclesEditorService.prototype.getCircleProperties = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    };
    CirclesEditorService.decorators = [
        { type: Injectable }
    ];
    return CirclesEditorService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @private
     * @return {?}
     */
    CirclesEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.circlesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    CirclesEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    CirclesEditorComponent.prototype.renderEditLabels = /**
     * @param {?} circle
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (circle, update, labels) {
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
    /**
     * @param {?} circle
     * @return {?}
     */
    CirclesEditorComponent.prototype.removeEditLabels = /**
     * @param {?} circle
     * @return {?}
     */
    function (circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    CirclesEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.removeEditLabels(circle);
                this.circlesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    CirclesEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                var circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    CirclesEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.circlesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    CirclesEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    CirclesEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    CirclesEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'circles-editor',
                    template: /*html*/ "\n    <ac-layer #editArcsLayer acFor=\"let arc of editArcs$\" [context]=\"this\">\n      <ac-arc-desc\n        props=\"{\n        angle: arc.angle,\n        delta: arc.delta,\n        center: arc.center,\n        radius: arc.radius,\n        quality: 30,\n        color: arc.props.material()\n    }\"\n      >\n      </ac-arc-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editCirclesLayer acFor=\"let circle of editCircles$\" [context]=\"this\" [zIndex]=\"0\">\n      <ac-ellipse-desc\n        props=\"{\n        position: circle.getCenterCallbackProperty(),\n        semiMajorAxis: circle.getRadiusCallbackProperty(),\n        semiMinorAxis: circle.getRadiusCallbackProperty(),\n        material: circle.circleProps.material,\n        outline: circle.circleProps.outline,\n        height: 0\n    }\"\n      >\n      </ac-ellipse-desc>\n\n      <ac-array-desc acFor=\"let label of circle.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, CirclesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    CirclesEditorComponent.ctorParameters = function () { return [
        { type: CirclesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: CirclesManagerService }
    ]; };
    CirclesEditorComponent.propDecorators = {
        editCirclesLayer: [{ type: ViewChild, args: ['editCirclesLayer',] }],
        editArcsLayer: [{ type: ViewChild, args: ['editArcsLayer',] }],
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
    };
    return CirclesEditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        _this._ellipseProps = options.ellipseProps;
        _this._pointProps = options.pointProps;
        return _this;
    }
    Object.defineProperty(EditableEllipse.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            var _this = this;
            if (!labels || !this._center) {
                return;
            }
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
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
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "polylineProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "pointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "ellipseProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ellipseProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._ellipseProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "center", {
        get: /**
         * @return {?}
         */
        function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "majorRadiusPoint", {
        get: /**
         * @return {?}
         */
        function () {
            return this._majorRadiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadiusPointPosition = /**
     * @return {?}
     */
    function () {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadiusPointPosition = /**
     * @return {?}
     */
    function () {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    };
    Object.defineProperty(EditableEllipse.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._majorRadiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
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
    EditableEllipse.prototype.setManually = /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} ellipseProp
     * @return {?}
     */
    function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
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
        /** @type {?} */
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
    /**
     * @param {?} position
     * @return {?}
     */
    EditableEllipse.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
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
    /**
     * @return {?}
     */
    EditableEllipse.prototype.transformToEllipse = /**
     * @return {?}
     */
    function () {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableEllipse.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
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
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditableEllipse.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
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
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    EditableEllipse.prototype.moveEllipse = /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        var majorRadius = this.getMajorRadius();
        /** @type {?} */
        var rotation = this.getRotation();
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.endMoveEllipse = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updateMinorRadiusEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadius = /**
     * @return {?}
     */
    function () {
        return this._majorRadius || 0;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadius = /**
     * @return {?}
     */
    function () {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getRotation = /**
     * @return {?}
     */
    function () {
        return this._rotation || 0;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.updateRotation = /**
     * @return {?}
     */
    function () {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        /** @type {?} */
        var azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getRotationCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return Math.PI / 2 - _this.getRotation(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadiusCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getMinorRadius(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadiusCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getMajorRadius(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getCenter = /**
     * @return {?}
     */
    function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getCenterCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getCenter(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
            function (point) { return _this.pointsLayer.remove(point.getId()); }));
        }
        this.ellipsesLayer.remove(this.id);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updateEllipsesLayer = /**
     * @private
     * @return {?}
     */
    function () {
        this.ellipsesLayer.update(this, this.id);
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updatePointsLayer = /**
     * @private
     * @return {?}
     */
    function () {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var EllipsesManagerService = /** @class */ (function () {
    function EllipsesManagerService() {
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
    EllipsesManagerService.prototype.createEditableEllipse = /**
     * @param {?} id
     * @param {?} editEllipsesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?} ellipseOptions
     * @return {?}
     */
    function (id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        /** @type {?} */
        var editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    EllipsesManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    EllipsesManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipses.get(id);
    };
    /**
     * @return {?}
     */
    EllipsesManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.ellipses.forEach((/**
         * @param {?} ellipse
         * @return {?}
         */
        function (ellipse) { return ellipse.dispose(); }));
        this.ellipses.clear();
    };
    EllipsesManagerService.decorators = [
        { type: Injectable }
    ];
    return EllipsesManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_ELLIPSE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var EllipsesEditorService = /** @class */ (function () {
    function EllipsesEditorService() {
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
    EllipsesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} ellipsesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, ellipsesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    EllipsesEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    EllipsesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (options, priority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var center;
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var ellipseOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions: ellipseOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                /** @type {?} */
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
                /** @type {?} */
                var update = {
                    id: id,
                    center: center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_LAST_POINT,
                };
                _this.updateSubject.next(update);
                clientEditSubject.next(__assign({}, update));
                /** @type {?} */
                var changeMode = {
                    id: id,
                    center: center,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(__assign({}, update));
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (!center) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                /** @type {?} */
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
        }));
        return editorObservable;
    };
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    EllipsesEditorService.prototype.edit = /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (center, majorRadius, rotation, minorRadius, options, priority) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (options === void 0) { options = DEFAULT_ELLIPSE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var ellipseOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        /** @type {?} */
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
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    EllipsesEditorService.prototype.editEllipse = /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.id; }),
            });
        }
        /** @type {?} */
        var shapeDragRegistration;
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
                function (entity) { return id === entity.id; }),
            });
        }
        pointDragRegistration
            .pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
            /** @type {?} */
            var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var pointIsCenter = point === _this.getCenterPoint(id);
            /** @type {?} */
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
            /** @type {?} */
            var update = __assign({ id: id, updatedPoint: point, startDragPosition: startDragPosition,
                endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: editAction }, _this.getEllipseProperties(id));
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update));
        }));
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, endPosition = _b.endPosition, startPosition = _b.startPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var update = __assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            }));
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop;
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = __assign({ id: id,
                    startDragPosition: startDragPosition,
                    endDragPosition: endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, _this.getEllipseProperties(id));
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration, addSecondRadiusRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next((/** @type {?} */ (__assign({ id: id, editMode: EditModes.CREATE_OR_EDIT, editAction: EditActions.DISPOSE }, _this.getEllipseProperties(id)))));
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next((/** @type {?} */ (__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, _this.getEllipseProperties(id)))));
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next((/** @type {?} */ (__assign({ id: id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, _this.getEllipseProperties(id)))));
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
        function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
            /** @type {?} */
            var ellipse = _this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next((/** @type {?} */ ({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            })));
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next((/** @type {?} */ ({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            })));
        });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.ellipsesManager.get(id).labels; });
        observableToExtend.getCenter = (/**
         * @return {?}
         */
        function () { return _this.getCenterPosition(id); });
        observableToExtend.getMajorRadius = (/**
         * @return {?}
         */
        function () { return _this.getMajorRadius(id); });
        observableToExtend.getMinorRadius = (/**
         * @return {?}
         */
        function () { return _this.getMinorRadius(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    EllipsesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        /** @type {?} */
        var ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getCenterPosition = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getCenter();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getCenterPoint = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).center;
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getMajorRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getMinorRadius = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    EllipsesEditorService.prototype.getEllipseProperties = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
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
    EllipsesEditorService.decorators = [
        { type: Injectable }
    ];
    return EllipsesEditorService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var EllipsesEditorComponent = /** @class */ (function () {
    function EllipsesEditorComponent(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager) {
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
    EllipsesEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.ellipsesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    EllipsesEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} ellipse
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    EllipsesEditorComponent.prototype.renderEditLabels = /**
     * @param {?} ellipse
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (ellipse, update, labels) {
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
    /**
     * @param {?} ellipse
     * @return {?}
     */
    EllipsesEditorComponent.prototype.removeEditLabels = /**
     * @param {?} ellipse
     * @return {?}
     */
    function (ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    EllipsesEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                this.removeEditLabels(ellipse);
                this.ellipsesManager.dispose(update.id);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    EllipsesEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    EllipsesEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.ellipsesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    EllipsesEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    EllipsesEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    EllipsesEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ellipses-editor',
                    template: /*html*/ "\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #editEllipsesLayer acFor=\"let ellipse of editEllipses$\" [context]=\"this\" [zIndex]=\"0\">\n      <ac-ellipse-desc\n        props=\"{\n        position: ellipse.getCenterCallbackProperty(),\n        semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),\n        semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),\n        rotation: ellipse.getRotationCallbackProperty(),\n        material: ellipse.ellipseProps.material,\n        outline: ellipse.ellipseProps.outline,\n        outlineWidth: ellipse.ellipseProps.outlineWidth,\n        outlineColor: ellipse.ellipseProps.outlineColor,\n        height: 0\n    }\"\n      >\n      </ac-ellipse-desc>\n\n      <ac-array-desc acFor=\"let label of ellipse.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            text: label.text,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, EllipsesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    EllipsesEditorComponent.ctorParameters = function () { return [
        { type: EllipsesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: EllipsesManagerService }
    ]; };
    EllipsesEditorComponent.propDecorators = {
        editEllipsesLayer: [{ type: ViewChild, args: ['editEllipsesLayer',] }],
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }]
    };
    return EllipsesEditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        _this._pointProps = editOptions.pointProps;
        _this.props = editOptions.polylineProps;
        if (positions && positions.length >= 2) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolyline.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            if (!labels) {
                return;
            }
            /** @type {?} */
            var positions = this.getRealPositions();
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this.polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "pointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    EditablePolyline.prototype.createFromExisting = /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    function (positions) {
        var _this = this;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            _this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    };
    /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    EditablePolyline.prototype.setManually = /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    function (points, polylineProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.remove(p.getId()); }));
        /** @type {?} */
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            /** @type {?} */
            var pointOrCartesian = points[i];
            /** @type {?} */
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
    /**
     * @private
     * @return {?}
     */
    EditablePolyline.prototype.addAllVirtualEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var currentPoints = __spread(this.positions);
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        function (pos, index) {
            if (index !== currentPoints.length - 1) {
                /** @type {?} */
                var currentPoint = pos;
                /** @type {?} */
                var nextIndex = (index + 1) % (currentPoints.length);
                /** @type {?} */
                var nextPoint = currentPoints[nextIndex];
                /** @type {?} */
                var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
                _this.updatePointsLayer(false, midPoint);
            }
        }));
    };
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    EditablePolyline.prototype.setMiddleVirtualPoint = /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    function (firstP, secondP) {
        /** @type {?} */
        var currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        var nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        var midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        var midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    EditablePolyline.prototype.updateMiddleVirtualPoint = /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    function (virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        var prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        var nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    };
    /**
     * @param {?} point
     * @return {?}
     */
    EditablePolyline.prototype.changeVirtualPointToRealPoint = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        // actual point becomes a real point
        /** @type {?} */
        var pointsCount = this.positions.length;
        /** @type {?} */
        var pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        var nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        var nextPoint = this.positions[nextIndex];
        /** @type {?} */
        var prePoint = this.positions[preIndex];
        /** @type {?} */
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolyline.prototype.renderPolylines = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); }));
        this.polylines = [];
        /** @type {?} */
        var realPoints = this.positions.filter((/**
         * @param {?} point
         * @return {?}
         */
        function (point) { return !point.isVirtualEditPoint(); }));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            if (index !== realPoints.length - 1) {
                /** @type {?} */
                var nextIndex = (index + 1);
                /** @type {?} */
                var nextPoint = realPoints[nextIndex];
                /** @type {?} */
                var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.polylineProps);
                _this.polylines.push(polyline);
                _this.polylinesLayer.update(polyline, polyline.getId());
            }
        }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            var firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditablePolyline.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            var pointsCount = this.positions.length;
            /** @type {?} */
            var pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                /** @type {?} */
                var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                /** @type {?} */
                var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
                this.updatePointsLayer(false, nextVirtualPoint);
            }
            if (pointIndex > 0) {
                /** @type {?} */
                var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                /** @type {?} */
                var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
                this.updatePointsLayer(false, prevVirtualPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditablePolyline.prototype.moveTempMovingPoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    EditablePolyline.prototype.moveShape = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.lastDraggedToPosition = draggedToPosition;
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.endMoveShape = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditablePolyline.prototype.removePoint = /**
     * @param {?} pointToRemove
     * @return {?}
     */
    function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); }))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getRealPositions = /**
     * @return {?}
     */
    function () {
        return this.getRealPoints()
            .map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.positions
            .filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getPositions = /**
     * @return {?}
     */
    function () {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    EditablePolyline.prototype.removePosition = /**
     * @private
     * @param {?} point
     * @return {?}
     */
    function (point) {
        /** @type {?} */
        var index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p === point; }));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    EditablePolyline.prototype.updatePointsLayer = /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var point = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            point[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.update = /**
     * @return {?}
     */
    function () {
        this.updatePointsLayer();
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        function (line) { return _this.polylinesLayer.remove(line.getId()); }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditablePolyline;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
var  /**
 * @template T
 */
EditorObservable = /** @class */ (function (_super) {
    __extends(EditorObservable, _super);
    function EditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EditorObservable;
}(Observable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolylineEditorObservable = /** @class */ (function (_super) {
    __extends(PolylineEditorObservable, _super);
    function PolylineEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolylineEditorObservable;
}(EditorObservable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolygonEditorObservable = /** @class */ (function (_super) {
    __extends(PolygonEditorObservable, _super);
    function PolygonEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolygonEditorObservable;
}(EditorObservable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var CircleEditorObservable = /** @class */ (function (_super) {
    __extends(CircleEditorObservable, _super);
    function CircleEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CircleEditorObservable;
}(EditorObservable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var EllipseEditorObservable = /** @class */ (function (_super) {
    __extends(EllipseEditorObservable, _super);
    function EllipseEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EllipseEditorObservable;
}(EditorObservable));

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
var HippodromeEditorObservable = /** @class */ (function (_super) {
    __extends(HippodromeEditorObservable, _super);
    function HippodromeEditorObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HippodromeEditorObservable;
}(EditorObservable));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
        _this.defaultPointProps = editOptions.pointProps;
        _this.hippodromeProps = editOptions.hippodromeProps;
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableHippodrome.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            if (!labels) {
                return;
            }
            /** @type {?} */
            var positions = this.getRealPositions();
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "hippodromeProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hippodromeProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._hippodromeProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "defaultPointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._defaultPointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                point.show = value;
                _this.updatePointsLayer(point);
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    EditableHippodrome.prototype.createFromExisting = /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    function (positions) {
        var _this = this;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            _this.addPointFromExisting(position);
        }));
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.done = true;
    };
    /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    EditableHippodrome.prototype.setPointsManually = /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.remove(p.getId()); }));
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(points));
        this.updateHippdromeLayer();
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.done) {
            return;
        }
        /** @type {?} */
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
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
    /**
     * @private
     * @return {?}
     */
    EditableHippodrome.prototype.createHeightEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); })).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
        /** @type {?} */
        var firstP = this.getRealPoints()[0];
        /** @type {?} */
        var secP = this.getRealPoints()[1];
        /** @type {?} */
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        var bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        /** @type {?} */
        var upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        /** @type {?} */
        var downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    };
    /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    EditableHippodrome.prototype.createMiddleEditablePoint = /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    function (midPointCartesian3, azimuth) {
        /** @type {?} */
        var upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        /** @type {?} */
        var midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditableHippodrome.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
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
    /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    EditableHippodrome.prototype.changeWidthByNewPoint = /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        /** @type {?} */
        var firstP = this.getRealPoints()[0];
        /** @type {?} */
        var secP = this.getRealPoints()[1];
        /** @type {?} */
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        var bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        /** @type {?} */
        var normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        /** @type {?} */
        var bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        /** @type {?} */
        var fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        /** @type {?} */
        var distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        /** @type {?} */
        var radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
    };
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    EditableHippodrome.prototype.moveShape = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.endMoveShape = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) { return _this.updatePointsLayer(point); }));
        this.updateHippdromeLayer();
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.endMovePoint = /**
     * @return {?}
     */
    function () {
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditableHippodrome.prototype.moveTempMovingPoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditableHippodrome.prototype.removePoint = /**
     * @param {?} pointToRemove
     * @return {?}
     */
    function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); })).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getRealPositions = /**
     * @return {?}
     */
    function () {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getRealPositionsCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint(); }));
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getWidth = /**
     * @return {?}
     */
    function () {
        return this.hippodromeProps.width;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getPositions = /**
     * @return {?}
     */
    function () {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    EditableHippodrome.prototype.removePosition = /**
     * @private
     * @param {?} point
     * @return {?}
     */
    function (point) {
        /** @type {?} */
        var index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p === point; }));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    /**
     * @private
     * @param {...?} point
     * @return {?}
     */
    EditableHippodrome.prototype.updatePointsLayer = /**
     * @private
     * @param {...?} point
     * @return {?}
     */
    function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @private
     * @return {?}
     */
    EditableHippodrome.prototype.updateHippdromeLayer = /**
     * @private
     * @return {?}
     */
    function () {
        this.hippodromeLayer.update(this, this.id);
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditableHippodrome;
}(AcEntity));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_POLYLINE_OPTIONS = {
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
        function () { return Cesium.Color.BLACK; }),
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
var PolylinesEditorService = /** @class */ (function () {
    function PolylinesEditorService() {
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
    PolylinesEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} polylinesManager
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, polylinesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    PolylinesEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    PolylinesEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polylineOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
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
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var allPositions = _this.getPositions(id);
            if (allPositions.find((/**
             * @param {?} cartesian
             * @return {?}
             */
            function (cartesian) { return cartesian.equals(position); }))) {
                return;
            }
            /** @type {?} */
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign({}, updateValue, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
            }
        }));
        addLastPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            // position already added by addPointRegistration
            finishedCreate = _this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        }));
        return editorObservable;
    };
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
    PolylinesEditorService.prototype.switchToEditMode = /**
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
    function (id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        /** @type {?} */
        var update = {
            id: id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        /** @type {?} */
        var changeMode = {
            id: id,
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
            function (registration) { return registration.dispose(); }));
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    PolylinesEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_POLYLINE_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var polylineOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    };
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
    PolylinesEditorService.prototype.editPolyline = /**
     * @private
     * @param {?} id
     * @param {?} positions
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, positions, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        /** @type {?} */
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.editedEntityId; }),
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
            }));
        }
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        pointRemoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var entities = _a.entities;
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var allPositions = __spread(_this.getPositions(id));
            if (allPositions.length < 3) {
                return;
            }
            /** @type {?} */
            var index = allPositions.findIndex((/**
             * @param {?} position
             * @return {?}
             */
            function (position) { return point.getPosition().equals((/** @type {?} */ (position))); }));
            if (index < 0) {
                return;
            }
            /** @type {?} */
            var update = {
                id: id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id) }));
        }));
        /** @type {?} */
        var observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    PolylinesEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        /** @type {?} */
        var polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps, options.pointProps);
        polylineOptions.polylineProps = Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps, options.polylineProps);
        return polylineOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        });
        observableToExtend.setManually = (/**
         * @param {?} points
         * @param {?=} polylineProps
         * @return {?}
         */
        function (points, polylineProps) {
            /** @type {?} */
            var polyline = _this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        function () { return _this.getPoints(id); });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.polylinesManager.get(id).labels; });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    PolylinesEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    };
    PolylinesEditorService.decorators = [
        { type: Injectable }
    ];
    return PolylinesEditorService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolylinesManagerService = /** @class */ (function () {
    function PolylinesManagerService() {
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
    PolylinesManagerService.prototype.createEditablePolyline = /**
     * @param {?} id
     * @param {?} editPolylinesLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} polylineOptions
     * @param {?=} positions
     * @return {?}
     */
    function (id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        /** @type {?} */
        var editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    PolylinesManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.polylines.get(id);
    };
    /**
     * @return {?}
     */
    PolylinesManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        function (polyline) { return polyline.dispose(); }));
        this.polylines.clear();
    };
    PolylinesManagerService.decorators = [
        { type: Injectable }
    ];
    return PolylinesManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PolylinesEditorComponent = /** @class */ (function () {
    function PolylinesEditorComponent(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager) {
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
    PolylinesEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polylinesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} polyline
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    PolylinesEditorComponent.prototype.renderEditLabels = /**
     * @param {?} polyline
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (polyline, update, labels) {
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
    /**
     * @param {?} polyline
     * @return {?}
     */
    PolylinesEditorComponent.prototype.removeEditLabels = /**
     * @param {?} polyline
     * @return {?}
     */
    function (polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolylinesEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                polyline.dispose();
                this.removeEditLabels(polyline);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    PolylinesEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
                    polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    PolylinesEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.polylinesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    PolylinesEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    PolylinesEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'polylines-editor',
                    template: /*html*/ "\n    <ac-layer #editPolylinesLayer acFor=\"let polyline of editPolylines$\" [context]=\"this\">\n      <ac-polyline-primitive-desc\n        props=\"{\n        positions: polyline.getPositions(),\n        width: polyline.props.width,\n        material: polyline.props.material()\n    }\"\n      >\n      </ac-polyline-primitive-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n\n    <ac-layer #polylineLabelsLayer acFor=\"let polylineLabels of polylineLabels$\" [context]=\"this\">\n      <ac-array-desc acFor=\"let label of polylineLabels.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, PolylinesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    PolylinesEditorComponent.ctorParameters = function () { return [
        { type: PolylinesEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: PolylinesManagerService }
    ]; };
    PolylinesEditorComponent.propDecorators = {
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
        editPolylinesLayer: [{ type: ViewChild, args: ['editPolylinesLayer',] }],
        polylineLabelsLayer: [{ type: ViewChild, args: ['polylineLabelsLayer',] }]
    };
    return PolylinesEditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var HippodromeManagerService = /** @class */ (function () {
    function HippodromeManagerService() {
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
    HippodromeManagerService.prototype.createEditableHippodrome = /**
     * @param {?} id
     * @param {?} editHippodromeLayer
     * @param {?} editPointsLayer
     * @param {?} coordinateConverter
     * @param {?=} hippodromeEditOptions
     * @param {?=} positions
     * @return {?}
     */
    function (id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        /** @type {?} */
        var editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    HippodromeManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.hippodromes.get(id);
    };
    /**
     * @return {?}
     */
    HippodromeManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.hippodromes.forEach((/**
         * @param {?} hippodrome
         * @return {?}
         */
        function (hippodrome) { return hippodrome.dispose(); }));
        this.hippodromes.clear();
    };
    HippodromeManagerService.decorators = [
        { type: Injectable }
    ];
    return HippodromeManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_HIPPODROME_OPTIONS = {
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
var HippodromeEditorService = /** @class */ (function () {
    function HippodromeEditorService() {
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
    HippodromeEditorService.prototype.init = /**
     * @param {?} mapEventsManager
     * @param {?} coordinateConverter
     * @param {?} cameraService
     * @param {?} managerService
     * @return {?}
     */
    function (mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    };
    /**
     * @return {?}
     */
    HippodromeEditorService.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        return this.updatePublisher;
    };
    /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    HippodromeEditorService.prototype.create = /**
     * @param {?=} options
     * @param {?=} eventPriority
     * @return {?}
     */
    function (options, eventPriority) {
        var _this = this;
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (eventPriority === void 0) { eventPriority = 100; }
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var hippodromeOptions = this.setOptions(options);
        /** @type {?} */
        var clientEditSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        /** @type {?} */
        var finishedCreate = false;
        this.updateSubject.next({
            id: id,
            positions: positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeOptions,
        });
        /** @type {?} */
        var mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        /** @type {?} */
        var addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        /** @type {?} */
        var editorObservable = this.createEditorObservable(clientEditSubject, id);
        mouseMoveRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            /** @type {?} */
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
        }));
        addPointRegistration.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var endPosition = _a.movement.endPosition;
            if (finishedCreate) {
                return;
            }
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var allPositions = _this.getPositions(id);
            /** @type {?} */
            var isFirstPoint = _this.getPositions(id).length === 0;
            /** @type {?} */
            var updateValue = {
                id: id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            _this.updateSubject.next(updateValue);
            clientEditSubject.next(__assign({}, updateValue, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            if (!isFirstPoint) {
                /** @type {?} */
                var changeMode = {
                    id: id,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.CHANGE_TO_EDIT,
                };
                _this.updateSubject.next(changeMode);
                clientEditSubject.next(changeMode);
                if (_this.observablesMap.has(id)) {
                    _this.observablesMap.get(id).forEach((/**
                     * @param {?} registration
                     * @return {?}
                     */
                    function (registration) { return registration.dispose(); }));
                }
                _this.observablesMap.delete(id);
                _this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
                finishedCreate = true;
            }
        }));
        return editorObservable;
    };
    /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    HippodromeEditorService.prototype.edit = /**
     * @param {?} positions
     * @param {?=} options
     * @param {?=} priority
     * @return {?}
     */
    function (positions, options, priority) {
        if (options === void 0) { options = DEFAULT_HIPPODROME_OPTIONS; }
        if (priority === void 0) { priority = 100; }
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        /** @type {?} */
        var id = generateKey();
        /** @type {?} */
        var hippodromeEditOptions = this.setOptions(options);
        /** @type {?} */
        var editSubject = new BehaviorSubject({
            id: id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        /** @type {?} */
        var update = {
            id: id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(__assign({}, update, { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    };
    /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    HippodromeEditorService.prototype.editHippodrome = /**
     * @private
     * @param {?} id
     * @param {?} priority
     * @param {?} editSubject
     * @param {?} options
     * @param {?=} editObservable
     * @return {?}
     */
    function (id, priority, editSubject, options, editObservable) {
        var _this = this;
        /** @type {?} */
        var shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: (/**
                 * @param {?} entity
                 * @return {?}
                 */
                function (entity) { return id === entity.id; }),
            });
        }
        /** @type {?} */
        var pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            priority: priority,
            pickFilter: (/**
             * @param {?} entity
             * @return {?}
             */
            function (entity) { return id === entity.editedEntityId; }),
        });
        pointDragRegistration.pipe(tap((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var drop = _a.movement.drop;
            return _this.cameraService.enableInputs(drop);
        })))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = _a.movement, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
            /** @type {?} */
            var position = _this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            /** @type {?} */
            var point = entities[0];
            /** @type {?} */
            var update = {
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            _this.updateSubject.next(update);
            editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
        }));
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var drop = _a.movement.drop;
                return _this.cameraService.enableInputs(drop);
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = _a.movement, startPosition = _b.startPosition, endPosition = _b.endPosition, drop = _b.drop, entities = _a.entities;
                /** @type {?} */
                var endDragPosition = _this.coordinateConverter.screenToCartesian3(endPosition);
                /** @type {?} */
                var startDragPosition = _this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                /** @type {?} */
                var update = {
                    id: id,
                    positions: _this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                _this.updateSubject.next(update);
                editSubject.next(__assign({}, update, { positions: _this.getPositions(id), points: _this.getPoints(id), width: _this.getWidth(id) }));
            }));
        }
        /** @type {?} */
        var observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    HippodromeEditorService.prototype.setOptions = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        /** @type {?} */
        var hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
    };
    /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.createEditorObservable = /**
     * @private
     * @param {?} observableToExtend
     * @param {?} id
     * @return {?}
     */
    function (observableToExtend, id) {
        var _this = this;
        observableToExtend.dispose = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var observables = _this.observablesMap.get(id);
            if (observables) {
                observables.forEach((/**
                 * @param {?} obs
                 * @return {?}
                 */
                function (obs) { return obs.dispose(); }));
            }
            _this.observablesMap.delete(id);
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        });
        observableToExtend.enable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        });
        observableToExtend.disable = (/**
         * @return {?}
         */
        function () {
            _this.updateSubject.next({
                id: id,
                positions: _this.getPositions(id),
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
        function (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) {
            /** @type {?} */
            var firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            var secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            /** @type {?} */
            var hippodrome = _this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        });
        observableToExtend.setLabelsRenderFn = (/**
         * @param {?} callback
         * @return {?}
         */
        function (callback) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        });
        observableToExtend.updateLabels = (/**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            _this.updateSubject.next({
                id: id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        });
        observableToExtend.getCurrentPoints = (/**
         * @return {?}
         */
        function () { return _this.getPoints(id); });
        observableToExtend.getEditValue = (/**
         * @return {?}
         */
        function () { return observableToExtend.getValue(); });
        observableToExtend.getLabels = (/**
         * @return {?}
         */
        function () { return _this.hippodromeManager.get(id).labels; });
        observableToExtend.getCurrentWidth = (/**
         * @return {?}
         */
        function () { return _this.getWidth(id); });
        return (/** @type {?} */ (observableToExtend));
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getPositions = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getPoints = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    };
    /**
     * @private
     * @param {?} id
     * @return {?}
     */
    HippodromeEditorService.prototype.getWidth = /**
     * @private
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    };
    HippodromeEditorService.decorators = [
        { type: Injectable }
    ];
    return HippodromeEditorService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @private
     * @return {?}
     */
    HippodromeEditorComponent.prototype.startListeningToEditorUpdates = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.hippodromesEditor.onUpdate().subscribe((/**
         * @param {?} update
         * @return {?}
         */
        function (update) {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                _this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                _this.handleEditUpdates(update);
            }
        }));
    };
    /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    HippodromeEditorComponent.prototype.getLabelId = /**
     * @param {?} element
     * @param {?} index
     * @return {?}
     */
    function (element, index) {
        return index.toString();
    };
    /**
     * @param {?} hippodrome
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    HippodromeEditorComponent.prototype.renderEditLabels = /**
     * @param {?} hippodrome
     * @param {?} update
     * @param {?=} labels
     * @return {?}
     */
    function (hippodrome, update, labels) {
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
    /**
     * @param {?} hippodrome
     * @return {?}
     */
    HippodromeEditorComponent.prototype.removeEditLabels = /**
     * @param {?} hippodrome
     * @return {?}
     */
    function (hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    };
    /**
     * @param {?} update
     * @return {?}
     */
    HippodromeEditorComponent.prototype.handleCreateUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                hippodrome.dispose();
                this.removeEditLabels(hippodrome);
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    };
    /**
     * @param {?} update
     * @return {?}
     */
    HippodromeEditorComponent.prototype.handleEditUpdates = /**
     * @param {?} update
     * @return {?}
     */
    function (update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                /** @type {?} */
                var hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    HippodromeEditorComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.hippodromesManager.clear();
    };
    /**
     * @param {?} point
     * @return {?}
     */
    HippodromeEditorComponent.prototype.getPointSize = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    };
    /**
     * @param {?} point
     * @return {?}
     */
    HippodromeEditorComponent.prototype.getPointShow = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    };
    HippodromeEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'hippodrome-editor',
                    template: /*html*/ "\n    <ac-layer #editHippodromesLayer acFor=\"let hippodrome of editHippodromes$\" [context]=\"this\">\n      <ac-corridor-desc\n        props=\"{\n\t\tpositions: hippodrome.getRealPositionsCallbackProperty(),\n\t\tcornerType: Cesium.CornerType.ROUNDED,\n\t\tmaterial: hippodrome.hippodromeProps.material,\n\t\twidth : hippodrome.hippodromeProps.width,\n\t\toutline: hippodrome.hippodromeProps.outline,\n\t\toutlineColor: hippodrome.hippodromeProps.outlineColor,\n        outlineWidth: hippodrome.hippodromeProps.outlineWidth,\n        height: 0\n\t}\"\n      >\n      </ac-corridor-desc>\n\n      <ac-array-desc acFor=\"let label of hippodrome.labels\" [idGetter]=\"getLabelId\">\n        <ac-label-primitive-desc\n          props=\"{\n            position: label.position,\n            backgroundColor: label.backgroundColor,\n            backgroundPadding: label.backgroundPadding,\n            distanceDisplayCondition: label.distanceDisplayCondition,\n            eyeOffset: label.eyeOffset,\n            fillColor: label.fillColor,\n            font: label.font,\n            heightReference: label.heightReference,\n            horizontalOrigin: label.horizontalOrigin,\n            outlineColor: label.outlineColor,\n            outlineWidth: label.outlineWidth,\n            pixelOffset: label.pixelOffset,\n            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,\n            scale: label.scale,\n            scaleByDistance: label.scaleByDistance,\n            show: label.show,\n            showBackground: label.showBackground,\n            style: label.style,\n            text: label.text,\n            translucencyByDistance: label.translucencyByDistance,\n            verticalOrigin: label.verticalOrigin\n        }\"\n        >\n        </ac-label-primitive-desc>\n      </ac-array-desc>\n    </ac-layer>\n\n    <ac-layer #editPointsLayer acFor=\"let point of editPoints$\" [context]=\"this\">\n      <ac-point-desc\n        props=\"{\n        position: point.getPosition(),\n        pixelSize: getPointSize(point),\n        color: point.props.color,\n        outlineColor: point.props.outlineColor,\n        outlineWidth: point.props.outlineWidth,\n        show: getPointShow(point)\n    }\"\n      >\n      </ac-point-desc>\n    </ac-layer>\n  ",
                    providers: [CoordinateConverter, HippodromeManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    HippodromeEditorComponent.ctorParameters = function () { return [
        { type: HippodromeEditorService },
        { type: CoordinateConverter },
        { type: MapEventsManagerService },
        { type: CameraService },
        { type: HippodromeManagerService }
    ]; };
    HippodromeEditorComponent.propDecorators = {
        editPointsLayer: [{ type: ViewChild, args: ['editPointsLayer',] }],
        editHippodromesLayer: [{ type: ViewChild, args: ['editHippodromesLayer',] }]
    };
    return HippodromeEditorComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} coordinateConverter
     * @return {?}
     */
    DraggableToMapService.prototype.setCoordinateConverter = /**
     * @param {?} coordinateConverter
     * @return {?}
     */
    function (coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    };
    /**
     * @param {?} imageSrc
     * @param {?=} style
     * @return {?}
     */
    DraggableToMapService.prototype.drag = /**
     * @param {?} imageSrc
     * @param {?=} style
     * @return {?}
     */
    function (imageSrc, style) {
        var _this = this;
        if (!this.coordinateConverter) {
            /** @type {?} */
            var mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        /** @type {?} */
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
        this.dragObservable.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            _this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }), (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            imgElement.remove();
        }), (/**
         * @return {?}
         */
        function () {
            imgElement.remove();
        }));
    };
    /**
     * @return {?}
     */
    DraggableToMapService.prototype.dragUpdates = /**
     * @return {?}
     */
    function () {
        return this.mainSubject;
    };
    /**
     * @return {?}
     */
    DraggableToMapService.prototype.cancel = /**
     * @return {?}
     */
    function () {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    };
    /**
     * @private
     * @return {?}
     */
    DraggableToMapService.prototype.createDragObservable = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var stopper = new Subject();
        /** @type {?} */
        var dropSubject = new Subject();
        /** @type {?} */
        var pointerUp = fromEvent(document, 'pointerup');
        /** @type {?} */
        var pointerMove = fromEvent(document, 'pointermove');
        /** @type {?} */
        var dragStartPositionX;
        /** @type {?} */
        var dragStartPositionY;
        /** @type {?} */
        var lastMove;
        /** @type {?} */
        var moveObservable = pointerMove.pipe(map((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
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
        })), takeUntil(pointerUp), tap(undefined, undefined, (/**
         * @return {?}
         */
        function () {
            if (lastMove) {
                /** @type {?} */
                var dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        })));
        this.dragObservable = moveObservable.pipe(merge$1(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    };
    DraggableToMapService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DraggableToMapService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: MapsManagerService }
    ]; };
    return DraggableToMapService;
}());

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
    /**
     * @return {?}
     */
    DraggableToMapDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    };
    /**
     * @return {?}
     */
    DraggableToMapDirective.prototype.onMouseDown = /**
     * @return {?}
     */
    function () {
        this.iconDragService.drag(this.src, this.style);
    };
    DraggableToMapDirective.decorators = [
        { type: Directive, args: [{ selector: '[draggableToMap]' },] }
    ];
    /** @nocollapse */
    DraggableToMapDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DraggableToMapService }
    ]; };
    DraggableToMapDirective.propDecorators = {
        draggableToMap: [{ type: Input }],
        onMouseDown: [{ type: HostListener, args: ['mousedown',] }]
    };
    return DraggableToMapDirective;
}());

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
var AcToolbarComponent = /** @class */ (function () {
    function AcToolbarComponent(element, cesiumService) {
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
    AcToolbarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            /** @type {?} */
            var mouseDown$ = fromEvent(this.element.nativeElement, 'mousedown');
            /** @type {?} */
            var mouseMove$_1 = fromEvent(document, 'mousemove');
            /** @type {?} */
            var mouseUp$_1 = fromEvent(document, 'mouseup');
            /** @type {?} */
            var drag$ = mouseDown$.pipe(switchMap((/**
             * @return {?}
             */
            function () { return mouseMove$_1.pipe(takeUntil(mouseUp$_1)); })));
            this.subscription = drag$.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                _this.element.nativeElement.style.left = event.x + 'px';
                _this.element.nativeElement.style.top = event.y + 'px';
            }));
        }
    };
    /**
     * @return {?}
     */
    AcToolbarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    AcToolbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-toolbar',
                    template: "\n        <div class=\"{{toolbarClass}}\">\n            <div *ngIf=\"allowDrag\">\n                <ac-toolbar-button>\n                    <ac-drag-icon></ac-drag-icon>\n                </ac-toolbar-button>\n            </div>\n\n            <ng-content></ng-content>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["\n        :host {\n            position: absolute;\n            top: 20px;\n            left: 20px;\n            width: 20px;\n            height: 20px;\n            z-index: 999;\n            -webkit-user-drag: none;\n        }\n    "]
                }] }
    ];
    /** @nocollapse */
    AcToolbarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CesiumService }
    ]; };
    AcToolbarComponent.propDecorators = {
        toolbarClass: [{ type: Input }],
        allowDrag: [{ type: Input }]
    };
    return AcToolbarComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var DragIconComponent = /** @class */ (function () {
    function DragIconComponent() {
    }
    DragIconComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-drag-icon',
                    template: "\n        <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\"  x=\"0px\" y=\"0px\"  height=\"25\"  width=\"25\"\n\t viewBox=\"0 0 476.737 476.737\" style=\"enable-background:new 0 0 476.737 476.737;\" xml:space=\"preserve\">\n<g>\n\t<g>\n\t\t<path style=\"fill:#010002;\" d=\"M475.498,232.298l-3.401-5.149l-63.565-63.565c-6.198-6.198-16.304-6.198-22.47,0\n\t\t\tc-6.198,6.198-6.198,16.273,0,22.47l36.423,36.423H254.26V54.253l36.423,36.423c6.166,6.198,16.273,6.198,22.47,0\n\t\t\tc6.166-6.198,6.166-16.273,0-22.47L249.588,4.64l-0.159-0.095l-4.99-3.305L238.369,0h-0.064l-6.007,1.24l-4.99,3.305l-0.191,0.095\n\t\t\tl-63.565,63.565c-6.198,6.198-6.198,16.273,0,22.47s16.273,6.198,22.47,0l36.455-36.423v168.225H54.253l36.423-36.423\n\t\t\tc6.198-6.198,6.198-16.273,0-22.47s-16.273-6.198-22.47,0L4.64,227.149l-0.095,0.159l-3.305,4.99L0,238.369v0.064l1.24,6.007\n\t\t\tl3.305,4.958l0.095,0.191l63.565,63.565c6.198,6.198,16.273,6.198,22.47,0c6.198-6.166,6.198-16.273,0-22.47L54.253,254.26\n\t\t\th168.225v168.225l-36.423-36.423c-6.198-6.166-16.273-6.166-22.47,0c-6.198,6.198-6.198,16.304,0,22.47l63.565,63.565l5.149,3.432\n\t\t\tl6.007,1.208h0.064l6.07-1.24l5.149-3.401l63.565-63.565c6.166-6.198,6.166-16.304,0-22.47c-6.198-6.198-16.304-6.198-22.47,0\n\t\t\tl-36.423,36.423V254.26h168.225l-36.423,36.423c-6.166,6.166-6.166,16.273,0,22.47c6.198,6.166,16.304,6.166,22.47,0\n\t\t\tl63.565-63.565l3.432-5.149l1.208-6.007v-0.064L475.498,232.298z\"/>\n\t</g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n    "
                }] }
    ];
    /** @nocollapse */
    DragIconComponent.ctorParameters = function () { return []; };
    return DragIconComponent;
}());

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
var AcToolbarButtonComponent = /** @class */ (function () {
    function AcToolbarButtonComponent() {
        this.onClick = new EventEmitter();
    }
    /**
     * @return {?}
     */
    AcToolbarButtonComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    AcToolbarButtonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-toolbar-button',
                    template: "\n        <div (click)=\"onClick.emit()\" class=\"button-container {{buttonClass}}\">\n            <img *ngIf=\"iconUrl\" [src]=\"iconUrl\" class=\"icon {{iconClass}}\"/>\n            <ng-content></ng-content>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["\n        .button-container {\n            border-radius: 1px;\n            background-color: rgba(255, 255, 255, 0.8);\n            height: 30px;\n            width: 30px;\n            padding: 5px;\n            transition: all 0.2s;\n            cursor: pointer;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            flex-direction: column;\n        }\n\n        .button-container:hover {\n            background-color: rgba(255, 255, 255, 0.95);\n        }\n\n        .icon {\n            height: 30px;\n            width: 30px;\n        }\n    "]
                }] }
    ];
    /** @nocollapse */
    AcToolbarButtonComponent.ctorParameters = function () { return []; };
    AcToolbarButtonComponent.propDecorators = {
        iconUrl: [{ type: Input }],
        buttonClass: [{ type: Input }],
        iconClass: [{ type: Input }],
        onClick: [{ type: Output }]
    };
    return AcToolbarButtonComponent;
}());

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
var RangeAndBearingComponent = /** @class */ (function () {
    function RangeAndBearingComponent(polylineEditor, coordinateConverter) {
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
    RangeAndBearingComponent.prototype.create = /**
     * @param {?=} __0
     * @return {?}
     */
    function (_a) {
        var _this = this;
        var _b = _a === void 0 ? { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} } : _a, _c = _b.lineEditOptions, lineEditOptions = _c === void 0 ? {} : _c, _d = _b.labelsStyle, labelsStyle = _d === void 0 ? {} : _d, _e = _b.distanceLabelsStyle, distanceLabelsStyle = _e === void 0 ? {} : _e, _f = _b.bearingLabelsStyle, bearingLabelsStyle = _f === void 0 ? {} : _f, bearingStringFn = _b.bearingStringFn, distanceStringFn = _b.distanceStringFn, labelsRenderFn = _b.labelsRenderFn;
        /** @type {?} */
        var rnb = this.polylineEditor.create(__assign({ allowDrag: false, pointProps: {
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
            function (update) {
                /** @type {?} */
                var positions = update.positions;
                /** @type {?} */
                var totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? __spread(positions, [update.updatedPosition]) : positions).reduce((/**
                 * @param {?} labels
                 * @param {?} position
                 * @param {?} index
                 * @param {?} array
                 * @return {?}
                 */
                function (labels, position, index, array) {
                    if (index !== 0) {
                        /** @type {?} */
                        var previousPosition = array[index - 1];
                        /** @type {?} */
                        var bearing = _this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        /** @type {?} */
                        var distance = Cesium.Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(__assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (_this.bearingStringFn && _this.bearingStringFn(bearing)) ||
                                bearing.toFixed(2) + "\u00B0", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (_this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (_this.bearingLabelsStyle))), ((/** @type {?} */ (bearingLabelsStyle)))), __assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (_this.distanceStringFn && _this.distanceStringFn(totalDistance + distance)) ||
                                (totalDistance + distance).toFixed(2) + " Km", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-35, -8), position: position, fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (_this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (_this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))));
                        totalDistance += distance;
                    }
                    return labels;
                }), [
                    __assign({ text: (distanceStringFn && distanceStringFn(0)) || (_this.distanceStringFn && _this.distanceStringFn(0)) || "0 Km", scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: positions[0], fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (_this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (_this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))),
                ]);
            }));
        }
        return rnb;
    };
    RangeAndBearingComponent.decorators = [
        { type: Component, args: [{
                    selector: 'range-and-bearing',
                    template: "\n    <polylines-editor></polylines-editor>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [PolylinesEditorService]
                }] }
    ];
    /** @nocollapse */
    RangeAndBearingComponent.ctorParameters = function () { return [
        { type: PolylinesEditorService },
        { type: CoordinateConverter }
    ]; };
    RangeAndBearingComponent.propDecorators = {
        lineEditOptions: [{ type: Input }],
        labelsStyle: [{ type: Input }],
        distanceLabelsStyle: [{ type: Input }],
        bearingLabelsStyle: [{ type: Input }],
        bearingStringFn: [{ type: Input }],
        distanceStringFn: [{ type: Input }],
        labelsRenderFn: [{ type: Input }]
    };
    return RangeAndBearingComponent;
}());

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
        };
    }
    /**
     * @param {?} cesiumService
     * @param {?} cameraService
     * @return {?}
     */
    ZoomToRectangleService.prototype.init = /**
     * @param {?} cesiumService
     * @param {?} cameraService
     * @return {?}
     */
    function (cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    };
    /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    ZoomToRectangleService.prototype.activate = /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    function (options, mapId) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        /** @type {?} */
        var finalOptions = Object.assign({}, this.defaultOptions, options);
        /** @type {?} */
        var cameraService = this.cameraService;
        /** @type {?} */
        var mapContainer;
        /** @type {?} */
        var map$$1;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
            map$$1 = this.cesiumService.getMap();
        }
        if (mapId) {
            map$$1 = this.mapsManager.getMap(mapId);
            if (!map$$1) {
                throw new Error("Map not found with id: " + mapId);
            }
            cameraService = map$$1.getCameraService();
            mapContainer = map$$1.getCesiumViewer().container;
        }
        if (!cameraService || !mapContainer) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        this.disable(mapId);
        /** @type {?} */
        var container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        /** @type {?} */
        var mapZoomData = { container: container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        /** @type {?} */
        var mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        /** @type {?} */
        var borderElement;
        container.onmousedown = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map$$1);
                }
                /** @type {?} */
                var rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                var offsetX = e.clientX - rect.left;
                /** @type {?} */
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
        });
        container.onmouseup = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (borderElement) {
                /** @type {?} */
                var zoomApplied = _this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds);
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
                    _this.disable(mapId);
                }
            }
        });
        container.onmousemove = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (borderElement) {
                /** @type {?} */
                var rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                var offsetX = e.clientX - rect.left;
                /** @type {?} */
                var offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        });
        /** @type {?} */
        var resetOnEscapePress = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
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
    };
    /**
     * @param {?=} mapId
     * @return {?}
     */
    ZoomToRectangleService.prototype.disable = /**
     * @param {?=} mapId
     * @return {?}
     */
    function (mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        /** @type {?} */
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
    /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    ZoomToRectangleService.prototype.zoomCameraToRectangle = /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    function (cameraService, positions, animationDuration) {
        /** @type {?} */
        var camera = cameraService.getCamera();
        /** @type {?} */
        var cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        /** @type {?} */
        var cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        /** @type {?} */
        var cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        /** @type {?} */
        var cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            duration: animationDuration,
        });
        return true;
    };
    ZoomToRectangleService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ZoomToRectangleService.ctorParameters = function () { return [
        { type: MapsManagerService },
        { type: CameraService, decorators: [{ type: Optional }] },
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    return ZoomToRectangleService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AngularCesiumWidgetsModule = /** @class */ (function () {
    function AngularCesiumWidgetsModule() {
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
    return AngularCesiumWidgetsModule;
}());

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
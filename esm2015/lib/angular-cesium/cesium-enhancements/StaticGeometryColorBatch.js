/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
export function fixCesiumEntitiesShadows() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY2VzaXVtLWVuaGFuY2VtZW50cy9TdGF0aWNHZW9tZXRyeUNvbG9yQmF0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztNQU1NLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0I7O01BQzFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSzs7TUFDcEIsOEJBQThCLEdBQUcsTUFBTSxDQUFDLDhCQUE4Qjs7TUFDdEUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPOztNQUN4Qix3QkFBd0IsR0FBRyxNQUFNLENBQUMsd0JBQXdCOztNQUMxRCxpREFBaUQsR0FBRyxNQUFNLENBQUMsaURBQWlEOztNQUM1Ryw2QkFBNkIsR0FBRyxNQUFNLENBQUMsNkJBQTZCOztNQUNwRSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVM7O01BQzVCLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVTs7TUFDOUIsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLG1CQUFtQjs7TUFDaEQscUJBQXFCLEdBQUcsTUFBTSxDQUFDLHFCQUFxQjs7TUFDcEQsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQjs7TUFDMUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFROztJQUU1QixZQUFZLEdBQUcsSUFBSSxLQUFLLEVBQUU7O0lBQzFCLCtCQUErQixHQUFHLElBQUksd0JBQXdCLEVBQUU7O0lBQ2hFLCtCQUErQixHQUFHLElBQUksd0JBQXdCLEVBQUU7Ozs7Ozs7Ozs7O0FBRXBFLFNBQVMsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLHVCQUF1QixFQUFFLHlCQUF5QixFQUFFLE1BQU0sRUFBRSxPQUFPO0lBQ3pILElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3JDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQztJQUN2RCxJQUFJLENBQUMseUJBQXlCLEdBQUcseUJBQXlCLENBQUM7SUFDM0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztJQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztJQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUN2QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3pDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOztRQUVyQiwwQkFBMEI7SUFDOUIsSUFBSSxPQUFPLENBQUMseUJBQXlCLENBQUMsRUFBRTtRQUN0QywwQkFBMEIsR0FBRyx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BJO0lBQ0QsSUFBSSxDQUFDLDBCQUEwQixHQUFHLDBCQUEwQixDQUFDO0FBQy9ELENBQUM7QUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQjs7O0FBQUc7SUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDMUIsQ0FBQyxDQUFBLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVU7Ozs7QUFBRyxVQUFVLE9BQU87O1FBQ3hDLFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCOztRQUN6QyxlQUFlLEdBQUcsT0FBTyxDQUFDLHlCQUF5QjtJQUN2RCxJQUFJLGVBQWUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUN6QztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFBLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUc7Ozs7O0FBQUcsVUFBVSxPQUFPLEVBQUUsUUFBUTs7UUFDM0MsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFO0lBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsRUFBRTtRQUMxSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM5QztTQUFNOztZQUNELElBQUksR0FBRyxJQUFJO1FBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCOzs7Ozs7O1FBQUMsVUFBVSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQzdILElBQUksWUFBWSxLQUFLLFdBQVcsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUMsRUFBQyxDQUFDLENBQUM7S0FDTDtBQUNILENBQUMsQ0FBQSxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNOzs7O0FBQUcsVUFBVSxPQUFPOztRQUNwQyxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUU7SUFDbkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQ3hFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDNUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7WUFDbkMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN4QixXQUFXLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9CO0tBQ0Y7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTs7OztBQUFHLFVBQVUsSUFBSTs7UUFDakMsU0FBUyxHQUFHLElBQUk7O1FBQ2hCLFlBQVksR0FBRyxDQUFDOztRQUNoQixTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7O1FBQzFCLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVTs7UUFDNUIsVUFBVTs7UUFDVixDQUFDO0lBRUwsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFOztZQUNwQixVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNOztZQUNqQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTTtRQUN4QyxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtZQUN4QixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO2lCQUMvQjtxQkFBTTtvQkFDTCxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM5QjthQUNGO1lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTs7b0JBQ2pDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDOztvQkFDNUIsa0JBQWtCLEdBQUcsWUFBWSxDQUFDLFVBQVU7Z0JBQ2hELFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUVyRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDdkIsSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3BDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztxQkFDakQ7b0JBQ0QsSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3JDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztxQkFDbkQ7b0JBQ0QsSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUU7d0JBQzlDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQztxQkFDckU7aUJBQ0Y7YUFDRjs7Z0JBRUcsbUJBQW1CO1lBQ3ZCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO2dCQUN6QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUNsSDtnQkFDRCxtQkFBbUIsR0FBRyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztvQkFDckQsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7b0JBQ2hDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztvQkFDN0IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUNwQixDQUFDLENBQUM7YUFDSjtZQUVELFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQztnQkFDeEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7b0JBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUMsU0FBUztvQkFDbkYsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO29CQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCLENBQUM7Z0JBQ0YsbUJBQW1CLEVBQUUsbUJBQW1CO2dCQUN4QyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEIsQ0FBQyxDQUFDO1lBQ0gsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQixTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ25CO2FBQU07WUFDTCxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDdEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0IsU0FBUyxHQUFHLFNBQVMsQ0FBQzthQUN2Qjs7Z0JBQ0csWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZO1lBQ3BDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzthQUMvQjtTQUNGO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztLQUM3QjtTQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDaEQsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzlCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsWUFBWSxxQkFBcUIsQ0FBQyxFQUFFO1lBQy9HLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNqSCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7U0FDdEU7O1lBRUcsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU07O1lBQzNELE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxNQUFNOztZQUN0QyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWU7UUFDMUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2dCQUN2QixPQUFPLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDOztnQkFDbkMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFNUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxHQUFHLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQ2pEO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLElBQUksZUFBZSxFQUFFOztvQkFDM0QsYUFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLOztvQkFDbEQsV0FBVyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDO2dCQUM1RixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxFQUFFO29CQUNyRCxVQUFVLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDeEUsVUFBVSxDQUFDLEtBQUssR0FBRyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekYsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO3dCQUMzRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO3FCQUM5QztpQkFDRjthQUNGO1lBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksT0FBTyxDQUFDLHlCQUF5QixZQUFZLHFCQUFxQixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxJQUFJLGVBQWUsQ0FBQyxFQUFFOztvQkFDakwsc0JBQXNCLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLEtBQUs7O29CQUNoRSxVQUFVLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQztnQkFDcEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxFQUFFO29CQUM3RCxVQUFVLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQ3pGLFVBQVUsQ0FBQyxjQUFjLEdBQUcsOEJBQThCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQzNHO2FBQ0Y7O2dCQUVHLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Z0JBQ3RGLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDMUMsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUN4QixVQUFVLENBQUMsSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hGOztnQkFFRyxnQ0FBZ0MsR0FBRyxPQUFPLENBQUMsZ0NBQWdDO1lBQy9FLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLEVBQUU7O29CQUN0RCx3QkFBd0IsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFLCtCQUErQixDQUFDO2dCQUNuSyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFO29CQUN4RyxVQUFVLENBQUMsNkJBQTZCLEdBQUcsd0JBQXdCLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO29CQUM5SSxVQUFVLENBQUMsd0JBQXdCLEdBQUcsaURBQWlELENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2lCQUNoSzthQUNGO1NBQ0Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0tBQzlCO1NBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pELFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDbkI7SUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7SUFDekMsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFBLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVc7Ozs7QUFBRyxVQUFVLFNBQVM7O1FBQzNDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU07O1FBQ3ZDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTTtJQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztZQUMzQixPQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQzs7WUFDekIsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7O1lBRXhDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hCLFVBQVUsR0FBRyxTQUFTLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2pEOztZQUVHLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVM7O1lBQy9CLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDMUMsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQ3hCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEY7S0FDRjtJQUNELElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEMsQ0FBQyxDQUFBLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVE7Ozs7QUFBRyxVQUFVLE9BQU87SUFDMUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFBLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQjs7Ozs7QUFBRyxVQUFVLE9BQU8sRUFBRSxNQUFNOztRQUN2RCxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7SUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7S0FDcEM7O1FBQ0csVUFBVSxHQUFHLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3hFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFHLEVBQUU7UUFDbEUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDeEQsT0FBTyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7S0FDbkM7SUFDRCxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxPQUFPLG1CQUFtQixDQUFDLElBQUksQ0FBQztBQUNsQyxDQUFDLENBQUEsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsbUJBQW1COzs7QUFBRzs7UUFDaEMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVOztRQUU1QixTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7SUFDOUIsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDdEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDM0I7O1FBRUcsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZO0lBQ3BDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3pCLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7S0FDL0I7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTzs7O0FBQUc7O1FBQ3BCLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUzs7UUFDMUIsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO0lBQ2hDLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUI7O1FBQ0csWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZO0lBQ3BDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3pCLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDakM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsRUFBRTtRQUM1QyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztLQUNuQztBQUNILENBQUMsQ0FBQSxDQUFDOztJQUdFLFFBQVEsR0FBRyxLQUFLOzs7O0FBRXBCLE1BQU0sVUFBVSx3QkFBd0I7SUFDdEMsSUFBSSxRQUFRLEVBQUU7UUFDWixPQUFPO0tBQ1I7SUFDRCxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLEdBQUc7Ozs7O0lBQUcsVUFBVSxJQUFTLEVBQUUsT0FBWTs7WUFDM0UsS0FBSzs7WUFDTCxXQUFXOztZQUNYLFFBQVEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDO1FBQ3ZELElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUM5QyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QixXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQy9CLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDcEI7O1lBRUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2dCQUMzQixJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixPQUFPO2FBQ1I7U0FFRjs7WUFFRyxLQUFLLEdBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5SyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQSxDQUFDO0lBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaXggZm9yIHRoZSBjb25zdGFudCBlbnRpdHkgc2hhZG93aW5nLlxuICogUFIgaW4gQ2VzaXVtIHJlcG86IGh0dHBzOi8vZ2l0aHViLmNvbS9BbmFseXRpY2FsR3JhcGhpY3NJbmMvY2VzaXVtL3B1bGwvNTczNlxuICovXG5cbi8vIHRzbGludDpkaXNhYmxlXG5jb25zdCBBc3NvY2lhdGl2ZUFycmF5ID0gQ2VzaXVtLkFzc29jaWF0aXZlQXJyYXk7XG5jb25zdCBDb2xvciA9IENlc2l1bS5Db2xvcjtcbmNvbnN0IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5Db2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBkZWZpbmVkID0gQ2VzaXVtLmRlZmluZWQ7XG5jb25zdCBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBDZXNpdW0uRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uO1xuY29uc3QgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5EaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xuY29uc3QgU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBDZXNpdW0uU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBQcmltaXRpdmUgPSBDZXNpdW0uUHJpbWl0aXZlO1xuY29uc3QgU2hhZG93TW9kZSA9IENlc2l1bS5TaGFkb3dNb2RlO1xuY29uc3QgQm91bmRpbmdTcGhlcmVTdGF0ZSA9IENlc2l1bS5Cb3VuZGluZ1NwaGVyZVN0YXRlO1xuY29uc3QgQ29sb3JNYXRlcmlhbFByb3BlcnR5ID0gQ2VzaXVtLkNvbG9yTWF0ZXJpYWxQcm9wZXJ0eTtcbmNvbnN0IE1hdGVyaWFsUHJvcGVydHkgPSBDZXNpdW0uTWF0ZXJpYWxQcm9wZXJ0eTtcbmNvbnN0IFByb3BlcnR5ID0gQ2VzaXVtLlByb3BlcnR5O1xuXG52YXIgY29sb3JTY3JhdGNoID0gbmV3IENvbG9yKCk7XG52YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uU2NyYXRjaCA9IG5ldyBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24oKTtcbnZhciBkZWZhdWx0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gbmV3IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbigpO1xuXG5mdW5jdGlvbiBCYXRjaChwcmltaXRpdmVzLCB0cmFuc2x1Y2VudCwgYXBwZWFyYW5jZVR5cGUsIGRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlLCBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCBjbG9zZWQsIHNoYWRvd3MpIHtcbiAgdGhpcy50cmFuc2x1Y2VudCA9IHRyYW5zbHVjZW50O1xuICB0aGlzLmFwcGVhcmFuY2VUeXBlID0gYXBwZWFyYW5jZVR5cGU7XG4gIHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUgPSBkZXB0aEZhaWxBcHBlYXJhbmNlVHlwZTtcbiAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5ID0gZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5jbG9zZWQgPSBjbG9zZWQ7XG4gIHRoaXMuc2hhZG93cyA9IHNoYWRvd3M7XG4gIHRoaXMucHJpbWl0aXZlcyA9IHByaW1pdGl2ZXM7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gZmFsc2U7XG4gIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gZmFsc2U7XG4gIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5nZW9tZXRyeSA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMudXBkYXRlcnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLmF0dHJpYnV0ZXMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnNob3dzVXBkYXRlZCA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuaXRlbXNUb1JlbW92ZSA9IFtdO1xuICB0aGlzLmludmFsaWRhdGVkID0gZmFsc2U7XG4gIFxuICB2YXIgcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb247XG4gIGlmIChkZWZpbmVkKGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24gPSBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmRlZmluaXRpb25DaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoQmF0Y2gucHJvdG90eXBlLm9uTWF0ZXJpYWxDaGFuZ2VkLCB0aGlzKTtcbiAgfVxuICB0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uID0gcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb247XG59XG5cbkJhdGNoLnByb3RvdHlwZS5vbk1hdGVyaWFsQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pbnZhbGlkYXRlZCA9IHRydWU7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuaXNNYXRlcmlhbCA9IGZ1bmN0aW9uICh1cGRhdGVyKSB7XG4gIHZhciBtYXRlcmlhbCA9IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgdmFyIHVwZGF0ZXJNYXRlcmlhbCA9IHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgaWYgKHVwZGF0ZXJNYXRlcmlhbCA9PT0gbWF0ZXJpYWwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoZGVmaW5lZChtYXRlcmlhbCkpIHtcbiAgICByZXR1cm4gbWF0ZXJpYWwuZXF1YWxzKHVwZGF0ZXJNYXRlcmlhbCk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh1cGRhdGVyLCBpbnN0YW5jZSkge1xuICB2YXIgaWQgPSB1cGRhdGVyLmlkO1xuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IHRydWU7XG4gIHRoaXMuZ2VvbWV0cnkuc2V0KGlkLCBpbnN0YW5jZSk7XG4gIHRoaXMudXBkYXRlcnMuc2V0KGlkLCB1cGRhdGVyKTtcbiAgaWYgKCF1cGRhdGVyLmhhc0NvbnN0YW50RmlsbCB8fCAhdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8ICFQcm9wZXJ0eS5pc0NvbnN0YW50KHVwZGF0ZXIuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkpKSB7XG4gICAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnNldChpZCwgdXBkYXRlcik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zZXQoaWQsIHVwZGF0ZXIuZW50aXR5LmRlZmluaXRpb25DaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKGVudGl0eSwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdpc1Nob3dpbmcnKSB7XG4gICAgICAgIHRoYXQuc2hvd3NVcGRhdGVkLnNldCh1cGRhdGVyLmlkLCB1cGRhdGVyKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbn07XG5cbkJhdGNoLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodXBkYXRlcikge1xuICB2YXIgaWQgPSB1cGRhdGVyLmlkO1xuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IHRoaXMuZ2VvbWV0cnkucmVtb3ZlKGlkKSB8fCB0aGlzLmNyZWF0ZVByaW1pdGl2ZTtcbiAgaWYgKHRoaXMudXBkYXRlcnMucmVtb3ZlKGlkKSkge1xuICAgIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy5yZW1vdmUoaWQpO1xuICAgIHZhciB1bnN1YnNjcmliZSA9IHRoaXMuc3Vic2NyaXB0aW9ucy5nZXQoaWQpO1xuICAgIGlmIChkZWZpbmVkKHVuc3Vic2NyaWJlKSkge1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoaWQpO1xuICAgIH1cbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gIHZhciBpc1VwZGF0ZWQgPSB0cnVlO1xuICB2YXIgcmVtb3ZlZENvdW50ID0gMDtcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICB2YXIgcHJpbWl0aXZlcyA9IHRoaXMucHJpbWl0aXZlcztcbiAgdmFyIGF0dHJpYnV0ZXM7XG4gIHZhciBpO1xuICBcbiAgaWYgKHRoaXMuY3JlYXRlUHJpbWl0aXZlKSB7XG4gICAgdmFyIGdlb21ldHJpZXMgPSB0aGlzLmdlb21ldHJ5LnZhbHVlcztcbiAgICB2YXIgZ2VvbWV0cmllc0xlbmd0aCA9IGdlb21ldHJpZXMubGVuZ3RoO1xuICAgIGlmIChnZW9tZXRyaWVzTGVuZ3RoID4gMCkge1xuICAgICAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xuICAgICAgICBpZiAoIWRlZmluZWQodGhpcy5vbGRQcmltaXRpdmUpKSB7XG4gICAgICAgICAgdGhpcy5vbGRQcmltaXRpdmUgPSBwcmltaXRpdmU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZ2VvbWV0cmllc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBnZW9tZXRyeUl0ZW0gPSBnZW9tZXRyaWVzW2ldO1xuICAgICAgICB2YXIgb3JpZ2luYWxBdHRyaWJ1dGVzID0gZ2VvbWV0cnlJdGVtLmF0dHJpYnV0ZXM7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGdlb21ldHJ5SXRlbS5pZC5pZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGVmaW5lZChhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGlmIChkZWZpbmVkKG9yaWdpbmFsQXR0cmlidXRlcy5zaG93KSkge1xuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLnNob3cudmFsdWUgPSBhdHRyaWJ1dGVzLnNob3c7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkZWZpbmVkKG9yaWdpbmFsQXR0cmlidXRlcy5jb2xvcikpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5jb2xvci52YWx1ZSA9IGF0dHJpYnV0ZXMuY29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkZWZpbmVkKG9yaWdpbmFsQXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcikpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvci52YWx1ZSA9IGF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBkZXB0aEZhaWxBcHBlYXJhbmNlO1xuICAgICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkpIHtcbiAgICAgICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5KSkge1xuICAgICAgICAgIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwgPSBNYXRlcmlhbFByb3BlcnR5LmdldFZhbHVlKHRpbWUsIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVwdGhGYWlsQXBwZWFyYW5jZSA9IG5ldyB0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKHtcbiAgICAgICAgICBtYXRlcmlhbDogdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCxcbiAgICAgICAgICB0cmFuc2x1Y2VudDogdGhpcy50cmFuc2x1Y2VudCxcbiAgICAgICAgICBjbG9zZWQ6IHRoaXMuY2xvc2VkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBwcmltaXRpdmUgPSBuZXcgUHJpbWl0aXZlKHtcbiAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgIGFzeW5jaHJvbm91czogdHJ1ZSxcbiAgICAgICAgZ2VvbWV0cnlJbnN0YW5jZXM6IGdlb21ldHJpZXMsXG4gICAgICAgIGFwcGVhcmFuY2U6IG5ldyB0aGlzLmFwcGVhcmFuY2VUeXBlKHtcbiAgICAgICAgICBmbGF0OiB0aGlzLnNoYWRvd3MgPT09IFNoYWRvd01vZGUuRElTQUJMRUQgfHwgdGhpcy5zaGFkb3dzID09PSBTaGFkb3dNb2RlLkNBU1RfT05MWSxcbiAgICAgICAgICB0cmFuc2x1Y2VudDogdGhpcy50cmFuc2x1Y2VudCxcbiAgICAgICAgICBjbG9zZWQ6IHRoaXMuY2xvc2VkXG4gICAgICAgIH0pLFxuICAgICAgICBkZXB0aEZhaWxBcHBlYXJhbmNlOiBkZXB0aEZhaWxBcHBlYXJhbmNlLFxuICAgICAgICBzaGFkb3dzOiB0aGlzLnNoYWRvd3NcbiAgICAgIH0pO1xuICAgICAgcHJpbWl0aXZlcy5hZGQocHJpbWl0aXZlKTtcbiAgICAgIGlzVXBkYXRlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcbiAgICAgIGlmIChkZWZpbmVkKG9sZFByaW1pdGl2ZSkpIHtcbiAgICAgICAgcHJpbWl0aXZlcy5yZW1vdmUob2xkUHJpbWl0aXZlKTtcbiAgICAgICAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMuYXR0cmlidXRlcy5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IHByaW1pdGl2ZTtcbiAgICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkgJiYgcHJpbWl0aXZlLnJlYWR5KSB7XG4gICAgcHJpbWl0aXZlLnNob3cgPSB0cnVlO1xuICAgIGlmIChkZWZpbmVkKHRoaXMub2xkUHJpbWl0aXZlKSkge1xuICAgICAgcHJpbWl0aXZlcy5yZW1vdmUodGhpcy5vbGRQcmltaXRpdmUpO1xuICAgICAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUpICYmICEodGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5IGluc3RhbmNlb2YgQ29sb3JNYXRlcmlhbFByb3BlcnR5KSkge1xuICAgICAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IE1hdGVyaWFsUHJvcGVydHkuZ2V0VmFsdWUodGltZSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsKTtcbiAgICAgIHRoaXMucHJpbWl0aXZlLmRlcHRoRmFpbEFwcGVhcmFuY2UubWF0ZXJpYWwgPSB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsO1xuICAgIH1cbiAgICBcbiAgICB2YXIgdXBkYXRlcnNXaXRoQXR0cmlidXRlcyA9IHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy52YWx1ZXM7XG4gICAgdmFyIGxlbmd0aCA9IHVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMubGVuZ3RoO1xuICAgIHZhciB3YWl0aW5nT25DcmVhdGUgPSB0aGlzLndhaXRpbmdPbkNyZWF0ZTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1cGRhdGVyID0gdXBkYXRlcnNXaXRoQXR0cmlidXRlc1tpXTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2VvbWV0cnkuZ2V0KHVwZGF0ZXIuaWQpO1xuICAgICAgXG4gICAgICBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChpbnN0YW5jZS5pZC5pZCk7XG4gICAgICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgYXR0cmlidXRlcyA9IHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcyhpbnN0YW5jZS5pZCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5zZXQoaW5zdGFuY2UuaWQuaWQsIGF0dHJpYnV0ZXMpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoIXVwZGF0ZXIuZmlsbE1hdGVyaWFsUHJvcGVydHkuaXNDb25zdGFudCB8fCB3YWl0aW5nT25DcmVhdGUpIHtcbiAgICAgICAgdmFyIGNvbG9yUHJvcGVydHkgPSB1cGRhdGVyLmZpbGxNYXRlcmlhbFByb3BlcnR5LmNvbG9yO1xuICAgICAgICB2YXIgcmVzdWx0Q29sb3IgPSBQcm9wZXJ0eS5nZXRWYWx1ZU9yRGVmYXVsdChjb2xvclByb3BlcnR5LCB0aW1lLCBDb2xvci5XSElURSwgY29sb3JTY3JhdGNoKTtcbiAgICAgICAgaWYgKCFDb2xvci5lcXVhbHMoYXR0cmlidXRlcy5fbGFzdENvbG9yLCByZXN1bHRDb2xvcikpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0Q29sb3IgPSBDb2xvci5jbG9uZShyZXN1bHRDb2xvciwgYXR0cmlidXRlcy5fbGFzdENvbG9yKTtcbiAgICAgICAgICBhdHRyaWJ1dGVzLmNvbG9yID0gQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUocmVzdWx0Q29sb3IsIGF0dHJpYnV0ZXMuY29sb3IpO1xuICAgICAgICAgIGlmICgodGhpcy50cmFuc2x1Y2VudCAmJiBhdHRyaWJ1dGVzLmNvbG9yWzNdID09PSAyNTUpIHx8ICghdGhpcy50cmFuc2x1Y2VudCAmJiBhdHRyaWJ1dGVzLmNvbG9yWzNdICE9PSAyNTUpKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zVG9SZW1vdmVbcmVtb3ZlZENvdW50KytdID0gdXBkYXRlcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkgJiYgdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5IGluc3RhbmNlb2YgQ29sb3JNYXRlcmlhbFByb3BlcnR5ICYmICghdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgd2FpdGluZ09uQ3JlYXRlKSkge1xuICAgICAgICB2YXIgZGVwdGhGYWlsQ29sb3JQcm9wZXJ0eSA9IHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eS5jb2xvcjtcbiAgICAgICAgdmFyIGRlcHRoQ29sb3IgPSBQcm9wZXJ0eS5nZXRWYWx1ZU9yRGVmYXVsdChkZXB0aEZhaWxDb2xvclByb3BlcnR5LCB0aW1lLCBDb2xvci5XSElURSwgY29sb3JTY3JhdGNoKTtcbiAgICAgICAgaWYgKCFDb2xvci5lcXVhbHMoYXR0cmlidXRlcy5fbGFzdERlcHRoRmFpbENvbG9yLCBkZXB0aENvbG9yKSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvciA9IENvbG9yLmNsb25lKGRlcHRoQ29sb3IsIGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvcik7XG4gICAgICAgICAgYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvciA9IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKGRlcHRoQ29sb3IsIGF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBzaG93ID0gdXBkYXRlci5lbnRpdHkuaXNTaG93aW5nICYmICh1cGRhdGVyLmhhc0NvbnN0YW50RmlsbCB8fCB1cGRhdGVyLmlzRmlsbGVkKHRpbWUpKTtcbiAgICAgIHZhciBjdXJyZW50U2hvdyA9IGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMTtcbiAgICAgIGlmIChzaG93ICE9PSBjdXJyZW50U2hvdykge1xuICAgICAgICBhdHRyaWJ1dGVzLnNob3cgPSBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHNob3csIGF0dHJpYnV0ZXMuc2hvdyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSA9IHVwZGF0ZXIuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHk7XG4gICAgICBpZiAoIVByb3BlcnR5LmlzQ29uc3RhbnQoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkpKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBQcm9wZXJ0eS5nZXRWYWx1ZU9yRGVmYXVsdChkaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSwgdGltZSwgZGVmYXVsdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uU2NyYXRjaCk7XG4gICAgICAgIGlmICghRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLmVxdWFscyhkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuX2xhc3REaXN0YW5jZURpc3BsYXlDb25kaXRpb24pKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbi5jbG9uZShkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuX2xhc3REaXN0YW5jZURpc3BsYXlDb25kaXRpb24pO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMudXBkYXRlU2hvd3MocHJpbWl0aXZlKTtcbiAgICB0aGlzLndhaXRpbmdPbkNyZWF0ZSA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKGRlZmluZWQocHJpbWl0aXZlKSAmJiAhcHJpbWl0aXZlLnJlYWR5KSB7XG4gICAgaXNVcGRhdGVkID0gZmFsc2U7XG4gIH1cbiAgdGhpcy5pdGVtc1RvUmVtb3ZlLmxlbmd0aCA9IHJlbW92ZWRDb3VudDtcbiAgcmV0dXJuIGlzVXBkYXRlZDtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS51cGRhdGVTaG93cyA9IGZ1bmN0aW9uIChwcmltaXRpdmUpIHtcbiAgdmFyIHNob3dzVXBkYXRlZCA9IHRoaXMuc2hvd3NVcGRhdGVkLnZhbHVlcztcbiAgdmFyIGxlbmd0aCA9IHNob3dzVXBkYXRlZC5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdXBkYXRlciA9IHNob3dzVXBkYXRlZFtpXTtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdlb21ldHJ5LmdldCh1cGRhdGVyLmlkKTtcbiAgICBcbiAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcy5nZXQoaW5zdGFuY2UuaWQuaWQpO1xuICAgIGlmICghZGVmaW5lZChhdHRyaWJ1dGVzKSkge1xuICAgICAgYXR0cmlidXRlcyA9IHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcyhpbnN0YW5jZS5pZCk7XG4gICAgICB0aGlzLmF0dHJpYnV0ZXMuc2V0KGluc3RhbmNlLmlkLmlkLCBhdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHNob3cgPSB1cGRhdGVyLmVudGl0eS5pc1Nob3dpbmc7XG4gICAgdmFyIGN1cnJlbnRTaG93ID0gYXR0cmlidXRlcy5zaG93WzBdID09PSAxO1xuICAgIGlmIChzaG93ICE9PSBjdXJyZW50U2hvdykge1xuICAgICAgYXR0cmlidXRlcy5zaG93ID0gU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShzaG93LCBhdHRyaWJ1dGVzLnNob3cpO1xuICAgIH1cbiAgfVxuICB0aGlzLnNob3dzVXBkYXRlZC5yZW1vdmVBbGwoKTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uICh1cGRhdGVyKSB7XG4gIHJldHVybiB0aGlzLnVwZGF0ZXJzLmNvbnRhaW5zKHVwZGF0ZXIuaWQpO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmdldEJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKHVwZGF0ZXIsIHJlc3VsdCkge1xuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIGlmICghcHJpbWl0aXZlLnJlYWR5KSB7XG4gICAgcmV0dXJuIEJvdW5kaW5nU3BoZXJlU3RhdGUuUEVORElORztcbiAgfVxuICB2YXIgYXR0cmlidXRlcyA9IHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcyh1cGRhdGVyLmVudGl0eSk7XG4gIGlmICghZGVmaW5lZChhdHRyaWJ1dGVzKSB8fCAhZGVmaW5lZChhdHRyaWJ1dGVzLmJvdW5kaW5nU3BoZXJlKSB8fC8vXG4gICAgKGRlZmluZWQoYXR0cmlidXRlcy5zaG93KSAmJiBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDApKSB7XG4gICAgcmV0dXJuIEJvdW5kaW5nU3BoZXJlU3RhdGUuRkFJTEVEO1xuICB9XG4gIGF0dHJpYnV0ZXMuYm91bmRpbmdTcGhlcmUuY2xvbmUocmVzdWx0KTtcbiAgcmV0dXJuIEJvdW5kaW5nU3BoZXJlU3RhdGUuRE9ORTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5yZW1vdmVBbGxQcmltaXRpdmVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpbWl0aXZlcyA9IHRoaXMucHJpbWl0aXZlcztcbiAgXG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XG4gICAgdGhpcy5wcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5nZW9tZXRyeS5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLnVwZGF0ZXJzLnJlbW92ZUFsbCgpO1xuICB9XG4gIFxuICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XG4gIGlmIChkZWZpbmVkKG9sZFByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xuICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICB2YXIgcHJpbWl0aXZlcyA9IHRoaXMucHJpbWl0aXZlcztcbiAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XG4gIH1cbiAgdmFyIG9sZFByaW1pdGl2ZSA9IHRoaXMub2xkUHJpbWl0aXZlO1xuICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUob2xkUHJpbWl0aXZlKTtcbiAgfVxuICBpZiAoZGVmaW5lZCh0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uKSkge1xuICAgIHRoaXMucmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24oKTtcbiAgfVxufTtcblxuXG5sZXQgd2FzRml4ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZpeENlc2l1bUVudGl0aWVzU2hhZG93cygpIHtcbiAgaWYgKHdhc0ZpeGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIENlc2l1bS5TdGF0aWNHZW9tZXRyeUNvbG9yQmF0Y2gucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0aW1lOiBhbnksIHVwZGF0ZXI6IGFueSkge1xuICAgIHZhciBpdGVtcztcbiAgICB2YXIgdHJhbnNsdWNlbnQ7XG4gICAgdmFyIGluc3RhbmNlID0gdXBkYXRlci5jcmVhdGVGaWxsR2VvbWV0cnlJbnN0YW5jZSh0aW1lKTtcbiAgICBpZiAoaW5zdGFuY2UuYXR0cmlidXRlcy5jb2xvci52YWx1ZVszXSA9PT0gMjU1KSB7XG4gICAgICBpdGVtcyA9IHRoaXMuX3NvbGlkSXRlbXM7XG4gICAgICB0cmFuc2x1Y2VudCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtcyA9IHRoaXMuX3RyYW5zbHVjZW50SXRlbXM7XG4gICAgICB0cmFuc2x1Y2VudCA9IHRydWU7XG4gICAgfVxuICAgIFxuICAgIHZhciBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgIGlmIChpdGVtLmlzTWF0ZXJpYWwodXBkYXRlcikpIHtcbiAgICAgICAgaXRlbS5hZGQodXBkYXRlciwgaW5zdGFuY2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICB9XG4gICAgXG4gICAgdmFyIGJhdGNoOiBhbnkgPSBuZXcgQmF0Y2godGhpcy5fcHJpbWl0aXZlcywgdHJhbnNsdWNlbnQsIHRoaXMuX2FwcGVhcmFuY2VUeXBlLCB0aGlzLl9kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSwgdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCB0aGlzLl9jbG9zZWQsIHRoaXMuX3NoYWRvd3MpO1xuICAgIGJhdGNoLmFkZCh1cGRhdGVyLCBpbnN0YW5jZSk7XG4gICAgaXRlbXMucHVzaChiYXRjaCk7XG4gIH07XG4gIHdhc0ZpeGVkID0gdHJ1ZTtcbn1cbiJdfQ==
/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
// tslint:disable
const AssociativeArray = Cesium.AssociativeArray;
const Color = Cesium.Color;
const ColorGeometryInstanceAttribute = Cesium.ColorGeometryInstanceAttribute;
const defined = Cesium.defined;
const DistanceDisplayCondition = Cesium.DistanceDisplayCondition;
const DistanceDisplayConditionGeometryInstanceAttribute = Cesium.DistanceDisplayConditionGeometryInstanceAttribute;
const ShowGeometryInstanceAttribute = Cesium.ShowGeometryInstanceAttribute;
const Primitive = Cesium.Primitive;
const ShadowMode = Cesium.ShadowMode;
const BoundingSphereState = Cesium.BoundingSphereState;
const ColorMaterialProperty = Cesium.ColorMaterialProperty;
const MaterialProperty = Cesium.MaterialProperty;
const Property = Cesium.Property;
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
        var geometries = this.geometry.values.filter(g => g !== undefined);
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
let wasFixed = false;
export function fixCesiumEntitiesShadows() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxpQkFBaUI7QUFDakIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDakQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMzQixNQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztBQUM3RSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQy9CLE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ2pFLE1BQU0saURBQWlELEdBQUcsTUFBTSxDQUFDLGlEQUFpRCxDQUFDO0FBQ25ILE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDO0FBQzNFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNyQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUN2RCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztBQUMzRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBRWpDLElBQUksWUFBWSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDL0IsSUFBSSwrQkFBK0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7QUFDckUsSUFB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LENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9LLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDO0lBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaXggZm9yIHRoZSBjb25zdGFudCBlbnRpdHkgc2hhZG93aW5nLlxuICogUFIgaW4gQ2VzaXVtIHJlcG86IGh0dHBzOi8vZ2l0aHViLmNvbS9BbmFseXRpY2FsR3JhcGhpY3NJbmMvY2VzaXVtL3B1bGwvNTczNlxuICovXG5cbi8vIHRzbGludDpkaXNhYmxlXG5jb25zdCBBc3NvY2lhdGl2ZUFycmF5ID0gQ2VzaXVtLkFzc29jaWF0aXZlQXJyYXk7XG5jb25zdCBDb2xvciA9IENlc2l1bS5Db2xvcjtcbmNvbnN0IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5Db2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBkZWZpbmVkID0gQ2VzaXVtLmRlZmluZWQ7XG5jb25zdCBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBDZXNpdW0uRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uO1xuY29uc3QgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5EaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xuY29uc3QgU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBDZXNpdW0uU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBQcmltaXRpdmUgPSBDZXNpdW0uUHJpbWl0aXZlO1xuY29uc3QgU2hhZG93TW9kZSA9IENlc2l1bS5TaGFkb3dNb2RlO1xuY29uc3QgQm91bmRpbmdTcGhlcmVTdGF0ZSA9IENlc2l1bS5Cb3VuZGluZ1NwaGVyZVN0YXRlO1xuY29uc3QgQ29sb3JNYXRlcmlhbFByb3BlcnR5ID0gQ2VzaXVtLkNvbG9yTWF0ZXJpYWxQcm9wZXJ0eTtcbmNvbnN0IE1hdGVyaWFsUHJvcGVydHkgPSBDZXNpdW0uTWF0ZXJpYWxQcm9wZXJ0eTtcbmNvbnN0IFByb3BlcnR5ID0gQ2VzaXVtLlByb3BlcnR5O1xuXG52YXIgY29sb3JTY3JhdGNoID0gbmV3IENvbG9yKCk7XG52YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uU2NyYXRjaCA9IG5ldyBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24oKTtcbnZhciBkZWZhdWx0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gbmV3IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbigpO1xuXG5mdW5jdGlvbiBCYXRjaChwcmltaXRpdmVzLCB0cmFuc2x1Y2VudCwgYXBwZWFyYW5jZVR5cGUsIGRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlLCBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCBjbG9zZWQsIHNoYWRvd3MpIHtcbiAgdGhpcy50cmFuc2x1Y2VudCA9IHRyYW5zbHVjZW50O1xuICB0aGlzLmFwcGVhcmFuY2VUeXBlID0gYXBwZWFyYW5jZVR5cGU7XG4gIHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUgPSBkZXB0aEZhaWxBcHBlYXJhbmNlVHlwZTtcbiAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5ID0gZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5jbG9zZWQgPSBjbG9zZWQ7XG4gIHRoaXMuc2hhZG93cyA9IHNoYWRvd3M7XG4gIHRoaXMucHJpbWl0aXZlcyA9IHByaW1pdGl2ZXM7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gZmFsc2U7XG4gIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gZmFsc2U7XG4gIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5nZW9tZXRyeSA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMudXBkYXRlcnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLmF0dHJpYnV0ZXMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnNob3dzVXBkYXRlZCA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuaXRlbXNUb1JlbW92ZSA9IFtdO1xuICB0aGlzLmludmFsaWRhdGVkID0gZmFsc2U7XG4gIFxuICB2YXIgcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb247XG4gIGlmIChkZWZpbmVkKGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24gPSBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmRlZmluaXRpb25DaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoQmF0Y2gucHJvdG90eXBlLm9uTWF0ZXJpYWxDaGFuZ2VkLCB0aGlzKTtcbiAgfVxuICB0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uID0gcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb247XG59XG5cbkJhdGNoLnByb3RvdHlwZS5vbk1hdGVyaWFsQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pbnZhbGlkYXRlZCA9IHRydWU7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuaXNNYXRlcmlhbCA9IGZ1bmN0aW9uICh1cGRhdGVyKSB7XG4gIHZhciBtYXRlcmlhbCA9IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgdmFyIHVwZGF0ZXJNYXRlcmlhbCA9IHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcbiAgaWYgKHVwZGF0ZXJNYXRlcmlhbCA9PT0gbWF0ZXJpYWwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoZGVmaW5lZChtYXRlcmlhbCkpIHtcbiAgICByZXR1cm4gbWF0ZXJpYWwuZXF1YWxzKHVwZGF0ZXJNYXRlcmlhbCk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh1cGRhdGVyLCBpbnN0YW5jZSkge1xuICB2YXIgaWQgPSB1cGRhdGVyLmlkO1xuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IHRydWU7XG4gIHRoaXMuZ2VvbWV0cnkuc2V0KGlkLCBpbnN0YW5jZSk7XG4gIHRoaXMudXBkYXRlcnMuc2V0KGlkLCB1cGRhdGVyKTtcbiAgaWYgKCF1cGRhdGVyLmhhc0NvbnN0YW50RmlsbCB8fCAhdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8ICFQcm9wZXJ0eS5pc0NvbnN0YW50KHVwZGF0ZXIuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkpKSB7XG4gICAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnNldChpZCwgdXBkYXRlcik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zZXQoaWQsIHVwZGF0ZXIuZW50aXR5LmRlZmluaXRpb25DaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKGVudGl0eSwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdpc1Nob3dpbmcnKSB7XG4gICAgICAgIHRoYXQuc2hvd3NVcGRhdGVkLnNldCh1cGRhdGVyLmlkLCB1cGRhdGVyKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbn07XG5cbkJhdGNoLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodXBkYXRlcikge1xuICB2YXIgaWQgPSB1cGRhdGVyLmlkO1xuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IHRoaXMuZ2VvbWV0cnkucmVtb3ZlKGlkKSB8fCB0aGlzLmNyZWF0ZVByaW1pdGl2ZTtcbiAgaWYgKHRoaXMudXBkYXRlcnMucmVtb3ZlKGlkKSkge1xuICAgIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy5yZW1vdmUoaWQpO1xuICAgIHZhciB1bnN1YnNjcmliZSA9IHRoaXMuc3Vic2NyaXB0aW9ucy5nZXQoaWQpO1xuICAgIGlmIChkZWZpbmVkKHVuc3Vic2NyaWJlKSkge1xuICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoaWQpO1xuICAgIH1cbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gIHZhciBpc1VwZGF0ZWQgPSB0cnVlO1xuICB2YXIgcmVtb3ZlZENvdW50ID0gMDtcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICB2YXIgcHJpbWl0aXZlcyA9IHRoaXMucHJpbWl0aXZlcztcbiAgdmFyIGF0dHJpYnV0ZXM7XG4gIHZhciBpO1xuICBcbiAgaWYgKHRoaXMuY3JlYXRlUHJpbWl0aXZlKSB7XG4gICAgdmFyIGdlb21ldHJpZXMgPSB0aGlzLmdlb21ldHJ5LnZhbHVlcy5maWx0ZXIoZyA9PiBnICE9PSB1bmRlZmluZWQpO1xuICAgIHZhciBnZW9tZXRyaWVzTGVuZ3RoID0gZ2VvbWV0cmllcy5sZW5ndGg7XG4gICAgaWYgKGdlb21ldHJpZXNMZW5ndGggPiAwKSB7XG4gICAgICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgICAgIGlmICghZGVmaW5lZCh0aGlzLm9sZFByaW1pdGl2ZSkpIHtcbiAgICAgICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHByaW1pdGl2ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBnZW9tZXRyaWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5SXRlbSA9IGdlb21ldHJpZXNbaV07XG4gICAgICAgIHZhciBvcmlnaW5hbEF0dHJpYnV0ZXMgPSBnZW9tZXRyeUl0ZW0uYXR0cmlidXRlcztcbiAgICAgICAgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcy5nZXQoZ2VvbWV0cnlJdGVtLmlkLmlkKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLnNob3cpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuc2hvdy52YWx1ZSA9IGF0dHJpYnV0ZXMuc2hvdztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLmNvbG9yKSkge1xuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLmNvbG9yLnZhbHVlID0gYXR0cmlidXRlcy5jb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yKSkge1xuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yLnZhbHVlID0gYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIGRlcHRoRmFpbEFwcGVhcmFuY2U7XG4gICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSkge1xuICAgICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IE1hdGVyaWFsUHJvcGVydHkuZ2V0VmFsdWUodGltZSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgICAgICBkZXB0aEZhaWxBcHBlYXJhbmNlID0gbmV3IHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUoe1xuICAgICAgICAgIG1hdGVyaWFsOiB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsLFxuICAgICAgICAgIHRyYW5zbHVjZW50OiB0aGlzLnRyYW5zbHVjZW50LFxuICAgICAgICAgIGNsb3NlZDogdGhpcy5jbG9zZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHByaW1pdGl2ZSA9IG5ldyBQcmltaXRpdmUoe1xuICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgYXN5bmNocm9ub3VzOiB0cnVlLFxuICAgICAgICBnZW9tZXRyeUluc3RhbmNlczogZ2VvbWV0cmllcyxcbiAgICAgICAgYXBwZWFyYW5jZTogbmV3IHRoaXMuYXBwZWFyYW5jZVR5cGUoe1xuICAgICAgICAgIGZsYXQ6IHRoaXMuc2hhZG93cyA9PT0gU2hhZG93TW9kZS5ESVNBQkxFRCB8fCB0aGlzLnNoYWRvd3MgPT09IFNoYWRvd01vZGUuQ0FTVF9PTkxZLFxuICAgICAgICAgIHRyYW5zbHVjZW50OiB0aGlzLnRyYW5zbHVjZW50LFxuICAgICAgICAgIGNsb3NlZDogdGhpcy5jbG9zZWRcbiAgICAgICAgfSksXG4gICAgICAgIGRlcHRoRmFpbEFwcGVhcmFuY2U6IGRlcHRoRmFpbEFwcGVhcmFuY2UsXG4gICAgICAgIHNoYWRvd3M6IHRoaXMuc2hhZG93c1xuICAgICAgfSk7XG4gICAgICBwcmltaXRpdmVzLmFkZChwcmltaXRpdmUpO1xuICAgICAgaXNVcGRhdGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICAgICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgdmFyIG9sZFByaW1pdGl2ZSA9IHRoaXMub2xkUHJpbWl0aXZlO1xuICAgICAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xuICAgICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5hdHRyaWJ1dGVzLnJlbW92ZUFsbCgpO1xuICAgIHRoaXMucHJpbWl0aXZlID0gcHJpbWl0aXZlO1xuICAgIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gZmFsc2U7XG4gICAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGRlZmluZWQocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUucmVhZHkpIHtcbiAgICBwcmltaXRpdmUuc2hvdyA9IHRydWU7XG4gICAgaWYgKGRlZmluZWQodGhpcy5vbGRQcmltaXRpdmUpKSB7XG4gICAgICBwcmltaXRpdmVzLnJlbW92ZSh0aGlzLm9sZFByaW1pdGl2ZSk7XG4gICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkgJiYgISh0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgaW5zdGFuY2VvZiBDb2xvck1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gTWF0ZXJpYWxQcm9wZXJ0eS5nZXRWYWx1ZSh0aW1lLCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwpO1xuICAgICAgdGhpcy5wcmltaXRpdmUuZGVwdGhGYWlsQXBwZWFyYW5jZS5tYXRlcmlhbCA9IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWw7XG4gICAgfVxuICAgIFxuICAgIHZhciB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzID0gdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnZhbHVlcztcbiAgICB2YXIgbGVuZ3RoID0gdXBkYXRlcnNXaXRoQXR0cmlidXRlcy5sZW5ndGg7XG4gICAgdmFyIHdhaXRpbmdPbkNyZWF0ZSA9IHRoaXMud2FpdGluZ09uQ3JlYXRlO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVwZGF0ZXIgPSB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzW2ldO1xuICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5nZW9tZXRyeS5nZXQodXBkYXRlci5pZCk7XG4gICAgICBcbiAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcbiAgICAgIGlmICghZGVmaW5lZChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKGluc3RhbmNlLmlkKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICghdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8IHdhaXRpbmdPbkNyZWF0ZSkge1xuICAgICAgICB2YXIgY29sb3JQcm9wZXJ0eSA9IHVwZGF0ZXIuZmlsbE1hdGVyaWFsUHJvcGVydHkuY29sb3I7XG4gICAgICAgIHZhciByZXN1bHRDb2xvciA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGNvbG9yUHJvcGVydHksIHRpbWUsIENvbG9yLldISVRFLCBjb2xvclNjcmF0Y2gpO1xuICAgICAgICBpZiAoIUNvbG9yLmVxdWFscyhhdHRyaWJ1dGVzLl9sYXN0Q29sb3IsIHJlc3VsdENvbG9yKSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3RDb2xvciA9IENvbG9yLmNsb25lKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLl9sYXN0Q29sb3IpO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuY29sb3IgPSBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShyZXN1bHRDb2xvciwgYXR0cmlidXRlcy5jb2xvcik7XG4gICAgICAgICAgaWYgKCh0aGlzLnRyYW5zbHVjZW50ICYmIGF0dHJpYnV0ZXMuY29sb3JbM10gPT09IDI1NSkgfHwgKCF0aGlzLnRyYW5zbHVjZW50ICYmIGF0dHJpYnV0ZXMuY29sb3JbM10gIT09IDI1NSkpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNUb1JlbW92ZVtyZW1vdmVkQ291bnQrK10gPSB1cGRhdGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSAmJiB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgaW5zdGFuY2VvZiBDb2xvck1hdGVyaWFsUHJvcGVydHkgJiYgKCF1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuaXNDb25zdGFudCB8fCB3YWl0aW5nT25DcmVhdGUpKSB7XG4gICAgICAgIHZhciBkZXB0aEZhaWxDb2xvclByb3BlcnR5ID0gdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmNvbG9yO1xuICAgICAgICB2YXIgZGVwdGhDb2xvciA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGRlcHRoRmFpbENvbG9yUHJvcGVydHksIHRpbWUsIENvbG9yLldISVRFLCBjb2xvclNjcmF0Y2gpO1xuICAgICAgICBpZiAoIUNvbG9yLmVxdWFscyhhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IsIGRlcHRoQ29sb3IpKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5fbGFzdERlcHRoRmFpbENvbG9yID0gQ29sb3IuY2xvbmUoZGVwdGhDb2xvciwgYXR0cmlidXRlcy5fbGFzdERlcHRoRmFpbENvbG9yKTtcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yID0gQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoZGVwdGhDb2xvciwgYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIHNob3cgPSB1cGRhdGVyLmVudGl0eS5pc1Nob3dpbmcgJiYgKHVwZGF0ZXIuaGFzQ29uc3RhbnRGaWxsIHx8IHVwZGF0ZXIuaXNGaWxsZWQodGltZSkpO1xuICAgICAgdmFyIGN1cnJlbnRTaG93ID0gYXR0cmlidXRlcy5zaG93WzBdID09PSAxO1xuICAgICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuc2hvdyA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoc2hvdywgYXR0cmlidXRlcy5zaG93KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5ID0gdXBkYXRlci5kaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eTtcbiAgICAgIGlmICghUHJvcGVydHkuaXNDb25zdGFudChkaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSkpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5LCB0aW1lLCBkZWZhdWx0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25TY3JhdGNoKTtcbiAgICAgICAgaWYgKCFEaXN0YW5jZURpc3BsYXlDb25kaXRpb24uZXF1YWxzKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbikpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLmNsb25lKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbik7XG4gICAgICAgICAgYXR0cmlidXRlcy5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy51cGRhdGVTaG93cyhwcmltaXRpdmUpO1xuICAgIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoZGVmaW5lZChwcmltaXRpdmUpICYmICFwcmltaXRpdmUucmVhZHkpIHtcbiAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcbiAgfVxuICB0aGlzLml0ZW1zVG9SZW1vdmUubGVuZ3RoID0gcmVtb3ZlZENvdW50O1xuICByZXR1cm4gaXNVcGRhdGVkO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZVNob3dzID0gZnVuY3Rpb24gKHByaW1pdGl2ZSkge1xuICB2YXIgc2hvd3NVcGRhdGVkID0gdGhpcy5zaG93c1VwZGF0ZWQudmFsdWVzO1xuICB2YXIgbGVuZ3RoID0gc2hvd3NVcGRhdGVkLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciB1cGRhdGVyID0gc2hvd3NVcGRhdGVkW2ldO1xuICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2VvbWV0cnkuZ2V0KHVwZGF0ZXIuaWQpO1xuICAgIFxuICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChpbnN0YW5jZS5pZC5pZCk7XG4gICAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKGluc3RhbmNlLmlkKTtcbiAgICAgIHRoaXMuYXR0cmlidXRlcy5zZXQoaW5zdGFuY2UuaWQuaWQsIGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2hvdyA9IHVwZGF0ZXIuZW50aXR5LmlzU2hvd2luZztcbiAgICB2YXIgY3VycmVudFNob3cgPSBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDE7XG4gICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XG4gICAgICBhdHRyaWJ1dGVzLnNob3cgPSBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHNob3csIGF0dHJpYnV0ZXMuc2hvdyk7XG4gICAgfVxuICB9XG4gIHRoaXMuc2hvd3NVcGRhdGVkLnJlbW92ZUFsbCgpO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcbiAgcmV0dXJuIHRoaXMudXBkYXRlcnMuY29udGFpbnModXBkYXRlci5pZCk7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuZ2V0Qm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAodXBkYXRlciwgcmVzdWx0KSB7XG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgaWYgKCFwcmltaXRpdmUucmVhZHkpIHtcbiAgICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5QRU5ESU5HO1xuICB9XG4gIHZhciBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKHVwZGF0ZXIuZW50aXR5KTtcbiAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpIHx8ICFkZWZpbmVkKGF0dHJpYnV0ZXMuYm91bmRpbmdTcGhlcmUpIHx8Ly9cbiAgICAoZGVmaW5lZChhdHRyaWJ1dGVzLnNob3cpICYmIGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMCkpIHtcbiAgICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5GQUlMRUQ7XG4gIH1cbiAgYXR0cmlidXRlcy5ib3VuZGluZ1NwaGVyZS5jbG9uZShyZXN1bHQpO1xuICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5ET05FO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLnJlbW92ZUFsbFByaW1pdGl2ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICBcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmdlb21ldHJ5LnJlbW92ZUFsbCgpO1xuICAgIHRoaXMudXBkYXRlcnMucmVtb3ZlQWxsKCk7XG4gIH1cbiAgXG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcbiAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gICAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbkJhdGNoLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgfVxuICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XG4gIGlmIChkZWZpbmVkKG9sZFByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xuICB9XG4gIGlmIChkZWZpbmVkKHRoaXMucmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24pKSB7XG4gICAgdGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbigpO1xuICB9XG59O1xuXG5cbmxldCB3YXNGaXhlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZml4Q2VzaXVtRW50aXRpZXNTaGFkb3dzKCkge1xuICBpZiAod2FzRml4ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgQ2VzaXVtLlN0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHRpbWU6IGFueSwgdXBkYXRlcjogYW55KSB7XG4gICAgdmFyIGl0ZW1zO1xuICAgIHZhciB0cmFuc2x1Y2VudDtcbiAgICB2YXIgaW5zdGFuY2UgPSB1cGRhdGVyLmNyZWF0ZUZpbGxHZW9tZXRyeUluc3RhbmNlKHRpbWUpO1xuICAgIGlmIChpbnN0YW5jZS5hdHRyaWJ1dGVzLmNvbG9yLnZhbHVlWzNdID09PSAyNTUpIHtcbiAgICAgIGl0ZW1zID0gdGhpcy5fc29saWRJdGVtcztcbiAgICAgIHRyYW5zbHVjZW50ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW1zID0gdGhpcy5fdHJhbnNsdWNlbnRJdGVtcztcbiAgICAgIHRyYW5zbHVjZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgaWYgKGl0ZW0uaXNNYXRlcmlhbCh1cGRhdGVyKSkge1xuICAgICAgICBpdGVtLmFkZCh1cGRhdGVyLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICB2YXIgYmF0Y2g6IGFueSA9IG5ldyBCYXRjaCh0aGlzLl9wcmltaXRpdmVzLCB0cmFuc2x1Y2VudCwgdGhpcy5fYXBwZWFyYW5jZVR5cGUsIHRoaXMuX2RlcHRoRmFpbEFwcGVhcmFuY2VUeXBlLCB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuX2Nsb3NlZCwgdGhpcy5fc2hhZG93cyk7XG4gICAgYmF0Y2guYWRkKHVwZGF0ZXIsIGluc3RhbmNlKTtcbiAgICBpdGVtcy5wdXNoKGJhdGNoKTtcbiAgfTtcbiAgd2FzRml4ZWQgPSB0cnVlO1xufVxuIl19
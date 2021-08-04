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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxpQkFBaUI7QUFDakIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDakQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMzQixNQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztBQUM3RSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQy9CLE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ2pFLE1BQU0saURBQWlELEdBQUcsTUFBTSxDQUFDLGlEQUFpRCxDQUFDO0FBQ25ILE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDO0FBQzNFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNyQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUN2RCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztBQUMzRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBRWpDLElBQUksWUFBWSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDL0IsSUFBSSwrQkFBK0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7QUFDckUsSUFB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QUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixPQUFPO2FBQ1I7U0FFRjtRQUVELElBQUksS0FBSyxHQUFRLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvSyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRml4IGZvciB0aGUgY29uc3RhbnQgZW50aXR5IHNoYWRvd2luZy5cbiAqIFBSIGluIENlc2l1bSByZXBvOiBodHRwczovL2dpdGh1Yi5jb20vQW5hbHl0aWNhbEdyYXBoaWNzSW5jL2Nlc2l1bS9wdWxsLzU3MzZcbiAqL1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZVxuY29uc3QgQXNzb2NpYXRpdmVBcnJheSA9IENlc2l1bS5Bc3NvY2lhdGl2ZUFycmF5O1xuY29uc3QgQ29sb3IgPSBDZXNpdW0uQ29sb3I7XG5jb25zdCBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBDZXNpdW0uQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xuY29uc3QgZGVmaW5lZCA9IENlc2l1bS5kZWZpbmVkO1xuY29uc3QgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gQ2VzaXVtLkRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjtcbmNvbnN0IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBDZXNpdW0uRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZTtcbmNvbnN0IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlID0gQ2VzaXVtLlNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xuY29uc3QgUHJpbWl0aXZlID0gQ2VzaXVtLlByaW1pdGl2ZTtcbmNvbnN0IFNoYWRvd01vZGUgPSBDZXNpdW0uU2hhZG93TW9kZTtcbmNvbnN0IEJvdW5kaW5nU3BoZXJlU3RhdGUgPSBDZXNpdW0uQm91bmRpbmdTcGhlcmVTdGF0ZTtcbmNvbnN0IENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSA9IENlc2l1bS5Db2xvck1hdGVyaWFsUHJvcGVydHk7XG5jb25zdCBNYXRlcmlhbFByb3BlcnR5ID0gQ2VzaXVtLk1hdGVyaWFsUHJvcGVydHk7XG5jb25zdCBQcm9wZXJ0eSA9IENlc2l1bS5Qcm9wZXJ0eTtcblxudmFyIGNvbG9yU2NyYXRjaCA9IG5ldyBDb2xvcigpO1xudmFyIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblNjcmF0Y2ggPSBuZXcgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKCk7XG52YXIgZGVmYXVsdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IG5ldyBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24oKTtcblxuZnVuY3Rpb24gQmF0Y2gocHJpbWl0aXZlcywgdHJhbnNsdWNlbnQsIGFwcGVhcmFuY2VUeXBlLCBkZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSwgZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgY2xvc2VkLCBzaGFkb3dzKSB7XG4gIHRoaXMudHJhbnNsdWNlbnQgPSB0cmFuc2x1Y2VudDtcbiAgdGhpcy5hcHBlYXJhbmNlVHlwZSA9IGFwcGVhcmFuY2VUeXBlO1xuICB0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlID0gZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGU7XG4gIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSA9IGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHk7XG4gIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwgPSB1bmRlZmluZWQ7XG4gIHRoaXMuY2xvc2VkID0gY2xvc2VkO1xuICB0aGlzLnNoYWRvd3MgPSBzaGFkb3dzO1xuICB0aGlzLnByaW1pdGl2ZXMgPSBwcmltaXRpdmVzO1xuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IGZhbHNlO1xuICB0aGlzLndhaXRpbmdPbkNyZWF0ZSA9IGZhbHNlO1xuICB0aGlzLnByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuZ2VvbWV0cnkgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLnVwZGF0ZXJzID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy5hdHRyaWJ1dGVzID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy5zaG93c1VwZGF0ZWQgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xuICB0aGlzLml0ZW1zVG9SZW1vdmUgPSBbXTtcbiAgdGhpcy5pbnZhbGlkYXRlZCA9IGZhbHNlO1xuICBcbiAgdmFyIHJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uO1xuICBpZiAoZGVmaW5lZChkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5KSkge1xuICAgIHJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uID0gZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eS5kZWZpbml0aW9uQ2hhbmdlZC5hZGRFdmVudExpc3RlbmVyKEJhdGNoLnByb3RvdHlwZS5vbk1hdGVyaWFsQ2hhbmdlZCwgdGhpcyk7XG4gIH1cbiAgdGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbiA9IHJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uO1xufVxuXG5CYXRjaC5wcm90b3R5cGUub25NYXRlcmlhbENoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaW52YWxpZGF0ZWQgPSB0cnVlO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmlzTWF0ZXJpYWwgPSBmdW5jdGlvbiAodXBkYXRlcikge1xuICB2YXIgbWF0ZXJpYWwgPSB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHk7XG4gIHZhciB1cGRhdGVyTWF0ZXJpYWwgPSB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHk7XG4gIGlmICh1cGRhdGVyTWF0ZXJpYWwgPT09IG1hdGVyaWFsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGRlZmluZWQobWF0ZXJpYWwpKSB7XG4gICAgcmV0dXJuIG1hdGVyaWFsLmVxdWFscyh1cGRhdGVyTWF0ZXJpYWwpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodXBkYXRlciwgaW5zdGFuY2UpIHtcbiAgdmFyIGlkID0gdXBkYXRlci5pZDtcbiAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSB0cnVlO1xuICB0aGlzLmdlb21ldHJ5LnNldChpZCwgaW5zdGFuY2UpO1xuICB0aGlzLnVwZGF0ZXJzLnNldChpZCwgdXBkYXRlcik7XG4gIGlmICghdXBkYXRlci5oYXNDb25zdGFudEZpbGwgfHwgIXVwZGF0ZXIuZmlsbE1hdGVyaWFsUHJvcGVydHkuaXNDb25zdGFudCB8fCAhUHJvcGVydHkuaXNDb25zdGFudCh1cGRhdGVyLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5KSkge1xuICAgIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy5zZXQoaWQsIHVwZGF0ZXIpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuc2V0KGlkLCB1cGRhdGVyLmVudGl0eS5kZWZpbml0aW9uQ2hhbmdlZC5hZGRFdmVudExpc3RlbmVyKGZ1bmN0aW9uIChlbnRpdHksIHByb3BlcnR5TmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnaXNTaG93aW5nJykge1xuICAgICAgICB0aGF0LnNob3dzVXBkYXRlZC5zZXQodXBkYXRlci5pZCwgdXBkYXRlcik7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG59O1xuXG5CYXRjaC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcbiAgdmFyIGlkID0gdXBkYXRlci5pZDtcbiAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSB0aGlzLmdlb21ldHJ5LnJlbW92ZShpZCkgfHwgdGhpcy5jcmVhdGVQcmltaXRpdmU7XG4gIGlmICh0aGlzLnVwZGF0ZXJzLnJlbW92ZShpZCkpIHtcbiAgICB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMucmVtb3ZlKGlkKTtcbiAgICB2YXIgdW5zdWJzY3JpYmUgPSB0aGlzLnN1YnNjcmlwdGlvbnMuZ2V0KGlkKTtcbiAgICBpZiAoZGVmaW5lZCh1bnN1YnNjcmliZSkpIHtcbiAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKGlkKTtcbiAgICB9XG4gIH1cbn07XG5cbkJhdGNoLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuICB2YXIgaXNVcGRhdGVkID0gdHJ1ZTtcbiAgdmFyIHJlbW92ZWRDb3VudCA9IDA7XG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgdmFyIHByaW1pdGl2ZXMgPSB0aGlzLnByaW1pdGl2ZXM7XG4gIHZhciBhdHRyaWJ1dGVzO1xuICB2YXIgaTtcbiAgXG4gIGlmICh0aGlzLmNyZWF0ZVByaW1pdGl2ZSkge1xuICAgIHZhciBnZW9tZXRyaWVzID0gdGhpcy5nZW9tZXRyeS52YWx1ZXM7XG4gICAgdmFyIGdlb21ldHJpZXNMZW5ndGggPSBnZW9tZXRyaWVzLmxlbmd0aDtcbiAgICBpZiAoZ2VvbWV0cmllc0xlbmd0aCA+IDApIHtcbiAgICAgIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICAgICAgaWYgKCFkZWZpbmVkKHRoaXMub2xkUHJpbWl0aXZlKSkge1xuICAgICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gcHJpbWl0aXZlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZm9yIChpID0gMDsgaSA8IGdlb21ldHJpZXNMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZ2VvbWV0cnlJdGVtID0gZ2VvbWV0cmllc1tpXTtcbiAgICAgICAgdmFyIG9yaWdpbmFsQXR0cmlidXRlcyA9IGdlb21ldHJ5SXRlbS5hdHRyaWJ1dGVzO1xuICAgICAgICBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChnZW9tZXRyeUl0ZW0uaWQuaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRlZmluZWQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuc2hvdykpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5zaG93LnZhbHVlID0gYXR0cmlidXRlcy5zaG93O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuY29sb3IpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuY29sb3IudmFsdWUgPSBhdHRyaWJ1dGVzLmNvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IudmFsdWUgPSBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgZGVwdGhGYWlsQXBwZWFyYW5jZTtcbiAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUpKSB7XG4gICAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICAgICAgICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gTWF0ZXJpYWxQcm9wZXJ0eS5nZXRWYWx1ZSh0aW1lLCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIGRlcHRoRmFpbEFwcGVhcmFuY2UgPSBuZXcgdGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSh7XG4gICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwsXG4gICAgICAgICAgdHJhbnNsdWNlbnQ6IHRoaXMudHJhbnNsdWNlbnQsXG4gICAgICAgICAgY2xvc2VkOiB0aGlzLmNsb3NlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcHJpbWl0aXZlID0gbmV3IFByaW1pdGl2ZSh7XG4gICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICBhc3luY2hyb25vdXM6IHRydWUsXG4gICAgICAgIGdlb21ldHJ5SW5zdGFuY2VzOiBnZW9tZXRyaWVzLFxuICAgICAgICBhcHBlYXJhbmNlOiBuZXcgdGhpcy5hcHBlYXJhbmNlVHlwZSh7XG4gICAgICAgICAgZmxhdDogdGhpcy5zaGFkb3dzID09PSBTaGFkb3dNb2RlLkRJU0FCTEVEIHx8IHRoaXMuc2hhZG93cyA9PT0gU2hhZG93TW9kZS5DQVNUX09OTFksXG4gICAgICAgICAgdHJhbnNsdWNlbnQ6IHRoaXMudHJhbnNsdWNlbnQsXG4gICAgICAgICAgY2xvc2VkOiB0aGlzLmNsb3NlZFxuICAgICAgICB9KSxcbiAgICAgICAgZGVwdGhGYWlsQXBwZWFyYW5jZTogZGVwdGhGYWlsQXBwZWFyYW5jZSxcbiAgICAgICAgc2hhZG93czogdGhpcy5zaGFkb3dzXG4gICAgICB9KTtcbiAgICAgIHByaW1pdGl2ZXMuYWRkKHByaW1pdGl2ZSk7XG4gICAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgICAgICBwcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XG4gICAgICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XG4gICAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLmF0dHJpYnV0ZXMucmVtb3ZlQWxsKCk7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBwcmltaXRpdmU7XG4gICAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcbiAgICB0aGlzLndhaXRpbmdPbkNyZWF0ZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZGVmaW5lZChwcmltaXRpdmUpICYmIHByaW1pdGl2ZS5yZWFkeSkge1xuICAgIHByaW1pdGl2ZS5zaG93ID0gdHJ1ZTtcbiAgICBpZiAoZGVmaW5lZCh0aGlzLm9sZFByaW1pdGl2ZSkpIHtcbiAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKHRoaXMub2xkUHJpbWl0aXZlKTtcbiAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSAmJiAhKHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSBpbnN0YW5jZW9mIENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICAgIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwgPSBNYXRlcmlhbFByb3BlcnR5LmdldFZhbHVlKHRpbWUsIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCk7XG4gICAgICB0aGlzLnByaW1pdGl2ZS5kZXB0aEZhaWxBcHBlYXJhbmNlLm1hdGVyaWFsID0gdGhpcy5kZXB0aEZhaWxNYXRlcmlhbDtcbiAgICB9XG4gICAgXG4gICAgdmFyIHVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMgPSB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMudmFsdWVzO1xuICAgIHZhciBsZW5ndGggPSB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICB2YXIgd2FpdGluZ09uQ3JlYXRlID0gdGhpcy53YWl0aW5nT25DcmVhdGU7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdXBkYXRlciA9IHVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXNbaV07XG4gICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdlb21ldHJ5LmdldCh1cGRhdGVyLmlkKTtcbiAgICAgIFxuICAgICAgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcy5nZXQoaW5zdGFuY2UuaWQuaWQpO1xuICAgICAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoaW5zdGFuY2UuaWQpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuc2V0KGluc3RhbmNlLmlkLmlkLCBhdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCF1cGRhdGVyLmZpbGxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgd2FpdGluZ09uQ3JlYXRlKSB7XG4gICAgICAgIHZhciBjb2xvclByb3BlcnR5ID0gdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5jb2xvcjtcbiAgICAgICAgdmFyIHJlc3VsdENvbG9yID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoY29sb3JQcm9wZXJ0eSwgdGltZSwgQ29sb3IuV0hJVEUsIGNvbG9yU2NyYXRjaCk7XG4gICAgICAgIGlmICghQ29sb3IuZXF1YWxzKGF0dHJpYnV0ZXMuX2xhc3RDb2xvciwgcmVzdWx0Q29sb3IpKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5fbGFzdENvbG9yID0gQ29sb3IuY2xvbmUocmVzdWx0Q29sb3IsIGF0dHJpYnV0ZXMuX2xhc3RDb2xvcik7XG4gICAgICAgICAgYXR0cmlidXRlcy5jb2xvciA9IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLmNvbG9yKTtcbiAgICAgICAgICBpZiAoKHRoaXMudHJhbnNsdWNlbnQgJiYgYXR0cmlidXRlcy5jb2xvclszXSA9PT0gMjU1KSB8fCAoIXRoaXMudHJhbnNsdWNlbnQgJiYgYXR0cmlidXRlcy5jb2xvclszXSAhPT0gMjU1KSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc1RvUmVtb3ZlW3JlbW92ZWRDb3VudCsrXSA9IHVwZGF0ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUpICYmIHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSBpbnN0YW5jZW9mIENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSAmJiAoIXVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8IHdhaXRpbmdPbkNyZWF0ZSkpIHtcbiAgICAgICAgdmFyIGRlcHRoRmFpbENvbG9yUHJvcGVydHkgPSB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuY29sb3I7XG4gICAgICAgIHZhciBkZXB0aENvbG9yID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoZGVwdGhGYWlsQ29sb3JQcm9wZXJ0eSwgdGltZSwgQ29sb3IuV0hJVEUsIGNvbG9yU2NyYXRjaCk7XG4gICAgICAgIGlmICghQ29sb3IuZXF1YWxzKGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvciwgZGVwdGhDb2xvcikpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IgPSBDb2xvci5jbG9uZShkZXB0aENvbG9yLCBhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IpO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IgPSBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShkZXB0aENvbG9yLCBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgc2hvdyA9IHVwZGF0ZXIuZW50aXR5LmlzU2hvd2luZyAmJiAodXBkYXRlci5oYXNDb25zdGFudEZpbGwgfHwgdXBkYXRlci5pc0ZpbGxlZCh0aW1lKSk7XG4gICAgICB2YXIgY3VycmVudFNob3cgPSBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDE7XG4gICAgICBpZiAoc2hvdyAhPT0gY3VycmVudFNob3cpIHtcbiAgICAgICAgYXR0cmlidXRlcy5zaG93ID0gU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShzaG93LCBhdHRyaWJ1dGVzLnNob3cpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkgPSB1cGRhdGVyLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5O1xuICAgICAgaWYgKCFQcm9wZXJ0eS5pc0NvbnN0YW50KGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5KSkge1xuICAgICAgICB2YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHksIHRpbWUsIGRlZmF1bHREaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblNjcmF0Y2gpO1xuICAgICAgICBpZiAoIURpc3RhbmNlRGlzcGxheUNvbmRpdGlvbi5lcXVhbHMoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3REaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24uY2xvbmUoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKTtcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLnVwZGF0ZVNob3dzKHByaW1pdGl2ZSk7XG4gICAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkgJiYgIXByaW1pdGl2ZS5yZWFkeSkge1xuICAgIGlzVXBkYXRlZCA9IGZhbHNlO1xuICB9XG4gIHRoaXMuaXRlbXNUb1JlbW92ZS5sZW5ndGggPSByZW1vdmVkQ291bnQ7XG4gIHJldHVybiBpc1VwZGF0ZWQ7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUudXBkYXRlU2hvd3MgPSBmdW5jdGlvbiAocHJpbWl0aXZlKSB7XG4gIHZhciBzaG93c1VwZGF0ZWQgPSB0aGlzLnNob3dzVXBkYXRlZC52YWx1ZXM7XG4gIHZhciBsZW5ndGggPSBzaG93c1VwZGF0ZWQubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHVwZGF0ZXIgPSBzaG93c1VwZGF0ZWRbaV07XG4gICAgdmFyIGluc3RhbmNlID0gdGhpcy5nZW9tZXRyeS5nZXQodXBkYXRlci5pZCk7XG4gICAgXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcbiAgICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykpIHtcbiAgICAgIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoaW5zdGFuY2UuaWQpO1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XG4gICAgfVxuICAgIFxuICAgIHZhciBzaG93ID0gdXBkYXRlci5lbnRpdHkuaXNTaG93aW5nO1xuICAgIHZhciBjdXJyZW50U2hvdyA9IGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMTtcbiAgICBpZiAoc2hvdyAhPT0gY3VycmVudFNob3cpIHtcbiAgICAgIGF0dHJpYnV0ZXMuc2hvdyA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoc2hvdywgYXR0cmlidXRlcy5zaG93KTtcbiAgICB9XG4gIH1cbiAgdGhpcy5zaG93c1VwZGF0ZWQucmVtb3ZlQWxsKCk7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodXBkYXRlcikge1xuICByZXR1cm4gdGhpcy51cGRhdGVycy5jb250YWlucyh1cGRhdGVyLmlkKTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5nZXRCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICh1cGRhdGVyLCByZXN1bHQpIHtcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICBpZiAoIXByaW1pdGl2ZS5yZWFkeSkge1xuICAgIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLlBFTkRJTkc7XG4gIH1cbiAgdmFyIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXModXBkYXRlci5lbnRpdHkpO1xuICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykgfHwgIWRlZmluZWQoYXR0cmlidXRlcy5ib3VuZGluZ1NwaGVyZSkgfHwvL1xuICAgIChkZWZpbmVkKGF0dHJpYnV0ZXMuc2hvdykgJiYgYXR0cmlidXRlcy5zaG93WzBdID09PSAwKSkge1xuICAgIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLkZBSUxFRDtcbiAgfVxuICBhdHRyaWJ1dGVzLmJvdW5kaW5nU3BoZXJlLmNsb25lKHJlc3VsdCk7XG4gIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLkRPTkU7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUucmVtb3ZlQWxsUHJpbWl0aXZlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaW1pdGl2ZXMgPSB0aGlzLnByaW1pdGl2ZXM7XG4gIFxuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZ2VvbWV0cnkucmVtb3ZlQWxsKCk7XG4gICAgdGhpcy51cGRhdGVycy5yZW1vdmVBbGwoKTtcbiAgfVxuICBcbiAgdmFyIG9sZFByaW1pdGl2ZSA9IHRoaXMub2xkUHJpbWl0aXZlO1xuICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUob2xkUHJpbWl0aXZlKTtcbiAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgdmFyIHByaW1pdGl2ZXMgPSB0aGlzLnByaW1pdGl2ZXM7XG4gIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICB9XG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcbiAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gIH1cbiAgaWYgKGRlZmluZWQodGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbikpIHtcbiAgICB0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uKCk7XG4gIH1cbn07XG5cblxubGV0IHdhc0ZpeGVkID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MoKSB7XG4gIGlmICh3YXNGaXhlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBDZXNpdW0uU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGltZTogYW55LCB1cGRhdGVyOiBhbnkpIHtcbiAgICB2YXIgaXRlbXM7XG4gICAgdmFyIHRyYW5zbHVjZW50O1xuICAgIHZhciBpbnN0YW5jZSA9IHVwZGF0ZXIuY3JlYXRlRmlsbEdlb21ldHJ5SW5zdGFuY2UodGltZSk7XG4gICAgaWYgKGluc3RhbmNlLmF0dHJpYnV0ZXMuY29sb3IudmFsdWVbM10gPT09IDI1NSkge1xuICAgICAgaXRlbXMgPSB0aGlzLl9zb2xpZEl0ZW1zO1xuICAgICAgdHJhbnNsdWNlbnQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbXMgPSB0aGlzLl90cmFuc2x1Y2VudEl0ZW1zO1xuICAgICAgdHJhbnNsdWNlbnQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICB2YXIgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XG4gICAgICBpZiAoaXRlbS5pc01hdGVyaWFsKHVwZGF0ZXIpKSB7XG4gICAgICAgIGl0ZW0uYWRkKHVwZGF0ZXIsIGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgfVxuICAgIFxuICAgIHZhciBiYXRjaDogYW55ID0gbmV3IEJhdGNoKHRoaXMuX3ByaW1pdGl2ZXMsIHRyYW5zbHVjZW50LCB0aGlzLl9hcHBlYXJhbmNlVHlwZSwgdGhpcy5fZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUsIHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5fY2xvc2VkLCB0aGlzLl9zaGFkb3dzKTtcbiAgICBiYXRjaC5hZGQodXBkYXRlciwgaW5zdGFuY2UpO1xuICAgIGl0ZW1zLnB1c2goYmF0Y2gpO1xuICB9O1xuICB3YXNGaXhlZCA9IHRydWU7XG59XG4iXX0=
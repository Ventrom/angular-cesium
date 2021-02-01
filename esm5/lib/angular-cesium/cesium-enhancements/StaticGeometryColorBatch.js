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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY2VzaXVtLWVuaGFuY2VtZW50cy9TdGF0aWNHZW9tZXRyeUNvbG9yQmF0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsaUJBQWlCO0FBQ2pCLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQ2pELElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDM0IsSUFBTSw4QkFBOEIsR0FBRyxNQUFNLENBQUMsOEJBQThCLENBQUM7QUFDN0UsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFNLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztBQUNqRSxJQUFNLGlEQUFpRCxHQUFHLE1BQU0sQ0FBQyxpREFBaUQsQ0FBQztBQUNuSCxJQUFNLDZCQUE2QixHQUFHLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQztBQUMzRSxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDckMsSUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUM7QUFDdkQsSUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7QUFDM0QsSUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDakQsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUVqQyxJQUFJLFlBQVksR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQy9CLElBQUksK0JBQStCLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO0FBQ3JFLElBQUksK0JBQStCLEdBQUcsSUFBSSx3QkFBd0Is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QUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNSO1NBRUY7UUFFRCxJQUFJLEtBQUssR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0ssS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUM7SUFDRixRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpeCBmb3IgdGhlIGNvbnN0YW50IGVudGl0eSBzaGFkb3dpbmcuXG4gKiBQUiBpbiBDZXNpdW0gcmVwbzogaHR0cHM6Ly9naXRodWIuY29tL0FuYWx5dGljYWxHcmFwaGljc0luYy9jZXNpdW0vcHVsbC81NzM2XG4gKi9cblxuLy8gdHNsaW50OmRpc2FibGVcbmNvbnN0IEFzc29jaWF0aXZlQXJyYXkgPSBDZXNpdW0uQXNzb2NpYXRpdmVBcnJheTtcbmNvbnN0IENvbG9yID0gQ2VzaXVtLkNvbG9yO1xuY29uc3QgQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlID0gQ2VzaXVtLkNvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZTtcbmNvbnN0IGRlZmluZWQgPSBDZXNpdW0uZGVmaW5lZDtcbmNvbnN0IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IENlc2l1bS5EaXN0YW5jZURpc3BsYXlDb25kaXRpb247XG5jb25zdCBEaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlID0gQ2VzaXVtLkRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5TaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZTtcbmNvbnN0IFByaW1pdGl2ZSA9IENlc2l1bS5QcmltaXRpdmU7XG5jb25zdCBTaGFkb3dNb2RlID0gQ2VzaXVtLlNoYWRvd01vZGU7XG5jb25zdCBCb3VuZGluZ1NwaGVyZVN0YXRlID0gQ2VzaXVtLkJvdW5kaW5nU3BoZXJlU3RhdGU7XG5jb25zdCBDb2xvck1hdGVyaWFsUHJvcGVydHkgPSBDZXNpdW0uQ29sb3JNYXRlcmlhbFByb3BlcnR5O1xuY29uc3QgTWF0ZXJpYWxQcm9wZXJ0eSA9IENlc2l1bS5NYXRlcmlhbFByb3BlcnR5O1xuY29uc3QgUHJvcGVydHkgPSBDZXNpdW0uUHJvcGVydHk7XG5cbnZhciBjb2xvclNjcmF0Y2ggPSBuZXcgQ29sb3IoKTtcbnZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25TY3JhdGNoID0gbmV3IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbigpO1xudmFyIGRlZmF1bHREaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBuZXcgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKCk7XG5cbmZ1bmN0aW9uIEJhdGNoKHByaW1pdGl2ZXMsIHRyYW5zbHVjZW50LCBhcHBlYXJhbmNlVHlwZSwgZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUsIGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIGNsb3NlZCwgc2hhZG93cykge1xuICB0aGlzLnRyYW5zbHVjZW50ID0gdHJhbnNsdWNlbnQ7XG4gIHRoaXMuYXBwZWFyYW5jZVR5cGUgPSBhcHBlYXJhbmNlVHlwZTtcbiAgdGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSA9IGRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlO1xuICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgPSBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gdW5kZWZpbmVkO1xuICB0aGlzLmNsb3NlZCA9IGNsb3NlZDtcbiAgdGhpcy5zaGFkb3dzID0gc2hhZG93cztcbiAgdGhpcy5wcmltaXRpdmVzID0gcHJpbWl0aXZlcztcbiAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcbiAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSBmYWxzZTtcbiAgdGhpcy5wcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICB0aGlzLmdlb21ldHJ5ID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy51cGRhdGVycyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuYXR0cmlidXRlcyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuc2hvd3NVcGRhdGVkID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy5pdGVtc1RvUmVtb3ZlID0gW107XG4gIHRoaXMuaW52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgXG4gIHZhciByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbjtcbiAgaWYgKGRlZmluZWQoZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbiA9IGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuZGVmaW5pdGlvbkNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcihCYXRjaC5wcm90b3R5cGUub25NYXRlcmlhbENoYW5nZWQsIHRoaXMpO1xuICB9XG4gIHRoaXMucmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24gPSByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbjtcbn1cblxuQmF0Y2gucHJvdG90eXBlLm9uTWF0ZXJpYWxDaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmludmFsaWRhdGVkID0gdHJ1ZTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5pc01hdGVyaWFsID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcbiAgdmFyIG1hdGVyaWFsID0gdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICB2YXIgdXBkYXRlck1hdGVyaWFsID0gdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICBpZiAodXBkYXRlck1hdGVyaWFsID09PSBtYXRlcmlhbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChkZWZpbmVkKG1hdGVyaWFsKSkge1xuICAgIHJldHVybiBtYXRlcmlhbC5lcXVhbHModXBkYXRlck1hdGVyaWFsKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHVwZGF0ZXIsIGluc3RhbmNlKSB7XG4gIHZhciBpZCA9IHVwZGF0ZXIuaWQ7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gdHJ1ZTtcbiAgdGhpcy5nZW9tZXRyeS5zZXQoaWQsIGluc3RhbmNlKTtcbiAgdGhpcy51cGRhdGVycy5zZXQoaWQsIHVwZGF0ZXIpO1xuICBpZiAoIXVwZGF0ZXIuaGFzQ29uc3RhbnRGaWxsIHx8ICF1cGRhdGVyLmZpbGxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgIVByb3BlcnR5LmlzQ29uc3RhbnQodXBkYXRlci5kaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSkpIHtcbiAgICB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMuc2V0KGlkLCB1cGRhdGVyKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnNldChpZCwgdXBkYXRlci5lbnRpdHkuZGVmaW5pdGlvbkNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAoZW50aXR5LCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ2lzU2hvd2luZycpIHtcbiAgICAgICAgdGhhdC5zaG93c1VwZGF0ZWQuc2V0KHVwZGF0ZXIuaWQsIHVwZGF0ZXIpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICh1cGRhdGVyKSB7XG4gIHZhciBpZCA9IHVwZGF0ZXIuaWQ7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gdGhpcy5nZW9tZXRyeS5yZW1vdmUoaWQpIHx8IHRoaXMuY3JlYXRlUHJpbWl0aXZlO1xuICBpZiAodGhpcy51cGRhdGVycy5yZW1vdmUoaWQpKSB7XG4gICAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnJlbW92ZShpZCk7XG4gICAgdmFyIHVuc3Vic2NyaWJlID0gdGhpcy5zdWJzY3JpcHRpb25zLmdldChpZCk7XG4gICAgaWYgKGRlZmluZWQodW5zdWJzY3JpYmUpKSB7XG4gICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShpZCk7XG4gICAgfVxuICB9XG59O1xuXG5CYXRjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgdmFyIGlzVXBkYXRlZCA9IHRydWU7XG4gIHZhciByZW1vdmVkQ291bnQgPSAwO1xuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICB2YXIgYXR0cmlidXRlcztcbiAgdmFyIGk7XG4gIFxuICBpZiAodGhpcy5jcmVhdGVQcmltaXRpdmUpIHtcbiAgICB2YXIgZ2VvbWV0cmllcyA9IHRoaXMuZ2VvbWV0cnkudmFsdWVzO1xuICAgIHZhciBnZW9tZXRyaWVzTGVuZ3RoID0gZ2VvbWV0cmllcy5sZW5ndGg7XG4gICAgaWYgKGdlb21ldHJpZXNMZW5ndGggPiAwKSB7XG4gICAgICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgICAgIGlmICghZGVmaW5lZCh0aGlzLm9sZFByaW1pdGl2ZSkpIHtcbiAgICAgICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHByaW1pdGl2ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBnZW9tZXRyaWVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5SXRlbSA9IGdlb21ldHJpZXNbaV07XG4gICAgICAgIHZhciBvcmlnaW5hbEF0dHJpYnV0ZXMgPSBnZW9tZXRyeUl0ZW0uYXR0cmlidXRlcztcbiAgICAgICAgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcy5nZXQoZ2VvbWV0cnlJdGVtLmlkLmlkKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLnNob3cpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuc2hvdy52YWx1ZSA9IGF0dHJpYnV0ZXMuc2hvdztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLmNvbG9yKSkge1xuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLmNvbG9yLnZhbHVlID0gYXR0cmlidXRlcy5jb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRlZmluZWQob3JpZ2luYWxBdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yKSkge1xuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yLnZhbHVlID0gYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIGRlcHRoRmFpbEFwcGVhcmFuY2U7XG4gICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSkge1xuICAgICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgICAgICAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IE1hdGVyaWFsUHJvcGVydHkuZ2V0VmFsdWUodGltZSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgICAgICBkZXB0aEZhaWxBcHBlYXJhbmNlID0gbmV3IHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUoe1xuICAgICAgICAgIG1hdGVyaWFsOiB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsLFxuICAgICAgICAgIHRyYW5zbHVjZW50OiB0aGlzLnRyYW5zbHVjZW50LFxuICAgICAgICAgIGNsb3NlZDogdGhpcy5jbG9zZWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHByaW1pdGl2ZSA9IG5ldyBQcmltaXRpdmUoe1xuICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgYXN5bmNocm9ub3VzOiB0cnVlLFxuICAgICAgICBnZW9tZXRyeUluc3RhbmNlczogZ2VvbWV0cmllcyxcbiAgICAgICAgYXBwZWFyYW5jZTogbmV3IHRoaXMuYXBwZWFyYW5jZVR5cGUoe1xuICAgICAgICAgIGZsYXQ6IHRoaXMuc2hhZG93cyA9PT0gU2hhZG93TW9kZS5ESVNBQkxFRCB8fCB0aGlzLnNoYWRvd3MgPT09IFNoYWRvd01vZGUuQ0FTVF9PTkxZLFxuICAgICAgICAgIHRyYW5zbHVjZW50OiB0aGlzLnRyYW5zbHVjZW50LFxuICAgICAgICAgIGNsb3NlZDogdGhpcy5jbG9zZWRcbiAgICAgICAgfSksXG4gICAgICAgIGRlcHRoRmFpbEFwcGVhcmFuY2U6IGRlcHRoRmFpbEFwcGVhcmFuY2UsXG4gICAgICAgIHNoYWRvd3M6IHRoaXMuc2hhZG93c1xuICAgICAgfSk7XG4gICAgICBwcmltaXRpdmVzLmFkZChwcmltaXRpdmUpO1xuICAgICAgaXNVcGRhdGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICAgICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgdmFyIG9sZFByaW1pdGl2ZSA9IHRoaXMub2xkUHJpbWl0aXZlO1xuICAgICAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xuICAgICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5hdHRyaWJ1dGVzLnJlbW92ZUFsbCgpO1xuICAgIHRoaXMucHJpbWl0aXZlID0gcHJpbWl0aXZlO1xuICAgIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gZmFsc2U7XG4gICAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGRlZmluZWQocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUucmVhZHkpIHtcbiAgICBwcmltaXRpdmUuc2hvdyA9IHRydWU7XG4gICAgaWYgKGRlZmluZWQodGhpcy5vbGRQcmltaXRpdmUpKSB7XG4gICAgICBwcmltaXRpdmVzLnJlbW92ZSh0aGlzLm9sZFByaW1pdGl2ZSk7XG4gICAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkgJiYgISh0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgaW5zdGFuY2VvZiBDb2xvck1hdGVyaWFsUHJvcGVydHkpKSB7XG4gICAgICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gTWF0ZXJpYWxQcm9wZXJ0eS5nZXRWYWx1ZSh0aW1lLCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwpO1xuICAgICAgdGhpcy5wcmltaXRpdmUuZGVwdGhGYWlsQXBwZWFyYW5jZS5tYXRlcmlhbCA9IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWw7XG4gICAgfVxuICAgIFxuICAgIHZhciB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzID0gdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnZhbHVlcztcbiAgICB2YXIgbGVuZ3RoID0gdXBkYXRlcnNXaXRoQXR0cmlidXRlcy5sZW5ndGg7XG4gICAgdmFyIHdhaXRpbmdPbkNyZWF0ZSA9IHRoaXMud2FpdGluZ09uQ3JlYXRlO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVwZGF0ZXIgPSB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzW2ldO1xuICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5nZW9tZXRyeS5nZXQodXBkYXRlci5pZCk7XG4gICAgICBcbiAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcbiAgICAgIGlmICghZGVmaW5lZChhdHRyaWJ1dGVzKSkge1xuICAgICAgICBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKGluc3RhbmNlLmlkKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICghdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8IHdhaXRpbmdPbkNyZWF0ZSkge1xuICAgICAgICB2YXIgY29sb3JQcm9wZXJ0eSA9IHVwZGF0ZXIuZmlsbE1hdGVyaWFsUHJvcGVydHkuY29sb3I7XG4gICAgICAgIHZhciByZXN1bHRDb2xvciA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGNvbG9yUHJvcGVydHksIHRpbWUsIENvbG9yLldISVRFLCBjb2xvclNjcmF0Y2gpO1xuICAgICAgICBpZiAoIUNvbG9yLmVxdWFscyhhdHRyaWJ1dGVzLl9sYXN0Q29sb3IsIHJlc3VsdENvbG9yKSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3RDb2xvciA9IENvbG9yLmNsb25lKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLl9sYXN0Q29sb3IpO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuY29sb3IgPSBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShyZXN1bHRDb2xvciwgYXR0cmlidXRlcy5jb2xvcik7XG4gICAgICAgICAgaWYgKCh0aGlzLnRyYW5zbHVjZW50ICYmIGF0dHJpYnV0ZXMuY29sb3JbM10gPT09IDI1NSkgfHwgKCF0aGlzLnRyYW5zbHVjZW50ICYmIGF0dHJpYnV0ZXMuY29sb3JbM10gIT09IDI1NSkpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNUb1JlbW92ZVtyZW1vdmVkQ291bnQrK10gPSB1cGRhdGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSAmJiB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgaW5zdGFuY2VvZiBDb2xvck1hdGVyaWFsUHJvcGVydHkgJiYgKCF1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuaXNDb25zdGFudCB8fCB3YWl0aW5nT25DcmVhdGUpKSB7XG4gICAgICAgIHZhciBkZXB0aEZhaWxDb2xvclByb3BlcnR5ID0gdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmNvbG9yO1xuICAgICAgICB2YXIgZGVwdGhDb2xvciA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGRlcHRoRmFpbENvbG9yUHJvcGVydHksIHRpbWUsIENvbG9yLldISVRFLCBjb2xvclNjcmF0Y2gpO1xuICAgICAgICBpZiAoIUNvbG9yLmVxdWFscyhhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IsIGRlcHRoQ29sb3IpKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5fbGFzdERlcHRoRmFpbENvbG9yID0gQ29sb3IuY2xvbmUoZGVwdGhDb2xvciwgYXR0cmlidXRlcy5fbGFzdERlcHRoRmFpbENvbG9yKTtcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yID0gQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoZGVwdGhDb2xvciwgYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIHNob3cgPSB1cGRhdGVyLmVudGl0eS5pc1Nob3dpbmcgJiYgKHVwZGF0ZXIuaGFzQ29uc3RhbnRGaWxsIHx8IHVwZGF0ZXIuaXNGaWxsZWQodGltZSkpO1xuICAgICAgdmFyIGN1cnJlbnRTaG93ID0gYXR0cmlidXRlcy5zaG93WzBdID09PSAxO1xuICAgICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XG4gICAgICAgIGF0dHJpYnV0ZXMuc2hvdyA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoc2hvdywgYXR0cmlidXRlcy5zaG93KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5ID0gdXBkYXRlci5kaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eTtcbiAgICAgIGlmICghUHJvcGVydHkuaXNDb25zdGFudChkaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSkpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IFByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5LCB0aW1lLCBkZWZhdWx0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25TY3JhdGNoKTtcbiAgICAgICAgaWYgKCFEaXN0YW5jZURpc3BsYXlDb25kaXRpb24uZXF1YWxzKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbikpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLmNsb25lKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbik7XG4gICAgICAgICAgYXR0cmlidXRlcy5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy51cGRhdGVTaG93cyhwcmltaXRpdmUpO1xuICAgIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoZGVmaW5lZChwcmltaXRpdmUpICYmICFwcmltaXRpdmUucmVhZHkpIHtcbiAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcbiAgfVxuICB0aGlzLml0ZW1zVG9SZW1vdmUubGVuZ3RoID0gcmVtb3ZlZENvdW50O1xuICByZXR1cm4gaXNVcGRhdGVkO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZVNob3dzID0gZnVuY3Rpb24gKHByaW1pdGl2ZSkge1xuICB2YXIgc2hvd3NVcGRhdGVkID0gdGhpcy5zaG93c1VwZGF0ZWQudmFsdWVzO1xuICB2YXIgbGVuZ3RoID0gc2hvd3NVcGRhdGVkLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciB1cGRhdGVyID0gc2hvd3NVcGRhdGVkW2ldO1xuICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2VvbWV0cnkuZ2V0KHVwZGF0ZXIuaWQpO1xuICAgIFxuICAgIHZhciBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChpbnN0YW5jZS5pZC5pZCk7XG4gICAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKGluc3RhbmNlLmlkKTtcbiAgICAgIHRoaXMuYXR0cmlidXRlcy5zZXQoaW5zdGFuY2UuaWQuaWQsIGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgc2hvdyA9IHVwZGF0ZXIuZW50aXR5LmlzU2hvd2luZztcbiAgICB2YXIgY3VycmVudFNob3cgPSBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDE7XG4gICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XG4gICAgICBhdHRyaWJ1dGVzLnNob3cgPSBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHNob3csIGF0dHJpYnV0ZXMuc2hvdyk7XG4gICAgfVxuICB9XG4gIHRoaXMuc2hvd3NVcGRhdGVkLnJlbW92ZUFsbCgpO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcbiAgcmV0dXJuIHRoaXMudXBkYXRlcnMuY29udGFpbnModXBkYXRlci5pZCk7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuZ2V0Qm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAodXBkYXRlciwgcmVzdWx0KSB7XG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgaWYgKCFwcmltaXRpdmUucmVhZHkpIHtcbiAgICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5QRU5ESU5HO1xuICB9XG4gIHZhciBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKHVwZGF0ZXIuZW50aXR5KTtcbiAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpIHx8ICFkZWZpbmVkKGF0dHJpYnV0ZXMuYm91bmRpbmdTcGhlcmUpIHx8Ly9cbiAgICAoZGVmaW5lZChhdHRyaWJ1dGVzLnNob3cpICYmIGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMCkpIHtcbiAgICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5GQUlMRUQ7XG4gIH1cbiAgYXR0cmlidXRlcy5ib3VuZGluZ1NwaGVyZS5jbG9uZShyZXN1bHQpO1xuICByZXR1cm4gQm91bmRpbmdTcGhlcmVTdGF0ZS5ET05FO1xufTtcblxuQmF0Y2gucHJvdG90eXBlLnJlbW92ZUFsbFByaW1pdGl2ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICBcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmdlb21ldHJ5LnJlbW92ZUFsbCgpO1xuICAgIHRoaXMudXBkYXRlcnMucmVtb3ZlQWxsKCk7XG4gIH1cbiAgXG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcbiAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gICAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbkJhdGNoLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICBpZiAoZGVmaW5lZChwcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcbiAgfVxuICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XG4gIGlmIChkZWZpbmVkKG9sZFByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xuICB9XG4gIGlmIChkZWZpbmVkKHRoaXMucmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24pKSB7XG4gICAgdGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbigpO1xuICB9XG59O1xuXG5cbmxldCB3YXNGaXhlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZml4Q2VzaXVtRW50aXRpZXNTaGFkb3dzKCkge1xuICBpZiAod2FzRml4ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgQ2VzaXVtLlN0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHRpbWU6IGFueSwgdXBkYXRlcjogYW55KSB7XG4gICAgdmFyIGl0ZW1zO1xuICAgIHZhciB0cmFuc2x1Y2VudDtcbiAgICB2YXIgaW5zdGFuY2UgPSB1cGRhdGVyLmNyZWF0ZUZpbGxHZW9tZXRyeUluc3RhbmNlKHRpbWUpO1xuICAgIGlmIChpbnN0YW5jZS5hdHRyaWJ1dGVzLmNvbG9yLnZhbHVlWzNdID09PSAyNTUpIHtcbiAgICAgIGl0ZW1zID0gdGhpcy5fc29saWRJdGVtcztcbiAgICAgIHRyYW5zbHVjZW50ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW1zID0gdGhpcy5fdHJhbnNsdWNlbnRJdGVtcztcbiAgICAgIHRyYW5zbHVjZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgaWYgKGl0ZW0uaXNNYXRlcmlhbCh1cGRhdGVyKSkge1xuICAgICAgICBpdGVtLmFkZCh1cGRhdGVyLCBpbnN0YW5jZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICB2YXIgYmF0Y2g6IGFueSA9IG5ldyBCYXRjaCh0aGlzLl9wcmltaXRpdmVzLCB0cmFuc2x1Y2VudCwgdGhpcy5fYXBwZWFyYW5jZVR5cGUsIHRoaXMuX2RlcHRoRmFpbEFwcGVhcmFuY2VUeXBlLCB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuX2Nsb3NlZCwgdGhpcy5fc2hhZG93cyk7XG4gICAgYmF0Y2guYWRkKHVwZGF0ZXIsIGluc3RhbmNlKTtcbiAgICBpdGVtcy5wdXNoKGJhdGNoKTtcbiAgfTtcbiAgd2FzRml4ZWQgPSB0cnVlO1xufVxuIl19
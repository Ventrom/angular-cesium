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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxpQkFBaUI7QUFDakIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDakQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMzQixNQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztBQUM3RSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQy9CLE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ2pFLE1BQU0saURBQWlELEdBQUcsTUFBTSxDQUFDLGlEQUFpRCxDQUFDO0FBQ25ILE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDO0FBQzNFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNyQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUN2RCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztBQUMzRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBRWpDLElBQUksWUFBWSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDL0IsSUFBSSwrQkFBK0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7QUFDckUsSUFBSSwrQkFBK0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7QUFFckUsU0FBUyxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsdUJBQXVCLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxFQUFFLE9BQU87SUFDekgsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDckMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHVCQUF1QixDQUFDO0lBQ3ZELElBQUksQ0FBQyx5QkFBeUIsR0FBRyx5QkFBeUIsQ0FBQztJQUMzRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0lBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDckQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFFekIsSUFBSSwwQkFBMEIsQ0FBQztJQUMvQixJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFO1FBQ3RDLDBCQUEwQixHQUFHLHlCQUF5QixDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDcEk7SUFDRCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsMEJBQTBCLENBQUM7QUFDL0QsQ0FBQztBQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUc7SUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDMUIsQ0FBQyxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPO0lBQzVDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztJQUM5QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUM7SUFDeEQsSUFBSSxlQUFlLEtBQUssUUFBUSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNyQixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDekM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsT0FBTyxFQUFFLFFBQVE7SUFDL0MsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNwQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLEVBQUU7UUFDMUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7U0FBTTtRQUNMLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVE7WUFDN0gsSUFBSSxZQUFZLEtBQUssV0FBVyxFQUFFO2dCQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzVDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNMO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxPQUFPO0lBQ3hDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQ3hFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDNUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN4QixXQUFXLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9CO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLElBQUk7SUFDckMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQy9CLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDakMsSUFBSSxVQUFVLENBQUM7SUFDZixJQUFJLENBQUMsQ0FBQztJQUVOLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUN4QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDbkUsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ3pDLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7aUJBQy9CO3FCQUFNO29CQUNMLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7WUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksa0JBQWtCLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDakQsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJELElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUN2QixJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDcEMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO3FCQUNqRDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDckMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO3FCQUNuRDtvQkFDRCxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDOUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO3FCQUNyRTtpQkFDRjthQUNGO1lBRUQsSUFBSSxtQkFBbUIsQ0FBQztZQUN4QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRTtnQkFDekMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7b0JBQzNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDbEg7Z0JBQ0QsbUJBQW1CLEdBQUcsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUM7b0JBQ3JELFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCO29CQUNoQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQzdCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUM7Z0JBQ3hCLElBQUksRUFBRSxLQUFLO2dCQUNYLFlBQVksRUFBRSxJQUFJO2dCQUNsQixpQkFBaUIsRUFBRSxVQUFVO2dCQUM3QixVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO29CQUNsQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDLFNBQVM7b0JBQ25GLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztvQkFDN0IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUNwQixDQUFDO2dCQUNGLG1CQUFtQixFQUFFLG1CQUFtQjtnQkFDeEMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCLENBQUMsQ0FBQztZQUNILFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUIsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUNuQjthQUFNO1lBQ0wsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLFNBQVMsR0FBRyxTQUFTLENBQUM7YUFDdkI7WUFDRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3JDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzthQUMvQjtTQUNGO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztLQUM3QjtTQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDaEQsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzlCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsWUFBWSxxQkFBcUIsQ0FBQyxFQUFFO1lBQy9HLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNqSCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7U0FDdEU7UUFFRCxJQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7UUFDaEUsSUFBSSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQzNDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDM0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0IsSUFBSSxPQUFPLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTdDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3hCLFVBQVUsR0FBRyxTQUFTLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUNqRDtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsVUFBVSxJQUFJLGVBQWUsRUFBRTtnQkFDL0QsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQztnQkFDdkQsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDN0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDckQsVUFBVSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3hFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsOEJBQThCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pGLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTt3QkFDM0csSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztxQkFDOUM7aUJBQ0Y7YUFDRjtZQUVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsWUFBWSxxQkFBcUIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFVBQVUsSUFBSSxlQUFlLENBQUMsRUFBRTtnQkFDckwsSUFBSSxzQkFBc0IsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDO2dCQUNyRSxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3JHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDN0QsVUFBVSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUN6RixVQUFVLENBQUMsY0FBYyxHQUFHLDhCQUE4QixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUMzRzthQUNGO1lBRUQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzRixJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7Z0JBQ3hCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEY7WUFFRCxJQUFJLGdDQUFnQyxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQztZQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFO2dCQUMxRCxJQUFJLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxnQ0FBZ0MsRUFBRSxJQUFJLEVBQUUsK0JBQStCLEVBQUUsK0JBQStCLENBQUMsQ0FBQztnQkFDcEssSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLENBQUMsNkJBQTZCLENBQUMsRUFBRTtvQkFDeEcsVUFBVSxDQUFDLDZCQUE2QixHQUFHLHdCQUF3QixDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztvQkFDOUksVUFBVSxDQUFDLHdCQUF3QixHQUFHLGlEQUFpRCxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztpQkFDaEs7YUFDRjtTQUNGO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztLQUM5QjtTQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqRCxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ25CO0lBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0lBQ3pDLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsU0FBUztJQUMvQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUM1QyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDeEIsVUFBVSxHQUFHLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDakQ7UUFFRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDeEIsVUFBVSxDQUFDLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoRjtLQUNGO0lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLE9BQU87SUFDMUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLE9BQU8sRUFBRSxNQUFNO0lBQzNELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDcEIsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7S0FDcEM7SUFDRCxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFHLEVBQUU7UUFDbEUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDeEQsT0FBTyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7S0FDbkM7SUFDRCxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxPQUFPLG1CQUFtQixDQUFDLElBQUksQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHO0lBQ3BDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFFakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMvQixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUN0QixVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMzQjtJQUVELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDckMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDekIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztLQUMvQjtBQUNILENBQUMsQ0FBQztBQUVGLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO0lBQ3hCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDL0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNqQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUN0QixVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlCO0lBQ0QsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUNyQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7UUFDNUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7S0FDbkM7QUFDSCxDQUFDLENBQUM7QUFHRixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFFckIsTUFBTSxVQUFVLHdCQUF3QjtJQUN0QyxJQUFJLFFBQVEsRUFBRTtRQUNaLE9BQU87S0FDUjtJQUNELE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsSUFBUyxFQUFFLE9BQVk7UUFDL0UsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLFdBQVcsQ0FBQztRQUNoQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzlDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3pCLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDckI7YUFBTTtZQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDL0IsV0FBVyxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNSO1NBRUY7UUFFRCxJQUFJLEtBQUssR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0ssS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUM7SUFDRixRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpeCBmb3IgdGhlIGNvbnN0YW50IGVudGl0eSBzaGFkb3dpbmcuXG4gKiBQUiBpbiBDZXNpdW0gcmVwbzogaHR0cHM6Ly9naXRodWIuY29tL0FuYWx5dGljYWxHcmFwaGljc0luYy9jZXNpdW0vcHVsbC81NzM2XG4gKi9cblxuLy8gdHNsaW50OmRpc2FibGVcbmNvbnN0IEFzc29jaWF0aXZlQXJyYXkgPSBDZXNpdW0uQXNzb2NpYXRpdmVBcnJheTtcbmNvbnN0IENvbG9yID0gQ2VzaXVtLkNvbG9yO1xuY29uc3QgQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlID0gQ2VzaXVtLkNvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZTtcbmNvbnN0IGRlZmluZWQgPSBDZXNpdW0uZGVmaW5lZDtcbmNvbnN0IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IENlc2l1bS5EaXN0YW5jZURpc3BsYXlDb25kaXRpb247XG5jb25zdCBEaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlID0gQ2VzaXVtLkRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XG5jb25zdCBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IENlc2l1bS5TaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZTtcbmNvbnN0IFByaW1pdGl2ZSA9IENlc2l1bS5QcmltaXRpdmU7XG5jb25zdCBTaGFkb3dNb2RlID0gQ2VzaXVtLlNoYWRvd01vZGU7XG5jb25zdCBCb3VuZGluZ1NwaGVyZVN0YXRlID0gQ2VzaXVtLkJvdW5kaW5nU3BoZXJlU3RhdGU7XG5jb25zdCBDb2xvck1hdGVyaWFsUHJvcGVydHkgPSBDZXNpdW0uQ29sb3JNYXRlcmlhbFByb3BlcnR5O1xuY29uc3QgTWF0ZXJpYWxQcm9wZXJ0eSA9IENlc2l1bS5NYXRlcmlhbFByb3BlcnR5O1xuY29uc3QgUHJvcGVydHkgPSBDZXNpdW0uUHJvcGVydHk7XG5cbnZhciBjb2xvclNjcmF0Y2ggPSBuZXcgQ29sb3IoKTtcbnZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25TY3JhdGNoID0gbmV3IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbigpO1xudmFyIGRlZmF1bHREaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBuZXcgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKCk7XG5cbmZ1bmN0aW9uIEJhdGNoKHByaW1pdGl2ZXMsIHRyYW5zbHVjZW50LCBhcHBlYXJhbmNlVHlwZSwgZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUsIGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIGNsb3NlZCwgc2hhZG93cykge1xuICB0aGlzLnRyYW5zbHVjZW50ID0gdHJhbnNsdWNlbnQ7XG4gIHRoaXMuYXBwZWFyYW5jZVR5cGUgPSBhcHBlYXJhbmNlVHlwZTtcbiAgdGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSA9IGRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlO1xuICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkgPSBkZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gdW5kZWZpbmVkO1xuICB0aGlzLmNsb3NlZCA9IGNsb3NlZDtcbiAgdGhpcy5zaGFkb3dzID0gc2hhZG93cztcbiAgdGhpcy5wcmltaXRpdmVzID0gcHJpbWl0aXZlcztcbiAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcbiAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSBmYWxzZTtcbiAgdGhpcy5wcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICB0aGlzLmdlb21ldHJ5ID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy51cGRhdGVycyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuYXR0cmlidXRlcyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XG4gIHRoaXMuc2hvd3NVcGRhdGVkID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcbiAgdGhpcy5pdGVtc1RvUmVtb3ZlID0gW107XG4gIHRoaXMuaW52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgXG4gIHZhciByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbjtcbiAgaWYgKGRlZmluZWQoZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbiA9IGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuZGVmaW5pdGlvbkNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcihCYXRjaC5wcm90b3R5cGUub25NYXRlcmlhbENoYW5nZWQsIHRoaXMpO1xuICB9XG4gIHRoaXMucmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb24gPSByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbjtcbn1cblxuQmF0Y2gucHJvdG90eXBlLm9uTWF0ZXJpYWxDaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmludmFsaWRhdGVkID0gdHJ1ZTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5pc01hdGVyaWFsID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcbiAgdmFyIG1hdGVyaWFsID0gdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICB2YXIgdXBkYXRlck1hdGVyaWFsID0gdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5O1xuICBpZiAodXBkYXRlck1hdGVyaWFsID09PSBtYXRlcmlhbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChkZWZpbmVkKG1hdGVyaWFsKSkge1xuICAgIHJldHVybiBtYXRlcmlhbC5lcXVhbHModXBkYXRlck1hdGVyaWFsKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHVwZGF0ZXIsIGluc3RhbmNlKSB7XG4gIHZhciBpZCA9IHVwZGF0ZXIuaWQ7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gdHJ1ZTtcbiAgdGhpcy5nZW9tZXRyeS5zZXQoaWQsIGluc3RhbmNlKTtcbiAgdGhpcy51cGRhdGVycy5zZXQoaWQsIHVwZGF0ZXIpO1xuICBpZiAoIXVwZGF0ZXIuaGFzQ29uc3RhbnRGaWxsIHx8ICF1cGRhdGVyLmZpbGxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgIVByb3BlcnR5LmlzQ29uc3RhbnQodXBkYXRlci5kaXN0YW5jZURpc3BsYXlDb25kaXRpb25Qcm9wZXJ0eSkpIHtcbiAgICB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMuc2V0KGlkLCB1cGRhdGVyKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnNldChpZCwgdXBkYXRlci5lbnRpdHkuZGVmaW5pdGlvbkNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAoZW50aXR5LCBwcm9wZXJ0eU5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ2lzU2hvd2luZycpIHtcbiAgICAgICAgdGhhdC5zaG93c1VwZGF0ZWQuc2V0KHVwZGF0ZXIuaWQsIHVwZGF0ZXIpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICh1cGRhdGVyKSB7XG4gIHZhciBpZCA9IHVwZGF0ZXIuaWQ7XG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gdGhpcy5nZW9tZXRyeS5yZW1vdmUoaWQpIHx8IHRoaXMuY3JlYXRlUHJpbWl0aXZlO1xuICBpZiAodGhpcy51cGRhdGVycy5yZW1vdmUoaWQpKSB7XG4gICAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnJlbW92ZShpZCk7XG4gICAgdmFyIHVuc3Vic2NyaWJlID0gdGhpcy5zdWJzY3JpcHRpb25zLmdldChpZCk7XG4gICAgaWYgKGRlZmluZWQodW5zdWJzY3JpYmUpKSB7XG4gICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShpZCk7XG4gICAgfVxuICB9XG59O1xuXG5CYXRjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgdmFyIGlzVXBkYXRlZCA9IHRydWU7XG4gIHZhciByZW1vdmVkQ291bnQgPSAwO1xuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xuICB2YXIgYXR0cmlidXRlcztcbiAgdmFyIGk7XG4gIFxuICBpZiAodGhpcy5jcmVhdGVQcmltaXRpdmUpIHtcbiAgICB2YXIgZ2VvbWV0cmllcyA9IHRoaXMuZ2VvbWV0cnkudmFsdWVzLmZpbHRlcihnID0+IGcgIT09IHVuZGVmaW5lZCk7XG4gICAgdmFyIGdlb21ldHJpZXNMZW5ndGggPSBnZW9tZXRyaWVzLmxlbmd0aDtcbiAgICBpZiAoZ2VvbWV0cmllc0xlbmd0aCA+IDApIHtcbiAgICAgIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICAgICAgaWYgKCFkZWZpbmVkKHRoaXMub2xkUHJpbWl0aXZlKSkge1xuICAgICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gcHJpbWl0aXZlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZm9yIChpID0gMDsgaSA8IGdlb21ldHJpZXNMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZ2VvbWV0cnlJdGVtID0gZ2VvbWV0cmllc1tpXTtcbiAgICAgICAgdmFyIG9yaWdpbmFsQXR0cmlidXRlcyA9IGdlb21ldHJ5SXRlbS5hdHRyaWJ1dGVzO1xuICAgICAgICBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChnZW9tZXRyeUl0ZW0uaWQuaWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRlZmluZWQoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuc2hvdykpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5zaG93LnZhbHVlID0gYXR0cmlidXRlcy5zaG93O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuY29sb3IpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuY29sb3IudmFsdWUgPSBhdHRyaWJ1dGVzLmNvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IpKSB7XG4gICAgICAgICAgICBvcmlnaW5hbEF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IudmFsdWUgPSBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgZGVwdGhGYWlsQXBwZWFyYW5jZTtcbiAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUpKSB7XG4gICAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICAgICAgICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gTWF0ZXJpYWxQcm9wZXJ0eS5nZXRWYWx1ZSh0aW1lLCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIGRlcHRoRmFpbEFwcGVhcmFuY2UgPSBuZXcgdGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSh7XG4gICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwsXG4gICAgICAgICAgdHJhbnNsdWNlbnQ6IHRoaXMudHJhbnNsdWNlbnQsXG4gICAgICAgICAgY2xvc2VkOiB0aGlzLmNsb3NlZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcHJpbWl0aXZlID0gbmV3IFByaW1pdGl2ZSh7XG4gICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICBhc3luY2hyb25vdXM6IHRydWUsXG4gICAgICAgIGdlb21ldHJ5SW5zdGFuY2VzOiBnZW9tZXRyaWVzLFxuICAgICAgICBhcHBlYXJhbmNlOiBuZXcgdGhpcy5hcHBlYXJhbmNlVHlwZSh7XG4gICAgICAgICAgZmxhdDogdGhpcy5zaGFkb3dzID09PSBTaGFkb3dNb2RlLkRJU0FCTEVEIHx8IHRoaXMuc2hhZG93cyA9PT0gU2hhZG93TW9kZS5DQVNUX09OTFksXG4gICAgICAgICAgdHJhbnNsdWNlbnQ6IHRoaXMudHJhbnNsdWNlbnQsXG4gICAgICAgICAgY2xvc2VkOiB0aGlzLmNsb3NlZFxuICAgICAgICB9KSxcbiAgICAgICAgZGVwdGhGYWlsQXBwZWFyYW5jZTogZGVwdGhGYWlsQXBwZWFyYW5jZSxcbiAgICAgICAgc2hhZG93czogdGhpcy5zaGFkb3dzXG4gICAgICB9KTtcbiAgICAgIHByaW1pdGl2ZXMuYWRkKHByaW1pdGl2ZSk7XG4gICAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgICAgICBwcmltaXRpdmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XG4gICAgICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XG4gICAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLmF0dHJpYnV0ZXMucmVtb3ZlQWxsKCk7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBwcmltaXRpdmU7XG4gICAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcbiAgICB0aGlzLndhaXRpbmdPbkNyZWF0ZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZGVmaW5lZChwcmltaXRpdmUpICYmIHByaW1pdGl2ZS5yZWFkeSkge1xuICAgIHByaW1pdGl2ZS5zaG93ID0gdHJ1ZTtcbiAgICBpZiAoZGVmaW5lZCh0aGlzLm9sZFByaW1pdGl2ZSkpIHtcbiAgICAgIHByaW1pdGl2ZXMucmVtb3ZlKHRoaXMub2xkUHJpbWl0aXZlKTtcbiAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSAmJiAhKHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSBpbnN0YW5jZW9mIENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcbiAgICAgIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWwgPSBNYXRlcmlhbFByb3BlcnR5LmdldFZhbHVlKHRpbWUsIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCk7XG4gICAgICB0aGlzLnByaW1pdGl2ZS5kZXB0aEZhaWxBcHBlYXJhbmNlLm1hdGVyaWFsID0gdGhpcy5kZXB0aEZhaWxNYXRlcmlhbDtcbiAgICB9XG4gICAgXG4gICAgdmFyIHVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMgPSB0aGlzLnVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXMudmFsdWVzO1xuICAgIHZhciBsZW5ndGggPSB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLmxlbmd0aDtcbiAgICB2YXIgd2FpdGluZ09uQ3JlYXRlID0gdGhpcy53YWl0aW5nT25DcmVhdGU7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdXBkYXRlciA9IHVwZGF0ZXJzV2l0aEF0dHJpYnV0ZXNbaV07XG4gICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdlb21ldHJ5LmdldCh1cGRhdGVyLmlkKTtcbiAgICAgIFxuICAgICAgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcy5nZXQoaW5zdGFuY2UuaWQuaWQpO1xuICAgICAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoaW5zdGFuY2UuaWQpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMuc2V0KGluc3RhbmNlLmlkLmlkLCBhdHRyaWJ1dGVzKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCF1cGRhdGVyLmZpbGxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgd2FpdGluZ09uQ3JlYXRlKSB7XG4gICAgICAgIHZhciBjb2xvclByb3BlcnR5ID0gdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5jb2xvcjtcbiAgICAgICAgdmFyIHJlc3VsdENvbG9yID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoY29sb3JQcm9wZXJ0eSwgdGltZSwgQ29sb3IuV0hJVEUsIGNvbG9yU2NyYXRjaCk7XG4gICAgICAgIGlmICghQ29sb3IuZXF1YWxzKGF0dHJpYnV0ZXMuX2xhc3RDb2xvciwgcmVzdWx0Q29sb3IpKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5fbGFzdENvbG9yID0gQ29sb3IuY2xvbmUocmVzdWx0Q29sb3IsIGF0dHJpYnV0ZXMuX2xhc3RDb2xvcik7XG4gICAgICAgICAgYXR0cmlidXRlcy5jb2xvciA9IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLmNvbG9yKTtcbiAgICAgICAgICBpZiAoKHRoaXMudHJhbnNsdWNlbnQgJiYgYXR0cmlidXRlcy5jb2xvclszXSA9PT0gMjU1KSB8fCAoIXRoaXMudHJhbnNsdWNlbnQgJiYgYXR0cmlidXRlcy5jb2xvclszXSAhPT0gMjU1KSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtc1RvUmVtb3ZlW3JlbW92ZWRDb3VudCsrXSA9IHVwZGF0ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChkZWZpbmVkKHRoaXMuZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUpICYmIHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSBpbnN0YW5jZW9mIENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSAmJiAoIXVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8IHdhaXRpbmdPbkNyZWF0ZSkpIHtcbiAgICAgICAgdmFyIGRlcHRoRmFpbENvbG9yUHJvcGVydHkgPSB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuY29sb3I7XG4gICAgICAgIHZhciBkZXB0aENvbG9yID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoZGVwdGhGYWlsQ29sb3JQcm9wZXJ0eSwgdGltZSwgQ29sb3IuV0hJVEUsIGNvbG9yU2NyYXRjaCk7XG4gICAgICAgIGlmICghQ29sb3IuZXF1YWxzKGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvciwgZGVwdGhDb2xvcikpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IgPSBDb2xvci5jbG9uZShkZXB0aENvbG9yLCBhdHRyaWJ1dGVzLl9sYXN0RGVwdGhGYWlsQ29sb3IpO1xuICAgICAgICAgIGF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IgPSBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShkZXB0aENvbG9yLCBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgc2hvdyA9IHVwZGF0ZXIuZW50aXR5LmlzU2hvd2luZyAmJiAodXBkYXRlci5oYXNDb25zdGFudEZpbGwgfHwgdXBkYXRlci5pc0ZpbGxlZCh0aW1lKSk7XG4gICAgICB2YXIgY3VycmVudFNob3cgPSBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDE7XG4gICAgICBpZiAoc2hvdyAhPT0gY3VycmVudFNob3cpIHtcbiAgICAgICAgYXR0cmlidXRlcy5zaG93ID0gU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShzaG93LCBhdHRyaWJ1dGVzLnNob3cpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkgPSB1cGRhdGVyLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5O1xuICAgICAgaWYgKCFQcm9wZXJ0eS5pc0NvbnN0YW50KGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5KSkge1xuICAgICAgICB2YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHksIHRpbWUsIGRlZmF1bHREaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblNjcmF0Y2gpO1xuICAgICAgICBpZiAoIURpc3RhbmNlRGlzcGxheUNvbmRpdGlvbi5lcXVhbHMoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3REaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24uY2xvbmUoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLCBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKTtcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLnVwZGF0ZVNob3dzKHByaW1pdGl2ZSk7XG4gICAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkgJiYgIXByaW1pdGl2ZS5yZWFkeSkge1xuICAgIGlzVXBkYXRlZCA9IGZhbHNlO1xuICB9XG4gIHRoaXMuaXRlbXNUb1JlbW92ZS5sZW5ndGggPSByZW1vdmVkQ291bnQ7XG4gIHJldHVybiBpc1VwZGF0ZWQ7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUudXBkYXRlU2hvd3MgPSBmdW5jdGlvbiAocHJpbWl0aXZlKSB7XG4gIHZhciBzaG93c1VwZGF0ZWQgPSB0aGlzLnNob3dzVXBkYXRlZC52YWx1ZXM7XG4gIHZhciBsZW5ndGggPSBzaG93c1VwZGF0ZWQubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHVwZGF0ZXIgPSBzaG93c1VwZGF0ZWRbaV07XG4gICAgdmFyIGluc3RhbmNlID0gdGhpcy5nZW9tZXRyeS5nZXQodXBkYXRlci5pZCk7XG4gICAgXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcbiAgICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykpIHtcbiAgICAgIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoaW5zdGFuY2UuaWQpO1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XG4gICAgfVxuICAgIFxuICAgIHZhciBzaG93ID0gdXBkYXRlci5lbnRpdHkuaXNTaG93aW5nO1xuICAgIHZhciBjdXJyZW50U2hvdyA9IGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMTtcbiAgICBpZiAoc2hvdyAhPT0gY3VycmVudFNob3cpIHtcbiAgICAgIGF0dHJpYnV0ZXMuc2hvdyA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoc2hvdywgYXR0cmlidXRlcy5zaG93KTtcbiAgICB9XG4gIH1cbiAgdGhpcy5zaG93c1VwZGF0ZWQucmVtb3ZlQWxsKCk7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodXBkYXRlcikge1xuICByZXR1cm4gdGhpcy51cGRhdGVycy5jb250YWlucyh1cGRhdGVyLmlkKTtcbn07XG5cbkJhdGNoLnByb3RvdHlwZS5nZXRCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICh1cGRhdGVyLCByZXN1bHQpIHtcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xuICBpZiAoIXByaW1pdGl2ZS5yZWFkeSkge1xuICAgIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLlBFTkRJTkc7XG4gIH1cbiAgdmFyIGF0dHJpYnV0ZXMgPSBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXModXBkYXRlci5lbnRpdHkpO1xuICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykgfHwgIWRlZmluZWQoYXR0cmlidXRlcy5ib3VuZGluZ1NwaGVyZSkgfHwvL1xuICAgIChkZWZpbmVkKGF0dHJpYnV0ZXMuc2hvdykgJiYgYXR0cmlidXRlcy5zaG93WzBdID09PSAwKSkge1xuICAgIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLkZBSUxFRDtcbiAgfVxuICBhdHRyaWJ1dGVzLmJvdW5kaW5nU3BoZXJlLmNsb25lKHJlc3VsdCk7XG4gIHJldHVybiBCb3VuZGluZ1NwaGVyZVN0YXRlLkRPTkU7XG59O1xuXG5CYXRjaC5wcm90b3R5cGUucmVtb3ZlQWxsUHJpbWl0aXZlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaW1pdGl2ZXMgPSB0aGlzLnByaW1pdGl2ZXM7XG4gIFxuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XG4gIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICAgIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZ2VvbWV0cnkucmVtb3ZlQWxsKCk7XG4gICAgdGhpcy51cGRhdGVycy5yZW1vdmVBbGwoKTtcbiAgfVxuICBcbiAgdmFyIG9sZFByaW1pdGl2ZSA9IHRoaXMub2xkUHJpbWl0aXZlO1xuICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XG4gICAgcHJpbWl0aXZlcy5yZW1vdmUob2xkUHJpbWl0aXZlKTtcbiAgICB0aGlzLm9sZFByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcbiAgfVxufTtcblxuQmF0Y2gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcbiAgdmFyIHByaW1pdGl2ZXMgPSB0aGlzLnByaW1pdGl2ZXM7XG4gIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcbiAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xuICB9XG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcbiAgaWYgKGRlZmluZWQob2xkUHJpbWl0aXZlKSkge1xuICAgIHByaW1pdGl2ZXMucmVtb3ZlKG9sZFByaW1pdGl2ZSk7XG4gIH1cbiAgaWYgKGRlZmluZWQodGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbikpIHtcbiAgICB0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uKCk7XG4gIH1cbn07XG5cblxubGV0IHdhc0ZpeGVkID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MoKSB7XG4gIGlmICh3YXNGaXhlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBDZXNpdW0uU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGltZTogYW55LCB1cGRhdGVyOiBhbnkpIHtcbiAgICB2YXIgaXRlbXM7XG4gICAgdmFyIHRyYW5zbHVjZW50O1xuICAgIHZhciBpbnN0YW5jZSA9IHVwZGF0ZXIuY3JlYXRlRmlsbEdlb21ldHJ5SW5zdGFuY2UodGltZSk7XG4gICAgaWYgKGluc3RhbmNlLmF0dHJpYnV0ZXMuY29sb3IudmFsdWVbM10gPT09IDI1NSkge1xuICAgICAgaXRlbXMgPSB0aGlzLl9zb2xpZEl0ZW1zO1xuICAgICAgdHJhbnNsdWNlbnQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlbXMgPSB0aGlzLl90cmFuc2x1Y2VudEl0ZW1zO1xuICAgICAgdHJhbnNsdWNlbnQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICB2YXIgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XG4gICAgICBpZiAoaXRlbS5pc01hdGVyaWFsKHVwZGF0ZXIpKSB7XG4gICAgICAgIGl0ZW0uYWRkKHVwZGF0ZXIsIGluc3RhbmNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgfVxuICAgIFxuICAgIHZhciBiYXRjaDogYW55ID0gbmV3IEJhdGNoKHRoaXMuX3ByaW1pdGl2ZXMsIHRyYW5zbHVjZW50LCB0aGlzLl9hcHBlYXJhbmNlVHlwZSwgdGhpcy5fZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUsIHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5fY2xvc2VkLCB0aGlzLl9zaGFkb3dzKTtcbiAgICBiYXRjaC5hZGQodXBkYXRlciwgaW5zdGFuY2UpO1xuICAgIGl0ZW1zLnB1c2goYmF0Y2gpO1xuICB9O1xuICB3YXNGaXhlZCA9IHRydWU7XG59XG4iXX0=
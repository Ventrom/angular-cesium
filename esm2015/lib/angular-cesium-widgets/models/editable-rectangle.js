import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { defaultLabelProps } from './label-props';
export class EditableRectangle extends AcEntity {
    constructor(id, pointsLayer, rectangleLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.rectangleLayer = rectangleLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = Object.assign({}, editOptions.pointProps);
        this.rectangleProps = Object.assign({}, editOptions.rectangleProps);
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const positions = this.getRealPositions();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get rectangleProps() {
        return this._rectangleProps;
    }
    set rectangleProps(value) {
        this._rectangleProps = value;
    }
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(point);
        });
    }
    createFromExisting(positions) {
        positions.forEach(position => {
            this.addPointFromExisting(position);
        });
        this.updateRectangleLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after rectangle is created');
        }
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        this.positions = points;
        this.updatePointsLayer(...points);
        this.updateRectangleLayer();
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    addPoint(position) {
        if (this.done) {
            return;
        }
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
        }
    }
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        const lastDraggedCartographic = Cesium.Cartographic.fromCartesian(this.lastDraggedToPosition);
        const draggedToPositionCartographic = Cesium.Cartographic.fromCartesian(draggedToPosition);
        this.getRealPoints().forEach(point => {
            const cartographic = Cesium.Cartographic.fromCartesian(point.getPosition());
            cartographic.longitude += (draggedToPositionCartographic.longitude - lastDraggedCartographic.longitude);
            cartographic.latitude += (draggedToPositionCartographic.latitude - lastDraggedCartographic.latitude);
            point.setPosition(Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0));
        });
        this.updatePointsLayer(...this.positions);
        this.updateRectangleLayer();
        this.lastDraggedToPosition = draggedToPosition;
    }
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.positions.forEach(point => this.updatePointsLayer(point));
        this.updateRectangleLayer();
    }
    endMovePoint() {
        this.updatePointsLayer(...this.positions);
    }
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
    }
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    getRealPositions() {
        return this.getRealPoints().map(position => position.getPosition());
    }
    getRealPositionsCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    }
    getRealPoints() {
        return this.positions.filter(position => !position.isVirtualEditPoint());
    }
    getPositions() {
        return this.positions.map(position => position.getPosition());
    }
    getRectangle() {
        const cartographics = this.getPositions().map(cartesian => Cesium.Cartographic.fromCartesian(cartesian));
        const longitudes = cartographics.map(position => position.longitude);
        const latitudes = cartographics.map(position => position.latitude);
        return new Cesium.Rectangle(Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes));
    }
    getRectangleCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRectangle.bind(this), false);
    }
    removePosition(point) {
        const index = this.positions.findIndex(p => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePointsLayer(...point) {
        point.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    updateRectangleLayer() {
        this.rectangleLayer.update(this, this.id);
    }
    dispose() {
        this.rectangleLayer.remove(this.id);
        this.positions.forEach(editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcmVjdGFuZ2xlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9tb2RlbHMvZWRpdGFibGUtcmVjdGFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBUXpDLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLGVBQWUsQ0FBQztBQUU5RCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsUUFBUTtJQVU3QyxZQUNVLEVBQVUsRUFDVixXQUE2QixFQUM3QixjQUFnQyxFQUNoQyxtQkFBd0MsRUFDaEQsV0FBaUMsRUFDakMsU0FBd0I7UUFFeEIsS0FBSyxFQUFFLENBQUM7UUFQQSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBYjFDLGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVdqQyxJQUFJLENBQUMsaUJBQWlCLHFCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxxQkFBTyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxTQUFTLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkY7SUFDSCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFvQjtRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztZQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxjQUFjLENBQUMsS0FBcUI7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLGlCQUFpQixDQUFDLEtBQWlCO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBYztRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsU0FBdUI7UUFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQW1CLEVBQUUsV0FBb0I7UUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7U0FDbEY7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELG9CQUFvQixDQUFDLFFBQW9CO1FBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQW9CO1FBQzNCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU87U0FDUjtRQUNELE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDNUMsSUFBSSxZQUFZLEVBQUU7WUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFFTCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsU0FBUyxDQUFDLFVBQXNCLEVBQUUsU0FBb0I7UUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQ25DLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxtQkFBK0IsRUFBRSxpQkFBNkI7UUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUMvQixJQUFJLENBQUMscUJBQXFCLEdBQUcsbUJBQW1CLENBQUM7U0FDbEQ7UUFFRCxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25DLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLEdBQUcsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEcsWUFBWSxDQUFDLFFBQVEsSUFBSSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQztJQUNqRCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsVUFBc0I7UUFDeEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsYUFBd0I7UUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBb0I7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7UUFDNUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxnQ0FBZ0M7UUFDOUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsWUFBWTtRQUNWLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckUsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRSxPQUFPLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsRUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVELDRCQUE0QjtRQUMxQixPQUFPLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTyxjQUFjLENBQUMsS0FBZ0I7UUFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDekQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxHQUFHLEtBQWtCO1FBQzdDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL3JlY3RhbmdsZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRWRpdE9wdGlvbnMsIFJlY3RhbmdsZVByb3BzIH0gZnJvbSAnLi9yZWN0YW5nbGUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0TGFiZWxQcm9wcywgTGFiZWxQcm9wcyB9IGZyb20gJy4vbGFiZWwtcHJvcHMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdGFibGVSZWN0YW5nbGUgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIG1vdmluZ1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgZG9uZSA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfZGVmYXVsdFBvaW50UHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX3JlY3RhbmdsZVByb3BzOiBSZWN0YW5nbGVQcm9wcztcbiAgcHJpdmF0ZSBsYXN0RHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSByZWN0YW5nbGVMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgZWRpdE9wdGlvbnM6IFJlY3RhbmdsZUVkaXRPcHRpb25zLFxuICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXVxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMgPSB7Li4uZWRpdE9wdGlvbnMucG9pbnRQcm9wc307XG4gICAgdGhpcy5yZWN0YW5nbGVQcm9wcyA9IHsuLi5lZGl0T3B0aW9ucy5yZWN0YW5nbGVQcm9wc307XG4gICAgaWYgKHBvc2l0aW9ucyAmJiBwb3NpdGlvbnMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY3RhbmdsZSBjb25zaXN0IG9mIDIgcG9pbnRzIGJ1dCBwcm92aWRlZCAnICsgcG9zaXRpb25zLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcmVjdGFuZ2xlUHJvcHMoKTogUmVjdGFuZ2xlUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9yZWN0YW5nbGVQcm9wcztcbiAgfVxuXG4gIHNldCByZWN0YW5nbGVQcm9wcyh2YWx1ZTogUmVjdGFuZ2xlUHJvcHMpIHtcbiAgICB0aGlzLl9yZWN0YW5nbGVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBkZWZhdWx0UG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihwb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSkge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICB9XG5cbiAgc2V0UG9pbnRzTWFudWFsbHkocG9pbnRzOiBFZGl0UG9pbnRbXSwgd2lkdGhNZXRlcnM/OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcGRhdGUgbWFudWFsbHkgb25seSBpbiBlZGl0IG1vZGUsIGFmdGVyIHJlY3RhbmdsZSBpcyBjcmVhdGVkJyk7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwLmdldElkKCkpKTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IHBvaW50cztcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnBvaW50cyk7XG4gICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xuICB9XG5cbiAgYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobmV3UG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIobmV3UG9pbnQpO1xuICB9XG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9ICF0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgaWYgKGlzRmlyc3RQb2ludCkge1xuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChmaXJzdFBvaW50KTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCh0aGlzLm1vdmluZ1BvaW50KTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmlyc3RQb2ludCk7XG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgICB0aGlzLnVwZGF0ZVJlY3RhbmdsZUxheWVyKCk7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgaWYgKCFlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVTaGFwZShzdGFydE1vdmluZ1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBkcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0RHJhZ2dlZENhcnRvZ3JhcGhpYyA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbih0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbik7XG4gICAgY29uc3QgZHJhZ2dlZFRvUG9zaXRpb25DYXJ0b2dyYXBoaWMgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oZHJhZ2dlZFRvUG9zaXRpb24pO1xuICAgIHRoaXMuZ2V0UmVhbFBvaW50cygpLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29uc3QgY2FydG9ncmFwaGljID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHBvaW50LmdldFBvc2l0aW9uKCkpO1xuICAgICAgY2FydG9ncmFwaGljLmxvbmdpdHVkZSArPSAoZHJhZ2dlZFRvUG9zaXRpb25DYXJ0b2dyYXBoaWMubG9uZ2l0dWRlIC0gbGFzdERyYWdnZWRDYXJ0b2dyYXBoaWMubG9uZ2l0dWRlKTtcbiAgICAgIGNhcnRvZ3JhcGhpYy5sYXRpdHVkZSArPSAoZHJhZ2dlZFRvUG9zaXRpb25DYXJ0b2dyYXBoaWMubGF0aXR1ZGUgLSBsYXN0RHJhZ2dlZENhcnRvZ3JhcGhpYy5sYXRpdHVkZSk7XG4gICAgICBwb2ludC5zZXRQb3NpdGlvbihDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhjYXJ0b2dyYXBoaWMubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMubGF0aXR1ZGUsIDApKTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdnZWRUb1Bvc2l0aW9uO1xuICB9XG5cbiAgZW5kTW92ZVNoYXBlKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4gdGhpcy51cGRhdGVQb2ludHNMYXllcihwb2ludCkpO1xuICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcbiAgfVxuXG4gIGVuZE1vdmVQb2ludCgpIHtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgfVxuXG4gIG1vdmVUZW1wTW92aW5nUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLm1vdmVQb2ludCh0b1Bvc2l0aW9uLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVQb2ludChwb2ludFRvUmVtb3ZlOiBFZGl0UG9pbnQpIHtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHBvaW50VG9SZW1vdmUpO1xuICAgIHRoaXMucG9zaXRpb25zLmZpbHRlcihwID0+IHAuaXNWaXJ0dWFsRWRpdFBvaW50KCkpLmZvckVhY2gocCA9PiB0aGlzLnJlbW92ZVBvc2l0aW9uKHApKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgdGhpcy5yZW1vdmVQb3NpdGlvbih0aGlzLm1vdmluZ1BvaW50KTsgLy8gcmVtb3ZlIG1vdmluZ1BvaW50XG4gICAgdGhpcy5tb3ZpbmdQb2ludCA9IG51bGw7XG4gIH1cblxuICBnZXRSZWFsUG9zaXRpb25zKCk6IENhcnRlc2lhbjNbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVhbFBvaW50cygpLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRSZWFsUG9zaXRpb25zLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIGdldFJlYWxQb2ludHMoKTogRWRpdFBvaW50W10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocG9zaXRpb24gPT4gIXBvc2l0aW9uLmlzVmlydHVhbEVkaXRQb2ludCgpKTtcbiAgfVxuXG4gIGdldFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWN0YW5nbGUoKTogUmVjdGFuZ2xlIHtcbiAgICBjb25zdCBjYXJ0b2dyYXBoaWNzID0gdGhpcy5nZXRQb3NpdGlvbnMoKS5tYXAoY2FydGVzaWFuID0+IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjYXJ0ZXNpYW4pKTtcbiAgICBjb25zdCBsb25naXR1ZGVzID0gY2FydG9ncmFwaGljcy5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24ubG9uZ2l0dWRlKTtcbiAgICBjb25zdCBsYXRpdHVkZXMgPSBjYXJ0b2dyYXBoaWNzLm1hcChwb3NpdGlvbiA9PiAgcG9zaXRpb24ubGF0aXR1ZGUpO1xuXG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uUmVjdGFuZ2xlKFxuICAgICAgTWF0aC5taW4oLi4ubG9uZ2l0dWRlcyksXG4gICAgICBNYXRoLm1pbiguLi5sYXRpdHVkZXMpLFxuICAgICAgTWF0aC5tYXgoLi4ubG9uZ2l0dWRlcyksXG4gICAgICBNYXRoLm1heCguLi5sYXRpdHVkZXMpXG4gICAgKTtcbiAgfVxuXG4gIGdldFJlY3RhbmdsZUNhbGxiYWNrUHJvcGVydHkoKTogUmVjdGFuZ2xlIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UmVjdGFuZ2xlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlUG9zaXRpb24ocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wb3NpdGlvbnMuZmluZEluZGV4KHAgPT4gcCA9PT0gcG9pbnQpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIoLi4ucG9pbnQ6IEVkaXRQb2ludFtdKSB7XG4gICAgcG9pbnQuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHAsIHAuZ2V0SWQoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZWN0YW5nbGVMYXllcigpIHtcbiAgICB0aGlzLnJlY3RhbmdsZUxheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5yZWN0YW5nbGVMYXllci5yZW1vdmUodGhpcy5pZCk7XG5cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKGVkaXRQb2ludCA9PiB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMubW92aW5nUG9pbnQuZ2V0SWQoKSk7XG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgZ2V0UG9pbnRzQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cbn1cblxuIl19
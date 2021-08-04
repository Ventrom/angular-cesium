import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { defaultLabelProps } from './label-props';
export class EditablePoint extends AcEntity {
    constructor(id, pointLayer, coordinateConverter, editOptions, position) {
        super();
        this.id = id;
        this.pointLayer = pointLayer;
        this.coordinateConverter = coordinateConverter;
        this.editOptions = editOptions;
        this._enableEdit = true;
        this._labels = [];
        this._props = Object.assign({}, editOptions.pointProps);
        if (position) {
            this.createFromExisting(position);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const position = this.point.getPosition();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = position;
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get props() {
        return this._props;
    }
    set props(value) {
        this._props = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        if (value) {
            this.point.props.color = Cesium.Color.WHITE;
        }
        else {
            this.point.props.color = Cesium.Color.DIMGREY;
            this.point.props.pixelSize = 10;
        }
        this.updatePointLayer();
    }
    createFromExisting(position) {
        this.point = new EditPoint(this.id, position, this._props);
        this.updatePointLayer();
    }
    hasPosition(point) {
        if (point.position) {
            return true;
        }
        return false;
    }
    setManually(point, props) {
        if (!this.enableEdit) {
            throw new Error('Update manually only in edit mode, after point is created');
        }
        let newProps = props;
        if (this.hasPosition(point)) {
            newProps = point.pointProp ? point.pointProp : props;
            this.point.setPosition(point.position);
        }
        else {
            this.point.setPosition(point);
        }
        this.point.props = newProps;
        this.updatePointLayer();
    }
    addLastPoint(position) {
        this.point.setPosition(position);
        this.updatePointLayer();
    }
    movePoint(toPosition) {
        if (!this.point) {
            this.point = new EditPoint(this.id, toPosition, this._props);
        }
        else {
            this.point.setPosition(toPosition);
        }
        this.updatePointLayer();
    }
    getCurrentPoint() {
        return this.point;
    }
    getPosition() {
        return this.point.getPosition();
    }
    getPositionCallbackProperty() {
        return new Cesium.CallbackProperty(this.getPosition.bind(this), false);
    }
    updatePointLayer() {
        this.pointLayer.update(this.point, this.point.getId());
    }
    update() {
        this.updatePointLayer();
    }
    dispose() {
        this.pointLayer.remove(this.point.getId());
    }
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLXBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUdqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLGVBQWUsQ0FBQztBQVE5RCxNQUFNLE9BQU8sYUFBYyxTQUFRLFFBQVE7SUFNekMsWUFBb0IsRUFBVSxFQUNWLFVBQTRCLEVBQzVCLG1CQUF3QyxFQUN4QyxXQUE2QixFQUNyQyxRQUFxQjtRQUMvQixLQUFLLEVBQUUsQ0FBQztRQUxVLE9BQUUsR0FBRixFQUFFLENBQVE7UUFDVixlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUM1Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQVB6QyxnQkFBVyxHQUFHLElBQUksQ0FBQztRQUVuQixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVFqQyxJQUFJLENBQUMsTUFBTSxxQkFBTyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFvQjtRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVB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RUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUQ7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELDJCQUEyQjtRQUN6QixPQUFPLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IFBvaW50RWRpdE9wdGlvbnMsIFBvaW50UHJvcHMgfSBmcm9tICcuL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5cbmludGVyZmFjZSBQb3NpdGlvbldpdGhQb2ludFByb3BzIHtcbiAgcG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHBvaW50UHJvcD86IFBvaW50UHJvcHM7XG59XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBvaW50IGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIHBvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9wcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9pbnRMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGVkaXRPcHRpb25zOiBQb2ludEVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICBwb3NpdGlvbj86IENhcnRlc2lhbjMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3Byb3BzID0gey4uLmVkaXRPcHRpb25zLnBvaW50UHJvcHN9O1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpcy5jcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb2ludC5nZXRQb3NpdGlvbigpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3BzO1xuICB9XG5cbiAgc2V0IHByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fcHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLmNvbG9yID0gQ2VzaXVtLkNvbG9yLldISVRFO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLmNvbG9yID0gQ2VzaXVtLkNvbG9yLkRJTUdSRVk7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLnBpeGVsU2l6ZSA9IDEwO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuX3Byb3BzKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFzUG9zaXRpb24ocG9pbnQ6IFBvc2l0aW9uV2l0aFBvaW50UHJvcHMgfCBDYXJ0ZXNpYW4zKTogcG9pbnQgaXMgUG9zaXRpb25XaXRoUG9pbnRQcm9wcyB7XG4gICAgaWYgKChwb2ludCBhcyBQb3NpdGlvbldpdGhQb2ludFByb3BzKS5wb3NpdGlvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KHBvaW50OiBQb3NpdGlvbldpdGhQb2ludFByb3BzIHwgQ2FydGVzaWFuMywgcHJvcHM/OiBQb2ludFByb3BzKSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZUVkaXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXBkYXRlIG1hbnVhbGx5IG9ubHkgaW4gZWRpdCBtb2RlLCBhZnRlciBwb2ludCBpcyBjcmVhdGVkJyk7XG4gICAgfVxuICAgIGxldCBuZXdQcm9wcyA9IHByb3BzO1xuICAgIGlmICh0aGlzLmhhc1Bvc2l0aW9uKHBvaW50KSkge1xuICAgICAgbmV3UHJvcHMgPSBwb2ludC5wb2ludFByb3AgPyBwb2ludC5wb2ludFByb3AgOiBwcm9wcztcbiAgICAgIHRoaXMucG9pbnQuc2V0UG9zaXRpb24ocG9pbnQucG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnNldFBvc2l0aW9uKHBvaW50KTtcbiAgICB9XG4gICAgdGhpcy5wb2ludC5wcm9wcyA9IG5ld1Byb3BzO1xuICAgIHRoaXMudXBkYXRlUG9pbnRMYXllcigpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb2ludC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBtb3ZlUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5wb2ludCkge1xuICAgICAgdGhpcy5wb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgdG9Qb3NpdGlvbiwgdGhpcy5fcHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRQb2ludCgpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLnBvaW50O1xuICB9XG5cbiAgZ2V0UG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIGdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UG9zaXRpb24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludExheWVyKCkge1xuICAgIHRoaXMucG9pbnRMYXllci51cGRhdGUodGhpcy5wb2ludCwgdGhpcy5wb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wb2ludExheWVyLnJlbW92ZSh0aGlzLnBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cbn1cbiJdfQ==
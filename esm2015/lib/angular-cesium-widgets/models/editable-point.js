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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9pbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1wb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFHakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFROUQsTUFBTSxPQUFPLGFBQWMsU0FBUSxRQUFRO0lBTXpDLFlBQW9CLEVBQVUsRUFDVixVQUE0QixFQUM1QixtQkFBd0MsRUFDeEMsV0FBNkIsRUFDckMsUUFBcUI7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFMVSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFQekMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFRakMsSUFBSSxDQUFDLE1BQU0scUJBQU8sV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFDLElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsTUFBb0I7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU87U0FDUjtRQUNELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzthQUMzQjtZQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFpQjtRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLFVBQVUsQ0FBQyxLQUFjO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQzdDO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNqQztRQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxRQUFvQjtRQUM3QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQTBDO1FBQzVELElBQUssS0FBZ0MsQ0FBQyxRQUFRLEVBQUU7WUFDOUMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUEwQyxFQUFFLEtBQWtCO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDeEM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBb0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQVMsQ0FBQyxVQUFzQjtRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlEO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU8sZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBQb2ludEVkaXRPcHRpb25zLCBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2ludC1lZGl0LW9wdGlvbnMnO1xuXG5pbnRlcmZhY2UgUG9zaXRpb25XaXRoUG9pbnRQcm9wcyB7XG4gIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwb2ludFByb3A/OiBQb2ludFByb3BzO1xufVxuXG5leHBvcnQgY2xhc3MgRWRpdGFibGVQb2ludCBleHRlbmRzIEFjRW50aXR5IHtcbiAgcHJpdmF0ZSBwb2ludDogRWRpdFBvaW50O1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfcHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIHBvaW50TGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlZGl0T3B0aW9uczogUG9pbnRFZGl0T3B0aW9ucyxcbiAgICAgICAgICAgICAgcG9zaXRpb24/OiBDYXJ0ZXNpYW4zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wcm9wcyA9IHsuLi5lZGl0T3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbGFiZWxzKCk6IExhYmVsUHJvcHNbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVscztcbiAgfVxuXG4gIHNldCBsYWJlbHMobGFiZWxzOiBMYWJlbFByb3BzW10pIHtcbiAgICBpZiAoIWxhYmVscykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgICB0aGlzLl9sYWJlbHMgPSBsYWJlbHMubWFwKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghbGFiZWwucG9zaXRpb24pIHtcbiAgICAgICAgbGFiZWwucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX3Byb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5wb2ludC5wcm9wcy5jb2xvciA9IENlc2l1bS5Db2xvci5XSElURTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludC5wcm9wcy5jb2xvciA9IENlc2l1bS5Db2xvci5ESU1HUkVZO1xuICAgICAgdGhpcy5wb2ludC5wcm9wcy5waXhlbFNpemUgPSAxMDtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMucG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLl9wcm9wcyk7XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBwcml2YXRlIGhhc1Bvc2l0aW9uKHBvaW50OiBQb3NpdGlvbldpdGhQb2ludFByb3BzIHwgQ2FydGVzaWFuMyk6IHBvaW50IGlzIFBvc2l0aW9uV2l0aFBvaW50UHJvcHMge1xuICAgIGlmICgocG9pbnQgYXMgUG9zaXRpb25XaXRoUG9pbnRQcm9wcykucG9zaXRpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzZXRNYW51YWxseShwb2ludDogUG9zaXRpb25XaXRoUG9pbnRQcm9wcyB8IENhcnRlc2lhbjMsIHByb3BzPzogUG9pbnRQcm9wcykge1xuICAgIGlmICghdGhpcy5lbmFibGVFZGl0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcG9pbnQgaXMgY3JlYXRlZCcpO1xuICAgIH1cbiAgICBsZXQgbmV3UHJvcHMgPSBwcm9wcztcbiAgICBpZiAodGhpcy5oYXNQb3NpdGlvbihwb2ludCkpIHtcbiAgICAgIG5ld1Byb3BzID0gcG9pbnQucG9pbnRQcm9wID8gcG9pbnQucG9pbnRQcm9wIDogcHJvcHM7XG4gICAgICB0aGlzLnBvaW50LnNldFBvc2l0aW9uKHBvaW50LnBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludC5zZXRQb3NpdGlvbihwb2ludCk7XG4gICAgfVxuICAgIHRoaXMucG9pbnQucHJvcHMgPSBuZXdQcm9wcztcbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMucG9pbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMudXBkYXRlUG9pbnRMYXllcigpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMucG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHRvUG9zaXRpb24sIHRoaXMuX3Byb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBnZXRDdXJyZW50UG9pbnQoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5wb2ludDtcbiAgfVxuXG4gIGdldFBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLnBvaW50LmdldFBvc2l0aW9uKCk7XG4gIH1cblxuICBnZXRQb3NpdGlvbkNhbGxiYWNrUHJvcGVydHkoKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldFBvc2l0aW9uLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRMYXllcigpIHtcbiAgICB0aGlzLnBvaW50TGF5ZXIudXBkYXRlKHRoaXMucG9pbnQsIHRoaXMucG9pbnQuZ2V0SWQoKSk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucG9pbnRMYXllci5yZW1vdmUodGhpcy5wb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=
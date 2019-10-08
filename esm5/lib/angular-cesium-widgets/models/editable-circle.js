/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { EditArc } from './edit-arc';
import { defaultLabelProps } from './label-props';
var EditableCircle = /** @class */ (function (_super) {
    tslib_1.__extends(EditableCircle, _super);
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
export { EditableCircle };
if (false) {
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._center;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._radiusPoint;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._outlineArc;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.doneCreation;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._circleProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._pointProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._polylineProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.circlesLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.arcsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtY2lyY2xlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9tb2RlbHMvZWRpdGFibGUtY2lyY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHckMsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRzlEO0lBQW9DLDBDQUFRO0lBWTFDLHdCQUNVLEVBQVUsRUFDVixZQUE4QixFQUM5QixXQUE2QixFQUM3QixTQUEyQixFQUMzQixPQUEwQjtRQUxwQyxZQU9FLGlCQUFPLFNBSVI7UUFWUyxRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1Ysa0JBQVksR0FBWixZQUFZLENBQWtCO1FBQzlCLGlCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixlQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFPLEdBQVAsT0FBTyxDQUFtQjtRQWI1QixrQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBVyxHQUFHLElBQUksQ0FBQztRQUtuQixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVVqQyxLQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDeEMsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3RDLEtBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7SUFDOUMsQ0FBQztJQUVELHNCQUFJLGtDQUFNOzs7O1FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFP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QUMsQ0FBQztJQUNsSCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBaFFELENBQW9DLFFBQVEsR0FnUTNDOzs7Ozs7O0lBL1BDLGlDQUEyQjs7Ozs7SUFDM0Isc0NBQWdDOzs7OztJQUNoQyxxQ0FBNkI7Ozs7O0lBQzdCLHNDQUE2Qjs7Ozs7SUFDN0IscUNBQTJCOzs7OztJQUMzQiwrQ0FBbUM7Ozs7O0lBQ25DLHNDQUFtQzs7Ozs7SUFDbkMscUNBQWdDOzs7OztJQUNoQyx3Q0FBc0M7Ozs7O0lBQ3RDLGlDQUFtQzs7Ozs7SUFHakMsNEJBQWtCOzs7OztJQUNsQixzQ0FBc0M7Ozs7O0lBQ3RDLHFDQUFxQzs7Ozs7SUFDckMsbUNBQW1DOzs7OztJQUNuQyxpQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRBcmMgfSBmcm9tICcuL2VkaXQtYXJjJztcbmltcG9ydCB7IENpcmNsZUVkaXRPcHRpb25zIH0gZnJvbSAnLi9jaXJjbGUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0TGFiZWxQcm9wcywgTGFiZWxQcm9wcyB9IGZyb20gJy4vbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZUNpcmNsZSBleHRlbmRzIEFjRW50aXR5IHtcbiAgcHJpdmF0ZSBfY2VudGVyOiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX3JhZGl1c1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX291dGxpbmVBcmM6IEVkaXRBcmM7XG4gIHByaXZhdGUgZG9uZUNyZWF0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogYW55O1xuICBwcml2YXRlIF9jaXJjbGVQcm9wczogRWxsaXBzZVByb3BzO1xuICBwcml2YXRlIF9wb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9wb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaWQ6IHN0cmluZyxcbiAgICBwcml2YXRlIGNpcmNsZXNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIHBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgYXJjc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgb3B0aW9uczogQ2lyY2xlRWRpdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY2lyY2xlUHJvcHMgPSBvcHRpb25zLmNpcmNsZVByb3BzO1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSBvcHRpb25zLnBvaW50UHJvcHM7XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IG9wdGlvbnMucG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzIHx8ICF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBpZiAoaW5kZXggIT09IGxhYmVscy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbGFiZWwucG9zaXRpb24gPSB0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHRoaXMuX3JhZGl1c1BvaW50LmdldFBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcG9seWxpbmVQcm9wcygpOiBQb2x5bGluZVByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIHNldCBwb2x5bGluZVByb3BzKHZhbHVlOiBQb2x5bGluZVByb3BzKSB7XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBvaW50UHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvaW50UHJvcHM7XG4gIH1cblxuICBzZXQgcG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjaXJjbGVQcm9wcygpOiBFbGxpcHNlUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9jaXJjbGVQcm9wcztcbiAgfVxuXG4gIHNldCBjaXJjbGVQcm9wcyh2YWx1ZTogRWxsaXBzZVByb3BzKSB7XG4gICAgdGhpcy5fY2lyY2xlUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICB9XG5cbiAgZ2V0IHJhZGl1c1BvaW50KCk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuX3JhZGl1c1BvaW50O1xuICB9XG5cbiAgZ2V0IGVuYWJsZUVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZUVkaXQ7XG4gIH1cblxuICBzZXQgZW5hYmxlRWRpdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZUVkaXQgPSB2YWx1ZTtcbiAgICB0aGlzLl9jZW50ZXIuc2hvdyA9IHZhbHVlO1xuICAgIHRoaXMuX3JhZGl1c1BvaW50LnNob3cgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gIH1cblxuICBzZXRNYW51YWxseShcbiAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgcmFkaXVzUG9pbnQ6IENhcnRlc2lhbjMsXG4gICAgY2VudGVyUG9pbnRQcm9wID0gdGhpcy5wb2ludFByb3BzLFxuICAgIHJhZGl1c1BvaW50UHJvcCA9IHRoaXMucG9pbnRQcm9wcyxcbiAgICBjaXJjbGVQcm9wID0gdGhpcy5jaXJjbGVQcm9wcyxcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgY2VudGVyLCBjZW50ZXJQb2ludFByb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jZW50ZXIuc2V0UG9zaXRpb24oY2VudGVyKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLl9yYWRpdXNQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcmFkaXVzUG9pbnQsIHJhZGl1c1BvaW50UHJvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JhZGl1c1BvaW50LnNldFBvc2l0aW9uKHJhZGl1c1BvaW50KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX291dGxpbmVBcmMpIHtcbiAgICAgIHRoaXMuY3JlYXRlT3V0bGluZUFyYygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vdXRsaW5lQXJjLnJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jaXJjbGVQcm9wcyA9IGNpcmNsZVByb3A7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlQXJjc0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlQ2lyY2xlc0xheWVyKCk7XG4gIH1cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLl9jZW50ZXIgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLnBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5fcmFkaXVzUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMucG9pbnRQcm9wcyk7XG4gICAgICBpZiAoIXRoaXMuX291dGxpbmVBcmMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPdXRsaW5lQXJjKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbiB8fCAhdGhpcy5fY2VudGVyIHx8ICF0aGlzLl9yYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3JhZGl1c1BvaW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG5cbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmFkaXVzUG9pbnQuc2V0UG9zaXRpb24odG9Qb3NpdGlvbik7XG4gICAgdGhpcy5fb3V0bGluZUFyYy5yYWRpdXMgPSB0aGlzLmdldFJhZGl1cygpO1xuXG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVDaXJjbGUoZHJhZ1N0YXJ0UG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdFbmRQb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnU3RhcnRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIGNvbnN0IGRlbHRhID0gR2VvVXRpbHNTZXJ2aWNlLmdldFBvc2l0aW9uc0RlbHRhKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uLCBkcmFnRW5kUG9zaXRpb24pO1xuICAgIEdlb1V0aWxzU2VydmljZS5hZGREZWx0YVRvUG9zaXRpb24odGhpcy5nZXRDZW50ZXIoKSwgZGVsdGEsIHRydWUpO1xuICAgIHRoaXMucmFkaXVzUG9pbnQuc2V0UG9zaXRpb24oR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmdldENlbnRlcigpLCByYWRpdXMsIE1hdGguUEkgLyAyLCB0cnVlKSk7XG4gICAgdGhpcy5fb3V0bGluZUFyYy5yYWRpdXMgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIHRoaXMudXBkYXRlQXJjc0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlQ2lyY2xlc0xheWVyKCk7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnRW5kUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlUG9seWdvbigpIHtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldFJhZGl1cygpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fY2VudGVyIHx8ICF0aGlzLl9yYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBHZW9VdGlsc1NlcnZpY2UuZGlzdGFuY2UodGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCksIHRoaXMuX3JhZGl1c1BvaW50LmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UmFkaXVzLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIGdldENlbnRlcigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyID8gdGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRDZW50ZXJDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRDZW50ZXIuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0UmFkaXVzUG9pbnQoKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX3JhZGl1c1BvaW50ID8gdGhpcy5fcmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5fY2VudGVyLmdldElkKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9yYWRpdXNQb2ludCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5fcmFkaXVzUG9pbnQuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX291dGxpbmVBcmMpIHtcbiAgICAgIHRoaXMuYXJjc0xheWVyLnJlbW92ZSh0aGlzLl9vdXRsaW5lQXJjLmdldElkKCkpO1xuICAgIH1cblxuICAgIHRoaXMuY2lyY2xlc0xheWVyLnJlbW92ZSh0aGlzLmlkKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDaXJjbGVzTGF5ZXIoKSB7XG4gICAgdGhpcy5jaXJjbGVzTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHNMYXllcigpIHtcbiAgICBpZiAodGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZSh0aGlzLl9jZW50ZXIsIHRoaXMuX2NlbnRlci5nZXRJZCgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZSh0aGlzLl9yYWRpdXNQb2ludCwgdGhpcy5fcmFkaXVzUG9pbnQuZ2V0SWQoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmNzTGF5ZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9vdXRsaW5lQXJjKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYXJjc0xheWVyLnVwZGF0ZSh0aGlzLl9vdXRsaW5lQXJjLCB0aGlzLl9vdXRsaW5lQXJjLmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPdXRsaW5lQXJjKCkge1xuICAgIGlmICghdGhpcy5fY2VudGVyIHx8ICF0aGlzLl9yYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9vdXRsaW5lQXJjID0gbmV3IEVkaXRBcmModGhpcy5pZCwgdGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5nZXRSYWRpdXMoKSwgTWF0aC5QSSAqIDIsIDAsIHRoaXMucG9seWxpbmVQcm9wcyk7XG4gIH1cbn1cbiJdfQ==
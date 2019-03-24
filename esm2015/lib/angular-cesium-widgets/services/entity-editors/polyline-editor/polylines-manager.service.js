/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditablePolyline } from '../../../models/editable-polyline';
export class PolylinesManagerService {
    constructor() {
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
    createEditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        /** @type {?} */
        const editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this.polylines.get(id);
    }
    /**
     * @return {?}
     */
    clear() {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        polyline => polyline.dispose()));
        this.polylines.clear();
    }
}
PolylinesManagerService.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    PolylinesManagerService.prototype.polylines;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmVzLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWxpbmUtZWRpdG9yL3BvbHlsaW5lcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHckUsTUFBTSxPQUFPLHVCQUF1QjtJQURwQztRQUVFLGNBQVMsR0FBa0MsSUFBSSxHQUFHLEVBQTRCLENBQUM7SUF1QmpGLENBQUM7Ozs7Ozs7Ozs7SUFyQkMsc0JBQXNCLENBQUMsRUFBVSxFQUFFLGtCQUFvQyxFQUFFLGVBQWlDLEVBQ25GLG1CQUF3QyxFQUFFLGVBQW9DLEVBQUUsU0FBd0I7O2NBQ3ZILGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQzNDLEVBQUUsRUFDRixrQkFBa0IsRUFDbEIsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixlQUFlLEVBQ2YsU0FBUyxDQUFDO1FBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUN0QyxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7OztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Ozs7UUFBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQzs7O1lBeEJGLFVBQVU7Ozs7SUFFVCw0Q0FBK0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi8uLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG9seWdvbi1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgRWRpdGFibGVQb2x5bGluZSB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lZGl0YWJsZS1wb2x5bGluZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5bGluZXNNYW5hZ2VyU2VydmljZSB7XG4gIHBvbHlsaW5lczogTWFwPHN0cmluZywgRWRpdGFibGVQb2x5bGluZT4gPSBuZXcgTWFwPHN0cmluZywgRWRpdGFibGVQb2x5bGluZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZVBvbHlsaW5lKGlkOiBzdHJpbmcsIGVkaXRQb2x5bGluZXNMYXllcjogQWNMYXllckNvbXBvbmVudCwgZWRpdFBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsIHBvbHlsaW5lT3B0aW9ucz86IFBvbHlnb25FZGl0T3B0aW9ucywgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdKSB7XG4gICAgY29uc3QgZWRpdGFibGVQb2x5bGluZSA9IG5ldyBFZGl0YWJsZVBvbHlsaW5lKFxuICAgICAgaWQsXG4gICAgICBlZGl0UG9seWxpbmVzTGF5ZXIsXG4gICAgICBlZGl0UG9pbnRzTGF5ZXIsXG4gICAgICBjb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgcG9seWxpbmVPcHRpb25zLFxuICAgICAgcG9zaXRpb25zKTtcbiAgICB0aGlzLnBvbHlsaW5lcy5zZXQoaWQsIGVkaXRhYmxlUG9seWxpbmVcbiAgICApO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiBFZGl0YWJsZVBvbHlsaW5lIHtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9seWxpbmVzLmZvckVhY2gocG9seWxpbmUgPT4gcG9seWxpbmUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLnBvbHlsaW5lcy5jbGVhcigpO1xuICB9XG59XG4iXX0=
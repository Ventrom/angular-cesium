import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditActions } from '../../models/edit-actions.enum';
import { EditModes } from '../../models/edit-mode.enum';
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';
/**
 *
 * Range and bearing component that is used to draw range and bearing on the map.
 * The inputs are used to customize the range and bearing style and behavior.
 * Create component reference and use the `create()` function to start creating R&B on the map.
 * The function receives an optional RangeAndBearingOptions object that defines the created range and bearing style and behavior
 * (on top of the default and global definitions).
 *
 * Usage:
 *
 * my-component.ts:
 *
 * ```
 * \@ViewChild('rangeAndBearing', {static: false}) private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
 *  // ...
 * this.rangeAndBearing.create({style: { pointProps: { pixelSize: 12 } }, bearingLabelsStyle: { fillColor: Cesium.Color.GREEN } });
 * ```
 *
 * my-component.html
 * ```
 * <range-and-bearing #rangeAndBearing></range-and-bearing> // Optional inputs defines global style and behavior.
 * ```
 *
 */
let RangeAndBearingComponent = class RangeAndBearingComponent {
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        const rnb = this.polylineEditor.create(Object.assign(Object.assign({ allowDrag: false, pointProps: {
                showVirtual: false,
                pixelSize: 8,
            }, polylineProps: {
                width: 2,
            } }, this.lineEditOptions), lineEditOptions));
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn(update => {
                const positions = update.positions;
                let totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? [...positions, update.updatedPosition]
                    : positions).reduce((labels, position, index, array) => {
                    if (index !== 0) {
                        const previousPosition = array[index - 1];
                        const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        const distance = Cesium.Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(Object.assign(Object.assign(Object.assign(Object.assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.bearingLabelsStyle), bearingLabelsStyle), Object.assign(Object.assign(Object.assign(Object.assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-35, -8), position: position, fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.distanceLabelsStyle), distanceLabelsStyle));
                        totalDistance += distance;
                    }
                    return labels;
                }, [
                    Object.assign(Object.assign(Object.assign(Object.assign({ text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: positions[0], fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.distanceLabelsStyle), distanceLabelsStyle),
                ]);
            });
        }
        return rnb;
    }
};
RangeAndBearingComponent.ctorParameters = () => [
    { type: PolylinesEditorService },
    { type: CoordinateConverter }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], RangeAndBearingComponent.prototype, "lineEditOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], RangeAndBearingComponent.prototype, "labelsStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], RangeAndBearingComponent.prototype, "distanceLabelsStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], RangeAndBearingComponent.prototype, "bearingLabelsStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], RangeAndBearingComponent.prototype, "bearingStringFn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], RangeAndBearingComponent.prototype, "distanceStringFn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], RangeAndBearingComponent.prototype, "labelsRenderFn", void 0);
RangeAndBearingComponent = __decorate([
    Component({
        selector: 'range-and-bearing',
        template: `
    <polylines-editor></polylines-editor>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [PolylinesEditorService]
    }),
    __metadata("design:paramtypes", [PolylinesEditorService, CoordinateConverter])
], RangeAndBearingComponent);
export { RangeAndBearingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL3JhbmdlLWFuZC1iZWFyaW5nL3JhbmdlLWFuZC1iZWFyaW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBSzdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQztBQUVoSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFTSCxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQVNuQyxZQUFvQixjQUFzQyxFQUFVLG1CQUF3QztRQUF4RixtQkFBYyxHQUFkLGNBQWMsQ0FBd0I7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBUm5HLG9CQUFlLEdBQXlCLEVBQUUsQ0FBQztRQUMzQyxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsd0JBQW1CLEdBQWdCLEVBQUUsQ0FBQztRQUN0Qyx1QkFBa0IsR0FBZ0IsRUFBRSxDQUFDO0lBTTlDLENBQUM7SUFFRCxNQUFNLENBQ0osRUFDRSxlQUFlLEdBQUcsRUFBRSxFQUNwQixXQUFXLEdBQUcsRUFBRSxFQUNoQixtQkFBbUIsR0FBRyxFQUFFLEVBQ3hCLGtCQUFrQixHQUFHLEVBQUUsRUFDdkIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixjQUFjLE1BQ1ksRUFBQyxlQUFlLEVBQUUsRUFBRSxFQUFF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RSxDQUFDLENBQUMsQ0FBQyxFQUMzQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUN0QixTQUFTLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQzdCLFlBQVksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFDaEMsY0FBYyxFQUFFLElBQUksSUFDaEIsSUFBSSxDQUFDLFdBQW1CLEdBQ3hCLFdBQW1CLEdBQ25CLElBQUksQ0FBQyxtQkFBMkIsR0FDaEMsbUJBQTJCO2lCQUVsQyxDQUNGLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBQ0YsQ0FBQTs7WUFuSHFDLHNCQUFzQjtZQUErQixtQkFBbUI7O0FBUm5HO0lBQVIsS0FBSyxFQUFFOztpRUFBNEM7QUFDM0M7SUFBUixLQUFLLEVBQUU7OzZEQUErQjtBQUM5QjtJQUFSLEtBQUssRUFBRTs7cUVBQXVDO0FBQ3RDO0lBQVIsS0FBSyxFQUFFOztvRUFBc0M7QUFDckM7SUFBUixLQUFLLEVBQUU7O2lFQUE2QztBQUM1QztJQUFSLEtBQUssRUFBRTs7a0VBQThDO0FBQzdDO0lBQVIsS0FBSyxFQUFFOztnRUFBcUY7QUFQbEYsd0JBQXdCO0lBUnBDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsUUFBUSxFQUFFOztHQUVUO1FBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07UUFDL0MsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7S0FDcEMsQ0FBQztxQ0FVb0Msc0JBQXNCLEVBQStCLG1CQUFtQjtHQVRqRyx3QkFBd0IsQ0E0SHBDO1NBNUhZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0QWN0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LWFjdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdG9yLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgUG9seWxpbmVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgTGFiZWxQcm9wcywgTGFiZWxTdHlsZSB9IGZyb20gJy4uLy4uL21vZGVscy9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC11cGRhdGUnO1xuaW1wb3J0IHsgRWRpdE1vZGVzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtbW9kZS5lbnVtJztcbmltcG9ydCB7IFBvbHlsaW5lc0VkaXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktZWRpdG9ycy9wb2x5bGluZS1lZGl0b3IvcG9seWxpbmVzLWVkaXRvci5zZXJ2aWNlJztcblxuLyoqXG4gKlxuICogUmFuZ2UgYW5kIGJlYXJpbmcgY29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBkcmF3IHJhbmdlIGFuZCBiZWFyaW5nIG9uIHRoZSBtYXAuXG4gKiBUaGUgaW5wdXRzIGFyZSB1c2VkIHRvIGN1c3RvbWl6ZSB0aGUgcmFuZ2UgYW5kIGJlYXJpbmcgc3R5bGUgYW5kIGJlaGF2aW9yLlxuICogQ3JlYXRlIGNvbXBvbmVudCByZWZlcmVuY2UgYW5kIHVzZSB0aGUgYGNyZWF0ZSgpYCBmdW5jdGlvbiB0byBzdGFydCBjcmVhdGluZyBSJkIgb24gdGhlIG1hcC5cbiAqIFRoZSBmdW5jdGlvbiByZWNlaXZlcyBhbiBvcHRpb25hbCBSYW5nZUFuZEJlYXJpbmdPcHRpb25zIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGNyZWF0ZWQgcmFuZ2UgYW5kIGJlYXJpbmcgc3R5bGUgYW5kIGJlaGF2aW9yXG4gKiAob24gdG9wIG9mIHRoZSBkZWZhdWx0IGFuZCBnbG9iYWwgZGVmaW5pdGlvbnMpLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqIG15LWNvbXBvbmVudC50czpcbiAqXG4gKiBgYGBcbiAqIFxcQFZpZXdDaGlsZCgncmFuZ2VBbmRCZWFyaW5nJywge3N0YXRpYzogZmFsc2V9KSBwcml2YXRlIHJhbmdlQW5kQmVhcmluZzogUmFuZ2VBbmRCZWFyaW5nQ29tcG9uZW50OyAvLyBHZXQgUiZCIHJlZmVyZW5jZVxuICogIC8vIC4uLlxuICogdGhpcy5yYW5nZUFuZEJlYXJpbmcuY3JlYXRlKHtzdHlsZTogeyBwb2ludFByb3BzOiB7IHBpeGVsU2l6ZTogMTIgfSB9LCBiZWFyaW5nTGFiZWxzU3R5bGU6IHsgZmlsbENvbG9yOiBDZXNpdW0uQ29sb3IuR1JFRU4gfSB9KTtcbiAqIGBgYFxuICpcbiAqIG15LWNvbXBvbmVudC5odG1sXG4gKiBgYGBcbiAqIDxyYW5nZS1hbmQtYmVhcmluZyAjcmFuZ2VBbmRCZWFyaW5nPjwvcmFuZ2UtYW5kLWJlYXJpbmc+IC8vIE9wdGlvbmFsIGlucHV0cyBkZWZpbmVzIGdsb2JhbCBzdHlsZSBhbmQgYmVoYXZpb3IuXG4gKiBgYGBcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3JhbmdlLWFuZC1iZWFyaW5nJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8cG9seWxpbmVzLWVkaXRvcj48L3BvbHlsaW5lcy1lZGl0b3I+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtQb2x5bGluZXNFZGl0b3JTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgUmFuZ2VBbmRCZWFyaW5nQ29tcG9uZW50IHtcbiAgQElucHV0KCkgbGluZUVkaXRPcHRpb25zPzogUG9seWxpbmVFZGl0T3B0aW9ucyA9IHt9O1xuICBASW5wdXQoKSBsYWJlbHNTdHlsZT86IExhYmVsU3R5bGUgPSB7fTtcbiAgQElucHV0KCkgZGlzdGFuY2VMYWJlbHNTdHlsZT86IExhYmVsU3R5bGUgPSB7fTtcbiAgQElucHV0KCkgYmVhcmluZ0xhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xuICBASW5wdXQoKSBiZWFyaW5nU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBASW5wdXQoKSBkaXN0YW5jZVN0cmluZ0ZuPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcbiAgQElucHV0KCkgbGFiZWxzUmVuZGVyRm4/OiAodXBkYXRlOiBQb2x5bGluZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwb2x5bGluZUVkaXRvcjogUG9seWxpbmVzRWRpdG9yU2VydmljZSwgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyKSB7XG4gIH1cblxuICBjcmVhdGUoXG4gICAge1xuICAgICAgbGluZUVkaXRPcHRpb25zID0ge30sXG4gICAgICBsYWJlbHNTdHlsZSA9IHt9LFxuICAgICAgZGlzdGFuY2VMYWJlbHNTdHlsZSA9IHt9LFxuICAgICAgYmVhcmluZ0xhYmVsc1N0eWxlID0ge30sXG4gICAgICBiZWFyaW5nU3RyaW5nRm4sXG4gICAgICBkaXN0YW5jZVN0cmluZ0ZuLFxuICAgICAgbGFiZWxzUmVuZGVyRm4sXG4gICAgfTogUmFuZ2VBbmRCZWFyaW5nT3B0aW9ucyA9IHtsaW5lRWRpdE9wdGlvbnM6IHt9LCBsYWJlbHNTdHlsZToge30sIGRpc3RhbmNlTGFiZWxzU3R5bGU6IHt9LCBiZWFyaW5nTGFiZWxzU3R5bGU6IHt9fSxcbiAgKTogUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIHtcbiAgICBjb25zdCBybmIgPSB0aGlzLnBvbHlsaW5lRWRpdG9yLmNyZWF0ZSh7XG4gICAgICBhbGxvd0RyYWc6IGZhbHNlLFxuICAgICAgcG9pbnRQcm9wczoge1xuICAgICAgICBzaG93VmlydHVhbDogZmFsc2UsXG4gICAgICAgIHBpeGVsU2l6ZTogOCxcbiAgICAgIH0sXG4gICAgICBwb2x5bGluZVByb3BzOiB7XG4gICAgICAgIHdpZHRoOiAyLFxuICAgICAgfSxcbiAgICAgIC4uLnRoaXMubGluZUVkaXRPcHRpb25zLFxuICAgICAgLi4ubGluZUVkaXRPcHRpb25zLFxuICAgIH0pO1xuXG4gICAgaWYgKGxhYmVsc1JlbmRlckZuKSB7XG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4obGFiZWxzUmVuZGVyRm4pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5sYWJlbHNSZW5kZXJGbikge1xuICAgICAgcm5iLnNldExhYmVsc1JlbmRlckZuKHRoaXMubGFiZWxzUmVuZGVyRm4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4odXBkYXRlID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdXBkYXRlLnBvc2l0aW9ucztcbiAgICAgICAgbGV0IHRvdGFsRGlzdGFuY2UgPSAwO1xuICAgICAgICBpZiAoIXBvc2l0aW9ucyB8fCBwb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFICYmIHVwZGF0ZS5lZGl0QWN0aW9uICE9PSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVFxuICAgICAgICAgICAgPyBbLi4ucG9zaXRpb25zLCB1cGRhdGUudXBkYXRlZFBvc2l0aW9uXVxuICAgICAgICAgICAgOiBwb3NpdGlvbnNcbiAgICAgICAgKS5yZWR1Y2UoXG4gICAgICAgICAgKGxhYmVscywgcG9zaXRpb24sIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUG9zaXRpb24gPSBhcnJheVtpbmRleCAtIDFdO1xuICAgICAgICAgICAgICBjb25zdCBiZWFyaW5nID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihwcmV2aW91c1Bvc2l0aW9uLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gQ2VzaXVtLkNhcnRlc2lhbjMuZGlzdGFuY2UocHJldmlvdXNQb3NpdGlvbiwgcG9zaXRpb24pIC8gMTAwMDtcbiAgICAgICAgICAgICAgbGFiZWxzLnB1c2goXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGV4dDpcbiAgICAgICAgICAgICAgICAgICAgKGJlYXJpbmdTdHJpbmdGbiAmJiBiZWFyaW5nU3RyaW5nRm4oYmVhcmluZykpIHx8XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJlYXJpbmdTdHJpbmdGbiAmJiB0aGlzLmJlYXJpbmdTdHJpbmdGbihiZWFyaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgYCR7YmVhcmluZy50b0ZpeGVkKDIpfcKwYCxcbiAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjIsXG4gICAgICAgICAgICAgICAgICBmb250OiAnODBweCBIZWx2ZXRpY2EnLFxuICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBDZXNpdW0uQ2FydGVzaWFuMigtMjAsIC04KSxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoXG4gICAgICAgICAgICAgICAgICAgIChwb3NpdGlvbi54ICsgcHJldmlvdXNQb3NpdGlvbi54KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgIChwb3NpdGlvbi55ICsgcHJldmlvdXNQb3NpdGlvbi55KSAvIDIsXG4gICAgICAgICAgICAgICAgICAgIChwb3NpdGlvbi56ICsgcHJldmlvdXNQb3NpdGlvbi56KSAvIDIsXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMubGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMuYmVhcmluZ0xhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgICAuLi4oYmVhcmluZ0xhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgICAgICAgICAoZGlzdGFuY2VTdHJpbmdGbiAmJiBkaXN0YW5jZVN0cmluZ0ZuKHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkpIHx8XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmRpc3RhbmNlU3RyaW5nRm4gJiYgdGhpcy5kaXN0YW5jZVN0cmluZ0ZuKHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkpIHx8XG4gICAgICAgICAgICAgICAgICAgIGAkeyh0b3RhbERpc3RhbmNlICsgZGlzdGFuY2UpLnRvRml4ZWQoMil9IEttYCxcbiAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjIsXG4gICAgICAgICAgICAgICAgICBmb250OiAnODBweCBIZWx2ZXRpY2EnLFxuICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBDZXNpdW0uQ2FydGVzaWFuMigtMzUsIC04KSxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICAgICAgICBzaG93QmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIC4uLih0aGlzLmxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgICAuLi4obGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLih0aGlzLmRpc3RhbmNlTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihkaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICB0b3RhbERpc3RhbmNlICs9IGRpc3RhbmNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbGFiZWxzO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAoZGlzdGFuY2VTdHJpbmdGbiAmJiBkaXN0YW5jZVN0cmluZ0ZuKDApKSB8fCAodGhpcy5kaXN0YW5jZVN0cmluZ0ZuICYmIHRoaXMuZGlzdGFuY2VTdHJpbmdGbigwKSkgfHwgYDAgS21gLFxuICAgICAgICAgICAgICBzY2FsZTogMC4yLFxuICAgICAgICAgICAgICBmb250OiAnODBweCBIZWx2ZXRpY2EnLFxuICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKC0yMCwgLTgpLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25zWzBdLFxuICAgICAgICAgICAgICBmaWxsQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgICAgICAgICAuLi4odGhpcy5sYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4obGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgLi4uKHRoaXMuZGlzdGFuY2VMYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4oZGlzdGFuY2VMYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJuYjtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlQW5kQmVhcmluZ09wdGlvbnMge1xuICBsaW5lRWRpdE9wdGlvbnM/OiBQb2x5bGluZUVkaXRPcHRpb25zO1xuICBsYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XG4gIGRpc3RhbmNlTGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlO1xuICBiZWFyaW5nTGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlO1xuICBiZWFyaW5nU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBkaXN0YW5jZVN0cmluZ0ZuPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcbiAgbGFiZWxzUmVuZGVyRm4/OiAodXBkYXRlOiBQb2x5bGluZUVkaXRVcGRhdGUsIGxhYmVsczogTGFiZWxQcm9wc1tdKSA9PiBMYWJlbFByb3BzW107XG59XG4iXX0=
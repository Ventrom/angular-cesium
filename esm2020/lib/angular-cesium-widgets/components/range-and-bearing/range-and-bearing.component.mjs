import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EditActions } from '../../models/edit-actions.enum';
import { EditModes } from '../../models/edit-mode.enum';
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/polyline-editor/polylines-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../polylines-editor/polylines-editor.component";
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
export class RangeAndBearingComponent {
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        const rnb = this.polylineEditor.create({
            allowDrag: false,
            pointProps: {
                showVirtual: false,
                pixelSize: 8,
            },
            polylineProps: {
                width: 2,
            },
            ...this.lineEditOptions,
            ...lineEditOptions,
        });
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
                        labels.push({
                            text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`,
                            scale: 0.2,
                            font: '80px Helvetica',
                            pixelOffset: new Cesium.Cartesian2(-20, -8),
                            position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2),
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.WHITE,
                            showBackground: true,
                            ...this.labelsStyle,
                            ...labelsStyle,
                            ...this.bearingLabelsStyle,
                            ...bearingLabelsStyle,
                        }, {
                            text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`,
                            scale: 0.2,
                            font: '80px Helvetica',
                            pixelOffset: new Cesium.Cartesian2(-35, -8),
                            position: position,
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.WHITE,
                            showBackground: true,
                            ...this.labelsStyle,
                            ...labelsStyle,
                            ...this.distanceLabelsStyle,
                            ...distanceLabelsStyle,
                        });
                        totalDistance += distance;
                    }
                    return labels;
                }, [
                    {
                        text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`,
                        scale: 0.2,
                        font: '80px Helvetica',
                        pixelOffset: new Cesium.Cartesian2(-20, -8),
                        position: positions[0],
                        fillColor: Cesium.Color.WHITE,
                        outlineColor: Cesium.Color.WHITE,
                        showBackground: true,
                        ...this.labelsStyle,
                        ...labelsStyle,
                        ...this.distanceLabelsStyle,
                        ...distanceLabelsStyle,
                    },
                ]);
            });
        }
        return rnb;
    }
}
RangeAndBearingComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RangeAndBearingComponent, deps: [{ token: i1.PolylinesEditorService }, { token: i2.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
RangeAndBearingComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: RangeAndBearingComponent, selector: "range-and-bearing", inputs: { lineEditOptions: "lineEditOptions", labelsStyle: "labelsStyle", distanceLabelsStyle: "distanceLabelsStyle", bearingLabelsStyle: "bearingLabelsStyle", bearingStringFn: "bearingStringFn", distanceStringFn: "distanceStringFn", labelsRenderFn: "labelsRenderFn" }, providers: [PolylinesEditorService], ngImport: i0, template: `
    <polylines-editor></polylines-editor>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.PolylinesEditorComponent, selector: "polylines-editor" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RangeAndBearingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'range-and-bearing',
                    template: `
    <polylines-editor></polylines-editor>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [PolylinesEditorService],
                }]
        }], ctorParameters: function () { return [{ type: i1.PolylinesEditorService }, { type: i2.CoordinateConverter }]; }, propDecorators: { lineEditOptions: [{
                type: Input
            }], labelsStyle: [{
                type: Input
            }], distanceLabelsStyle: [{
                type: Input
            }], bearingLabelsStyle: [{
                type: Input
            }], bearingStringFn: [{
                type: Input
            }], distanceStringFn: [{
                type: Input
            }], labelsRenderFn: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvcmFuZ2UtYW5kLWJlYXJpbmcvcmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUs3RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0VBQXdFLENBQUM7Ozs7O0FBRWhIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQVNILE1BQU0sT0FBTyx3QkFBd0I7SUFTbkMsWUFBb0IsY0FBc0MsRUFBVSxtQkFBd0M7UUFBeEYsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBQVUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQVJuRyxvQkFBZSxHQUF5QixFQUFFLENBQUM7UUFDM0MsZ0JBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLHdCQUFtQixHQUFnQixFQUFFLENBQUM7UUFDdEMsdUJBQWtCLEdBQWdCLEVBQUUsQ0FBQztJQU05QyxDQUFDO0lBRUQsTUFBTSxDQUNKLEVBQ0UsZUFBZSxHQUFHLEVBQUUsRUFDcEIsV0FBVyxHQUFHLEVBQUUsRUFDaEIsbUJBQW1CLEdBQUcsRUFBRSxFQUN4QixrQkFBa0IsR0FBRyxFQUFFLEVBQ3ZCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsY0FBYyxNQUNZLEVBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLG1CQUFt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QUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsZ0JBQWdCO3dCQUN0QixXQUFXLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDdEIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSzt3QkFDN0IsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSzt3QkFDaEMsY0FBYyxFQUFFLElBQUk7d0JBQ3BCLEdBQUksSUFBSSxDQUFDLFdBQW1CO3dCQUM1QixHQUFJLFdBQW1CO3dCQUN2QixHQUFJLElBQUksQ0FBQyxtQkFBMkI7d0JBQ3BDLEdBQUksbUJBQTJCO3FCQUNoQztpQkFDRixDQUNGLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDOztzSEEzSFUsd0JBQXdCOzBHQUF4Qix3QkFBd0IsMFRBRnhCLENBQUMsc0JBQXNCLENBQUMsMEJBSnpCOztHQUVUOzRGQUlVLHdCQUF3QjtrQkFScEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUU7O0dBRVQ7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQzsrSUFFVSxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csbUJBQW1CO3NCQUEzQixLQUFLO2dCQUNHLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0b3Itb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQb2x5bGluZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBMYWJlbFByb3BzLCBMYWJlbFN0eWxlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdFVwZGF0ZSB9IGZyb20gJy4uLy4uL21vZGVscy9wb2x5bGluZS1lZGl0LXVwZGF0ZSc7XG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xuaW1wb3J0IHsgUG9seWxpbmVzRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL3BvbHlsaW5lLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLnNlcnZpY2UnO1xuXG4vKipcbiAqXG4gKiBSYW5nZSBhbmQgYmVhcmluZyBjb21wb25lbnQgdGhhdCBpcyB1c2VkIHRvIGRyYXcgcmFuZ2UgYW5kIGJlYXJpbmcgb24gdGhlIG1hcC5cbiAqIFRoZSBpbnB1dHMgYXJlIHVzZWQgdG8gY3VzdG9taXplIHRoZSByYW5nZSBhbmQgYmVhcmluZyBzdHlsZSBhbmQgYmVoYXZpb3IuXG4gKiBDcmVhdGUgY29tcG9uZW50IHJlZmVyZW5jZSBhbmQgdXNlIHRoZSBgY3JlYXRlKClgIGZ1bmN0aW9uIHRvIHN0YXJ0IGNyZWF0aW5nIFImQiBvbiB0aGUgbWFwLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIGFuIG9wdGlvbmFsIFJhbmdlQW5kQmVhcmluZ09wdGlvbnMgb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgY3JlYXRlZCByYW5nZSBhbmQgYmVhcmluZyBzdHlsZSBhbmQgYmVoYXZpb3JcbiAqIChvbiB0b3Agb2YgdGhlIGRlZmF1bHQgYW5kIGdsb2JhbCBkZWZpbml0aW9ucykuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogbXktY29tcG9uZW50LnRzOlxuICpcbiAqIGBgYFxuICogXFxAVmlld0NoaWxkKCdyYW5nZUFuZEJlYXJpbmcnLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgcmFuZ2VBbmRCZWFyaW5nOiBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQ7IC8vIEdldCBSJkIgcmVmZXJlbmNlXG4gKiAgLy8gLi4uXG4gKiB0aGlzLnJhbmdlQW5kQmVhcmluZy5jcmVhdGUoe3N0eWxlOiB7IHBvaW50UHJvcHM6IHsgcGl4ZWxTaXplOiAxMiB9IH0sIGJlYXJpbmdMYWJlbHNTdHlsZTogeyBmaWxsQ29sb3I6IENlc2l1bS5Db2xvci5HUkVFTiB9IH0pO1xuICogYGBgXG4gKlxuICogbXktY29tcG9uZW50Lmh0bWxcbiAqIGBgYFxuICogPHJhbmdlLWFuZC1iZWFyaW5nICNyYW5nZUFuZEJlYXJpbmc+PC9yYW5nZS1hbmQtYmVhcmluZz4gLy8gT3B0aW9uYWwgaW5wdXRzIGRlZmluZXMgZ2xvYmFsIHN0eWxlIGFuZCBiZWhhdmlvci5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncmFuZ2UtYW5kLWJlYXJpbmcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxwb2x5bGluZXMtZWRpdG9yPjwvcG9seWxpbmVzLWVkaXRvcj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1BvbHlsaW5lc0VkaXRvclNlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQge1xuICBASW5wdXQoKSBsaW5lRWRpdE9wdGlvbnM/OiBQb2x5bGluZUVkaXRPcHRpb25zID0ge307XG4gIEBJbnB1dCgpIGxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xuICBASW5wdXQoKSBkaXN0YW5jZUxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xuICBASW5wdXQoKSBiZWFyaW5nTGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlID0ge307XG4gIEBJbnB1dCgpIGJlYXJpbmdTdHJpbmdGbj86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIEBJbnB1dCgpIGRpc3RhbmNlU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBASW5wdXQoKSBsYWJlbHNSZW5kZXJGbj86ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvbHlsaW5lRWRpdG9yOiBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlLCBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgfVxuXG4gIGNyZWF0ZShcbiAgICB7XG4gICAgICBsaW5lRWRpdE9wdGlvbnMgPSB7fSxcbiAgICAgIGxhYmVsc1N0eWxlID0ge30sXG4gICAgICBkaXN0YW5jZUxhYmVsc1N0eWxlID0ge30sXG4gICAgICBiZWFyaW5nTGFiZWxzU3R5bGUgPSB7fSxcbiAgICAgIGJlYXJpbmdTdHJpbmdGbixcbiAgICAgIGRpc3RhbmNlU3RyaW5nRm4sXG4gICAgICBsYWJlbHNSZW5kZXJGbixcbiAgICB9OiBSYW5nZUFuZEJlYXJpbmdPcHRpb25zID0ge2xpbmVFZGl0T3B0aW9uczoge30sIGxhYmVsc1N0eWxlOiB7fSwgZGlzdGFuY2VMYWJlbHNTdHlsZToge30sIGJlYXJpbmdMYWJlbHNTdHlsZToge319LFxuICApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHJuYiA9IHRoaXMucG9seWxpbmVFZGl0b3IuY3JlYXRlKHtcbiAgICAgIGFsbG93RHJhZzogZmFsc2UsXG4gICAgICBwb2ludFByb3BzOiB7XG4gICAgICAgIHNob3dWaXJ0dWFsOiBmYWxzZSxcbiAgICAgICAgcGl4ZWxTaXplOiA4LFxuICAgICAgfSxcbiAgICAgIHBvbHlsaW5lUHJvcHM6IHtcbiAgICAgICAgd2lkdGg6IDIsXG4gICAgICB9LFxuICAgICAgLi4udGhpcy5saW5lRWRpdE9wdGlvbnMsXG4gICAgICAuLi5saW5lRWRpdE9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBpZiAobGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJuYi5zZXRMYWJlbHNSZW5kZXJGbihsYWJlbHNSZW5kZXJGbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxhYmVsc1JlbmRlckZuKSB7XG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4odGhpcy5sYWJlbHNSZW5kZXJGbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJuYi5zZXRMYWJlbHNSZW5kZXJGbih1cGRhdGUgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB1cGRhdGUucG9zaXRpb25zO1xuICAgICAgICBsZXQgdG90YWxEaXN0YW5jZSA9IDA7XG4gICAgICAgIGlmICghcG9zaXRpb25zIHx8IHBvc2l0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgJiYgdXBkYXRlLmVkaXRBY3Rpb24gIT09IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UXG4gICAgICAgICAgICA/IFsuLi5wb3NpdGlvbnMsIHVwZGF0ZS51cGRhdGVkUG9zaXRpb25dXG4gICAgICAgICAgICA6IHBvc2l0aW9uc1xuICAgICAgICApLnJlZHVjZShcbiAgICAgICAgICAobGFiZWxzLCBwb3NpdGlvbiwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQb3NpdGlvbiA9IGFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgIGNvbnN0IGJlYXJpbmcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHByZXZpb3VzUG9zaXRpb24sIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBDZXNpdW0uQ2FydGVzaWFuMy5kaXN0YW5jZShwcmV2aW91c1Bvc2l0aW9uLCBwb3NpdGlvbikgLyAxMDAwO1xuICAgICAgICAgICAgICBsYWJlbHMucHVzaChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgICAgICAgICAoYmVhcmluZ1N0cmluZ0ZuICYmIGJlYXJpbmdTdHJpbmdGbihiZWFyaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYmVhcmluZ1N0cmluZ0ZuICYmIHRoaXMuYmVhcmluZ1N0cmluZ0ZuKGJlYXJpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICBgJHtiZWFyaW5nLnRvRml4ZWQoMil9wrBgLFxuICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuMixcbiAgICAgICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKC0yMCwgLTgpLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnggKyBwcmV2aW91c1Bvc2l0aW9uLngpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnkgKyBwcmV2aW91c1Bvc2l0aW9uLnkpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnogKyBwcmV2aW91c1Bvc2l0aW9uLnopIC8gMixcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5sYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKGxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5iZWFyaW5nTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihiZWFyaW5nTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICAgICAgICAgIChkaXN0YW5jZVN0cmluZ0ZuICYmIGRpc3RhbmNlU3RyaW5nRm4odG90YWxEaXN0YW5jZSArIGRpc3RhbmNlKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZGlzdGFuY2VTdHJpbmdGbiAmJiB0aGlzLmRpc3RhbmNlU3RyaW5nRm4odG90YWxEaXN0YW5jZSArIGRpc3RhbmNlKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgYCR7KHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkudG9GaXhlZCgyKX0gS21gLFxuICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuMixcbiAgICAgICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKC0zNSwgLTgpLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMubGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMuZGlzdGFuY2VMYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKGRpc3RhbmNlTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIHRvdGFsRGlzdGFuY2UgKz0gZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBsYWJlbHM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IChkaXN0YW5jZVN0cmluZ0ZuICYmIGRpc3RhbmNlU3RyaW5nRm4oMCkpIHx8ICh0aGlzLmRpc3RhbmNlU3RyaW5nRm4gJiYgdGhpcy5kaXN0YW5jZVN0cmluZ0ZuKDApKSB8fCBgMCBLbWAsXG4gICAgICAgICAgICAgIHNjYWxlOiAwLjIsXG4gICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjIoLTIwLCAtOCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbnNbMF0sXG4gICAgICAgICAgICAgIGZpbGxDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IHRydWUsXG4gICAgICAgICAgICAgIC4uLih0aGlzLmxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4odGhpcy5kaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLihkaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5iO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VBbmRCZWFyaW5nT3B0aW9ucyB7XG4gIGxpbmVFZGl0T3B0aW9ucz86IFBvbHlsaW5lRWRpdE9wdGlvbnM7XG4gIGxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZTtcbiAgZGlzdGFuY2VMYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XG4gIGJlYXJpbmdMYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XG4gIGJlYXJpbmdTdHJpbmdGbj86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIGRpc3RhbmNlU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBsYWJlbHNSZW5kZXJGbj86ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbn1cbiJdfQ==
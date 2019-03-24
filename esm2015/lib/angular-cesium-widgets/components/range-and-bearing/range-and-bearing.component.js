/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * \\@ViewChild('rangeAndBearing') private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
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
    /**
     * @param {?} polylineEditor
     * @param {?} coordinateConverter
     */
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    /**
     * @param {?=} __0
     * @return {?}
     */
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        /** @type {?} */
        const rnb = this.polylineEditor.create(Object.assign({ allowDrag: false, pointProps: {
                showVirtual: false,
                pixelSize: 8,
            }, polylineProps: {
                width: 2,
            } }, this.lineEditOptions, lineEditOptions));
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn((/**
             * @param {?} update
             * @return {?}
             */
            update => {
                /** @type {?} */
                const positions = update.positions;
                /** @type {?} */
                let totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? [...positions, update.updatedPosition]
                    : positions).reduce((/**
                 * @param {?} labels
                 * @param {?} position
                 * @param {?} index
                 * @param {?} array
                 * @return {?}
                 */
                (labels, position, index, array) => {
                    if (index !== 0) {
                        /** @type {?} */
                        const previousPosition = array[index - 1];
                        /** @type {?} */
                        const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        /** @type {?} */
                        const distance = Cesium.Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(Object.assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: new Cesium.Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.bearingLabelsStyle))), ((/** @type {?} */ (bearingLabelsStyle)))), Object.assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-35, -8), position: position, fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))));
                        totalDistance += distance;
                    }
                    return labels;
                }), [
                    Object.assign({ text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cesium.Cartesian2(-20, -8), position: positions[0], fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.WHITE, showBackground: true }, ((/** @type {?} */ (this.labelsStyle))), ((/** @type {?} */ (labelsStyle))), ((/** @type {?} */ (this.distanceLabelsStyle))), ((/** @type {?} */ (distanceLabelsStyle)))),
                ]);
            }));
        }
        return rnb;
    }
}
RangeAndBearingComponent.decorators = [
    { type: Component, args: [{
                selector: 'range-and-bearing',
                template: `
    <polylines-editor></polylines-editor>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [PolylinesEditorService]
            }] }
];
/** @nocollapse */
RangeAndBearingComponent.ctorParameters = () => [
    { type: PolylinesEditorService },
    { type: CoordinateConverter }
];
RangeAndBearingComponent.propDecorators = {
    lineEditOptions: [{ type: Input }],
    labelsStyle: [{ type: Input }],
    distanceLabelsStyle: [{ type: Input }],
    bearingLabelsStyle: [{ type: Input }],
    bearingStringFn: [{ type: Input }],
    distanceStringFn: [{ type: Input }],
    labelsRenderFn: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RangeAndBearingComponent.prototype.lineEditOptions;
    /** @type {?} */
    RangeAndBearingComponent.prototype.labelsStyle;
    /** @type {?} */
    RangeAndBearingComponent.prototype.distanceLabelsStyle;
    /** @type {?} */
    RangeAndBearingComponent.prototype.bearingLabelsStyle;
    /** @type {?} */
    RangeAndBearingComponent.prototype.bearingStringFn;
    /** @type {?} */
    RangeAndBearingComponent.prototype.distanceStringFn;
    /** @type {?} */
    RangeAndBearingComponent.prototype.labelsRenderFn;
    /**
     * @type {?}
     * @private
     */
    RangeAndBearingComponent.prototype.polylineEditor;
    /**
     * @type {?}
     * @private
     */
    RangeAndBearingComponent.prototype.coordinateConverter;
}
/**
 * @record
 */
export function RangeAndBearingOptions() { }
if (false) {
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.lineEditOptions;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.labelsStyle;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.distanceLabelsStyle;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.bearingLabelsStyle;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.bearingStringFn;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.distanceStringFn;
    /** @type {?|undefined} */
    RangeAndBearingOptions.prototype.labelsRenderFn;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL3JhbmdlLWFuZC1iZWFyaW5nL3JhbmdlLWFuZC1iZWFyaW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFDekgsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBSzdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDaEgsTUFBTSxPQUFPLHdCQUF3Qjs7Ozs7SUFTbkMsWUFBb0IsY0FBc0MsRUFBVSxtQkFBd0M7UUFBeEYsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBQVUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQVJuRyxvQkFBZSxHQUF5QixFQUFFLENBQUM7UUFDM0MsZ0JBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLHdCQUFtQixHQUFnQixFQUFFLENBQUM7UUFDdEMsdUJBQWtCLEdBQWdCLEVBQUUsQ0FBQztJQU05QyxDQUFDOzs7OztJQUVELE1BQU0sQ0FDSixFQUNFLGVBQWUsR0FBRyxFQUFFLEVBQ3BCLFdBQVcsR0FBRyxFQUFFLEVBQ2hCLG1CQUFtQixHQUFHLEVBQUUsRUFDeEIsa0JBQWtCLEdBQUcsRUFBRSxFQUN2QixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGNBQWMsTUFDWSxFQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFF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O0lBQ3RDLDZDQUF5Qjs7SUFDekIscURBQWlDOztJQUNqQyxvREFBZ0M7O0lBQ2hDLGlEQUE0Qzs7SUFDNUMsa0RBQTZDOztJQUM3QyxnREFBb0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xuaW1wb3J0IHsgUG9seWxpbmVFZGl0b3JPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXRvci1vYnNlcnZhYmxlJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdE9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IExhYmVsUHJvcHMsIExhYmVsU3R5bGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xuaW1wb3J0IHsgUG9seWxpbmVFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtdXBkYXRlJztcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWxpbmUtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3Iuc2VydmljZSc7XG5cbi8qKlxuICpcbiAqIFJhbmdlIGFuZCBiZWFyaW5nIGNvbXBvbmVudCB0aGF0IGlzIHVzZWQgdG8gZHJhdyByYW5nZSBhbmQgYmVhcmluZyBvbiB0aGUgbWFwLlxuICogVGhlIGlucHV0cyBhcmUgdXNlZCB0byBjdXN0b21pemUgdGhlIHJhbmdlIGFuZCBiZWFyaW5nIHN0eWxlIGFuZCBiZWhhdmlvci5cbiAqIENyZWF0ZSBjb21wb25lbnQgcmVmZXJlbmNlIGFuZCB1c2UgdGhlIGBjcmVhdGUoKWAgZnVuY3Rpb24gdG8gc3RhcnQgY3JlYXRpbmcgUiZCIG9uIHRoZSBtYXAuXG4gKiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgYW4gb3B0aW9uYWwgUmFuZ2VBbmRCZWFyaW5nT3B0aW9ucyBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBjcmVhdGVkIHJhbmdlIGFuZCBiZWFyaW5nIHN0eWxlIGFuZCBiZWhhdmlvclxuICogKG9uIHRvcCBvZiB0aGUgZGVmYXVsdCBhbmQgZ2xvYmFsIGRlZmluaXRpb25zKS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBteS1jb21wb25lbnQudHM6XG4gKlxuICogYGBgXG4gKiBcXEBWaWV3Q2hpbGQoJ3JhbmdlQW5kQmVhcmluZycpIHByaXZhdGUgcmFuZ2VBbmRCZWFyaW5nOiBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQ7IC8vIEdldCBSJkIgcmVmZXJlbmNlXG4gKiAgLy8gLi4uXG4gKiB0aGlzLnJhbmdlQW5kQmVhcmluZy5jcmVhdGUoe3N0eWxlOiB7IHBvaW50UHJvcHM6IHsgcGl4ZWxTaXplOiAxMiB9IH0sIGJlYXJpbmdMYWJlbHNTdHlsZTogeyBmaWxsQ29sb3I6IENlc2l1bS5Db2xvci5HUkVFTiB9IH0pO1xuICogYGBgXG4gKlxuICogbXktY29tcG9uZW50Lmh0bWxcbiAqIGBgYFxuICogPHJhbmdlLWFuZC1iZWFyaW5nICNyYW5nZUFuZEJlYXJpbmc+PC9yYW5nZS1hbmQtYmVhcmluZz4gLy8gT3B0aW9uYWwgaW5wdXRzIGRlZmluZXMgZ2xvYmFsIHN0eWxlIGFuZCBiZWhhdmlvci5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncmFuZ2UtYW5kLWJlYXJpbmcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxwb2x5bGluZXMtZWRpdG9yPjwvcG9seWxpbmVzLWVkaXRvcj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1BvbHlsaW5lc0VkaXRvclNlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQge1xuICBASW5wdXQoKSBsaW5lRWRpdE9wdGlvbnM/OiBQb2x5bGluZUVkaXRPcHRpb25zID0ge307XG4gIEBJbnB1dCgpIGxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xuICBASW5wdXQoKSBkaXN0YW5jZUxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xuICBASW5wdXQoKSBiZWFyaW5nTGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlID0ge307XG4gIEBJbnB1dCgpIGJlYXJpbmdTdHJpbmdGbj86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIEBJbnB1dCgpIGRpc3RhbmNlU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBASW5wdXQoKSBsYWJlbHNSZW5kZXJGbj86ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvbHlsaW5lRWRpdG9yOiBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlLCBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgfVxuXG4gIGNyZWF0ZShcbiAgICB7XG4gICAgICBsaW5lRWRpdE9wdGlvbnMgPSB7fSxcbiAgICAgIGxhYmVsc1N0eWxlID0ge30sXG4gICAgICBkaXN0YW5jZUxhYmVsc1N0eWxlID0ge30sXG4gICAgICBiZWFyaW5nTGFiZWxzU3R5bGUgPSB7fSxcbiAgICAgIGJlYXJpbmdTdHJpbmdGbixcbiAgICAgIGRpc3RhbmNlU3RyaW5nRm4sXG4gICAgICBsYWJlbHNSZW5kZXJGbixcbiAgICB9OiBSYW5nZUFuZEJlYXJpbmdPcHRpb25zID0ge2xpbmVFZGl0T3B0aW9uczoge30sIGxhYmVsc1N0eWxlOiB7fSwgZGlzdGFuY2VMYWJlbHNTdHlsZToge30sIGJlYXJpbmdMYWJlbHNTdHlsZToge319LFxuICApOiBQb2x5bGluZUVkaXRvck9ic2VydmFibGUge1xuICAgIGNvbnN0IHJuYiA9IHRoaXMucG9seWxpbmVFZGl0b3IuY3JlYXRlKHtcbiAgICAgIGFsbG93RHJhZzogZmFsc2UsXG4gICAgICBwb2ludFByb3BzOiB7XG4gICAgICAgIHNob3dWaXJ0dWFsOiBmYWxzZSxcbiAgICAgICAgcGl4ZWxTaXplOiA4LFxuICAgICAgfSxcbiAgICAgIHBvbHlsaW5lUHJvcHM6IHtcbiAgICAgICAgd2lkdGg6IDIsXG4gICAgICB9LFxuICAgICAgLi4udGhpcy5saW5lRWRpdE9wdGlvbnMsXG4gICAgICAuLi5saW5lRWRpdE9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICBpZiAobGFiZWxzUmVuZGVyRm4pIHtcbiAgICAgIHJuYi5zZXRMYWJlbHNSZW5kZXJGbihsYWJlbHNSZW5kZXJGbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxhYmVsc1JlbmRlckZuKSB7XG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4odGhpcy5sYWJlbHNSZW5kZXJGbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJuYi5zZXRMYWJlbHNSZW5kZXJGbih1cGRhdGUgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB1cGRhdGUucG9zaXRpb25zO1xuICAgICAgICBsZXQgdG90YWxEaXN0YW5jZSA9IDA7XG4gICAgICAgIGlmICghcG9zaXRpb25zIHx8IHBvc2l0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh1cGRhdGUuZWRpdE1vZGUgPT09IEVkaXRNb2Rlcy5DUkVBVEUgJiYgdXBkYXRlLmVkaXRBY3Rpb24gIT09IEVkaXRBY3Rpb25zLkFERF9MQVNUX1BPSU5UXG4gICAgICAgICAgICA/IFsuLi5wb3NpdGlvbnMsIHVwZGF0ZS51cGRhdGVkUG9zaXRpb25dXG4gICAgICAgICAgICA6IHBvc2l0aW9uc1xuICAgICAgICApLnJlZHVjZShcbiAgICAgICAgICAobGFiZWxzLCBwb3NpdGlvbiwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNQb3NpdGlvbiA9IGFycmF5W2luZGV4IC0gMV07XG4gICAgICAgICAgICAgIGNvbnN0IGJlYXJpbmcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHByZXZpb3VzUG9zaXRpb24sIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBDZXNpdW0uQ2FydGVzaWFuMy5kaXN0YW5jZShwcmV2aW91c1Bvc2l0aW9uLCBwb3NpdGlvbikgLyAxMDAwO1xuICAgICAgICAgICAgICBsYWJlbHMucHVzaChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OlxuICAgICAgICAgICAgICAgICAgICAoYmVhcmluZ1N0cmluZ0ZuICYmIGJlYXJpbmdTdHJpbmdGbihiZWFyaW5nKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYmVhcmluZ1N0cmluZ0ZuICYmIHRoaXMuYmVhcmluZ1N0cmluZ0ZuKGJlYXJpbmcpKSB8fFxuICAgICAgICAgICAgICAgICAgICBgJHtiZWFyaW5nLnRvRml4ZWQoMil9wrBgLFxuICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuMixcbiAgICAgICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKC0yMCwgLTgpLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnggKyBwcmV2aW91c1Bvc2l0aW9uLngpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnkgKyBwcmV2aW91c1Bvc2l0aW9uLnkpIC8gMixcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnogKyBwcmV2aW91c1Bvc2l0aW9uLnopIC8gMixcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5sYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKGxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5iZWFyaW5nTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihiZWFyaW5nTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6XG4gICAgICAgICAgICAgICAgICAgIChkaXN0YW5jZVN0cmluZ0ZuICYmIGRpc3RhbmNlU3RyaW5nRm4odG90YWxEaXN0YW5jZSArIGRpc3RhbmNlKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZGlzdGFuY2VTdHJpbmdGbiAmJiB0aGlzLmRpc3RhbmNlU3RyaW5nRm4odG90YWxEaXN0YW5jZSArIGRpc3RhbmNlKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgYCR7KHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkudG9GaXhlZCgyKX0gS21gLFxuICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuMixcbiAgICAgICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKC0zNSwgLTgpLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBDZXNpdW0uQ29sb3IuV0hJVEUsXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMubGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMuZGlzdGFuY2VMYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAgICAgLi4uKGRpc3RhbmNlTGFiZWxzU3R5bGUgYXMgYW55KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIHRvdGFsRGlzdGFuY2UgKz0gZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBsYWJlbHM7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IChkaXN0YW5jZVN0cmluZ0ZuICYmIGRpc3RhbmNlU3RyaW5nRm4oMCkpIHx8ICh0aGlzLmRpc3RhbmNlU3RyaW5nRm4gJiYgdGhpcy5kaXN0YW5jZVN0cmluZ0ZuKDApKSB8fCBgMCBLbWAsXG4gICAgICAgICAgICAgIHNjYWxlOiAwLjIsXG4gICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXG4gICAgICAgICAgICAgIHBpeGVsT2Zmc2V0OiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjIoLTIwLCAtOCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbnNbMF0sXG4gICAgICAgICAgICAgIGZpbGxDb2xvcjogQ2VzaXVtLkNvbG9yLldISVRFLFxuICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5XSElURSxcbiAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IHRydWUsXG4gICAgICAgICAgICAgIC4uLih0aGlzLmxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4odGhpcy5kaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICAgIC4uLihkaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5iO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VBbmRCZWFyaW5nT3B0aW9ucyB7XG4gIGxpbmVFZGl0T3B0aW9ucz86IFBvbHlsaW5lRWRpdE9wdGlvbnM7XG4gIGxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZTtcbiAgZGlzdGFuY2VMYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XG4gIGJlYXJpbmdMYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XG4gIGJlYXJpbmdTdHJpbmdGbj86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XG4gIGRpc3RhbmNlU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBsYWJlbHNSZW5kZXJGbj86ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcbn1cbiJdfQ==
import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
export class PixelOffsetPipe {
    transform(value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PixelOffsetPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
PixelOffsetPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: PixelOffsetPipe, name: "pixelOffset" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PixelOffsetPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pixelOffset'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3BpcGVzL3BpeGVsLW9mZnNldC9waXhlbC1vZmZzZXQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFFcEQ7Ozs7Ozs7OztHQVNHO0FBSUgsTUFBTSxPQUFPLGVBQWU7SUFFMUIsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFVO1FBQzlCLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs2R0FKVSxlQUFlOzJHQUFmLGVBQWU7NEZBQWYsZUFBZTtrQkFIM0IsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsYUFBYTtpQkFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGV4YW1wbGVcbiAqIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgICAgICAgIHBpeGVsT2Zmc2V0IDogWy0xNSwyMF0gfCBwaXhlbE9mZnNldCxcbiAqICAgICAgICAgICAgdGV4dDogdHJhY2submFtZSxcbiAqICAgICAgICAgICAgZm9udDogJzE1cHggc2Fucy1zZXJpZidcbiAqICAgIH1cIj5cbiAqIDwvYWMtbGFiZWwtZGVzYz5cbiAqL1xuQFBpcGUoe1xuICBuYW1lOiAncGl4ZWxPZmZzZXQnXG59KVxuZXhwb3J0IGNsYXNzIFBpeGVsT2Zmc2V0UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG4gIH1cblxufVxuIl19
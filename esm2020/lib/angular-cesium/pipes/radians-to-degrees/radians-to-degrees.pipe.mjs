import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class RadiansToDegreesPipe {
    transform(value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    }
}
RadiansToDegreesPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RadiansToDegreesPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
RadiansToDegreesPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: RadiansToDegreesPipe, name: "radiansToDegrees" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: RadiansToDegreesPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'radiansToDegrees'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWFucy10by1kZWdyZWVzLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3BpcGVzL3JhZGlhbnMtdG8tZGVncmVlcy9yYWRpYW5zLXRvLWRlZ3JlZXMucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixTQUFTLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDOUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3pELENBQUM7O2tIQUpVLG9CQUFvQjtnSEFBcEIsb0JBQW9COzRGQUFwQixvQkFBb0I7a0JBSGhDLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGtCQUFrQjtpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3JhZGlhbnNUb0RlZ3JlZXMnXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlhbnNUb0RlZ3JlZXNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiAoMzYwIC0gTWF0aC5yb3VuZCgxODAgKiB2YWx1ZSAvIE1hdGguUEkpKSAlIDM2MDtcbiAgfVxuXG59XG4iXX0=
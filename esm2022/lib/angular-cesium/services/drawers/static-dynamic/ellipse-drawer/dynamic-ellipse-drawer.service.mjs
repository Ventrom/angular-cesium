import { Injectable } from '@angular/core';
import { Checker } from '../../../../utils/checker';
import { EllipsePrimitive } from 'primitive-primitives';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
export class DynamicEllipseDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
    }
    add(cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return super.add(new EllipsePrimitive(cesiumProps));
    }
    update(ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicEllipseDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicEllipseDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7O0FBRzVGOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLDJCQUE0QixTQUFRLHVCQUF1QjtJQUN0RSxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxXQUFnQjtRQUNsQixPQUFPLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRXhGLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFZLEVBQUUsV0FBZ0I7UUFDbkMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7OEdBZlUsMkJBQTJCO2tIQUEzQiwyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBRHZDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9jaGVja2VyJztcbmltcG9ydCB7IEVsbGlwc2VQcmltaXRpdmUgfSBmcm9tICdwcmltaXRpdmUtcHJpbWl0aXZlcyc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgZHluYW1pYyB2ZXJzaW9uIG9mIHRoZSBlbGxpcHNlIGNvbXBvbmVudC5cbiAqICBXZSBhcmUgdXNpbmcgdGhlIHByaW1pdGl2ZS1wcmltaXRpdmVzIGltcGxlbWVudGF0aW9uIG9mIGFuIGVsbGlwc2UuIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2dvdGVueGRzL1ByaW1pdGl2ZS1wcmltaXRpdmVzXG4gKiAgVGhpcyBhbGxvd3MgdXMgdG8gY2hhbmdlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxsaXBzZXMgd2l0aG91dCBjcmVhdGluZyBhIG5ldyBwcmltaXRpdmUgb2JqZWN0XG4gKiAgYXMgQ2VzaXVtIGRvZXMgbm90IGFsbG93IHVwZGF0aW5nIGFuIGVsbGlwc2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUHJpbWl0aXZlQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgQ2hlY2tlci50aHJvd0lmQW55Tm90UHJlc2VudChjZXNpdW1Qcm9wcywgWydjZW50ZXInLCAnc2VtaU1ham9yQXhpcycsICdzZW1pTWlub3JBeGlzJ10pO1xuXG4gICAgcmV0dXJuIHN1cGVyLmFkZChuZXcgRWxsaXBzZVByaW1pdGl2ZShjZXNpdW1Qcm9wcykpO1xuICB9XG5cbiAgdXBkYXRlKGVsbGlwc2U6IGFueSwgY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgZWxsaXBzZS51cGRhdGVMb2NhdGlvbkRhdGEoY2VzaXVtUHJvcHMpO1xuXG4gICAgcmV0dXJuIGVsbGlwc2U7XG4gIH1cbn1cbiJdfQ==
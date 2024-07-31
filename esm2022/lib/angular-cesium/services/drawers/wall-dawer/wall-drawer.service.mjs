import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible for drawing polygons.
 */
export class WallDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.wall);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: WallDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: WallDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: WallDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy93YWxsLWRhd2VyL3dhbGwtZHJhd2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUVuRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7OztBQUUzRTs7R0FFRztBQUVILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxxQkFBcUI7SUFDMUQsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDOzhHQUhVLGlCQUFpQjtrSEFBakIsaUJBQWlCOzsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudGl0aWVzLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudW1zL2dyYXBoaWNzLXR5cGUuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIHBvbHlnb25zLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2FsbERyYXdlclNlcnZpY2UgZXh0ZW5kcyBFbnRpdGllc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoY2VzaXVtU2VydmljZSwgR3JhcGhpY3NUeXBlLndhbGwpO1xuICB9XG59XG4iXX0=
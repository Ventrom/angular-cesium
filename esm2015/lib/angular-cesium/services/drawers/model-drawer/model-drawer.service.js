import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing models.
 */
export class ModelDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.model);
    }
}
ModelDrawerService.decorators = [
    { type: Injectable }
];
ModelDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvbW9kZWwtZHJhd2VyL21vZGVsLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUUzRTs7R0FFRztBQUVILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxxQkFBcUI7SUFDM0QsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7WUFKRixVQUFVOzs7WUFORixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudGl0aWVzLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudW1zL2dyYXBoaWNzLXR5cGUuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIG1vZGVscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1vZGVsRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUubW9kZWwpO1xuICB9XG59XG4iXX0=
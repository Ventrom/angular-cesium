/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing models.
 */
var ModelDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(ModelDrawerService, _super);
    function ModelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.model) || this;
    }
    ModelDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ModelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return ModelDrawerService;
}(EntitiesDrawerService));
export { ModelDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL21vZGVsLWRyYXdlci9tb2RlbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQzs7OztBQUszRTtJQUN3Qyw4Q0FBcUI7SUFDM0QsNEJBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDMUMsQ0FBQzs7Z0JBSkYsVUFBVTs7OztnQkFORixhQUFhOztJQVd0Qix5QkFBQztDQUFBLEFBTEQsQ0FDd0MscUJBQXFCLEdBSTVEO1NBSlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudGl0aWVzLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudW1zL2dyYXBoaWNzLXR5cGUuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIG1vZGVscy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1vZGVsRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUubW9kZWwpO1xuICB9XG59XG4iXX0=
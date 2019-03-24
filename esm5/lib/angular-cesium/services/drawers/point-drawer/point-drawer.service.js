/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing points.
 */
var PointDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(PointDrawerService, _super);
    function PointDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.point) || this;
    }
    PointDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PointDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PointDrawerService;
}(EntitiesDrawerService));
export { PointDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQzs7OztBQUszRTtJQUN3Qyw4Q0FBcUI7SUFDM0QsNEJBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDMUMsQ0FBQzs7Z0JBSkYsVUFBVTs7OztnQkFQRixhQUFhOztJQVl0Qix5QkFBQztDQUFBLEFBTEQsQ0FDd0MscUJBQXFCLEdBSTVEO1NBSlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudW1zL2dyYXBoaWNzLXR5cGUuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIHBvaW50cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvaW50RHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUucG9pbnQpO1xuICB9XG59XG4iXX0=
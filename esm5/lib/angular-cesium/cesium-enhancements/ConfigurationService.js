/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';
/** @type {?} */
export var ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(config) {
        this.config = config;
        /** @type {?} */
        var fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
    ConfigurationService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ConfigurationService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
    ]; };
    return ConfigurationService;
}());
export { ConfigurationService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ConfigurationService.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUV0RSxNQUFNLEtBQU8scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUM7QUFFaEY7SUFFRSw4QkFBK0QsTUFBVztRQUFYLFdBQU0sR0FBTixNQUFNLENBQUs7O1lBQ2xFLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3BFLElBQUksa0JBQWtCLEtBQUssS0FBSyxFQUFFO1lBQ2hDLHdCQUF3QixFQUFFLENBQUM7U0FDNUI7SUFDSCxDQUFDOztnQkFQRixVQUFVOzs7O2dEQUVJLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOztJQU12RCwyQkFBQztDQUFBLEFBUkQsSUFRQztTQVBZLG9CQUFvQjs7Ozs7O0lBQ25CLHNDQUE4RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MgfSBmcm9tICcuL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaCc7XG5cbmV4cG9ydCBjb25zdCBBTkdVTEFSX0NFU0lVTV9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0FOR1VMQVJfQ0VTSVVNX0NPTkZJRycpO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KEFOR1VMQVJfQ0VTSVVNX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IGFueSkge1xuICAgIGNvbnN0IGZpeEVudGl0aWVzU2hhZG93cyA9IGNvbmZpZyA/IGNvbmZpZy5maXhFbnRpdGllc1NoYWRvd3MgOiB0cnVlO1xuICAgIGlmIChmaXhFbnRpdGllc1NoYWRvd3MgIT09IGZhbHNlKSB7XG4gICAgICBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
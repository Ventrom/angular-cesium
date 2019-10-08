/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';
/** @type {?} */
export const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
export class ConfigurationService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.config = config;
        /** @type {?} */
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
}
ConfigurationService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ConfigurationService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    ConfigurationService.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUV0RSxNQUFNLE9BQU8scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUM7QUFHaEYsTUFBTSxPQUFPLG9CQUFvQjs7OztJQUMvQixZQUErRCxNQUFXO1FBQVgsV0FBTSxHQUFOLE1BQU0sQ0FBSzs7Y0FDbEUsa0JBQWtCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDcEUsSUFBSSxrQkFBa0IsS0FBSyxLQUFLLEVBQUU7WUFDaEMsd0JBQXdCLEVBQUUsQ0FBQztTQUM1QjtJQUNILENBQUM7OztZQVBGLFVBQVU7Ozs7NENBRUksUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozs7Ozs7SUFBekMsc0NBQThEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZpeENlc2l1bUVudGl0aWVzU2hhZG93cyB9IGZyb20gJy4vU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoJztcblxuZXhwb3J0IGNvbnN0IEFOR1VMQVJfQ0VTSVVNX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignQU5HVUxBUl9DRVNJVU1fQ09ORklHJyk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5HVUxBUl9DRVNJVU1fQ09ORklHKSBwcml2YXRlIGNvbmZpZzogYW55KSB7XG4gICAgY29uc3QgZml4RW50aXRpZXNTaGFkb3dzID0gY29uZmlnID8gY29uZmlnLmZpeEVudGl0aWVzU2hhZG93cyA6IHRydWU7XG4gICAgaWYgKGZpeEVudGl0aWVzU2hhZG93cyAhPT0gZmFsc2UpIHtcbiAgICAgIGZpeENlc2l1bUVudGl0aWVzU2hhZG93cygpO1xuICAgIH1cbiAgfVxufVxuIl19
import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';
export const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
let ConfigurationService = class ConfigurationService {
    constructor(config) {
        this.config = config;
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
};
ConfigurationService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ANGULAR_CESIUM_CONFIG,] }] }
];
ConfigurationService = __decorate([
    Injectable(),
    __param(0, Optional()), __param(0, Inject(ANGULAR_CESIUM_CONFIG)),
    __metadata("design:paramtypes", [Object])
], ConfigurationService);
export { ConfigurationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXRFLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFHakYsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFDL0IsWUFBK0QsTUFBVztRQUFYLFdBQU0sR0FBTixNQUFNLENBQUs7UUFDeEUsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3JFLElBQUksa0JBQWtCLEtBQUssS0FBSyxFQUFFO1lBQ2hDLHdCQUF3QixFQUFFLENBQUM7U0FDNUI7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7NENBTmMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7O0FBRDFDLG9CQUFvQjtJQURoQyxVQUFVLEVBQUU7SUFFRSxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7R0FEM0Msb0JBQW9CLENBT2hDO1NBUFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZpeENlc2l1bUVudGl0aWVzU2hhZG93cyB9IGZyb20gJy4vU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoJztcblxuZXhwb3J0IGNvbnN0IEFOR1VMQVJfQ0VTSVVNX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignQU5HVUxBUl9DRVNJVU1fQ09ORklHJyk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5HVUxBUl9DRVNJVU1fQ09ORklHKSBwcml2YXRlIGNvbmZpZzogYW55KSB7XG4gICAgY29uc3QgZml4RW50aXRpZXNTaGFkb3dzID0gY29uZmlnID8gY29uZmlnLmZpeEVudGl0aWVzU2hhZG93cyA6IHRydWU7XG4gICAgaWYgKGZpeEVudGl0aWVzU2hhZG93cyAhPT0gZmFsc2UpIHtcbiAgICAgIGZpeENlc2l1bUVudGl0aWVzU2hhZG93cygpO1xuICAgIH1cbiAgfVxufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PolygonsEditorComponent } from './components/polygons-editor/polygons-editor.component';
import { CirclesEditorComponent } from './components/circles-editor/circles-editor.component';
import { EllipsesEditorComponent } from './components/ellipses-editor/ellipses-editor.component';
import { PolylinesEditorComponent } from './components/polylines-editor/polylines-editor.component';
import { HippodromeEditorComponent } from './components/hippodrome-editor/hippodrome-editor.component';
import { DraggableToMapDirective } from './directives/draggable-to-map.directive';
import { DraggableToMapService } from './services/draggable-to-map.service';
import { AcToolbarComponent } from './components/toolbar/ac-toolbar/ac-toolbar.component';
import { DragIconComponent } from './components/toolbar/ac-toolbar/drag-icon.component';
import { AcToolbarButtonComponent } from './components/toolbar/ac-toolbar-button/ac-toolbar-button.component';
import { RangeAndBearingComponent } from './components/range-and-bearing/range-and-bearing.component';
import { ZoomToRectangleService } from './services/zoom-to-rectangle.service';
export class AngularCesiumWidgetsModule {
}
AngularCesiumWidgetsModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, AngularCesiumModule],
                declarations: [
                    HippodromeEditorComponent,
                    PolygonsEditorComponent,
                    CirclesEditorComponent,
                    EllipsesEditorComponent,
                    PolylinesEditorComponent,
                    DraggableToMapDirective,
                    DragIconComponent,
                    AcToolbarComponent,
                    AcToolbarButtonComponent,
                    RangeAndBearingComponent,
                ],
                exports: [
                    HippodromeEditorComponent,
                    PolygonsEditorComponent,
                    CirclesEditorComponent,
                    EllipsesEditorComponent,
                    PolylinesEditorComponent,
                    DraggableToMapDirective,
                    AcToolbarComponent,
                    AcToolbarButtonComponent,
                    RangeAndBearingComponent,
                ],
                providers: [
                    DraggableToMapService,
                    ZoomToRectangleService,
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM5RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNsRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN4RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQztBQUM5RyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN0RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQWdDOUUsTUFBTSxPQUFPLDBCQUEwQjs7O1lBOUJ0QyxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2dCQUM1QyxZQUFZLEVBQUU7b0JBQ1oseUJBQXlCO29CQUN6Qix1QkFBdUI7b0JBQ3ZCLHNCQUFzQjtvQkFDdEIsdUJBQXVCO29CQUN2Qix3QkFBd0I7b0JBQ3hCLHVCQUF1QjtvQkFDdkIsaUJBQWlCO29CQUNqQixrQkFBa0I7b0JBQ2xCLHdCQUF3QjtvQkFDeEIsd0JBQXdCO2lCQUN6QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AseUJBQXlCO29CQUN6Qix1QkFBdUI7b0JBQ3ZCLHNCQUFzQjtvQkFDdEIsdUJBQXVCO29CQUN2Qix3QkFBd0I7b0JBQ3hCLHVCQUF1QjtvQkFDdkIsa0JBQWtCO29CQUNsQix3QkFBd0I7b0JBQ3hCLHdCQUF3QjtpQkFDekI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULHFCQUFxQjtvQkFDckIsc0JBQXNCO2lCQUN2QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBbmd1bGFyQ2VzaXVtTW9kdWxlIH0gZnJvbSAnLi4vYW5ndWxhci1jZXNpdW0vYW5ndWxhci1jZXNpdW0ubW9kdWxlJztcbmltcG9ydCB7IFBvbHlnb25zRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IENpcmNsZXNFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wb2x5bGluZXMtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RyYWdnYWJsZS10by1tYXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlJztcbmltcG9ydCB7IEFjVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXIvYWMtdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJhZ0ljb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2RyYWctaWNvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci1idXR0b24vYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9yYW5nZS1hbmQtYmVhcmluZy9yYW5nZS1hbmQtYmVhcmluZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgWm9vbVRvUmVjdGFuZ2xlU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvem9vbS10by1yZWN0YW5nbGUuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEFuZ3VsYXJDZXNpdW1Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBIaXBwb2Ryb21lRWRpdG9yQ29tcG9uZW50LFxuICAgIFBvbHlnb25zRWRpdG9yQ29tcG9uZW50LFxuICAgIENpcmNsZXNFZGl0b3JDb21wb25lbnQsXG4gICAgRWxsaXBzZXNFZGl0b3JDb21wb25lbnQsXG4gICAgUG9seWxpbmVzRWRpdG9yQ29tcG9uZW50LFxuICAgIERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlLFxuICAgIERyYWdJY29uQ29tcG9uZW50LFxuICAgIEFjVG9vbGJhckNvbXBvbmVudCxcbiAgICBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQsXG4gICAgUmFuZ2VBbmRCZWFyaW5nQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgSGlwcG9kcm9tZUVkaXRvckNvbXBvbmVudCxcbiAgICBQb2x5Z29uc0VkaXRvckNvbXBvbmVudCxcbiAgICBDaXJjbGVzRWRpdG9yQ29tcG9uZW50LFxuICAgIEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50LFxuICAgIFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCxcbiAgICBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSxcbiAgICBBY1Rvb2xiYXJDb21wb25lbnQsXG4gICAgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50LFxuICAgIFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlLFxuICAgIFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckNlc2l1bVdpZGdldHNNb2R1bGUge1xufVxuIl19
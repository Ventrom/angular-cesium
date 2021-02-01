import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularCesiumModule } from '../angular-cesium/angular-cesium.module';
import { PointsEditorComponent } from './components/points-editor/points-editor.component';
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
import { RectanglesEditorComponent } from './components/rectangles-editor/rectangles-editor.component';
var AngularCesiumWidgetsModule = /** @class */ (function () {
    function AngularCesiumWidgetsModule() {
    }
    AngularCesiumWidgetsModule = __decorate([
        NgModule({
            imports: [CommonModule, AngularCesiumModule],
            declarations: [
                PointsEditorComponent,
                HippodromeEditorComponent,
                PolygonsEditorComponent,
                RectanglesEditorComponent,
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
                PointsEditorComponent,
                HippodromeEditorComponent,
                PolygonsEditorComponent,
                RectanglesEditorComponent,
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
        })
    ], AngularCesiumWidgetsModule);
    return AngularCesiumWidgetsModule;
}());
export { AngularCesiumWidgetsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM5RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNsRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN4RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQztBQUM5RyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN0RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQW9Ddkc7SUFBQTtJQUNBLENBQUM7SUFEWSwwQkFBMEI7UUFsQ3RDLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQztZQUM1QyxZQUFZLEVBQUU7Z0JBQ1oscUJBQXFCO2dCQUNyQix5QkFBeUI7Z0JBQ3pCLHVCQUF1QjtnQkFDdkIseUJBQXlCO2dCQUN6QixzQkFBc0I7Z0JBQ3RCLHVCQUF1QjtnQkFDdkIsd0JBQXdCO2dCQUN4Qix1QkFBdUI7Z0JBQ3ZCLGlCQUFpQjtnQkFDakIsa0JBQWtCO2dCQUNsQix3QkFBd0I7Z0JBQ3hCLHdCQUF3QjthQUN6QjtZQUNELE9BQU8sRUFBRTtnQkFDUCxxQkFBcUI7Z0JBQ3JCLHlCQUF5QjtnQkFDekIsdUJBQXVCO2dCQUN2Qix5QkFBeUI7Z0JBQ3pCLHNCQUFzQjtnQkFDdEIsdUJBQXVCO2dCQUN2Qix3QkFBd0I7Z0JBQ3hCLHVCQUF1QjtnQkFDdkIsa0JBQWtCO2dCQUNsQix3QkFBd0I7Z0JBQ3hCLHdCQUF3QjthQUN6QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxxQkFBcUI7Z0JBQ3JCLHNCQUFzQjthQUN2QjtTQUNGLENBQUM7T0FDVywwQkFBMEIsQ0FDdEM7SUFBRCxpQ0FBQztDQUFBLEFBREQsSUFDQztTQURZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQW5ndWxhckNlc2l1bU1vZHVsZSB9IGZyb20gJy4uL2FuZ3VsYXItY2VzaXVtL2FuZ3VsYXItY2VzaXVtLm1vZHVsZSc7XG5pbXBvcnQgeyBQb2ludHNFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcG9pbnRzLWVkaXRvci9wb2ludHMtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQb2x5Z29uc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wb2x5Z29ucy1lZGl0b3IvcG9seWdvbnMtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaXJjbGVzRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbGxpcHNlc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbGxpcHNlcy1lZGl0b3IvZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQb2x5bGluZXNFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcG9seWxpbmVzLWVkaXRvci9wb2x5bGluZXMtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2hpcHBvZHJvbWUtZWRpdG9yL2hpcHBvZHJvbWUtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9kcmFnZ2FibGUtdG8tbWFwLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVUb01hcFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RyYWdnYWJsZS10by1tYXAuc2VydmljZSc7XG5pbXBvcnQgeyBBY1Rvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2FjLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IERyYWdJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci9kcmFnLWljb24uY29tcG9uZW50JztcbmltcG9ydCB7IEFjVG9vbGJhckJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXItYnV0dG9uL2FjLXRvb2xiYXItYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcmFuZ2UtYW5kLWJlYXJpbmcvcmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50JztcbmltcG9ydCB7IFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3pvb20tdG8tcmVjdGFuZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9yZWN0YW5nbGVzLWVkaXRvci9yZWN0YW5nbGVzLWVkaXRvci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBBbmd1bGFyQ2VzaXVtTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgUG9pbnRzRWRpdG9yQ29tcG9uZW50LFxuICAgIEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQsXG4gICAgUG9seWdvbnNFZGl0b3JDb21wb25lbnQsXG4gICAgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCxcbiAgICBDaXJjbGVzRWRpdG9yQ29tcG9uZW50LFxuICAgIEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50LFxuICAgIFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCxcbiAgICBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSxcbiAgICBEcmFnSWNvbkNvbXBvbmVudCxcbiAgICBBY1Rvb2xiYXJDb21wb25lbnQsXG4gICAgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50LFxuICAgIFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFBvaW50c0VkaXRvckNvbXBvbmVudCxcbiAgICBIaXBwb2Ryb21lRWRpdG9yQ29tcG9uZW50LFxuICAgIFBvbHlnb25zRWRpdG9yQ29tcG9uZW50LFxuICAgIFJlY3RhbmdsZXNFZGl0b3JDb21wb25lbnQsXG4gICAgQ2lyY2xlc0VkaXRvckNvbXBvbmVudCxcbiAgICBFbGxpcHNlc0VkaXRvckNvbXBvbmVudCxcbiAgICBQb2x5bGluZXNFZGl0b3JDb21wb25lbnQsXG4gICAgRHJhZ2dhYmxlVG9NYXBEaXJlY3RpdmUsXG4gICAgQWNUb29sYmFyQ29tcG9uZW50LFxuICAgIEFjVG9vbGJhckJ1dHRvbkNvbXBvbmVudCxcbiAgICBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQsXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIERyYWdnYWJsZVRvTWFwU2VydmljZSxcbiAgICBab29tVG9SZWN0YW5nbGVTZXJ2aWNlLFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJDZXNpdW1XaWRnZXRzTW9kdWxlIHtcbn1cbiJdfQ==
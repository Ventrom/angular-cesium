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
import * as i0 from "@angular/core";
export class AngularCesiumWidgetsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AngularCesiumWidgetsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.1.2", ngImport: i0, type: AngularCesiumWidgetsModule, declarations: [PointsEditorComponent,
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
            RangeAndBearingComponent], imports: [CommonModule, AngularCesiumModule], exports: [PointsEditorComponent,
            HippodromeEditorComponent,
            PolygonsEditorComponent,
            RectanglesEditorComponent,
            CirclesEditorComponent,
            EllipsesEditorComponent,
            PolylinesEditorComponent,
            DraggableToMapDirective,
            AcToolbarComponent,
            AcToolbarButtonComponent,
            RangeAndBearingComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AngularCesiumWidgetsModule, providers: [
            DraggableToMapService,
            ZoomToRectangleService,
        ], imports: [CommonModule, AngularCesiumModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AngularCesiumWidgetsModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDM0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDOUYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDcEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdkcsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDMUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDOUcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDdEcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7O0FBb0N2RyxNQUFNLE9BQU8sMEJBQTBCOzhHQUExQiwwQkFBMEI7K0dBQTFCLDBCQUEwQixpQkEvQm5DLHFCQUFxQjtZQUNyQix5QkFBeUI7WUFDekIsdUJBQXVCO1lBQ3ZCLHlCQUF5QjtZQUN6QixzQkFBc0I7WUFDdEIsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtZQUN4Qix1QkFBdUI7WUFDdkIsaUJBQWlCO1lBQ2pCLGtCQUFrQjtZQUNsQix3QkFBd0I7WUFDeEIsd0JBQXdCLGFBYmhCLFlBQVksRUFBRSxtQkFBbUIsYUFnQnpDLHFCQUFxQjtZQUNyQix5QkFBeUI7WUFDekIsdUJBQXVCO1lBQ3ZCLHlCQUF5QjtZQUN6QixzQkFBc0I7WUFDdEIsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtZQUN4Qix1QkFBdUI7WUFDdkIsa0JBQWtCO1lBQ2xCLHdCQUF3QjtZQUN4Qix3QkFBd0I7K0dBT2YsMEJBQTBCLGFBTDFCO1lBQ1QscUJBQXFCO1lBQ3JCLHNCQUFzQjtTQUN2QixZQS9CUyxZQUFZLEVBQUUsbUJBQW1COzsyRkFpQ2hDLDBCQUEwQjtrQkFsQ3RDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDO29CQUM1QyxZQUFZLEVBQUU7d0JBQ1oscUJBQXFCO3dCQUNyQix5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIseUJBQXlCO3dCQUN6QixzQkFBc0I7d0JBQ3RCLHVCQUF1Qjt3QkFDdkIsd0JBQXdCO3dCQUN4Qix1QkFBdUI7d0JBQ3ZCLGlCQUFpQjt3QkFDakIsa0JBQWtCO3dCQUNsQix3QkFBd0I7d0JBQ3hCLHdCQUF3QjtxQkFDekI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLHFCQUFxQjt3QkFDckIseUJBQXlCO3dCQUN6Qix1QkFBdUI7d0JBQ3ZCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3dCQUN0Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2QixrQkFBa0I7d0JBQ2xCLHdCQUF3Qjt3QkFDeEIsd0JBQXdCO3FCQUN6QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QscUJBQXFCO3dCQUNyQixzQkFBc0I7cUJBQ3ZCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBbmd1bGFyQ2VzaXVtTW9kdWxlIH0gZnJvbSAnLi4vYW5ndWxhci1jZXNpdW0vYW5ndWxhci1jZXNpdW0ubW9kdWxlJztcbmltcG9ydCB7IFBvaW50c0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wb2ludHMtZWRpdG9yL3BvaW50cy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBvbHlnb25zRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BvbHlnb25zLWVkaXRvci9wb2x5Z29ucy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IENpcmNsZXNFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY2xlcy1lZGl0b3IvY2lyY2xlcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wb2x5bGluZXMtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaGlwcG9kcm9tZS1lZGl0b3IvaGlwcG9kcm9tZS1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RyYWdnYWJsZS10by1tYXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlJztcbmltcG9ydCB7IEFjVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXIvYWMtdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHJhZ0ljb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2RyYWctaWNvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci1idXR0b24vYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9yYW5nZS1hbmQtYmVhcmluZy9yYW5nZS1hbmQtYmVhcmluZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgWm9vbVRvUmVjdGFuZ2xlU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvem9vbS10by1yZWN0YW5nbGUuc2VydmljZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVzRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3JlY3RhbmdsZXMtZWRpdG9yL3JlY3RhbmdsZXMtZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEFuZ3VsYXJDZXNpdW1Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBQb2ludHNFZGl0b3JDb21wb25lbnQsXG4gICAgSGlwcG9kcm9tZUVkaXRvckNvbXBvbmVudCxcbiAgICBQb2x5Z29uc0VkaXRvckNvbXBvbmVudCxcbiAgICBSZWN0YW5nbGVzRWRpdG9yQ29tcG9uZW50LFxuICAgIENpcmNsZXNFZGl0b3JDb21wb25lbnQsXG4gICAgRWxsaXBzZXNFZGl0b3JDb21wb25lbnQsXG4gICAgUG9seWxpbmVzRWRpdG9yQ29tcG9uZW50LFxuICAgIERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlLFxuICAgIERyYWdJY29uQ29tcG9uZW50LFxuICAgIEFjVG9vbGJhckNvbXBvbmVudCxcbiAgICBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQsXG4gICAgUmFuZ2VBbmRCZWFyaW5nQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgUG9pbnRzRWRpdG9yQ29tcG9uZW50LFxuICAgIEhpcHBvZHJvbWVFZGl0b3JDb21wb25lbnQsXG4gICAgUG9seWdvbnNFZGl0b3JDb21wb25lbnQsXG4gICAgUmVjdGFuZ2xlc0VkaXRvckNvbXBvbmVudCxcbiAgICBDaXJjbGVzRWRpdG9yQ29tcG9uZW50LFxuICAgIEVsbGlwc2VzRWRpdG9yQ29tcG9uZW50LFxuICAgIFBvbHlsaW5lc0VkaXRvckNvbXBvbmVudCxcbiAgICBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSxcbiAgICBBY1Rvb2xiYXJDb21wb25lbnQsXG4gICAgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50LFxuICAgIFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudCxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlLFxuICAgIFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckNlc2l1bVdpZGdldHNNb2R1bGUge1xufVxuIl19
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
export class AcDefaultPlonterComponent {
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
    }
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
}
AcDefaultPlonterComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-default-plonter',
                template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [CoordinateConverter],
                styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `]
            },] }
];
AcDefaultPlonterComponent.ctorParameters = () => [
    { type: PlonterService },
    { type: ChangeDetectorRef },
    { type: CoordinateConverter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1kZWZhdWx0LXBsb250ZXIvYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQXNDdkcsTUFBTSxPQUFPLHlCQUF5QjtJQUVwQyxZQUFtQixjQUE4QixFQUM3QixFQUFxQixFQUNyQixZQUFpQztRQUZsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDN0IsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQXFCO0lBQ3JELENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxJQUFJLGVBQWU7UUFDakIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRTtZQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQztZQUN2RSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQVc7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7O1lBeERGLFNBQVMsU0FDUjtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0tBV1Q7Z0JBa0JELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzt5QkFsQnZCOzs7Ozs7Ozs7Ozs7Ozs7O0tBZ0JSO2FBR0Y7OztZQXJDTSxjQUFjO1lBRFcsaUJBQWlCO1lBRTFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KFxuICB7XG4gICAgc2VsZWN0b3I6ICdhYy1kZWZhdWx0LXBsb250ZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8YWMtaHRtbCAqbmdJZj1cInBsb250ZXJTZXJ2aWNlLnBsb250ZXJTaG93blwiIFtwcm9wc109XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwbG9udGVyUG9zaXRpb25cbiAgICAgIH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBsb250ZXItY29udGV4dC1tZW51XCI+XG4gICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgZW50aXR5IG9mIHBsb250ZXJTZXJ2aWNlLmVudGl0ZXNUb1Bsb250ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwbG9udGVyLWl0ZW1cIiAoY2xpY2spPVwiY2hvb3NlRW50aXR5KGVudGl0eSlcIj57eyBlbnRpdHk/Lm5hbWUgfHwgZW50aXR5Py5pZCB9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hYy1odG1sPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICAucGxvbnRlci1jb250ZXh0LW1lbnUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTAsIDI1MCwgMjUwLCAwLjgpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMXB4IDFweCA1cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIH1cblxuICAgICAgICAucGxvbnRlci1pdGVtIHtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDJweCAxNXB4O1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICAucGxvbnRlci1pdGVtOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIH1cblxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXJdLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNEZWZhdWx0UGxvbnRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBsb250ZXJTZXJ2aWNlOiBQbG9udGVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgZ2VvQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJDaGFuZ2VOb3RpZmllci5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCkpO1xuICB9XG5cbiAgZ2V0IHBsb250ZXJQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyU2hvd24pIHtcbiAgICAgIGNvbnN0IHNjcmVlblBvcyA9IHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNsaWNrUG9zaXRpb24uZW5kUG9zaXRpb247XG4gICAgICByZXR1cm4gdGhpcy5nZW9Db252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvcyk7XG4gICAgfVxuICB9XG5cbiAgY2hvb3NlRW50aXR5KGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5wbG9udGVyU2VydmljZS5yZXNvbHZlUGxvbnRlcihlbnRpdHkpO1xuICB9XG59XG4iXX0=
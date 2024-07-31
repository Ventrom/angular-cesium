import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { map, merge, takeUntil, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../../angular-cesium/services/maps-manager/maps-manager.service";
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
export class DraggableToMapService {
    constructor(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    setCoordinateConverter(coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    }
    drag(imageSrc, style) {
        if (!this.coordinateConverter) {
            const mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.style.position = 'fixed';
        imgElement.style.visibility = 'hidden';
        imgElement.style.width = '30px';
        imgElement.style.height = '30px';
        imgElement.style['user-drag'] = 'none';
        imgElement.style['user-select'] = 'none';
        imgElement.style['-moz-user-select'] = 'none';
        imgElement.style['-webkit-user-drag'] = 'none';
        imgElement.style['-webkit-user-select'] = 'none';
        imgElement.style['-ms-user-select'] = 'none';
        Object.assign(imgElement.style, style);
        document.body.appendChild(imgElement);
        this.createDragObservable();
        this.dragObservable.subscribe((e) => {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }, (e) => {
            imgElement.remove();
        }, () => {
            imgElement.remove();
        });
    }
    dragUpdates() {
        return this.mainSubject;
    }
    cancel() {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    }
    createDragObservable() {
        const stopper = new Subject();
        const dropSubject = new Subject();
        const pointerUp = observableFromEvent(document, 'pointerup');
        const pointerMove = observableFromEvent(document, 'pointermove');
        let dragStartPositionX;
        let dragStartPositionY;
        let lastMove;
        const moveObservable = pointerMove.pipe(map((e) => {
            dragStartPositionX = dragStartPositionX ? dragStartPositionX : e.x;
            dragStartPositionY = dragStartPositionY ? dragStartPositionY : e.y;
            lastMove = {
                drop: false,
                initialScreenPosition: {
                    x: dragStartPositionX,
                    y: dragStartPositionY,
                },
                screenPosition: {
                    x: e.x,
                    y: e.y,
                },
                mapPosition: this.coordinateConverter ?
                    this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        }), takeUntil(pointerUp), tap(undefined, undefined, () => {
            if (lastMove) {
                const dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        }));
        this.dragObservable = moveObservable.pipe(merge(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DraggableToMapService, deps: [{ token: DOCUMENT }, { token: i1.MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DraggableToMapService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DraggableToMapService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.MapsManagerService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2RyYWdnYWJsZS10by1tYXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxJQUFJLG1CQUFtQixFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RSxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFhM0M7OztHQUdHO0FBR0gsTUFBTSxPQUFPLHFCQUFxQjtJQU9oQyxZQUFzQyxRQUFhLEVBQVUsV0FBK0I7UUFBdEQsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUZwRixnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO0lBR25ELENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxtQkFBd0M7UUFDN0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFJLENBQUMsUUFBZ0IsRUFBRSxLQUFXO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQy9DLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNu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LENBQUM7Z0JBQzlDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBRyxDQUFDO1FBRVIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUcsQ0FBQztRQUNwRixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDOzhHQTNHVSxxQkFBcUIsa0JBT1osUUFBUTtrSEFQakIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQURqQyxVQUFVOzswQkFRSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tRXZlbnQgYXMgb2JzZXJ2YWJsZUZyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBtYXAsIG1lcmdlLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy92ZWMyJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEljb25EcmFnRXZlbnQge1xuICBpbml0aWFsU2NyZWVuUG9zaXRpb246IFZlYzI7XG4gIHNjcmVlblBvc2l0aW9uOiBWZWMyO1xuICBtYXBQb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgZHJvcDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgU2VydmljZSBpcyB1c2VkIHRvIHByZWZvcm0sIGhhbmRsZSBhbmQgc3Vic2NyaWJlIHRvIGljb24gZHJhZ2dpbmcgd2hlbiB1c2luZyB0aGUgYERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlYC5cbiAqIEZvciBtb3JlIGluZm8gY2hlY2sgYERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlYCBkb2NzLlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVUb01hcFNlcnZpY2Uge1xuXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBkcmFnT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxJY29uRHJhZ0V2ZW50PjtcbiAgcHJpdmF0ZSBzdG9wcGVyOiBTdWJqZWN0PGFueT47XG4gIHByaXZhdGUgbWFpblN1YmplY3QgPSBuZXcgU3ViamVjdDxJY29uRHJhZ0V2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSwgcHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlKSB7XG4gIH1cblxuICBzZXRDb29yZGluYXRlQ29udmVydGVyKGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICB9XG5cbiAgZHJhZyhpbWFnZVNyYzogc3RyaW5nLCBzdHlsZT86IGFueSkge1xuICAgIGlmICghdGhpcy5jb29yZGluYXRlQ29udmVydGVyKSB7XG4gICAgICBjb25zdCBtYXBDb21wb25lbnQgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcCgpO1xuICAgICAgaWYgKG1hcENvbXBvbmVudCkge1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBtYXBDb21wb25lbnQuZ2V0Q29vcmRpbmF0ZUNvbnZlcnRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIGNvbnN0IGltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdFbGVtZW50LnNyYyA9IGltYWdlU3JjO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUud2lkdGggPSAnMzBweCc7XG4gICAgaW1nRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMzBweCc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsndXNlci1kcmFnJ10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsndXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctbW96LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLWRyYWcnXSA9ICdub25lJztcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctd2Via2l0LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLW1zLXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgT2JqZWN0LmFzc2lnbihpbWdFbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWdFbGVtZW50KTtcblxuICAgIHRoaXMuY3JlYXRlRHJhZ09ic2VydmFibGUoKTtcbiAgICB0aGlzLmRyYWdPYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICAgIChlKSA9PiB7XG4gICAgICAgIGltZ0VsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgaW1nRWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5zY3JlZW5Qb3NpdGlvbi54IC0gaW1nRWxlbWVudC5jbGllbnRXaWR0aCAvIDIgKyAncHgnO1xuICAgICAgICBpbWdFbGVtZW50LnN0eWxlLnRvcCA9IGUuc2NyZWVuUG9zaXRpb24ueSAtIGltZ0VsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMiArICdweCc7XG4gICAgICAgIHRoaXMubWFpblN1YmplY3QubmV4dChlKTtcbiAgICAgICAgaWYgKGUuZHJvcCkge1xuICAgICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoZTogYW55KSA9PiB7XG4gICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICBpbWdFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBkcmFnVXBkYXRlcygpOiBPYnNlcnZhYmxlPEljb25EcmFnRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5tYWluU3ViamVjdDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5zdG9wcGVyKSB7XG4gICAgICB0aGlzLnN0b3BwZXIubmV4dCh0cnVlKTtcbiAgICAgIHRoaXMuc3RvcHBlciA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZHJhZ09ic2VydmFibGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEcmFnT2JzZXJ2YWJsZSgpIHtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBkcm9wU3ViamVjdCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBjb25zdCBwb2ludGVyVXAgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAncG9pbnRlcnVwJyk7XG4gICAgY29uc3QgcG9pbnRlck1vdmUgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAncG9pbnRlcm1vdmUnKTtcblxuICAgIGxldCBkcmFnU3RhcnRQb3NpdGlvblg6IG51bWJlcjtcbiAgICBsZXQgZHJhZ1N0YXJ0UG9zaXRpb25ZOiBudW1iZXI7XG4gICAgbGV0IGxhc3RNb3ZlOiBhbnk7XG4gICAgY29uc3QgbW92ZU9ic2VydmFibGUgPSBwb2ludGVyTW92ZS5waXBlKG1hcCgoZTogYW55KSA9PiB7XG4gICAgICAgIGRyYWdTdGFydFBvc2l0aW9uWCA9IGRyYWdTdGFydFBvc2l0aW9uWCA/IGRyYWdTdGFydFBvc2l0aW9uWCA6IGUueDtcbiAgICAgICAgZHJhZ1N0YXJ0UG9zaXRpb25ZID0gZHJhZ1N0YXJ0UG9zaXRpb25ZID8gZHJhZ1N0YXJ0UG9zaXRpb25ZIDogZS55O1xuICAgICAgICBsYXN0TW92ZSA9IHtcbiAgICAgICAgICBkcm9wOiBmYWxzZSxcbiAgICAgICAgICBpbml0aWFsU2NyZWVuUG9zaXRpb246IHtcbiAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcbiAgICAgICAgICAgIHk6IGRyYWdTdGFydFBvc2l0aW9uWSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNjcmVlblBvc2l0aW9uOiB7XG4gICAgICAgICAgICB4OiBlLngsXG4gICAgICAgICAgICB5OiBlLnksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtYXBQb3NpdGlvbjogdGhpcy5jb29yZGluYXRlQ29udmVydGVyID9cbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoe3g6IGUueCwgeTogZS55fSkgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsYXN0TW92ZTtcbiAgICAgIH0pLFxuICAgICAgdGFrZVVudGlsKHBvaW50ZXJVcCksXG4gICAgICB0YXAodW5kZWZpbmVkLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgaWYgKGxhc3RNb3ZlKSB7XG4gICAgICAgICAgY29uc3QgZHJvcEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgbGFzdE1vdmUpO1xuICAgICAgICAgIGRyb3BFdmVudC5kcm9wID0gdHJ1ZTtcbiAgICAgICAgICBkcm9wU3ViamVjdC5uZXh0KGRyb3BFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pLCApO1xuXG4gICAgdGhpcy5kcmFnT2JzZXJ2YWJsZSA9IG1vdmVPYnNlcnZhYmxlLnBpcGUobWVyZ2UoZHJvcFN1YmplY3QpLCB0YWtlVW50aWwoc3RvcHBlciksICk7XG4gICAgdGhpcy5zdG9wcGVyID0gc3RvcHBlcjtcbiAgfVxufVxuIl19
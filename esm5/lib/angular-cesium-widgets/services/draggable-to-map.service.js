import { __decorate, __metadata, __param } from "tslib";
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { map, merge, takeUntil, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
var DraggableToMapService = /** @class */ (function () {
    function DraggableToMapService(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    DraggableToMapService.prototype.setCoordinateConverter = function (coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    };
    DraggableToMapService.prototype.drag = function (imageSrc, style) {
        var _this = this;
        if (!this.coordinateConverter) {
            var mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        var imgElement = document.createElement('img');
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
        this.dragObservable.subscribe(function (e) {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            _this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }, function (e) {
            imgElement.remove();
        }, function () {
            imgElement.remove();
        });
    };
    DraggableToMapService.prototype.dragUpdates = function () {
        return this.mainSubject;
    };
    DraggableToMapService.prototype.cancel = function () {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    };
    DraggableToMapService.prototype.createDragObservable = function () {
        var _this = this;
        var stopper = new Subject();
        var dropSubject = new Subject();
        var pointerUp = observableFromEvent(document, 'pointerup');
        var pointerMove = observableFromEvent(document, 'pointermove');
        var dragStartPositionX;
        var dragStartPositionY;
        var lastMove;
        var moveObservable = pointerMove.pipe(map(function (e) {
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
                mapPosition: _this.coordinateConverter ?
                    _this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        }), takeUntil(pointerUp), tap(undefined, undefined, function () {
            if (lastMove) {
                var dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        }));
        this.dragObservable = moveObservable.pipe(merge(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    };
    DraggableToMapService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: MapsManagerService }
    ]; };
    DraggableToMapService = __decorate([
        Injectable(),
        __param(0, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Object, MapsManagerService])
    ], DraggableToMapService);
    return DraggableToMapService;
}());
export { DraggableToMapService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9kcmFnZ2FibGUtdG8tbWFwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFTckc7OztHQUdHO0FBR0g7SUFPRSwrQkFBc0MsUUFBYSxFQUFVLFdBQStCO1FBQXRELGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFGcEYsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQztJQUduRCxDQUFDO0lBRUQsc0RBQXNCLEdBQXRCLFVBQXVCLG1CQUF3QztRQUM3RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFDakQsQ0FBQztJQUVELG9DQUFJLEdBQUosVUFBSyxRQUFnQixFQUFFLEtBQVc7UUFBbEMsaUJBeUNDO1FBeENDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDN0IsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQyxJQUFJLFlBQVksRUFBRTtnQkFDaEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxzQkFB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Q0FBQztnQkFDdEIsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFHLENBQUM7UUFFUixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBRyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7O2dEQXBHWSxNQUFNLFNBQUMsUUFBUTtnQkFBOEMsa0JBQWtCOztJQVBqRixxQkFBcUI7UUFEakMsVUFBVSxFQUFFO1FBUUUsV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7aURBQTZDLGtCQUFrQjtPQVBqRixxQkFBcUIsQ0E0R2pDO0lBQUQsNEJBQUM7Q0FBQSxBQTVHRCxJQTRHQztTQTVHWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmcm9tRXZlbnQgYXMgb2JzZXJ2YWJsZUZyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBtYXAsIG1lcmdlLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy92ZWMyJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEljb25EcmFnRXZlbnQge1xuICBpbml0aWFsU2NyZWVuUG9zaXRpb246IFZlYzI7XG4gIHNjcmVlblBvc2l0aW9uOiBWZWMyO1xuICBtYXBQb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgZHJvcDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgU2VydmljZSBpcyB1c2VkIHRvIHByZWZvcm0sIGhhbmRsZSBhbmQgc3Vic2NyaWJlIHRvIGljb24gZHJhZ2dpbmcgd2hlbiB1c2luZyB0aGUgYERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlYC5cbiAqIEZvciBtb3JlIGluZm8gY2hlY2sgYERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlYCBkb2NzLlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVUb01hcFNlcnZpY2Uge1xuXG4gIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgcHJpdmF0ZSBkcmFnT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxJY29uRHJhZ0V2ZW50PjtcbiAgcHJpdmF0ZSBzdG9wcGVyOiBTdWJqZWN0PGFueT47XG4gIHByaXZhdGUgbWFpblN1YmplY3QgPSBuZXcgU3ViamVjdDxJY29uRHJhZ0V2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSwgcHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlKSB7XG4gIH1cblxuICBzZXRDb29yZGluYXRlQ29udmVydGVyKGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBjb29yZGluYXRlQ29udmVydGVyO1xuICB9XG5cbiAgZHJhZyhpbWFnZVNyYzogc3RyaW5nLCBzdHlsZT86IGFueSkge1xuICAgIGlmICghdGhpcy5jb29yZGluYXRlQ29udmVydGVyKSB7XG4gICAgICBjb25zdCBtYXBDb21wb25lbnQgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcCgpO1xuICAgICAgaWYgKG1hcENvbXBvbmVudCkge1xuICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIgPSBtYXBDb21wb25lbnQuZ2V0Q29vcmRpbmF0ZUNvbnZlcnRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIGNvbnN0IGltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdFbGVtZW50LnNyYyA9IGltYWdlU3JjO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUud2lkdGggPSAnMzBweCc7XG4gICAgaW1nRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMzBweCc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsndXNlci1kcmFnJ10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsndXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctbW96LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLWRyYWcnXSA9ICdub25lJztcbiAgICBpbWdFbGVtZW50LnN0eWxlWyctd2Via2l0LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLW1zLXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgT2JqZWN0LmFzc2lnbihpbWdFbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWdFbGVtZW50KTtcblxuICAgIHRoaXMuY3JlYXRlRHJhZ09ic2VydmFibGUoKTtcbiAgICB0aGlzLmRyYWdPYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICAgIChlKSA9PiB7XG4gICAgICAgIGltZ0VsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgaW1nRWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5zY3JlZW5Qb3NpdGlvbi54IC0gaW1nRWxlbWVudC5jbGllbnRXaWR0aCAvIDIgKyAncHgnO1xuICAgICAgICBpbWdFbGVtZW50LnN0eWxlLnRvcCA9IGUuc2NyZWVuUG9zaXRpb24ueSAtIGltZ0VsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMiArICdweCc7XG4gICAgICAgIHRoaXMubWFpblN1YmplY3QubmV4dChlKTtcbiAgICAgICAgaWYgKGUuZHJvcCkge1xuICAgICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoZTogYW55KSA9PiB7XG4gICAgICAgIGltZ0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICBpbWdFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBkcmFnVXBkYXRlcygpOiBPYnNlcnZhYmxlPEljb25EcmFnRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5tYWluU3ViamVjdDtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5zdG9wcGVyKSB7XG4gICAgICB0aGlzLnN0b3BwZXIubmV4dCh0cnVlKTtcbiAgICAgIHRoaXMuc3RvcHBlciA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZHJhZ09ic2VydmFibGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEcmFnT2JzZXJ2YWJsZSgpIHtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBkcm9wU3ViamVjdCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBjb25zdCBwb2ludGVyVXAgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAncG9pbnRlcnVwJyk7XG4gICAgY29uc3QgcG9pbnRlck1vdmUgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAncG9pbnRlcm1vdmUnKTtcblxuICAgIGxldCBkcmFnU3RhcnRQb3NpdGlvblg6IG51bWJlcjtcbiAgICBsZXQgZHJhZ1N0YXJ0UG9zaXRpb25ZOiBudW1iZXI7XG4gICAgbGV0IGxhc3RNb3ZlOiBhbnk7XG4gICAgY29uc3QgbW92ZU9ic2VydmFibGUgPSBwb2ludGVyTW92ZS5waXBlKG1hcCgoZTogYW55KSA9PiB7XG4gICAgICAgIGRyYWdTdGFydFBvc2l0aW9uWCA9IGRyYWdTdGFydFBvc2l0aW9uWCA/IGRyYWdTdGFydFBvc2l0aW9uWCA6IGUueDtcbiAgICAgICAgZHJhZ1N0YXJ0UG9zaXRpb25ZID0gZHJhZ1N0YXJ0UG9zaXRpb25ZID8gZHJhZ1N0YXJ0UG9zaXRpb25ZIDogZS55O1xuICAgICAgICBsYXN0TW92ZSA9IHtcbiAgICAgICAgICBkcm9wOiBmYWxzZSxcbiAgICAgICAgICBpbml0aWFsU2NyZWVuUG9zaXRpb246IHtcbiAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcbiAgICAgICAgICAgIHk6IGRyYWdTdGFydFBvc2l0aW9uWSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNjcmVlblBvc2l0aW9uOiB7XG4gICAgICAgICAgICB4OiBlLngsXG4gICAgICAgICAgICB5OiBlLnksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtYXBQb3NpdGlvbjogdGhpcy5jb29yZGluYXRlQ29udmVydGVyID9cbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoe3g6IGUueCwgeTogZS55fSkgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsYXN0TW92ZTtcbiAgICAgIH0pLFxuICAgICAgdGFrZVVudGlsKHBvaW50ZXJVcCksXG4gICAgICB0YXAodW5kZWZpbmVkLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgaWYgKGxhc3RNb3ZlKSB7XG4gICAgICAgICAgY29uc3QgZHJvcEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgbGFzdE1vdmUpO1xuICAgICAgICAgIGRyb3BFdmVudC5kcm9wID0gdHJ1ZTtcbiAgICAgICAgICBkcm9wU3ViamVjdC5uZXh0KGRyb3BFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pLCApO1xuXG4gICAgdGhpcy5kcmFnT2JzZXJ2YWJsZSA9IG1vdmVPYnNlcnZhYmxlLnBpcGUobWVyZ2UoZHJvcFN1YmplY3QpLCB0YWtlVW50aWwoc3RvcHBlciksICk7XG4gICAgdGhpcy5zdG9wcGVyID0gc3RvcHBlcjtcbiAgfVxufVxuIl19
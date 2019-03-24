/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { map, merge, takeUntil, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
/**
 * @record
 */
export function IconDragEvent() { }
if (false) {
    /** @type {?} */
    IconDragEvent.prototype.initialScreenPosition;
    /** @type {?} */
    IconDragEvent.prototype.screenPosition;
    /** @type {?} */
    IconDragEvent.prototype.mapPosition;
    /** @type {?} */
    IconDragEvent.prototype.drop;
}
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
export class DraggableToMapService {
    /**
     * @param {?} document
     * @param {?} mapsManager
     */
    constructor(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    /**
     * @param {?} coordinateConverter
     * @return {?}
     */
    setCoordinateConverter(coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    }
    /**
     * @param {?} imageSrc
     * @param {?=} style
     * @return {?}
     */
    drag(imageSrc, style) {
        if (!this.coordinateConverter) {
            /** @type {?} */
            const mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        /** @type {?} */
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
        this.dragObservable.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }), (/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            imgElement.remove();
        }), (/**
         * @return {?}
         */
        () => {
            imgElement.remove();
        }));
    }
    /**
     * @return {?}
     */
    dragUpdates() {
        return this.mainSubject;
    }
    /**
     * @return {?}
     */
    cancel() {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    }
    /**
     * @private
     * @return {?}
     */
    createDragObservable() {
        /** @type {?} */
        const stopper = new Subject();
        /** @type {?} */
        const dropSubject = new Subject();
        /** @type {?} */
        const pointerUp = observableFromEvent(document, 'pointerup');
        /** @type {?} */
        const pointerMove = observableFromEvent(document, 'pointermove');
        /** @type {?} */
        let dragStartPositionX;
        /** @type {?} */
        let dragStartPositionY;
        /** @type {?} */
        let lastMove;
        /** @type {?} */
        const moveObservable = pointerMove.pipe(map((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
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
        })), takeUntil(pointerUp), tap(undefined, undefined, (/**
         * @return {?}
         */
        () => {
            if (lastMove) {
                /** @type {?} */
                const dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        })));
        this.dragObservable = moveObservable.pipe(merge(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    }
}
DraggableToMapService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
DraggableToMapService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: MapsManagerService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.dragObservable;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.stopper;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.mainSubject;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.document;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapService.prototype.mapsManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy9kcmFnZ2FibGUtdG8tbWFwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUVBQWlFLENBQUM7Ozs7QUFFckcsbUNBS0M7OztJQUpDLDhDQUE0Qjs7SUFDNUIsdUNBQXFCOztJQUNyQixvQ0FBd0I7O0lBQ3hCLDZCQUFjOzs7Ozs7QUFTaEIsTUFBTSxPQUFPLHFCQUFxQjs7Ozs7SUFPaEMsWUFBc0MsUUFBYSxFQUFVLFdBQStCO1FBQXRELGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFGcEYsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBaUIsQ0FBQztJQUduRCxDQUFDOzs7OztJQUVELHNCQUFzQixDQUFDLG1CQUF3QztRQUM3RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFDakQsQ0FBQzs7Ozs7O0lBRUQsSUFBSSxDQUFDLFFBQWdCLEVBQUUsS0FBVztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFOztrQkFDdkIsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lB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QUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDN0I7UUFDSCxDQUFDLEVBQUMsQ0FBRztRQUVQLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFHLENBQUM7UUFDcEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQzs7O1lBNUdGLFVBQVU7Ozs7NENBUUksTUFBTSxTQUFDLFFBQVE7WUF0QnJCLGtCQUFrQjs7Ozs7OztJQWlCekIsb0RBQWlEOzs7OztJQUNqRCwrQ0FBa0Q7Ozs7O0lBQ2xELHdDQUE4Qjs7Ozs7SUFDOUIsNENBQW1EOzs7OztJQUV2Qyx5Q0FBdUM7Ozs7O0lBQUUsNENBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgbWFwLCBtZXJnZSwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFZlYzIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvdmVjMic7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJY29uRHJhZ0V2ZW50IHtcbiAgaW5pdGlhbFNjcmVlblBvc2l0aW9uOiBWZWMyO1xuICBzY3JlZW5Qb3NpdGlvbjogVmVjMjtcbiAgbWFwUG9zaXRpb246IENhcnRlc2lhbjM7XG4gIGRyb3A6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIFNlcnZpY2UgaXMgdXNlZCB0byBwcmVmb3JtLCBoYW5kbGUgYW5kIHN1YnNjcmliZSB0byBpY29uIGRyYWdnaW5nIHdoZW4gdXNpbmcgdGhlIGBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZWAuXG4gKiBGb3IgbW9yZSBpbmZvIGNoZWNrIGBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZWAgZG9jcy5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlIHtcblxuICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIHByaXZhdGUgZHJhZ09ic2VydmFibGU6IE9ic2VydmFibGU8SWNvbkRyYWdFdmVudD47XG4gIHByaXZhdGUgc3RvcHBlcjogU3ViamVjdDxhbnk+O1xuICBwcml2YXRlIG1haW5TdWJqZWN0ID0gbmV3IFN1YmplY3Q8SWNvbkRyYWdFdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksIHByaXZhdGUgbWFwc01hbmFnZXI6IE1hcHNNYW5hZ2VyU2VydmljZSkge1xuICB9XG5cbiAgc2V0Q29vcmRpbmF0ZUNvbnZlcnRlcihjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyKSB7XG4gICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgfVxuXG4gIGRyYWcoaW1hZ2VTcmM6IHN0cmluZywgc3R5bGU/OiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcikge1xuICAgICAgY29uc3QgbWFwQ29tcG9uZW50ID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAoKTtcbiAgICAgIGlmIChtYXBDb21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlQ29udmVydGVyID0gbWFwQ29tcG9uZW50LmdldENvb3JkaW5hdGVDb252ZXJ0ZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICBjb25zdCBpbWdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nRWxlbWVudC5zcmMgPSBpbWFnZVNyYztcbiAgICBpbWdFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICBpbWdFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICBpbWdFbGVtZW50LnN0eWxlLndpZHRoID0gJzMwcHgnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzMwcHgnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGVbJ3VzZXItZHJhZyddID0gJ25vbmUnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGVbJ3VzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLW1vei11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGVbJy13ZWJraXQtdXNlci1kcmFnJ10gPSAnbm9uZSc7XG4gICAgaW1nRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGltZ0VsZW1lbnQuc3R5bGVbJy1tcy11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIE9iamVjdC5hc3NpZ24oaW1nRWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW1nRWxlbWVudCk7XG5cbiAgICB0aGlzLmNyZWF0ZURyYWdPYnNlcnZhYmxlKCk7XG4gICAgdGhpcy5kcmFnT2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gICAgICAoZSkgPT4ge1xuICAgICAgICBpbWdFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICAgIGltZ0VsZW1lbnQuc3R5bGUubGVmdCA9IGUuc2NyZWVuUG9zaXRpb24ueCAtIGltZ0VsZW1lbnQuY2xpZW50V2lkdGggLyAyICsgJ3B4JztcbiAgICAgICAgaW1nRWxlbWVudC5zdHlsZS50b3AgPSBlLnNjcmVlblBvc2l0aW9uLnkgLSBpbWdFbGVtZW50LmNsaWVudEhlaWdodCAvIDIgKyAncHgnO1xuICAgICAgICB0aGlzLm1haW5TdWJqZWN0Lm5leHQoZSk7XG4gICAgICAgIGlmIChlLmRyb3ApIHtcbiAgICAgICAgICBpbWdFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgKGU6IGFueSkgPT4ge1xuICAgICAgICBpbWdFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgaW1nRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgZHJhZ1VwZGF0ZXMoKTogT2JzZXJ2YWJsZTxJY29uRHJhZ0V2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMubWFpblN1YmplY3Q7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMuc3RvcHBlcikge1xuICAgICAgdGhpcy5zdG9wcGVyLm5leHQodHJ1ZSk7XG4gICAgICB0aGlzLnN0b3BwZXIgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRyYWdPYnNlcnZhYmxlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRHJhZ09ic2VydmFibGUoKSB7XG4gICAgY29uc3Qgc3RvcHBlciA9IG5ldyBTdWJqZWN0KCk7XG4gICAgY29uc3QgZHJvcFN1YmplY3QgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgY29uc3QgcG9pbnRlclVwID0gb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ3BvaW50ZXJ1cCcpO1xuICAgIGNvbnN0IHBvaW50ZXJNb3ZlID0gb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJyk7XG5cbiAgICBsZXQgZHJhZ1N0YXJ0UG9zaXRpb25YOiBudW1iZXI7XG4gICAgbGV0IGRyYWdTdGFydFBvc2l0aW9uWTogbnVtYmVyO1xuICAgIGxldCBsYXN0TW92ZTogYW55O1xuICAgIGNvbnN0IG1vdmVPYnNlcnZhYmxlID0gcG9pbnRlck1vdmUucGlwZShtYXAoKGU6IGFueSkgPT4ge1xuICAgICAgICBkcmFnU3RhcnRQb3NpdGlvblggPSBkcmFnU3RhcnRQb3NpdGlvblggPyBkcmFnU3RhcnRQb3NpdGlvblggOiBlLng7XG4gICAgICAgIGRyYWdTdGFydFBvc2l0aW9uWSA9IGRyYWdTdGFydFBvc2l0aW9uWSA/IGRyYWdTdGFydFBvc2l0aW9uWSA6IGUueTtcbiAgICAgICAgbGFzdE1vdmUgPSB7XG4gICAgICAgICAgZHJvcDogZmFsc2UsXG4gICAgICAgICAgaW5pdGlhbFNjcmVlblBvc2l0aW9uOiB7XG4gICAgICAgICAgICB4OiBkcmFnU3RhcnRQb3NpdGlvblgsXG4gICAgICAgICAgICB5OiBkcmFnU3RhcnRQb3NpdGlvblksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzY3JlZW5Qb3NpdGlvbjoge1xuICAgICAgICAgICAgeDogZS54LFxuICAgICAgICAgICAgeTogZS55LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWFwUG9zaXRpb246IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlciA/XG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHt4OiBlLngsIHk6IGUueX0pIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbGFzdE1vdmU7XG4gICAgICB9KSxcbiAgICAgIHRha2VVbnRpbChwb2ludGVyVXApLFxuICAgICAgdGFwKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgIGlmIChsYXN0TW92ZSkge1xuICAgICAgICAgIGNvbnN0IGRyb3BFdmVudCA9IE9iamVjdC5hc3NpZ24oe30sIGxhc3RNb3ZlKTtcbiAgICAgICAgICBkcm9wRXZlbnQuZHJvcCA9IHRydWU7XG4gICAgICAgICAgZHJvcFN1YmplY3QubmV4dChkcm9wRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KSwgKTtcblxuICAgIHRoaXMuZHJhZ09ic2VydmFibGUgPSBtb3ZlT2JzZXJ2YWJsZS5waXBlKG1lcmdlKGRyb3BTdWJqZWN0KSwgdGFrZVVudGlsKHN0b3BwZXIpLCApO1xuICAgIHRoaXMuc3RvcHBlciA9IHN0b3BwZXI7XG4gIH1cbn1cbiJdfQ==
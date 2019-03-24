/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
/** @type {?} */
const CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
/** @type {?} */
const CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
/** @type {?} */
const CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
/** @type {?} */
const CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
/** @type {?} */
export const PREDEFINED_KEYBOARD_ACTIONS = {
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_FORWARD]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    }),
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_BACKWARD]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    }),
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    }),
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    }),
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    }),
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const scene = cesiumService.getScene();
        /** @type {?} */
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    }),
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const currentPosition = camera.positionCartographic;
        /** @type {?} */
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    }),
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    }),
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_RIGHT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    }),
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_LEFT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    }),
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_UP]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    }),
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_DOWN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    }),
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_IN]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const amount = params.amount;
        camera.zoomIn(amount);
    }),
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_OUT]: (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    (cesiumService, params) => {
        /** @type {?} */
        const camera = cesiumService.getViewer().camera;
        /** @type {?} */
        const amount = params.amount;
        camera.zoomOut(amount);
    }),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGVmaW5lZC1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9wcmVkZWZpbmVkLWFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7TUFJaEUsOEJBQThCLEdBQUcsS0FBSzs7TUFDdEMsMEJBQTBCLEdBQUcsSUFBSTs7TUFDakMsMkJBQTJCLEdBQUcsSUFBSTs7TUFDbEMsNEJBQTRCLEdBQUcsSUFBSTs7QUFFekMsTUFBTSxPQUFPLDJCQUEyQixHQUErQzs7Ozs7SUFLckYsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDOzs7OztJQUFFLENBQUMsYUFBNEIsRUFBRSxNQUFXLEVBQUUsRUFBRTs7Y0FDdkUsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNOztjQUN6QyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRTs7Y0FDaEMsWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNOztjQUNwRixRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSw4QkFBOEIsQ0FBQztRQUNuRixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQTs7Ozs7SUFLRCxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUM7Ozs7O0lBQUUsQ0FBQyxhQUE0QixFQUFFLE1BQVcsRUFBRSxFQUFFOztjQUN4RSxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU07O2NBQ3pDLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFOztjQUNoQyxZQUFZLEdBQUcs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O2NBQ3pDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS2V5Ym9hcmRBY3Rpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMta2V5Ym9hcmQtYWN0aW9uLmVudW0nO1xuaW1wb3J0IHsgS2V5Ym9hcmRDb250cm9sQWN0aW9uRm4gfSBmcm9tICcuL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuY29uc3QgQ0FNRVJBX01PVkVNRU5UX0RFRkFVTFRfRkFDVE9SID0gMTAwLjA7XG5jb25zdCBDQU1FUkFfTE9PS19ERUZBVUxUX0ZBQ1RPUiA9IDAuMDE7XG5jb25zdCBDQU1FUkFfVFdJU1RfREVGQVVMVF9GQUNUT1IgPSAwLjAxO1xuY29uc3QgQ0FNRVJBX1JPVEFURV9ERUZBVUxUX0ZBQ1RPUiA9IDAuMDE7XG5cbmV4cG9ydCBjb25zdCBQUkVERUZJTkVEX0tFWUJPQVJEX0FDVElPTlM6IHsgW2tleTogbnVtYmVyXTogS2V5Ym9hcmRDb250cm9sQWN0aW9uRm4gfSA9IHtcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgZm9yd2FyZCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0ZPUldBUkRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVGb3J3YXJkKG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgYmFja3dhcmQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9CQUNLV0FSRF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IHNjZW5lID0gY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IGNhbWVyYUhlaWdodCA9IHNjZW5lLmdsb2JlLmVsbGlwc29pZC5jYXJ0ZXNpYW5Ub0NhcnRvZ3JhcGhpYyhjYW1lcmEucG9zaXRpb24pLmhlaWdodDtcbiAgICBjb25zdCBtb3ZlUmF0ZSA9IGNhbWVyYUhlaWdodCAvIChwYXJhbXMubW92ZVJhdGUgfHwgQ0FNRVJBX01PVkVNRU5UX0RFRkFVTFRfRkFDVE9SKTtcbiAgICBjYW1lcmEubW92ZUJhY2t3YXJkKG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgdXAsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9VUF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IHNjZW5lID0gY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IGNhbWVyYUhlaWdodCA9IHNjZW5lLmdsb2JlLmVsbGlwc29pZC5jYXJ0ZXNpYW5Ub0NhcnRvZ3JhcGhpYyhjYW1lcmEucG9zaXRpb24pLmhlaWdodDtcbiAgICBjb25zdCBtb3ZlUmF0ZSA9IGNhbWVyYUhlaWdodCAvIChwYXJhbXMubW92ZVJhdGUgfHwgQ0FNRVJBX01PVkVNRU5UX0RFRkFVTFRfRkFDVE9SKTtcbiAgICBjYW1lcmEubW92ZVVwKG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgZG93biwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0RPV05dOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVEb3duKG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9SSUdIVF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IHNjZW5lID0gY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IGNhbWVyYUhlaWdodCA9IHNjZW5lLmdsb2JlLmVsbGlwc29pZC5jYXJ0ZXNpYW5Ub0NhcnRvZ3JhcGhpYyhjYW1lcmEucG9zaXRpb24pLmhlaWdodDtcbiAgICBjb25zdCBtb3ZlUmF0ZSA9IGNhbWVyYUhlaWdodCAvIChwYXJhbXMubW92ZVJhdGUgfHwgQ0FNRVJBX01PVkVNRU5UX0RFRkFVTFRfRkFDVE9SKTtcbiAgICBjYW1lcmEubW92ZVJpZ2h0KG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBjYW1lcmEgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xFRlRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVMZWZ0KG1vdmVSYXRlKTtcbiAgfSxcbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19SSUdIVF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9IGNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICBjb25zdCBsb29rRmFjdG9yID0gcGFyYW1zLmxvb2tGYWN0b3IgfHwgQ0FNRVJBX0xPT0tfREVGQVVMVF9GQUNUT1I7XG4gICAgY2FtZXJhLmxvb2tSaWdodChjdXJyZW50UG9zaXRpb24ubGF0aXR1ZGUgKiBsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHRvIHRoZSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX0xFRlRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBjdXJyZW50UG9zaXRpb24gPSBjYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5sb29rRmFjdG9yIHx8IENBTUVSQV9MT09LX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5sb29rTGVmdChjdXJyZW50UG9zaXRpb24ubGF0aXR1ZGUgKiBsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHVwLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX1VQXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gY2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMubG9va0ZhY3RvciB8fCBDQU1FUkFfTE9PS19ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEubG9va1VwKGN1cnJlbnRQb3NpdGlvbi5sb25naXR1ZGUgKiAobG9va0ZhY3RvciAqIC0xKSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayBkb3duLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGxvb2tGYWN0b3JgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBsb29raW5nLCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX0RPV05dOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBjdXJyZW50UG9zaXRpb24gPSBjYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5sb29rRmFjdG9yIHx8IENBTUVSQV9MT09LX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5sb29rRG93bihjdXJyZW50UG9zaXRpb24ubG9uZ2l0dWRlICogKGxvb2tGYWN0b3IgKiAtMSkpO1xuICB9LFxuICAvKipcbiAgICogVHdpc3RzIHRoZSBjYW1lcmEgdG8gdGhlIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFtb3VudGAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgdHdpc3QgYW1vdW50XG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1RXSVNUX1JJR0hUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5hbW91bnQgfHwgQ0FNRVJBX1RXSVNUX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS50d2lzdFJpZ2h0KGxvb2tGYWN0b3IpO1xuICB9LFxuICAvKipcbiAgICogVHdpc3RzIHRoZSBjYW1lcmEgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW1vdW50YCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSB0d2lzdCBhbW91bnRcbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfVFdJU1RfTEVGVF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMuYW1vdW50IHx8IENBTUVSQV9UV0lTVF9ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEudHdpc3RMZWZ0KGxvb2tGYWN0b3IpO1xuICB9LFxuICAvKipcbiAgICogUm90YXRlcyB0aGUgY2FtZXJhIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgcm90YXRpb24gYW5nbGVcbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX1JJR0hUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5hbmdsZSB8fCBDQU1FUkFfUk9UQVRFX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5yb3RhdGVSaWdodChsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJvdGF0ZXMgdGhlIGNhbWVyYSB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgcm90YXRpb24gYW5nbGVcbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX0xFRlRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBsb29rRmFjdG9yID0gcGFyYW1zLmFuZ2xlIHx8IENBTUVSQV9ST1RBVEVfREVGQVVMVF9GQUNUT1I7XG4gICAgY2FtZXJhLnJvdGF0ZUxlZnQobG9va0ZhY3Rvcik7XG4gIH0sXG4gIC8qKlxuICAgKiBSb3RhdGVzIHRoZSBjYW1lcmEgdXB3YXJkcywgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbmdsZWAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgcm90YXRpb24gYW5nbGVcbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX1VQXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5hbmdsZSB8fCBDQU1FUkFfUk9UQVRFX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5yb3RhdGVVcChsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJvdGF0ZXMgdGhlIGNhbWVyYSBkb3dud2FyZHMsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9ET1dOXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5hbmdsZSB8fCBDQU1FUkFfUk9UQVRFX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5yb3RhdGVEb3duKGxvb2tGYWN0b3IpO1xuICB9LFxuICAvKipcbiAgICogWm9vbSBpbiBpbnRvIHRoZSBjdXJyZW50IGNhbWVyYSBjZW50ZXIgcG9zaXRpb24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZFxuICAgKiBgYW1vdW50YCB0aGF0IGNvbnRyb2xzIHRoZSBhbW91bnQgb2Ygem9vbSBpbiBtZXRlcnMuXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1pPT01fSU5dOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBhbW91bnQgPSBwYXJhbXMuYW1vdW50O1xuICAgIGNhbWVyYS56b29tSW4oYW1vdW50KTtcbiAgfSxcbiAgLyoqXG4gICAqIFpvb20gb3V0IGZyb20gdGhlIGN1cnJlbnQgY2FtZXJhIGNlbnRlciBwb3NpdGlvbiwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkXG4gICAqIGBhbW91bnRgIHRoYXQgY29udHJvbHMgdGhlIGFtb3VudCBvZiB6b29tIGluIG1ldGVycy5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfWk9PTV9PVVRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBhbW91bnQgPSBwYXJhbXMuYW1vdW50O1xuICAgIGNhbWVyYS56b29tT3V0KGFtb3VudCk7XG4gIH0sXG59O1xuIl19
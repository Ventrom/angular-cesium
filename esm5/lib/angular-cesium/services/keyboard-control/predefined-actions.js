var _a;
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
/** @type {?} */
var CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
/** @type {?} */
var CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
/** @type {?} */
var CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
/** @type {?} */
var CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
/** @type {?} */
export var PREDEFINED_KEYBOARD_ACTIONS = (_a = {},
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_FORWARD] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    }),
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_BACKWARD] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    }),
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    }),
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    }),
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    }),
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    _a[KeyboardAction.CAMERA_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var scene = cesiumService.getScene();
        /** @type {?} */
        var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        /** @type {?} */
        var moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    }),
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    }),
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    _a[KeyboardAction.CAMERA_LOOK_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var currentPosition = camera.positionCartographic;
        /** @type {?} */
        var lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    }),
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    }),
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    _a[KeyboardAction.CAMERA_TWIST_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    }),
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_RIGHT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    }),
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_LEFT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    }),
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_UP] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    }),
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    _a[KeyboardAction.CAMERA_ROTATE_DOWN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    }),
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_IN] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var amount = params.amount;
        camera.zoomIn(amount);
    }),
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    _a[KeyboardAction.CAMERA_ZOOM_OUT] = (/**
     * @param {?} cesiumService
     * @param {?} params
     * @return {?}
     */
    function (cesiumService, params) {
        /** @type {?} */
        var camera = cesiumService.getViewer().camera;
        /** @type {?} */
        var amount = params.amount;
        camera.zoomOut(amount);
    }),
    _a);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGVmaW5lZC1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9wcmVkZWZpbmVkLWFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7O0lBSWhFLDhCQUE4QixHQUFHLEtBQUs7O0lBQ3RDLDBCQUEwQixHQUFHLElBQUk7O0lBQ2pDLDJCQUEyQixHQUFHLElBQUk7O0lBQ2xDLDRCQUE0QixHQUFHLElBQUk7O0FBRXpDLE1BQU0sS0FBTywyQkFBMkI7SUFDdEM7OztPQUdHO0lBQ0gsR0FBQyxjQUFjLENBQUMsY0FBYzs7Ozs7SUFBRyxVQUFDLGFBQTRCLEVBQUUsTUFBVzs7WUFDbkUsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNOztZQUN6QyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRTs7WUFDaEMsWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNOztZQUNwRixRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSw4QkFBOEIsQ0FBQztRQUNuRixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQTtJQUNEOzs7T0FHRztJQUNILEdBQUMsY0FBYyxDQUFDLGVBQWU7Ozs7O0lBQUcsVUFBQyxhQUE0QixFQUFFLE1BQVc7O1lBQ3BFLE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTTs7WUFDekMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUU7O1lBQ2hDLFlBQVksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFD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QWN0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWtleWJvYXJkLWFjdGlvbi5lbnVtJztcbmltcG9ydCB7IEtleWJvYXJkQ29udHJvbEFjdGlvbkZuIH0gZnJvbSAnLi9rZXlib2FyZC1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbmNvbnN0IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUiA9IDEwMC4wO1xuY29uc3QgQ0FNRVJBX0xPT0tfREVGQVVMVF9GQUNUT1IgPSAwLjAxO1xuY29uc3QgQ0FNRVJBX1RXSVNUX0RFRkFVTFRfRkFDVE9SID0gMC4wMTtcbmNvbnN0IENBTUVSQV9ST1RBVEVfREVGQVVMVF9GQUNUT1IgPSAwLjAxO1xuXG5leHBvcnQgY29uc3QgUFJFREVGSU5FRF9LRVlCT0FSRF9BQ1RJT05TOiB7IFtrZXk6IG51bWJlcl06IEtleWJvYXJkQ29udHJvbEFjdGlvbkZuIH0gPSB7XG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIGZvcndhcmQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9GT1JXQVJEXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3Qgc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY29uc3QgY2FtZXJhSGVpZ2h0ID0gc2NlbmUuZ2xvYmUuZWxsaXBzb2lkLmNhcnRlc2lhblRvQ2FydG9ncmFwaGljKGNhbWVyYS5wb3NpdGlvbikuaGVpZ2h0O1xuICAgIGNvbnN0IG1vdmVSYXRlID0gY2FtZXJhSGVpZ2h0IC8gKHBhcmFtcy5tb3ZlUmF0ZSB8fCBDQU1FUkFfTU9WRU1FTlRfREVGQVVMVF9GQUNUT1IpO1xuICAgIGNhbWVyYS5tb3ZlRm9yd2FyZChtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIGJhY2t3YXJkLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfQkFDS1dBUkRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVCYWNrd2FyZChtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIHVwLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfVVBdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVVcChtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIGRvd24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9ET1dOXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3Qgc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY29uc3QgY2FtZXJhSGVpZ2h0ID0gc2NlbmUuZ2xvYmUuZWxsaXBzb2lkLmNhcnRlc2lhblRvQ2FydG9ncmFwaGljKGNhbWVyYS5wb3NpdGlvbikuaGVpZ2h0O1xuICAgIGNvbnN0IG1vdmVSYXRlID0gY2FtZXJhSGVpZ2h0IC8gKHBhcmFtcy5tb3ZlUmF0ZSB8fCBDQU1FUkFfTU9WRU1FTlRfREVGQVVMVF9GQUNUT1IpO1xuICAgIGNhbWVyYS5tb3ZlRG93bihtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIHJpZ2h0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfUklHSFRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBzY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICBjb25zdCBjYW1lcmFIZWlnaHQgPSBzY2VuZS5nbG9iZS5lbGxpcHNvaWQuY2FydGVzaWFuVG9DYXJ0b2dyYXBoaWMoY2FtZXJhLnBvc2l0aW9uKS5oZWlnaHQ7XG4gICAgY29uc3QgbW92ZVJhdGUgPSBjYW1lcmFIZWlnaHQgLyAocGFyYW1zLm1vdmVSYXRlIHx8IENBTUVSQV9NT1ZFTUVOVF9ERUZBVUxUX0ZBQ1RPUik7XG4gICAgY2FtZXJhLm1vdmVSaWdodChtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgY2FtZXJhIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9MRUZUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3Qgc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY29uc3QgY2FtZXJhSGVpZ2h0ID0gc2NlbmUuZ2xvYmUuZWxsaXBzb2lkLmNhcnRlc2lhblRvQ2FydG9ncmFwaGljKGNhbWVyYS5wb3NpdGlvbikuaGVpZ2h0O1xuICAgIGNvbnN0IG1vdmVSYXRlID0gY2FtZXJhSGVpZ2h0IC8gKHBhcmFtcy5tb3ZlUmF0ZSB8fCBDQU1FUkFfTU9WRU1FTlRfREVGQVVMVF9GQUNUT1IpO1xuICAgIGNhbWVyYS5tb3ZlTGVmdChtb3ZlUmF0ZSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfUklHSFRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBjdXJyZW50UG9zaXRpb24gPSBjYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5sb29rRmFjdG9yIHx8IENBTUVSQV9MT09LX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5sb29rUmlnaHQoY3VycmVudFBvc2l0aW9uLmxhdGl0dWRlICogbG9va0ZhY3Rvcik7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19MRUZUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gY2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMubG9va0ZhY3RvciB8fCBDQU1FUkFfTE9PS19ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEubG9va0xlZnQoY3VycmVudFBvc2l0aW9uLmxhdGl0dWRlICogbG9va0ZhY3Rvcik7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB1cCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19VUF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9IGNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICBjb25zdCBsb29rRmFjdG9yID0gcGFyYW1zLmxvb2tGYWN0b3IgfHwgQ0FNRVJBX0xPT0tfREVGQVVMVF9GQUNUT1I7XG4gICAgY2FtZXJhLmxvb2tVcChjdXJyZW50UG9zaXRpb24ubG9uZ2l0dWRlICogKGxvb2tGYWN0b3IgKiAtMSkpO1xuICB9LFxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgZG93biwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cbiAgICovXG4gIFtLZXlib2FyZEFjdGlvbi5DQU1FUkFfTE9PS19ET1dOXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gY2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMubG9va0ZhY3RvciB8fCBDQU1FUkFfTE9PS19ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEubG9va0Rvd24oY3VycmVudFBvc2l0aW9uLmxvbmdpdHVkZSAqIChsb29rRmFjdG9yICogLTEpKTtcbiAgfSxcbiAgLyoqXG4gICAqIFR3aXN0cyB0aGUgY2FtZXJhIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbW91bnRgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIHR3aXN0IGFtb3VudFxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9UV0lTVF9SSUdIVF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMuYW1vdW50IHx8IENBTUVSQV9UV0lTVF9ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEudHdpc3RSaWdodChsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIFR3aXN0cyB0aGUgY2FtZXJhIHRvIHRoZSBsZWZ0LCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFtb3VudGAgdGhhdCBjb250cm9sc1xuICAgKiB0aGUgdHdpc3QgYW1vdW50XG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1RXSVNUX0xFRlRdOiAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICBjb25zdCBjYW1lcmEgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICBjb25zdCBsb29rRmFjdG9yID0gcGFyYW1zLmFtb3VudCB8fCBDQU1FUkFfVFdJU1RfREVGQVVMVF9GQUNUT1I7XG4gICAgY2FtZXJhLnR3aXN0TGVmdChsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJvdGF0ZXMgdGhlIGNhbWVyYSB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9SSUdIVF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMuYW5nbGUgfHwgQ0FNRVJBX1JPVEFURV9ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEucm90YXRlUmlnaHQobG9va0ZhY3Rvcik7XG4gIH0sXG4gIC8qKlxuICAgKiBSb3RhdGVzIHRoZSBjYW1lcmEgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9MRUZUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgbG9va0ZhY3RvciA9IHBhcmFtcy5hbmdsZSB8fCBDQU1FUkFfUk9UQVRFX0RFRkFVTFRfRkFDVE9SO1xuICAgIGNhbWVyYS5yb3RhdGVMZWZ0KGxvb2tGYWN0b3IpO1xuICB9LFxuICAvKipcbiAgICogUm90YXRlcyB0aGUgY2FtZXJhIHVwd2FyZHMsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcbiAgICogdGhlIHJvdGF0aW9uIGFuZ2xlXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JPVEFURV9VUF06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMuYW5nbGUgfHwgQ0FNRVJBX1JPVEFURV9ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEucm90YXRlVXAobG9va0ZhY3Rvcik7XG4gIH0sXG4gIC8qKlxuICAgKiBSb3RhdGVzIHRoZSBjYW1lcmEgZG93bndhcmRzLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXG4gICAqIHRoZSByb3RhdGlvbiBhbmdsZVxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfRE9XTl06IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIGNvbnN0IGxvb2tGYWN0b3IgPSBwYXJhbXMuYW5nbGUgfHwgQ0FNRVJBX1JPVEFURV9ERUZBVUxUX0ZBQ1RPUjtcbiAgICBjYW1lcmEucm90YXRlRG93bihsb29rRmFjdG9yKTtcbiAgfSxcbiAgLyoqXG4gICAqIFpvb20gaW4gaW50byB0aGUgY3VycmVudCBjYW1lcmEgY2VudGVyIHBvc2l0aW9uLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWRcbiAgICogYGFtb3VudGAgdGhhdCBjb250cm9scyB0aGUgYW1vdW50IG9mIHpvb20gaW4gbWV0ZXJzLlxuICAgKi9cbiAgW0tleWJvYXJkQWN0aW9uLkNBTUVSQV9aT09NX0lOXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgYW1vdW50ID0gcGFyYW1zLmFtb3VudDtcbiAgICBjYW1lcmEuem9vbUluKGFtb3VudCk7XG4gIH0sXG4gIC8qKlxuICAgKiBab29tIG91dCBmcm9tIHRoZSBjdXJyZW50IGNhbWVyYSBjZW50ZXIgcG9zaXRpb24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZFxuICAgKiBgYW1vdW50YCB0aGF0IGNvbnRyb2xzIHRoZSBhbW91bnQgb2Ygem9vbSBpbiBtZXRlcnMuXG4gICAqL1xuICBbS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1pPT01fT1VUXTogKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHBhcmFtczogYW55KSA9PiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgY29uc3QgYW1vdW50ID0gcGFyYW1zLmFtb3VudDtcbiAgICBjYW1lcmEuem9vbU91dChhbW91bnQpO1xuICB9LFxufTtcbiJdfQ==
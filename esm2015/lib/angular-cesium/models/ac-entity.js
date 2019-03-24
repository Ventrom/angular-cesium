/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= new AcEntity({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cesium.Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
export class AcEntity {
    /**
     * Creates entity from a json
     * @param {?=} json entity object
     * @return {?} entity as AcEntity
     */
    static create(json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    }
    /**
     * Creates entity from a json
     * @param {?=} json (Optional) entity object
     */
    constructor(json) {
        Object.assign(this, json);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZW50aXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVVBLE1BQU0sT0FBTyxRQUFROzs7Ozs7SUFPbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFVO1FBQ3RCLElBQUksSUFBSSxFQUFFO1lBQ1IsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Ozs7SUFNRCxZQUFZLElBQVU7UUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIENlc2l1bSBwYXJlbnQgZW50aXR5LCBhbGwgZW50aXRpZXMgc2hvdWxkIGluaGVyaXQgZnJvbSBpdC5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGVudGl0eT0gbmV3IEFjRW50aXR5KHtcbiAqICBcdGlkOiAwLFxuICogIFx0bmFtZTogJ2NsaWNrIG1lJyxcbiAqICBcdHBvc2l0aW9uOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucygwLjUsIDAuNSksXG4gKiB9KTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQWNFbnRpdHkge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGVudGl0eSBmcm9tIGEganNvblxuICAgKiBAcGFyYW0ganNvbiBlbnRpdHkgb2JqZWN0XG4gICAqIEByZXR1cm5zIGVudGl0eSBhcyBBY0VudGl0eVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZShqc29uPzogYW55KSB7XG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBBY0VudGl0eSgpLCBqc29uKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBY0VudGl0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgZW50aXR5IGZyb20gYSBqc29uXG4gICAqIEBwYXJhbSBqc29uIChPcHRpb25hbCkgZW50aXR5IG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoanNvbj86IGFueSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywganNvbik7XG4gIH1cbn1cbiJdfQ==
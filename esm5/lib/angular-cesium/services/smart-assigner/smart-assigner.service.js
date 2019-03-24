/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Service for effective assignment.
 */
var /**
 * Service for effective assignment.
 */
SmartAssigner = /** @class */ (function () {
    function SmartAssigner() {
    }
    /**
     * @param {?=} props
     * @param {?=} allowUndefined
     * @return {?}
     */
    SmartAssigner.create = /**
     * @param {?=} props
     * @param {?=} allowUndefined
     * @return {?}
     */
    function (props, allowUndefined) {
        if (props === void 0) { props = []; }
        if (allowUndefined === void 0) { allowUndefined = true; }
        /** @type {?} */
        var fnBody = "";
        props.forEach((/**
         * @param {?} prop
         * @return {?}
         */
        function (prop) {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += "if (!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty) && obj2['" + prop + "'] !== undefined) { obj1['" + prop + "'] = obj2['" + prop + "']; } ";
            }
            else {
                fnBody += "if(!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty))obj1['" + prop + "'] = obj2['" + prop + "']; ";
            }
        }));
        fnBody += "return obj1";
        /** @type {?} */
        var assignFn = new Function('obj1', 'obj2', fnBody);
        return (/**
         * @param {?} obj1
         * @param {?} obj2
         * @return {?}
         */
        function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        });
    };
    return SmartAssigner;
}());
/**
 * Service for effective assignment.
 */
export { SmartAssigner };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3NtYXJ0LWFzc2lnbmVyL3NtYXJ0LWFzc2lnbmVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOzs7O0lBQUE7SUFxQkEsQ0FBQzs7Ozs7O0lBbkJRLG9CQUFNOzs7OztJQUFiLFVBQWMsS0FBb0IsRUFBRSxjQUE4QjtRQUFwRCxzQkFBQSxFQUFBLFVBQW9CO1FBQUUsK0JBQUEsRUFBQSxxQkFBOEI7O1lBQzVELE1BQU0sR0FBRyxFQUFFO1FBRWYsS0FBSyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLElBQUk7WUFDaEIsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsMkNBQTJDO2dCQUMzQyxNQUFNLElBQUksaUJBQWUsSUFBSSx3REFBbUQsSUFBSSxrQ0FBNkIsSUFBSSxtQkFBYyxJQUFJLFdBQVEsQ0FBQzthQUNqSjtpQkFBTTtnQkFDTCxNQUFNLElBQUksZ0JBQWMsSUFBSSxxREFBZ0QsSUFBSSxtQkFBYyxJQUFJLFNBQU0sQ0FBQzthQUMxRztRQUNILENBQUMsRUFBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLGFBQWEsQ0FBQzs7WUFDbEIsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBRXJEOzs7OztRQUFPLFNBQVMsYUFBYSxDQUFDLElBQVksRUFBRSxJQUFZO1lBQ3RELE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDLEVBQUM7SUFDSixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXJ2aWNlIGZvciBlZmZlY3RpdmUgYXNzaWdubWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNtYXJ0QXNzaWduZXIge1xuXG4gIHN0YXRpYyBjcmVhdGUocHJvcHM6IHN0cmluZ1tdID0gW10sIGFsbG93VW5kZWZpbmVkOiBib29sZWFuID0gdHJ1ZSk6IChvYmoxOiBPYmplY3QsIG9iajI6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBsZXQgZm5Cb2R5ID0gYGA7XG5cbiAgICBwcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgaWYgKCFhbGxvd1VuZGVmaW5lZCkge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgIGZuQm9keSArPSBgaWYgKCEob2JqMVsnJHtwcm9wfSddIGluc3RhbmNlb2YgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkpICYmIG9iajJbJyR7cHJvcH0nXSAhPT0gdW5kZWZpbmVkKSB7IG9iajFbJyR7cHJvcH0nXSA9IG9iajJbJyR7cHJvcH0nXTsgfSBgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm5Cb2R5ICs9IGBpZighKG9iajFbJyR7cHJvcH0nXSBpbnN0YW5jZW9mIENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KSlvYmoxWycke3Byb3B9J10gPSBvYmoyWycke3Byb3B9J107IGA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmbkJvZHkgKz0gYHJldHVybiBvYmoxYDtcbiAgICBjb25zdCBhc3NpZ25GbiA9IG5ldyBGdW5jdGlvbignb2JqMScsICdvYmoyJywgZm5Cb2R5KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBzbWFydEFzc2lnbmVyKG9iajE6IE9iamVjdCwgb2JqMjogT2JqZWN0KSB7XG4gICAgICByZXR1cm4gYXNzaWduRm4ob2JqMSwgb2JqMik7XG4gICAgfTtcbiAgfVxufVxuIl19
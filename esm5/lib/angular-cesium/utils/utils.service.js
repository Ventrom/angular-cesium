/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
export var UtilsService = {
    unique: (/**
     * @param {?} array
     * @return {?}
     */
    function (array) {
        return array.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        function (accumulator, currentValue) {
            if (accumulator.indexOf(currentValue) < 0) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }), []);
    })
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3V0aWxzL3V0aWxzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxNQUFNLEtBQU8sWUFBWSxHQUFHO0lBQzFCLE1BQU07Ozs7SUFBRSxVQUFDLEtBQVk7UUFDbkIsT0FBTyxLQUFLLENBQUMsTUFBTTs7Ozs7UUFBQyxVQUFDLFdBQVcsRUFBRSxZQUFZO1lBQzVDLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDLEdBQUUsRUFBRSxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUE7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBVdGlsc1NlcnZpY2UgPSB7XG4gIHVuaXF1ZTogKGFycmF5OiBhbnlbXSk6IGFueVtdID0+IHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICBpZiAoYWNjdW11bGF0b3IuaW5kZXhPZihjdXJyZW50VmFsdWUpIDwgMCkge1xuICAgICAgICBhY2N1bXVsYXRvci5wdXNoKGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfSwgW10pO1xuICB9XG59O1xuXG4iXX0=
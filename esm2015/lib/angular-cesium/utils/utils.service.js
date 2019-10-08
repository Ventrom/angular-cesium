/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
export const UtilsService = {
    unique: (/**
     * @param {?} array
     * @return {?}
     */
    (array) => {
        return array.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => {
            if (accumulator.indexOf(currentValue) < 0) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }), []);
    })
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3V0aWxzL3V0aWxzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxNQUFNLE9BQU8sWUFBWSxHQUFHO0lBQzFCLE1BQU07Ozs7SUFBRSxDQUFDLEtBQVksRUFBUyxFQUFFO1FBQzlCLE9BQU8sS0FBSyxDQUFDLE1BQU07Ozs7O1FBQUMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLEVBQUU7WUFDaEQsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDekMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNoQztZQUNELE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFV0aWxzU2VydmljZSA9IHtcbiAgdW5pcXVlOiAoYXJyYXk6IGFueVtdKTogYW55W10gPT4ge1xuICAgIHJldHVybiBhcnJheS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBjdXJyZW50VmFsdWUpID0+IHtcbiAgICAgIGlmIChhY2N1bXVsYXRvci5pbmRleE9mKGN1cnJlbnRWYWx1ZSkgPCAwKSB7XG4gICAgICAgIGFjY3VtdWxhdG9yLnB1c2goY3VycmVudFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICB9LCBbXSk7XG4gIH1cbn07XG5cbiJdfQ==
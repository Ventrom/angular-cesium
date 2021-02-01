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
var AcEntity = /** @class */ (function () {
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    function AcEntity(json) {
        Object.assign(this, json);
    }
    /**
     * Creates entity from a json
     * @param json entity object
     * @returns entity as AcEntity
     */
    AcEntity.create = function (json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    };
    return AcEntity;
}());
export { AcEntity };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZW50aXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7QUFDSDtJQWNFOzs7T0FHRztJQUNILGtCQUFZLElBQVU7UUFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQWxCRDs7OztPQUlHO0lBQ0ksZUFBTSxHQUFiLFVBQWMsSUFBVTtRQUN0QixJQUFJLElBQUksRUFBRTtZQUNSLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFTSCxlQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciBDZXNpdW0gcGFyZW50IGVudGl0eSwgYWxsIGVudGl0aWVzIHNob3VsZCBpbmhlcml0IGZyb20gaXQuXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBlbnRpdHk9IG5ldyBBY0VudGl0eSh7XG4gKiAgXHRpZDogMCxcbiAqICBcdG5hbWU6ICdjbGljayBtZScsXG4gKiAgXHRwb3NpdGlvbjogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoMC41LCAwLjUpLFxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEFjRW50aXR5IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBlbnRpdHkgZnJvbSBhIGpzb25cbiAgICogQHBhcmFtIGpzb24gZW50aXR5IG9iamVjdFxuICAgKiBAcmV0dXJucyBlbnRpdHkgYXMgQWNFbnRpdHlcbiAgICovXG4gIHN0YXRpYyBjcmVhdGUoanNvbj86IGFueSkge1xuICAgIGlmIChqc29uKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgQWNFbnRpdHkoKSwganNvbik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQWNFbnRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGVudGl0eSBmcm9tIGEganNvblxuICAgKiBAcGFyYW0ganNvbiAoT3B0aW9uYWwpIGVudGl0eSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKGpzb24/OiBhbnkpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGpzb24pO1xuICB9XG59XG4iXX0=
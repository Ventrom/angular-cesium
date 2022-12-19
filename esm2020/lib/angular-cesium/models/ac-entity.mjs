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
     * @param json entity object
     * @returns entity as AcEntity
     */
    static create(json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    }
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    constructor(json) {
        Object.assign(this, json);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBRW5COzs7O09BSUc7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVU7UUFDdEIsSUFBSSxJQUFJLEVBQUU7WUFDUixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxJQUFVO1FBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciBDZXNpdW0gcGFyZW50IGVudGl0eSwgYWxsIGVudGl0aWVzIHNob3VsZCBpbmhlcml0IGZyb20gaXQuXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBlbnRpdHk9IG5ldyBBY0VudGl0eSh7XG4gKiAgXHRpZDogMCxcbiAqICBcdG5hbWU6ICdjbGljayBtZScsXG4gKiAgXHRwb3NpdGlvbjogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoMC41LCAwLjUpLFxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEFjRW50aXR5IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBlbnRpdHkgZnJvbSBhIGpzb25cbiAgICogQHBhcmFtIGpzb24gZW50aXR5IG9iamVjdFxuICAgKiBAcmV0dXJucyBlbnRpdHkgYXMgQWNFbnRpdHlcbiAgICovXG4gIHN0YXRpYyBjcmVhdGUoanNvbj86IGFueSkge1xuICAgIGlmIChqc29uKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgQWNFbnRpdHkoKSwganNvbik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQWNFbnRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGVudGl0eSBmcm9tIGEganNvblxuICAgKiBAcGFyYW0ganNvbiAoT3B0aW9uYWwpIGVudGl0eSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKGpzb24/OiBhbnkpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGpzb24pO1xuICB9XG59XG4iXX0=
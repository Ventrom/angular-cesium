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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZW50aXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLE9BQU8sUUFBUTtJQUVuQjs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFVO1FBQ3RCLElBQUksSUFBSSxFQUFFO1lBQ1IsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFlBQVksSUFBVTtRQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgQ2VzaXVtIHBhcmVudCBlbnRpdHksIGFsbCBlbnRpdGllcyBzaG91bGQgaW5oZXJpdCBmcm9tIGl0LlxuICogYGBgdHlwZXNjcmlwdFxuICogZW50aXR5PSBuZXcgQWNFbnRpdHkoe1xuICogIFx0aWQ6IDAsXG4gKiAgXHRuYW1lOiAnY2xpY2sgbWUnLFxuICogIFx0cG9zaXRpb246IENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKDAuNSwgMC41KSxcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBBY0VudGl0eSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgZW50aXR5IGZyb20gYSBqc29uXG4gICAqIEBwYXJhbSBqc29uIGVudGl0eSBvYmplY3RcbiAgICogQHJldHVybnMgZW50aXR5IGFzIEFjRW50aXR5XG4gICAqL1xuICBzdGF0aWMgY3JlYXRlKGpzb24/OiBhbnkpIHtcbiAgICBpZiAoanNvbikge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IEFjRW50aXR5KCksIGpzb24pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEFjRW50aXR5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBlbnRpdHkgZnJvbSBhIGpzb25cbiAgICogQHBhcmFtIGpzb24gKE9wdGlvbmFsKSBlbnRpdHkgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3Rvcihqc29uPzogYW55KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBqc29uKTtcbiAgfVxufVxuIl19
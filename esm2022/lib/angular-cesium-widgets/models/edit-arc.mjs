import { AcEntity } from '../../angular-cesium/models/ac-entity';
export class EditArc extends AcEntity {
    static { this.counter = 0; }
    constructor(entityId, center, radius, delta, angle, _arcProps) {
        super();
        this._arcProps = _arcProps;
        this.id = this.generateId();
        this.editedEntityId = entityId;
        this._center = center;
        this._radius = radius;
        this._delta = delta;
        this._angle = angle;
    }
    get props() {
        return this._arcProps;
    }
    set props(props) {
        this._arcProps = props;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    get delta() {
        return this._delta;
    }
    set delta(value) {
        this._delta = value;
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }
    get center() {
        return this._center;
    }
    set center(value) {
        this._center = value;
    }
    updateCenter(center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    }
    getId() {
        return this.id;
    }
    generateId() {
        return 'edit-arc-' + EditArc.counter++;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1hcmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtYXJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRSxNQUFNLE9BQU8sT0FBUSxTQUFRLFFBQVE7YUFDNUIsWUFBTyxHQUFHLENBQUMsQ0FBQztJQVFuQixZQUFZLFFBQWdCLEVBQUUsTUFBa0IsRUFBRSxNQUFjLEVBQUUsS0FBYSxFQUFFLEtBQWEsRUFBVSxTQUF3QjtRQUM5SCxLQUFLLEVBQUUsQ0FBQztRQUQ4RixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBRTlILElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQW9CO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFhO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWlCO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBa0I7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVPLFVBQVU7UUFDaEIsT0FBTyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0QXJjIGV4dGVuZHMgQWNFbnRpdHkge1xuICBzdGF0aWMgY291bnRlciA9IDA7XG4gIHByaXZhdGUgaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBlZGl0ZWRFbnRpdHlJZDogc3RyaW5nO1xuICBwcml2YXRlIF9jZW50ZXI6IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX3JhZGl1czogbnVtYmVyO1xuICBwcml2YXRlIF9kZWx0YTogbnVtYmVyO1xuICBwcml2YXRlIF9hbmdsZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcsIGNlbnRlcjogQ2FydGVzaWFuMywgcmFkaXVzOiBudW1iZXIsIGRlbHRhOiBudW1iZXIsIGFuZ2xlOiBudW1iZXIsIHByaXZhdGUgX2FyY1Byb3BzOiBQb2x5bGluZVByb3BzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlkID0gdGhpcy5nZW5lcmF0ZUlkKCk7XG4gICAgdGhpcy5lZGl0ZWRFbnRpdHlJZCA9IGVudGl0eUlkO1xuICAgIHRoaXMuX2NlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLl9yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5fZGVsdGEgPSBkZWx0YTtcbiAgICB0aGlzLl9hbmdsZSA9IGFuZ2xlO1xuICB9XG5cbiAgZ2V0IHByb3BzKCkge1xuICAgIHJldHVybiB0aGlzLl9hcmNQcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyhwcm9wczogUG9seWxpbmVQcm9wcykge1xuICAgIHRoaXMuX2FyY1Byb3BzID0gcHJvcHM7XG4gIH1cblxuICBnZXQgYW5nbGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fYW5nbGU7XG4gIH1cblxuICBzZXQgYW5nbGUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2FuZ2xlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGVsdGEoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsdGE7XG4gIH1cblxuICBzZXQgZGVsdGEodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2RlbHRhID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcmFkaXVzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JhZGl1cztcbiAgfVxuXG4gIHNldCByYWRpdXModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3JhZGl1cyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICB9XG5cbiAgc2V0IGNlbnRlcih2YWx1ZTogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuX2NlbnRlciA9IHZhbHVlO1xuICB9XG5cbiAgdXBkYXRlQ2VudGVyKGNlbnRlcjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuX2NlbnRlci54ID0gY2VudGVyLng7XG4gICAgdGhpcy5fY2VudGVyLnkgPSBjZW50ZXIueTtcbiAgICB0aGlzLl9jZW50ZXIueiA9IGNlbnRlci56O1xuICB9XG5cbiAgZ2V0SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZWRpdC1hcmMtJyArIEVkaXRBcmMuY291bnRlcisrO1xuICB9XG59XG4iXX0=
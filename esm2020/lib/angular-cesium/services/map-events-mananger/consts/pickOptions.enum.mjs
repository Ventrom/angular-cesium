/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
export var PickOptions;
(function (PickOptions) {
    PickOptions[PickOptions["NO_PICK"] = 0] = "NO_PICK";
    PickOptions[PickOptions["PICK_FIRST"] = 1] = "PICK_FIRST";
    PickOptions[PickOptions["PICK_ONE"] = 2] = "PICK_ONE";
    PickOptions[PickOptions["PICK_ALL"] = 3] = "PICK_ALL";
})(PickOptions || (PickOptions = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja09wdGlvbnMuZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBTixJQUFZLFdBS1g7QUFMRCxXQUFZLFdBQVc7SUFDckIsbURBQU8sQ0FBQTtJQUNQLHlEQUFVLENBQUE7SUFDVixxREFBUSxDQUFBO0lBQ1IscURBQVEsQ0FBQTtBQUNWLENBQUMsRUFMVyxXQUFXLEtBQVgsV0FBVyxRQUt0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIE5PX1BJQ0ssICAgIC0gd2lsbCBub3QgcGljayBlbnRpdGllc1xuICogIFBJQ0tfRklSU1QgIC0gZmlyc3QgZW50aXR5IHdpbGwgYmUgcGlja2VkIC4gdXNlIENlc2l1bS5zY2VuZS5waWNrKClcbiAqICBQSUNLX09ORSAgICAtIGluIGNhc2UgYSBmZXcgZW50aXRpZXMgYXJlIHBpY2tlZCBwbG9udGVyIGlzIHJlc29sdmVkIC4gdXNlIENlc2l1bS5zY2VuZS5kcmlsbFBpY2soKVxuICogIFBJQ0tfQUxMICAgIC0gYWxsIGVudGl0aWVzIGFyZSBwaWNrZWQuIHVzZSBDZXNpdW0uc2NlbmUuZHJpbGxQaWNrKClcbiAqL1xuZXhwb3J0IGVudW0gUGlja09wdGlvbnMge1xuICBOT19QSUNLLFxuICBQSUNLX0ZJUlNULFxuICBQSUNLX09ORSxcbiAgUElDS19BTExcbn1cbiJdfQ==
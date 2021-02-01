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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja09wdGlvbnMuZW51bS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQU4sSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLG1EQUFPLENBQUE7SUFDUCx5REFBVSxDQUFBO0lBQ1YscURBQVEsQ0FBQTtJQUNSLHFEQUFRLENBQUE7QUFDVixDQUFDLEVBTFcsV0FBVyxLQUFYLFdBQVcsUUFLdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICBOT19QSUNLLCAgICAtIHdpbGwgbm90IHBpY2sgZW50aXRpZXNcbiAqICBQSUNLX0ZJUlNUICAtIGZpcnN0IGVudGl0eSB3aWxsIGJlIHBpY2tlZCAuIHVzZSBDZXNpdW0uc2NlbmUucGljaygpXG4gKiAgUElDS19PTkUgICAgLSBpbiBjYXNlIGEgZmV3IGVudGl0aWVzIGFyZSBwaWNrZWQgcGxvbnRlciBpcyByZXNvbHZlZCAuIHVzZSBDZXNpdW0uc2NlbmUuZHJpbGxQaWNrKClcbiAqICBQSUNLX0FMTCAgICAtIGFsbCBlbnRpdGllcyBhcmUgcGlja2VkLiB1c2UgQ2VzaXVtLnNjZW5lLmRyaWxsUGljaygpXG4gKi9cbmV4cG9ydCBlbnVtIFBpY2tPcHRpb25zIHtcbiAgTk9fUElDSyxcbiAgUElDS19GSVJTVCxcbiAgUElDS19PTkUsXG4gIFBJQ0tfQUxMXG59XG4iXX0=
/**
 * Created by rburson on 4/22/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoLocationDef = (function (_super) {
            __extends(GeoLocationDef, _super);
            function GeoLocationDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
            }
            return GeoLocationDef;
        })(dialog.PaneDef);
        dialog.GeoLocationDef = GeoLocationDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

/**
 * Created by rburson on 4/22/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PaneDef_1 = require("./PaneDef");
var GeoFixDef = (function (_super) {
    __extends(GeoFixDef, _super);
    function GeoFixDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return GeoFixDef;
})(PaneDef_1.PaneDef);
exports.GeoFixDef = GeoFixDef;

/**
 * Created by rburson on 4/1/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
var XGeoFixDef = (function (_super) {
    __extends(XGeoFixDef, _super);
    function XGeoFixDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XGeoFixDef;
})(XPaneDef_1.XPaneDef);
exports.XGeoFixDef = XGeoFixDef;

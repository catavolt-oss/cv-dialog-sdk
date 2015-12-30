/**
 * Created by rburson on 3/31/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
var XBarcodeScanDef = (function (_super) {
    __extends(XBarcodeScanDef, _super);
    function XBarcodeScanDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XBarcodeScanDef;
})(XPaneDef_1.XPaneDef);
exports.XBarcodeScanDef = XBarcodeScanDef;

/**
 * Created by rburson on 4/16/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CellValueDef_1 = require("./CellValueDef");
var ForcedLineCellValueDef = (function (_super) {
    __extends(ForcedLineCellValueDef, _super);
    function ForcedLineCellValueDef() {
        _super.call(this, null);
    }
    return ForcedLineCellValueDef;
})(CellValueDef_1.CellValueDef);
exports.ForcedLineCellValueDef = ForcedLineCellValueDef;

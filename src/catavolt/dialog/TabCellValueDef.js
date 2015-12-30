/**
 * Created by rburson on 4/16/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CellValueDef_1 = require("./CellValueDef");
var TabCellValueDef = (function (_super) {
    __extends(TabCellValueDef, _super);
    function TabCellValueDef() {
        _super.call(this, null);
    }
    return TabCellValueDef;
})(CellValueDef_1.CellValueDef);
exports.TabCellValueDef = TabCellValueDef;

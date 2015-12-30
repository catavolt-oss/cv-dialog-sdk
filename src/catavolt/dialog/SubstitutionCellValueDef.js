/**
 * Created by rburson on 4/16/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CellValueDef_1 = require("./CellValueDef");
var SubstitutionCellValueDef = (function (_super) {
    __extends(SubstitutionCellValueDef, _super);
    function SubstitutionCellValueDef(_value, style) {
        _super.call(this, style);
        this._value = _value;
    }
    Object.defineProperty(SubstitutionCellValueDef.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return SubstitutionCellValueDef;
})(CellValueDef_1.CellValueDef);
exports.SubstitutionCellValueDef = SubstitutionCellValueDef;

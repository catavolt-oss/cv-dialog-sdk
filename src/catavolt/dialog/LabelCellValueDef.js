/**
 * Created by rburson on 4/16/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var LabelCellValueDef = (function (_super) {
            __extends(LabelCellValueDef, _super);
            function LabelCellValueDef(_value, style) {
                _super.call(this, style);
                this._value = _value;
            }
            Object.defineProperty(LabelCellValueDef.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return LabelCellValueDef;
        })(dialog.CellValueDef);
        dialog.LabelCellValueDef = LabelCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

/**
 * Created by rburson on 4/16/15.
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
        var ForcedLineCellValueDef = (function (_super) {
            __extends(ForcedLineCellValueDef, _super);
            function ForcedLineCellValueDef() {
                _super.call(this, null);
            }
            return ForcedLineCellValueDef;
        })(dialog.CellValueDef);
        dialog.ForcedLineCellValueDef = ForcedLineCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

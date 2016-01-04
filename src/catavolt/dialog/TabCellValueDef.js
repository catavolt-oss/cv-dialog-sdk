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
        var TabCellValueDef = (function (_super) {
            __extends(TabCellValueDef, _super);
            function TabCellValueDef() {
                _super.call(this, null);
            }
            return TabCellValueDef;
        })(dialog.CellValueDef);
        dialog.TabCellValueDef = TabCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

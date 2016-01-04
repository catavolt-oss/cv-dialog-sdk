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
        var BarcodeScanDef = (function (_super) {
            __extends(BarcodeScanDef, _super);
            function BarcodeScanDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
            }
            return BarcodeScanDef;
        })(dialog.PaneDef);
        dialog.BarcodeScanDef = BarcodeScanDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

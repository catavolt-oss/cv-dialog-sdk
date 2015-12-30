/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EditorContext_1 = require("./EditorContext");
var BarcodeScanContext = (function (_super) {
    __extends(BarcodeScanContext, _super);
    function BarcodeScanContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(BarcodeScanContext.prototype, "barcodeScanDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return BarcodeScanContext;
})(EditorContext_1.EditorContext);
exports.BarcodeScanContext = BarcodeScanContext;

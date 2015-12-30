/**
 * Created by rburson on 3/31/15.
 */
var XChangePaneModeResult = (function () {
    function XChangePaneModeResult(editorRecordDef, dialogProperties) {
        this.editorRecordDef = editorRecordDef;
        this.dialogProperties = dialogProperties;
    }
    Object.defineProperty(XChangePaneModeResult.prototype, "entityRecDef", {
        get: function () {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XChangePaneModeResult.prototype, "dialogProps", {
        get: function () {
            return this.dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    return XChangePaneModeResult;
})();
exports.XChangePaneModeResult = XChangePaneModeResult;

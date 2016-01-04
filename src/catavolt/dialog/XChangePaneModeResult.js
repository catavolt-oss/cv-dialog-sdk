/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
        dialog.XChangePaneModeResult = XChangePaneModeResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

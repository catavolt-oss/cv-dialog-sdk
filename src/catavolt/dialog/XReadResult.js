/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XReadResult = (function () {
            function XReadResult(_editorRecord, _editorRecordDef, _dialogProperties) {
                this._editorRecord = _editorRecord;
                this._editorRecordDef = _editorRecordDef;
                this._dialogProperties = _dialogProperties;
            }
            Object.defineProperty(XReadResult.prototype, "entityRec", {
                get: function () {
                    return this._editorRecord;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XReadResult.prototype, "entityRecDef", {
                get: function () {
                    return this._editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XReadResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            return XReadResult;
        })();
        dialog.XReadResult = XReadResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
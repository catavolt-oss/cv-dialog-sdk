/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XWriteResult = (function () {
            function XWriteResult(_editorRecord, _editorRecordDef, _dialogProperties) {
                this._editorRecord = _editorRecord;
                this._editorRecordDef = _editorRecordDef;
                this._dialogProperties = _dialogProperties;
            }
            XWriteResult.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.extractTriple(jsonObj, 'WSWriteResult', function () {
                    return dialog.OType.deserializeObject(jsonObj, 'XWriteResult', dialog.OType.factoryFn);
                });
            };
            Object.defineProperty(XWriteResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "entityRec", {
                get: function () {
                    return this._editorRecord;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "entityRecDef", {
                get: function () {
                    return this._editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "isDestroyed", {
                get: function () {
                    var destoyedStr = this.dialogProps['destroyed'];
                    return destoyedStr && destoyedStr.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            return XWriteResult;
        })();
        dialog.XWriteResult = XWriteResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

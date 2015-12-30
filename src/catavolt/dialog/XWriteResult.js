/**
 * Created by rburson on 4/1/15.
 */
var DialogTriple_1 = require('./DialogTriple');
var OType_1 = require('./OType');
var XWriteResult = (function () {
    function XWriteResult(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    XWriteResult.fromWS = function (otype, jsonObj) {
        return DialogTriple_1.DialogTriple.extractTriple(jsonObj, 'WSWriteResult', function () {
            return OType_1.OType.deserializeObject(jsonObj, 'XWriteResult', OType_1.OType.factoryFn);
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
exports.XWriteResult = XWriteResult;

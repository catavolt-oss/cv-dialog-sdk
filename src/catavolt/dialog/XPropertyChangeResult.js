/**
 * Created by rburson on 4/1/15.
 */
var XPropertyChangeResult = (function () {
    function XPropertyChangeResult(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
        this.availableValueChanges = availableValueChanges;
        this.propertyName = propertyName;
        this.sideEffects = sideEffects;
        this.editorRecordDef = editorRecordDef;
    }
    Object.defineProperty(XPropertyChangeResult.prototype, "sideEffectsDef", {
        get: function () {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    return XPropertyChangeResult;
})();
exports.XPropertyChangeResult = XPropertyChangeResult;

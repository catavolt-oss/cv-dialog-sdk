/**
 * Created by rburson on 4/1/15.
 */
var XOpenEditorModelResult = (function () {
    function XOpenEditorModelResult(editorRecordDef, formModel) {
        this.editorRecordDef = editorRecordDef;
        this.formModel = formModel;
    }
    Object.defineProperty(XOpenEditorModelResult.prototype, "entityRecDef", {
        get: function () {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formPaneId", {
        get: function () {
            return this.formModel.form.paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formRedirection", {
        get: function () {
            return this.formModel.form.redirection;
        },
        enumerable: true,
        configurable: true
    });
    return XOpenEditorModelResult;
})();
exports.XOpenEditorModelResult = XOpenEditorModelResult;

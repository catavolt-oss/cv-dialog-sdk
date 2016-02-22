/**
 * Created by rburson on 4/1/15.
 */
export class XOpenEditorModelResult {
    constructor(editorRecordDef, formModel) {
        this.editorRecordDef = editorRecordDef;
        this.formModel = formModel;
    }
    get entityRecDef() {
        return this.editorRecordDef;
    }
    get formPaneId() {
        return this.formModel.form.paneId;
    }
    get formRedirection() {
        return this.formModel.form.redirection;
    }
}

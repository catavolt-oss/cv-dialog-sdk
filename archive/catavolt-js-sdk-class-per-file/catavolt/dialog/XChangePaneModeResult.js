/**
 * Created by rburson on 3/31/15.
 */
export class XChangePaneModeResult {
    constructor(editorRecordDef, dialogProperties) {
        this.editorRecordDef = editorRecordDef;
        this.dialogProperties = dialogProperties;
    }
    get entityRecDef() {
        return this.editorRecordDef;
    }
    get dialogProps() {
        return this.dialogProperties;
    }
}

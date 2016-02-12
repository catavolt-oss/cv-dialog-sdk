/**
 * Created by rburson on 4/1/15.
 */
export class XReadResult {
    constructor(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    get entityRec() {
        return this._editorRecord;
    }
    get entityRecDef() {
        return this._editorRecordDef;
    }
    get dialogProps() {
        return this._dialogProperties;
    }
}
//# sourceMappingURL=XReadResult.js.map
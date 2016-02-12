/**
 * Created by rburson on 4/1/15.
 */
import { DialogTriple } from './DialogTriple';
import { OType } from './OType';
export class XWriteResult {
    constructor(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    static fromWS(otype, jsonObj) {
        return DialogTriple.extractTriple(jsonObj, 'WSWriteResult', () => {
            return OType.deserializeObject(jsonObj, 'XWriteResult', OType.factoryFn);
        });
    }
    get dialogProps() {
        return this._dialogProperties;
    }
    get entityRec() {
        return this._editorRecord;
    }
    get entityRecDef() {
        return this._editorRecordDef;
    }
    get isDestroyed() {
        var destoyedStr = this.dialogProps['destroyed'];
        return destoyedStr && destoyedStr.toLowerCase() === 'true';
    }
}
//# sourceMappingURL=XWriteResult.js.map
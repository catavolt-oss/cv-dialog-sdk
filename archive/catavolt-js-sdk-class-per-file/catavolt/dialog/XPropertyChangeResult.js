/**
 * Created by rburson on 4/1/15.
 */
export class XPropertyChangeResult {
    constructor(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
        this.availableValueChanges = availableValueChanges;
        this.propertyName = propertyName;
        this.sideEffects = sideEffects;
        this.editorRecordDef = editorRecordDef;
    }
    get sideEffectsDef() {
        return this.editorRecordDef;
    }
}
//# sourceMappingURL=XPropertyChangeResult.js.map
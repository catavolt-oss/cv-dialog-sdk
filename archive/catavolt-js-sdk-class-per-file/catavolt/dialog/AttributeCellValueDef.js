/**
 * Created by rburson on 4/16/15.
 */
import { CellValueDef } from "./CellValueDef";
export class AttributeCellValueDef extends CellValueDef {
    constructor(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
        super(style);
        this._propertyName = _propertyName;
        this._presentationLength = _presentationLength;
        this._entryMethod = _entryMethod;
        this._autoFillCapable = _autoFillCapable;
        this._hint = _hint;
        this._toolTip = _toolTip;
        this._fieldActions = _fieldActions;
    }
    get autoFileCapable() {
        return this._autoFillCapable;
    }
    get entryMethod() {
        return this._entryMethod;
    }
    get fieldActions() {
        return this._fieldActions;
    }
    get hint() {
        return this._hint;
    }
    get isComboBoxEntryMethod() {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
    }
    get isDropDownEntryMethod() {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
    }
    get isTextFieldEntryMethod() {
        return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
    }
    get presentationLength() {
        return this._presentationLength;
    }
    get propertyName() {
        return this._propertyName;
    }
    get toolTip() {
        return this._toolTip;
    }
}
//# sourceMappingURL=AttributeCellValueDef.js.map
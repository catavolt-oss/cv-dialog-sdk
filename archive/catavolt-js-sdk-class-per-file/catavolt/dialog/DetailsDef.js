/**
 * Created by rburson on 4/21/15.
 */
import { PaneDef } from "./PaneDef";
export class DetailsDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._cancelButtonText = _cancelButtonText;
        this._commitButtonText = _commitButtonText;
        this._editable = _editable;
        this._focusPropName = _focusPropName;
        this._graphicalMarkup = _graphicalMarkup;
        this._rows = _rows;
    }
    get cancelButtonText() {
        return this._cancelButtonText;
    }
    get commitButtonText() {
        return this._commitButtonText;
    }
    get editable() {
        return this._editable;
    }
    get focusPropName() {
        return this._focusPropName;
    }
    get graphicalMarkup() {
        return this._graphicalMarkup;
    }
    get rows() {
        return this._rows;
    }
}
//# sourceMappingURL=DetailsDef.js.map
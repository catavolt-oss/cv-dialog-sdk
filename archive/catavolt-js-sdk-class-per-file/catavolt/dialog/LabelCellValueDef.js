/**
 * Created by rburson on 4/16/15.
 */
import { CellValueDef } from "./CellValueDef";
export class LabelCellValueDef extends CellValueDef {
    constructor(_value, style) {
        super(style);
        this._value = _value;
    }
    get value() {
        return this._value;
    }
}

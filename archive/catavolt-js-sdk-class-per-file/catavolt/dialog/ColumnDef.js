/**
 * Created by rburson on 4/1/15.
 */
export class ColumnDef {
    constructor(_name, _heading, _propertyDef) {
        this._name = _name;
        this._heading = _heading;
        this._propertyDef = _propertyDef;
    }
    get heading() {
        return this._heading;
    }
    get isInlineMediaStyle() {
        return this._propertyDef.isInlineMediaStyle;
    }
    get name() {
        return this._name;
    }
    get propertyDef() {
        return this._propertyDef;
    }
}

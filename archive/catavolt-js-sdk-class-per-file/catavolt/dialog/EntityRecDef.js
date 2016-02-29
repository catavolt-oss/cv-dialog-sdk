/**
 * Created by rburson on 3/31/15.
 */
export class EntityRecDef {
    constructor(_propDefs) {
        this._propDefs = _propDefs;
    }
    get propCount() {
        return this.propDefs.length;
    }
    propDefAtName(name) {
        var propDef = null;
        this.propDefs.some((p) => {
            if (p.name === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    }
    // Note we need to support both 'propDefs' and 'propertyDefs' as both
    // field names seem to be used in the dialog model
    get propDefs() {
        return this._propDefs;
    }
    set propDefs(propDefs) {
        this._propDefs = propDefs;
    }
    get propertyDefs() {
        return this._propDefs;
    }
    set propertyDefs(propDefs) {
        this._propDefs = propDefs;
    }
    get propNames() {
        return this.propDefs.map((p) => {
            return p.name;
        });
    }
}

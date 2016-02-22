/**
 * Created by rburson on 4/1/15.
 */
export class SortPropDef {
    constructor(_name, _direction) {
        this._name = _name;
        this._direction = _direction;
    }
    get direction() {
        return this._direction;
    }
    get name() {
        return this._name;
    }
}

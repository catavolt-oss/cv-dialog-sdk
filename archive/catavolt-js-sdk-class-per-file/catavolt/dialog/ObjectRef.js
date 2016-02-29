/**
 * Created by rburson on 4/5/15.
 */
import { StringUtil } from "../util/StringUtil";
export class ObjectRef {
    constructor(_objectId, _description) {
        this._objectId = _objectId;
        this._description = _description;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    }
    get description() {
        return this._description;
    }
    get objectId() {
        return this._objectId;
    }
    toString() {
        return this.objectId + ":" + this.description;
    }
}

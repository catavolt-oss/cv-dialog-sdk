/**
 * Created by rburson on 4/5/15.
 */
import { StringUtil } from "../util/StringUtil";
export class CodeRef {
    constructor(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    }
    get code() {
        return this._code;
    }
    get description() {
        return this._description;
    }
    toString() {
        return this.code + ":" + this.description;
    }
}

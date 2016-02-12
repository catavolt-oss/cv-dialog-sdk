/**
 * Created by rburson on 3/17/15.
 */
import { StringUtil } from "../util/StringUtil";
export class XGetSessionListPropertyResult {
    constructor(_list, _dialogProps) {
        this._list = _list;
        this._dialogProps = _dialogProps;
    }
    get dialogProps() {
        return this._dialogProps;
    }
    get values() {
        return this._list;
    }
    valuesAsDictionary() {
        var result = {};
        this.values.forEach((v) => {
            var pair = StringUtil.splitSimpleKeyValuePair(v);
            result[pair[0]] = pair[1];
        });
        return result;
    }
}
//# sourceMappingURL=XGetSessionListPropertyResult.js.map
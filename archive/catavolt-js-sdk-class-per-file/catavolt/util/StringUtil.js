/**
 * Created by rburson on 4/3/15.
 */
export class StringUtil {
    static splitSimpleKeyValuePair(pairString) {
        var pair = pairString.split(':');
        var code = pair[0];
        var desc = pair.length > 1 ? pair[1] : '';
        return [code, desc];
    }
}
//# sourceMappingURL=StringUtil.js.map
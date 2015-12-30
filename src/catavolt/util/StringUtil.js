/**
 * Created by rburson on 4/3/15.
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    StringUtil.splitSimpleKeyValuePair = function (pairString) {
        var pair = pairString.split(':');
        var code = pair[0];
        var desc = pair.length > 1 ? pair[1] : '';
        return [code, desc];
    };
    return StringUtil;
})();
exports.StringUtil = StringUtil;

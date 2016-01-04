/**
 * Created by rburson on 4/3/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
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
        util.StringUtil = StringUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));

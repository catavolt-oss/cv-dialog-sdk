/**
 * Created by rburson on 3/6/15.
 */
var ArrayUtil = (function () {
    function ArrayUtil() {
    }
    ArrayUtil.copy = function (source) {
        return source.map(function (e) {
            return e;
        });
    };
    ArrayUtil.find = function (source, f) {
        var value = null;
        source.some(function (v) {
            if (f(v)) {
                value = v;
                return true;
            }
            return false;
        });
        return value;
    };
    return ArrayUtil;
})();
exports.ArrayUtil = ArrayUtil;

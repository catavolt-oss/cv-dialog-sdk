/**
 * Created by rburson on 3/20/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var ObjUtil = (function () {
            function ObjUtil() {
            }
            ObjUtil.addAllProps = function (sourceObj, targetObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return targetObj;
                if (null == targetObj || "object" != typeof targetObj)
                    return targetObj;
                for (var attr in sourceObj) {
                    targetObj[attr] = sourceObj[attr];
                }
                return targetObj;
            };
            ObjUtil.cloneOwnProps = function (sourceObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return sourceObj;
                var copy = sourceObj.constructor();
                for (var attr in sourceObj) {
                    if (sourceObj.hasOwnProperty(attr)) {
                        copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
                    }
                }
                return copy;
            };
            ObjUtil.formatRecAttr = function (o) {
                return JSON.stringify(o);
            };
            ObjUtil.newInstance = function (type) {
                return new type;
            };
            return ObjUtil;
        })();
        util.ObjUtil = ObjUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
//# sourceMappingURL=catavolt_sdk.js.map
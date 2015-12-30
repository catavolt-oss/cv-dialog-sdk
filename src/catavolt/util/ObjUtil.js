/**
 * Created by rburson on 3/20/15.
 */
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
    ObjUtil.copyNonNullFieldsOnly = function (obj, newObj, filterFn) {
        for (var prop in obj) {
            if (!filterFn || filterFn(prop)) {
                var type = typeof obj[prop];
                if (type !== 'function') {
                    var val = obj[prop];
                    if (val) {
                        newObj[prop] = val;
                    }
                }
            }
        }
        return newObj;
    };
    ObjUtil.formatRecAttr = function (o) {
        //@TODO - add a filter here to build a cache and detect (and skip) circular references
        return JSON.stringify(o);
    };
    ObjUtil.newInstance = function (type) {
        return new type;
    };
    return ObjUtil;
})();
exports.ObjUtil = ObjUtil;

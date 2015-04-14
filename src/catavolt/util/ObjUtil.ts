/**
 * Created by rburson on 3/20/15.
 */

module catavolt.util {

    export class ObjUtil {

        static addAllProps(sourceObj, targetObj):any {
            if (null == sourceObj || "object" != typeof sourceObj) return targetObj;
            if (null == targetObj || "object" != typeof targetObj) return targetObj;
            for (var attr in sourceObj) {
                targetObj[attr] = sourceObj[attr];
            }
            return targetObj;
        }

        static cloneOwnProps(sourceObj):any {
            if (null == sourceObj || "object" != typeof sourceObj) return sourceObj;
            var copy = sourceObj.constructor();
            for (var attr in sourceObj) {
                if (sourceObj.hasOwnProperty(attr)) {
                    copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
                }
            }
            return copy;
        }

        static copyNonNullFieldsOnly(obj, newObj, filterFn?:(prop)=>boolean) {
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
        }

        static formatRecAttr(o):string {
            return JSON.stringify(o);
        }

        static newInstance(type) {
            return new type;
        }

    }

}
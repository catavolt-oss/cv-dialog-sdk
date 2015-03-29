/**
 * Created by rburson on 3/20/15.
 */

module catavolt.util {

    export class ObjUtil {
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

        static formatRecString(o):string {
            return JSON.stringify(o);
        }
    }

}
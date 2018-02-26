/**
 * *****************************************************
 */

export class ObjUtil {
    public static addAllProps(sourceObj, targetObj): any {
        if (null == sourceObj || 'object' !== typeof sourceObj) {
            return targetObj;
        }
        if (null == targetObj || 'object' !== typeof targetObj) {
            return targetObj;
        }
        for (const attr in sourceObj) {
            if (sourceObj.hasOwnProperty(attr)) {
                targetObj[attr] = sourceObj[attr];
            }
        }
        return targetObj;
    }

    public static cloneOwnProps(sourceObj): any {
        if (null == sourceObj || 'object' !== typeof sourceObj) {
            return sourceObj;
        }
        const copy = sourceObj.constructor();
        for (const attr in sourceObj) {
            if (sourceObj.hasOwnProperty(attr)) {
                copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
            }
        }
        return copy;
    }

    public static copyNonNullFieldsOnly(obj, newObj, filterFn?: (prop) => boolean) {
        for (const prop in obj) {
            if (!filterFn || filterFn(prop)) {
                const type = typeof obj[prop];
                if (type !== 'function') {
                    const val = obj[prop];
                    if (val) {
                        newObj[prop] = val;
                    }
                }
            }
        }
        return newObj;
    }

    public static formatRecAttr(o, prettyPrint?: true): string {
        // @TODO - add a filter here to build a cache and detect (and skip) circular references
        if (prettyPrint) {
            return JSON.stringify(o, null, 2);
        } else {
            return JSON.stringify(o);
        }
    }

    public static newInstance(type) {
        return new type();
    }
}

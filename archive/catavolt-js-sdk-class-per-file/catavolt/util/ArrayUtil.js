/**
 * Created by rburson on 3/6/15.
 */
export class ArrayUtil {
    static copy(source) {
        return source.map((e) => {
            return e;
        });
    }
    static find(source, f) {
        var value = null;
        source.some((v) => {
            if (f(v)) {
                value = v;
                return true;
            }
            return false;
        });
        return value;
    }
}
//# sourceMappingURL=ArrayUtil.js.map
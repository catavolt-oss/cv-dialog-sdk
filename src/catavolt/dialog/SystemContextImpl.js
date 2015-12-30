/**
 * Created by rburson on 3/9/15.
 */
var SystemContextImpl = (function () {
    function SystemContextImpl(_urlString) {
        this._urlString = _urlString;
    }
    Object.defineProperty(SystemContextImpl.prototype, "urlString", {
        get: function () {
            return this._urlString;
        },
        enumerable: true,
        configurable: true
    });
    return SystemContextImpl;
})();
exports.SystemContextImpl = SystemContextImpl;

/**
 * Created by rburson on 4/5/15.
 */
var StringUtil_1 = require("../util/StringUtil");
var CodeRef = (function () {
    function CodeRef(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    CodeRef.fromFormattedValue = function (value) {
        var pair = StringUtil_1.StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    };
    Object.defineProperty(CodeRef.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRef.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    CodeRef.prototype.toString = function () {
        return this.code + ":" + this.description;
    };
    return CodeRef;
})();
exports.CodeRef = CodeRef;

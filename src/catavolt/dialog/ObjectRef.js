/**
 * Created by rburson on 4/5/15.
 */
var StringUtil_1 = require("../util/StringUtil");
var ObjectRef = (function () {
    function ObjectRef(_objectId, _description) {
        this._objectId = _objectId;
        this._description = _description;
    }
    ObjectRef.fromFormattedValue = function (value) {
        var pair = StringUtil_1.StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    };
    Object.defineProperty(ObjectRef.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectRef.prototype, "objectId", {
        get: function () {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    ObjectRef.prototype.toString = function () {
        return this.objectId + ":" + this.description;
    };
    return ObjectRef;
})();
exports.ObjectRef = ObjectRef;

/**
 * Created by rburson on 4/1/15.
 */
var SortPropDef = (function () {
    function SortPropDef(_name, _direction) {
        this._name = _name;
        this._direction = _direction;
    }
    Object.defineProperty(SortPropDef.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortPropDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return SortPropDef;
})();
exports.SortPropDef = SortPropDef;

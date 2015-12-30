/**
 * Created by rburson on 3/31/15.
 */
var CellDef = (function () {
    function CellDef(_values) {
        this._values = _values;
    }
    Object.defineProperty(CellDef.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    return CellDef;
})();
exports.CellDef = CellDef;

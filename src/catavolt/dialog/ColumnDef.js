/**
 * Created by rburson on 4/1/15.
 */
var ColumnDef = (function () {
    function ColumnDef(_name, _heading, _propertyDef) {
        this._name = _name;
        this._heading = _heading;
        this._propertyDef = _propertyDef;
    }
    Object.defineProperty(ColumnDef.prototype, "heading", {
        get: function () {
            return this._heading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "isInlineMediaStyle", {
        get: function () {
            return this._propertyDef.isInlineMediaStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "propertyDef", {
        get: function () {
            return this._propertyDef;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnDef;
})();
exports.ColumnDef = ColumnDef;

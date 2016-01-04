/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
        dialog.ColumnDef = ColumnDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRecDef = (function () {
            function EntityRecDef(_propDefs) {
                this._propDefs = _propDefs;
            }
            Object.defineProperty(EntityRecDef.prototype, "propCount", {
                get: function () {
                    return this.propDefs.length;
                },
                enumerable: true,
                configurable: true
            });
            EntityRecDef.prototype.propDefAtName = function (name) {
                var propDef = null;
                this.propDefs.some(function (p) {
                    if (p.name === name) {
                        propDef = p;
                        return true;
                    }
                    return false;
                });
                return propDef;
            };
            Object.defineProperty(EntityRecDef.prototype, "propDefs", {
                // Note we need to support both 'propDefs' and 'propertyDefs' as both
                // field names seem to be used in the dialog model
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propertyDefs", {
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propNames", {
                get: function () {
                    return this.propDefs.map(function (p) { return p.name; });
                },
                enumerable: true,
                configurable: true
            });
            return EntityRecDef;
        })();
        dialog.EntityRecDef = EntityRecDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

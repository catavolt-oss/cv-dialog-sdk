/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO

    Test all of the deserialization methods
    They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
        dialog.CellDef = CellDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

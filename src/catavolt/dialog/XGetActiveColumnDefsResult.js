/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetActiveColumnDefsResult = (function () {
            function XGetActiveColumnDefsResult(columnsStyle, columns) {
                this.columnsStyle = columnsStyle;
                this.columns = columns;
            }
            Object.defineProperty(XGetActiveColumnDefsResult.prototype, "columnDefs", {
                get: function () {
                    return this.columns;
                },
                enumerable: true,
                configurable: true
            });
            return XGetActiveColumnDefsResult;
        })();
        dialog.XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

/**
 * Created by rburson on 4/1/15.
 */
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
exports.XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;

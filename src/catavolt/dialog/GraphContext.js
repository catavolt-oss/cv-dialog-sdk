/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphContext = (function (_super) {
            __extends(GraphContext, _super);
            function GraphContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(GraphContext.prototype, "graphDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return GraphContext;
        })(dialog.QueryContext);
        dialog.GraphContext = GraphContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

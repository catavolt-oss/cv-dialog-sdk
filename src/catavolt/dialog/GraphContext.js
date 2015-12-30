/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryContext_1 = require("./QueryContext");
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
})(QueryContext_1.QueryContext);
exports.GraphContext = GraphContext;

/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EditorContext_1 = require("./EditorContext");
var GeoFixContext = (function (_super) {
    __extends(GeoFixContext, _super);
    function GeoFixContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GeoFixContext.prototype, "geoFixDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GeoFixContext;
})(EditorContext_1.EditorContext);
exports.GeoFixContext = GeoFixContext;

/**
 * Created by rburson on 4/1/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
var XListDef = (function (_super) {
    __extends(XListDef, _super);
    function XListDef(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.style = style;
        this.initialColumns = initialColumns;
        this.columnsStyle = columnsStyle;
        this.overrideGML = overrideGML;
    }
    Object.defineProperty(XListDef.prototype, "graphicalMarkup", {
        get: function () {
            return this.overrideGML;
        },
        set: function (graphicalMarkup) {
            this.overrideGML = graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    return XListDef;
})(XPaneDef_1.XPaneDef);
exports.XListDef = XListDef;

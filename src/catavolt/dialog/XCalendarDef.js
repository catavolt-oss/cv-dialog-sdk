/**
 * Created by rburson on 3/31/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
var XCalendarDef = (function (_super) {
    __extends(XCalendarDef, _super);
    function XCalendarDef(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.initialStyle = initialStyle;
        this.startDateProperty = startDateProperty;
        this.startTimeProperty = startTimeProperty;
        this.endDateProperty = endDateProperty;
        this.endTimeProperty = endTimeProperty;
        this.occurDateProperty = occurDateProperty;
        this.occurTimeProperty = occurTimeProperty;
    }
    return XCalendarDef;
})(XPaneDef_1.XPaneDef);
exports.XCalendarDef = XCalendarDef;

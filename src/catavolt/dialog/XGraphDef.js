/**
 * Created by rburson on 4/1/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XPaneDef_1 = require("./XPaneDef");
var XGraphDef = (function (_super) {
    __extends(XGraphDef, _super);
    function XGraphDef(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.graphType = graphType;
        this.identityDataPoint = identityDataPoint;
        this.groupingDataPoint = groupingDataPoint;
        this.dataPoints = dataPoints;
        this.filterDataPoints = filterDataPoints;
        this.sampleModel = sampleModel;
    }
    return XGraphDef;
})(XPaneDef_1.XPaneDef);
exports.XGraphDef = XGraphDef;

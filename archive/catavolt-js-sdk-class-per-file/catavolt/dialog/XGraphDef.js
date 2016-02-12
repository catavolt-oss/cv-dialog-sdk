/**
 * Created by rburson on 4/1/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XGraphDef extends XPaneDef {
    constructor(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
        super();
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
}
//# sourceMappingURL=XGraphDef.js.map
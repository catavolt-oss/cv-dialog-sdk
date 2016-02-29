/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class GraphDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._graphType = _graphType;
        this._identityDataPointDef = _identityDataPointDef;
        this._groupingDataPointDef = _groupingDataPointDef;
        this._dataPointDefs = _dataPointDefs;
        this._filterDataPointDefs = _filterDataPointDefs;
        this._sampleModel = _sampleModel;
    }
    get dataPointDefs() {
        return this._dataPointDefs;
    }
    get filterDataPointDefs() {
        return this._filterDataPointDefs;
    }
    get identityDataPointDef() {
        return this._identityDataPointDef;
    }
    get groupingDataPointDef() {
        return this._groupingDataPointDef;
    }
    get sampleModel() {
        return this._sampleModel;
    }
}

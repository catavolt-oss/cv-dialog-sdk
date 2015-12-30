/**
 * Created by rburson on 4/1/15.
 */
var GraphDataPointDef = (function () {
    function GraphDataPointDef(_name, _type, _plotType, _legendkey) {
        this._name = _name;
        this._type = _type;
        this._plotType = _plotType;
        this._legendkey = _legendkey;
    }
    return GraphDataPointDef;
})();
exports.GraphDataPointDef = GraphDataPointDef;

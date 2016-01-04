/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphDataPointDef = (function () {
            function GraphDataPointDef(_name, _type, _plotType, _legendkey) {
                this._name = _name;
                this._type = _type;
                this._plotType = _plotType;
                this._legendkey = _legendkey;
            }
            return GraphDataPointDef;
        })();
        dialog.GraphDataPointDef = GraphDataPointDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

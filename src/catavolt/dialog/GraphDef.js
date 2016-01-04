/**
 * Created by rburson on 4/22/15.
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
        var GraphDef = (function (_super) {
            __extends(GraphDef, _super);
            function GraphDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._graphType = _graphType;
                this._identityDataPointDef = _identityDataPointDef;
                this._groupingDataPointDef = _groupingDataPointDef;
                this._dataPointDefs = _dataPointDefs;
                this._filterDataPointDefs = _filterDataPointDefs;
                this._sampleModel = _sampleModel;
            }
            Object.defineProperty(GraphDef.prototype, "dataPointDefs", {
                get: function () {
                    return this._dataPointDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "filterDataPointDefs", {
                get: function () {
                    return this._filterDataPointDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "identityDataPointDef", {
                get: function () {
                    return this._identityDataPointDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "groupingDataPointDef", {
                get: function () {
                    return this._groupingDataPointDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "sampleModel", {
                get: function () {
                    return this._sampleModel;
                },
                enumerable: true,
                configurable: true
            });
            return GraphDef;
        })(dialog.PaneDef);
        dialog.GraphDef = GraphDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

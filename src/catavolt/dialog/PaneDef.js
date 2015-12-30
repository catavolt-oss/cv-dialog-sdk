/**
 * Created by rburson on 3/30/15.
 */
var ObjUtil_1 = require("../util/ObjUtil");
var XListDef_1 = require("./XListDef");
var ListDef_1 = require("./ListDef");
var XDetailsDef_1 = require("./XDetailsDef");
var DetailsDef_1 = require("./DetailsDef");
var XMapDef_1 = require("./XMapDef");
var MapDef_1 = require("./MapDef");
var XGraphDef_1 = require("./XGraphDef");
var GraphDef_1 = require("./GraphDef");
var XBarcodeScanDef_1 = require("./XBarcodeScanDef");
var BarcodeScanDef_1 = require("./BarcodeScanDef");
var Success_1 = require("../fp/Success");
var Failure_1 = require("../fp/Failure");
var ImagePickerDef_1 = require("./ImagePickerDef");
var XImagePickerDef_1 = require("./XImagePickerDef");
var CalendarDef_1 = require("./CalendarDef");
var XCalendarDef_1 = require("./XCalendarDef");
var GeoLocationDef_1 = require("./GeoLocationDef");
var XGeoLocationDef_1 = require("./XGeoLocationDef");
var GeoFixDef_1 = require("./GeoFixDef");
var XGeoFixDef_1 = require("./XGeoFixDef");
var PaneDef = (function () {
    function PaneDef(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
        this._paneId = _paneId;
        this._name = _name;
        this._label = _label;
        this._title = _title;
        this._menuDefs = _menuDefs;
        this._entityRecDef = _entityRecDef;
        this._dialogRedirection = _dialogRedirection;
        this._settings = _settings;
    }
    PaneDef.fromOpenPaneResult = function (childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
        var settings = {};
        ObjUtil_1.ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
        var newPaneDef;
        if (childXPaneDef instanceof XListDef_1.XListDef) {
            var xListDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ListDef_1.ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        }
        else if (childXPaneDef instanceof XDetailsDef_1.XDetailsDef) {
            var xDetailsDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new DetailsDef_1.DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        }
        else if (childXPaneDef instanceof XMapDef_1.XMapDef) {
            var xMapDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new MapDef_1.MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        }
        else if (childXPaneDef instanceof XGraphDef_1.XGraphDef) {
            var xGraphDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new GraphDef_1.GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
        }
        else if (childXPaneDef instanceof XBarcodeScanDef_1.XBarcodeScanDef) {
            var xBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new BarcodeScanDef_1.BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoFixDef_1.XGeoFixDef) {
            var xGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoFixDef_1.GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoLocationDef_1.XGeoLocationDef) {
            var xGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoLocationDef_1.GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XCalendarDef_1.XCalendarDef) {
            var xCalendarDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new CalendarDef_1.CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
        }
        else if (childXPaneDef instanceof XImagePickerDef_1.XImagePickerDef) {
            var xImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ImagePickerDef_1.ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
        }
        else {
            return new Failure_1.Failure('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil_1.ObjUtil.formatRecAttr(childXPaneDef));
        }
        return new Success_1.Success(newPaneDef);
    };
    Object.defineProperty(PaneDef.prototype, "dialogHandle", {
        get: function () {
            return this._dialogRedirection.dialogHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "dialogRedirection", {
        get: function () {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "entityRecDef", {
        get: function () {
            return this._entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    PaneDef.prototype.findTitle = function () {
        var result = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    };
    Object.defineProperty(PaneDef.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "menuDefs", {
        get: function () {
            return this._menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "paneId", {
        get: function () {
            return this._paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    return PaneDef;
})();
exports.PaneDef = PaneDef;

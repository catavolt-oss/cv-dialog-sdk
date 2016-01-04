/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
                ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
                var newPaneDef;
                if (childXPaneDef instanceof dialog.XListDef) {
                    var xListDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
                }
                else if (childXPaneDef instanceof dialog.XDetailsDef) {
                    var xDetailsDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
                }
                else if (childXPaneDef instanceof dialog.XMapDef) {
                    var xMapDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
                }
                else if (childXPaneDef instanceof dialog.XGraphDef) {
                    var xGraphDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
                }
                else if (childXPaneDef instanceof dialog.XBarcodeScanDef) {
                    var xBarcodeScanDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XGeoFixDef) {
                    var xGeoFixDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XGeoLocationDef) {
                    var xGeoLocationDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XCalendarDef) {
                    var xCalendarDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
                }
                else if (childXPaneDef instanceof dialog.XImagePickerDef) {
                    var xImagePickerDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
                }
                else {
                    return new Failure('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
                }
                return new Success(newPaneDef);
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
        dialog.PaneDef = PaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

/**
 * Created by rburson on 3/30/15.
 */
import { ObjUtil } from "../util/ObjUtil";
import { XListDef } from "./XListDef";
import { ListDef } from "./ListDef";
import { XDetailsDef } from "./XDetailsDef";
import { DetailsDef } from "./DetailsDef";
import { XMapDef } from "./XMapDef";
import { MapDef } from "./MapDef";
import { XGraphDef } from "./XGraphDef";
import { GraphDef } from "./GraphDef";
import { XBarcodeScanDef } from "./XBarcodeScanDef";
import { BarcodeScanDef } from "./BarcodeScanDef";
import { Success } from "../fp/Success";
import { Failure } from "../fp/Failure";
import { ImagePickerDef } from "./ImagePickerDef";
import { XImagePickerDef } from "./XImagePickerDef";
import { CalendarDef } from "./CalendarDef";
import { XCalendarDef } from "./XCalendarDef";
import { GeoLocationDef } from "./GeoLocationDef";
import { XGeoLocationDef } from "./XGeoLocationDef";
import { GeoFixDef } from "./GeoFixDef";
import { XGeoFixDef } from "./XGeoFixDef";
export class PaneDef {
    constructor(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
        this._paneId = _paneId;
        this._name = _name;
        this._label = _label;
        this._title = _title;
        this._menuDefs = _menuDefs;
        this._entityRecDef = _entityRecDef;
        this._dialogRedirection = _dialogRedirection;
        this._settings = _settings;
    }
    static fromOpenPaneResult(childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
        var settings = {};
        ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
        var newPaneDef;
        if (childXPaneDef instanceof XListDef) {
            var xListDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        }
        else if (childXPaneDef instanceof XDetailsDef) {
            var xDetailsDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        }
        else if (childXPaneDef instanceof XMapDef) {
            var xMapDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        }
        else if (childXPaneDef instanceof XGraphDef) {
            var xGraphDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
        }
        else if (childXPaneDef instanceof XBarcodeScanDef) {
            var xBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoFixDef) {
            var xGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoLocationDef) {
            var xGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XCalendarDef) {
            var xCalendarDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
        }
        else if (childXPaneDef instanceof XImagePickerDef) {
            var xImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
        }
        else {
            return new Failure('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
        }
        return new Success(newPaneDef);
    }
    get dialogHandle() {
        return this._dialogRedirection.dialogHandle;
    }
    get dialogRedirection() {
        return this._dialogRedirection;
    }
    get entityRecDef() {
        return this._entityRecDef;
    }
    findTitle() {
        var result = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    }
    get label() {
        return this._label;
    }
    get menuDefs() {
        return this._menuDefs;
    }
    get name() {
        return this._name;
    }
    get paneId() {
        return this._paneId;
    }
    get settings() {
        return this._settings;
    }
    get title() {
        return this._title;
    }
}

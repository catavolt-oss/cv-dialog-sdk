/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class PaneDef {

        static fromOpenPaneResult(childXOpenResult:XOpenDialogModelResult,
                                  childXComp:XFormModelComp,
                                  childXPaneDefRef:XPaneDefRef,
                                  childXPaneDef:XPaneDef,
                                  childXActiveColDefs:XGetActiveColumnDefsResult,
                                  childMenuDefs:Array<MenuDef>):Try<PaneDef> {

            var settings:StringDictionary = {};
            ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);

            var newPaneDef:PaneDef;

            if(childXPaneDef instanceof XListDef) {
                    var xListDef:XListDef = childXPaneDef;
                    var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
                    newPaneDef = new ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs,
                        xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns,
                        childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
            } else if(childXPaneDef instanceof XDetailsDef) {
                    var xDetailsDef:XDetailsDef = childXPaneDef;
                    var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
                    newPaneDef = new DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs,
                        xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText,
                        xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
            } else if(childXPaneDef instanceof XMapDef) {
                var xMapDef:XMapDef = childXPaneDef;
                var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
                newPaneDef = new MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs,
                    xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty,
                    xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty,
                    xMapDef.latitudeProperty, xMapDef.longitudeProperty);
            } else if(childXPaneDef instanceof XGraphDef) {
                var xGraphDef:XGraphDef = childXPaneDef;
                var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
                newPaneDef = new GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs,
                    xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint,
                xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
            } else if(childXPaneDef instanceof XBarcodeScanDef) {
                var xBarcodeScanDef:XBarcodeScanDef = childXPaneDef;
                var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
                newPaneDef = new BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title,
                    childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
            } else if(childXPaneDef instanceof XGeoFixDef) {
                var xGeoFixDef:XGeoFixDef = childXPaneDef;
                var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
                newPaneDef = new GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title,
                    childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
            } else if(childXPaneDef instanceof XGeoLocationDef) {
                var xGeoLocationDef:XGeoLocationDef = childXPaneDef;
                var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
                newPaneDef = new GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title,
                    childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
            } else if(childXPaneDef instanceof XCalendarDef) {
                var xCalendarDef:XCalendarDef = childXPaneDef;
                var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
                newPaneDef = new CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title,
                    childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty,
                    xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty,
                    xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty,
                    xOpenQueryModelResult.defaultActionId);
            } else if(childXPaneDef instanceof XImagePickerDef) {
                var xImagePickerDef:XImagePickerDef = childXPaneDef;
                var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
                newPaneDef = new ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title,
                    childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty,
                    xImagePickerDef.defaultActionId);
            } else {
                return new Failure<PaneDef>('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
            }

            return new Success(newPaneDef);

        }

        constructor(private _paneId:string,
                    private _name:string,
                    private _label:string,
                    private _title:string,
                    private _menuDefs:Array<MenuDef>,
                    private _entityRecDef:EntityRecDef,
                    private _dialogRedirection:DialogRedirection,
                    private _settings:StringDictionary){}

        get dialogHandle():DialogHandle {
            return this._dialogRedirection.dialogHandle;
        }

        get dialogRedirection():DialogRedirection {
            return this._dialogRedirection;
        }

        get entityRecDef():EntityRecDef {
            return this._entityRecDef;
        }

        findTitle():string {
            var result:string = this._title ? this._title.trim() : '';
            result = result === 'null' ? '' : result;
            if(result === '') {
                result = this._label ? this._label.trim() : '';
                result = result === 'null' ? '' : result;
            }
            return result;
        }

        get label():string {
            return this._label;
        }

        get menuDefs():Array<MenuDef> {
            return this._menuDefs;
        }

        get name():string {
            return this._name;
        }

        get paneId():string {
            return this._paneId;
        }

        get settings():StringDictionary {
            return this._settings;
        }

        get title():string {
            return this._title;
        }
    }

}

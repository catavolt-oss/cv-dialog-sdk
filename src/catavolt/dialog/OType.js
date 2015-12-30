/**
 * Created by rburson on 3/23/15.
 */
var XCalendarDef_1 = require("./XCalendarDef");
var AppWinDef_1 = require("./AppWinDef");
var AttributeCellValueDef_1 = require("./AttributeCellValueDef");
var XBarcodeScanDef_1 = require("./XBarcodeScanDef");
var CellDef_1 = require("./CellDef");
var XChangePaneModeResult_1 = require("./XChangePaneModeResult");
var ColumnDef_1 = require("./ColumnDef");
var ContextAction_1 = require("./ContextAction");
var SessionContextImpl_1 = require("./SessionContextImpl");
var DialogHandle_1 = require("./DialogHandle");
var DataAnno_1 = require("./DataAnno");
var XDetailsDef_1 = require("./XDetailsDef");
var DialogRedirection_1 = require("./DialogRedirection");
var EntityRecDef_1 = require("./EntityRecDef");
var ForcedLineCellValueDef_1 = require("./ForcedLineCellValueDef");
var XFormDef_1 = require("./XFormDef");
var XFormModelComp_1 = require("./XFormModelComp");
var XGeoFixDef_1 = require("./XGeoFixDef");
var XGeoLocationDef_1 = require("./XGeoLocationDef");
var XGetActiveColumnDefsResult_1 = require("./XGetActiveColumnDefsResult");
var XGetSessionListPropertyResult_1 = require("./XGetSessionListPropertyResult");
var GraphDataPointDef_1 = require("./GraphDataPointDef");
var XGraphDef_1 = require("./XGraphDef");
var XPropertyChangeResult_1 = require("./XPropertyChangeResult");
var XImagePickerDef_1 = require("./XImagePickerDef");
var LabelCellValueDef_1 = require("./LabelCellValueDef");
var XListDef_1 = require("./XListDef");
var XMapDef_1 = require("./XMapDef");
var MenuDef_1 = require("./MenuDef");
var XOpenEditorModelResult_1 = require("./XOpenEditorModelResult");
var XOpenQueryModelResult_1 = require("./XOpenQueryModelResult");
var XPaneDefRef_1 = require("./XPaneDefRef");
var PropDef_1 = require("./PropDef");
var XReadResult_1 = require("./XReadResult");
var SortPropDef_1 = require("./SortPropDef");
var SubstitutionCellValueDef_1 = require("./SubstitutionCellValueDef");
var TabCellValueDef_1 = require("./TabCellValueDef");
var WebRedirection_1 = require("./WebRedirection");
var Workbench_1 = require("./Workbench");
var WorkbenchRedirection_1 = require("./WorkbenchRedirection");
var WorkbenchLaunchAction_1 = require("./WorkbenchLaunchAction");
var XWriteResult_1 = require("./XWriteResult");
var CellValueDef_1 = require("./CellValueDef");
var XFormModel_1 = require("./XFormModel");
var XGetAvailableValuesResult_1 = require("./XGetAvailableValuesResult");
var XPaneDef_1 = require("./XPaneDef");
var Prop_1 = require("./Prop");
var XQueryResult_1 = require("./XQueryResult");
var Redirection_1 = require("./Redirection");
var Log_1 = require("../util/Log");
var ObjUtil_1 = require("../util/ObjUtil");
var Failure_1 = require("../fp/Failure");
var DialogTriple_1 = require("./DialogTriple");
var Success_1 = require("../fp/Success");
var EntityRec_1 = require("./EntityRec");
var OType = (function () {
    function OType() {
    }
    OType.typeInstance = function (name) {
        var type = OType.types[name];
        return type && new type;
    };
    OType.factoryFn = function (otype, jsonObj) {
        var typeFn = OType.typeFns[otype];
        if (typeFn) {
            return typeFn(otype, jsonObj);
        }
        return null;
    };
    OType.deserializeObject = function (obj, Otype, factoryFn) {
        Log_1.Log.debug('Deserializing ' + Otype);
        if (Array.isArray(obj)) {
            //it's a nested array (no LTYPE!)
            return OType.handleNestedArray(Otype, obj);
        }
        else {
            var newObj = null;
            var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
            if (objTry) {
                if (objTry.isFailure) {
                    var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                        + ObjUtil_1.ObjUtil.formatRecAttr(objTry.failure);
                    Log_1.Log.error(error);
                    return new Failure_1.Failure(error);
                }
                newObj = objTry.success;
            }
            else {
                newObj = OType.typeInstance(Otype);
                if (!newObj) {
                    Log_1.Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                    return new Failure_1.Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                }
                for (var prop in obj) {
                    var value = obj[prop];
                    Log_1.Log.debug("prop: " + prop + " is type " + typeof value);
                    if (value && typeof value === 'object') {
                        if ('WS_OTYPE' in value) {
                            var otypeTry = DialogTriple_1.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if (otypeTry.isFailure)
                                return new Failure_1.Failure(otypeTry.failure);
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        }
                        else if ('WS_LTYPE' in value) {
                            var ltypeTry = DialogTriple_1.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if (ltypeTry.isFailure)
                                return new Failure_1.Failure(ltypeTry.failure);
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        }
                        else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    }
                    else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
            }
            return new Success_1.Success(newObj);
        }
    };
    OType.serializeObject = function (obj, Otype, filterFn) {
        var newObj = { 'WS_OTYPE': Otype };
        return ObjUtil_1.ObjUtil.copyNonNullFieldsOnly(obj, newObj, function (prop) {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    };
    OType.handleNestedArray = function (Otype, obj) {
        return OType.extractLType(Otype).bind(function (ltype) {
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure)
                return new Failure_1.Failure(newArrayTry.failure);
            return new Success_1.Success(newArrayTry.success);
        });
    };
    OType.deserializeNestedArray = function (array, ltype) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (value && typeof value === 'object') {
                var otypeTry = DialogTriple_1.DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                if (otypeTry.isFailure) {
                    return new Failure_1.Failure(otypeTry.failure);
                }
                newArray.push(otypeTry.success);
            }
            else {
                newArray.push(value);
            }
        }
        return new Success_1.Success(newArray);
    };
    OType.extractLType = function (Otype) {
        if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
            return new Failure_1.Failure('Expected OType of List<some_type> but found ' + Otype);
        }
        var ltype = Otype.slice(5, -1);
        return new Success_1.Success(ltype);
    };
    OType.assignPropIfDefined = function (prop, value, target, otype) {
        if (otype === void 0) { otype = 'object'; }
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
            }
            else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                }
                else {
                    Log_1.Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                }
            }
        }
        catch (error) {
            Log_1.Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
        }
    };
    OType.types = {
        'WSApplicationWindowDef': AppWinDef_1.AppWinDef,
        'WSAttributeCellValueDef': AttributeCellValueDef_1.AttributeCellValueDef,
        'WSBarcodeScanDef': XBarcodeScanDef_1.XBarcodeScanDef,
        'WSCalendarDef': XCalendarDef_1.XCalendarDef,
        'WSCellDef': CellDef_1.CellDef,
        'WSChangePaneModeResult': XChangePaneModeResult_1.XChangePaneModeResult,
        'WSColumnDef': ColumnDef_1.ColumnDef,
        'WSContextAction': ContextAction_1.ContextAction,
        'WSCreateSessionResult': SessionContextImpl_1.SessionContextImpl,
        'WSDialogHandle': DialogHandle_1.DialogHandle,
        'WSDataAnno': DataAnno_1.DataAnno,
        'WSDetailsDef': XDetailsDef_1.XDetailsDef,
        'WSDialogRedirection': DialogRedirection_1.DialogRedirection,
        'WSEditorRecordDef': EntityRecDef_1.EntityRecDef,
        'WSEntityRecDef': EntityRecDef_1.EntityRecDef,
        'WSForcedLineCellValueDef': ForcedLineCellValueDef_1.ForcedLineCellValueDef,
        'WSFormDef': XFormDef_1.XFormDef,
        'WSFormModelComp': XFormModelComp_1.XFormModelComp,
        'WSGeoFixDef': XGeoFixDef_1.XGeoFixDef,
        'WSGeoLocationDef': XGeoLocationDef_1.XGeoLocationDef,
        'WSGetActiveColumnDefsResult': XGetActiveColumnDefsResult_1.XGetActiveColumnDefsResult,
        'WSGetSessionListPropertyResult': XGetSessionListPropertyResult_1.XGetSessionListPropertyResult,
        'WSGraphDataPointDef': GraphDataPointDef_1.GraphDataPointDef,
        'WSGraphDef': XGraphDef_1.XGraphDef,
        'WSHandlePropertyChangeResult': XPropertyChangeResult_1.XPropertyChangeResult,
        'WSImagePickerDef': XImagePickerDef_1.XImagePickerDef,
        'WSLabelCellValueDef': LabelCellValueDef_1.LabelCellValueDef,
        'WSListDef': XListDef_1.XListDef,
        'WSMapDef': XMapDef_1.XMapDef,
        'WSMenuDef': MenuDef_1.MenuDef,
        'WSOpenEditorModelResult': XOpenEditorModelResult_1.XOpenEditorModelResult,
        'WSOpenQueryModelResult': XOpenQueryModelResult_1.XOpenQueryModelResult,
        'WSPaneDefRef': XPaneDefRef_1.XPaneDefRef,
        'WSPropertyDef': PropDef_1.PropDef,
        'WSQueryRecordDef': EntityRecDef_1.EntityRecDef,
        'WSReadResult': XReadResult_1.XReadResult,
        'WSSortPropertyDef': SortPropDef_1.SortPropDef,
        'WSSubstitutionCellValueDef': SubstitutionCellValueDef_1.SubstitutionCellValueDef,
        'WSTabCellValueDef': TabCellValueDef_1.TabCellValueDef,
        'WSWebRedirection': WebRedirection_1.WebRedirection,
        'WSWorkbench': Workbench_1.Workbench,
        'WSWorkbenchRedirection': WorkbenchRedirection_1.WorkbenchRedirection,
        'WSWorkbenchLaunchAction': WorkbenchLaunchAction_1.WorkbenchLaunchAction,
        'XWriteResult': XWriteResult_1.XWriteResult
    };
    OType.typeFns = {
        'WSCellValueDef': CellValueDef_1.CellValueDef.fromWS,
        'WSDataAnnotation': DataAnno_1.DataAnno.fromWS,
        'WSEditorRecord': EntityRec_1.EntityRecUtil.fromWSEditorRecord,
        'WSFormModel': XFormModel_1.XFormModel.fromWS,
        'WSGetAvailableValuesResult': XGetAvailableValuesResult_1.XGetAvailableValuesResult.fromWS,
        'WSPaneDef': XPaneDef_1.XPaneDef.fromWS,
        'WSOpenQueryModelResult': XOpenQueryModelResult_1.XOpenQueryModelResult.fromWS,
        'WSProp': Prop_1.Prop.fromWS,
        'WSQueryResult': XQueryResult_1.XQueryResult.fromWS,
        'WSRedirection': Redirection_1.Redirection.fromWS,
        'WSWriteResult': XWriteResult_1.XWriteResult.fromWS
    };
    return OType;
})();
exports.OType = OType;

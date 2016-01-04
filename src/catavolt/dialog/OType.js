/**
 * Created by rburson on 3/23/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
                Log.debug('Deserializing ' + Otype);
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
                                + ObjUtil.formatRecAttr(objTry.failure);
                            Log.error(error);
                            return new Failure(error);
                        }
                        newObj = objTry.success;
                    }
                    else {
                        newObj = OType.typeInstance(Otype);
                        if (!newObj) {
                            Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                            return new Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                        }
                        for (var prop in obj) {
                            var value = obj[prop];
                            Log.debug("prop: " + prop + " is type " + typeof value);
                            if (value && typeof value === 'object') {
                                if ('WS_OTYPE' in value) {
                                    var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                                    if (otypeTry.isFailure)
                                        return new Failure(otypeTry.failure);
                                    OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                                }
                                else if ('WS_LTYPE' in value) {
                                    var ltypeTry = dialog.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                                    if (ltypeTry.isFailure)
                                        return new Failure(ltypeTry.failure);
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
                    return new Success(newObj);
                }
            };
            OType.serializeObject = function (obj, Otype, filterFn) {
                var newObj = { 'WS_OTYPE': Otype };
                return ObjUtil.copyNonNullFieldsOnly(obj, newObj, function (prop) {
                    return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
                });
            };
            OType.handleNestedArray = function (Otype, obj) {
                return OType.extractLType(Otype).bind(function (ltype) {
                    var newArrayTry = OType.deserializeNestedArray(obj, ltype);
                    if (newArrayTry.isFailure)
                        return new Failure(newArrayTry.failure);
                    return new Success(newArrayTry.success);
                });
            };
            OType.deserializeNestedArray = function (array, ltype) {
                var newArray = [];
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    if (value && typeof value === 'object') {
                        var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                        if (otypeTry.isFailure) {
                            return new Failure(otypeTry.failure);
                        }
                        newArray.push(otypeTry.success);
                    }
                    else {
                        newArray.push(value);
                    }
                }
                return new Success(newArray);
            };
            OType.extractLType = function (Otype) {
                if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
                    return new Failure('Expected OType of List<some_type> but found ' + Otype);
                }
                var ltype = Otype.slice(5, -1);
                return new Success(ltype);
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
                            Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                        }
                    }
                }
                catch (error) {
                    Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
                }
            };
            OType.types = {
                'WSApplicationWindowDef': dialog.AppWinDef,
                'WSAttributeCellValueDef': dialog.AttributeCellValueDef,
                'WSBarcodeScanDef': dialog.XBarcodeScanDef,
                'WSCalendarDef': dialog.XCalendarDef,
                'WSCellDef': dialog.CellDef,
                'WSChangePaneModeResult': dialog.XChangePaneModeResult,
                'WSColumnDef': dialog.ColumnDef,
                'WSContextAction': dialog.ContextAction,
                'WSCreateSessionResult': dialog.SessionContextImpl,
                'WSDialogHandle': dialog.DialogHandle,
                'WSDataAnno': dialog.DataAnno,
                'WSDetailsDef': dialog.XDetailsDef,
                'WSDialogRedirection': dialog.DialogRedirection,
                'WSEditorRecordDef': dialog.EntityRecDef,
                'WSEntityRecDef': dialog.EntityRecDef,
                'WSForcedLineCellValueDef': dialog.ForcedLineCellValueDef,
                'WSFormDef': dialog.XFormDef,
                'WSFormModelComp': dialog.XFormModelComp,
                'WSGeoFixDef': dialog.XGeoFixDef,
                'WSGeoLocationDef': dialog.XGeoLocationDef,
                'WSGetActiveColumnDefsResult': dialog.XGetActiveColumnDefsResult,
                'WSGetSessionListPropertyResult': dialog.XGetSessionListPropertyResult,
                'WSGraphDataPointDef': dialog.GraphDataPointDef,
                'WSGraphDef': dialog.XGraphDef,
                'WSHandlePropertyChangeResult': dialog.XPropertyChangeResult,
                'WSImagePickerDef': dialog.XImagePickerDef,
                'WSLabelCellValueDef': dialog.LabelCellValueDef,
                'WSListDef': dialog.XListDef,
                'WSMapDef': dialog.XMapDef,
                'WSMenuDef': dialog.MenuDef,
                'WSOpenEditorModelResult': dialog.XOpenEditorModelResult,
                'WSOpenQueryModelResult': dialog.XOpenQueryModelResult,
                'WSPaneDefRef': dialog.XPaneDefRef,
                'WSPropertyDef': dialog.PropDef,
                'WSQueryRecordDef': dialog.EntityRecDef,
                'WSReadResult': dialog.XReadResult,
                'WSSortPropertyDef': dialog.SortPropDef,
                'WSSubstitutionCellValueDef': dialog.SubstitutionCellValueDef,
                'WSTabCellValueDef': dialog.TabCellValueDef,
                'WSWebRedirection': dialog.WebRedirection,
                'WSWorkbench': dialog.Workbench,
                'WSWorkbenchRedirection': dialog.WorkbenchRedirection,
                'WSWorkbenchLaunchAction': dialog.WorkbenchLaunchAction,
                'XWriteResult': dialog.XWriteResult
            };
            OType.typeFns = {
                'WSCellValueDef': dialog.CellValueDef.fromWS,
                'WSDataAnnotation': dialog.DataAnno.fromWS,
                'WSEditorRecord': dialog.EntityRec.Util.fromWSEditorRecord,
                'WSFormModel': dialog.XFormModel.fromWS,
                'WSGetAvailableValuesResult': dialog.XGetAvailableValuesResult.fromWS,
                'WSPaneDef': dialog.XPaneDef.fromWS,
                'WSOpenQueryModelResult': dialog.XOpenQueryModelResult.fromWS,
                'WSProp': dialog.Prop.fromWS,
                'WSQueryResult': dialog.XQueryResult.fromWS,
                'WSRedirection': dialog.Redirection.fromWS,
                'WSWriteResult': dialog.XWriteResult.fromWS
            };
            return OType;
        })();
        dialog.OType = OType;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));

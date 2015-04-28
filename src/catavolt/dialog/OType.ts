/**
 * Created by rburson on 3/23/15.
 */
///<reference path="../references.ts"/>

module catavolt.dialog {

    export class OType {

        private static types = {
            'WSApplicationWindowDef': AppWinDef,
            'WSAttributeCellValueDef': AttributeCellValueDef,
            'WSBarcodeScanDef': XBarcodeScanDef,
            'WSCalendarDef': XCalendarDef,
            'WSCellDef': CellDef,
            'WSCreateSessionResult': SessionContextImpl,
            'WSColumnDef': ColumnDef,
            'WSContextAction': ContextAction,
            'WSDialogHandle': DialogHandle,
            'WSDataAnno': DataAnno,
            'WSDetailsDef': XDetailsDef,
            'WSDialogRedirection': DialogRedirection,
            'WSEditorRecordDef': EntityRecDef,
            'WSEntityRecDef': EntityRecDef,
            'WSForcedLineCellValueDef': ForcedLineCellValueDef,
            'WSFormDef': XFormDef,
            'WSFormModelComp': XFormModelComp,
            'WSGeoFixDef': XGeoFixDef,
            'WSGeoLocationDef': XGeoLocationDef,
            'WSGetActiveColumnDefsResult': XGetActiveColumnDefsResult,
            'WSGetSessionListPropertyResult': XGetSessionListPropertyResult,
            'WSGraphDataPointDef': GraphDataPointDef,
            'WSGraphDef': XGraphDef,
            'WSHandlePropertyChangeResult': XPropertyChangeResult,
            'WSImagePickerDef': XImagePickerDef,
            'WSLabelCellValueDef': LabelCellValueDef,
            'WSListDef': XListDef,
            'WSMapDef': XMapDef,
            'WSMenuDef': MenuDef,
            'WSOpenEditorModelResult': XOpenEditorModelResult,
            'WSOpenQueryModelResult': XOpenQueryModelResult,
            'WSPaneDefRef': XPaneDefRef,
            'WSPropertyDef': PropDef,
            'WSQueryRecordDef': EntityRecDef,
            'WSReadResult': XReadResult,
            'WSSortPropertyDef': SortPropDef,
            'WSSubstitutionCellValueDef': SubstitutionCellValueDef,
            'WSTabCellValueDef': TabCellValueDef,
            'WSWebRedirection': WebRedirection,
            'WSWorkbench': Workbench,
            'WSWorkbenchRedirection': WorkbenchRedirection,
            'WSWorkbenchLaunchAction': WorkbenchLaunchAction
        };

        private static typeFns:{[index:string]:<A>(string, any)=>Try<A>} = {
            'WSCellValueDef': CellValueDef.fromWS,
            'WSDataAnnotation': DataAnno.fromWS,
            'WSEditorRecord': EntityRec.Util.fromWSEditorRecord,
            'WSFormModel': XFormModel.fromWS,
            'WSPaneDef': XPaneDef.fromWS,
            'WSOpenQueryModelResult': XOpenQueryModelResult.fromWS,
            'WSProp': Prop.fromWS,
            'WSQueryResult': XQueryResult.fromWS,
            'WSRedirection': Redirection.fromWS,
            'WSReadResult': XReadResult.fromWS
       }

        private static typeInstance(name) {
            var type = OType.types[name];
            return type && new type;
        }

        static factoryFn<A>(otype:string, jsonObj):Try<A> {
            var typeFn:(string, any)=>Try<A> = OType.typeFns[otype];
            if(typeFn) {
                return typeFn(otype, jsonObj);
            }
            return null;
        }

        static deserializeObject<A>(obj, Otype:string, factoryFn:(otype:string, jsonObj?)=>any):Try<A> {

            if (Array.isArray(obj)) {
                //it's a nested array (no LTYPE!)
                return OType.handleNestedArray<A>(Otype, obj);
            } else {
                var newObj:A = null;
                var objTry:Try<A> = factoryFn(Otype, obj); //this returns null if there is no custom function
                if(objTry) {
                    if(objTry.isFailure) {
                        var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                            + ObjUtil.formatRecAttr(objTry.failure);
                        Log.error(error);
                        return new Failure<A>(error);
                    }
                    newObj = objTry.success;
                } else {
                    newObj = OType.typeInstance(Otype);
                    if (!newObj) {
                        Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                        return new Failure<A>('OType::deserializeObject: no type constructor found for ' + Otype);
                    }
                    for (var prop in obj) {
                        var value = obj[prop];
                        //Log.info("prop: " + prop + " is type " + typeof value);
                        if (value && typeof value === 'object') {
                            if ('WS_OTYPE' in value) {
                                var otypeTry = DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                                if (otypeTry.isFailure) return new Failure<A>(otypeTry.failure);
                                OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                            } else if ('WS_LTYPE' in value) {
                                var ltypeTry = DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                                if (ltypeTry.isFailure) return new Failure<A>(ltypeTry.failure);
                                OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                            } else {
                                OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                            }
                        } else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    }
                }
                return new Success<A>(newObj);
            }
        }

        static serializeObject(obj, Otype:string, filterFn?:(prop)=>boolean):StringDictionary {
            var newObj = {'WS_OTYPE':Otype};
            return ObjUtil.copyNonNullFieldsOnly(obj, newObj, (prop)=>{
               return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
            });
        }

        private static handleNestedArray<A>(Otype:string, obj):Try<A>{

            var ltype = OType.extractLType(Otype);
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure) return new Failure<A>(newArrayTry.failure);
            return new Success(<any>newArrayTry.success);
        }

        private static deserializeNestedArray(array, ltype):Try<Array<any>> {

            var newArray = [];
            for(var i=0; i<array.length; i++) {
                var value = array[i];
                if (value && typeof value === 'object') {
                    var otypeTry = DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                    if(otypeTry.isFailure) { return new Failure<Array<any>>(otypeTry.failure); }
                    newArray.push(otypeTry.success);
                } else {
                    newArray.push(value);
                }
            }
            return new Success(newArray);
        }

        private static extractLType(Otype):Try<string> {
            if(Otype.length > 5 && Otype.slice(0, 5) === 'List<') {
                return new Failure<string>('Expected OType of List<some_type> but found ' + Otype);
            }
            var ltype = Otype.slice(5, -1);
            return new Success(ltype);
        }

        private static assignPropIfDefined(prop, value, target, otype='object') {
            try {
                if ('_' + prop in target) {
                    target['_' + prop] = value;
                  //Log.info('Assigning private prop _' + prop + ' = ' + value);
                } else {
                    //it may be public
                    if (prop in target) {
                        target[prop] = value;
                        //Log.info('Assigning public prop ' + prop + ' = ' + value);
                    } else {
                        Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                    }
                }
            } catch (error) {
                Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
            }
        }
    }
}

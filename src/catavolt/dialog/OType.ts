/**
 * Created by rburson on 3/23/15.
 */
///<reference path="../references.ts"/>

module catavolt.dialog {

    export class OType {

        private static types = {
            'WSApplicationWindowDef': AppWinDef,
            "WSCreateSessionResult": SessionContextImpl,
            "WSContextAction": ContextAction,
            'WSDialogHandle': DialogHandle,
            'WSDialogRedirection': DialogRedirection,
            'WSGetSessionListPropertyResult': XGetSessionListPropertyResult,
            'WSWebRedirection': WebRedirection,
            'WSWorkbench': Workbench,
            'WSWorkbenchRedirection': WorkbenchRedirection,
            'WSWorkbenchLaunchAction': WorkbenchLaunchAction
        }

        private static typeFns = {
            'WSRedirection': (otype, jsonObj)=>{
                if(jsonObj && jsonObj['webURL']) {
                    return WebRedirection.constructor();
                } else if(jsonObj && jsonObj['workbenchId']) {
                    return WorkbenchRedirection.constructor();
                } else {
                    return DialogRedirection.constructor();
                }
            }
        }

        static factoryFn(otype:string, jsonObj?):()=>any {
            var typeFn = OType.typeFns[otype];
            if(typeFn) {
                return typeFn(otype, jsonObj);
            } else {
                var type = OType.types[otype];
                return type && new type;
            }
        }

        static deserializeObject<A>(obj, Otype:string, factoryFn?:(otype:string, jsonObj?)=>any):Try<A> {
            return DialogTriple.extractValue<A>(obj, Otype, ()=>{

                var newObj:A = factoryFn(Otype, obj);
                if(!newObj){ return new Failure<A>('OType::deserializeObject: factory failed to produce object for ' + Otype); }

                for(var prop in obj) {
                    var value = obj[prop];
                    //Log.info("prop: " + prop + " is type " + typeof value);
                    if (value && typeof value === 'object') {
                        if('WS_OTYPE' in value) {
                            var otypeTry = DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if(otypeTry.isFailure) { return new Failure<A>(otypeTry.failure); }
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        } else if ('WS_LTYPE' in value) {
                            var ltypeTry = DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if(ltypeTry.isFailure) { return new Failure<A>(ltypeTry.failure); }
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        } else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }

                    } else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
                return new Success<A>(newObj);
            });
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

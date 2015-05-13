/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class PaneContext {

        private static ANNO_NAME_KEY = "com.catavolt.annoName";
        private static PROP_NAME_KEY = "com.catavolt.propName";

        entityRecDef:EntityRecDef;

        private _binaryCache: { [index:string] : Array<Binary> }
        private _lastRefreshTime:Date = new Date(0);
        private _parentContext:FormContext = null;
        private _paneRef:number;

        static resolveSettingsFromNavRequest(initialSettings:StringDictionary,
                                             navRequest:NavRequest):StringDictionary {

            var result:StringDictionary = ObjUtil.addAllProps(initialSettings, {});
            if(navRequest instanceof FormContext) {
                ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
                ObjUtil.addAllProps(navRequest.offlineProps, result);
            } else if (navRequest instanceof  NullNavRequest) {
                ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
            }
            var destroyed = result['fromDialogDestroyed'];
            if(destroyed) result['destroyed'] = true;
            return result;

        }

        constructor(paneRef:number) {
            this._paneRef = paneRef;
            this._binaryCache = {};
        }

        get actionSource():ActionSource {
            return this.parentContext ? this.parentContext.actionSource : null;
        }

        get dialogAlias():string {
            return this.dialogRedirection.dialogProperties['dialogAlias'];
        }

        findMenuDefAt(actionId:string) {
            var result:MenuDef = null;
            this.menuDefs.some((md:MenuDef)=>{
                result = md.findAtId(actionId);
                return result != null;
            });
            return result;
        }

        formatForRead(propValue, propName:string):string {
            return PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
        }

        formatForWrite(propValue, propName:string):string {
            return PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
        }

        get formDef():FormDef {
            return this.parentContext.formDef;
        }

        get isRefreshNeeded():boolean {
            return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
        }

        get lastRefreshTime():Date {
            return this._lastRefreshTime;
        }

        set lastRefreshTime(time:Date){
            this._lastRefreshTime = time;
        }

        get menuDefs():Array<MenuDef> {
            return this.paneDef.menuDefs;
        }

        get offlineCapable():boolean {
            return this._parentContext && this._parentContext.offlineCapable;
        }

        get paneDef():PaneDef {
            if(!this.paneRef) {
                return this.formDef.headerDef;
            } else {
                return this.formDef.childrenDefs[this.paneRef];
            }
        }

        get paneRef():number {
            return this._paneRef;
        }

        get paneTitle():string {
            return this.paneDef.findTitle();
        }

        get parentContext():FormContext {
            return this._parentContext;
        }

        parseValue(formattedValue:string, propName:string):any {
            return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
        }

        propDefAtName(propName:string):PropDef {
            return this.entityRecDef.propDefAtName(propName);
        }

        get sessionContext():SessionContext {
            return this.parentContext.sessionContext;
        }

        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility

        get dialogRedirection():DialogRedirection {
            return this.paneDef.dialogRedirection;
        }

        set parentContext(parentContext:FormContext) {
            this._parentContext = parentContext;
        }


    }
}
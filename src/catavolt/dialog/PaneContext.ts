/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class PaneContext {

        private static ANNO_NAME_KEY = "com.catavolt.annoName";
        private static PROP_NAME_KEY = "com.catavolt.propName";

        private _binaryCache: { [index:string] : Array<Binary> }
        private _lastRefreshTime:Date;
        private _parentContext:FormContext;
        private _paneRef:number;

        constructor(paneRef:number) {
            this._paneRef = paneRef;
            this._binaryCache = {};
        }
        /*
        get actionSource():ActionSource {
            return this.parentContext ? this.parentContext.actionSource : null;
        }

        get dialogAlias():string {

        }

        get formDef():FormDef {
            return this.parentContext.formDef();
        }

        get lastRefreshTime():Date {
            return this._lastRefreshTime;
        }

        get parentContext():FormContext {
            return this._parentContext;
        }

        get paneDef():PaneDef {
            if(this.paneRef) {
                return this.formDef.headerDef();
            } else {
                return this.formDef.childrenDefs[this.paneRef];
            }
        }

        get paneRef():number {
            return this._paneRef;

        }*/
        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility

        /*get dialogRedirection():DialogRedirection {
            return this.paneDef.dialogRedirection;
        }*/
    }
}
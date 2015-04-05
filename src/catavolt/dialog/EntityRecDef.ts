/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class EntityRecDef {

        constructor(private _propDefs:Array<PropDef>){}

        get propCount():number {
            return this.propDefs.length;
        }

        /*propDefAtName(name:string):PropDef {
            var propDef:PropDef = null;
            this.propDefs.some((value:PropDef)=>{
            });
        }*/

        // Note we need to support both 'propDefs' and 'propertyDefs' as both
        // field names seem to be used in the dialog model
        get propDefs():Array<PropDef> {
            return this._propDefs;
        }

        set propDefs(propDefs:Array<PropDef>){
            this._propDefs = propDefs;
        }

        get propertyDefs():Array<PropDef> {
            return this._propDefs;
        }

        set propertyDefs(propDefs:Array<PropDef>){
            this._propDefs = propDefs;
        }

    }
}
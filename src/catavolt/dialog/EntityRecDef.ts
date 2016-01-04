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

        propDefAtName(name:string):PropDef {
            var propDef:PropDef = null;
            this.propDefs.some((p)=>{
                if(p.name === name) {
                    propDef = p;
                    return true;
                }
                return false;
            });
            return propDef;
        }

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

        get propNames():Array<string> {
            return this.propDefs.map((p)=>{return p.name});
        }

    }
}
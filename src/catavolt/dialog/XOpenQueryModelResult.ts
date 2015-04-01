/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XOpenQueryModelResult implements XOpenDialogModelResult{

        constructor(public entityRecDef:EntityRecDef,
                    public sortPropertyDef:Array<SortPropDef>,
                    public defaultActionId:string) {
        }

        private set queryRecordDef(queryRecDef:EntityRecDef) {
                this.entityRecDef = new EntityRecDef(queryRecDef.propDefs);
        }

    }
}
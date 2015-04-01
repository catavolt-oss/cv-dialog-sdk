/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class XQueryResult {

        constructor(public entityRecs:Array<EntityRec>,
                    public entityRecDef:EntityRecDef,
                    public hasMore:boolean,
                    public sortPropDefs:Array<SortPropDef>,
                    public defaultActionId:string,
                    public dialogProps:StringDictionary) {}

        static fromWS<A>(otype:string, jsonObj):Try<A> {

        }

    }
}
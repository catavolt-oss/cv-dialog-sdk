/**
 * Created by rburson on 4/30/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class QueryResult {

        constructor(public entityRecs:Array<EntityRec>, public hasMore:boolean) {
        }

    }
}
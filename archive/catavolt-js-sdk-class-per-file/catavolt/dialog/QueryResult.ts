/**
 * Created by rburson on 4/30/15.
 */

import {EntityRec} from "./EntityRec";

export class QueryResult {

    constructor(public entityRecs:Array<EntityRec>, public hasMore:boolean) {
    }

}

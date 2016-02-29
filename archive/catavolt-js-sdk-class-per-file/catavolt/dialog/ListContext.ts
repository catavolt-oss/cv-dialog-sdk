/**
 * Created by rburson on 5/4/15.
 */

import {QueryContext} from "./QueryContext";
import {EntityRec} from "./EntityRec";
import {StringDictionary} from "../util/Types";
import {ColumnDef} from "./ColumnDef";
import {ListDef} from "./ListDef";

export class ListContext extends QueryContext {

    constructor(paneRef:number, offlineRecs:Array<EntityRec> = [], settings:StringDictionary = {}) {
        super(paneRef, offlineRecs, settings);
    }

    get columnHeadings():Array<string> {
        return this.listDef.activeColumnDefs.map((cd:ColumnDef)=> {
            return cd.heading;
        });
    }

    get listDef():ListDef {
        return <ListDef>this.paneDef;
    }

    rowValues(entityRec:EntityRec):Array<any> {
        return this.listDef.activeColumnDefs.map((cd:ColumnDef)=> {
            return entityRec.valueAtName(cd.name);
        });
    }

    get style():string {
        return this.listDef.style;
    }

}

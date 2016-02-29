/**
 * Created by rburson on 4/1/15.
 */

import {ColumnDef} from "./ColumnDef";

export class XGetActiveColumnDefsResult {

    constructor(public columnsStyle:string, public columns:Array<ColumnDef>) {
    }

    get columnDefs():Array<ColumnDef> {
        return this.columns;
    }

}

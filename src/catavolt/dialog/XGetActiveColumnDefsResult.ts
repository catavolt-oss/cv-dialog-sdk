/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XGetActiveColumnDefsResult {

        constructor(public columnStyle:string, public columns:Array<ColumnDef>) {
        }

    }
}
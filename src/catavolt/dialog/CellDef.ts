/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>

/*
    @TODO

    Test all of the deserialization methods
    They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */
module catavolt.dialog {

    export class CellDef {

        constructor(private _values:Array<CellValueDef>) {
        }

        get values():Array<CellValueDef> {
            return this._values;
        }

    }
}
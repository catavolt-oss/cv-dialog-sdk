/**
 * Created by rburson on 3/31/15.
 */

/*
 @TODO

 Test all of the deserialization methods
 They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */

import {CellValueDef} from "./CellValueDef";

export class CellDef {

    constructor(private _values:Array<CellValueDef>) {
    }

    get values():Array<CellValueDef> {
        return this._values;
    }

}

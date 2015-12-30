/**
 * Created by rburson on 4/16/15.
 */

import {CellValueDef} from "./CellValueDef";

export class SubstitutionCellValueDef extends CellValueDef {

    constructor(private _value:string, style:string) {
        super(style);
    }

    get value():string {
        return this._value;
    }

}

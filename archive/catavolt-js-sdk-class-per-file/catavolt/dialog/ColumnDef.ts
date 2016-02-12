/**
 * Created by rburson on 4/1/15.
 */

import {PropDef} from "./PropDef";

export class ColumnDef {

    constructor(private _name:string, private _heading:string, private _propertyDef:PropDef) {
    }

    get heading():string {
        return this._heading;
    }

    get isInlineMediaStyle():boolean {
        return this._propertyDef.isInlineMediaStyle;
    }

    get name():string {
        return this._name;
    }

    get propertyDef():PropDef {
        return this._propertyDef;
    }

}

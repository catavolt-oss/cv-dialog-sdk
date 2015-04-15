/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class ColumnDef {

        constructor(private _name:string, private _heading:string, private _propDef:PropDef) {
        }

        get heading():string {
            return this._heading;
        }

        get isInlineMediaStyle():boolean {
            return this._propDef.isInlineMediaStyle;
        }

        get name():string {
            return this._name;
        }

        get propDef():PropDef {
            return this._propDef;
        }

    }
}
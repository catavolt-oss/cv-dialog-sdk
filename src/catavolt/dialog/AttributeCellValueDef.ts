/**
 * Created by rburson on 4/16/15.
 */

import {CellValueDef} from "./CellValueDef";
import {MenuDef} from "./MenuDef";

export class AttributeCellValueDef extends CellValueDef {

    constructor(private _propertyName:string,
                private _presentationLength:number,
                private _entryMethod:string,
                private _autoFillCapable:boolean,
                private _hint:string,
                private _toolTip:string,
                private _fieldActions:Array<MenuDef>,
                style:string) {
        super(style);
    }

    get autoFileCapable():boolean {
        return this._autoFillCapable;
    }

    get entryMethod():string {
        return this._entryMethod;
    }

    get fieldActions():Array<MenuDef> {
        return this._fieldActions;
    }

    get hint():string {
        return this._hint;
    }

    get isComboBoxEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
    }

    get isDropDownEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
    }

    get isTextFieldEntryMethod():boolean {
        return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
    }

    get presentationLength():number {
        return this._presentationLength;
    }

    get propertyName():string {
        return this._propertyName;
    }

    get toolTip():string {
        return this._toolTip;
    }

}

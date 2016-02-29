/**
 * Created by rburson on 4/21/15.
 */

import {PaneDef} from "./PaneDef";
import {MenuDef} from "./MenuDef";
import {EntityRecDef} from "./EntityRecDef";
import {DialogRedirection} from "./DialogRedirection";
import {StringDictionary} from "../util/Types";
import {CellDef} from "./CellDef";

export class DetailsDef extends PaneDef {

    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _cancelButtonText:string,
                private _commitButtonText:string,
                private _editable:boolean,
                private _focusPropName:string,
                private _graphicalMarkup:string,
                private _rows:Array<Array<CellDef>>) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }

    get cancelButtonText():string {
        return this._cancelButtonText;
    }

    get commitButtonText():string {
        return this._commitButtonText;
    }

    get editable():boolean {
        return this._editable;
    }

    get focusPropName():string {
        return this._focusPropName;
    }

    get graphicalMarkup():string {
        return this._graphicalMarkup;
    }

    get rows():Array<Array<CellDef>> {
        return this._rows;
    }

}

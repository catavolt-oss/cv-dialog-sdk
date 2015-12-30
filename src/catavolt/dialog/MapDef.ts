/**
 * Created by rburson on 4/22/15.
 */

import {PaneDef} from "./PaneDef";
import {MenuDef} from "./MenuDef";
import {EntityRecDef} from "./EntityRecDef";
import {DialogRedirection} from "./DialogRedirection";
import {StringDictionary} from "../util/Types";

export class MapDef extends PaneDef {

    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _descriptionPropName:string,
                private _streetPropName:string,
                private _cityPropName:string,
                private _statePropName:string,
                private _postalCodePropName:string,
                private _latitudePropName:string,
                private _longitudePropName:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get cityPropName():string {
        return this._cityPropName;
    }

    get descriptionPropName():string {
        return this._descriptionPropName;
    }

    get latitudePropName():string {
        return this._latitudePropName;
    }

    get longitudePropName():string {
        return this._longitudePropName;
    }

    get postalCodePropName():string {
        return this._postalCodePropName;
    }

    get statePropName():string {
        return this._statePropName;
    }

    get streetPropName():string {
        return this._streetPropName;
    }

}

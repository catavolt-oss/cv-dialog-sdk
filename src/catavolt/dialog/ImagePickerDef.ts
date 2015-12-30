/**
 * Created by rburson on 4/22/15.
 */

import {PaneDef} from "./PaneDef";
import {MenuDef} from "./MenuDef";
import {EntityRecDef} from "./EntityRecDef";
import {DialogRedirection} from "./DialogRedirection";
import {StringDictionary} from "../util/Types";

export class ImagePickerDef extends PaneDef {

    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _URLPropName:string,
                private _defaultActionId:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get defaultActionId():string {
        return this._defaultActionId;
    }

    get URLPropName():string {
        return this._URLPropName;
    }
}

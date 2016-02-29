/**
 * Created by rburson on 4/22/15.
 */

import {PaneDef} from "./PaneDef";
import {MenuDef} from "./MenuDef";
import {EntityRecDef} from "./EntityRecDef";
import {DialogRedirection} from "./DialogRedirection";
import {StringDictionary} from "../util/Types";


export class BarcodeScanDef extends PaneDef {

    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }
}

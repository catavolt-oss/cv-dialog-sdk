/**
 * Created by rburson on 4/22/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

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
    }
}
/**
 * Created by rburson on 4/21/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

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

    }
}
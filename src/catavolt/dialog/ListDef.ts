/**
 * Created by rburson on 4/22/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class ListDef extends PaneDef {

        constructor(paneId:string,
                    name:string,
                    label:string,
                    title:string,
                    menuDefs:Array<MenuDef>,
                    entityRecDef:EntityRecDef,
                    dialogRedirection:DialogRedirection,
                    settings:StringDictionary,
                    private _style:string,
                    private _initialColumns:number,
                    private _activeColumnDefs:Array<ColumnDef>,
                    private _columnsStyle:string,
                    private _defaultActionId:string,
                    private _graphicalMarkup:string) {
            super();
        }

    }
}
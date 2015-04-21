/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class FormDef extends PaneDef {

        constructor(
            paneId:string,
            name:string,
            label:string,
            title:string,
            menuDefs:Array<MenuDef>,
            entityRecDef:EntityRecDef,
            dialogRedirection:DialogRedirection,
            settings:StringDictionary,
            private _formLayout:string,
                    private _formStyle:string,
                    private _borderStyle:string,
                    private _headerDef:DetailsDef,
                    private _childrenDefs:Array<PaneDef>){

            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

        }

        get borderStyle():string {
            return this._borderStyle;
        }

        get childrenDefs():Array<PaneDef> {
            return this._childrenDefs;
        }

        get 
    }
}

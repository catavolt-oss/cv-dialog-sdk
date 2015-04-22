/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class PaneDef {

        static fromOpenPaneResult(childXOpenResult:XOpenDialogModelResult,
                                  childXComp:XFormModelComp,
                                  childXPaneDefRef:XPaneDefRef,
                                  childXPaneDef:XPaneDef,
                                  childXActiveColDefs:XGetActiveColumnDefsResult,
                                  childMenuDefs:Array<MenuDef>) {
            var settings = [];
            ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);

            var newPaneDef:PaneDef;




        }

        constructor(private _paneId:string,
                    private _name:string,
                    private _label:string,
                    private _title:string,
                    private _menuDefs:Array<MenuDef>,
                    private _entityRecDef:EntityRecDef,
                    private _dialogRedirection:DialogRedirection,
                    private _settings:StringDictionary){}

        get dialogHandle():DialogHandle {
            return this._dialogRedirection.dialogHandle;
        }

        get dialogRedirection():DialogRedirection {
            return this._dialogRedirection;
        }

        get label():string {
            return this._label;
        }

        get menuDefs():Array<MenuDef> {
            return this._menuDefs;
        }

        get name():string {
            return this._name;
        }

        get paneId():string {
            return this._paneId;
        }

        get settings():StringDictionary {
            return this._settings;
        }
    }

}
/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class MenuDef {
        constructor(private _name:string,
                    private _type:string,
                    private _actionId:string,
                    private _mode:string,
                    private _iconName:string,
                    private _directive:string,
                    private _menuDefs:Array<MenuDef>
        ){}

        get name():string {
            return this._name;
        }

        get type():string {
            return this._type;
        }
        get actionId():string {
            return this._actionId;
        }
        get mode():string {
            return this._mode;
        }
        get iconName():string {
            return this._iconName;
        }
        get directive():string {
            return this._directive;
        }
        get menuDefs():Array<MenuDef> {
            return this._menuDefs;
        }
    }

}

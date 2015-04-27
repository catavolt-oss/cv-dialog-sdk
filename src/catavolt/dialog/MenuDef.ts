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


        get actionId():string {
            return this._actionId;
        }

        get directive():string {
            return this._directive;
        }

        findAtId(actionId:string):MenuDef {
            if(this.actionId === actionId) return this;
            var result = null;
            this.menuDefs.some((md:MenuDef)=>{
                result = md.findAtId(actionId);
                return result != null;
            });
            return result;
        }

        get iconName():string {
            return this._iconName;
        }

        get isPresaveDirective():boolean {
            return this._directive && this._directive === 'PRESAVE';
        }

        get isRead():boolean {
            return this._mode && this._mode.indexOf('R') > -1;
        }

        get isSeparator():boolean {
            return this._type && this._type === 'separator';
        }

        get isWrite():boolean {
            return this._mode && this._mode.indexOf('W') > -1;
        }

        get menuDefs():Array<MenuDef> {
            return this._menuDefs;
        }

        get mode():string {
            return this._mode;
        }

        get name():string {
            return this._name;
        }

        get type():string {
            return this._type;
        }
    }

}

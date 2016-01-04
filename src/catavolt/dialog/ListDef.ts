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
            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        }

        get activeColumnDefs():Array<ColumnDef> {
            return this._activeColumnDefs;
        }

        get columnsStyle():string {
            return this._columnsStyle;
        }

        get defaultActionId():string {
            return this._defaultActionId;
        }

        get graphicalMarkup():string {
            return this._graphicalMarkup;
        }

        get initialColumns():number {
            return this._initialColumns;
        }

        get isDefaultStyle():boolean {
            return this.style && this.style === 'DEFAULT';
        }

        get isDetailsFormStyle():boolean {
            return this.style && this.style === 'DETAILS_FORM';
        }

        get isFormStyle():boolean {
            return this.style && this.style === 'FORM';
        }

        get isTabularStyle():boolean {
            return this.style && this.style === 'TABULAR';
        }

        get style():string {
            return this._style;
        }


    }
}
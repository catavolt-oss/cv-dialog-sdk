/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

/*
    @TODO

    Note! Use this as a test example!
    It has an Array of Array with subitems that also have Array of Array!!
*/
module catavolt.dialog {

    export class XDetailsDef extends XPaneDef{

        constructor(public paneId:string,
                    public name:string,
                    public title:string,
                    public cancelButtonText:string,
                    public commitButtonText:string,
                    public editable:boolean,
                    public focusPropertyName:string,
                    public overrideGML:string,
                    public rows:Array<Array<CellDef>>) {
            super();
        }

        get graphicalMarkup():string {
            return this.overrideGML;
        }

    }
}
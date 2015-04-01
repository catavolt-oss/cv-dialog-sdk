/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XListDef extends XPaneDef {

        constructor(public paneId:string,
                    public name:string,
                    public title:string,
                    public style:string,
                    public initialColumns:number,
                    public columnsStyle:string,
                    public overrideGML:string) {
            super();
        }

        get graphicalMarkup():string {
            return this.overrideGML;
        }

    }
}
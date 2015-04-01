/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XFormModel {

        constructor(public form:XFormModelComp,
                    public header:XFormModelComp,
                    public children:Array<XFormModelComp>,
                    public placement:string,
                    public refreshTimer:number,
                    public sizeToWindow:boolean){
        }

    }
}
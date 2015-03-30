/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XFormDef {

        constructor(public borderStyle:string,
                    public formLayout:string,
                    public formStyle:string,
                    public name:string,
                    public paneId:string,
                    public title:string,
                    public headerDefRef:XPaneDefRef,
                    public paneDefRefs:Array<XPaneDefRef>) {
        }
    }
}
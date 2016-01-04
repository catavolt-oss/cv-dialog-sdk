/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XImagePickerDef extends XPaneDef {

        constructor(public paneId:string,
                    public name:string,
                    public title:string,
                    public URLProperty:string,
                    public defaultActionId:string) {
            super();
        }

    }
}
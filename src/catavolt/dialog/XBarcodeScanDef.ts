/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XBarcodeScanDef extends XPaneDef{

        constructor(public paneId:string,
                    public name:string,
                    public title:string) {
            super();
        }

    }
}
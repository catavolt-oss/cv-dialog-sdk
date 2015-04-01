/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XGeoLocationDef extends XPaneDef{

        constructor(public paneId:string, public name:string, public title:string) {
            super();
        }

    }
}
/**
 * Created by rburson on 3/31/15.
 */

import {XPaneDef} from "./XPaneDef";

export class XBarcodeScanDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string) {
        super();
    }

}

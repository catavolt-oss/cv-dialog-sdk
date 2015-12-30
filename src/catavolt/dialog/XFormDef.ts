/**
 * Created by rburson on 3/30/15.
 */

import {XPaneDef} from "./XPaneDef";
import {XPaneDefRef} from "./XPaneDefRef";

export class XFormDef extends XPaneDef {

    constructor(public borderStyle:string,
                public formLayout:string,
                public formStyle:string,
                public name:string,
                public paneId:string,
                public title:string,
                public headerDefRef:XPaneDefRef,
                public paneDefRefs:Array<XPaneDefRef>) {
        super();
    }
}

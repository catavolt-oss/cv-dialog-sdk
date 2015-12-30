/**
 * Created by rburson on 3/31/15.
 */

import {XPaneDef} from "./XPaneDef";

export class XCalendarDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public descriptionProperty:string,
                public initialStyle:string,
                public startDateProperty:string,
                public startTimeProperty:string,
                public endDateProperty:string,
                public endTimeProperty:string,
                public occurDateProperty:string,
                public occurTimeProperty:string) {
        super();
    }

}

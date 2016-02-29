/**
 * Created by rburson on 5/4/15.
 */

import {QueryContext} from "./QueryContext";
import {CalendarDef} from "./CalendarDef";

export class CalendarContext extends QueryContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get calendarDef():CalendarDef {
            return <CalendarDef>this.paneDef;
        }

    }

/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class CalendarContext extends QueryContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get calendarDef():CalendarDef {
            return <CalendarDef>this.paneDef;
        }

    }
}
/**
 * Created by rburson on 4/22/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class CalendarDef extends PaneDef {

        constructor(paneId:string,
                    name:string,
                    label:string,
                    title:string,
                    menuDefs:Array<MenuDef>,
                    entityRecDef:EntityRecDef,
                    dialogRedirection:DialogRedirection,
                    settings:StringDictionary,
                    descriptionPropName:string,
                    initialStyle:string,
                    startDatePropName:string,
                    startTimePropName:string,
                    endDatePropName:string,
                    endTimePropName:string,
                    occurDatePropName:string,
                    occurTimePropName:string,
                    defaultActionId:string) {

            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

        }
    }
}
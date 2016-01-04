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
                    private _descriptionPropName:string,
                    private _initialStyle:string,
                    private _startDatePropName:string,
                    private _startTimePropName:string,
                    private _endDatePropName:string,
                    private _endTimePropName:string,
                    private _occurDatePropName:string,
                    private _occurTimePropName:string,
                    private _defaultActionId:string) {

            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

        }

        get descriptionPropName():string {
          return this._descriptionPropName;
        }

        get initialStyle():string {
           return this._initialStyle;
        }

        get startDatePropName():string {
            return this._startDatePropName;
        }

        get startTimePropName():string {
            return this._startTimePropName;
        }

        get endDatePropName():string {
            return this._endDatePropName;
        }

        get endTimePropName():string {
            return this._endTimePropName;
        }

        get occurDatePropName():string {
            return this._occurDatePropName;
        }

        get occurTimePropName():string {
            return this._occurTimePropName;
        }

        get defaultActionId():string {
           return this._defaultActionId;
        }
    }
}
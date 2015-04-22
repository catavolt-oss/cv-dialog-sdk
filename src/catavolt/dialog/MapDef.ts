/**
 * Created by rburson on 4/22/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class MapDef extends PaneDef {

        constructor(paneId:string,
                    name:string,
                    label:string,
                    title:string,
                    menuDefs:Array<MenuDef>,
                    entityRecDef:EntityRecDef,
                    dialogRedirection:DialogRedirection,
                    settings:StringDictionary,
                    private _descriptionPropName:string,
                    private _streetPropName:string,
                    private _cityPropName:string,
                    private _statePropName:string,
                    private _postalCodePropName:string,
                    private _latitudePropName:string,
                    private _longitudePropName:string) {

            super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

        }

    }
}
/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XMapDef extends XPaneDef {

        constructor(public paneId:string,
                    public name:string,
                    public title:string,
                    public descriptionProperty:string,
                    public streetProperty:string,
                    public cityProperty:string,
                    public stateProperty:string,
                    public postalCodeProperty:string,
                    public latitudeProperty:string,
                    public longitudeProperty:string) {
            super();
        }

    }
}
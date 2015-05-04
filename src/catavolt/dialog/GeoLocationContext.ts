/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class GeoLocationContext extends EditorContext{

    constructor(paneRef:number) {
        super(paneRef);
    }

    get geoLocationDef():GeoLocationDef {
        return <GeoLocationDef>this.paneDef;
    }

}
}
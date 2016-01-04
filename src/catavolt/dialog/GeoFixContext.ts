/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class GeoFixContext extends EditorContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get geoFixDef():GeoFixDef {
            return <GeoFixDef>this.paneDef;
        }

    }
}
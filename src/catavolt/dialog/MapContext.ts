/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class MapContext extends QueryContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get mapDef():MapDef {
           return <MapDef>this.paneDef;
        }

    }
}
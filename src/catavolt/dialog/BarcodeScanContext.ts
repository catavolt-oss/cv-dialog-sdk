/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class BarcodeScanContext extends EditorContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get barcodeScanDef():BarcodeScanDef {
            return <BarcodeScanDef>this.paneDef;
        }

    }
}
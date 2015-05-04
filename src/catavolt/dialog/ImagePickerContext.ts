/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class ImagePickerContext extends QueryContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get imagePickerDef():ImagePickerDef {
            return <ImagePickerDef>this.paneDef;
        }

    }
}
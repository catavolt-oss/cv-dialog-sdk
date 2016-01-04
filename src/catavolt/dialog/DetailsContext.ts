/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class DetailsContext extends EditorContext {

        constructor(paneRef:number) {
            super(paneRef);
        }

        get detailsDef():DetailsDef {
            return <DetailsDef>this.paneDef;
        }

        get printMarkupURL():string {
            return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
        }

    }
}